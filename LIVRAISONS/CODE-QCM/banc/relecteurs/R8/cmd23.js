await P.t2.waitForTimeout(1500);const t=await txt(P.ph);const i=t.indexOf("TABLETTES");await cap(P.ph,"17-tel-apres-tom");await cap(P.t2,"17-t2-apres");
return t.slice(i,i+250)+"\nT2 "+(await txt(P.t2)).slice(-300);
