import test from 'node:test';
import assert from 'node:assert/strict';
import {installAdminHold} from '../js/admin-hold.js';
function harness(){
  let time=0,nextId=0,opens=0,homes=0;const timers=new Map();
  const root=new EventTarget(),view=new EventTarget(),element=new EventTarget();root.defaultView=view;root.hidden=false;element.ownerDocument=root;
  element.setPointerCapture=id=>{element.captured=id;};element.releasePointerCapture=()=>{element.captured=null;};
  element.click=()=>{if(element.dispatchEvent(new Event('click',{cancelable:true})))homes++;};
  installAdminHold(element,()=>opens++,{now:()=>time,setTimeout:(fn,delay)=>{const id=++nextId;timers.set(id,{fn,at:time+delay});return id;},clearTimeout:id=>timers.delete(id)});
  function send(target,type,props={}){const event=Object.assign(new Event(type,{cancelable:true}),props);target.dispatchEvent(event);return event;}
  function advance(ms){const end=time+ms;for(;;){const first=[...timers.entries()].sort((a,b)=>a[1].at-b[1].at)[0];if(!first||first[1].at>end)break;time=first[1].at;timers.delete(first[0]);first[1].fn();}time=end;}
  const touch=(x=50,y=30)=>({identifier:1,clientX:x,clientY:y});
  const startTouch=()=>send(element,'touchstart',{touches:[touch()]});
  const endTouch=()=>send(root,'touchend',{changedTouches:[touch()],touches:[]});
  const startPointer=()=>send(element,'pointerdown',{pointerType:'mouse',button:0,pointerId:2,clientX:50,clientY:30,isPrimary:true});
  return {root,view,element,send,advance,touch,startTouch,endTouch,startPointer,get opens(){return opens;},get homes(){return homes;}};
}
test('touch holds launch at seven seconds, never early, and release does not return home',()=>{const h=harness();assert.equal(h.startTouch().defaultPrevented,true);h.advance(6999);assert.equal(h.opens,0);h.advance(1);assert.equal(h.opens,1);h.advance(3000);h.endTouch();h.element.click();assert.equal(h.opens,1);assert.equal(h.homes,0);});
test('a normal short touch retains home navigation exactly once',()=>{const h=harness();h.startTouch();h.advance(120);h.endTouch();h.element.click();assert.equal(h.homes,1);h.advance(7000);assert.equal(h.opens,0);});
test('small finger movement does not cancel a long touch, while scrolling away does',()=>{const h=harness();h.startTouch();h.send(h.root,'touchmove',{touches:[h.touch(69,39)]});h.advance(7000);assert.equal(h.opens,1);const other=harness();other.startTouch();other.send(other.root,'touchmove',{touches:[other.touch(90,30)]});other.advance(8000);assert.equal(other.opens,0);});
test('touch cancellation and lifting early never launch admin',()=>{for(const type of ['touchcancel','touchend']){const h=harness();h.startTouch();h.advance(3000);h.send(h.root,type,{changedTouches:[h.touch()],touches:[]});h.advance(8000);assert.equal(h.opens,0);}});
test('multi-touch and backgrounding cancel the pending gesture',()=>{const h=harness();h.startTouch();h.send(h.root,'touchmove',{touches:[h.touch(),{...h.touch(),identifier:2}]});h.advance(8000);assert.equal(h.opens,0);const other=harness();other.startTouch();other.send(other.view,'blur');other.advance(8000);assert.equal(other.opens,0);});
test('mouse holds use pointer capture and tolerate crossing the title edge',()=>{const h=harness();h.startPointer();assert.equal(h.element.captured,2);h.send(h.element,'pointerleave');h.send(h.root,'pointermove',{pointerId:2,clientX:67,clientY:30});h.advance(7000);h.send(h.root,'pointerup',{pointerId:2});h.element.click();assert.equal(h.opens,1);assert.equal(h.homes,0);assert.equal(h.element.captured,null);});
test('touch-compatible pointer events cannot start a duplicate timer',()=>{const h=harness();h.send(h.element,'pointerdown',{pointerType:'touch',button:0,pointerId:8,clientX:50,clientY:30,isPrimary:true});h.startTouch();h.advance(7000);assert.equal(h.opens,1);});
test('title context menus are suppressed and keyboard access is preserved',()=>{const h=harness();assert.equal(h.send(h.element,'contextmenu').defaultPrevented,true);assert.equal(h.send(h.element,'keydown',{altKey:true,key:'Enter'}).defaultPrevented,true);assert.equal(h.opens,1);});
