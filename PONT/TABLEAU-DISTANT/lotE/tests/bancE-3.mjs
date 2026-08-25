/* BANC E-3 — LA MESURE QUI FONDE LA VOIE PROPOSÉE
   Le cadre moteur de la vue distante fait 0 px : il ne peut rien mesurer, donc
   il ne scinde jamais, donc au cran 5 le mur ROGNE (mesuré au banc E-2).
   Question : si on lui donnait une boîte RÉELLE et homothétique, scinderait-il
   comme le pilote ? Si oui, le mur peut se composer seul à partir de
   (identité du père, dévoilement, cran) — sans jamais dépendre de la
   composition de l'appareil qui pilote. C'est ce qui rend le cas TÉLÉPHONE
   possible. On ne code rien : on mesure dans la page, à la main. */
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
const distant = await s.page('?vue=tableau','distant',{width:1360,height:768});
await attendre(3500);

/* on dévoile l'écran 1 à fond, au cran 1 */
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value='0';
  rz.dispatchEvent(new W.Event('input',{bubbles:true}));
  for(let k=0;k<8;k++) W.devoile(); });
await attendre(2500);

const scissionPilote = async (cran) => pilote.evaluate((c)=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value=String(c);
  rz.dispatchEvent(new W.Event('input',{bubbles:true}));
  return new Promise(r=>setTimeout(()=>{
    const e=W.ECRANS[W.i];
    const grp=e&&e.grp;
    const lot = grp ? W.ECRANS.filter(x=>x.grp===grp) : [e];
    const c2=W.document.getElementById('contenu');
    const b=W.document.getElementById('ecran').getBoundingClientRect();
    r({iz:W.iz, pt:W.PT[W.iz], nb:W.ECRANS.length, i:W.i,
       morceaux: lot.length, boite:Math.round(b.width)+'×'+Math.round(b.height),
       ratio:+(b.width/b.height).toFixed(3),
       police:+getComputedStyle(c2).fontSize.replace('px',''),
       decoupe: lot.map(x=>({suite:x.suite||0, blocs:(x.blocs||[]).length,
         etapes:(x.blocs||[]).reduce((n,bl)=>n+((bl.etapes||[]).length),0)}))});
  },1800));
}, cran);

/* on donne au cadre de la vue une boîte RÉELLE, homothétique, et on pose le cran */
const scissionVue = async (cran, largeur) => distant.evaluate((c, L)=>{
  const f=document.getElementById('at-dr-iframe');
  f.style.display='block'; f.style.position='fixed'; f.style.left='-20000px'; f.style.top='0';
  f.style.width=L+'px'; f.style.height=Math.round(L*9/16)+'px';
  const W=f.contentWindow;
  W.iz=c;
  return new Promise(r=>setTimeout(()=>{
    try{ W.rendre(); }catch(e){}
    setTimeout(()=>{
      const e=W.ECRANS[W.i]; const grp=e&&e.grp;
      const lot = grp ? W.ECRANS.filter(x=>x.grp===grp) : [e];
      const c2=W.document.getElementById('contenu');
      const b=W.document.getElementById('ecran').getBoundingClientRect();
      r({iz:W.iz, nb:W.ECRANS.length, i:W.i, morceaux: lot.length,
         boite:Math.round(b.width)+'×'+Math.round(b.height),
         ratio:+(b.width/b.height).toFixed(3),
         police:+getComputedStyle(c2).fontSize.replace('px',''),
         decoupe: lot.map(x=>({suite:x.suite||0, blocs:(x.blocs||[]).length,
           etapes:(x.blocs||[]).reduce((n,bl)=>n+((bl.etapes||[]).length),0)}))});
    },900);
  },300));
}, cran, largeur);

dire('— LE MÊME CONTENU, LE MÊME CRAN, DEUX BOÎTES HOMOTHÉTIQUES —');
const compar = [];
for(const cran of [0,2,3,4]){
  const P = await scissionPilote(cran);
  const V = await scissionVue(cran, 1200);      /* 1200×675, 16/9, ~2× la boîte du pilote */
  const memeDecoupe = JSON.stringify(P.decoupe)===JSON.stringify(V.decoupe);
  compar.push({cran:cran+1, pilote:P, vue:V, memeDecoupe});
  dire('  cran '+(cran+1)+' ('+P.pt+' pt) :');
  dire('    PILOTE  boîte '+P.boite+' (r '+P.ratio+') · police '+P.police.toFixed(1)+' px · '+P.morceaux+' morceau(x) · '+JSON.stringify(P.decoupe));
  dire('    VUE     boîte '+V.boite+' (r '+V.ratio+') · police '+V.police.toFixed(1)+' px · '+V.morceaux+' morceau(x) · '+JSON.stringify(V.decoupe));
  dire('    → découpe '+(memeDecoupe?'IDENTIQUE ✔':'DIFFÉRENTE ✖')
     + ' · rapport police/hauteur : pilote '+(P.police/ (+P.boite.split('×')[1])).toFixed(4)
     + ' · vue '+(V.police/(+V.boite.split('×')[1])).toFixed(4));
}
const tous = compar.every(c=>c.memeDecoupe);
dire('');
dire('═══ VERDICT ═══');
dire(tous
 ? '  À boîte homothétique et cran égal, LA VUE DÉCOUPE EXACTEMENT COMME LE PILOTE.'
 : '  Les découpes divergent sur au moins un cran : '+compar.filter(c=>!c.memeDecoupe).map(c=>'cran '+c.cran).join(', '));
fs.writeFileSync('E3-releve.json', JSON.stringify(compar,null,1));
fs.writeFileSync('E3-journal.txt', journal.join('\n'));
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length));
await s.fermer();
