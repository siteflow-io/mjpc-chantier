const pw=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const M="file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
const p=await nav.newPage({viewport:{width:1536,height:864}});
for(const s of ["x610-9-telephone-alerte","p-reponse","p-autonomie","p-corr-avant","p-corr-apres","p-eleve","b-reponse","b-recopie","b-correction"]){
 await p.goto(M+"#scene="+s);await p.waitForTimeout(700);
 await p.screenshot({path:"cap/maq-"+s+".png"});
 const t=await p.evaluate(()=>document.body.innerText);
 console.log("=====",s,"\n",t.slice(0,900));}
await nav.close();})();
