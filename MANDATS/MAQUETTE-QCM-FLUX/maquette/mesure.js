const path=require("path");const {chromium}=require(path.join(__dirname,"../banc/node_modules/playwright"));
(async()=>{const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const p=await b.newPage({viewport:{width:1280,height:800}});
for(const id of ["t-annexe","t-bilan","t-corr-q2-apres","t-attest","t-q1-tour1"]){
 await p.goto("file://"+path.join(__dirname,"maquette.html")+"#scene="+id);await p.waitForTimeout(200);
 const r=await p.evaluate(()=>Array.from(document.querySelectorAll(".moitie .eleve-card")).map(c=>Math.round(c.getBoundingClientRect().bottom)));
 const f=await p.evaluate(()=>{const b=document.querySelector(".moitie .eleve-choix-btn");return b?getComputedStyle(b).fontSize:null});
 console.log(id,"bas des cartes :",r.join(" / "),"px sur 800 ; police des choix :",f);}
await b.close();})();
