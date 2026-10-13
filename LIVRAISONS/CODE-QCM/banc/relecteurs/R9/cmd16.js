const t=P.t1; await t.waitForTimeout(24000);
await cap(t,"tab1-B"); 
return (await txt(t)).slice(100,900)+"\nBT:"+(await btns(t));
