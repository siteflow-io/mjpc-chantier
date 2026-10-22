// LA DIAPO DU BILAN, CONSTRUITE DANS LE SITE INTÉGRÉ (candidat 6d19ef74), vue des élèves au tableau et vue du prof — captures pour Paul (22/10, 18:19)
// usage : node capture.mjs <assemble.html> <hub> <sortie>
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const FICHIER = path.resolve(process.argv[2]); const HUB = path.resolve(process.argv[3]); const OUT = path.resolve(process.argv[4]); fs.mkdirSync(OUT, { recursive: true });
const req = createRequire(import.meta.url); const pw = req('/opt/node22/lib/node_modules/playwright');
const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const store = { classes: J('classes.json'), taxonomie: J('taxonomie.json'), site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
try { store.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {}
const R = []; const dire = s => { R.push(s); console.log(s); };
const nav = await pw.chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage(); await page.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00'));
const errs = [], boites = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); page.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
await page.addInitScript(s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; }, store);
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const cap = async (p, n) => { await nettoyer(); await p.screenshot({ path: path.join(OUT, n + '.png') }); dire('capture ' + n); };
const clicTexte = (sel, txt) => page.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const existe = sel => page.evaluate(s => { const e = document.querySelector(s); return !!(e && e.offsetParent !== null); }, sel);
const clic = sel => page.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);
dire('la diapo du bilan dans le site intégré · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex') + ' · ' + fs.statSync(FICHIER).size + ' o');
await page.goto('file://' + FICHIER + '?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(600);
await page.evaluate(() => atelierOuvrir()); await pause(1000); await clicTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800);
await clicTexte('button,[onclick]', 'Éditer dans l’atelier'); await pause(1500);
if (await existe('.at-onglet[data-vue="atelier"]')) await clic('.at-onglet[data-vue="atelier"]'); await pause(3000);
// l'Atelier sur la diapo du bilan (la 18ᵉ de la séance 0)
const okAt = await page.evaluate(() => { try { ATVUES.snum = dr_cleSeance(1); dr_suivreSeance(); const i = seance().ecrans.findIndex(e => e.role === 'bilan'); aller(i, true); return S.si + '/' + S.di + ' · ' + seance().titre + ' · ' + ecran().act + ' · rôle ' + ecran().role; } catch (e) { return 'erreur ' + e.message; } }); await pause(1500); dire('atelier : ' + okAt);
await cap(page, 'B0-atelier-bilan');
// la classe lancée (Pilotage → ▶ Lancer)
let voie = null; if (await existe('.at-onglet[data-vue="pilotage"]')) { await clic('.at-onglet[data-vue="pilotage"]'); await pause(600); if (await existe('[data-lancer="1"]')) { await clic('[data-lancer="1"]'); voie = 'Pilotage → [data-lancer=1]'; } }
await pause(3000); await page.keyboard.press('Escape'); await pause(300); dire('lancée : ' + voie);
const okCl = await page.evaluate(() => { try { const i = seance().ecrans.findIndex(e => e.role === 'bilan'); aller(i, true); return S.si + '/' + S.di + ' · ' + seance().titre + ' · ' + ecran().act + ' · lancée ' + S.lancee + ' · heure ' + S.heure + ' · ordre ' + JSON.stringify(ordreHeure(S.heure)); } catch (e) { return 'erreur ' + e.message; } }); await pause(1500); dire('classe : ' + okCl);
// la fenêtre du tableau (ce que voient les élèves)
let fen = null; if (await existe('#bvideoproj')) { [fen] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), page.click('#bvideoproj')]); }
if (!fen) { dire('TABLEAU : aucune fenêtre'); } else { await pause(2000); dire('fenêtre : ' + fen.url().slice(0, 100)); await fen.setViewportSize({ width: 1366, height: 768 }); await pause(1200); }
const etat = () => page.evaluate(() => { const L = Array.from(document.querySelectorAll('#mur li[data-p], #mur [data-p]')); return L.length + ' éléments, ' + L.filter(x => getComputedStyle(x).opacity > 0.5 && !x.classList.contains('cache') && !x.classList.contains('p8-cache')).length + ' visibles'; });
dire('à l\'arrivée : ' + await etat());
if (fen) await cap(fen, 'B1-tableau-arrivee-1366');
await cap(page, 'B1-pilote-arrivee-1366');
// dévoiler : la question, puis les éléments un à un
let n = 0; for (let k = 0; k < 14; k++) { const r = await page.evaluate(() => { try { const a = document.querySelectorAll('#mur .devoile, #mur .vu, #mur [data-p].on').length; devoiler(); return a; } catch (e) { return 'erreur ' + e.message; } }); await pause(700); n++; const et = await etat(); dire('dévoilement ' + n + ' : ' + et); if (n === 3 && fen) await cap(fen, 'B2-tableau-question-et-2-elements-1366'); if (/(\d+) éléments, \1 visibles/.test(et)) break; }
await pause(800);
if (fen) { await cap(fen, 'B3-tableau-tout-1366'); await fen.setViewportSize({ width: 1920, height: 1080 }); await pause(1500); await cap(fen, 'B3-tableau-tout-1920'); await fen.setViewportSize({ width: 1366, height: 768 }); await pause(800); }
await cap(page, 'B4-pilote-tout-1366');
// les notes présentateur : le panneau Notes
const okNotes = await page.evaluate(() => { const el = Array.from(document.querySelectorAll('p, div, li')).filter(x => x.offsetParent !== null && /Le bilan doit contenir/.test(x.textContent || '')).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!el) return false; el.scrollIntoView({ block: 'center' }); return true; }); await pause(900); dire('notes présentateur à l\'écran : ' + okNotes); await cap(page, 'B5-pilote-notes-1366');
// mesure : débordement du tableau ?
if (fen) { const m = await fen.evaluate(() => { const b = document.body; const mur = document.querySelector('#mur2, .mur, #mur') || b; const r = mur.getBoundingClientRect(); const tx = Array.from(mur.querySelectorAll('li, p, h1, h2, h3, .q, .consigne, .etape')).filter(x => x.offsetParent !== null && (x.innerText || '').trim()); const fs = tx.map(x => +getComputedStyle(x).fontSize.replace('px', '')); return { scrollH: b.scrollHeight, vuH: window.innerHeight, murBas: Math.round(r.bottom), deborde: b.scrollHeight > window.innerHeight + 1 || r.bottom > window.innerHeight + 1, textes: tx.length, pxMin: Math.min(...fs), pxMax: Math.max(...fs) }; }); dire('TABLEAU 1366×768 : ' + JSON.stringify(m)); await fen.close().catch(() => {}); }
dire('erreurs JS : ' + errs.length + (errs.length ? ' — ' + errs.slice(0, 3).join(' | ') : '') + ' · boîtes : ' + boites.length);
fs.writeFileSync(path.join(OUT, 'capture.txt'), R.join('\n') + '\n'); await nav.close();
