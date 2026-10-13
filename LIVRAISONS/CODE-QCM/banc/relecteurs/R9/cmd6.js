const t=P.t1;
await clic(t,"👥 2 élèves"); await t.waitForTimeout(500);
const a=(await txt(t)).slice(0,500)+"\nBT:"+(await btns(t))+"\nIN:"+(await t.$$eval("input",a=>a.map(x=>x.type+":"+x.placeholder)));
return a;
