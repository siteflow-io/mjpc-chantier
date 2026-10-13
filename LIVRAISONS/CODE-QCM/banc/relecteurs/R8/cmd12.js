global.attest=async(p)=>{for(let k=0;k<12;k++){const c=p.locator("input[type=checkbox]:visible:not(:checked), label:visible:has(input:not(:checked))");const n=await c.count();if(!n)break;await c.first().click();await p.waitForTimeout(250);}};
const n=await P.t1.locator("input[type=checkbox]").count();await attest(P.t1);const m=await P.t1.locator("input[type=checkbox]").count();
return n+" "+m+"\n"+(await txt(P.t1)).slice(0,1500)+"\nBTN "+await btns(P.t1);
