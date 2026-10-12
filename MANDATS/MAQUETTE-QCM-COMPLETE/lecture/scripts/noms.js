const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const [id, nom] of [["c-resultats-rendues", "ZELLER Lou"], ["c-resultats-rendues", "ABRIAL Julien"], ["m-classe-exclusions", "ABRIAL Julien"], ["m-classe-exclusions", "ZELLER Lou"], ["c-papier-grille", "ESNAULT Inès"]]) {
    const p = await b.newPage({viewport: {width: 1536, height: 864}});
    await p.goto("file://" + V + "#scene=" + id); await p.waitForTimeout(900);
    const els = p.locator(`#root :text-is("${nom}")`);
    const n = await els.count(); let res = [];
    for (let i = 0; i < n; i++) {
      await p.goto("about:blank"); await p.goto("file://" + V + "#scene=" + id); await p.waitForTimeout(700);
      const e = p.locator(`#root :text-is("${nom}")`).nth(i);
      const tag = await e.evaluate(x => x.tagName + "." + x.className);
      try { await e.click({timeout: 1000}); } catch (err) { res.push(tag + " : inatteignable"); continue; }
      await p.waitForTimeout(500);
      const h = decodeURIComponent(await p.evaluate(() => location.hash));
      const titre = await p.evaluate(() => { const m = document.querySelector("#root .modal, #root .fiche, #root [class*=fiche], #root [class*=elf]"); return m ? m.innerText.split("\n").filter(Boolean).slice(0, 2).join(" / ").slice(0, 90) : ""; });
      res.push(tag + " → " + h + " | " + titre);
    }
    console.log(id, "«" + nom + "»", n, "\n   " + res.join("\n   "));
    await p.close();
  }
  await b.close();
})();
