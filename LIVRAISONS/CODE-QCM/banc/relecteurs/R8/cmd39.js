const bs=P.t1.locator("button:visible",{hasText:/^\s*Rome\s*$/});await bs.last().click();await P.t1.waitForTimeout(1200);
const c=await txt(P.c);const i=c.indexOf("Donner raison");const a=c.slice(i-150,i+120);
await cap(P.c,"32-console-alerte-complete");
await bc(P.c,"Donner raison à Léa");await P.c.waitForTimeout(800);
const ok=P.c.locator("button:visible:not([disabled])",{hasText:"Afficher leur bilan"});const n=await ok.count();if(n){await ok.first().click();await P.c.waitForTimeout(1500);}
await cap(P.t1,"33-t1-bilan");await cap(P.c,"33-console-bilan");
return "ALERTE "+a+"\nn="+n+"\nT1 "+(await txt(P.t1)).slice(60,700)+"\nCB "+(await btns(P.c)).slice(-300);
