await bc(P.t1,"Question 1 · Quelle");const lt=(await txt(P.t1)).slice(-600);const lb=await btns(P.t1);
await bc(P.t2,"Je pense que Camille a bien lu");
await P.c.waitForTimeout(1200);await cap(P.c,"31-console-alerte");await cap(P.t1,"31-t1-lea");await cap(P.ph,"31-tel-alerte");
return "LEA "+lt+"\nLB "+lb+"\nC "+(await txt(P.c)).slice(280,1000)+"\nPH "+(await txt(P.ph)).slice(60,500);
