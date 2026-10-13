for(const p of [P.t1,P.t2]){await attest(p);for(let k=0;k<3;k++){const b=p.locator("button:visible:not([disabled])",{hasText:"Je commence la correction"});if(!(await b.count()))break;await b.first().click();await p.waitForTimeout(500);}}
await P.c.waitForTimeout(4000);await cap(P.c,"26-console-attest2-fait");await cap(P.ph,"26-tel-attest2-fait");await cap(P.t1,"26-t1-attest2-fait");
const c=await txt(P.c);const j=c.indexOf("Évaluation d'essai — 3 questions — 3");
return "T1 "+(await txt(P.t1)).slice(60,500)+"\nCB "+(await btns(P.c)).slice(-250)+"\nC "+c.slice(j,j+600)+"\nPH "+(await txt(P.ph)).slice(60,300)+"\nPHB "+(await btns(P.ph)).slice(-200);
