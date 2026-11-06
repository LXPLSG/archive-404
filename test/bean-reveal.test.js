import test from 'node:test';
import assert from 'node:assert/strict';
import {beanFrameAt,BEAN_REVEAL_MS,playBeanReveal} from '../js/bean-reveal.js';

test('mystery starts closed, opens progressively and holds the revealed bean',()=>{
  assert.equal(BEAN_REVEAL_MS,3600);
  assert.deepEqual(beanFrameAt(0),{index:0,next:1,mix:0});
  assert.deepEqual(beanFrameAt(199),beanFrameAt(0));
  assert.equal(beanFrameAt(300).mix,.5);
  assert.deepEqual(beanFrameAt(3200),{index:15,next:15,mix:0});
  assert.deepEqual(beanFrameAt(3599),beanFrameAt(3200));
});
test('mystery frame progression remains within the atlas and never reverses',()=>{
  let previous=-1;
  for(let ms=0;ms<BEAN_REVEAL_MS;ms+=16){const f=beanFrameAt(ms),position=f.index+f.mix;assert(position>=previous);assert(f.next<=15);previous=position;}
});
test('a cancelled reveal never loads images or touches the document',async()=>{
  const controller=new AbortController();controller.abort();
  assert.equal(await playBeanReveal(null,{signal:controller.signal}),false);
});
test('reduced motion skips the artwork and animation entirely',async()=>{
  const previous=globalThis.matchMedia;globalThis.matchMedia=()=>({matches:true});
  try{assert.equal(await playBeanReveal(null),false);}finally{if(previous)globalThis.matchMedia=previous;else delete globalThis.matchMedia;}
});
