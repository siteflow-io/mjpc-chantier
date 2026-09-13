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
const F = {}; const note = (k, v) => { F[k] = v; console.log(k, '→', typeof v === 'string' ? v.slice(0, 240) : JSON.stringify(v).slice(0, 240)); };
const W = (f, a) => page.evaluate(f, a);
const murTexte = async () => page.evaluate(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const d = document.createElement('div'); d.innerHTML = (typeof Wm.scene === 'function') ? Wm.scene() : '(pas de scene())'; return d.innerText.replace(/\s+/g, ' ').slice(0, 260); });
const cap = async (n) => { await nettoyer(); await page.screenshot({ path: 'vis/bl-' + n + '-pilote.png' }); await tab.screenshot({ path: 'vis/bl-' + n + '-mur.png' }); };
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
// aller à la séance 2 (schéma d14, fiche d15) : la colonne du chapitre
await page.evaluate(() => atSomAllerEcran(0, 1)); await pause(3000);
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
const tab = { evaluate: async f => page.evaluate(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const d = document.createElement('div'); d.innerHTML = Wm.scene ? Wm.scene() : ''; return { innerText: d.innerText, querySelectorAll: null }; }), screenshot: async o => page.screenshot(o) };
note('seance', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; return { n: Wm.ECRANS.length, types: Wm.ECRANS.map(e => e.blocs.map(b => b.t).join('+')).slice(0, 16) }; }));
const va = async (i) => { await W(k => document.getElementById('at-dr-iframe').contentWindow.va(k), i); await pause(400); };
const dev = async (n) => { for (let k = 0; k < n; k++) { await W(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(150); } };
// 1. le schéma (d14 → index 13)
const iSch = await W(() => document.getElementById('at-dr-iframe').contentWindow.ECRANS.findIndex(e => e.blocs[0] && e.blocs[0].t === 'schema'));
note('index-schema', iSch); if (iSch >= 0) { await va(iSch); await dev(2); note('schema-etat', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const e = Wm.ECRANS[Wm.i]; return { rev: e.rev, vues: e.blocs[0].vues, forme: e.blocs[0].forme, noeuds: (e.blocs[0].n || e.blocs[0].nodes || []).length }; }));
  note('schema-mur', await murTexte(tab)); note('schema-pilote-rendu', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const sch = d.querySelector('#contenu .schema, #contenu [class*=schema]'); return { svg: d.querySelectorAll('#contenu svg').length, schemaEl: sch ? sch.className : null, enfants: sch ? sch.querySelectorAll('*').length : 0, html: d.querySelector('#contenu').innerHTML.slice(0, 300) }; })); await cap('01-schema');
  // préhension : déplacer un nœud
  const bb = await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const n = d.querySelector('#contenu .sch-n, #contenu .sn, #contenu [class*=noeud], #contenu [class*=etiq]:not(.act), #contenu .schema div div'); if (!n) return null; const r = n.getBoundingClientRect(); const f = d.getElementById && document.getElementById('at-dr-iframe').getBoundingClientRect(); return { x: r.x + f.x + r.width / 2, y: r.y + f.y + r.height / 2, cls: n.className && n.className.baseVal || n.className }; });
  note('schema-noeud', bb); if (bb) { await page.mouse.move(bb.x, bb.y); await page.mouse.down(); await page.mouse.move(bb.x + 80, bb.y + 40, { steps: 8 }); await page.mouse.up(); await pause(400); note('schema-apres-deplacement', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const b = Wm.ECRANS[Wm.i].blocs[0]; return { pos: JSON.stringify(b.pos || b.xy || b.n || '').slice(0, 160) }; })); await cap('02-schema-deplace'); } }
// 2. la fiche (d15 → index 14) : dévoiler, surligner dans la fiche (annot), à écrire
const iFi = await W(() => document.getElementById('at-dr-iframe').contentWindow.ECRANS.findIndex(e => e.blocs[0] && e.blocs[0].t === 'fiche'));
note('index-fiche', iFi); if (iFi >= 0) { await va(iFi); await dev(2); note('fiche-mur', await murTexte(tab)); await cap('03-fiche');
  // surligner : sélectionner un mot du corps puis couleur
  await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const c = d.querySelector('#contenu .fcorps, #contenu [data-p$=".corps"], #contenu .fiche p'); if (c) { const s = d.getSelection(); const rg = d.createRange(); rg.selectNodeContents(c.firstChild || c); rg.setEnd(c.firstChild || c, Math.min(12, (c.firstChild||c).length || 12)); s.removeAllRanges(); s.addRange(rg); } });
  await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const b = d.querySelector('.sw, [onclick*="hilite"], [onclick*="surligne"]'); if (b) b.click(); }); await pause(400);
  note('fiche-annot', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const e = Wm.ECRANS[Wm.i]; return { annot: (e.blocs[0].annot || '').slice(0, 120), mark: (e.blocs[0].corps || '').includes('<mark') }; }));
  note('fiche-pilote-mark', await page.evaluate(() => document.getElementById('at-dr-iframe').contentDocument.querySelectorAll('#contenu mark').length)); await cap('04-fiche-surlignee'); }
// 3. l'image (séance 1 d2) : les marques ; le bloc image a-t-il des marques ? on va dans la séance 1
// l'image : dans la séance 2, la diapo 1 est une image (Turner)
await va(0); try { await dev(1); } catch (e) { note('image-devoile-erreur', String(e.message).slice(0, 160)); }
note('image-etat', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; const e = Wm.ECRANS[Wm.i]; return { rev: e.rev, vues: e.blocs[0].vues, mk: (e.blocs[0].mk || e.blocs[0].marques || []).length, ref: (e.blocs[0].ref||'').slice(0,40) }; }));
note('image-pilote', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; return { img: d.querySelectorAll('#contenu img').length, mk: d.querySelectorAll('#contenu .mk, #contenu [class*=marq]').length }; })); await cap('05-image');
// poser une marque en classe ? (armeMk)
note('armeMk-existe', await W(() => typeof document.getElementById('at-dr-iframe').contentWindow.armeMk));
note('rappel-existe', await W(() => { const Wm = document.getElementById('at-dr-iframe').contentWindow; return { ouvrirRappel: typeof Wm.ouvrirRappel, poseRappel: typeof Wm.poseRappel }; }));
note('bouton-rappel', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const b = Array.from(d.querySelectorAll('button')).filter(x => x.offsetParent !== null).map(x => x.innerText.trim()).filter(Boolean); return b.slice(0, 30); }));
fs.writeFileSync('vis/blocs.json', JSON.stringify(F, null, 1)); note('erreurs', errs); await nav.close();
