global.mq=async(id)=>{if(!P.m)P.m=await (await nav.newContext({viewport:{width:1366,height:768}})).newPage();await P.m.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html#scene="+id);await P.m.waitForTimeout(700);return (await txt(P.m));};
const ins=P.c.locator("input:visible");const n=await ins.count();const v=[];for(let i=0;i<n;i++)v.push(await ins.nth(i).inputValue());
const ids=await (async()=>{await mq("c-pret");return await P.m.evaluate(()=>window.LISTE_SCENES.map(s=>s.id||s).join(" "));})();
const t=await mq("c-q1-tour1");const i=t.indexOf("CONNECTÉS");
return JSON.stringify(v)+"\n"+ids+"\nMAQ "+t.slice(i-10,i+90);
