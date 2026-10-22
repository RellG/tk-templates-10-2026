import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {contrast,inkOn} from '../lib/tokens.mjs';
const catalog=JSON.parse(await fs.readFile('site/catalog.json','utf8'));
assert.equal(catalog.length,24);
assert.equal(new Set(catalog.map(x=>x.id)).size,24);
assert.equal(new Set(catalog.map(x=>x.hero)).size,5);
assert.equal(new Set(catalog.map(x=>x.category)).size,8);
assert.equal(new Set(catalog.map(x=>x.hero+'|'+x.sections.join(','))).size,24);
for(const item of catalog){
  const html=await fs.readFile(path.join('site',item.preview),'utf8');
  const standalone=await fs.readFile(path.join('site',item.download),'utf8');
  assert(!standalone.includes('class="tb"'),item.id+' download has gallery toolbar');
  assert(!standalone.includes('href="./'),item.id+' standalone needs another file');
  assert(!html.includes('href="#"'),item.id+' contains placeholder link');
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
console.log('PASS: 24 unique templates; 8 categories; 5 heroes; 24 section arrangements; working file/fragment links; standalone downloads; readable semantic colors.');
