import test from 'node:test';
import assert from 'node:assert/strict';
import {response} from '../shared/study-model.mjs';
test('feedback equals analytic exponential and position/error share one model',()=>{
 for(const time of [6,8,10,12,17]){const p=response(time);assert.equal(p.x,.5+p.error);assert.ok(Math.abs(p.control+.6*p.error)<1e-14);assert.ok(p.error>0)}
 assert.ok(Math.abs(response(8).error-.31*Math.exp(-1.2))<1e-14);
 assert.ok(Math.abs(response(11).error-response(11-1e-8).error-.16)<1e-8);
});
test('independent Euler integration reproduces response under displacement disturbance',()=>{
 const dt=.0001;let error=.31;
 for(let i=0;i<180000;i++){const time=i*dt;if(i===110000)error+=.16;if(time>=6)error+=-.6*error*dt}
 assert.ok(Math.abs(error-response(18).error)<.00001);
});
