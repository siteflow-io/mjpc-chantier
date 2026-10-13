const l=P.t1.getByText("Pour chaque question, écris").first();await l.click();await P.t1.waitForTimeout(500);await cap(P.t1,"07-attest");
return (await txt(P.t1)).slice(0,900)+"\nBTN "+await btns(P.t1)+"\n"+await l.evaluate(e=>e.parentElement.outerHTML.slice(0,600));
