for(const p of [P.t1,P.t2]){for(let k=0;k<2;k++){const b=p.locator("button:visible",{hasText:"1 bonne réponse sur 1"});if(await b.count())await b.first().click();await p.waitForTimeout(400);}}
await P.c.waitForTimeout(1000);await bc(P.c,"Lancer la correction");await P.c.waitForTimeout(1500);
await cap(P.t1,"25-t1-attest2");await cap(P.c,"25-console-attest2");await cap(P.ph,"25-tel-attest2");
const c=await txt(P.c);const j=c.indexOf("CONNECTÉS");
return "T1 "+(await txt(P.t1)).slice(0,600)+"\nC "+c.slice(j-10,j+500)+"\nCB "+(await btns(P.c)).slice(-300)+"\nPH "+(await txt(P.ph)).slice(0,300)+"\nPHB "+(await btns(P.ph)).slice(-200);
