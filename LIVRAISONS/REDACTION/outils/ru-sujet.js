// =====================================================================
// RU — UN SUJET NAÎT COMME UN CHAPITRE (R3, R8) ; PAUL LIT CHAQUE PHRASE AVANT UN ÉLÈVE (R4, R4 bis)
// =====================================================================
// « ➕ Nouveau sujet » : coller le JSON préparé avec Claude (PROMPT-REDACTION.md) → « Vérifier » (les refus en clair,
// une phrase par refus) → « Créer » (/redactions/<id>/config, rangé par normaliserSujet).
// « Préparer le sujet » : un point de la grille par écran ; corriger dans la case (validé d'office) ; « ✓ Je valide ce point ».
// Une phrase choisie en corrigeant compte comme lue ; une phrase réécrite au crayon est lue d'office.
// La fiche d'un élève ne sort pas tant qu'une phrase qu'elle porte n'est pas lue.
// Au hub : /redactions/<id>/validations/<clé> = { le, par }   (par : "point" | "choix" | "case" | "fiche")
//          /redactions_communes/validations/<écran> = { le }  (les mots de liaison, les phrases fixes)
const RU_SUJET_MSG_VIDE = "Colle d’abord la réponse de l’IA.";
const RU_ID_OK = /^[a-z0-9][a-z0-9_-]{1,60}$/;
let RU_VALID = {}, RU_VALID_COMMUNES = {};
// ── les identifiants de compétence de /taxonomie (R8) ──
function ruIdsTaxonomie(taxo) {
  const ids = new Set(); const t = taxo && taxo.competences; if (!t) return ids;
  Object.keys(t).forEach(k => { const grp = t[k]; (Array.isArray(grp) ? grp : Object.values(grp || {})).forEach(d => { if (!d) return; if (d.id) ids.add(d.id); (Array.isArray(d.items) ? d.items : Object.values(d.items || {})).forEach(i => { if (i && i.id && i.actif !== false) ids.add(i.id); }); }); });
  return ids;
}
// ── « Vérifier » : chaque refus est une phrase, qui cite l'élément fautif ──
function ruValiderSujet(o, taxo, existants) {
  const V = mjpcValidation(12);
  if (!o || typeof o !== "object" || Array.isArray(o)) { V.exige(false, "La réponse doit être un sujet (un objet JSON entre accolades), pas une liste ni un texte."); return V; }
  if ("published" in o) V.exige(false, "La réponse contient « published » : un sujet ne se publie pas en le collant. Retire ce champ.");
  V.exige(typeof o.id === "string" && RU_ID_OK.test(o.id), "« id » manque ou n’est pas un identifiant simple (lettres minuscules sans accent, chiffres, tirets : par exemple « lettre-grande-guerre-3e »).");
  if (typeof o.id === "string" && existants && existants[o.id]) V.exige(false, "Un sujet porte déjà l’identifiant « " + o.id + " » : change « id » dans la réponse (pour corriger ce sujet-là, ouvre « Préparer le sujet »).");
  V.exige(typeof o.titre === "string" && o.titre.trim(), "Il manque le titre du sujet (« titre »).");
  V.exige(typeof o.total === "number" && o.total > 0, "Il manque le total des points (« total », un nombre, par exemple 40).");
  V.exige(typeof o.enonce === "string" ? o.enonce.trim() : (Array.isArray(o.enonce) && o.enonce.length), "Il manque l’énoncé donné aux élèves (« enonce »).");
  if (!Array.isArray(o.variantes) && !Array.isArray(o.criteres)) { V.exige(false, "Il manque la grille : « criteres » (un sujet) ou « variantes » (plusieurs sujets au choix, chacun sa grille)."); return V; }
  const c = normaliserSujet(o); const ids = ruIdsTaxonomie(taxo); const vus = {};
  c.variantes.forEach((v, vi) => {
    const ou = c.variantes.length > 1 ? " (sujet « " + (v.libelle || v.id || vi + 1) + " »)" : "";
    V.exige(typeof v.id === "string" && v.id && !vus[v.id], "Chaque sujet au choix doit avoir un « id » différent" + ou + "."); vus[v.id] = 1;
    if (v.repere != null) { try { new RegExp(v.repere, "i"); } catch (e) { V.cite(v.repere, "n’est pas un repère lisible" + ou + "."); } }
    V.exige(Array.isArray(v.criteres) && v.criteres.length, "La grille n’a aucun critère" + ou + ".");
    let somme = 0; const indIds = {};
    (v.criteres || []).forEach(cr => {
      V.exige(cr && cr.id && cr.titre, "Un critère n’a pas d’« id » ou de « titre »" + ou + ".");
      if (!cr) return;
      V.exige(typeof cr.pts_max === "number", "Le critère « " + (cr.titre || cr.id) + " » n’a pas de points (« pts_max »)" + ou + ".");
      somme += +cr.pts_max || 0;
      let sp = 0;
      if (cr.consignes != null) V.exige(Array.isArray(cr.consignes) && cr.consignes.length === 4 && cr.consignes.every(x => typeof x === "string" && x.trim()), "Les consignes du critère « " + cr.titre + " » doivent être quatre phrases, une par niveau (du plus faible au plus fort)" + ou + ".");
      V.exige(Array.isArray(cr.indicateurs) && cr.indicateurs.length, "Le critère « " + (cr.titre || cr.id) + " » n’a aucun point à évaluer (« indicateurs »)" + ou + ".");
      (cr.indicateurs || []).forEach(ind => {
        if (!ind) return; const nom = "« " + (ind.libelle || ind.id) + " »";
        V.exige(ind.id && ind.libelle && !indIds[ind.id], "Chaque point doit avoir un « id » unique et un « libelle » (" + (ind.id || "?") + ")" + ou + "."); indIds[ind.id] = 1;
        V.exige(typeof ind.poids === "number" && ind.poids > 0, "Le point " + nom + " n’a pas de poids (« poids », un nombre)" + ou + ".");
        sp += +ind.poids || 0;
        if (!ind.competences.length) V.exige(false, "Le point " + nom + " ne dit pas sa compétence (« competence », un identifiant de la taxonomie)" + ou + ".");
        ind.competences.forEach(k => { if (!ids.has(k)) V.inconnu(k, "compétence du point " + nom, "prends un identifiant de la taxonomie du site (par exemple c4-ecrire-01)"); });
        const d = ind.descripteurs;
        if (!Array.isArray(d) || d.length !== 4 || !d.every(x => typeof x === "string" && x.trim())) V.exige(false, "Le point " + nom + " doit avoir quatre niveaux rédigés (« descripteurs », du plus faible au plus fort) : un échelon manque" + ou + ".");
        else d.forEach((x, e) => { if (x.indexOf("{prenom}") < 0) V.exige(false, "Le niveau " + (e + 1) + " du point " + nom + " ne commence pas par l’élève : « {prenom} » est absent" + ou + "."); });
        const s = ind.sous;
        if (!Array.isArray(s) || s.length !== 4) V.exige(false, "Le point " + nom + " doit avoir ses sous-niveaux pour chacun des quatre niveaux (« sous ») : un échelon manque" + ou + ".");
        else s.forEach((ech, e) => {
          if (!Array.isArray(ech) || ech.length !== 4 || !ech.every(x => x && typeof x.sans === "string" && x.sans.trim() && typeof x.avec === "string" && x.avec.trim())) V.exige(false, "Le niveau " + (e + 1) + " du point " + nom + " doit avoir quatre sous-niveaux, chacun « sans » et « avec » citation : un sous-niveau manque" + ou + ".");
          else ech.forEach((x, k) => { if (x.avec.indexOf("{CIT}") < 0) V.exige(false, "Le sous-niveau " + (k + 1) + " du niveau " + (e + 1) + " du point " + nom + " : la version « avec » ne contient pas « {CIT} » (l’endroit de la citation)" + ou + "."); });
        });
      });
      if (typeof cr.pts_max === "number" && Math.abs(sp - cr.pts_max) > 1e-9) V.exige(false, "Les poids du critère « " + cr.titre + " » font " + sp + " points, et le critère en vaut " + cr.pts_max + ou + ".");
    });
    if (typeof v.total === "number" && Math.abs(somme - v.total) > 1e-9) V.exige(false, "Les critères font " + somme + " points, et le total est " + v.total + ou + " : la somme des poids doit faire le total.");
    if (v.compteur) {
      const k = v.compteur;
      V.exige(!!indIds[k.indicateur], "Le compteur d’orthographe vise un point qui n’existe pas (« " + k.indicateur + " »)" + ou + ".");
      if (k.selon) V.exige(!!indIds[k.selon], "Le compteur d’orthographe se règle sur un point qui n’existe pas (« " + k.selon + " »)" + ou + ".");
      const ok = k.seuils && [0, 1, 2, 3].every(e => Array.isArray(k.seuils[e]) && k.seuils[e].length === 3 && k.seuils[e].every((n, i, a) => typeof n === "number" && (i === 0 || n >= a[i - 1])));
      V.exige(ok, "Les seuils du compteur doivent donner, pour chacun des quatre niveaux, trois nombres croissants (jusqu’à combien d’erreurs : très satisfaisant, satisfaisant, fragile)" + ou + ".");
    }
  });
  if (c.fiche) {
    const f = c.fiche;
    if (f.aFaire != null) V.exige(Array.isArray(f.aFaire) && f.aFaire.every(x => typeof x === "string" && x.indexOf("<") < 0), "« fiche.aFaire » doit être une liste de phrases, sans balises.");
    if (f.alerte) { const tous = {}; c.variantes.forEach(v => (v.criteres || []).forEach(cr => (cr.indicateurs || []).forEach(i => { tous[i.id] = 1; }))); V.exige(!!tous[f.alerte.indicateur] && f.alerte.titre && f.alerte.contenu, "L’encart de la fiche (« fiche.alerte ») doit viser un point de la grille et avoir un titre et un contenu."); }
  }
  return V;
}
// ── l'écran « Nouveau sujet » ──
function ruNouveauSujet() {
  document.getElementById("ruNvColler").value = ""; document.getElementById("ruNvMsg").innerHTML = ""; document.getElementById("ruNvInv").innerHTML = "";
  document.getElementById("ruNvCreer").disabled = true; document.getElementById("ruNvCreer").title = "Vérifie d’abord la réponse";
  RU.nouveau = null; document.getElementById("modalNouveau").classList.add("show"); setTimeout(() => document.getElementById("ruNvColler").focus(), 50);
}
function ruVerifierNouveau() {
  const msg = document.getElementById("ruNvMsg"), inv = document.getElementById("ruNvInv"), b = document.getElementById("ruNvCreer");
  RU.nouveau = null; inv.innerHTML = ""; b.disabled = true;
  const t = String(document.getElementById("ruNvColler").value || "").trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  if (!t) { msg.className = "ru-msg ko"; msg.textContent = RU_SUJET_MSG_VIDE; return Promise.resolve(false); }
  let o; try { o = JSON.parse(t); } catch (e) { msg.className = "ru-msg ko"; msg.innerHTML = "Je ne peux pas lire cette réponse : elle est incomplète ou mal fermée (" + escapeHtml(String(e.message)) + "). Demande à l’IA de redonner le résultat en entier, sans rien autour."; return Promise.resolve(false); }
  msg.className = "ru-msg"; msg.textContent = "Vérification…";
  return Promise.all([ruLire(["taxonomie"]), ruLire(["redactions"])]).then(([taxo, ex]) => {
    const V = ruValiderSujet(o, taxo, ex || {});
    if (!V.ok()) { msg.className = "ru-msg ko"; msg.innerHTML = "Je ne peux pas utiliser cette réponse :<ul>" + V.motifs().map(x => "<li>" + escapeHtml(x) + "</li>").join("") + "</ul>"; return false; }
    const c = normaliserSujet(o); RU.nouveau = c;
    const n = ruComptePhrases(c);
    msg.className = "ru-msg ok"; msg.textContent = "Réponse comprise. Voici le sujet qu’elle apporte.";
    inv.innerHTML = `<p><strong>${escapeHtml(c.titre)}</strong> — ${escapeHtml(c.niveau || "")} · sur ${c.total}</p>` + c.variantes.map(v => `<div class="ru-inv-v">${c.variantes.length > 1 ? `<em>${escapeHtml(v.libelle || v.id)}</em>` : ""}<ul>${v.criteres.map(cr => `<li>${escapeHtml(cr.titre)} — ${cr.pts_max} pts : ${cr.indicateurs.map(i => escapeHtml(i.libelle) + " (" + i.poids + ")").join(" · ")}</li>`).join("")}</ul></div>`).join("") +
      `<p>${n.points} points de grille, ${n.phrases} phrases. À la création, le sujet arrive « à relire » : tu peux corriger des copies tout de suite, mais la fiche d’un élève ne sort pas tant qu’une phrase qu’elle porte n’est pas lue (« Préparer le sujet », ou choisie en corrigeant).</p>`;
    b.disabled = false; b.title = "Créer ce sujet au site (" + c.id + ")"; return true;
  }, () => { msg.className = "ru-msg ko"; msg.textContent = "Le site ne répond pas : la vérification n’a pas pu lire la taxonomie. Réessaie dans un instant."; return false; });
}
function ruCreerNouveau() {
  const c = RU.nouveau; if (!c) return; const b = document.getElementById("ruNvCreer"); b.disabled = true;
  ruEcrire(["redactions", c.id, "config"], c, "le sujet " + c.id).then(i => {
    if (i.etat !== MJPC_ISSUE.ACCEPTEE) { document.getElementById("ruNvMsg").className = "ru-msg ko"; document.getElementById("ruNvMsg").textContent = i.etat === MJPC_ISSUE.REFUSEE ? "Le site a refusé la création : rien n’est écrit." : "Le site ne répond pas : rien n’est écrit. Réessaie."; b.disabled = false; return; }
    fermerModale("modalNouveau"); toast("Sujet créé : " + c.titre);
    location.href = ruAdresse({ id: c.id, vue: "preparer" });
  });
}
// ── les phrases d'un sujet, et leur clé de validation ──
function ruCleP(v, ind) { return "p~" + v + "~" + ind; }                              // un point validé (toutes ses phrases)
function ruCleD(v, ind, e) { return "d~" + v + "~" + ind + "~" + e; }                  // un niveau
function ruCleS(v, ind, e, k, f) { return "s~" + v + "~" + ind + "~" + e + "~" + k + "~" + f; }   // un sous-niveau, sans | avec
function ruCleC(v, cr) { return "c~" + v + "~" + cr; }                                 // les consignes d'un critère
function ruComptePhrases(c) { let points = 0, phrases = 0; (c.variantes || []).forEach(v => (v.criteres || []).forEach(cr => { phrases += (cr.consignes || []).length; (cr.indicateurs || []).forEach(i => { points++; phrases += (i.descripteurs || []).length; (i.sous || []).forEach(e => e.forEach(x => { phrases += (x.sans ? 1 : 0) + (x.avec ? 1 : 0); })); }); })); return { points, phrases }; }
function ruPoints(c) { const L = []; (c && c.variantes || []).forEach((v, vi) => (v.criteres || []).forEach((cr, ci) => (cr.indicateurs || []).forEach((ind, ii) => L.push({ v, vi, cr, ci, ind, ii, cle: ruCleP(v.id, ind.id) })))); return L; }
function etatValidationSujet(cfg, valid) { const c = normaliserSujet(cfg); const P = ruPoints(c); return { valides: P.filter(p => valid && valid[p.cle]).length, total: P.length }; }
function ruLue(cle, p) { return !!(RU_VALID[cle] || (p && RU_VALID[p])); }
function ruMarquer(cle, par) { if (!RU.id || RU_VALID[cle]) return; const v = { le: new Date().toISOString(), par }; RU_VALID[cle] = v; ruEcrire(["redactions", RU.id, "validations", cle], v, "une phrase lue"); }
// R4 bis — ce que Paul lit en corrigeant compte comme lu : le niveau choisi (étage 1), le sous-niveau choisi, dans la version affichée (avec ou sans citation)
function ruLuEnCorrigeant(indId) {
  const c = copieFor(state.current); const v = c.sujet; if (!v) return;
  const e = c.echelons[indId]; if (e === undefined || e === "NE") return;
  ruMarquer(ruCleD(v, indId, e), "choix");
  const k = c.sousEchelons[indId]; if (k === undefined) return;
  ruMarquer(ruCleS(v, indId, e, k, (c.citationsPar[indId] || "").trim() ? "avec" : "sans"), "choix");
}
// ── les phrases qu'une fiche porte, et celles qui ne sont pas encore lues ──
const RU_COMMUNES = {
  liaisons: { titre: "Les mots de liaison", texte: () => Object.keys(CONNECTEURS).map(k => CONNECTEURS[k].join(" · ")) },
  fixes: { titre: "Les phrases fixes de la fiche", texte: () => ["Attention aussi à la langue dans ce passage.", "Tu as fait N erreurs d’orthographe et de grammaire dans ta copie, ce qui correspond au niveau …", "…, comme quand tu écris « citation ». (quand une phrase réécrite au crayon n’a pas l’endroit de la citation)", "Critère non évalué.", "Dans ta copie, une phrase m’a particulièrement touché :", "Indicateurs non évalués pour cette copie (adaptation pédagogique) : …", "Sujet : · Note finale · Total · À faire avec cette correction"] }
};
function ruPhrasesNonLues(id) {
  const c = copieFor(id); const v = c.sujet; const g = getGrille(id); const L = [];
  if (!g) return L;
  if (!RU_VALID_COMMUNES.liaisons) L.push("les mots de liaison (écran « Phrases communes »)");
  if (!RU_VALID_COMMUNES.fixes) L.push("les phrases fixes de la fiche (écran « Phrases communes »)");
  const vd = varianteDe(v) || {};
  if ((SUJET.fiche && (SUJET.fiche.alerte || (SUJET.fiche.aFaire || []).length || SUJET.fiche.sousTitre)) && !RU_VALID["fiche"]) L.push("les textes de la fiche du sujet (écran « La fiche »)");
  (vd.criteres || []).forEach(cr => {
    if ((cr.consignes || []).length && !RU_VALID[ruCleC(v, cr.id)]) L.push("les consignes « " + cr.titre + " »");
    (cr.indicateurs || []).forEach(ind => {
      const e = c.echelons[ind.id]; if (e === undefined || e === "NE") return;
      if (c.sousEditesPar && c.sousEditesPar[ind.id]) return;                      // réécrite au crayon : lue d'office
      const P = ruCleP(v, ind.id); const k = c.sousEchelons[ind.id];
      const cle = k === undefined ? ruCleD(v, ind.id, e) : ruCleS(v, ind.id, e, k, (c.citationsPar[ind.id] || "").trim() ? "avec" : "sans");
      if (!ruLue(cle, P)) L.push("« " + ind.libelle + " » (" + ECHELON_COULEUR[e].label.toLowerCase() + (k !== undefined ? ", sous-niveau " + (k + 1) : "") + ")");
    });
  });
  return L;
}
function ruFicheBloquee(id, quoi) {
  const L = ruPhrasesNonLues(id); if (!L.length) return false;
  alert("La fiche de " + (nomEleveDe(id) || "cet élève") + " ne sort pas encore" + (quoi ? " (" + quoi + ")" : "") + " : elle porte des phrases que tu n’as pas lues.\n\n• " + L.join("\n• ") + "\n\nLis-les dans « Préparer le sujet » (ou choisis-les en corrigeant).");
  return true;
}
function ruChargerValidations() {
  return Promise.all([ruLire(["redactions", RU.id, "validations"]), ruLire(["redactions_communes", "validations"])]).then(([a, b]) => { RU_VALID = a || {}; RU_VALID_COMMUNES = b || {}; }, () => {});
}
// ── « Préparer le sujet » (R4) : un point par écran ──
function ruPreparer() {
  ruEcran("ruPrep"); document.title = "Préparer — " + (SUJET.titre || "");
  document.getElementById("ruPrepTitre").textContent = "Préparer le sujet — " + (SUJET.titre || "");
  ruChargerValidations().then(() => { RU.prep = RU.prep || { k: 0 }; ruPrepRendre(); });
}
function ruPrepEcrans() {
  const E = [{ type: "communes" }];
  if (SUJET.fiche && (SUJET.fiche.alerte || (SUJET.fiche.aFaire || []).length || SUJET.fiche.sousTitre)) E.push({ type: "fiche" });
  SUJET.variantes.forEach((v, vi) => v.criteres.forEach((cr, ci) => { if ((cr.consignes || []).length) E.push({ type: "consignes", v, vi, cr, ci }); cr.indicateurs.forEach((ind, ii) => E.push({ type: "point", v, vi, cr, ci, ind, ii })); }));
  return E;
}
function ruPrepValide(E) {
  if (E.type === "communes") return !!(RU_VALID_COMMUNES.liaisons && RU_VALID_COMMUNES.fixes);
  if (E.type === "fiche") return !!RU_VALID["fiche"];
  if (E.type === "consignes") return !!RU_VALID[ruCleC(E.v.id, E.cr.id)];
  return !!RU_VALID[ruCleP(E.v.id, E.ind.id)];
}
function ruPrepRendre() {
  const E = ruPrepEcrans(); const k = Math.max(0, Math.min(RU.prep.k, E.length - 1)); RU.prep.k = k; const cur = E[k];
  const pts = E.filter(x => x.type === "point"); const nv = pts.filter(ruPrepValide).length;
  document.getElementById("ruPrepCompteur").textContent = nv + " point" + (nv > 1 ? "s" : "") + " validé" + (nv > 1 ? "s" : "") + " sur " + pts.length;
  const lib = x => x.type === "communes" ? "Phrases communes" : x.type === "fiche" ? "La fiche" : x.type === "consignes" ? "Consignes — " + x.cr.titre : x.ind.libelle;
  document.getElementById("ruPrepNav").innerHTML = E.map((x, i) => {
    const ent = (x.type === "point" || x.type === "consignes") && (i === 0 || E[i - 1].cr !== x.cr) ? `<div class="ru-prep-cr">${SUJET.variantes.length > 1 ? escapeHtml(x.v.libelleCourt || x.v.id) + " · " : ""}${escapeHtml(x.cr.titre)} (${x.cr.pts_max})</div>` : "";
    return ent + `<button class="ru-prep-i${i === k ? " cour" : ""}${ruPrepValide(x) ? " ok" : ""}" onclick="RU.prep.k=${i};ruPrepRendre()" title="${ruPrepValide(x) ? "Validé" : "À relire"}">${ruPrepValide(x) ? "✓ " : "○ "}${escapeHtml(lib(x))}</button>`;
  }).join("");
  const corps = document.getElementById("ruPrepCorps");
  const ta = (chemin, texte, cleLue, titre) => `<textarea class="ru-case" data-chemin="${escapeAttr(JSON.stringify(chemin))}" data-lue="${escapeAttr(cleLue || "")}" title="${escapeAttr(titre || "Corrige directement dans la case : en sortant de la case, la phrase est enregistrée au site et compte comme lue")}" onblur="ruPrepCase(this)">${escapeHtml(texte || "")}</textarea>`;
  let h = "";
  if (cur.type === "communes") {
    h = `<h2>Phrases communes à tous les sujets</h2><p class="ru-aide">Ces mots et ces phrases sont ceux de l’app (les mêmes pour chaque sujet). La fiche les assemble autour des phrases de la grille. Lis-les une fois.</p>` +
      Object.keys(RU_COMMUNES).map(cle => `<div class="ru-commune"><h3>${RU_COMMUNES[cle].titre} ${RU_VALID_COMMUNES[cle] ? '<span class="ru-ok">✓ lu le ' + new Date(RU_VALID_COMMUNES[cle].le).toLocaleDateString("fr-FR") + "</span>" : ""}</h3><ul>${RU_COMMUNES[cle].texte().map(t => "<li>" + escapeHtml(t) + "</li>").join("")}</ul></div>`).join("");
  } else if (cur.type === "fiche") {
    const f = SUJET.fiche;
    h = `<h2>La fiche de l’élève — les textes du sujet</h2><p class="ru-aide">Ce que la fiche affiche en plus de la grille, pour ce sujet.</p>` +
      (f.titre ? `<label>Titre de la fiche</label>${ta(["fiche", "titre"], f.titre, "fiche")}` : "") + (f.sousTitre ? `<label>Sous-titre</label>${ta(["fiche", "sousTitre"], f.sousTitre, "fiche")}` : "") +
      (f.alerte ? `<label>Encart (quand « ${escapeHtml(f.alerte.indicateur)} » est au niveau ${ECHELON_COULEUR[f.alerte.echelon || 0].label.toLowerCase()})</label>${ta(["fiche", "alerte", "titre"], f.alerte.titre, "fiche")}${ta(["fiche", "alerte", "contenu"], f.alerte.contenu, "fiche")}` : "") +
      ((f.aFaire || []).length ? `<label>À faire avec cette correction</label>` + f.aFaire.map((t, i) => ta(["fiche", "aFaire", i], t, "fiche")).join("") : "");
  } else if (cur.type === "consignes") {
    h = `<h2>Consignes d’entraînement — ${escapeHtml(cur.cr.titre)}</h2><p class="ru-aide">Une consigne s’affiche sous le commentaire du critère, selon le niveau atteint sur le critère.</p>` +
      cur.cr.consignes.map((t, e) => `<label style="color:${ECHELON_COULEUR[e].text}">${ECHELON_COULEUR[e].label}</label>${ta(["variantes", cur.vi, "criteres", cur.ci, "consignes", e], t, ruCleC(cur.v.id, cur.cr.id))}`).join("");
  } else {
    const ind = cur.ind, base = ["variantes", cur.vi, "criteres", cur.ci, "indicateurs", cur.ii];
    h = `<div class="ru-prep-tete"><div class="ru-prep-crit">${escapeHtml(cur.cr.titre)} — /${ind.poids}${ind.competences && ind.competences.length ? " · " + ind.competences.map(escapeHtml).join(", ") : ""}</div><h2>${escapeHtml(ind.libelle)}</h2></div>
      <div class="ru-prep-grille">${[0, 1, 2, 3].map(e => `<div class="ru-prep-col" style="border-top:6px solid ${ECHELON_COULEUR[e].border}">
        <h3 style="color:${ECHELON_COULEUR[e].text}">${ECHELON_COULEUR[e].label}</h3>
        <label title="Le niveau, tel que la carte de correction le montre (étage 1)">Le niveau</label>${ta(base.concat(["descripteurs", e]), ind.descripteurs[e], ruCleD(cur.v.id, ind.id, e))}
        ${(ind.sous[e] || []).map((x, s) => `<div class="ru-prep-sous"><label title="Le sous-niveau ${s + 1} (du bas au haut du niveau) : la phrase de la fiche, sans puis avec la citation">Sous-niveau ${s + 1}</label>${ta(base.concat(["sous", e, s, "sans"]), x.sans, ruCleS(cur.v.id, ind.id, e, s, "sans"), "Sans citation")}${ta(base.concat(["sous", e, s, "avec"]), x.avec, ruCleS(cur.v.id, ind.id, e, s, "avec"), "Avec citation : {CIT} marque l’endroit de la citation")}</div>`).join("")}
      </div>`).join("")}</div>`;
  }
  corps.innerHTML = h; corps.scrollTop = 0;
  const b = document.getElementById("ruPrepValider"); const fait = ruPrepValide(cur);
  b.textContent = fait ? "✓ Validé" : (cur.type === "point" ? "✓ Je valide ce point" : "✓ Je les ai lues"); b.disabled = fait;
  b.title = fait ? "Déjà validé — une correction dans une case reste enregistrée et lue" : "Tu as lu toutes les phrases de cet écran : elles peuvent partir sur les fiches";
  document.getElementById("ruPrepPrec").disabled = k === 0; document.getElementById("ruPrepSuiv").disabled = k === E.length - 1;
}
function ruPrepValider() {
  const cur = ruPrepEcrans()[RU.prep.k]; const v = { le: new Date().toISOString(), par: "point" };
  if (cur.type === "communes") { RU_VALID_COMMUNES.liaisons = RU_VALID_COMMUNES.fixes = v; ruEcrire(["redactions_communes", "validations", "liaisons"], v, "les mots de liaison lus"); ruEcrire(["redactions_communes", "validations", "fixes"], v, "les phrases fixes lues"); }
  else { const cle = cur.type === "fiche" ? "fiche" : cur.type === "consignes" ? ruCleC(cur.v.id, cur.cr.id) : ruCleP(cur.v.id, cur.ind.id); RU_VALID[cle] = v; ruEcrire(["redactions", RU.id, "validations", cle], v, "un point validé"); }
  const E = ruPrepEcrans(); const suiv = E.findIndex((x, i) => i > RU.prep.k && !ruPrepValide(x));
  if (suiv >= 0) RU.prep.k = suiv; ruPrepRendre();
}
// une phrase corrigée dans la case : enregistrée au site (le sujet rangé d'abord s'il ne l'est pas), et lue d'office
function ruPrepCase(t) {
  const chemin = JSON.parse(t.dataset.chemin); let n = SUJET; for (const k of chemin.slice(0, -1)) n = n[k];
  const der = chemin[chemin.length - 1]; const avant = n[der], apres = t.value;
  if (String(avant) === apres) return;
  if (/sous/.test(chemin.join("/")) && der === "avec" && apres.indexOf("{CIT}") < 0) { if (!confirm("Cette phrase « avec citation » n’a plus « {CIT} » (l’endroit où la citation s’insère). L’enregistrer quand même ?")) { t.value = avant; return; } }
  if (chemin[0] === "variantes" && chemin.indexOf("descripteurs") >= 0 && apres.indexOf("{prenom}") < 0) { if (!confirm("Ce niveau n’a plus « {prenom} » (le prénom de l’élève). L’enregistrer quand même ?")) { t.value = avant; return; } }
  n[der] = apres;
  const rangeAuHub = RU.cfgRange ? Promise.resolve() : ruEcrire(["redactions", RU.id, "config"], SUJET, "le sujet rangé").then(() => { RU.cfgRange = true; });
  rangeAuHub.then(() => ruEcrire(["redactions", RU.id, "config"].concat(chemin), apres, "une phrase corrigée"));
  if (t.dataset.lue) ruMarquer(t.dataset.lue, "case");
  appliquerSujet(SUJET);
  t.classList.add("ru-case-ok"); setTimeout(() => t.classList.remove("ru-case-ok"), 900);
}
