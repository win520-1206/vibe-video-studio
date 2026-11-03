import test from 'node:test';
import assert from 'node:assert/strict';
import {pulsePair} from '../shared/study-model.mjs';
test('opposite pulses cancel displacement at meeting without vanishing afterwards',()=>{
 for(let i=0;i<=100;i++){const x=-1+i*.02,p=pulsePair(x,8);assert.ok(Math.abs(p.sum)<1e-14);assert.equal(p.sum,p.first+p.second)}
 assert.ok(Math.abs(pulsePair(.6,12).sum)>.15);assert.ok(Math.abs(pulsePair(-.6,4).sum)>.15);
});
test('each travelling component retains shape and the linear wave equation',()=>{
 assert.ok(Math.abs(pulsePair(-.6,4).first-pulsePair(.6,12).first)<1e-12);
 const dx=.0001,dt=.0001,x=.11,t=7.2,c=.15;
 const yy=(pulsePair(x+dx,t).sum-2*pulsePair(x,t).sum+pulsePair(x-dx,t).sum)/dx**2;
 const tt=(pulsePair(x,t+dt).sum-2*pulsePair(x,t).sum+pulsePair(x,t-dt).sum)/dt**2;
 assert.ok(Math.abs(tt-c*c*yy)<1e-6);
});
