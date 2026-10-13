const m=await mq("c-interrompue");const j=m.indexOf("interrompue");
const ph=(await txt(P.ph)).slice(60,200);
await bc(P.c,"Reprendre la séance");await P.c.waitForTimeout(2500);await cap(P.c,"22-console-reprise");
const c=await txt(P.c);const i=c.indexOf("CONNECTÉS");
return "MAQ "+m.slice(j-20,j+400)+"\nPHnow "+ph+"\nAPP "+c.slice(i-10,i+330)+"\nT1 "+(await txt(P.t1)).slice(150,400)+"\nERR "+P.c.__erreurs;
