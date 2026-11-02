// Le tableau lit la correction des scans sans initialiser ni réécrire une copie.
// Une rubrique terminée est une case complète ; une marque seule commence la lecture.
function scAvancement(k) {
  const copie = state.copies[k], s = copie && copie.scan;
  if (!s) return null;
  /* [C14 401] une copie du flux unique (recopie, corrigé de l'IA, bande) : 100 % quand elle est entièrement corrigée (recopiée jusqu'à sa phrase, chargée,
     chaque arrêt de sa bande décidé, ses remarques relues) ; sinon ses étapes : la phrase 25, le corrigé chargé 25, la bande au prorata de ses arrêts 50 */
  { const f = typeof avFlux === "function" ? avFlux(k) : null; if (f && (f.lignes || f.arrets)) { let fini = false; try { fini = typeof svCopieCorrigee === "function" ? svCopieCorrigee(k) : !!f.fini; } catch (e) { fini = !!f.fini; }
    const p = fini ? 100 : Math.min(99, Math.round(25 * !!f.finie + 25 * !!f.charge + (f.arrets ? 50 * f.decides / f.arrets : 0))); return { commence: true, fait: p, total: 100, pct: p, flux: true }; } }
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
  avPagesCharger(); if (avAbsent(k)) return ""; if (avPret() && !scPagesDe(k).length) return '<div class="av-flux"><span class="av-et" title="Aucune page du paquet n’est à son nom : sa carte n’ouvre jamais la copie d’un autre élève. Clic sur sa carte : « 📄 Charger sa copie ».">pas de copie dans le paquet</span></div>';
  const f = avFlux(k); if (!f || (!f.lignes && !f.arrets)) return "";
  const pl = (n, m) => n + " " + m + (n > 1 ? "s" : ""), e = (fait, txt, tip) => '<span class="av-et' + (fait ? " ok" : "") + '" title="' + escapeAttr(tip) + '">' + (fait ? "✓ " : "") + escapeHtml(txt) + "</span>";
  return '<div class="av-flux">' + e(f.finie, "recopiée", f.lignes ? pl(f.lignes, "ligne") + (f.finie ? ", avec la phrase qui m’a marqué : la recopie est finie." : " ; la recopie se finit avec « ★ La phrase qui m’a marqué ».") : "Pas encore recopiée.")
    + e(!!(f.envoi || f.charge), "envoyée", f.envoi ? "Envoi " + f.envoi.n + " à l’IA, " + rcHeure(f.envoi.le) + "." : f.charge ? "Envoyée avant le flux." : "Pas encore envoyée à l’IA.")
    + e(!!f.charge, "chargée", f.charge ? "Corrigé de l’IA chargé " + rcHeure(f.charge.le) + " : " + pl(f.charge.fautes, "faute") + " proposée" + (f.charge.fautes > 1 ? "s" : "") + "." : "Le corrigé de l’IA n’est pas encore chargé.")
    + e(f.fini, f.arrets ? "bande " + f.decides + "/" + f.arrets : "bande", f.arrets ? f.decides + " arrêt" + (f.decides > 1 ? "s" : "") + " décidé" + (f.decides > 1 ? "s" : "") + " sur " + f.arrets + (f.fini ? " : la bande est finie." : ".") : "La bande attend le corrigé de l’IA.") + "</div>";
}
function avCarteEtat(k, pct, suivi) { if (avAbsent(k)) return '<b class="av-abs" title="Marqué absent : il ne compte ni dans le compteur, ni dans le Bilan, ni dans les fichiers École Directe. Clic droit sur sa carte : le marquer présent.">ABS</b>'; const f = avFlux(k); if ((f && (f.lignes || f.arrets)) || suivi || pct > 0) return pct === 100 ? "Corrigé" : "En cours"; return "Non commencé"; }   // [C14 401] « Corrigé » et 100 % disent la même chose : entièrement corrigée (scAvancement)
/* [C14 1.4.12.1] (Paul 01/11 08:47 : « quand je clique sur la carte d'un élève sans copie, ça affiche la copie et l'espace de correction d'un autre élève ») :
   la carte n'ouvre que la copie de son élève. Sans page à son nom dans le paquet, rien ne s'ouvre, et la fenêtre le dit ; les pages se lisent d'abord si besoin. */
function avOuvrirCarte(k) {
  if (avAbsent(k)) { toast((nomEleveDe(k) || k) + " est marqué absent : clic droit sur sa carte pour le marquer présent."); return; }
  if (!avPret()) { ruLire(scChemin(["pages"])).then(pg => { if (!SC.ouvert) { SC.pages = pg || {}; AV.red = RU.id; } avOuvrirCarte(k); }, () => toast("⚠ Le site ne répond pas : les pages du paquet n'ont pas pu être lues.")); return; }
  if (!scPagesDe(k).length) { avSansCopie(k); return; }
  avOuvrirCopie(k);
}
function avSansCopie(k) {
  const nom = nomEleveDe(k) || k;
  scModale(`<h3>${escapeHtml(nom)} n'a pas de copie dans le paquet</h3><p>Aucune page n'est à son nom : rien ne s'ouvre, pour ne jamais te montrer la copie d'un autre élève.</p><p>Si sa copie est sur ta clé : ouvre « 📄 Corriger sur les scans », charge-la, puis donne-lui ses pages avec « 🔤 Les initiales ». S'il n'a pas fait la rédaction : clic droit sur sa carte, « ❌ Marquer absent ».</p>
    <button class="sc-btn" id="avChargerSa" onclick="avChargerSaCopie('${escapeAttr(k)}')" title="Choisir sur ta clé la photo ou le PDF de la copie de ${escapeAttr(nom)} : ses pages lui sont données d'office, sans passer par les initiales, puis sa copie s'ouvre. Une page déjà à un autre élève lui reste.">📄 Charger sa copie</button>`);
}
/* [C14 1.4.13] (Paul 01/11 09:17 : « Comment charger une copie d'élève seule, après avoir chargé un paquet? ») : la copie d'un seul élève, depuis sa carte */
function avChargerSaCopie(k) {
  const inp = document.createElement("input"); inp.type = "file"; inp.multiple = true; inp.accept = "application/pdf,.pdf,image/*";
  inp.onchange = () => { const fs = Array.from(inp.files || []); if (!fs.length) return; scModaleFermer(); const nom = nomEleveDe(k) || k;
    const charger = () => scChargerFichiers(fs, { pour: k }).then(() => { const C = SC.chargement || { donnees: 0, autres: [] };
      const autres = C.autres.length ? " · " + C.autres.length + " page" + (C.autres.length > 1 ? "s" : "") + " déjà à " + Array.from(new Set(C.autres)).map(e => nomEleveDe(e) || e).join(", ") + " : elle" + (C.autres.length > 1 ? "s" : "") + " lui reste" + (C.autres.length > 1 ? "nt" : "") : "";
      if (!scPagesDe(k).length) { scModale(`<h3>Aucune page n'a été donnée à ${escapeHtml(nom)}</h3><p>${C.autres.length ? "Les pages de ce fichier sont déjà à un autre élève : elles lui restent." : "Ce fichier n'a pas de page lisible, ou ses pages sont blanches."}</p>`); scRendre(); return; }
      SC.attrib = false; SC.ic = SC.copies.indexOf(k); state.scanCurseur = Object.assign({}, state.scanCurseur || {}, { copie: k }); saveState();
      if (state.scanDernier === "recopie" && typeof rcOuvrir === "function") rcOuvrir(); else scRendre();
      toast("Copie de " + nom + " chargée : " + C.donnees + " page" + (C.donnees > 1 ? "s" : "") + ", à " + nom + " d'office" + autres + "."); });
    if (SC.ouvert) { if (typeof RC !== "undefined" && RC.ouvert) rcFermer(true); charger(); return; }
    state.scanRecopie = Object.assign({}, state.scanRecopie || {}, { ouverte: false }); scOuvrir(); const t0 = Date.now();
    (function attendre() { if (SC.ouvert) charger(); else if (Date.now() - t0 < 10000) setTimeout(attendre, 120); else toast("L’écran des scans ne s’ouvre pas : ouvre-le avec « 📄 Corriger sur les scans », puis « 📄 Charger des copies »."); })();
  };
  inp.click();
}
function avOuvrirCopie(k) {   // la copie s'ouvre là où tu travaillais quand tu as quitté l'écran des scans
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
  const L = state.classe.map(nm => { const k = eleveId(nm), f = avFlux(k) || {}, st = typeof stCorrigeeAvec === "function" && stCorrigeeAvec(k), nt = st ? stNoteBilan(k) : scNote(k), cr = C.map(c => st ? stCritereBilan(k, c) : avCritere(k, c)), fa = avFautes(k); /* [C14 1.4.16] une copie corrigée avec les stickers */ return { nm, k, f, nt, cr, fa, nf: Object.values(fa).reduce((a, b) => a + b, 0), dnb: dnb(k), abs: avAbsent(k) }; });
  const P = L.filter(x => !x.abs), nAbs = L.length - P.length;
  const finies = P.filter(x => x.nt.ok), tot = {}; P.forEach(x => Object.keys(x.fa).forEach(c => { tot[c] = (tot[c] || 0) + x.fa[c]; })); const totF = Object.values(tot).reduce((a, b) => a + b, 0);
  const moyC = C.map((c, i) => { const ok = P.filter(x => x.cr[i].ok); return ok.length ? ok.reduce((a, x) => a + x.cr[i].n / (x.cr[i].tot || 1), 0) / ok.length : null; });
  let faible = -1; moyC.forEach((m, i) => { if (m != null && (faible < 0 || m < moyC[faible])) faible = i; });
  const th = c => '<th title="' + escapeAttr(T[c].libelle) + '"><span class="av-ty" style="background:' + T[c].fond + ";color:" + (T[c].texte || T[c].couleur) + ";border-color:" + T[c].couleur + '">' + c + "</span></th>";
  const ligne = x => x.abs ? '<tr class="av-ligne-abs"><td>' + escapeHtml(x.nm) + '</td><td class="av-n"><b class="av-abs">ABS</b></td><td colspan="' + (C.length + ty.length + 5) + '"><span class="av-m">absent : ne compte pas dans la classe</span></td></tr>' : "<tr><td>" + escapeHtml(x.nm) + avGrilleBouton(x.k) + '</td><td class="av-n">' + (x.nt.ok ? "<b>" + nb(x.nt.n) + " / " + x.nt.tot + "</b>" : '<span class="av-m">pas finie</span>') + "</td>" + '<td class="av-n">' + (x.dnb ? '<span class="av-dnb">⚠ orthographe</span>' : x.dnb === false ? "—" : "") + "</td>"
    + C.map((c, i) => '<td class="av-n">' + (x.cr[i].ok ? nb(x.cr[i].n) + " / " + x.cr[i].tot : '<span class="av-m">…</span>') + "</td>").join("")
    + '<td class="av-n"><b>' + (x.nf || "") + "</b></td>" + ty.map(c => '<td class="av-n">' + (x.fa[c] || "") + "</td>").join("") + '<td class="av-n">' + (x.fa._ || "") + "</td>" + avLignesTemps(x.f) + "</tr>" + avGrilleDetail(x.k, C.length + ty.length + 7);
  const classe = '<tr class="av-classe"><td>La classe' + (nAbs ? '<br><span class="av-m">' + nAbs + " absent" + (nAbs > 1 ? "s" : "") + " hors compte</span>" : "") + '</td><td class="av-n">' + (finies.length ? "<b>" + nb(finies.reduce((a, x) => a + x.nt.n, 0) / finies.length) + " / " + finies[0].nt.tot + "</b><br><span class=\"av-m\">moyenne de " + finies.length + " copie" + (finies.length > 1 ? "s" : "") + " finie" + (finies.length > 1 ? "s" : "") + "</span>" : '<span class="av-m">aucune copie finie</span>') + "</td>" + '<td class="av-n">' + (P.filter(x => x.dnb).length ? '<span class="av-dnb">⚠ ' + P.filter(x => x.dnb).length + "</span>" : "—") + "</td>"
    + C.map((c, i) => '<td class="av-n' + (i === faible ? " av-faible" : "") + '"' + (i === faible ? ' title="Le critère le plus faible de la classe"' : "") + ">" + (moyC[i] != null ? Math.round(100 * moyC[i]) + " %" + (i === faible ? "<br><span class=\"av-m\">le plus faible</span>" : "") : "…") + "</td>").join("")
    + '<td class="av-n"><b>' + totF + "</b></td>" + ty.map(c => '<td class="av-n">' + (tot[c] ? tot[c] + '<br><span class="av-m">' + Math.round(100 * tot[c] / totF) + " %</span>" : "") + "</td>").join("") + '<td class="av-n">' + (tot._ ? tot._ + '<br><span class="av-m">' + Math.round(100 * tot._ / totF) + " %</span>" : "") + "</td>" + avLignesTempsClasse(P.map(x => x.f)) + "</tr>";
  v.innerHTML = '<div class="rp-carte av-bilan"><h2>Bilan de la classe</h2><p>Tiré de la correction sur les scans et de la bande, sans rien écrire. Une copie pas finie n’entre pas dans la moyenne. Les fautes comptées par type d’erreur sont celles de la bande ; une faute marquée avec la méthode d’avant est « sans type ». « ▸ sa grille » montre, pour une copie corrigée avec les stickers, chaque ligne de sa grille.</p>'
    + '<div class="av-tab"><table class="rp-table"><thead><tr><th>Élève</th><th>Note</th><th title="' + escapeAttr((al.titre ? al.titre + " : " : "") + "la copie dont l’orthographe tombe au plus bas niveau de la grille (trop de fautes par ligne) peut être déclassée au brevet. Une colonne, jamais une alerte.") + '">Brevet</th>' + C.map(c => "<th>" + escapeHtml(c.nom) + "</th>").join("") + "<th>Fautes</th>" + ty.map(th).join("") + '<th title="Une faute sans type d’erreur : marquée avant la bande, ou oubliée par l’IA">sans type</th><th title="Les lignes de sa copie que tu as recopiées.">Lignes</th><th title="Ton temps sur sa copie, compté seul : à la recopie, puis dans la bande. Une minute sans geste ne compte pas.">Ton temps</th></tr></thead><tbody>'
    + L.map(ligne).join("") + classe + "</tbody></table></div></div>";
}
/* [C14 406] le Bilan avec les stickers : les lignes recopiées et ton temps ; « ▸ sa grille » : chaque ligne de sa grille, ses points, son niveau, ses stickers réussis */
const AV_GRILLES = new Set();
function avDureeB(ms) { const s = Math.round((ms || 0) / 1000); return s < 60 ? s + " s" : s < 3600 ? Math.floor(s / 60) + " min" : Math.floor(s / 3600) + " h " + String(Math.floor(s / 60) % 60).padStart(2, "0"); }
function avLignesTemps(f) { f = f || {}; const T = f.temps || {}, t = (T.recopie || 0) + (T.bande || 0);
  return '<td class="av-n">' + (f.lignes || "") + '</td><td class="av-n">' + (t ? '<span title="recopie ' + escapeAttr(avDureeB(T.recopie)) + " · bande " + escapeAttr(avDureeB(T.bande)) + '">' + avDureeB(t) + "</span>" : "") + "</td>"; }
function avLignesTempsClasse(F) { const L = F.reduce((a, f) => a + ((f || {}).lignes || 0), 0), T = F.map(f => (((f || {}).temps) || {})), t = T.reduce((a, x) => a + (x.recopie || 0) + (x.bande || 0), 0), n = T.filter(x => (x.recopie || 0) + (x.bande || 0) > 0).length;
  return '<td class="av-n"><b>' + (L || "") + '</b></td><td class="av-n">' + (t ? "<b>" + avDureeB(t) + "</b>" + (n ? '<br><span class="av-m">' + avDureeB(t / n) + " par copie</span>" : "") : "") + "</td>"; }
function avGrilleBouton(k) { if (!(typeof stCorrigeeAvec === "function" && stCorrigeeAvec(k))) return ""; const o = AV_GRILLES.has(k);
  return ' <button class="av-grille-b" data-k="' + escapeAttr(k) + '" aria-expanded="' + o + '" onclick="avGrilleBasculer(this.dataset.k)" title="' + (o ? "Replier les lignes de sa grille." : "Voir chaque ligne de sa grille : ses points, son niveau, ses stickers réussis.") + '">' + (o ? "▾" : "▸") + " sa grille</button>"; }
function avGrilleBasculer(k) { if (AV_GRILLES.has(k)) AV_GRILLES.delete(k); else AV_GRILLES.add(k); avBilanClasse(); const b = Array.from(document.querySelectorAll("#ruVue_bilan .av-grille-b")).find(x => x.dataset.k === k); if (b) b.focus({ preventScroll: true }); }   // le bouton cliqué garde le focus
function avGrilleDetail(k, n) {
  if (!AV_GRILLES.has(k) || !(typeof stCorrigeeAvec === "function" && stCorrigeeAvec(k))) return ""; const nt = stNoteCopie(k), det = {}, D = scCopie(k).stickers || {}, nb = x => String(Math.round(x * 100) / 100).replace(".", ","); nt.det.forEach(x => { det[x.ligne] = x; });
  const L = stSujetLignes().map(l => { const x = det[l.id] || {}, S = stDeLigne(l.id).filter(y => y.etat === "valide" && !y.neCompte), r = S.filter(y => (D[y.id] || {}).v === "o");
    return '<li style="border-left-color:' + (SC_CRIT[l.crit] || "#6b7280") + '"><b>' + escapeHtml(l.titre) + '</b> <span class="av-g-pts">' + nb(x.points || 0) + " / " + (Number(l.poids) || 0) + "</span>" + (x.niveau != null ? ' <span class="av-m">niveau ' + x.niveau + "</span>" : "")
      + (S.length ? ' <span class="av-m">· ' + r.length + " sticker" + (r.length > 1 ? "s" : "") + " réussi" + (r.length > 1 ? "s" : "") + " sur " + S.length + "</span>" : "") + (r.length ? '<br><span class="av-g-r">' + r.map(y => escapeHtml(y.texteEleve)).join(" · ") + "</span>" : "") + "</li>"; }).join("");
  return '<tr class="av-det"><td colspan="' + n + '"><ol class="av-grille">' + L + '</ol><span class="av-m">' + (stFinie(k) ? "Total : " + nb(nt.n) + " / " + nt.tot : "Pas finie : chaque sticker proposé par l’IA n’est pas encore décidé.") + "</span></td></tr>";
}
/* l'onglet « Fiches élèves » : les fichiers École Directe des scans (la fiche HTML d'origine est rangée) */
function avFiches() {
  const v = document.getElementById("ruVue_fiches"); if (!v) return; avPagesCharger(); avGrille();
  const L = state.classe.map(nm => { const k = eleveId(nm); if (avAbsent(k)) return "<tr><td>" + escapeHtml(nm) + '</td><td class="av-n"><b class="av-abs">ABS</b></td><td>absent : pas de fichier</td></tr>'; const f = avFlux(k), nt = typeof stCorrigeeAvec === "function" && stCorrigeeAvec(k) ? stNoteBilan(k) : avPret() && SC.grille ? scNote(k) : { ok: false }; return "<tr><td>" + escapeHtml(nm) + '</td><td class="av-n">' + (nt.ok ? "<b>" + String(Math.round(nt.n * 10) / 10).replace(".", ",") + " / " + nt.tot + "</b>" : "—") + '</td><td class="' + (nt.ok ? "rp-ok" : "") + '">' + (nt.ok ? "prête : la correction est finie" : f && (f.lignes || f.arrets) ? "pas encore : la correction est en cours" : "pas encore commencée") + "</td></tr>"; }).join("");
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
/* ═══ [C14 1.4.13] l'élève absent, comme en dictée (Paul 01/11 08:37 : « il faut que je puisse déclarer un élève absent comme en dictée ») ═══
   Clic droit sur sa carte : « ❌ Marquer absent » ; encore : « ✓ Marquer présent ». Gardé au site avec le suivi de la classe (state.absents, comme
   correction_dictee/<id>/absents). Un absent ne compte ni dans le compteur, ni dans la moyenne et les totaux du Bilan, ni dans les fichiers École Directe ;
   les initiales ne lui donnent pas de page. Rien n'est effacé : sa copie, s'il en a une, reste au site, mise de côté. */
function avAbsent(k) { return !!(state && state.absents && state.absents[k]); }
function avAbsentBasculer(k) {
  const nom = nomEleveDe(k) || k, a = Object.assign({}, state.absents || {}); if (a[k]) delete a[k]; else a[k] = true; state.absents = a;
  saveState(); renderDashboard(); if (RU.sous === "bilan") avBilanClasse(); if (RU.sous === "fiches") avFiches();
  toast(a[k] ? nom + " est marqué absent : il ne compte plus dans la classe." : nom + " est de nouveau présent.");
}
function avMenuFermer() { const m = document.getElementById("avMenu"); if (m) m.remove(); }
function avMenuEleve(ev, k) {
  ev.preventDefault(); ev.stopPropagation(); avMenuFermer();
  const nom = nomEleveDe(k) || k, abs = avAbsent(k), d = document.createElement("div"); d.id = "avMenu"; d.className = "av-menu-fond";
  d.onclick = avMenuFermer; d.oncontextmenu = e => { e.preventDefault(); avMenuFermer(); };
  d.innerHTML = '<div class="av-menu" style="left:' + Math.min(ev.clientX, innerWidth - 260) + "px;top:" + Math.min(ev.clientY, innerHeight - 150) + 'px" onclick="event.stopPropagation()"><b>' + escapeHtml(nom) + "</b>"
    + '<button id="avAbsentBtn" onclick="avMenuFermer();avAbsentBasculer(\'' + escapeAttr(k) + '\')" title="' + (abs ? "Il était là : il revient dans le compteur, le Bilan et les fichiers École Directe." : "Il n’a pas fait la rédaction : il sort du compteur, de la moyenne et des totaux du Bilan, et des fichiers École Directe. Rien n’est effacé ; un autre clic droit le remet présent.") + '">' + (abs ? "✓ Marquer présent" : "❌ Marquer absent") + "</button></div>";
  document.body.appendChild(d);
}
document.addEventListener("keydown", e => { if (e.key === "Escape" && document.getElementById("avMenu")) { e.stopPropagation(); avMenuFermer(); } }, true);
/* ═══ [C14] la sauvegarde JSON, étendue à tout (Paul 01/11 13:12 : « La sauvegarde json reste, d'ailleurs il faut l'étendre à l'ensemble des nouvelles fonctionnalités.
   Quand un paquet est complètement corrigé, l'App propose un téléchargement du json de sauvegarde en local et le range aussi au hub. »)
   Elle prend toute la rédaction telle qu'elle est au site : le sujet et sa grille de stickers, les copies (recopie, envois à l'IA, corrigés, bande, stickers, remarques, temps),
   les pages du paquet, les retours des élèves. Même format que « 📸 Snapshot » : « 📤 Restaurer » la relit. Les photos n'y sont pas : elles ne quittent jamais ce navigateur. ═══ */
function svCompter(d) {
  d = d || {}; const C = (d.copies || {})[RU.classe] || {}, ks = Object.keys(C), sc = k => (C[k] || {}).scan || {}, rc = k => sc(k).recopie || {}, cfg = d.config || {};
  const nb = f => ks.filter(f).length, lignes = k => Object.values(rc(k).pages || {}).reduce((s, p) => s + Object.values((p || {}).lignes || {}).filter(l => l && (l.texte || "").trim()).length, 0);
  return { copies: ks.length, recopiees: nb(k => lignes(k) > 0), lignes: ks.reduce((s, k) => s + lignes(k), 0), envoyees: nb(k => !!rc(k).envoi), phrases: nb(k => !!rc(k).phrase),
    marques: ks.reduce((s, k) => s + Object.keys(sc(k).marques || {}).length, 0), stickersDecides: ks.reduce((s, k) => s + Object.keys(sc(k).stickers || {}).length, 0),
    stickersGrille: Object.keys(cfg.stickers || {}).length, lignesGrille: Object.keys(cfg.stickersLignes || {}).length,
    pages: Object.keys((((d.scan || {})[RU.classe]) || {}).pages || {}).length, retours: Object.keys(((d.retours || {})[RU.classe]) || {}).length };
}
function svDire(c) { const p = (n, m, s) => n + " " + m + (n > 1 ? (s || "s") : ""); return [p(c.copies, "copie"), p(c.recopiees, "recopiée") + " (" + p(c.lignes, "ligne") + ")", p(c.envoyees, "envoyée") + " à l’IA", p(c.phrases, "phrase") + " qui t’a marqué", p(c.marques, "marque"), p(c.stickersDecides, "sticker") + " décidé" + (c.stickersDecides > 1 ? "s" : ""), "la grille : " + p(c.stickersGrille, "sticker") + ", " + p(c.lignesGrille, "ligne"), p(c.pages, "page") + " du paquet", p(c.retours, "retour") + " d’élève"].join(" · "); }
function svNom(d) { const z = n => String(n).padStart(2, "0"); return "Sauvegarde_" + scTitreFichier() + "_" + scSlug(RU.classeNom || RU.classe || "") + "_" + d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()) + "_" + z(d.getHours()) + "h" + z(d.getMinutes()) + ".json"; }
function svFaire(raison) {
  // le dernier geste n'attend pas : les copies et le suivi partent tout de suite, et la sauvegarde les prend telles qu'elles s'écrivent (la forme du site)
  clearTimeout(RU.timer); try { synchroniser(); } catch (e) {}
  return ruLire(["redactions", RU.id]).then(d => { if (!d) throw new Error("rien au site pour cette rédaction"); const le = new Date();
    d.copies = d.copies || {}; const C = d.copies[RU.classe] = d.copies[RU.classe] || {}; Object.keys(RU.sig || {}).forEach(k => { try { const v = scFb(JSON.parse(RU.sig[k])); if (v) C[k] = v; } catch (e) {} });
    if (RU.sigSuivi) { try { d.suivi = d.suivi || {}; const v = scFb(JSON.parse(RU.sigSuivi)); if (v) d.suivi[RU.classe] = v; } catch (e) {} }
    d = scFb(d);
    return { nom: svNom(le), cle: svNom(le).replace(/^Sauvegarde_/, "").replace(/\.json$/, "").replace(/[.#$\[\]\/]/g, "-"), o: { _meta: { source: "redactions/" + RU.id, exportedAt: le.toISOString(), exportedBy: "sauvegarde_" + raison, version: 2, titre: SUJET.titre, classe: RU.classeNom || RU.classe, contenu: svCompter(d), photos: "dans ce navigateur seulement : elles ne passent jamais par le site" }, data: d } }; });
}
function svTelecharger() { return svFaire("manuelle").then(s => { ruTelecharger(s.o, s.nom); toast("Sauvegarde téléchargée : " + svDire(s.o._meta.contenu) + "."); return s; }, e => toast("⚠ La sauvegarde n’a pas pu se faire : " + (e && e.message || e))); }
/* le paquet est complètement corrigé : chaque copie présente est recopiée jusqu'à sa phrase, son corrigé est chargé, chaque arrêt de sa bande (fautes et stickers) est décidé, ses remarques sont relues ; avec une grille de stickers, ses réussites sont revenues de l'IA */
function svCopieCorrigee(k) {
  const f = rcFluxCopie(k); if (!f.finie || !f.charge) return false;
  if (typeof stRqARelire === "function" && stRqARelire(k)) return false;
  if (typeof stActifs === "function" && stActifs().some(s => s.etat === "valide") && typeof stFinie === "function" && !stFinie(k)) return false;   // avec une grille de stickers : ses réussites revenues de l'IA et décidées
  return rcArretsBande(k).every(a => a.st ? !!stDecision(k, a.stId) : !!(a.l.decisions && a.l.decisions[a.cle]));
}
function svPaquet() { const Q = typeof scCopiesED === "function" ? scCopiesED() : []; const ok = Q.filter(svCopieCorrigee); return { n: Q.length, ok: ok.length, complet: Q.length > 0 && ok.length === Q.length }; }
function svBase() { try { SC.svComplet = svPaquet().complet; } catch (e) { SC.svComplet = null; } }
function svVerifier() {   // après chaque geste qui peut finir une copie ; la copie en cours d'abord (un calcul court), toute la classe seulement si elle est finie
  if (typeof SC === "undefined" || !SC.ouvert || typeof rcFluxCopie !== "function") return;
  try { const k = typeof RC !== "undefined" && RC.ouvert ? RC.copie : null;
    if (SC.svComplet == null) { SC.svComplet = svPaquet().complet; return; }
    if (k && !svCopieCorrigee(k)) { SC.svComplet = false; return; }
    if (SC.svComplet) return; const e = svPaquet(); if (!e.complet) return; SC.svComplet = true; svProposer(e); } catch (x) { console.warn("sauvegarde du paquet :", x); }
}
function svProposer(e) {
  return svFaire("paquet-corrige").then(s => { SC.svDerniere = s;
    scModale('<h3>💾 Le paquet est entièrement corrigé</h3><p>' + (e.n > 1 ? "Les " + e.n + " copies du paquet sont recopiées jusqu’à leur phrase, chargées, et leur bande est finie." : "La copie du paquet est recopiée jusqu’à sa phrase, chargée, et sa bande est finie.") + ' Ta sauvegarde est prête : toute la rédaction, telle qu’elle est au site (' + escapeHtml(svDire(s.o._meta.contenu)) + '). Les photos n’y sont pas : elles restent dans ce navigateur et sur ta clé.</p>'
      + '<p id="svHub" class="sc-m" role="status">Je la range au site…</p><button class="sc-btn" id="svTelechargerBtn" title="Télécharger ce fichier de sauvegarde sur cet ordinateur (« ' + escapeAttr(s.nom) + ' »). « 📤 Restaurer » le relit.">💾 Télécharger la sauvegarde</button> <button class="sc-btn" onclick="scModaleFermer()" title="Fermer : la sauvegarde reste rangée au site ; « 💾 Télécharger la sauvegarde » du flux en refait une à tout moment.">Plus tard</button>');
    const b = document.getElementById("svTelechargerBtn"); if (b) b.onclick = () => { ruTelecharger(s.o, s.nom); b.textContent = "✓ Téléchargée"; };
    return ruEcrire(["sauvegardes", "redactions", RU.id, s.cle], s.o, "la sauvegarde du paquet corrigé").then(i => { const ok = i && i.etat === MJPC_ISSUE.ACCEPTEE, h = document.getElementById("svHub");
      if (h) h.textContent = ok ? "✓ Rangée au site, dans les sauvegardes de cette rédaction (« " + s.cle + " »)." : "⚠ Le site ne l’a pas prise : télécharge-la ici, et dis-le à la conscience."; SC.svHub = ok ? s.cle : null; return ok; }); },
    x => toast("⚠ Le paquet est corrigé, mais la sauvegarde n’a pas pu se faire : " + (x && x.message || x)));
}
/* [C14 407] l'aide « ? » du Bilan, des Fiches élèves et des Réglages : seulement ce qui reste */
RU_AIDES.bilan = { ou: "Données — Bilan", l: [
  ["le tableau", "pour chaque élève : sa note, le Brevet, ses critères, ses fautes par type d’erreur, les lignes recopiées, ton temps sur sa copie"],
  ["« ▸ sa grille »", "pour une copie corrigée avec les stickers : chaque ligne de sa grille, ses points, son niveau, ses stickers réussis ; un autre clic la replie"],
  ["en bas, la classe", "la moyenne des copies finies, la part de chaque type d’erreur, le critère le plus faible, toutes les lignes et tout ton temps"],
  ["un élève absent", "sa ligne reste, sans note ; il ne compte pas dans la classe"]] };
RU_AIDES.fiches = { ou: "Données — Fiches élèves", l: [
  ["« 📨 Fichiers École Directe »", "ouvre l’écran des scans et la liste des fichiers : un fichier par élève, sa copie scannée et tes marques"],
  ["🧪 Tester comme l’élève", "son fichier dans un nouvel onglet, comme il le verra ; rien ne va au site"],
  ["Télécharger", "le fichier d’un élève, nommé comme dans ta liste de classe (« NOM Prénom.html »)"],
  ["📦 Tout rendre", "un seul zip : un fichier par élève, nommés comme dans ta liste de classe, pour l’extension d’École Directe ; un élève absent n’a pas de fichier"]] };
RU_AIDES.reglages = { ou: "Réglages — la grille et ses stickers", l: [
  ["📥 Charger des stickers", "une grille de stickers depuis un fichier (le format du prompt de création d’un sujet)"],
  ["✓ Valider ligne par ligne", "chaque ligne de la grille et ses stickers, un écran par ligne ; Entrée valide la ligne ; l’export pour l’IA attend que tout soit validé"],
  ["un sticker", "sa phrase pour l’élève, ce qu’il a à faire quand il ne l’a pas, ce que l’IA cherche ; ↑ ↓ sa place ; ⧉ le copier ; 🗑 le ranger (rien n’est effacé)"],
  ["＋ Un sticker · ⧉ Reprendre ceux d’un autre sujet", "écrire un sticker de plus sur une ligne · reprendre les stickers d’un autre sujet"]] };
