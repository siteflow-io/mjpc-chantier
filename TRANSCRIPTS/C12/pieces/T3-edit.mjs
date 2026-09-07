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
const relever = () => page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow;
  const E = W.ECRANS; return { i: W.i, iz: W.iz, n: E.length,
    ecrans: E.slice(0,4).map((e,k) => ({k, act: (e.act||'').slice(0,30), grp: e.grp||'', suite: e.suite||0, rev: e.rev,
      blocs: e.blocs.map(b => ({t: b.t, frag: b.frag||'', nEt: (b.etapes||[]).length, lens: (b.etapes||[]).map(x => String(x).length)})) })) }; });
const jrn = []; const dit = t => { jrn.push(t); console.log(t); };
const F = () => page.frameLocator('#at-dr-iframe');
dit('DÉPART : '+JSON.stringify((await relever()).ecrans[0]));
// clic dans l'étape 3 de l'écran 1 (la plus longue, 159 signes), puis frappe
const etape = F().locator('#contenu li[data-p="0.et.2"], #contenu li[data-s="0.0.2"]').first();
dit('étape 3 trouvée : '+await etape.count());
await nettoyer(); await etape.click(); await pause(300);
const focus0 = await page.evaluate(() => { const D=document.getElementById('at-dr-iframe').contentDocument; const a=D.activeElement; return a? (a.tagName+' '+(a.dataset.p||'')+' | '+(a.textContent||'').slice(0,60)) : 'rien'; });
dit('focus après clic : '+focus0);
await page.keyboard.press('End');
const phrase = ' Puis je note, pour chaque tableau, la couleur dominante, la lumière, le cadrage et ce que le peintre a voulu que je ressente devant la scène représentée.';
// on tape phrase par phrase, comme Paul, en relevant après chaque phrase
for (let n=1; n<=4; n++) {
  await page.keyboard.type(phrase, { delay: 2 }); await pause(700);
  const r = await relever();
  const f = await page.evaluate(() => { const D=document.getElementById('at-dr-iframe').contentDocument; const a=D.activeElement; return a? (a.tagName+' '+(a.dataset.p||'')+' sur écran '+(D.defaultView.i+1)) : 'rien'; });
  dit('après phrase '+n+' → '+r.n+' écrans, écran courant '+(r.i+1)+', focus : '+f+' ; écran 1 = '+JSON.stringify(r.ecrans[0].blocs)+(r.ecrans[1].suite?' ; suite = '+JSON.stringify(r.ecrans[1].blocs):''));
  await shot('e0'+n+'-frappe-'+n);
}
// le texte total de l'étape 3, recollé sur écran + suites
const total = await page.evaluate(() => { const W=document.getElementById('at-dr-iframe').contentWindow; const E=W.ECRANS; const g=E[0].grp;
  return E.filter((e,k)=>k===0||(g&&e.grp===g)).map(e=>e.blocs.map(b=>(b.etapes||[]).map(x=>String(x).replace(/<[^>]+>/g,'')).join('¶')).join('§')).join('#'); });
dit('étapes après frappe (toutes, écran + suites) : '+total.length+' signes');
dit('la phrase tapée 4 fois est-elle présente 4 fois ? '+(total.split('Puis je note').length-1)+' fois');
dit('écritures au faux hub : '+JSON.stringify(await page.evaluate(() => window.__ECR)));
dit('erreurs JS : '+JSON.stringify(errs));
fs.writeFileSync('vis/edit-journal.txt', jrn.join('\n'));
await nav.close();
