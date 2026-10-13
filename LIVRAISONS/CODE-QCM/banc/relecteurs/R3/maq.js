const pw=require("/opt/node22/lib/node_modules/playwright");
const ids=process.argv.slice(2);
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
for(const id of ids){const p=await nav.newPage({viewport:{width:1536,height:864}});
await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene="+id);await p.waitForTimeout(1200);
await p.screenshot({path:"maq/"+id+".png"});
const t=await p.evaluate(()=>document.body.innerText);require("fs").writeFileSync("maq/"+id+".txt",t);await p.close();}
await nav.close();})();
