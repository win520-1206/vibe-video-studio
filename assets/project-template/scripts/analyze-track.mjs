import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {tool} from './common.mjs';
const args=process.argv.slice(2);
try{if(!args.includes('--ffmpeg'))args.push('--ffmpeg',tool('ffmpeg'));const r=spawnSync(process.env.PYTHON||'python',['-X','utf8',path.resolve('tools/analyze_track.py'),...args],{stdio:'inherit'});if(r.error)throw r.error;process.exitCode=r.status??1}catch(e){console.error(e.message);process.exitCode=1}
