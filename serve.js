import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./site/',import.meta.url));
const port=Number(process.argv[2]||4174);
const host=process.argv[3]||'127.0.0.1';
const types={'.jpg':'image/jpeg','.png':'image/png','.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8'};
http.createServer(async(req,res)=>{
  try{
    const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+((name==='/'||name==='/start')?'/index.html':name));
    if(!file.startsWith(root)){res.writeHead(403).end('Forbidden');return}
    const body=await fs.readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'}).end(body);
  }catch{res.writeHead(404).end('Not found')}
}).listen(port,host,()=>console.log(`TKTechnology collection 02: http://${host}:${port}`));
