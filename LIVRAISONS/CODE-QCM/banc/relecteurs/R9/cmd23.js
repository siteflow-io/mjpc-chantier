const c=P.console; let t=await txt(c); let r="APP:"+t.slice(t.indexOf("⚠️ Séance interrompue")).replace(/\n/g," ").slice(0,400);
await c.getByRole("button",{name:"🔄 Reprendre la séance"}).click(); await c.waitForTimeout(2000);
await cap(c,"c15-repris"); await cap(P.tel,"t15"); await cap(P.tab,"b15"); await cap(P.t1,"tab1-15");
t=await txt(c); r+="\nREPRIS:"+t.slice(t.indexOf("CONNECT")-6,t.indexOf("CONNECT")+330).replace(/\n/g," ");
r+="\nTEL:"+(await txt(P.tel)).slice(40,140).replace(/\n/g," ")+"\nBOARD:"+(await txt(P.tab)).slice(0,160).replace(/\n/g," ")+"\nT1:"+(await txt(P.t1)).replace(/\n/g," ").slice(80,280)+"\nERR:"+JSON.stringify(c.__erreurs||[]).slice(0,200);
return r;
