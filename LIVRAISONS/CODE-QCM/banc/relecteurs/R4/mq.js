const pw=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
for(const id of process.argv.slice(2)){const p=await nav.newPage({viewport:{width:1536,height:900}});
await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene="+id);await p.waitForTimeout(1200);
await p.screenshot({path:"cap/maq-"+id+".png"});
const t=await p.evaluate(()=>document.body.innerText);console.log("=== "+id+"\n"+t.replace(/\n\s*\n/g,"\n").slice(0,2500));await p.close();}
await nav.close();})();
