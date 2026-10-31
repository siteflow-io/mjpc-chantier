// Le tableau lit la correction des scans sans initialiser ni réécrire une copie.
// Une rubrique terminée est une case complète ; une marque seule commence la lecture.
function scAvancement(k) {
  const copie = state.copies[k], s = copie && copie.scan;
  if (!s) return null;
  const rep = s.rep || {}, marques = s.marques || {}, vu = s.vu || {};
  const commence = Object.keys(marques).length > 0 || Number(s.lignes) > 0
    || Object.values(vu).some(Boolean)
    || Object.values(rep).some(r => r && Object.values(r).some(v => v === "o" || v === "n"));
  if (!commence) return null; // une ouverture, un chrono ou une recopie ne corrigent pas la copie
  const g = SUJET && SUJET.grille2;
  let fait = 0, total = 0;
  const lecture = { rep, marques };
  ((g && g.criteres) || []).forEach(c => (c.points || []).forEach(p => {
    total++;
    if (p.calcul) {
      // La passe a été terminée par Paul. Sur une copie à repères, le nombre de
      // lignes peut venir des pages : aucune image n'est nécessaire au tableau.
      if (vu[c.id] && (s.lignes == null || Number(s.lignes) > 0)) fait++;
    } else {
      const pt = Object.assign({}, p, { questions: p.questions || [], cases: p.cases || [] });
      const r = scCase(pt, k, lecture);
      if (r && r.complet) fait++;
    }
  }));
  return { commence: true, fait, total, pct: total ? Math.round(100 * fait / total) : 0 };
}

/* ═══ [C14 1.4.12] l'accueil de la correction dans le flux (C14 225, n° 1, 6, 7 ; Paul 22:36 « fais tout le reste », 22:45 « la liste de ce qui ne sert à rien ») ═══
   La carte d'un élève montre les étapes de sa copie (le flux) ; un clic l'ouvre là où tu travailles (la recopie ou l'écran des scans), plus jamais la grille
   d'origine ; l'onglet « Bilan » se tire des scans et de la bande ; l'onglet « Fiches élèves » mène aux fichiers École Directe. Rien n'est écrit au site. */
const AV = { red: null };
function avPret() { return SC.ouvert || AV.red === RU.id; }
function avPagesCharger() {   // les pages du paquet (leur élève) : lues une fois par rédaction, pour compter le flux sans ouvrir les scans
  if (SC.ouvert || AV.red === RU.id || AV.lit === RU.id || !RU.id) return; const red = AV.lit = RU.id;
  ruLire(scChemin(["pages"])).then(pg => { if (RU.id !== red) return; AV.lit = null; AV.red = red; if (!SC.ouvert) SC.pages = pg || {}; avGrille(); renderDashboard(); if (RU.sous === "bilan") avBilanClasse(); if (RU.sous === "fiches") avFiches(); }).catch(() => { AV.lit = null; });
}
function avGrille() {   // la grille à cases du sujet et ses passes, comme les prépare l'écran des scans (scOuvrir), pour lire les notes sans l'ouvrir
  if (SC.ouvert || (SC.grille && SC.passes.length)) return !!SC.grille; const g = SUJET && SUJET.grille2; if (!g || !g.criteres) return false;
  SC.grille = scGrilleNormale(g); const L = g.criteres.find(c => c.id === "langue");
  SC.passes = [{ id: "langue", nom: L ? L.nom : "La langue", pts: L ? L.points : [], crit: "langue" }].concat(g.criteres.filter(c => c.id !== "langue").map(c => ({ id: c.id, nom: c.nom, pts: c.points, crit: c.id })));
  return true;
}
function avFlux(k) { if (!avPret() || typeof rcFluxCopie !== "function") return null; try { return rcFluxCopie(k); } catch (e) { return null; } }
function avCarteFlux(k) {
  avPagesCharger(); const f = avFlux(k); if (!f || (!f.lignes && !f.arrets)) return "";
  const pl = (n, m) => n + " " + m + (n > 1 ? "s" : ""), e = (fait, txt, tip) => '<span class="av-et' + (fait ? " ok" : "") + '" title="' + escapeAttr(tip) + '">' + (fait ? "✓ " : "") + escapeHtml(txt) + "</span>";
  return '<div class="av-flux">' + e(f.finie, "recopiée", f.lignes ? pl(f.lignes, "ligne") + (f.finie ? ", avec la phrase qui m’a marqué : la recopie est finie." : " ; la recopie se finit avec « ★ La phrase qui m’a marqué ».") : "Pas encore recopiée.")
    + e(!!(f.envoi || f.charge), "envoyée", f.envoi ? "Envoi " + f.envoi.n + " à l’IA, " + rcHeure(f.envoi.le) + "." : f.charge ? "Envoyée avant le flux." : "Pas encore envoyée à l’IA.")
    + e(!!f.charge, "chargée", f.charge ? "Corrigé de l’IA chargé " + rcHeure(f.charge.le) + " : " + pl(f.charge.fautes, "faute") + " proposée" + (f.charge.fautes > 1 ? "s" : "") + "." : "Le corrigé de l’IA n’est pas encore chargé.")
    + e(f.fini, f.arrets ? "bande " + f.decides + "/" + f.arrets : "bande", f.arrets ? f.decides + " arrêt" + (f.decides > 1 ? "s" : "") + " décidé" + (f.decides > 1 ? "s" : "") + " sur " + f.arrets + (f.fini ? " : la bande est finie." : ".") : "La bande attend le corrigé de l’IA.") + "</div>";
}
function avCarteEtat(k, pct, suivi) { const f = avFlux(k); if (f && f.fini) return "Corrigé"; if ((f && (f.lignes || f.arrets)) || suivi || pct > 0) return pct === 100 ? "Corrigé" : "En cours"; return "Non commencé"; }
function avOuvrirCarte(k) {   // la copie s'ouvre là où tu travaillais quand tu as quitté l'écran des scans
  const rec = state.scanDernier === "recopie", r = ((((state.copies[k] || {}).scan || {}).recopie) || {}).reprise || {};
  state.scanCurseur = Object.assign({}, state.scanCurseur || {}, { copie: k });
  state.scanRecopie = rec ? { ouverte: true, copie: k, page: r.page || null, ligne: r.ligne || null } : Object.assign({}, state.scanRecopie || {}, { ouverte: false });
  saveState(); scOuvrir();
}
/* l'onglet « Bilan » : pour la remédiation, la note, les critères et les fautes par type d'erreur de chaque élève, puis la classe */
const AV_ORDRE = ["G", "L", "C", "P", "E", "M", "X", "I", "A"];
function avFautes(k) { const ids = new Set(scPagesDe(k).map(p => p.id)), o = {}; Object.values(((state.copies[k] || {}).scan || {}).marques || {}).filter(m => m && m.forme === "faute" && (!ids.size || ids.has(m.page))).forEach(m => { const c = (m.bande && RC_TYPES[m.bande.code]) ? m.bande.code : "_"; o[c] = (o[c] || 0) + 1; }); return o; }
function avCritere(k, c) { let n = 0, tot = 0, ok = true; c.points.forEach(pt => { tot += pt.poids; const r = scCase(pt, k); if (!r || !r.complet) ok = false; else n += pt.bareme[String(r.c.niveau)]; }); return { n, tot, ok }; }
function avBilanClasse() {
  const v = document.getElementById("ruVue_bilan"); if (!v) return; avPagesCharger();
  if (!avPret() || !avGrille()) { v.innerHTML = '<div class="rp-carte"><h2>Bilan de la classe</h2><p>' + (SUJET && SUJET.grille2 ? "Lecture du paquet…" : "Ce sujet n’a pas encore de grille à cases : le bilan se tire de la correction sur les scans.") + "</p></div>"; return; }
  const al = (SUJET && SUJET.fiche && SUJET.fiche.alerte) || {}, lg = SC.grille.criteres.find(c => c.id === "langue"), pO = lg && lg.points.find(p => p.calcul === "fautes"), seuil = al.echelon != null ? al.echelon : 0;
  const dnb = k => { if (!pO) return null; const r = scCase(pO, k); return r && r.complet ? r.c.niveau === seuil : null; };
  const C = SC.grille.criteres, nb = x => String(Math.round(x * 10) / 10).replace(".", ","), T = Object.assign({}, RC_TYPES), ty = AV_ORDRE.filter(c => T[c]);
  const L = state.classe.map(nm => { const k = eleveId(nm), f = avFlux(k) || {}, nt = scNote(k), cr = C.map(c => avCritere(k, c)), fa = avFautes(k); return { nm, k, f, nt, cr, fa, nf: Object.values(fa).reduce((a, b) => a + b, 0), dnb: dnb(k) }; });
  const finies = L.filter(x => x.nt.ok), tot = {}; L.forEach(x => Object.keys(x.fa).forEach(c => { tot[c] = (tot[c] || 0) + x.fa[c]; })); const totF = Object.values(tot).reduce((a, b) => a + b, 0);
  const moyC = C.map((c, i) => { const ok = L.filter(x => x.cr[i].ok); return ok.length ? ok.reduce((a, x) => a + x.cr[i].n / (x.cr[i].tot || 1), 0) / ok.length : null; });
  let faible = -1; moyC.forEach((m, i) => { if (m != null && (faible < 0 || m < moyC[faible])) faible = i; });
  const th = c => '<th title="' + escapeAttr(T[c].libelle) + '"><span class="av-ty" style="background:' + T[c].fond + ";color:" + (T[c].texte || T[c].couleur) + ";border-color:" + T[c].couleur + '">' + c + "</span></th>";
  const ligne = x => "<tr><td>" + escapeHtml(x.nm) + '</td><td class="av-n">' + (x.nt.ok ? "<b>" + nb(x.nt.n) + " / " + x.nt.tot + "</b>" : '<span class="av-m">pas finie</span>') + "</td>" + '<td class="av-n">' + (x.dnb ? '<span class="av-dnb">⚠ orthographe</span>' : x.dnb === false ? "—" : "") + "</td>"
    + C.map((c, i) => '<td class="av-n">' + (x.cr[i].ok ? nb(x.cr[i].n) + " / " + x.cr[i].tot : '<span class="av-m">…</span>') + "</td>").join("")
    + '<td class="av-n"><b>' + (x.nf || "") + "</b></td>" + ty.map(c => '<td class="av-n">' + (x.fa[c] || "") + "</td>").join("") + '<td class="av-n">' + (x.fa._ || "") + "</td></tr>";
  const classe = '<tr class="av-classe"><td>La classe</td><td class="av-n">' + (finies.length ? "<b>" + nb(finies.reduce((a, x) => a + x.nt.n, 0) / finies.length) + " / " + finies[0].nt.tot + "</b><br><span class=\"av-m\">moyenne de " + finies.length + " copie" + (finies.length > 1 ? "s" : "") + " finie" + (finies.length > 1 ? "s" : "") + "</span>" : '<span class="av-m">aucune copie finie</span>') + "</td>" + '<td class="av-n">' + (L.filter(x => x.dnb).length ? '<span class="av-dnb">⚠ ' + L.filter(x => x.dnb).length + "</span>" : "—") + "</td>"
    + C.map((c, i) => '<td class="av-n' + (i === faible ? " av-faible" : "") + '"' + (i === faible ? ' title="Le critère le plus faible de la classe"' : "") + ">" + (moyC[i] != null ? Math.round(100 * moyC[i]) + " %" + (i === faible ? "<br><span class=\"av-m\">le plus faible</span>" : "") : "…") + "</td>").join("")
    + '<td class="av-n"><b>' + totF + "</b></td>" + ty.map(c => '<td class="av-n">' + (tot[c] ? tot[c] + '<br><span class="av-m">' + Math.round(100 * tot[c] / totF) + " %</span>" : "") + "</td>").join("") + '<td class="av-n">' + (tot._ ? tot._ + '<br><span class="av-m">' + Math.round(100 * tot._ / totF) + " %</span>" : "") + "</td></tr>";
  v.innerHTML = '<div class="rp-carte av-bilan"><h2>Bilan de la classe</h2><p>Tiré de la correction sur les scans et de la bande, sans rien écrire. Une copie pas finie n’entre pas dans la moyenne. Les fautes comptées par type d’erreur sont celles de la bande ; une faute marquée avec la méthode d’avant est « sans type ».</p>'
    + '<div class="av-tab"><table class="rp-table"><thead><tr><th>Élève</th><th>Note</th><th title="' + escapeAttr((al.titre ? al.titre + " : " : "") + "la copie dont l’orthographe tombe au plus bas niveau de la grille (trop de fautes par ligne) peut être déclassée au brevet. Une colonne, jamais une alerte.") + '">Brevet</th>' + C.map(c => "<th>" + escapeHtml(c.nom) + "</th>").join("") + "<th>Fautes</th>" + ty.map(th).join("") + '<th title="Une faute sans type d’erreur : marquée avant la bande, ou oubliée par l’IA">sans type</th></tr></thead><tbody>'
    + L.map(ligne).join("") + classe + "</tbody></table></div></div>";
}
/* l'onglet « Fiches élèves » : les fichiers École Directe des scans (la fiche HTML d'origine est rangée) */
function avFiches() {
  const v = document.getElementById("ruVue_fiches"); if (!v) return; avPagesCharger(); avGrille();
  const L = state.classe.map(nm => { const k = eleveId(nm), f = avFlux(k), nt = avPret() && SC.grille ? scNote(k) : { ok: false }; return "<tr><td>" + escapeHtml(nm) + '</td><td class="av-n">' + (nt.ok ? "<b>" + String(Math.round(nt.n * 10) / 10).replace(".", ",") + " / " + nt.tot + "</b>" : "—") + '</td><td class="' + (nt.ok ? "rp-ok" : "") + '">' + (nt.ok ? "prête : la correction est finie" : f && (f.lignes || f.arrets) ? "pas encore : la correction est en cours" : "pas encore commencée") + "</td></tr>"; }).join("");
  v.innerHTML = '<div class="rp-carte"><h2>Fiches élèves</h2><p>Le fichier de chaque élève se fabrique dans l’écran des scans : sa copie scannée et tes marques, à déposer sur École Directe. Les photos ne quittent jamais ce navigateur.</p>'
    + '<button class="rp-prim" onclick="avFichiersED()" title="Ouvre l’écran des scans et sa liste des fichiers : un fichier par élève, à télécharger, ou à tester comme l’élève le verra. Les photos doivent être dans ce navigateur (le paquet chargé).">📨 Fichiers École Directe</button>'
    + '<table class="rp-table"><thead><tr><th>Élève</th><th>Note</th><th>Son fichier</th></tr></thead><tbody>' + L + "</tbody></table></div>";
}
function avFichiersED() {
  const fin = () => { if (typeof RC !== "undefined" && RC.ouvert) rcFermer(); scFichiersED(); };
  if (SC.ouvert) { fin(); return; }
  state.scanRecopie = Object.assign({}, state.scanRecopie || {}, { ouverte: false }); scOuvrir(); const t0 = Date.now();
  (function attendre() { if (SC.ouvert) fin(); else if (Date.now() - t0 < 10000) setTimeout(attendre, 120); else toast("L’écran des scans ne s’ouvre pas : ouvre-le avec « 📄 Corriger sur les scans », puis « 📨 Fichiers École Directe »."); })();
}
