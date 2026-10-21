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
  E.verif('A3', d.at && d.vig === 19, 'Atelier ouvert sur la séance 0 : 19 lignes au volet (18 diapos de la trame + la fin d\'heure, audit F7)', d.vig);
  E.verif('A3', /Analyse d'images : la routine/.test(d.titre) && d.lignes.length === 6 && /^Étape 1 : J'observe/.test(d.lignes[0]) && /^Étape 6 :/.test(d.lignes[5]), 'la diapo 1 « Analyse d\'images : la routine » au mur, ses six étapes', d.lignes.length + ' lignes');
  E.verif('A3', d.ecr.length === 0, 'K15 : aucune écriture sous /site/…/chapitres tant que rien n\'est modifié', d.ecr.join(' '));
  const cl = await pg.evaluate(() => ({ nom: dr_classe().nom, n: ELEVES.length, ini: Object.keys(INI).length, h: document.getElementById('hclasse').textContent }));
  E.verif('A3', cl.nom === '3E Charles de Gaulle' && cl.n === 29 && cl.ini === 29 && cl.h === '3E Charles de Gaulle', 'la classe réelle (classesData) : 29 élèves, leurs initiales, le nom dans l\'entête', JSON.stringify(cl));
  const itf = await pg.evaluate(() => ({ ctx: dr_ctx(), chap: !!dr_chapitre() && dr_chapitreTitre(), sce: !!dr_seance('0'), trame: dr_trame().length, B: dr_cheminB(), C: dr_cheminC(), H: dr_cheminH(), taxo: dr_taxo().length, notes: typeof dr_notes(), dr: Object.keys(window.dr).join(','), lu: (() => { const b2 = dr_trame()[0].blocs[0]; return [b2.bid === b2.id, b2.el.length, b2.txt.slice(0, 20), Object.keys(JSON.parse(JSON.stringify(b2))).sort().join(',')]; })() }));
  E.verif('A3', itf.ctx.level === '3e' && itf.ctx.snum === '0' && itf.ctx.regime === 'prep' && itf.chap && itf.sce && itf.trame === 19, 'dr_ctx / dr_chapitre / dr_seance / dr_trame', JSON.stringify(itf.ctx).slice(0, 120));
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
  E.verif('A6', e0.lg === '0px' && e0.lignes === 19, 'la colonne gauche de la maquette n\'a plus de largeur (la diapo y gagne), 19 lignes au volet', e0.lg + ' · mur ' + e0.mur + ' px');
  await pg.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[1].click()); await pg.waitForTimeout(1200); await sansVoile(pg);
  const e1 = await etat();
  E.verif('A6', e1.snum === '1' && e1.si === 1 && e1.seance === '1' && e1.ouvertes === 1 && e1.lignes === 18, 'déplier la séance 1 : elle devient celle du déroulé (ATVUES.snum, S.si), son volet (17 + la fin d\'heure), la séance 0 se replie', JSON.stringify(e1));
  await pg.click('.at-onglet[data-vue="structure"]'); await pg.waitForTimeout(1200); await sansVoile(pg);
  E.verif('A6', await pg.evaluate(() => document.getElementById('volet').parentNode.classList.contains('corps')), 'en Structure : le volet est rentré dans la zone du déroulé (garée)');
  await pg.click('#ong-pilotage'); await pg.waitForTimeout(1200); await sansVoile(pg); const e2 = await etat();
  E.verif('A6', e2.hote === 'at-som-volet' && e2.seance === '1' && e2.lignes === 18, 'retour au Pilotage : le volet revient sous la séance 1', JSON.stringify(e2));
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
  const e0 = await eids(); await pg.click('#volet [data-at-di="0"]'); await pg.waitForTimeout(200); await pg.mouse.click(5, 5);
  await pg.keyboard.press('Control+d'); await pg.waitForTimeout(400); const e1 = await eids();
  E.verif('A10', (await n()) === 20 && e1.length === e0.length + 1 && e1[1] !== e0[0] && new Set(e1).size === e1.length, 'Ctrl+D : la diapo dupliquée suit, avec une identité neuve', (await n()) + ' lignes');
  await pg.keyboard.press('Control+Enter'); await pg.waitForTimeout(400); E.verif('A10', (await n()) === 21, 'Ctrl+Entrée : une diapo insérée après', (await n()) + ' lignes');
  const avant = await pg.evaluate(() => S.di); await pg.keyboard.press('Alt+ArrowDown'); await pg.waitForTimeout(400); const apres = await pg.evaluate(() => S.di);
  E.verif('A10', apres === avant + 1, 'Alt+↓ : la diapo descend d\'un cran, elle reste la courante', avant + ' → ' + apres);
  await pg.keyboard.press('Delete'); await pg.waitForTimeout(300); const mod = await pg.$('#at-modale .at-btn-prim'); if (mod) await mod.click(); await pg.waitForTimeout(400); E.verif('A10', !!mod && (await n()) === 20, 'Suppr : la modale du site demande, « Supprimer la diapo » : la diapo courante supprimée', (await n()) + ' lignes');
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
  const r = await p2.evaluate(id => ({ la: dr_trame().some(e => e.eid === id), n: document.querySelectorAll('#volet [data-at-di]').length }), eidEnvoye);
  E.verif('A10', r.la && r.n === 19, 'rechargé : la diapo envoyée est dans la séance 2 (18 diapos + la fin d\'heure)', JSON.stringify(r)); await o2.ctx.close(); });

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
  await pg.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[2].click()); await pg.waitForTimeout(1200); await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800);
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
      const t13 = await pg.evaluate(() => { const E = dr_trame(); const der = E.map((e, i) => ({ e, i })).filter(o => o.e.heure === 1 && !o.e.role).pop(); S.di = der.i; dr_tout(); const ouv = document.querySelector('#droite-atelier [data-declare="ouvrir"]'); if (ouv) ouv.click(); const offre = !!document.querySelector('#droite-atelier [data-heure="2"]'); passerEnHeure(2); const T = dr_trame(); return { offre, h2: T.filter(e => e.heure === 2 && !e.role).length, fin2: T.some(e => e.heure === 2 && e.role === 'fin') }; });
      E.verif('A22', t13.offre && t13.h2 === 1 && t13.fin2, '13 : sur la dernière diapo de la dernière heure, « modifier » offre « → H2 » ; la diapo passe en H2, qui reçoit sa fin d\'heure', JSON.stringify(t13));
      // 15 · une frappe juste avant de quitter part quand même
      await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('ultime'); const n0 = await pg.evaluate(() => window.__CORPS.length); await pg.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }); const n1 = await pg.evaluate(() => ({ n: window.__CORPS.length, ok: JSON.stringify(window.__CORPS[window.__CORPS.length - 1] || {}).includes('ultime') }));
      E.verif('A22', n1.n > n0 && n1.ok, '15 : la page se cache moins de 900 ms après la frappe — l\'enregistrement en attente part tout de suite', JSON.stringify(n1));
      // 3 · la note de la fin d'heure survit au déplacement de la première diapo
      const hub = await pg.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true }); const T = dr_trame(); const fin = T.find(e => e.role === 'fin'); return { fin: fin.eid }; });
      E.verif('A22', /^fin-h1-s0$/.test(hub.fin), '3 : la fin d\'heure a une identité stable (l\'heure et la clé de la séance), plus celle de la première diapo', hub.fin);
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
  await pg.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[2].click()); await pg.waitForTimeout(1000);
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800);
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
  E.verif('A25', p2.n === p1.n + 1 && p2.d.m === 'revenir' && p2.d.note === 'bien vu', 'F2, la note d\'abord, puis 3, Entrée : « on y reviendra avec lui » avec la note « bien vu »', JSON.stringify(p2));
  // mode test du site : la pastille dans l'entête, jamais « Enregistré à … »
  await pg.evaluate(() => { M8_TEST = true; }); await pg.waitForTimeout(1700); await pg.click('#bdev').catch(() => {}); await pg.waitForTimeout(1200);
  const mt = await pg.evaluate(() => { const t = document.getElementById('dr-enr'); const r = t.getBoundingClientRect(); return { txt: t.textContent, cl: t.classList.contains('dr-test'), vu: r.width > 0 && r.right <= innerWidth }; }); await pg.evaluate(() => { M8_TEST = false; }); await pg.waitForTimeout(1700);
  const mt2 = await pg.evaluate(() => document.getElementById('dr-enr').textContent);
  E.verif('A25', /^mode test/.test(mt.txt) && mt.cl && mt.vu && !/mode test/.test(mt2), 'mode test du site : « mode test — rien n\'est enregistré » en pastille dans l\'entête (jamais « Enregistré à … ») ; elle part avec le mode test', JSON.stringify({ mt, mt2 }));
  E.verif('A25', !o.errs.length && !o.boites.length, 'aucune erreur JS, aucune boîte du navigateur', (o.errs.concat(o.boites)).join(' ; ') || undefined); await o.ctx.close(); });

await b.close();
const { nb, ko } = E.bilan(); dire(''); dire(nb + ' vérifications, ' + ko + ' échec(s) · ' + Math.round((Date.now() - t0) / 1000) + ' s');
if (SORTIE) fs.writeFileSync(SORTIE, E.R.join('\n') + '\n');
process.exit(ko ? 1 : 0);
