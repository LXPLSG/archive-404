import test from 'node:test';
import assert from 'node:assert/strict';
import {AdminAuth,ADMIN_HOLD_MS,adminRoute} from '../js/admin-auth.js';
import {createHandler} from '../supabase/functions/archive404-auth/index.js';
const response=(data,status=200)=>new Response(JSON.stringify(data),{status});
test('hidden hold is seven seconds',()=>assert.equal(ADMIN_HOLD_MS,7000));
test('setup URL continues to resolve to setup after a reload; normal admin and menu routes remain intact',()=>{
  const token='a'.repeat(64),hash='#setup='+token;
  assert.deepEqual(adminRoute(hash),{view:'admin',setupToken:token});
  assert.deepEqual(adminRoute(hash),adminRoute(hash));
  assert.deepEqual(adminRoute('#admin'),{view:'admin',setupToken:''});
  assert.deepEqual(adminRoute(''),{view:'menu',setupToken:''});
  assert.equal(adminRoute('#setup=invalid').setupToken,'');
});
test('admin session requires a valid login and expires after 15 idle minutes',async()=>{
  let time=1000;const calls=[];
  const auth=new AdminAuth(async(url,options)=>{const action=JSON.parse(options.body).action;calls.push({action,headers:options.headers});return response(action==='login'?{access_token:'test-only',expires_at:4000}:{authorized:true});},()=>time);
  assert.equal(await auth.check(),false);assert.equal(calls.length,0);
  await auth.login('owner','test-only-password');assert.equal(auth.active(),true);assert.equal(await auth.check(),true);
  assert.equal(calls.at(-1).headers.Authorization,'Bearer test-only');
  time+=15*60*1000;assert.equal(auth.active(),false);assert.equal(await auth.check(),false);
});
test('failed server checks and offline access clear the session; logout clears locally even offline',async()=>{
  let offline=false;const auth=new AdminAuth(async()=>{if(offline)throw Error('Offline');return response({access_token:'test-only',expires_at:4000});},()=>1000);
  await auth.login('owner','test-only-password');offline=true;assert.equal(await auth.check(),false);assert.equal(auth.active(),false);
  offline=false;await auth.login('owner','test-only-password');offline=true;await auth.logout();assert.equal(auth.active(),false);
});
test('invalid successful login response cannot unlock the portal',async()=>{
  const auth=new AdminAuth(async()=>response({authorized:true}),()=>1000);
  await assert.rejects(auth.login('owner','test-only-password'),/invalid session/);assert.equal(auth.active(),false);
});
test('a late server response cannot reauthorize an action after sign-out',async()=>{
  let finish;
  const auth=new AdminAuth(async(url,options)=>{const {action}=JSON.parse(options.body);if(action==='check')return new Promise(resolve=>{finish=resolve;});return response({access_token:'test-only',expires_at:4000});},()=>1000);
  await auth.login('owner','test-only-password');const pending=auth.check();await auth.logout();finish(response({authorized:true}));assert.equal(await pending,false);assert.equal(auth.active(),false);
});
function server(overrides={}){
  const calls=[];
  const defaults={
    '/auth/v1/token?grant_type=password':{access_token:'test-jwt',expires_at:4000,user:{id:'owner-id'}},
    '/auth/v1/user':{id:'owner-id'},
    '/rest/v1/rpc/room404_is_admin':true,
    '/rest/v1/rpc/room404_setup_allowed':true,
    '/auth/v1/admin/users':{id:'owner-id'},
    '/rest/v1/rpc/room404_finish_setup':null
  };
  const handler=createHandler({base:'https://test.invalid',service:'server-secret-test-only',anon:'public-test-only',fetcher:async(url,options)=>{const path=new URL(url).pathname+new URL(url).search;calls.push({path,options});const value=Object.hasOwn(overrides,path)?overrides[path]:defaults[path];return value instanceof Response?value:response(value);}});
  const request=(data,token)=>handler(new Request('https://edge.invalid',{method:'POST',headers:{Origin:'https://lxplsg.github.io','Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(data)}));
  return {request,calls,handler};
}
test('backend validates password plus authenticated user and explicit admin membership',async()=>{
  const s=server();const r=await s.request({action:'login',username:'owner',password:'test-only-password'});assert.equal(r.status,200);
  assert.deepEqual(await r.json(),{access_token:'test-jwt',expires_at:4000});assert.equal(r.headers.get('Cache-Control'),'private, no-store');
  assert.ok(s.calls.some(c=>c.path==='/auth/v1/user'));assert.ok(s.calls.some(c=>c.path==='/rest/v1/rpc/room404_is_admin'));
  const denied=server({'/rest/v1/rpc/room404_is_admin':false});assert.equal((await denied.request({action:'login',username:'owner',password:'test-only-password'})).status,403);
  const wrong=server({'/auth/v1/token?grant_type=password':response({},400)});assert.equal((await wrong.request({action:'login',username:'owner',password:'wrong'})).status,401);
});
test('first visitor cannot claim admin without a valid owner setup capability',async()=>{
  const s=server({'/rest/v1/rpc/room404_setup_allowed':false});
  assert.equal((await s.request({action:'setup',username:'owner',password:'test-only-password',setupToken:'invalid'})).status,403);
  assert.equal(s.calls.some(c=>c.path==='/auth/v1/admin/users'),false);
});
test('setup checks capability before creating user and completes server-side admin enrollment',async()=>{
  const s=server();assert.equal((await s.request({action:'setup',username:'owner',password:'test-only-password',setupToken:'test-capability'})).status,200);
  assert.ok(s.calls.findIndex(c=>c.path.endsWith('room404_setup_allowed'))<s.calls.findIndex(c=>c.path==='/auth/v1/admin/users'));
  assert.ok(s.calls.some(c=>c.path.endsWith('room404_finish_setup')));
});
test('session check rejects absent, invalid and non-admin tokens',async()=>{
  assert.equal((await server().request({action:'check'})).status,401);
  assert.equal((await server({'/auth/v1/user':response({},401)}).request({action:'check'},'invalid')).status,401);
  assert.equal((await server({'/rest/v1/rpc/room404_is_admin':false}).request({action:'check'},'not-admin')).status,401);
  assert.equal((await server().request({action:'check'},'test-jwt')).status,200);
});
test('backend refuses unexpected origins before contacting auth',async()=>{
  const s=server();const r=await s.handler(new Request('https://edge.invalid',{method:'POST',headers:{Origin:'https://untrusted.invalid'},body:'{}'}));assert.equal(r.status,403);assert.equal(s.calls.length,0);
});
test('setup readiness checks never create a user or consume the owner capability',async()=>{
  const s=server();const result=await s.request({action:'setup-check',setupToken:'a'.repeat(64)});assert.deepEqual(await result.json(),{valid:true});
  assert.deepEqual(s.calls.map(c=>c.path),['/rest/v1/rpc/room404_setup_allowed']);
  assert.deepEqual(await (await server({'/rest/v1/rpc/room404_setup_allowed':false}).request({action:'setup-check',setupToken:'a'.repeat(64)})).json(),{valid:false});
});
test('auth accepts a password-grant response that supplies expires_in without expires_at',async()=>{
  const before=Math.floor(Date.now()/1000);const s=server({'/auth/v1/token?grant_type=password':{access_token:'test-jwt',expires_in:3600}});
  const data=await (await s.request({action:'login',username:'owner',password:'test-only-password'})).json();assert.ok(data.expires_at>=before+3600&&data.expires_at<=Math.floor(Date.now()/1000)+3600);
});
