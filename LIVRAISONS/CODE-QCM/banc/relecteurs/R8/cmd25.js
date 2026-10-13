const m1=(await mq("t-rouvrir-un")).slice(0,700);const m2=(await mq("c-rouvrir-tous"));const j=m2.indexOf("Rouvrir pour tous");
await bc(P.c,"Rouvrir pour tous");await P.c.waitForTimeout(1200);await cap(P.c,"19-console-rouvrir-tous");
const c=await txt(P.c);const k=c.indexOf("Rouvrir pour tous");
await P.t1.waitForTimeout(1000);await cap(P.t1,"19-t1-rouvrir-tous");
return "MAQ t-rouvrir-un "+m1+"\nMAQ c-rouvrir-tous "+m2.slice(j-200,j+500)+"\nAPP "+c.slice(k-100,k+500)+"\nT1 "+(await txt(P.t1)).slice(0,600)+"\nERR "+P.c.__erreurs;
