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

if (fs.readFileSync(F, 'utf8').includes('dr-porte-classe')) { dire(''); dire('M0 — la porte réelle (la maquette rebranchée) : « ▶ Lancer » en un clic');
  const s0 = await page(); const p0 = s0.page; await s0.attendre(300); await p0.evaluate(() => { $('ecran-edt').classList.add('on'); edt(); }); await s0.attendre(300);
  const porte = await p0.evaluate(() => (document.getElementById('edt-cases') || {}).innerText || ''); pas('M0', /3E Charles de Gaulle/.test(porte) && /min utiles/.test(porte) ? 'ok' : 'ÉCHEC', 'la porte propose la classe, le créneau, l\'heure n/N, le temps utile', porte.replace(/\s+/g, ' ').slice(0, 140));
  await p0.click('[data-lancer="1"]'); await s0.attendre(2000); const e0 = await lu(p0);
  pas('M0', e0.lancee && /3E Charles de Gaulle/.test(e0.hou) ? 'ok' : 'ÉCHEC', '[data-lancer="1"] lance avec la classe proposée', e0.hou);
  await s0.ctx.close(); }
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
const r9 = await p.evaluate(() => { const t = document.getElementById('dr-integre'); return t ? t.textContent : null; });
pas('R9', r9 === '● déroulé intègre' ? 'ok' : 'ÉCHEC', 'le témoin « déroulé intègre » : la copie écrite et la copie relue au hub ont la même empreinte', r9);
const av = await p.evaluate(() => { try { ouOnEnEst(); } catch (e) {} const x = document.querySelector('#durees .dur-l.cours .dr-avance') || document.querySelector('#durees .dr-avance'); return x ? x.textContent : null; });
pas('R7', av && /^5\/\d+ · \d+\/\d+ min$/.test(av) ? 'ok' : 'ÉCHEC', '« Où on en est » : dévoilés / total et réel / prévu sur la ligne de l\'activité en cours', av);
await s.attendre(1200); await p.click('#dr-minut-b'); await s.attendre(100); await p.fill('#dr-minut-in', '00:10'); await p.check('#dr-minut-tab'); await p.click('#dr-minut-go'); await s.attendre(3000);
const m1 = await p.evaluate(() => ({ aff: document.getElementById('dr-minut-aff').textContent, bandeau: S.bandeau, mur: S.mur && S.mur.bandeau }));
pas('R3', /^00:0[5-8]$/.test(m1.aff) && /^⏱ 00:0[5-8]$/.test(m1.bandeau) && m1.mur === m1.bandeau ? 'ok' : 'ÉCHEC', 'le minuteur : 10 s, Départ, « au tableau » → le compte à rebours au pilote et dans l\'état du tableau', JSON.stringify(m1));
await s.attendre(12500); const m2 = await p.evaluate(() => ({ bandeau: S.bandeau, J: J.filter(x => x.type === 'minuteur').map(x => x.action) }));
pas('R3', !m2.bandeau && m2.J.join() === 'depart,fin' ? 'ok' : 'ÉCHEC', 'à zéro : « c\'est fini », le bandeau se retire, le journal a départ et fin', JSON.stringify(m2));
{ await p.evaluate(() => { if (document.activeElement) document.activeElement.blur(); }); const c0 = await p.$eval('#compte', e => e.textContent); await p.keyboard.press('Backspace'); await s.attendre(300); const c1 = await p.$eval('#compte', e => e.textContent);
  pas('R19', parseInt(c1) === parseInt(c0) - 1 ? 'ok' : 'ÉCHEC', '⌫ hors d\'un champ = ◀ (revoile le dernier élément)', c0 + ' → ' + c1); await p.click('#bdev'); await s.attendre(300); }
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
if (fs.readFileSync(F, 'utf8').includes('dr_lancerSuite')) { dire(''); dire('M5 — le lendemain, l\'heure 2 : l\'écran d\'ouverture sur l\'état réel de la classe (mandat 10), puis « Lancer l\'heure 2 »');
  await s2.ctx.close(); const s5 = await page({ store: hub, quand: '2026-09-17T11:05:00+02:00' }); const p5 = s5.page; const n5 = (await s5.ecrits()).length;
  await p5.evaluate(() => dr_lancer('3E Charles de Gaulle', '11:04-11:59', '11:05', 2)); await s5.attendre(2000);
  const ouv = await p5.evaluate(() => ({ on: document.getElementById('ecran-fin').classList.contains('ouverture'), txt: (document.getElementById('fin').innerText || '').replace(/\s+/g, ' ').slice(0, 400) }));
  pas('M5', ouv.on && /jeudi 17 septembre 2026, 11:04-11:59/.test(ouv.txt) && /Où en est la/.test(ouv.txt) && /L'heure 1/.test(ouv.txt) && /close/.test(ouv.txt) ? 'ok' : 'ÉCHEC', 'l\'écran d\'ouverture dit l\'heure 1 (close) — lu au hub, rien de simulé', ouv.txt);
  await p5.click('#o-lancer'); await s5.attendre(2500); const e5 = await lu(p5);
  const ec5 = (await s5.ecrits()).slice(n5).map(x => x.replace(C, 'C')); const h5 = await s5.hub(); const H5 = noeud(h5, C + '/heures') || {};
  pas('M5', e5.lancee && (await p5.evaluate(() => S.heure)) === 2 && /heure 2 sur/.test(e5.hou) ? 'ok' : 'ÉCHEC', 'l\'heure 2 est lancée', e5.hou);
  pas('M5', !ec5.includes('PUT C') && Object.keys(H5).some(k => k.startsWith('2026-09-17_11h04-11h59')) && Object.keys(H5).some(k => k.startsWith('2026-09-14')) ? 'ok' : 'ÉCHEC', 'la copie de la classe gardée (pas de PUT C) ; une seconde trace, sous sa clé, à côté de la première', Object.keys(H5).join(' · '));
  pas('M5', await p5.evaluate(() => J.some(x => x.h === 1 && x.type === 'cloture') && J.some(x => x.h === 2 && x.type === 'lancement')) ? 'ok' : 'ÉCHEC', 'le journal porte l\'heure 1 et l\'heure 2', '');
  pas('JS', !s5.errs.length ? 'ok' : 'ÉCHEC', 'M5 : aucune erreur JS', s5.errs.join(' ; ')); }
await nav.close();
dire(''); dire(r.echecs() === 0 ? 'BANC DU MODULE VERT' : 'BANC DU MODULE ROUGE — ' + r.echecs() + ' échec(s)');
if (OUT) fs.writeFileSync(OUT, r.R.join('\n') + '\n');
process.exit(r.echecs() ? 1 : 0);
