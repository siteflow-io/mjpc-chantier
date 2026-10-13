const pw=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});const p=await nav.newPage({viewport:{width:1536,height:864}});
for(const id of process.argv.slice(2)){await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene="+id);await p.reload();await p.waitForTimeout(700);
await p.screenshot({path:"cap/maq-"+id+".png",fullPage:true});
const t=await p.evaluate(()=>document.body.innerText);console.log("=====",id,"\n",t.replace(/\n\s*\n/g,"\n").slice(-1500));}
await nav.close();})();
