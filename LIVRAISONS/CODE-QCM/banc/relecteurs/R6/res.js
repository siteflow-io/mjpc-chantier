const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");const info=require("./info.json");
const pw=require("/opt/node22/lib/node_modules/playwright");
const txt=async p=>(await p.evaluate(()=>document.body.innerText)).replace(/\n\s*\n/g,"\n");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
let c=await R.ouvrir(nav,info,"?mode=prof",1536,864);await c.waitForTimeout(800);
let t=await txt(c); console.log("CONSOLE:",t.slice(t.indexOf("📚")));
await c.getByRole("button",{name:"Données",exact:true}).click();await c.waitForTimeout(900);
await c.getByRole("button",{name:/Ouvrir/}).first().click();await c.waitForTimeout(1000);await c.screenshot({path:"cap/app-tableau-seance.png",fullPage:true});
t=await txt(c); console.log("DONNEES:",t.slice(150,1800)); console.log("ERR",c.__erreurs);await nav.close();})();
