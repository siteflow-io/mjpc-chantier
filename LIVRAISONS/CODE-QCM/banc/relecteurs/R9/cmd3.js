const m = P.m || (P.m = await nav.newPage({viewport:{width:1536,height:864}}));
await m.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene=c-appel"); await m.waitForTimeout(800);
const t=await txt(m); const i=t.indexOf("Check-in");
const c=P.console; const inp = await c.$$eval("input", a=>a.filter(x=>x.offsetParent).map(x=>x.type+":"+x.value+":"+x.placeholder));
return t.slice(i, i+400).replace(/✓\n/g,"")+"\nBT:"+(await btns(m)).slice(-300)+"\nINPUTS:"+inp;
