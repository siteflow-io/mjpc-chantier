/* BANC PHASE 0 — LOT F
   Trois pages : pilote PC + téléphone + mur. Le TÉLÉPHONE est la source, comme chez
   Paul. On suit `vues` et `rev` dans la scène ET dans chaque cadre, à chaque geste.
   ① le mur montre-t-il le morceau que le PC a sous les yeux ?
   ③ le dévoilement se perd-il quand le zoom bouge ? */
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
const mur = await s.page('?vue=tableau','mur',{width:1360,height:768});
await attendre(3500);
const tel = await s.page('?vue=tel','tel',{width:390,height:844});
await attendre(4500);

const etat = (page,quoi) => page.evaluate((q)=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const T=W.ECRANS||[];
  const e=T[W.i];
  const grp=e&&e.grp;
  const lot = grp ? T.map((x,k)=>({k,x})).filter(o=>o.x&&o.x.grp===grp) : [{k:W.i,x:e}];
  return {iz:W.iz, i:W.i, nb:T.length, suite:e?(e.suite||0):0, rev:e?e.rev:null,
    vuesEcran:e?(e.blocs||[]).map(b=>b.vues|0):null,
    morceaux: lot.map(o=>({rang:o.k, suite:o.x.suite||0,
      etapes:(o.x.blocs||[]).reduce((n,b)=>n+((b.etapes||[]).length),0),
      vues:(o.x.blocs||[]).reduce((n,b)=>n+(b.vues|0),0)})),
    totalVues: lot.reduce((n,o)=>n+(o.x.blocs||[]).reduce((m,b)=>m+(b.vues|0),0),0),
    totalEtapes: lot.reduce((n,o)=>n+(o.x.blocs||[]).reduce((m,b)=>m+((b.etapes||[]).length),0),0)};
}, quoi);
const projete = (page,dans) => page.evaluate((d)=>{
  const D = d ? document.getElementById('ses-tab-toile').contentDocument : document;
  const t=D.getElementById('t'); if(!t)return{absent:true};
  const txt=(t.textContent||'').replace(/\s+/g,' ').trim();
  const et=[]; for(let k=1;k<=6;k++) if(txt.indexOf('Étape '+k+' ')>=0) et.push(k);
  return {signes:txt.length, etapesVisibles:et};
}, dans);
const scene = () => lire(s.hub.store,'site/3e/chapitres/0/seances/0/deroule_joue/'+(ctx&&ctx.classeSlug)+'/scene');
const cadreTel = () => tel.evaluate(()=>{
  const f=document.getElementById('at-dr-iframe'); const r=f.getBoundingClientRect();
  const W=f.contentWindow; const e=(W.ECRANS||[])[W.i];
  return {cadre:Math.round(r.width)+'×'+Math.round(r.height), iz:W.iz, i:W.i, nb:(W.ECRANS||[]).length,
    vues:(e&&e.blocs||[]).map(b=>b.vues|0)};
});

const releve = async (nom) => {
  await attendre(2600);
  const P=await etat(pilote), M=await etat(mur), T=await cadreTel();
  const VP=await projete(pilote,false).catch(()=>({})), VM=await projete(mur,true);
  const sc=scene();
  const l={pas:nom, pilote:P, mur:M, tel:T, murProjete:VM,
    scene: sc?{ecran:sc.ecran, morceau:sc.morceau, rev:sc.rev, vues:sc.vues, iz:sc.iz, ratio:sc.ratio, origine:sc.origine}:null};
  dire('  ['+nom+']');
  dire('    scène   : morceau='+(l.scene?l.scene.morceau:'—')+' rev='+(l.scene?l.scene.rev:'—')
     +' vues='+JSON.stringify(l.scene?l.scene.vues:null)+' iz='+(l.scene?l.scene.iz:'—')
     +' ratio='+(l.scene?l.scene.ratio:'—'));
  dire('    PILOTE  : iz='+P.iz+' i='+P.i+'/'+P.nb+' morceau='+P.suite
     +' · découpe '+JSON.stringify(P.morceaux.map(m=>m.etapes))+' vues '+JSON.stringify(P.morceaux.map(m=>m.vues))
     +' · TOTAL vues='+P.totalVues+'/'+P.totalEtapes);
  dire('    MUR     : iz='+M.iz+' i='+M.i+'/'+M.nb+' morceau='+M.suite
     +' · découpe '+JSON.stringify(M.morceaux.map(m=>m.etapes))+' vues '+JSON.stringify(M.morceaux.map(m=>m.vues))
     +' · TOTAL vues='+M.totalVues+'/'+M.totalEtapes);
  dire('    TÉL     : cadre '+T.cadre+' iz='+T.iz+' i='+T.i+'/'+T.nb+' vues='+JSON.stringify(T.vues));
  dire('    AU MUR  : étapes visibles '+JSON.stringify(VM.etapesVisibles)+' ('+VM.signes+' signes)');
  return l;
};

/* pose un cran au téléphone : par les boutons - / + s'ils existent (8.70.0),
   sinon par la réglette (8.69.0) — le même banc juge les deux versions. */
async function telCran(c){
  const parBoutons = await tel.evaluate(()=>!!document.getElementById('ses-tel-zplus'));
  if(parBoutons){
    for(let k=0;k<14;k++){
      const fait = await tel.evaluate((cible)=>{
        const cur=(typeof SES!=='undefined'&&SES.cran!=null)?(SES.cran|0):1;
        if(cur===cible)return true;
        const b=document.getElementById(cur<cible?'ses-tel-zplus':'ses-tel-zmoins');
        if(b&&!b.disabled)b.click();
        return false;
      }, c);
      if(fait)break;
      await attendre(1100);
    }
  } else {
    await tel.evaluate((v)=>{ const r=document.getElementById('ses-tel-rz');
      r.value=String(v); r.dispatchEvent(new Event('input',{bubbles:true})); }, c);
  }
}
const lignes=[];
dire('— ① LE TÉLÉPHONE DÉVOILE TOUT (comme Paul) —');
/* on dévoile jusqu'aux 6 étapes, SANS dépasser l'écran 1 : un clic de trop et le
   banc mesurerait un autre écran (piège attrapé au banc). */
for(let k=0;k<14;k++){
  const fini = await pilote.evaluate(()=>{
    const W=document.getElementById('at-dr-iframe').contentWindow;
    if(W.i!==0)return 'depasse';
    const b=(W.ECRANS[0].blocs||[])[0];
    return ((b&&(b.vues|0))>=6)?'ok':'';
  });
  if(fini)break;
  await tel.evaluate(()=>{ const b=[].slice.call(document.querySelectorAll('#ses-tel-pal .ses-pb'))
    .filter(x=>/dévoil|devoil|▶/i.test(x.textContent))[0]; if(b)b.click(); });
  await attendre(900);
}
lignes.push(await releve('tout dévoilé au téléphone'));

dire('');
dire('— ② ZOOM AU CRAN 5 DEPUIS LE TÉLÉPHONE —');
await telCran(4);
lignes.push(await releve('cran 5 (source téléphone)'));

dire('');
dire('— ③ ON REBOUGE LE ZOOM (cran 3), puis ON DÉZOOME (cran 1) —');
await telCran(2);
lignes.push(await releve('cran 3'));
await telCran(0);
lignes.push(await releve('cran 1 — dézoom complet'));

const depart=lignes[0], fin=lignes[lignes.length-1];
dire('');
dire('═══ CONSTATS ═══');
dire('  ① le mur montre-t-il le morceau du PC ?');
lignes.forEach(l=>{ if(l.pilote.morceaux.length>1||l.mur.morceaux.length>1)
  dire('     ['+l.pas+'] PC sur morceau '+l.pilote.suite+' · MUR sur morceau '+l.mur.suite
     +' · au mur : étapes '+JSON.stringify(l.murProjete.etapesVisibles)
     +(l.pilote.suite===l.mur.suite?'   ✔ même morceau':'   ✖ MORCEAUX DIFFÉRENTS')); });
dire('  ③ le dévoilement se perd-il ?');
dire('     départ : PC '+depart.pilote.totalVues+'/'+depart.pilote.totalEtapes
   +' · MUR '+depart.mur.totalVues+'/'+depart.mur.totalEtapes+' · scène vues '+JSON.stringify(depart.scene&&depart.scene.vues));
dire('     après zoom/dézoom : PC '+fin.pilote.totalVues+'/'+fin.pilote.totalEtapes
   +' · MUR '+fin.mur.totalVues+'/'+fin.mur.totalEtapes+' · scène vues '+JSON.stringify(fin.scene&&fin.scene.vues));
dire('     → '+((fin.pilote.totalVues>=depart.pilote.totalVues && fin.mur.totalVues>=depart.mur.totalVues)
  ?'RIEN N\'EST REVOILÉ':'✖ REVOILAGE : le dévoilement a reculé'));
dire('');
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length));
await mur.screenshot({path:'F0-mur.png'}); await pilote.screenshot({path:'F0-pilote.png'});
fs.writeFileSync('F0-releve.json', JSON.stringify(lignes,null,1));
fs.writeFileSync('F0-journal.txt', journal.join('\n'));
await s.fermer();
