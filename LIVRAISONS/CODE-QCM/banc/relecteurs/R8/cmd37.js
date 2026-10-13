await bc(P.t1,"Je pense que Léa a bien lu");await bc(P.t1,"Je pense que Julien a mal lu");
for(let k=0;k<2;k++){const b=P.t2.locator("button:visible",{hasText:"a bien lu ma feuille"});if(await b.count())await b.first().click();await P.t2.waitForTimeout(500);}
await P.t1.waitForTimeout(800);const t1=(await txt(P.t1)).slice(60,900);const tb=await btns(P.t1);
await P.c.waitForTimeout(1000);await cap(P.c,"30-console-alerte");await cap(P.ph,"30-tel-alerte");await cap(P.t1,"30-t1-coeval");
return "T1 "+t1+"\nTB "+tb+"\nC "+(await txt(P.c)).slice(280,1300)+"\nCB "+(await btns(P.c)).slice(-400);
