const pw=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});const p=await nav.newPage();
await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html");await p.waitForTimeout(800);
const l=await p.evaluate(()=>window.LISTE_SCENES);console.log(JSON.stringify(l).slice(0,6000));await nav.close();})();
