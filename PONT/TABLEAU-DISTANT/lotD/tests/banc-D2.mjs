/* BANC COMPLÉMENTAIRE — LOT D
   Ce que le mandat exige en plus de la reproduction : dévoiler ET replier
   (les deux sens), dézoom, gel, fiche, reprise à froid de la page tableau. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre, etatDeroule, toileTableau } from './gestes.mjs';
import { lire } from './hub-faux.mjs';
import fs from 'fs';

const FICHIER = process.argv[2], PORT = +process.argv[3], SORTIE = process.argv[4];
const s = await nouvelleScene(FICHIER, PORT, '/home/claude/mjpc/hub');
const journal = [];
const dire = (...a)=>{ const t=a.join(' '); journal.push(t); console.log(t); };

const pilote = await s.page('', 'pilote', {width:1440, height:900});
await attendre(1400); await amorcer(pilote);
await cliquerSel(pilote,'#tprof-btn',900);
await cliquerTexte(pilote,'button.tprof-section-btn','Atelier',2200);
await cliquerTexte(pilote,'button.at-onglet','Mes chapitres',1300);
await cliquerTexte(pilote,'button','Modifier',2200);
await cliquerTexte(pilote,'button.at-onglet','Déroulé',2500);
await cliquerTexte(pilote,'button','Lancer la séance',3000);
await attendre(1500);
const ctx = lire(s.hub.store,'site/cours_actif');
let tableau = await s.page('?vue=tableau','tableau',{width:1360,height:768});
await attendre(3500);

const zoom = (cran) => pilote.evaluate((c)=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value=String(c);
  rz.dispatchEvent(new W.Event('input',{bubbles:true}));
}, cran);
const geste = (nom) => pilote.evaluate((n)=>{
  document.getElementById('at-dr-iframe').contentWindow[n]();
}, nom);

const releve = async (nom) => {
  await attendre(2200);
  const P = await etatDeroule(pilote), T = await etatDeroule(tableau), V = await toileTableau(tableau);
  const l = {pas:nom, pilote:{i:P.i,act:P.act,suite:P.suite,rev:P.rev,nb:P.nbEcrans,gele:P.gele},
             tableau:{i:T.i,act:T.act,nb:T.nbEcrans}, projete:V.signes,
             accord:(P.act===T.act)};
  dire('  ['+nom+'] pilote i='+P.i+'/'+P.nbEcrans+' «'+P.act+'» suite='+P.suite
      +' | tableau i='+T.i+'/'+T.nbEcrans+' «'+T.act+'» | projeté '+V.signes+' signes'
      +(l.accord?'   ✔':'   ✖ DÉCALAGE'));
  return l;
};
const lignes = [];

dire('— ① ZOOM MAXIMAL, puis DÉVOILER jusque dans le 2e morceau —');
await zoom(4); await attendre(2500);
lignes.push(await releve('zoomé, écran 1'));
for(let k=1;k<=8;k++){ await geste('devoile'); }
lignes.push(await releve('dévoilé ×8 (morceau 2 ou 3)'));

dire('— ② REPLIER : le sens inverse, exigé par le mandat —');
for(let k=1;k<=3;k++){ await geste('replie'); }
lignes.push(await releve('replié ×3'));
for(let k=1;k<=3;k++){ await geste('replie'); }
lignes.push(await releve('replié ×6'));

dire('— ③ DÉZOOM : les fils meurent, le tableau ne doit pas bouger —');
const avantDezoom = await toileTableau(tableau);
await zoom(1); await attendre(2500);
lignes.push(await releve('dézoomé au cran 2'));
const apresDezoom = await toileTableau(tableau);
dire('  tableau avant dézoom :', avantDezoom.signes, 'signes · après :', apresDezoom.signes,
     (Math.abs(avantDezoom.signes-apresDezoom.signes)<=2 ? '  ✔ INCHANGÉ' : '  ⚠ a bougé'));

dire('— ④ GEL : le tableau garde son image, le pilote navigue —');
await zoom(4); await attendre(2000);
for(let k=1;k<=6;k++){ await geste('devoile'); }
await releve('avant gel');
await geste('gel'); await attendre(1500);
const gelImage = await toileTableau(tableau);
for(let k=1;k<=4;k++){ await geste('devoile'); }
const gelApres = await releve('gelé, pilote avancé');
const gelImage2 = await toileTableau(tableau);
dire('  image sous gel :', gelImage.signes, '→', gelImage2.signes,
     (gelImage.signes===gelImage2.signes ? '  ✔ FIGÉE' : '  ⚠ a bougé'));
await geste('gel'); await attendre(2500);
lignes.push(await releve('dégelé — rattrapage'));

dire('— ⑤ REPRISE À FROID de la page tableau, en pleine séance —');
const avantFroid = await etatDeroule(pilote);
await tableau.close();
tableau = await s.page('?vue=tableau','tableau-froid',{width:1360,height:768});
await attendre(4500);
const froid = await releve('page tableau rouverte');
dire('  le pilote était sur i='+avantFroid.i+' («'+avantFroid.act+'») ; la page rouverte montre «'+froid.tableau.act+'»',
     (froid.accord ? '  ✔ BON ÉCRAN RETROUVÉ' : '  ✖ MAUVAIS ÉCRAN'));
lignes.push(froid);

await pilote.screenshot({path:SORTIE+'-pilote.png'});
await tableau.screenshot({path:SORTIE+'-tableau.png'});

const ko = lignes.filter(l=>!l.accord).length;
dire('');
dire('═══ COMPTES ═══');
dire('  pas relevés       : '+lignes.length+' · en décalage : '+ko);
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+')');
dire('  pageerrors        : '+((s.hub.erreurs||[]).length)+' '+JSON.stringify((s.hub.erreurs||[]).slice(0,3)));
fs.writeFileSync(SORTIE+'-releve.json', JSON.stringify({lignes, ctx, erreurs:s.hub.erreurs||[]},null,1));
fs.writeFileSync(SORTIE+'-journal.txt', journal.join('\n'));
await s.fermer();
