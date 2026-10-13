await bc(P.t1,"2 élèves");return (await txt(P.t1)).slice(0,800)+"\nBTN "+await btns(P.t1)+"\nINP "+JSON.stringify(await P.t1.$$eval("input,select",is=>is.map(i=>i.tagName+i.type+i.placeholder)));
