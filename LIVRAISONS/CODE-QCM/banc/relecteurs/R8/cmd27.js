await bc(P.c,"Rouvrir pour ceux qui n");await P.t1.waitForTimeout(3000);await cap(P.t1,"20-t1-rouvert-tous");await cap(P.c,"20-console-rouvert-tous");await cap(P.ph,"20-tel-rouvert-tous");await cap(P.b,"20-tableau-rouvert-tous");
const c=await txt(P.c);const i=c.indexOf("CONNECTÉS");
const r="T1 "+(await txt(P.t1)).slice(60,700)+"\nCONS "+c.slice(i-10,i+260)+"\nPH "+(await txt(P.ph)).slice(60,160)+"\nB "+(await txt(P.b)).slice(0,150);
await P.c.reload();await P.c.waitForTimeout(2000);await cap(P.c,"21-console-recharge");
return r+"\nRELOAD "+(await txt(P.c)).slice(0,1500)+"\nBTN "+await btns(P.c);
