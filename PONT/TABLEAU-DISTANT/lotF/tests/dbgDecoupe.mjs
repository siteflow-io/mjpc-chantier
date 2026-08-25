/* pourquoi le mur découpe [2,1,3] là où le PC découpe [3,3] ?
   On mesure la MÊME matière dans les deux gabarits : le cadre (moteur) et la toile. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
const s = await nouvelleScene(process.argv[2], +process.argv[3], '/home/claude/mjpc/hub');
const p = await s.page('', 'pilote', {width:1440,height:900});
await attendre(1400); await amorcer(p);
await cliquerSel(p,'#tprof-btn',900); await cliquerTexte(p,'button.tprof-section-btn','Atelier',2200);
await cliquerTexte(p,'button.at-onglet','Mes chapitres',1300); await cliquerTexte(p,'button','Modifier',2200);
await cliquerTexte(p,'button.at-onglet','Déroulé',2500); await cliquerTexte(p,'button','Lancer la séance',3000);
await attendre(1500);
const mur = await s.page('?vue=tableau','mur',{width:1360,height:768});
await attendre(3500);
for(let k=0;k<14;k++){
  const f = await p.evaluate(()=>{const W=document.getElementById('at-dr-iframe').contentWindow;
    if(W.i!==0)return 'x'; const b=(W.ECRANS[0].blocs||[])[0]; return ((b&&(b.vues|0))>=6)?'ok':'';});
  if(f)break;
  await p.evaluate(()=>{document.getElementById('at-dr-iframe').contentWindow.devoile();});
  await attendre(400);
}
await p.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value='4'; rz.dispatchEvent(new W.Event('input',{bubbles:true})); });
await attendre(4500);
const r = await mur.evaluate(()=>{
  const f=document.getElementById('at-dr-iframe'), W=f.contentWindow;
  const cb=f.getBoundingClientRect();
  const c=W.document.getElementById('contenu');
  const D=document.getElementById('ses-tab-toile').contentDocument, t=D.getElementById('t');
  const mesure=(root)=>{let bas=0;for(const el of root.children){const b=el.offsetTop+el.offsetHeight;if(b>bas)bas=b;}return Math.round(bas);};
  const gapT=(()=>{const x=D.querySelector('.cons');return x?getComputedStyle(x).gap:'—';})();
  const gapC=(()=>{const x=W.document.querySelector('.cons');return x?getComputedStyle(x).gap:'—';})();
  const liT=(()=>{const x=D.querySelector('.etapes li');return x?getComputedStyle(x).marginBottom+'/'+getComputedStyle(x).lineHeight:'—';})();
  const liC=(()=>{const x=W.document.querySelector('.etapes li');return x?getComputedStyle(x).marginBottom+'/'+getComputedStyle(x).lineHeight:'—';})();
  return {cadre:Math.round(cb.width)+'×'+Math.round(cb.height),
    contenuCadre:Math.round(c.clientWidth)+'×'+Math.round(c.clientHeight), policeCadre:getComputedStyle(c).fontSize,
    hauteurRendueCadre:mesure(c),
    toile:Math.round(t.getBoundingClientRect().width)+'×'+Math.round(t.getBoundingClientRect().height),
    policeToile:getComputedStyle(t).fontSize, hauteurRendueToile:mesure(t),
    gapCadre:gapC, gapToile:gapT, liCadre:liC, liToile:liT,
    recoupes:(typeof SES!=='undefined'?(SES.__recoupes|0):-1),
    ecrans:W.ECRANS.length, decoupe:W.ECRANS.filter(x=>x.grp===W.ECRANS[0].grp).map(x=>(x.blocs||[]).reduce((n,b)=>n+((b.etapes||[]).length),0))};
});
console.log(JSON.stringify(r,null,1));
const P = await p.evaluate(()=>{const W=document.getElementById('at-dr-iframe').contentWindow;
  const c=W.document.getElementById('contenu');
  return {contenu:Math.round(c.clientWidth)+'×'+Math.round(c.clientHeight), police:getComputedStyle(c).fontSize,
    decoupe:W.ECRANS.filter(x=>x.grp===W.ECRANS[0].grp).map(x=>(x.blocs||[]).reduce((n,b)=>n+((b.etapes||[]).length),0))};});
console.log('PILOTE :', JSON.stringify(P));
await s.fermer();
