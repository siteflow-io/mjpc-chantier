// LE BANC DU MODULE, AVANT E1-a — `dr/dr-classe.js` joué sur la maquette p8-5g, avec le socle simulé (`socle-simule.js`).
// usage : node banc-module.mjs <maquette.html> [sortie.txt]
// Ce qu'il prouve, par le geste, sur le faux hub : lancer écrit C, cours_actif, C/journal, C/etat, H ; le journal et l'état n'ont aucun rang ;
// le paquet est composé depuis le journal ; recharger en pleine heure et relancer la même heure REPREND (diapo, dévoilements, chrono,
// paroles, notes) au lieu de recopier ; la clôture écrit H clos et efface cours_actif. Il tombe dès E1-a (le banc unique joue le site).
import fs from 'fs'; import path from 'path'; import { ouvrir, rapport, playwright } from './hub.mjs';
const ici = path.dirname(new URL(import.meta.url).pathname);
const F = path.resolve(process.argv[2] || ''); const OUT = process.argv[3];
const MODULE = path.resolve(ici, '../../dr/dr-classe.js'), SOCLE = path.join(ici, 'socle-simule.js');
const r = rapport('banc du module dr-classe.js sur la maquette (socle simulé)', F); const { dire, pas } = r;
r.dire('module ' + path.basename(MODULE) + ' md5 ' + (await import('./hub.mjs')).md5(MODULE));
const nav = await playwright().chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const C = '/site/3e/chapitres/0/seances/0/deroule_joue/3E Charles de Gaulle';
async function page(o) { const s = await ouvrir(F, Object.assign({ nav, quand: '2026-09-14T15:07:30+02:00' }, o));
  await s.page.addScriptTag({ path: SOCLE }); await s.page.addScriptTag({ path: MODULE });
  await s.page.evaluate(() => { const t0 = window.tout; window.tout = function () { const x = t0.apply(this, arguments); try { if (AT_DR_REGIME === 'classe') dr_copieAuto(); } catch (e) {} return x; }; });   /* le crochet de `dr_sauve` (E1) */
  return s; }
const noeud = (hub, chemin) => chemin.split('/').filter(Boolean).reduce((n, k) => (n && typeof n === 'object') ? n[k] : undefined, hub);
const aRang = x => JSON.stringify(x).includes('"di":');
const lu = p => p.evaluate(() => ({ lancee: S.lancee, close: S.close, eid: eidDe(S.di), di: S.di, compte: (document.getElementById('compte') || {}).textContent, parts: S.parts.length, notes: S.notesFil.length, ecoule: S.ecoule, J: J.length, regime: AT_DR_REGIME, hou: document.getElementById('hou').textContent }));

dire(''); dire('M1 — lancer par dr_lancer : les écritures');
const s = await page(); const p = s.page;
await p.evaluate(() => dr_lancer('3E Charles de Gaulle', '15:07-16:02', '15:07', 1)); await s.attendre(2500);
let e = await lu(p); pas('M1', e.lancee && e.regime === 'classe' ? 'ok' : 'ÉCHEC', 'l\'heure est lancée en régime classe', e.hou);
const ec1 = [...new Set((await s.ecrits()).map(x => x.replace(C, 'C').replace(/heures\/[^/]+$/, 'heures/<H>')))];
pas('M1', ['PUT C', 'PUT /site/cours_actif', 'PUT C/ecrans', 'PUT C/journal', 'PUT C/etat', 'PUT C/heures/<H>'].every(x => ec1.includes(x)) ? 'ok' : 'ÉCHEC', 'C, cours_actif, C/ecrans, C/journal, C/etat, H', ec1.join(' · '));
let hub = await s.hub(); const ca = noeud(hub, '/site/cours_actif');
pas('M1', ca && ca.classeSlug === '3E Charles de Gaulle' && ca.debut === '15:07' && ca.fin === '16:02' && ca.seance === '0' ? 'ok' : 'ÉCHEC', 'cours_actif : même forme qu\'aujourd\'hui', JSON.stringify(ca));

dire(''); dire('M2 — ▶ ×3, une parole, une note : le journal, l\'état, le paquet');
for (let i = 0; i < 3; i++) { await p.click('#bdev'); await s.attendre(150); }
await p.keyboard.press('F2'); await s.attendre(200); await p.keyboard.type('AE'); await s.attendre(150); await p.keyboard.type('1'); await s.attendre(100); await p.keyboard.press('Enter'); await s.attendre(300);
await p.keyboard.press('Escape'); await s.attendre(150); await p.keyboard.press('n'); await s.attendre(200); await p.keyboard.type('note de reprise'); await p.keyboard.press('Enter'); await s.attendre(200); await p.keyboard.press('Escape'); await s.attendre(200);   /* N : la note au fil */
await p.click('#bdev'); await s.attendre(150);   /* un geste après la parole : `tout()` repart */
await s.attendre(65000); await p.click('#bdev'); await s.attendre(2500);
hub = await s.hub(); const jr = noeud(hub, C + '/journal'), et = noeud(hub, C + '/etat'), Hn = noeud(hub, C + '/heures'); const H = Hn && Hn[Object.keys(Hn)[0]];
pas('M2', Array.isArray(jr) && jr.some(x => x.type === 'parole') && jr.filter(x => x.type === 'devoile').length >= 3 ? 'ok' : 'ÉCHEC', 'C/journal : la parole et les dévoilements', (jr || []).map(x => x.type).join(' '));
pas('M2', jr && !aRang(jr) ? 'ok' : 'ÉCHEC', 'C/journal : aucun rang (di) au hub', '');
pas('M2', et && et.S && et.parDiapo && et.vuMax && !aRang(et) ? 'ok' : 'ÉCHEC', 'C/etat : S, parDiapo, vuMax, aucun rang', et ? Object.keys(et).join(',') : '—');
pas('M2', H && H.classe === '3E Charles de Gaulle' && H.creneau === '15:07-16:02' && H.debutReel && H.activites && H.activites[0] && H.activites[0].passages >= 1 && H.activites[0].eid ? 'ok' : 'ÉCHEC', 'H : classe, créneau, début réel, activites[0] (eid, passages ≥ 1)', H && JSON.stringify(H.activites));
pas('M2', H && H.activites[0].reel >= 1 && Array.isArray(H.parts) && H.parts.length === 1 && !aRang(H) ? 'ok' : 'ÉCHEC', 'H : le temps réel (≥ 1 min), la parole, aucun rang', H && JSON.stringify({ reel: H.activites[0].reel, parts: (H.parts || []).length }));
const avant = await lu(p);
dire('      avant rechargement : ' + JSON.stringify(avant));
await s.ctx.close();

dire(''); dire('M3 — recharger en pleine heure, relancer la même heure : la REPRISE, pas une copie neuve');
const s2 = await page({ store: hub, quand: '2026-09-14T15:09:00+02:00' }); const p2 = s2.page;
await p2.evaluate(() => dr_lancer('3E Charles de Gaulle', '15:07-16:02', '15:07', 1)); await s2.attendre(2500);
const ap = await lu(p2); dire('      après reprise : ' + JSON.stringify(ap));
const ec2 = (await s2.ecrits()).map(x => x.replace(C, 'C'));
pas('M3', !ec2.includes('PUT C') ? 'ok' : 'ÉCHEC', 'la copie jouée n\'est pas recopiée depuis la trame', ec2.filter(x => x === 'PUT C').length + ' × PUT C');
pas('M3', ap.lancee && ap.eid === avant.eid && ap.compte === avant.compte ? 'ok' : 'ÉCHEC', 'la diapo courante et ses dévoilements sont revenus', avant.compte + ' → ' + ap.compte);
pas('M3', ap.parts === avant.parts && ap.notes === avant.notes && avant.notes >= 1 ? 'ok' : 'ÉCHEC', 'la parole et les notes', JSON.stringify({ parts: ap.parts, notes: ap.notes }));
const attendu = Math.round((new Date('2026-09-14T15:09:02.5+02:00') - new Date('2026-09-14T15:07:30+02:00')) / 1000);
pas('M3', Math.abs(ap.ecoule - attendu) <= 3 ? 'ok' : 'ÉCHEC', 'le chrono, recalculé depuis le début réel (± 2 s)', ap.ecoule + ' s pour ' + attendu + ' attendues');
pas('M3', await p2.evaluate(() => J.some(x => x.type === 'reprise')) ? 'ok' : 'ÉCHEC', 'la reprise est au journal', '');

dire(''); dire('M4 — les sept étapes, clore : H clos, cours_actif effacé');
await p2.click('#bfin'); await s2.attendre(400); for (let i = 1; i < 7; i++) { await p2.click('#f-suivante'); await s2.attendre(150); }
await p2.click('#f-clore'); await s2.attendre(300); if (await p2.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) { await p2.click('#gclore-oui'); await s2.attendre(300); }
await p2.evaluate(() => { if (S.close) dr_cloreFin(); }); await s2.attendre(1500);   /* la ligne d'appel posée dans la clôture (étape 7) */
hub = await s2.hub(); const Hc = Object.values(noeud(hub, C + '/heures') || {})[0];
pas('M4', Hc && Hc.clos === true && Hc.finReel ? 'ok' : 'ÉCHEC', 'H : clos, finReel', Hc && JSON.stringify({ clos: Hc.clos, finReel: Hc.finReel }));
pas('M4', noeud(hub, '/site/cours_actif') == null ? 'ok' : 'ÉCHEC', 'cours_actif effacé', '');
pas('M4', (noeud(hub, C + '/journal') || []).some(x => x.type === 'cloture') ? 'ok' : 'ÉCHEC', 'la clôture est au journal du hub', '');
pas('JS', !s2.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s2.errs.join(' ; '));
await nav.close();
dire(''); dire(r.echecs() === 0 ? 'BANC DU MODULE VERT' : 'BANC DU MODULE ROUGE — ' + r.echecs() + ' échec(s)');
if (OUT) fs.writeFileSync(OUT, r.R.join('\n') + '\n');
process.exit(r.echecs() ? 1 : 0);
