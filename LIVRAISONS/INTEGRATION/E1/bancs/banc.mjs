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
const B = async (k, titre, f) => { dire(''); dire(k + ' — ' + titre); try { await f(); } catch (e) { E.verif(k, false, 'le banc n\'a pas pu aller au bout', String(e.message).split('\n')[0]); } };

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

await b.close();
const { nb, ko } = E.bilan(); dire(''); dire(nb + ' vérifications, ' + ko + ' échec(s) · ' + Math.round((Date.now() - t0) / 1000) + ' s');
if (SORTIE) fs.writeFileSync(SORTIE, E.R.join('\n') + '\n');
process.exit(ko ? 1 : 0);
