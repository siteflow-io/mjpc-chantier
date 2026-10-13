global.bc=async(p,t)=>{await p.locator("button:visible",{hasText:t}).first().click({timeout:4000});await p.waitForTimeout(800);};
await bc(P.c,"Lancer la séance");await cap(P.c,"01-apres-lancer");return (await txt(P.c)).slice(0,2500)+"\nBTN: "+await btns(P.c);
