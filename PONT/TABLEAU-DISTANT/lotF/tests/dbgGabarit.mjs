/* LE MÊME morceau, rendu dans les DEUX gabarits, en proportion de leur boîte.
   Si la toile rend plus haut que le cadre à proportion égale, le morceau que le
   professeur voit ne peut pas tenir au mur — et « tel quel » se heurte à
   « rien ne dépasse ». */
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
  const f=await p.evaluate(()=>{const W=document.getElementById('at-dr-iframe').contentWindow;
    if(W.i!==0)return 'x'; const b=(W.ECRANS[0].blocs||[])[0]; return ((b&&(b.vues|0))>=6)?'ok':'';});
  if(f)break;
  await p.evaluate(()=>{document.getElementById('at-dr-iframe').contentWindow.devoile();});
  await attendre(400);
}
await attendre(2500);
/* au cran 1, écran entier (6 étapes) : on mesure la MÊME matière des deux côtés */
const r = await mur.evaluate(()=>{
  const f=document.getElementById('at-dr-iframe'), W=f.contentWindow;
  const c=W.document.getElementById('contenu');
  const D=document.getElementById('ses-tab-toile').contentDocument, t=D.getElementById('t');
  const h=(root)=>{let bas=0;for(const el of root.children){const b=el.offsetTop+el.offsetHeight;if(b>bas)bas=b;}return Math.round(bas);};
  const hc=h(c), ht=h(t);
  const bc=c.clientHeight, bt=Math.round(t.getBoundingClientRect().height);
  return {cadre:{rendu:hc, boite:bc, taux:+(hc/bc).toFixed(3), police:+getComputedStyle(c).fontSize.replace('px','')},
          toile:{rendu:ht, boite:bt, taux:+(ht/bt).toFixed(3), police:+getComputedStyle(t).fontSize.replace('px','')},
          contenuIdentique:(c.textContent||'').replace(/\s+/g,'').length+' vs '+(t.textContent||'').replace(/\s+/g,'').length};
});
console.log('  CADRE (gabarit moteur) : rendu '+r.cadre.rendu+' / boîte '+r.cadre.boite+' px = '+r.cadre.taux+' · police '+r.cadre.police);
console.log('  TOILE (gabarit tableau): rendu '+r.toile.rendu+' / boîte '+r.toile.boite+' px = '+r.toile.taux+' · police '+r.toile.police);
console.log('  signes rendus (cadre vs toile) : '+r.contenuIdentique);
console.log('  → la toile rend '+(+(r.toile.taux/r.cadre.taux).toFixed(3))+'× la hauteur du cadre, à contenu et proportion égaux');
await s.fermer();
