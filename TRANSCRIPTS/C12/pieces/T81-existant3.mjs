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
const F = {}; const note = (k, v) => { F[k] = v; console.log(k, '→', typeof v === 'string' ? v.slice(0, 220) : JSON.stringify(v).slice(0, 220)); };
const W = f => page.evaluate(f);
const murTexte = async (tab) => (await tab.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 300)));
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
const [tab] = await Promise.all([ctx.waitForEvent('page').catch(() => null), page.evaluate(() => { document.getElementById('at-dr-iframe').contentWindow.tableau(); })]); await pause(1200); await tab.setViewportSize({ width: 1280, height: 720 });
const etat = () => W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const e = Wm.ECRANS[Wm.i]; return { i: Wm.i, rev: e.rev, vues: e.blocs.map(b => b.vues || 0), reps: (e.blocs[0].reps||[]).map(r => (r.i||'')+':'+(r.r||'').slice(0,25)) }; });
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(7)); await pause(400);
// cas 1 : bloc question ouvert d'un seul ▶ (rev 1)
await W(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(200); note('1-etat', await etat()); note('1-mur', await murTexte(tab));
// ajouter une réponse d'élève : curseur en fin de la dernière réponse, Entrée → nouvelle ligne
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const r = d.querySelector('#contenu [data-p="0.r.0"]'); r.focus(); const s = d.getSelection(); const rg = d.createRange(); rg.selectNodeContents(r); rg.collapse(false); s.removeAllRanges(); s.addRange(rg); });
await page.keyboard.press('Enter'); await pause(300); note('2-apres-Entree', await etat());
note('2-focus', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const a = d.activeElement; return a ? (a.tagName + ' ' + (a.dataset.p||'')) : 'aucun'; }));
await page.keyboard.type('ZP', { delay: 5 }); await page.keyboard.press('Tab'); await pause(100);
note('3-focus-apres-Tab', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const a = d.activeElement; return a ? (a.tagName + ' ' + (a.dataset.p||'')) : 'aucun'; }));
await page.keyboard.type('Le voyageur est de dos', { delay: 5 }); await pause(400);
note('3-etat-pendant-frappe', await etat()); note('3-mur-pendant-frappe', (await murTexte(tab)).includes('voyageur') ? 'VISIBLE au mur' : 'PAS visible au mur'); note('3-mur-texte', await murTexte(tab));
await page.keyboard.press('Enter'); await pause(400); note('4-etat-apres-Entree', await etat()); note('4-mur-apres-Entree', (await murTexte(tab)).includes('voyageur') ? 'VISIBLE au mur' : 'PAS visible au mur');
await nettoyer(); await page.screenshot({ path: 'vis/ex-12-reponse-eleve-pilote.png' }); await tab.screenshot({ path: 'vis/ex-12-reponse-eleve-mur.png' });
// cas 2 : un second ▶ (rev 2) : le bloc est-il montré, la réponse avec ?
await W(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(300); note('5-etat-apres-2e-devoile', await etat()); note('5-mur', await murTexte(tab));
await tab.screenshot({ path: 'vis/ex-13-reponse-eleve-mur-apres-2e-devoile.png' });
fs.writeFileSync('vis/existant3.json', JSON.stringify(F, null, 1)); note('erreurs', errs); await nav.close();
