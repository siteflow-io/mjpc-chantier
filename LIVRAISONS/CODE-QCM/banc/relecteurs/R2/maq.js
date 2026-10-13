const pw=require("/opt/node22/lib/node_modules/playwright");
const M="file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
const ids=process.argv.slice(2);
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const p=await (await nav.newContext({viewport:{width:1536,height:900}})).newPage();
for(const id of ids){await p.goto(M+"#scene="+id);await p.waitForTimeout(500);
const t=await p.evaluate(()=>document.body.innerText);
require("fs").writeFileSync("maq/"+id+".txt",t);await p.screenshot({path:"maq/"+id+".png",fullPage:true});}
await nav.close();})();
