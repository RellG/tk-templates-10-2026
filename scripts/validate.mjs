import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {contrast,inkOn} from '../lib/tokens.mjs';
const catalog=JSON.parse(await fs.readFile('site/catalog.json','utf8'));
assert.equal(catalog.length,24);
assert.equal(new Set(catalog.map(x=>x.id)).size,24);
assert.equal(new Set(catalog.map(x=>x.hero)).size,5);
assert(new Set(catalog.map(x=>x.category)).size>=8);
assert.equal(new Set(catalog.map(x=>x.hero+'|'+x.sections.join(','))).size,24);
for(const item of catalog){
  const html=await fs.readFile(path.join('site',item.preview),'utf8');
  const standalone=await fs.readFile(path.join('site',item.download),'utf8');
  assert(!standalone.includes('class="tb"'),item.id+' download has gallery toolbar');
  assert(!standalone.includes('href="./'),item.id+' standalone needs another file');
  assert(!html.includes('href="#"'),item.id+' contains placeholder link');
  assert(html.includes('class="hero-photo '),item.id+' missing hero image');
  assert(standalone.includes('data:image/jpeg;base64,'),item.id+' download image not embedded');
  const image=await fs.readFile(path.join('assets',item.photo.file));
  assert(image.length>10000,item.id+' missing photo');
  assert.equal(image[0],255);assert.equal(image[1],216);
  const source=JSON.parse(await fs.readFile(path.join('refero-design-systems',item.id,'source.json'),'utf8'));
  assert.equal(source.url,item.sourceUrl);
  const tokens=JSON.parse(await fs.readFile(path.join('site',item.tokens),'utf8'));
  assert(tokens.layoutText.length>150,item.id+' layout prose was not extracted');
  assert(tokens.rules.length>200,item.id+' source rules missing');
  assert(tokens.palette.length>=4,item.id+' source palette missing');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,item.id+' duplicate IDs');
  for(const match of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(match[1]),item.id+' broken fragment '+match[1]);
  for(const match of html.matchAll(/href="(\.\/[^"#]+)"/g))await fs.access(path.join('site',match[1]));
  for(const surface of ['bg','surface','alt']){
    assert(contrast(item.colors.fg,item.colors[surface])>=4.5,item.id+' body contrast');
    assert(contrast(item.colors.muted,item.colors[surface])>=4.5,item.id+' muted contrast');
  }
  assert(contrast(inkOn(item.colors.action),item.colors.action)>=4.5);
  await fs.access(path.join('site',item.tokens));
}
console.log('PASS: 24 reference-led templates, source prose/rules/palettes, local photography and embedded-image downloads, unique layouts, working links, readable semantic colors.');

const baseline=JSON.parse(await fs.readFile('reference-exclusions.json','utf8'));
for(const item of catalog){assert(!baseline.urls.includes(item.sourceUrl));assert(!baseline.titles.includes(item.referenceTitle.toLowerCase()))}
assert.equal(new Set(catalog.map(x=>x.sourceUrl)).size,24);
console.log('PASS: all 24 references are new relative to collection 01 (URLs and titles).');
