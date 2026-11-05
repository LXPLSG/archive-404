import {brewOne,undoEvent,validateBackup,addBackupRecords} from './domain.js';

export function validateInventory(input){
 const s=validateBackup(input),ids=new Set(),bids=new Set(),events=new Set();
 if(s.profiles.length>2000||s.batches.length>10000||s.history.length>50000)throw Error('Collection is too large');
 for(const p of s.profiles){if(typeof p.id!=='string'||!p.id||ids.has(p.id)||typeof p.name!=='string'||!p.name.trim())throw Error('Invalid or duplicate coffee');ids.add(p.id);delete p.favourite;}
 if(s.profiles.filter(p=>p.onShelf&&!p.archived).length>2)throw Error('Only two coffees fit on the shelf');
 for(const b of s.batches){if(!ids.has(b.profileId)||typeof b.id!=='string'||bids.has(b.id)||!Number.isSafeInteger(b.remainingServings)||!Number.isSafeInteger(b.initialServings)||b.remainingServings<0||b.initialServings<b.remainingServings)throw Error('Invalid stock batch');bids.add(b.id);}
 for(const e of s.history){if(typeof e.id!=='string'||events.has(e.id)||!ids.has(e.profileId)||!bids.has(e.batchId)||!['brew','adjustment','undo'].includes(e.type)||!Number.isSafeInteger(e.delta))throw Error('Invalid consumption history');events.add(e.id);}
 return {schemaVersion:1,profiles:s.profiles,batches:s.batches,history:s.history};
}
export function publicState(s){
 // Explicit allowlist: private prices and future admin-only fields never leak.
 const fields=['id','name','roaster','origin','country','region','producer','variety','process','roastLevel','roastMethod','notes','image','brew','onShelf','archived'];
 const profiles=s.profiles.filter(p=>!p.archived).map(p=>({...Object.fromEntries(fields.filter(k=>k in p).map(k=>[k,p[k]])),recordedBrews:s.history.filter(e=>e.profileId===p.id&&e.type==='brew'&&!e.undone).length}));
 const ids=new Set(profiles.map(p=>p.id));
 return {schemaVersion:1,profiles,batches:s.batches.filter(b=>ids.has(b.profileId)&&!b.archived).map(b=>Object.fromEntries(['id','profileId','purchaseDate','roastDate','initialServings','remainingServings','archived'].filter(k=>k in b).map(k=>[k,b[k]]))),history:[]};
}
export function createInventoryHandler({base,service,anon,fetcher=fetch}){
 async function api(path,body,key=service,token=key,method='POST'){
   const r=await fetcher(base+path,{method,signal:AbortSignal.timeout(12000),headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'},...(method==='GET'?{}:{body:JSON.stringify(body)})});
   const data=await r.json();if(!r.ok)throw Error('Database request failed');return data;
 }
 const rpc=(name,body={})=>api('/rest/v1/rpc/'+name,body);
 async function isAdmin(token){if(!token||token===anon)return false;try{const u=await api('/auth/v1/user',null,anon,token,'GET');return !!u.id&&(await api('/rest/v1/rpc/room404_is_admin',{},anon,token))===true;}catch{return false;}}
 return async req=>{
   const origin=req.headers.get('Origin')||'https://lxplsg.github.io',allowed=origin==='https://lxplsg.github.io'||/^http:\/\/(localhost|127\.0\.0\.1):417[34]$/.test(origin);
   const headers={'Content-Type':'application/json','Cache-Control':'private, no-store','Vary':'Origin',...(allowed?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS'}:{})};
   const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
   if(!allowed)return reply(403,{error:'Origin is not allowed'});
   if(req.method==='OPTIONS')return reply(200,{});if(req.method!=='POST')return reply(405,{error:'Use POST'});
   try{
     const raw=await req.text();if(raw.length>4000000)return reply(413,{error:'Backup is too large'});
     const input=JSON.parse(raw),token=(req.headers.get('Authorization')||'').replace(/^Bearer /,''),admin=await isAdmin(token);
     // The platform validates visitor/user JWTs. Non-admin tokens receive only
     // the public projection; management still requires verified membership.
     if(!['read','save','import','brew','undo'].includes(input.action))return reply(400,{error:'Unknown action'});
     if(['save','import'].includes(input.action)&&!admin)return reply(403,{error:'Admin access required'});
     if(input.action==='import'&&!['add','replace'].includes(input.mode))return reply(400,{error:'Choose Add records or Replace all records'});
     const envelope=async extra=>{const row=await rpc('archive404_inventory_read');return {...row,state:admin?row.state:publicState(row.state),admin,...extra};};
     if(input.action==='read')return reply(200,await envelope());
     if(!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(input.requestId||''))return reply(400,{error:'Request ID required'});
     const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(input))))).map(b=>b.toString(16).padStart(2,'0')).join('');
     let previous=await rpc('archive404_inventory_request',{p_id:input.requestId});
     if(previous){if(previous.fingerprint!==fingerprint)return reply(409,{error:'Request ID already used'});return reply(200,await envelope({result:previous.result}));}
     let imported;if(['save','import'].includes(input.action)){try{imported=validateInventory(input.state);}catch(e){return reply(400,{error:e.message});}}
     for(let attempt=0;attempt<8;attempt++){
       const row=await rpc('archive404_inventory_read');let next,result={};
       if(['save','import'].includes(input.action)){
         if(input.revision!==row.revision)return reply(409,{error:'Inventory changed in another session. Reload and try again.'});
         next=imported;result={action:input.action};
         if(input.action==='import'&&input.mode==='add'){const merged=addBackupRecords(row.state,imported);next=validateInventory(merged.state);result.summary=merged.summary;}
       }else if(input.action==='brew'){
         if(!row.initialized)return reply(409,{error:'The admin has not published inventory yet'});
         const brewed=brewOne(row.state,input.profileId);if(!brewed.changed)return reply(409,{error:'No servings available. The menu has changed.'});
         next=brewed.state;result={eventId:next.history[0].id,action:'brew'};
       }else{
         let eventId=input.eventId;
         if(!admin){if(!input.brewRequestId)return reply(403,{error:'Only your own brew can be undone'});const own=await rpc('archive404_inventory_request',{p_id:input.brewRequestId});if(!own||own.result.action!=='brew')return reply(403,{error:'Only your own brew can be undone'});eventId=own.result.eventId;}
         const event=row.state.history.find(e=>e.id===eventId);if(!event||event.type==='undo'||event.undone)return reply(409,{error:'This change has already been undone or is unavailable'});
         const batch=row.state.batches.find(b=>b.id===event.batchId);if(!batch||batch.remainingServings-event.delta<0)return reply(409,{error:'Later consumption prevents undo. Ask the admin to adjust stock.'});
         const undone=undoEvent(row.state,eventId);if(!undone.changed)return reply(409,{error:'Change cannot be undone'});next=undone.state;result={action:'undo',restoredToStock:!!undone.restoredToStock};
       }
       const committed=await rpc('archive404_inventory_commit',{p_id:input.requestId,p_fingerprint:fingerprint,p_revision:row.revision,p_state:next,p_result:result});
       if(committed!==null)return reply(200,await envelope({result:committed}));
     }
     return reply(409,{error:'Inventory is busy. Try again.'});
   }catch{return reply(503,{error:'Shared inventory is unavailable. Check your connection and retry.'});}
 };
}
if(typeof Deno!=='undefined')Deno.serve(createInventoryHandler({base:Deno.env.get('SUPABASE_URL'),service:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),anon:Deno.env.get('SUPABASE_ANON_KEY')}));
