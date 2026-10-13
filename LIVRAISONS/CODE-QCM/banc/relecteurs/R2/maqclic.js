const pw=require("/opt/node22/lib/node_modules/playwright");
const M="file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
const [id,txt,out]=process.argv.slice(2);
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const p=await (await nav.newContext({viewport:{width:1536,height:900}})).newPage();
await p.goto(M+"#scene="+id);await p.waitForTimeout(500);
await p.getByText(txt).locator("visible=true").first().click();await p.waitForTimeout(800);
console.log(p.url());console.log(await p.evaluate(()=>document.body.innerText));await p.screenshot({path:"maq/"+out+".png",fullPage:true});
await nav.close();})();
