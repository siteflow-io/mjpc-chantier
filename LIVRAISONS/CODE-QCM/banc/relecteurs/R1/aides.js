global.touche = async (p, moitie, lab) => {
  const W = p.viewportSize().width;
  const bs = await p.getByRole("button",{name:lab, exact:true}).all();
  for (const b of bs) { const bb=await b.boundingBox(); if(!bb) continue; const c=bb.x+bb.width/2; if((moitie===0 && c<W/2)||(moitie===1&&c>=W/2)){ await b.click({timeout:1000}); return true;} }
  throw new Error("touche introuvable "+lab+" moitie "+moitie);
};
global.taper = async (p,m,s)=>{ for(const ch of s){ await touche(p,m, ch===" "?"espace":ch); } };
global.champ = async (p,m,ph)=>{ const W=p.viewportSize().width; for(const e of await p.locator(`input[placeholder="${ph}"]`).all()){ const bb=await e.boundingBox(); if(!bb) continue; const c=bb.x+bb.width/2; if((m===0&&c<W/2)||(m===1&&c>=W/2)){ await e.click(); await p.waitForTimeout(200); return;} } throw new Error("champ "+ph); };
global.jouer = async (plan, secs, tag) => {
 const log=[]; const fait={}; let last={};
 for(let s=0;s<secs*2;s++){
  for(const [i,a] of plan.entries()){
   const t=(await txt(a.p)); const k=t.replace(/\d+/g,"#").replace(/\s+/g," ");
   if(last[i]!==k){ last[i]=k; const n=tag+"-"+i+"-"+s; await shot(a.p,n); log.push(n+": "+t.replace(/\s+/g," ").slice(0,700)); }
   for(const ch of (a.choix||[])){ if(!fait[i+ch]){ try{ await touche(a.p,a.m,ch); fait[i+ch]=1; log.push("  clic "+ch); }catch(e){} } }
   if(a.b && !fait[i+"b"]){ try{ await touche(a.p,a.m,a.b); fait[i+"b"]=1; log.push("  clic B "+a.b); }catch(e){} }
  }
  if(plan.every((a,i)=>(!a.b||fait[i+"b"]))) break;
  await D.c.waitForTimeout(500);
 }
 return log.join("\n");
};
