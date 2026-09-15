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
const note = (k, v) => console.log(k, '→', typeof v === 'string' ? v.slice(0, 260) : JSON.stringify(v).slice(0, 320));
const W = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
// 1. la loi de taille dans l'existant : la police du corps de diapo est-elle proportionnelle à la boîte ? mesure à deux tailles de fenêtre
const mesureTaille = () => page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const c = d.getElementById('contenu'); const li = c.querySelector('li'); const r = c.getBoundingClientRect(); return { boiteH: Math.round(r.height), boiteW: Math.round(r.width), police: li ? parseFloat(getComputedStyle(li).fontSize) : null, ratio: li ? (parseFloat(getComputedStyle(li).fontSize) / r.height * 100).toFixed(2) + ' %' : null, lignesVisibles: c.querySelectorAll('li:not(.pas)').length, scrollDeborde: c.scrollHeight > c.clientHeight + 2 }; });
for (let k = 0; k < 6; k++) await W(() => document.getElementById('at-dr-iframe').contentWindow.devoile());
note('1. existant à 1366×768 : boîte, police, ratio, déborde', await mesureTaille());
await page.setViewportSize({ width: 1920, height: 1080 }); await pause(600); note('1. existant à 1920×1080', await mesureTaille());
await page.setViewportSize({ width: 1536, height: 864 }); await pause(600); note('1. existant à 1536×864', await mesureTaille());
await nettoyer(); await page.screenshot({ path: 'vis/existant-1536.png' });
// 2. les miniatures de la colonne « Écrans » : montrent-elles le contenu ?
note('2. vignette existante (texte réduit)', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; const v = d.querySelector('[class*=vign] > *, .vg'); return v ? { texte: v.innerText.replace(/\s+/g, ' ').slice(0, 160), police: getComputedStyle(v).fontSize } : 'aucune'; }));
// 3. le sommaire se plie ? (atSomPlier) ; la colonne du chapitre et la colonne des écrans
note('3. plier : fonctions présentes', await W(() => ({ atSomPlier: typeof atSomPlier, atSomOuverte: typeof atSomOuverte, boutons: Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent !== null && /plier|réduire|masquer|rabattre/i.test(b.title + b.textContent)).map(b => b.textContent.trim() || b.title).slice(0, 5) })));
// 4. Ctrl+Z après une prise de parole : annule ?
await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; d.getElementById('vif').focus(); }); await page.keyboard.type('cj'); await pause(150); await page.keyboard.press('1'); await pause(200);
const avant = await W(() => Object.keys(document.getElementById('at-dr-iframe').contentWindow.PARTICIPATION).length);
await page.keyboard.press('Control+z'); await pause(300);
note('4. Ctrl+Z annule la dernière prise ?', { avant, apres: await W(() => Object.keys(document.getElementById('at-dr-iframe').contentWindow.PARTICIPATION).length) });
// 5. surligner par couleur : les quatre couleurs et leur effet sur une sélection
note('5. couleurs de surlignage', await page.evaluate(() => { const d = document.getElementById('at-dr-iframe').contentDocument; return Array.from(d.querySelectorAll('.sw, [class*=coul], [onclick*=hilite], [onclick*=surl]')).slice(0, 6).map(x => ({ t: x.title || x.textContent.trim(), fn: (x.getAttribute('onclick') || '').slice(0, 40) })); }));
// 6. le T-5 réel : à quelle heure surgit-il ? (lu : atT5 déclenché à fin-5 min) et le rattrapage au relancement (joué au tour 112 : « 0 min déjà comptées »)
note('6. T-5 réel : fonctions', await W(() => ({ T5: typeof atT5Modale, verif: typeof _drT5Verif, texte: (document.body.innerText.match(/Il reste 5 minutes|Fin de l.heure/) || [])[0] })));
note('erreurs JS', errs); await nav.close();
