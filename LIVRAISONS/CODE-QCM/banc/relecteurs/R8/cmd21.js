await P.t1.locator("button:visible",{hasText:"Rome"}).first().click();await P.t1.waitForTimeout(800);
let tc=await txt(P.c);let i=tc.indexOf("CONNECTÉS");const a=tc.slice(i-10,i+40);
await bc(P.c,"Clore la question");await P.c.waitForTimeout(1500);
const ok=P.c.locator("button:visible",{hasText:/Clore|Confirmer|Oui/});
await bc(P.c,"Rouvrir pour un élève");await cap(P.c,"14-console-rouvrir-un");
return a+"\n"+(await txt(P.c)).slice(-900)+"\nBTN "+await btns(P.c);
