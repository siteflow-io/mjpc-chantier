global.commence=async(p)=>{for(let k=0;k<3;k++){const b=p.locator("button:visible:not([disabled])",{hasText:"Je commence"});if(!(await b.count()))break;await b.first().click();await p.waitForTimeout(500);}};
await commence(P.t1);
const p=P.t2;await bc(p,"2 élèves");
for(const [m,nom,code] of [[0,"BRUNEAU Camille","2262"]]){const [N,Pr]=nom.split(" ");await p.locator("input[placeholder='Mon code (4 chiffres)']").nth(m).click();await p.keyboard.type(code);await p.locator("input[placeholder='Prénom']").nth(m).click();await p.keyboard.type(Pr);await p.locator("input[placeholder='Nom']").nth(m).click();await p.keyboard.type(N);await p.locator("button:visible",{hasText:"Entrer"}).nth(m).click();await p.waitForTimeout(900);}
await pad(p,true,"2115");
await attest(p);await commence(p);
await cap(P.t1,"09-t1-apres-commence");await cap(P.c,"10-console-prets");
const tc=await txt(P.c);const i=tc.indexOf("CONNECTÉS");
return (await txt(p)).slice(0,600)+"\n=== T1 "+(await txt(P.t1)).slice(0,500)+"\n=== CONSOLE "+tc.slice(i-10,i+90)+"\n"+tc.slice(tc.indexOf("📱 Tablettes"),tc.indexOf("📋 Toutes"));
