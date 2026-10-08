const { prof } = global.__ctx;
const OUT = __dirname.replace(/\/out$/, "") + "/out";
const fs = require("fs");
await prof.locator(".nav2-groupe", {hasText: "Données"}).click();
await new Promise(r => setTimeout(r, 600));
const onglets = await prof.locator(".nav2-sous .tab").allInnerTexts();
const res = prof.locator(".nav2-sous .tab", {hasText: "Résultats"});
if(await res.count()) await res.first().click();
await new Promise(r => setTimeout(r, 800));
await prof.screenshot({path: OUT + "/console_resultats_liste.png"});
await prof.locator(".results-eval-row").first().click();
await prof.locator("table.scoresheet").waitFor({timeout: 15000});
await new Promise(r => setTimeout(r, 800));
await prof.screenshot({path: OUT + "/console_scoresheet.png", fullPage: true});
const rows = await prof.locator("table.scoresheet tbody tr").evaluateAll(trs => trs.map(tr => Array.from(tr.querySelectorAll("td")).map(td => td.innerText.trim())));
const head = await prof.locator("table.scoresheet thead th").allInnerTexts();
fs.writeFileSync(OUT + "/console_scoresheet.json", JSON.stringify({head, rows}, null, 1));
// Export CSV, par le bouton
const [dl] = await Promise.all([prof.waitForEvent("download", {timeout: 15000}), prof.getByRole("button", {name: /Export CSV/}).click()]);
await dl.saveAs(OUT + "/export_console.csv");
// La fiche de Sacha (clic sur son nom)
await prof.locator("td.eleve-cell", {hasText: "OLLIVIER Sacha"}).click();
await prof.locator(".student-report").waitFor({timeout: 10000});
await prof.locator(".student-report").scrollIntoViewIfNeeded();
await prof.locator(".student-report").screenshot({path: OUT + "/console_fiche_sacha.png"});
return "onglets Données : " + onglets.join(" | ") + " ; lignes : " + rows.length;
