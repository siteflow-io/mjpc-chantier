global.entrer=async(p,moitie,code)=>{const ins=p.locator("input[placeholder='Mon code (4 chiffres)']");await ins.nth(moitie).fill(code);await p.waitForTimeout(200);await p.locator("button:visible",{hasText:"Entrer"}).nth(moitie).click();await p.waitForTimeout(800);};
await entrer(P.t1,0,"2101");return (await txt(P.t1)).slice(0,800)+"\nBTN "+await btns(P.t1);
