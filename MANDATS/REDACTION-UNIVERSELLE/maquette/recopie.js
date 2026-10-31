// Recopier dans le vrai écran des scans : données ajoutées, anciennes corrections conservées.
var RC = { ouvert: false, copie: null, page: null, ligne: null, documents: {}, annule: [], zoom: 1, drag: null, ui: null };
function rcCopieSource() { return ((state.copies[RC.copie] || {}).scan || {}).recopie || {}; }
function rcListe(v) { return Array.isArray(v) ? v.slice() : Object.values(v || {}); }
function rcBorne(v, a, b) { return Math.max(a, Math.min(b, Number(v) || 0)); }
function rcDocument(pid) {
  if (RC.documents[pid]) return RC.documents[pid];
  const ancien = (rcCopieSource().pages || {})[pid];
  let d;
  if (ancien && ancien.schema === 1) {
    d = JSON.parse(JSON.stringify(ancien)); d.lignes = d.lignes || {};
    d.ordre = rcListe(d.ordre).filter(id => d.lignes[id] && !d.lignes[id].retiree);
    const im = SC.imgs[pid];
    if (im && im.el.complete && im.el.naturalWidth) {
      const cv = document.createElement("canvas"); cv.width = im.w; cv.height = im.h; cv.getContext("2d").drawImage(im.el, 0, 0);
      const marge = rcMargeRouge(cv), bord = rcBordDroit(cv), auto = v => Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6;
      if (!d.marge) {
        RC.sansMarge = RC.sansMarge || {}; RC.sansMarge[pid] = !marge;
        d.marge = marge ? { xh: rcBorne(marge(0), 0.01, 0.6), xb: rcBorne(marge(1), 0.01, 0.6) } : { xh: 0.15, xb: 0.15, absente: true };
        d.ordre.forEach(id => { const l = d.lignes[id]; if (l.recale) return;
          if (marge && auto(l.x0)) l.x0 = rcBorne(marge((l.y0 + l.y1) / 2) - 0.008, 0, 0.97);
          if (bord && auto(l.x1)) l.x1 = bord; });
      }
    }
  } else {
    d = { schema: 1, lignes: {}, ordre: [] };
    const p = SC.pages[pid], im = SC.imgs[pid]; let L = (p && p.lignes && p.lignes.l) || [], marge = null, bord = null;
    if (im && im.el.complete && im.el.naturalWidth && !(p.lignes && p.lignes.reperes)) {
      const cv = document.createElement("canvas"); cv.width = im.w; cv.height = im.h; cv.getContext("2d").drawImage(im.el, 0, 0);
      const trouvees = scLignes(cv, { recopie: true }); if (trouvees.fiable !== false) L = trouvees.l || [];
      marge = rcMargeRouge(cv); bord = rcBordDroit(cv); RC.sansMarge = RC.sansMarge || {}; RC.sansMarge[pid] = !marge;
      d.marge = marge ? { xh: rcBorne(marge(0), 0.01, 0.6), xb: rcBorne(marge(1), 0.01, 0.6) } : { xh: 0.15, xb: 0.15, absente: true };
    }
    L.filter(l => l.ecrite !== false).forEach(l => { const id = scId("ligne"), yl = rcBorne(l.y, 0, 1); d.ordre.push(id); d.lignes[id] = {
      id, x0: marge ? rcBorne(marge(yl) - 0.008, 0, 0.97) : rcBorne(l.x0, 0, 0.97), x1: bord ? bord : rcBorne(l.x1, 0.03, 1),
      y0: rcBorne(l.y, 0, 1), y1: rcBorne(l.y, 0, 1), texte: ""
    }; });
  }
  rcTrier(d); RC.documents[pid] = d; return d;
}
/* C14 (31/10, Paul 07:00) : « les points s'alignent toujours juste avant la marge rouge à gauche, et aillent au bord de la copie, à droite » */
function rcMargeRouge(cv) {
  /* 1.3.2 (C14, 31/10 07:58) : sur les vraies photos, la marge n'est pas « rouge vif » : c'est un trait plus rouge que le papier et que le quadrillage
     (mesuré sur 3 captures de Paul : marge r−g ≈ 26 à 30, papier et quadrillage r−g ≈ 6) ; elle penche, on la suit bande par bande */
  const W = cv.width, H = cv.height; if (!W || !H) return null;
  const px = cv.getContext("2d").getImageData(0, 0, W, H).data, lum = [];
  for (let i = 0; i < W * H; i += 29) { const j = i * 4; lum.push(px[j] + px[j + 1] + px[j + 2]); }
  lum.sort((a, b) => a - b); const papier = lum[Math.floor(lum.length * 0.8)] || 765;
  const m = (x, y) => { const j = (y * W + x) * 4, r = px[j], g = px[j + 1], b = px[j + 2], l = r + g + b; return r - g >= 18 && r - b >= 10 && l > papier * 0.2 && l < papier * 0.88; };
  const xa = Math.max(1, Math.floor(W * 0.03)), xb = Math.floor(W * 0.45), pas = Math.max(1, Math.floor(H / 600)), pts = [];
  for (let k = 0; k < 10; k++) {
    const ya = Math.floor(H * (0.03 + 0.094 * k)), yb = Math.floor(H * (0.03 + 0.094 * (k + 1))), c = new Array(xb - xa).fill(0); let n = 0;
    for (let y = ya; y < yb; y += pas) { n++; let avant = m(xa - 1, y), ici = m(xa, y); for (let x = xa; x < xb; x++) { const apres = m(x + 1, y); if (avant || ici || apres) c[x - xa]++; avant = ici; ici = apres; } }
    let bi = 0; for (let i = 1; i < c.length; i++) if (c[i] > c[bi]) bi = i;
    if (c[bi] >= n * 0.4) pts.push([(ya + yb) / 2 / H, (xa + bi) / W]);
  }
  if (pts.length < 3) return null;
  const med = pts.map(p => p[1]).sort((a, b) => a - b)[pts.length >> 1], bons = pts.filter(p => Math.abs(p[1] - med) < 0.02);
  if (bons.length < 3) return null;
  const my = bons.reduce((a, p) => a + p[0], 0) / bons.length, mx = bons.reduce((a, p) => a + p[1], 0) / bons.length;
  const b = bons.reduce((a, p) => a + (p[0] - my) * (p[1] - mx), 0) / (bons.reduce((a, p) => a + (p[0] - my) ** 2, 0) || 1);
  return y => mx + b * (y - my);
}
function rcBordDroit(cv) {
  const W = cv.width, H = cv.height; if (!W || !H) return null;
  const px = cv.getContext("2d").getImageData(0, 0, W, H).data, pas = Math.max(1, Math.floor(H / 300));
  const col = x => { let s = 0, n = 0; for (let y = Math.floor(H * 0.1); y < H * 0.9; y += pas) { const i = (y * W + x) * 4; s += px[i] + px[i + 1] + px[i + 2]; n++; } return s / n; };
  const ref = [0.5, 0.6, 0.7, 0.8].map(f => col(Math.floor(W * f))).sort((a, b) => a - b)[2];
  for (let x = W - 1; x > W * 0.6; x--) if (col(x) >= ref * 0.8) return x >= W * 0.985 ? 0.995 : rcBorne(x / W - 0.005, 0.6, 0.995);
  return 0.995;
}
/* C14 (31/10, Paul 07:11) : la numérotation ne prend que les lignes écrites (et celle où tu écris) */
/* 1.3.2 (Paul 08:20) : « le compte des lignes doit se faire sur l'ensemble de la copie sachant qu'une ligne ne compte que si quelque chose est écrit (un entrée ne suffit pas!) » */
function rcEcrites(pid) { const d = RC.documents[pid] || (rcCopieSource().pages || {})[pid]; if (!d) return 0; return rcListe(d.ordre).filter(id => d.lignes[id] && !d.lignes[id].retiree && (d.lignes[id].texte || "").trim()).length; }
function rcEcritesAvant(pid) { let n = 0; for (const p of scPagesDe(RC.copie)) { if (p.id === pid) break; n += rcEcrites(p.id); } return n; }
function rcEcritesCopie() { return scPagesDe(RC.copie).reduce((a, p) => a + rcEcrites(p.id), 0); }
function rcNumeros(d) { const n = {}; let k = RC.page ? rcEcritesAvant(RC.page) : 0; d.ordre.forEach(id => { if ((d.lignes[id].texte || "").trim()) n[id] = ++k; }); return n; }
/* C14 (31/10, Paul 07:27) : une ligne trop pleine rapetisse juste assez pour se lire en entier ; rien n'est mangé */
function rcAjusterTaille(input) {
  if (!input) return; const base = 18 * (RC.echelle || 1);
  RC.mesure = RC.mesure || document.createElement("canvas").getContext("2d"); RC.mesure.font = base + "px Georgia, serif";
  const t = RC.mesure.measureText(input.value || "").width, place = input.clientWidth - 6;
  input.style.fontSize = (t > place && place > 0 ? Math.max(base * 0.45, base * place / t) : base) + "px"; if (t > place) input.scrollLeft = 0;
}
function rcCourante() { const d = RC.page && rcDocument(RC.page); return d && d.lignes[RC.ligne]; }
function rcNoeud(tag, attrs, texte) {
  const e = document.createElement(tag);
  Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k]));
  if (texte != null) e.textContent = texte;
  return e;
}
function rcInterface() {
  if (RC.ui) return RC.ui;
  const e = rcNoeud("section", { id: "rcEcran", class: "rc-ecran", hidden: "", "aria-label": "Recopier la copie" });
  e.innerHTML = [
    '<header class="rc-haut"><button id="rcFermer" class="sc-btn" title="Revenir aux quatre passes de correction. Ta saisie est gardée. Échap fait pareil.">← Les scans</button>',
    '<b>✍ Recopier</b><label>Copie <select id="rcCopie" title="Choisir la copie à recopier, sans changer ses corrections."></select></label>',
    '<button id="rcCopieAvant" class="sc-btn" title="Recopier la copie précédente ; la saisie en cours est gardée.">← Copie</button>',
    '<button id="rcCopieSuite" class="sc-btn" title="Recopier la copie suivante ; la saisie en cours est gardée.">Copie →</button>',
    '<label>Page <select id="rcPage" title="Choisir une page de cette copie. Chaque page garde ses lignes et sa saisie."></select></label>',
    '<output id="rcEtat" role="status"></output></header>',
    '<div class="rc-outils"><span id="rcCompte"></span>',
    '<button id="rcAjouter" class="sc-btn" title="Ajouter une ligne après la ligne en cours. Recale ses deux poignées avant de taper.">＋ Une ligne</button>',
    '<button id="rcRetirer" class="sc-btn" title="Retirer la ligne en cours de la feuille. Annuler permet de la remettre avec son texte.">− Cette ligne</button>',
    '<button id="rcAnnuler" class="sc-btn" title="Annuler le dernier ajout, retrait ou recalage de cette page. Dans le champ, Ctrl + Z annule la frappe.">↶ Annuler</button>',
    '<button id="rcMoins" class="sc-btn" title="Réduire ensemble la photo et la feuille.">−</button>',
    '<button id="rcLargeur" class="sc-btn" title="Remettre la photo et la feuille à la largeur de leurs colonnes. Ctrl + molette règle aussi leur zoom.">↔ Largeur</button>',
    '<button id="rcPlus" class="sc-btn" title="Agrandir ensemble la photo et la feuille.">＋</button>',
    '<button id="rcCharger" class="sc-btn" hidden title="Remettre le paquet dans ce navigateur ; les lignes et le texte déjà gardés restent en place.">Charger le paquet</button></div>',
    '<div class="rc-apercu"><div><b id="rcLigneTitre"></b><span>Recale les poignées vertes, puis recopie sans corriger.<br>Entrée : ligne suivante · ↑ ↓ : changer de ligne.</span></div>',
    '<canvas id="rcAgrandie" aria-label="La ligne manuscrite en grand"></canvas></div>',
    '<div id="rcDefile" class="rc-defile"><div id="rcPapiers" class="rc-papiers">',
    '<div id="rcPhoto" class="rc-photo"><img id="rcImage" alt="La page manuscrite" draggable="false"><svg id="rcLignesSVG" aria-label="Les lignes et leurs poignées"></svg><p id="rcAbsente" hidden>La photo manque dans ce navigateur. Remets ton paquet.</p></div>',
    '<div id="rcFeuille" class="rc-feuille" aria-label="La feuille de recopie alignée sur la photo"></div></div></div>',
    '<p id="rcMessage" class="rc-message"></p>'
  ].join("");
  document.body.appendChild(e); RC.ui = e;
  e.querySelector("#rcFermer").onclick = () => rcFermer();
  e.querySelector("#rcCopie").onchange = ev => rcChoisirCopie(ev.target.value);
  e.querySelector("#rcPage").onchange = ev => rcChoisirPage(ev.target.value);
  e.querySelector("#rcCopieAvant").onclick = () => rcCopieVoisine(-1);
  e.querySelector("#rcCopieSuite").onclick = () => rcCopieVoisine(1);
  e.querySelector("#rcAjouter").onclick = rcAjouter;
  e.querySelector("#rcRetirer").onclick = rcRetirer;
  e.querySelector("#rcAnnuler").onclick = rcAnnuler;
  e.querySelector("#rcMoins").onclick = () => rcZoom(RC.zoom / 1.15);
  e.querySelector("#rcPlus").onclick = () => rcZoom(RC.zoom * 1.15);
  e.querySelector("#rcLargeur").onclick = () => rcZoom(1);
  e.querySelector("#rcCharger").onclick = () => document.querySelector("#scanEcran input[type=file]").click();
  e.querySelector("#rcDefile").addEventListener("wheel", ev => {
    if (!ev.ctrlKey) return; ev.preventDefault(); rcZoom(RC.zoom * (ev.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });
  e.querySelector("#rcDefile").addEventListener("scroll", () => rcAgrandir(), { passive: true });
  const svg = e.querySelector("#rcLignesSVG");
  svg.addEventListener("pointerdown", rcPoigneeDebut);
  svg.addEventListener("pointermove", rcPoigneeBouger);
  svg.addEventListener("pointerup", rcPoigneeFin);
  svg.addEventListener("pointercancel", rcPoigneeAnnuler);
  const im = e.querySelector("#rcImage");
  im.onload = () => { if (RC.ouvert) { rcMettreEnPage(); rcAgrandir(); } };
  im.onerror = () => { e.querySelector("#rcAbsente").hidden = false; };
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => { if (RC.ouvert) rcMettreEnPage(); }).observe(e.querySelector("#rcDefile"));
  const temoin = document.getElementById("ruTemoin");
  if (temoin) new MutationObserver(() => { if (RC.ouvert) e.querySelector("#rcEtat").textContent = temoin.textContent; }).observe(temoin, { childList: true, subtree: true, characterData: true });
  return e;
}
function rcBookmark() {
  const v = { ouverte: RC.ouvert, copie: RC.copie, page: RC.page, ligne: RC.ligne };
  if (JSON.stringify(state.scanRecopie || null) !== JSON.stringify(v)) { state.scanRecopie = v; saveState(); }
}
function rcOuvrir(reprendre) {
  if (!SC.ouvert || SC.attrib || !scK()) { toast("Donne d'abord chaque page à son élève."); return; }
  if (SC.champ) scChampFermer(true);
  scChrono(); RC.ouvert = true; RC.documents = {}; RC.annule = []; RC.zoom = 1;
  const trace = state.scanRecopie;
  const dernier = trace && (reprendre ? trace.ouverte : trace.copie === scK()) ? trace : null;
  RC.copie = dernier && SC.copies.includes(dernier.copie) ? dernier.copie : scK();
  const i = SC.copies.indexOf(RC.copie); if (i >= 0) SC.ic = i;
  const pages = scPagesDe(RC.copie), r = dernier || rcCopieSource().reprise || {};
  RC.page = pages.some(p => p.id === r.page) ? r.page : pages[0] && pages[0].id;
  RC.ligne = r.ligne || null;
  const e = rcInterface(); e.hidden = false; document.body.classList.add("rc-ouvert");
  rcActualiser(true); rcBookmark(); SC.actif = Date.now();
  rcSelectionner(RC.ligne, true, true);
}
function rcFermer(sansRendre) {
  if (!RC.ouvert) return; RC.ouvert = false; RC.drag = null;
  if (RC.ui) RC.ui.hidden = true;
  document.body.classList.remove("rc-ouvert"); SC.actif = Date.now(); rcBookmark();
  if (!sansRendre) { scRendre(); scLignesAccueil(); }
}
function rcChoisirCopie(k) {
  if (!SC.copies.includes(k)) return;
  RC.copie = k; RC.documents = {}; RC.annule = [];
  SC.ic = SC.copies.indexOf(k); const pages = scPagesDe(k), r = rcCopieSource().reprise || {};
  RC.page = pages.some(p => p.id === r.page) ? r.page : pages[0] && pages[0].id; RC.ligne = r.ligne || null;
  rcActualiser(true); rcSelectionner(RC.ligne, true, true); rcBookmark();
}
function rcCopieVoisine(sens) { const i = SC.copies.indexOf(RC.copie) + sens; if (i >= 0 && i < SC.copies.length) rcChoisirCopie(SC.copies[i]); }
function rcChoisirPage(pid) {
  if (!scPagesDe(RC.copie).some(p => p.id === pid)) return;
  RC.page = pid; RC.ligne = null; RC.annule = []; rcActualiser(true); rcSelectionner(null, true, true); rcBookmark();
}
function rcOptions(select, values, current) {
  const sig = JSON.stringify(values);
  if (select.dataset.options !== sig) {
    select.replaceChildren(...values.map(v => rcNoeud("option", { value: v[0] }, v[1]))); select.dataset.options = sig;
  }
  select.value = current || "";
}
function rcActualiser(changer) {
  const btn = document.getElementById("btnRecopier");
  if (btn) { btn.disabled = SC.attrib || !scK(); btn.title = btn.disabled ? "Attribue d'abord les pages à leurs élèves." : "Recopier à côté de la photo, ligne par ligne, avec une reprise enregistrée."; }
  if (!RC.ouvert || !RC.ui) return;
  const e = RC.ui, p = SC.pages[RC.page];
  rcOptions(e.querySelector("#rcCopie"), SC.copies.map(k => [k, nomEleveDe(k)]), RC.copie);
  rcOptions(e.querySelector("#rcPage"), scPagesDe(RC.copie).map((p, i) => [p.id, String(i + 1)]), RC.page);
  const i = SC.copies.indexOf(RC.copie);
  e.querySelector("#rcCopieAvant").disabled = i <= 0; e.querySelector("#rcCopieSuite").disabled = i >= SC.copies.length - 1;
  if (!p) { e.querySelector("#rcMessage").textContent = "Cette copie n'a pas de page."; return; }
  const d = rcDocument(p.id);
  if (!d.ordre.includes(RC.ligne)) RC.ligne = d.ordre[0] || null;
  const image = e.querySelector("#rcImage"), im = SC.imgs[p.id], src = im && im.url || "";
  if (image.getAttribute("src") !== src) { if (src) image.src = src; else image.removeAttribute("src"); }
  e.querySelector("#rcAbsente").hidden = !!im; e.querySelector("#rcCharger").hidden = !!im;
  e.querySelector("#rcPapiers").dataset.page = p.id;
  rcRapprocherLignes(); rcMettreEnPage(); rcMarques(); rcEtatLigne();
  if (changer) e.querySelector("#rcDefile").scrollTop = 0;
}
/* C14 (31/10, Paul 07:32) : une ligne prend toujours son rang (et son numéro) selon sa hauteur sur la photo */
function rcTrier(d) { const h = id => (d.lignes[id].y0 || 0) + (d.lignes[id].y1 || 0); d.ordre.sort((a, b) => h(a) - h(b)); return d; }
function rcRapprocherLignes() {
  const feuille = RC.ui.querySelector("#rcFeuille"), d = rcTrier(rcDocument(RC.page));
  const presents = new Map(Array.from(feuille.children).map(n => [n.dataset.ligne, n]));
  for (const [id, n] of presents) if (!d.ordre.includes(id)) n.remove();
  d.ordre.forEach((id, rang) => {
    let row = presents.get(id);
    if (!row) {
      row = rcNoeud("div", { class: "rc-ligne", "data-ligne": id });
      const input = rcNoeud("input", { class: "rc-saisie", type: "text", spellcheck: "false", autocomplete: "off", autocapitalize: "off", autocorrect: "off", "data-ligne": id });
      input.value = d.lignes[id].texte || "";
      input.onfocus = () => rcSelectionner(id, false, false);
      input.onclick = () => { rcSelectionner(id, false, false); rcGarder(); };
      input.oninput = () => { const ligne = rcDocument(RC.page).lignes[id]; const vide = !(ligne.texte || "").trim(); ligne.texte = input.value; rcAjusterTaille(input); if (vide !== !(input.value || "").trim()) { rcMarques(); rcEtatLigne(); rcRapprocherLignes(); } rcGarder(); };
      row.appendChild(input); feuille.appendChild(row);
    }
    const place = feuille.children[rang]; if (place !== row) feuille.insertBefore(row, place || null);
    const num = rcNumeros(d)[id], input = row.querySelector("input"); input.setAttribute("aria-label", "Recopie de la ligne " + (num || "vide"));
    input.title = "Recopie de la ligne" + (num ? " " + num : " (vide : elle n'aura un numéro que si tu y écris)") + " : garde les fautes, les mots barrés et la ponctuation. Entrée passe à la suivante.";
    row.classList.toggle("on", id === RC.ligne);
  });
}
function rcMettreEnPage() {
  if (!RC.ouvert || !RC.ui || !SC.pages[RC.page]) return;
  const e = RC.ui, p = SC.pages[RC.page], zone = e.querySelector("#rcDefile"), duo = e.querySelector("#rcPapiers");
  const largeur = Math.max(580, zone.clientWidth - 28) * RC.zoom, w = (largeur - 18) / 2, h = w * p.h / p.w;
  const echelle = w / 620; RC.echelle = echelle;
  duo.style.width = largeur + "px"; duo.style.setProperty("--rc-echelle", echelle);
  e.querySelector("#rcPhoto").style.height = h + "px"; e.querySelector("#rcFeuille").style.height = h + "px";
  const d = rcDocument(p.id);
  e.querySelectorAll(".rc-ligne").forEach(row => {
    const l = d.lignes[row.dataset.ligne]; if (!l) return;
    const a = Math.atan2((l.y1 - l.y0) * h, (l.x1 - l.x0) * w) * 180 / Math.PI;
    row.style.left = (l.x0 * w) + "px"; row.style.top = (l.y0 * h - 12 * echelle) + "px";
    row.style.width = Math.max(24, Math.hypot((l.x1 - l.x0) * w, (l.y1 - l.y0) * h)) + "px";
    row.style.transform = "rotate(" + a + "deg)";
    rcAjusterTaille(row.querySelector("input"));
  });
  rcMarques(); rcAgrandir();
}
function rcMarques() {
  if (!RC.ouvert || !RC.page || !RC.ui) return;
  const p = SC.pages[RC.page], d = rcDocument(RC.page), svg = RC.ui.querySelector("#rcLignesSVG");
  const H = 1000 * p.h / p.w; svg.setAttribute("viewBox", "0 0 1000 " + H);
  let s = ""; const N = rcNumeros(d);
  d.ordre.forEach((id, i) => {
    const l = d.lignes[id], actif = id === RC.ligne, x0 = l.x0 * 1000, x1 = l.x1 * 1000, y0 = l.y0 * H, y1 = l.y1 * H;
    const attributId = escapeAttr(id);
    if (actif) s += '<polygon class="rc-selection" points="' + x0 + "," + (y0 - 17) + " " + x1 + "," + (y1 - 17) + " " + x1 + "," + (y1 + 15) + " " + x0 + "," + (y0 + 15) + '"/>';
    s += '<g data-rc-ligne="' + attributId + '"><line class="rc-trait" x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y1 + '"/>';
    if (N[id]) s += '<text class="rc-numero" x="5" y="' + (y0 + 4) + '">' + N[id] + "</text>";
    for (const cote of ["gauche", "droite"]) s += '<circle class="rc-poignee' + (RC.selP && RC.selP.has(id + "|" + cote) ? " sel" : "") + '" data-rc-ligne="' + attributId + '" data-rc-cote="' + cote + '" cx="' + (cote === "gauche" ? x0 : x1) + '" cy="' + (cote === "gauche" ? y0 : y1) + '" r="7" role="button" aria-label="' + (cote === "gauche" ? "Début" : "Fin") + " de la ligne " + (N[id] || "vide") + '"><title>Glisse cette poignée pour recaler ' + (cote === "gauche" ? "le début" : "la fin") + " de la ligne" + (N[id] ? " " + N[id] : " (vide, sans numéro)") + ".</title></circle>";
    s += "</g>";
  });
  if (d.marge) { const xh = d.marge.xh * 1000, xb = d.marge.xb * 1000;
    s += '<g data-rc-trait="1"><line class="rc-marge-trait" x1="' + xh + '" y1="0" x2="' + xb + '" y2="' + H + '"/>';
    [["haut", xh + (xb - xh) * 0.02, 0.02 * H], ["bas", xh + (xb - xh) * 0.98, 0.98 * H]].forEach(([q, cx, cy]) => { s += '<circle class="rc-marge-poignee" data-rc-marge="' + q + '" cx="' + cx + '" cy="' + cy + '" r="9" role="button" aria-label="Marge, poignée du ' + q + '"><title>Cale ce trait rouge sur la marge de la copie : tous les débuts de ligne le suivent, sauf ceux que tu as tirés à la main.</title></circle>'; });
    s += "</g>"; }
  // Les poignées gardent leur capture de pointeur pendant le déplacement.
  if (!RC.drag) svg.innerHTML = s;
  else {
    const tr = svg.querySelector("g[data-rc-trait]"); if (tr && d.marge) { const xh = d.marge.xh * 1000, xb = d.marge.xb * 1000, t = tr.querySelector("line"); t.setAttribute("x1", xh); t.setAttribute("x2", xb);
      tr.querySelectorAll("circle").forEach(c => { const f = c.dataset.rcMarge === "haut" ? 0.02 : 0.98; c.setAttribute("cx", xh + (xb - xh) * f); }); }
    const ids = [...new Set((RC.drag.avants || []).map(x => x.id).concat(RC.ligne ? [RC.ligne] : []))];
    ids.forEach(lid => { const l = d.lignes[lid], g = Array.from(svg.querySelectorAll("g[data-rc-ligne]")).find(n => n.dataset.rcLigne === lid);
    if (g && l) {
      const trait = g.querySelector("line"); [["x1", l.x0 * 1000], ["y1", l.y0 * H], ["x2", l.x1 * 1000], ["y2", l.y1 * H]].forEach(([k, v]) => trait.setAttribute(k, v));
      g.querySelectorAll("circle").forEach(c => { const gauche = c.dataset.rcCote === "gauche"; c.setAttribute("cx", (gauche ? l.x0 : l.x1) * 1000); c.setAttribute("cy", (gauche ? l.y0 : l.y1) * H); });
    } });
  }
}
function rcEtatLigne() {
  const d = RC.page && rcDocument(RC.page), n = d ? d.ordre.length : 0, rang = d ? d.ordre.indexOf(RC.ligne) : -1, N = d ? rcNumeros(d) : {}, e = RC.copie ? rcEcritesCopie() : 0;
  RC.ui.querySelector("#rcCompte").textContent = e + " ligne" + (e > 1 ? "s" : "") + " écrite" + (e > 1 ? "s" : "") + " sur la copie";
  RC.ui.querySelector("#rcLigneTitre").textContent = rang < 0 ? "Une ligne à ajouter" : N[RC.ligne] ? "Ligne " + N[RC.ligne] + " sur " + e : "Ligne vide : elle comptera quand tu y écriras";
  RC.ui.querySelector("#rcRetirer").disabled = rang < 0;
  RC.ui.querySelector("#rcAnnuler").disabled = RC.annule.length === 0;
  RC.ui.querySelector("#rcMessage").textContent = (RC.sansMarge && RC.sansMarge[RC.page] ? "Marge rouge non trouvée sur cette page : cale le trait rouge sur la marge de la copie (ses deux poignées), les débuts de ligne suivront. " : "") + (n ? "La photo et la feuille défilent ensemble. Le total de lignes de ta correction reste celui que tu as saisi." : "Ajoute une ligne, puis place ses poignées sur l'écriture avant de taper.");
}
function rcSelectionner(id, focus, aligner) {
  if (!RC.ouvert || !RC.page) return;
  const d = rcDocument(RC.page); RC.ligne = d.ordre.includes(id) ? id : d.ordre[0] || null;
  RC.ui.querySelectorAll(".rc-ligne").forEach(n => n.classList.toggle("on", n.dataset.ligne === RC.ligne));
  rcMarques(); rcEtatLigne(); rcAgrandir();
  const input = Array.from(RC.ui.querySelectorAll(".rc-saisie")).find(n => n.dataset.ligne === RC.ligne);
  if (input && focus) input.focus({ preventScroll: true });
  if (input && aligner) {
    const zone = RC.ui.querySelector("#rcDefile"), row = input.parentElement;
    zone.scrollTop = Math.max(0, row.offsetTop - 30);
    if (zone.clientWidth < 600) zone.scrollLeft = Math.max(0, RC.ui.querySelector("#rcFeuille").offsetLeft - 10);
  }
  rcBookmark();
}
/* C14 (31/10, Paul 07:47) : la bande du haut, alignée sur la feuille en dessous (même échelle, même place) */
function rcAgrandir() {
  if (!RC.ouvert || !RC.ui) return;
  const p = SC.pages[RC.page], l = rcCourante(), im = p && SC.imgs[p.id], cv = RC.ui.querySelector("#rcAgrandie");
  const w = Math.max(200, Math.round(cv.clientWidth || 500)), h = 76;
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  const x = cv.getContext("2d"); x.fillStyle = "#fffdf8"; x.fillRect(0, 0, w, h); RC.bande = null;
  if (!l || !im || !im.el.complete || !im.el.naturalWidth) return;
  const fr = RC.ui.querySelector("#rcFeuille").getBoundingClientRect(), cr = cv.getBoundingClientRect(); if (!fr.width) return;
  const d = rcDocument(RC.page), ys = d.ordre.map(id => (d.lignes[id].y0 + d.lignes[id].y1) / 2).sort((a, b) => a - b), ecarts = [];
  for (let i = 1; i < ys.length; i++) if (ys[i] - ys[i - 1] > 0.005) ecarts.push(ys[i] - ys[i - 1]);
  const pas = ecarts.length ? ecarts.sort((a, b) => a - b)[ecarts.length >> 1] : (p.lignes && p.lignes.pas) || 0.03;
  const demi = Math.max(0.012, Math.min(0.035, pas * 0.55)) * im.h, k = fr.width / im.w, gauche = fr.left - cr.left, dh = 2 * demi * k, dy = (h - dh) / 2, N = 60;
  const yl = u => (l.y0 + (l.y1 - l.y0) * (u - l.x0) / ((l.x1 - l.x0) || 1)) * im.h;
  for (let i = 0; i < N; i++) { const u = (i + 0.5) / N, sx = i * im.w / N, sw = im.w / N + 1; x.drawImage(im.el, sx, yl(u) - demi, sw, 2 * demi, gauche + sx * k, dy, sw * k, dh); }
  RC.bande = { gauche, largeur: fr.width, hauteur: dh, pas: pas * im.h * k };
}
function rcGarder() {
  if (!RC.copie || !RC.page || !state.classe.some(n => eleveId(n) === RC.copie)) return;
  const s = scCopie(RC.copie); s.recopie = s.recopie || {}; s.recopie.schema = 1;
  s.recopie.pages = s.recopie.pages || {};
  const d = rcDocument(RC.page); d.modifieLe = new Date().toISOString();
  s.recopie.pages[RC.page] = JSON.parse(JSON.stringify(d)); s.recopie.reprise = { page: RC.page, ligne: RC.ligne };
  state.scanRecopie = { ouverte: true, copie: RC.copie, page: RC.page, ligne: RC.ligne };
  RC.ui.querySelector("#rcEtat").textContent = "Enregistrement…"; saveState(); SC.actif = Date.now();
}
function rcAjouter() {
  const d = rcDocument(RC.page), i = d.ordre.indexOf(RC.ligne), a = d.lignes[RC.ligne], b = d.lignes[d.ordre[i + 1]];
  const pas = SC.pages[RC.page].lignes && SC.pages[RC.page].lignes.pas || 0.03;
  const y = a ? b ? (a.y0 + b.y0) / 2 : a.y0 + pas : 0.18;
  const id = scId("ligne"); d.lignes[id] = { id, x0: a ? a.x0 : 0.14, x1: a ? a.x1 : 0.91, y0: rcBorne(y, 0.01, 0.98), y1: rcBorne(y + (a ? a.y1 - a.y0 : 0), 0.01, 0.98), texte: "" };
  d.ordre.splice(i + 1, 0, id); RC.annule.push({ type: "ajout", id }); RC.ligne = id;
  rcRapprocherLignes(); rcMettreEnPage(); rcSelectionner(id, true, true); rcGarder();
}
function rcRetirer() {
  const d = rcDocument(RC.page), id = RC.ligne, i = d.ordre.indexOf(id); if (i < 0) return;
  RC.annule.push({ type: "retrait", id, i }); d.lignes[id].retiree = new Date().toISOString(); d.ordre.splice(i, 1);
  RC.ligne = d.ordre[Math.min(i, d.ordre.length - 1)] || null;
  rcRapprocherLignes(); rcMettreEnPage(); rcSelectionner(RC.ligne, true, true); rcGarder();
}
function rcAnnuler() {
  const a = RC.annule.pop(); if (!a) return;
  const d = rcDocument(RC.page);
  if (a.type === "ajout") { d.ordre = d.ordre.filter(id => id !== a.id); d.lignes[a.id].retiree = new Date().toISOString(); RC.ligne = d.ordre[0] || null; }
  if (a.type === "retrait") { delete d.lignes[a.id].retiree; d.ordre.splice(a.i, 0, a.id); RC.ligne = a.id; }
  if (a.type === "recalage") { Object.assign(d.lignes[a.id], a.avant); RC.ligne = a.id; }
  if (a.type === "marge") { d.marge = a.marge; a.liste.forEach(({ id, avant }) => { if (d.lignes[id]) Object.assign(d.lignes[id], avant); }); }
  if (a.type === "groupe") { a.liste.forEach(({ id, avant }) => { if (d.lignes[id]) Object.assign(d.lignes[id], avant); }); RC.ligne = a.liste[0].id; }
  rcRapprocherLignes(); rcMettreEnPage(); rcSelectionner(RC.ligne, true, true); rcGarder();
}
/* C14 (31/10, Paul 07:47) : Ctrl (ou Cmd) + clic choisit plusieurs poignées ; on les déplace ensemble */
function rcPoint(ev) { const r = RC.ui.querySelector("#rcLignesSVG").getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width, y: (ev.clientY - r.top) / r.height }; }
function rcMargeX(d, y) { return d.marge.xh + (d.marge.xb - d.marge.xh) * y; }
function rcSuivreMarge(d) { d.ordre.forEach(id => { const l = d.lignes[id]; if (!l.recale) l.x0 = rcBorne(rcMargeX(d, (l.y0 + l.y1) / 2) - 0.008, 0, l.x1 - 0.02); }); }
function rcPoigneeDebut(ev) {
  const t = ev.target.closest && ev.target.closest("circle[data-rc-marge]");
  if (t) { ev.preventDefault(); ev.stopPropagation(); const d = rcDocument(RC.page);
    RC.drag = { marge: t.dataset.rcMarge, pointer: ev.pointerId, cible: t, bouge: false, depart: rcPoint(ev), margeAvant: Object.assign({}, d.marge), groupe: [],
      avants: d.ordre.map(id => { const L = d.lignes[id]; return { id, cote: "gauche", avant: { x0: L.x0, x1: L.x1, y0: L.y0, y1: L.y1, recale: !!L.recale } }; }) };
    t.setPointerCapture(ev.pointerId); return; }
  const c = ev.target.closest && ev.target.closest("circle[data-rc-cote]"); if (!c) return;
  ev.preventDefault(); ev.stopPropagation();
  const d = rcDocument(RC.page), cle = c.dataset.rcLigne + "|" + c.dataset.rcCote; RC.selP = RC.selP || new Set();
  [...RC.selP].forEach(k => { if (!d.lignes[k.split("|")[0]]) RC.selP.delete(k); });
  if (ev.ctrlKey || ev.metaKey) { if (RC.selP.has(cle)) RC.selP.delete(cle); else RC.selP.add(cle); }
  else if (!RC.selP.has(cle)) RC.selP.clear();
  RC.ui.querySelectorAll("#rcLignesSVG circle[data-rc-cote]").forEach(n => n.classList.toggle("sel", RC.selP.has(n.dataset.rcLigne + "|" + n.dataset.rcCote)));
  if ((ev.ctrlKey || ev.metaKey) && !RC.selP.has(cle)) return;
  const groupe = RC.selP.has(cle) && RC.selP.size > 1 ? [...RC.selP] : [cle];
  RC.ligne = c.dataset.rcLigne; const l = rcCourante();
  RC.drag = { id: RC.ligne, cote: c.dataset.rcCote, pointer: ev.pointerId, cible: c, avant: { x0: l.x0, x1: l.x1, y0: l.y0, y1: l.y1, recale: !!l.recale }, groupe, depart: rcPoint(ev), bouge: false,
    avants: groupe.map(k => { const id = k.split("|")[0], L = d.lignes[id]; return { id, cote: k.split("|")[1], avant: { x0: L.x0, x1: L.x1, y0: L.y0, y1: L.y1, recale: !!L.recale } }; }) };
  c.setPointerCapture(ev.pointerId); rcEtatLigne();
}
function rcPoigneeBouger(ev) {
  const a = RC.drag; if (!a || a.pointer !== ev.pointerId) return;
  ev.preventDefault(); const q = rcPoint(ev), l = rcCourante(), d = rcDocument(RC.page); a.bouge = true;
  if (a.marge) { const x = rcBorne(q.x, 0.01, 0.6), f = a.marge === "haut" ? 0.02 : 0.98, autre = a.marge === "haut" ? a.margeAvant.xb : a.margeAvant.xh;
    if (a.marge === "haut") { d.marge.xh = rcBorne((x - autre * f) / (1 - f), 0.01, 0.6); } else { d.marge.xb = rcBorne((x - autre * (1 - f)) / f, 0.01, 0.6); }
    delete d.marge.absente; rcSuivreMarge(d); rcMettreEnPage(); return; }
  if (a.groupe.length > 1) {
    const dx = q.x - a.depart.x, dy = q.y - a.depart.y;
    a.avants.forEach(({ id, cote, avant }) => { const L = d.lignes[id]; if (!L) return;
      if (cote === "gauche") { L.x0 = rcBorne(avant.x0 + dx, 0.005, L.x1 - 0.02); L.y0 = rcBorne(avant.y0 + dy, 0.005, 0.995); }
      else { L.x1 = rcBorne(avant.x1 + dx, L.x0 + 0.02, 0.995); L.y1 = rcBorne(avant.y1 + dy, 0.005, 0.995); } });
    rcMettreEnPage(); return;
  }
  const x = rcBorne(q.x, 0.005, 0.995), y = rcBorne(q.y, 0.005, 0.995);
  if (a.cote === "gauche") { l.x0 = Math.min(x, l.x1 - 0.02); l.y0 = y; } else { l.x1 = Math.max(x, l.x0 + 0.02); l.y1 = y; }
  rcMettreEnPage();
}
function rcPoigneeFin(ev) {
  const a = RC.drag; if (!a || a.pointer !== ev.pointerId) return;
  RC.drag = null;
  if (a.marge) { if (a.bouge) { RC.annule.push({ type: "marge", marge: a.margeAvant, liste: a.avants }); RC.sansMarge && (RC.sansMarge[RC.page] = false); }
    rcRapprocherLignes(); rcMarques(); rcEtatLigne(); if (a.bouge) rcGarder(); return; }
  if (a.bouge) { const d = rcDocument(RC.page); a.avants.forEach(({ id }) => { if (d.lignes[id]) d.lignes[id].recale = true; }); }
  if (a.bouge) RC.annule.push(a.groupe.length > 1 ? { type: "groupe", liste: a.avants } : { type: "recalage", id: a.id, avant: a.avant });
  rcRapprocherLignes(); rcMarques(); rcSelectionner(a.id, false, false); if (a.bouge) rcGarder();
}
function rcPoigneeAnnuler(ev) {
  const a = RC.drag; if (!a || a.pointer !== ev.pointerId) return;
  const d = rcDocument(RC.page); a.avants.forEach(({ id, avant }) => { if (d.lignes[id]) Object.assign(d.lignes[id], avant); });
  if (a.marge) d.marge = a.margeAvant; else Object.assign(rcCourante(), a.avant); RC.drag = null; rcMettreEnPage();
}
function rcZoom(v) { RC.zoom = rcBorne(v, 0.6, 2.5); rcMettreEnPage(); rcSelectionner(RC.ligne, true, true); }
function rcTransformerPage(pid, transformer) {
  Object.values(state.copies || {}).forEach(c => {
    const d = c.scan && c.scan.recopie && c.scan.recopie.pages && c.scan.recopie.pages[pid];
    if (!d) return;
    Object.values(d.lignes || {}).forEach(l => {
      const a = transformer(l.x0, l.y0), b = transformer(l.x1, l.y1);
      l.x0 = a[0]; l.y0 = a[1]; l.x1 = b[0]; l.y1 = b[1];
    });
    d.modifieLe = new Date().toISOString();
  });
  if (RC.ouvert && RC.page === pid) { delete RC.documents[pid]; rcActualiser(); }
}
function rcBornesRetouche(R) {
  const points = [];
  Object.values(state.copies || {}).forEach(c => {
    const d = c.scan && c.scan.recopie && c.scan.recopie.pages && c.scan.recopie.pages[R.pid];
    if (!d) return;
    Object.values(d.lignes || {}).filter(l => !l.retiree).forEach(l => {
      [[l.x0, l.y0], [l.x1, l.y1]].forEach(([u, v]) => {
        const [X, Y] = scVue2Orig(R.A, R.W0, R.H0, u, v);
        const [bx, by] = scRot(X - R.W0 / 2, Y - R.H0 / 2, -scTheta(R) * Math.PI / 180);
        const [ax, ay] = scRot(bx, by, R.angle * Math.PI / 180);
        const x = (ax + R.Wb / 2) / R.Wb, y = (ay + R.Hb / 2) / R.Hb;
        points.push([x, y - 0.012], [x, y + 0.012]);
      });
    });
  });
  return points;
}
/* 1.3.2 (Paul 08:20) : on passe d'une page à l'autre au clavier, sans le menu « Page » */
function rcPageVoisine(sens) {
  const pages = scPagesDe(RC.copie), i = pages.findIndex(p => p.id === RC.page), v = pages[i + sens]; if (!v) return false;
  rcGarder(); rcChoisirPage(v.id); const d = rcDocument(v.id);
  if (sens < 0 && d.ordre.length) { rcSelectionner(d.ordre[d.ordre.length - 1], true, true); const c = RC.ui.querySelector('.rc-saisie[data-ligne="' + CSS.escape(RC.ligne) + '"]'); if (c) { c.focus(); const n = c.value.length; c.setSelectionRange(n, n); } }
  return true;
}
/* 1.3.2 (Paul 08:20) : les guillemets tapés deviennent français, « avec leurs espaces insécables » */
function rcGuillemet(input) {
  const a = input.selectionStart, b = input.selectionEnd, avant = input.value.slice(0, a);
  const ouvre = (avant.match(/«/g) || []).length <= (avant.match(/»/g) || []).length;
  let ins = ouvre ? "«\u00a0" : "\u00a0»", debut = a;
  if (!ouvre && /[ \u00a0]$/.test(avant)) { debut = a - 1; ins = "\u00a0»"; }
  input.setRangeText(ins, debut, b, "end"); input.dispatchEvent(new Event("input", { bubbles: true }));
}
function rcClavier(ev) {
  if (!RC.ouvert) return false;
  if (ev.isComposing) return true;
  const input = ev.target && ev.target.classList && ev.target.classList.contains("rc-saisie");
  if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); rcFermer(); return true; }
  if (input && ev.key === '"' && !ev.ctrlKey && !ev.metaKey && !ev.altKey) { ev.preventDefault(); ev.stopPropagation(); rcGuillemet(ev.target); return true; }
  if (input && ev.key === "Backspace" && !ev.ctrlKey && !ev.metaKey && !ev.altKey && ev.target.selectionStart === 0 && ev.target.selectionEnd === 0) {
    const d = rcDocument(RC.page), i = d.ordre.indexOf(RC.ligne);
    if (i === 0 && rcPageVoisine(-1)) { ev.preventDefault(); ev.stopPropagation(); return true; }
    if (i > 0) { ev.preventDefault(); ev.stopPropagation(); rcSelectionner(d.ordre[i - 1], true, true);
      const c = RC.ui.querySelector('.rc-saisie[data-ligne="' + CSS.escape(RC.ligne) + '"]'); if (c) { c.focus(); const n = c.value.length; c.setSelectionRange(n, n); } rcGarder(); }
    return true;
  }
  if (input && !ev.ctrlKey && !ev.metaKey && !ev.altKey && ["Enter", "ArrowDown", "ArrowUp"].includes(ev.key)) {
    ev.preventDefault(); ev.stopPropagation();
    const d = rcDocument(RC.page), i = d.ordre.indexOf(RC.ligne), sens = ev.key === "ArrowUp" ? -1 : 1;
    if (i + sens < 0 || i + sens >= d.ordre.length) { if (rcPageVoisine(sens)) { rcGarder(); return true; } }
    const id = d.ordre[Math.max(0, Math.min(d.ordre.length - 1, i + sens))]; rcSelectionner(id, true, true);
    rcGarder();
    return true;
  }
  if (!input && (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "z") { ev.preventDefault(); rcAnnuler(); }
  ev.stopPropagation(); return true;
}
