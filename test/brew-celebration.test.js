import test from 'node:test';
import assert from 'node:assert/strict';
import {BREW_ANIMATION_MS,brewFrameAt} from '../js/brew-celebration.js';

test('brewing timeline holds the beginning, eases between frames and holds the last cup',()=>{
  assert.equal(BREW_ANIMATION_MS,5600);
  assert.deepEqual(brewFrameAt(0),{index:0,next:1,mix:0});
  assert.deepEqual(brewFrameAt(50),brewFrameAt(0));
  assert.equal(brewFrameAt(250).mix,.5);
  assert.equal(brewFrameAt(400).index,1);
  assert.deepEqual(brewFrameAt(4900),{index:15,next:15,mix:0});
  assert.deepEqual(brewFrameAt(5599),brewFrameAt(4900));
});
test('animation never moves backwards or addresses a missing sprite',()=>{
  let prior=-1;
  for(let ms=0;ms<5600;ms+=16){
    const f=brewFrameAt(ms),position=f.index+f.mix;
    assert(position>=prior);assert(f.next<=15);assert(f.mix>=0&&f.mix<=1);prior=position;
  }
});
