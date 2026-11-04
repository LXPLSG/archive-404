// Passwords and privileged keys never enter the static site's source or storage.
export function createHandler({base,service,anon,fetcher=fetch}){
  async function api(path,body,key=service,token=key,method='POST'){
    const response=await fetcher(base+path,{method,signal:AbortSignal.timeout(10000),headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'},...(method==='GET'?{}:{body:JSON.stringify(body)})});
    return {ok:response.ok,status:response.status,data:await response.json().catch(()=>({}))};
  }
  async function admin(token){
    const user=await api('/auth/v1/user',null,anon,token,'GET');
    if(!user.ok||!user.data.id)return false;
    const role=await api('/rest/v1/rpc/room404_is_admin',{},anon,token);
    return role.ok&&role.data===true;
  }
  return async req=>{
    const origin=req.headers.get('Origin')||'https://lxplsg.github.io';
    const allowed=origin==='https://lxplsg.github.io'||/^http:\/\/(localhost|127\.0\.0\.1):417[34]$/.test(origin);
    const cors={'Access-Control-Allow-Origin':origin,'Vary':'Origin','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Cache-Control':'private, no-store'};
    const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{...(allowed?cors:{}),'Content-Type':'application/json','Cache-Control':'private, no-store'}});
    if(!allowed)return reply(403,{error:'Origin is not allowed.'});
    if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
    if(req.method!=='POST')return reply(405,{error:'Use POST'});
    try{
      const raw=await req.text();if(raw.length>8192)return reply(413,{error:'Request too large'});
      let input;try{input=JSON.parse(raw);}catch{return reply(400,{error:'Invalid request'});}
      if(!input||typeof input!=='object')return reply(400,{error:'Invalid request'});
      if(input.action==='check'||input.action==='logout'){
        const token=(req.headers.get('Authorization')||'').replace(/^Bearer /,'');
        if(!token||!await admin(token))return reply(401,{error:'Please sign in again.'});
        if(input.action==='logout')await api('/auth/v1/logout?scope=local',{},anon,token);
        return reply(200,{authorized:input.action==='check'});
      }
      const username=String(input.username||'').trim().toLowerCase(),password=String(input.password||'');
      if(!/^[a-z][a-z0-9._-]{2,31}$/.test(username)||!password||password.length>128)return reply(400,{error:'Enter your username and password.'});
      const email=username+'@room404.invalid';
      if(input.action==='setup'){
        if(password.length<12)return reply(400,{error:'Choose a password with at least 12 characters.'});
        const setupToken=String(input.setupToken||'');
        const allowedSetup=await api('/rest/v1/rpc/room404_setup_allowed',{p_token:setupToken});
        if(!allowedSetup.ok||allowedSetup.data!==true)return reply(403,{error:'This setup link has expired or has already been used.'});
        const created=await api('/auth/v1/admin/users',{email,password,email_confirm:true,app_metadata:{room404_username:username}});
        let user=created.data;
        if(!created.ok){
          const retry=await api('/auth/v1/token?grant_type=password',{email,password},anon);
          if(!retry.ok)return reply(400,{error:'Could not create the account. Try a different username.'});
          user=retry.data.user;
        }
        const finished=await api('/rest/v1/rpc/room404_finish_setup',{p_token:setupToken,p_user_id:user.id});
        if(!finished.ok)return reply(403,{error:'Setup could not complete. Reopen your owner setup link and retry.'});
      }else if(input.action!=='login')return reply(400,{error:'Unknown action'});
      const signed=await api('/auth/v1/token?grant_type=password',{email,password},anon);
      if(!signed.ok)return reply(401,{error:'Username or password is incorrect.'});
      if(!await admin(signed.data.access_token))return reply(403,{error:'This account does not have admin access.'});
      return reply(200,{access_token:signed.data.access_token,expires_at:signed.data.expires_at});
    }catch{return reply(503,{error:'Sign-in is temporarily unavailable. Please retry online.'});}
  };
}
if(typeof Deno!=='undefined')Deno.serve(createHandler({base:Deno.env.get('SUPABASE_URL'),service:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),anon:Deno.env.get('SUPABASE_ANON_KEY')}));
