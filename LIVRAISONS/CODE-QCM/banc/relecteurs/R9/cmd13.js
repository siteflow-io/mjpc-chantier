const c=P.console;
await c.getByRole("button",{name:"🔓 Rouvrir pour un élève"}).click(); await c.waitForTimeout(800);
await cap(c,"c8-rouvrir-un");
const t=await txt(c); const i=t.lastIndexOf("Rouvrir");
const m=P.m; await m.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene=c-rouvrir-un"); await m.waitForTimeout(800); await cap(m,"m-rouvrir-un");
const mt=await txt(m); const j=mt.lastIndexOf("Rouvrir pour un");
return "APP:"+t.slice(t.indexOf("Rouvrir pour un élève", t.indexOf("Terminer")+5)-50).slice(0,900)+"\nBT:"+(await btns(c)).slice(-400)+"\n\nMAQ:"+mt.slice(j-50,j+900)+"\nMBT:"+(await btns(m)).slice(-400);
