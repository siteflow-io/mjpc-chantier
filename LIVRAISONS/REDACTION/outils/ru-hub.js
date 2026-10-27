// =====================================================================
// RU — LE SITE : le hub, le mode test, la classe, la reprise (R5, R6)
// =====================================================================
// Adresse : redaction.html?mode=prof[&id=<sujet>][&classe=<clé ou nom de la classe>][&test=1]
// Au hub (mjpc-hub) :
//   /redactions/<id>/config                      le sujet (R1)
//   /redactions/<id>/copies/<classe>/<élève>     une copie (clé MJPC de l'élève, sanMJPC)
//   /redactions/<id>/suivi/<classe>              le paquet, le tri, l'endroit exact (reprise)
//   /redactions/<id>/validations/<phrase>        les phrases lues par Paul (R4)
//   /redactions_communes/{phrases,validations}   les mots de liaison et phrases fixes (R4 bis)
// Toute écriture passe par ruEcrire (les trois issues du socle, §9) ; en mode test, rien ne part.
const RU = { id: null, classe: null, classeNom: "", test: false, classes: null, sig: {}, sigSuivi: null, timer: null, flux: null, miroir: null, aRedessiner: false, ecritsTest: [], dernier: null, panne: 0 };
const RU_BASE = (typeof MJPC_SECU2 === "object" && MJPC_SECU2 && MJPC_SECU2.hub) ? MJPC_SECU2.hub : "https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app";
function ruParam(k) { try { return new URLSearchParams(location.search).get(k); } catch (e) { return null; } }
function ruSeg(chemin) { return (Array.isArray(chemin) ? chemin : String(chemin).split("/")).filter(x => x !== "" && x != null).map(String); }
function ruUrl(chemin) { return RU_BASE + "/" + ruSeg(chemin).map(encodeURIComponent).join("/") + ".json"; }
function ruCopie(v) { return v == null ? null : JSON.parse(JSON.stringify(v)); }
function ruDans(v, seg) { let n = v; for (const k of seg) { if (n == null || typeof n !== "object") return null; n = n[k]; } return n === undefined ? null : n; }
function ruPoser(v, seg, x) { if (!seg.length) return ruCopie(x); const o = (v && typeof v === "object") ? Object.assign({}, v) : {}; const r = ruPoser(o[seg[0]], seg.slice(1), x); if (r === null) delete o[seg[0]]; else o[seg[0]] = r; return Object.keys(o).length ? o : null; }
// Le mode test (comme le magasin M8T du portail) : la lecture rend ce que rendrait le hub si les écritures faites ici y étaient passées, dans l'ordre ; rien n'est écrit au hub.
function ruModeTest() {
  if (ruParam("test") === "1") return true;
  for (const w of [window.opener, window.parent]) { try { if (w && w !== window && typeof w.m8TestOn === "function" && w.m8TestOn()) return true; } catch (e) {} }
  return false;
}
function ruLire(chemin) {
  const seg = ruSeg(chemin);
  return fetch(ruUrl(seg)).then(r => { if (!r.ok) throw new Error("lecture " + r.status); return r.json(); }).then(v => {
    if (!RU.test) return v;
    RU.ecritsTest.forEach(e => {
      const k = Math.min(e.seg.length, seg.length);
      if (e.seg.slice(0, k).join("/") !== seg.slice(0, k).join("/")) return;
      if (e.seg.length <= seg.length) v = ruCopie(ruDans(e.v, seg.slice(e.seg.length)));      // écrit au-dessus ou ici : il remplace
      else v = ruPoser(v, e.seg.slice(seg.length), e.v);                                       // écrit dessous : il se pose dans ce qu'on lit
    });
    return v;
  });
}
function ruEcrire(chemin, valeur, libelle) {
  const seg = ruSeg(chemin);
  if (RU.test) { RU.ecritsTest.push({ seg, v: ruCopie(valeur) }); ruTemoin("test", libelle); return Promise.resolve({ etat: MJPC_ISSUE.ACCEPTEE, test: true }); }
  return new Promise(res => mjpcEcrireRest(ruUrl(seg), { method: valeur === null ? "DELETE" : "PUT", headers: { "Content-Type": "application/json" }, body: valeur === null ? undefined : JSON.stringify(valeur) },
    issue => { ruTemoin(issue && issue.etat, libelle); res(issue || {}); }));
}
// Le témoin : « Enregistré au site à hh:mm », ou ce qui ne va pas, en clair
function ruTemoin(etat, libelle) {
  const t = document.getElementById("ruTemoin"); if (!t) return;
  const h = new Date(); const hm = String(h.getHours()).padStart(2, "0") + ":" + String(h.getMinutes()).padStart(2, "0");
  if (etat === "test") { t.className = "ru-temoin test"; t.textContent = "🧪 Mode test — gardé ici seulement (" + hm + ")"; t.title = "Mode test : rien n'est envoyé au site. Ce que tu fais se garde dans cette page tant qu'elle reste ouverte."; return; }
  if (etat === MJPC_ISSUE.ACCEPTEE) { RU.panne = 0; t.className = "ru-temoin ok"; t.textContent = "✓ Enregistré au site à " + hm; t.title = "Ta dernière correction est enregistrée au site : tu la retrouves en rouvrant ce sujet, sur n'importe quel ordinateur."; return; }
  RU.panne++;
  t.className = "ru-temoin ko"; t.textContent = etat === MJPC_ISSUE.REFUSEE ? "⚠ Le site a refusé l'enregistrement" : "⚠ Pas enregistré au site (réseau) — nouvel essai";
  t.title = "La correction reste dans cette page et dans la sauvegarde de secours (JSON). " + (etat === MJPC_ISSUE.REFUSEE ? "Le site refuse cette écriture : préviens la conscience." : "L'app réessaie toute seule au prochain geste.");
  if (etat !== MJPC_ISSUE.REFUSEE) planifierSync();
}
// ── la classe du site (R5) : la clé telle quelle, le nom exact, puis la forme simplifiée — la règle d'edtCleClasse (13 · 51) ──
function ruSlug(n) { return String(n || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""); }
function ruCleClasse(nom) {
  const t = RU.classes; if (nom == null || nom === "" || !t) return null;
  const n = String(nom), ks = Object.keys(t);
  if (Object.prototype.hasOwnProperty.call(t, n)) return n;
  for (const k of ks) if (t[k] && t[k].nom === n) return k;
  const s = ruSlug(n); if (!s) return null;
  if (Object.prototype.hasOwnProperty.call(t, s)) return s;
  for (const k of ks) if (ruSlug(k) === s || (t[k] && t[k].nom && ruSlug(t[k].nom) === s)) return k;
  return null;
}
function ruClassesProposees() { const t = RU.classes || {}; return Object.keys(t).filter(k => !estClasseInterne(k) && t[k] && !t[k].archivee && extractEleves(t[k], []).length).sort((a, b) => String((t[a] || {}).nom || a).localeCompare(String((t[b] || {}).nom || b), "fr")); }
function nomClasseCourante() { return RU.classeNom || ""; }
function ficheTexte(k) { return (SUJET && SUJET.fiche && SUJET.fiche[k]) || ""; }
// ── l'état d'une classe au hub : les copies (une par élève) et le suivi (le paquet, l'endroit exact) ──
const RU_SUIVI = ["tri", "paquetOrdre", "interroBookmark", "current", "modeOuvert"];
function ruCheminCopies() { return ["redactions", RU.id, "copies", RU.classe]; }
function ruCheminSuivi() { return ["redactions", RU.id, "suivi", RU.classe]; }
function ruCleSecours() { return "mjpc_redaction_" + RU.id + "_" + RU.classe; }
function nomEleveDe(cle) { return state.classe.find(n => eleveId(n) === cle) || ""; }
function saveState() {   // à chaque geste : la sauvegarde de secours dans ce navigateur, puis le site (débounce)
  if (!RU.id || !RU.classe) return;
  try { localStorage.setItem(ruCleSecours(), JSON.stringify(state)); } catch (e) {}
  planifierSync();
}
function loadState() {}   // l'état vient du site (ruOuvrirClasse)
function planifierSync() { clearTimeout(RU.timer); RU.timer = setTimeout(synchroniser, 900); }
function ruVierge(c) { return !c || (!c.sujet && !Object.keys(c.echelons || {}).length && !Object.keys(c.citationsPar || {}).length && !Object.keys(c.sousEditesPar || {}).length && !c.compteurOrthoGram && !c.meilleureCitation && !c.meilleureCitationCommentaire && !c.telemetry); }
function synchroniser() {
  if (!RU.id || !RU.classe) return;
  Object.keys(state.copies || {}).forEach(k => {
    if (!RU.sig[k] && ruVierge(state.copies[k])) return;   // une copie jamais touchée ne s'écrit pas (le tableau de bord en crée une par élève)
    const v = Object.assign({}, state.copies[k], { nom: nomEleveDe(k) || (state.copies[k] && state.copies[k].nom) || "" });
    const sg = JSON.stringify(v); if (RU.sig[k] === sg) return; RU.sig[k] = sg;
    ruEcrire(ruCheminCopies().concat(k), JSON.parse(sg), "la copie de " + (v.nom || k)).then(i => { if (i.etat !== MJPC_ISSUE.ACCEPTEE) delete RU.sig[k]; });
  });
  const su = {}; RU_SUIVI.forEach(k => { if (state[k] != null) su[k] = state[k]; });
  const ss = JSON.stringify(su); if (RU.sigSuivi !== ss) { RU.sigSuivi = ss; ruEcrire(ruCheminSuivi(), JSON.parse(ss), "le suivi de la classe").then(i => { if (i.etat !== MJPC_ISSUE.ACCEPTEE) RU.sigSuivi = null; }); }
}
// ── l'abonnement (R6) : un changement fait ailleurs se voit sans recharger ; un redessin ne touche jamais le champ en cours ──
function ruSaisieEnCours() { const a = document.activeElement; return !!a && (a.tagName === "TEXTAREA" || (a.tagName === "INPUT" && /^(text|search|)$/i.test(a.type || ""))); }
function ruRedessiner() {
  if (ruSaisieEnCours()) { RU.aRedessiner = true; return; }
  RU.aRedessiner = false;
  if (document.getElementById("interroOverlay").classList.contains("show")) { if (typeof renderInterro === "function") renderInterro(); return; }
  if (!document.getElementById("correctionView").classList.contains("hidden") && state.current) { renderClassique(); return; }
  if (!document.getElementById("dashboard").classList.contains("hidden")) renderDashboard();
}
document.addEventListener("focusout", () => setTimeout(() => { if (RU.aRedessiner && !ruSaisieEnCours()) ruRedessiner(); }, 0));
function ruAbonner() {
  if (RU.test || typeof EventSource !== "function") return;
  try { if (RU.flux) RU.flux.close(); } catch (e) {}
  RU.miroir = null;
  const es = new EventSource(ruUrl(ruCheminCopies())); RU.flux = es;
  const appliquer = (ev, patch) => {
    let m; try { m = JSON.parse(ev.data); } catch (e) { return; } if (!m || typeof m.path !== "string") return;
    const seg = ruSeg(m.path);
    if (patch) Object.keys(m.data || {}).forEach(k => { RU.miroir = ruPoser(RU.miroir, seg.concat(ruSeg(k)), m.data[k]); });
    else RU.miroir = ruPoser(RU.miroir, seg, m.data);
    let change = false;
    Object.keys(RU.miroir || {}).forEach(k => {
      const sg = JSON.stringify(RU.miroir[k]); if (RU.sig[k] === sg) return;   // l'écho de notre écriture, ou rien de neuf
      RU.sig[k] = sg; const v = ruCopie(RU.miroir[k]); delete v.nom; state.copies[k] = v; change = true;
    });
    if (change) { try { localStorage.setItem(ruCleSecours(), JSON.stringify(state)); } catch (e) {} ruRedessiner(); }
  };
  es.addEventListener("put", ev => appliquer(ev, false));
  es.addEventListener("patch", ev => appliquer(ev, true));
}
// ── les écrans d'entrée : la porte, la liste des sujets, le choix de la classe ──
function ruEcran(id) {
  ["ruPorte", "ruSujets", "ruApp"].forEach(x => { const e = document.getElementById(x); if (e) e.classList.toggle("hidden", x !== id); });
}
function ruProfOuvert() { const s = lireSessionMJPC(); return !!(s && s.is_prof); }
function ruPorte() {
  ruEcran("ruPorte");
  const b = document.getElementById("ruPorteOk"), ch = document.getElementById("ruPorteCode"), m = document.getElementById("ruPorteMsg");
  b.onclick = () => { m.textContent = "Vérification…"; mjpcVerifierProf(ch.value).then(r => { if (r && r.ok) { mjpcOuvrirSessionProfParDefaut(); return; } m.textContent = mjpcMessageRefusEleve(r && r.voie) || "Ce code n'ouvre pas l'espace professeur."; }); };
  ch.onkeydown = e => { if (e.key === "Enter") b.click(); };
}
function ruAdresse(o) { const p = new URLSearchParams(); p.set("mode", "prof"); Object.keys(o).forEach(k => { if (o[k] != null && o[k] !== "") p.set(k, o[k]); }); if (RU.test) p.set("test", "1"); return location.pathname + "?" + p.toString(); }
function ruListeSujets() {
  ruEcran("ruSujets");
  const l = document.getElementById("ruListe"); l.innerHTML = "<p class=\"ru-vide\">Lecture des sujets…</p>";
  ruLire(["redactions"]).then(t => {
    const ids = Object.keys(t || {}).filter(k => t[k] && t[k].config);
    if (!ids.length) { l.innerHTML = "<p class=\"ru-vide\">Aucun sujet pour l'instant. « ➕ Nouveau sujet » en crée un à partir du JSON préparé avec Claude.</p>"; return; }
    l.innerHTML = ids.sort((a, b) => String(t[a].config.titre || a).localeCompare(String(t[b].config.titre || b), "fr")).map(id => {
      const c = t[id].config, nv = (c.variantes || []).length, nCl = Object.keys((t[id].copies) || {}).length;
      const st = typeof etatValidationSujet === "function" ? etatValidationSujet(c, (t[id].validations) || {}) : null;
      return `<div class="ru-sujet" data-id="${escapeAttr(id)}">
        <div class="ru-sujet-t"><strong>${escapeHtml(c.titre || id)}</strong><span>${escapeHtml(c.niveau || "")} · sur ${c.total || "?"} · ${nv} sujet${nv > 1 ? "s" : ""} au choix${nCl ? " · " + nCl + " classe" + (nCl > 1 ? "s" : "") + " en cours" : ""}${st ? " · " + st.valides + " points validés sur " + st.total : ""}</span></div>
        <div class="ru-sujet-a">
          <button class="primary" onclick="location.href=ruAdresse({id:'${escapeAttr(id)}'})" title="Ouvrir ce sujet pour corriger les copies d'une classe du site">Ouvrir</button>
          <button onclick="location.href=ruAdresse({id:'${escapeAttr(id)}',vue:'preparer'})" title="Relire et valider les phrases de la grille, point par point, avant qu'un élève les lise">Préparer le sujet</button>
        </div></div>`;
    }).join("");
  }, () => { l.innerHTML = "<p class=\"ru-vide\">⚠ Le site ne répond pas : les sujets n'ont pas pu être lus. Vérifie la connexion et recharge la page.</p>"; });
}
function ruChoisirClasse(obligatoire) {
  const sel = document.getElementById("ruClasseSel"); const ks = ruClassesProposees();
  sel.innerHTML = ks.map(k => `<option value="${escapeAttr(k)}"${k === RU.classe ? " selected" : ""}>${escapeHtml((RU.classes[k] && RU.classes[k].nom) || k)} — ${extractEleves(RU.classes[k], []).length} élèves</option>`).join("");
  document.getElementById("ruClasseAnnuler").style.display = obligatoire ? "none" : "";
  document.getElementById("modalClasse").classList.add("show");
}
function sauverClasse() {
  const k = document.getElementById("ruClasseSel").value; if (!k) return;
  fermerModale("modalClasse");
  if (k === RU.classe) return;
  history.replaceState(null, "", ruAdresse({ id: RU.id, classe: k }));
  ruOuvrirClasse(k);
}
function ouvrirGestionClasse() { ruChoisirClasse(false); }
function sauverSujet() {
  state.sujet = document.getElementById("sujetEdit").value;
  if (SUJET) { SUJET.enonce = state.sujet; ruEcrire(["redactions", RU.id, "config", "enonce"], state.sujet, "l'énoncé du sujet"); }
  saveState();
  fermerModale("modalSujet");
  toast("Sujet enregistré");
}
function ruEntete() {
  document.getElementById("ruTitre").textContent = SUJET.titre || "Rédaction";
  document.getElementById("ruSousTitre").textContent = [SUJET.niveau, RU.classeNom || "aucune classe choisie", "sur " + SUJET.total].filter(Boolean).join(" · ");
  document.getElementById("ruDashTitre").textContent = "Élèves — " + (RU.classeNom || "");
  document.title = (SUJET.titre || "Rédaction") + (RU.classeNom ? " — " + RU.classeNom : "");
}
function ruOuvrirClasse(k) {
  try { if (RU.flux) RU.flux.close(); } catch (e) {}
  RU.classe = k; RU.classeNom = (RU.classes[k] && RU.classes[k].nom) || k; RU.sig = {}; RU.sigSuivi = null;
  try { localStorage.setItem("mjpc_redaction_classe_" + RU.id, k); } catch (e) {}
  state = { classe: extractEleves(RU.classes[k], []), sujet: SUJET.enonce || "", copies: {}, current: null, tri: "ordre", paquetOrdre: [], interroBookmark: {}, modeOuvert: null };
  ruEntete(); ruEcran("ruApp");
  return Promise.all([ruLire(ruCheminCopies()), ruLire(ruCheminSuivi())]).then(([cp, su]) => {
    Object.keys(cp || {}).forEach(e => { RU.sig[e] = JSON.stringify(cp[e]); const v = ruCopie(cp[e]); delete v.nom; state.copies[e] = v; });
    if (su) { RU_SUIVI.forEach(f => { if (su[f] != null) state[f] = su[f]; }); RU.sigSuivi = JSON.stringify(su); }
    if (!Array.isArray(state.paquetOrdre)) state.paquetOrdre = Object.values(state.paquetOrdre || {});
    ruAbonner(); ruReprendre();
  }, () => { toast("⚠ Le site ne répond pas : les copies de cette classe n'ont pas pu être lues."); showDashboard(); });
}
function ruReprendre() {   // la reprise exacte (l'INIT de l'app d'origine, inchangé)
  if (state.modeOuvert === "interrogatif" && state.current && state.interroBookmark && state.interroBookmark[state.current]) {
    const nomEleve = state.classe.find(n => eleveId(n) === state.current);
    if (nomEleve) { ouvrirCopie(state.current); setTimeout(() => ouvrirInterrogatif(), 50); } else showDashboard();
  } else if (state.modeOuvert === "classique" && state.current) {
    const nomEleve = state.classe.find(n => eleveId(n) === state.current);
    if (nomEleve) ouvrirCopie(state.current); else showDashboard();
  } else showDashboard();
}
function ruDemarrer() {
  RU.test = ruModeTest();
  if (RU.test) { document.body.classList.add("ru-test"); ruTemoin("test"); }
  if (!ruProfOuvert()) { ruPorte(); return; }
  const id = ruParam("id");
  if (!id) { ruListeSujets(); return; }
  RU.id = id;
  Promise.all([ruLire(["redactions", id, "config"]), ruLire(["classes"])]).then(([cfg, cl]) => {
    if (!cfg) { ruListeSujets(); toast("Ce sujet n'existe pas (ou plus) au site."); return; }
    appliquerSujet(cfg); RU.classes = cl || {};
    if (ruParam("vue") === "preparer" && typeof ruPreparer === "function") { ruPreparer(); return; }
    let k = ruCleClasse(ruParam("classe"));
    if (!k) { try { k = ruCleClasse(localStorage.getItem("mjpc_redaction_classe_" + id)); } catch (e) {} }
    if (!k || !ruClassesProposees().includes(k)) { ruEcran("ruApp"); state.classe = []; ruEntete(); renderDashboard(); ruChoisirClasse(true); return; }
    ruOuvrirClasse(k);
  }, () => { ruListeSujets(); });
}
