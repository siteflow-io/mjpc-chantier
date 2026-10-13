await P.c.waitForTimeout(3000);const still=(await btns(P.c)).includes("Commencer la correction");
await bc(P.ph,"Commencer la correction");await P.t1.waitForTimeout(2000);await cap(P.t1,"27-t1-correction");await cap(P.c,"27-console-correction");await cap(P.ph,"27-tel-correction");
return "encore-attente-apres-7s="+still+"\nT1 "+(await txt(P.t1)).slice(0,900)+"\nBTN "+await btns(P.t1)+"\nCB "+(await btns(P.c)).slice(-300);
