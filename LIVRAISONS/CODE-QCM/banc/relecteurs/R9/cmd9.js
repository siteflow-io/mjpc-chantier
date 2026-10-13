const t=P.t1;
for(const k of "2108"){ await t.getByRole("button",{name:k,exact:true}).last().click(); }
await t.getByRole("button",{name:"Entrer",exact:true}).click(); await t.waitForTimeout(1200);
// cocher les lignes d'attestation
const cb=t.locator('input[type=checkbox]'); const n=await cb.count(); for(let i=0;i<n;i++) await cb.nth(i).check().catch(()=>{});
await t.waitForTimeout(300);
for (const b of await t.getByRole("button",{name:"Je commence"}).all()) await b.click().catch(()=>{});
await t.waitForTimeout(1000);
await cap(t,"tab1-2");
// temps réponse à 5 s
const c=P.console;
const inp=c.locator('input'); const vis=await c.$$eval("input",a=>a.map((x,i)=>i+":"+x.type+":"+x.value+":"+(!!x.offsetParent)));
return "cb:"+n+"\n"+(await txt(t)).slice(0,500)+"\nBT:"+(await btns(t))+"\nIN:"+vis;
