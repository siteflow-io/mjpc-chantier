await bc(P.c,"Rouvrir pour Tom");await P.c.waitForTimeout(1500);
await cap(P.t2,"15-t2-rouvert-tom");await cap(P.c,"15-console-rouvert-tom");await cap(P.ph,"15-tel-rouvert-tom");await cap(P.b,"15-tableau-rouvert-tom");
const r="T2 "+(await txt(P.t2)).slice(0,900)+"\nPH "+(await txt(P.ph)).slice(0,400)+"\nBOARD "+(await txt(P.b)).slice(0,200);
const rb=P.t2.locator("button:visible",{hasText:"Rome"});const n=await rb.count();if(n)await rb.first().click();await P.t2.waitForTimeout(1200);
await cap(P.t2,"16-t2-tom-apres");await cap(P.c,"16-console-tom-apres");
return r+"\nN="+n+"\nAPRES T2 "+(await txt(P.t2)).slice(0,900)+"\nCONS "+(await txt(P.c)).slice(300,900);
