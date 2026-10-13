const c=P.console, t=P.t1; let r="";
await c.getByRole("button",{name:"▶️ Lancer Q1"}).click({timeout:4000}).catch(e=>r+="ERR lancer;");
await c.waitForTimeout(1500);
await c.getByRole("button",{name:"+30"}).last().click({timeout:3000}).catch(e=>r+="ERR +30;");
await c.waitForTimeout(800);
await cap(c,"c6-q1"); await cap(P.tel,"t6-q1"); await cap(P.tab,"b6-q1"); await cap(t,"tab1-q1");
const ct=await txt(c); r+="\nCONSOLE:"+ct.slice(ct.indexOf("CONNECT")-6, ct.indexOf("CONNECT")+500);
r+="\nTEL:"+(await txt(P.tel)).slice(0,300)+"\nBOARD:"+(await txt(P.tab)).slice(0,300)+"\nTAB1:"+(await txt(t)).slice(0,300)+"\nBT:"+(await btns(t))+"\nERRS:"+JSON.stringify(c.__erreurs||[]).slice(0,300);
return r;
