import fs from 'node:fs/promises';
import path from 'node:path';
import { SRC, extract, contrast, mix } from './lib/tokens.mjs';
import { makeRng, buildContent } from './lib/content.mjs';
import { detect, chooseHero, chooseNav, chooseSections, chooseFooter } from './lib/layout.mjs';
import { page } from './lib/render.mjs';
import { gallery } from './lib/gallery.mjs';
const out=path.resolve('site');
await fs.mkdir(path.join(out,'downloads'),{recursive:true});
const dirs=(await fs.readdir(SRC,{withFileTypes:true})).filter(d=>d.isDirectory()).map(d=>d.name).sort();
const items=[];
for(const dir of dirs){
  const d=await extract(dir), meta=JSON.parse(await fs.readFile(path.join(SRC,dir,'source.json'),'utf8'));
  // Muted copy must remain readable on all three content surfaces.
  let amount=.55;
  while(['bg','surface','alt'].some(k=>contrast(mix(d.semantic.bg,d.semantic.fg,amount),d.semantic[k])<4.5)&&amount<1) amount+=.025;
  d.semantic.muted=mix(d.semantic.bg,d.semantic.fg,Math.min(amount,1));
  const rng=makeRng(d.title+d.dir), c=buildContent(rng,d.title,d.tagline,meta.category),sig=detect(d);
  c.headline=meta.headline; c.eyebrow='Introducing '+d.title;
  const plan={hero:chooseHero(sig,rng),nav:chooseNav(sig,rng),sections:chooseSections(sig,rng),footer:chooseFooter(sig,rng)};
  items.push({d,c,plan});
}
for(let i=0;i<items.length;i++){
  const {d,c,plan}=items[i];
  const html=page(d,c,plan,items[i-1]?.d.dir,items[i+1]?.d.dir);
  await fs.writeFile(path.join(out,d.dir+'.html'),html);
  const standalone=html.replace(/<div class="tb">[\s\S]*?<\/div><\/div>/,'');
  await fs.writeFile(path.join(out,'downloads',d.dir+'.html'),standalone);
  await fs.writeFile(path.join(SRC,d.dir,'tokens.json'),JSON.stringify({title:d.title,theme:d.theme,semantic:d.semantic,fonts:d.fonts,palette:d.palette,plan},null,2)+'\n');
}
const catalog=items.map(({d,c,plan})=>({id:d.dir,title:d.title,collection:'2026-10',category:c.kind,theme:d.theme,hero:plan.hero,sections:plan.sections,description:c.lede,preview:`./${d.dir}.html`,download:`./downloads/${d.dir}.html`,tokens:`./tokens/${d.dir}.json`,colors:d.semantic}));
await fs.mkdir(path.join(out,'tokens'),{recursive:true});
for(const {d} of items)await fs.copyFile(path.join(SRC,d.dir,'tokens.json'),path.join(out,'tokens',d.dir+'.json'));
await fs.writeFile(path.join(out,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
await fs.writeFile(path.join(out,'index.html'),gallery(items));
console.log(`Built ${items.length} templates, standalone downloads, token files, and catalog.`);
console.log(`Hero layouts: ${[...new Set(items.map(i=>i.plan.hero))].join(', ')}`);
console.log(`Unique page structures: ${new Set(items.map(i=>JSON.stringify(i.plan))).size}/${items.length}`);
