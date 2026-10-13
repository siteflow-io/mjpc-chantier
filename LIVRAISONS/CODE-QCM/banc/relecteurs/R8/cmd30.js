const c0=await txt(P.c);const i=c0.indexOf("CONNECTÉS");
const b=P.c.locator("button:visible",{hasText:"Clore la question"});if(await b.count()){await b.click();await P.c.waitForTimeout(800);}
for(let k=0;k<2;k++){await bc(P.c,"❌ Écarter");const bt=await btns(P.c);const o=P.c.locator("button:visible",{hasText:/Écarter Q|Oui|Confirmer|Écarter la/});if(await o.count())await o.last().click();await P.c.waitForTimeout(800);}
await cap(P.c,"23-console-apres-ecarts");const c=await txt(P.c);const j=c.indexOf("CONNECTÉS");return c0.slice(i-10,i+200)+"\n--\n"+(await btns(P.c)).slice(-500)+"\n"+c.slice(j-10,j+400);
