import {cp, mkdir, readdir, rm} from 'node:fs/promises';
import {join} from 'node:path';
const root=process.cwd();
const out=join(root,'dist');
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const item of await readdir(root,{withFileTypes:true})){
  if(item.name==='dist'||item.name==='node_modules'||item.name==='scripts'||item.name==='__MACOSX'||item.name.startsWith('.git'))continue;
  if(item.isDirectory()&&item.name!=='assets'&&item.name!=='images')continue;
  if(item.isFile()&&!(/\.html$|\.json$/.test(item.name)||['CNAME','.nojekyll'].includes(item.name)))continue;
  await cp(join(root,item.name),join(out,item.name),{recursive:true});
}
console.log('Site prêt dans dist/');
