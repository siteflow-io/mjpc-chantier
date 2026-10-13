const c=P.console; let r="";
const tim=async p=>{const x=await txt(p);return (x.match(/\d+s/g)||[]).slice(0,3).join(",")};
r+="avant +30: con "+await tim(c)+" tel "+await tim(P.tel)+" board "+await tim(P.tab)+" tab1 "+((await txt(P.t1)).match(/RÉPONSE\n(\d+)/g));
await c.getByRole("button",{name:"+30"}).last().click(); await c.waitForTimeout(1000);
r+="\naprès +30: con "+await tim(c)+" tel "+await tim(P.tel)+" board "+await tim(P.tab)+" tab1 "+((await txt(P.t1)).match(/RÉPONSE\n(\d+)/g))+" tab2 "+((await txt(P.t2)).match(/RÉPONSE\n(\d+)/g));
await cap(c,"c12-plus30"); await cap(P.tel,"t12-plus30"); await cap(P.tab,"b12-plus30"); await cap(P.t1,"tab1-plus30");
const ct=await txt(c); r+="\nFIN PREVUE:"+ct.match(/Fin prévue [\d:]+/)+" tel:"+(await txt(P.tel)).match(/Fin prévue [\d:]+/);
await P.t1.getByRole("button",{name:"Rome"}).last().click().catch(e=>r+=" ERR Léa");
await c.waitForTimeout(800);
r+="\nT1:"+(await txt(P.t1)).replace(/\n/g," ").slice(-350);
await c.getByRole("button",{name:"🔒 Clore la question"}).click(); await c.waitForTimeout(500);
for(let i=0;i<8;i++){ await c.waitForTimeout(1000); const x=await txt(P.t1); if(/même chose/.test(x)){ await cap(P.t1,"B-lea"); r+="\nB Léa @"+i+": "+x.replace(/\n/g," ").slice(-400); await P.t1.getByRole("button",{name:"Oui, la même chose"}).last().click().catch(()=>{}); break;} }
await c.waitForTimeout(1000);
r+="\nAPRES CLORE T1:"+(await txt(P.t1)).replace(/\n/g," ").slice(-250)+"\nT2:"+(await txt(P.t2)).replace(/\n/g," ").slice(-200);
const c2=await txt(c); r+="\nCON:"+c2.slice(c2.indexOf("CONNECT")-6,c2.indexOf("CONNECT")+170).replace(/\n/g," ");
await cap(c,"c13-close"); await cap(P.t1,"tab1-close");
return r;
