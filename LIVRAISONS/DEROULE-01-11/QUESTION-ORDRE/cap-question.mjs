// LE PARCOURS FIXE DU DÉROULÉ DANS LE SITE — P0 → P12, par le geste, sur le faux hub, écran entier capturé à chaque pas.
// usage : node parcours.mjs <index.html> [dossier-de-sortie]       (env : MJPC_HUB = dossier du faux hub ; MJPC_MODE_TEST=1 ; MJPC_PLAYWRIGHT ; MJPC_CHROMIUM)
// Le même parcours que la conscience a joué le 20/10 sur la production (pièces T72-EX-00…12) : il doit passer sur le fichier intégré.
// Chaque pas essaie D'ABORD les noms du déroulé intégré (contrat §7), PUIS ceux de la production d'aujourd'hui, et dit lequel il a pris.
// Ce qui fait échouer (code 1) : une erreur JS ; une boîte système ; une écriture au hub hors des chemins permis (K15) ;
// une écriture au hub en mode test hors de /site/tableau_test (K15-test, §12.66) ; un pas qui a trouvé son entrée mais n'a pas abouti.
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
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 }, timezoneId: 'Europe/Paris' });
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
// en mode test, les écritures vont au magasin M8_TEST_STORE (jamais au hub) : c'est là qu'on vérifie ce que le lancement a écrit
// (v3, 15:13, mesure d'E2) : le magasin range AUSSI les lectures mises en cache (`secuLire`), donc une clé peut exister avant le lancement ;
// on compare les VALEURS avant/après, pas la présence des clés
const magasin = () => page.evaluate(() => { const m = window.M8_TEST_STORE || {}; const o = {}; Object.keys(m).forEach(k => { try { o[k] = JSON.stringify(m[k]); } catch (e) { o[k] = String(m[k]); } }); return o; });
let magasinAvant = {};
const traces = async () => { if (!MODE_TEST) return ecrits(); const m = await magasin(); return Object.keys(m).filter(k => magasinAvant[k] !== m[k]).map(k => 'MAGASIN ' + k); };
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
if (MODE_TEST) magasinAvant = await magasin();
const avant = MODE_TEST ? 0 : (await traces()).length;
await P('A0', 'Atelier : + bloc → Question', async () => { await clic('#at-bloc'); await pause(500); await clic('.choix-obj .dr-c[data-t="question"]'); await pause(500); await cap('A0-atelier-formulaire-question'); const lab = await page.evaluate(() => Array.from(document.querySelectorAll('label')).filter(l => l.offsetParent).map(l => l.innerText).join(' | ')); pas('A0', 'ok', 'formulaire', lab); await page.keyboard.press('Escape'); await pause(300); await page.keyboard.press('Escape'); await pause(300); });
await P('P5', 'lancer la séance (la classe)', async () => { let voie = null;
  /* v4 (26/10, contrat §12.28 (3a), P1 validé par Paul) : l'heure d'une classe se lance par la case de l'emploi du temps — « ▶ Ouvrir le pilotage et lancer » — et se joue
     dans l'écran « la classe en cours » ; l'Atelier ne lance plus. L'ancienne voie (Pilotage → [data-lancer=1]) ne reste qu'en repli, dite « absent » */
  if (neuf) { const aLanceur = await page.evaluate(() => Array.from(document.querySelectorAll('[data-lancer="1"]')).some(b => b.offsetParent !== null && !document.documentElement.classList.contains('dr-en-classe')));
    pas('P5', aLanceur ? 'ÉCHEC' : 'ok', 'l\'Atelier ne lance plus (aucun « ▶ Lancer » visible hors de l\'écran de la classe, §12.28 (3a))'); }
  if (neuf && await page.evaluate(() => typeof edtOuvrir === 'function')) { await page.evaluate(() => edtOuvrir()); await pause(1500);
    const cOk = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; if (!c) return false; c.click(); return true; }); await pause(800);
    if (cOk && await clicTexte('button', 'Ouvrir le pilotage et lancer')) voie = 'la case de l\'emploi du temps → « ▶ Ouvrir le pilotage et lancer » (§12.28)';
    else { await clicTexte('button', 'Fermer l’emploi du temps'); await pause(400); } }
  if (!voie && neuf && await existe('.at-onglet[data-vue="pilotage"]')) { await clic('.at-onglet[data-vue="pilotage"]'); await pause(600); if (await existe('[data-lancer="1"]')) { await clic('[data-lancer="1"]'); voie = 'Pilotage → [data-lancer=1] (E2)'; } }
  if (!voie && await existe('#at-dr-classe')) { await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await page.evaluate(() => { const cr = document.getElementById('at-dr-creneau'); for (let j = 0; j < cr.options.length; j++) if (cr.options[j].text.startsWith('08:57')) cr.selectedIndex = j; cr.dispatchEvent(new Event('change')); const d = document.getElementById('at-dr-debut'); if (d) d.value = '08:57'; }); await nettoyer(); await page.evaluate(() => atDrJouerClic()); voie = 'tête de préparation → atDrJouerClic (production)'; }
  await pause(3000); await page.keyboard.press('Escape'); await pause(300); await cap('P5-classe-lancee');
  if (neuf && voie) { pas('P5', /case/.test(voie) ? 'ok' : 'absent', 'lancée par la case de l\'emploi du temps (§12.28 (3a))', voie);
    pas('P5', await page.evaluate(() => document.documentElement.classList.contains('dr-en-classe')) ? 'ok' : 'absent', 'l\'heure se joue dans l\'écran « la classe en cours » (§12.28 (3a), E1)'); }
  if (!voie) { pas('P5', 'absent', 'aucune entrée de lancement (ni [data-lancer=1], ni #at-dr-classe)'); return; }
  const e = (await traces()).slice(avant); pas('P5', 'ok', 'lancée par ' + voie, e.length + (MODE_TEST ? ' écritures au magasin (mode test)' : ' écritures')); e.forEach(x => dire('      ' + x));
  const attendu = [/deroule_joue\/[^/]+$/, /cours_actif$/]; attendu.forEach(a => pas('P5', e.some(x => a.test(x)) ? 'ok' : 'ÉCHEC', 'écrit au lancement : ' + a.source)); });
const etat = () => page.evaluate(() => { const E = seance().ecrans; const o = ordreHeure(S.heure); return { di: S.di, heure: S.heure, o, nDev: (etatDiapo() || {}).nDev, cible: o.find(di => (dr_blocsVus(E[di]) || []).some(b => b.t === 'question' && !dr_qSansReponse(E[di], b) && (b.el || []).some(x => String(x == null ? '' : x).trim()))), titres: o.map(di => di + ':' + (E[di].role || '') + ':' + (E[di].act || '').slice(0, 30)) }; });
let st = await etat(); dire('heure ' + st.heure + ' · diapos ' + st.titres.join(' / ') + ' · cible ' + st.cible);
await P('Q1', 'aller à la diapo de la question, à la flèche', async () => { await page.click('#numero').catch(() => {}); let n = 0; while (n < 120) { st = await etat(); if (st.di === st.cible) break; await page.keyboard.press('ArrowRight'); await pause(220); n++; } pas('Q1', st.di === st.cible ? 'ok' : 'ÉCHEC', 'la diapo ' + st.cible + ' atteinte en ' + n + ' flèches'); });
let fen = null;
await P('Q2', 'la fenêtre du tableau', async () => { [fen] = await Promise.all([ctx.waitForEvent('page', { timeout: 6000 }).catch(() => null), page.click('#bvideoproj')]); await pause(1500); if (fen) await fen.setViewportSize({ width: 1280, height: 720 }); pas('Q2', fen ? 'ok' : 'ÉCHEC', 'fenêtre ouverte'); await page.bringToFront(); });
const capTab = async n => { if (fen) { await pause(900); await fen.screenshot({ path: path.join(OUT, n + '.png') }); } };
const texteTab = () => fen ? fen.evaluate(() => { const m = document.querySelector('#mur2') || document.querySelector('.mur.tableau') || document.querySelector('.mur') || document.body; return (m.innerText || '').replace(/\s+/g, ' ').slice(0, 400); }).catch(() => '') : '';
await P('Q3', '▶ : la question', async () => { await page.click('#numero').catch(() => {}); await page.keyboard.press('ArrowRight'); await pause(600); await cap('Q3-pilote-question'); await capTab('Q3-tableau-question'); pas('Q3', 'ok', 'tableau : ' + await texteTab()); });
const rep = async (ini, txt) => { const l = await page.$('#mur .rep.libre .ini'); if (!l) throw new Error('pas de ligne libre'); await l.click(); await page.keyboard.type(ini, { delay: 40 }); await pause(250); const d = await page.$('#mur .rep.libre .dit') || await page.$('#mur .rep:last-of-type .dit'); await d.click(); await page.keyboard.type(txt, { delay: 15 }); await pause(250); await page.keyboard.press('Enter'); await pause(500); };
await P('Q4', 'trois élèves participent', async () => { await rep('AE', 'Le romantisme.'); await rep('CJ', 'Que l\'émotion passe avant les règles.'); await rep('PC', 'L\'homme est tout petit devant la nature.'); await page.click('#numero').catch(() => {}); await pause(600); await cap('Q4-pilote-participation'); await capTab('Q4-tableau-participation');
  const ordre = await page.evaluate(() => { const q = document.querySelector('#mur p.q:not(.pas)') || document.querySelector('#mur p.q'); const bl = q ? q.parentElement : null; return Array.from((bl || document).querySelectorAll('#mur p.q, #mur ul.etapes, #mur .rep')).map(x => x.tagName === 'P' ? 'question' : x.tagName === 'UL' ? 'réponse préparée' : (x.classList.contains('libre') ? 'ligne libre' : 'élève')).join(' → '); });
  pas('Q4', 'ok', 'ordre au pilote : ' + ordre); pas('Q4', 'ok', 'tableau : ' + await texteTab()); });
await P('Q5', '▶ : la réponse préparée', async () => { await page.click('#numero').catch(() => {}); await page.keyboard.press('ArrowRight'); await pause(700); await cap('Q5-pilote-reponse-preparee'); await capTab('Q5-tableau-reponse-preparee'); pas('Q5', 'ok', 'tableau : ' + await texteTab()); });
pas('JS', errs.length === 0 ? 'ok' : 'ÉCHEC', 'aucune erreur JS', errs.join(' ; ')); pas('JS', boites.length === 0 ? 'ok' : 'ÉCHEC', 'aucune boîte système', boites.join(' ; '));
fs.writeFileSync(path.join(OUT, 'captures.txt'), R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
