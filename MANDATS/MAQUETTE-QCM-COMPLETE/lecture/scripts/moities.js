const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async()=>{
 const [file, ...ids] = process.argv.slice(2);
 const b = await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 for (const id of ids){
  const p = await (await b.newContext({viewport:{width:1280,height:800}})).newPage();
  await p.goto("file://"+file+"#scene="+id); await p.waitForFunction(()=>window.SCENE_PRETE,null,{timeout:20000}).catch(()=>{});
  await p.waitForTimeout(400);
  const r = await p.evaluate(()=>{
    const docs=[document]; document.querySelectorAll("iframe").forEach(f=>{try{docs.push(f.contentDocument)}catch(e){}});
    const out=[];
    docs.forEach((d,di)=>{
      // chaque moitié : on prend les éléments dont la largeur est ~ la moitié de l'écran
      const all=[...d.querySelectorAll("body *")].filter(e=>{const r=e.getBoundingClientRect(); return r.width>400 && r.width<700 && r.height>300;});
      const tops = all.filter(e=>!all.some(o=>o!==e && o.contains(e)));
      tops.forEach((e,i)=>{ const t=e.innerText; const x=Math.round(e.getBoundingClientRect().x);
        const qui=(t.match(/^[^\n]*\n?[^\n]*/)||[""])[0].replace(/\n/g," / ").slice(0,60);
        out.push(`doc${di} x=${x} [${qui}] désaccord-sérieux:${(t.match(/Un désaccord, c'est sérieux/g)||[]).length} seule-question:${(t.match(/seule question de désaccord/g)||[]).length} chrono:${(t.match(/TEMPS[^\n]*/)||[""])[0]}`); });
    });
    return out;
  });
  console.log("=== "+id); r.forEach(l=>console.log(l));
  await p.close();
 }
 await b.close();
})();
