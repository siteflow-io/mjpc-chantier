const t = P.t2 = await R.ouvrir(nav, info, "?mode=eleve", 1280, 800);
await clic(t,"👥 2 élèves"); await t.waitForTimeout(400);
const codes=t.locator('input[placeholder="Mon code (4 chiffres)"]');
await codes.nth(0).fill("2262"); await t.locator('input[placeholder="Prénom"]').nth(0).fill("Camille"); await t.locator('input[placeholder="Nom"]').nth(0).fill("BRUNEAU");
await t.getByRole("button",{name:"Entrer →"}).nth(0).click(); await t.waitForTimeout(1000);
for(const k of "2115"){ await t.getByRole("button",{name:k,exact:true}).last().click(); }
await t.getByRole("button",{name:"Entrer",exact:true}).click().catch(()=>{}); await t.waitForTimeout(1500);
await cap(t,"tab2-0"); await cap(P.console,"c7");
const c=await txt(P.console);
return (await txt(t)).slice(0,500)+"\nBT:"+(await btns(t))+"\nCONSOLE:"+c.slice(c.indexOf("CONNECT")-6,c.indexOf("CONNECT")+700)+"\nCBT:"+(await btns(P.console));
