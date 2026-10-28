import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
const dist=join(root,'dist');
const html=readFileSync(join(dist,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const failures=[];
for(const id of ids) if(ids.filter(v=>v===id).length>1) failures.push('ID duplicado: '+id);
for(const [,value] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 if(value.startsWith('#')){if(!ids.includes(value.slice(1)))failures.push('Âncora sem destino: '+value);}
 else if(value.startsWith('/')){if(!existsSync(join(dist,value)))failures.push('Recurso ausente: '+value);}
}
for(const file of ['dist/app.js','dist/motion.js','dist/marquee.js','server.mjs']){
 const result=spawnSync(process.execPath,['--check',join(root,file)],{encoding:'utf8'});
 if(result.status!==0)failures.push(result.stderr);
}
const hosting=JSON.parse(readFileSync(join(root,'.openai/hosting.json'),'utf8'));
if(!hosting.project_id||hosting.static?.directory!=='dist')failures.push('Manifesto de publicação inválido');
if((html.match(/<h1\b/g)||[]).length!==1)failures.push('A página deve ter exatamente um título principal');
if(/\bTODO\b|[Ll]orem ipsum|placehold\.co/.test(html))failures.push('Conteúdo provisório encontrado');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('OK: recursos locais, âncoras, IDs, JavaScript e manifesto de publicação.');
