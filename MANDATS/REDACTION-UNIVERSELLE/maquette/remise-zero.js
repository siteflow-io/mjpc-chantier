// 59b — une copie, export + corbeille avant suppression ; les autres onglets ne la ressuscitent pas.
// Les photos, l'attribution des pages et l'ordre du paquet restent en place.
const RZ = { session: 0, copies: {}, demande: null };
function rzCharger(copies) {
  RZ.session++; RZ.copies = {}; RZ.demande = null;
  Object.keys(copies || {}).forEach(k => { RZ.copies[k] = { present: true, id: copies[k].id || null }; });
  document.getElementById("rzAlerte")?.remove();
}
function rzEtat(k) { return RZ.copies[k] || (RZ.copies[k] = { present: false, id: null }); }
function rzRecevoir(k, v) { const s = rzEtat(k); if (s.perime) return false; s.present = true; s.id = v.id || null; return true; }
function rzBouton(k, c) {
  if (rzEtat(k).perime) return `<button class="sc-btn rz-relire" onclick="event.stopPropagation();rzRelire('${escapeAttr(k)}')" title="Cette copie a changé ailleurs : lire la version actuelle avant de la corriger.">Relire la copie</button>`;
  return ruVierge(c) ? "" : `<button class="sc-btn rz-zero" style="margin-top:10px;width:100%;font-size:12px" onclick="event.stopPropagation();rzDemander('${escapeAttr(k)}')" title="Exporter cette copie en JSON, l'archiver dans la corbeille MJPC, puis la remettre à zéro ; les photos et les autres copies restent en place.">Remettre cette copie à zéro</button>`;
}
function rzPermet(k) {
  const s = rzEtat(k);
  if (s.perime) { rzAvertir(); toast("Cette copie a changé ailleurs : relis-la avant de continuer."); return false; }
  if (s.occupe) { toast("L'archivage de cette copie est en cours."); return false; }
  return true;
}
function rzSuivi(k) {
  return { interroBookmark: ruCopie((state.interroBookmark || {})[k]),
    current: state.current === k ? k : null, modeOuvert: state.current === k || state.scanCurseur?.copie === k ? state.modeOuvert : null,
    scanCurseur: state.scanCurseur?.copie === k ? ruCopie(state.scanCurseur) : null,
    scanRecopie: state.scanRecopie?.copie === k ? ruCopie(state.scanRecopie) : null };
}
function rzPurger(k) {
  const active = SC.ouvert && scK() === k;
  if (RC.copie === k) {
    RC.ouvert = false; RC.drag = null; RC.documents = {}; RC.annule = [];
    if (RC.ui) RC.ui.hidden = true; document.body.classList.remove("rc-ouvert");
  }
  if (active) {
    scChampFermer(false); SC.ouvert = false; SC.actif = 0; SC.sel = null; SC.outil = null; SC.trace = null;
    document.getElementById("scanEcran").classList.add("hidden"); document.body.classList.remove("sc-ouvert");
    if (SC.recap) { document.getElementById("scRecap").hidden = true; SC.recap = null; }
    document.getElementById("scModale").classList.remove("show");
    state.modeOuvert = null;
  }
  SC.annule = SC.annule.filter(a => a.k !== k);
  if (state.current === k) {
    telemetryArreter(); document.removeEventListener("keydown", interroKeydown); interroState = null;
    document.getElementById("interroOverlay").classList.remove("show");
    document.getElementById("correctionView").classList.add("hidden");
    document.getElementById("bandeauEleve").classList.add("hidden");
    state.current = null; state.modeOuvert = null;
  }
  if (active || !state.modeOuvert) document.getElementById("dashboard").classList.remove("hidden");
  delete state.copies[k]; delete RU.sig[k]; if (RU.sigCorps) delete RU.sigCorps[k];
  if (state.interroBookmark) delete state.interroBookmark[k];
  if (state.scanCurseur?.copie === k) delete state.scanCurseur;
  if (state.scanRecopie?.copie === k) delete state.scanRecopie;
}
function rzBloquer(k) {
  const s = rzEtat(k); if (s.perime) return;
  if (state.current === k) telemetryArreter();
  s.perime = true; s.locale = ruCopie(state.copies[k]); s.suivi = rzSuivi(k);
  // La copie locale reste récupérable, y compris après fermeture de cet onglet.
  try { localStorage.setItem(ruCleSecours() + "_copie_ecartee_" + k + "_" + Date.now(), JSON.stringify({ data: s.locale, suiviLocal: s.suivi })); } catch (e) {}
  rzPurger(k); saveState(); renderDashboard(); rzAvertir();
}
function rzComparer(copies) {
  Object.keys(RZ.copies).forEach(k => {
    const s = rzEtat(k), v = copies && copies[k];
    if (!s.occupe && s.present && (!v || (v.id || null) !== s.id && v.id !== s.idEnCours)) rzBloquer(k);
  });
}
function rzAvertir() {
  let e = document.getElementById("rzAlerte");
  if (!e) { e = document.createElement("div"); e.id = "rzAlerte"; e.setAttribute("role", "status"); e.style.cssText = "padding:12px;margin:8px 0;background:#fff0d7;border:1px solid #ba751f;border-radius:6px"; document.getElementById("gridEleves").before(e); }
  e.replaceChildren();
  Object.keys(RZ.copies).filter(k => rzEtat(k).perime).forEach(k => {
    const p = document.createElement("p"); p.style.margin = "4px 0";
    p.append(document.createTextNode((nomEleveDe(k) || "Cette copie") + " : effacée ou remplacée ailleurs. La version de cet onglet est écartée."));
    for (const [texte, action, titre] of [
      ["Télécharger la version locale", () => rzExporter({ data: rzEtat(k).locale, suiviLocal: rzEtat(k).suivi }, "copie_locale_" + k), "Garder un fichier JSON de la version écartée, sans la réécrire au site."],
      ["Relire la copie", () => rzRelire(k), "Lire la version actuelle du site et repartir de celle-ci."]]) {
      const b = document.createElement("button"); b.className = "sc-btn"; b.textContent = texte; b.title = titre; b.style.marginLeft = "8px"; b.onclick = action; p.append(b);
    }
    e.append(p);
  });
  if (!e.childElementCount) e.remove();
}
function rzExporter(obj, nom) {
  const b = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = nom + ".json";
  try { a.click(); } finally { setTimeout(() => URL.revokeObjectURL(u), 1000); }
}
async function rzLire(chemin) {
  if (RU.test) return { valeur: await ruLire(chemin), etag: "test" };
  const r = await fetch(ruUrl(chemin), { headers: { "X-Firebase-ETag": "true" }, cache: "no-store" });
  if (!r.ok) throw new Error("La copie ne peut pas être lue (" + r.status + ").");
  const etag = r.headers.get("ETag"); if (!etag) throw new Error("Le site n'a pas fourni la protection de cette copie.");
  return { valeur: await r.json(), etag };
}
const rzEcrireOrigine = ruEcrire;
ruEcrire = function(chemin, valeur, libelle, options) {
  const seg = ruSeg(chemin), base = ruCheminCopies();
  if (valeur !== null && seg.length === base.length + 1 && base.every((v, i) => seg[i] === v) && !options?.copieVerifiee) {
    const k = seg[seg.length - 1], s = rzEtat(k), session = RZ.session, corps = ruCopie(valeur);
    const faire = async () => {
      if (session !== RZ.session || s.perime || s.occupe) return { etat: MJPC_ISSUE.REFUSEE, copieEcartee: true };
      try {
        const r = await rzLire(seg);
        if (session !== RZ.session || s.perime || s.occupe) return { etat: MJPC_ISSUE.REFUSEE, copieEcartee: true };
        const v = r.valeur;
        if (s.present ? !v || (v.id || null) !== s.id : v && v.id !== corps.id) { rzBloquer(k); return { etat: MJPC_ISSUE.REFUSEE, copieEcartee: true }; }
        s.idEnCours = corps.id;
        const issue = await rzEcrireOrigine(seg, corps, libelle, { etag: r.etag, copieVerifiee: true });
        if (session === RZ.session) {
          if (issue.etat === MJPC_ISSUE.ACCEPTEE) { s.present = true; s.id = corps.id || null; }
          else if (issue.status === 412) rzBloquer(k);
        }
        return issue;
      } catch (e) { ruTemoin(MJPC_ISSUE.PANNE, libelle); return { etat: MJPC_ISSUE.PANNE }; }
      finally { delete s.idEnCours; }
    };
    const p = (s.attente || Promise.resolve()).then(faire); s.attente = p;
    p.finally(() => { if (s.attente === p) delete s.attente; }); return p;
  }
  return rzEcrireOrigine(chemin, valeur, libelle, options);
};
async function rzRelire(k) {
  const session = RZ.session;
  try {
    const r = await rzLire(ruCheminCopies().concat(k)); if (session !== RZ.session) return;
    rzPurger(k); RZ.copies[k] = { present: !!r.valeur, id: r.valeur?.id || null };
    if (r.valeur) {
      const v = scCles(ruCopie(r.valeur), false); delete v.nom; state.copies[k] = v; RU.sig[k] = JSON.stringify(r.valeur);
      const corps = Object.assign({}, v); RU_IDENTITE.forEach(f => delete corps[f]); if (!scPlein(corps.scan)) delete corps.scan;
      (RU.sigCorps || (RU.sigCorps = {}))[k] = JSON.stringify(scFb(corps));
    }
    saveState(); renderDashboard(); rzAvertir(); toast(r.valeur ? "La copie actuelle est relue." : "La copie est vide : tu peux recommencer.");
  } catch (e) { toast(e.message); }
}
function rzFermer() { if (RZ.demande?.enCours) return; document.getElementById("rzDialogue")?.remove(); RZ.demande = null; }
function rzDemander(k) {
  if (!rzPermet(k) || ruVierge(state.copies[k])) return;
  rzFermer(); RZ.demande = { k, session: RZ.session };
  const e = document.createElement("div"); e.id = "rzDialogue"; e.className = "sc-modale show";
  e.innerHTML = `<div class="sc-modale-c" role="dialog" aria-modal="true" aria-labelledby="rzTitre"><h2 id="rzTitre">Remettre cette copie à zéro</h2><p><strong>${escapeHtml(nomEleveDe(k))}</strong></p><p>La copie complète sera téléchargée en JSON et gardée dans la corbeille MJPC avant sa remise à zéro. Les photos, leurs élèves et l'ordre du paquet restent en place. Les autres copies sont conservées.</p><p id="rzMessage" role="status"></p><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end"><button class="sc-btn" id="rzAnnuler" title="Revenir sans rien effacer (Échap fait pareil).">Annuler</button><button class="sc-btn" id="rzConfirmer" title="Exporter et archiver cette seule copie, puis la remettre à zéro. Si l'archivage échoue, rien n'est effacé.">Exporter, archiver et remettre à zéro</button></div></div>`;
  document.body.append(e); e.querySelector("#rzAnnuler").onclick = rzFermer; e.querySelector("#rzConfirmer").onclick = rzExecuter;
  e.querySelector("#rzAnnuler").focus();
}
async function rzExecuter() {
  const d = RZ.demande; if (!d || d.enCours) return;
  const k = d.k, s = rzEtat(k), chemin = ruCheminCopies().concat(k), locale = ruCopie(state.copies[k]), suiviLocal = rzSuivi(k);
  d.enCours = true; s.occupe = true;
  const msg = document.getElementById("rzMessage");
  document.querySelectorAll("#rzDialogue button").forEach(b => b.disabled = true); msg.textContent = "Lecture et archivage de la copie…";
  try {
    if (s.attente) await s.attente;
    const r = await rzLire(chemin); if (d.session !== RZ.session) throw new Error("La classe a changé : rien n'est effacé.");
    if (!r.valeur || s.present && (r.valeur.id || null) !== s.id) throw new Error("Cette copie a changé ailleurs. Rien n'est effacé ; relis-la avant de recommencer.");
    // JSON conserve aussi les vides et les clés internes avec un point, refusées comme noms de champs Firebase.
    const meta = { motif: "remise-zero-copie", source: chemin.join("/"), le: Date.now(), idArchive: idCopie(), redaction: RU.id, titre: SUJET.titre, versionLocaleJSON: JSON.stringify(locale), suiviLocalJSON: JSON.stringify(suiviLocal) };
    rzExporter({ _meta: meta, data: r.valeur }, "copie_" + (r.valeur.id || k) + "_avant_remise_zero");
    const archive = await ruCorbeille(meta.motif, meta.source, r.valeur, meta);
    if (archive.etat !== MJPC_ISSUE.ACCEPTEE) throw new Error("L'archivage a échoué : la copie est conservée. Tu peux réessayer.");
    const issue = await rzEcrireOrigine(chemin, null, "la remise à zéro de la copie", { etag: r.etag, copieVerifiee: true });
    if (issue.etat !== MJPC_ISSUE.ACCEPTEE) throw new Error(issue.status === 412 ? "La copie a changé pendant l'archivage : elle est conservée. Relis-la avant de recommencer." : "La suppression a échoué : la copie est conservée, ainsi que son archive.");
    rzPurger(k); RZ.copies[k] = { present: false, id: null }; saveState(); renderDashboard();
    d.enCours = false; rzFermer(); toast("Cette copie est remise à zéro ; son archive est dans la corbeille MJPC.");
  } catch (e) { msg.textContent = e.message; d.enCours = false; document.querySelectorAll("#rzDialogue button").forEach(b => b.disabled = false); }
  finally { s.occupe = false; }
}
// L'événement du site traite les suppressions aussi. Le faux hub partage ses lectures entre onglets.
if (window.__FAUX_HUB) addEventListener("storage", ev => {
  if (!ev.key?.startsWith("mjpc_maquette_T399_hub_") || !RU.id || !RU.classe || RU.test) return;
  const session = RZ.session; ruLire(ruCheminCopies()).then(v => { if (session === RZ.session) rzComparer(v); }).catch(() => {});
});
document.addEventListener("keydown", ev => {
  if (!document.getElementById("rzDialogue")) return;
  if (ev.key === "Escape") { ev.preventDefault(); ev.stopImmediatePropagation(); rzFermer(); }
  else if (ev.key === "Enter") { ev.preventDefault(); ev.stopImmediatePropagation(); if (document.activeElement?.id === "rzConfirmer") rzExecuter(); else rzFermer(); }
}, true);
