import {INVENTORY_URL,PUBLIC_KEY,VISITOR_TOKEN} from './cloud-config.js?v=archive404-shared-14';
const LEGACY='coffee-menu-pwa:v1',CACHE='archive404:shared-public:v1',FAVOURITES='archive404:favourites:v1';
export const emptyInventory=()=>({schemaVersion:1,profiles:[],batches:[],history:[]});
const publicFields=['id','name','roaster','origin','country','region','producer','variety','process','roastLevel','roastMethod','notes','image','brew','onShelf','archived','recordedBrews'];
export function stripPrivate(s){const profiles=s.profiles.filter(p=>!p.archived).map(p=>Object.fromEntries(publicFields.filter(k=>k in p).map(k=>[k,p[k]]))),ids=new Set(profiles.map(p=>p.id));return {schemaVersion:1,profiles,batches:s.batches.filter(b=>ids.has(b.profileId)&&!b.archived),history:[]};}
export class SharedInventoryRepository{
 constructor({storage=globalThis.localStorage,fetcher=(...args)=>fetch(...args),uuid=()=>crypto.randomUUID()}={}){
   this.storage=storage;this.fetcher=fetcher;this.uuid=uuid;this.revision=0;this.initialized=false;this.online=false;this.auth=null;this.pending=new Map();this.ownBrews=new Map();
   if(storage.getItem(FAVOURITES)===null){let old;try{old=JSON.parse(storage.getItem(LEGACY));}catch{}storage.setItem(FAVOURITES,JSON.stringify(old?.profiles?.filter(p=>p.favourite).map(p=>p.id)||[]));}
 }
 setAuth(auth){this.auth=auth;}
 localBackup(){try{return JSON.parse(this.storage.getItem(LEGACY))||null;}catch{return null;}}
 withFavourites(state){let saved;try{saved=JSON.parse(this.storage.getItem(FAVOURITES)||'[]');}catch{}const ids=new Set(Array.isArray(saved)?saved:[]);return {...state,profiles:state.profiles.map(p=>({...p,favourite:ids.has(p.id)}))};}
 saveFavourites(state){this.storage.setItem(FAVOURITES,JSON.stringify(state.profiles.filter(p=>p.favourite).map(p=>p.id)));}
 // Startup can paint the last public menu without waiting for a network round trip.
 cached(){
   try{
     const cached=JSON.parse(this.storage.getItem(CACHE));
     if(!Array.isArray(cached?.state?.profiles)||!Array.isArray(cached?.state?.batches))return null;
     this.revision=Math.max(this.revision,Number(cached.revision)||0);this.initialized=cached.initialized;
     return this.withFavourites(stripPrivate(cached.state));
   }catch{return null;}
 }
 async request(input){
   let r;try{r=await this.fetcher(INVENTORY_URL,{method:'POST',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(input.action==='read'?8000:20000),headers:{'Content-Type':'application/json',apikey:PUBLIC_KEY,Authorization:'Bearer '+(this.auth?.accessToken||VISITOR_TOKEN)},body:JSON.stringify(input)});}catch{this.online=false;throw Error('Connect to the internet to update shared inventory. Retry to check whether the change completed.');}
   const data=await r.json();if(!r.ok){const e=Error(data.error||'Shared inventory is unavailable');e.status=r.status;throw e;}
   this.online=true;
   // A slower read must not replace a newer mutation's revision or offline snapshot.
   if(data.revision>=this.revision){
     this.revision=data.revision;this.initialized=data.initialized;
     try{this.storage.setItem(CACHE,JSON.stringify({...data,state:stripPrivate(data.state),admin:false}));}catch{/* The server commit remains successful if browser storage is full. */}
   }
   return data;
 }
 async load({requireOnline=false}={}){
   try{return this.withFavourites((await this.request({action:'read'})).state);}catch(e){if(requireOnline)throw e;this.online=false;return this.cached()||this.withFavourites(emptyInventory());}
 }
 async mutation(key,input){
   const signature=JSON.stringify(input);let pending=this.pending.get(key);
   if(!pending||pending.signature!==signature){pending={signature,body:{...input,requestId:this.uuid()}};this.pending.set(key,pending);}
   try{const data=await this.request(pending.body);if(input.action==='brew'&&data.result?.eventId)this.ownBrews.set(data.result.eventId,pending.body.requestId);this.pending.delete(key);return data;}catch(e){if(e.status&&e.status<500)this.pending.delete(key);throw e;}
 }
 async save(state){
   if(!this.auth?.accessToken)throw Error('Admin sign-in required to change shared inventory');
   const shared=structuredClone(state);shared.profiles.forEach(p=>delete p.favourite);
   const result=await this.mutation('save',{action:'save',revision:this.revision,state:shared});return this.withFavourites(result.state);
 }
 async importBackup(state,mode){
   if(!this.auth?.accessToken)throw Error('Admin sign-in required to import shared inventory');
   const result=await this.mutation('import',{action:'import',mode,revision:this.revision,state});
   this.lastImportSummary=result.result?.summary||null;
   return this.withFavourites(result.state);
 }
 async brew(profileId){
   const data=await this.mutation('brew:'+profileId,{action:'brew',profileId});
   // The request UUID is a private undo capability; it is never in public menu data.
   const next=this.withFavourites(data.state);if(!next.history.length&&data.result?.eventId)next.history=[{id:data.result.eventId,type:'brew',profileId}];return next;
 }
 async undo(eventId){const data=await this.mutation('undo:'+eventId,{action:'undo',eventId,...(this.ownBrews.has(eventId)?{brewRequestId:this.ownBrews.get(eventId)}:{})});return this.withFavourites(data.state);}
}
export const createRepository=()=>new SharedInventoryRepository();
