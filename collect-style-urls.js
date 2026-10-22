/**
 * Collects style URLs from the index in the site's own "newest" order.
 *
 * The index uses infinite scroll, so this is the one step that needs a real
 * browser. Output feeds scrape-design-tokens.js, which fetches pages directly.
 *
 * Usage: node collect-style-urls.js [count] > style-urls.json
 */

import { chromium } from 'playwright';

const BASE_URL = 'https://styles.refero.design/?sort=newest';
const TARGET = Number(process.argv[2]) || 24;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

const urls = [];
const exclusions=JSON.parse(await (await import('node:fs/promises')).readFile('reference-exclusions.json','utf8'));
const excluded=new Set(exclusions.urls);
const seen = new Set();
let stagnant = 0;

while (urls.length < TARGET && stagnant < 5) {
  const found = await page.$$eval('a[href*="/style/"]', els => els.map(e => e.href));
  const before = urls.length;
  for (const u of found) {
    if (seen.has(u) || excluded.has(u)) continue;
    seen.add(u);
    urls.push(u);
  }
  if (urls.length === before) stagnant++;
  else stagnant = 0;

  console.error(`collected ${urls.length}/${TARGET}`);
  if (urls.length >= TARGET) break;

  await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
  await page.waitForTimeout(1800);
}

// The current index may stop after its first server-rendered batch.
// Read the other public sort views; do not silently claim the target was reached.
for(const sort of ['popular','trending']){
  if(urls.length>=TARGET)break;
  await page.goto('https://styles.refero.design/?sort='+sort,{waitUntil:'domcontentloaded'});
  const extra=await page.$$eval('a[href*="/style/"]',els=>els.map(el=>el.href));
  for(const u of extra){if(seen.has(u)||excluded.has(u))continue;seen.add(u);urls.push(u)}
}
await browser.close();
if(urls.length<TARGET){console.error(`Only ${urls.length} new URLs available for target ${TARGET}`);process.exitCode=1;}
process.stdout.write(JSON.stringify(urls.slice(0, TARGET), null, 2));
