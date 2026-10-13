const {chromium}=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});const p=await nav.newPage({viewport:{width:1536,height:864}});
for(const s of process.argv.slice(2)){await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene="+s);await p.reload();await p.waitForTimeout(500);
await p.screenshot({path:"cap/maq-"+s+".png"});const t=await p.evaluate(()=>document.body.innerText);console.log("=====",s,"\n",t.replace(/\n\s*\n/g,"\n").slice(0,2200));}
await nav.close();})();
