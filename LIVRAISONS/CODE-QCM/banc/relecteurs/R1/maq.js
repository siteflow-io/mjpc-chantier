(async()=>{
const ids="c-accueil c-lancer c-appel t-combien t-login t-binome t-rejoins t-attest-1 t-attest-2 t-pret c-pret t-q1-reflexion c-q1-reflexion t-q1-passage1 t-q1-tour1 c-q1-tour1 p-reponse b-reponse t-q1-passage2 t-q1-tour2 t-q1-b-michel c-q1-tour2 t-q1-attente c-q1-close t-q2-reflexion t-q2-tour1 c-q2-tour2 c-q2-close c-rouvrir-un t-rouvrir-un p-eleve t-q3-tour1 x610-1-b-julien c-q3-close".split(" ");
const nav = await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
const p = await nav.newPage({viewport:{width:1536,height:864}});
const fs=require("fs");
for(const id of ids){
 await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene="+id);
 await p.reload(); await p.waitForTimeout(700);
 const t = await p.evaluate(()=>document.body.innerText);
 fs.writeFileSync("maq/"+id+".txt", t);
 await p.screenshot({path:"maq/"+id+".png"});
}
await nav.close();})();
