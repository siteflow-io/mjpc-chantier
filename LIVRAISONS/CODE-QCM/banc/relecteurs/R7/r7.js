const fs=require("fs"),D=__dirname;const O=require("../../outils");const R=require("../../relecteur-outils.js");
const {pause,texte,zoneTexte,cliquer,choisir,taper,cocherTout,choixOuverts,photo}=O;
const info=JSON.parse(fs.readFileSync(D+"/info.json"));const code=n=>info.eleves.find(e=>e.nom===n).code;
const L=(...a)=>{fs.appendFileSync(D+"/r7.log",a.join(" ")+"\n");};
let k=0;const cap=(p,id)=>photo(p,D+"/"+String(++k).padStart(2,"0")+"-"+id+".png");
(async()=>{const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
try{
const prof=await R.ouvrir(nav,info,"?mode=prof",1536,864);
await cliquer(prof,/^Pilotage$/);await cliquer(prof,/Pilotage classe/);await choisir(prof,/3 ESSAI/);await pause(200);await choisir(prof,/Évaluation d'essai/);await pause(300);
await cliquer(prof,/Lancer la séance/);await pause(500);
const garde=["ABRIAL Julien","BAUDRY Léa"];
for(const e of info.eleves) if(!garde.includes(e.nom)) await cliquer(prof,new RegExp(O.esc(e.nom)),undefined,{apres:30});
await cliquer(prof,/Lancer la séance/);await pause(1200);
const t=await R.ouvrir(nav,info,"?mode=eleve",1280,800);
if(/Choisis ta classe/.test(await texte(t)))await cliquer(t,/^3 ESSAI$/);await pause(300);
await cliquer(t,/2 élèves/);
const ent=async(c,nm)=>{const [N,...P]=nm.split(" ");await taper(t,c,"code",code(nm));await taper(t,c,"prenom",P.join(" ").toLowerCase());await taper(t,c,"nom",N.toLowerCase());await cliquer(t,/Entrer/,c);await pause(400);};
await ent("g",garde[0]);await ent("d",garde[1]);
for(const c of["g","d"]){await cocherTout(t,c);await cliquer(t,/^Je commence$/,c);}
await pause(800);await cap(t,"t-entres");L("T0",(await texte(t)).slice(0,300));
const tel=await R.ouvrir(nav,info,"?mode=prof&view=phone",390,844);
const rep={0:{g:["Rome"],d:["Rome"]},1:{g:["Madrid","Berlin"],d:["Madrid"]},2:null};
for(const qi of[0,1,2]){
 await cliquer(prof,new RegExp("Lancer Q"+(qi+1)+"\\b"));await pause(1500);
 await cliquer(prof,/Autoriser la réponse/);await pause(2500);
 for(const c of["g","d"]){const ch=(rep[qi]&&rep[qi][c])||null;
   if(ch){for(const x of ch)await cliquer(t,new RegExp("^"+O.esc(x)+"$"),c);}else{await cliquer(t,/^[A-Z]/,c);}  
   await cliquer(t,/Valider/,c);}
 await pause(500);if(qi===1)await cap(t,"t-q2");L("Q"+(qi+1),(await texte(t)).slice(0,400));
 for(let j=0;j<6;j++){if(!(await cliquer(prof,/Tour suivant/)))break;await pause(1500);}
 await cliquer(prof,/Clore la question/);await pause(1500);
}
await cliquer(prof,/Lancer l'autoévaluation/);await pause(800);
for(const c of["g","d"])await cliquer(t,/Maîtrise satisfaisante/,c);
await cliquer(prof,/Lancer la correction/);await pause(800);
for(const c of["g","d"]){await cocherTout(t,c);await cliquer(t,/^Je commence la correction$/,c);}
await pause(2000);await cliquer(prof,/Commencer la correction/);await pause(2000);
await cap(t,"t-corr");await cap(prof,"c-corr");
L("CORR-T",await texte(t));L("CORR-P",(await texte(prof)).slice(0,1500));

const bon={1:["Rome"],2:["Madrid","Berlin"],3:["8"]};
for(let r=0;r<3;r++){const tt=await texte(t);const q=+((tt.match(/QUESTION (\d)/)||[])[1]||0);
 for(const c of["g","d"]){const ch=(q===2&&c==="g")?["Madrid"]:bon[q]||[];for(const x of ch)await cliquer(t,new RegExp("^"+O.esc(x)+"$"),c);await cliquer(t,/Valider|C'est ça/,c);}
 await pause(1500);await cliquer(prof,/Révéler/);await pause(2000);
 if(q===2){await cap(t,"t-q2-revele");await cap(prof,"c-q2-revele");L("REV2-T",(await texte(t)).slice(0,1500));L("REV2-P",(await texte(prof)).slice(0,1500));}
 await cliquer(prof,/Question suivante|Terminer la correction|Fin de la correction/);await pause(1500);}
await cap(prof,"c-fin-corr");L("FIN-P",(await texte(prof)).slice(0,2000));L("FIN-T",(await texte(t)).slice(0,1500));

}catch(e){L("ERR",e.message);}
await nav.close();})();
