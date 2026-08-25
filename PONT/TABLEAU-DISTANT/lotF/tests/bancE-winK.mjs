/* BANC FILET WIN+K — LOT E COMPLÉMENT
   ① décor ACTUEL : les cinq tailles de la fenêtre locale doivent rester identiques
      (30,2 · 40,3 · 47,9 · 55,4 · 65,5 px) — le filet ne doit rien changer là où
      rien ne débordait ;
   ② décor CHARGÉ (consigne + 10 étapes longues) et fenêtre non 16/9 : la fenêtre
      locale rognait ; elle ne doit plus rogner. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
import { brancher } from './hub-faux.mjs';
import fs from 'fs';

const FICHIER=process.argv[2], PORT=+process.argv[3], ETIQ=process.argv[4];
const CHARGE = process.argv[5]==='charge';
const INSEC  = process.argv[5]==='insecable';
const FENS = {'4/3':{width:1024,height:768}, '800':{width:800,height:600},
              '16/10':{width:1280,height:800}, '16/9':{width:1280,height:720}};
const FEN = FENS[process.argv[6]] || FENS['16/9'];
const s = await nouvelleScene(FICHIER, PORT, '/home/claude/mjpc/hub');
const journal=[]; const dire=(...a)=>{const t=a.join(' ');journal.push(t);console.log(t);};
dire('### '+ETIQ+' · '+(INSEC?'décor INSÉCABLE (une étape très longue)':(CHARGE?'décor CHARGÉ (10 étapes longues)':'décor actuel'))+' · fenêtre '+FEN.width+'×'+FEN.height);

const pilote = await s.page('', 'pilote', {width:1440, height:900});
await attendre(1400); await amorcer(pilote);
await cliquerSel(pilote,'#tprof-btn',900);
await cliquerTexte(pilote,'button.tprof-section-btn','Atelier',2200);
await cliquerTexte(pilote,'button.at-onglet','Mes chapitres',1300);
await cliquerTexte(pilote,'button','Modifier',2200);
await cliquerTexte(pilote,'button.at-onglet','Déroulé',2500);
await cliquerTexte(pilote,'button','Lancer la séance',3000);
await attendre(1500);

const att = new Promise(r => s.nav.once('targetcreated', async t => r(await t.page())));
await pilote.evaluate(()=>{ document.getElementById('at-dr-iframe').contentWindow.tableau(); });
const local = await att; await brancher(local, s.hub, 'local');
await local.setViewport(FEN);
await attendre(2000);

if(INSEC){
  /* une SEULE étape, très longue : `scinde()` coupe les étapes en deux moitiés, mais
     avec une seule il n'a rien à répartir — c'est le cas où le contenu résiste. */
  await pilote.evaluate(()=>{
    const W=document.getElementById('at-dr-iframe').contentWindow;
    const b=W.ECRANS[0].blocs[0];
    b.txt='Observe.';
    b.etapes=['Étape unique : tu observes le tableau en silence, tu notes au brouillon tout ce que tu vois — les couleurs, la lumière, les personnages, le décor, ce qui bouge et ce qui ne bouge pas, ce qui est net et ce qui est flou, puis tu écris en cinq lignes complètes l\'hypothèse que tu proposes à la classe sur ce que peut être le Romantisme, et tu gardes ton brouillon pour la mise en commun de la fin de l\'heure.'];
    b.vues=1; W.ECRANS[0].rev=2; W.rendre();
  });
  await attendre(2500);
} else if(CHARGE){
  /* on charge l'écran 1 : la consigne reçoit DIX étapes longues. Décor de banc,
     posé dans la trame en mémoire — le hub n'est pas touché. */
  await pilote.evaluate(()=>{
    const W=document.getElementById('at-dr-iframe').contentWindow;
    const b=W.ECRANS[0].blocs[0];
    b.etapes=[];
    for(let k=1;k<=10;k++) b.etapes.push('Étape '+k+' : je relis la consigne en entier, je repère les mots qui comptent, puis je note au brouillon ce que je vais dire à la classe ('+(k+3)+' min).');
    b.vues=10; W.ECRANS[0].rev=2; W.rendre();
  });
  await attendre(2500);
} else {
  await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
    for(let k=0;k<8;k++) W.devoile(); });
  await attendre(2500);
}

const mesure = () => local.evaluate(()=>{
  const t=document.getElementById('t'); if(!t)return{absent:true};
  let bas=0; for(const el of t.children){ const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b; }
  const r=t.getBoundingClientRect();
  return {px:+getComputedStyle(t).fontSize.replace('px',''), w:Math.round(r.width), h:Math.round(r.height),
    bas:Math.round(bas), debord:Math.max(0,Math.round(bas-r.height)), rogne:bas>r.height+4,
    signes:(t.textContent||'').replace(/\s+/g,' ').trim().length,
    fin:(t.textContent||'').replace(/\s+/g,' ').trim().slice(-42)};
});
const etatP = () => pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  return {pt:W.PT[W.iz], i:W.i, nb:W.ECRANS.length}; });

const lignes=[];
for(const c of [0,1,2,3,4]){
  await pilote.evaluate((v)=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
    const rz=W.document.getElementById('rz'); rz.value=String(v);
    rz.dispatchEvent(new W.Event('input',{bubbles:true})); }, c);
  await attendre(3400);
  const L=await mesure(), P=await etatP();
  lignes.push({cran:c+1, pt:P.pt, local:L, ecrans:P.nb});
  dire('  cran '+(c+1)+' ('+P.pt+' pt) : boîte '+L.w+'×'+L.h+' · '+L.px.toFixed(1)+' px · contenu '+L.bas+' px'
     + (L.rogne?('   ⚠ ROGNÉ de '+L.debord+' px'):'   ✔ tient')+' · '+L.signes+' signes · '+P.nb+' écrans');
}
await local.screenshot({path:ETIQ+'-locale-cran5.png'});
const rognes = lignes.filter(l=>l.local.rogne);
dire('');
dire('  tailles : '+lignes.map(l=>l.local.px.toFixed(1)).join(' · ')+' px');
dire('  crans rognés : '+(rognes.length? rognes.map(l=>l.cran+' (−'+l.local.debord+' px)').join(', ') : '0'));
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length));
fs.writeFileSync(ETIQ+'-releve.json', JSON.stringify(lignes,null,1));
fs.writeFileSync(ETIQ+'-journal.txt', journal.join('\n'));
await s.fermer();
