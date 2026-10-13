const c=P.console;
const sels = await c.$$eval("select", s=>s.map(x=>({v:x.value, o:[...x.options].map(o=>o.value+"="+o.text)})));
for (const s of await c.$$("select")) { const opts = await s.$$eval("option", o=>o.map(x=>x.text)); const i=opts.findIndex(t=>t.includes("essai")); if(i>=0) await s.selectOption({index:i}); }
P.tel = await R.ouvrir(nav, info, "?mode=prof&view=phone", 390, 844);
P.tab = await R.ouvrir(nav, info, "?mode=prof&view=board", 1280, 720);
await clic(c,"🚀 Lancer la séance");
await c.waitForTimeout(1500);
await cap(c,"c1"); await cap(P.tel,"t1"); await cap(P.tab,"b1");
return JSON.stringify(sels)+"\n"+(await txt(c)).slice(0,2500)+"\nBT:"+(await btns(c))+"\nTEL:"+(await txt(P.tel)).slice(0,600)+"\nBOARD:"+(await txt(P.tab)).slice(0,600);
