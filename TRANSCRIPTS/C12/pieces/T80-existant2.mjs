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
const cap = async n => { await nettoyer(); await page.screenshot({ path: 'vis/ex-' + n + '.png' }); };
const murTexte = async (tab) => tab ? (await tab.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 200))) : null;
const clic = async (txt) => page.evaluate(t => { const d = document.getElementById('at-dr-iframe').contentDocument; const b = Array.from(d.querySelectorAll('button')).find(x => x.offsetParent !== null && x.innerText.trim().startsWith(t)); if (!b) return false; b.click(); return true; }, txt);
page.on('dialog', async d => { note('dialog', d.type() + ' : ' + d.message().slice(0, 200)); await d.accept(); });
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
const [tab] = await Promise.all([ctx.waitForEvent('page').catch(() => null), page.evaluate(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; Wm.tableau(); })]); await pause(1200); await tab.setViewportSize({ width: 1280, height: 720 });
const etat = () => W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const e = Wm.ECRANS[Wm.i]; return { i: Wm.i, act: e.act, rev: e.rev, vues: e.blocs.map(b => b.vues || 0), gele: Wm.gele }; });
// A. gel sur des diapos texte : diapo 1 dévoilée, gel, aller à la diapo 7 (texte), le mur ?, dégel, le mur ?
for (let k = 0; k < 3; k++) { await W(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(120); }
note('A0-mur', await murTexte(tab));
await clic('❄ Gel'); await pause(200); await W(() => document.getElementById('at-dr-iframe').contentWindow.va(6)); await pause(400);
note('A1-pilote-gele', await etat()); note('A1-mur-gele', await murTexte(tab));
await clic('❄ Gel'); await pause(400); note('A2-mur-degele', await murTexte(tab)); note('A2-question', 'aucune question au dégel');
// B. mettre en lumière : le mur porte-t-il la marque ?
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(0)); await pause(300);
await clic('✦ Mettre en lumière'); await pause(150);
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const li = d.querySelector('#contenu li[data-p="0.et.0"]'); if (li) li.click(); }); await pause(400);
note('B-mur-html', await tab.evaluate(() => { const li = document.querySelector('li'); return li ? (li.className + ' | ' + li.getAttribute('style')) : 'aucun li'; }));
note('B-pilote-li', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const li = d.querySelector('#contenu li[data-p="0.et.0"]'); return li ? li.className + ' | ' + (li.getAttribute('style')||'') : 'aucun'; }));
await cap('08-lumiere-pilote'); await tab.screenshot({ path: 'vis/ex-08-lumiere-mur.png' });
// C. réponse dans la question : dévoiler le bloc d'abord, puis frapper ; le mur pendant la frappe / après Entrée
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(7)); await pause(300);
await W(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(200);   // ouvre la question
note('C0-etat', await etat());
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const r = d.querySelector('#contenu [data-p="0.r.0"]'); if (r) r.focus(); }); await pause(100);
await page.keyboard.type('Le voyageur est de dos', { delay: 5 }); await pause(400);
note('C1-mur-pendant-frappe', (await murTexte(tab)).includes('voyageur') ? 'VISIBLE au mur pendant la frappe' : 'PAS visible au mur pendant la frappe');
await page.keyboard.press('Enter'); await pause(400);
note('C2-mur-apres-entree', (await murTexte(tab)).includes('voyageur') ? 'visible au mur après Entrée' : 'pas visible après Entrée'); note('C2-etat', await etat());
await cap('09-reponse-pilote'); await tab.screenshot({ path: 'vis/ex-09-reponse-mur.png' });
// D. clic droit sur une vignette de la colonne des écrans, en classe
const vg = await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const v = d.querySelector('#vignettes .vg, .vig, #vign .v, [class*=vign]'); return v ? v.className : null; });
note('D0-vignette-classe', vg);
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const v = d.querySelector('[class*=vign] > *') || d.querySelector('[class*=vign]'); if (v) v.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 380, clientY: 450 })); }); await pause(300);
note('D1-menu', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const ms = Array.from(d.querySelectorAll('div')).filter(x => x.offsetParent !== null && /Supprimer l.écran|Dupliquer l.écran/.test(x.innerText)); return ms.length ? ms[0].innerText.replace(/\s+/g,' ').slice(0,200) : 'aucun menu'; }));
await cap('10-clic-droit'); await page.keyboard.press('Escape');
// E. clore la séance
await cliquerTexte('#at-dr-tete button', 'Clore'); await pause(1500);
note('E-modales', await W(() => Array.from(document.querySelectorAll('.at-modale, [class*=modale]')).filter(m => m.offsetParent !== null).map(m => m.innerText.replace(/\s+/g,' ').slice(0,300))));
await cap('11-cloture');
fs.writeFileSync('vis/existant2.json', JSON.stringify(F, null, 1)); note('erreurs', errs); await nav.close();
