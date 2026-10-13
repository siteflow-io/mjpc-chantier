const t=P.t1;
const pr=t.locator('input[placeholder="Prénom"]'), no=t.locator('input[placeholder="Nom"]');
await pr.nth(0).fill("Julien"); await no.nth(0).fill("ABRIAL"); await pr.nth(1).fill("Léa"); await no.nth(1).fill("BAUDRY");
const ent=t.getByRole("button",{name:"Entrer →"});
await ent.nth(0).click(); await t.waitForTimeout(600); 
if(await ent.count()>0) await ent.last().click().catch(()=>{}); await t.waitForTimeout(1500);
await cap(t,"tab1-1"); await cap(P.console,"c4");
const c=await txt(P.console); const i=c.indexOf("📱 Tablette 1");
return (await txt(t)).slice(0,900)+"\nBT:"+(await btns(t))+"\nCONSOLE:"+c.slice(c.indexOf("CONNECT")-6,c.indexOf("CONNECT")+10)+c.slice(i,i+150);
