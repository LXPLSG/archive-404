const source=new URL('../assets/bean-reveal-frames.webp',import.meta.url).href;
export const BEAN_REVEAL_MS=3600;
let artwork;

export function preloadBeanReveal(){
  if(!artwork)artwork=new Promise(resolve=>{
    const image=new Image();
    image.onload=()=>resolve(image);
    image.onerror=()=>{artwork=null;resolve(null);};
    image.src=source;
  });
  return artwork;
}

export function beanFrameAt(elapsed){
  const position=Math.max(0,elapsed-200)/200;
  const index=Math.min(15,Math.floor(position)),t=position-Math.floor(position);
  return {index,next:Math.min(15,index+1),mix:index===15?0:t*t*(3-2*t)};
}

// Pure presentation. Cancellation must never reveal an old choice in a new draw.
export function playBeanReveal(stage,{signal}={}){
  if(signal?.aborted||matchMedia('(prefers-reduced-motion: reduce)').matches)return Promise.resolve(false);
  return new Promise(resolve=>{
    let stopped=false,frame,timer,canvas;
    const finish=played=>{
      if(stopped)return;stopped=true;
      clearTimeout(timer);cancelAnimationFrame(frame);
      signal?.removeEventListener('abort',abort);
      canvas?.remove();stage.classList.remove('is-revealing');resolve(played);
    };
    const abort=()=>finish(false);
    signal?.addEventListener('abort',abort,{once:true});
    // Offline or failed art loading still permits the selected coffee to appear.
    timer=setTimeout(()=>finish(false),4000);
    preloadBeanReveal().then(sheet=>{
      if(stopped)return;
      if(!sheet||!stage.isConnected)return finish(false);
      clearTimeout(timer);
      canvas=document.createElement('canvas');canvas.width=384;canvas.height=384;
      canvas.className='mystery-bean';canvas.setAttribute('aria-hidden','true');
      const ctx=canvas.getContext('2d');if(!ctx)return finish(false);
      stage.append(canvas);stage.classList.add('is-revealing');
      const start=performance.now();
      const draw=time=>{
        if(!stage.isConnected||signal?.aborted)return finish(false);
        const elapsed=time-start;if(elapsed>=BEAN_REVEAL_MS)return finish(true);
        const {index,next,mix}=beanFrameAt(elapsed);
        ctx.clearRect(0,0,384,384);
        ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1-mix;
        ctx.drawImage(sheet,index%4*256,Math.floor(index/4)*256,256,256,0,0,384,384);
        ctx.globalCompositeOperation='lighter';ctx.globalAlpha=mix;
        ctx.drawImage(sheet,next%4*256,Math.floor(next/4)*256,256,256,0,0,384,384);
        ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
        frame=requestAnimationFrame(draw);
      };
      frame=requestAnimationFrame(draw);
    });
  });
}
