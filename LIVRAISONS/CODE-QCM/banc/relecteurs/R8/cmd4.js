const garder=["ABRIAL","BAUDRY","BRUNEAU","CARRÉ","CHEVALLIER","DUVERNAY"];
for(const e of info.eleves){if(garder.some(g=>e.nom.startsWith(g)))continue;const l=P.c.locator("button:visible",{hasText:e.nom});await l.last().click({timeout:3000});await P.c.waitForTimeout(80);}
await P.c.waitForTimeout(400);await cap(P.c,"02-appel");
const t=await txt(P.c);const i=t.indexOf("Check-in");
const b=P.c.locator("button:visible",{hasText:"Lancer la séance"});await b.last().click();await P.c.waitForTimeout(1500);await cap(P.c,"03-lancee");
return t.slice(i,i+900)+"\n=====\n"+(await txt(P.c)).slice(0,2500)+"\nBTN: "+await btns(P.c)+"\nERR "+P.c.__erreurs.join(";");
