// =====================================================================
// RU — LE PANNEAU COMMUN (13 · 60, complément du 27/10) : le panneau de la correction de dictée
// =====================================================================
// Une rédaction = un sujet pour une classe (config.classe, sa clé interne) ; pour une autre classe, on la duplique.
// L'accueil « Mes rédactions » (par niveau, ✏️ ⧉ 🗑️, « Ouvrir → », « ＋ Nouvelle rédaction », la carte « Mode test », le « ? »),
// une rédaction ouverte (l'en-tête, 📸 Snapshot, 📤 Restaurer, ← Retour ; Pilotage · Données · Réglages).
// Ce qui est déjà au hub ne bouge jamais : un sujet de la forme 1.0.0-RU, qui porte des copies de plusieurs classes, s'affiche en une ligne par classe.
const RU_NIVEAUX = ["3e", "4e", "5e", "6e"];
// ── les lignes de l'accueil : une par sujet et par classe ──
function ruLignes(t) {
  const L = [];
  Object.keys(t || {}).forEach(id => {
    const n = t[id]; if (!n || !n.config) return;
    const c = normaliserSujet(n.config);
    const classes = c.classe ? [c.classe] : Object.keys(n.copies || {});
    (classes.length ? classes : [null]).forEach(k => L.push({ id, cfg: c, classe: k, copies: (n.copies || {})[k] || {}, ancienne: !c.classe && classes.length > 1 }));
  });
  return L;
}
function ruCopieFinie(cfg, cp) {   // « corrigée » : tous les points de sa grille notés (« non évalué » compte), comme progressionPct à 100 %
  const v = (cfg.variantes || []).find(x => x.id === cp.sujet) || ((cfg.variantes || []).length === 1 ? cfg.variantes[0] : null); if (!v) return false;
  return (v.criteres || []).every(cr => (cr.indicateurs || []).every(i => cp.echelons && cp.echelons[i.id] !== undefined));
}
function ruNiveauLigne(l) { const k = l.classe && RU.classes && RU.classes[l.classe]; const n = String((k && k.niveau) || l.cfg.niveau || "").toLowerCase(); return RU_NIVEAUX.find(x => n.indexOf(x) === 0) || ""; }
function ruNomClasse(k) { return k ? ((RU.classes && RU.classes[k] && RU.classes[k].nom) || k) : "classe à choisir"; }
function ruDate(iso) { if (!iso) return ""; try { return new Date(iso).toLocaleDateString("fr-FR"); } catch (e) { return ""; } }
function ruListeSujets() {   // l'accueil « Mes rédactions »
  ruEcran("ruSujets"); aidePoser("accueil");
  const l = document.getElementById("ruListe"); l.innerHTML = "<p class=\"ru-vide\">Lecture des rédactions…</p>";
  Promise.all([ruLire(["redactions"]), ruLire(["classes"])]).then(([t, cl]) => {
    RU.classes = cl || {}; RU.arbre = t || {};
    const L = ruLignes(t);
    l.innerHTML = RU_NIVEAUX.concat([""]).map(nv => {
      const G = L.filter(x => ruNiveauLigne(x) === nv).sort((a, b) => String(b.cfg.creeLe || "").localeCompare(String(a.cfg.creeLe || "")) || String(a.cfg.titre).localeCompare(String(b.cfg.titre), "fr"));
      if (!nv && !G.length) return "";
      return `<details class="rp-niveau" open><summary><b>${nv || "Autres"}</b> <span>${G.length ? G.length + " rédaction" + (G.length > 1 ? "s" : "") : "vide pour l’instant"}</span></summary>` +
        (G.length ? G.map(x => {
          const eleves = x.classe && RU.classes[x.classe] ? extractEleves(RU.classes[x.classe], []).length : 0;
          const finies = Object.keys(x.copies).filter(e => ruCopieFinie(x.cfg, x.copies[e])).length;
          const pct = eleves ? Math.round(100 * finies / eleves) : 0;
          const ref = escapeAttr(x.id), cl = escapeAttr(x.classe || "");
          return `<div class="rp-ligne" data-id="${ref}" data-classe="${cl}" onclick="if(!event.target.closest('button'))location.href=ruAdresse({id:'${ref}'${x.classe ? `,classe:'${cl}'` : ""}})">
            <div class="rp-ligne-t"><strong>${escapeHtml(x.cfg.titre || x.id)}</strong> <span>${escapeHtml(ruNomClasse(x.classe))} · sur ${x.cfg.total}${x.cfg.creeLe ? " · créée le " + ruDate(x.cfg.creeLe) : ""}${x.ancienne ? " · une des classes de ce sujet" : ""}</span></div>
            <div class="rp-ligne-a"><span class="rp-barre" title="${finies} copie${finies > 1 ? "s" : ""} corrigée${finies > 1 ? "s" : ""} sur ${eleves} élève${eleves > 1 ? "s" : ""}"><i style="width:${pct}%"></i></span><span class="rp-pct">${finies}/${eleves} · ${pct} %</span>
              <button class="rp-ic" onclick="ruCrayon('${ref}','${cl}')" title="Changer le titre ou la classe de cette rédaction">✏️</button>
              <button class="rp-ic" onclick="ruDupliquer('${ref}')" title="Dupliquer pour une autre classe : la grille, l’énoncé et les phrases déjà lues ; aucune copie d’élève">⧉</button>
              <button class="rp-ic" onclick="ruSupprimer('${ref}','${cl}')" title="Supprimer (archivée dans la corbeille MJPC, avec un export JSON téléchargé)">🗑️</button>
              <button class="rp-ouvrir" onclick="location.href=ruAdresse({id:'${ref}'${x.classe ? `,classe:'${cl}'` : ""}})" title="Ouvrir cette rédaction : préparer le sujet, corriger les copies de la classe, les fiches">Ouvrir →</button></div></div>`;
        }).join("") : `<p class="rp-vide">vide pour l’instant</p>`) + `</details>`;
    }).join("");
  }, () => { l.innerHTML = "<p class=\"ru-vide\">⚠ Le site ne répond pas : les rédactions n'ont pas pu être lues. Vérifie la connexion et recharge la page.</p>"; });
}
// ── ✏️ le titre et la classe (comme le crayon du modèle) ; une classe ne change plus quand des copies sont commencées ──
function ruCrayon(id, classe) {
  const n = RU.arbre[id]; if (!n) return; const c = n.config;
  document.getElementById("ruCrTitre").value = c.titre || "";
  const sel = document.getElementById("ruCrClasse"); const ks = ruClassesProposees();
  sel.innerHTML = ks.map(k => `<option value="${escapeAttr(k)}"${k === (c.classe || classe) ? " selected" : ""}>${escapeHtml(ruNomClasse(k))}</option>`).join("");
  const commencees = Object.keys((n.copies || {})[c.classe || classe] || {}).length;
  sel.disabled = !!commencees || (!c.classe && Object.keys(n.copies || {}).length > 1);
  document.getElementById("ruCrNote").textContent = sel.disabled ? (commencees ? "La classe ne change plus : " + commencees + " copie" + (commencees > 1 ? "s sont commencées" : " est commencée") + ". Pour une autre classe, « ⧉ Dupliquer »." : "Ce sujet porte les copies de plusieurs classes : la classe ne se change pas ici.") : "";
  RU.crayon = { id, classe }; document.getElementById("modalCrayon").classList.add("show");
}
function ruCrayonOk() {
  const { id } = RU.crayon; const n = RU.arbre[id]; const t = document.getElementById("ruCrTitre").value.trim(); const sel = document.getElementById("ruCrClasse");
  const maint = new Date().toISOString(); const P = [];
  if (t && t !== n.config.titre) P.push(ruEcrire(["redactions", id, "config", "titre"], t, "le titre"));
  if (!sel.disabled && sel.value && sel.value !== n.config.classe) P.push(ruEcrire(["redactions", id, "config", "classe"], sel.value, "la classe"));
  if (P.length) P.push(ruEcrire(["redactions", id, "config", "modifieLe"], maint, "l'heure du sujet"));
  fermerModale("modalCrayon"); Promise.all(P).then(() => { toast("Rédaction modifiée"); ruListeSujets(); });
}
// ── ⧉ dupliquer (comme dupliquerDicteeEntiere : tous les réglages, jamais l'état des élèves) ──
function ruDupliquer(id) {
  const n = RU.arbre[id]; if (!n) return;
  const cfg = JSON.parse(JSON.stringify(n.config)); const maint = new Date().toISOString(); const nid = idSujet();
  const pris = new Set(Object.keys(RU.arbre).map(k => (RU.arbre[k].config || {}).nomCourt).filter(Boolean));
  let nc = (cfg.nomCourt || cfg.id || "redaction") + "-copie", i = 2; while (pris.has(nc)) nc = (cfg.nomCourt || cfg.id || "redaction") + "-copie-" + (i++);
  Object.assign(cfg, { idInterne: nid, id: nid, nomCourt: nc, titre: "Copie de " + (cfg.titre || ""), creeLe: maint, modifieLe: maint });
  const copie = { config: cfg }; if (n.validations) copie.validations = JSON.parse(JSON.stringify(n.validations));
  ruEcrire(["redactions", nid], copie, "la rédaction dupliquée").then(i => {
    if (i.etat !== MJPC_ISSUE.ACCEPTEE) { alert("La duplication n’a pas pu s’écrire au site : rien n’a changé."); return; }
    alert("Rédaction dupliquée : " + cfg.titre + " (la grille, l’énoncé, " + Object.keys(copie.validations || {}).length + " phrase(s) déjà lue(s) ; aucune copie d’élève). Réaffecte-la à une classe avec le crayon ✏️.");
    ruListeSujets();
  });
}
// ── 🗑️ supprimer (comme supprimerDicteeAvecCorbeille : un export JSON téléchargé, puis la corbeille MJPC, puis l'effacement) ──
function ruTelecharger(obj, nom) { try { const b = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = nom; a.click(); URL.revokeObjectURL(u); } catch (e) {} }
function ruCorbeille(motif, source, data, meta) {
  const now = new Date(); const an = now.getMonth() < 7 ? (now.getFullYear() - 1) + "-" + now.getFullYear() : now.getFullYear() + "-" + (now.getFullYear() + 1);
  const jour = now.toISOString().slice(0, 10), hh = ("0" + now.getHours()).slice(-2) + ("0" + now.getMinutes()).slice(-2) + ("0" + now.getSeconds()).slice(-2);
  return ruEcrire(["corbeille", jour, motif + "_" + hh], { _meta: Object.assign({ motif, annee: an, source, le: Date.now() }, meta || {}), data }, "la corbeille");
}
function ruSupprimer(id, classe) {
  const n = RU.arbre[id]; if (!n) return; const tout = !!n.config.classe || Object.keys(n.copies || {}).length <= 1 || !classe;
  const titre = n.config.titre + (tout ? "" : " — " + ruNomClasse(classe));
  if (!confirm("Supprimer " + titre + " ?\n\nElle sera archivée dans la corbeille MJPC (récupérable un an) et un export JSON sera téléchargé.\n\nContinuer ?")) return;
  const chemin = tout ? ["redactions", id] : ["redactions", id, "copies", classe];
  const data = tout ? n : { copies: n.copies[classe], suivi: (n.suivi || {})[classe] || null };
  ruTelecharger({ _meta: { source: chemin.join("/"), exportedAt: new Date().toISOString(), exportedBy: "suppression_auto", version: 1 }, data }, "redaction_" + id + (tout ? "" : "_" + classe) + "_" + new Date().toISOString().slice(0, 10) + ".json");
  ruCorbeille("suppression-redaction", chemin.join("/"), data, { redaction: id, titre }).then(i => {
    if (i.etat !== MJPC_ISSUE.ACCEPTEE && !confirm("L’archivage dans la corbeille MJPC a échoué.\n\nL’export JSON, lui, est bien téléchargé.\n\nSupprimer quand même ?")) return;
    const P = [ruEcrire(chemin, null, "la rédaction supprimée")]; if (!tout) P.push(ruEcrire(["redactions", id, "suivi", classe], null, "le suivi"));
    Promise.all(P).then(() => { toast("Rédaction supprimée (corbeille MJPC)"); ruListeSujets(); });
  });
}
// ── la carte « Mode test » ──
function ruModeTestCarte() { const d = document.getElementById("ruTestCorps"); d.hidden = !d.hidden; document.getElementById("ruTestBtn").textContent = d.hidden ? "Ouvrir ▾" : "Fermer ▴"; }
function ruModeTestBasculer() { const p = new URLSearchParams(location.search); if (RU.test) p.delete("test"); else p.set("test", "1"); location.href = location.pathname + "?" + p.toString(); }
// ── une rédaction ouverte : l'en-tête, les onglets ──
const RU_ONGLETS = { pilotage: [["preparation", "Préparation"], ["correction", "Correction"]], donnees: [["bilan", "Bilan"], ["fiches", "Fiches élèves"]], reglages: [] };
function ruEnteteRedaction() {
  const n = state.classe.length; const finies = state.classe.filter(nm => progressionPct(eleveId(nm)) === 100).length; const pct = n ? Math.round(100 * finies / n) : 0;
  const t = document.getElementById("ruTitre"); if (t) t.textContent = (SUJET && SUJET.titre) || "Rédaction";
  const s = document.getElementById("ruSousTitre"); if (s) s.textContent = (RU.classeNom || "aucune classe choisie") + " · " + finies + "/" + n + " · " + pct + " %";
  const b = document.getElementById("ruBarreRed"); if (b) b.style.width = pct + "%";
}
function ruOnglet(o, sous) {
  RU.onglet = o; RU.sous = sous || (RU_ONGLETS[o][0] || [])[0] || null;
  document.querySelectorAll("#ruOnglets [data-o]").forEach(b => b.classList.toggle("on", b.dataset.o === o));
  document.getElementById("ruSous").innerHTML = RU_ONGLETS[o].map(([k, lib]) => `<button data-s="${k}" class="${k === RU.sous ? "on" : ""}" onclick="ruOnglet('${o}','${k}')">${lib}</button>`).join("");
  const vue = RU.sous || o;
  ["preparation", "bilan", "fiches", "reglages"].forEach(v => { const e = document.getElementById("ruVue_" + v); if (e) e.classList.toggle("hidden", v !== vue); });
  const corr = vue === "correction";
  ["dashboard", "correctionView", "bandeauEleve"].forEach(x => { const e = document.getElementById(x); if (e && !corr) e.classList.add("hidden"); });
  if (corr) { if (!RU.dansCorrection) { RU.dansCorrection = true; showDashboard(); } else if (document.getElementById("correctionView").classList.contains("hidden")) showDashboard(); }
  else RU.dansCorrection = false;
  if (vue === "preparation") ruRendrePreparation();
  if (vue === "bilan") document.getElementById("ruVue_bilan").innerHTML = `<div class="rp-carte"><h2>Bilan de la correction</h2>${genererContenuStatsProf()}</div>`;
  if (vue === "fiches") ruRendreFiches();
  if (vue === "reglages") ruRendreReglages();
  aidePoser(vue);
}
function ruRendrePreparation() {
  const st = etatValidationSujet(SUJET, RU_VALID);
  const vs = (SUJET.variantes || []).filter(v => v.enonce != null);
  document.getElementById("ruVue_preparation").innerHTML = `<div class="rp-carte"><h2>Les phrases de la grille</h2>
    <p>${st.valides} point${st.valides > 1 ? "s" : ""} validé${st.valides > 1 ? "s" : ""} sur ${st.total}. Une phrase choisie en corrigeant compte déjà comme lue ; une fiche ne sort pas tant qu’une phrase qu’elle porte n’est pas lue.</p>
    <button class="rp-prim" onclick="location.href=ruAdresse({id:RU.id,vue:'preparer'})" title="Relire et valider les phrases, un point de la grille par écran">✓ Préparer le sujet</button></div>
    <div class="rp-carte"><h2>L’énoncé</h2><p>Il paraît en tête de chaque fiche${vs.length > 1 ? " (celui du sujet que l’élève a traité)" : ""}.</p>${vs.length ? vs.map(v => `<p class="rp-enonce"><b>${escapeHtml(v.libelle || v.id)}</b><br>${escapeHtml(v.enonce).replace(/\n/g, "<br>")}</p>`).join("") : `<p class="rp-enonce">${escapeHtml(state.sujet || SUJET.enonce || "").replace(/\n/g, "<br>")}</p>`}
    <button onclick="ouvrirSujet()" title="Corriger l’énoncé tel que distribué aux élèves">📝 Corriger l’énoncé</button></div>`;
}
function ruRendreFiches() {
  const lignes = state.classe.map(nm => { const id = eleveId(nm); const g = getGrille(id); const nl = g ? ruPhrasesNonLues(id) : []; const { total, complete } = noteTotale(id);
    const etat = !g ? "pas commencée" : nl.length ? "ne sort pas encore : " + nl.slice(0, 2).join(" ; ") + (nl.length > 2 ? "…" : "") : (complete ? "prête" : "prête (copie en cours)");
    return `<tr><td>${escapeHtml(nm)}</td><td>${g && complete ? total + " / " + totalPour(id) : "—"}</td><td class="${nl.length ? "rp-ko" : g ? "rp-ok" : ""}">${escapeHtml(etat)}</td>
      <td>${g ? `<button onclick="state.current='${escapeAttr(id)}';apercuHTML()" title="Voir la fiche dans un nouvel onglet">👁 Aperçu</button> <button onclick="state.current='${escapeAttr(id)}';exporterHTMLEleve()" title="Télécharger la fiche de cet élève">🖨️ Exporter</button>` : ""}</td></tr>`; }).join("");
  document.getElementById("ruVue_fiches").innerHTML = `<div class="rp-carte"><h2>Fiches élèves</h2><p>Une fiche par élève, à imprimer ou à envoyer par École Directe.</p>
    <button onclick="exporterToutHTML()" id="ruBtnToutHTML" class="rp-prim">🖨️ Exporter tous HTML</button>
    <table class="rp-table"><thead><tr><th>Élève</th><th>Note</th><th>La fiche</th><th></th></tr></thead><tbody>${lignes}</tbody></table></div>`;
  ruMajBoutonsFiche();
}
function ruRendreReglages() {
  document.getElementById("ruVue_reglages").innerHTML = `<div class="rp-carte"><h2>La grille du sujet</h2><p>Telle qu’elle se lit aujourd’hui. Ses phrases se relisent et se corrigent dans « Préparer le sujet » ; les poids et les seuils du compteur sont ceux du sujet créé.</p>
    <button onclick="location.href=ruAdresse({id:RU.id,vue:'preparer'})">✓ Préparer le sujet</button>` +
    (SUJET.variantes || []).map(v => `<h3>${SUJET.variantes.length > 1 ? escapeHtml(v.libelle || v.id) + " — " : ""}sur ${v.total}</h3><table class="rp-table"><thead><tr><th>Critère</th><th>Point</th><th>Poids</th><th>Compétence</th></tr></thead><tbody>` +
      v.criteres.map(cr => cr.indicateurs.map((i, k) => `<tr><td>${k ? "" : escapeHtml(cr.titre) + " (" + cr.pts_max + ")"}</td><td>${escapeHtml(i.libelle)}</td><td>${i.poids}</td><td>${escapeHtml((i.competences || []).join(", "))}</td></tr>`).join("")).join("") + `</tbody></table>` +
      (v.compteur ? `<p><b>Le compteur d’orthographe</b> (« ${escapeHtml(v.compteur.indicateur)} »${v.compteur.selon ? ", selon « " + escapeHtml(v.compteur.selon) + " »" : ""}) : ` + [3, 2, 1, 0].map(e => ECHELON_COULEUR[e].label + " → " + (v.compteur.seuils[e] || []).join(" / ")).join(" · ") + ` (jusqu’à combien d’erreurs : très satisfaisant / satisfaisant / fragile).</p>` : "")).join("") + `</div>`;
}
// ── 📸 Snapshot et 📤 Restaurer (le patron du modèle) ; Restaurer lit aussi une sauvegarde de l'ancienne app ──
function ruSnapshot() {
  ruLire(["redactions", RU.id]).then(d => { if (!d) { alert("Aucune donnée à exporter."); return; }
    ruTelecharger({ _meta: { source: "redactions/" + RU.id, exportedAt: new Date().toISOString(), exportedBy: "snapshot_tool", version: 1, titre: SUJET.titre }, data: d }, "redaction_" + (SUJET.nomCourt || RU.id) + "_" + new Date().toISOString().slice(0, 10) + ".json");
    toast("Snapshot téléchargé"); });
}
function ruRestaurer(ev) {
  const f = ev.target.files[0]; ev.target.value = ""; if (!f) return;
  const r = new FileReader(); r.onload = e => {
    let p; try { p = JSON.parse(e.target.result); } catch (x) { alert("Fichier invalide : " + x.message); return; }
    if (p && p.data && p._meta && /^redactions\//.test(String(p._meta.source || ""))) {   // un snapshot de cette app
      if (!confirm("⚠️ Écraser cette rédaction (« " + SUJET.titre + " ») avec le snapshot du " + (p._meta.exportedAt || "?") + " ?\n\nL’état d’aujourd’hui part d’abord dans la corbeille MJPC.")) return;
      ruLire(["redactions", RU.id]).then(avant => ruCorbeille("restauration-redaction", "redactions/" + RU.id, avant, { redaction: RU.id }))
        .then(() => ruEcrire(["redactions", RU.id], p.data, "la rédaction restaurée")).then(i => { if (i.etat === MJPC_ISSUE.ACCEPTEE) { alert("✅ Snapshot restauré."); location.reload(); } else alert("La restauration n’a pas pu s’écrire au site : rien n’a changé."); });
      return;
    }
    if (p && p.copies && typeof p.copies === "object") {   // une sauvegarde de l'ancienne app (redaction_dugain_v3 : « Exporter JSON »)
      const vus = [], perdus = [];
      Object.keys(p.copies).forEach(k => { const nm = state.classe.find(n => eleveIdAncien(n) === k || eleveId(n) === k); if (nm) vus.push([nm, k]); else perdus.push(k); });
      if (!vus.length) { alert("Aucune copie de ce fichier ne correspond à un élève de " + RU.classeNom + "."); return; }
      if (!confirm("Importer " + vus.length + " copie(s) de l’ancienne sauvegarde dans " + RU.classeNom + " ?" + (perdus.length ? "\n\nSans élève dans cette classe (non importées) : " + perdus.join(", ") : "") + "\n\nUne copie déjà commencée ici est remplacée (l’état d’avant part dans la corbeille MJPC).")) return;
      ruCorbeille("import-ancienne-sauvegarde", "redactions/" + RU.id + "/copies/" + RU.classe, JSON.parse(JSON.stringify(state.copies)), { redaction: RU.id }).then(() => {
        vus.forEach(([nm, k]) => { const c = JSON.parse(JSON.stringify(p.copies[k])); RU_IDENTITE.forEach(x => delete c[x]); state.copies[eleveId(nm)] = c; if (RU.sigCorps) delete RU.sigCorps[eleveId(nm)]; });
        if (p.sujet && !SUJET.variantes.some(v => v.enonce)) { /* l'énoncé de l'ancienne app reste celui du sujet */ }
        saveState(); synchroniser(); showDashboard(); alert("✅ " + vus.length + " copie(s) importée(s)" + (perdus.length ? " ; " + perdus.length + " sans élève" : "") + ".");
      });
      return;
    }
    alert("Ce fichier n’est ni un snapshot de la Rédaction, ni une sauvegarde de l’ancienne app.");
  }; r.readAsText(f);
}
// ── le « ? » qui suit l'écran (comme AIDES du modèle) ──
const RU_AIDES = {
  accueil: { ou: "Accueil — Mes rédactions", l: [["« Ouvrir → » (ou clic sur une ligne)", "ouvrir la rédaction : Préparation, Correction, Bilan, Fiches élèves, Réglages"], ["✏️", "changer le titre, ou la classe tant qu’aucune copie n’est commencée"], ["⧉", "dupliquer pour une autre classe : la grille, l’énoncé, les phrases déjà lues — sans les copies"], ["🗑️", "supprimer (archivée dans la corbeille MJPC, avec un export JSON téléchargé)"], ["« ＋ Nouvelle rédaction »", "coller le JSON du sujet préparé avec Claude, « Vérifier », choisir la classe, « Créer »"], ["🧪 Mode test", "essayer sans rien enregistrer au site"]] },
  preparation: { ou: "Pilotage — Préparation", l: [["« ✓ Préparer le sujet »", "lire et valider les phrases, un point de la grille par écran"], ["« 📝 Corriger l’énoncé »", "l’énoncé tel que distribué, en tête de chaque fiche"]] },
  correction: { ou: "Pilotage — Correction", l: [["clic sur un élève", "ouvrir sa copie"], ["« 📋 Classer le paquet »", "taper les initiales dans l’ordre des copies du bureau"], ["le tri", "ordre du paquet, alphabétique, par sujet, par progression"], ["⚠ sur une carte", "le compteur et le niveau d’orthographe ne s’accordent plus : « Garder » ou « Prendre »"], ["« ⌨️ Mode interrogatif »", "un point par écran : 1-2-3-4 le niveau puis le sous-niveau, C la citation, + / − le compteur, N puis E non évalué, Entrée suivant"]] },
  bilan: { ou: "Données — Bilan", l: [["le tableau", "le temps passé par copie, par critère, par point ; les copies anormalement longues"]] },
  fiches: { ou: "Données — Fiches élèves", l: [["👁 Aperçu", "la fiche dans un nouvel onglet"], ["🖨️ Exporter", "la fiche d’un élève en HTML"], ["« 🖨️ Exporter tous HTML »", "un zip des fiches prêtes ; une fiche qui porte une phrase pas lue ne part pas (la raison est dite)"]] },
  reglages: { ou: "Réglages — la grille", l: [["le tableau", "critères, points, poids, compétences, seuils du compteur"], ["« ✓ Préparer le sujet »", "corriger les phrases"]] },
  copie: { ou: "Une copie", l: [["1-2-3-4", "le niveau, puis le sous-niveau"], ["C", "taper une citation de la copie"], ["✏️ éditer", "réécrire la phrase pour cette copie (validée d’office)"], ["Entrée / ←", "point suivant / précédent"], ["Échap", "quitter le mode interrogatif"]] },
  preparer: { ou: "Préparer le sujet", l: [["une case", "corriger la phrase : en sortant de la case, elle est enregistrée et lue"], ["« ✓ Je valide ce point »", "toutes les phrases de l’écran sont lues"], ["à gauche", "les écrans : ✓ validé, ○ à relire"]] },
  porte: { ou: "La porte", l: [["la clé ou le code professeur", "ceux du site"]] }
};
const AIDE = { courant: "accueil" };
function aidePoser(cle) { AIDE.courant = cle; const p = document.getElementById("ruAide"); if (p && !p.hidden) aideRendre(); }
function aideRendre() { const a = RU_AIDES[AIDE.courant] || RU_AIDES.accueil; document.getElementById("ruAide").innerHTML = `<h3>${escapeHtml(a.ou)}</h3><dl>${a.l.concat([["? ou F1", "cette aide ; Échap la ferme"]]).map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join("")}</dl>`; }
function aideBasculer() { const p = document.getElementById("ruAide"); p.hidden = !p.hidden; if (!p.hidden) aideRendre(); }
document.addEventListener("keydown", e => {
  const a = document.activeElement; const champ = a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT");
  if ((e.key === "?" && !champ) || e.key === "F1") { e.preventDefault(); aideBasculer(); }
  else if (e.key === "Escape") { const p = document.getElementById("ruAide"); if (p && !p.hidden) { p.hidden = true; e.stopPropagation(); } }
}, true);
