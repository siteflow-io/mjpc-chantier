const pw=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});const p=await nav.newPage({viewport:{width:1536,height:864}});
for(const s of process.argv.slice(2)){await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene="+s);await p.waitForTimeout(700);
const t=await p.evaluate(()=>document.body.innerText);console.log("=== "+s+"\n"+t.replace(/\n\s*\n/g,"\n").slice(0,1200));}
await nav.close();})();
