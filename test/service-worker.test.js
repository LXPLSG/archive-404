import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

async function harness(offline=false){
  const handlers={},entries=new Map(),deleted=[];
  const cache={match:async key=>entries.get(typeof key==='string'?key:key.url),put:async(request,response)=>entries.set(request.url,response),addAll:async()=>{}};
  const source=await readFile(new URL('../sw.js',import.meta.url),'utf8');
  const currentCache=source.match(/const CACHE='([^']+)'/)[1];
  const context={self:{location:{origin:'https://coffee.test'},addEventListener:(name,fn)=>handlers[name]=fn,clients:{claim:async()=>{}},skipWaiting:async()=>{}},caches:{open:async()=>cache,keys:async()=>['unrelated-app','coffee-menu-old',currentCache],delete:async key=>deleted.push(key)},URL,Response,fetch:async()=>{if(offline)throw new Error('Offline');return new Response('new release');}};
  vm.runInNewContext(source,context);
  const request=async(path,mode='cors')=>{let response;handlers.fetch({request:{method:'GET',url:`https://coffee.test/${path}`,mode},respondWith:value=>response=value});return await response;};
  return {handlers,entries,deleted,request};
}
test('online requests replace stale cached files with current release',async()=>{const h=await harness();h.entries.set('https://coffee.test/js/app.js',new Response('old release'));assert.equal(await (await h.request('js/app.js')).text(),'new release');assert.equal(await h.entries.get('https://coffee.test/js/app.js').text(),'new release');});
test('offline navigation falls back to HTML; missing modules never receive HTML',async()=>{const h=await harness(true);h.entries.set('./index.html',new Response('<main>Menu</main>'));assert.equal(await (await h.request('','navigate')).text(),'<main>Menu</main>');assert.equal((await h.request('missing.js')).type,'error');h.entries.set('https://coffee.test/js/domain.js',new Response('cached module'));assert.equal(await(await h.request('js/domain.js')).text(),'cached module');});
test('activation removes only old Coffee Menu caches',async()=>{const h=await harness();let done;h.handlers.activate({waitUntil:value=>done=value});await done;assert.deepEqual(h.deleted,['coffee-menu-old']);});
