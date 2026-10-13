const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");const info=require("./info.json");
const pw=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const p=await R.ouvrir(nav,info,"?mode=prof",1536,864);
await p.screenshot({path:"cap/app-console0.png"});console.log((await p.evaluate(()=>document.body.innerText)).slice(0,2500));
console.log(p.__erreurs);await nav.close();})();
