const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");const info=JSON.parse(require("fs").readFileSync(__dirname+"/info.json"));
(async()=>{const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const c=await R.ouvrir(nav,info,"?mode=prof",1536,864);const t=await R.ouvrir(nav,info,"?mode=prof&view=phone",390,844);const b=await R.ouvrir(nav,info,"?mode=prof&view=board",1536,864);
await c.waitForTimeout(1500);
for(const [n,p] of [["console",c],["tel",t],["board",b]]){await p.screenshot({path:"cap/s1-"+n+".png"});console.log("=====",n,(await p.evaluate(()=>document.body.innerText)).slice(0,1200));
console.log("BTN:",(await p.$$eval("button,a,select",e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim()||x.tagName).join(" | "))).slice(0,800));}
await nav.close();})();
