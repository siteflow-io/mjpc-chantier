await bc(P.c,"Lancer l'autoévaluation");await P.c.waitForTimeout(1500);await cap(P.t1,"24-t1-estim");await cap(P.c,"24-console-estim");
return "T1 "+(await txt(P.t1)).slice(0,700)+"\nBTN "+await btns(P.t1)+"\nC "+(await btns(P.c)).slice(-300)+"\nPH "+(await btns(P.ph)).slice(-300);
