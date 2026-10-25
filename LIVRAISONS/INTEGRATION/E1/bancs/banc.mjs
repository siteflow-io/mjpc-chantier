// E1 — LE BANC UNIQUE (contrat §9) : rejoue tout le lot d'E1 sur assemble/index.html, par le geste, et échoue si un seul échoue.
// usage : node banc.mjs [sortie.txt]        (env : MJPC_FICHIER = le fichier joué, par défaut LIVRAISONS/INTEGRATION/assemble/index.html)
// E1-a : la barre fusionnée, la porte, le déroulé dans la page (sans iframe), la trame réelle de la séance 0, les interfaces,
//        zéro écriture tant que rien n'est modifié, une modification → B/deroule seul, le rechargement, Structure ↔ Atelier, le clavier hors du déroulé.
import fs from 'fs'; import path from 'path'; import { createHash } from 'crypto'; import { spawnSync } from 'child_process';
import * as E from './env.mjs';
const SORTIE = process.argv[2] || null; const t0 = Date.now();
const dire = s => { E.R.push(s); console.log(s); };
dire('banc E1 · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · ' + path.relative(E.RACINE, E.FICHIER) + ' · md5 ' + createHash('md5').update(fs.readFileSync(E.FICHIER)).digest('hex'));
const sansVoile = pg => pg.evaluate(() => { const x = document.getElementById('fi-overlay'); if (x) x.remove(); });   /* le voile « fiches pas à jour » du site : /manifestes manque au faux hub (JOURNAL E1) */
const b = await E.nav();
const SEUL = (process.env.MJPC_SEUL || '').split(',').filter(Boolean);   // MJPC_SEUL=A7,A8 : ne jouer que ces parties (mise au point ; le banc de poussée les joue toutes)
const B = async (k, titre, f) => { if (SEUL.length && !SEUL.includes(k)) return; dire(''); dire(k + ' — ' + titre); try { await f(); } catch (e) { E.verif(k, false, 'le banc n\'a pas pu aller au bout', String(e.message).split('\n')[0]); } };

await B('A1', 'les collisions (contrat §7)', async () => { const r = spawnSync('node', [path.join(E.RACINE, 'AUDITS/INTEGRATION-DEROULE/collisions.mjs'), path.join(E.RACINE, 'LIVRAISONS/INTEGRATION/index.html')], { encoding: 'utf8' }); const noms = (r.stdout.match(/→ (.*)/g) || []).flatMap(l => l.slice(2).trim().split(/\s+/));
  const miens = ['dr.css', 'dr-gabarit.js', 'dr-socle.js', 'dr-atelier.js'].map(f => fs.readFileSync(path.join(E.RACINE, 'LIVRAISONS/INTEGRATION/dr', f), 'utf8')).join('\n');
  const AUTRUI = { durees: 'atVecuAfficher (E2, colonne « tombe »)' };   // un id du gabarit que lit encore une fonction du site d'un autre territoire, qui tombe chez lui
  const aMoi = noms.filter(n => !AUTRUI[n]).filter(n => new RegExp('(id=\\\\?["\']|getElementById\\(["\']|\\$\\(["\'])' + n.replace(/[-]/g, '\\-') + '["\'\\\\]').test(miens) || new RegExp('(^|[\\s,{}])\\.' + n + '(?![\\w-])', 'm').test(miens.split('/* E1-a */')[0].replace(/:is\([^)]*\)/g, '')));   // un id déclaré ou lu par mes fichiers (comme collisions.mjs), ou une classe de mon CSS
  E.verif('A1', aMoi.length === 0, 'collisions.mjs : aucune collision dans les fichiers d\'E1 (dr.css, dr-gabarit.js, dr-socle.js, dr-atelier.js)', aMoi.join(' ') || undefined);
  dire('      (collisions.mjs, tous modules : ' + (r.status === 0 ? '0' : noms.join(' ') + ' — modules d\'E2/E3, à leurs propriétaires') + ')'); });

await B('A2', 'ce qui tombe du site (contrat §6, colonne E1, et audit C4)', async () => {
  const src = fs.readFileSync(path.join(E.RACINE, 'LIVRAISONS/INTEGRATION/index.html'), 'utf8');
  const tombe = ('AT_DR_B64 _drAssurerCadre _drEnvelopper _drHabiller _drReconstruire _drPontEtat _drAfficher _drTailleCadre _drQuandPret _drSain _drVerifier drWin _drNormaliserTrame _drFlushTrame _drRechargerSi _drEntreesEcran _drTrameDe _drEcrireTrame _drLibelles _drTitrerColonne _drRecollerEtapes _drRefusionner _drMorceauDuDevoilement _drRangDuMorceau _drVueGroupe _drVuePere _drRatioEcran _drLargeurEcran _drPoserContexteMoteur _drCalerStructure atDrVueInterne _drTexteBloc _drEmpreinte _drCoupe atDrModifsDeLaSeance atDrEnrAuto atDrTrameEnregistrer atDrMonter atDrSynchroDebut atDrMajUtile atDrMaintenant atDrCompChange atDrTaxoOptions atDrBrancherSuivi').split(' ');
  const reste = tombe.filter(n => new RegExp('(^|\\n)\\s*(function|var)\\s+' + n + '\\b').test(src));
  E.verif('A2', reste.length === 0, tombe.length + ' noms de la colonne E1 « tombe » : aucun n\'est encore déclaré', reste.join(' ') || undefined);
  const restes2 = ['function DR(', 'DR={', 'var AT_PONT', 'id="at-dr-iframe"', "f.id='at-dr-iframe'", 'function _drAssurerCadre'].filter(k => src.includes(k)); E.verif('A2', restes2.length === 0, 'la façade du pont (DR, AT_PONT) et l\'iframe ne sont plus dans le site', restes2.join(' ') || undefined);
  const ch = ['dr/dr.css', 'dr/dr-gabarit.js', 'dr/dr-socle.js', 'dr/dr-atelier.js', 'dr/dr-classe.js', 'dr/dr-tableau.js', 'dr/dr-recit.js']; const pos = ch.map(m => src.indexOf('"' + m + '"'));
  E.verif('A2', pos.every((p, i) => p > 0 && (i === 0 || p > pos[i - 1])), 'les sept modules chargés, dans l\'ordre du contrat §3', pos.join(' < '));
});

let hubApres = null;
await B('A3', 'la porte, la barre fusionnée, le déroulé dans la page (P2-P3)', async () => { const o = await E.ouvrir(b, { vue: null }); const pg = o.pg; await sansVoile(pg);
  const barre = await pg.evaluate(() => Array.from(document.querySelectorAll('.at-vues-barre .at-onglet')).map(x => x.dataset.vue + (x.id ? '#' + x.id : '') + (x.hasAttribute('data-atelier') ? '[data-atelier]' : '')).join(' '));
  E.verif('A3', barre === 'structure atelier#ong-atelier[data-atelier] pilotage#ong-pilotage relecture#ong-relecture', 'la barre : Structure · Atelier · Pilotage · Relecture, avec les ids de la maquette (96, contrat §7)', barre);
  E.verif('A3', !(await pg.$('.at-onglet[data-vue="papier"]')) && !(await pg.$('.at-onglet[data-vue="deroule"]')), 'plus d\'onglet « Papier » ni « Déroulé »');
  await pg.click('#ong-atelier'); await pg.waitForTimeout(1500); await sansVoile(pg);
  const d = await pg.evaluate(() => ({ iframe: !!document.getElementById('at-dr-iframe'), zone: !!document.querySelector('#at-vues-zone > #dr-zone:not(.dr-parque)'), mur: !!document.getElementById('mur'), vig: document.querySelectorAll('#volet [data-at-di]').length, titre: (document.querySelector('#volet [data-at-di="0"]') || {}).textContent || '', lignes: Array.from(document.querySelectorAll('#mur li[data-p]')).map(l => l.textContent.trim()), at: S.atelier, haut: !!document.querySelector('#dr-zone .haut'), onglets: !!document.querySelector('#dr-zone .onglets'), bfin: !!document.getElementById('bfin'), lancer: !!document.querySelector('[data-lancer="1"]'), ecr: window.__ECR.filter(x => /\/chapitres\//.test(x)) }));
  E.verif('A3', !d.iframe && d.zone && d.mur, 'le déroulé p8 dans la zone du site (#dr-zone monté), sans iframe at-dr-iframe');
  E.verif('A3', d.haut && !d.onglets && d.bfin && d.lancer, 'l\'entête .haut est là sans ses onglets (audit C1) ; #bfin et [data-lancer="1"] sont là');
  const fr = await pg.evaluate(() => ({ n: dr_trame().length, pleines: dr_trame().filter(e => e.role !== 'fin').length, fins: dr_trame().filter(e => e.role === 'fin').length, heures: new Set(dr_trame().filter(e => e.role !== 'fin').map(e => e.heure)).size }));
  E.verif('A3', d.at && fr.pleines === 18 && fr.fins === fr.heures && d.vig === fr.n, 'Atelier ouvert sur la séance 0 : une ligne par diapo au volet — les 18 diapos de la trame et une fin d\'heure par heure (audit F7 ; la frontière hors classe, réveil n°10 : ' + fr.heures + ' heures)', d.vig + ' · ' + JSON.stringify(fr));
  E.verif('A3', /Analyse d'images : la routine/.test(d.titre) && d.lignes.length === 6 && /^Étape 1 : J'observe/.test(d.lignes[0]) && /^Étape 6 :/.test(d.lignes[5]), 'la diapo 1 « Analyse d\'images : la routine » au mur, ses six étapes', d.lignes.length + ' lignes');
  E.verif('A3', d.ecr.length === 0, 'K15 : aucune écriture sous /site/…/chapitres tant que rien n\'est modifié', d.ecr.join(' '));
  const cl = await pg.evaluate(() => ({ nom: dr_classe().nom, n: ELEVES.length, ini: Object.keys(INI).length, h: document.getElementById('hclasse').textContent }));
  E.verif('A3', cl.nom === '3E Charles de Gaulle' && cl.n === 29 && cl.ini === 29 && cl.h === '3E Charles de Gaulle', 'la classe réelle (classesData) : 29 élèves, leurs initiales, le nom dans l\'entête', JSON.stringify(cl));
  const itf = await pg.evaluate(() => ({ ctx: dr_ctx(), chap: !!dr_chapitre() && dr_chapitreTitre(), sce: !!dr_seance('0'), trame: dr_trame().length, B: dr_cheminB(), C: dr_cheminC(), H: dr_cheminH(), taxo: dr_taxo().length, notes: typeof dr_notes(), dr: Object.keys(window.dr).join(','), lu: (() => { const b2 = dr_trame()[0].blocs[0]; return [b2.bid === b2.id, b2.el.length, b2.txt.slice(0, 20), Object.keys(JSON.parse(JSON.stringify(b2))).sort().join(',')]; })() }));
  E.verif('A3', itf.ctx.level === '3e' && itf.ctx.snum === '0' && itf.ctx.regime === 'prep' && itf.chap && itf.sce && itf.trame === fr.n, 'dr_ctx / dr_chapitre / dr_seance / dr_trame', JSON.stringify(itf.ctx).slice(0, 120));
  E.verif('A3', itf.B === '/site/3e/chapitres/0/seances/0' && itf.C === '/site/3e/chapitres/0/seances/0/deroule_joue/3E Charles de Gaulle' && itf.H === null, 'dr_cheminB / dr_cheminC (la classe proposée) ; dr_cheminH nul sans heure de cours', itf.C);
  E.verif('A3', itf.taxo === 7 && itf.notes === 'object' && itf.dr === 'S,J,ctx,trame,chapitre,classe,notes', 'dr_taxo (les 7 domaines de /taxonomie), dr_notes, window.dr', itf.taxo + ' · ' + itf.dr);
  E.verif('A3', itf.lu[0] && itf.lu[1] === 6 && itf.lu[3] === 'etapes,id,pic,t,txt,vues', 'dr_blocLu : la consigne lue {bid, txt, el} sur le modèle du site, qui reste seul en JSON', JSON.stringify(itf.lu));
  E.verif('A3', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined);
  await o.ctx.close(); });

await B('A4', 'une modification → B/deroule de la séance 0, et rien d\'autre ; le rechargement la retrouve (points 11, K15)', async () => { const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  await pg.click('#volet [data-at-di="0"]'); await pg.waitForTimeout(300); await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('Ligne du banc E1.'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(1600);
  const e = await pg.evaluate(() => window.__CORPS.filter(x => /\/chapitres\//.test(x.c)).map(x => ({ m: x.m, c: x.c, n: (x.bd && x.bd.ecrans || []).length, txt: JSON.stringify(x.bd).includes('Ligne du banc E1.'), rang: JSON.stringify(x.bd).includes('"di"') })));
  E.verif('A4', e.length === 1 && e[0].m === 'PUT' && e[0].c === '/site/3e/chapitres/0/seances/0/deroule', 'une seule écriture : PUT /site/3e/chapitres/0/seances/0/deroule', e.map(x => x.m + ' ' + x.c).join(' ; '));
  E.verif('A4', e[0] && e[0].txt && e[0].n === 18, 'elle porte la ligne écrite et les 18 diapos de la trame (la fin d\'heure posée à la lecture ne s\'écrit pas)', e[0] && e[0].n);
  const corps = await pg.evaluate(() => { const x = window.__CORPS.find(y => /seances\/0\/deroule$/.test(y.c)); const b0 = x.bd.ecrans[0].blocs; return { blocs: b0.map(z => Object.keys(z).sort().join(',')), maj: typeof x.bd.maj }; });
  E.verif('A4', corps.blocs[1] === 'el,id,t,txt' && corps.blocs[0] === 'etapes,id,pic,t,txt,vues' && corps.maj === 'number', 'au hub, le modèle du site (consigne : etapes ; le bloc neuf « texte » garde txt/el, son bid devient id), maj posé', JSON.stringify(corps.blocs));
  hubApres = await pg.evaluate(() => window.__HUB); E.verif('A4', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close();
  const o2 = await E.ouvrir(b, { hub: hubApres }); const p2 = o2.pg; await sansVoile(p2);
  const t2 = await p2.evaluate(() => ({ mur: document.getElementById('mur').textContent.includes('Ligne du banc E1.'), ecr: window.__ECR.filter(x => /\/chapitres\//.test(x)).length }));
  E.verif('A4', t2.mur && t2.ecr === 0, 'rechargé sur le hub écrit : la ligne est au mur, et rien ne se réécrit', JSON.stringify(t2)); await o2.ctx.close(); });

await B('A5', 'Structure ↔ Atelier : la zone se gare et revient, intacte ; le clavier du déroulé ne vaut que dans le déroulé', async () => { const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  await pg.click('#volet [data-at-di="2"]'); await pg.waitForTimeout(300); const di = await pg.evaluate(() => S.di);
  await pg.click('.at-onglet[data-vue="structure"]'); await pg.waitForTimeout(1500); await sansVoile(pg);
  const s = await pg.evaluate(() => ({ parque: document.getElementById('dr-zone').classList.contains('dr-parque'), dansBody: document.getElementById('dr-zone').parentNode === document.body, actif: dr_actif(), gel: !!S.gel }));
  E.verif('A5', s.parque && s.dansBody && !s.actif, 'en Structure : la zone est garée dans <body>, inactive', JSON.stringify(s));
  await pg.mouse.click(700, 300); await pg.keyboard.press('g'); await pg.keyboard.press('n'); await pg.waitForTimeout(200);
  E.verif('A5', await pg.evaluate(() => !S.gel && !document.getElementById('fnotes').classList.contains('on')), 'en Structure, G et N ne touchent pas le déroulé');
  await pg.click('#ong-atelier'); await pg.waitForTimeout(1500); await sansVoile(pg);
  const r = await pg.evaluate(() => ({ actif: dr_actif(), di: S.di, cour: (document.querySelector('#volet [data-at-di].cour, #volet [data-at-di].on, #volet .cour') || {}).dataset || null, lignes: document.getElementById('mur').innerText.trim().length }));
  E.verif('A5', r.actif && r.di === di && r.lignes > 0, 'retour à l\'Atelier : la même diapo (S.di ' + di + '), le mur rendu', JSON.stringify(r));
  await pg.click('#ong-pilotage'); await pg.waitForTimeout(500); const v = await pg.evaluate(() => ({ at: S.atelier, act: (document.querySelector('.at-onglet-actif') || {}).dataset.vue, vue: ATVUES.vue }));
  E.verif('A5', v.at === false && v.act === 'pilotage' && v.vue === 'pilotage', 'Pilotage : la vue de la maquette et l\'onglet actif du site suivent', JSON.stringify(v));
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(500); await pg.click('#ong-atelier'); await pg.waitForTimeout(300); await pg.click('.at-p8-rep, #at-rep, [id*=repet]').catch(() => {});
  E.verif('A5', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close(); });

await B('A6', 'la colonne unique (point 13, contrat §8.3) : sous la séance dépliée, le volet du déroulé ; une seule séance dépliée', async () => { const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  const etat = () => pg.evaluate(() => { const v = document.getElementById('volet'); return { hote: v.parentNode.className, seance: v.parentNode.dataset ? v.parentNode.dataset.ese : null, dansArbre: !!v.closest('#at-arbre'), ouvertes: Array.from(document.querySelectorAll('#at-arbre .at-som-pli')).filter(x => x.textContent === '▾').length, ecrHorodates: document.querySelectorAll('#at-arbre .at-ecr').length, lignes: document.querySelectorAll('#volet [data-at-di], #volet .vig').length, si: S.si, snum: ATVUES.snum, lg: getComputedStyle(document.querySelector('#dr-zone .corps')).getPropertyValue('--lg').trim(), mur: Math.round(document.getElementById('mur').getBoundingClientRect().width) }; });
  const e0 = await etat();
  E.verif('A6', e0.hote === 'at-som-volet' && e0.dansArbre && e0.seance === '0' && e0.ouvertes === 1 && e0.ecrHorodates === 0, 'le #volet est dans la colonne du site, sous la séance 0, seule dépliée ; plus d\'écrans horodatés', JSON.stringify(e0));
  const n0 = await pg.evaluate(() => dr_trame().length); E.verif('A6', e0.lg === '0px' && e0.lignes === n0, 'la colonne gauche de la maquette n\'a plus de largeur (la diapo y gagne), une ligne par diapo au volet (' + n0 + ')', e0.lg + ' · mur ' + e0.mur + ' px');
  await pg.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[1].click()); await pg.waitForTimeout(1200); await sansVoile(pg);
  const e1 = await etat();
  const n1 = await pg.evaluate(() => ({ n: dr_trame().length, p: dr_trame().filter(e => e.role !== 'fin').length })); E.verif('A6', e1.snum === '1' && e1.si === 1 && e1.seance === '1' && e1.ouvertes === 1 && n1.p === 17 && e1.lignes === n1.n, 'déplier la séance 1 : elle devient celle du déroulé (ATVUES.snum, S.si), son volet (ses 17 diapos et ses fins d\'heure), la séance 0 se replie', JSON.stringify(e1));
  await pg.click('.at-onglet[data-vue="structure"]'); await pg.waitForTimeout(1200); await sansVoile(pg);
  E.verif('A6', await pg.evaluate(() => document.getElementById('volet').parentNode.classList.contains('corps')), 'en Structure : le volet est rentré dans la zone du déroulé (garée)');
  await pg.click('#ong-pilotage'); await pg.waitForTimeout(1200); await sansVoile(pg); const e2 = await etat();
  E.verif('A6', e2.hote === 'at-som-volet' && e2.seance === '1' && e2.lignes === n1.n, 'retour au Pilotage : le volet revient sous la séance 1', JSON.stringify(e2));
  E.verif('A6', await pg.evaluate(() => window.__ECR.filter(x => /\/chapitres\//.test(x)).length === 0), 'K15 : rien d\'écrit en dépliant, en changeant de séance, en changeant d\'onglet');
  E.verif('A6', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close(); });

await B('A7', 'p8-5h dans le site (point 14) et la taille (point 15), sur la trame réelle', async () => {
  const huit = async pg => { await pg.click('#mur .p8-ecrire'); for (let i = 1; i <= 8; i++) { await pg.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 1 }); if (i < 8) await pg.keyboard.press('Enter'); } await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); };
  const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg); await huit(pg);
  const ligne = await pg.$eval('#volet [data-at-di="0"]', e => e.textContent.replace(/\s+/g, ' ')); const ligne1 = await pg.$eval('#volet [data-at-di="1"]', e => e.textContent.replace(/\s+/g, ' '));
  E.verif('A7', /· 2 pages/.test(ligne) && !/pages/.test(ligne1), '5 · atelier : la diapo 1 dit « · 2 pages », la diapo 2 rien', ligne.slice(0, 70));
  const esc = await pg.evaluate(() => ({ dans: !!(document.activeElement && document.activeElement.closest('#mur') && document.activeElement.isContentEditable), sel: String(getSelection()).length }));
  E.verif('A7', !esc.dans && esc.sel === 0, '14 · Échap a fait sortir de la ligne (le texte reste, rien de sélectionné)', JSON.stringify(esc));
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800);
  const vigs = () => pg.$$eval('#volet .vig', l => l.map(v => ({ i: v.dataset.i, pg: v.dataset.pg, cour: v.classList.contains('cour'), n: (v.querySelector('.dr-n') || {}).textContent, lignes: Array.from(v.querySelectorAll('li')).filter(x => !x.classList.contains('hors')).map(x => x.getAttribute('data-p')) })));
  const v0 = await vigs(); const d1 = v0.filter(v => v.i === '0'); const nDiapos = await pg.evaluate(() => ordreHeure(S.heure).length); const nPages = await pg.evaluate(() => seance().ecrans.reduce((n, e, i) => { const p = p85hPages(i); return n + (p && p.pages ? p.pages.length : 1); }, 0)); const finsEnTrop = await pg.evaluate(() => seance().ecrans.filter(e => e.role === 'fin' && e.heure !== S.heure).length);
  E.verif('A7', d1.length === 2 && d1[0].n === '1 · 1/2' && d1[1].n === '1 · 2/2' && d1[0].cour && !d1[1].cour, '1 · en classe : deux vignettes « 1 · 1/2 » (courante) et « 1 · 2/2 »', JSON.stringify(d1.map(v => [v.n, v.cour])));
  if (finsEnTrop) dire('      (à E2 : la copie jouée garde ' + finsEnTrop + ' fin(s) d\'heure d\'une autre heure que celle lancée — une vignette de plus dans le volet)');
  E.verif('A7', v0.length === nPages && nPages > nDiapos && v0.filter(v => v.i === '1').length === 1, '3 · pas un écran de plus : une vignette par page de chaque écran de la copie (' + nPages + ' pages : le nombre de pages suit la hauteur du mur)', v0.length + ' vignettes');
  let n = 0; while (!/page 2 \/ 2/.test(await pg.$eval('#mur .page', p => p.textContent)) && n < 15) { await pg.click('#bdev'); await pg.waitForTimeout(80); n++; }
  const v2 = (await vigs()).filter(v => v.i === '0'); const page2 = await pg.$$eval('#mur .corpsd li:not(.hors)', l => l.map(x => x.getAttribute('data-p')));
  E.verif('A7', !v2[0].cour && v2[1].cour && JSON.stringify(v2[1].lignes) === JSON.stringify(page2), '1-2 · ▶ jusqu\'à la page 2 : « 1 · 2/2 » courante, elle montre les lignes de la page 2 du mur', JSON.stringify(page2));
  await pg.click('#btableau'); await pg.waitForTimeout(300); const vt = await pg.evaluate(() => ({ c: (document.querySelector('#vue-mini .page') || {}).textContent || '', l: Array.from(document.querySelectorAll('#vue-mini .corpsd li')).filter(x => !x.classList.contains('hors')).map(x => x.getAttribute('data-p')) }));
  E.verif('A7', /page 2 \/ 2/.test(vt.c) && JSON.stringify(vt.l) === JSON.stringify(page2), '12 · la vue « ⧉ Tableau » porte « page 2 / 2 » et montre les mêmes lignes que le mur', vt.c.replace(/[‹›]/g, ''));
  await pg.click('#btableau'); await pg.waitForTimeout(200);
  await pg.click('#volet .vig[data-i="0"][data-pg="0"]'); await pg.waitForTimeout(300); const g = await pg.evaluate(() => document.getElementById('garde').classList.contains('on')); if (g) { await pg.click('#garde-devant'); await pg.waitForTimeout(300); }
  E.verif('A7', g && /page 1 \/ 2/.test(await pg.$eval('#mur .page', p => p.textContent)), '2 · clic sur « 1 · 1/2 » : la garde « La classe te suivrait », « Y aller » → page 1 / 2');
  for (const [w, h] of [[1280, 800], [1366, 768]]) { await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(400);
    const t = await pg.evaluate(() => { const z = document.getElementById('dr-zone').getBoundingClientRect(); const dans = sel => { const e = document.querySelector(sel); if (!e || !e.offsetParent) return true; const r = e.getBoundingClientRect(); return r.right <= z.right + 1 && r.bottom <= window.innerHeight + 1; }; return { haut: Array.from(document.querySelectorAll('#dr-zone .haut > *')).filter(e => e.offsetParent).every(e => e.getBoundingClientRect().right <= z.right + 1), dev: dans('#bdev'), compte: dans('#compte'), mur: dans('#mur') }; });
    E.verif('A7', t.haut && t.dev && t.compte && t.mur, '15 · ' + w + ' × ' + h + ' : l\'entête, « ▶ Dévoiler », le compteur et la diapo tiennent dans la zone du site', JSON.stringify(t)); }
  E.verif('A7', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close(); });

await B('A8', 'la trame réelle, ligne pour ligne (point 10) : les 9 séances rendues dans le site comme dans la maquette p8-5g', async () => {
  const maqF = path.join(E.ICI, '.cache', 'maquette-p8-5g.html'); if (!fs.existsSync(maqF)) { fs.mkdirSync(path.dirname(maqF), { recursive: true }); fs.writeFileSync(maqF, spawnSync('git', ['-C', E.RACINE, 'show', 'origin/deroule/p8-5g:LIVRAISONS/DEROULE/p8-5g/maquette-pilotage-ordi-v9c15p8-manipulable.html'], { encoding: 'buffer', maxBuffer: 1 << 26 }).stdout); }
  const lire = (cote) => { /* chaque diapo rendue hors de l'écran, à la taille du tableau, tout dévoilé, sans pages ; ses lignes et ses titres */
    const SE = cote === 'site' ? dr_seances() : DATA.seances; const out = []; const z = document.createElement('div'); z.className = 'mur tableau'; z.style.cssText = 'position:fixed;left:-30000px;top:0;width:1096px;height:616px'; (document.getElementById('dr-zone') || document.body).appendChild(z);
    SE.forEach((se, si) => { const si0 = S.si; S.si = si; se.ecrans.forEach((e, i) => { if (e.role === 'fin') return; try { rendre(z, { si, di: i, nDev: elements(e).length, lum: [], ecr: [], taille: 1, page: 0, reps: {}, tailles: {}, textes: {}, fsBloc: {}, pilote: false, sansPages: true }); out.push({ si, act: e.act, fiche: !!z.querySelector('.fiche'), l: Array.from(z.querySelectorAll('li[data-p], [data-p$=".t"], .fiche .def, .fiche .corps')).filter(x => !x.closest('.page-sup, .doc-sup, .obj-nonlisible')).map(x => x.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean) }); } catch (er) { out.push({ si, act: e.act, err: er.message }); } }); S.si = si0; }); z.remove(); return out; };
  const o = await E.ouvrir(b); const site = await o.pg.evaluate(lire, 'site'); await o.ctx.close();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const pm = await ctx.newPage(); await pm.goto('file://' + maqF); await pm.waitForTimeout(800); const maq = await pm.evaluate(lire, 'maquette'); await ctx.close();
  let comp = 0, egal = 0; const diff = [], f17 = []; const errs = site.filter(x => x.err);
  for (let si = 0; si < 9; si++) { const S1 = site.filter(x => x.si === si), M1 = maq.filter(x => x.si === si); const vus = {}; S1.forEach(x => { const k = x.act + '#' + (vus[x.act] = (vus[x.act] || 0) + 1); const m = M1.filter(y => y.act === x.act)[vus[x.act] - 1]; if (!m) return; comp++; if (JSON.stringify(x.l) === JSON.stringify(m.l)) egal++; else if (x.fiche && !m.fiche) f17.push(si + ' · ' + x.act); else diff.push({ si, act: x.act, site: x.l.length, maq: m.l.length, premier: (x.l.find((v, j) => v !== m.l[j]) || '').slice(0, 40), maqPremier: (m.l.find((v, j) => v !== x.l[j]) || '').slice(0, 40) }); }); }
  E.verif('A8', errs.length === 0, 'chaque diapo des 9 séances se rend dans le site sans erreur', errs.slice(0, 3).map(x => x.si + '/' + x.act + ' : ' + x.err).join(' ; ') || site.length + ' diapos');
  E.verif('A8', comp >= 90 && egal + f17.length === comp, 'les diapos communes (par titre) : mêmes lignes, mêmes titres de blocs, dans le même ordre (hors les objets que la maquette simulait : page, document, objet inconnu)', egal + ' / ' + comp + ' identiques' + (f17.length ? ' ; ' + f17.length + ' fiche(s) que la maquette laissait non liée(s), donc invisible(s), montrée(s) par le site (audit F17) : ' + f17.join(' ; ') : '') + (diff.length ? ' · ÉCARTS ' + JSON.stringify(diff) : ''));
});

await B('A9', 'l\'écriture complète (point 11) : une activité, une note, le travail prévu → B/deroule seul, par eid ; le rechargement retrouve tout', async () => {
  const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  const ouvrirPli = k => pg.evaluate(k => { const h = document.querySelector('#droite-atelier h5[data-pli="' + k + '"]'); if (h && h.parentElement.classList.contains('pli')) h.click(); }, k);
  await ouvrirPli('acts'); await pg.waitForTimeout(200); await pg.click('#droite-atelier [data-nouvelle-act]'); await pg.waitForTimeout(300); E.verif('A9', await pg.$('#at-modale #dr-saisie') !== null, '« + activité » : la modale du site demande le titre (plus de prompt du navigateur)'); await pg.fill('#dr-saisie', 'Le Romantisme en images'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(400);
  { const l0 = await pg.$eval('#volet [data-at-di="0"]', x => Array.from(x.querySelectorAll('*')).some(y => y.children.length === 0 && y.textContent.trim() === 'A1') ? 'A1 · ' + x.textContent.replace(/\s+/g, ' ') : x.textContent.replace(/\s+/g, ' ')); E.verif('A9', /^A1 · /.test(l0), 'relecteur d\'E4 (« activités sans numéro ») : l\'activité créée porte son numéro dans la colonne (« A1 ») — la trame réelle n\'en a aucune (0 actId sur 95 écrans : F8)', l0.slice(0, 60)); }
  await pg.click('#mur li[data-k="1"]'); await pg.waitForTimeout(150); const pn = await pg.$$('#notesd [contenteditable]'); await pn[pn.length - 1].click(); await pg.keyboard.press('End'); await pg.keyboard.press('Enter'); await pg.keyboard.type('Note du banc E1.'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(200);
  await ouvrirPli('tp'); await pg.waitForTimeout(200); await pg.click('#dc-tp'); await pg.keyboard.type('Relire la fiche.'); await pg.mouse.click(5, 5); await pg.waitForTimeout(1800);
  const e = await pg.evaluate(() => { const w = window.__CORPS.filter(x => /\/chapitres\//.test(x.c)); const der = w.filter(x => /seances\/0\/deroule$/.test(x.c)).pop(); const bd = der && der.bd; const e0 = bd && bd.ecrans[0]; return { chemins: [...new Set(w.map(x => x.m + ' ' + x.c))], acts: bd && bd.activites, actId: e0 && e0.actId, eid0: e0 && e0.eid, notes: bd && bd.notes, travail: bd && bd.travail }; });
  E.verif('A9', e.chemins.length === 1 && e.chemins[0] === 'PUT /site/3e/chapitres/0/seances/0/deroule', 'K15 : les écritures vont toutes à B/deroule de la séance 0', e.chemins.join(' ; '));
  const a = (e.acts || [])[0] || {}; E.verif('A9', a.titre === 'Le Romantisme en images' && a.num === 1 && e.actId === a.id && (a.diapos || []).every(x => typeof x === 'string'), 'l\'activité : B/deroule/activites (titre, numéro), la diapo 1 la porte (actId) ; ses diapos jamais par rang', JSON.stringify(e.acts));
  E.verif('A9', e.notes && e.notes[e.eid0] && JSON.stringify(e.notes[e.eid0]).includes('Note du banc E1.'), 'la note : B/deroule/notes/<eid de la diapo 1>', JSON.stringify(e.notes || null).slice(0, 120));
  E.verif('A9', e.travail && e.travail['1'] === 'Relire la fiche.', 'le travail prévu de l\'heure 1 : B/deroule/travail/1', JSON.stringify(e.travail || null));
  const hub = await pg.evaluate(() => window.__HUB); E.verif('A9', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close();
  const o2 = await E.ouvrir(b, { hub }); const p2 = o2.pg; await sansVoile(p2);
  const r = await p2.evaluate(() => { const k = cle(); const n = dr_notes()[k]; return { act: (actDe(dr_trame()[0]) || {}).titre, note: JSON.stringify(n || null), tp: dr_travail()[S.si + '|1'], ecr: window.__ECR.filter(x => /\/chapitres\//.test(x)).length }; });
  E.verif('A9', r.act === 'Le Romantisme en images' && r.note.includes('Note du banc E1.') && r.tp === 'Relire la fiche.' && r.ecr === 0, 'rechargé : l\'activité, la note, le travail prévu sont là ; rien ne se réécrit', JSON.stringify(r).slice(0, 200));
  E.verif('A9', !o2.errs.length, 'aucune erreur JS au rechargement', o2.errs.join(' ; ') || undefined); await o2.ctx.close(); });

await B('A10', 'l\'Atelier entier (point 12) : dupliquer, insérer, déplacer, supprimer, envoyer vers une séance, jouer en avance — et ce qui s\'écrit', async () => {
  const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  const n = () => pg.$$eval('#volet [data-at-di]', l => l.length); const eids = () => pg.evaluate(() => dr_trame().map(e => e.eid));
  const e0 = await eids(); const L0 = await n(); await pg.click('#volet [data-at-di="0"]'); await pg.waitForTimeout(200); await pg.mouse.click(5, 5);
  await pg.keyboard.press('Control+d'); await pg.waitForTimeout(400); const e1 = await eids();
  E.verif('A10', (await n()) === L0 + 1 && e1.length === e0.length + 1 && e1[1] !== e0[0] && new Set(e1).size === e1.length, 'Ctrl+D : la diapo dupliquée suit, avec une identité neuve', (await n()) + ' lignes');
  await pg.keyboard.press('Control+Enter'); await pg.waitForTimeout(400); E.verif('A10', (await n()) === L0 + 2, 'Ctrl+Entrée : une diapo insérée après', (await n()) + ' lignes');
  const avant = await pg.evaluate(() => S.di); await pg.keyboard.press('Alt+ArrowDown'); await pg.waitForTimeout(400); const apres = await pg.evaluate(() => S.di);
  E.verif('A10', apres === avant + 1, 'Alt+↓ : la diapo descend d\'un cran, elle reste la courante', avant + ' → ' + apres);
  await pg.keyboard.press('Delete'); await pg.waitForTimeout(300); const mod = await pg.$('#at-modale .at-btn-prim'); if (mod) await mod.click(); await pg.waitForTimeout(400); E.verif('A10', !!mod && (await n()) === L0 + 1, 'Suppr : la modale du site demande, « Supprimer la diapo » : la diapo courante supprimée', (await n()) + ' lignes');
  const eidEnvoye = await pg.evaluate(() => dr_trame()[2].eid);
  await pg.click('#volet [data-at-di="2"]', { button: 'right' }); await pg.waitForTimeout(300); await E.clicTexte(pg, '#menu *', 'Envoyer vers une autre séance'); await pg.waitForTimeout(300);
  await pg.click('.choix-obj [data-si="1"]'); await pg.waitForTimeout(1600);
  const w = await pg.evaluate(id => { const W = window.__CORPS.filter(x => /\/chapitres\//.test(x.c)); const der = c => (W.filter(x => x.c === c).pop() || {}).bd; const b0 = der('/site/3e/chapitres/0/seances/0/deroule'), b1 = der('/site/3e/chapitres/0/seances/1/deroule'); return { chemins: [...new Set(W.map(x => x.m + ' ' + x.c))].sort(), dans0: b0 && b0.ecrans.some(e => e.eid === id), dans1: b1 && b1.ecrans.some(e => e.eid === id), n0: b0 && b0.ecrans.length, n1: b1 && b1.ecrans.length, rang: JSON.stringify(b0 || {}).includes('"di":') }; }, eidEnvoye);
  E.verif('A10', JSON.stringify(w.chemins) === JSON.stringify(['PUT /site/3e/chapitres/0/seances/0/deroule', 'PUT /site/3e/chapitres/0/seances/1/deroule']), 'K15 : seules B/deroule de la séance 0 et B\'/deroule de la séance 1 (la cible de l\'envoi) sont écrites', w.chemins.join(' ; '));
  E.verif('A10', w.dans1 && !w.dans0 && w.n0 === 18 && w.n1 === 18 && !w.rang, 'envoyer vers la séance 2 : l\'écran (même eid) quitte la séance 1 et arrive dans la 2 ; jamais un rang au hub', JSON.stringify(w));
  const avantRep = await pg.evaluate(() => window.__ECR.length); await pg.evaluate(() => lancerRepetition()); await pg.waitForTimeout(300); for (let i = 0; i < 3; i++) { await pg.click('#bdev'); await pg.waitForTimeout(100); } await pg.click('#rep-stop'); await pg.waitForTimeout(1500);
  E.verif('A10', (await pg.evaluate(() => window.__ECR.length)) === avantRep && (await pg.evaluate(() => S.atelier && !S.repetition)), '« Jouer en avance », trois ▶, « ■ Arrêter » : rien d\'écrit, retour à l\'atelier');
  const hub = await pg.evaluate(() => window.__HUB); E.verif('A10', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close();
  const o2 = await E.ouvrir(b, { hub }); const p2 = o2.pg; await sansVoile(p2); await p2.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[1].click()); await p2.waitForTimeout(1200);
  const r = await p2.evaluate(id => ({ la: dr_trame().some(e => e.eid === id), n: document.querySelectorAll('#volet [data-at-di]').length, p: dr_trame().filter(e => e.role !== 'fin').length, t: dr_trame().length }), eidEnvoye);
  E.verif('A10', r.la && r.p === 18 && r.n === r.t, 'rechargé : la diapo envoyée est dans la séance 2 (18 diapos, et ses fins d\'heure)', JSON.stringify(r)); await o2.ctx.close(); });

await B('A11', 'la mise en forme de la trame (recyclage R13, R18) : gras, souligné, surlignage — dans B/deroule, et rechargée', async () => {
  const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  const choisir = (k, a, z) => pg.evaluate(({ k, a, z }) => { const li = document.querySelector('#mur li[data-k="' + k + '"]'); const w = document.createTreeWalker(li, NodeFilter.SHOW_TEXT); let x = w.nextNode(); while (x && x.length < z) x = w.nextNode(); const r = document.createRange(); r.setStart(x, a); r.setEnd(x, z); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }, { k, a, z });
  await choisir(0, 0, 7); await pg.click('#at-gras'); await pg.waitForTimeout(200);
  await choisir(1, 0, 7); await pg.click('#at-soul'); await pg.waitForTimeout(200);
  await choisir(2, 0, 7); await pg.keyboard.press('Control+h'); await pg.waitForTimeout(200);
  const surl1 = await pg.evaluate(() => (dr_trame()[0].forme && dr_trame()[0].forme.surl || []).length);
  await choisir(2, 0, 7); await pg.keyboard.press('Control+h'); await pg.waitForTimeout(200);
  await choisir(3, 0, 7); await pg.click('#at-gras'); await pg.waitForTimeout(1600);
  const f = await pg.evaluate(() => { const der = window.__CORPS.filter(x => /seances\/0\/deroule$/.test(x.c)).pop(); return { forme: dr_trame()[0].forme, ecrit: der && der.bd.ecrans[0].forme }; });
  const ok = x => x && JSON.stringify(x.gras) === JSON.stringify([{ p: '0.0', txt: 'Étape 1' }, { p: '0.3', txt: 'Étape 4' }]) && JSON.stringify(x.soul) === JSON.stringify([{ p: '0.1', txt: 'Étape 2' }]) && !(x.surl || []).length;
  E.verif('A11', surl1 === 1 && ok(f.forme), 'les boutons G et S de l\'atelier : gras et souligné posés ; Ctrl+H deux fois : le surlignage posé puis ôté (Ctrl+B / Ctrl+U : R6, à E4)', JSON.stringify(f.forme));
  E.verif('A11', ok(f.ecrit), 'la mise en forme s\'écrit dans B/deroule (ecrans[0].forme)', JSON.stringify(f.ecrit || null));
  const hub = await pg.evaluate(() => window.__HUB); E.verif('A11', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close();
  const o2 = await E.ouvrir(b, { hub }); const p2 = o2.pg; await sansVoile(p2);
  const r = await p2.evaluate(() => Array.from(document.querySelectorAll('#mur li[data-k]')).slice(0, 4).map(l => l.innerHTML));
  E.verif('A11', /<b class="p8-gras">Étape 1<\/b>/.test(r[0]) && /<u class="p8-soul">Étape 2<\/u>/.test(r[1]) && !/p8-surl|<mark/.test(r[2]) && /<b class="p8-gras">Étape 4<\/b>/.test(r[3]), 'rechargé : le mur rend le gras et le souligné, pas de surlignage', r.map(x => x.slice(0, 50)).join(' | '));
  E.verif('A11', !o2.errs.length, 'aucune erreur JS au rechargement', o2.errs.join(' ; ') || undefined); await o2.ctx.close(); });

await B('A13', 'les blocs au clavier (recyclage R17, R20) : Ctrl+C, Ctrl+V, Ctrl+X sur le bloc touché — le même geste que le menu', async () => {
  const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  const blocs = () => pg.evaluate(() => dr_trame()[S.di].blocs.map(x => x.bid)); const b0 = await blocs();
  await pg.click('#mur [data-p]'); await pg.waitForTimeout(200); await pg.keyboard.press('Escape'); await pg.keyboard.press('Control+c'); await pg.waitForTimeout(200);
  E.verif('A13', (await pg.evaluate(() => S.pressePapiers && S.pressePapiers.id)) === b0[0], 'clic sur le bloc 1, Échap, Ctrl+C : le bloc est dans le presse-papiers');
  await pg.keyboard.press('Control+v'); await pg.waitForTimeout(1500); const b1 = await blocs();
  const w = await pg.evaluate(() => { const d = window.__CORPS.filter(x => /seances\/0\/deroule$/.test(x.c)).pop(); return d && d.bd.ecrans[0].blocs.map(x => x.id); });
  E.verif('A13', b1.length === b0.length + 1 && b1[0] === b0[0] && b1[1] !== b0[0] && JSON.stringify(w) === JSON.stringify(b1), 'Ctrl+V : collé juste après, nouvelle identité ; écrit dans B/deroule', b1.join(' | '));
  await pg.keyboard.press('Control+x'); await pg.waitForTimeout(300); const b2 = await blocs();
  E.verif('A13', JSON.stringify(b2) === JSON.stringify(b0), 'Ctrl+X : le bloc collé (devenu le bloc touché) est coupé', b2.join(' | '));
  E.verif('A13', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });


await B('A14', 'changer l\'adresse d\'une image posée (recyclage R21) : l\'aperçu suit la frappe, « image absente de mjpc-medias · ref », les refus de 3.2', async () => {
  const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  const im = await pg.evaluate(() => { const T = dr_trame(); for (let i = 0; i < T.length; i++) { const k = (T[i].blocs || []).findIndex(x => x.t === 'image'); if (k >= 0) return { i, k }; } return null; });
  if (!im) { E.verif('A14', false, 'une image dans la trame du banc'); await o.ctx.close(); return; }
  await pg.click(`#volet [data-at-di="${im.i}"]`); await pg.waitForTimeout(400);
  const v0 = await pg.evaluate(() => (document.querySelector('#mur .img-vide') || {}).textContent || '');
  E.verif('A14', /^image absente de mjpc-medias · [^/].+\.\w+$/.test(v0), 'hors réseau, l\'atelier dit « image absente de mjpc-medias · » et l\'adresse relative', v0);
  await pg.click('#mur .img-sup', { button: 'right' }); await pg.waitForTimeout(300); await E.clicTexte(pg, '#menu *', 'Changer l\'adresse'); await pg.waitForTimeout(400);
  const d0 = await pg.evaluate(() => (document.getElementById('dr-saisie') || {}).value);
  await pg.fill('#dr-saisie', 'https://x.org/a.jpg'); await pg.waitForTimeout(200); const m1 = await pg.textContent('.dr-saisie-manque');
  await pg.fill('#dr-saisie', 'dossier/nouvelle.jpg'); await pg.waitForTimeout(800); const m2 = await pg.textContent('.dr-saisie-manque');
  E.verif('A14', d0 === v0.split(' · ')[1] && /jamais complète/.test(m1) && m2 === 'image absente de mjpc-medias · dossier/nouvelle.jpg', 'la modale du site propose l\'adresse relative ; une adresse complète est refusée à la frappe ; l\'aperçu suit la frappe', m1 + ' | ' + m2);
  await pg.keyboard.press('Enter'); await pg.waitForTimeout(1500);
  const r = await pg.evaluate(k => { const d = window.__CORPS.filter(x => /seances\/0\/deroule$/.test(x.c)).pop(); return { ref: dr_trame()[S.di].blocs[k].ref, ecrit: !!d && JSON.stringify(d.bd).includes('mjpc-medias/dossier/nouvelle.jpg') }; }, im.k);
  E.verif('A14', r.ref === 'https://siteflow-io.github.io/mjpc-medias/dossier/nouvelle.jpg' && r.ecrit, 'Entrée : l\'adresse change dans la trame et s\'écrit dans B/deroule', r.ref);
  E.verif('A14', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });


await B('A18', 'les dettes du territoire : 13 · 4 et 13 · 5 (le bloc question au tableau), 13 · 6 (écrire dans la diapo), 13 · 12 (la taille obtenue)', async () => {
  const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  const q = await pg.evaluate(() => { const E = dr_trame(); const src = E.find(e => (e.blocs || []).some(x => x.t === 'question')); const qb = src.blocs.find(x => x.t === 'question'); const c1 = JSON.parse(JSON.stringify(qb)), c2 = JSON.parse(JSON.stringify(qb)); c2.q = 'Deuxième question ?';
    E.splice(1, 0, { eid: 'banc-2q', act: 'Deux questions', dur: 5, comp: [], blocs: [c1, c2] }); dr_preparer(E); const di0 = S.di; S.di = 1; const out = [];
    for (const [nDev, cls, pil] of [[1, 'mur tableau', false], [3, 'mur tableau', false], [2, 'mur pilote', true]]) { const tmp = document.createElement('div'); tmp.className = cls; tmp.style.cssText = 'width:1200px;height:675px;position:fixed;left:0;top:0'; $('dr-zone').appendChild(tmp);
      rendre(tmp, Object.assign({}, etatComplet(), { atelier: false, pilote: pil, nDev, di: 1, reps: { 0: [{ i: '', r: '' }], 1: [{ i: '', r: '' }] } })); const qs = Array.from(tmp.querySelectorAll('.q')); const rep = tmp.querySelector('.rep');
      out.push({ nDev, q2vue: getComputedStyle(qs[1]).display !== 'none', repBas: rep ? rep.getBoundingClientRect().bottom : null, q2Haut: qs[1].getBoundingClientRect().top }); tmp.remove(); }
    E.splice(1, 1); S.di = di0; return out; });
  E.verif('A18', !q[0].q2vue && q[1].q2vue, '13 · 5 : au tableau, la deuxième question ne paraît qu\'à son tour (▶ ×1 : cachée ; ▶ ×3 : là)', JSON.stringify(q.slice(0, 2)));
  E.verif('A18', q[2].repBas != null && q[2].repBas <= q[2].q2Haut, '13 · 4 : la ligne de réponse vide (son chevron) n\'est pas recouverte par la question suivante', Math.round(q[2].repBas) + ' ≤ ' + Math.round(q[2].q2Haut));
  const n0 = await pg.evaluate(() => dr_trame()[S.di].blocs.length); await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('Écrit dans la diapo'); await pg.waitForTimeout(1500);
  const w = await pg.evaluate(n0 => { const e = dr_trame()[S.di]; const d = window.__CORPS.filter(x => /seances\/0\/deroule$/.test(x.c)).pop(); return { n: e.blocs.length, t: e.blocs[n0] ? JSON.stringify(dr_blocVu(e.blocs[n0])) : '', ecrit: !!d && JSON.stringify(d.bd).includes('Écrit dans la diapo') }; }, n0);
  E.verif('A18', w.n === n0 + 1 && w.t.includes('Écrit dans la diapo') && w.ecrit, '13 · 6 (vérifiée) : on clique sous le dernier bloc et on écrit — un bloc naît, sans menu, et s\'écrit', JSON.stringify(w));
  const t = await pg.evaluate(() => { S.di = 1; S.taille = 1; dr_tout(); return $('taille-l').textContent; });
  E.verif('A18', /^32 pt → \d+$/.test(t), '13 · 12 : quand la diapo pleine ne peut pas grossir, le libellé dit la taille obtenue', t);
  await pg.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[2].click()); await pg.waitForTimeout(1200);
  const fd = await pg.evaluate(() => dr_trame().findIndex(e => (e.blocs || []).some(b => b.t === 'fiche' && dr_ficheEnLigne(b)))); await pg.click(`#volet [data-at-di="${fd}"]`); await pg.waitForTimeout(400);
  const lg = await pg.evaluate(() => Array.from(document.querySelectorAll('#mur .fiche')).map(f => { const c = f.querySelector('.corps'); if (!c) return 100; const ps = Array.from(c.children).filter(x => x.textContent.trim()); const w = ps.length ? Math.min(...ps.map(x => x.getBoundingClientRect().width)) : c.getBoundingClientRect().width; return Math.round(w / f.getBoundingClientRect().width * 100); }));
  E.verif('A18', fd >= 0 && lg.length >= 1 && lg.every(x => x >= 50), 'F17 (garde) : le corps d\'une fiche du site se lit sur la largeur de la fiche, chacun de ses paragraphes (il héritait la grille de la mise en page : lettre par lettre dans la colonne unique)', lg.join(' % · ') + ' %');
  E.verif('A18', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });


await B('A19', 'la fiche ouverte se pilote comme une diapo (recyclage R14, la couche commune) : ⤢, ▶ par paragraphe, ◀, ✍🏻 sur un paragraphe, ✕ ; au journal', async () => {
  const o = await E.ouvrir(b); const pg = o.pg; await sansVoile(pg);
  await pg.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[2].click()); await pg.waitForTimeout(1200); await pg.evaluate(() => dr_lancer('3E Charles de Gaulle', '08:57-09:52', '09:00', 1, 3)); await pg.waitForTimeout(1200); /* E2 (réveil n°13) : « Lancer » ne prend que la case de la séance — à 9 h, la séance 2 n'a pas la sienne ; le banc la lance par dr_lancer, créneau donné */
  const di = await pg.evaluate(() => { const i = seance().ecrans.findIndex(e => (e.blocs || []).some(b => b.t === 'fiche' && dr_ficheEnLigne(b))); S.di = i; dr_tout(); return i; }); await pg.waitForTimeout(300);
  const etat = () => pg.evaluate(() => ({ f: S.fichePage && { nDev: S.fichePage.nDev, ecr: S.fichePage.ecr }, p: Array.from(document.querySelectorAll('#mur .f-tab [data-fk]')).map(x => (x.classList.contains('pas') ? 'p' : 'v') + (x.classList.contains('aecrire') ? 'w' : '')).join(' ') }));
  const nb = await pg.$$eval('#mur .dr-fiche-ouvrir', l => l.length); await pg.click('#mur .dr-fiche-ouvrir'); await pg.waitForTimeout(800); const e1 = await etat();
  E.verif('A19', di >= 0 && nb === 1 && e1.f && e1.f.nDev === 0 && /^p( p)+$/.test(e1.p), 'au pilote, « ⤢ Ouvrir la fiche » : la page s\'ouvre, rien n\'en est dévoilé', JSON.stringify(e1));
  await pg.click('#bdev'); await pg.click('#bdev'); await pg.waitForTimeout(300); const e2 = await etat(); await pg.click('#bprec').catch(() => pg.evaluate(() => revoiler())); await pg.waitForTimeout(300); const e3 = await etat();
  E.verif('A19', e2.f.nDev === 2 && /^v v/.test(e2.p) && e3.f.nDev === 1 && /^v p/.test(e3.p), '▶ ▶ : deux paragraphes dévoilés ; ◀ : un de moins', e2.p + ' → ' + e3.p);
  await pg.click('#becr'); await pg.click('#mur .f-tab [data-fk="0"]'); await pg.waitForTimeout(300); const e4 = await etat(); await pg.click('#becr');
  E.verif('A19', JSON.stringify(e4.f.ecr) === '[0]' && /^vw/.test(e4.p), '✍🏻 puis clic sur le premier paragraphe : il est « à écrire »', e4.p);
  const j = await pg.evaluate(() => J.filter(x => /^fiche-/.test(x.type)).map(x => x.type).join(','));
  E.verif('A19', j === 'fiche-ouverte,fiche-devoile,fiche-devoile,fiche-retire,fiche-ecrire', 'le journal (le récit le lira) : ouverte, dévoilé ×2, retiré, à écrire', j);
  await pg.click('#mur .dr-fiche-fermer'); await pg.waitForTimeout(900); const e5 = await pg.evaluate(() => [S.fichePage, document.querySelectorAll('#mur .f-tab').length]);
  E.verif('A19', e5[0] === null && e5[1] === 0 && !o.errs.length && !o.boites.length, '✕ : la fiche se referme, la page s\'en va ; aucune erreur JS, aucune boîte', JSON.stringify(e5) + ' ' + (o.errs.concat(o.boites)).join(' ; ')); await o.ctx.close(); });


await B('A20', 'la relance du 21/10 (12:50-13:02) : ▶ derrière un document, #bdev et l\'entête à 1366 et 1280, #dr-session, dr_ctx en vue tableau, le crochet dr_versMur d\'E3', async () => {
  for (const [w, h] of [[1366, 768], [1280, 800]]) {
    const o = await E.ouvrir(b, { w, h }); const pg = o.pg; await sansVoile(pg); await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(1000);
    const r = await pg.evaluate(() => { const z = document.getElementById('dr-zone').getBoundingClientRect(); const coupe = id => { const x = document.getElementById(id); return !x || x.scrollWidth > x.clientWidth + 1; }; const haut = document.querySelector('#dr-zone .haut');
      const hors = Array.from(haut.querySelectorAll('button')).filter(x => x.offsetParent && x.getBoundingClientRect().right > z.right + 1).map(x => x.id || x.textContent.trim());
      const recouvert = []; const n = seance().ecrans.length; for (let di = 0; di < n; di++) for (const t of [0, 1, 2, 3, 4]) { S.di = di; S.taille = t; dr_tout(); const bd = document.getElementById('bdev').getBoundingClientRect(); const el = document.elementFromPoint(bd.right - 3, bd.top + bd.height / 2); if (!(el && el.closest('#bdev'))) recouvert.push(di + ':' + t); } S.di = 0; S.taille = 1; dr_tout();
      return { classe: !coupe('hclasse'), ou: !coupe('hou'), hors, recouvert, session: !!haut.querySelector('#dr-session') }; });
    E.verif('A20', r.classe && r.ou && !r.hors.length, w + ' × ' + h + ' (13:02) : l\'entête dit la classe entière et le créneau entier ; aucun bouton hors de la zone', JSON.stringify(r).slice(0, 160));
    E.verif('A20', !r.recouvert.length, w + ' × ' + h + ' (relecteur d\'E4) : ▶ Dévoiler n\'est jamais recouvert — toutes les diapos, les cinq tailles de texte', r.recouvert.slice(0, 6).join(' '));
    if (w === 1366) {
      E.verif('A20', r.session, 'C1 : #dr-session est posé dans .haut (le témoin de session, qu\'E3 remplit)');
      const d = await pg.evaluate(() => { const nJ = J.filter(x => x.type === 'devoile').length; const n0 = etatDiapo().nDev; S.doc = { id: 'banc-doc-absent', pos: 1 }; devoiler(); devoiler(); const r = { nDev: etatDiapo().nDev - n0, devoile: J.filter(x => x.type === 'devoile').length - nJ }; S.doc = null; dr_tout(); return r; });
      E.verif('A20', d.nDev === 0 && d.devoile === 0, 'relecteur d\'E4 : un document au tableau, ▶ au bout du document ne dévoile rien derrière lui (ni dévoilement, ni journal)', JSON.stringify(d));
      const v = await pg.evaluate(() => { const vus = [], vrai = window.dr_versMur; window.dr_versMur = (et, x) => { vus.push(et && et.si != null ? 'et' : (x && x.sortie ? 'sortie' : '?')); if (typeof vrai === 'function') vrai(et, x); }; devoiler(); S.fichePage = { di: S.di, bi: 0, nDev: 0, ecr: [] }; fermerFiche(); return new Promise(res => setTimeout(() => { window.dr_versMur = vrai; res(vus); }, 600)); });
      E.verif('A20', v.includes('et') && v.includes('sortie'), 'réveil n°2 (pour E3) : pousser passe par dr_versMur(et) ; fermer la fiche, par dr_versMur(null, { sortie: true }) (la signature d\'E3)', v.join(','));
      const c = await pg.evaluate(() => { const av = SES.mode, ac = SES.ctx; SES.mode = 'tableau'; SES.ctx = { niveau: '3e', chapitre: 0, seance: 2, classeSlug: '3e-cdg', classeNom: '3E Charles de Gaulle' }; const x = dr_ctx(); SES.mode = av; SES.ctx = ac; return x; });
      E.verif('A20', c.level === '3e' && c.chnum === 0 && c.snum === '2' && c.classeSlug === '3e-cdg' && c.regime === 'tableau', 'réveil n°2, M1 : en vue tableau, dr_ctx() lit SES.ctx (cours_actif), pas AT.edChap', JSON.stringify(c));
    }
    E.verif('A20', !o.errs.length && !o.boites.length, w + ' × ' + h + ' : aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); } });


await B('A21', 'les trouvailles du relecteur neuf n°1 (contrat §8) : chacune corrigée, chacune gardée', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg);
  // 1 · le menu des diapos de la colonne, au-dessus de la colonne du site
  const r = await pg.$eval('#volet [data-at-di="2"]', x => { const q = x.getBoundingClientRect(); return { x: q.left + 20, y: q.top + q.height / 2 }; });
  await pg.mouse.click(r.x, r.y, { button: 'right' }); await pg.waitForTimeout(300);
  const m = await pg.evaluate(() => { const it = Array.from(document.querySelectorAll('#menu [data-a]')).find(x => !x.disabled); if (!it) return { ok: false }; const q = it.getBoundingClientRect(); const el = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return { ok: !!(el && el.closest('#menu')), lib: it.textContent }; });
  E.verif('A21', m.ok, '1 · clic droit sur une diapo de la colonne : le menu est au-dessus de la colonne du site, ses entrées reçoivent le clic', JSON.stringify(m)); await pg.keyboard.press('Escape');
  // 4, 5 · plus de simulation ni de texte périmé à l'écran
  const tx = await pg.evaluate(() => { const z = document.getElementById('dr-zone').innerText + ' ' + Array.from(document.querySelectorAll('#dr-zone [title]')).map(x => x.title).join(' '); const col = (document.querySelector('.at-som-volet') || document.body).innerText; return { maquette: /maquette|simulé|à venir : p|à venir dans/.test(z + col), chap: (document.querySelector('#dr-zone .at-chap .sea') || {}).textContent || '' }; });
  E.verif('A21', !tx.maquette, '4, 5 · ni « maquette », ni « simulé », ni « à venir : p… » dans l\'atelier (textes et infobulles)');
  // 2 · rien ne se journalise dans l'atelier
  await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('Une ligne du banc.'); await pg.waitForTimeout(200);
  const sv1 = await pg.$eval('#at-save', x => x.textContent); await pg.waitForTimeout(1600); const sv2 = await pg.$eval('#at-save', x => x.textContent);
  E.verif('A21', /pas encore au hub/.test(sv1) && /✔ enregistré/.test(sv2), '5 · le témoin : « pas encore au hub » tant que le hub n\'a rien reçu, « ✔ enregistré » quand il a accepté (plus une minuterie de 3 s)', sv1 + ' → ' + sv2);
  const jA = await pg.evaluate(() => J.filter(x => /^atelier/.test(x.type) || x.type === 'diapo').length);
  E.verif('A21', jA === 0, '2 · contrat §5 : rien ne se journalise dans l\'atelier (une ligne écrite, l\'enregistrement)', jA + ' entrée(s)');
  // 11 · l'activité : identité sans rang, diapos par eid
  await pg.evaluate(() => { const h = document.querySelector('#droite-atelier h5[data-pli="acts"]'); if (h && h.parentElement.classList.contains('pli')) h.click(); }); await pg.waitForTimeout(200); await pg.click('#droite-atelier [data-nouvelle-act]'); await pg.waitForTimeout(300); await pg.fill('#dr-saisie', 'Activité du banc'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(1600);
  const ac = await pg.evaluate(() => { const d = window.__CORPS.filter(x => /seances\/0\/deroule$/.test(x.c)).pop(); const a = d && (d.bd.activites || [])[0]; return { a, eid: dr_trame()[S.di].eid }; });
  E.verif('A21', ac.a && /^a-[a-z0-9]+$/.test(ac.a.id) && (ac.a.diapos || []).includes(ac.eid), '11 · l\'activité au hub : une identité sans rang de séance, ses diapos par eid (celle qui la porte)', JSON.stringify(ac.a));
  // 12 · « + fiche… » sans feuille : la fiche s'écrit ici
  const n0 = await pg.evaluate(() => dr_trame()[S.di].blocs.length); await pg.evaluate(() => choixObjet('fiche')); await pg.waitForTimeout(300);
  const ok12 = await pg.$('#of-ft'); if (ok12) { await pg.fill('#of-ft', 'La fiche du banc'); await pg.fill('#of-fd', 'Ce qu\'on retient.'); await pg.fill('#of-fc', 'Premier paragraphe.\nSecond paragraphe.'); await pg.click('#of-ok'); await pg.waitForTimeout(400); }
  const f12 = await pg.evaluate(n0 => { const b = dr_trame()[S.di].blocs[n0]; return b ? { t: b.t, titre: b.titre, def: b.def, corps: b.corps, rendu: !!document.querySelector('#mur .fiche') } : null; }, n0);
  E.verif('A21', !!ok12 && f12 && f12.t === 'fiche' && f12.titre === 'La fiche du banc' && /retient/.test(f12.def) && /Second paragraphe/.test(f12.corps) && f12.rendu, '12 · « + fiche… » sans feuille dans le chapitre : la fiche s\'écrit ici, au format du site (titre, def, corps), et se rend', JSON.stringify(f12));
  // 7 · un clic sur le titre d'une séance l'ouvre
  await pg.evaluate(() => { const r = document.querySelectorAll('#at-arbre .ed2-sce')[3]; const t = Array.from(r.childNodes).find(n => n.nodeType === 3 && n.textContent.trim()); const rg = document.createRange(); rg.selectNodeContents(r); }); 
  await pg.click('#at-arbre .ed2-sce[data-seance="3"]', { position: { x: 120, y: 8 } }); await pg.waitForTimeout(1200);
  const s7 = await pg.evaluate(() => ({ snum: ATVUES.snum, vol: !!document.querySelector('.at-som-volet[data-ese="3"]') }));
  E.verif('A21', s7.snum === '3' && s7.vol, '7 · dans l\'atelier, un clic sur le titre d\'une séance l\'ouvre (comme le chevron)', JSON.stringify(s7));
  // 9 · « Éditer dans l'atelier » sur une séance
  const e9 = await pg.evaluate(() => (typeof ctxEntreesSeance === 'function' ? ctxEntreesSeance(1) : []).map(x => x.lib));
  E.verif('A21', e9[0] === 'Éditer dans l’atelier', '9 · le menu d\'une séance commence par « Éditer dans l’atelier » (mandat point 6)', e9.join(' · '));
  const n0e = o.errs.length; const c45 = await pg.evaluate(() => { document.body.dispatchEvent(new DragEvent('dragover', { bubbles: true })); document.body.dispatchEvent(new DragEvent('drop', { bubbles: true })); const p = document.getElementById('pont-css'); return { mortes: p ? /at-t5-|at-repr|at-dr-pastille|at-vecu/.test(p.textContent.replace(/\/\*[\s\S]*?\*\//g, '')) : false }; }); await pg.waitForTimeout(100);
  E.verif('A21', o.errs.length === n0e && !c45.mortes, 'réveil n°2, C4/C5 : le glisser mort est retiré (un dragover sur la page ne lève plus d\'erreur) ; pont-css sans ses 29 règles mortes', JSON.stringify(c45));
  E.verif('A21', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });


await B('A22', 'les trouvailles du relecteur neuf n°2 (contrat §8) : chacune corrigée, chacune gardée', async () => {
  for (const [w, h] of [[1366, 768], [1280, 800]]) {
    const o = await E.ouvrir(b, { w, h }); const pg = o.pg; await sansVoile(pg);
    // 11 · la barre de l'atelier et les notes, dans le cadre
    const t11 = await pg.evaluate(() => { const dr = document.getElementById('droite-atelier'); const L = dr ? dr.getBoundingClientRect().left : 1e9; const hors = Array.from(document.querySelectorAll('#outils-atelier button, #outils-atelier .at-save')).filter(x => x.offsetParent && (x.getBoundingClientRect().right > L + 1 || x.getBoundingClientRect().bottom > innerHeight)).map(x => x.id || x.className); const n = document.getElementById('notesd').getBoundingClientRect(); return { hors, notesVues: n.top < innerHeight - 20 }; });
    E.verif('A22', !t11.hors.length && t11.notesVues, w + ' × ' + h + ' · 11 : « ▶ Jouer en avance », le témoin et la barre restent hors de la colonne de droite ; les notes se voient', JSON.stringify(t11));
    // 10 · un clic dans la diapo ne fait défiler ni la page ni la zone
    await pg.click('#mur li[data-p="0.2"]'); await pg.waitForTimeout(300); const t10 = await pg.evaluate(() => { let n = 0, x = document.getElementById('mur'); while (x) { n += x.scrollTop || 0; x = x.parentElement; } return n + (document.scrollingElement.scrollTop || 0); }); await pg.keyboard.press('Escape');
    E.verif('A22', t10 === 0, w + ' × ' + h + ' · 10 : un clic dans une ligne ne fait rien défiler (la barre du site reste entière)', t10 + ' px');
    if (w === 1366) {
      // 14 · la colonne garde sa largeur
      const l14 = []; for (const k of ['0', '2', '5']) { await pg.evaluate(k => atSomPlier(k), k); await pg.waitForTimeout(1000); l14.push(await pg.evaluate(() => Math.round(document.querySelector('.at-vues-arbre').getBoundingClientRect().width))); }
      E.verif('A22', new Set(l14).size === 1, '14 : la colonne de gauche garde sa largeur d\'une séance à l\'autre', l14.join(' · ') + ' px');
      await pg.evaluate(() => atSomPlier('0')); await pg.waitForTimeout(1000);
      // 20 · pas de « + insérer une séance ici » hors de la Structure
      E.verif('A22', (await pg.$$('#at-arbre .ed2-inserer')).length === 0, '20 : « + insérer une séance ici » (il écrit /seances/N/ordre) n\'est pas dans la colonne de l\'atelier');
      // 17 · les touches seules de la classe n'agissent pas dans l'atelier
      await pg.mouse.click(5, 5); await pg.keyboard.press('g'); await pg.keyboard.press('r'); await pg.waitForTimeout(300); const t17 = await pg.evaluate(() => ({ gel: !!S.gel, vue: ATVUES.vue, atelier: !!S.atelier }));
      E.verif('A22', !t17.gel && t17.vue === 'atelier' && t17.atelier, '17 : dans l\'atelier, « g » ne gèle pas, « r » ne bascule pas en Relecture', JSON.stringify(t17));
      // 21 · la zone d'écriture ne couvre pas l'étiquette d'une image pleine
      await pg.click('#volet [data-at-di="1"]'); await pg.waitForTimeout(400); const t21 = await pg.evaluate(() => { const R = x => x.getBoundingClientRect(); const a = R(document.querySelector('#mur .p8-ecrire')), c = R(document.querySelector('#mur .act')); return !(a.right <= c.left || a.left >= c.right || a.bottom <= c.top || a.top >= c.bottom); });
      E.verif('A22', !t21, '21 : sur une image pleine, « ✎ clique ici et écris » ne couvre pas l\'étiquette de la diapo');
      // 5 · « joindre un document » mène là où il s'enregistre
      await pg.evaluate(() => choixObjet('doc')); await pg.waitForTimeout(300); const t5 = await pg.evaluate(() => ({ fic: !!document.getElementById('of-fic'), bouton: (document.getElementById('of-ok') || {}).textContent })); await pg.evaluate(() => fermerChoix());
      E.verif('A22', !t5.fic && /Structure/.test(t5.bouton || ''), '5 : « joindre un nouveau document » mène à la Structure (où il s\'enregistre) — plus de document en mémoire seulement', JSON.stringify(t5));
      // 16 · l'objet manquant s'écrit avec sa diapo
      await pg.click('#volet [data-at-di="0"]'); await pg.waitForTimeout(300); await pg.evaluate(() => choixObjet('manque')); await pg.waitForTimeout(200); await pg.fill('#of-m', 'un tableau à deux colonnes'); await pg.click('#of-ok'); await pg.waitForTimeout(1600);
      // 19 · rien d'ajouté que Paul n'a pas touché
      await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('x'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(1600);
      const w16 = await pg.evaluate(() => { const d = window.__CORPS.filter(x => /seances\/0\/deroule$/.test(x.c)).pop(); const bd = d && d.bd; const ori = window.__HUB.site['3e'].chapitres[0].seances[0].deroule; return { manque: bd && JSON.stringify(bd.ecrans[0].manques || null), ajoutes: bd ? bd.ecrans.slice(1).reduce((n, e, i) => n + (e.blocs || []).filter(b => (('etapes' in b && !b.etapes.length) || ('el' in b && !(b.el || []).length))).length, 0) : -1 }; });
      E.verif('A22', /deux colonnes/.test(w16.manque || ''), '16 : l\'objet manquant déclaré s\'écrit avec sa diapo (B/deroule, ecrans[i].manques)', w16.manque);
      E.verif('A22', w16.ajoutes === 0, '19 : une frappe dans la diapo 1 n\'écrit aucun « etapes: [] » ni « el: [] » dans les autres diapos', w16.ajoutes + ' champ(s) vide(s)');
      // 13 · une deuxième heure se crée depuis l'atelier
      const t13 = await pg.evaluate(() => { const E = dr_trame(); const hM = Math.max(...E.filter(e => !e.role).map(e => +e.heure || 1)); const der = E.map((e, i) => ({ e, i })).filter(o => o.e.heure === hM && !o.e.role).pop(); S.di = der.i; dr_tout(); const ouv = document.querySelector('#droite-atelier [data-declare="ouvrir"]'); if (ouv) ouv.click(); const offre = !!document.querySelector('#droite-atelier [data-heure="' + (hM + 1) + '"]'); passerEnHeure(hM + 1); const T = dr_trame(); return { hM, offre, h2: T.filter(e => e.heure === hM + 1 && !e.role).length, fin2: T.some(e => e.heure === hM + 1 && e.role === 'fin') }; });
      E.verif('A22', t13.offre && t13.h2 === 1 && t13.fin2, '13 : sur la dernière diapo de la dernière heure, « modifier » offre l\'heure d\'après ; la diapo y passe, et elle reçoit sa fin d\'heure', JSON.stringify(t13));
      // 15 · une frappe juste avant de quitter part quand même
      await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('ultime'); const n0 = await pg.evaluate(() => window.__CORPS.length); await pg.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }); const n1 = await pg.evaluate(() => ({ n: window.__CORPS.length, ok: JSON.stringify(window.__CORPS[window.__CORPS.length - 1] || {}).includes('ultime') }));
      E.verif('A22', n1.n > n0 && n1.ok, '15 : la page se cache moins de 900 ms après la frappe — l\'enregistrement en attente part tout de suite', JSON.stringify(n1));
      // 3 · la note de la fin d'heure survit au déplacement de la première diapo
      const hub = await pg.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true }); const T = dr_trame(); const fin = T.find(e => e.role === 'fin' && +e.heure === 1); return { fin: fin && fin.eid }; });
      E.verif('A22', /^fin-h1-s0$/.test(hub.fin || ''), '3 : la fin d\'heure a une identité stable (l\'heure et la clé de la séance), plus celle de la première diapo', hub.fin);
    }
    E.verif('A22', !o.errs.length && !o.boites.length, w + ' × ' + h + ' : aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); } });


await B('A23', 'la relecture continue d\'E4 (12:33-12:38) : Entrée puis frappe rapide, Échap et Entrée dans les boîtes, les infobulles du menu, la réglette, la classe une fois, la Relecture et les notes sous les outils', async () => {
  for (const [w, h] of [[1280, 800], [1366, 768]]) {
    const o = await E.ouvrir(b, { w, h }); const pg = o.pg; await sansVoile(pg);
    // grave · Entrée deux fois puis une frappe rapide : le texte reste entier, dans la ligne neuve
    for (const d of [90, 30]) { const avant = await pg.evaluate(() => dr_trame()[0].blocs[0].el.map(String)); await pg.click('#mur li[data-p="0.2"]'); await pg.keyboard.press('End'); await pg.keyboard.press('Enter'); await pg.keyboard.press('Enter'); await pg.keyboard.type('Ligne B', { delay: d }); await pg.waitForTimeout(300); await pg.keyboard.press('Escape');
      const ap = await pg.evaluate(() => dr_trame()[0].blocs[0].el.map(String)); E.verif('A23', ap[2] === avant[2] && ap[3] === '' && ap[4] === 'Ligne B' && ap.length === avant.length + 2, w + ' × ' + h + ' · grave : Entrée, Entrée, puis « Ligne B » à ' + d + ' ms par touche — la ligne d\'avant intacte, une ligne vide, « Ligne B » entière', JSON.stringify(ap.slice(2, 5).map(x => x.slice(-16))));
      await pg.evaluate(n => { const b = dr_trame()[0].blocs[0]; b.el.splice(3, 2); marquerModif({}); dr_tout(); }); await pg.waitForTimeout(200); }
    if (w === 1366) {
      // Échap et Entrée dans la boîte du site et les panneaux
      await pg.click('#volet [data-at-di="3"]'); await pg.waitForTimeout(200); await pg.mouse.click(5, 5); const n0 = await pg.$$eval('#volet [data-at-di]', l => l.length);
      await pg.keyboard.press('Delete'); await pg.waitForTimeout(200); await pg.keyboard.press('Escape'); await pg.waitForTimeout(200); const n1 = await pg.$$eval('#volet [data-at-di]', l => l.length); const m1 = !!(await pg.$('#at-modale'));
      await pg.keyboard.press('Delete'); await pg.waitForTimeout(200); await pg.keyboard.press('Enter'); await pg.waitForTimeout(400); const n2 = await pg.$$eval('#volet [data-at-di]', l => l.length);
      await pg.evaluate(() => choixObjet()); await pg.waitForTimeout(200); const c1 = !!(await pg.$('.choix-obj')); await pg.keyboard.press('Escape'); await pg.waitForTimeout(200); const c2 = !!(await pg.$('.choix-obj'));
      E.verif('A23', n1 === n0 && !m1 && n2 === n0 - 1 && c1 && !c2, '« Supprimer la diapo » : Échap renonce, Entrée supprime ; le panneau « + bloc » se ferme à Échap', JSON.stringify({ n0, n1, n2, m1, c1, c2 }));
      // les infobulles du menu d'un élément
      await pg.click('#volet [data-at-di="0"]'); await pg.waitForTimeout(300);
      const r = await pg.$eval('#mur li[data-p="0.1"]', x => { const q = x.getBoundingClientRect(); return { x: q.left + 30, y: q.top + q.height / 2 }; }); await pg.mouse.click(r.x, r.y, { button: 'right' }); await pg.waitForTimeout(200);
      const sans = await pg.$$eval('#menu [data-a]', l => l.filter(x => !x.title).map(x => x.textContent)); await pg.keyboard.press('Escape');
      E.verif('A23', !sans.length, 'le menu d\'un élément : chaque entrée a son infobulle (le titre, Dupliquer, Monter, Descendre…)', sans.join(' · '));
    }
    // en classe : la réglette entière, ▶ dégagé, la classe une fois, les notes et la Relecture sous les outils
    await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(900);
    const reg = await pg.evaluate(() => { const r = []; for (const t of [1, 4]) for (const di of [0, 1, 6]) { S.di = di; S.taille = t; dr_tout(); const z = document.querySelector('#dr-zone .outils .zoomt'); const bd = document.getElementById('bdev').getBoundingClientRect(); const el = document.elementFromPoint(bd.right - 3, bd.top + bd.height / 2); if (z.scrollWidth > z.clientWidth + 1 || !(el && el.closest('#bdev'))) r.push(t + ':' + di); } S.di = 0; S.taille = 1; dr_tout(); return { r, classe: getComputedStyle(document.getElementById('hclasse')).display }; });
    E.verif('A23', !reg.r.length && reg.classe === 'none', w + ' × ' + h + ' : la réglette entière (32 et 52 pt), ▶ dégagé ; la classe une seule fois dans l\'entête', JSON.stringify(reg));
    const vu = sel => pg.evaluate(sel => { const r = []; document.querySelectorAll(sel).forEach(x => { if (!x.offsetParent) return; const q = x.getBoundingClientRect(); const el = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); if (!(el && (el === x || x.contains(el)))) r.push(x.id || x.textContent.trim().slice(0, 12)); }); return r; }, sel);
    await pg.keyboard.press('n'); await pg.waitForTimeout(300); await pg.keyboard.type('une note'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300); const t1 = await vu('#bprec, #bdev, #bgel'); await pg.keyboard.press('Escape');
    await pg.evaluate(() => voir('relecture')); await pg.waitForTimeout(600); const t2 = await vu('#dr-zone .haut button'); await pg.evaluate(() => voir('pilotage')); await pg.waitForTimeout(300);
    E.verif('A23', !t1.length && !t2.length, w + ' × ' + h + ' : N + Entrée, la fenêtre des notes laisse ◀ ▶ ❄ atteignables ; en Relecture, l\'entête (ses deux rangées) reste atteignable', JSON.stringify({ t1, t2 }));
    E.verif('A23', !o.errs.length && !o.boites.length, w + ' × ' + h + ' : aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); } });


await B('A24', 'le réveil n°3 (15:14) : la question grisée, le témoin du hub, ▶ derrière un document projeté, la réponse qui dévoile sa question, « Activité n — » au récit, la taille au tableau', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg);
  // 8 · une activité créée : son numéro au récit d'une heure jouée
  await pg.evaluate(() => { const h = document.querySelector('#droite-atelier h5[data-pli="acts"]'); if (h && h.parentElement.classList.contains('pli')) h.click(); }); await pg.waitForTimeout(200); await pg.click('#droite-atelier [data-nouvelle-act]'); await pg.waitForTimeout(300); await pg.fill('#dr-saisie', 'Observer les tableaux'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(1500);
  // 3 · le témoin du hub : jamais le bandeau du site pour une écriture du déroulé, une ligne dans l'entête
  const t3a = await pg.evaluate(() => { const bd = document.querySelector('.mjpc-bandeau-ok'); return { bandeau: !!(bd && bd.style.display !== 'none' && bd.offsetParent), enr: (document.getElementById('dr-enr') || {}).textContent || '' }; });
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800);
  for (let i = 0; i < 4; i++) { await pg.click('#bdev'); await pg.waitForTimeout(500); }
  const t3b = await pg.evaluate(() => { const bd = document.querySelector('.mjpc-bandeau-ok'); const vu = !!(bd && bd.style.display !== 'none' && bd.offsetParent); const pas = Array.from(document.querySelectorAll('#part [data-e], #part button')).slice(0, 3).every(x => { const q = x.getBoundingClientRect(); const el = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return !el || !el.closest('.mjpc-bandeau-ok'); }); return { bandeau: vu, pastilles: pas, enr: (document.getElementById('dr-enr') || {}).textContent || '' }; });
  E.verif('A24', !t3a.bandeau && /^Enregistré à \d\d:\d\d$/.test(t3a.enr) && !t3b.bandeau && t3b.pastilles && /^Enregistré à/.test(t3b.enr), '3 · aucune écriture du déroulé ne pose le bandeau du site (atelier, puis ▶ en classe) ; « Enregistré à … » dans l\'entête ; les pastilles restent libres', JSON.stringify({ t3a, t3b }));
  const rec = await pg.evaluate(() => { const d = document.createElement('div'); d.innerHTML = recitHtml(now(), S.heure); return d.innerText; });
  E.verif('A24', /Activité 1 — Observer les tableaux/.test(rec), '8 · une activité créée dans l\'atelier porte son numéro au récit de l\'heure jouée (« Activité 1 — … »)', (rec.match(/.{0,10}Activité 1.{0,30}/) || [''])[0]);
  // 4 · « Projeter au tableau » un document, puis ▶ : rien ne se dévoile derrière
  await pg.evaluate(() => { S.di = 0; dr_tout(); ouvrirDocs(); }); await pg.waitForTimeout(300); const n0 = await pg.evaluate(() => ({ n: etatDiapo().nDev, d: J.filter(x => x.type === 'devoile').length }));
  const doc = await pg.$('#fdocs-l [data-doc]'); if (doc) { await doc.click(); await pg.waitForTimeout(300); for (let i = 0; i < 3; i++) { await pg.click('#bdev'); await pg.waitForTimeout(150); } await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(200); }
  const n1 = await pg.evaluate(() => ({ n: etatDiapo().nDev, d: J.filter(x => x.type === 'devoile').length, doc: !!S.doc }));
  E.verif('A24', !!doc && n1.doc && n1.n === n0.n && n1.d === n0.d, '4 · le geste exact : « Projeter au tableau » un document, ▶ ×3 et → : rien ne se dévoile ni ne se raconte derrière lui', JSON.stringify({ n0, n1 }));
  await pg.evaluate(() => { S.doc = null; dr_tout(); });
  // 2 · un clic dans une question grisée la dévoile, n'y écrit pas
  await pg.evaluate(() => { const i = seance().ecrans.findIndex(e => (e.blocs || []).some(b => b.t === 'question')); S.di = i; dr_tout(); }); await pg.waitForTimeout(300);
  const q0 = await pg.evaluate(() => ({ pas: document.querySelector('#mur .q').classList.contains('pas'), txt: document.querySelector('#mur .q').textContent, cc: J.filter(x => x.type === 'copie-classe').length }));
  await pg.click('#mur .q'); await pg.keyboard.type('xyz', { delay: 40 }); await pg.waitForTimeout(300);
  const q1 = await pg.evaluate(() => ({ pas: document.querySelector('#mur .q').classList.contains('pas'), txt: document.querySelector('#mur .q').textContent, cc: J.filter(x => x.type === 'copie-classe').length }));
  E.verif('A24', q0.pas && !q1.pas && q1.txt === q0.txt && q1.cc === q0.cc, '2 · un clic dans une question grisée la dévoile ; la frappe qui suit n\'écrit pas dans l\'énoncé, rien au journal', JSON.stringify({ q0: q0.pas, q1 }).slice(0, 160));
  // 2 bis · la frappe dans un texte dévoilé : une entrée « copie-classe », pas une par touche
  await pg.click('#mur .q'); await pg.keyboard.press('End'); await pg.keyboard.type(' bis', { delay: 40 }); await pg.waitForTimeout(300); await pg.keyboard.press('Escape');
  const q2 = await pg.evaluate(() => J.filter(x => x.type === 'copie-classe').length);
  E.verif('A24', q2 - q1.cc === 1, '2 · quatre touches dans la copie : une seule entrée au journal (sa longueur suit)', (q2 - q1.cc) + ' entrée(s)');
  // 5 · une réponse tapée dans sa case dévoile la question et part au tableau
  await pg.evaluate(() => { const i = seance().ecrans.findIndex((e, k) => k !== S.di && (e.blocs || []).some(b => b.t === 'question')); S.di = i; dr_tout(); }); await pg.waitForTimeout(300);
  const ini = await pg.$('#mur .rep .ini'); if (ini) { await ini.click(); await pg.keyboard.type('TB'); await pg.keyboard.press('Tab'); await pg.keyboard.type('une réponse', { delay: 20 }); await pg.waitForTimeout(400); }
  const r5 = await pg.evaluate(() => { const e = ecran(); const els = elements(e); const bi = e.blocs.findIndex(b => b.t === 'question'); const k = els.findIndex(x => x.b === bi && x.e === 'q'); const m = S.mur || {}; return { kq: k, nDev: etatDiapo().nDev, murN: m.nDev, murRep: JSON.stringify((m.reps || {})[bi] || []).includes('une réponse') }; });
  E.verif('A24', !!ini && r5.nDev > r5.kq && r5.murN > r5.kq && r5.murRep, '5 · « TB », Tab, la réponse : la question se dévoile, la réponse part au tableau au fil de la frappe', JSON.stringify(r5));
  // 9 · la taille demandée et la police obtenue partent au tableau
  const vm = await pg.evaluate(() => { const vus = [], vrai = window.dr_versMur; window.dr_versMur = (et, x) => { if (et) vus.push({ taille: et.taille, ratio: et.policeRatio }); if (vrai) vrai(et, x); }; const r = document.getElementById('taille'); r.value = 4; r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); window.dr_versMur = vrai; return vus.pop() || null; });
  E.verif('A24', vm && vm.taille === 4 && vm.ratio > 0, '9 · à 52 pt, la donnée part au tableau : la taille demandée et la police réellement obtenue (13 · 12 : réduite plutôt que paginée — à Paul)', JSON.stringify(vm));
  E.verif('A24', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });

await B('A25', 'la relecture continue d\'E4 (13:35-14:05) : rien au journal hors heure, « + bloc » dont la frappe remplace l\'attente, Échap ferme le menu d\'une étape, le volet suit ▶, F2 + note : une seule pose', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg);
  // hors heure : parcourir la trame (atelier, puis Pilotage) n'écrit rien au journal
  const j0 = await pg.evaluate(() => J.length);
  for (const di of [2, 3, 1]) { await pg.click(`#volet [data-at-di="${di}"]`); await pg.waitForTimeout(150); }
  await pg.evaluate(() => voir('pilotage')); await pg.waitForTimeout(300); for (let i = 0; i < 3; i++) { await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(120); }
  const j1 = await pg.evaluate(() => ({ n: J.length, h: J.map(x => x.type + ':' + x.h).slice(-4) }));
  E.verif('A25', j1.n === j0, 'parcourir des diapos dans l\'atelier puis au Pilotage sans heure lancée : aucune entrée au journal (pas d\'« heure 1 » fantôme)', JSON.stringify({ j0, j1 }));
  await pg.evaluate(() => voir('atelier')); await pg.waitForTimeout(300); await pg.click('#volet [data-at-di="1"]'); await pg.waitForTimeout(200);
  // « + bloc » → Consigne, puis frappe : la frappe remplace « Nouvelle consigne »
  await pg.click('#at-bloc'); await pg.waitForTimeout(200); await pg.click('.choix-obj .dr-c[data-t="consigne"]'); await pg.waitForTimeout(200);
  const fo = await pg.$('#obj-form'); if (fo && await pg.$('.choix-obj')) { const bt = await pg.$('#obj-form .at-btn-prim, #obj-form button'); if (bt) await bt.click(); await pg.waitForTimeout(200); }
  await pg.keyboard.type('Relis ton tableau.', { delay: 60 }); await pg.waitForTimeout(300);
  const cs = await pg.evaluate(() => { const e = ecran(); const b2 = e.blocs[e.blocs.length - 1]; return { t: b2.t, txt: b2.txt }; });
  E.verif('A25', cs.t === 'consigne' && cs.txt === 'Relis ton tableau.', '« + bloc » → Consigne, puis la frappe : elle remplace « Nouvelle consigne » (pas « Nouvelle consigneRelis… »)', JSON.stringify(cs));
  // réveil n°4, 1 (grave) : un bloc neuf, écrire puis Entrée à 80 ms par touche, quatre fois — chaque ligne entière
  const lignes = [];
  for (let r = 0; r < 4; r++) { await pg.click(`#volet [data-at-di="${r + 3}"]`); await pg.waitForTimeout(200); await pg.click('#at-bloc'); await pg.waitForTimeout(150); await pg.click('.choix-obj .dr-c[data-t="consigne"]'); await pg.waitForTimeout(150);
    await pg.keyboard.type('T' + r, { delay: 80 }); await pg.keyboard.press('Tab'); await pg.keyboard.type('Ligne A.\nLigne B.\nLigne C.', { delay: 80 }); await pg.waitForTimeout(300);
    lignes.push(await pg.evaluate(() => { const e = ecran(); const b2 = e.blocs[e.blocs.length - 1]; return (b2.el || []).map(x => typeof x === 'string' ? x : (x && (x.t || x.txt)) || '').join('|'); })); }
  E.verif('A25', lignes.every(x => x === 'Ligne A.|Ligne B.|Ligne C.'), 'réveil n°4, 1 (grave) : dans un bloc neuf, « Ligne A. » Entrée « Ligne B. » Entrée « Ligne C. » à 80 ms par touche, quatre fois : chaque ligne entière, aucune lettre sur la ligne d\'avant', lignes.join(' ; '));
  // clic droit sur une étape, Échap : le menu se ferme
  await pg.click('#volet [data-at-di="0"]'); await pg.waitForTimeout(200);
  const li = await pg.$('#mur li[data-p]:not([data-p$=".t"])'); if (li) { await li.click(); await li.click({ button: 'right' }); await pg.waitForTimeout(200); }
  const m0 = await pg.evaluate(() => $('menu').classList.contains('on')); await pg.keyboard.press('Escape'); await pg.waitForTimeout(150); const m1 = await pg.evaluate(() => $('menu').classList.contains('on'));
  E.verif('A25', !!li && m0 && !m1, 'clic droit sur une étape, Échap : le menu se ferme (Échap renonce)', JSON.stringify({ m0, m1 }));
  // heure lancée : ▶ jusqu'à la diapo 8, la vignette courante reste en vue dans la colonne
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800); /* la séance 0 (la séance 2 n'a plus de case à 9 h : E2, réveil n°13) */
  await pg.mouse.click(683, 300); for (let k = 0; k < 40 && (await pg.evaluate(() => S.di)) < 7; k++) { await pg.click('#bdev', { timeout: 3000 }).catch(() => pg.keyboard.press('ArrowRight')); await pg.waitForTimeout(80); }
  await pg.waitForTimeout(300);
  const vg = await pg.evaluate(() => { const c = document.querySelector('#volet .vig.cour'); if (!c) return null; const r = c.getBoundingClientRect(); return { di: S.di, top: Math.round(r.top), bas: Math.round(r.bottom), h: innerHeight, sous: (document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) || { closest: () => null }).closest('.vig') === c }; });
  E.verif('A25', vg && vg.di >= 4 && vg.top >= 0 && vg.bas <= vg.h && vg.sous, '▶ jusqu\'à la dernière diapo de l\'heure (' + (vg ? vg.di + 1 : '?') + ') à 1366 × 768 : la vignette courante est en vue, au premier plan (le volet suit S.di)', JSON.stringify(vg));
  // F2, initiales, 2, une note, Entrée : une seule pose, motif 2 avec la note ; puis la note d'abord, 3, Entrée
  const ini = await pg.evaluate(() => Array.from(document.querySelectorAll('#part span[data-ini]')).map(x => x.dataset.ini).find(i => dr_candidats(i).length === 1));
  const pose = async (gestes) => { await pg.keyboard.press('Escape'); await pg.mouse.click(5, 5); await pg.keyboard.press('F2'); await pg.waitForTimeout(60); for (const g of gestes) { if (g === 'Enter') await pg.keyboard.press('Enter'); else await pg.keyboard.type(g, { delay: 70 }); } await pg.waitForTimeout(300); };
  const p0 = await pg.evaluate(() => S.parts.length);
  await pose([ini, '2', 'bonne idee', 'Enter']);
  const p1 = await pg.evaluate(() => ({ n: S.parts.length, d: S.parts.slice(-1).map(x => ({ nom: x.nom, m: x.m, note: x.note }))[0], vif: $('vif').value, pop: $('ppop').classList.contains('on') }));
  E.verif('A25', p1.n === p0 + 1 && p1.d.m === 'piste' && p1.d.note === 'bonne idee' && !p1.pop, 'F2, « ' + ini + ' », 2, une note, Entrée : une seule prise de parole, « a proposé une piste » avec la note ; le chiffre ne s\'écrit pas', JSON.stringify({ p0, p1 }));
  await pose([ini, 'bien vu', '3', 'Enter']);
  const p2 = await pg.evaluate(() => ({ n: S.parts.length, d: S.parts.slice(-1).map(x => ({ m: x.m, note: x.note }))[0] }));
  const notes = []; for (let r = 0; r < 4; r++) { await pose([ini, 'bien vu', '3', 'Enter']); notes.push(await pg.evaluate(() => S.parts[S.parts.length - 1].note)); }
  E.verif('A25', notes.every(x => x === 'bien vu'), 'F2, la note tapée vite juste après les initiales, quatre fois : jamais une lettre perdue (le curseur passe à la note dans la même tâche)', notes.join(' | '));
  E.verif('A25', p2.n === p1.n + 1 && p2.d.m === 'revenir' && p2.d.note === 'bien vu', 'F2, la note d\'abord, puis 3, Entrée : « on y reviendra avec lui » avec la note « bien vu »', JSON.stringify(p2));
  // mode test du site : la pastille dans l'entête, jamais « Enregistré à … »
  await pg.evaluate(() => { M8_TEST = true; }); await pg.waitForTimeout(1700); await pg.click('#bdev').catch(() => {}); await pg.waitForTimeout(1200);
  const mt = await pg.evaluate(() => { const t = document.getElementById('dr-enr'); const r = t.getBoundingClientRect(); return { txt: t.textContent, cl: t.classList.contains('dr-test'), vu: r.width > 0 && r.right <= innerWidth }; }); await pg.evaluate(() => { M8_TEST = false; }); await pg.waitForTimeout(1700);
  const mt2 = await pg.evaluate(() => document.getElementById('dr-enr').textContent);
  E.verif('A25', /^mode test/.test(mt.txt) && mt.cl && mt.vu && !/mode test/.test(mt2), 'mode test du site : « mode test — rien n\'est enregistré » en pastille dans l\'entête (jamais « Enregistré à … ») ; elle part avec le mode test', JSON.stringify({ mt, mt2 }));
  E.verif('A25', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });

await B('A26', 'le réveil n°5 et la relecture continue d\'E4 (A4 14:50, B4 15:50, A5 16:15) : la page suit ▶, la question ouvre sa réponse, la consigne grise reste grise, l\'atelier en classe tient à la reprise, Ctrl+B à la bonne occurrence, l\'entête et l\'image stables, le numéro du dégel, rien de « terminé » avant le lancement', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg);
  // B4 · l'entête ne descend pas quand le témoin paraît ; l'image absente garde sa ligne, jamais l'icône cassée
  await pg.click('#volet [data-at-di="1"]'); await pg.waitForTimeout(400);
  const h0 = await pg.evaluate(() => document.querySelector('#dr-zone .haut').getBoundingClientRect().height);
  await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('que je dis que je pense', { delay: 20 }); await pg.mouse.click(5, 400); await pg.waitForTimeout(2200);
  const h1 = await pg.evaluate(() => ({ haut: document.querySelector('#dr-zone .haut').getBoundingClientRect().height, enr: document.getElementById('dr-enr').textContent, casse: Array.from(document.querySelectorAll('#mur .img-sup img')).filter(i => i.complete && !i.naturalWidth && getComputedStyle(i).display !== 'none').length, vide: Array.from(document.querySelectorAll('#mur .img-vide')).filter(v => getComputedStyle(v).display !== 'none').map(v => v.textContent.slice(0, 40)) }));
  E.verif('A26', /^Enregistré à/.test(h1.enr) && Math.abs(h1.haut - h0) < 2, 'B4 · « Enregistré à … » paraît dans l\'entête sans la faire descendre (' + h0 + ' → ' + h1.haut + ' px)', JSON.stringify(h1.enr));
  E.verif('A26', h1.casse === 0 && h1.vide.length > 0, 'B4 · après une modification, l\'image absente montre « image absente de mjpc-medias · … », jamais l\'icône cassée', JSON.stringify(h1));
  // B4 · Ctrl+B sur la 2ᵉ occurrence de « que je » : c'est elle qui passe en gras
  await pg.evaluate(() => { const e = ecran(); const bi = e.blocs.length - 1; const li = document.querySelector('#mur [data-p="' + bi + '.0"]'); const w = document.createTreeWalker(li, NodeFilter.SHOW_TEXT); const t = w.nextNode(); const i = t.data.indexOf('que je', 1); const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + 6); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); });
  await pg.keyboard.press('Control+b'); await pg.waitForTimeout(300); await pg.mouse.click(5, 400); await pg.waitForTimeout(300);
  const gr = await pg.evaluate(() => { const e = ecran(); const bi = e.blocs.length - 1; const li = document.querySelector('#mur [data-p="' + bi + '.0"]'); const bb = li && li.querySelector('b.p8-gras'); if (!bb) return null; const r = document.createRange(); r.setStart(li, 0); r.setEndBefore(bb); return { avant: r.toString(), b: bb.textContent, donnee: JSON.stringify((e.forme || {}).gras || []) }; });
  E.verif('A26', gr && gr.b === 'que je' && gr.avant === 'que je dis ', 'B4 · Ctrl+B sur la 2ᵉ occurrence de « que je » : la 2ᵉ passe en gras, pas la 1ʳᵉ (la position est gardée)', JSON.stringify(gr));
  // B4 · ▶ ×3 au Pilotage avant le lancement : rien de « terminé » une fois l'heure lancée
  await pg.click('#volet [data-at-di="8"]'); await pg.waitForTimeout(200); await pg.evaluate(() => voir('pilotage')); await pg.waitForTimeout(300); 
  for (let i = 0; i < 6 && (await pg.evaluate(() => etatDiapo().nDev < elements(ecran()).length)); i++) { await pg.click('#bdev'); await pg.waitForTimeout(150); }
  const av = await pg.evaluate(() => ({ di: S.di, n: etatDiapo().nDev }));
  const si0 = await pg.evaluate(() => S.si); await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800);
  const ap = await pg.evaluate(di => ({ si: S.si, n: (parDiapo[K(di)] || {}).nDev || 0, J: J.filter(x => x.type === 'devoile').length }), av.di);
  E.verif('A26', av.di === 8 && av.n > 0 && ap.si === si0 && ap.n === 0 && ap.J === 0, 'B4 · la diapo 9 ouverte dans l\'atelier, ▶ jusqu\'au bout au Pilotage avant de lancer (' + av.n + ' dévoilé(s) sur la diapo ' + (av.di + 1) + ') : au lancement, rien n\'en reste — « pas jouée », rien au journal', JSON.stringify({ av, ap }));
  // A4 · la page suit ce que ▶ vient de montrer (une question à réponses nombreuses : l'étape de la page 1 ne bascule pas en page 2)
  const qi = await pg.evaluate(() => { const aQ = e => (e.blocs || []).some(b => b.t === 'question'); const i = ordreHeure(S.heure).find(k => aQ(seance().ecrans[k])) ?? seance().ecrans.findIndex(aQ); S.di = i; dr_tout(); const e = ecran(); const bi = e.blocs.findIndex(b => b.t === 'question'); const d = etatDiapo(); d.reps = d.reps || {}; d.reps[bi] = Array.from({ length: 14 }, (_, k) => ({ eleve: ELEVES[k % ELEVES.length], r: 'Réponse numéro ' + (k + 1) + ' : la nature domine l\'homme et le sentiment, longuement' })); d.nDev = 1; S.page = null; S.neuf = null; dr_tout(); return { i, pages: (S.pagesCourantes || []).length, page: S.page }; });
  await pg.click('#bdev'); await pg.waitForTimeout(300);
  const pa = await pg.evaluate(() => { const d = etatDiapo(); const k = d.nDev - 1; const pi = (S.pagesCourantes || []).findIndex(p => p.some(i => { const els = Array.from(document.querySelectorAll('#mur [data-k], #mur .rep[data-r]')); return els[i] && els[i].dataset.k != null && +els[i].dataset.k === k; })); const el = document.querySelector('#mur [data-k="' + k + '"]'); return { nDev: d.nDev, page: S.page, pages: (S.pagesCourantes || []).length, vu: !!(el && el.offsetParent && !el.classList.contains('hors')) }; });
  E.verif('A26', qi.pages > 1 && pa.vu && pa.page === 0, 'A4 · une question-bilan à ' + qi.pages + ' pages : ▶ dévoile l\'étape de la page 1 — la page reste la 1, l\'élément montré est visible', JSON.stringify({ qi, pa }));
  // A4 · un clic dans une question grisée : dévoilée, et le curseur dans la saisie de sa réponse
  await pg.evaluate(() => { const i = ordreHeure(S.heure).find(k => k !== S.di && (seance().ecrans[k].blocs || []).some(b => b.t === 'question')) ?? seance().ecrans.findIndex((e, k) => k !== S.di && (e.blocs || []).some(b => b.t === 'question')); S.di = i; S.page = null; dr_tout(); }); await pg.waitForTimeout(300);
  await pg.click('#mur .q.pas'); await pg.keyboard.type('EA', { delay: 60 }); await pg.waitForTimeout(300);
  const qc = await pg.evaluate(() => { const a = document.activeElement; return { ini: !!(a && a.classList.contains('ini')), txt: a && a.textContent, q: document.querySelector('#mur .q').classList.contains('pas'), loupe: !!S.loupe }; });
  E.verif('A26', qc.ini && /EA/.test(qc.txt || '') && !qc.q && !qc.loupe, 'A4 · clic dans une question grisée puis « EA » : la question dévoilée, la frappe dans les initiales de la réponse (pas d\'espace qui dévoile, pas de loupe)', JSON.stringify(qc));
  await pg.keyboard.press('Escape'); await pg.mouse.click(5, 400);
  // A5 · un clic dans une ligne grise d'une consigne : rien ne se dévoile (seul ▶ avance)
  const cg = await pg.evaluate(() => { const aC = e => (e.blocs || []).some(b => b.t === 'consigne' && (b.el || b.etapes || []).length >= 2); const i = ordreHeure(S.heure).find(k => aC(seance().ecrans[k])) ?? seance().ecrans.findIndex(aC); S.di = i; S.page = null; dr_tout(); return { i, n: etatDiapo().nDev }; }); await pg.waitForTimeout(300);
  const lg = await pg.$$('#mur .bloc li.pas[data-k]'); if (lg.length) { await lg[lg.length - 1].click(); await pg.waitForTimeout(300); }
  const cg2 = await pg.evaluate(() => etatDiapo().nDev); const cur = await pg.evaluate(() => { const a = document.activeElement; const l = Array.from(document.querySelectorAll('#mur .bloc li.pas[data-k]')).pop(); return !!(a && l && (a === l || l.contains(a) || a.contains(l))); });
  E.verif('A26', lg.length > 0 && cg2 === cg.n && cur, 'A5 · un clic dans la dernière ligne grise d\'une consigne : le curseur y est (la saisie, dans la copie), rien ne se dévoile (' + cg.n + ' → ' + cg2 + ') — le reste à la flèche (C1 4.3, 2.2)', JSON.stringify({ cg, cur }));
  // A5 · le dégel avec un écart dit le vrai numéro (celui de l'heure)
  await pg.evaluate(() => { const o = ordreHeure(S.heure); S.di = o[1]; S.page = null; dr_tout(); gel(); S.di = o.find((i, k) => i !== k) ?? o[o.length - 1]; S.page = null; dr_tout(); gel(); }); await pg.waitForTimeout(300);
  const dg = await pg.evaluate(() => ({ t: document.getElementById('garde2-titre').textContent, attendu: 'diapo ' + rangDe(S.di, S.heure), di1: S.di + 1, tete: (document.querySelector('#dr-zone .ou, .p8-ou, #ou') || {}).textContent || '' }));
  E.verif('A26', dg.t.includes('tu es à la ' + dg.attendu + '.') && dg.attendu !== 'diapo ' + dg.di1 && dg.t.includes('diapo 2,'), 'A5 · le dégel avec un écart : « La classe est sur la diapo 2, tu es à la ' + dg.attendu + ' » — le rang dans l\'heure', dg.t);
  await pg.evaluate(() => { document.getElementById('garde2').classList.remove('on'); });
  // réveil n°7 · le témoin lisible en entier au Pilotage, à 1366 et 1280 (« Enregistré à 09:00 »)
  for (const [w, h] of [[1366, 768], [1280, 800]]) { await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(300); await pg.evaluate(() => dr_temoinHub());
    const te = await pg.evaluate(() => { const t = document.getElementById('dr-enr'); const r = t.getBoundingClientRect(); const z = document.getElementById('dr-zone').getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { txt: t.textContent, entier: t.scrollWidth <= t.clientWidth + 1 && r.width > 40, dans: r.right <= z.right + 1 && r.bottom <= innerHeight, dessus: !!(el && (el === t || t.contains(el))) }; });
    E.verif('A26', /^Enregistré à \d\d:\d\d$/.test(te.txt) && te.entier && te.dans && te.dessus, 'réveil n°7 · ' + w + ' × ' + h + ' : au Pilotage, « ' + te.txt + ' » se lit en entier dans l\'entête', JSON.stringify(te)); }
  await pg.setViewportSize({ width: 1366, height: 768 }); await pg.waitForTimeout(200);
  E.verif('A26', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close();
  // B4 (grave) · l'atelier ouvert pendant l'heure : un bloc écrit tient à « Reprendre le cours »
  const o1 = await E.ouvrir(b, { w: 1366, h: 768 }); let p1 = o1.pg; await sansVoile(p1);
  await p1.click('[data-lancer="1"]'); await p1.waitForTimeout(800); await p1.click('#bdev'); await p1.waitForTimeout(200);
  await p1.click('#ong-atelier'); await p1.waitForTimeout(600); const eid = await p1.evaluate(() => ecran().eid); /* réveil n°7 : en heure lancée, on écrit un bloc neuf par l'onglet Atelier (#ong-atelier) puis « ✎ clique ici et écris » (#mur .p8-ecrire) */
  await p1.click('#mur .p8-ecrire'); await p1.keyboard.type('Bloc tapé en classe', { delay: 30 }); await p1.mouse.click(5, 400); await p1.waitForTimeout(400); await p1.click('#ong-pilotage'); await p1.waitForTimeout(2500);
  const ja = await p1.evaluate(eid => ({ n: ecran().blocs.length, cc: J.filter(x => x.type === 'copie-classe' && x.eid === eid).length, autres: J.filter(x => /^atelier/.test(x.type)).length }), eid);
  E.verif('A26', ja.cc === 1 && ja.autres === 0, 'B4 (grave) · un bloc écrit dans l\'atelier pendant l\'heure : une entrée « copie-classe » pour la diapo (ce que la reprise lit pour garder la copie), rien d\'autre de l\'atelier au journal', JSON.stringify(ja));
  const hub = await p1.evaluate(() => window.__HUB); await o1.ctx.close();
  const o2 = await E.ouvrir(b, { w: 1366, h: 768, hub }); const p2 = o2.pg; await sansVoile(p2); await E.clicTexte(p2, 'button', 'Reprendre le cours'); await p2.waitForTimeout(1500);
  const rp = await p2.evaluate(eid => { const e = seance().ecrans.find(x => x.eid === eid); return e ? e.blocs.length : null; }, eid);
  E.verif('A26', rp === ja.n, 'B4 (grave 110), de bout en bout : après rechargement et « Reprendre le cours », le bloc écrit en classe est toujours là (' + rp + ' / ' + ja.n + ' blocs) — ma part (l\'entrée copie-classe) et celle d\'E2 (dr_reprendre relit C/ecrans, réveil n°6)', String(rp));
  E.verif('A26', !o2.errs.length, 'la reprise : aucune erreur JS', o2.errs.join(' ; ') || undefined); await o2.ctx.close();
  // la passe d'infobulles (contrat, après les dettes) : chaque bouton visible de mon territoire en a une — Atelier, Pilotage, Relecture
  const o3 = await E.ouvrir(b, { w: 1366, h: 768 }); const p3 = o3.pg; await sansVoile(p3);
  const sans = () => p3.evaluate(() => Array.from(document.querySelectorAll('#dr-zone button, #dr-zone [role=button], #dr-zone .btn, #dr-zone input[type=range], #dr-zone select, #at-arbre .at-som-pli')).filter(x => x.offsetParent && !x.title && !x.getAttribute('aria-label') && !(x.closest('[title]') && x.closest('[title]') !== document.body)).map(x => (x.id ? '#' + x.id : String(x.className).slice(0, 30)) + ' « ' + (x.textContent || '').trim().slice(0, 30) + ' »'));
  const ia = await sans(); await p3.click('[data-lancer="1"]'); await p3.waitForTimeout(800); const ip = await sans(); await p3.evaluate(() => voir('relecture')); await p3.waitForTimeout(500); const ir = await sans();
  E.verif('A26', !ia.length && !ip.length && !ir.length, 'la passe d\'infobulles : aucun bouton visible sans infobulle, dans l\'Atelier, le Pilotage en classe et la Relecture', ia.concat(ip, ir).join(' · ') || undefined); await o3.ctx.close(); });

await B('A27', 'le réveil n°8 (contrat §12.8) : la copie jouée d\'un autre jour — un titre retouché en classe le lundi est là le mardi ; dr_jouerCopie fusionne par eid ; une séance close repart de la trame', async () => {
  // lundi : l'heure 1, un titre retouché en classe
  const o1 = await E.ouvrir(b, { w: 1366, h: 768 }); const p1 = o1.pg; await sansVoile(p1);
  await p1.click('[data-lancer="1"]'); await p1.waitForTimeout(800); for (let i = 0; i < 2; i++) { await p1.click('#bdev'); await p1.waitForTimeout(150); }
  const ci = await p1.evaluate(() => { const e = ecran(); const bi = e.blocs.findIndex(b => b.bid && b.txt != null); return { eid: e.eid, bi, bid: e.blocs[bi].bid, txt: e.blocs[bi].txt }; });
  await p1.click(`#mur [data-p="${ci.bi}.t"]`); await p1.keyboard.press('End'); await p1.keyboard.type(' — retouché lundi', { delay: 30 }); await p1.mouse.click(5, 400); await p1.waitForTimeout(2500);
  const hub = await p1.evaluate(() => window.__HUB); E.verif('A27', !o1.errs.length, 'lundi : aucune erreur JS', o1.errs.join(' ; ') || undefined); await o1.ctx.close();
  // mardi 15/09, 15 h 05 : l'heure suivante, par l'écran d'ouverture
  const o2 = await E.ouvrir(b, { w: 1366, h: 768, hub, quand: '2026-09-15T15:05:00+02:00' }); const p2 = o2.pg; await sansVoile(p2);
  const prop = await p2.evaluate(() => (document.querySelector('[data-lancer="1"]') || {}).textContent || ''); await p2.click('[data-lancer="1"]'); await p2.waitForTimeout(1500);
  const ol = await p2.$('#o-lancer'); if (ol) { await ol.click(); await p2.waitForTimeout(1500); }
  const ma = await p2.evaluate(c => { const e = seance().ecrans.find(x => x.eid === c.eid); const b = e && e.blocs.find(x => x.bid === c.bid); const i = seance().ecrans.indexOf(e); S.di = i; S.page = null; dr_tout(); const li = document.querySelector('#mur [data-p="' + c.bi + '.t"]'); return { heure: S.heure, lancee: S.lancee, close: S.close, txt: b && b.txt, vu: li ? li.textContent : null }; }, ci);
  E.verif('A27', /heure 2/.test(prop) && !!ol && ma.heure === 2 && ma.lancee && !ma.close && /retouché lundi$/.test(ma.txt || '') && /retouché lundi/.test(ma.vu || ''), 'mardi, « ' + prop.trim().slice(0, 60) + ' » puis « Lancer l\'heure 2 » : le titre retouché en classe le lundi est là, dans la copie et à l\'écran', JSON.stringify(ma));
  E.verif('A27', !o2.errs.length, 'mardi : l\'écran d\'ouverture sans erreur JS (une heure de la veille jamais close n\'a pas de S.closes)', o2.errs.join(' ; ') || undefined); await o2.ctx.close();
  // dr_jouerCopie : la copie d'avant fusionnée par eid, retouches comprises ; une séance close repart de la trame ; l'enveloppe d'atDrJouer posée
  const o3 = await E.ouvrir(b, { w: 1366, h: 768 }); const p3 = o3.pg; await sansVoile(p3);
  const jc = await p3.evaluate(() => { const E0 = seance().ecrans; const e = E0[0]; const b0 = e.blocs.find(x => x.bid && x.txt != null); const avant = b0.txt; const trame = JSON.parse(JSON.stringify(E0));
    const copie = { ecrans: JSON.parse(JSON.stringify(E0)), journal: [{ type: 'diapo', eid: e.eid, h: 1 }, { type: 'copie-classe', eid: e.eid, h: 1 }], etat: { S: { copie: { 1: { [e.eid]: { [b0.bid]: { t: 'Titre de la classe' } } } } } }, heures: { a: { clos: true, heure: 1, sur: 3 } } };
    const r1 = dr_jouerCopie(copie); const apres = seance().ecrans[0].blocs.find(x => x.bid === b0.bid).txt;
    E0.splice(0, E0.length, ...JSON.parse(JSON.stringify(trame)));
    const heures = { h1: { clos: true, heure: 1, sur: 2 }, h2: { clos: true, heure: 2, sur: 2 } };
    const r2 = dr_jouerCopie(Object.assign({}, copie, { heures })); const close = seance().ecrans[0].blocs.find(x => x.bid === b0.bid).txt;
    E0.splice(0, E0.length, ...trame); return { avant, apres, fusion: !!r1, close, r2: r2 === null, env: !!(window.atDrJouer && atDrJouer._dr) }; });
  E.verif('A27', jc.fusion && jc.apres === 'Titre de la classe' && jc.r2 && jc.close === jc.avant && jc.env, 'dr_jouerCopie (au premier lancement, appelée par dr_lancerNeuf d\'E2) : la copie d\'avant fusionnée par eid, le titre retouché en classe repris ; sa dernière heure (« 2 sur 2 ») close : la trame (LOT A ④) ; l\'enveloppe d\'atDrJouer garde la copie avant qu\'elle soit réécrite', JSON.stringify(jc));
  E.verif('A27', !o3.errs.length, 'aucune erreur JS', o3.errs.join(' ; ') || undefined); await o3.ctx.close(); });

await B('A28', 'le réveil n°9 et la relecture continue d\'E4 (20:50) : l\'onglet Atelier pendant l\'heure — la classe ne saute pas, la retouche part au hub sans repasser au Pilotage ; la légende de deux lignes ; « Diapo suivante » dit « préparée à la maison — à reprendre »', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg);
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800); for (let i = 0; i < 8; i++) { await pg.click('#bdev'); await pg.waitForTimeout(120); }
  const av = await pg.evaluate(() => ({ di: S.di, mur: S.mur && S.mur.di, n: J.length }));
  await pg.click('#ong-atelier'); await pg.waitForTimeout(500); await pg.click('#volet [data-at-di="6"]'); await pg.waitForTimeout(300); const eid = await pg.evaluate(() => ecran().eid);
  await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('Retouche en atelier', { delay: 20 }); await pg.mouse.click(5, 400); await pg.waitForTimeout(1800);
  const au = await pg.evaluate(eid => { const c = window.__HUB.site['3e'].chapitres[0].seances[0].deroule_joue; const k = Object.keys(c)[0]; const e = ((c[k] || {}).ecrans || []).find(x => x.eid === eid); return { hub: e ? e.blocs.length : 0, ici: seance().ecrans.find(x => x.eid === eid).blocs.length, temoin: (document.getElementById('at-save') || {}).textContent, trame: (window.__HUB.site['3e'].chapitres[0].seances[0].deroule || { ecrans: [] }).ecrans.filter(x => x.eid === eid).map(x => x.blocs.length)[0] }; }, eid);
  E.verif('A28', au.hub === au.ici && au.hub >= 2 && /enregistré/.test(au.temoin) && au.trame !== au.ici, 'grave (perte) · l\'onglet Atelier ouvert pendant l\'heure : la retouche est dans la copie de la classe au hub en moins de 2 s, sans repasser au Pilotage — jamais dans la trame', JSON.stringify(au));
  const hub = await pg.evaluate(() => window.__HUB);
  await pg.click('#ong-pilotage'); await pg.waitForTimeout(800);
  const ap = await pg.evaluate(n0 => ({ di: S.di, mur: S.mur && S.mur.di, nouv: J.slice(n0).map(x => x.type), garde: document.getElementById('garde').classList.contains('on') }), av.n);
  E.verif('A28', ap.di === av.di && ap.mur === av.mur && !ap.garde && ap.nouv.every(t => t === 'copie-classe'), 'grave · retour au Pilotage : Paul retrouve la diapo où est la classe (' + (av.di + 1) + '), le tableau n\'a pas bougé, aucune garde, rien d\'autre au journal que la copie retouchée', JSON.stringify({ av, ap }));
  E.verif('A28', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close();
  const o2 = await E.ouvrir(b, { w: 1366, h: 768, hub }); const p2 = o2.pg; await sansVoile(p2); await E.clicTexte(p2, 'button', 'Reprendre le cours'); await p2.waitForTimeout(1500);
  const rp = await p2.evaluate(eid => seance().ecrans.find(x => x.eid === eid).blocs.length, eid);
  E.verif('A28', rp === au.ici, 'grave · la page quittée depuis l\'onglet Atelier, « Reprendre le cours » : la retouche est là (' + rp + ' blocs)', String(rp)); await o2.ctx.close();
  // réveil n°10 · la frontière d'heure hors classe : l'atelier montre les heures que la classe jouera ; rien n'est écrit dans la trame à l'ouverture
  const o3 = await E.ouvrir(b, { w: 1280, h: 800 }); const p3 = o3.pg; await sansVoile(p3);
  const fh = await p3.evaluate(() => ({ heures: [...new Set(dr_trame().filter(e => e.role !== 'fin').map(e => e.heure))].join(','), sea: ((document.querySelector('#volet .sea2') || {}).textContent || '').match(/\((\d+) h\)/), trame: window.__ECR.filter(x => /deroule$/.test(x)).length }));
  E.verif('A28', fh.heures.split(',').length > 1 && fh.sea && +fh.sea[1] > 1 && fh.trame === 0, 'réveil n°10 · hors classe, la séance 0 dit ses heures (' + fh.heures + ' ; « (' + (fh.sea ? fh.sea[1] : '?') + ' h) ») comme en classe — la frontière posée par le calcul d\'E2, rien d\'écrit dans la trame à l\'ouverture', JSON.stringify(fh));
  // la légende d'une image pleine, sur deux lignes, dans l'atelier à 1280 : entière dans le cadre
  await p3.click('#volet [data-at-di="3"]'); await p3.waitForTimeout(400); await p3.click('#mur .img-lg'); await p3.keyboard.press('End'); await p3.keyboard.type(' (huile sur toile, 491 × 716 cm, musée du Louvre, Paris)', { delay: 5 }); await p3.waitForTimeout(300);
  const lg = await p3.evaluate(() => { const x = document.querySelector('#mur .img-lg'); const r = x.getBoundingClientRect(); const ec = x.closest('.ecran').getBoundingClientRect(); return { entiere: x.scrollHeight <= x.clientHeight + 1, dedans: r.top >= ec.top - 1 && r.bottom <= ec.bottom + 1, lignes: Math.round(x.clientHeight / parseFloat(getComputedStyle(x).lineHeight || 20)) }; });
  E.verif('A28', lg.entiere && lg.dedans, '1280 · la légende d\'une image pleine, éditée sur deux lignes : entière, dans le cadre (le texte ne se coupe jamais)', JSON.stringify(lg));
  // « Diapo suivante » : le libellé de l'ouverture (§12.17)
  const lb = await p3.evaluate(() => { const e = seance().ecrans[0]; const k = cleDec(e); const avant = S.decisions[k]; S.decisions[k] = { choix: 'preparer', heure: 1 }; const a = dr_libGlissee(e, 2); S.decisions[k] = { choix: 'terminer', heure: 1 }; const b2 = dr_libGlissee(e, 2); S.decisions[k] = { choix: 'suivante', heure: 1 }; const c = dr_libGlissee(e, 2); if (avant) S.decisions[k] = avant; else delete S.decisions[k]; return { a, b: b2, c }; });
  E.verif('A28', lb.a === 'préparée à la maison — à reprendre' && lb.b === 'terminée à la maison — à reprendre' && /glissée/.test(lb.c), '« Diapo suivante » : « préparée à la maison — à reprendre », « terminée à la maison — à reprendre », « glissée » — le libellé de l\'ouverture (dr_libGlissee d\'E2, une seule fonction)', JSON.stringify(lb));
  E.verif('A28', !o3.errs.length, 'aucune erreur JS', o3.errs.join(' ; ') || undefined); await o3.ctx.close(); });

await B('A29', 'le réveil n°11 : la retouche de l\'onglet Atelier pendant l\'heure dans la copie de la classe (S.copie[h], versable à la clôture), le témoin à « enregistré » ; la garde de ◀ au rang de l\'heure ; Entrée dans « + bloc » et « Envoyer vers… »', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg);
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800); await pg.click('#bdev'); await pg.waitForTimeout(150);
  await pg.click('#ong-atelier'); await pg.waitForTimeout(500); await pg.click('#volet [data-at-di="2"]'); await pg.waitForTimeout(300);
  const ci = await pg.evaluate(() => { const e = ecran(); const bi = e.blocs.findIndex(b => b.bid && b.txt != null); return { eid: e.eid, bi, bid: e.blocs[bi].bid, txt: e.blocs[bi].txt, h: S.heure }; });
  await pg.click(`#mur [data-p="${ci.bi}.t"]`); await pg.keyboard.press('End'); await pg.keyboard.type(' — retouche atelier', { delay: 25 }); await pg.waitForTimeout(2200);
  const ra = await pg.evaluate(c => { const e = seance().ecrans.find(x => x.eid === c.eid); const b = e.blocs.find(x => x.bid === c.bid); const cp = ((S.copie || {})[c.h] || {})[c.eid] || {}; const li = document.querySelector('#mur [data-p="' + c.bi + '.t"]'); const dj = window.__HUB.site['3e'].chapitres[0].seances[0].deroule_joue; const k = Object.keys(dj)[0]; return { copie: (cp[c.bid] || {}).t, trame: b.txt, vu: li && li.textContent, hub: JSON.stringify((dj[k] || {}).etat || {}).includes('retouche atelier'), temoin: (document.getElementById('at-save') || {}).textContent }; }, ci);
  E.verif('A29', /retouche atelier$/.test(ra.copie || '') && ra.trame === ci.txt && /retouche atelier/.test(ra.vu || '') && ra.hub, '149 (a) · une retouche de texte dans l\'onglet Atelier pendant l\'heure va dans la copie de la classe (S.copie[h]), comme au Pilotage ; l\'atelier la montre ; la trame ne bouge pas ; elle est au hub (C/etat) sans repasser au Pilotage', JSON.stringify(ra).slice(0, 220));
  E.verif('A29', /^✔ enregistré à \d\d:\d\d$/.test(ra.temoin || ''), '149 (b) · après l\'écriture faite depuis l\'atelier, le témoin dit « enregistré à … » (la vérité du hub)', ra.temoin);
  await pg.click('#ong-pilotage'); await pg.waitForTimeout(600);
  const ver = await pg.evaluate(c => { const d = document.createElement('div'); d.innerHTML = p8ListeVersement(); return { liste: /retouche atelier/.test(d.textContent), diffère: p8CopieDiffere() }; }, ci);
  E.verif('A29', ver.liste && ver.diffère, '149 (a) · à la clôture, « verser dans la trame » propose la retouche faite dans l\'atelier (C1 8.4)', JSON.stringify(ver));
  // ◀ : la garde dit le rang dans l'heure
  const gd = await pg.evaluate(() => { const o0 = ordreHeure(S.heure).filter(i => seance().ecrans[i].role !== 'fin'); const o1 = o0.slice().reverse(); S.ordres[S.heure] = o1.concat(ordreHeure(S.heure).filter(i => seance().ecrans[i].role === 'fin')); S.di = o1[2]; S.page = null; etatDiapo().nDev = 0; dr_tout(); revoiler(); const t = document.getElementById('garde-titre').textContent; document.getElementById('garde').classList.remove('on'); S.ordres[S.heure] = o0.concat(ordreHeure(S.heure).filter(i => seance().ecrans[i].role === 'fin')); return { t, prec: o1[1] }; });
  E.verif('A29', /revenir à la diapo 2\b/.test(gd.t) && gd.prec + 1 !== 2, '156 · ◀ hors du fil : « La classe te suivrait — revenir à la diapo 2 » — le rang dans l\'heure, plus celui de la trame (' + (gd.prec + 1) + ')', gd.t);
  E.verif('A29', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close();
  // Entrée dans « + bloc » et « Envoyer vers… »
  const o2 = await E.ouvrir(b, { w: 1366, h: 768 }); const p2 = o2.pg; await sansVoile(p2);
  await p2.click('#volet [data-at-di="1"]'); await p2.waitForTimeout(300); const nb0 = await p2.evaluate(() => ecran().blocs.length);
  await p2.click('#at-bloc'); await p2.waitForTimeout(200); await p2.keyboard.press('Enter'); await p2.waitForTimeout(300);
  const pb = await p2.evaluate(n => ({ ouvert: !!document.querySelector('.choix-obj'), form: !!document.querySelector('#obj-form input, #obj-form textarea'), blocs: ecran().blocs.length - n }), nb0);
  E.verif('A29', pb.blocs === 1 || pb.form, '« + bloc », Entrée : le premier objet est choisi (un bloc posé, ou son formulaire ouvert) — plus « rien »', JSON.stringify(pb));
  await p2.keyboard.press('Escape'); await p2.mouse.click(5, 400);
  const n0 = await p2.evaluate(() => seance().ecrans.length); await p2.evaluate(() => envoyerVersSeance(S.di)); await p2.waitForTimeout(200); await p2.keyboard.press('ArrowDown'); await p2.keyboard.press('Enter'); await p2.waitForTimeout(400);
  const ev = await p2.evaluate(n => ({ ouvert: !!document.querySelector('.choix-obj'), parti: n - seance().ecrans.length }), n0);
  E.verif('A29', !ev.ouvert && ev.parti === 1, '« Envoyer vers… », ↓ puis Entrée : la diapo part vers la séance choisie au clavier', JSON.stringify(ev));
  E.verif('A29', !o2.errs.length && !o2.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o2.errs.concat(o2.boites)).join(' ; ') || undefined); await o2.ctx.close(); });

await B('A30', 'le réveil n°12 : hors classe, l\'heure suivante s\'ouvre sur le rituel (« Où en sommes-nous ? ») et finit sur le bilan (§12.16, C1 6.1) ; chaque heure porte sa date (la case du jour, puis les prochaines cases de l\'EDT)', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg); await pg.waitForTimeout(2500); await pg.evaluate(() => dr_tout()); await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => { const E0 = seance().ecrans; const o2 = ordreHeure(2).filter(i => E0[i].role !== 'fin').map(i => E0[i].act); const vol = Array.from(document.querySelectorAll('#volet [data-at-di]')).map(x => +x.dataset.atDi); const i1 = vol.indexOf(ordreHeure(2)[0]); const fr = Array.from(document.querySelectorAll('#volet .fr span:first-child')).map(x => x.textContent).filter(x => /^H\d/.test(x)); return { premier: o2[0], dernier: o2[o2.length - 1], fr }; });
  E.verif('A30', /sommes-nous/.test(r.premier || '') && /bilan/i.test(r.dernier || ''), '160 · hors classe, H2 s\'ouvre sur « ' + r.premier + ' » et finit sur « ' + r.dernier + ' » (le rituel en tête, le bilan en dernier)', JSON.stringify({ p: r.premier, d: r.dernier }));
  const attendu = await pg.evaluate(() => [1, 2, 3].map(n => { const x = (dr_heuresDeLaClasse() || []).find(e => +e.n === n); if (!x) return null; const [y, m, d] = x.iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); }));
  E.verif('A30', /lundi 14 septembre/.test(r.fr[0] || '') && attendu.every((a, k) => a && (r.fr[k] || '').includes(a)) && new Set(attendu).size === 3, '161 · chaque heure sa date — celle des heures de la classe que donne l\'EDT (dr_heuresDeLaClasse d\'E2) : ' + attendu.join(', '), r.fr.join(' · '));
  E.verif('A30', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close(); });

await B('A31', 'le réveil n°13 (contrat §12.18) : l\'heure n de l\'atelier est celle de l\'EDT — jouée : sa date ; à venir : sa case ; le choix d\'Entrée surligné, celui du survol ; « Envoyer vers… » : chaque séance ses heures', async () => {
  process.env.MJPC_JOUE = '1'; const hubJ = E.store(); delete process.env.MJPC_JOUE;
  const lire = async pg => { await pg.waitForTimeout(2500); await pg.evaluate(() => dr_tout()); await pg.waitForTimeout(300); return pg.evaluate(() => ({ lancer: ((document.querySelector('[data-lancer="1"]') || {}).textContent || '').trim(), num: (document.getElementById('numero') || {}).textContent || '', fr: Array.from(document.querySelectorAll('#volet .fr span:first-child')).map(x => x.textContent).filter(x => /^H\d/.test(x)) })); };
  const o = await E.ouvrir(b, { w: 1366, h: 768, hub: hubJ }); const pg = o.pg; await sansVoile(pg); const r = await lire(pg);
  E.verif('A31', /heure 2\/3/.test(r.lancer) && /lundi 7 septembre · jouée/.test(r.fr[0] || '') && /lundi 14 septembre/.test(r.fr[1] || '') && /mardi 15 septembre/.test(r.fr[2] || '') && /lundi 7 septembre.*jouée/.test(r.num), '172 · lundi 14, 9 h, « ' + r.lancer.slice(0, 60) + ' » : H1 « lundi 7 septembre · jouée », H2 lundi 14 (la case que « Lancer » prend), H3 mardi 15 (sa prochaine case) ; l\'entête de la diapo dit « jouée »', r.fr.join(' · '));
  await o.ctx.close();
  const o2 = await E.ouvrir(b, { w: 1366, h: 768, hub: hubJ, quand: '2026-09-16T10:30:00+02:00' }); const p2 = o2.pg; await sansVoile(p2); const r2 = await lire(p2);
  E.verif('A31', /lundi 7 septembre · jouée/.test(r2.fr[0] || '') && /vendredi 18 septembre/.test(r2.fr[1] || '') && !r2.fr.slice(1).some(x => /mercredi 16/.test(x)), '161 · mercredi 16, aucune case en cours : H1 jouée le lundi 7, H2 à sa prochaine case (vendredi 18) — jamais trois heures datées du même jour', r2.fr.join(' · '));
  // réveil n°16 (181) : l'atelier d'une autre séance (« L'Albatros ») date H1 sur la case que l'EDT et « Lancer » lui donnent — une seule source, dr_heuresDeLaClasse
  await p2.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[1].click()); await p2.waitForTimeout(2500); await p2.evaluate(() => dr_tout()); await p2.waitForTimeout(300);
  const r3 = await p2.evaluate(() => { const src = (dr_heuresDeLaClasse() || []).filter(x => !x.jouee).slice(0, 3).map(x => { const [y, m, d] = x.iso.split('-').map(Number); return { n: x.n, j: new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }; }); const fr = Array.from(document.querySelectorAll('#volet .fr span:first-child')).map(x => x.textContent).filter(x => /^H\d/.test(x)); const lancer = ((document.querySelector('[data-lancer="1"]') || {}).textContent || '').trim(); return { titre: seance().titre || seance().title, src, fr, lancer }; });
  E.verif('A31', r3.src.length && r3.src.every(x => (r3.fr.find(f => f.startsWith('H' + x.n + ' ')) || '').includes(x.j)) && r3.lancer.includes(r3.src[0].j.replace(/^\S+ /, '')), '181 · « ' + (r3.titre || '').slice(0, 40) + ' » : l\'atelier date ses heures sur celles de dr_heuresDeLaClasse (' + r3.src.map(x => 'H' + x.n + ' ' + x.j).join(', ') + ') et « Lancer » vise la même H1', JSON.stringify({ fr: r3.fr, lancer: r3.lancer }));
  E.verif('A31', !o2.errs.length, 'aucune erreur JS', o2.errs.join(' ; ') || undefined); await o2.ctx.close();
  // 164 · le choix d'Entrée surligné : le premier, puis celui du survol
  const o3 = await E.ouvrir(b, { w: 1366, h: 768 }); const p3 = o3.pg; await sansVoile(p3);
  await p3.click('#volet [data-at-di="1"]'); await p3.waitForTimeout(300); const nb0 = await p3.evaluate(() => ecran().blocs.length);
  await p3.click('#at-bloc'); await p3.waitForTimeout(200); const m0 = await p3.evaluate(() => { const x = document.querySelector('.choix-obj .dr-pris'); return x && x.dataset.t; });
  const autre = await p3.evaluate(m0 => { const l = Array.from(document.querySelectorAll('.choix-obj .dr-c:not(.off)')).filter(y => y.dataset.t !== m0 && y.dataset.t !== 'manque'); const x = l.find(y => y.dataset.t === 'consigne') || l[0]; return x && x.dataset.t; }, m0);
  await p3.hover(`.choix-obj .dr-c[data-t="${autre}"]`); await p3.waitForTimeout(150); const m1 = await p3.evaluate(() => { const x = document.querySelector('.choix-obj .dr-pris'); return x && x.dataset.t; });
  await p3.mouse.move(5, 5); await p3.keyboard.press('Enter'); await p3.waitForTimeout(300);
  const ap = await p3.evaluate(n => ({ blocs: ecran().blocs.length - n, form: !!document.querySelector('#obj-form'), titre: ((document.querySelector('.choix-obj h4') || {}).textContent || '').slice(0, 60), dernier: (ecran().blocs[ecran().blocs.length - 1] || {}).t }), nb0);
  E.verif('A31', m0 && m1 === autre && m0 !== m1 && ((ap.blocs === 1 && ap.dernier === autre) || (ap.blocs === 0 && ap.form)), '164 · « + bloc » : le premier choix surligné à l\'ouverture ; le survol de « ' + autre + ' » le surligne ; Entrée prend celui-là, pas le premier', JSON.stringify({ m0, m1, ap }));
  await p3.keyboard.press('Escape'); await p3.mouse.click(5, 400);
  // 173 · « Envoyer vers… » : chaque séance ses heures
  await p3.evaluate(() => envoyerVersSeance(S.di)); await p3.waitForTimeout(200);
  const ev = await p3.evaluate(() => Array.from(document.querySelectorAll('.choix-obj .fe')).map(x => ({ t: (x.querySelector('b') || {}).textContent, h: (x.textContent.match(/(\d+) heures?/) || [])[1], plus: Math.max(0, ...Array.from(x.querySelectorAll('[data-h]')).map(y => +((y.textContent.match(/\+(\d+)$/) || [])[1] || 0))) })));
  E.verif('A31', ev.length && ev.every(x => +x.h >= 1) && ev.some(x => +x.h > 1) && ev.every(x => x.plus < 40), '173 · « Envoyer vers… » : chaque séance son nombre d\'heures (sa frontière par les durées), plus « · 1 heure » partout ni +70 min', JSON.stringify(ev));
  E.verif('A31', !o3.errs.length && !o3.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o3.errs.concat(o3.boites)).join(' ; ') || undefined); await o3.ctx.close(); });

await B('A32', 'E4 (03:30, §12.18) : une heure close dans la page est « jouée » dans l\'atelier dès la clôture, sans recharger', async () => {
  process.env.MJPC_JOUE = '1'; const hubJ = E.store(); delete process.env.MJPC_JOUE;
  const o = await E.ouvrir(b, { w: 1366, h: 768, hub: hubJ }); const pg = o.pg; await sansVoile(pg); await pg.waitForTimeout(1500);
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(1500); const h = await pg.evaluate(() => S.heure);
  await pg.evaluate(() => { S.closes = S.closes || {}; S.closes[S.heure] = Date.now(); S.close = true; });   /* la clôture, telle qu'elle se pose en page */
  await pg.click('#ong-atelier'); await pg.waitForTimeout(600);
  const r = await pg.evaluate(h => { const i = ordreHeure(h).find(k => seance().ecrans[k].role !== 'fin'); S.di = i; dr_tout(); return { fr: Array.from(document.querySelectorAll('#volet .fr span:first-child')).map(x => x.textContent).filter(x => x.startsWith('H' + h + ' ')), num: (document.getElementById('numero') || {}).textContent || '' }; }, h);
  E.verif('A32', h === 2 && /jouée/.test(r.fr[0] || '') && /jouée/.test(r.num), 'l\'heure ' + h + ' close, puis l\'onglet Atelier : « ' + (r.fr[0] || '') + ' » et l\'entête de sa diapo disent « jouée », sans rechargement', JSON.stringify(r).slice(0, 220));
  E.verif('A32', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close(); });

await B('A33', 'l\'import des déroulés (§12.21, dettes 13 · 30 et 13 · 31 ; §12.22) : chaque refus de la pièce, mot pour mot ; Compléter, Remplacer, Jumeau écrivent la trame au modèle du site', async () => {
  const { chapitreTest, MUTATIONS, ACCEPTES } = await import('./import-3e.mjs');
  const st = E.store(); const base = chapitreTest(st); const taxo = st.taxonomie;
  const o = await E.ouvrir(b, { vue: null, hub: st }); const pg = o.pg; await sansVoile(pg);
  const valider = j => pg.evaluate(([j, taxo]) => chValiderChapitre(j, taxo).motifs(), [j, taxo]);
  const cp = () => JSON.parse(JSON.stringify(base));
  const m0 = await valider(cp()); E.verif('A33', m0.length === 0, 'le chapitre de test (tiré du 3e du faux hub, au contrat de la pièce) passe sans un refus', m0.join(' | ') || undefined);
  const mf = await valider(Object.assign(cp(), { chapitre: Object.assign(cp().chapitre, { fil: 'langue' }) })); E.verif('A33', mf.length === 0, 'le chapitre du fil « langue » (« fil »: « langue » à sa racine) passe', mf.join(' | ') || undefined);
  const jb = cp(); [jb.chapitre.seances[0], jb.chapitre.seances[1]].forEach(s => { const bil = s.deroule.ecrans[s.deroule.ecrans.length - 1]; bil.blocs.filter(x => x.t === 'question').forEach((x, n) => { if (n) delete x.reps; else x.reps = []; }); });
  const mb = await valider(jb); E.verif('A33', mb.length === 0 && jb.chapitre.seances[0].deroule.ecrans.slice(-1)[0].role === 'bilan', '§12.23 : la question du bilan sans réponse attendue (« reps » vide ou absent) passe ; ailleurs, le refus reste (contrôle « reps »)', mb.join(' | ') || undefined);
  const m1 = await valider(ACCEPTES(cp())); E.verif('A33', m1.length === 0, 'les dix types passent, chacun à son contrat (texte, vidéo, page, doc compris — l\'import n\'en connaissait que cinq)', m1.join(' | ') || undefined);
  for (const [k, quoi, motif, f] of MUTATIONS) { const j = cp(); f(j); const m = await valider(j);
    E.verif('A33', m.some(x => x.includes(motif)), 'refus « ' + k + ' » — ' + quoi + ' : « … ' + motif + ' »', m.length ? m.slice(0, 2).join(' | ') : 'aucun refus'); }
  // les trois voies écrivent la trame normalisée par le canal de l'injection (le faux hub)
  const j = ACCEPTES(cp()); j.chapitre.fil = 'langue'; const img = j.chapitre.seances[0].deroule.ecrans.find(e => e.blocs.some(x => x.t === 'image')).blocs.find(x => x.t === 'image'); img.devoilerTout = false;
  j.chapitre.seances[1].deroule.ecrans.find(e => e.blocs.some(x => x.t === 'schema')).blocs.find(x => x.t === 'schema').devoilerTout = false;
  const lire = c => pg.evaluate(c => secuLire(c), c);
  const avant = await lire('/site/3e/chapitres/0/seances/0/deroule'); const nAv = avant.ecrans.length, eid0 = avant.ecrans[0].eid || avant.ecrans[0].id;
  const voie = async v => { await pg.evaluate(([j, v]) => { CH.json = j; CH.niveau = '3e'; CH.chapIdx = 0; CH.taxo = null; chInjecterConfirme(v); }, [j, v]); await pg.waitForTimeout(2500); };
  const juger = (d, n, quoi) => { const E0 = (d && d.ecrans) || []; const neufs = E0.slice(E0.length - n); const tous = neufs.flatMap(e => e.blocs);
    const im = tous.find(x => x.t === 'image'), vi = tous.find(x => x.t === 'video'), pa = tous.find(x => x.t === 'page'), fi = tous.find(x => x.t === 'fiche');
    const acts = Array.isArray(d.activites) ? d.activites : []; const eids = new Set(E0.map(e => e.eid));
    E.verif('A33', neufs.length === n && neufs.every(e => e.eid && e.heure >= 1 && (e.role === 'bilan' || (e.actId && Array.isArray(e.remob)))), quoi + ' : ' + n + ' diapos neuves, chacune son eid, son heure, son actId et son remob (le bilan : son rôle)', neufs.length + ' / ' + n);
    E.verif('A33', im && im.ref.startsWith('https://siteflow-io.github.io/mjpc-medias/') && im.devoilerTout === false, quoi + ' : l\'image a son adresse complète au hub (le site la lit telle quelle) et garde devoilerTout', im && (im.ref + ' · ' + im.devoilerTout));
    E.verif('A33', vi && vi.reperes.map(r => r.t).join() === '0,80' && pa && pa.contrat === true && pa.etapes === 4 && (!fi || fi.feuille), quoi + ' : vidéo (repères triés), page (contrat, étapes) et fiche (feuille) gardées', JSON.stringify({ r: vi && vi.reperes, pa, f: fi && fi.feuille }).slice(0, 160));
    const bil = E0[E0.length - 1]; const nt = d.notes && bil && d.notes[bil.eid];
    E.verif('A33', bil && bil.role === 'bilan' && Array.isArray(nt) && nt[0] && nt[0].p === null && /copie de la classe/.test(nt[0].html) && !('notes' in bil), quoi + ' : les notes du bilan rangées en notes présentateur à son eid (deroule.notes, [{p, html}]), pas dans la diapo (§12.24)', JSON.stringify(nt || null).slice(0, 120));
    E.verif('A33', acts.length && acts.every(a => a.num > 0 && a.diapos.length && a.diapos.every(x => eids.has(x))) && d.travail && Object.keys(d.travail).length, quoi + ' : les activités (numéro, diapos par eid) et le travail à faire sont écrits', JSON.stringify(acts.slice(-1)) + ' · ' + JSON.stringify(d.travail)); };
  await voie('completer'); const dC = await lire('/site/3e/chapitres/0/seances/0/deroule'); const nJ = j.chapitre.seances[0].deroule.ecrans.length;
  E.verif('A33', dC && dC.ecrans.length === nAv + nJ && (dC.ecrans[0].eid || dC.ecrans[0].id) === eid0, 'Compléter (séance appariée par son titre) : la trame s\'écrit au hub, à la suite de l\'existante, sans rien écraser', (dC ? dC.ecrans.length : 0) + ' = ' + nAv + ' + ' + nJ);
  juger(dC, nJ, 'Compléter');
  const filC = await lire('/site/3e/chapitres/0/fil'); E.verif('A33', filC === 'langue', 'Compléter : « fil » « langue » écrit à la racine du chapitre (/site/3e/chapitres/0/fil, lu par l\'EDT)', JSON.stringify(filC));
  const dS = await lire('/site/3e/chapitres/0/seances/1/deroule'); const sch = dS && dS.ecrans.flatMap(e => e.blocs).filter(x => x.t === 'schema').pop();
  E.verif('A33', sch && sch.titre && sch.devoilerTout === false, 'Compléter : le schéma garde son titre (« titre ») et « Un à un » (devoilerTout false)', sch && JSON.stringify({ titre: sch.titre, d: sch.devoilerTout }));
  await voie('remplacer'); const dR = await lire('/site/3e/chapitres/0/seances/0/deroule');
  E.verif('A33', dR && dR.ecrans.length === nJ, 'Remplacer : la trame du fichier seule, normalisée', dR && dR.ecrans.length); juger(dR, nJ, 'Remplacer'); const filR = await lire('/site/3e/chapitres/0/fil'); E.verif('A33', filR === 'langue', 'Remplacer : « fil » écrit avec le chapitre', JSON.stringify(filR));
  await voie('jumeau'); const chs = await lire('/site/3e/chapitres'); const jum = (Array.isArray(chs) ? chs : Object.values(chs)).filter(Boolean).find(c => / \(proposition\)$/.test(c.title || '') && c.title !== st.site['3e'].chapitres[0].title);
  const dJ = jum && (Array.isArray(jum.seances) ? jum.seances : Object.values(jum.seances))[0].deroule; juger(dJ || {}, nJ, 'Jumeau'); E.verif('A33', jum && jum.fil === 'langue', 'Jumeau : « fil » écrit avec le chapitre', JSON.stringify(jum && jum.fil));
  const src = fs.readFileSync(path.join(E.RACINE, 'LIVRAISONS/INTEGRATION/index.html'), 'utf8');
  E.verif('A33', !/mjpcPutJson\(FB\b/.test(src) && !/\bFB\+/.test(src), 'plus de `FB` (l\'écriture qui échouait en silence)');
  E.verif('A33', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); await o.ctx.close(); });

await B('A34', 'L187 (E4, cadrage 4 · 6.1) : « À régler » compte et liste toutes les séances du chapitre ; « Ouvrir la diapo » ouvre la bonne séance', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg); await pg.waitForTimeout(800);
  const r0 = await pg.evaluate(() => { const si0 = S.si; const par = dr_seances().map((s, si) => { S.si = si; let n = 0; try { n = (seance().ecrans || []).filter(e => !e.role && !actDe(e)).length; } catch (e) {} S.si = si0; return n; }); dr_tout(); const bt = document.getElementById('at-regler'); return { si0, par, lib: bt ? bt.textContent : '' }; });
  const total = r0.par.reduce((a, b2) => a + b2, 0), autres = total - r0.par[r0.si0];
  const nLib = +((r0.lib.match(/\((\d+)\)/) || [])[1] || -1);
  E.verif('A34', autres > 0 && nLib >= total, 'le bouton « ' + r0.lib + ' » compte le chapitre : au moins les ' + total + ' diapos sans activité des ' + r0.par.length + ' séances (dont ' + autres + ' hors de la séance ouverte)', JSON.stringify(r0.par));
  await pg.click('#at-regler'); await pg.waitForTimeout(500);
  const l = await pg.evaluate(() => { const bs = Array.from(document.querySelectorAll('.choix-obj [data-ouvrir]')); const h = (document.querySelector('.choix-obj h4') || {}).textContent || ''; const b2 = bs.find(x => x.dataset.si && +x.dataset.si !== S.si && x.dataset.k === 'activite'); return { n: bs.length, h, si: b2 ? +b2.dataset.si : null, di: b2 ? +b2.dataset.ouvrir : null, txt: b2 ? b2.closest('.fe').textContent.slice(0, 140) : '' }; });
  E.verif('A34', l.n === nLib && new RegExp('— ' + nLib + ' choses').test(l.h) && l.si != null && /séance « /.test(l.txt), 'la liste a ' + l.n + ' lignes (le même compte que le bouton), dont celles des autres séances, nommées', l.h.slice(0, 80) + ' · ' + l.txt);
  await pg.evaluate(([si, di]) => { const b2 = Array.from(document.querySelectorAll('.choix-obj [data-ouvrir]')).find(x => +x.dataset.si === si && +x.dataset.ouvrir === di); b2.click(); }, [l.si, l.di]); await pg.waitForTimeout(1500);
  const r1 = await pg.evaluate(() => ({ si: S.si, di: S.di, snum: ATVUES.snum, cle: dr_cleSeance(S.si), declare: !!S.declareOuverte, act: (seance().ecrans[S.di] || {}).act }));
  E.verif('A34', r1.si === l.si && r1.di === l.di && String(r1.snum) === String(r1.cle) && r1.declare, '« Ouvrir la diapo » d\'une autre séance : le déroulé passe à la séance ' + l.si + ' (la colonne la suit), à sa diapo ' + (l.di + 1) + ', la carte « Ce que la diapo déclare » ouverte', JSON.stringify(r1));
  E.verif('A34', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });

await B('A35', '§12.25 (§12.22, ma part) : le réglage porté par dr_derouleDe, l\'eid de la réactivation construite, la lecture par le titre tombée, le réglage dans l\'entête de l\'Atelier', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg); await pg.waitForTimeout(800);
  // (6) la lecture par le titre tombe : « Où en sommes-nous ? » sans rôle n'est plus mis en tête de son heure
  const r6 = await pg.evaluate(() => { const E0 = seance().ecrans; const h = 2; const o0 = ordreHeure(h); const i = o0[3]; E0[i].act = 'Où en sommes-nous ?'; delete E0[i].role; dr_tout(); return { i, h, tete: ordreHeure(h)[0], avant: o0[0], rang: ordreHeure(h).indexOf(i), role: E0[i].role || null }; });   /* une diapo du milieu de l'heure 2, retitrée « Où en sommes-nous ? » sans rôle */
  E.verif('A35', r6.i != null && r6.rang === 3 && r6.tete === r6.avant && !r6.role, '(6) « Où en sommes-nous ? » sans rôle (diapo ' + (r6.i + 1) + ', heure ' + r6.h + ') n\'est plus pris pour la réactivation : il garde sa place (4ᵉ de son heure), il ne remonte plus en tête (seul role « reactivation » compte)', JSON.stringify(r6));
  // (3) l'eid de la construite
  const r3 = await pg.evaluate(() => ({ a: typeof dr_eidReactivation === 'function' ? dr_eidReactivation(2, '1') : null, b: typeof dr_poserEidReactivation === 'function' ? dr_poserEidReactivation({ role: 'reactivation', heure: 3 }, null, '0').eid : null, c: typeof dr_poserEidReactivation === 'function' ? dr_poserEidReactivation({ act: 'x', heure: 3 }, null, '0').eid || null : 'absent' }));
  E.verif('A35', r3.a === 'react-h2-s1' && r3.b === 'react-h3-s0' && r3.c === null, '(3) l\'eid stable de la réactivation : react-h<n>-s<clé> (rien posé sur une diapo qui n\'est pas une réactivation)', JSON.stringify(r3));
  // (5) le réglage : porté par dr_derouleDe, il survit à une sauvegarde de la trame
  const r5 = await pg.evaluate(() => { const k = dr_cleSeance(S.si); dr_seance(k).deroule.reactivation = 'non'; return { k, de: dr_derouleDe(k).reactivation }; });
  await pg.evaluate(() => { seance().ecrans[1].act += ' (retouche)'; dr_sauveMaintenant(); }); await pg.waitForTimeout(1500);
  const hub5 = await pg.evaluate(k => secuLire('/site/3e/chapitres/0/seances/' + k + '/deroule').then(d => ({ r: d && d.reactivation, act: d && d.ecrans && d.ecrans[1] && d.ecrans[1].act })), r5.k);
  E.verif('A35', r5.de === 'non' && hub5.r === 'non' && /retouche/.test(hub5.act || ''), '(5) B/deroule/reactivation porté par dr_derouleDe, et toujours au hub après une sauvegarde de la trame', JSON.stringify({ de: r5.de, hub: hub5 }));
  // (5) l'entête de l'Atelier : le réglage par les deux fonctions d'E2 (des doublures si E2 n'a pas encore poussé)
  const r5b = await pg.evaluate(() => { const vraies = typeof dr_reglageReactivationLu === 'function'; if (!vraies) { window.dr_reglageReactivationLu = sk => (dr_seance(sk).deroule || {}).reactivation; window.dr_reglageReactivation = (sk, v) => { dr_seance(sk).deroule.reactivation = v; }; } delete dr_seance(dr_cleSeance(S.si)).deroule.reactivation; const v = document.getElementById('volet'); if (v) v.dataset.atelier = ''; dr_tout(); const x = document.querySelector('#volet [data-dr-react]'); return { vraies, t: x ? x.textContent : null }; });
  await pg.click('#volet [data-dr-react]').catch(() => {}); await pg.waitForTimeout(300);
  const r5c = await pg.evaluate(() => { const x = document.querySelector('#volet [data-dr-react]'); return { t: x ? x.textContent : null, v: dr_reglageReactivationLu(dr_cleSeance(S.si)) }; });
  E.verif('A35', /réactivation : oui \(par défaut\)/.test(r5b.t || '') && /réactivation : non/.test(r5c.t || '') && r5c.v === 'non', '(5) l\'entête de l\'Atelier dit le réglage (« oui (par défaut) »), un clic le pose à « non » par la fonction d\'E2' + (r5b.vraies ? '' : ' (doublures : E2 n\'a pas encore poussé ses deux fonctions)'), JSON.stringify({ avant: r5b.t, apres: r5c }));
  // (13 · 34) l'écran construit : le titre d'un bloc `texte` paraît avec sa première ligne dévoilée (classe `pas` avant) ; une diapo ordinaire garde son titre dès le début (p8-4)
  const r34 = await pg.evaluate(() => { const E0 = seance().ecrans; const blocs = () => [{ t: 'texte', txt: 'La dernière fois', el: ['Activité 1 — a', 'Activité 2 — b'] }, { t: 'texte', txt: 'Le travail', el: ['Apprendre la leçon'] }];
    const iC = E0.push({ act: 'Où en sommes-nous ?', role: 'reactivation', heure: 2, dur: 3, construite: { depuis: 'x', t: 1 }, blocs: blocs() }) - 1; const iO = E0.push({ act: 'Ordinaire', heure: 2, blocs: blocs() }) - 1;
    const rend = (di, nDev, pilote) => { const d = document.createElement('div'); d.className = 'mur ' + (pilote ? 'pilote' : 'tableau'); (document.getElementById('dr-zone') || document.body).appendChild(d); /* sous #dr-zone : tout dr.css y est (§12.2) */ rendre(d, { si: S.si, di, nDev, lum: [], ecr: [], taille: 1, page: 0, reps: {}, tailles: {}, textes: {}, fsBloc: {}, pilote, sansPages: true }); const t = Array.from(d.querySelectorAll('.cons')).map(x => (x.querySelector('.txt') || {}).textContent + (x.classList.contains('pas') ? '[pas]' : '')); const vis = Array.from(d.querySelectorAll('.cons')).map(x => getComputedStyle(x).display !== 'none' && +getComputedStyle(x).opacity); d.remove(); return { t, vis }; };
    const out = { c0: rend(iC, 0, false), c1: rend(iC, 1, false), c3: rend(iC, 3, false), p0: rend(iC, 0, true), o0: rend(iO, 0, false), nEl: elements(E0[iC]).length }; E0.splice(iO, 1); E0.splice(iC, 1); return out; });
  E.verif('A35', r34.c0.t.join('|') === 'La dernière fois[pas]|Le travail[pas]' && r34.c0.vis.every(v => v === false) && r34.c1.t.join('|') === 'La dernière fois|Le travail[pas]' && r34.c3.t.join('|') === 'La dernière fois|Le travail' && r34.c3.vis.every(v => v === 1), '(13 · 34) l\'écran construit, vue tableau : les deux titres cachés avant tout dévoilement ; « La dernière fois » paraît avec sa 1ʳᵉ ligne, « Le travail » reste caché jusqu\'à la sienne ; tout visible à la fin', JSON.stringify({ c0: r34.c0, c1: r34.c1, c3: r34.c3 }));
  E.verif('A35', r34.p0.t.join('|') === 'La dernière fois[pas]|Le travail[pas]' && r34.p0.vis.every(v => v === 0.45) && r34.nEl === 3, '(13 · 34) le pilote voit les titres à venir atténués (comme la question), et le compte des éléments ne change pas (3 lignes, les titres n\'en sont pas)', JSON.stringify({ p0: r34.p0, nEl: r34.nEl }));
  E.verif('A35', r34.o0.t.join('|') === 'La dernière fois|Le travail' && r34.o0.vis.every(v => v === 1), '(13 · 34) une diapo ordinaire (non construite) garde ses titres de bloc dès le premier instant (p8-4 inchangé)', JSON.stringify(r34.o0));
  E.verif('A35', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });

await B('A36', '§12.26, ma part : le geste d\'écriture du pilote sur la réactivation construite AVANT le lancement (changer, ajouter, enlever une ligne → ses blocs) ; l\'Atelier ne la montre ni ne l\'écrit jamais', async () => {
  const o = await E.ouvrir(b, { w: 1366, h: 768, vue: 'pilotage' }); const pg = o.pg; await sansVoile(pg); await pg.waitForTimeout(800);
  /* l'écran construit, tel qu'E2 le met dans la copie (en mémoire : seance().ecrans) et le montre dans le pilote sans lancer ; ici avant l'heure 1 */
  const r0 = await pg.evaluate(() => { const E0 = seance().ecrans; const e = { act: 'Où en sommes-nous ?', role: 'reactivation', heure: 1, dur: 3, eid: 'react-h1-s0', construite: { depuis: 'x', t: 1 }, blocs: [{ t: 'texte', txt: 'La dernière fois', el: ['Activité 1 — a', 'Activité 2 — b'] }, { t: 'texte', txt: 'Le travail', el: ['Apprendre la leçon'] }] }; E0.splice(0, 0, e); dr_preparer(E0); S.di = 0; S.page = null; dr_tout(); return { lancee: !!S.lancee, atelier: !!S.atelier, regime: dr_ctx().regime }; }); await pg.waitForTimeout(600);
  const arme = () => pg.evaluate(() => { const x = Array.from(document.querySelectorAll('#mur [data-p][contenteditable]')); return { n: x.length, ps: x.map(z => z.dataset.p).join(' '), titre: x[0] ? x[0].title.slice(0, 60) : null, role: (ecran() || {}).role || null }; });
  const a1 = await arme();
  E.verif('A36', !r0.lancee && !r0.atelier && a1.role === 'reactivation' && a1.n === 5 && a1.ps === '0.t 0.0 0.1 1.t 1.0' && /ta version reste dans la copie/.test(a1.titre || ''), 'avant le lancement, la diapo construite s\'écrit : ses deux titres et ses trois lignes sont éditables, l\'infobulle du pilote dit où va la frappe', JSON.stringify({ r0, a1 }));
  /* changer une ligne : la frappe va dans le bloc lui-même */
  await pg.evaluate(() => { const z = document.querySelector('#mur [data-p="0.1"]'); z.focus(); z.textContent = 'Activité 2 — b (revue avec eux)'; z.dispatchEvent(new Event('input', { bubbles: true })); });
  await pg.waitForTimeout(200); const c1 = await pg.evaluate(() => ({ el: Array.from(ecran().blocs[0].el), copie: Object.keys(S.copie || {}).length, J: J.filter(x => x.type === 'copie-classe').length }));
  E.verif('A36', c1.el[1] === 'Activité 2 — b (revue avec eux)' && c1.copie === 0 && c1.J === 0, 'changer une ligne : le bloc de l\'écran la porte (pas de surcouche S.copie, rien au journal d\'une heure qui n\'est pas lancée)', JSON.stringify(c1));
  /* ajouter une ligne : Entrée ; enlever : Échap sur la ligne vide */
  await pg.focus('#mur [data-p="1.0"]'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(500); const c2 = await pg.evaluate(() => ({ el: Array.from(ecran().blocs[1].el), focus: (document.activeElement.dataset || {}).p || null }));
  await pg.keyboard.type('Relire la fiche'); await pg.waitForTimeout(300); const c3 = await pg.evaluate(() => Array.from(ecran().blocs[1].el));
  await pg.keyboard.press('Enter'); await pg.waitForTimeout(400); await pg.keyboard.press('Escape'); await pg.waitForTimeout(400); const c4 = await pg.evaluate(() => ({ el: Array.from(ecran().blocs[1].el), focus: (document.activeElement.dataset || {}).p || null }));
  E.verif('A36', c2.el.length === 2 && c2.focus === '1.1' && c3.join('|') === 'Apprendre la leçon|Relire la fiche' && c4.el.join('|') === 'Apprendre la leçon|Relire la fiche' && c4.focus === '1.1', 'Entrée ajoute une ligne au bloc (le curseur y va), la frappe l\'écrit ; Entrée puis Échap sur la ligne vide la retire', JSON.stringify({ c2, c3, c4 }));
  await pg.keyboard.down('Alt'); await pg.keyboard.press('ArrowUp'); await pg.keyboard.up('Alt'); await pg.waitForTimeout(300); const c5 = await pg.evaluate(() => ecran().blocs.map(b => b.txt).join('|'));
  E.verif('A36', c5 === 'La dernière fois|Le travail', 'Alt+↑ ne déplace pas les blocs (les lignes seulement, rien d\'autre)', c5);
  /* pas armé ailleurs avant le lancement, ni sur une réactivation déjà jouée */
  const n1 = await pg.evaluate(() => { S.di = 1; S.page = null; dr_tout(); return (ecran() || {}).role || 'aucun'; }); await pg.waitForTimeout(500); const a2 = await arme();
  const n2 = await pg.evaluate(() => { S.lancee = true; S.close = true; S.heure = 1; S.di = 0; S.page = null; dr_tout(); return p8ReactAvantLancement(); }); await pg.waitForTimeout(500); const a3 = await arme();
  const n3 = await pg.evaluate(() => { ecran().heure = 2; const r = p8ReactAvantLancement(); S.lancee = false; S.close = false; ecran().heure = 1; dr_tout(); return r; });
  E.verif('A36', n1 === 'aucun' && a2.n === 0 && n2 === false && a3.n === 0 && n3 === true, 'avant le lancement, une diapo ordinaire ne s\'écrit pas ; l\'heure 1 close, la réactivation jouée (heure 1) ne s\'écrit plus, celle de l\'heure 2 à venir s\'écrit', JSON.stringify({ n1, a2: a2.n, n2, a3: a3.n, n3 }));
  /* (2) jamais dans le déroulé de l'Atelier : dr_derouleDe ne l'écrit pas, la trame lue au hub la perd, le versement la saute */
  const d = await pg.evaluate(() => { const k = dr_cleSeance(S.si); const o = dr_derouleDe(k); const E1 = [{ act: 'x', role: 'reactivation', heure: 1, blocs: [] }, { act: 'y', heure: 1, blocs: [] }]; dr_normaliserTrame(E1, '0');
    const e = seance().ecrans[0]; S.heure = 1; S.copie = { 1: {} }; S.copie[1][e.eid] = {}; S.copie[1][e.eid][e.blocs[0].bid] = { t: 'changé en classe' }; const diff = p8DiffCopie(1, e).length; const dif = p8CopieDiffere(); const liste = p8ListeVersement(); const verse = p8Verser(1, e.eid); S.copie = {};
    return { enMemoire: seance().ecrans.some(x => x.role === 'reactivation'), ecrits: o.ecrans.filter(x => x.role === 'reactivation').length, nEcrits: o.ecrans.length, nMem: seance().ecrans.filter(x => !(x.dr_pose && !(x.blocs || []).length)).length, lue: E1.map(x => x.role || x.act).join(','), diff, dif, liste: /aucune/.test(liste), verse }; });
  E.verif('A36', d.enMemoire && d.ecrits === 0 && d.nEcrits === d.nMem - 1 && d.lue === 'y,fin' && d.diff === 1 && d.dif === false && d.liste && d.verse === 0, 'dr_derouleDe n\'écrit pas la réactivation (en mémoire : oui, au PUT : non) ; une trame du hub qui en porte une la perd à la lecture (dr_normaliserTrame) ; « verser dans la trame » la saute même retouchée en classe', JSON.stringify(d));
  /* les deux crochets d'E2 (retour 30) : sa condition d'aperçu arme le geste, sa dr_reactModifiee reçoit la frappe — doublures ici, retirées après */
  const e2 = await pg.evaluate(() => { const had = { a: typeof dr_reactAvantLancement, m: typeof dr_reactModifiee }; let n = 0; const A0 = window.dr_reactAvantLancement, M0 = window.dr_reactModifiee; /* les vraies fonctions d'E2 (poussée 36) : espionnées, pas remplacées — DR_CL.reactVue posé comme son aperçu le pose ; des doublures seulement si elles manquent */ if (had.a === 'function') { DR_CL.reactVue = { eid: ecran().eid, h: 1 }; } else window.dr_reactAvantLancement = () => true; if (had.m === 'function') window.dr_reactModifiee = function () { n++; return M0.apply(this, arguments); }; else window.dr_reactModifiee = () => { n++; }; S.lancee = true; S.close = true; S.heure = 1; S.di = 0; const arme = p8ReactAvantLancement(); /* l'état relu de l'heure 1 close + l'aperçu d'E2 : armé (sans sa fonction, l'heure de l'écran tranche — n2/n3 ci-dessus) */ S.lancee = false; S.close = false; const z = document.querySelector('#mur [data-p="0.0"]'); let ok = false; if (z) { z.textContent = 'Activité 1 — a (frappe)'; ecrireDansDiapo(z); ok = ecran().blocs[0].el[0] === 'Activité 1 — a (frappe)'; } if (had.a !== 'function') delete window.dr_reactAvantLancement; else DR_CL.reactVue = null; if (had.m !== 'function') delete window.dr_reactModifiee; else window.dr_reactModifiee = M0; return { had, arme, ok, n }; });
  E.verif('A36', e2.arme === true && e2.ok && e2.n === 1, 'les crochets d\'E2 : dr_reactAvantLancement() vrai (son aperçu, DR_CL.reactVue) arme le geste même sur l\'état relu (S.lancee, S.close), et la frappe passe par dr_reactModifiee' + (e2.had.m === 'function' ? ' (les vraies fonctions d\'E2, poussée 36)' : ' (doublures : E2 n\'a pas encore poussé)'), JSON.stringify(e2));
  const hub = await pg.evaluate(() => (window.__ECR || []).filter(x => /\/deroule$/.test(x.c || x.chemin || '') && JSON.stringify(x).includes('reactivation')).length);
  E.verif('A36', hub === 0, 'rien au hub : aucun B/deroule portant « reactivation »', String(hub));
  E.verif('A36', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });

await b.close();
const { nb, ko } = E.bilan(); dire(''); dire(nb + ' vérifications, ' + ko + ' échec(s) · ' + Math.round((Date.now() - t0) / 1000) + ' s');
if (SORTIE) fs.writeFileSync(SORTIE, E.R.join('\n') + '\n');
process.exit(ko ? 1 : 0);
