// LE PARCOURS FIXE DU DÉROULÉ DANS LE SITE — P0 → P12, par le geste, sur le faux hub, écran entier capturé à chaque pas.
// usage : node parcours.mjs <index.html> [dossier-de-sortie]       (env : MJPC_HUB = dossier du faux hub ; MJPC_MODE_TEST=1 ; MJPC_PLAYWRIGHT ; MJPC_CHROMIUM)
// Le même parcours que la conscience a joué le 20/10 sur la production (pièces T72-EX-00…12) : il doit passer sur le fichier intégré.
// Chaque pas essaie D'ABORD les noms du déroulé intégré (contrat §7), PUIS ceux de la production d'aujourd'hui, et dit lequel il a pris.
// Ce qui fait échouer (code 1) : une erreur JS ; une boîte système ; une écriture au hub hors des chemins permis (K15) ;
// une écriture au hub en mode test (K15-test) ; un pas qui a trouvé son entrée mais n'a pas abouti.
// Un pas dont l'entrée n'existe ni en neuf ni en ancien est « absent » : ce n'est pas un échec, c'est écrit (le territoire n'est pas encore livré).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname);
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties-parcours'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node parcours.mjs <index.html> [dossier-de-sortie]'); process.exit(2); }
const HUB = path.resolve(process.env.MJPC_HUB || path.join(ici, 'hub')); const MODE_TEST = process.env.MJPC_MODE_TEST === '1';
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', path.join(path.dirname(FICHIER), 'node_modules', 'playwright'), 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const store = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null,
  site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
try { store.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {}
const PERMIS = [/^\/site\/3e\/chapitres\/\d+\/seances\/\d+\/deroule(_joue)?(\/|$)/, /^\/site\/cours_actif$/, /^\/site\/edt\//, /^\/corbeille\//, /^\/classes\//];
const R = []; let echecs = 0; const dire = s => { R.push(s); console.log(s); };
const pas = (k, etat, quoi, detail) => { if (etat === 'ÉCHEC') echecs++; dire('  ' + (etat === 'ok' ? 'ok     ' : etat === 'absent' ? 'absent ' : 'ÉCHEC  ') + k + ' · ' + quoi + (detail ? ' — ' + detail : '')); };
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage(); await page.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00'));
const errs = [], boites = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); page.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
await page.addInitScript(s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; }, store);
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const cap = async n => { await nettoyer(); await page.screenshot({ path: path.join(OUT, n + '.png') }); };
const clicTexte = (sel, txt) => page.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const existe = sel => page.evaluate(s => { const e = document.querySelector(s); return !!(e && e.offsetParent !== null); }, sel);
const clic = sel => page.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);   // le clic par l'élément : une modale ouverte par-dessus ne bloque pas le pas suivant, elle se voit dans la capture
const ecrits = () => page.evaluate(() => window.__ECR.slice());
const cadreAncien = () => page.evaluate(() => !!document.getElementById('at-dr-iframe'));
const dansCadre = (f, ...a) => page.evaluate(([src, args]) => { const W = document.getElementById('at-dr-iframe').contentWindow; return (new Function('W', 'd', 'args', 'return (' + src + ')(W, d, ...args)'))(W, W.document, args); }, [f.toString(), a]);
const P = async (k, titre, f) => { dire(''); dire(k + ' — ' + titre); try { await f(); } catch (e) { pas(k, 'ÉCHEC', 'le pas n\'a pas abouti', String(e.message).slice(0, 200)); } };

dire('parcours du déroulé dans le site · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex') + ' · ' + fs.statSync(FICHIER).size + ' o · faux hub ' + HUB + (MODE_TEST ? ' · MODE TEST' : ''));
await page.goto('file://' + FICHIER + '?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);

await P('P0', 'le panneau prof', async () => { await nettoyer(); await page.click('#tprof-btn'); await pause(600); if (MODE_TEST) { await page.evaluate(() => { window.M8_TEST = true; }); } await cap('P0-panneau-prof'); pas('P0', 'ok', 'panneau ouvert' + (MODE_TEST ? ', mode test posé' : '')); });
await P('P1', 'l\'emploi du temps', async () => { await page.evaluate(() => edtOuvrir()); await pause(1500); await cap('P1-emploi-du-temps'); pas('P1', await existe('.edt-case') ? 'ok' : 'ÉCHEC', 'la grille réelle (semaine du 14/09)'); });
let caseOk = false;
await P('P2', 'la case de l\'heure', async () => { caseOk = await page.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); if (c) { c.click(); return true; } return false; }); await pause(1200); await cap('P2-case-de-l-heure');
  const boutons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent !== null && /Préparer|Lancer|pilotage/i.test(b.innerText)).map(b => b.innerText.trim()));
  pas('P2', caseOk && boutons.some(b => /lancer/i.test(b)) ? 'ok' : 'ÉCHEC', 'la case 3E Charles de Gaulle, bouton « lancer »', boutons.join(' | '));
  pas('P2', boutons.some(b => /Préparer/i.test(b)) ? 'ok' : 'absent', '« Préparer » sur la case (E2)');
  await clicTexte('button', 'Fermer l’emploi du temps'); await pause(400); });
let neuf = false;
await P('P3', 'l\'Atelier (préparation) depuis « Mes chapitres »', async () => { await page.evaluate(() => atelierOuvrir()); await pause(1000); await clicTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800);
  const porte = (await clicTexte('button,[onclick]', 'Éditer dans l’atelier')) ? 'Éditer dans l’atelier' : (await clicTexte('button,[onclick]', 'Modifier')) ? 'Modifier (ancien libellé)' : null; await pause(1500);
  neuf = await existe('.at-onglet[data-vue="atelier"]');
  if (neuf) await clic('.at-onglet[data-vue="atelier"]'); else if (await existe('.at-onglet[data-vue="deroule"]')) await clic('.at-onglet[data-vue="deroule"]'); await pause(3500); await cap('P3-atelier');
  const barre = await page.evaluate(() => Array.from(document.querySelectorAll('.at-vues-barre .at-onglet')).map(b => b.dataset.vue).join(' '));
  pas('P3', porte ? 'ok' : 'ÉCHEC', 'la porte', porte); pas('P3', neuf ? 'ok' : 'absent', 'la barre fusionnée Structure · Atelier · Pilotage · Relecture (E1)', barre);
  pas('P3', neuf ? ((await existe('#mur')) && (await existe('#volet')) ? 'ok' : 'ÉCHEC') : (await cadreAncien() ? 'ok' : 'ÉCHEC'), neuf ? 'le déroulé p8 dans la page (#mur, #volet), sans iframe' : 'l\'ancien moteur dans son cadre (production)');
  if (neuf) pas('P3', await cadreAncien() ? 'ÉCHEC' : 'ok', 'plus d\'iframe at-dr-iframe');
  const lignes = neuf ? await page.evaluate(() => document.querySelectorAll('#mur li[data-p]').length) : await dansCadre((W, d) => d.querySelectorAll('#contenu li').length).catch(() => 0);
  pas('P3', lignes > 0 ? 'ok' : 'ÉCHEC', 'la diapo 1 de la séance 0 au mur, avec ses lignes', lignes + ' lignes'); });
await P('P4', 'le clic droit sur une étape', async () => { if (neuf) { const li = await page.$('#mur li[data-p]'); if (!li) throw new Error('pas de ligne'); await li.click({ button: 'right' }); } else { await dansCadre((W, d) => { const li = d.querySelector('#contenu li[data-p]'); if (li) li.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 400, clientY: 300 })); }); } await pause(400); await cap('P4-clic-droit'); pas('P4', 'ok', 'menu ouvert (voir la capture)'); await page.keyboard.press('Escape'); if (!neuf) await page.frameLocator('#at-dr-iframe').locator('body').click({ position: { x: 8, y: 8 } }); else await page.mouse.click(5, 5); await pause(300); });
const avant = (await ecrits()).length;
await P('P5', 'lancer la séance (la classe)', async () => { let voie = null;
  if (neuf && await existe('.at-onglet[data-vue="pilotage"]')) { await clic('.at-onglet[data-vue="pilotage"]'); await pause(600); if (await existe('[data-lancer="1"]')) { await clic('[data-lancer="1"]'); voie = 'Pilotage → [data-lancer=1] (E2)'; } }
  if (!voie && await existe('#at-dr-classe')) { await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await page.evaluate(() => { const cr = document.getElementById('at-dr-creneau'); for (let j = 0; j < cr.options.length; j++) if (cr.options[j].text.startsWith('08:57')) cr.selectedIndex = j; cr.dispatchEvent(new Event('change')); const d = document.getElementById('at-dr-debut'); if (d) d.value = '08:57'; }); await nettoyer(); await page.evaluate(() => atDrJouerClic()); voie = 'tête de préparation → atDrJouerClic (production)'; }
  await pause(3000); await page.keyboard.press('Escape'); await pause(300); await cap('P5-classe-lancee');
  if (!voie) { pas('P5', 'absent', 'aucune entrée de lancement (ni [data-lancer=1], ni #at-dr-classe)'); return; }
  const e = (await ecrits()).slice(avant); pas('P5', 'ok', 'lancée par ' + voie, e.length + ' écritures'); e.forEach(x => dire('      ' + x));
  const attendu = ['deroule_joue', 'cours_actif']; attendu.forEach(a => pas('P5', e.some(x => x.indexOf(a) >= 0) ? 'ok' : 'ÉCHEC', 'écrit au lancement : ' + a)); });
await P('P6', 'la parole (F2 / la case des initiales)', async () => { await page.keyboard.press('F2'); await pause(300); await cap('P6-parole'); pas('P6', 'ok', 'voir la capture'); await page.keyboard.press('Escape'); await pause(200); });
await P('P7', 'la palette (Maj+Espace)', async () => { await page.keyboard.press('Shift+Space'); await pause(400); await cap('P7-palette'); pas('P7', 'ok', 'voir la capture'); await page.keyboard.press('Escape'); await pause(200); });
await P('P8', 'la fenêtre du tableau', async () => { let fen = null;
  if (await existe('#bvideoproj')) { [fen] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), page.click('#bvideoproj')]); }
  else if (await cadreAncien()) { [fen] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), dansCadre(W => { if (typeof W.tableau === 'function') W.tableau(); })]); }
  else { pas('P8', 'absent', 'aucune entrée (#bvideoproj ou tableau() de l\'ancien moteur)'); return; }
  await pause(1500); if (!fen) throw new Error('aucune fenêtre ouverte');
  await fen.setViewportSize({ width: 1280, height: 720 }); await fen.screenshot({ path: path.join(OUT, 'P8-tableau.png') });
  const url = fen.url(); pas('P8', 'ok', 'fenêtre ouverte', url.slice(0, 90));
  if (neuf) pas('P8', /vue=tableau/.test(url) ? 'ok' : 'absent', 'la fenêtre est la page elle-même (?vue=tableau&local=1, E3)');
  const mur = await fen.evaluate(() => { const m = document.getElementById('mur2') || document.querySelector('.mur.tableau') || document.getElementById('att'); return m ? (m.innerText || '').replace(/\s+/g, ' ').slice(0, 120) : null; }).catch(() => null);
  pas('P8', mur ? 'ok' : 'ÉCHEC', 'le tableau rend quelque chose', mur || ''); await fen.close().catch(() => {}); });
await P('P9', 'la fin de l\'heure', async () => { if (await existe('#bfin')) { await page.click('#bfin'); await pause(800); await cap('P9-fin-de-l-heure'); pas('P9', await existe('#fin') ? 'ok' : 'ÉCHEC', 'les sept étapes de la maquette (#fin, E2)'); await page.keyboard.press('Escape'); await clicTexte('#fin button', 'Annuler'); }
  else if (await page.evaluate(() => typeof atT5Modale === 'function')) { await page.evaluate(() => atT5Modale()); await pause(800); await cap('P9-fin-de-l-heure'); pas('P9', 'ok', 'la modale T-5 de la production (ancienne)'); await clicTexte('.at-modale button, .cm-btn, button', 'Annuler'); }
  else pas('P9', 'absent', 'aucune entrée (#bfin ou atT5Modale)'); await pause(300); });
await P('P10', 'la Relecture', async () => { const v = neuf ? 'relecture' : 'relecture'; if (!(await existe('.at-onglet[data-vue="' + v + '"]'))) { pas('P10', 'absent', 'pas d\'onglet Relecture'); return; } await clic('.at-onglet[data-vue="' + v + '"]'); await pause(2000); await cap('P10-relecture');
  const faces = await page.evaluate(() => Array.from(document.querySelectorAll('#dr-zone button, .at-vues-zone button')).filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(t => /récit|passé|chapitre|Papier/i.test(t)));
  pas('P10', 'ok', 'Relecture ouverte', faces.join(' | ')); if (neuf) pas('P10', faces.some(t => /récit/i.test(t)) ? 'ok' : 'absent', 'les faces de la maquette (E4)'); });
await P('P11', 'le Papier', async () => { if (await existe('.at-onglet[data-vue="papier"]')) { await clic('.at-onglet[data-vue="papier"]'); await pause(1500); await cap('P11-papier'); pas('P11', 'ok', 'la vue Papier de la production (ancienne : tombe)'); if (neuf) pas('P11', 'ÉCHEC', 'la vue papier existe encore comme onglet'); return; }
  const ok = await clicTexte('#dr-zone button, .at-vues-zone button', 'Papier'); await pause(1500); await cap('P11-papier'); pas('P11', ok ? 'ok' : 'absent', ok ? 'la face Papier de la Relecture (E4)' : 'pas de face Papier (E4)'); });
await P('P12', 'la clôture', async () => { if (neuf && await existe('.at-onglet[data-vue="pilotage"]')) { await clic('.at-onglet[data-vue="pilotage"]'); await pause(800); } else if (await existe('.at-onglet[data-vue="deroule"]')) { await clic('.at-onglet[data-vue="deroule"]'); await pause(1500); }
  const ok = (await clicTexte('#at-dr-tete button', 'Clore')) || (await clicTexte('#dr-zone button', 'Clore')); await pause(1500); await cap('P12-cloture'); pas('P12', ok ? 'ok' : 'absent', ok ? 'clôture demandée (voir la capture)' : 'aucun bouton « Clore »'); });

dire(''); dire('K15 — les écritures au hub pendant le parcours');
const tout = await ecrits(); const motifs = [...new Set(tout.map(e => e.replace(/\/[^\/]*\d{4}-\d\d-\d\d[^\/]*/g, '/<heure>').replace(/\/-?[A-Za-z0-9_]{15,}/g, '/<id>')))];
motifs.forEach(m => dire('      ' + m));
if (MODE_TEST) pas('K15-test', tout.length === 0 ? 'ok' : 'ÉCHEC', 'mode test : zéro écriture au hub', tout.length + ' écriture(s)');
else { const hors = tout.map(e => e.split(' ')[1]).filter(c => !PERMIS.some(p => p.test(c))); pas('K15', hors.length === 0 ? 'ok' : 'ÉCHEC', tout.length + ' écritures, toutes sur des chemins permis', hors.join(' ')); }
pas('JS', errs.length === 0 ? 'ok' : 'ÉCHEC', 'aucune erreur JS', errs.join(' ; ')); pas('JS', boites.length === 0 ? 'ok' : 'ÉCHEC', 'aucune boîte système', boites.join(' ; '));
dire(''); dire(echecs === 0 ? 'PARCOURS VERT' : 'PARCOURS ROUGE — ' + echecs + ' échec(s)');
fs.writeFileSync(path.join(OUT, 'parcours.txt'), R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
