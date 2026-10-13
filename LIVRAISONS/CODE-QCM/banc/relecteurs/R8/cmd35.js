const clk=async(p,t,droite)=>{const bs=p.locator("button:visible",{hasText:new RegExp("^\\s*"+t+"\\s*$")});const n=await bs.count();for(let i=0;i<n;i++){const bb=await bs.nth(i).boundingBox();if(bb&&((bb.x>640)===droite)){await bs.nth(i).click();return;}}};
await clk(P.t1,"Rome",false);await clk(P.t1,"Milan",true);await clk(P.t2,"Rome",false);await clk(P.t2,"Rome",true);
await P.c.waitForTimeout(1500);const cb=(await btns(P.c)).slice(-250);
const r=P.c.locator("button:visible:not([disabled])",{hasText:"Révéler"});if(await r.count()){await r.click();await P.c.waitForTimeout(1500);}
await cap(P.t1,"28-t1-revele");await cap(P.c,"28-console-revele");await cap(P.ph,"28-tel-revele");await cap(P.b,"28-tableau-revele");
return "CB avant "+cb+"\nT1 "+(await txt(P.t1)).slice(150,1100)+"\nBTN "+await btns(P.t1)+"\nCB "+(await btns(P.c)).slice(-300);
