const ins=P.c.locator("input:visible");for(const i of [0,1]){await ins.nth(i).fill("5");await ins.nth(i).press("Tab");}
await bc(P.c,"Lancer Q1");await P.c.waitForTimeout(6000);await cap(P.t1,"11-t1-q1");
const tc=await txt(P.c);const i=tc.indexOf("CONNECTÉS");
return (await txt(P.t1)).slice(0,700)+"\nBTN "+await btns(P.t1)+"\n=== CONSOLE "+tc.slice(i-10,i+200);
