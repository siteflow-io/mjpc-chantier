const c=P.console;
await c.getByRole("button",{name:/Lancer la séance/}).first().click();
await c.waitForTimeout(1500);
await cap(c,"c1"); await cap(P.tel,"t1"); await cap(P.tab,"b1");
return (await txt(c)).slice(0,2500)+"\nBT:"+(await btns(c))+"\nTEL:"+(await txt(P.tel)).slice(0,600)+"\nBOARD:"+(await txt(P.tab)).slice(0,600);
