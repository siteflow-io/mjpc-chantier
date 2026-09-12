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
const F = {}; const note = (k, v) => { F[k] = v; console.log(k, '→', typeof v === 'string' ? v.slice(0, 200) : JSON.stringify(v).slice(0, 200)); };
const D = () => page.evaluate(() => document.getElementById('at-dr-iframe').contentDocument);
const W = f => page.evaluate(f);
const cap = async n => { await nettoyer(); await page.screenshot({ path: 'vis/ex-' + n + '.png' }); };
const murTexte = async (tab) => tab ? (await tab.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 300))) : null;
const clic = async (txt) => page.evaluate(t => { const d = document.getElementById('at-dr-iframe').contentDocument; const b = Array.from(d.querySelectorAll('button')).find(x => x.offsetParent !== null && x.innerText.trim().startsWith(t)); if (!b) return false; b.click(); return true; }, txt);
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
note('regime', await W(() => AT_DR_REGIME));
note('tete-classe', await W(() => (document.getElementById('at-dr-tete')||{}).innerText.replace(/\s+/g,' ').slice(0,260)));
// la fenêtre du tableau
const [tab] = await Promise.all([ctx.waitForEvent('page').catch(() => null), page.evaluate(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; if (typeof Wm.tableau === 'function') Wm.tableau(); })]); await pause(1200);
note('tableau-ouvert', !!tab); if (tab) await tab.setViewportSize({ width: 1280, height: 720 });
const etat = () => W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const e = Wm.ECRANS[Wm.i]; return { i: Wm.i, n: Wm.ECRANS.length, rev: e.rev, vues: e.blocs.map(b => b.vues || 0), gele: Wm.gele, iz: Wm.iz }; });
await cap('01-classe');
// 1. dévoiler ×3 par le bouton ▶, puis ◀
for (let k = 0; k < 3; k++) { await W(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(150); }
note('apres-3-devoile', await etat()); note('mur-apres-3', await murTexte(tab));
await W(() => document.getElementById('at-dr-iframe').contentWindow.replie()); await pause(150); note('apres-revoile', await etat());
// 2. aller à la diapo 4 par la vignette : garde ? le mur suit ?
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const v = d.querySelectorAll('#somm .som, .vign, [onclick*="va("]'); }); 
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(3)); await pause(300);
note('apres-va4', await etat()); note('mur-apres-va4', await murTexte(tab)); note('question-avant-va', 'aucune (va() est direct)');
// 3. gel : avancer gelé, le mur ne bouge pas ; dégel : le mur saute
await clic('❄ Gel'); await pause(200); note('gel', await etat());
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(6)); await pause(300); note('mur-pendant-gel', await murTexte(tab)); note('pilote-pendant-gel', await etat());
await clic('❄ Gel'); await pause(300); note('mur-apres-degel', await murTexte(tab));
// 4. retour à la diapo 1, mettre en lumière une étape, à écrire
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(0)); await pause(300);
await clic('✦ Mettre en lumière'); await pause(150); await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const li = d.querySelector('#contenu li[data-p]'); if (li) li.click(); }); await pause(300);
note('lumiere-mur', await tab.evaluate(() => Array.from(document.querySelectorAll('.lum, .spot, [class*=lum]')).map(e => e.className + ':' + (e.innerText||'').slice(0,40)).slice(0,3)));
await cap('02-lumiere');
// 5. zoom : réglette 32pt → cran 4 : scission ? au mur ?
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const r = d.getElementById('rz'); r.value = 4; r.dispatchEvent(new Event('input', { bubbles: true })); }); await pause(800);
note('apres-zoom-4', await etat()); note('mur-apres-zoom', await murTexte(tab)); await cap('03-zoom4');
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const r = d.getElementById('rz'); r.value = 0; r.dispatchEvent(new Event('input', { bubbles: true })); }); await pause(800);
note('apres-dezoom', await etat());
// 6. chrono : Départ, chrono au tableau
await clic('Départ'); await pause(200); await clic('Chrono au tableau'); await pause(400); note('chrono-mur', await tab.evaluate(() => { const c = document.querySelector('#chr, .chrono, [id*=chrono]'); return c ? c.innerText : 'aucun'; }));
// 7. écrire une réponse dans la question-bilan (diapo 8) : visible au mur pendant la frappe ?
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(7)); await pause(400);
const champ = await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const els = Array.from(d.querySelectorAll('#contenu [contenteditable], #contenu input, #contenu textarea')); return els.map(e => e.tagName + ' ' + (e.dataset.p||e.id||'')).slice(0,6); });
note('champs-editables-question', champ);
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const r = d.querySelector('#contenu [data-p$=".r.0"], #contenu [data-p*=".r."]'); if (r) { r.focus(); } }); await pause(100);
await page.keyboard.type('Le voyageur est de dos', { delay: 5 }); await pause(400);
note('mur-pendant-frappe-reponse', (await murTexte(tab)).includes('voyageur') ? 'la réponse est au mur pendant la frappe' : 'la réponse N EST PAS au mur pendant la frappe');
await page.keyboard.press('Enter'); await pause(400);
note('mur-apres-entree', (await murTexte(tab)).includes('voyageur') ? 'au mur après Entrée' : 'toujours pas au mur après Entrée');
note('etat-question', await etat()); await cap('04-reponse');
// 8. retoucher une étape grisée en classe : possible ?
await W(() => document.getElementById('at-dr-iframe').contentWindow.va(0)); await pause(300);
const gris = await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const li = d.querySelector('#contenu li[data-p="0.et.4"], #contenu li[data-p$=".et.4"]'); return li ? { editable: li.isContentEditable, classe: li.className } : null; });
note('etape-grisee-editable', gris);
// 9. clic droit sur une vignette en classe : le menu ?
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const v = d.querySelector('.vg, .vignette, [onclick*="va("]'); if (v) v.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 300, clientY: 400 })); }); await pause(300);
note('menu-clic-droit-classe', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const m = d.querySelector('#ctx, .ctx, .menu'); return m && m.offsetParent !== null ? m.innerText.replace(/\s+/g,' ').slice(0,200) : 'aucun menu visible'; }));
await page.keyboard.press('Escape');
// 10. notes / commentaires / absents dans le pilotage ?
note('champ-notes', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; return !!(d.querySelector('[id*=note], textarea') ); }));
note('absents-pilotage', await W(() => !!document.querySelector('#at-dr-tete [onclick*=bsen], #at-dr-tete [id*=absent]')));
// 11. appoint : taper une notion
await page.evaluate(() => { const i = document.getElementById('at-dr-comp'); i.value = 'litt-036'; i.dispatchEvent(new Event('change')); }); await pause(300);
note('appoint-comp', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; return Wm.ECRANS[Wm.i].comp; }));
// 12. relecture et papier (onglets)
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="relecture"]').click()); await pause(1500);
note('relecture', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const v = d.getElementById('v-relecture'); return v ? v.innerText.replace(/\s+/g,' ').slice(0,700) : 'pas de vue'; }));
await cap('05-relecture');
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="papier"]').click()); await pause(1200);
note('papier', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const v = d.getElementById('v-papier'); return v ? v.innerText.replace(/\s+/g,' ').slice(0,300) : 'pas de vue'; }));
await cap('06-papier');
// 13. clore la séance
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(1200);
await cliquerTexte('#at-dr-tete button', 'Clore'); await pause(1500);
note('cloture', await W(() => Array.from(document.querySelectorAll('.at-modale')).filter(m => m.offsetParent !== null).map(m => m.innerText.replace(/\s+/g,' ').slice(0,400))));
await cap('07-cloture');
note('ecritures-hub', await W(() => window.__ECR.length));
note('erreurs', errs);
fs.writeFileSync('vis/existant.json', JSON.stringify(F, null, 1)); await nav.close();
