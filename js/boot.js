// Update checking is independent of application imports and inventory loading.
if('serviceWorker' in navigator && location.protocol!=='file:'){
  navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'})
    .then(registration=>registration.update()).catch(console.warn);
}
import('./app.js?v=archive404-details-12').catch(error=>{
  console.error('Archive 404 startup failed:',error);
  const app=document.querySelector('#app');
  app.replaceChildren();
  const panel=document.createElement('section'); panel.className='empty';
  const title=document.createElement('h1');title.textContent='Archive 404 couldn’t load';title.style.fontSize='32px';
  const message=document.createElement('p');
  message.textContent=location.protocol==='file:'?'Open this app through the local preview server or an HTTPS website. Opening index.html directly cannot load the app.':'A file update or storage error interrupted startup. Your saved inventory has not been cleared. Connect to the internet and retry.';
  const retry=document.createElement('button');retry.className='primary';retry.textContent='Retry loading';
  retry.onclick=()=>{const url=new URL(location.href);url.searchParams.set('reload',Date.now());location.replace(url.href);};
  const details=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('p');
  summary.textContent='Error details';text.textContent=error.message;details.append(summary,text);
  panel.append(title,message,retry,details);app.append(panel);
});
