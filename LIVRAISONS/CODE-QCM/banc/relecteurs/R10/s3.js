const R=require("./relecteur-outils.js");const info=JSON.parse(require("fs").readFileSync("info.json"));
const fs=require("fs");
const btns=async p=>(await p.locator("button:visible").allInnerTexts()).map(s=>s.trim().replace(/\s+/g," ")).filter(Boolean).join(" | ");
const txt=async p=>(await p.evaluate(()=>document.body.innerText)).replace(/\n\s*\n/g,"\n");
const tryc=async(p,re,ms=1500)=>{try{await p.getByRole("button",{name:re}).last().click({timeout:ms});await p.waitForTimeout(400);return true}catch(e){return false}};
(async()=>{const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const c=await R.ouvrir(nav,info,"?mode=prof",1536,864);await c.waitForTimeout(800);
const s=c.locator("select");for(let i=0;i<await s.count();i++){try{await s.nth(i).selectOption({label:"Évaluation d'essai — 3 questions"},{timeout:500})}catch(e){}}
await tryc(c,/Lancer la séance/);
console.log("C0",await btns(c));await tryc(c,/ZELLER Lou/);
await tryc(c,/Lancer la séance/);await c.waitForTimeout(1000);
console.log("C",await btns(c));await c.screenshot({path:"cap/s3-console.png"});
const t1=await R.ouvrir(nav,info,"?mode=eleve",1280,800);await t1.waitForTimeout(1000);
console.log("T1",await btns(t1));console.log((await txt(t1)).slice(0,600));console.log("INPUTS",await t1.locator("input:visible").count());await t1.screenshot({path:"cap/s3-tab1.png"});
console.log("ERR",c.__erreurs,t1.__erreurs);
await nav.close();})();
