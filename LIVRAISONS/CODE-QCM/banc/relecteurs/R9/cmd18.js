const c=P.console; let r="";
await c.getByRole("button",{name:"🔓 Rouvrir pour ceux qui n'ont pas répondu"}).click(); await c.waitForTimeout(1500);
await cap(c,"c11-tous"); await cap(P.t1,"tab1-tous"); await cap(P.t2,"tab2-tous"); await cap(P.tab,"b11"); await cap(P.tel,"t11");
r+="T1:"+(await txt(P.t1)).replace(/\n/g," ").slice(0,450)+"\nT2:"+(await txt(P.t2)).replace(/\n/g," ").slice(0,450);
// répondre Léa (moitié qui a la main) 
for (const p of [P.t1,P.t2]) { const b=p.getByRole("button",{name:"Rome"}); if(await b.count()) await b.first().click().catch(()=>{}); }
await c.waitForTimeout(800);
const ct=await txt(c); r+="\nCON:"+ct.slice(ct.indexOf("CONNECT")-6,ct.indexOf("CONNECT")+200).replace(/\n/g," ");
r+="\nTEL:"+(await txt(P.tel)).slice(40,260).replace(/\n/g," ")+"\nBOARD:"+(await txt(P.tab)).slice(0,250).replace(/\n/g," ");
// poll B
for(let i=0;i<20;i++){ await c.waitForTimeout(2000); for (const [n,p] of [["t1",P.t1],["t2",P.t2]]) { const x=await txt(p); if(/même chose/.test(x)){ await cap(p,"B-"+n+"-"+i); r+="\nB "+n+" @"+i+": "+x.replace(/\n/g," ").slice(0,500)+" BT:"+(await btns(p)); } } if(r.includes("B t1")&&r.includes("B t2")) break; }
r+="\nFIN T1:"+(await txt(P.t1)).replace(/\n/g," ").slice(0,300);
return r;
