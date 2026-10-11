// Les trois gardes du complément 2 (§5), branchées dans le banc unique avec celles du complément 1. Elles lisent la scène
// ouverte dans Chromium (et ses iframes), et passent par le geste pour les copies de l'emploi du temps.
//   6. Un bouton fermé de Paul se voit fermé : estompé (ou d'une autre couleur qu'un bouton actif de même classe), sans la main,
//      et sa raison lisible au survol (la souris, posée au centre, atteint un élément ouvert qui porte une infobulle).
//   7. Le panneau de MJPC : bord à bord aux trois tailles de la console ; ↻ ✕ dans la carte de chaque élève, sur la ligne du nom ;
//      aucune règle de CSS qui change index.html sans son écart inscrit (banc/existant/ecarts-mjpc.json).
//   8. La section « Emploi du temps » : rien ne défile de côté, aucun bouton sur plus de deux lignes ; les lignes d'état et
//      les copies recomptées sur les données du dossier MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT/.
const path = require("path"), fs = require("fs");
const RACINE = path.join(__dirname, "..");
const SAS = path.join(RACINE, "..", "..");
const PROD = process.env.PROD || "/home/user/siteflow-io/monsieurjaipascompris";
const lire = p => fs.readFileSync(p, "utf8");
const TAILLES_CONSOLE = [{w: 1366, h: 768}, {w: 1536, h: 864}, {w: 1920, h: 1080}];

/* ════════ Garde 6 — un bouton fermé de Paul se voit fermé ════════ */
// Les vues de Paul : la console (MJPC compris) et le téléphone. Une moitié d'élève montrée dans la console (le mode test,
// « 👁 », « 🔍 Jouer en grand ») suit les règles de l'élève : le clic figé de B y reste tel que les maquettes validées le montrent.
const VUES_PAUL = ["console", "telephone"];
function lireFermes(){
  const root = document.getElementById("root"), out = [];
  const visible = el => { const r = el.getBoundingClientRect(); if(r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none"; };
  const eleve = el => !!el.closest(".moitie,.eleve-page,.tablette,.sim,.grand-tab,.voir-tab-in");
  const ferme = b => b.disabled || b.getAttribute("aria-disabled") === "true";
  const opacite = el => { let o = 1; for(let a = el; a && a.nodeType === 1; a = a.parentElement) o *= +getComputedStyle(a).opacity; return o; };
  // une fenêtre ouverte recouvre la page : seuls ses boutons sont à portée de la souris
  const couches = Array.from(root.querySelectorAll(".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.fen-fond"));
  const dessus = couches.length ? couches[couches.length - 1] : null;
  const btns = Array.from(root.querySelectorAll("button")).filter(visible);
  btns.forEach(b => {
    if(!ferme(b) || eleve(b) || (dessus && !dessus.contains(b))) return;
    b.scrollIntoView({block: "center", inline: "center"});
    const cs = getComputedStyle(b), o = opacite(b);
    const freres = btns.filter(x => x !== b && !ferme(x) && x.className === b.className);
    const identique = freres.some(x => { const c = getComputedStyle(x); return c.color === cs.color && c.backgroundColor === cs.backgroundColor && c.backgroundImage === cs.backgroundImage; });
    const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const hit = (cx >= 0 && cy >= 0 && cx < innerWidth && cy < innerHeight) ? document.elementFromPoint(cx, cy) : null;
    const hb = hit && hit.closest("button");
    const t = hit && hit.closest("[title]");
    out.push({txt: (b.innerText || "").replace(/\s+/g, " ").trim().slice(0, 50), cls: b.className, o: Math.round(o * 100) / 100, cursor: cs.cursor, freres: freres.length, identique,
      survol: !hit ? "hors de l'écran" : (hb && ferme(hb)) ? "la souris tombe sur le bouton fermé" : !t || !t.getAttribute("title").trim() ? "aucune infobulle sous la souris" : null,
      raison: t ? t.getAttribute("title") : ""});
  });
  window.scrollTo(0, 0);
  return out;
}
function garde6(sc, lu){
  const out = [];
  for(const x of lu){
    const nom = "garde 6. " + sc + " : « " + x.txt + " » (fermé)";
    if(!(x.o <= 0.6 || (x.freres > 0 && !x.identique))) out.push(nom + " ne se voit pas fermé — opacité " + x.o + (x.freres ? ", même couleur et même fond qu'un bouton actif de même classe" : ", aucun bouton actif de même classe pour s'en distinguer"));
    if(x.cursor === "pointer") out.push(nom + " garde la main comme curseur");
    if(x.survol) out.push(nom + " : sa raison ne se lit pas au survol — " + x.survol);
  }
  return out;
}

/* ════════ Garde 7 — le panneau de MJPC, et ses écarts avec le vrai site ════════ */
function lirePanneau(){
  const b = document.querySelector(".tprof-box"); if(!b) return null;
  const r = b.getBoundingClientRect();
  return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: innerWidth, h: innerHeight, sw: document.documentElement.scrollWidth};
}
function garde7Panneau(sc, T, x){
  const out = [], tag = "garde 7. " + sc + " @" + T.w + "×" + T.h;
  if(!x){ out.push(tag + " : pas de panneau prof"); return out; }
  const bords = [["gauche", x.l, 0], ["haut", x.t, 0], ["droite", x.r, x.w], ["bas", x.b, x.h]].filter(c => Math.abs(c[1] - c[2]) > 1);
  if(bords.length) out.push(tag + " : le panneau ne touche pas les bords de la fenêtre (dette 87) — " + bords.map(c => c[0] + " " + Math.round(c[1]) + " au lieu de " + c[2]).join(", "));
  if(x.sw > x.w + 1) out.push(tag + " : la page défile de côté — " + x.sw + " px pour " + x.w);
  return out;
}
function lireLignesEleves(){
  return Array.from(document.querySelectorAll(".el-row")).filter(r => r.getBoundingClientRect().width > 0).map(r => {
    const c = r.getBoundingClientRect(), a = r.querySelector(".el-acts"), n = r.querySelector(".el-name");
    if(!a || !n) return {nom: n ? n.textContent.trim() : "?", manque: !a ? ".el-acts" : ".el-name"};
    // la boîte de ↻ ✕ : celle de leurs deux boutons (ils débordent de .el-acts quand la colonne est trop étroite)
    const bs = Array.from(a.querySelectorAll("button")).map(x => x.getBoundingClientRect()).concat([a.getBoundingClientRect()]);
    const ar = {left: Math.min(...bs.map(x => x.left)), right: Math.max(...bs.map(x => x.right)), top: Math.min(...bs.map(x => x.top)), bottom: Math.max(...bs.map(x => x.bottom))}, nr = n.getBoundingClientRect();
    return {nom: n.textContent.trim(), dans: ar.left >= c.left - 0.5 && ar.right <= c.right + 0.5 && ar.top >= c.top - 0.5 && ar.bottom <= c.bottom + 0.5,
      ecart: Math.round(Math.abs((ar.top + ar.bottom) / 2 - (nr.top + nr.bottom) / 2)), a: [Math.round(ar.left - c.left), Math.round(ar.top - c.top)]};
  });
}
function garde7Lignes(sc, lu){
  const out = [];
  for(const x of lu){
    const tag = "garde 7. " + sc + " : la ligne de « " + x.nom + " »";
    if(x.manque){ out.push(tag + " n'a pas " + x.manque); continue; }
    if(!x.dans) out.push(tag + " : ↻ ✕ sortent de la carte (dette 88) — à " + x.a[0] + " px du bord gauche, " + x.a[1] + " px sous le haut");
    if(x.ecart > 4) out.push(tag + " : ↻ ✕ ne sont pas sur la ligne du nom (dette 88) — " + x.ecart + " px d'écart");
  }
  return out;
}
// Les règles de CSS d'index.html : dans ses <style>, et celles que edtPoserCss pose (l. 20006 et suivantes)
function reglesCss(texte){
  const out = []; let i = 0; const n = texte.length;
  while(i < n){
    const j = texte.indexOf("{", i); if(j < 0) break;
    const sel = texte.slice(i, j).replace(/\/\*[\s\S]*?\*\//g, "").trim();
    let d = 0, k = j; for(; k < n; k++){ if(texte[k] === "{") d++; else if(texte[k] === "}"){ d--; if(d === 0) break; } }
    const corps = texte.slice(j + 1, k);
    if(/^@media/.test(sel)) reglesCss(corps).forEach(r => out.push({sel: sel + " " + r.sel, decl: r.decl}));
    else if(!/^@keyframes/.test(sel) && sel) out.push({sel, decl: corps});
    i = k + 1;
  }
  return out;
}
const normSel = s => s.replace(/\s+/g, " ").replace(/\s*([>,+~])\s*/g, "$1").trim();
const normDecl = d => d.replace(/\/\*[\s\S]*?\*\//g, "").split(";").map(x => x.replace(/\s+/g, " ").trim().replace(/\s*:\s*/, ":")).filter(Boolean).sort().join(";");
function cssIndex(){
  const txt = lire(path.join(PROD, "index.html"));
  const regles = [];
  for(const m of txt.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) regles.push(...reglesCss(m[1]));
  const edt = /function edtPoserCss\(\)\{([\s\S]*?)\n\}/.exec(txt);
  if(edt){ const s = (edt[1].match(/\+'((?:[^'\\]|\\.)*)'/g) || []).map(x => x.slice(2, -1).replace(/\\'/g, "'")).join(""); regles.push(...reglesCss(s)); }
  const parSel = {}; regles.forEach(r => { (parSel[normSel(r.sel)] = parSel[normSel(r.sel)] || []).push(normDecl(r.decl)); });
  const classes = new Set(); regles.forEach(r => (r.sel.match(/\.[\w-]+/g) || []).forEach(c => classes.add(c)));
  return {parSel, classes};
}
// Les fichiers de CSS des écrans de MJPC dans la maquette : la copie d'index.html, et ce qui s'y ajoute
const CSS_MJPC = ["mjpc.css", "mjpc-ajouts.css", "mjpc-edt.css"];
function ecarts(){ const f = path.join(__dirname, "existant", "ecarts-mjpc.json"); return fs.existsSync(f) ? JSON.parse(lire(f)).ecarts : []; }
// Une règle de la maquette change index.html quand elle vise des éléments du vrai site (toutes ses classes y existent)
// sans être une règle d'index.html telle quelle (même sélecteur, mêmes déclarations). Les classes nouvelles (ex-…, m8tx-comps…)
// sont des éléments que le cadrage ajoute : leurs règles ne changent rien d'index.html.
function garde7Ecarts(verif){
  const I = cssIndex(), E = ecarts();
  const CAD = lire(path.join(SAS, "MANDATS", "CADRAGE-QCM.md")).split("\n");
  const DET = fs.existsSync(path.join(PROD, "docs", "MJPC6-DETTES.md")) ? lire(path.join(PROD, "docs", "MJPC6-DETTES.md")) : "";
  const REG = lire(path.join(SAS, "MANDATS", "COMPLEMENT-MAQUETTE-QCM-COMPLETE-2.md"));
  // chaque écart a sa raison : un point du cadrage qui existe, une dette du registre, ou la simulation déclarée
  for(const e of E){
    const ok = e.type === "cadrage" ? CAD.some(l => l.startsWith(e.ref + ". ")) : e.type === "dette" ? (DET.includes(e.ref) || REG.includes(e.ref)) : e.type === "simulation" ? !!(e.raison && e.raison.length > 20) : false;
    verif(ok && e.raison && e.raison.length > 20, "garde 7. l'écart « " + (e.selecteur || e.quoi) + " » a sa raison (" + e.type + " " + (e.ref || "") + ")", e.raison || "aucune");
  }
  const inscrits = new Set(E.filter(e => e.selecteur).map(e => normSel(e.selecteur)));
  let n = 0;
  for(const f of CSS_MJPC){
    const p = path.join(RACINE, "src", f); if(!fs.existsSync(p)) continue;
    for(const r of reglesCss(lire(p))){
      const s = normSel(r.sel), cls = r.sel.match(/\.[\w-]+/g) || [];
      if(!cls.length || !cls.every(c => I.classes.has(c))) continue;
      n++;
      const tel = (I.parSel[s] || []).includes(normDecl(r.decl));
      verif(tel || inscrits.has(s), "garde 7. src/" + f + " : la règle « " + r.sel.slice(0, 90) + " » est celle d'index.html, ou son écart est inscrit (ecarts-mjpc.json)",
        I.parSel[s] ? "index.html dit « " + I.parSel[s][0].slice(0, 120) + " » ; la maquette dit « " + normDecl(r.decl).slice(0, 120) + " »" : "règle absente d'index.html");
    }
  }
  return n;
}

/* ════════ Garde 8 — la section « Emploi du temps » ════════ */
const EDT_DOSSIER = path.join(SAS, "MANDATS", "COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT");
const EDT_OBJETS = ["calendrier", "grille", "creneaux", "periodes", "decisions", "photos", "reglages"];   // index.html, l. 18482
function edtDonnees(){ const o = {}; EDT_OBJETS.forEach(k => { const f = path.join(EDT_DOSSIER, k + ".json"); if(fs.existsSync(f)) o[k] = JSON.parse(lire(f)); }); return o; }
// Les trois lignes d'état, recalculées comme edtPeindrePanneau (l. 19802 à 19806), avec edtVersions (l. 18502) et edtNomsDeGrille (l. 19663)
function edtEtatsAttendus(){
  const E = edtDonnees(), cal = E.calendrier, gr = E.grille, cr = E.creneaux;
  const versions = Array.isArray(gr.versions) && gr.versions.length ? gr.versions : [{creneaux: gr.creneaux}];
  const cases = [].concat(...versions.map(v => v.creneaux || []));
  const noms = []; cases.forEach(c => { if(c && c.mjpc !== false && c.classe && !noms.includes(c.classe)) noms.push(c.classe); });
  const at = cr.creneaux.slice().sort((a, b) => (a.rang || 0) - (b.rang || 0)).map(c => c.debut + "-" + c.fin);
  return [
    "Calendrier de l’année — " + cal.semaines.length + " semaines · " + cal.vacances.length + " périodes sans cours · " + cal.feries.length + " fériés · " + cal.jalons.length + " jalons · " + cal.evenementsClasse.length + " événements de classe",
    "Grille de l’emploi du temps — " + cases.length + " cases · " + noms.length + " classes nommées",
    "Créneaux horaires — " + cr.creneaux.length + " créneaux — " + at.join(" · ")];
}
// Ce que « ⤓ Sortir les JSON cochés » copie : l'objet seul (edtSortirJson, l. 20792), ou chaque objet sous son identifiant
function edtLongueur(ids){
  const E = edtDonnees();
  if(ids.length === 1) return JSON.stringify(E[ids[0]], null, 1).length;
  const o = {}; ids.forEach(k => { o[k] = E[k]; }); return JSON.stringify(o, null, 1).length;
}
function lireEdt(){
  const sec = document.querySelector(".edt-panneau"); if(!sec) return null;
  const cont = sec.closest(".tprof-content") || sec.parentElement;
  // les lignes du texte d'un bouton : les hauteurs distinctes des boîtes de son texte
  const boutons = Array.from(sec.querySelectorAll("button")).filter(b => b.getBoundingClientRect().width > 0).map(b => {
    const rg = document.createRange(); rg.selectNodeContents(b);
    const tops = Array.from(rg.getClientRects()).filter(r => r.width > 0.5 && r.height > 0.5).map(r => r.top).sort((a, c) => a - c);
    let lignes = 0, der = -1e9; tops.forEach(t => { if(t - der > 4){ lignes++; der = t; } });
    return {txt: b.innerText.replace(/\s+/g, " ").trim(), lignes: Math.max(lignes, 1)};
  });
  // ce qui défile de côté : la zone du contenu du panneau, la section, et chacun de ses éléments
  const debords = [cont, sec].concat(Array.from(sec.querySelectorAll("*"))).filter(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1)
    .map(el => "." + String(el.className || el.tagName).split(" ")[0] + " " + el.scrollWidth + " px pour " + el.clientWidth);
  return {boutons, debords, page: document.documentElement.scrollWidth > innerWidth + 1 ? document.documentElement.scrollWidth + "/" + innerWidth : null,
    etats: Array.from(sec.querySelectorAll(".edt-etat")).map(e => e.textContent.replace(/\s+/g, " ").trim())};
}
function garde8Place(sc, T, x){
  const out = [], tag = "garde 8. " + sc + " @" + T.w + "×" + T.h;
  if(!x){ out.push(tag + " : pas de section « Emploi du temps »"); return out; }
  if(x.page) out.push(tag + " : la page défile de côté — " + x.page);
  x.debords.forEach(d => out.push(tag + " : le contenu défile de côté — " + d));
  x.boutons.filter(b => b.lignes > 2).forEach(b => out.push(tag + " : « " + b.txt.slice(0, 60) + " » tient sur " + b.lignes + " lignes"));
  return out;
}
function garde8Etats(sc, x){
  const out = [], att = edtEtatsAttendus();
  if(!x) return out;
  att.forEach((a, i) => { if((x.etats[i] || "") !== a) out.push("garde 8. " + sc + " : la ligne d'état " + (i + 1) + " dit « " + (x.etats[i] || "rien") + " » ; les données du dossier donnent « " + a + " »"); });
  return out;
}
// Les copies, par le geste : un objet coché, plusieurs, puis tous ; rien de coché, le bouton est fermé
async function garde8Copies(page, sc, verif){
  const cases = page.locator(".edt-sortir input[type=checkbox]");
  const ids = await cases.evaluateAll(l => l.map(x => x.getAttribute("data-objet")));
  const bouton = page.locator(".edt-sortir .edt-sortir-btn");
  const coche = async liste => { for(let i = 0; i < ids.length; i++){ const c = cases.nth(i); if((await c.isChecked()) !== liste.includes(ids[i])) await c.click(); } };
  const presents = EDT_OBJETS.filter(k => fs.existsSync(path.join(EDT_DOSSIER, k + ".json")));
  verif(JSON.stringify(ids) === JSON.stringify(presents), "garde 8. " + sc + " : une case par objet présent au hub, dans l'ordre d'EDT_OBJETS", ids.join(", "));
  await coche([]);
  verif(await bouton.isDisabled(), "garde 8. " + sc + " : rien de coché, « ⤓ Sortir les JSON cochés » est fermé");
  for(const liste of [["calendrier"], ["calendrier", "grille", "creneaux"], presents]){
    await coche(liste); await bouton.click(); await page.waitForTimeout(60);
    const msg = await page.locator(".at-modale-m").first().textContent().catch(() => "");
    const n = edtLongueur(liste);
    const noms = liste.map(k => "« " + k + " »");
    const attendu = "JSON de " + (noms.length > 1 ? noms.slice(0, -1).join(", ") + " et " + noms[noms.length - 1] : noms[0]) + " copié — " + n + " caractères.";
    verif((msg || "").trim() === attendu, "garde 8. " + sc + " : « ⤓ Sortir les JSON cochés » avec " + liste.join(", ") + " dit le nombre de caractères de JSON.stringify(…, null, 1)", "« " + (msg || "").trim() + " » ; attendu « " + attendu + " »");
    const ok = page.locator(".at-modale .at-btn"); if(await ok.count()) await ok.first().click();
  }
}

module.exports = {VUES_PAUL, TAILLES_CONSOLE, lireFermes, garde6, lirePanneau, garde7Panneau, lireLignesEleves, garde7Lignes, garde7Ecarts, cssIndex, reglesCss, lireEdt, garde8Place, garde8Etats, garde8Copies, edtEtatsAttendus, edtLongueur, edtDonnees, EDT_OBJETS};
