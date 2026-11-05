const CACHE='coffee-menu-archive404-higgs-17';
const ASSETS=['./','./index.html','./styles.css?v=archive404-higgs-17','./manifest.webmanifest','./assets/icon.svg?v=404-11','./assets/icon-404-192.png','./assets/icon-404-512.png','./assets/apple-touch-icon-404.png','./assets/coffee-placeholder.svg','./assets/frost-dial.png','./assets/stone-grain.svg','./assets/paper-texture.svg','./assets/charcoal-landscape.png','./assets/mountain-ivory.svg','./assets/mountain-charcoal.svg','./js/boot.js?v=archive404-higgs-17','./js/app.js?v=archive404-higgs-17','./js/presentation.js?v=archive404-shared-14','./js/domain.js?v=archive404-higgs-17','./js/storage.js?v=archive404-shared-14','./js/admin-auth.js?v=archive404-shared-14','./js/admin-hold.js?v=archive404-shared-14','./js/shared-storage.js?v=archive404-shared-14','./js/cloud-config.js?v=archive404-shared-14','./js/wheel-symbols.js?v=archive404-higgs-17','./assets/higgs-page.jpg','./assets/higgs-paper.jpg','./assets/higgs-charcoal.jpg','./assets/wheel-higgsfield.svg'];
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
