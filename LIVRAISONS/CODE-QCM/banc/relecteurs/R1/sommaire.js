(async()=>{
const nav = await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
const p = await nav.newPage({viewport:{width:1536,height:864}});
await p.goto("file:///home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html");
await p.waitForTimeout(1500);
const html = await p.evaluate(()=>{ const out=[]; document.querySelectorAll('a[href*="scene="], [data-scene]').forEach(a=>out.push((a.getAttribute('href')||a.getAttribute('data-scene'))+" | "+a.textContent.trim().replace(/\s+/g,' ').slice(0,150))); return out.join("\n");});
console.log(html.slice(0,20000));
await nav.close();})();
