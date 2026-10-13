const garder=["ABRIAL","BAUDRY","BRUNEAU","CARRÉ","CHEVALLIER","DUVERNAY"];
for(const e of info.eleves){if(garder.some(g=>e.nom.startsWith(g)))continue;await P.c.locator("button:visible",{hasText:"✓ "+e.nom}).first().click();await P.c.waitForTimeout(80);}
const inp=await P.c.$$eval("input:visible",is=>is.map(i=>i.type+":"+i.value));
await P.c.waitForTimeout(400);await cap(P.c,"02-appel");
const b=P.c.locator("button:visible",{hasText:"Lancer la séance"});await b.last().click();await P.c.waitForTimeout(1500);await cap(P.c,"03-lancee");
return JSON.stringify(inp)+"\n"+(await txt(P.c)).slice(0,3000)+"\nBTN: "+await btns(P.c)+"\nERR "+P.c.__erreurs.join(";");
