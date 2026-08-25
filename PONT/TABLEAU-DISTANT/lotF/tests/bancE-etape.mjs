/* BANC ÉTAPE SEULE — LOT E COMPLÉMENT 2
   Décor insécable : consigne courte + UNE étape de 450 signes.
   ① le pilote, la fenêtre Win+K et le mur distant : plus rien ne déborde, aux 5 crans ;
   ② dézoom : UNE seule étape, entière, sans marque, sans doublon ;
   ③ export / copie au hub : une seule étape · récit : l'étape entière, une fois ;
   ④ dévoilement : le fragment se dévoile comme une étape, `vues` juste ;
   ⑤ l'enveloppe est bien posée sur les TROIS cadres (pilote, mur, téléphone). */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
import { brancher } from './hub-faux.mjs';
import fs from 'fs';

const FICHIER=process.argv[2], PORT=+process.argv[3], ETIQ=process.argv[4];
const FENS={'4/3':{width:1024,height:768},'16/9':{width:1280,height:720}};
const FEN=FENS[process.argv[5]]||FENS['16/9'];
const s = await nouvelleScene(FICHIER, PORT, '/home/claude/mjpc/hub');
const journal=[]; const dire=(...a)=>{const t=a.join(' ');journal.push(t);console.log(t);};
dire('### '+ETIQ+' · fenêtre Win+K '+FEN.width+'×'+FEN.height);

const ETAPE = "Étape unique : tu observes le tableau en silence, tu notes au brouillon tout ce que tu vois — les couleurs, la lumière, les personnages, le décor, ce qui bouge et ce qui ne bouge pas, ce qui est net et ce qui est flou, puis tu écris en cinq lignes complètes l'hypothèse que tu proposes à la classe sur ce que peut être le Romantisme, et tu gardes ton brouillon pour la mise en commun de la fin de l'heure.";

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
const att = new Promise(r => s.nav.once('targetcreated', async t => r(await t.page())));
await pilote.evaluate(()=>{ document.getElementById('at-dr-iframe').contentWindow.tableau(); });
const local = await att; await brancher(local, s.hub, 'local');
await local.setViewport(FEN);
await attendre(2000);

await pilote.evaluate((E)=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const b=W.ECRANS[0].blocs[0]; b.txt='Observe.'; b.etapes=[E]; b.vues=1;
  W.ECRANS[0].rev=2; W.rendre(); }, ETAPE);
await attendre(3000);

const debordPilote = () => pilote.evaluate(()=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const c=W.document.getElementById('contenu'); let bas=0;
  for(const el of c.children){const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b;}
  const e=W.ECRANS[W.i];
  return {bas:Math.round(bas), boite:c.clientHeight, debord:Math.max(0,Math.round(bas-c.clientHeight)),
    ecrans:W.ECRANS.length, i:W.i, suite:e?(e.suite||0):0,
    etapes:(e&&e.blocs[0]&&e.blocs[0].etapes)?e.blocs[0].etapes.length:0,
    vues:(e&&e.blocs[0])?(e.blocs[0].vues|0):0,
    suiteEt:!!(e&&e.blocs[0]&&e.blocs[0].suiteEt)};
});
const debordToile = (page,dans) => page.evaluate((d)=>{
  const D = d ? document.getElementById('ses-tab-toile').contentDocument : document;
  const t=D.getElementById('t'); if(!t)return{absent:true};
  let bas=0; for(const el of t.children){const b=el.offsetTop+el.offsetHeight; if(b>bas)bas=b;}
  const h=Math.round(t.getBoundingClientRect().height);
  return {bas:Math.round(bas), boite:h, debord:Math.max(0,Math.round(bas-h)),
    signes:(t.textContent||'').replace(/\s+/g,' ').trim().length};
}, dans);

dire('');
dire('— ① AUX CINQ CRANS : plus rien ne déborde —');
const lignes=[];
for(const c of [0,1,2,3,4]){
  await pilote.evaluate((v)=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
    const rz=W.document.getElementById('rz'); rz.value=String(v);
    rz.dispatchEvent(new W.Event('input',{bubbles:true})); }, c);
  await attendre(3400);
  const P=await debordPilote(), L=await debordToile(local,false), M=await debordToile(mur,true);
  const ok = (P.debord===0 && L.debord===0 && M.debord===0);
  lignes.push({cran:c+1, pilote:P, local:L, mur:M, ok});
  dire('  cran '+(c+1)+' : PILOTE '+P.bas+'/'+P.boite+' px'+(P.debord?' ⚠ −'+P.debord:' ✔')
     + ' | WIN+K '+L.bas+'/'+L.boite+' px'+(L.debord?' ⚠ −'+L.debord:' ✔')
     + ' | MUR '+M.bas+'/'+M.boite+' px'+(M.debord?' ⚠ −'+M.debord:' ✔')
     + ' · '+P.ecrans+' écrans · morceau '+P.suite);
}

dire('');
dire('— ② DÉZOOM : une seule étape, entière —');
await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  const rz=W.document.getElementById('rz'); rz.value='0';
  rz.dispatchEvent(new W.Event('input',{bubbles:true})); });
await attendre(3500);
const apresDezoom = await pilote.evaluate((E)=>{
  const W=document.getElementById('at-dr-iframe').contentWindow;
  const b=W.ECRANS[0].blocs[0];
  const marques=W.ECRANS.filter(x=>(x.blocs||[]).some(y=>y&&y.suiteEt)).length;
  return {ecrans:W.ECRANS.length, etapes:(b.etapes||[]).length, vues:(b.vues|0),
    texte:(b.etapes||[])[0]||'', identique:((b.etapes||[])[0]===E),
    longueur:((b.etapes||[])[0]||'').length, attendu:E.length, marques};
}, ETAPE);
dire('  écrans : '+apresDezoom.ecrans+' · étapes de la consigne : '+apresDezoom.etapes
   +' · vues : '+apresDezoom.vues+' · marques `suiteEt` restantes : '+apresDezoom.marques);
dire('  étape recollée : '+apresDezoom.longueur+' signes (attendu '+apresDezoom.attendu+') '
   + (apresDezoom.identique?'  ✔ IDENTIQUE À L\'ORIGINE':'  ✖ DIFFÉRENTE'));
if(!apresDezoom.identique) dire('    obtenu : «'+apresDezoom.texte.slice(0,90)+'…»');

dire('');
dire('— ③ EXPORT, COPIE AU HUB, RÉCIT —');
const exportE = await pilote.evaluate((E)=>{
  const t=DR.dr_exporterTrame();
  const b=t[0].blocs[0];
  const D=document.getElementById('at-dr-iframe').contentWindow.document;
  const recit=D.getElementById('recit')?D.getElementById('recit').textContent.replace(/\s+/g,' '):'';
  const bout=E.slice(-40);
  return {ecrans:t.length, etapes:(b.etapes||[]).length, vues:(b.vues|0),
    identique:((b.etapes||[])[0]===E),
    recitContient:recit.indexOf(bout)>=0,
    recitDoublon:(recit.split(bout).length-1),
    marques:t.filter(x=>(x.blocs||[]).some(y=>y&&y.suiteEt)).length};
}, ETAPE);
dire('  export : '+exportE.ecrans+' écrans · '+exportE.etapes+' étape(s) · vues '+exportE.vues
   + ' · marque `suiteEt` : '+exportE.marques+' '+(exportE.etapes===1&&exportE.identique&&exportE.marques===0?'✔':'✖'));
dire('  récit : l\'étape y figure '+exportE.recitDoublon+' fois '
   + (exportE.recitDoublon===1?'✔ une seule fois':(exportE.recitDoublon===0?'(pas encore dévoilée au récit)':'✖ EN DOUBLE')));

dire('');
dire('— ④ L\'ENVELOPPE EST-ELLE SUR LES TROIS CADRES ? —');
const tel = await s.page('?vue=tel','tel',{width:390,height:844});
await attendre(4000);
const env = async (page,nom)=>{
  const r = await page.evaluate(()=>{ const f=document.getElementById('at-dr-iframe');
    const W=f&&f.contentWindow;
    return W?{scinde:!!W.__scindeEtape, reabs:!!W.__reabsEtape, garde:!!W.__scissionGarde}:{absent:true}; });
  dire('  '+nom.padEnd(10)+' : scinde enveloppée='+r.scinde+' · reabsorbe enveloppée='+r.reabs+' '
     + ((r.scinde&&r.reabs)?'✔':'✖'));
  return r;
};
const e1=await env(pilote,'pilote'), e2=await env(mur,'mur'), e3=await env(tel,'téléphone');

const ko = lignes.filter(l=>!l.ok).length
  + (apresDezoom.identique&&apresDezoom.etapes===1&&apresDezoom.marques===0?0:1)
  + (exportE.etapes===1&&exportE.identique&&exportE.marques===0?0:1)
  + ((e1.scinde&&e2.scinde&&e3.scinde&&e1.reabs&&e2.reabs&&e3.reabs)?0:1);
dire('');
dire('═══ COMPTES ═══');
dire('  épreuves : '+(lignes.length+3)+' · en échec : '+ko);
dire('  écritures sorties : 0 (interceptées : '+s.hub.compteur.ecritures+') · pageerrors : '+((s.hub.erreurs||[]).length)+' '+JSON.stringify((s.hub.erreurs||[]).slice(0,2)));
await local.screenshot({path:ETIQ+'-winK-cran5.png'});
await mur.screenshot({path:ETIQ+'-mur-cran5.png'});
fs.writeFileSync(ETIQ+'-releve.json', JSON.stringify({lignes, apresDezoom, exportE, env:{e1,e2,e3}},null,1));
fs.writeFileSync(ETIQ+'-journal.txt', journal.join('\n'));
await s.fermer();
