P.t1 = await R.ouvrir(nav, info, "?mode=eleve", 1280, 800);
P.t3 = await R.ouvrir(nav, info, "?mode=eleve", 1280, 800);
await P.t1.waitForTimeout(800);
await cap(P.t1,"tab1-0");
return (await txt(P.t1)).slice(0,800)+"\nBT:"+(await btns(P.t1))+"\nIN:"+(await P.t1.$$eval("input",a=>a.map(x=>x.type+":"+x.placeholder)));
