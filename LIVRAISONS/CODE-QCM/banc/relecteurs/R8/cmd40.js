const bil=(await txt(P.t1)).slice(700,1100);
await bc(P.c,"Terminer la séance");await cap(P.c,"34-console-terminer-garde");const g=(await txt(P.c)).slice(-500);const gb=(await btns(P.c)).slice(-200);
const o=P.c.locator("button:visible",{hasText:/Terminer/});await o.last().click();await P.c.waitForTimeout(1500);
await cap(P.c,"35-console-terminee");await cap(P.t1,"35-t1-terminee");await cap(P.ph,"35-tel-terminee");
return "BIL "+bil+"\nGARDE "+g+"\nGB "+gb+"\nT1 "+(await txt(P.t1)).slice(0,200)+"\nPH "+(await txt(P.ph)).slice(0,200)+"\nERR "+[P.c,P.t1,P.t2,P.ph,P.b].map(p=>p.__erreurs.join(";")).join(" / ");
