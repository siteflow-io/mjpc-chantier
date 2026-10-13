await P.t2.waitForTimeout(25000);await cap(P.t2,"18-t2-tom-fin");await cap(P.c,"18-console-tom-fin");await cap(P.b,"18-tableau-tom-fin");
const bt=await btns(P.t2);
return "T2 "+(await txt(P.t2)).slice(-500)+"\nBTN "+bt+"\nPH "+(await txt(P.ph)).slice(60,200);
