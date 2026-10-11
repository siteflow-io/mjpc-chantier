const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const res = [];
  const scenes = ["m-classe-exclusions","m-exclusion-refusee","m-fiche-eleve","m-taxonomie","m-taxonomie-editeur","m-taxonomie-domaine","m-taxonomie-notion","m-taxonomie-competences","m-taxonomie-competence","m-emploi-du-temps"];
  for (const [w,h] of [[1366,768],[1536,864],[1920,1080]]) {
    const p = await b.newPage({viewport:{width:w,height:h}});
    for (const id of scenes) {
      await p.goto("file://" + process.argv[2] + "#scene=" + id); await p.reload(); await p.waitForTimeout(400);
      // à chaque position de défilement du contenu, ce que le ⚙ recouvre
      const r = await p.evaluate(async () => {
        const g = document.querySelector("button.som-gear").getBoundingClientRect();
        const cont = document.querySelector(".tprof-content"); const hits = new Set();
        const max = cont ? cont.scrollHeight - cont.clientHeight : 0;
        for (let y = 0; y <= max + 1; y += 40) {
          if (cont) cont.scrollTop = y; await new Promise(r => requestAnimationFrame(r));
          for (const e of document.querySelectorAll(".tprof-box button, .tprof-box input, .tprof-box label, .tprof-box .el-code")) {
            const a = e.getBoundingClientRect(); if (!a.width) continue;
            const ox = Math.min(a.right, g.right) - Math.max(a.left, g.left), oy = Math.min(a.bottom, g.bottom) - Math.max(a.top, g.top);
            if (ox > 1 && oy > 1) hits.add((e.textContent || e.value || e.tagName).trim().slice(0, 30));
          }
        }
        return {gear: [g.left, g.top, g.right, g.bottom].map(Math.round), hits: [...hits]};
      });
      if (r.hits.length) res.push(`${w}x${h} ${id} : ⚙ ${JSON.stringify(r.gear)} recouvre ${JSON.stringify(r.hits)}`);
    }
    await p.close();
  }
  console.log(res.length ? res.join("\n") : "aucun recouvrement");
  await b.close();
})();
