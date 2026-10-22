import {esc} from './render.mjs';
export function gallery(items) {
  const cards = items.map(({ d, plan, c }) => {
    const s = d.semantic;
    const strip = d.palette.slice(0, 7).map(p => `<i style="background:${esc(p.hex)}"></i>`).join('');
    return `
  <a class="tile" href="./${esc(d.dir)}.html"
     data-name="${esc((d.title+' '+d.referenceTitle+' '+c.kind).toLowerCase())}" data-theme="${esc(d.theme)}"
     data-hero="${esc(plan.hero)}" data-kind="${esc(c.kind)}">
    <div class="prev photo-${esc(plan.photoLayout)}" style="background:${esc(s.bg)};color:${esc(s.fg)};border-color:${esc(s.border)}">
      <div class="p-nav"><span style="font-family:${d.fonts.display}">${esc(d.title)}</span>
        <i style="background:${esc(s.accent)};border-radius:${esc(d.radiusBtn)}"></i></div>
      <div class="p-body p-${esc(plan.hero)}"><img src="${esc(d.photoSrc)}" alt="" loading="lazy" width="400" height="250">
        <b style="font-family:${d.fonts.display}">${esc(c.headline)}</b>
        <em>${esc(c.lede.slice(0, 74))}</em>
        <i class="p-btn" style="background:${esc(s.action)};border-radius:${esc(d.radiusBtn)}"></i>
      </div>
    </div>
    <div class="strip">${strip}</div>
    <div class="meta">
      <strong>${esc(d.title)} <small>↗</small></strong>
      <span>${esc(d.referenceTitle)} reference · ${esc(d.theme)}</span>
    </div>
  </a>`;
  }).join('');

  const heroes = [...new Set(items.map(i => i.plan.hero))].sort();
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>TKTechnology — Collection 02 / ${items.length} templates</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#09090b;color:#f4f4f5;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
header{max-width:1500px;margin:0 auto;padding:54px 30px 22px}
h1{font-size:31px;margin:0 0 10px;letter-spacing:-.025em;font-weight:600}
p.sub{color:#9b9ba4;margin:0;max-width:80ch;line-height:1.6;font-size:14px}
.tools{max-width:1500px;margin:0 auto;padding:18px 30px;display:flex;gap:9px;flex-wrap:wrap}
input,select{background:#161619;border:1px solid #2b2b31;color:#f4f4f5;padding:9px 13px;
  border-radius:7px;font:inherit;font-size:14px}
input{flex:1;min-width:200px}
.count{color:#9b9ba4;font-size:13px;align-self:center;margin-left:auto}
.grid{max-width:1500px;margin:0 auto;padding:10px 30px 90px;display:grid;gap:18px;
  grid-template-columns:repeat(auto-fill,minmax(268px,1fr))}
.tile{text-decoration:none;color:inherit;border:1px solid #232329;border-radius:13px;
  overflow:hidden;background:#111114;transition:border-color .15s,transform .15s}
.tile:hover{border-color:#52525b;transform:translateY(-2px)}
.prev{height:176px;border-bottom:1px solid;display:flex;flex-direction:column;overflow:hidden}
.p-nav{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;
  border-bottom:1px solid currentColor;opacity:.92;font-size:13px}
.p-nav i{width:40px;height:15px;display:block;opacity:.9}
.p-body{padding:16px 14px;display:flex;flex-direction:column;gap:7px;flex:1}
.p-body b{font-size:17px;line-height:1.14;font-weight:500}
.p-body em{font-style:normal;font-size:10.5px;opacity:.62;line-height:1.4}
.p-btn{width:62px;height:19px;display:block;margin-top:auto}
.p-centered,.p-centered-panel{text-align:center;align-items:center}
.p-centered .p-btn,.p-centered-panel .p-btn{margin-left:auto;margin-right:auto}
.p-display b{font-size:23px;letter-spacing:-.03em;line-height:.96}
.p-editorial b{font-size:16px}
.p-editorial em{border-top:1px solid currentColor;padding-top:7px}
.strip{display:flex;height:7px}
.strip i{flex:1}
.meta{padding:11px 13px;display:flex;flex-direction:column;gap:3px}
.meta strong{font-size:14px;font-weight:600}
.meta span{font-size:11px;color:#83838d}

.kicker{font-size:11px;letter-spacing:.18em;color:#b4dd88;display:block;margin-bottom:24px}h1{font-size:clamp(30px,4vw,52px);letter-spacing:-.045em}.prev{height:280px}.p-body{position:relative;padding:24px 18px}.p-body img{position:absolute;right:0;top:0;width:48%;height:100%;object-fit:cover}.p-body b,.p-body em,.p-body .p-btn{position:relative;max-width:48%;z-index:1}.p-body b{font-size:22px}.p-body em{font-size:10px}.p-centered,.p-centered-panel{text-align:left;align-items:flex-start}.p-centered .p-btn,.p-centered-panel .p-btn{margin-left:0;margin-right:0}.p-display b{font-size:27px}.p-nav{font-size:11px;padding:13px 16px}.grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}.meta{padding:16px}.meta strong{font-size:16px;display:flex;justify-content:space-between}.meta span{font-size:12px;line-height:1.6;color:#a5a5ae}.meta small{color:#b4dd88}.tools button{border:1px solid #42424a;border-radius:7px;background:#202025;color:white;padding:9px 15px;cursor:pointer}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.empty,footer{max-width:1500px;margin:auto;padding:25px 30px;color:#b1b1ba;font-size:13px}footer{border-top:1px solid #303036;padding-bottom:45px}footer a{color:inherit}:focus-visible{outline:3px solid #b4dd88;outline-offset:4px}[hidden]{display:none!important}@media(max-width:1050px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.grid{grid-template-columns:1fr;padding:10px 20px 45px}header{padding:35px 20px 15px}.tools{padding:15px 20px}.tools input{width:100%}.prev{height:290px}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}

.p-editorial img,.p-display img,.p-centered img,.p-centered-panel img{top:auto;bottom:0;width:100%;height:46%}.p-editorial b,.p-display b,.p-centered b,.p-centered-panel b{max-width:100%;font-size:21px}.p-editorial em,.p-display em,.p-centered em,.p-centered-panel em,.p-editorial .p-btn,.p-display .p-btn,.p-centered .p-btn,.p-centered-panel .p-btn{display:none}.p-centered,.p-centered-panel{text-align:center;align-items:center}.photo-immersive .p-body img{inset:0;width:100%;height:100%;filter:brightness(.35)}.photo-immersive .p-body b{color:#fff;max-width:90%;font-size:26px}.photo-immersive .p-body em{display:block;color:#fff;opacity:1;max-width:85%}.photo-immersive .p-body .p-btn{display:block;background:white!important}.photo-collage .p-body img{top:30px;right:12px;bottom:auto;left:auto;width:45%;height:70%;border-radius:50%;transform:rotate(-6deg)}.photo-collage .p-body b{max-width:48%;font-size:23px}.photo-collage .p-body{text-align:left;align-items:flex-start}
</style></head>
<body>
<header>
  <span class="kicker">TKTECHNOLOGY / COLLECTION 02</span><h1>Design systems. New perspectives.</h1>
  <p class="sub">${items.length} new templates, built from Refero design documents using the original collection’s token and layout pipeline. Explore the photography, colors, typography and composition. Open any template to preview or download it.</p>
</header>
<div class="tools">
  <label class="sr-only" for="q">Search templates</label><input id="q" type="search" placeholder="Filter by name…" autocomplete="off">
  <label class="sr-only" for="theme">Theme</label><select id="theme"><option value="">All themes</option><option>light</option><option>dark</option><option>mixed</option></select>
  <label class="sr-only" for="hero">Hero layout</label><select id="hero"><option value="">All layouts</option>${heroes.map(h => `<option>${esc(h)}</option>`).join('')}</select>
  <button id="reset" type="button">Reset</button><span class="count" id="count" role="status"></span>
</div>
<main class="grid" id="grid">${cards}</main><p id="empty" class="empty" hidden>No templates match. Try another search or reset your filters.</p><footer>TKTechnology · Reference-led design · Credited Unsplash photography · <a href="./catalog.json">Catalog JSON</a></footer>
<script>
const q=document.getElementById('q'),th=document.getElementById('theme'),hr=document.getElementById('hero');
const tiles=[...document.querySelectorAll('.tile')],count=document.getElementById('count');
function apply(){
  const t=q.value.trim().toLowerCase(),theme=th.value,hero=hr.value;let n=0;
  for(const el of tiles){
    const ok=(!t||el.dataset.name.includes(t))&&(!theme||el.dataset.theme===theme)&&(!hero||el.dataset.hero===hero);
    el.style.display=ok?'':'none';if(ok)n++;
  }
  count.textContent=n+' of '+tiles.length;document.querySelector('#empty').hidden=n!==0;
}
for(const el of [q,th,hr]) el.addEventListener('input',apply);
document.querySelector('#reset').addEventListener('click',()=>{q.value='';th.value='';hr.value='';apply()});apply();
</script>
</body></html>`;
}
