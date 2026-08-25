/* BANC PHASE 0 — LOT D
   Deux pages (pilote + ?vue=tableau), faux hub en mémoire, parcours par clics réels.
   But : REPRODUIRE le décalage décrit par le professeur, chiffres à l'appui,
   AVANT toute ligne de correctif. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre, etatDeroule, toileTableau } from './gestes.mjs';
import { lire } from './hub-faux.mjs';
import fs from 'fs';

const FICHIER = process.argv[2] || '/home/claude/mjpc/prod-index.html';
const PORT    = +(process.argv[3] || 8821);
const SORTIE  = process.argv[4] || 'phase0';

const s = await nouvelleScene(FICHIER, PORT, '/home/claude/mjpc/hub');
const journal = [];
const dire = (...a) => { const t = a.join(' '); journal.push(t); console.log(t); };

/* ── LE PILOTE ─────────────────────────────────────────────────────────── */
const pilote = await s.page('', 'pilote', {width:1440, height:900});
await attendre(1400);
await amorcer(pilote);

dire('— chaîne de clics du professeur —');
dire('  Panneau prof   :', await cliquerSel(pilote, '#tprof-btn', 900));
dire('  Atelier        :', await cliquerTexte(pilote, 'button.tprof-section-btn', 'Atelier', 2200));
dire('  Mes chapitres  :', await cliquerTexte(pilote, 'button.at-onglet', 'Mes chapitres', 1300));
dire('  Modifier       :', await cliquerTexte(pilote, 'button', 'Modifier', 2200));
dire('  Déroulé        :', await cliquerTexte(pilote, 'button.at-onglet', 'Déroulé', 2500));

const avantLancement = await pilote.evaluate(()=>({
  classes: [].slice.call(document.querySelectorAll('#at-dr-classe option')).map(o=>o.value),
  choisie: (document.getElementById('at-dr-classe')||{}).value,
  regime: (typeof AT_DR_REGIME!=='undefined'?AT_DR_REGIME:'?')
}));
dire('  classes offertes :', JSON.stringify(avantLancement.classes), '· régime', avantLancement.regime);

dire('  Lancer la séance:', await cliquerTexte(pilote, 'button', 'Lancer la séance', 3000));
await attendre(1500);

const coursActif = lire(s.hub.store, 'site/cours_actif');
dire('  cours_actif au hub :', JSON.stringify(coursActif));

/* ── LE TABLEAU DISTANT ────────────────────────────────────────────────── */
const tableau = await s.page('?vue=tableau', 'tableau', {width:1360, height:768});
await attendre(3500);
dire('— la vue tableau distante est montée —');

/* la trame que la vue a LUE au hub porte-t-elle des identités ? */
const trameHub = lire(s.hub.store,
  'site/3e/chapitres/0/seances/0/deroule_joue/'+(coursActif&&coursActif.classeSlug)+'/ecrans');
const eidsHub = Array.isArray(trameHub) ? trameHub.map(e=>e&&e.eid?e.eid:'AUCUN') : 'trame absente';
dire('  eid dans la copie jouée au hub :', JSON.stringify(eidsHub).slice(0,200));

/* ── ZOOM AU CRAN MAXIMAL : l'écran 1 doit se scinder ──────────────────── */
dire('— zoom au cran maximal sur le pilote (PT = 24·32·38·44·52) —');
const avantZoom = await etatDeroule(pilote);
dire('  avant zoom : ', avantZoom.nbEcrans, 'écrans · i='+avantZoom.i, '·', avantZoom.act);

await pilote.evaluate(()=>{
  const W = document.getElementById('at-dr-iframe').contentWindow;
  const rz = W.document.getElementById('rz');
  rz.value = '4';                                  /* cran 5 : 52 pt */
  rz.dispatchEvent(new W.Event('input', {bubbles:true}));
});
await attendre(2500);
const apresZoom = await etatDeroule(pilote);
dire('  après zoom  : ', apresZoom.nbEcrans, 'écrans · i='+apresZoom.i,
     '· suite='+apresZoom.suite, '· grp='+apresZoom.grp, '·', apresZoom.act);
dire('  identités du pilote :', JSON.stringify(apresZoom.eids).slice(0,220));

await attendre(2000);   /* deux cycles de poll de la vue */

/* ── AVANCE FIL PAR FIL, RELEVÉ À CHAQUE PAS ───────────────────────────── */
const pas = [];
const releve = async (nom) => {
  await attendre(2200);                            /* > 2 cycles de poll 900 ms */
  const P = await etatDeroule(pilote);
  const T = await etatDeroule(tableau);
  const V = await toileTableau(tableau);
  const scene = lire(s.hub.store,
    'site/3e/chapitres/0/seances/0/deroule_joue/'+(coursActif&&coursActif.classeSlug)+'/scene');
  const l = {
    pas: nom,
    pilote: {i:P.i, act:P.act, suite:P.suite, rev:P.rev, vues:P.vues},
    scene: scene ? {ecran:scene.ecran, eid:scene.eid, morceau:scene.morceau, rev:scene.rev} : null,
    tableau: {i:T.i, act:T.act, rev:T.rev, nbEcrans:T.nbEcrans},
    projete: {act:V.act, signes:V.signes},
    accord: (P.act === T.act)
  };
  pas.push(l);
  dire('  ['+nom+'] pilote i='+P.i+' «'+P.act+'» suite='+P.suite+' rev='+P.rev
       + ' | scène eid='+(l.scene?l.scene.eid:'—')+' ecran='+(l.scene?l.scene.ecran:'—')
       + ' | tableau i='+T.i+' «'+T.act+'»'
       + ' | projeté '+V.signes+' signes'
       + (l.accord ? '   ✔ MÊME ÉCRAN' : '   ✖ DÉCALAGE'));
  return l;
};

dire('— avance fil par fil —');
await releve('état initial');

const devoiler = async () => pilote.evaluate(()=>{
  document.getElementById('at-dr-iframe').contentWindow.devoile();
});
for(let k=1; k<=10; k++){
  await devoiler();
  const l = await releve('dévoilement '+k);
  if(l.pilote.suite && k>=1){ /* on est entré dans le fils : on continue un peu puis on sort */ }
}
/* les identités que la vue distante s'est fabriquées, à comparer à celles du pilote */
const eidsVue = await tableau.evaluate(()=>{
  const W = document.getElementById('at-dr-iframe').contentWindow;
  return (W.ECRANS||[]).map(x => x.suite ? ('suite'+x.suite) : (x.eid||'AUCUN'));
});
dire('  identités fabriquées par la VUE :', JSON.stringify(eidsVue).slice(0,220));
const eidsPil = (await etatDeroule(pilote)).eids;
const communes = eidsVue.filter(e => eidsPil.indexOf(e) >= 0 && e !== 'AUCUN' && !/^suite/.test(e)).length;
dire('  identités COMMUNES pilote/vue :', communes, 'sur', eidsVue.length);

/* ── CAPTURES CÔTE À CÔTE ──────────────────────────────────────────────── */
await pilote.screenshot({path:SORTIE+'-pilote.png', fullPage:false});
await tableau.screenshot({path:SORTIE+'-tableau.png', fullPage:false});

/* ── COMPTES ───────────────────────────────────────────────────────────── */
const decalages = pas.filter(l=>!l.accord).length;
dire('');
dire('═══ COMPTES ═══');
dire('  pas relevés            : '+pas.length);
dire('  pas en DÉCALAGE        : '+decalages+' / '+pas.length);
dire('  écritures sorties      : 0 (interceptées : '+s.hub.compteur.ecritures+', jamais transmises)');
dire('  GET servis en mémoire  : '+s.hub.compteur.get);
dire('  pageerrors             : '+((s.hub.erreurs||[]).length)+' '+JSON.stringify((s.hub.erreurs||[]).slice(0,3)));

fs.writeFileSync(SORTIE+'-releve.json', JSON.stringify({pas, eidsHub, coursActif,
  compteur:s.hub.compteur.ecritures, journalEcritures:s.hub.compteur.journal, erreurs:s.hub.erreurs||[]}, null, 1));
fs.writeFileSync(SORTIE+'-journal.txt', journal.join('\n'));
await s.fermer();
