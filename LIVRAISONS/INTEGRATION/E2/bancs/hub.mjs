// LE FAUX HUB D'E2 — le dispositif de `AUDITS/INTEGRATION-DEROULE/parcours.mjs`, repris tel quel, en module.
// GET lit window.__HUB, PUT/PATCH/DELETE écrivent en mémoire et se comptent dans window.__ECR ; tout le réseau hors file: est coupé ;
// horloge réglable (installée, pas figée : le chrono doit tourner). Rien ici ne touche l'outillage de la conscience.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname);
const RACINE = path.resolve(ici, '../../../..');
export const HUB = path.resolve(process.env.MJPC_HUB || path.join(RACINE, 'AUDITS/INTEGRATION-DEROULE/hub'));
const req = createRequire(import.meta.url);
export function playwright() {
  for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { return req(c); } catch (e) {} }
  throw new Error('Playwright introuvable');
}
export function magasin() {
  const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
  const store = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null,
    site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { store.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {}
  return store;
}
export const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
// le faux hub dans la page, avant tout script ; `store` peut venir d'une page précédente (la reprise : « mêmes écritures rejouées en lecture »)
function installer(s) {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); };
}
// une page du site dans un contexte donné (deux onglets d'un même navigateur = deux pages d'un même contexte : BroadcastChannel, localStorage partagés)
export async function monter(ctx, fichier, { quand = '2026-09-14T09:00:00+02:00', store = null, modeTest = false, dialogue = 'dismiss' } = {}) {
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date(quand) });
  const errs = [], boites = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
  page.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); (dialogue === 'accept' ? d.accept() : d.dismiss()).catch(() => {}); });   /* `accept` : la garde du navigateur acceptée (recharger l'onglet de l'heure, B30) */
  await page.addInitScript(installer, store || magasin());
  /* le voile « n fiches d'applications ne sont pas à jour » (#fi-overlay) : une lacune du faux hub (/manifestes absent — audit E1, F15) ;
     le parcours de la conscience le retire avant chaque pas (`nettoyer`) : ici, dès qu'il paraît */
  await page.addInitScript(() => { setInterval(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); }, 200); });
  if (modeTest) await page.addInitScript(() => { try { sessionStorage.setItem('mjpc_m8_test', '1'); } catch (e) {} });
  await page.goto('file://' + path.resolve(fichier) + '?n=3e', { waitUntil: 'load' });
  await page.clock.runFor(1800);
  await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; });
  return { page, errs, boites, ecrits: () => page.evaluate(() => window.__ECR.slice()), hub: () => page.evaluate(() => JSON.parse(JSON.stringify(window.__HUB))), attendre: ms => page.clock.runFor(ms) };
}
export async function ouvrir(fichier, { quand = '2026-09-14T09:00:00+02:00', store = null, vue = { width: 1366, height: 768 }, nav = null, modeTest = false, dialogue = 'dismiss' } = {}) {
  const pw = playwright();
  const navigateur = nav || await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
  const ctx = await navigateur.newContext({ viewport: vue, timezoneId: 'Europe/Paris' });
  await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
  const { page, errs, boites } = await monter(ctx, fichier, { quand, store, modeTest, dialogue });
  return { navigateur, ctx, page, errs, boites,
    ecrits: () => page.evaluate(() => window.__ECR.slice()),
    hub: () => page.evaluate(() => JSON.parse(JSON.stringify(window.__HUB))),
    attendre: ms => page.clock.runFor(ms) };
}
// un banc : des pas nommés, chacun ok / ÉCHEC / absent, la sortie horodatée avec le md5 du fichier joué en tête
export function rapport(titre, fichier) {
  const R = []; let echecs = 0;
  const dire = s => { R.push(s); console.log(s); };
  dire(titre + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · ' + path.basename(fichier) + ' md5 ' + md5(fichier) + ' · ' + fs.statSync(fichier).size + ' o');
  return { dire, R,
    pas: (k, etat, quoi, detail) => { if (etat === 'ÉCHEC') echecs++; dire('  ' + (etat === 'ok' ? 'ok     ' : etat === 'absent' ? 'absent ' : 'ÉCHEC  ') + k + ' · ' + quoi + (detail ? ' — ' + detail : '')); },
    echecs: () => echecs };
}
