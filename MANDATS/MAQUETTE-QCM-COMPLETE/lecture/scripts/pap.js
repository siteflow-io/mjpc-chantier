const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const h of ["c-resultats&seance=PAP&m=SOIR", "c-resultats&seance=S3E&m=SOIR%3Arendu", "c-resultats&seance=PAP"]) {
    const p = await b.newPage({viewport: {width: 1536, height: 864}});
    await p.goto("file://" + V + "#scene=" + h); await p.waitForTimeout(900);
    const r = await p.evaluate(() => { const t = document.getElementById("root").innerText.replace(/ | /g, " ");
      const th = [...document.querySelectorAll("#root table th")].map(x => x.innerText.split("\n")[0].trim()).join(" | ");
      const pdf = [...document.querySelectorAll("#root button")].find(x => /PDF notes/.test(x.textContent));
      return {titre: (t.match(/📊 [^\n]*/) || [""])[0], info: (t.match(/\n[^\n]*présents[^\n]*/) || [""])[0].trim().slice(0, 150), th, lou: (t.match(/ZELLER Lou\t[^\n]*/) || [""])[0], pdf: pdf ? (pdf.disabled ? "fermé : " + (pdf.title || pdf.parentElement.title) : "ouvert") : "absent"}; });
    console.log(h, JSON.stringify(r, null, 1));
    await p.screenshot({path: "res-" + h.replace(/[^a-z0-9]+/gi, "_") + ".png"});
    await p.close();
  }
  await b.close();
})();
