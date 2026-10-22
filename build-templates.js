import fs from 'node:fs/promises';
import path from 'node:path';
import { SRC, extract, contrast, mix, saturation } from './lib/tokens.mjs';
import { makeRng, buildContent } from './lib/content.mjs';
import { detect, chooseHero, chooseNav, chooseSections, chooseFooter } from './lib/layout.mjs';
import { page } from './lib/render.mjs';
import { gallery } from './lib/gallery.mjs';
import { experience } from './lib/experiences.mjs';
const out=path.resolve('.build');
await fs.mkdir(path.join(out,'downloads'),{recursive:true});
await fs.mkdir(path.join(out,'tokens'),{recursive:true});
await fs.cp('assets',path.join(out,'assets'),{recursive:true});
const photos=JSON.parse(await fs.readFile('assets/credits.json','utf8'));
const dirs=(await fs.readdir(SRC,{withFileTypes:true})).filter(d=>d.isDirectory()).map(d=>d.name).sort();
if(dirs.length!==24)throw new Error(`Expected 24 source documents; found ${dirs.length}`);
const items=[];
for(const [index,dir] of dirs.entries()){
  const d=await extract(dir);
  // Keep text in the source's neutral ink family; product/link colors are not body ink.
  const neutral=[d.semantic.fg,...d.palette.map(p=>p.hex)].filter(hex=>saturation(hex)<.3&&contrast(hex,d.semantic.bg)>=4.5).sort((a,b)=>contrast(b,d.semantic.bg)-contrast(a,d.semantic.bg));
  if(neutral.length)d.semantic.fg=neutral[0];
  const primary=d.palette.find(p=>/primary.{0,25}(button|cta|action)|filled.{0,35}(button|cta|action)|main.{0,12}(button|cta|action)/i.test(p.role)&&!/text and icon fills|text on|button text/i.test(p.role));
  if(primary){d.semantic.action=primary.hex;d.semantic.accent=primary.hex;}
  let amount=.55;
  while(['bg','surface','alt'].some(k=>contrast(mix(d.semantic.bg,d.semantic.fg,amount),d.semantic[k])<4.5)&&amount<1) amount+=.025;
  d.semantic.muted=mix(d.semantic.bg,d.semantic.fg,Math.min(amount,1));
  const rng=makeRng(d.title+d.dir),c=experience(index,buildContent(rng,d.title,d.tagline)),sig=detect(d);
  const plan={hero:chooseHero(sig,rng),nav:chooseNav(sig,rng),sections:chooseSections(sig,rng),footer:chooseFooter(sig,rng),signals:Object.entries(sig).filter(([,v])=>v).map(([k])=>k)};
  // Photo framing follows the published composition; stock photography is an explicit collection adaptation.
  const composition=(d.layoutText+' '+d.imageryText).toLowerCase();
  plan.photoLayout=/destination.photo hero|hero.{0,30}(photograph|lifestyle)|full.bleed.{0,40}(lifestyle|photograph)/.test(composition)?'immersive': /collage|floating visual boards|overlapping.{0,30}(card|window)/.test(composition)?'collage':'framed';
  if(/left.aligned text block and right.aligned|text.left|split.hero/.test(d.layoutText.toLowerCase()))plan.hero='split';
  d.referenceTitle=d.title;d.title=c.brand;d.tagline=c.lede;d.sampleFeatures=c.features;
  d.photo=photos.find(p=>p.id===c.photo);if(!d.photo)throw new Error('Missing photo '+c.photo);
  d.photoSrc='./assets/'+d.photo.file;
  d.imageRadius=d.tokens['--radius-images']||d.radiusCard;
  d.sectionGap=Math.max(48,Math.min(120,parseInt(d.tokens['--section-gap'])||80))+'px';
  const heroType=d.sourceMarkdown.split(/\n/).find(line=>/^\| (hero-display|hero|display) \|/.test(line));
  const parts=heroType?.split('|').map(x=>x.trim());
  d.headingWeight=parts&&/^\d{3}$/.test(parts[3])?parts[3]:'500';
  const tokenRecord={title:d.title,referenceTitle:d.referenceTitle,sourceUrl:d.url,theme:d.theme,semantic:d.semantic,fonts:d.fonts,palette:d.palette,plan,layoutText:d.layoutText,imageryText:d.imageryText,rules:d.rulesText,adaptation:'Fictional copy and credited stock hero photography; no source brand logos or proprietary assets.'};
  await fs.writeFile(path.join(SRC,dir,'tokens.json'),JSON.stringify(tokenRecord,null,2)+'\n');
  await fs.writeFile(path.join(out,'tokens',dir+'.json'),JSON.stringify(tokenRecord,null,2)+'\n');
  items.push({d,c,plan});
}
for(let i=0;i<items.length;i++){
  const {d,c,plan}=items[i];
  const html=page(d,c,plan,items[i-1]?.d.dir,items[i+1]?.d.dir);
  await fs.writeFile(path.join(out,d.dir+'.html'),html);
  const imageData=(await fs.readFile('assets/'+d.photo.file)).toString('base64');
  const standalone=html.replace(/<div class="tb">[\s\S]*?<\/div><\/div>/,'').replaceAll(d.photoSrc,'data:image/jpeg;base64,'+imageData);
  await fs.writeFile(path.join(out,'downloads',d.dir+'.html'),standalone);
}
const catalog=items.map(({d,c,plan})=>({id:d.dir,title:d.title,referenceTitle:d.referenceTitle,sourceUrl:d.url,collection:'2026-10',category:c.kind,theme:d.theme,hero:plan.hero,photoLayout:plan.photoLayout,sections:plan.sections,description:c.lede,preview:`./${d.dir}.html`,download:`./downloads/${d.dir}.html`,tokens:`./tokens/${d.dir}.json`,photo:d.photo,colors:d.semantic}));
await fs.writeFile(path.join(out,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
await fs.writeFile(path.join(out,'index.html'),gallery(items));
await fs.rename('site','site.previous').catch(e=>{if(e.code!=='ENOENT')throw e});
await fs.rename(out,'site');
await fs.rm('site.previous',{recursive:true,force:true});
console.log(`Built ${items.length} reference-led templates with local hero photos, embedded-image downloads, source tokens and catalog.`);
console.log('Hero layouts:',[...new Set(items.map(i=>i.plan.hero))].join(', '));
console.log('Photo layouts:',[...new Set(items.map(i=>i.plan.photoLayout))].join(', '));
console.log(`Distinct page structures: ${new Set(items.map(i=>JSON.stringify(i.plan))).size}/${items.length}`);
