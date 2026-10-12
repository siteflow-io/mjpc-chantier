// Fige, une fois, les valeurs attendues des contrôles, d'après des écrans déjà validés ou audités :
// les notes du tableau de chaque séance (la v8, auditée le 12/10 ; pour la séance sur papier, sa grille c-papier-grille),
// et le texte du PDF figé de la séance de 3e (validé par Paul, points 602 à 643).
// usage : node figer-attendus.js maquette-qcm-v8.html attendus/
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs"), path = require("path");
const [V, OUT] = process.argv.slice(2);
const LIRE = () => { const tb = document.querySelector("#root table"); if (!tb) return null;
  const th = [...tb.querySelectorAll("th")].map(x => x.innerText.replace(/\s+/g, " ").trim());
  const rows = [...tb.querySelectorAll("tbody tr")].map(tr => [...tr.children].map(td => td.innerText.replace(/\s+/g, " ").trim()));
  return {th, rows}; };
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const notes = {};
  for (const [id, h] of [["S08", "c-resultats"], ["S3E", "c-resultats&seance=S3E"], ["CH1", "c-resultats&seance=CH1"], ["JB", "c-resultats&seance=JB"], ["PAP", "c-papier-grille"]]) {
    const p = await b.newPage({viewport: {width: 1536, height: 864}});
    await p.goto("file://" + path.resolve(V) + "#scene=" + h); await p.waitForTimeout(1000);
    const t = await p.evaluate(LIRE);
    const iN = t.th.findIndex(x => x === "Note"), i20 = t.th.findIndex(x => x === "Sur 20");
    const nq = t.th.filter(x => /^Q\d+$/.test(x)).length;
    notes[id] = {questions: nq, eleves: {}};
    for (const r of t.rows) notes[id].eleves[r[0]] = r.length < 3 ? "absent" : [r[iN], r[i20]];
    await p.close();
  }
  // la séance sur papier : ses trois questions sont celles de l'évaluation d'essai ; Adam y est absent
  if (!notes.PAP.eleves["YVON Adam"]) notes.PAP.eleves["YVON Adam"] = "absent";
  fs.writeFileSync(path.join(OUT, "notes.json"), JSON.stringify(notes, null, 1));
  const p = await b.newPage({viewport: {width: 1536, height: 864}});
  await p.goto("file://" + path.resolve(V) + "#scene=x632-pdf"); await p.waitForTimeout(1200);
  const pdf = await p.evaluate(() => [...document.querySelectorAll("iframe")].map(f => f.contentDocument.body.innerText).join("\n"));
  fs.writeFileSync(path.join(OUT, "pdf-3e.txt"), pdf);
  await b.close();
  console.log(Object.entries(notes).map(([k, v]) => k + " : " + v.questions + " questions, " + Object.keys(v.eleves).length + " élèves").join(" · "), "· PDF", pdf.length, "caractères");
})();
