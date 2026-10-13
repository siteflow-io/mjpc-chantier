const c=P.console;
await c.getByRole("button",{name:"🔓 Rouvrir pour Julien"}).click(); await c.waitForTimeout(2000);
await cap(c,"c9-rouvert-julien"); await cap(P.t1,"tab1-rouvert"); await cap(P.tel,"t9"); await cap(P.tab,"b9");
const ct=await txt(c);
const m=P.m; await m.setViewportSize({width:1280,height:800}); await m.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene=t-rouvrir-un"); await m.waitForTimeout(800); await cap(m,"m-t-rouvrir-un");
return "CON:"+ct.slice(ct.indexOf("CONNECT")-6,ct.indexOf("CONNECT")+420)+"\nTAB1:"+(await txt(P.t1)).slice(0,700)+"\nBT:"+(await btns(P.t1))+"\nTEL:"+(await txt(P.tel)).slice(0,350)+"\nBOARD:"+(await txt(P.tab)).slice(0,250)+"\nMAQ t-rouvrir-un:"+(await txt(m)).slice(0,700);
