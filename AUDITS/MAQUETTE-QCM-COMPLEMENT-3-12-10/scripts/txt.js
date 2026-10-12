const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async()=>{
 const [file, ...ids] = process.argv.slice(2);
 const b = await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 for (const id of ids){
  const p = await (await b.newContext({viewport:{width:1280,height:800}})).newPage();
  await p.goto("file://"+file+"#scene="+id); await p.waitForFunction(()=>window.SCENE_PRETE,null,{timeout:20000}).catch(()=>{});
  await p.waitForTimeout(400);
  const t = await p.evaluate(()=>{ const out=[]; const walk=d=>{ out.push(d.body.innerText); d.querySelectorAll("iframe").forEach(f=>{try{walk(f.contentDocument)}catch(e){}})}; walk(document); return out.join("\n"); });
  console.log("=== "+id+"\n"+t);
  await p.close();
 }
 await b.close();
})();
