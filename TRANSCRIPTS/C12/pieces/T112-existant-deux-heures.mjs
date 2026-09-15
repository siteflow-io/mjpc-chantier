import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const store = { classes: J('banc/hub/classes.json'), site: { '3e': J('banc/hub/site_3e.json'), config: J('banc/hub/site_config.json'),
  edt: { grille: { '2026-2027': J('banc/grille-appariee.json') }, calendrier: { '2026-2027': J('banc/calendrier.json') }, creneaux: { '2026-2027': J('banc/creneaux.json') } } } };
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date("2026-09-08T10:12:00+02:00"));
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
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async n => { await page.screenshot({ path: 'vis/'+n+'.png' }); };
const cliquerTexte = async (sel, txt) => page.evaluate(({s, t}) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent!==null && ((x.innerText||'')+(x.getAttribute('onclick')||'')).indexOf(t)>=0)[0]; if(!el) return false; el.click(); return true; }, {s: sel, t: txt});
const jrn = []; const dit = t => { jrn.push(t); console.log(t); };
const modales = () => page.evaluate(() => Array.from(document.querySelectorAll('.at-modale, #edt-modale, #edt-ecran, #tprof, .tprof, #at-zone, #doc-viewer')).filter(e => e.offsetParent!==null).map(e => (e.id||e.className)+' ['+((e.innerText||'').trim().replace(/\s+/g,' ').slice(0,70))+']'));
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
const note = (k, v) => console.log(k, '→', typeof v === 'string' ? v.slice(0, 260) : JSON.stringify(v).slice(0, 260));
const W = (f, a) => page.evaluate(f, a);
page.on('dialog', async d => { note('dialog', d.type() + ' : ' + d.message().slice(0, 160)); await d.accept(); });
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
// H1 : dévoiler, aller à la diapo 4, clore
for (let k = 0; k < 3; k++) { await W(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(100); }
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(3)); await pause(300);
note('H1 avant clôture', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; return { i: Wm.i, rev0: Wm.ECRANS[0].rev, vues0: Wm.ECRANS[0].blocs[0].vues, n: Wm.ECRANS.length }; }));
await cliquerTexte('#at-dr-tete button', 'Clore'); await pause(1200);
note('modale de clôture', await W(() => Array.from(document.querySelectorAll('.at-modale, [class*=modale], .at-dr-modale')).filter(m => m.offsetParent !== null).map(m => m.innerText.replace(/\s+/g, ' ').slice(0, 200))));
await cliquerTexte('button', 'Oui, continuer'); await pause(1500);
note('après clôture : régime', await W(() => ({ regime: AT_DR_REGIME, tete: (document.getElementById('at-dr-tete') || {}).innerText.replace(/\s+/g, ' ').slice(0, 200) })));
note('écritures au faux hub à la clôture', await W(() => window.__ECR.slice(-6).map(x => x.replace(/^[A-Z]+ /, '').replace('https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app', '').slice(0, 90))));
const heures = await W(() => new Promise(r => { fetch('https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/site/3e/chapitres/1/seances/1/heures.json').then(x => x.json()).then(r).catch(() => r('erreur')); }));
note('heures écrites au faux hub (clés)', typeof heures === 'object' && heures ? Object.keys(heures) : heures);
// H2 : relancer la même séance
await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
note('H2 : ce que le site fait au relancement', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; return { regime: AT_DR_REGIME, i: Wm.i, rev0: Wm.ECRANS[0].rev, vues0: Wm.ECRANS[0].blocs[0].vues, tete: (document.getElementById('at-dr-tete') || {}).innerText.replace(/\s+/g, ' ').slice(0, 240) }; }));
note('modale au relancement', await W(() => Array.from(document.querySelectorAll('.at-modale, [class*=modale]')).filter(m => m.offsetParent !== null).map(m => m.innerText.replace(/\s+/g, ' ').slice(0, 300))));
await nettoyer(); await page.screenshot({ path: 'vis/deuxheures-H2.png' });
note('erreurs JS', errs); await nav.close();
