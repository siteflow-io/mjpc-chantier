await P.c.locator("button:visible",{hasText:"+30"}).nth(1).click();await P.t1.waitForTimeout(2500);
const r=[];for(const p of [P.t1,P.t2]){const b=p.locator("button:visible",{hasText:"Rome"});r.push(await b.count());if(await b.count())await b.first().click();await p.waitForTimeout(600);}
await cap(P.t1,"12-t1-q1-repondu");const tc=await txt(P.c);const i=tc.indexOf("CONNECTÉS");
return r+"\n"+(await txt(P.t1)).slice(0,700)+"\nBTN "+await btns(P.t1)+"\n=== CONSOLE "+tc.slice(i-10,i+200);
