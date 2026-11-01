/* ═══ [C14 1.4.16] LES STICKERS, OBJETS DU SUJET (Paul 01/11 07:59 : « La grille de stickers doit être évidemment modifiable et attachée à un sujet. À placer dans
   les paramètres. Un sticker est un objet, et il se rattache à un descripteur dans la grille d'évaluation ou un sous-descripteur, et à une compétence et à la
   taxo » ; 13:12 : « le chantier principal à faire en premier c'est les stickers afin que je puisse enfin exporter un fichier que l'IA peut analyser en entier
   avec toutes ses marques à poser » ; cadrage au sas : MANDATS/REDACTION-UNIVERSELLE/CADRAGE-STICKERS-OBJET.md).
   Un sticker = un seul fait réussi, que l'élève retrouve sur sa copie. Il vit dans le sujet, au site : redactions/<sujet>/config/stickers/<id>.
   Sa ligne (le descripteur) est un point de la grille du sujet (config/grille2) ; les réglages d'une ligne (sa compétence, ses sous-descripteurs, son compte)
   vivent dans config/stickersLignes/<point>. Rien n'est jamais effacé : un sticker « rangé » ne se propose plus, et reste là où il est posé. */
const ST = { ligne: null, s: null, taxo: null, cherche: "", valid: null, autres: null };
function stSujetLignes() {
  const g = typeof SUJET === "object" && SUJET && SUJET.grille2, L = [];
  ((g && g.criteres) || []).forEach(c => (c.points || []).forEach(p => L.push({ crit: c.id, critNom: c.nom, id: p.id, titre: p.titre || p.id, poids: p.poids, bareme: p.bareme || [0, 0, 0, p.poids], calcul: p.calcul || null })));
  return L;
}
function stLigne(id) { return stSujetLignes().find(l => l.id === id) || null; }
function stConf(id) { return ((typeof SUJET === "object" && SUJET && SUJET.stickersLignes) || {})[id] || {}; }
function stTous() { return Object.values((typeof SUJET === "object" && SUJET && SUJET.stickers) || {}).filter(s => s && s.id); }
function stActifs() { return stTous().filter(s => s.etat !== "range"); }
function stDeLigne(id) { return stActifs().filter(s => s.ligne === id).sort((a, b) => (a.ordre || 0) - (b.ordre || 0) || String(a.num || "").localeCompare(String(b.num || ""), "fr", { numeric: true })); }
function stParNum(num) { return stActifs().find(s => s.num === num) || null; }
function stCouleur(s) { const l = s && stLigne(s.ligne); return (l && typeof SC_CRIT === "object" && SC_CRIT[l.crit]) || "#6b7280"; }
function stComptent(id) { return stDeLigne(id).filter(s => !s.neCompte); }
/* le compte d'une ligne (proposé, acquis pour « Le thème tenu ») : tous posés, le plus haut niveau ; un manque, le niveau d'en dessous ; deux manques (trois, pour
   une ligne de six stickers et plus), encore en dessous ; au-delà, le plus bas. Réglable ligne par ligne : [manques au plus pour 3, pour 2, pour 1] */
function stSeuils(id) { const c = stConf(id).compte, n = stComptent(id).length; return Array.isArray(c) && c.length === 3 ? c.map(Number) : [0, 1, n >= 6 ? 3 : 2]; }
function stNiveau(id, poses) { const n = stComptent(id).length, m = n - poses, [a, b, c] = stSeuils(id); return m <= a ? 3 : m <= b ? 2 : m <= c ? 1 : 0; }
function stPoints(id, niveau) { const l = stLigne(id); return l ? Number(l.bareme[niveau]) || 0 : 0; }
function stNb(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
function stCompteTexte(id) {
  const n = stComptent(id).length; if (!n) return "pas de sticker";
  const [a, b, c] = stSeuils(id), pl = x => x + " manque" + (x > 1 ? "s" : ""), tr = (lo, hi) => lo === hi ? (lo ? pl(lo) : "tous") : (lo ? lo : "0") + " à " + pl(hi);
  return n + " sticker" + (n > 1 ? "s" : "") + " : " + tr(0, a) + " → " + stNb(stPoints(id, 3)) + " pt · " + tr(a + 1, b) + " → " + stNb(stPoints(id, 2)) + " · " + tr(b + 1, c) + " → " + stNb(stPoints(id, 1)) + " · plus → " + stNb(stPoints(id, 0));
}
/* un sujet est prêt pour l'IA quand chaque sticker actif est validé, rattaché à sa ligne, à une compétence et à la taxonomie */
function stPret() {
  const A = stActifs(), m = { aValider: A.filter(s => s.etat !== "valide").length, sansLigne: A.filter(s => !stLigne(s.ligne)).length, sansCompetence: A.filter(s => !s.competence).length, sansTaxo: A.filter(s => !(s.taxo || []).length).length };
  return { ok: A.length > 0 && !m.aValider && !m.sansLigne && !m.sansCompetence && !m.sansTaxo, n: A.length, valides: A.filter(s => s.etat === "valide").length, m };
}
function stPretTexte() {
  const P = stPret(); if (!P.n) return "Aucun sticker pour ce sujet.";
  const R = []; if (P.m.aValider) R.push(P.m.aValider + " à valider"); if (P.m.sansLigne) R.push(P.m.sansLigne + " sans ligne de la grille"); if (P.m.sansCompetence) R.push(P.m.sansCompetence + " sans compétence"); if (P.m.sansTaxo) R.push(P.m.sansTaxo + " sans notion de la taxonomie");
  return P.n + " sticker" + (P.n > 1 ? "s" : "") + " · " + P.valides + " validé" + (P.valides > 1 ? "s" : "") + " · " + (P.ok ? "prêts : ils partent chez l’IA avec la correction" : "pas encore prêts pour l’IA (" + R.join(", ") + ")");
}
// ── l'écriture au site : un sticker, une ligne ; le sujet en mémoire change aussitôt, partout ──
function stId() { return "stk_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function stEcrire(s, libelle) {
  s.modifieLe = new Date().toISOString(); s.version = (s.version || 0) + 1; SUJET.stickers = Object.assign({}, SUJET.stickers, { [s.id]: s });
  return ruEcrire(["redactions", RU.id, "config", "stickers", s.id], JSON.parse(JSON.stringify(s)), libelle || "un sticker");
}
function stEcrireLigne(id, o) { o.modifieLe = new Date().toISOString(); SUJET.stickersLignes = Object.assign({}, SUJET.stickersLignes, { [id]: o }); return ruEcrire(["redactions", RU.id, "config", "stickersLignes", id], JSON.parse(JSON.stringify(o)), "une ligne de la grille"); }
// ── 📥 une grille de stickers depuis un fichier (le format que rendra le prompt de création d'un sujet, et la proposition de la conscience) ──
function stCharger(ev) {
  const f = ev.target.files && ev.target.files[0]; ev.target.value = ""; if (!f) return;
  f.text().then(t => { let o; try { o = JSON.parse(t); } catch (e) { scModale("<h3>Ce fichier ne se lit pas</h3><p>Il faut le fichier JSON d’une grille de stickers.</p>"); return; } stImporter(o); });
}
function stImporter(o) {
  if (!o || !/^mjpc-redaction-stickers\//.test(o.format || "") || !Array.isArray(o.stickers)) { scModale("<h3>Ce fichier n’est pas une grille de stickers</h3><p>Il faut un fichier au format « mjpc-redaction-stickers/1 ».</p>"); return 0; }
  const deja = new Set(stTous().map(s => s.num).filter(Boolean)), le = new Date().toISOString(); let n = 0, sans = 0, doubles = 0;
  Object.keys(o.lignes || {}).forEach(id => { if (!stLigne(id)) return; const c = Object.assign({}, stConf(id)), src = o.lignes[id] || {}; let neuf = false;
    if (src.competence && !c.competence) { c.competence = src.competence; neuf = true; } if (src.sous && !c.sous) { c.sous = src.sous; neuf = true; } if (Array.isArray(src.compte) && !c.compte) { c.compte = src.compte; neuf = true; } if (src.eleve && !c.eleve) { c.eleve = String(src.eleve); neuf = true; }
    if (neuf) stEcrireLigne(id, c); });
  o.stickers.forEach((x, i) => {
    if (!x || !x.texteEleve) return; if (!stLigne(x.ligne)) { sans++; return; } if (x.num && deja.has(x.num)) { doubles++; return; }
    const s = { id: stId() + i.toString(36), num: x.num || null, ligne: x.ligne, sous: x.sous || null, texteEleve: String(x.texteEleve), texteManque: String(x.texteManque || ""), cherche: String(x.cherche || ""), portee: x.portee === "lettre" ? "lettre" : "passage", taille: ["phrase", "paragraphe"].includes(x.taille) ? x.taille : "mots",
      competence: x.competence || ((o.lignes || {})[x.ligne] || {}).competence || null, taxo: Array.isArray(x.taxo) ? x.taxo.slice(0, 2) : [], taxoPropose: x.taxoPropose || null, neCompte: !!x.neCompte,
      ordre: x.ordre || 99, etat: "a-valider", creeLe: le, version: 0, source: "fichier" };
    stEcrire(s, "un sticker chargé"); n++; if (s.num) deja.add(s.num); });
  stRendre(); toast(n + " sticker" + (n > 1 ? "s" : "") + " chargé" + (n > 1 ? "s" : "") + ", à valider" + (doubles ? " · " + doubles + " déjà là, laissé" + (doubles > 1 ? "s" : "") + " tel" + (doubles > 1 ? "s" : "") + " quel" + (doubles > 1 ? "s" : "") : "") + (sans ? " · " + sans + " sans ligne de cette grille" : "") + ".");
  return n;
}
// ── ⧉ les stickers d'un autre sujet (une autre classe, le même sujet) : copiés avec leurs rattachements et leur validation ──
function stReprendreChoisir() {
  fetch(ruUrl(["redactions"]) + "?shallow=true").then(r => r.json()).then(t => Promise.all(Object.keys(t || {}).filter(id => id !== RU.id).map(id => ruLire(["redactions", id, "config", "titre"]).then(ti => ruLire(["redactions", id, "config", "stickers"]).then(S => ({ id, titre: ti || id, n: Object.values(S || {}).filter(s => s && s.etat !== "range").length, v: Object.values(S || {}).filter(s => s && s.etat === "valide").length }))))))
    .then(L => { L = L.filter(x => x.n); ST.autres = L;
      scModale(`<h3>Reprendre les stickers d’un autre sujet</h3>${L.length ? `<p>Ils sont copiés ici avec leurs rattachements et leur validation ; ceux qui ont déjà le même numéro ici restent tels quels.</p>` + L.map(x => `<p><button class="sc-btn" onclick="scModaleFermer();stReprendre('${escapeAttr(x.id)}')" title="Copier ses ${x.n} stickers dans ce sujet.">⧉ ${escapeHtml(x.titre)}</button> <span class="sc-m">${x.n} stickers, ${x.v} validés</span></p>`).join("") : "<p>Aucun autre sujet n’a de stickers.</p>"}`); })
    .catch(() => toast("⚠ Le site ne répond pas : la liste des sujets n’a pas pu être lue."));
}
function stReprendre(id) {
  Promise.all([ruLire(["redactions", id, "config", "stickers"]), ruLire(["redactions", id, "config", "stickersLignes"])]).then(([S, Lg]) => {
    const deja = new Set(stTous().map(s => s.num).filter(Boolean)); let n = 0, doubles = 0;
    Object.keys(Lg || {}).forEach(l => { if (stLigne(l) && !SUJET.stickersLignes?.[l]) stEcrireLigne(l, Object.assign({}, Lg[l])); });
    Object.values(S || {}).filter(s => s && s.etat !== "range" && stLigne(s.ligne)).forEach(s => { if (s.num && deja.has(s.num)) { doubles++; return; } const c = Object.assign({}, s, { repris: { de: id, le: new Date().toISOString() } }); stEcrire(c, "un sticker repris"); n++; });
    stRendre(); toast(n + " sticker" + (n > 1 ? "s" : "") + " repris" + (doubles ? " · " + doubles + " déjà là" : "") + ".");
  });
}
// ── la taxonomie du hub : compétences du cycle 4, familles et notions d'Eduscol ──
function stTaxo() {
  if (ST.taxo) return Promise.resolve(ST.taxo);
  return ruLire(["taxonomie"]).then(t => { const T = { comp: [], fam: [], not: [], lib: {} }, arr = v => Array.isArray(v) ? v : Object.values(v || {});
    arr((t || {}).domaines).forEach(d => arr(d.familles).forEach(f => { T.fam.push({ id: f.id, prof: f.libelleProf, eleve: f.libelleEleve, dom: d.libelleProf }); T.lib[f.id] = f.libelleProf;
      arr(f.notions).forEach(n => { if (n && n.actif !== false) { T.not.push({ id: n.id, prof: n.libelleProf, eleve: n.libelleEleve, ex: n.exemple || "", fam: f.id }); T.lib[n.id] = n.libelleProf; } }); }));
    arr(((t || {}).competences || {}).francaisC4).forEach(g => arr(g.items).forEach(i => { if (i && i.actif !== false) { T.comp.push({ id: i.id, prof: i.libelle, eleve: i.libelleEleve }); T.lib[i.id] = i.libelleEleve || i.libelle; } }));
    ST.taxo = T; return T; }, () => { ST.taxo = { comp: [], fam: [], not: [], lib: {} }; return ST.taxo; });
}
function stLib(id) { return (ST.taxo && ST.taxo.lib[id]) || id; }
// ── Réglages → « La grille et ses stickers » : la grille en arbre, les stickers de la ligne choisie, les rattachements du sticker choisi ──
function stRendre() {
  const v = document.getElementById("ruVue_reglages"); if (!v) return;
  if (!ST.taxo) { stTaxo().then(() => stRendre()); }
  const L = stSujetLignes();
  if (!L.length) { v.innerHTML = '<div class="rp-carte"><h2>La grille et ses stickers</h2><p>Ce sujet n’a pas encore de grille à points : les stickers se rattachent aux lignes de cette grille.</p></div>'; return; }
  if (!ST.ligne || !stLigne(ST.ligne)) ST.ligne = (L.find(l => !l.calcul) || L[0]).id;
  const S = stDeLigne(ST.ligne); if (ST.s && !stTous().some(s => s.id === ST.s)) ST.s = null; if (!ST.s && S.length) ST.s = S[0].id;
  const P = stPret(), crit = [...new Set(L.map(l => l.crit))];
  const arbre = crit.map(c => { const Lc = L.filter(l => l.crit === c);
    return '<div class="st-crit" style="--st-c:' + (SC_CRIT[c] || "#6b7280") + '"><b>' + escapeHtml(Lc[0].critNom || c) + "</b>" + Lc.map(l => { const n = stDeLigne(l.id), nv = n.filter(s => s.etat !== "valide").length, so = stConf(l.id).sous || {};
      return '<button class="st-ligne' + (l.id === ST.ligne ? " on" : "") + '" onclick="ST.ligne=\'' + escapeAttr(l.id) + '\';ST.s=null;stRendre()" title="' + escapeAttr(l.calcul ? "Ligne calculée par l’app, sans sticker : " + (l.calcul === "lignes" ? "les lignes recopiées, rapportées à la longueur du sujet." : "les fautes de la bande, par ligne recopiée.") : stCompteTexte(l.id)) + '"><span>' + escapeHtml(l.titre) + '</span><small>' + stNb(l.poids) + " pt · " + (l.calcul ? "calculée" : n.length + " sticker" + (n.length > 1 ? "s" : "") + (nv ? " · " + nv + " à valider" : n.length ? " ✓" : "")) + "</small></button>"
        + Object.keys(so).sort((a, b) => (so[a].ordre || 0) - (so[b].ordre || 0)).map(x => '<span class="st-sous-arbre">› ' + escapeHtml(so[x].libelle || x) + " (" + n.filter(s => s.sous === x).length + ")</span>").join(""); }).join("") + "</div>"; }).join("");
  const l = stLigne(ST.ligne), conf = stConf(ST.ligne), so = conf.sous || {};
  const formule = '<label class="st-ligne-eleve">Ce que l’élève lit pour cette ligne<textarea rows="2" onchange="stLigneChamp(\'eleve\',this.value.trim())" title="[C14 1.4.17] La ligne de la grille, dite à l’élève : il la lit dans sa grille et dans « 🪟 Voir ma grille complète ». Vide : il lit le titre de la ligne.">' + escapeHtml(conf.eleve || "") + "</textarea></label>";
  const cartes = formule + (l.calcul ? '<p class="sc-m">' + escapeHtml(l.titre) + " est calculée par l’app : " + (l.calcul === "lignes" ? "les lignes recopiées, rapportées à la longueur du sujet." : "les fautes de la bande, par ligne recopiée.") + " Elle n’a pas de sticker.</p>"
    : S.map((s, i) => '<div class="st-carte' + (s.id === ST.s ? " on" : "") + (s.etat === "valide" ? " valide" : "") + '" onclick="if(ST.s!==\'' + s.id + '\'){ST.s=\'' + s.id + '\';stRendre()}" style="--st-c:' + stCouleur(s) + '">'
      + '<div class="st-carte-haut"><b>' + escapeHtml(s.num || "—") + "</b>" + (s.sous && so[s.sous] ? '<span class="st-sous">' + escapeHtml(so[s.sous].libelle) + "</span>" : "") + (s.portee === "lettre" ? '<span class="st-portee" title="Posé à la fin de la lecture, sur la lettre entière, seulement si rien ne le contredit.">toute la lettre</span>' : "") + (s.neCompte ? '<span class="st-portee" title="Il se lit sur la copie de l’élève, mais ne compte pas dans le compte de la ligne.">sans point</span>' : "") + '<span class="st-etat ' + (s.etat === "valide" ? "ok" : "") + '">' + (s.etat === "valide" ? "✓ validé" : "à valider") + "</span></div>"
      + '<label>Ce que l’élève lit<textarea rows="2" data-st="' + s.id + '" data-champ="texteEleve" onchange="stChamp(this)" title="La phrase que l’élève lit sur sa copie et dans sa grille. Un seul fait, qu’il retrouve sur sa copie.">' + escapeHtml(s.texteEleve) + "</textarea></label>"
      + '<label>S’il ne l’a pas encore réussi<textarea rows="2" data-st="' + s.id + '" data-champ="texteManque" onchange="stChamp(this)" title="[C14 1.4.17] La phrase que l’élève lit dans sa grille, sous « Pas encore réussi », quand il n’a pas ce sticker : ce qu’il a à faire. Vide : il lit la phrase du dessus.">' + escapeHtml(s.texteManque || "") + "</textarea></label>"
      + '<label>Ce que l’IA cherche<textarea rows="2" data-st="' + s.id + '" data-champ="cherche" onchange="stChamp(this)" title="Ce que l’IA cherche dans la copie, en mots de prof. L’élève ne le lit jamais.">' + escapeHtml(s.cherche || "") + "</textarea></label>"
      + '<div class="st-gestes"><select data-st="' + s.id + '" data-champ="portee" onchange="stChamp(this)" title="Un passage : l’IA donne les mots qui le prouvent, le cadre se pose dessus. Toute la lettre : posé à la fin, seulement si rien ne le contredit."><option value="passage"' + (s.portee !== "lettre" ? " selected" : "") + ">un passage</option><option value=\"lettre\"" + (s.portee === "lettre" ? " selected" : "") + ">toute la lettre</option></select>"
      + (s.portee === "lettre" ? "" : '<select data-st="' + s.id + '" data-champ="taille" onchange="stChamp(this)" title="[C14 1.4.17, proposé] Ce que le cadre entoure sur la copie de l’élève : les mots que l’IA donne, toute leur phrase (une architecture), ou tout leur paragraphe (une accolade dans la marge de droite).">' + [["mots", "cadre : quelques mots"], ["phrase", "cadre : toute la phrase"], ["paragraphe", "cadre : tout le paragraphe"]].map(([v, l]) => '<option value="' + v + '"' + ((s.taille || "mots") === v ? " selected" : "") + ">" + l + "</option>").join("") + "</select>")
      + '<button class="sc-btn" onclick="event.stopPropagation();stBouger(\'' + s.id + '\',-1)" title="Monter ce sticker d’un cran dans la ligne (sa place dans la bande et dans la grille de l’élève)."' + (i ? "" : " disabled") + ">↑</button><button class=\"sc-btn\" onclick=\"event.stopPropagation();stBouger('" + s.id + "',1)\" title=\"Descendre ce sticker d’un cran dans la ligne.\"" + (i < S.length - 1 ? "" : " disabled") + ">↓</button>"
      + '<button class="sc-btn" onclick="event.stopPropagation();stDupliquer(\'' + s.id + '\')" title="Un nouveau sticker, copie de celui-ci, à valider.">⧉</button><button class="sc-btn" onclick="event.stopPropagation();stRanger(\'' + s.id + '\')" title="Ranger ce sticker : il ne se propose plus ; il reste sur les copies où il est déjà posé. Rien n’est effacé.">🗑 Ranger</button></div></div>').join("")
      + '<button class="sc-btn st-plus" onclick="stNouveau()" title="Un nouveau sticker sur cette ligne, à écrire puis valider.">＋ Un sticker</button>');
  const s = stTous().find(x => x.id === ST.s), T = ST.taxo || { comp: [], fam: [], not: [], lib: {} };
  const ratt = !s || l.calcul ? '<p class="sc-m">Choisis un sticker pour voir ses rattachements.</p>' : '<h3>Le sticker ' + escapeHtml(s.num || "") + "</h3>"
    + '<label>Sa ligne<select data-st="' + s.id + '" data-champ="ligne" onchange="stChamp(this)" title="La ligne notée de la grille (le descripteur) dont il fait partie.">' + L.filter(x => !x.calcul).map(x => '<option value="' + escapeAttr(x.id) + '"' + (x.id === s.ligne ? " selected" : "") + ">" + escapeHtml(x.titre) + "</option>").join("") + "</select></label>"
    + '<label>Son sous-descripteur<select data-st="' + s.id + '" data-champ="sous" onchange="stChamp(this)" title="Une partie de la ligne, qui regroupe des stickers. Facultatif : il n’a pas de points à lui."><option value="">aucun</option>' + Object.keys(so).map(x => '<option value="' + escapeAttr(x) + '"' + (x === s.sous ? " selected" : "") + ">" + escapeHtml(so[x].libelle || x) + "</option>").join("") + '</select></label><button class="sc-btn" onclick="stSousNouveau()" title="Un nouveau sous-descripteur sur cette ligne : tu écris son nom.">＋ Un sous-descripteur</button>'
    + '<label>Sa compétence du socle<select data-st="' + s.id + '" data-champ="competence" onchange="stChamp(this)" title="La compétence du cycle 4 qu’il montre ; par défaut, celle de sa ligne."><option value="">—</option>' + T.comp.map(c => '<option value="' + escapeAttr(c.id) + '"' + (c.id === s.competence ? " selected" : "") + ">" + escapeHtml(c.id + " · " + (c.eleve || c.prof)) + "</option>").join("") + "</select></label>"
    + '<div class="st-taxo"><b>Sa notion de la taxonomie</b> (une ou deux)<div>' + (s.taxo || []).map(t => '<span class="st-chip">' + escapeHtml(stLib(t)) + ' <button onclick="stTaxoRetirer(\'' + s.id + "','" + escapeAttr(t) + '\')" title="Retirer ce rattachement.">×</button></span>').join("") + (s.taxoPropose ? '<span class="st-chip propose" title="Une notion qui manque à la taxonomie : elle part en proposition, à valider dans le panneau de la taxonomie.">⚑ ' + escapeHtml(s.taxoPropose) + "</span>" : "") + "</div>"
      + ((s.taxo || []).length < 2 ? '<input id="stTaxoCherche" placeholder="chercher une notion ou une famille…" value="' + escapeAttr(ST.cherche) + '" oninput="ST.cherche=this.value;stTaxoResultats()" title="Tape un mot : les notions et les familles de la taxonomie Eduscol du hub qui le contiennent."><div id="stTaxoRes" class="st-taxo-res"></div>' : "") + "</div>"
    + '<div class="st-apercu" style="--st-c:' + stCouleur(s) + '"><small>Comme l’élève le lit</small><span>' + escapeHtml(s.texteEleve) + "</span></div>"
    + (s.etat === "valide" ? '<p class="st-ok">✓ Validé le ' + escapeHtml(typeof rcHeure === "function" ? rcHeure(s.valideLe) : "") + "</p>" : '<button class="sc-btn st-valider" onclick="stValider(\'' + s.id + '\')" title="Je valide ce sticker : ce que l’élève lit et ses rattachements.">✓ Je valide</button>');
  v.innerHTML = '<div class="rp-carte st-ed"><div class="st-haut"><h2>La grille et ses stickers</h2><span class="st-pret ' + (P.ok ? "ok" : "") + '">' + escapeHtml(stPretTexte()) + "</span>"
    + '<button class="sc-btn" onclick="stValidationOuvrir()" title="Valider la grille une ligne par écran : tous les stickers de la ligne et leurs rattachements ; Entrée valide la ligne entière.">✓ Valider ligne par ligne</button>'
    + '<label class="sc-btn" title="Charger une grille de stickers depuis un fichier (le format mjpc-redaction-stickers/1) : ils arrivent à valider ; un numéro déjà là reste tel quel.">📥 Charger des stickers<input type="file" accept=".json,application/json" onchange="stCharger(event)" hidden></label>'
    + '<button class="sc-btn" onclick="stReprendreChoisir()" title="Copier ici les stickers d’un autre sujet (le même sujet dans une autre classe), avec leurs rattachements et leur validation.">⧉ Reprendre ceux d’un autre sujet</button></div>'
    + '<div class="st-cols"><nav class="st-arbre">' + arbre + '</nav><section class="st-milieu"><div class="st-ligne-titre"><b>' + escapeHtml(l.titre) + "</b> · " + stNb(l.poids) + " points"
    + (l.calcul ? "" : '<label class="st-comp-ligne">Compétence de la ligne <select onchange="stLigneChamp(\'competence\',this.value)" title="La compétence de la ligne : chaque nouveau sticker la prend par défaut."><option value="">—</option>' + T.comp.map(c => '<option value="' + escapeAttr(c.id) + '"' + (c.id === conf.competence ? " selected" : "") + ">" + escapeHtml(c.id) + "</option>").join("") + "</select></label>"
      + '<div class="st-compte" title="Combien de manques donnent quel niveau. Le barème de la ligne donne les points de chaque niveau.">' + escapeHtml(stCompteTexte(l.id)) + ' <button class="sc-btn" onclick="stCompteRegler()" title="Régler le compte de cette ligne : combien de manques au plus pour chaque niveau.">Régler</button></div>') + "</div>" + cartes + "</section>"
    + '<aside class="st-ratt">' + ratt + "</aside></div></div>";
  stTaxoResultats();
}
function stTaxoResultats() {
  const R = document.getElementById("stTaxoRes"); if (!R) return; const q = ST.cherche.trim().toLowerCase(), T = ST.taxo; if (!T || q.length < 2) { R.innerHTML = ""; return; }
  const ok = x => [x.prof, x.eleve, x.ex, x.id].some(t => String(t || "").toLowerCase().includes(q));
  const F = T.fam.filter(ok).slice(0, 6), N = T.not.filter(ok).slice(0, 10);
  R.innerHTML = (F.length + N.length ? F.map(f => '<button onclick="stTaxoAjouter(\'' + escapeAttr(f.id) + '\')" title="' + escapeAttr("Famille · " + f.dom + " · pour l’élève : " + f.eleve) + '"><b>' + escapeHtml(f.id) + "</b> " + escapeHtml(f.prof) + "</button>").join("") + N.map(n => '<button onclick="stTaxoAjouter(\'' + escapeAttr(n.id) + '\')" title="' + escapeAttr("Notion de " + stLib(n.fam) + " · pour l’élève : " + n.eleve + (n.ex ? " · exemple : " + n.ex : "")) + '">' + escapeHtml(n.prof) + "</button>").join("") : '<span class="sc-m">Rien dans la taxonomie.</span>');
}
function stMaj(id, f) { const s = stTous().find(x => x.id === id); if (!s) return null; const c = JSON.parse(JSON.stringify(s)); f(c); if (c.etat === "valide" && JSON.stringify(Object.assign({}, c, { etat: 0, valideLe: 0 })) !== JSON.stringify(Object.assign({}, s, { etat: 0, valideLe: 0 }))) { c.etat = "a-valider"; delete c.valideLe; } stEcrire(c); return c; }   // une modif remet le sticker à valider
function stChamp(el) { const id = el.dataset.st, ch = el.dataset.champ, v = el.value, f = c => { if (ch === "sous") c.sous = v || null; else c[ch] = ch === "texteEleve" || ch === "cherche" || ch === "texteManque" ? v.trim() : v; if (ch === "ligne") c.sous = null; };
  if (ch === "ligne") { stSiNotesChangent(() => { if (SUJET.stickers[id]) f(SUJET.stickers[id]); }, () => { stMaj(id, f); ST.ligne = v; }, "Changer sa ligne"); return; }   // un sticker qui change de ligne change le compte de deux lignes
  stMaj(id, f); stRendre(); }
function stLigneChamp(ch, v) { const c = Object.assign({}, stConf(ST.ligne)); c[ch] = v || null; stEcrireLigne(ST.ligne, c); stRendre(); }
function stValider(id) { stMaj(id, c => { c.etat = "valide"; c.valideLe = new Date().toISOString(); }); const S = stDeLigne(ST.ligne), i = S.findIndex(s => s.id === id), nx = S.slice(i + 1).find(s => s.etat !== "valide"); if (nx) ST.s = nx.id; stRendre(); }
function stTaxoAjouter(t) { stMaj(ST.s, c => { c.taxo = (c.taxo || []).filter(x => x !== t).concat([t]).slice(0, 2); }); ST.cherche = ""; stRendre(); }
function stTaxoRetirer(id, t) { stMaj(id, c => { c.taxo = (c.taxo || []).filter(x => x !== t); }); stRendre(); }
function stBouger(id, sens) { const S = stDeLigne(ST.ligne), i = S.findIndex(s => s.id === id), j = i + sens; if (i < 0 || j < 0 || j >= S.length) return; S.forEach((s, n) => { const o = n === i ? j : n === j ? i : n; if ((s.ordre || 0) !== o + 1) { const c = JSON.parse(JSON.stringify(s)); c.ordre = o + 1; stEcrire(c); } }); stRendre(); }
function stNouveau() { const conf = stConf(ST.ligne), S = stDeLigne(ST.ligne), s = { id: stId(), num: null, ligne: ST.ligne, sous: null, texteEleve: "Tu …", cherche: "", portee: "passage", competence: conf.competence || null, taxo: [], neCompte: false, ordre: S.length + 1, etat: "a-valider", creeLe: new Date().toISOString(), version: 0, source: "prof" }; s.num = "S" + (1 + stTous().reduce((m, x) => Math.max(m, parseInt(String(x.num || "").replace(/\D/g, "")) || 0), 0)); stEcrire(s, "un nouveau sticker"); ST.s = s.id; stRendre(); }
function stDupliquer(id) { const s = stTous().find(x => x.id === id); if (!s) return; const c = Object.assign(JSON.parse(JSON.stringify(s)), { id: stId(), num: "S" + (1 + stTous().reduce((m, x) => Math.max(m, parseInt(String(x.num || "").replace(/\D/g, "")) || 0), 0)), etat: "a-valider", valideLe: null, creeLe: new Date().toISOString(), version: 0, ordre: (s.ordre || 0) + 0.5, source: "dupliqué" }); stEcrire(c, "un sticker dupliqué"); ST.s = c.id; stRendre(); }
function stRanger(id) { const s = stTous().find(x => x.id === id); if (!s) return;
  scModale(`<h3>Ranger le sticker ${escapeHtml(s.num || "")} ?</h3><p>« ${escapeHtml(s.texteEleve)} »</p><p>Il ne se propose plus à l’IA ni dans la bande. Il reste sur les copies où il est déjà posé. Rien n’est effacé.</p><button class="sc-btn" onclick="scModaleFermer();stRangerOui('${s.id}')" title="Ranger ce sticker.">🗑 Ranger</button>`); }
function stRangerOui(id) { stSiNotesChangent(() => { if (SUJET.stickers[id]) SUJET.stickers[id].etat = "range"; }, () => { stMaj(id, c => { c.etat = "range"; c.rangeLe = new Date().toISOString(); }); ST.s = null; }, "Ranger ce sticker"); }
function stSousNouveau() { scModale(`<h3>Un sous-descripteur pour « ${escapeHtml(stLigne(ST.ligne).titre)} »</h3><p>Une partie de la ligne, qui regroupe des stickers ; il n’a pas de points à lui.</p><input id="stSousNom" class="sc-init" placeholder="son nom (ex. : le plus dur)"> <button class="sc-btn" onclick="stSousCreer()" title="Créer ce sous-descripteur.">Créer</button>`); setTimeout(() => { const i = document.getElementById("stSousNom"); if (i) i.focus(); }, 0); }
function stSousCreer() { const i = document.getElementById("stSousNom"), nom = i && i.value.trim(); if (!nom) return; const c = Object.assign({}, stConf(ST.ligne)), so = Object.assign({}, c.sous || {}), id = ruSlug(nom).replace(/_/g, "-") || "sous-" + Date.now().toString(36); so[id] = { libelle: nom, ordre: Object.keys(so).length + 1 }; c.sous = so; stEcrireLigne(ST.ligne, c); scModaleFermer(); if (ST.s) stMaj(ST.s, x => { x.sous = id; }); stRendre(); }
function stCompteRegler() { const [a, b, c] = stSeuils(ST.ligne), n = stComptent(ST.ligne).length;
  scModale(`<h3>Le compte de « ${escapeHtml(stLigne(ST.ligne).titre)} »</h3><p>${n} sticker${n > 1 ? "s" : ""} qui comptent. Combien de manques au plus pour chaque niveau ? Le barème de la ligne donne les points.</p>`
    + [[3, a], [2, b], [1, c]].map(([nv, x]) => `<p><label>Niveau ${nv} (${stNb(stPoints(ST.ligne, nv))} pt) : jusqu’à <input type="number" min="0" max="${n}" value="${x}" id="stSeuil${nv}" style="width:4em"> manque(s)</label></p>`).join("")
    + `<p class="sc-m">Au-delà : niveau 0 (${stNb(stPoints(ST.ligne, 0))} pt). Une copie déjà corrigée dont la note changerait est listée avant que rien ne change.</p><button class="sc-btn" onclick="stCompteGarder()" title="Garder ce compte pour cette ligne.">Garder</button>`); }
function stCompteGarder() { const v = [3, 2, 1].map(nv => Math.max(0, parseInt(document.getElementById("stSeuil" + nv).value) || 0)); for (let i = 1; i < 3; i++) v[i] = Math.max(v[i], v[i - 1]); const lg = ST.ligne, c = Object.assign({}, stConf(lg)); c.compte = v; scModaleFermer();
  stSiNotesChangent(() => { SUJET.stickersLignes[lg] = Object.assign({}, c); }, () => stEcrireLigne(lg, c), "Ce compte"); }
// ── ✓ Valider ligne par ligne : une ligne par écran, tous ses stickers ; Entrée valide la ligne entière (la lettre en douze écrans) ──
function stValidationOuvrir() { stTaxo().then(() => { const L = stSujetLignes().filter(l => !l.calcul && stDeLigne(l.id).length); if (!L.length) { toast("Aucun sticker à valider."); return; } let i = L.findIndex(l => stDeLigne(l.id).some(s => s.etat !== "valide")); ST.valid = { L: L.map(l => l.id), i: i < 0 ? 0 : i }; stValidationRendre(); }); }
function stValidationRendre() {
  const V = ST.valid; if (!V) return; let m = document.getElementById("stValid"); if (!m) { m = document.createElement("div"); m.id = "stValid"; m.className = "st-valid"; document.body.appendChild(m); }
  const id = V.L[V.i], l = stLigne(id), S = stDeLigne(id), conf = stConf(id), so = conf.sous || {}, nv = S.filter(s => s.etat !== "valide").length;
  m.innerHTML = '<div class="st-valid-c" role="dialog" aria-label="Valider la grille, ligne par ligne"><div class="st-valid-haut"><b>Ligne ' + (V.i + 1) + " sur " + V.L.length + " · " + escapeHtml(l.titre) + "</b> <span>" + stNb(l.poids) + " points · " + escapeHtml(stLib(conf.competence || "")) + "</span><small>" + escapeHtml(stCompteTexte(id)) + "</small>" + (conf.eleve ? '<span class="st-v-ligne">L’élève lit : « ' + escapeHtml(conf.eleve) + " »</span>" : "") + "</div>"
    + S.map(s => '<div class="st-valid-s' + (s.etat === "valide" ? " ok" : "") + '" style="--st-c:' + stCouleur(s) + '" onclick="ST.ligne=\'' + escapeAttr(id) + '\';ST.s=\'' + s.id + '\';stValidationFermer();if(RU.onglet!==\'reglages\')ruOnglet(\'reglages\');stRendre()" title="Ouvrir ce sticker dans l’éditeur pour le changer."><b>' + escapeHtml(s.num || "") + '</b><div><span class="st-v-eleve">' + escapeHtml(s.texteEleve) + '</span>' + (s.texteManque ? '<small class="st-v-manque">Pas encore réussi : ' + escapeHtml(s.texteManque) + "</small>" : "") + '<small>L’IA cherche : ' + escapeHtml(s.cherche || "—") + "</small><small>" + (s.portee === "lettre" ? "toute la lettre · " : "un passage · ") + (s.sous && so[s.sous] ? escapeHtml(so[s.sous].libelle) + " · " : "") + escapeHtml(s.competence || "sans compétence") + " · " + escapeHtml((s.taxo || []).map(stLib).join(", ") || "sans notion") + (s.taxoPropose ? " · ⚑ " + escapeHtml(s.taxoPropose) : "") + (s.neCompte ? " · sans point" : "") + "</small></div><i>" + (s.etat === "valide" ? "✓" : "") + "</i></div>").join("")
    + '<div class="st-valid-b"><button class="sc-btn" onclick="stValidationLigne()" title="Valider tous les stickers de cette ligne, puis la ligne suivante (Entrée).">✓ Je valide la ligne (Entrée)</button><button class="sc-btn" onclick="stValidationAller(-1)" title="La ligne d’avant (←)."' + (V.i ? "" : " disabled") + '>← Avant</button><button class="sc-btn" onclick="stValidationAller(1)" title="La ligne suivante, sans valider celle-ci (→)."' + (V.i < V.L.length - 1 ? "" : " disabled") + '>Après →</button><button class="sc-btn" onclick="stValidationFermer()" title="Fermer (Échap) : ce qui est validé reste validé.">Fermer</button><span class="sc-m">' + (nv ? nv + " à valider sur cette ligne" : "Toute la ligne est validée") + " · " + escapeHtml(stPretTexte()) + "</span></div></div>";
}
function stValidationLigne() { const V = ST.valid; if (!V) return; const le = new Date().toISOString(); stDeLigne(V.L[V.i]).filter(s => s.etat !== "valide").forEach(s => { const c = JSON.parse(JSON.stringify(s)); c.etat = "valide"; c.valideLe = le; stEcrire(c, "un sticker validé"); });
  if (V.i < V.L.length - 1) V.i++; else { stValidationFermer(); toast(stPretTexte()); stRendre(); return; } stValidationRendre(); stRendre(); }
function stValidationAller(s) { const V = ST.valid; if (!V) return; V.i = Math.max(0, Math.min(V.L.length - 1, V.i + s)); stValidationRendre(); }
function stValidationFermer() { ST.valid = null; const m = document.getElementById("stValid"); if (m) m.remove(); }
document.addEventListener("keydown", e => { if (!ST.valid) return; if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); stValidationLigne(); } else if (e.key === "ArrowRight") { e.preventDefault(); e.stopPropagation(); stValidationAller(1); } else if (e.key === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); stValidationAller(-1); } else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); stValidationFermer(); } }, true);
/* ═══ l'IA et la bande des stickers (cadrage 13 et 14 : un seul envoi par copie ; la bande s'arrête, après les fautes, à chaque sticker proposé) ═══ */
const RC_CONSIGNE_STICKERS = " En plus, pour chaque copie, cherche les réussites de la grille donnée dans « grille » : chaque sticker a son numéro « s », ce que tu cherches « cherche », et sa portée « portee ». Le sujet donné aux élèves est dans « sujet ». Pour un sticker de portée « passage » réussi, donne la ligne où il se voit le mieux (son identifiant) et les mots exacts de cette ligne qui le prouvent, recopiés tels qu'ils sont dans la ligne reçue (pas dans ta ligne corrigée), de un à douze mots qui se suivent. Pour un sticker de portée « lettre », donne-le seulement si toute la lettre le montre et que rien ne le contredit. N'invente rien : un sticker qui n'est pas réussi n'apparaît pas. Pour une copie marquée « seulementStickers », ne rends pas ses lignes : rends seulement ses réussites, et aussi ses remarques quand elles te sont demandées plus bas. Ajoute au JSON \"reussites\":{\"identité de la copie (son champ copie)\":[{\"s\":\"S8\",\"l\":\"identifiant de la ligne\",\"m\":\"les mots exacts\"},{\"s\":\"S6\"},{\"s\":\"fin\"}]} : termine toujours la liste de chaque copie par {\"s\":\"fin\"}, même si elle n'a aucune réussite.";
function stEnvoiGrille() { if (!stPret().ok) return null; return stActifs().sort((a, b) => stSujetLignes().findIndex(l => l.id === a.ligne) - stSujetLignes().findIndex(l => l.id === b.ligne) || (a.ordre || 0) - (b.ordre || 0)).map(s => Object.assign({ s: s.num || s.id, cherche: s.cherche || s.texteEleve, portee: s.portee === "lettre" ? "lettre" : "passage" }, s.portee !== "lettre" && s.taille && s.taille !== "mots" ? { taille: s.taille } : {})); }
/* [C14 1.4.18] (Paul 01/11 20:31 : « il faudrait une garde. pas d'export possible avant que le sujet soit complet, stickers grille etc. » ; C14 565) :
   ce qui manque au sujet avant tout envoi à l'IA, dit en clair ; null quand il est complet (l'énoncé donné aux élèves, la grille de stickers chargée et validée en entier) */
function stGardeExport() {
  if (!stEnonce().trim()) return "l’énoncé donné aux élèves manque";
  const P = stPret(); if (!P.n) return "ta grille de stickers n’est pas chargée (Réglages → « La grille et ses stickers » → « 📥 Charger des stickers »)";
  if (!P.ok) { const m = /\(([^)]*)\)\s*$/.exec(stPretTexte()); return "ta grille de stickers n’est pas prête" + (m ? " : " + m[1] : "") + " (Réglages → « ✓ Valider ligne par ligne »)"; }
  return null;
}
function stAEnvoyer(k) { const r = (scCopie(k).recopie || {}).stickersIA; return !r || !r.complet; }   // une copie dont les réussites ne sont pas encore revenues entières
function stEnonce() { const v = typeof SUJET === "object" && SUJET ? (SUJET.enonce || (SUJET.variantes || []).map(x => x.enonce || x.libelle).filter(Boolean).join("\n\n")) : ""; return String(v || "").slice(0, 6000); }
/* les mots rendus par l'IA, retrouvés dans la ligne recopiée : la plus longue suite de mots qui se suivent (sans accents ni majuscules) */
function stNorm(w) { return String(w || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, "'"); }
function stTrouverMots(texte, mots) {
  const P = rcPosMots(texte), T = P.map(p => stNorm(texte.slice(p[0], p[1]))), M = rcTokenize(mots || "").map(stNorm); if (!M.length || !T.length) return null;
  let best = null; for (let i = 0; i < T.length; i++) { let j = 0; while (i + j < T.length && j < M.length && T[i + j] === M[j]) j++; if (j && (!best || j > best.n)) best = { de: i, a: i + j, n: j }; }
  if (best && best.n >= Math.min(2, M.length)) return best;
  const i = T.indexOf(M.find(m => m.length > 3) || M[0]); return i >= 0 ? { de: i, a: i + 1, n: 1 } : null;
}
/* le retour de l'IA : les réussites de chaque copie, gardées seulement pour les copies dont les lignes sont à jour ; une ligne d'une autre copie ne s'y mêle jamais */
function stIAReussites(o, copiesOk) {
  const R = o.reussites || {}, quand = new Date().toISOString(); let copies = 0, poses = 0, incompletes = 0, inconnus = 0, horsCopie = 0;
  copiesOk.forEach(k => { const c = state.copies[k] || {}, L = R[c.id]; if (!Array.isArray(L)) return; const ici = {}; rcLignesEcrites(k).forEach(x => { ici[x.id] = x; });
    const liste = [], vu = new Set(); let complet = false;
    L.forEach(e => { if (!e || typeof e.s !== "string") return; if (e.s === "fin") { complet = true; return; } const st = stParNum(e.s) || stActifs().find(x => x.id === e.s); if (!st) { inconnus++; return; } if (vu.has(st.id)) return; vu.add(st.id);
      const p = e.p ? { p: String(e.p).slice(0, 500) } : {};   // [C14 1.4.17, proposé, C14 493] pourquoi c'est réussi, dit à l'élève
      if (st.portee === "lettre" || !e.l) { liste.push(Object.assign({ st: st.id, num: st.num, lettre: true }, p)); return; }
      const x = ici[e.l]; if (!x) { horsCopie++; return; } const t = stTrouverMots(x.l.texte, e.m); liste.push(Object.assign({ st: st.id, num: st.num, l: x.id, pid: x.pid, mots: String(e.m || "").slice(0, 200) }, t ? { de: t.de, a: t.a } : { sansPlace: true }, p, e.l2 && ici[e.l2] ? { l2: e.l2 } : {})); });
    const s = scCopie(k); s.recopie = s.recopie || {}; const prof = (((s.recopie.stickersIA || {}).liste) || []).filter(e => e.par === "prof");   // ce que tu as posé de ta main reste
    s.recopie.stickersIA = { le: quand, complet, liste: prof.concat(liste.filter(e => !prof.some(p => p.st === e.st))) }; if (!complet) incompletes++; copies++; poses += liste.length; });
  return { copies, poses, incompletes, inconnus, horsCopie };
}
/* les arrêts des stickers d'une copie, après ceux des fautes : dans l'ordre de la grille ; ceux de toute la lettre en dernier */
function stArrets(k) {
  const r = (scCopie(k).recopie || {}).stickersIA; if (!r || !Array.isArray(r.liste)) return []; const L = rcLignesEcrites(k), ordre = stSujetLignes().map(l => l.id), A = [];
  r.liste.forEach(e => { const st = stTous().find(x => x.id === e.st); if (!st) return; const x = e.l && L.find(y => y.id === e.l), i = x ? L.indexOf(x) : -1;
    const a = { st: true, k, sticker: st, stId: st.id, cle: "stk:" + st.id, lettre: !x || e.lettre || e.sansPlace, mots: e.mots || "", p: e.p || "", l2: e.l2 || null };
    if (x && !e.lettre && !e.sansPlace && e.a > e.de) Object.assign(a, { pid: x.pid, id: x.id, n: i + 1, l: x.l, g: { de: e.de, a: e.a, de2: e.de, a2: e.a, eleve: e.mots || "", corrige: e.mots || "" } });
    else if (x) Object.assign(a, { pid: x.pid, id: x.id, n: i + 1, l: x.l });
    A.push(a); });
  return A.sort((p, q) => (p.lettre ? 1 : 0) - (q.lettre ? 1 : 0) || ordre.indexOf(p.sticker.ligne) - ordre.indexOf(q.sticker.ligne) || (p.sticker.ordre || 0) - (q.sticker.ordre || 0));
}
function stDecision(k, stId) { return ((scCopie(k).stickers || {})[stId] || {}).v || null; }
function stStyle(a) { const c = stCouleur(a.sticker); return { couleur: c, fond: c + "22", texte: c, libelle: "Sticker" }; }
/* la décision d'un sticker : gardé (Entrée) ou non (N) ; gardé, il se pose sur la photo (une marque « sticker » à la couleur de son critère), sa place suit le cadre */
/* [C14 1.4.17, proposé, C14 492] l'étendue d'un sticker : toute la phrase (du point d'avant au point d'après, ou après une formule d'adresse), ou tout le paragraphe
   (de sa première ligne, celle des mots, à sa dernière, donnée par l'IA) ; un morceau par ligne, sur la page de sa première ligne */
function stEtendue(k, e, taille) {
  const L = rcLignesEcrites(k), i0 = L.findIndex(x => x.id === e.id); if (i0 < 0) return null;
  if (taille === "paragraphe") { let i1 = e.l2 ? L.findIndex(x => x.id === e.l2) : -1; if (i1 < i0) i1 = i0; return L.slice(i0, i1 + 1).map(x => ({ x, de: 0, a: rcPosMots(x.l.texte).length })).filter(r => r.a > 0); }
  const T = L.map(x => rcPosMots(x.l.texte).map(p => x.l.texte.slice(p[0], p[1]))), fin = w => /^[.!?…]+$/.test(w || ""), coupe = i => i > 0 && /,\s*$/.test(L[i - 1].l.texte || "") && /^\s*[A-ZÀ-Ý]/.test(L[i].l.texte || "");
  let li = i0, ti = e.de, n = 0; while (n++ < 2000) { if (ti > 0) { if (fin(T[li][ti - 1])) break; ti--; } else { if (li === 0 || coupe(li)) break; const q = T[li - 1]; if (!q.length || fin(q[q.length - 1])) break; li--; ti = T[li].length; } }
  let lf = i0, tf = Math.max(e.de, e.a - 1); n = 0; while (n++ < 2000 && !fin(T[lf][tf])) { if (tf + 1 < T[lf].length) tf++; else { if (lf + 1 >= L.length || coupe(lf + 1)) break; lf++; tf = 0; } }
  const R = []; for (let i = li; i <= lf; i++) { const a = i === li ? ti : 0, b = i === lf ? tf + 1 : T[i].length; if (b > a) R.push({ x: L[i], de: a, a: b }); }
  return R;
}
function stSegments(k, a, taille) {
  const R = stEtendue(k, { id: a.id, de: a.g.de, a: a.g.a, l2: a.l2 }, taille); if (!R || !R.length) return null;
  const S = R.filter(r => r.x.pid === a.pid).map((r, i) => { const q = rcPlaceSeg({ k, pid: r.x.pid, id: r.x.id, l: r.x.l, g: { de: r.de, a: r.a, de2: r.de, a2: r.a, eleve: "x", corrige: "x" }, cle: a.cle + ":" + i, st: true }); return [q.x0, q.y0, q.x1, q.y1]; });
  return S.length ? S : null;
}
function stDeciderArret(k, a, v) {
  const s = scCopie(k); s.stickers = Object.assign({}, s.stickers); const anc = s.stickers[a.stId], deja = anc && anc.marque && s.marques[anc.marque];
  const d = { v, le: new Date().toISOString(), de: (anc && anc.de) || "ia", num: a.sticker.num || null, ligne: a.sticker.ligne, version: a.sticker.version || 0 };
  if (v === "o" && !a.lettre && a.g) { if (deja) d.marque = anc.marque; else { const q = rcPlaceSeg(a), l = stLigne(a.sticker.ligne), tl = a.sticker.taille || "mots", sg = tl !== "mots" ? stSegments(k, a, tl) : null;
      const m = { page: a.pid, forme: "sticker", sens: "lieu", passe: l ? l.crit : "theme", point: a.sticker.ligne, q: null, x0: sg ? Math.min(...sg.map(r => r[0])) : q.x0, x1: sg ? Math.max(...sg.map(r => r[2])) : q.x1, y0: sg ? Math.min(...sg.map(r => r[1])) : q.y0, y1: sg ? Math.max(...sg.map(r => r[3])) : q.y1, taille: tl, segs: sg || null, sticker: a.stId, num: a.sticker.num || null, bonne: null, bande: { ligne: a.id, cle: a.cle, sticker: a.stId } };
      scPoser(m); d.marque = m.id; rcLigneMaj(k, a.pid, a.id, l2 => { l2.marquesBande = Object.assign({}, l2.marquesBande, { [a.cle]: m.id }); }); } }
  if (v === "n" && deja) { scEffacer(anc.marque); if (a.id) rcLigneMaj(k, a.pid, a.id, l2 => { if (l2.marquesBande) { l2.marquesBande = Object.assign({}, l2.marquesBande); delete l2.marquesBande[a.cle]; } }); }
  s.stickers[a.stId] = d; saveState();
}
/* la note de la copie, depuis les stickers : chaque ligne à stickers donne son niveau par son compte ; « Trente lignes » sur la recopie ; l'orthographe, les fautes de la bande par ligne recopiée */
function stNoteCopie(k) {
  const s = scCopie(k), D = s.stickers || {}, nL = rcLignesEcrites(k).length, g = SUJET && SUJET.grille2; let n = 0, tot = 0; const det = [];
  stSujetLignes().forEach(l => { tot += Number(l.poids) || 0; let niv = null, info = "", fait = "";
    if (l.calcul) { const pt = ((g && g.criteres) || []).flatMap(c => c.points || []).find(p => p.id === l.id); if (pt && nL) { const e = Object.values(s.marques || {}).filter(m => m.forme === "faute" && m.bande).length, r = l.calcul === "lignes" ? nL / (typeof scLong === "function" ? scLong() : 30) : e / nL;
        const c = (pt.cases || []).find(c => { const m = /^calc:\w+:([\d.]+)-([\d.]+)$/.exec(c.si); return m && r >= +m[1] && r <= +m[2]; }); if (c) { niv = c.niveau; info = l.calcul === "lignes" ? nL + " lignes" : e + " faute" + (e > 1 ? "s" : "") + " pour " + nL + " lignes"; fait = String(c.fait || "").replace(/\{n\}/g, nL).replace(/\{e\}/g, e); } } }
    else { const S = stComptent(l.id); if (S.length) { const p = S.filter(x => (D[x.id] || {}).v === "o").length; niv = stNiveau(l.id, p); info = p + " sur " + S.length; } }
    const pts = niv == null ? 0 : stPoints(l.id, niv); n += pts; det.push({ ligne: l.id, titre: l.titre, niveau: niv, points: pts, sur: l.poids, info, fait }); });
  return { n, tot, det };
}
/* [C14 1.4.17] ce que le sticker apporte à sa ligne : « Si tu le gardes : 1 sur 6 → 0 / 7 pt (3 sur 6 pour 2 pt) » ; gardé : son compte */
function stBandeApport(k, a, d) {
  const ligne = a.sticker.ligne, S = stComptent(ligne), D = scCopie(k).stickers || {}, l = stLigne(ligne); if (!l) return "";
  const p = S.filter(x => (D[x.id] || {}).v === "o").length, compte = !a.sticker.neCompte && S.some(x => x.id === a.stId), p2 = d === "o" || !compte ? p : p + 1, pts = stPoints(ligne, stNiveau(ligne, p2));
  let q = p2 + 1; while (q <= S.length && stPoints(ligne, stNiveau(ligne, q)) <= pts) q++;
  return (d === "o" ? "Gardé : " : "Si tu le gardes : ") + escapeHtml(l.titre) + ", " + p2 + " sur " + S.length + " → " + stNb(pts) + " / " + stNb(l.poids) + " pt" + (q <= S.length ? " (" + q + " sur " + S.length + " pour " + stNb(stPoints(ligne, stNiveau(ligne, q))) + " pt)" : "");
}
/* la carte d'un sticker dans la bande : ce que l'élève lira, sa ligne, le compte de la ligne et la note, en direct (Paul 30/10 15:17) */
function stBandeCarte(B, a, ctx, carte, touches) {
  const c = stCouleur(a.sticker), d = stDecision(B.k, a.stId), l = stLigne(a.sticker.ligne), nt = stNoteCopie(B.k);
  const zone = a.g && ["phrase", "paragraphe"].includes(a.sticker.taille) ? stEtendue(B.k, { id: a.id, de: a.g.de, a: a.g.a, l2: a.l2 }, a.sticker.taille) : null;
  if (zone && zone.length) ctx.innerHTML = '<div class="rc-st-lettre rc-st-zone">« ' + escapeHtml(zone.map(r => { const P = rcPosMots(r.x.l.texte); return r.x.l.texte.slice(P[r.de][0], P[r.a - 1][1]); }).join(" ")) + " »</div>";   // [C14 1.4.17] toute la phrase, ou tout le paragraphe
  else if (a.g) { const P = rcPosMots(a.l.texte); let h = "", cc = 0;
    P.forEach((p, i) => { h += escapeHtml(a.l.texte.slice(cc, p[0])); const w = escapeHtml(a.l.texte.slice(p[0], p[1])); h += i >= a.g.de && i < a.g.a ? '<mark style="background:' + c + '22;color:' + c + ";box-shadow:inset 0 -2px 0 " + c + '">' + w + "</mark>" : '<span class="rc-mot" data-m="' + i + '">' + w + "</span>"; cc = p[1]; });
    rcRubanTexte(ctx, B.k, a, h + escapeHtml(a.l.texte.slice(cc))); }
  else ctx.innerHTML = '<div class="rc-st-lettre">' + (a.l && a.mots ? "« " + escapeHtml(a.mots) + " » · " : "") + "toute la lettre</div>";
  carte.innerHTML = '<div class="rc-bande-mot rc-st-mot" style="color:' + c + '">★ ' + escapeHtml(a.sticker.texteEleve) + '</div><div class="rc-bande-pied"><b class="rc-bande-type" style="background:' + c + "22;color:" + c + ";border-color:" + c + '">' + escapeHtml((a.sticker.num || "") + " · " + (l ? l.titre : "")) + "</b> "
    + (a.lettre ? "Toute la lettre : gardé seulement si rien ne le contredit." : a.mots ? "L’IA l’a vu dans « " + escapeHtml(a.mots) + " »" + (a.sticker.taille === "phrase" ? " : le cadre prendra toute la phrase." : a.sticker.taille === "paragraphe" ? " : l’accolade prendra tout le paragraphe." : ".") : "") + (d === "o" ? " · ✓ gardé" : d === "n" ? " · ✗ non" : "") + '</div>'
    + (a.p ? '<div class="rc-bande-pied rc-st-pourquoi" title="La phrase que l’élève lira sous ce qu’il a écrit. Entrée la garde avec le sticker.">Pour l’élève : ' + escapeHtml(a.p) + "</div>" : "") + '<div class="rc-bande-pied rc-st-compte">' + stBandeApport(B.k, a, d) + " · sa note, avec les stickers déjà gardés avant celui-ci : " + stNb(nt.n) + " / " + stNb(nt.tot) + "</div>";
  touches.innerHTML = '<b class="rc-bande-mode">Les stickers</b><span><kbd>Entrée</kbd> ou <kbd>Espace</kbd> gardé</span><span><kbd>N</kbd> non</span><span><kbd>Retour</kbd> l’arrêt d’avant</span>' + (a.g && !zone ? "<span>glisser le cadre, ou <kbd>←</kbd> <kbd>→</kbd> : viser · double clic sur le cadre : sa longueur</span>" : "") + "<span><kbd>Échap</kbd> revenir à la recopie</span>" + (B.note ? '<em class="rc-bande-note">' + escapeHtml(B.note) + "</em>" : "");
  rcBandePhoto(a.g ? a : null);
}
/* une ligne retapée : le passage d'un sticker suit ses mots ; s'ils ont disparu, le sticker reste, sans cadre */
function stRetroactif(k, pid, id, mm, Lf) {
  const s = scCopie(k), r = (s.recopie || {}).stickersIA; if (!r || !Array.isArray(r.liste)) return;
  r.liste.forEach(e => { if (e.l !== id || e.de == null || e.sansPlace) return; const a = mm[e.de], b = mm[e.a - 1]; if (a >= 0 && b >= 0 && b >= a) { e.de = a; e.a = b + 1; } else e.sansPlace = true; });
  Object.keys(Lf.marquesBande || {}).filter(c => /^stk:/.test(c)).forEach(c => { const m = s.marques[Lf.marquesBande[c]], e = r.liste.find(x => "stk:" + x.st === c); if (!m || !e || e.sansPlace) return;
    const q = rcPlaceSeg({ k, pid, id, l: Lf, g: { de: e.de, a: e.a, de2: e.de, a2: e.a, eleve: "x", corrige: "x" }, cle: c }); Object.assign(m, { x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, modifieLe: new Date().toISOString() }); });
}
/* une copie corrigée avec les stickers : ses réussites décidées ; elle est finie quand chaque sticker proposé par l'IA est décidé (la liste revenue entière) */
function stCorrigeeAvec(k) { return !!Object.keys(scCopie(k).stickers || {}).length; }
function stFinie(k) { const r = (scCopie(k).recopie || {}).stickersIA; return !!(r && r.complet) && stArrets(k).every(a => stDecision(k, a.stId)); }
/* le fichier de l'élève : ses stickers réussis sur sa copie, et sa grille ligne par ligne : ce qu'il a réussi, puis « Pas encore réussi » */
function stEleve(k, ordre) {
  const s = scCopie(k), D = s.stickers || {}, rIA = s.recopie || {};   // [C14 1.4.18] (trouvé par le banc de 546) une copie sans aucune réussite garde sa grille et ses remarques
  if (!Object.keys(D).length && !(rIA.stickersIA && rIA.stickersIA.complet) && !(rIA.remarquesIA && (rIA.remarquesIA.liste || []).length)) return null;
  const nt = stNoteCopie(k), det = {}; nt.det.forEach(x => { det[x.ligne] = x; });
  const ia = (((s.recopie || {}).stickersIA || {}).liste) || [];
  const st = []; Object.keys(D).forEach(id => { const d = D[id]; if (d.v !== "o") return; const S = stTous().find(x => x.id === id); if (!S) return; const m = d.marque && s.marques[d.marque], l = stLigne(S.ligne);
    const e = ia.find(x => x.st === id && x.l && x.a > x.de && !x.sansPlace);   // [C14 1.4.17] (Paul 15:54 : « un encadré dans la copie doit être repris (recopie) ») : ce qu'il a écrit, tel que tu l'as recopié
    const tl = (m && m.taille) || "mots"; let ph = m && e ? stPhraseRecopiee(k, e.l, e.de, e.a) : null;
    if (ph && tl === "phrase") ph = { avant: "", passage: (ph.avant + ph.passage + ph.apres).trim(), apres: "" };
    if (ph && tl === "paragraphe") { const R2 = stEtendue(k, { id: e.l, de: e.de, a: e.a, l2: e.l2 }, "paragraphe") || []; ph = { avant: R2.map(r => r.x.l.texte.trim()).join(" "), passage: "", apres: "" }; }
    st.push({ id, texte: S.texteEleve, ligne: S.ligne, crit: l ? l.crit : null, page: m ? ordre.indexOf(m.page) : -1, x0: m ? m.x0 : 0, y0: m ? m.y0 : 0, x1: m ? m.x1 : 0, y1: m ? m.y1 : 0, taille: tl, segs: m && m.segs ? m.segs : null, phrase: ph, p: (e && e.p) || ((ia.find(x => x.st === id) || {}).p) || "" }); });
  const R = stRqEleve(k, ordre), rqDe = {}; R.groupes.forEach(g => g.l.forEach(x => { rqDe[x.st] = { n: g.n }; })); R.grille.forEach(x => { rqDe[x.st] = { r: x.r }; });
  const grille = stSujetLignes().map(l => { const S = stDeLigne(l.id).filter(x => x.etat === "valide"), x = det[l.id] || {};
    return { id: l.id, crit: l.crit, critNom: l.critNom, titre: l.titre, eleve: stConf(l.id).eleve || "", poids: l.poids, points: x.points || 0, niveau: x.niveau == null ? null : x.niveau, calcul: l.calcul, fait: x.fait || "",
      echelle: stEchelle(l), reussis: S.filter(y => (D[y.id] || {}).v === "o").map(y => y.texteEleve),
      manquent: S.filter(y => !y.neCompte && (D[y.id] || {}).v !== "o").map(y => Object.assign({ texte: y.texteManque || y.texteEleve }, rqDe[y.id] || {})) }; });
  return { stickers: st, grille, note: stFinie(k) ? Math.round(nt.n * 100) / 100 : null, total: nt.tot, reprendre: R.groupes };
}
/* la note et les critères d'une copie corrigée avec les stickers, pour le Bilan et les fichiers ; une copie corrigée avec les 51 questions garde les siens */
function stNoteBilan(k) { const nt = stNoteCopie(k); return { n: nt.n, tot: nt.tot, ok: stFinie(k), det: nt.det }; }
function stCritereBilan(k, c) { const nt = stNoteCopie(k), ok = stFinie(k); let n = 0, tot = 0; nt.det.forEach(x => { const l = stLigne(x.ligne); if (l && l.crit === c.id) { n += x.points; tot += Number(l.poids) || 0; } }); return { n, tot, ok }; }
/* ＋ un sticker que l'IA n'a pas vu, posé depuis la bande (Paul 01/11 10:37 : « si j'ai des choses à rajouter ou enlever, je les rajoute directement dans la bande ») :
   sur le mot où tu es (mot par mot), ou sur le passage de l'arrêt en cours ; un sticker de toute la lettre, sans cadre. Seuls les stickers validés se posent. */
function stPlusOuvrir() {
  const B = RC.bd; if (!B) return; const S = stActifs().filter(s => s.etat === "valide"); if (!S.length) { toast("Aucun sticker validé pour ce sujet : Réglages → la grille et ses stickers."); return; }
  const D = scCopie(B.k).stickers || {}, L = stSujetLignes().filter(l => !l.calcul);
  scModale(`<h3>＋ Un sticker que l’IA n’a pas vu</h3><p>${B.mot ? "Il se pose sur le mot où tu es." : "Il se pose sur le passage de l’arrêt en cours."} Un sticker de toute la lettre se pose sans cadre. Tu peux ensuite glisser son cadre, ou régler sa longueur (double clic).</p>`
    + L.map(l => { const T = S.filter(s => s.ligne === l.id); if (!T.length) return ""; return `<div class="st-plus-l" style="--st-c:${SC_CRIT[l.crit] || "#6b7280"}"><b>${escapeHtml(l.titre)}</b>${T.map(s => { const d = (D[s.id] || {}).v; return `<button class="sc-btn" ${d === "o" ? "disabled" : ""} onclick="scModaleFermer();stPoserProf('${s.id}')" title="${d === "o" ? "Déjà posé sur cette copie." : "Poser ce sticker : il compte aussitôt."}"><b>${escapeHtml(s.num || "")}</b> ${escapeHtml(s.texteEleve)}${s.portee === "lettre" ? " <i>(toute la lettre)</i>" : ""}${d === "o" ? " ✓" : ""}</button>`; }).join("")}</div>`; }).join(""));
}
function stPoserProf(stId) {
  const B = RC.bd; if (!B) return; const st = stTous().find(x => x.id === stId); if (!st) return; const k = B.k, s = scCopie(k); s.recopie = s.recopie || {};
  const w = B.mot ? B.W[B.j] : null, a = !B.mot ? B.A[B.i] : null, base = st.portee === "lettre" ? null : w ? { pid: w.pid, id: w.id, de: w.m, a: w.m + 1 } : a && a.g && a.id ? { pid: a.pid, id: a.id, de: a.g.de, a: Math.max(a.g.a, a.g.de + 1) } : null;
  const r = s.recopie.stickersIA = s.recopie.stickersIA || { le: new Date().toISOString(), complet: false, liste: [] }; r.liste = (r.liste || []).filter(e => e.st !== stId);
  const P = base ? rcPosMots((rcLignesEcrites(k).find(x => x.id === base.id) || { l: { texte: "" } }).l.texte) : [], L = base && rcLignesEcrites(k).find(x => x.id === base.id);
  r.liste.push(Object.assign({ st: stId, num: st.num, par: "prof" }, base && L ? { l: base.id, pid: base.pid, de: base.de, a: base.a, mots: L.l.texte.slice(P[base.de][0], P[base.a - 1][1]) } : { lettre: true }));
  // la décision : « gardé », de ta main
  const A = rcArretsBande(k), ar = A.find(x => x.st && x.stId === stId); if (ar) { stDeciderArret(k, ar, "o"); s.stickers[stId].de = "prof"; }
  saveState(); B.A = rcArretsBande(k); if (!B.mot) { const i = B.A.findIndex(x => x.st && x.stId === stId); if (i >= 0) B.i = i; } B.note = "Sticker " + (st.num || "") + " posé de ta main."; rcBandeRendre();
}
/* les notes ne bougent jamais seules (règle ⑨, cadrage 10) : un changement qui changerait la note de copies déjà corrigées avec les stickers les liste, avant et après,
   et ne s'applique qu'à ton « Appliquer » */
function stNotesClasse() { const o = {}; ((state && state.classe) || []).map(eleveId).filter(k => stCorrigeeAvec(k)).forEach(k => { o[k] = stNoteCopie(k).n; }); return o; }
function stSiNotesChangent(simuler, faire, quoi) {
  const avant = stNotesClasse(), sauve = { s: SUJET.stickers, l: SUJET.stickersLignes };
  SUJET.stickers = JSON.parse(JSON.stringify(SUJET.stickers || {})); SUJET.stickersLignes = JSON.parse(JSON.stringify(SUJET.stickersLignes || {}));
  let apres; try { simuler(); apres = stNotesClasse(); } finally { SUJET.stickers = sauve.s; SUJET.stickersLignes = sauve.l; }
  const D = Object.keys(avant).filter(k => Math.abs(avant[k] - (apres[k] || 0)) > 1e-9);
  if (!D.length) { faire(); stRendre(); return; }
  ST.enAttente = faire;
  scModale(`<h3>${escapeHtml(quoi)} change la note de ${D.length} copie${D.length > 1 ? "s" : ""} déjà corrigée${D.length > 1 ? "s" : ""}</h3><table class="sc-table"><tr><th>Élève</th><th>Avant</th><th>Après</th></tr>${D.map(k => `<tr><td>${escapeHtml(nomEleveDe(k) || k)}</td><td>${stNb(avant[k])}</td><td>${stNb(apres[k])}</td></tr>`).join("")}</table><p>Rien ne change tant que tu n’appliques pas.</p>`
    + `<button class="sc-btn" onclick="scModaleFermer();if(ST.enAttente)ST.enAttente();ST.enAttente=null;stRendre()" title="Appliquer le changement : ces notes changent.">Appliquer</button> <button class="sc-btn" onclick="scModaleFermer();ST.enAttente=null;stRendre()" title="Ne rien changer.">Annuler</button>`);
}

/* ═══ [C14 1.4.17] L'ÉCHELLE ET LES REMARQUES (Paul 01/11 14:19 : « les mal faits […] et les manquants peuvent simplement être des numéros dans la marge des lignes
   concernées et au clic l'élève voit la remarque rédigée par l'IA, sous sa phrase recopiée » ; 14:27 : « Il faut cadrer au prompt le format d'une remarque » ;
   15:09 : « l'élève doit voir son échelle descriptive d'un coup d'oeil » ; « applique ce que tu as toi même rédigé pour le prompt » : C14 451).
   Une remarque par sticker non réussi, sur une ligne ou pour la grille ; tu les relis en une liste à la fin de la bande, sans arrêt (C14 436) ;
   l'élève ne lit que celles que tu as gardées, et jamais celle d'un sticker réussi depuis (C14 448). ═══ */
const RC_CONSIGNE_REMARQUES = " Ensuite, pour chaque sticker de la grille qui n'est pas réussi, écris une remarque à l'élève, une seule par sticker. Tutoie-le. Deux phrases au plus, quarante mots au plus, avec des mots qu'un élève de 3e comprend sans aide. La première phrase dit ce qui ne va pas, en citant ses mots exacts entre guillemets. La seconde dit ce qu'il peut faire, sans jamais écrire la phrase corrigée à sa place. N'emploie que les mots de grammaire de la grille et du sujet. Ne juge jamais l'élève lui-même et ne parle pas de note. Si le sticker est raté à plusieurs endroits, choisis le plus net. S'il manque et qu'une ligne est l'endroit où il aurait sa place, donne cette ligne ; sinon, ne donne pas de ligne. Si un sticker n'est pas réussi seulement parce qu'un autre ne l'est pas, n'écris pas de remarque pour lui. N'écris jamais de remarque sur un sticker réussi. Ajoute au JSON \"aReprendre\":{\"identité de la copie (son champ copie)\":[{\"s\":\"S40\",\"l\":\"identifiant de la ligne\",\"m\":\"les mots exacts visés\",\"r\":\"la remarque\"},{\"s\":\"S13\",\"r\":\"la remarque\"},{\"s\":\"fin\"}]} : les mots exacts sont recopiés tels qu'ils sont dans la ligne reçue, de un à douze mots qui se suivent ; termine toujours la liste de chaque copie par {\"s\":\"fin\"}.";
/* l'échelle d'une ligne, pour l'élève : une ligne à stickers se lit en stickers réussis (« 5 sur 6 ») ; une ligne calculée, avec les phrases de sa grille */
function stEchelle(l) {
  const out = [0, 1, 2, 3].map(n => ({ n, texte: "", points: stPoints(l.id, n) }));
  if (l.calcul) { const g = SUJET && SUJET.grille2, pt = ((g && g.criteres) || []).flatMap(c => c.points || []).find(p => p.id === l.id), lg = typeof scLong === "function" ? scLong() : 30;
    ((pt && pt.cases) || []).forEach(c => { const m = /^calc:(\w+):([\d.]+)-([\d.]+)$/.exec(c.si || ""); if (!m) return; const a = +m[2], b = +m[3]; let x;
      if (m[1] === "lignes") { const lo = Math.ceil(a * lg - 1e-6), hi = Math.floor(b * lg + 1e-6); x = b >= 50 ? "plus de " + (lo - 1) + " lignes" : a <= 0 ? "moins de " + (hi + 1) + " lignes" : lo + " à " + hi + " lignes"; }
      else { const f = String(c.fait || ""), i = f.indexOf(":"); x = (i >= 0 ? f.slice(i + 1) : f).trim().replace(/\.$/, "").replace(/\bune\b/, "une erreur"); }
      const o = out[c.niveau]; if (o && x) o.texte = o.texte ? o.texte + " ou " + x : x; });
    return out; }
  const n = stComptent(l.id).length; if (!n) return out; const [a, b, c] = stSeuils(l.id);
  const r = (hi, lo) => { hi = Math.min(n, hi); lo = Math.max(0, lo); return hi < lo ? "" : hi === lo ? hi + " sur " + n : lo === 0 ? hi + " ou moins sur " + n : hi === lo + 1 ? lo + " ou " + hi + " sur " + n : lo + " à " + hi + " sur " + n; };   // hi, lo : stickers réussis
  out[3].texte = r(n, n - a); out[2].texte = b > a ? r(n - a - 1, n - b) : ""; out[1].texte = c > b ? r(n - b - 1, n - c) : ""; out[0].texte = r(n - c - 1, 0);
  return out;
}
/* le retour de l'IA : les remarques de chaque copie ; refusées : celle d'un sticker réussi, celle posée sur la ligne d'une autre copie */
function stIARemarques(o, copiesOk) {
  const R = o.aReprendre || {}, quand = new Date().toISOString(); let copies = 0, n = 0, refusReussi = 0, horsCopie = 0, inconnus = 0, longues = 0;
  copiesOk.forEach(k => { const c = state.copies[k] || {}, L = R[c.id]; if (!Array.isArray(L)) return; const ici = {}; rcLignesEcrites(k).forEach(x => { ici[x.id] = x; });
    const s = scCopie(k), ia = (((s.recopie || {}).stickersIA || {}).liste) || [], dec = s.stickers || {}, reussi = id => ia.some(e => e.st === id) || (dec[id] || {}).v === "o";
    const liste = [], vu = new Set(); let complet = false;
    L.forEach(e => { if (!e || typeof e.s !== "string") return; if (e.s === "fin") { complet = true; return; }
      const st = stParNum(e.s) || stActifs().find(x => x.id === e.s); if (!st) { inconnus++; return; } const r = String(e.r || "").trim(); if (!r || vu.has(st.id)) return;
      if (reussi(st.id)) { refusReussi++; return; } vu.add(st.id); const longue = r.split(/\s+/).length > 40; if (longue) longues++;
      if (!e.l) { liste.push({ st: st.id, num: st.num, r, grille: true, longue }); return; }
      const x = ici[e.l]; if (!x) { horsCopie++; return; } const t = e.m ? stTrouverMots(x.l.texte, e.m) : null;
      liste.push(Object.assign({ st: st.id, num: st.num, l: x.id, pid: x.pid, r, mots: String(e.m || "").slice(0, 200), longue }, t ? { de: t.de, a: t.a } : { sansPlace: true })); });
    s.recopie = s.recopie || {}; s.recopie.remarquesIA = { le: quand, complet, relu: null, liste }; copies++; n += liste.length; });
  return { copies, n, refusReussi, horsCopie, inconnus, longues };
}
function stRq(k) { const r = (scCopie(k).recopie || {}).remarquesIA; return r && Array.isArray(r.liste) ? r : null; }
function stRqVisibles(k) { const r = stRq(k); if (!r || !r.relu) return []; const D = scCopie(k).stickers || {}; return r.liste.filter(e => e.etat !== "retire" && (D[e.st] || {}).v !== "o"); }
function stRqARelire(k) { const r = stRq(k); return !!(r && !r.relu && r.liste.length); }
function stRqGarder(k) { const r = stRq(k); if (!r) return; r.relu = new Date().toISOString(); saveState(); if (typeof svVerifier === "function") svVerifier(); }
function stRqRetirer(k, i) { const r = stRq(k); if (!r || !r.liste[i]) return; if (r.liste[i].etat === "retire") delete r.liste[i].etat; else r.liste[i].etat = "retire"; saveState(); if (RC.bd) rcBandeRendre(); }
function stRqTexte(k, i, v) { const r = stRq(k), t = String(v || "").trim(); if (!r || !r.liste[i] || !t || t === r.liste[i].r) return; Object.assign(r.liste[i], { r: t, deProf: true, longue: t.split(/\s+/).length > 40 }); saveState(); }
/* la relecture, à la fin de la bande : la liste entière ; Entrée (ou « ✓ Je les garde ») les garde toutes ; ✕ en retire une ; le texte se corrige en place */
function stRqRelecture(k) {
  const r = stRq(k); if (!r || !r.liste.length) return "";
  const D = scCopie(k).stickers || {}, L = rcLignesEcrites(k);
  return '<div class="st-rq-tete"><b>Les remarques de l’IA · ' + r.liste.length + "</b> <span>" + (r.relu ? "✓ relues à " + escapeHtml(rcHeure(r.relu)) + " : l’élève lit celles qui restent." : "À relire : l’élève ne les lit qu’après ton <kbd>Entrée</kbd>.") + "</span>"
    + (r.relu ? "" : '<button class="sc-btn" onclick="stRqGarder(RC.bd.k);rcBandeRendre()" title="Garder toutes les remarques qui restent : l’élève les lira dans son fichier (Entrée).">✓ Je les garde (Entrée)</button>') + "</div>"
    + r.liste.map((e, i) => { const st = stTous().find(x => x.id === e.st), x = e.l && L.find(y => y.id === e.l), reussi = (D[e.st] || {}).v === "o", c = st ? stCouleur(st) : "#6b7280";
      return '<div class="st-rq' + (e.etat === "retire" || reussi ? " off" : "") + '" style="--st-c:' + c + '"><div class="st-rq-h"><b>' + escapeHtml(e.num || "") + "</b><span>" + escapeHtml(st ? (st.texteManque || st.texteEleve) : "") + "</span><small>" + (x ? "ligne " + (L.indexOf(x) + 1) + (e.mots ? " · « " + escapeHtml(e.mots) + " »" : "") : "dans la grille") + (e.longue ? " · plus de quarante mots" : "") + (reussi ? " · réussi depuis : elle ne part pas" : e.etat === "retire" ? " · retirée" : "") + "</small>"
        + '<button class="sc-btn" onclick="stRqRetirer(RC.bd.k,' + i + ')" title="' + (e.etat === "retire" ? "Remettre cette remarque : l’élève la lira." : "Retirer cette remarque : l’élève ne la lira pas. Rien n’est effacé.") + '">' + (e.etat === "retire" ? "↺ Remettre" : "✕ Retirer") + "</button></div>"
        + '<textarea rows="2" onchange="stRqTexte(RC.bd.k,' + i + ',this.value)" title="La remarque que l’élève lira. Corrige-la ici : ton texte remplace celui de l’IA.">' + escapeHtml(e.r) + "</textarea></div>"; }).join("");
}
/* la phrase de l'élève qui contient le passage, telle que tu l'as recopiée (les lignes de la copie, bout à bout) : avant, le passage, après */
function stPhraseRecopiee(k, id, de, a) {
  const L = rcLignesEcrites(k), coupes = new Set(); let T = "", deb = -1, fin = -1, entiere = false, avant = "";
  /* [C14 1.4.17] une ligne finie par une virgule, suivie d'une ligne qui commence par une majuscule, finit la phrase (« Cher Marie, » puis « Je suis au front… ») */
  L.forEach(x => { const t = x.l.texte || ""; if (T) { if (/,\s*$/.test(avant) && /^\s*[A-ZÀ-Ý]/.test(t)) coupes.add(T.length); T += " "; } avant = t; const o = T.length; if (x.id === id) { const P = rcPosMots(t); if (de != null && a > de && P[de] && P[a - 1]) { deb = o + P[de][0]; fin = o + P[a - 1][1]; } else { deb = o; fin = o + t.length; entiere = true; } } T += t; });
  if (deb < 0) return null; let s = deb; while (s > 0 && !/[.!?…]/.test(T[s - 1]) && !coupes.has(s - 1)) s--; let e = fin; while (e < T.length && !/[.!?…]/.test(T[e - 1]) && !coupes.has(e)) e++;
  return entiere ? { avant: T.slice(s, e).trim(), passage: "", apres: "" } : { avant: T.slice(s, deb).replace(/^\s+/, ""), passage: T.slice(deb, fin), apres: T.slice(fin, e) };
}
/* les remarques gardées, pour le fichier de l'élève : un numéro par ligne, dans l'ordre de la copie ; celles sans ligne vont dans la grille */
function stRqEleve(k, ordre) {
  const L = rcLignesEcrites(k), par = {}, grille = [], docs = (scCopie(k).recopie || {}).pages || {};
  stRqVisibles(k).forEach(e => { const st = stTous().find(x => x.id === e.st); if (!st) return; const lg = stLigne(st.ligne), it = { st: e.st, ligne: st.ligne, crit: lg ? lg.crit : null, attendu: st.texteManque || st.texteEleve, r: e.r };
    const x = e.l && L.find(y => y.id === e.l); if (!x || ordre.indexOf(x.pid) < 0) { grille.push(it); return; }
    const d = (RC.copie === k && RC.documents && RC.documents[x.pid]) || docs[x.pid], en = typeof rcEncre === "function" ? rcEncre(x.pid, x.l, d) : null;
    if (e.de != null && e.a > e.de && !e.sansPlace) { const q = rcPlaceSeg({ k, pid: x.pid, id: x.id, l: x.l, g: { de: e.de, a: e.a, de2: e.de, a2: e.a, eleve: "x", corrige: "x" }, cle: "rq:" + e.st, rq: true }); Object.assign(it, { x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1 }); }
    it.phrase = stPhraseRecopiee(k, x.id, e.de, e.a);
    const y = en && en.corps ? (en.corps[0] + en.corps[1]) / 2 : (x.l.y0 + x.l.y1) / 2 - 0.012, g = par[x.id] = par[x.id] || { id: x.id, page: ordre.indexOf(x.pid), y, l: [] }; g.l.push(it); });
  const groupes = Object.values(par).sort((a, b) => a.page - b.page || a.y - b.y); groupes.forEach((g, i) => { g.n = i + 1; });
  return { groupes, grille };
}

/* [C14 1.4.17, proposé, C14 493] la phrase qui dit pourquoi c'est réussi ; la dernière ligne d'un sticker de paragraphe */
const RC_CONSIGNE_POURQUOI = " Pour chaque réussite, ajoute aussi \"p\" : une phrase à l'élève qui dit pourquoi c'est réussi, en citant ses mots exacts entre guillemets, vingt-cinq mots au plus, en le tutoyant ; pour un sticker d'architecture, \"p\" donne la décomposition de sa phrase avec les sigles du sujet (P.P, PSR 1…), chaque morceau suivi de ses mots entre guillemets. Pour un sticker de taille « paragraphe », \"l\" est la première ligne du paragraphe, \"m\" ses premiers mots, et ajoute \"l2\", l'identifiant de sa dernière ligne.";
