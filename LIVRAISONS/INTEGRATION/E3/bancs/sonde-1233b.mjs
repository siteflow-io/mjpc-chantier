// E3 · sonde §12.33 : l'Atelier (onglets, barre, poignée, notes) (à lire, pas un banc)
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url); const pw = req('playwright');
const FICHIER = path.resolve(process.argv[2]); const HUB = path.resolve(process.env.MJPC_HUB);
const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const st = { classes: J('classes.json'), taxonomie: J('taxonomie.json'), site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors')); }; window.WebSocket = function () { throw new Error('ws'); }; };
const nav = await pw.chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ctx = await nav.newContext({ viewport: { width: 1707, height: 743 }, timezoneId: 'Europe/Paris' }); await ctx.route(u => !String(u).startsWith('file:'), r => r.abort()); await ctx.addInitScript(fauxHub, st);
const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => { console.log('DIALOG', d.message().slice(0, 100)); d.dismiss(); });
await pg.clock.setFixedTime(new Date('2026-10-27T08:30:00+01:00'));
await pg.goto('file://' + FICHIER + '?n=3e'); await pg.waitForTimeout(1800); await pg.evaluate(() => { try { loginAsProf(); } catch (e) {} }); await pg.waitForTimeout(2200);
await pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); });
const vus = () => pg.evaluate(() => ({ boutons: Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent).map(b => (b.id ? '#' + b.id + ' ' : '') + b.innerText.replace(/\s+/g, ' ').trim().slice(0, 40)).slice(-30), champs: Array.from(document.querySelectorAll('textarea, input')).filter(b => b.offsetParent).map(b => b.tagName + (b.id ? '#' + b.id : '') + '.' + b.className) }));

await pg.evaluate(() => { try { edtFermer(); } catch (e) {} ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); atelierOuvrir(); }); await pg.waitForTimeout(1200);
await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[onclick]')).find(x => x.offsetParent && /atOnglet\('chapitres'\)/.test(x.getAttribute('onclick') || '')); if (b) b.click(); }); await pg.waitForTimeout(1000);
await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[onclick]')).find(x => x.offsetParent && /Éditer dans l’atelier|Modifier/.test(x.innerText || '')); if (b) b.click(); }); await pg.waitForTimeout(1800);
await pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); });
await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await pg.waitForTimeout(1500);
console.log('hub notes', JSON.stringify(await pg.evaluate(() => { const d = window.__HUB.site['3e'].chapitres[0].seances[0].deroule || {}; return Object.keys(d.notes || {}).length; })));
for (const k of [0, 6, 16]) { await pg.evaluate(i => { const v = document.querySelector('#volet [data-at-di="' + i + '"]'); if (v) v.click(); }, k); await pg.waitForTimeout(1200);
  console.log(k, await pg.evaluate(() => 'di ' + S.di + ' · ' + ((document.getElementById('notesd') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 100))); }
for (const k of [16]) { await pg.evaluate(i => aller(i), k); await pg.waitForTimeout(1200); console.log('aller', k, await pg.evaluate(() => 'di ' + S.di + ' · ' + ((document.getElementById('notesd') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 100))); }
console.log('erreurs', errs);
await nav.close();
