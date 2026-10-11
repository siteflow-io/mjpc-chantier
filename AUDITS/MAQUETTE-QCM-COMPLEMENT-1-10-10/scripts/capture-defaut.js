const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const [ , , fichier, sortie, apercu] = process.argv;
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1536,height:864}, deviceScaleFactor:1.5});
  await p.goto("file://" + fichier + "#scene=m-classe-exclusions"); await p.waitForTimeout(1200);
  await p.evaluate((apercu) => {
    const marque = (el, ok) => {
      const t = document.createElement("span");
      t.textContent = ok ? "✔ s'ouvre" : "✖ fermé";
      t.style.cssText = "position:absolute;right:6px;top:50%;transform:translateY(-50%);font:700 11px/1 sans-serif;padding:3px 6px;border-radius:6px;" + (ok ? "background:#16a34a;color:#fff" : "background:#dc2626;color:#fff");
      el.style.position = "relative"; el.appendChild(t);
    };
    for (const e of document.querySelectorAll("button")) {
      const txt = e.textContent;
      if (!/Tableau de bord|Classes|Élèves & codes|Profil test|Architecture|Archives|Corbeille|Annonces|Dates de l|Taxonomie|Emploi du temps|Atelier|Configuration|Présence live|Code professeur|Oublier la clé/.test(txt)) continue;
      if (apercu && e.disabled) { e.style.opacity = ".45"; e.style.cursor = "not-allowed"; }
      
    }
  }, apercu === "1");
  await p.screenshot({path: sortie, clip: {x: 218, y: 30, width: 1070, height: 770}});
  await b.close();
})();
