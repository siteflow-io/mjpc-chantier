import { createRequire } from 'module'; const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const S = '/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/cap-attente';
const URL = 'file:///home/claude/monsieurjaipascompris/index.html?vue=tableau';
const remplir = `(() => { const q = id => document.getElementById(id); q('ses-tab-h').textContent = '09:06'; q('ses-tab-d').textContent = 'jeudi 5 novembre 2026'; const c = q('ses-tab-c'); c.textContent = 'Classe attendue : 4 TURING · 11:04 – 11:59'; c.style.display = ''; const att = q('ses-tab-att'); if (att) att.style.display = ''; const m = q('mur2'); if (m) m.style.display = 'none'; })()`;
const apres = `(() => {
  const att = document.getElementById('ses-tab-att'); const n = att.querySelector('.n'); n.textContent = 'MJPC';
  const sous = document.createElement('div'); sous.className = 'sous'; sous.textContent = 'Cours de français - M. Meney'; n.after(sous);
  const ligne = document.createElement('div'); ligne.className = 'ligne'; ligne.innerHTML = '<i></i>'; att.querySelector('.d').after(ligne);
  const st = document.createElement('style'); st.textContent = \`
  #ses-tab-att{background:radial-gradient(120% 90% at 50% 40%,#2a2019 0%,#17110d 60%,#0f0b08 100%)!important}
  #ses-tab-att .n,#ses-tab-att .sous,#ses-tab-att .h,#ses-tab-att .d,#ses-tab-att .ligne,#ses-tab-att #ses-tab-c{position:relative;z-index:2}
  #ses-tab-att .n{font-size:2.6vh!important;letter-spacing:1.4vh!important;font-weight:500;opacity:.8;background:linear-gradient(90deg,#c9a45c,#f3dca6,#c9a45c);-webkit-background-clip:text;background-clip:text;color:transparent!important;margin-bottom:0!important}
  #ses-tab-att .sous{font-size:6.2vh;letter-spacing:.25vh;color:#f3d58e;margin:.6vh 0 2vh;font-weight:500;text-shadow:0 .2vh .3vh rgba(0,0,0,.95),0 0 1.2vh rgba(0,0,0,.8),0 0 4vh rgba(228,180,92,.55),0 0 9vh rgba(228,180,92,.35)}
  #ses-tab-att .h{font-size:28vh!important;line-height:1!important;font-weight:500;color:#fbf3e2!important;text-shadow:0 0 1.5vh rgba(15,11,8,.95),0 0 4vh rgba(15,11,8,.85),0 0 10vh rgba(228,180,92,.25);font-variant-numeric:tabular-nums;z-index:3!important}
  #ses-tab-att .d{font-size:5.6vh!important;color:#e7d6b4!important}
  #ses-tab-att .ligne{width:34vh;height:2px;margin:2.2vh auto 3vh;background:rgba(228,180,92,.18);border-radius:2px;overflow:hidden}
  #ses-tab-att .ligne i{display:block;height:100%;width:100%;background:linear-gradient(90deg,transparent,#e4b45c 60%,#fff3d0);transform-origin:left;animation:minute 60s linear infinite;animation-delay:-36s}
  @keyframes minute{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  #ses-tab-att #ses-tab-c{font-size:4.6vh!important;padding:1.4vh 4vh!important;color:#fbf3e2!important;background:rgba(255,255,255,.035)!important;border:1px solid rgba(228,180,92,.38)!important;border-radius:999px!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 0 0 0 rgba(228,180,92,.25);animation:souffle 4.8s ease-in-out infinite}
  @keyframes souffle{0%,100%{box-shadow:0 0 0 0 rgba(228,180,92,0),0 1vh 4vh rgba(0,0,0,.35)}50%{box-shadow:0 0 0 1.2vh rgba(228,180,92,.07),0 1vh 4vh rgba(0,0,0,.35)}}
  #mjpc-bas{position:absolute;left:0;right:0;bottom:2.4vh;text-align:center;font-size:1.6vh;letter-spacing:.7vh;color:#a8956a;opacity:.6;text-transform:uppercase;z-index:2}
  #anim-calme{position:absolute!important;inset:0!important;pointer-events:none;overflow:hidden;z-index:0}
  #anim-calme .aur{position:absolute;width:70vw;height:70vw;border-radius:50%;filter:blur(8vh);opacity:.8;mix-blend-mode:screen}
  #anim-calme .a1{left:-18vw;top:-28vw;background:radial-gradient(circle,rgba(228,180,92,.55),transparent 60%);animation:derive1 12s ease-in-out infinite alternate}
  #anim-calme .a2{right:-22vw;bottom:-34vw;background:radial-gradient(circle,rgba(176,98,52,.5),transparent 62%);animation:derive2 15s ease-in-out infinite alternate}
  #anim-calme .a3{left:30vw;top:40vh;width:40vw;height:40vw;background:radial-gradient(circle,rgba(120,52,40,.45),transparent 62%);animation:derive1 17s ease-in-out infinite alternate-reverse}
  @keyframes derive1{from{transform:translate(0,0) scale(1)}to{transform:translate(26vw,18vh) scale(1.3)}}
  @keyframes derive2{from{transform:translate(0,0) scale(1.15)}to{transform:translate(-24vw,-20vh) scale(.9)}}
  #anim-calme .anneau{position:absolute;left:50%;top:50%;width:84vh;height:34vh;border-radius:50%;background:conic-gradient(from var(--ang),transparent 0 62%,rgba(228,180,92,.0) 62%,rgba(255,236,190,1) 97%,transparent 100%);-webkit-mask:radial-gradient(closest-side,transparent calc(100% - 4px),#000 calc(100% - 3px),#000 99%,transparent 100%);mask:radial-gradient(closest-side,transparent calc(100% - 4px),#000 calc(100% - 3px),#000 99%,transparent 100%);animation:tourneAng 7s linear infinite;filter:drop-shadow(0 0 1vh rgba(228,180,92,.8))}
  #anim-calme .anneau2{width:102vh;height:38vh;opacity:.55;animation-duration:11s;animation-direction:reverse}
  @property --ang{syntax:'<angle>';inherits:false;initial-value:0deg} @keyframes tourneAng{to{--ang:360deg}}
  #anim-calme .grain{position:absolute;inset:0;opacity:.06;background-image:radial-gradient(rgba(255,255,255,.6) 1px,transparent 1px);background-size:3px 3px}\`;
  document.head.appendChild(st);
  const a = document.createElement('div'); a.id = 'anim-calme';
  a.innerHTML = '<div class="aur a1"></div><div class="aur a2"></div><div class="aur a3"></div><div class="anneau"></div><div class="anneau anneau2"></div><div class="grain"></div>';
  att.prepend(a);
  const hr = att.querySelector('.h').getBoundingClientRect(); const cx = hr.left + hr.width / 2, cy = hr.top + hr.height / 2; a.querySelectorAll('.anneau').forEach(r => { r.style.left = cx + 'px'; r.style.top = cy + 'px'; r.style.marginLeft = (-r.offsetWidth / 2) + 'px'; r.style.marginTop = (-r.offsetHeight / 2) + 'px'; });
  const b = document.createElement('div'); b.id = 'mjpc-bas'; b.textContent = 'monsieurjaipascompris'; att.appendChild(b);
})()`;
const fonte = `(() => { const st = document.createElement('style'); st.textContent = "@font-face{font-family:'EB Garamond';src:url('file:///tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/cap-attente/fonts/node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff2') format('woff2');font-weight:400}@font-face{font-family:'EB Garamond';src:url('file:///tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/cap-attente/fonts/node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-500-normal.woff2') format('woff2');font-weight:500 700}"; document.head.appendChild(st); })()`;
const b = await chromium.launch();
async function page(video){
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: video ? 1 : 2, ...(video ? { recordVideo: { dir: S, size: { width: 1280, height: 720 } } } : {}) });
  await ctx.route('**/*', r => { const u = r.request().url(); if (/firebase|firebaseio|googleapis\.com\/(?!css)|gstatic\.com\/firebasejs|script\.google/.test(u) && !/fonts\.(googleapis|gstatic)/.test(u)) return r.abort(); if (/^https?:/.test(u) && !/fonts\.(googleapis|gstatic)|cdnjs|unpkg|jsdelivr/.test(u)) return r.abort(); return r.continue(); });
  const p = await ctx.newPage(); await p.goto(URL); await p.waitForTimeout(2500); await p.evaluate(fonte); await p.waitForTimeout(600); await p.evaluate(remplir); return { ctx, p };
}
let { ctx, p } = await page(false);
await p.screenshot({ path: S + '/avant.png' });
await p.evaluate(apres); await p.waitForTimeout(800); await p.screenshot({ path: S + '/apres-0.png' }); await p.waitForTimeout(7000); await p.evaluate(remplir); await p.screenshot({ path: S + '/apres-7.png' });
await ctx.close();
({ ctx, p } = await page(true)); await p.evaluate(apres); await p.waitForTimeout(12000); await ctx.close();
await b.close(); console.log('ok');
