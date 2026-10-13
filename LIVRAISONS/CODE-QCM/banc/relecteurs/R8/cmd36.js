await bc(P.c,"Ouvrir la co-évaluation");await P.t1.waitForTimeout(1500);await cap(P.t1,"29-t1-coeval");
const t=await txt(P.t1);const b=await btns(P.t1);
return "T1 "+t.slice(60,1200)+"\nBTN "+b+"\nC "+(await txt(P.c)).slice(300,900);
