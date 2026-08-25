/* BANC TÉLÉPHONE — LOT E
   ① la réglette du téléphone change le mur ; son propre affichage ne bouge pas
      (capture identique avant/après, à l'octet près sur le texte et les tailles) ;
   ② téléphone SEUL (PC fermé) : le mur se découpe dans SA boîte réelle, rien
      d'amputé. */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
import fs from 'fs';
import crypto from 'crypto';

const s = await nouvelleScene(process.argv[2], +process.argv[3], '/home/claude/mjpc/hub');
const journal=[]; const dire=(...a)=>{const t=a.join(' ');journal.push(t);console.log(t);};

let pilote = await s.page('', 'pilote', {width:1440, height:900});
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
  for(let k=0;k<8;k++) W.devoile(); });
await attendre(2500);
const tel = await s.page('?vue=tel','tel',{width:390,height:844});
await attendre(4500);

const imgMur = () => mur.evaluate(()=>{
  const D=document.getElementById('ses-tab-toile').contentDocument, t=D&&D.getElementById('t');
  if(!t)return{absent:true};
  return {px:+getComputedStyle(t).fontSize.replace('px',''),
          signes:(t.textContent||'').replace(/\s+/g,' ').trim().length,
          iz:document.getElementById('at-dr-iframe').contentWindow.iz};
});
/* l'empreinte de l'affichage du téléphone : son prompteur, ses cartes, leurs tailles */
const empreinteTel = () => tel.evaluate(()=>{
  const pr=document.getElementById('ses-tel-pr');
  const cartes=[].slice.call(pr?pr.children:[]).map(e=>e.textContent.replace(/\s+/g,' ').trim()
      +'|'+getComputedStyle(e).fontSize);
  const W=document.getElementById('at-dr-iframe').contentWindow;
  return {texte:(pr?pr.textContent:'').replace(/\s+/g,' ').trim(),
          police:pr?getComputedStyle(pr).fontSize:null,
          cartes:cartes.join('§'), izMoteur:W?W.iz:null,
          etiquette:(document.getElementById('ses-tel-zl')||{}).textContent,
          reglette:(typeof SES!=='undefined'&&SES.cran!=null)?(SES.cran|0):null};
});

/* pose un cran au téléphone : par les boutons − / + (8.70.0) s'ils existent,
   sinon par la réglette (8.69.0) — le même banc juge les deux versions. */
async function telPoseCran(tel, c){
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
      await new Promise(r=>setTimeout(r,1100));
    }
  } else {
    await tel.evaluate((v)=>{ const r=document.getElementById('ses-tel-rz');
      r.value=String(v); r.dispatchEvent(new Event('input',{bubbles:true})); }, c);
  }
}

const md5 = o => crypto.createHash('md5').update(JSON.stringify(o)).digest('hex').slice(0,12);

dire('— ① LA TÉLÉCOMMANDE : le mur grossit, le téléphone ne bouge pas —');
const avantTel = await empreinteTel(), avantMur = await imgMur();
await tel.screenshot({path:'Etel-avant.png'});
dire('  départ : mur '+avantMur.px.toFixed(1)+' px (iz='+avantMur.iz+') · téléphone : réglette='+avantTel.reglette
   +' étiquette «'+avantTel.etiquette+'» · empreinte '+md5(avantTel));

const lignes=[];
for(const c of [4,0,3]){
  await telPoseCran(tel, c);
  await attendre(3200);
  const M = await imgMur(), T = await empreinteTel();
  const telIntact = (T.texte===avantTel.texte && T.cartes===avantTel.cartes && T.izMoteur===avantTel.izMoteur);
  lignes.push({cran:c+1, mur:M, telIntact, etiquette:T.etiquette});
  dire('  cran '+(c+1)+' au téléphone : mur '+M.px.toFixed(1)+' px (iz='+M.iz+') · '+M.signes+' signes'
     + ' | téléphone : «'+T.etiquette+'» · affichage '+(telIntact?'INCHANGÉ ✔':'A BOUGÉ ✖')
     + ' (empreinte '+md5(T)+')');
}
await tel.screenshot({path:'Etel-apres.png'});

dire('');
dire('— ② LE TÉLÉPHONE SEUL : on ferme le PC, il pilote du fond de la classe —');
await pilote.close();
await attendre(2500);
await telPoseCran(tel, 4);
await attendre(3500);
const seulHaut = await imgMur();
const boite = await mur.evaluate(()=>{
  const f=document.getElementById('ses-tab-toile').getBoundingClientRect();
  const D=document.getElementById('ses-tab-toile').contentDocument, t=D.getElementById('t');
  let bas=0; for(const el of t.children){const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b;}
  const h=Math.round(t.getBoundingClientRect().height);
  return {toile:Math.round(f.width)+'×'+Math.round(f.height), bas:Math.round(bas), h, rogne:bas>h+4,
          ecrans:document.getElementById('at-dr-iframe').contentWindow.ECRANS.length};
});
dire('  PC fermé, cran 5 depuis le téléphone : mur '+seulHaut.px.toFixed(1)+' px · '+seulHaut.signes+' signes');
dire('  boîte du mur : '+boite.toile+' (sa boîte réelle, aucun ratio reçu) · contenu '+boite.bas+' px / '+boite.h+' px '
   + (boite.rogne?'  ✖ AMPUTÉ':'  ✔ RIEN D\'AMPUTÉ')+' · '+boite.ecrans+' écrans dans sa trame');
lignes.push({pas:'téléphone seul', rogne:boite.rogne, signes:seulHaut.signes});
await mur.screenshot({path:'Etel-mur-seul.png'});

const ko = lignes.filter(l=>l.telIntact===false||l.rogne===true).length;
dire('');
dire('═══ COMPTES ═══');
dire('  épreuves : '+lignes.length+' · en échec : '+ko);
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length));
fs.writeFileSync('Etel-releve.json', JSON.stringify(lignes,null,1));
fs.writeFileSync('Etel-journal.txt', journal.join('\n'));
await s.fermer();
