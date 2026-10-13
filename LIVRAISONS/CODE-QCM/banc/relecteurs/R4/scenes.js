const pw=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});const p=await nav.newPage();
await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html");await p.waitForTimeout(1500);
const l=await p.evaluate(()=>JSON.stringify(window.LISTE_SCENES));console.log(JSON.parse(l).map(s=>s.n+" "+s.id+" ["+s.appareil+"] "+s.titre).join("\n"));await nav.close();})();
