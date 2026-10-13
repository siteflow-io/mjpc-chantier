const c=P.console,t=P.t1; const ct0=await txt(c); const k=ct0.indexOf("📱 Tablette 1");
let r="CONSOLE T1 pendant:"+ct0.slice(k,k+120);
await t.getByRole("button",{name:"Rome"}).click(); await t.waitForTimeout(1200);
await cap(t,"tab1-julien-rep");
r+="\nTAB1 après clic:"+(await txt(t)).slice(150,700)+"\nBT:"+(await btns(t));
const ct=await txt(c); r+="\nCON:"+ct.slice(ct.indexOf("CONNECT")-6,ct.indexOf("CONNECT")+60)+ct.slice(ct.indexOf("📱 Tablette 1"),ct.indexOf("📱 Tablette 1")+120);
r+="\nTEL:"+(await txt(P.tel)).match(/TABLETTES.*/)+"\nBOARD:"+(await txt(P.tab)).slice(40,140);
return r;
