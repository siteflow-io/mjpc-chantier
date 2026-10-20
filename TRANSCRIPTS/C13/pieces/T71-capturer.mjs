// Captures de l'existant réel (index.html 8.74.0-③ sur le faux hub in-page de la n°12, T80) et de la maquette p8-5g — pour les visuels de la proposition 96
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const ici = path.dirname(new URL(import.meta.url).pathname);
const J = f => JSON.parse(fs.readFileSync(path.join(ici, 'hub', f), 'utf8'));
const store = { classes: J('classes.json'), site: { '3e': J('site_3e.json'), config: J('site_config.json'),
  edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
const nav = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date('2026-10-20T15:07:00+02:00'));
const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
await page.addInitScript(s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) { const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''); const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); pos(c, bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); }
    return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); };
}, store);
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const cap = async n => { await nettoyer(); await page.screenshot({ path: path.join(ici, 'vis', n + '.png') }); console.log('capture', n); };
const cliquerTexte = async (sel, txt) => page.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });

await page.goto('file://' + path.join(ici, 'index.html') + '?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800);
await cap('A1-arborescence-des-chapitres');
console.log('boutons visibles de l\'arborescence :', await page.evaluate(() => Array.from(document.querySelectorAll('#at-zone button')).filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(Boolean).slice(0, 40).join(' | ')));
await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await cap('A2-structure-editeur-de-chapitre');
console.log('barre des vues :', await page.evaluate(() => Array.from(document.querySelectorAll('.at-vues-barre .at-onglet')).map(b => b.dataset.vue + (b.classList.contains('at-onglet-actif') ? '*' : '')).join(' ')), '| DR :', await page.evaluate(() => typeof window.DR));
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await cap('A3-vue-deroule');
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="relecture"]').click()); await pause(2000);
await cap('A4-vue-relecture');
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="papier"]').click()); await pause(2000);
await cap('A5-vue-papier');
console.log('écritures au hub :', await page.evaluate(() => window.__ECR.length), '| erreurs JS :', errs);

// la maquette p8-5g
const pm = await ctx.newPage(); await pm.goto('file://' + path.join(ici, 'maquette-p8-5g.html')); await pause(800);
const capm = async n => { await pm.screenshot({ path: path.join(ici, 'vis', n + '.png') }); console.log('capture', n); };
await pm.click('[data-atelier]'); await pause(500); if (await pm.$('#at-aide .x')) await pm.click('#at-aide .x'); await pause(300);
await capm('B1-maquette-atelier');
await pm.click('#ong-pilotage'); await pause(300); await pm.click('[data-lancer="1"]'); await pause(600); for (let i = 0; i < 3; i++) { await pm.click('#bdev'); await pause(120); }
await capm('B2-maquette-pilotage');
await pm.click('#ong-relecture'); await pause(600);
await capm('B3-maquette-relecture');
console.log('faces de la relecture de la maquette :', await pm.evaluate(() => Array.from(document.querySelectorAll('#relecture .onglets button, #rl-onglets button, .rl-ong, [data-face]')).map(b => b.innerText.trim()).filter(Boolean).join(' | ')));
await nav.close();
