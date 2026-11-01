// [C14 1.4.13] l'élève absent, comme en dictée (Paul 01/11 08:37 : « il faut que je puisse déclarer un élève absent comme en dictée ») : clic droit sur sa carte.
// Seulement des gestes ; les évaluations lisent l'état, le DOM et le site simulé.
export async function eprouverAbsent({ pg, verif, cap, att }) {
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
  if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1200); }
  await pg.locator("#gridEleves .eleve-card").first().waitFor({ state: "visible" });
  // un élève sans copie, que ses initiales désignent seul
  const e = await pg.evaluate(() => { const L = Array.from(document.querySelectorAll("#gridEleves .eleve-card")); for (let i = 0; i < L.length; i++) { const nom = L[i].querySelector(".eleve-nom").textContent, k = eleveId(nom);
    const ini = nom.split(/\s+/).map(m => m[0]).join("").toLowerCase(); if (!scPagesDe(k).length && eleveDePar(ini).length === 1) return { i, nom, k, ini }; } return null; });
  const carte = () => pg.locator("#gridEleves .eleve-card").nth(e.i), titre = () => pg.locator("#ruSousTitre").innerText();
  const avant = await titre(), log0 = await pg.evaluate(() => (window.__LOG || []).length);
  await carte().click({ button: "right" }); await att(300);
  const menu = await pg.evaluate(() => { const m = document.getElementById("avMenu"); return m ? m.innerText.replace(/\s+/g, " ") : ""; });
  await cap("C14-50-absent-menu"); await pg.click("#avAbsentBtn"); await att(2200);
  const apres = await titre(), c1 = await pg.evaluate(i => { const c = document.querySelectorAll("#gridEleves .eleve-card")[i]; return { abs: c.classList.contains("absent"), txt: c.innerText.replace(/\s+/g, " ") }; }, e.i);
  const site = await pg.evaluate(k => ruLire(ruCheminSuivi()).then(s => !!(s && s.absents && s.absents[k])), e.k);
  await cap("C14-51-absent-carte");
  await carte().click(); await att(1200);
  const ouvre = await pg.evaluate(() => ({ scans: SC.ouvert, modale: document.getElementById("scModale").classList.contains("show"), mot: (document.getElementById("toast") || {}).textContent || "" }));
  const n = await pg.evaluate(() => state.classe.length);
  verif("absent (1.4.13) : clic droit sur la carte de " + e.nom + " (« " + menu + " ») : marqué absent, sa carte grisée dit « ABS » (" + (c1.abs && /ABS/.test(c1.txt)) + ") ; le compteur ne le compte plus (« " + avant + " » → « " + apres + " ») ; gardé au site avec le suivi de la classe (" + site + ") ; son clic n'ouvre rien et le dit (« " + ouvre.mot.slice(0, 60) + " »)",
    /Marquer absent/.test(menu) && c1.abs && /ABS/.test(c1.txt) && !/pas de copie/.test(c1.txt) && new RegExp("/" + n + " ").test(avant) && new RegExp("/" + (n - 1) + " .*· 1 absent$").test(apres) && site && !ouvre.scans && !ouvre.modale && /marqué absent/.test(ouvre.mot));
  // le Bilan et les Fiches : sa ligne, sans note ; il n'entre pas dans la classe
  await pg.click('#ruOnglets [data-o="donnees"]'); await att(400); await pg.click('#ruSous [data-s="bilan"]'); await att(900);
  const bi = await pg.evaluate(nom => { const v = document.getElementById("ruVue_bilan"), tr = Array.from(v.querySelectorAll("tbody tr")).find(r => r.firstElementChild.textContent === nom), cl = v.querySelector(".av-classe"); return { ligne: tr ? tr.innerText.replace(/\s+/g, " ") : "", classe: cl ? cl.firstElementChild.innerText.replace(/\s+/g, " ") : "" }; }, e.nom);
  await cap("C14-52-absent-bilan");
  await pg.click('#ruSous [data-s="fiches"]'); await att(600);
  const fi = await pg.evaluate(nom => { const tr = Array.from(document.querySelectorAll("#ruVue_fiches tbody tr")).find(r => r.firstElementChild.textContent === nom); return tr ? tr.innerText.replace(/\s+/g, " ") : ""; }, e.nom);
  verif("absent (1.4.13) : le Bilan lui garde sa ligne, sans note (« " + bi.ligne.slice(0, 70) + " »), et la classe le met hors compte (« " + bi.classe + " ») ; les Fiches élèves : « " + fi + " »",
    /ABS/.test(bi.ligne) && /absent : ne compte pas dans la classe/.test(bi.ligne) && /1 absent hors compte/.test(bi.classe) && /absent : pas de fichier/.test(fi));
  await pg.click('#ruOnglets [data-o="pilotage"]'); await att(300); await pg.click('#ruSous [data-s="correction"]'); await att(800);
  // la page rouverte : il est toujours absent ; les initiales ne lui donnent pas de page
  await pg.reload(); await pg.locator("#gridEleves .eleve-card").first().waitFor({ state: "visible", timeout: 20000 }); await att(1500);
  const garde = await pg.evaluate(i => document.querySelectorAll("#gridEleves .eleve-card")[i].classList.contains("absent"), e.i);
  await pg.click("#btnScan"); await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1500);
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
  await pg.click('#scanEcran .sc-haut >> text=Les initiales'); await att(500);
  const p0 = await pg.evaluate(() => { const p = scPagesOrdre()[SC.ia]; return p ? { id: p.id, eleve: p.eleve } : null; });
  await pg.click("#scInit"); await pg.keyboard.type(e.ini); await att(300);
  const sug = await pg.evaluate(() => document.getElementById("scInitSug").innerText.replace(/\s+/g, " "));
  await cap("C14-53-absent-initiales"); await pg.keyboard.press("Enter"); await att(500);
  const p1 = await pg.evaluate(id => (SC.pages[id] || {}).eleve, p0.id);
  verif("absent (1.4.13) : la page rouverte le garde absent (" + garde + ") ; ses initiales, dans « 🔤 Les initiales », ne lui donnent pas de page (« " + sug.slice(0, 80) + " » ; Entrée : la page reste à son élève, " + (p1 === p0.eleve) + ")",
    garde && /est marqué absent/.test(sug) && /Marquer présent/.test(sug) && p1 === p0.eleve);
  await pg.locator('button[onclick="scFermer()"]').click(); await att(1200);
  // clic droit encore : présent ; tout revient comme avant
  await carte().click({ button: "right" }); await att(300); const menu2 = await pg.evaluate(() => document.getElementById("avMenu").innerText.replace(/\s+/g, " "));
  await pg.click("#avAbsentBtn"); await att(2200);
  const fin = await titre(), c2 = await pg.evaluate(i => document.querySelectorAll("#gridEleves .eleve-card")[i].classList.contains("absent"), e.i), site2 = await pg.evaluate(k => ruLire(ruCheminSuivi()).then(s => !!(s && s.absents && s.absents[k])), e.k);
  verif("absent (1.4.13) : clic droit encore (« " + menu2 + " ») : de nouveau présent, le compteur revient (« " + fin + " »), le site aussi (" + !site2 + ")", /Marquer présent/.test(menu2) && !c2 && fin === avant && !site2);
}
