const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async()=>{
 const b = await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 for (const v of ["v7","v8"]) for (const id of ["t-login","t-login-inconnu","t-binome"]){
  const p = await (await b.newContext({viewport:{width:1280,height:800}})).newPage();
  await p.goto("file://"+process.argv[2]+"/maquette-qcm-"+v+".html#scene="+id); await p.waitForFunction(()=>window.SCENE_PRETE,null,{timeout:20000}).catch(()=>{});
  await p.waitForTimeout(500);
  const r = await p.evaluate(()=>[...document.querySelectorAll("input,textarea")].filter(e=>e.offsetParent).map(e=>({x:Math.round(e.getBoundingClientRect().x), ph:e.placeholder, val:e.value, type:e.type, mode:e.inputMode, focus:document.activeElement===e, cls:e.className})));
  console.log(v, id, JSON.stringify(r));
  await p.screenshot({path:`${process.argv[3]}/${v}-${id}.png`});
  await p.close();
 }
 await b.close();
})();
