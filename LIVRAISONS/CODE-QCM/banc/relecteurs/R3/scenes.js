const pw=require("/opt/node22/lib/node_modules/playwright");
(async()=>{const nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const p=await nav.newPage({viewport:{width:1536,height:864}});
await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html");await p.waitForTimeout(1500);
const t=await p.evaluate(()=>document.body.innerText.slice(0,500));console.log(t);
const ids=await p.evaluate(()=>{const s=new Set();document.querySelectorAll('[href*="scene="],[data-scene],[data-id]').forEach(e=>s.add((e.getAttribute('href')||'')+"|"+(e.dataset.scene||e.dataset.id||'')+"|"+e.textContent.trim().slice(0,60)));return [...s]});
console.log(ids.join("\n"));await nav.close();})();
