global.ident=async(p,m,nom,code)=>{const [N,Pr]=nom.split(" ");const bs=p.locator("button:visible");
 await p.locator("input[placeholder='Mon code (4 chiffres)']").nth(m).click();for(const ch of code){await bs.nth(m*13+(ch==="0"?10:+ch-1)).click();await p.waitForTimeout(40);}
 await p.locator("input[placeholder='Prénom']").nth(m).click();await p.keyboard.type(Pr);await p.locator("input[placeholder='Nom']").nth(m).click();await p.keyboard.type(N);
 await p.locator("button:visible",{hasText:"Entrer"}).nth(m).click();await p.waitForTimeout(900);};
await P.t1.locator("input[placeholder='Prénom']").nth(0).click();await P.t1.keyboard.type("Julien");await P.t1.locator("input[placeholder='Nom']").nth(0).click();await P.t1.keyboard.type("ABRIAL");await P.t1.locator("button:visible",{hasText:"Entrer"}).nth(0).click();await P.t1.waitForTimeout(900);
await cap(P.t1,"05-t1-julien");return (await txt(P.t1)).slice(0,800)+"\nBTN "+await btns(P.t1);
