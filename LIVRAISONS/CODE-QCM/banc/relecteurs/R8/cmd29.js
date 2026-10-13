await P.t1.locator("button:visible",{hasText:"Rome"}).first().click();await P.t1.waitForTimeout(500);
await bc(P.c,"Clore la question");await P.c.waitForTimeout(800);
for(let k=0;k<2;k++){await bc(P.c,"❌ Écarter");const o=P.c.locator("button:visible",{hasText:/Écarter Q|Oui|Confirmer|❌ Écarter la/});if(await o.count())await o.last().click();await P.c.waitForTimeout(800);}
await cap(P.c,"23-console-apres-ecarts");return (await btns(P.c)).slice(-500)+"\n"+(await txt(P.c)).slice(300,800);
