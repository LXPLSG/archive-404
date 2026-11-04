// Touch uses non-passive events to prevent native link previews interrupting a hold.
// Mouse/pen use pointer capture, so slight drift across the title does not cancel it.
export function installAdminHold(element,activate,options={}){
  const root=element.ownerDocument,view=root.defaultView;
  const delay=options.delay??7000,tolerance=options.tolerance??28;
  const later=options.setTimeout??((fn,ms)=>globalThis.setTimeout(fn,ms));
  const clear=options.clearTimeout??(id=>globalThis.clearTimeout(id));
  const now=options.now??(()=>Date.now());
  let press=null,timer=null,blockClickUntil=0,ignoreMouseUntil=0;
  function cancel(){if(timer!==null)clear(timer);timer=null;press=null;if(blockClickUntil===Infinity)blockClickUntil=now()+1000;}
  function begin(kind,id,x,y){
    cancel();blockClickUntil=0;
    const current=press={kind,id,x,y,fired:false};
    timer=later(()=>{if(press!==current)return;timer=null;current.fired=true;blockClickUntil=Infinity;activate();},delay);
  }
  function move(x,y){if(press&&Math.hypot(x-press.x,y-press.y)>tolerance)cancel();}
  element.addEventListener('touchstart',e=>{
    if(e.touches.length!==1){cancel();return;}
    if(e.cancelable)e.preventDefault();
    ignoreMouseUntil=now()+delay+1000;
    const t=e.touches[0];begin('touch',t.identifier,t.clientX,t.clientY);
  },{passive:false});
  root.addEventListener('touchmove',e=>{
    if(press?.kind!=='touch')return;
    const t=[...e.touches].find(t=>t.identifier===press.id);
    if(!t||e.touches.length!==1){cancel();return;}
    if(e.cancelable)e.preventDefault();move(t.clientX,t.clientY);
  },{passive:false});
  root.addEventListener('touchend',e=>{
    if(press?.kind!=='touch')return;
    if(![...e.changedTouches].some(t=>t.identifier===press.id))return;
    if(e.cancelable)e.preventDefault();
    const fired=press.fired;cancel();
    if(!fired){blockClickUntil=0;element.click();}
    blockClickUntil=now()+1000;ignoreMouseUntil=now()+1000;
  },{passive:false});
  root.addEventListener('touchcancel',()=>{cancel();blockClickUntil=now()+1000;});
  element.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'||now()<ignoreMouseUntil||e.button!==0||e.isPrimary===false)return;
    begin('pointer',e.pointerId,e.clientX,e.clientY);
    try{element.setPointerCapture(e.pointerId);}catch{}
  });
  root.addEventListener('pointermove',e=>{if(press?.kind==='pointer'&&press.id===e.pointerId)move(e.clientX,e.clientY);});
  root.addEventListener('pointerup',e=>{
    if(press?.kind!=='pointer'||press.id!==e.pointerId)return;
    const fired=press.fired;cancel();if(fired)blockClickUntil=now()+1000;
    try{element.releasePointerCapture(e.pointerId);}catch{}
  });
  root.addEventListener('pointercancel',e=>{if(press?.kind==='pointer'&&press.id===e.pointerId){cancel();blockClickUntil=now()+1000;}});
  element.addEventListener('click',e=>{if(now()<blockClickUntil)e.preventDefault();});
  element.addEventListener('contextmenu',e=>e.preventDefault());
  element.addEventListener('keydown',e=>{if(e.altKey&&e.key==='Enter'){e.preventDefault();cancel();activate();}});
  view.addEventListener('blur',cancel);
  root.addEventListener('visibilitychange',()=>{if(root.hidden)cancel();});
}
