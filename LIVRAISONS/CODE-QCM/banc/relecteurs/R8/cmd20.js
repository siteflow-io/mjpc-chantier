await P.c.waitForTimeout(3000);await cap(P.c,"13-console-q1");await cap(P.t1,"13-t1-q1");await cap(P.ph,"13-tel-q1");await cap(P.b,"13-tableau-q1");
const tc=await txt(P.c);const i=tc.indexOf("CONNECTÉS");
return "T1 "+(await txt(P.t1)).slice(60,400)+"\nT2 "+(await txt(P.t2)).slice(60,500)+"\nPH "+(await txt(P.ph)).slice(0,500)+"\nBOARD "+(await txt(P.b)).slice(0,300)+"\n=== CONSOLE "+tc.slice(i-10,i+260)+"\nBTN "+await btns(P.c)+"\nERR "+[P.c,P.t1,P.t2,P.ph,P.b].map(p=>p.__erreurs.join(";")).join(" / ");
