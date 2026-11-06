const animationURL=new URL('../assets/brew-glass-frames.webp',import.meta.url).href;
const stillURL=new URL('../assets/brew-glass-final.png',import.meta.url).href;
export const BREW_ANIMATION_MS=5600;
let art;
export function preloadBrewArt(){
  if(!art)art=new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{art=null;resolve(null);};img.src=animationURL;});
  return art;
}

export function brewFrameAt(elapsed){
  let time=Math.max(0,elapsed);
  if(time<100)return {index:0,next:1,mix:0};
  time-=100;
  for(let index=0;index<15;index++){
    const duration=[6,7,12].includes(index)?400:300;
    if(time<duration){const t=time/duration;return {index,next:index+1,mix:t*t*(3-2*t)};}
    time-=duration;
  }
  return {index:15,next:15,mix:0};
}

// Presentation only: inventory is committed by the repository before this opens.
export async function showBrewCelebration({name,remaining,archived=false}){
  const panel=document.createElement('dialog');
  panel.className='brew-celebration';
  panel.setAttribute('aria-labelledby','brew-title');
  panel.innerHTML='<button class="dialog-close" aria-label="Close brew confirmation">×</button><div class="eyebrow">Archive 404</div><h2 id="brew-title">A moment for your cup.</h2><p class="brew-coffee-name"></p><div class="brew-art"><canvas width="384" height="384" aria-hidden="true"></canvas><img alt="" width="512" height="512" hidden></div><p class="brew-status" role="status">Brew recorded · enjoy the ritual.</p><div class="brew-completion-actions" hidden><button class="primary" data-done>Back to menu</button><button class="text-button" data-undo-brew>Undo brew</button></div><button class="text-button brew-skip">Skip animation</button>';
  panel.querySelector('.brew-coffee-name').textContent=name;
  const img=panel.querySelector('img'),canvas=panel.querySelector('canvas');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.append(panel);
  return new Promise(resolve=>{
    let timer,raf,finished=false,settled=false;
    const finish=()=>{
      if(finished||settled)return;finished=true;
      clearTimeout(timer);cancelAnimationFrame(raf);canvas.hidden=true;img.hidden=false;
      panel.querySelector('h2').textContent='Enjoy your cup.';
      img.src=stillURL;
      panel.querySelector('.brew-status').textContent=archived?'Last serving recorded · coffee archived.':`1 serving recorded · ${remaining} ${remaining===1?'serving':'servings'} remaining.`;
      panel.querySelector('.brew-completion-actions').hidden=false;
      const skip=panel.querySelector('.brew-skip'),moveFocus=document.activeElement===skip;
      skip.hidden=true;if(moveFocus)panel.querySelector('[data-done]').focus();
    };
    const close=undo=>{if(settled)return;settled=true;clearTimeout(timer);cancelAnimationFrame(raf);panel.close();panel.remove();resolve(undo);};
    panel.querySelector('.dialog-close').onclick=()=>close(false);
    panel.querySelector('[data-done]').onclick=()=>close(false);
    panel.querySelector('[data-undo-brew]').onclick=()=>close(true);
    panel.querySelector('.brew-skip').onclick=finish;
    panel.addEventListener('cancel',event=>{event.preventDefault();close(false);});
    panel.showModal();
    if(reduced){finish();return;}
    // A missing asset must never trap a recorded brew behind an empty panel.
    timer=setTimeout(finish,4000);
    preloadBrewArt().then(sheet=>{
      if(finished||settled)return;if(!sheet)return finish();
      clearTimeout(timer);const ctx=canvas.getContext('2d');if(!ctx)return finish();
      const start=performance.now();
      const draw=time=>{
        if(settled||finished)return;
        const elapsed=time-start;if(elapsed>=BREW_ANIMATION_MS)return finish();
        const {index,next,mix}=brewFrameAt(elapsed);
        ctx.clearRect(0,0,384,384);
        ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1-mix;
        ctx.drawImage(sheet,index%4*256,Math.floor(index/4)*256,256,256,0,0,384,384);
        ctx.globalCompositeOperation='lighter';ctx.globalAlpha=mix;
        ctx.drawImage(sheet,next%4*256,Math.floor(next/4)*256,256,256,0,0,384,384);
        ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(draw);
      };
      raf=requestAnimationFrame(draw);
    });
  });
}
