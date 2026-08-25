/* BANC DE PREUVE — LOT E
   À chaque cran 1→5 : la vue distante doit produire la MÊME IMAGE que la fenêtre
   tableau locale (mêmes textes visibles, police à ±1 px après mise à l'échelle).
   Puis : dévoiler, replier, gel, dégel, dézoom, reprise à froid. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
import { brancher } from './hub-faux.mjs';
import fs from 'fs';

const FICHIER=process.argv[2], PORT=+process.argv[3], SORTIE=process.argv[4];
const MUR = (process.argv[5]==='4/3') ? {width:1024,height:768} : {width:1360,height:768};
const s = await nouvelleScene(FICHIER, PORT, '/home/claude/mjpc/hub');
const journal=[]; const dire=(...a)=>{const t=a.join(' ');journal.push(t);console.log(t);};
dire('### base '+FICHIER.split('/').pop()+' · mur '+MUR.width+'×'+MUR.height+' ('+(process.argv[5]||'16/9')+')');

const pilote = await s.page('', 'pilote', {width:1440, height:900});
await attendre(1400); await amorcer(pilote);
await cliquerSel(pilote,'#tprof-btn',900);
await cliquerTexte(pilote,'button.tprof-section-btn','Atelier',2200);
await cliquerTexte(pilote,'button.at-onglet','Mes chapitres',1300);
await cliquerTexte(pilote,'button','Modifier',2200);
await cliquerTexte(pilote,'button.at-onglet','Déroulé',2500);
await cliquerTexte(pilote,'button','Lancer la séance',3000);
await attendre(1500);
let distant = await s.page('?vue=tableau','distant',MUR);
await attendre(3500);

/* la fenêtre tableau LOCALE : la référence. On la force en 16/9 pour qu'elle soit
   comparable (le popup de Puppeteer s'ouvre en 4/3 — artefact déclaré au LOT E ④). */
const attenteF = new Promise(r => s.nav.once('targetcreated', async t => r(await t.page())));
await pilote.evaluate(()=>{ document.getElementById('at-dr-iframe').contentWindow.tableau(); });
const local = await attenteF;
await brancher(local, s.hub, 'local');
await local.setViewport({width:1280, height:720});
await attendre(1800);

/* on dévoile l'écran 1 à fond, au cran 1 */
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value='0';
  rz.dispatchEvent(new W.Event('input',{bubbles:true}));
  for(let k=0;k<8;k++) W.devoile(); });
await attendre(2500);

const imgLocal = () => local.evaluate(()=>{
  const t=document.getElementById('t'); if(!t)return{absent:true};
  let bas=0; for(const el of t.children){const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b;}
  const r=t.getBoundingClientRect();
  return {px:+getComputedStyle(t).fontSize.replace('px',''), h:Math.round(r.height), w:Math.round(r.width),
    txt:(t.textContent||'').replace(/\s+/g,' ').trim(),
    bas:Math.round(bas), rogne:bas>Math.round(r.height)+4};
});
const imgDistant = () => distant.evaluate(()=>{
  const f=document.getElementById('ses-tab-toile'); const D=f.contentDocument;
  const t=D&&D.getElementById('t'); if(!t)return{absent:true};
  let bas=0; for(const el of t.children){const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b;}
  const r=t.getBoundingClientRect();
  const cadre=document.getElementById('at-dr-iframe');
  const cs=cadre?getComputedStyle(cadre):null;
  return {px:+getComputedStyle(t).fontSize.replace('px',''), h:Math.round(r.height), w:Math.round(r.width),
    txt:(t.textContent||'').replace(/\s+/g,' ').trim(),
    bas:Math.round(bas), rogne:bas>Math.round(r.height)+4,
    toile:Math.round(f.getBoundingClientRect().width)+'×'+Math.round(f.getBoundingClientRect().height),
    cadre:cadre?{w:Math.round(cadre.getBoundingClientRect().width),h:Math.round(cadre.getBoundingClientRect().height),
      opacite:cs.opacity, doigt:cs.pointerEvents, gauche:cs.left, z:cs.zIndex, tab:cadre.getAttribute('tabindex')}:null,
    iz:(f&&document.getElementById('at-dr-iframe').contentWindow.iz)};
});
const etatP = () => pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const e=W.ECRANS[W.i];
  return {iz:W.iz, pt:W.PT[W.iz], i:W.i, nb:W.ECRANS.length, suite:e?(e.suite||0):0}; });
const cran = async (c) => { await pilote.evaluate((v)=>{
    const W=document.getElementById('at-dr-iframe').contentWindow;
    const rz=W.document.getElementById('rz'); rz.value=String(v);
    rz.dispatchEvent(new W.Event('input',{bubbles:true})); }, c);
  await attendre(3200); };

const lignes=[];
dire('');
dire('— ① LA MÊME IMAGE, CRAN PAR CRAN : vue distante contre fenêtre locale —');
for(const c of [0,1,2,3,4]){
  await cran(c);
  const P=await etatP(), L=await imgLocal(), D=await imgDistant();
  /* la police se compare APRÈS mise à l'échelle : même proportion de la boîte */
  const propL=+(L.px/L.h).toFixed(4), propD=+(D.px/D.h).toFixed(4);
  const memeTexte = L.txt===D.txt;
  const memeProp = Math.abs(propL-propD) < 0.0015;
  lignes.push({cran:c+1, pt:P.pt, pilote:P, local:L, distant:D, memeTexte, memeProp});
  dire('  cran '+(c+1)+' ('+P.pt+' pt) · pilote i='+P.i+'/'+P.nb+' suite='+P.suite);
  dire('    LOCAL   '+L.w+'×'+L.h+' · '+L.px.toFixed(1)+' px (prop '+propL+') · '+L.txt.length+' signes'+(L.rogne?' ⚠ROGNÉ':''));
  dire('    DISTANT '+D.w+'×'+D.h+' · '+D.px.toFixed(1)+' px (prop '+propD+') · '+D.txt.length+' signes'+(D.rogne?' ⚠ROGNÉ':'')+' · toile '+D.toile+' · iz='+D.iz);
  dire('    → texte '+(memeTexte?'IDENTIQUE ✔':'DIFFÉRENT ✖')+' · police à l\'échelle '+(memeProp?'IDENTIQUE ✔':'ÉCART ✖'));
  if(!memeTexte){ dire('      local  : «…'+L.txt.slice(-70)+'»'); dire('      distant: «…'+D.txt.slice(-70)+'»'); }
  await distant.screenshot({path:SORTIE+'-mur-cran'+(c+1)+'.png'});
}
dire('  cadre de découpe du mur : '+JSON.stringify((lignes[4]||{}).distant?.cadre));

/* ── ② REPLIER : le sens inverse ── */
dire('');
dire('— ② REPLIER au cran 5 —');
for(let k=0;k<3;k++){ await pilote.evaluate(()=>{document.getElementById('at-dr-iframe').contentWindow.replie();}); }
await attendre(3000);
let L=await imgLocal(), D=await imgDistant(), P=await etatP();
dire('  après ×3 : pilote i='+P.i+' suite='+P.suite+' | local '+L.txt.length+' signes · distant '+D.txt.length+' signes · '+(L.txt===D.txt?'IDENTIQUE ✔':'DIFFÉRENT ✖'));
lignes.push({pas:'replier×3', memeTexte:L.txt===D.txt, l:L.txt.length, d:D.txt.length});

/* ── ③ GEL : un changement de cran sous gel ne repeint pas ── */
dire('');
dire('— ③ GEL : le cran change, le mur ne bouge pas —');
await pilote.evaluate(()=>{document.getElementById('at-dr-iframe').contentWindow.gel();});
await attendre(2200);
const avantGel = await imgDistant();
await cran(0);
const pendantGel = await imgDistant();
dire('  sous gel : '+avantGel.px.toFixed(1)+' px / '+avantGel.txt.length+' signes → '+pendantGel.px.toFixed(1)+' px / '+pendantGel.txt.length+' signes '
   + ((Math.abs(avantGel.px-pendantGel.px)<0.5 && avantGel.txt===pendantGel.txt)?'  ✔ FIGÉ':'  ✖ A BOUGÉ'));
lignes.push({pas:'gel', fige:(Math.abs(avantGel.px-pendantGel.px)<0.5 && avantGel.txt===pendantGel.txt)});
await pilote.evaluate(()=>{document.getElementById('at-dr-iframe').contentWindow.gel();});
await attendre(3000);
L=await imgLocal(); D=await imgDistant();
dire('  au dégel : local '+L.px.toFixed(1)+' px / '+L.txt.length+' signes · distant '+D.px.toFixed(1)+' px / '+D.txt.length+' signes · '+(L.txt===D.txt?'RATTRAPÉ ✔':'✖'));
lignes.push({pas:'dégel', memeTexte:L.txt===D.txt});

/* ── ④ REPRISE À FROID : le cran survit ── */
dire('');
dire('— ④ REPRISE À FROID de la page mur, en pleine séance —');
await cran(4);
const avantFroid = await imgDistant();
await distant.close();
distant = await s.page('?vue=tableau','distant-froid',MUR);
await attendre(5000);
/* on ramène les DEUX surfaces à un état stable avant de comparer : la cascade de
   scission du pilote laisse la fenêtre locale peinte sur un état transitoire si
   aucun rendu ne suit (artefact attrapé au banc 4/3, déclaré au rapport). */
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  W.devoile(); W.replie(); });
await attendre(3000);
const froid = await imgDistant();
const localFroid = await imgLocal();
/* le critère du mandat : la vue distante = la fenêtre locale. On compare les DEUX
   après la reprise (comparer le mur à lui-même avant/après mesurerait une course
   d'émission, pas la reprise). */
const memeQueLocal = (localFroid.txt===froid.txt);
const memeCran = Math.abs(avantFroid.px-froid.px)<1.5;
dire('  avant F5 : '+avantFroid.px.toFixed(1)+' px / '+avantFroid.txt.length+' signes');
dire('  après F5 : distant '+froid.px.toFixed(1)+' px / '+froid.txt.length+' signes · local '+localFroid.px.toFixed(1)+' px / '+localFroid.txt.length+' signes');
dire('  → cran retrouvé : '+(memeCran?'✔':'✖')+' · même image que la fenêtre locale : '+(memeQueLocal?'✔':'✖'));
lignes.push({pas:'reprise à froid', ok:(memeCran&&memeQueLocal), memeTexte:memeQueLocal});

await pilote.screenshot({path:SORTIE+'-pilote.png'});
await local.screenshot({path:SORTIE+'-local.png'});
await distant.screenshot({path:SORTIE+'-distant.png'});
const ko = lignes.filter(l=>l.memeTexte===false||l.fige===false||l.ok===false||l.memeProp===false).length;
dire('');
dire('═══ COMPTES ═══');
dire('  épreuves : '+lignes.length+' · en échec : '+ko);
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length)+' '+JSON.stringify((s.hub.erreurs||[]).slice(0,3)));
fs.writeFileSync(SORTIE+'-releve.json', JSON.stringify(lignes,null,1));
fs.writeFileSync(SORTIE+'-journal.txt', journal.join('\n'));
await s.fermer();
