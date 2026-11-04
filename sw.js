const CACHE='coffee-menu-archive404-focus-8';
const ASSETS=['./','./index.html','./styles.css?v=archive404-focus-8','./manifest.webmanifest','./assets/icon.svg','./assets/coffee-placeholder.svg','./assets/frost-dial.png','./assets/stone-grain.svg','./assets/mountain-ivory.svg','./assets/mountain-charcoal.svg','./js/boot.js?v=archive404-touch-7','./js/app.js?v=archive404-touch-7','./js/presentation.js?v=archive404-touch-7','./js/domain.js?v=archive404-touch-7','./js/storage.js?v=archive404-touch-7','./js/admin-auth.js?v=archive404-touch-7','./js/admin-hold.js?v=archive404-touch-7'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('coffee-menu-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(request,{cache:'no-cache'});
      if(response.ok)await cache.put(request,response.clone());
      return response;
    }catch{
      const cached=await cache.match(request);
      if(cached)return cached;
      if(request.mode==='navigate')return await cache.match('./index.html')||Response.error();
      // Never return HTML for a missing module, stylesheet, or image.
      return Response.error();
    }
  })());
});
