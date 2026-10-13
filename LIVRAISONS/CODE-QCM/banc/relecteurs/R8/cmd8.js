global.entrer=async(p,m,code)=>{const bs=p.locator("button:visible");for(const ch of code){await bs.nth(m*13+(ch==="0"?10:+ch-1)).click();await p.waitForTimeout(60);}await bs.nth(m*13+12).click();await p.waitForTimeout(900);};
await entrer(P.t1,0,"2101");return (await txt(P.t1)).slice(0,800)+"\nBTN "+await btns(P.t1);
