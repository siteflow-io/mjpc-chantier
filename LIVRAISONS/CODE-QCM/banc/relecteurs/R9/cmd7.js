const t=P.t1;
const codes=t.locator('input[placeholder="Mon code (4 chiffres)"]');
await codes.nth(0).fill("2101"); await codes.nth(1).fill("2108");
const ent=t.getByRole("button",{name:"Entrer →"});
await ent.nth(0).click(); await t.waitForTimeout(400); await ent.nth(1).click().catch(()=>{}); await t.waitForTimeout(1500);
await cap(t,"tab1-1"); await cap(P.console,"c4");
const c=await txt(P.console); const i=c.indexOf("📱 Tablette 1");
return (await txt(t)).slice(0,700)+"\nBT:"+(await btns(t))+"\nCONSOLE:"+c.slice(0,600)+c.slice(i,i+200)+"\nTEL:"+(await txt(P.tel)).slice(150,330);
