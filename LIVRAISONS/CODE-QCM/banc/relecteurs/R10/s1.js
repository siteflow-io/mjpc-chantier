const R=require("./relecteur-outils.js");const info=JSON.parse(require("fs").readFileSync("info.json"));
const btns=async p=>(await p.locator("button:visible").allInnerTexts()).map(s=>s.trim().replace(/\s+/g," ")).filter(Boolean).join(" | ");
(async()=>{const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const c=await R.ouvrir(nav,info,"?mode=prof",1536,864);await c.waitForTimeout(1000);
console.log("C0",await btns(c));
for(const t of ["Pilotage","🎯 Pilotage classe"]){try{await c.getByText(t,{exact:false}).first().click({timeout:2000});await c.waitForTimeout(500);console.log(t,"->",await btns(c));}catch(e){console.log("x",t)}}
await c.screenshot({path:"cap/s1-console.png"});
console.log((await c.evaluate(()=>document.body.innerText)).slice(0,1500));
await nav.close();})();
