import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const port=4317,base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['serve.js',String(port)],{stdio:['ignore','pipe','inherit']});
let browser;
try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(new Error(`Server exited ${code}`)));server.stdout.once('data',resolve)});
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const catalog=JSON.parse(await fs.readFile('site/catalog.json','utf8'));
  await fs.mkdir('test-results',{recursive:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base);assert.equal(await page.locator('.card:visible').count(),24);
  await page.screenshot({path:'test-results/gallery-desktop.png',fullPage:true});
  await page.locator('#category').selectOption('analytics');assert.equal(await page.locator('.card:visible').count(),3);
  await page.locator('#theme').selectOption('dark');assert.equal(await page.locator('.card:visible').count(),1);
  await page.locator('#q').fill('not-a-template');assert(await page.locator('#empty').isVisible());
  await page.locator('#reset').click();assert.equal(await page.locator('.card:visible').count(),24);
  const downloadEvent=page.waitForEvent('download');await page.locator('.download').first().click();const download=await downloadEvent;assert.equal(download.suggestedFilename(),catalog[0].id+'.html');
  await page.setViewportSize({width:375,height:812});await page.screenshot({path:'test-results/gallery-mobile.png',fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'gallery mobile overflow');
  for(const item of catalog){
    for(const width of [1440,375]){
      await page.setViewportSize({width,height:900});
      const response=await page.goto(base+'/'+item.preview.replace('./',''));assert.equal(response.status(),200);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${item.id} overflow at ${width}`);
      if(width===375){await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('#navigation a').first().click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false')}
    }
    const tabs=page.locator('[role=tab]');if(await tabs.count()){await tabs.nth(1).click();assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');await tabs.nth(1).press('ArrowRight');assert.equal(await tabs.nth(2).getAttribute('aria-selected'),'true');assert.equal(await page.locator('[role=tabpanel]:visible').count(),1)}
    const faq=page.locator('summary');if(await faq.count()){await faq.first().click();assert(await page.locator('details').first().evaluate(el=>el.open))}
    await page.locator('[name=name]').fill('Template Tester');await page.locator('[name=email]').fill('tester@example.com');await page.locator('[name=message]').fill('Demo inquiry');await page.locator('button[type=submit]').click();assert.match(await page.locator('#form-status').textContent(),/did not send or save/);
    await page.goto(base+'/'+item.download.replace('./',''));assert.equal(await page.locator('.tb').count(),0);assert.equal(await page.locator('h1').count(),1);
  }
  for(const [i,name] of [[0,'editorial'],[1,'panel'],[2,'display'],[3,'split'],[5,'centered']]){await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/'+catalog[i].preview.replace('./',''));await page.screenshot({path:`test-results/${name}-desktop.png`,fullPage:true})}
  assert.deepEqual(errors,[]);console.log('PASS: all 24 templates at desktop/mobile widths, gallery filters, HTML download, mobile navigation, tabs and keyboard controls, FAQ, demo forms, standalone pages; no browser errors.');
}finally{if(browser)await browser.close();server.kill()}
