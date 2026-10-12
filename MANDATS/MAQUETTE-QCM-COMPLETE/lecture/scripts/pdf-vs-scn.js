const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async()=>{
 const b = await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 const p = await (await b.newContext({viewport:{width:1366,height:768}})).newPage();
 await p.goto("file://"+process.argv[2]+"#scene=x632-pdf"); await p.waitForFunction(()=>window.SCENE_PRETE,null,{timeout:20000}).catch(()=>{});
 await p.waitForTimeout(800);
 const r = await p.evaluate(()=>{
   const html = window.PDF632_HTML || "";
   const d = new DOMParser().parseFromString(html, "text/html");
   const txt = d.body ? d.body.innerText || d.body.textContent : "";
   const S = window.SCN; const noms = Object.keys(S.R_3E||{});
   return {n: noms.length, notes: noms.map(n=>[n, S.noteSeance("S3E", n)]), txt: (d.body.textContent||"").replace(/\s+/g," ")};
 });
 console.log(JSON.stringify(r.notes)); console.log(r.txt);
 await b.close();
})();
