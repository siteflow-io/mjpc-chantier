const c=P.console, t=P.t1; let r="";
for (const b of await t.getByRole("button",{name:"Je commence"}).all()) await b.click({timeout:2000}).catch(e=>r+="JC fermé;");
const i1=c.locator("input").nth(1); await i1.fill("5"); await i1.press("Enter"); await c.waitForTimeout(500);
r+="\nTEL après 5s:"+(await txt(P.tel)).match(/.*(5 ?s|15 ?s).*/g);
await clic(c,"▶️ Lancer Q1"); await c.waitForTimeout(1500);
await cap(c,"c5-q1"); await cap(P.tel,"t5-q1"); await cap(P.tab,"b5-q1"); await cap(t,"tab1-q1");
const ct=await txt(c); r+="\nCONSOLE:"+ct.slice(ct.indexOf("CONNECT")-6, ct.indexOf("🔮")>0?ct.indexOf("🔮"):ct.indexOf("CONNECT")+700);
r+="\nTEL:"+(await txt(P.tel)).slice(0,400)+"\nBOARD:"+(await txt(P.tab)).slice(0,300)+"\nTAB1:"+(await txt(t)).slice(0,400)+"\nBT:"+(await btns(t));
return r;
