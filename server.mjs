import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('./dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const port=Number(process.env.PORT)||4173;
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const requested=decodeURIComponent(url.pathname);
  const target=path.resolve(root,'.'+(requested==='/'?'/index.html':requested));
  if(!target.startsWith(root+path.sep)&&target!==path.join(root,'index.html')){res.writeHead(403).end();return;}
  const data=await readFile(target);
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}).end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Página não encontrada');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
