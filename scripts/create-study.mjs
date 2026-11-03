#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url)),skill=path.resolve(here,'..');
try{
 const [id,target,...args]=process.argv.slice(2);
 if(!['interference','feedback'].includes(id)||!target)throw Error('Usage: node scripts/create-study.mjs <interference|feedback> <empty-directory> [--music file]');
 if(args.length&&!(args.length===2&&args[0]==='--music'))throw Error('Only --music file is accepted');
 const study=path.join(skill,'assets/studies',id),dest=path.resolve(target);
 const r=spawnSync(process.execPath,[path.join(here,'create-project.mjs'),dest,'--contract',path.join(study,'contract.json'),...args],{stdio:'inherit'});
 if(r.status!==0)throw Error('Study project creation failed; existing targets are never overwritten');
 for(const [from,to]of [['model.mjs','shared/study-model.mjs'],['model.test.mjs','tests/study-model.test.mjs'],['scene-registry.mjs','shared/scene-registry.mjs'],['scenes.tsx','src/scenes.tsx'],['creative-plan.json','creative-plan.json'],['sources.md','docs/sources.md']])fs.copyFileSync(path.join(study,from),path.join(dest,to));
 console.log('Created standalone authored study. This is an 18-second validation project, not a production default. Run check:creative, analyze:music, then render/check.');
}catch(e){console.error(e.message);process.exitCode=1}
