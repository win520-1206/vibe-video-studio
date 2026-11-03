import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {draftCreative,inspectCreative,narrativeFields,shotFields} from '../shared/creative.mjs';
const raw=()=>({episodes:[{id:'E1',events:[{id:'reveal',atSeconds:1}],scenes:[{id:'one',start:0,end:3,action:'move',understanding:'a change',eventIds:['reveal'],captions:[{id:'c1',text:'条件成立才有结果',eventId:'reveal'}]},{id:'two',start:3,end:6,captions:[],eventIds:[]}]}]});
const complete=c=>{const p=draftCreative(c);for(const f of narrativeFields)p.project[f]='authored intent';for(const s of p.shots)for(const f of shotFields)s[f]='authored '+f;return p};
test('draft references raw config before renderers exist and introduces no clock',()=>{const p=draftCreative(raw());assert.deepEqual(p.shots[0].eventIds,['reveal']);assert.ok(!('start' in p.shots[0]));assert.ok(!('profile' in p));assert.equal(p.project.emotionalConnection,'')});
test('incomplete narrative fails; completed plan leaves manual review pending',()=>{const c=raw();assert.ok(!inspectCreative(draftCreative(c),c).passed);const r=inspectCreative(complete(c),c);assert.ok(r.passed);assert.ok(Object.values(r.manualReview).every(v=>v==='not_reviewed'))});
test('missing, duplicated and unknown scenes fail',()=>{const c=raw();for(const change of [p=>p.shots.pop(),p=>p.shots.push(p.shots[0]),p=>p.shots[0].sceneId='absent']){const p=complete(c);change(p);assert.ok(!inspectCreative(p,c).passed)}});
test('caption omission, invalid event reference and event at next scene fail',()=>{for(const change of [p=>p.shots[0].captionIds=[],p=>p.shots[0].eventIds=['absent'],p=>p.shots[1].eventIds=['reveal']]){const c=raw(),p=complete(c);change(p);assert.ok(!inspectCreative(p,c).passed)}});
test('independent approved text detects dropped condition even with same IDs',()=>{const c=raw(),p=complete(c);assert.ok(inspectCreative(p,c,{E1:[{id:'c1',text:'条件成立才有结果'}]}).passed);c.episodes[0].scenes[0].captions[0].text='才有结果';assert.ok(!inspectCreative(p,c,{E1:[{id:'c1',text:'条件成立才有结果'}]}).passed)});
test('scene event time follows config, not a copied timestamp',()=>{const c=raw(),p=complete(c);c.episodes[0].events[0].atSeconds=4;assert.ok(inspectCreative(p,c).errors.some(x=>x.includes('outside scene')))});
test('missing plan gives actionable error; malformed arrays fail',()=>{assert.match(inspectCreative(null,raw()).errors[0],/plan:shots/);const c=raw(),p=complete(c);p.shots[0].eventIds=null;assert.ok(!inspectCreative(p,c).passed)});
test('annotation emphasis events cannot be dropped from creative references',()=>{const c=raw();c.episodes[0].scenes[0].annotations=[{eventId:'annotation'}];c.episodes[0].events.push({id:'annotation',atSeconds:2});const p=complete(c);assert.ok(p.shots[0].eventIds.includes('annotation'));p.shots[0].eventIds=['reveal'];assert.ok(inspectCreative(p,c).errors.some(x=>x.includes('annotation')))});
test('CLI draft never overwrites authored files; check works without renderer',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'creative-plan-')),script=fileURLToPath(new URL('../scripts/creative.mjs',import.meta.url));
 try{const c=raw();fs.writeFileSync(path.join(dir,'project-contract.json'),JSON.stringify(c));fs.writeFileSync(path.join(dir,'script-manifest.json'),JSON.stringify({E1:[{id:'c1',text:'条件成立才有结果'}]}));
  const run=mode=>spawnSync(process.execPath,[script,mode],{cwd:dir,encoding:'utf8'});
  assert.equal(run('check').status,1);assert.equal(run('plan').status,0);
  fs.writeFileSync(path.join(dir,'creative-plan.json'),JSON.stringify(complete(c)));const before=fs.readFileSync(path.join(dir,'creative-plan.json'));assert.equal(run('plan').status,1);assert.deepEqual(fs.readFileSync(path.join(dir,'creative-plan.json')),before);assert.equal(run('check').status,0);assert.ok(fs.existsSync(path.join(dir,'qa/creative-plan.md')));
 }finally{assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true})}
});
