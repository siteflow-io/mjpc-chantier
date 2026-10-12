// Textes vus par l'élève (tablette, élève, tableau), par scène et par bloc (moitié de tablette ou page), v7 contre v8
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs=require("fs");
(async()=>{
 const [file, out] = process.argv.slice(2);
 const b = await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 const p0 = await (await b.newContext()).newPage();
 await p0.goto("file://"+file); await p0.waitForTimeout(1500);
 const scenes = await p0.evaluate(()=>window.LISTE_SCENES.map(s=>({id:s.id,vue:s.vue})));
 const res={};
 for (const s of scenes.filter(s=>["tablette","eleve","tableau"].includes(s.vue))){
  for (const vp of (s.vue==="eleve"?[{width:1280,height:800},{width:390,height:844}]:[{width:1280,height:800}])){
   const ctx=await b.newContext({viewport:vp}); const p=await ctx.newPage();
   await p.goto("file://"+file+"#scene="+s.id); await p.waitForFunction(()=>window.SCENE_PRETE,null,{timeout:20000}).catch(()=>{});
   await p.waitForTimeout(300);
   const blocs = await p.evaluate(()=>{
     const docs=[document]; document.querySelectorAll("iframe").forEach(f=>{try{docs.push(f.contentDocument)}catch(e){}});
     const out=[];
     docs.forEach((d,di)=>{
       const all=[...d.querySelectorAll("body *")].filter(e=>{const r=e.getBoundingClientRect(); const W=d.defaultView.innerWidth; return r.width>W*0.35 && r.width<W*0.6 && r.height>300;});
       const tops = all.filter(e=>!all.some(o=>o!==e && o.contains(e)));
       if(tops.length>=2){ tops.sort((a,b)=>a.getBoundingClientRect().x-b.getBoundingClientRect().x).forEach((e,i)=>out.push({bloc:"doc"+di+(i===0?"-gauche":i===1?"-droite":"-"+i), t:e.innerText}));
         // le reste de la page hors moitiés
         const clone=d.body.innerText; let reste=clone; tops.forEach(e=>{reste=reste.replace(e.innerText,"");}); out.push({bloc:"doc"+di+"-hors", t:reste});
       } else out.push({bloc:"doc"+di, t:d.body.innerText});
     });
     return out;
   });
   res[s.id+"@"+vp.width]=blocs;
   await ctx.close();
  }
 }
 fs.writeFileSync(out, JSON.stringify(res));
 await b.close();
})();
