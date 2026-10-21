// E1 — l'entrée commune des bancs : le site assemblé sur le faux hub, par les gestes réels jusqu'à l'Atelier (comme controles.mjs v2).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const req = createRequire(import.meta.url);
export const ICI = path.dirname(new URL(import.meta.url).pathname); export const RACINE = path.resolve(ICI, '../../../..');
export const FICHIER = path.resolve(process.env.MJPC_FICHIER || path.join(RACINE, 'LIVRAISONS/INTEGRATION/assemble/index.html'));
const HUB = path.resolve(process.env.MJPC_HUB || path.join(RACINE, 'AUDITS/INTEGRATION-DEROULE/hub'));
let pw = null; for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
export const store = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: J('taxonomie.json'), site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } }; st.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; return st; };
export const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; window.__CORPS = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); window.__CORPS.push({ m, c, bd }); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
export const nav = () => pw.chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
export const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
// ouvre le site, va à l'Atelier par les gestes ; hub : un store (pour le rechargement) ; garde le hub d'une page à l'autre si on lui passe __HUB
export async function ouvrir(b, { w = 1280, h = 800, hub = null, vue = 'atelier' } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, timezoneId: 'Europe/Paris' }); await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
  const pg = await ctx.newPage(); const errs = [], boites = []; pg.on('pageerror', e => errs.push(e.message + ' @ ' + String(e.stack || '').split('\n').slice(1, 3).join(' | ').replace(/file:\/\/\S+index\.html/g, ''))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
  await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, hub || store());
  await pg.goto('file://' + FICHIER + '?n=3e', { waitUntil: 'load' }); await pg.waitForTimeout(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await pg.waitForTimeout(300);
  await pg.click('#tprof-btn'); await pg.waitForTimeout(500); await pg.evaluate(() => atelierOuvrir()); await pg.waitForTimeout(1000);
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await pg.waitForTimeout(800);
  await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'); await pg.waitForTimeout(1500);
  if (vue) { await pg.evaluate(v => { const b = document.querySelector('.at-onglet[data-vue="' + v + '"]'); if (b) b.click(); }, vue); await pg.waitForTimeout(1500); }
  return { ctx, pg, errs, boites };
}
export const R = []; let nb = 0, ko = 0;
export const verif = (k, ok, quoi, detail) => { nb++; if (!ok) ko++; const l = (ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null ? ' — ' + detail : ''); R.push(l); console.log(l); return !!ok; };
export const bilan = () => ({ nb, ko });
