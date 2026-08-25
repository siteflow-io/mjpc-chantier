/* BANC PHASE 0 — LOT E
   Trois surfaces à la fois : le PILOTE, la fenêtre tableau LOCALE (référence
   mesurée, scénario Win+K) et la vue tableau DISTANTE. On mesure la géométrie
   des boîtes, la police, et ce que chacune projette réellement, cran par cran.
   Puis on SIMULE la voie (i) : poser le cran dans le moteur de la vue distante
   et regarder ce qui arrive à son contenu. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
import { brancher, lire } from './hub-faux.mjs';
import fs from 'fs';

const FICHIER = process.argv[2], PORT = +process.argv[3], SORTIE = process.argv[4];
const s = await nouvelleScene(FICHIER, PORT, '/home/claude/mjpc/hub');
const journal = []; const dire=(...a)=>{const t=a.join(' ');journal.push(t);console.log(t);};

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

/* la fenêtre tableau LOCALE, ouverte par la fonction du moteur (scénario Win+K) */
const attenteF = new Promise(r => s.nav.once('targetcreated', async t => r(await t.page())));
await pilote.evaluate(()=>{ document.getElementById('at-dr-iframe').contentWindow.tableau(); });
const local = await attenteF;
await brancher(local, s.hub, 'tableau-local');
await attendre(1800);
dire('trois surfaces montées :', await local.title());

/* on dévoile pour avoir de la matière */
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  for(let k=0;k<3;k++) W.devoile(); });
await attendre(2000);

/* ── ① LA GÉOMÉTRIE DES BOÎTES ─────────────────────────────────────────── */
const boitePilote = await pilote.evaluate(()=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const e=W.document.getElementById('ecran').getBoundingClientRect();
  const c=W.document.getElementById('contenu').getBoundingClientRect();
  return {w:Math.round(e.width), h:Math.round(e.height), ratio:+(e.width/e.height).toFixed(3),
          contenuW:Math.round(c.width), contenuH:Math.round(c.height)};
});
const boiteLocal = await local.evaluate(()=>{
  const t=document.getElementById('t'); const r=t.getBoundingClientRect();
  return {w:Math.round(r.width), h:Math.round(r.height), ratio:+(r.width/r.height).toFixed(3)};
});
const boiteDistant = await distant.evaluate(()=>{
  const D=document.getElementById('ses-tab-toile').contentDocument;
  const t=D.getElementById('t'); const r=t.getBoundingClientRect();
  return {w:Math.round(r.width), h:Math.round(r.height), ratio:+(r.width/r.height).toFixed(3)};
});
dire('');
dire('— ① GÉOMÉTRIE DES BOÎTES —');
dire('  PILOTE  : '+boitePilote.w+'×'+boitePilote.h+' (ratio '+boitePilote.ratio+') · #contenu '+boitePilote.contenuW+'×'+boitePilote.contenuH);
dire('  LOCAL   : '+boiteLocal.w+'×'+boiteLocal.h+' (ratio '+boiteLocal.ratio+')');
dire('  DISTANT : '+boiteDistant.w+'×'+boiteDistant.h+' (ratio '+boiteDistant.ratio+')');
const homo = Math.abs(boitePilote.ratio-boiteLocal.ratio)<0.02 && Math.abs(boiteLocal.ratio-boiteDistant.ratio)<0.02;
dire('  → boîtes '+(homo?'HOMOTHÉTIQUES (même 16/9) : la loi de police en % donne la même composition à cran égal — À VÉRIFIER au ③':'NON homothétiques'));

/* ── ② LES TROIS SURFACES, CRAN PAR CRAN ───────────────────────────────── */
const etatPilote = () => pilote.evaluate(()=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const c=W.document.getElementById('contenu');
  const e=W.ECRANS[W.i];
  return {iz:W.iz, pt:W.PT[W.iz], px:+getComputedStyle(c).fontSize.replace('px',''),
          i:W.i, nb:W.ECRANS.length, suite:e?(e.suite||0):null,
          act:e?String(e.act||'').slice(0,34):null,
          txt:(c.textContent||'').replace(/\s+/g,' ').trim().length,
          deborde:(function(){ let bas=0; const en=c.children;
            for(let k=0;k<en.length;k++){ const b=en[k].offsetTop+en[k].offsetHeight; if(b>bas)bas=b; }
            return {bas:Math.round(bas), boite:c.clientHeight, deborde:bas>c.clientHeight+4}; })()};
});
const etatToile = (page, dansIframe) => page.evaluate((dans)=>{
  const D = dans ? document.getElementById('ses-tab-toile').contentDocument : document;
  const t=D.getElementById('t'); if(!t) return {absent:true};
  const cons=D.querySelector('.cons .txt');
  const act=D.querySelector('.act');
  const r=t.getBoundingClientRect();
  let bas=0; for(const el of t.children){ const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b; }
  return {px:+getComputedStyle(t).fontSize.replace('px',''),
          pxCons:cons?+getComputedStyle(cons).fontSize.replace('px',''):null,
          act:act?act.textContent.trim().slice(0,34):null,
          signes:(t.textContent||'').replace(/\s+/g,' ').trim().length,
          extrait:(t.textContent||'').replace(/\s+/g,' ').trim().slice(-60),
          h:Math.round(r.height), bas:Math.round(bas), rogne:bas>Math.round(r.height)+4};
}, dansIframe);

const crans = [];
dire('');
dire('— ② LES TROIS SURFACES, CRAN PAR CRAN (base '+FICHIER.split('/').pop()+') —');
for(const cran of [0,1,2,3,4]){
  await pilote.evaluate((c)=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
    const rz=W.document.getElementById('rz'); rz.value=String(c);
    rz.dispatchEvent(new W.Event('input',{bubbles:true})); }, cran);
  await attendre(2400);
  const P=await etatPilote(), L=await etatToile(local,false), Dd=await etatToile(distant,true);
  crans.push({cran:cran+1, pilote:P, local:L, distant:Dd});
  dire('  cran '+(cran+1)+' ('+P.pt+' pt) :');
  dire('    PILOTE  '+P.px.toFixed(1)+' px · i='+P.i+'/'+P.nb+' suite='+P.suite+' · «'+P.act+'» · '+P.txt+' signes');
  dire('    LOCAL   '+L.px.toFixed(1)+' px · «'+L.act+'» · '+L.signes+' signes'+(L.rogne?' · ⚠ ROGNÉ ('+L.bas+'>'+L.h+')':''));
  dire('    DISTANT '+Dd.px.toFixed(1)+' px · «'+Dd.act+'» · '+Dd.signes+' signes'+(Dd.rogne?' · ⚠ ROGNÉ':''));
  dire('    accord LOCAL/DISTANT : '+((L.act===Dd.act && Math.abs(L.signes-Dd.signes)<=2)?'✔ même image':'✖ IMAGES DIFFÉRENTES'));
}

/* ── ③ SIMULATION DE LA VOIE (i) : poser le cran dans le moteur de la VUE ── */
dire('');
dire('— ③ VOIE (i) SIMULÉE : la vue distante reçoit le cran et se compose elle-même —');
for(const cran of [1,3,4]){
  const r = await distant.evaluate((c)=>{
    const W=document.getElementById('at-dr-iframe').contentWindow;
    const avant = W.ECRANS.length;
    W.iz = c;                                  /* le cran arrive du pilote */
    try{ W.rendre(); }catch(e){}               /* recompose : cale() + degorge éventuel */
    try{ W.envoie(); }catch(e){}
    const D=document.getElementById('ses-tab-toile').contentDocument;
    const t=D.getElementById('t');
    let bas=0; for(const el of t.children){ const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b; }
    const h=Math.round(t.getBoundingClientRect().height);
    return {cran:c+1, iz:W.iz, px:+getComputedStyle(t).fontSize.replace('px',''),
            ecransAvant:avant, ecransApres:W.ECRANS.length, i:W.i,
            signes:(t.textContent||'').replace(/\s+/g,' ').trim().length,
            bas:Math.round(bas), h:h, rogne:bas>h+4,
            cadreH:Math.round(document.getElementById('at-dr-iframe').getBoundingClientRect().height)};
  }, cran);
  dire('  cran '+r.cran+' posé dans la vue : police '+r.px.toFixed(1)+' px · écrans '+r.ecransAvant+' → '+r.ecransApres
     + ' · i='+r.i+' · '+r.signes+' signes · contenu '+r.bas+' px dans une boîte de '+r.h+' px'
     + (r.rogne?'   ⚠ ROGNÉ : la classe ne voit pas la fin':'   ✔ tient')
     + ' | cadre moteur de la vue : '+r.cadreH+' px de haut');
}

await pilote.screenshot({path:SORTIE+'-pilote.png'});
await local.screenshot({path:SORTIE+'-local.png'});
await distant.screenshot({path:SORTIE+'-distant.png'});
fs.writeFileSync(SORTIE+'-releve.json', JSON.stringify({boitePilote,boiteLocal,boiteDistant,crans},null,1));
fs.writeFileSync(SORTIE+'-journal.txt', journal.join('\n'));
dire('');
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length));
await s.fermer();
