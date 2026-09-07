import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const store = { classes: J('banc/hub/classes.json'), site: { '3e': J('banc/hub/site_3e.json'), config: J('banc/hub/site_config.json') } };
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 } });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0,160)));
await page.addInitScript(s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; }
    if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) {
      const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push(m+' '+c); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 }));
    }
    return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function(){ throw new Error('websocket bloqué'); };
}, store);
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove();
  document.querySelectorAll('button').forEach(x => { if (/^\s*Compris\s*$/.test(x.textContent)) x.click(); }); });
const shot = async n => { await nettoyer(); await page.screenshot({ path: 'vis/'+n+'.png' }); };
const cliquerTexte = async (sel, txt) => page.evaluate(({s, t}) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent!==null && ((x.innerText||'')+(x.getAttribute('onclick')||'')).indexOf(t)>=0)[0]; if(!el) return false; el.click(); return true; }, {s: sel, t: txt});
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(300);
await page.click('#tprof-btn'); await pause(500);
await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800);
await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
const fr = page.frameLocator('#at-dr-iframe');
const relever = () => page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow;
  const E = W.ECRANS; return { i: W.i, iz: W.iz, n: E.length, rz: W.document.getElementById('rz').value,
    ecrans: E.map((e,k) => ({k, act: (e.act||'').slice(0,30), grp: e.grp||'', suite: e.suite||0, rev: e.rev,
      blocs: e.blocs.map(b => ({t: b.t, frag: b.frag||'', nEt: (b.etapes||[]).length, lens: (b.etapes||[]).map(x => String(x).length), txt: (b.txt||'').slice(0,40)})) })) }; });
const texteEcran0 = () => page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; const E=W.ECRANS;
  // toutes les étapes de la consigne de l'écran 0 + ses suites (même grp), concaténées
  const g=E[0].grp; const parts=E.filter((e,k)=>k===0||(g&&e.grp===g)); return parts.map(e=>e.blocs.map(b=>(b.txt||'')+'|'+(b.etapes||[]).join('¶')).join('§')).join('#'); });
const setCran = async v => { await page.evaluate(v => { const D = document.getElementById('at-dr-iframe').contentDocument; const r = D.getElementById('rz'); r.value = v; r.dispatchEvent(new Event('input', {bubbles:true})); }, v); await pause(1200); };
const jrn = [];
const dit = t => { jrn.push(t); console.log(t); };
const r0 = await relever(); dit('DÉPART — écran '+(r0.i+1)+'/'+r0.n+', cran '+r0.rz+' : '+JSON.stringify(r0.ecrans[0]));
const t0 = await texteEcran0(); dit('texte écran 1 au départ ('+t0.length+' signes) : '+t0.slice(0,120)+'…');
await shot('z00-cran-depart');
for (const v of [1,2,3,4]) {
  await setCran(v);
  const r = await relever();
  const g = r.ecrans[0].grp; const groupe = r.ecrans.filter((e,k) => k===0 || (g && e.grp===g));
  dit('MONTÉE cran '+v+' → '+r.n+' écrans, écran courant '+(r.i+1)+' ; le groupe de l\'écran 1 = '+groupe.length+' morceau(x) : '+JSON.stringify(groupe.map(e => e.blocs.map(b => b.nEt+' étapes'+(b.frag?' ['+b.frag+']':'')))));
  await shot('z0'+v+'-montee-cran-'+v);
}
const tHaut = await texteEcran0(); dit('texte du groupe au cran 4 ('+tHaut.length+' signes) — identique au départ ? '+(tHaut.replace(/[#§¶|]/g,'')===t0.replace(/[#§¶|]/g,'')));
for (const v of [3,2,1,0]) {
  await setCran(v);
  const r = await relever();
  const g = r.ecrans[0].grp; const groupe = r.ecrans.filter((e,k) => k===0 || (g && e.grp===g));
  dit('DESCENTE cran '+v+' → '+r.n+' écrans, écran courant '+(r.i+1)+' ; groupe de l\'écran 1 = '+groupe.length+' : '+JSON.stringify(groupe.map(e => e.blocs.map(b => b.nEt+' étapes'+(b.frag?' ['+b.frag+']':'')))));
}
await shot('z09-retour-cran-0');
const t1 = await texteEcran0();
dit('texte écran 1 après retour ('+t1.length+' signes) — identique au départ ? '+(t1===t0));
if (t1!==t0) { dit('AVANT : '+t0); dit('APRÈS : '+t1); }
dit('écritures au faux hub : '+JSON.stringify(await page.evaluate(() => window.__ECR)));
dit('erreurs JS : '+JSON.stringify(errs));
fs.writeFileSync('vis/zoom-journal.txt', jrn.join('\n'));
await nav.close();
