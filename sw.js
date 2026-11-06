const CACHE='coffee-menu-archive404-mystery-20';
// Brew art is fetched on demand, keeping install and menu startup lightweight.
const ASSETS=['./','./index.html','./styles.css?v=archive404-mystery-20','./manifest.webmanifest','./assets/icon.svg?v=404-11','./assets/icon-404-192.png','./assets/icon-404-512.png','./assets/apple-touch-icon-404.png','./assets/coffee-placeholder.svg','./assets/mountain-ivory.svg','./js/boot.js?v=archive404-mystery-20','./js/app.js?v=archive404-mystery-20','./js/bean-reveal.js?v=archive404-mystery-20','./js/brew-celebration.js?v=archive404-mystery-20','./js/presentation.js?v=archive404-mystery-20','./js/domain.js?v=archive404-higgs-17','./js/admin-auth.js?v=archive404-shared-14','./js/admin-hold.js?v=archive404-shared-14','./js/shared-storage.js?v=archive404-mystery-20','./js/cloud-config.js?v=archive404-shared-14','./js/wheel-symbols.js?v=archive404-higgs-17','./assets/higgs-page.jpg','./assets/higgs-paper.jpg','./assets/higgs-charcoal.jpg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('coffee-menu-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(request);
    // Versioned code and static assets are immutable within this release cache.
    if(request.mode!=='navigate'&&cached)return cached;
    try{
      const response=await fetch(request,{cache:'no-cache',...(request.mode==='navigate'?{signal:AbortSignal.timeout(2500)}:{})});
      if(response.ok)await cache.put(request,response.clone());
      return response;
    }catch{
      if(cached)return cached;
      if(request.mode==='navigate')return await cache.match('./index.html')||Response.error();
      // Never return HTML for a missing module, stylesheet, or image.
      return Response.error();
    }
  })());
});
