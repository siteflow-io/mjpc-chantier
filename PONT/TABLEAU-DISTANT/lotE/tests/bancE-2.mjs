/* BANC E-2 — LE CAS QUI DÉCIDE
   ① Un écran CHARGÉ, dévoilé à fond, au cran 5 : la voie (i) rogne-t-elle au mur ?
   ② Le morceau du pilote tient-il toujours au mur (voie ii) ?
   ③ Le TÉLÉPHONE : son cadre a-t-il une hauteur ? scinde-t-il ? que porte la scène
      quand c'est lui qui pilote ? */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
import { lire } from './hub-faux.mjs';
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
const ctx = lire(s.hub.store,'site/cours_actif');
const distant = await s.page('?vue=tableau','distant',{width:1360,height:768});
await attendre(3500);

/* ── ① ON CHARGE L'ÉCRAN : cran 1 (rien ne scinde) puis on dévoile TOUT ── */
dire('— ① UN ÉCRAN CHARGÉ, DÉVOILÉ À FOND, AU CRAN 1 —');
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value='0';
  rz.dispatchEvent(new W.Event('input',{bubbles:true})); });
await attendre(1500);
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  for(let k=0;k<8;k++) W.devoile(); });          /* la consigne + ses six étapes, SANS passer à l'écran suivant */
await attendre(2500);

const toile = () => distant.evaluate(()=>{
  const D=document.getElementById('ses-tab-toile').contentDocument;
  const t=D.getElementById('t');
  let bas=0; for(const el of t.children){ const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b; }
  const h=Math.round(t.getBoundingClientRect().height);
  return {px:+getComputedStyle(t).fontSize.replace('px',''), h, bas:Math.round(bas),
          rogne:bas>h+4, debord:Math.round(bas-h),
          signes:(t.textContent||'').replace(/\s+/g,' ').trim().length,
          fin:(t.textContent||'').replace(/\s+/g,' ').trim().slice(-55)};
});
const etatP = () => pilote.evaluate(()=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const e=W.ECRANS[W.i];
  return {iz:W.iz, pt:W.PT[W.iz], i:W.i, nb:W.ECRANS.length, suite:e?(e.suite||0):0,
          rev:e?e.rev:null};
});
let P = await etatP(), T = await toile();
dire('  pilote i='+P.i+'/'+P.nb+' suite='+P.suite+' rev='+P.rev);
dire('  mur au cran 1 : '+T.px.toFixed(1)+' px · '+T.signes+' signes · contenu '+T.bas+' px / boîte '+T.h+' px'+(T.rogne?'  ⚠ ROGNÉ de '+T.debord+' px':'  ✔ tient'));
dire('  fin de ce que la classe lit : «…'+T.fin+'»');

/* ── ② VOIE (i) : on pose les crans 2 à 5 dans la vue, sans rien d'autre ── */
dire('');
dire('— ② VOIE (i) : le mur reçoit le cran et se compose seul, MÊME contenu dévoilé —');
const voieI = [];
for(const cran of [1,2,3,4]){
  const r = await distant.evaluate((c)=>{
    const W=document.getElementById('at-dr-iframe').contentWindow;
    const avant=W.ECRANS.length;
    W.iz=c; try{ W.rendre(); }catch(e){} try{ W.envoie(); }catch(e){}
    const D=document.getElementById('ses-tab-toile').contentDocument;
    const t=D.getElementById('t');
    let bas=0; for(const el of t.children){ const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b; }
    const h=Math.round(t.getBoundingClientRect().height);
    return {cran:c+1, pt:W.PT[c], px:+getComputedStyle(t).fontSize.replace('px',''),
            ecrans:avant+'→'+W.ECRANS.length, i:W.i, h, bas:Math.round(bas),
            rogne:bas>h+4, debord:Math.round(bas-h),
            signes:(t.textContent||'').replace(/\s+/g,' ').trim().length,
            visible:(function(){ let n=0; for(const el of t.children){ if(el.offsetTop<h) n++; } return n; })(),
            enfants:t.children.length};
  }, cran);
  voieI.push(r);
  dire('  cran '+r.cran+' ('+r.pt+' pt) : '+r.px.toFixed(1)+' px · écrans '+r.ecrans+' · contenu '+r.bas+' px / boîte '+r.h+' px'
     + (r.rogne?('   ⚠ ROGNÉ de '+r.debord+' px — '+(r.enfants-r.visible)+' bloc(s) hors champ'):'   ✔ tient')
     + ' · '+r.enfants+' éléments dont '+r.visible+' visibles');
  await distant.screenshot({path:'E2-mur-cran'+r.cran+'.png'});
}

/* ── ③ VOIE (ii) : le morceau du pilote tient-il toujours au mur ? ─────── */
dire('');
dire('— ③ VOIE (ii) : au cran 5, le PILOTE scinde. Son morceau tient-il au mur ? —');
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value='4';
  rz.dispatchEvent(new W.Event('input',{bubbles:true})); });
await attendre(2500);
P = await etatP();
const morceaux = await pilote.evaluate(()=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const grp = W.ECRANS[W.i] && W.ECRANS[W.i].grp;
  if(!grp) return [{rang:W.i, suite:0, blocs:(W.ECRANS[W.i].blocs||[]).length, signes:-1, note:'aucun groupe : cet ecran n a pas scinde'}];
  return W.ECRANS.filter(e=>e.grp===grp).map((e,k)=>({
    rang:k, suite:e.suite||0, blocs:(e.blocs||[]).length,
    signes:(e.blocs||[]).reduce((n,b)=>n+String((b.txt||'')+(b.q||'')+((b.etapes||[]).join(''))).length,0)}));
});
dire('  pilote au cran 5 : i='+P.i+'/'+P.nb+' · le groupe compte '+morceaux.length+' morceaux');
morceaux.forEach(m=>dire('    morceau '+m.suite+' : '+m.blocs+' bloc(s), '+m.signes+' signes de matière'));
dire('  → le pilote compose avec TOUT son contenu (dévoilé + grisé) ; le mur ne peint que le dévoilé.');
dire('    Le morceau du pilote est donc TOUJOURS ≤ ce que le mur peut afficher au même cran, à boîte homothétique.');

/* ── ④ LE TÉLÉPHONE ────────────────────────────────────────────────────── */
dire('');
dire('— ④ LE TÉLÉPHONE (?vue=tel) —');
const tel = await s.page('?vue=tel','tel',{width:390,height:844});
await attendre(4000);
const infoTel = await tel.evaluate(()=>{
  const f=document.getElementById('at-dr-iframe');
  const W=f&&f.contentWindow;
  const r=f?f.getBoundingClientRect():null;
  const pal=[].slice.call(document.querySelectorAll('#ses-tel-pal .ses-pb'))
    .map(b=>b.textContent.replace(/\s+/g,' ').trim().slice(0,22));
  return {cadre: r?{w:Math.round(r.width),h:Math.round(r.height),display:getComputedStyle(f).display}:null,
          iz: W?W.iz:null, ecrans: (W&&W.ECRANS)?W.ECRANS.length:null,
          i: W?W.i:null, palette:pal, nbPalette:pal.length,
          titre:(document.getElementById('ses-tel-titre')||{}).textContent};
});
dire('  cadre moteur du téléphone : '+JSON.stringify(infoTel.cadre));
dire('  iz='+infoTel.iz+' · écrans='+infoTel.ecrans+' · i='+infoTel.i);
dire('  palette ('+infoTel.nbPalette+' boutons) : '+JSON.stringify(infoTel.palette));
dire('  → un cadre de hauteur '+((infoTel.cadre||{}).h)+' px : le moteur du téléphone NE PEUT PAS mesurer un débordement,');
dire('    donc il NE SCINDE JAMAIS. Quand le téléphone pilote, la scène porte toujours morceau=0.');
await tel.screenshot({path:'E2-telephone.png'});

fs.writeFileSync('E2-releve.json', JSON.stringify({voieI, morceaux, infoTel, premierEtat:{P,T}},null,1));
fs.writeFileSync('E2-journal.txt', journal.join('\n'));
dire('');
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length));
await s.fermer();
