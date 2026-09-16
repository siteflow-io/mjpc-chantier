import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
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
import fs from 'fs';
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await page.evaluate(() => atSomAllerEcran(0, 1)); await pause(3000);
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.tableau())]); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await pause(1200);
const PROPS = ['fontFamily', 'fontWeight', 'fontStyle', 'color', 'backgroundColor', 'borderTopStyle', 'borderTopColor', 'borderTopWidth', 'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 'borderRadius', 'letterSpacing', 'textTransform', 'opacity', 'boxShadow', 'animationName', 'animationIterationCount', 'animationDuration', 'textAlign', 'paddingLeft', 'display'];
const mesure = (pg, base, sels, baseFs) => pg.evaluate(([base, sels, PROPS, baseFs]) => { const doc = document; const b = doc.querySelector(base); const H = baseFs ? parseFloat(getComputedStyle(doc.querySelector(baseFs)).fontSize) : parseFloat(getComputedStyle(b).fontSize); const out = {}; for (const [nom, sel] of sels) { const [s0, pseudo] = sel.split('::'); const el = s0 === '.' ? b : doc.querySelector(s0.startsWith('!') ? s0.slice(1) : base + ' ' + s0); if (!el) { out[nom] = null; continue; } const cs = pseudo ? getComputedStyle(el, '::' + pseudo) : getComputedStyle(el); const o = {}; for (const k of PROPS) o[k] = cs[k]; o.fsRatio = (parseFloat(cs.fontSize) / H).toFixed(3); out[nom] = o; } return out; }, [base, sels, PROPS, baseFs || null]);
// a. l'attente (le tableau avant le premier envoi) — le tableau vient d'être ouvert : #att visible
const ATT = [['attente (fond)', '!#att'], ['attente · heure', '!#att .h'], ['attente · date', '!#att .d'], ['attente · nom', '!#att .n'], ['attente · classe', '!#att .c']];
const ra = await mesure(tab, 'body', ATT, '#att .h');
// b. la fiche (d15) et le schéma (d14) de la séance 2, dévoilés ; un mark posé par le surlignage de l'existant ; l'arrivée mesurée juste après un dévoilement
const va = async i => { await page.evaluate(k => { const W = document.getElementById('at-dr-iframe').contentWindow; W.va(k); W.envoie(); }, i); await pause(500); };
const dev = async n => { for (let k = 0; k < n; k++) { await page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(250); } };
const iSch = await page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.ECRANS.findIndex(e => e.blocs[0] && e.blocs[0].t === 'schema')); await va(iSch); await dev(2);
const rsch = await mesure(tab, '.e', [['schéma · titre', '.sch-t'], ['schéma (bloc)', '.sch']]);
const iFi = await page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.ECRANS.findIndex(e => e.blocs[0] && e.blocs[0].t === 'fiche')); await va(iFi); await dev(2);
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; const e = W.ECRANS[W.i]; const b = e.blocs[0]; if (b.def && !/<mark>/.test(b.def)) b.def = b.def.replace(/^(\S+\s+\S+)/, '<mark>$1</mark>'); W.rendre(); W.envoie(); }); await pause(400);
await page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(150);
const FI = [['fiche', '.fiche'], ['fiche · type', '.fiche .tt'], ['fiche · titre', '.fiche h3'], ['fiche · définition', '.fiche .def'], ['surligné (mark)', 'mark'], ['ce qui vient d\'arriver (neuf-vu)', '.neuf-vu']];
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; W.ECRANS[W.i].blocs[0].vues = 2; W.rendre(); W.envoie(); }); await pause(300); await page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(150);
const rb = Object.assign(await mesure(tab, '.e', FI), rsch);
// c. « qui a participé » : deux prises, puis la boîte au tableau
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; W.PARTICIPATION['CJ'] = { n: 2, l: [] }; W.PARTICIPATION['ZE'] = { n: 1, l: [] }; W.quiParle(); }); await pause(400);
const QUI = [['qui · voile', '!.quiw'], ['qui · boîte', '!.quib'], ['qui · titre', '!.quit'], ['qui · liste', '!.quil'], ['qui · numéro', '!.qn']];
const rc = await mesure(tab, 'body', QUI, '.e');
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; W.quiParle(); }); await pause(200);
// d. la sortie d'écran (zoom arrière) : juste après un changement d'écran
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; W.va(W.i + 1); W.envoie(); }); await pause(120);
const SO = [['écran sortant', '!.ecran-sortie'], ['écran entrant', '!.e']];
const rd = await mesure(tab, 'body', SO, '.e');
const res = Object.assign({}, ra, rb, rc, rd); fs.writeFileSync('/home/claude/vis/visuels2-existant.json', JSON.stringify(res, null, 1));
console.log('existant (2) mesuré :', Object.keys(res).filter(k => res[k]).length, '/', Object.keys(res).length, '; absents :', Object.keys(res).filter(k => !res[k]).join(', ') || 'aucun', '; erreurs :', errs.length);
await nav.close();
