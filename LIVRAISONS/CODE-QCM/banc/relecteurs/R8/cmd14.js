global.attest=async(p)=>{for(let k=0;k<30;k++){const c=p.locator("[role=checkbox][aria-checked=false]:visible");if(!(await c.count()))break;await c.first().click();await p.waitForTimeout(300);}};
await attest(P.t1);await cap(P.t1,"08-attest-fini");const r1=(await txt(P.t1)).slice(-1000)+"\nBTN "+await btns(P.t1);
await P.c.waitForTimeout(500);const tc=await txt(P.c);const i=tc.indexOf("CONNECTÉS");
return r1+"\n=== CONSOLE "+tc.slice(i-10,i+120)+"\n"+tc.slice(tc.indexOf("📱 Tablettes"),tc.indexOf("📋 Toutes"));
