/* BANC DEUX RÉGLETTES — LOT E COMPLÉMENT
   Trois pages : pilote PC + téléphone + mur.
   PC cran 5 → téléphone cran 2 → PC cran 4 : le mur suit 5 → 2 → 4.
   Après chaque geste : 10 cycles de sondage, aucune oscillation, et les DEUX
   réglettes affichent le cran courant. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
import fs from 'fs';

const s = await nouvelleScene(process.argv[2], +process.argv[3], '/home/claude/mjpc/hub');
const journal=[]; const dire=(...a)=>{const t=a.join(' ');journal.push(t);console.log(t);};

const pilote = await s.page('', 'pilote', {width:1440, height:900});
await attendre(1400); await amorcer(pilote);
await cliquerSel(pilote,'#tprof-btn',900);
await cliquerTexte(pilote,'button.tprof-section-btn','Atelier',2200);
await cliquerTexte(pilote,'button.at-onglet','Mes chapitres',1300);
await cliquerTexte(pilote,'button','Modifier',2200);
await cliquerTexte(pilote,'button.at-onglet','Déroulé',2500);
await cliquerTexte(pilote,'button','Lancer la séance',3000);
await attendre(1500);
const mur = await s.page('?vue=tableau','mur',{width:1360,height:768});
await attendre(3500);
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  for(let k=0;k<4;k++) W.devoile(); });
await attendre(2000);
const tel = await s.page('?vue=tel','tel',{width:390,height:844});
await attendre(4500);

const lirePC  = () => pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  return {iz:W.iz, reglette:+W.document.getElementById('rz').value,
          etiquette:W.document.getElementById('lz').textContent, cran:SES.cran}; });
const lireTel = () => tel.evaluate(()=>({reglette:+(document.getElementById('ses-tel-rz')||{}).value,
  etiquette:(document.getElementById('ses-tel-zl')||{}).textContent, cran:SES.cran,
  izMoteur:document.getElementById('at-dr-iframe').contentWindow.iz}));
const lireMur = () => mur.evaluate(()=>{
  const D=document.getElementById('ses-tab-toile').contentDocument, t=D&&D.getElementById('t');
  return {iz:document.getElementById('at-dr-iframe').contentWindow.iz,
          px:t?+getComputedStyle(t).fontSize.replace('px',''):null}; });

const posePC  = (c)=> pilote.evaluate((v)=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value=String(v);
  rz.dispatchEvent(new W.Event('input',{bubbles:true})); }, c);
const poseTel = (c)=> tel.evaluate((v)=>{ const r=document.getElementById('ses-tel-rz');
  r.value=String(v); r.dispatchEvent(new Event('input',{bubbles:true})); }, c);

const lignes=[];
async function epreuve(nom, qui, c){
  if(qui==='PC') await posePC(c); else await poseTel(c);
  await attendre(3500);
  /* 10 cycles de sondage : rien ne doit plus bouger */
  const suite=[];
  for(let k=0;k<10;k++){ await attendre(950); suite.push((await lireMur()).iz); }
  const stable = suite.every(x=>x===suite[0]);
  const M=await lireMur(), P=await lirePC(), T=await lireTel();
  const bonMur = (M.iz===c);
  const bonnesReglettes = (P.reglette===c && T.reglette===c);
  lignes.push({pas:nom, qui, cran:c+1, mur:M, pc:P, tel:T, stable, bonMur, bonnesReglettes, suite});
  dire('  '+nom+' — '+qui+' pose le cran '+(c+1)+' :');
  dire('    MUR      iz='+M.iz+' · '+(M.px||0).toFixed(1)+' px '+(bonMur?'✔':'✖'));
  dire('    RÉGLETTE PC  = cran '+(P.reglette+1)+' («'+P.etiquette+'») · moteur iz='+P.iz);
  dire('    RÉGLETTE TÉL = cran '+(T.reglette+1)+' («'+T.etiquette+'») · moteur du tél iz='+T.izMoteur+' (inchangé)');
  dire('    10 cycles de sondage : '+JSON.stringify(suite)+' → '+(stable?'AUCUNE OSCILLATION ✔':'OSCILLE ✖'));
  dire('    les deux réglettes au cran courant : '+(bonnesReglettes?'✔':'✖'));
}

dire('— LE DERNIER GESTE GAGNE, D\'OÙ QU\'IL VIENNE —');
const izTelDepart = (await lireTel()).izMoteur;
await epreuve('①', 'PC',  4);
await epreuve('②', 'TÉL', 1);
await epreuve('③', 'PC',  3);
const izTelFin = (await lireTel()).izMoteur;
dire('');
dire('  moteur du téléphone : iz='+izTelDepart+' au départ → iz='+izTelFin+' à la fin '
   + (izTelDepart===izTelFin?'  ✔ son affichage n\'a jamais bougé':'  ✖'));
dire('  suite des crans au mur : '+lignes.map(l=>l.cran).join(' → ')+' (attendu 5 → 2 → 4)');

const ko = lignes.filter(l=>!l.stable||!l.bonMur||!l.bonnesReglettes).length + (izTelDepart===izTelFin?0:1);
dire('');
dire('═══ COMPTES ═══');
dire('  épreuves : '+lignes.length+' · en échec : '+ko);
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length));
fs.writeFileSync('Ereg-releve.json', JSON.stringify(lignes,null,1));
fs.writeFileSync('Ereg-journal.txt', journal.join('\n'));
await s.fermer();
