for(const b of await P.t1.locator("button:visible",{hasText:"Je commence"}).all())await b.click();await P.t1.waitForTimeout(600);
const p=P.t2;await bc(p,"2 élèves");
for(const [m,nom,code] of [[0,"BRUNEAU Camille","2262"],[1,"CARRÉ Tom","2115"]]){const [N,Pr]=nom.split(" ");await p.locator("input[placeholder='Mon code (4 chiffres)']").nth(m).click();await p.keyboard.type(code);await p.locator("input[placeholder='Prénom']").nth(m).click();await p.keyboard.type(Pr);await p.locator("input[placeholder='Nom']").nth(m).click();await p.keyboard.type(N);await p.locator("button:visible",{hasText:"Entrer"}).nth(m).click();await p.waitForTimeout(900);}
const t=await txt(p);if(!t.includes("CARRÉ TOM")){await pad(p,true,"2115");}
await attest(p);for(const b of await p.locator("button:visible",{hasText:"Je commence"}).all())await b.click();await p.waitForTimeout(800);
await cap(P.t1,"09-t1-apres-commence");await cap(P.c,"10-console-prets");
const tc=await txt(P.c);const i=tc.indexOf("CONNECTÉS");
return (await txt(p)).slice(0,600)+"\n=== T1 "+(await txt(P.t1)).slice(0,500)+"\n=== CONSOLE "+tc.slice(i-10,i+90)+"\n"+tc.slice(tc.indexOf("📱 Tablettes"),tc.indexOf("📋 Toutes"));
