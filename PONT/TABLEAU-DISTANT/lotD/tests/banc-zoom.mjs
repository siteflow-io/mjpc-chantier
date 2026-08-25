/* BANC ZOOM — LOT D, question de Paul (25/08) :
   « tu as vérifié que le zoom zoomait sur l'écran distant ? »
   On mesure la TAILLE DE POLICE réellement peinte dans la toile du tableau
   distant, à chaque cran de la réglette du pilote. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre, etatDeroule } from './gestes.mjs';
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
const tableau = await s.page('?vue=tableau','tableau',{width:1360,height:768});
await attendre(3500);

/* on se met sur un écran de texte et on dévoile un peu, pour avoir quoi mesurer */
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  for(let k=0;k<2;k++) W.devoile(); });
await attendre(2200);

/* la police du PILOTE : #contenu dans son cadre ; celle du TABLEAU : #t dans la toile */
const policePilote = () => pilote.evaluate(()=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const c=W.document.getElementById('contenu');
  return {iz:W.iz, pt:W.PT[W.iz], px:+getComputedStyle(c).fontSize.replace('px',''),
          boite:Math.round(W.document.getElementById('ecran').getBoundingClientRect().height)};
});
const policeTableau = () => tableau.evaluate(()=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const D=document.getElementById('ses-tab-toile').contentDocument;
  const t=D&&D.getElementById('t');
  const cons=D&&D.querySelector('.cons .txt');
  return {iz:W.iz, pt:W.PT[W.iz],
          pxToile: t ? +getComputedStyle(t).fontSize.replace('px','') : null,
          pxConsigne: cons ? +getComputedStyle(cons).fontSize.replace('px','') : null,
          hauteurToile: t ? Math.round(t.getBoundingClientRect().height) : null};
});

const crans = [];
for(const cran of [0,1,2,3,4]){
  await pilote.evaluate((c)=>{
    const W=document.getElementById('at-dr-iframe').contentWindow;
    const rz=W.document.getElementById('rz'); rz.value=String(c);
    rz.dispatchEvent(new W.Event('input',{bubbles:true}));
  }, cran);
  await attendre(2600);
  const P = await policePilote(), T = await policeTableau(), E = await etatDeroule(pilote);
  crans.push({cran:cran+1, pilote:P, tableau:T, ecransPilote:E.nbEcrans});
  dire('  cran '+(cran+1)+' ('+P.pt+' pt) : PILOTE iz='+P.iz+' → '+P.px.toFixed(1)+' px (boîte '+P.boite+')'
     + ' | TABLEAU iz='+T.iz+' ('+T.pt+' pt) → toile '+(T.pxToile===null?'—':T.pxToile.toFixed(1)+' px')
     + ' · consigne '+(T.pxConsigne===null?'—':T.pxConsigne.toFixed(1)+' px')
     + ' | écrans pilote : '+E.nbEcrans);
}

const izVus = [...new Set(crans.map(c=>c.tableau.iz))];
const pxVus = [...new Set(crans.map(c=>c.tableau.pxToile))];
dire('');
dire('═══ VERDICT ═══');
dire('  crans de zoom joués au pilote : 5 (24 · 32 · 38 · 44 · 52 pt)');
dire('  iz observés dans la vue distante : '+JSON.stringify(izVus));
dire('  tailles de police observées au tableau distant : '+JSON.stringify(pxVus));
dire(izVus.length===1
  ? '  → LE ZOOM DU PILOTE N\'ATTEINT PAS LE TABLEAU DISTANT : il reste au cran '+(izVus[0]+1)+'.'
  : '  → le zoom suit : '+izVus.length+' valeurs distinctes.');

await tableau.screenshot({path:SORTIE+'-tableau-cran5.png'});
fs.writeFileSync(SORTIE+'-releve.json', JSON.stringify(crans,null,1));
fs.writeFileSync(SORTIE+'-journal.txt', journal.join('\n'));
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length));
await s.fermer();
