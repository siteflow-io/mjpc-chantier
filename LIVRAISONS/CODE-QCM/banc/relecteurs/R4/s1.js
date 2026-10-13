const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");const info=require("./info.json");
(async()=>{const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const p=await R.ouvrir(nav,info,"?mode=prof",1536,864);
console.log((await p.evaluate(()=>document.body.innerText)).slice(0,3000));await p.screenshot({path:"cap/01-console.png"});console.log(p.__erreurs);await nav.close();})();
