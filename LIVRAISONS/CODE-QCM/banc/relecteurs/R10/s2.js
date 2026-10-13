const R=require("./relecteur-outils.js");const info=JSON.parse(require("fs").readFileSync("info.json"));
const btns=async p=>(await p.locator("button:visible").allInnerTexts()).map(s=>s.trim().replace(/\s+/g," ")).filter(Boolean).join(" | ");
const txt=async p=>(await p.evaluate(()=>document.body.innerText)).replace(/\n\s*\n/g,"\n");
(async()=>{const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const c=await R.ouvrir(nav,info,"?mode=prof",1536,864);await c.waitForTimeout(800);
try{await c.getByText("Évaluation d'essai — 3 questions").first().click({timeout:2000});}catch(e){const s=c.locator("select");for(let i=0;i<await s.count();i++){try{await s.nth(i).selectOption({label:"Évaluation d'essai — 3 questions"},{timeout:500})}catch(e){}}}
await c.getByRole("button",{name:/Lancer la séance/}).click();await c.waitForTimeout(800);
console.log("APPEL",await btns(c));await c.screenshot({path:"cap/s2-appel.png"});
console.log((await txt(c)).slice(0,1500));console.log("ERR",c.__erreurs);
await nav.close();})();
