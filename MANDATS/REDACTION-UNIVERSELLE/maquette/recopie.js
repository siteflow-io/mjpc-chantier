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
    '<button id="rcExportIA" class="sc-btn" title="Télécharger un fichier pour l’IA : ta consigne, puis tes copies recopiées, numérotées, sans aucun nom. Donne-le à l’IA, elle te rend le même fichier corrigé.">⇪ Exporter pour l’IA</button>',
    '<button id="rcImportIA" class="sc-btn" title="Coller ou choisir le retour de l’IA. L’app vérifie que toutes les lignes correspondent avant de rien changer.">⇩ Charger le corrigé de l’IA</button><span id="rcIAEtat" class="rc-ia-etat"></span>',
    '<button id="rcBandeOuvrir" class="sc-btn" title="La bande : elle s’arrête à chaque faute proposée par le corrigé de l’IA. Entrée ou Espace : c’est une faute ; N : non. Échap : revenir à la recopie.">▶ La bande</button>',
    '<button id="rcCharger" class="sc-btn" hidden title="Remettre le paquet dans ce navigateur ; les lignes et le texte déjà gardés restent en place.">Charger le paquet</button></div>',
    '<div class="rc-apercu"><div><b id="rcLigneTitre"></b><span>Recale les poignées vertes, puis recopie sans corriger.<br>Entrée : ligne suivante · ↑ ↓ : changer de ligne.</span></div>',
    '<canvas id="rcAgrandie" aria-label="La ligne manuscrite en grand"></canvas></div>',
    '<div id="rcDefile" class="rc-defile"><div id="rcPages" class="rc-pages"></div></div>',
    '<p id="rcMessage" class="rc-message"></p>',
    '<section id="rcBande" class="rc-bande" aria-label="La bande des fautes"><div class="rc-bande-g"><div class="rc-bande-haut"><button id="rcBandeRetour" class="sc-btn" title="Revenir à ta recopie (Échap). Tes réponses sont gardées.">← Revenir à la recopie</button><b id="rcBandeTitre"></b></div><div id="rcBandeAvis" class="rc-bande-avis" hidden></div><canvas id="rcBandePhoto" aria-label="La ligne de la photo"></canvas><div id="rcBandeContexte" class="rc-bande-contexte"></div><div id="rcBandeCarte" class="rc-bande-carte"></div><div id="rcBandeTouches" class="rc-bande-touches"></div></div><aside class="rc-bande-d"><h4>Les arrêts de cette copie</h4><ol id="rcBandeListe"></ol></aside></section>',
    '<div id="rcIA" class="rc-ia" hidden><div class="rc-ia-c" role="dialog" aria-label="Charger le corrigé de l’IA"><b>Charger le corrigé de l’IA</b><span>Colle ici tout le retour de l’IA, ou choisis le fichier qu’elle t’a rendu. Rien ne change tant que toutes les lignes ne correspondent pas.</span>',
    '<textarea id="rcIATexte" spellcheck="false" placeholder="Colle ici le retour de l’IA"></textarea>',
    '<div class="rc-ia-b"><label class="sc-btn" title="Choisir le fichier rendu par l’IA">Choisir un fichier<input id="rcIAFichier" type="file" accept=".json,.txt,application/json,text/plain" hidden></label><button id="rcIAValider" class="sc-btn" title="Vérifier toutes les lignes, puis enregistrer le corrigé">Vérifier et charger</button><button id="rcIAFermer" class="sc-btn" title="Fermer sans rien changer (Échap)">Fermer</button></div><p id="rcIAMessage" role="status"></p></div></div>'
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
  e.querySelector("#rcExportIA").onclick = rcExportIA;
  e.querySelector("#rcBandeOuvrir").onclick = () => { if (RC.bd) rcBandeFermer(); else rcBandeOuvrir(); };
  e.querySelector("#rcBandeRetour").onclick = () => rcBandeFermer();
  e.querySelector("#rcImportIA").onclick = rcIAOuvrir;
  e.querySelector("#rcIAFermer").onclick = rcIAFermer;
  e.querySelector("#rcIAValider").onclick = () => rcIACharger(e.querySelector("#rcIATexte").value);
  e.querySelector("#rcIAFichier").onchange = ev => { const f = ev.target.files && ev.target.files[0]; if (!f) return; f.text().then(t => { e.querySelector("#rcIATexte").value = t; rcIACharger(t); }); ev.target.value = ""; };
  e.querySelector("#rcCharger").onclick = () => document.querySelector("#scanEcran input[type=file]").click();
  e.querySelector("#rcDefile").addEventListener("wheel", ev => {
    if (!ev.ctrlKey) return; ev.preventDefault(); rcZoom(RC.zoom * (ev.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });
  e.querySelector("#rcDefile").addEventListener("scroll", () => { rcAgrandir(); rcPageVue(); }, { passive: true });
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => { if (RC.ouvert) rcToutesPages(rcMettreEnPage); }).observe(e.querySelector("#rcDefile"));
  const temoin = document.getElementById("ruTemoin");
  if (temoin) new MutationObserver(() => { if (RC.ouvert) e.querySelector("#rcEtat").textContent = temoin.textContent; }).observe(temoin, { childList: true, subtree: true, characterData: true });
  return e;
}
/* 1.3.3 (C14, Paul 31/10 08:20) : « pourquoi la copie ne s'affiche plus avec ses deux pages en scroll à la suite, comme pour les scans ? »
   Toutes les pages de la copie sont posées l'une sous l'autre ; la page de la ligne en cours porte les identifiants (#rcPhoto, #rcFeuille…),
   les autres sont dessinées avec le même code. */
const RC_IDS = [["rcPapiers", null], ["rcPhoto", ".rc-photo"], ["rcImage", ".rc-image"], ["rcLignesSVG", ".rc-svg"], ["rcAbsente", ".rc-absente"], ["rcFeuille", ".rc-feuille"]];
function rcBloc(pid) { return RC.ui && Array.from(RC.ui.querySelectorAll("#rcPages .rc-papiers")).find(b => b.dataset.page === pid); }
function rcIds(pid) {
  const b = rcBloc(pid); if (!b) return;
  RC_IDS.forEach(([id, sel]) => { const n = sel ? b.querySelector(sel) : b, old = document.getElementById(id); if (old && old !== n) old.removeAttribute("id"); if (n) n.id = id; });
}
function rcPourPage(pid, fn) { const avant = RC.page; if (pid === avant) return fn(); RC.page = pid; rcIds(pid); try { return fn(); } finally { RC.page = avant; rcIds(avant); } }
function rcToutesPages(fn) { scPagesDe(RC.copie).forEach(p => { if (p.id !== RC.page && rcBloc(p.id)) rcPourPage(p.id, fn); }); if (rcBloc(RC.page)) { rcIds(RC.page); fn(); } }
function rcBlocs() {
  const box = RC.ui.querySelector("#rcPages"), pages = scPagesDe(RC.copie);
  if (box.dataset.copie !== RC.copie || box.dataset.pages !== pages.map(p => p.id).join(",")) {
    box.innerHTML = ""; box.dataset.copie = RC.copie; box.dataset.pages = pages.map(p => p.id).join(",");
    pages.forEach((p, i) => {
      const b = rcNoeud("div", { class: "rc-papiers", "data-page": p.id });
      b.innerHTML = '<div class="rc-page-titre">Page ' + (i + 1) + ' / ' + pages.length + '</div><div class="rc-photo"><img class="rc-image" alt="La page manuscrite" draggable="false"><svg class="rc-svg" aria-label="Les lignes et leurs poignées"></svg><p class="rc-absente" hidden>La photo manque dans ce navigateur. Remets ton paquet.</p></div><div class="rc-feuille" aria-label="La feuille de recopie alignée sur la photo"></div>';
      const svg = b.querySelector(".rc-svg");
      svg.addEventListener("pointerdown", ev => { if (ev.target.closest && ev.target.closest("circle")) rcActiverPage(p.id); rcPoigneeDebut(ev); });
      svg.addEventListener("pointermove", rcPoigneeBouger); svg.addEventListener("pointerup", rcPoigneeFin); svg.addEventListener("pointercancel", rcPoigneeAnnuler);
      const im = b.querySelector(".rc-image");
      im.onload = () => { if (RC.ouvert) { rcPourPage(p.id, rcMettreEnPage); if (p.id === RC.page) rcAgrandir(); } };
      im.onerror = () => { b.querySelector(".rc-absente").hidden = false; };
      box.appendChild(b);
    });
  }
  pages.forEach(p => { const b = rcBloc(p.id), image = b.querySelector(".rc-image"), im = SC.imgs[p.id], src = im && im.url || "";
    if (image.getAttribute("src") !== src) { if (src) image.src = src; else image.removeAttribute("src"); }
    b.querySelector(".rc-absente").hidden = !!im; });
}
/* 1.3.4 (Paul 31/10 08:54) : le menu « Page » suit la page que l'on voit en faisant défiler */
function rcPageVue() {
  if (!RC.ouvert || !RC.ui) return; const zone = RC.ui.querySelector("#rcDefile"), sel = RC.ui.querySelector("#rcPage"); if (!zone || !sel) return;
  const z = zone.getBoundingClientRect(), y = z.top + z.height / 3;
  const b = Array.from(RC.ui.querySelectorAll("#rcPages .rc-papiers")).find(n => { const r = n.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
  if (b && sel.value !== b.dataset.page) sel.value = b.dataset.page;
}
function rcActiverPage(pid) {
  if (!pid || pid === RC.page || !rcBloc(pid)) return;
  RC.prev = RC.page; RC.page = pid; rcIds(pid); RC.annule = []; if (RC.selP) RC.selP.clear();
  const sel = RC.ui.querySelector("#rcPage"); if (sel) sel.value = pid;
}
function rcBookmark() {
  const v = { ouverte: RC.ouvert, copie: RC.copie, page: RC.page, ligne: RC.ligne };
  if (JSON.stringify(state.scanRecopie || null) !== JSON.stringify(v)) { state.scanRecopie = v; saveState(); }
}
function rcOuvrir(reprendre) {
  if (!SC.ouvert || SC.attrib || !scK()) { toast("Donne d'abord chaque page à son élève."); return; }
  if (SC.champ) scChampFermer(true);
  if (reprendre) SC.actif = Date.now(); else scChrono();   // [C14 dette ⓑ] la reprise à l'ouverture n'est pas un geste : elle ne compte pas de temps, la copie n'est pas réécrite
  RC.ouvert = true; RC.documents = {}; RC.annule = []; RC.zoom = 1;
  const trace = state.scanRecopie;
  const dernier = trace && (reprendre ? trace.ouverte : trace.copie === scK()) ? trace : null;
  RC.copie = dernier && SC.copies.includes(dernier.copie) ? dernier.copie : scK();
  const i = SC.copies.indexOf(RC.copie); if (i >= 0) SC.ic = i;
  const pages = scPagesDe(RC.copie), r = dernier || rcCopieSource().reprise || {};
  RC.page = pages.some(p => p.id === r.page) ? r.page : pages[0] && pages[0].id;
  RC.ligne = r.ligne || null;
  const e = rcInterface(); e.hidden = false; document.body.classList.add("rc-ouvert");
  SC.copies.forEach(rcSeparerAnciens);   // [C14 1.4.5] les arrêts d'avant à plusieurs mots, coupés une fois pour toutes
  rcActualiser(true); rcBookmark(); SC.actif = Date.now();
  rcSelectionner(RC.ligne, true, true);
}
function rcFermer(sansRendre) {
  if (!RC.ouvert) return; if (RC.bd) rcBandeFermer(true); RC.ouvert = false; RC.drag = null;
  if (RC.ui) RC.ui.hidden = true;
  document.body.classList.remove("rc-ouvert"); SC.actif = Date.now(); rcBookmark();
  if (!sansRendre) { scRendre(); scLignesAccueil(); }
}
function rcChoisirCopie(k) {
  if (!SC.copies.includes(k)) return; if (RC.bd) rcBandeFermer(true);
  RC.copie = k; RC.documents = {}; RC.annule = [];
  SC.ic = SC.copies.indexOf(k); const pages = scPagesDe(k), r = rcCopieSource().reprise || {};
  RC.page = pages.some(p => p.id === r.page) ? r.page : pages[0] && pages[0].id; RC.ligne = r.ligne || null;
  rcActualiser(true); rcSelectionner(RC.ligne, true, true); rcBookmark();
}
function rcCopieVoisine(sens) { const i = SC.copies.indexOf(RC.copie) + sens; if (i >= 0 && i < SC.copies.length) rcChoisirCopie(SC.copies[i]); }
function rcChoisirPage(pid) {
  if (!scPagesDe(RC.copie).some(p => p.id === pid)) return;
  rcActiverPage(pid); RC.ligne = null; rcSelectionner(null, true, true); rcBookmark();
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
  const im = SC.imgs[p.id]; e.querySelector("#rcCharger").hidden = scPagesDe(RC.copie).every(q => SC.imgs[q.id]);
  rcBlocs(); rcToutesPages(() => { rcRapprocherLignes(); rcMettreEnPage(); }); rcMarques(); rcEtatLigne();
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
      const pageRow = RC.page;
      input.onfocus = () => { if (pageRow !== RC.page) rcActiverPage(pageRow); if (RC.ligne !== id) rcSelectionner(id, false, false); };
      input.onclick = () => { if (pageRow !== RC.page) rcActiverPage(pageRow); rcSelectionner(id, false, false); rcGarder(); };
      input.oninput = () => { if (pageRow !== RC.page) rcActiverPage(pageRow); const ligne = rcDocument(pageRow).lignes[id]; const vide = !(ligne.texte || "").trim(); ligne.texte = input.value; rcAjusterTaille(input); if (vide !== !(input.value || "").trim()) { rcMarques(); rcEtatLigne(); rcRapprocherLignes(); } rcGarder(); };
      row.appendChild(input); feuille.appendChild(row);
    }
    const place = feuille.children[rang]; if (place !== row) feuille.insertBefore(row, place || null);
    { const inp = row.querySelector("input"); if (inp && document.activeElement !== inp && inp.value !== (d.lignes[id].texte || "")) inp.value = d.lignes[id].texte || ""; }
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
  rcEtatIA();
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
  if (RC.prev) { const pp = RC.prev; RC.prev = null; if (pp !== RC.page && rcBloc(pp)) rcPourPage(pp, rcMarques); }
  RC.ui.querySelectorAll(".rc-ligne").forEach(n => n.classList.toggle("on", n.dataset.ligne === RC.ligne));
  rcMarques(); rcEtatLigne(); rcAgrandir();
  const input = Array.from(RC.ui.querySelectorAll(".rc-saisie")).find(n => n.dataset.ligne === RC.ligne);
  if (input && focus) input.focus({ preventScroll: true });
  if (input && aligner) {
    const zone = RC.ui.querySelector("#rcDefile"), row = input.parentElement;
    zone.scrollTop = Math.max(0, zone.scrollTop + row.getBoundingClientRect().top - zone.getBoundingClientRect().top - 60);
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
/* 1.4.0 (C14, Paul 31/10 : décisions 182, 186, 187 ; consigne validée à 10:16) : l'export pour l'IA, son retour vérifié, les fautes proposées */
// emprunté tel quel à correction_dictee.html (ligne 1290), seul le nom change — DISPOSITIF règle 27
function rcTokenize(text){if(!text)return[];var t=[],re=/(\s+)|(['\u2019"\u00ab\u00bb\u201c\u201d])|([.,;:!?\u2026()\-\u2013\u2014]+)|([^\s.,;:!?\u2026\u00ab\u00bb\u201c\u201d()'\u2019"\-\u2013\u2014]+)/g,m;while((m=re.exec(text))!==null){if(!m[1])t.push(m[2]||m[3]||m[4])}return t}
const RC_PAQUET_IA = 4;
const RC_CONSIGNE_IA = "Tu reçois des rédactions d'élèves de 3e, recopiées ligne par ligne par leur professeur, fautes comprises. Pour chaque ligne, rends la même ligne corrigée : orthographe, accords, conjugaison, ponctuation, majuscules. Corrige mot pour mot : ne reformule pas, ne change pas l'ordre des mots, n'ajoute ni ne retire aucun mot, sauf si la grammaire l'exige (un mot manquant, un mot en trop). Ne touche pas au style ni au vocabulaire quand ils ne sont pas fautifs. Garde exactement les mêmes copies, pages et lignes, dans le même ordre ; une ligne vide reste vide ; un mot coupé en fin de ligne reste coupé au même endroit. Un mot entre crochets [comme ceci] a été barré par l'élève : laisse-le tel quel. Les guillemets restent « français ». Rends uniquement le fichier, avec la même structure, sans aucun commentaire.";
function rcEcrite(l) { return l && !l.retiree && (l.texte || "").trim(); }
function rcLignesEcrites(k) {
  const r = (((state.copies[k] || {}).scan || {}).recopie || {}).pages || {}, out = [];
  scPagesDe(k).forEach((p, j) => { const d = (RC.copie === k && RC.documents[p.id]) || r[p.id]; if (!d) return;
    const h = id => (d.lignes[id].y0 || 0) + (d.lignes[id].y1 || 0);
    rcListe(d.ordre).filter(id => rcEcrite(d.lignes[id])).sort((a, b) => h(a) - h(b)).forEach(id => out.push({ k, pid: p.id, page: j + 1, id, l: d.lignes[id] })); });
  return out;
}
function rcExportIA() {
  if (RC.page) rcGarder();
  /* 1.4.2 (Paul 10:57, « il ne se passe rien ») : un retour d'IA trop long est coupé ; on exporte 4 copies à la fois, celles qui n'ont pas encore leur corrigé à jour */
  const aFaire = SC.copies.filter(k => { const L = rcLignesEcrites(k); return L.length && L.some(x => typeof x.l.corrige !== "string" || x.l.texte !== x.l.corrigeDe); });
  if (!aFaire.length) { RC.ui.querySelector("#rcIAEtat").textContent = SC.copies.some(k => rcLignesEcrites(k).length) ? "Toutes tes copies recopiées ont leur corrigé." : "Aucune copie recopiée pour l’instant."; return; }
  const copies = aFaire.slice(0, RC_PAQUET_IA);
  const o = { consigne: RC_CONSIGNE_IA, format: "mjpc-recopie-ia-1", copies: copies.map((k, i) => { const L = rcLignesEcrites(k), pages = []; let n = 0;
    L.forEach(x => { let pg = pages.find(q => q.page === x.page); if (!pg) pages.push(pg = { page: x.page, lignes: [] }); pg.lignes.push({ id: x.id, n: ++n, texte: x.l.texte }); });
    return { numero: i + 1, pages }; }) };
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(o, null, 1)], { type: "application/json" }));
  a.download = "recopies-pour-l-IA-" + new Date().toISOString().slice(0, 10) + ".json"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  RC.ui.querySelector("#rcIAEtat").textContent = "Exporté : " + copies.length + " copie" + (copies.length > 1 ? "s" : "") + (aFaire.length > copies.length ? " ; encore " + (aFaire.length - copies.length) + " après celles-ci" : "") + ".";
}
function rcIAOuvrir() { if (RC.page) rcGarder(); RC.iaOuvert = true; const m = RC.ui.querySelector("#rcIA"); m.hidden = false; RC.ui.querySelector("#rcIAMessage").textContent = ""; RC.ui.querySelector("#rcIATexte").focus(); }
function rcIAFermer() { RC.iaOuvert = false; RC.ui.querySelector("#rcIA").hidden = true; }
function rcListeIA(v) { return Array.isArray(v) ? v : v && typeof v === "object" ? Object.values(v) : []; }
function rcIALire(txt) {
  const t = String(txt || ""), blocs = []; let prof = 0, deb = -1, chaine = false, ech = false;
  for (let i = 0; i < t.length; i++) { const c = t[i];
    if (chaine) { if (ech) ech = false; else if (c === "\\") ech = true; else if (c === '"') chaine = false; continue; }
    if (c === '"') { if (prof > 0) chaine = true; continue; }
    if (c === "{") { if (prof === 0) deb = i; prof++; } else if (c === "}" && prof > 0) { prof--; if (prof === 0) blocs.push(t.slice(deb, i + 1)); } }
  if (!blocs.length) throw prof > 0 ? "Le retour de l’IA est coupé avant la fin : elle n’a pas tout rendu. Demande-lui la suite et colle le tout, ou exporte moins de copies." : "Je ne trouve pas de fichier dans ce que tu as collé.";
  const copies = []; let lus = 0;
  blocs.forEach(b => { let o; try { o = JSON.parse(b); } catch (e) { return; } if (o && o.copies) { lus++; rcListeIA(o.copies).forEach(c => copies.push(c)); } });
  if (!lus) throw prof > 0 ? "Le retour de l’IA est coupé avant la fin : elle n’a pas tout rendu. Demande-lui la suite et colle le tout, ou exporte moins de copies." : "Le retour de l’IA n’a pas la forme du fichier envoyé (il manque la liste des copies, ou il n’est pas lisible).";
  return { copies };
}
function rcIACharger(txt) {
  const msg = RC.ui.querySelector("#rcIAMessage"); msg.textContent = "Vérification…"; msg.className = "rc-ia-msg";
  setTimeout(() => { try { rcIAChargerSuite(txt); } catch (e) { msg.textContent = "Rien n’a changé : le retour de l’IA n’a pas la forme attendue (" + (e && e.message || e) + ")."; } msg.className = "rc-ia-msg " + (/^Chargé/.test(msg.textContent) ? "ok" : "ko"); msg.scrollIntoView({ block: "nearest" }); }, 20);
  return true;
}
function rcIAChargerSuite(txt) {
  const msg = RC.ui.querySelector("#rcIAMessage"); let o;
  try { o = rcIALire(txt); } catch (e) { msg.textContent = "Rien n’a changé. " + e; return false; }
  const ici = {}; SC.copies.forEach(k => rcLignesEcrites(k).forEach(x => { ici[x.id] = x; }));
  const recu = {}, erreurs = []; let doublons = 0;
  rcListeIA(o.copies).forEach(c => rcListeIA(c && c.pages).forEach(pg => rcListeIA(pg && pg.lignes).forEach(l => { if (!l || typeof l.id !== "string") { erreurs.push("des lignes sans leur identifiant (l’IA les a enlevés : redemande-lui de garder chaque « id »)"); return; }
    if (recu[l.id]) doublons++; recu[l.id] = { texte: String(l.texte == null ? "" : l.texte), numero: c.numero, n: l.n }; })));
  Object.keys(recu).forEach(id => { if (!ici[id]) erreurs.push("la ligne " + recu[id].n + " de la copie n° " + recu[id].numero + " n’existe pas, ou n’est plus écrite, dans tes recopies"); });
  const copiesRecues = new Set(Object.keys(recu).filter(id => ici[id]).map(id => ici[id].k));
  copiesRecues.forEach(k => { const manque = rcLignesEcrites(k).filter(x => !recu[x.id]).length; if (manque) erreurs.push(manque + " ligne" + (manque > 1 ? "s" : "") + " de « " + nomEleveDe(k) + " » manque" + (manque > 1 ? "nt" : "") + " dans le retour (écrite" + (manque > 1 ? "s" : "") + " après l’export ? refais l’export)"); });
  if (doublons) erreurs.push(doublons + " ligne" + (doublons > 1 ? "s" : "") + " en double dans le retour");
  if (!Object.keys(recu).length) erreurs.push("aucune ligne dans le retour");
  if (erreurs.length) { msg.textContent = "Rien n’a changé : " + [...new Set(erreurs)].slice(0, 4).join(" ; ") + (erreurs.length > 4 ? " ; et " + (erreurs.length - 4) + " autre(s)." : "."); return false; }
  const quand = new Date().toISOString(); let fautes = 0, lignes = 0;
  Object.keys(recu).forEach(id => { const x = ici[id], pgs = (scCopie(x.k).recopie || {}).pages || {}, src = pgs[x.pid] && pgs[x.pid].lignes[id];
    [src, RC.copie === x.k && RC.documents[x.pid] && RC.documents[x.pid].lignes[id]].forEach(l => { if (l) { l.corrige = recu[id].texte; l.corrigeDe = l.texte; l.corrigeLe = quand; } });
    fautes += rcEcarts(x.l.texte, recu[id].texte).fautes; lignes++; });
  saveState(); rcEtatIA();
  msg.textContent = "Chargé : " + copiesRecues.size + " copie" + (copiesRecues.size > 1 ? "s" : "") + ", " + lignes + " lignes, " + fautes + " faute" + (fautes > 1 ? "s" : "") + " proposée" + (fautes > 1 ? "s" : "") + " par l’IA.";
  return true;
}
/* les fautes proposées d'une ligne : les mots qui diffèrent, alignés par la plus longue sous-suite commune */
function rcEcartsBruts(a, b) {
  const A = rcTokenize(a || ""), B = rcTokenize(b || ""), n = A.length, m = B.length, T = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) T[i][j] = A[i] === B[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
  const segs = []; let i = 0, j = 0, sa = 0, sb = 0;
  const fermer = () => { if (i > sa || j > sb) segs.push({ de: sa, a: i, de2: sb, a2: j, eleve: A.slice(sa, i).join(" "), corrige: B.slice(sb, j).join(" ") }); };
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { fermer(); i++; j++; sa = i; sb = j; }
    else if (j >= m || (i < n && T[i + 1][j] >= T[i][j + 1])) i++; else j++;
  }
  fermer();
  return { segs, A, B };
}
/* [C14 1.4.5] un arrêt par mot (Paul 14:16 : « il faut séparer les types d'erreur, il faut être dans le même détail que dictée » ; 14:46 : deux mots
   fautifs côte à côte étaient pris ensemble). Dans un écart, les mots se répondent un à un quand les deux côtés en ont autant, et chaque
   ponctuation est un arrêt à part. Un écart qui touche une apostrophe ou un trait d’union reste entier (« le → l’ », « peut etre → peut-être »),
   et aussi un écart où les mots ne sont pas en même nombre (« entoi → en toi » : une seule faute). */
function rcSeparable(t) { return rcEstPonct(t) && !/['’]|^-+$/.test(t); }
function rcCouper(A, B, g) {
  const EA = A.slice(g.de, g.a), EB = B.slice(g.de2, g.a2);
  if (EA.length <= 1 && EB.length <= 1) return [g];
  if (EA.concat(EB).some(t => /['’]|^-+$/.test(t))) return [g];
  if (!EA.length || !EB.length) return (EA.length ? EA : EB).map((t, i) => EA.length ? { de: g.de + i, a: g.de + i + 1, de2: g.de2, a2: g.de2, eleve: t, corrige: "" } : { de: g.de, a: g.de, de2: g.de2 + i, a2: g.de2 + i + 1, eleve: "", corrige: t });   // deux mots manquants, ou en trop : deux fautes
  if (EA.filter(t => !rcSeparable(t)).length !== EB.filter(t => !rcSeparable(t)).length) return [g];
  const out = []; let i = 0, j = 0;
  const pousser = (i0, i1, j0, j1) => { if (i1 - i0 === 1 && j1 - j0 === 1 && EA[i0] === EB[j0]) return; out.push({ de: g.de + i0, a: g.de + i1, de2: g.de2 + j0, a2: g.de2 + j1, eleve: EA.slice(i0, i1).join(" "), corrige: EB.slice(j0, j1).join(" ") }); };
  while (i < EA.length || j < EB.length) {
    const pa = i < EA.length && rcSeparable(EA[i]), pb = j < EB.length && rcSeparable(EB[j]);
    if (i < EA.length && j < EB.length && pa === pb) { pousser(i, i + 1, j, j + 1); i++; j++; }
    else if (j < EB.length && (pb || i >= EA.length)) { pousser(i, i, j, j + 1); j++; }
    else { pousser(i, i + 1, j, j); i++; }
  }
  return out.length ? out : [g];
}
function rcEcarts(a, b) {
  const r = rcEcartsBruts(a, b), segs = [].concat(...r.segs.map(g => rcCouper(r.A, r.B, g)));
  return { segs, fautes: segs.reduce((s, x) => s + Math.max(x.a - x.de, x.a2 - x.de2), 0) };
}
function rcCle(g) { return g.de + "-" + g.a + "/" + g.de2 + "-" + g.a2; }
/* les copies d'avant 1.4.5 : un arrêt déjà décidé qui prenait plusieurs mots est coupé une fois pour toutes ; chaque morceau garde la décision ;
   la marque unique devient une marque par morceau ; un cadre glissé est partagé entre les mots, à la longueur de chacun. Une ligne dont la photo
   n'est pas encore là attend (elle sera coupée à la prochaine ouverture). */
function rcSeparerAnciens(k) {
  const s = scCopie(k); let n = 0;
  rcLignesEcrites(k).forEach(x => { const l = x.l; if (typeof l.corrige !== "string" || l.texte !== l.corrigeDe || !l.decisions) return;
    const im = SC.imgs[x.pid]; if (!im || !im.el || !im.el.complete || !im.el.naturalWidth) return;
    const r = rcEcartsBruts(l.texte, l.corrige);
    r.segs.forEach(g => { const cle = rcCle(g), d = l.decisions[cle]; if (!d) return; const subs = rcCouper(r.A, r.B, g); if (subs[0] === g) return;
      const mk = (l.marquesBande || {})[cle], ancienne = mk && s.marques[mk], place = (l.places || {})[cle];
      const avecMot = subs.filter(u => u.eleve), tot = avecMot.reduce((t, u) => t + u.eleve.length, 0) || 1; let cur = place ? place.x0 : 0;
      rcLigneMaj(k, x.pid, x.id, L => {
        const D = Object.assign({}, L.decisions); delete D[cle]; subs.forEach(u => { if (!D[rcCle(u)]) D[rcCle(u)] = d; }); L.decisions = D;
        if (L.marquesBande && L.marquesBande[cle]) { const M = Object.assign({}, L.marquesBande); delete M[cle]; L.marquesBande = M; }
        if (L.places && L.places[cle]) { const P = Object.assign({}, L.places); delete P[cle]; L.places = P; }
      });
      if (place) { avecMot.forEach(u => { const w = (place.x1 - place.x0) * u.eleve.length / tot, c = rcCle(u); rcLigneMaj(k, x.pid, x.id, L => { L.places = Object.assign({}, L.places, { [c]: { x0: cur, x1: cur + w } }); }); cur += w; }); }
      if (ancienne) { delete s.marques[mk];
        subs.forEach(u => { const c = rcCle(u), a = { k, pid: x.pid, id: x.id, l, g: u, cle: c }, q = rcPlaceSeg(a);
          const m = { page: x.pid, forme: "faute", sens: "lieu", passe: "langue", point: "orthographe", q: null, x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, bonne: u.corrige || null, bande: { ligne: x.id, cle: c, eleve: u.eleve, corrige: u.corrige, type: q.type.nom, code: rcCodeFaute(u) } };
          m.id = scId("marque"); m.eleve = k; m.creeLe = m.modifieLe = new Date().toISOString(); s.marques[m.id] = m;
          rcLigneMaj(k, x.pid, x.id, L => { L.marquesBande = Object.assign({}, L.marquesBande, { [c]: m.id }); }); }); }
      n++; });
  });
  if (n) { scNumeroter(k); saveState(); }
  return n;
}
function rcEtatIA() {
  if (!RC.ui || !RC.copie) return; const L = rcLignesEcrites(RC.copie), e = RC.ui.querySelector("#rcIAEtat"); if (!e) return;
  const avec = L.filter(x => typeof x.l.corrige === "string"); if (!avec.length) { if (!/^Exporté/.test(e.textContent)) e.textContent = ""; return; }
  const f = avec.reduce((s, x) => s + rcEcarts(x.l.texte, x.l.corrige).fautes, 0), change = avec.filter(x => x.l.texte !== x.l.corrigeDe).length, sans = L.length - avec.length;
  e.textContent = "Corrigé de l’IA : " + f + " faute" + (f > 1 ? "s" : "") + " proposée" + (f > 1 ? "s" : "") + (change ? " · " + change + " ligne" + (change > 1 ? "s" : "") + " changée" + (change > 1 ? "s" : "") + " depuis" : "") + (sans ? " · " + sans + " sans corrigé" : "");
}
/* 1.4.1 (C14, Paul 31/10 : 181, 183, 186, 187) : la bande des fautes. Elle s'arrête à chaque faute proposée par le corrigé de l'IA.
   Entrée ou Espace : oui, c'est une faute (une marque de la langue, avec sa bonne forme) ; N : non ; Retour : l'arrêt d'avant ; Échap : la recopie.
   Les marques d'avant (méthode d'hier) sont mises de côté, gardées, à l'entrée dans la bande, sur ton geste. */
/* 1.4.2 (Paul 11:01, « le repérage est absurde ») : les poignées vont de la marge au bord, l'écriture non ; la place d'un mot se calcule
   entre le premier et le dernier trait d'encre de la ligne (ni la marge rouge, ni le quadrillage) */
function rcPasDoc(d) { const ys = rcListe(d.ordre).filter(id => d.lignes[id]).map(id => (d.lignes[id].y0 + d.lignes[id].y1) / 2).sort((a, b) => a - b), e = []; for (let i = 1; i < ys.length; i++) if (ys[i] - ys[i - 1] > 0.005) e.push(ys[i] - ys[i - 1]); return e.length ? e.sort((a, b) => a - b)[e.length >> 1] : 0.03; }
function rcEncre(pid, L, d) {
  const im = SC.imgs[pid]; if (!im || !im.el.complete || !im.el.naturalWidth) return null;
  RC.encre = RC.encre || {}; const cle = pid + "|" + [L.x0, L.x1, L.y0, L.y1].map(v => (+v).toFixed(4)).join(","); if (RC.encre[cle] !== undefined) return RC.encre[cle];
  const pas = rcPasDoc(d || { ordre: [], lignes: {} }), x0 = Math.max(0, Math.floor(L.x0 * im.w)), x1 = Math.min(im.w, Math.ceil(L.x1 * im.w));
  const y0 = Math.max(0, Math.floor((Math.min(L.y0, L.y1) - 0.75 * pas) * im.h)), y1 = Math.min(im.h, Math.ceil((Math.max(L.y0, L.y1) + 0.25 * pas) * im.h)), w = x1 - x0, h = y1 - y0;
  /* le début, la fin et les blancs se cherchent dans la bande du corps des lettres (sans les jambages des lignes voisines) ; le haut et le bas d'un mot, dans toute la hauteur */
  const ya = Math.max(0, Math.floor((Math.min(L.y0, L.y1) - 0.45 * pas) * im.h) - y0), yb = Math.min(h, Math.ceil((Math.max(L.y0, L.y1) + 0.12 * pas) * im.h) - y0);
  if (w < 10 || h < 4) return (RC.encre[cle] = null);
  const cv = RC.cvEncre || (RC.cvEncre = document.createElement("canvas")); cv.width = w; cv.height = h; const c = cv.getContext("2d"); c.drawImage(im.el, x0, y0, w, h, 0, 0, w, h);
  const px = c.getImageData(0, 0, w, h).data, lum = []; for (let i = 0; i < w * h; i += 7) { const j = i * 4; lum.push(px[j] + px[j + 1] + px[j + 2]); } lum.sort((a, b) => a - b); const papier = lum[Math.floor(lum.length * 0.75)] || 600;
  const col = new Array(w).fill(0), haut = new Array(w).fill(h), bas = new Array(w).fill(-1); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const j = (y * w + x) * 4, r = px[j], g = px[j + 1], b = px[j + 2]; const l = r + g + b; if ((b - r > 12 && l < papier * 0.8) || l < papier * 0.35) { if (y >= ya && y < yb) col[x]++; if (y < haut[x]) haut[x] = y; if (y > bas[x]) bas[x] = y; } }   // 1.4.3 : l'encre est bleue (ou très sombre) ; le quadrillage et les ombres, non
  const seuil = Math.max(2, Math.round((yb - ya) * 0.05)), runs = []; for (let x = 0; x < w; x++) if (col[x] >= seuil) { const a = x; while (x < w && col[x] >= seuil) x++; if (x - a >= 2) runs.push([a, x]); }
  if (!runs.length) return (RC.encre[cle] = null);
  const r = [(x0 + runs[0][0]) / im.w, (x0 + runs[runs.length - 1][1]) / im.w];
  r.traits = runs.map(([a, b]) => [(x0 + a) / im.w, (x0 + b) / im.w]);
  const plage = (u0, u1, f, depart) => { let v = depart; for (let x = Math.max(0, Math.floor(u0 * im.w) - x0); x < Math.min(w, Math.ceil(u1 * im.w) - x0); x++) if (col[x] >= seuil) v = f(v, x); return v; };
  r.haut = (u0, u1) => { const v = plage(u0, u1, (m, x) => Math.min(m, haut[x]), h); return v < h ? (y0 + v) / im.h : null; };
  r.bas = (u0, u1) => { const v = plage(u0, u1, (m, x) => Math.max(m, bas[x]), -1); return v >= 0 ? (y0 + v) / im.h : null; };
  return (RC.encre[cle] = r);
}
function rcPlaceSeg(a) {
  const L = a.l, d = RC.copie === a.k && RC.documents[a.pid] || ((scCopie(a.k).recopie || {}).pages || {})[a.pid], P = rcPosMots(L.texte), len = Math.max(1, L.texte.length);
  const c0 = a.g.a > a.g.de ? P[a.g.de][0] : (P[a.g.de] ? P[a.g.de][0] : len), c1 = a.g.a > a.g.de ? P[a.g.a - 1][1] : c0;
  /* 1.4.3 : chaque lettre compte pour sa largeur habituelle (i, l, t, ponctuation étroits ; m, w, majuscules larges ; l'espace un peu plus) */
  const poids = ch => ch === " " ? 1.3 : "iljtf.,;:'’!|ïî-".includes(ch) ? 0.55 : "mwMW".includes(ch) ? 1.45 : ch !== ch.toLowerCase() ? 1.25 : 1, cum = [0];
  for (const ch of L.texte) cum.push(cum[cum.length - 1] + poids(ch)); const T = cum[cum.length - 1] || 1;
  const e = rcEncre(a.pid, L, d) || [L.x0, L.x1], u = c => e[0] + (e[1] - e[0]) * cum[Math.min(c, cum.length - 1)] / T, yv = x => L.y0 + (L.y1 - L.y0) * (x - L.x0) / ((L.x1 - L.x0) || 1);
  /* 1.4.3 (Paul 11:25, acquis 12:15) : un mot ou une ponctuation qui manque ne tombe jamais sur un mot : un ∧ dans le blanc ; une ponctuation fausse, un petit cadre */
  const type = rcTypeFaute(a.g); let x0, x1;
  if (type.manque) { let gx = u(a.g.de > 0 && P[a.g.de - 1] ? P[a.g.de - 1][1] : 0);
    /* seuls les blancs entre deux mots comptent : ils sont parmi les plus larges ; on en garde autant qu'il y a de mots moins un, et ceux qui leur ressemblent */
    const tr = e.traits || [], blancs = []; for (let i = 0; i + 1 < tr.length; i++) blancs.push({ m: (tr[i][1] + tr[i + 1][0]) / 2, l: tr[i + 1][0] - tr[i][1] });
    const nMots = L.texte.trim().split(/\s+/).length, tri = blancs.map(b => b.l).sort((p, q) => q - p), seuil = tri.length ? 0.6 * tri[Math.min(tri.length - 1, Math.max(0, nMots - 2))] : 0;
    let best = null; blancs.filter(b => b.l >= seuil).forEach(b => { if (best === null || Math.abs(b.m - gx) < Math.abs(best - gx)) best = b.m; });
    if (best !== null && Math.abs(best - gx) < 0.06) gx = best; x0 = gx - 0.004; x1 = gx + 0.004; }
  else { x0 = u(c0); x1 = Math.max(u(c1), x0 + (type.ponct ? 0.006 : 0.012)); }
  const ici = L.places && L.places[a.cle]; if (ici) { x0 = ici.x0; x1 = ici.x1; }
  const hh = e.haut && e.haut(x0 - (type.manque ? 0.015 : 0), x1 + (type.manque ? 0.015 : 0)), bb = e.bas && e.bas(x0 - (type.manque ? 0.015 : 0), x1 + (type.manque ? 0.015 : 0));
  return { x0, x1, y0: hh != null ? hh - 0.003 : yv(x0) - 0.012, y1: bb != null ? bb + 0.003 : yv(x1) + 0.004, encre: e, type };
}
function rcReplacerBande(k) {
  const s = scCopie(k); let n = 0; rcArrets(k).forEach(a => { const id = a.l.marquesBande && a.l.marquesBande[a.cle], m = id && s.marques[id]; if (!m) return; const q = rcPlaceSeg(a);
    if (Math.abs(m.x0 - q.x0) > 0.002 || Math.abs(m.x1 - q.x1) > 0.002) { Object.assign(m, { x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, modifieLe: new Date().toISOString() }); n++; } });
  if (n) { scNumeroter(k); saveState(); }
}
function rcEstPonct(t) { return !!t && /^[\s.,;:!?…()«»"'’\-–—]+$/.test(t); }
function rcTypeFaute(g) { const pe = rcEstPonct(g.eleve), pc = rcEstPonct(g.corrige);
  if (!g.eleve) return { manque: true, ponct: pc, nom: pc ? "Ponctuation manquante" : "Mot manquant" };
  if (!g.corrige) return { ponct: pe, nom: pe ? "Ponctuation en trop" : "Mot en trop" };
  return { ponct: pe && pc, nom: pe && pc ? "Ponctuation fausse" : "Mot faux" }; }
/* [C14 1.4.4] la couleur de la faute = le code de la dictée (TYPE_STYLE de correction_dictee.html l. 311, copié tel quel) */
const RC_TYPES = { G: { couleur: "#c53030", fond: "#fee2e2", libelle: "Grammaire" }, M: { couleur: "#975a16", fond: "#fef3c7", libelle: "Mot manquant" }, I: { couleur: "#7c3aed", fond: "#ede9fe", libelle: "Illisible" },
  L: { couleur: "#2b6cb0", fond: "#dbeafe", libelle: "Lexique" }, C: { couleur: "#0369a1", fond: "#f0f9ff", libelle: "Accent, majuscule ou trait d’union" }, P: { couleur: "#b83280", fond: "#fce7f3", libelle: "Ponctuation" },
  E: { couleur: "#0d9488", fond: "#ccfbf1", libelle: "Élision" }, X: { couleur: "#1f2937", fond: "#e5e7eb", libelle: "Mot en trop" }, A: { couleur: "#eab308", fond: "#fef9c3", texte: "#854d0e", libelle: "Attention graphie" } };
function rcRgba(c, a) { return "rgba(" + parseInt(c.slice(1, 3), 16) + "," + parseInt(c.slice(3, 5), 16) + "," + parseInt(c.slice(5, 7), 16) + "," + a + ")"; }
const RC_ELISION = /(^|\s)(l|d|j|m|n|s|t|c|qu|jusqu|lorsqu|puisqu|quoiqu)'/i;
/* les mots de la ligne sont coupés aux apostrophes et aux traits d’union (rcTokenize) : on les recolle avant de classer (« m ’ a » → « m'a ») */
function rcRecoller(t) { return String(t || "").trim().replace(/\s*['’]\s*/g, "'").replace(/\s*-\s*/g, "-"); }
/* comme la dictée : apostrophe seule → E, trait d’union seul → C, signe → P, mot manquant → M, mot en trop → X ; un mot faux → G si le moteur de la dictée
   y voit de la grammaire (homophone, conjugaison, accord), E si c’est l’élision, C si seuls accents, majuscule ou trait d’union diffèrent, sinon L */
function rcCodeFaute(g) {
  const e = rcRecoller(g.eleve), c = rcRecoller(g.corrige), apo = t => RC_ELISION.test(t);
  if (e === "'" || c === "'") return "E";
  if (e === "-" || c === "-") return "C";
  if (rcTypeFaute(g).ponct) return "P";
  if (!e) return "M"; if (!c) return "X";
  const E = e.split(/\s+/), K = c.split(/\s+/), paires = E.length === K.length ? E.map((x, i) => [x, K[i]]).filter(p => p[0] !== p[1]) : [[e, c]];
  if (paires.some(p => { const r = GRAMM.classify(p[0], p[1]); return r && r.code.charAt(0) === "G"; })) return "G";
  if (apo(e) !== apo(c)) return "E";
  return paires.length && paires.every(p => reclassableEnC(p[0], p[1])) ? "C" : "L";
}
function rcStyleFaute(g) { return RC_TYPES[rcCodeFaute(g)]; }
function rcPosMots(t) { const T = rcTokenize(t || ""), P = []; let i = 0; T.forEach(w => { const j = t.indexOf(w, i); P.push([j, j + w.length]); i = j + w.length; }); return P; }
function rcArrets(k) {
  const A = []; rcLignesEcrites(k).forEach((x, i) => { const l = x.l; if (typeof l.corrige !== "string" || l.texte !== l.corrigeDe) return;
    rcEcarts(l.texte, l.corrige).segs.forEach(g => A.push({ k, pid: x.pid, id: x.id, n: i + 1, g, cle: g.de + "-" + g.a + "/" + g.de2 + "-" + g.a2, l })); });
  return A;
}
function rcLigneMaj(k, pid, id, fn) { const pgs = (scCopie(k).recopie || {}).pages || {}; [pgs[pid] && pgs[pid].lignes[id], RC.copie === k && RC.documents[pid] && RC.documents[pid].lignes[id]].forEach(l => { if (l) fn(l); }); }
function rcNoteTexte(k) { const r = scNote(k); return r.ok ? (Math.round(r.n * 10) / 10) + " / " + r.tot : "incomplète"; }
function rcBandeOuvrir() {
  if (RC.page) rcGarder(); const k = RC.copie; rcSeparerAnciens(k); const A = rcArrets(k);
  if (!A.length) { toast("Pas de faute proposée sur cette copie : charge d’abord le corrigé de l’IA."); return; }
  RC.bd = { k, i: 0, A }; rcBandeSouris(); RC.ui.classList.add("rc-mode-bande"); RC.ui.querySelector("#rcBandeOuvrir").textContent = "■ Fermer la bande";
  RC.ui.querySelector("#rcBandeTitre").textContent = "La bande de " + nomEleveDe(k); if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  rcReplacerBande(k);
  const s = scCopie(k), anc = Object.values(s.marques).filter(m => m.forme === "faute" && !m.bande).length, av = RC.ui.querySelector("#rcBandeAvis");
  if (anc && !s.bandeDebut) {
    RC.bd.attente = true; av.hidden = false;
    av.innerHTML = "<b>Cette copie a " + anc + " faute" + (anc > 1 ? "s" : "") + " marquée" + (anc > 1 ? "s" : "") + " avec la méthode d’avant.</b> En passant la bande, elles sont mises de côté : gardées, cachées, elles ne comptent plus. Note avant : <b>" + escapeHtml(rcNoteTexte(k)) + "</b>. <button id=\"rcBandeCommencer\" class=\"sc-btn\" title=\"Mettre de côté les fautes d’avant et commencer la bande (Entrée)\">Commencer la bande</button>";
    av.querySelector("#rcBandeCommencer").onclick = rcBandeCommencer;
  } else { av.hidden = true; if (!s.bandeDebut) rcBandeCommencer(); }
  const i = A.findIndex(a => !(a.l.decisions && a.l.decisions[a.cle])); RC.bd.i = i >= 0 ? i : 0; rcBandeRendre();
}
function rcBandeCommencer() {
  const k = RC.bd.k, s = scCopie(k); s.bandeDebut = s.bandeDebut || { le: new Date().toISOString(), noteAvant: rcNoteTexte(k) };
  s.marquesAnciennes = s.marquesAnciennes || {};
  Object.values(s.marques).filter(m => m.forme === "faute" && !m.bande).forEach(m => { s.marquesAnciennes[m.id] = m; delete s.marques[m.id]; });
  scNumeroter(k); saveState(); RC.bd.attente = false; RC.ui.querySelector("#rcBandeAvis").hidden = true; rcBandeRendre();
}
function rcBandeFermer(seul) { RC.bd = null; if (RC.ui) { RC.ui.classList.remove("rc-mode-bande"); const b = RC.ui.querySelector("#rcBandeOuvrir"); if (b) b.textContent = "▶ La bande"; } if (seul) return; rcActualiser(); rcSelectionner(RC.ligne, true, true); }
function rcBandeDecider(v) {
  const B = RC.bd, a = B.A[B.i]; if (!a) return; const s = scCopie(B.k), deja = a.l.marquesBande && a.l.marquesBande[a.cle];
  if (v === "o" && !(deja && s.marques[deja])) {
    const q = rcPlaceSeg(a);
    const m = { page: a.pid, forme: "faute", sens: "lieu", passe: "langue", point: "orthographe", q: null, x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, bonne: a.g.corrige || null, bande: { ligne: a.id, cle: a.cle, eleve: a.g.eleve, corrige: a.g.corrige, type: q.type.nom, code: rcCodeFaute(a.g) } };
    scPoser(m); rcLigneMaj(B.k, a.pid, a.id, l => { l.marquesBande = Object.assign({}, l.marquesBande, { [a.cle]: m.id }); });
  }
  if (v === "n" && deja && s.marques[deja]) scEffacer(deja);
  rcLigneMaj(B.k, a.pid, a.id, l => { l.decisions = Object.assign({}, l.decisions, { [a.cle]: v }); if (v === "n" && l.marquesBande) { l.marquesBande = Object.assign({}, l.marquesBande); delete l.marquesBande[a.cle]; } });
  saveState(); B.i = Math.min(B.A.length, B.i + 1); B.note = ""; rcBandeRendre();
}
function rcBandeRendre() {
  const B = RC.bd, e = RC.ui; if (!B) return; const a = B.A[B.i], s = scCopie(B.k);
  const liste = e.querySelector("#rcBandeListe");
  liste.innerHTML = B.A.map((x, i) => { const d = x.l.decisions && x.l.decisions[x.cle]; return '<li class="' + (i === B.i ? "on" : "") + '" data-i="' + i + '" style="border-left-color:' + rcStyleFaute(x.g).couleur + (i === B.i ? ";background:" + rcStyleFaute(x.g).fond : "") + '"><span>' + escapeHtml(x.g.eleve || "∅") + " → " + escapeHtml(x.g.corrige || "∅") + '</span><small>ligne ' + x.n + (d === "o" ? " ✓" : d === "n" ? " ✗" : "") + "</small></li>"; }).join("");
  liste.querySelectorAll("li").forEach(li => li.onclick = () => { B.i = +li.dataset.i; rcBandeRendre(); });
  const on = liste.querySelector("li.on"); if (on) on.scrollIntoView({ block: "nearest" });
  const ctx = e.querySelector("#rcBandeContexte"), carte = e.querySelector("#rcBandeCarte"), touches = e.querySelector("#rcBandeTouches");
  carte.style.borderColor = a && !B.attente ? rcStyleFaute(a.g).couleur : "";
  if (B.attente) { carte.innerHTML = ""; ctx.innerHTML = ""; touches.innerHTML = ""; rcBandePhoto(null); return; }
  if (!a) {
    const faites = B.A.filter(x => x.l.decisions && x.l.decisions[x.cle] === "o").length;
    carte.innerHTML = '<div class="rc-bande-mot">Bande finie</div><div class="rc-bande-pied">' + faites + " faute" + (faites > 1 ? "s" : "") + " gardée" + (faites > 1 ? "s" : "") + " sur " + B.A.length + " arrêts · note avant : " + escapeHtml((s.bandeDebut && s.bandeDebut.noteAvant) || "—") + " · note maintenant : " + escapeHtml(rcNoteTexte(B.k)) + "</div>";
    ctx.innerHTML = ""; touches.innerHTML = "<span><kbd>Retour</kbd> l’arrêt d’avant</span><span><kbd>Ctrl</kbd> + <kbd>Z</kbd> : remettre une faute</span><span><kbd>Échap</kbd> revenir à la recopie</span>" + (B.note ? '<em class="rc-bande-note">' + escapeHtml(B.note) + "</em>" : ""); rcBandePhoto(null); return;
  }
  const P = rcPosMots(a.l.texte), d = a.l.decisions && a.l.decisions[a.cle], T = rcStyleFaute(a.g), st = ' style="background:' + T.fond + ";color:" + (T.texte || T.couleur) + ";box-shadow:inset 0 -2px 0 " + T.couleur + '"';
  let h = "", c = 0; P.forEach((p, i) => { h += escapeHtml(a.l.texte.slice(c, p[0])); const w = escapeHtml(a.l.texte.slice(p[0], p[1])); h += i >= a.g.de && i < a.g.a ? "<mark" + st + ">" + w + "</mark>" : '<span class="rc-mot" data-m="' + i + '">' + w + "</span>"; if (a.g.a === a.g.de && i === a.g.de - 1) h += ' <mark class="rc-manque"' + st + ">∧</mark>"; c = p[1]; });
  h += escapeHtml(a.l.texte.slice(c)); if (a.g.a === a.g.de && a.g.de === 0) h = '<mark class="rc-manque"' + st + ">∧</mark> " + h;
  ctx.innerHTML = '<span class="rc-bande-n">ligne ' + a.n + "</span> " + h;
  carte.innerHTML = '<div class="rc-bande-mot"><span class="rc-eleve">' + escapeHtml(a.g.eleve || "(mot manquant)") + '</span> <span class="rc-fleche">→</span> <span class="rc-corr">' + escapeHtml(a.g.corrige || "(mot en trop)") + "</span></div><div class=\"rc-bande-pied\"><b class=\"rc-bande-type\" style=\"background:" + T.fond + ";color:" + (T.texte || T.couleur) + ";border-color:" + T.couleur + "\">" + T.libelle + "</b> " + (rcTypeFaute(a.g).nom === T.libelle ? "" : rcTypeFaute(a.g).nom + " · ") + "proposé par l’IA · ligne " + a.n + " · arrêt " + (B.i + 1) + " sur " + B.A.length + (d === "o" ? " · gardée" : d === "n" ? " · refusée" : "") + "</div>";
  touches.innerHTML = "<span><kbd>Entrée</kbd> ou <kbd>Espace</kbd> oui, c’est une faute</span><span><kbd>N</kbd> non</span><span><kbd>Retour</kbd> l’arrêt d’avant</span><span>glisser le cadre, ou <kbd>←</kbd> <kbd>→</kbd> : viser</span><span><kbd>clic droit</kbd> sur le cadre : faute de ma recopie</span><span><kbd>Ctrl</kbd> + <kbd>Z</kbd> : la remettre</span><span><kbd>Échap</kbd> revenir à la recopie</span>" + (B.note ? '<em class="rc-bande-note">' + escapeHtml(B.note) + "</em>" : "");
  rcBandePhoto(a);
}
function rcBandePhoto(a) {
  const cv = RC.ui.querySelector("#rcBandePhoto"), w = Math.max(300, Math.round(cv.clientWidth || 800)), h = 110; if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  const x = cv.getContext("2d"); x.fillStyle = "#fffdf8"; x.fillRect(0, 0, w, h); if (!a) return;
  const im = SC.imgs[a.pid], L = a.l; if (!im || !im.el.complete || !im.el.naturalWidth) return;
  const marge = 0.022, sx = Math.max(0, L.x0 - 0.01) * im.w, sy = Math.max(0, Math.min(L.y0, L.y1) - marge) * im.h, sw = Math.min(im.w - sx, (L.x1 - L.x0 + 0.02) * im.w), sh = Math.min(im.h - sy, (Math.abs(L.y1 - L.y0) + marge * 1.5) * im.h);
  const k = Math.min(w / sw, h / sh), dx = (w - sw * k) / 2, dy = (h - sh * k) / 2; x.drawImage(im.el, sx, sy, sw, sh, dx, dy, sw * k, sh * k);
  const q = rcPlaceSeg(a), X = u => dx + (u * im.w - sx) * k, Y = v => dy + (v * im.h - sy) * k, a0 = X(q.x0), a1 = Math.max(X(q.x1), a0 + 6), b0 = Math.max(2, Y(q.y0)), b1 = Math.min(h - 2, Math.max(Y(q.y1), b0 + 10));
  const cd = rcCodeFaute(a.g), T = RC_TYPES[cd];
  x.fillStyle = rcRgba(T.couleur, .22); x.strokeStyle = T.couleur; x.lineWidth = 2; x.fillRect(a0 - 3, b0 - 3, a1 - a0 + 6, b1 - b0 + 6); x.strokeRect(a0 - 3, b0 - 3, a1 - a0 + 6, b1 - b0 + 6);
  if (q.type.manque) { const m = (a0 + a1) / 2; x.strokeStyle = T.couleur; x.lineWidth = 3; x.beginPath(); x.moveTo(m - 9, b1 + 1); x.lineTo(m, b0 + 4); x.lineTo(m + 9, b1 + 1); x.stroke(); }
  RC.bd.boite = { a0: a0 - 6, a1: a1 + 6, par: 1 / (k * im.w), q, code: cd, bord: a0 - 3, ym: (b0 + b1) / 2 };
}
function rcBandeGlisser(du) {
  const B = RC.bd, a = B && B.A[B.i]; if (!a || B.attente) return; const q = B.boite ? B.boite.q : rcPlaceSeg(a), x0 = rcBorne(q.x0 + du, 0, 0.99), x1 = rcBorne(q.x1 + du, 0.01, 1);
  rcLigneMaj(B.k, a.pid, a.id, l => { l.places = Object.assign({}, l.places, { [a.cle]: { x0, x1 } }); });
  const mk = a.l.marquesBande && a.l.marquesBande[a.cle], m = mk && scCopie(B.k).marques[mk]; if (m) { const r = rcPlaceSeg(a); Object.assign(m, { x0: r.x0, x1: r.x1, y0: r.y0, y1: r.y1, modifieLe: new Date().toISOString() }); }
  rcBandePhoto(a);
}
function rcBandeSouris() {
  const cv = RC.ui.querySelector("#rcBandePhoto"); if (cv.dataset.branche) return; cv.dataset.branche = "1";
  const dedans = ev => { const b = RC.bd && RC.bd.boite, r = cv.getBoundingClientRect(), x = (ev.clientX - r.left) * cv.width / r.width; return b && x >= b.a0 && x <= b.a1 ? x : null; };
  cv.addEventListener("pointerdown", ev => { if (ev.button !== 0 || !RC.bd || dedans(ev) === null) return; ev.preventDefault(); cv.setPointerCapture(ev.pointerId); RC.bd.tire = { x: ev.clientX }; });
  cv.addEventListener("pointermove", ev => { const t = RC.bd && RC.bd.tire; if (!t) return; const r = cv.getBoundingClientRect(), dpx = (ev.clientX - t.x) * cv.width / r.width; t.x = ev.clientX; rcBandeGlisser(dpx * RC.bd.boite.par); });
  const fin = () => { if (RC.bd && RC.bd.tire) { RC.bd.tire = null; saveState(); } }; cv.addEventListener("pointerup", fin); cv.addEventListener("pointercancel", fin);
  cv.addEventListener("contextmenu", ev => { if (!RC.bd || RC.bd.attente) return; ev.preventDefault(); if (dedans(ev) !== null) rcBandeRecopie(); });
}
/* 1.4.3 (Paul 12:15) : clic droit sur le cadre = une faute de ta recopie ; la ligne prend la forme du corrigé à cet endroit et la faute disparaît ; Ctrl + Z la remet */
function rcBandeRecopie() {
  const B = RC.bd, a = B.A[B.i]; if (!a) return; const L = a.l, t = L.texte, P = rcPosMots(t), Q = rcPosMots(L.corrige), g = a.g;
  const sub = g.a2 > g.de2 ? L.corrige.slice(Q[g.de2][0], Q[g.a2 - 1][1]) : ""; let n;
  if (g.a > g.de) { let c0 = P[g.de][0], c1 = P[g.a - 1][1]; if (sub) n = t.slice(0, c0) + sub + t.slice(c1); else { if (t[c1] === " ") c1++; else if (c0 > 0 && t[c0 - 1] === " ") c0--; n = t.slice(0, c0) + t.slice(c1); } }
  else { const pos = g.de > 0 ? P[g.de - 1][1] : 0, colle = /^[.,;:!?…)»]/.test(sub); n = pos === 0 ? sub + " " + t : t.slice(0, pos) + (colle ? "" : " ") + sub + t.slice(pos); }
  const sig = segs => { const c = {}; return segs.map(x => { const b = x.eleve + "→" + x.corrige; c[b] = (c[b] || 0) + 1; return b + "#" + c[b]; }); }, cle = x => x.de + "-" + x.a + "/" + x.de2 + "-" + x.a2;
  const anc = rcEcarts(t, L.corrige).segs, nouv = rcEcarts(n, L.corrige).segs, sA = sig(anc), sN = sig(nouv), map = {};
  sA.forEach((v, i) => { const j = sN.indexOf(v); if (j >= 0 && cle(anc[i]) !== a.cle) map[cle(anc[i])] = cle(nouv[j]); });
  const avant = { texte: t, corrigeDe: L.corrigeDe, decisions: JSON.parse(JSON.stringify(L.decisions || {})), marquesBande: JSON.parse(JSON.stringify(L.marquesBande || {})), places: JSON.parse(JSON.stringify(L.places || {})) };
  const s = scCopie(B.k), mk = L.marquesBande && L.marquesBande[a.cle], retiree = mk && s.marques[mk] ? JSON.parse(JSON.stringify(s.marques[mk])) : null; if (retiree) scEffacer(mk);
  const re = o => { const r = {}; Object.keys(o || {}).forEach(x => { if (map[x]) r[map[x]] = o[x]; }); return r; };
  rcLigneMaj(B.k, a.pid, a.id, l => { l.texte = n; l.corrigeDe = n; l.decisions = re(avant.decisions); l.marquesBande = re(avant.marquesBande); l.places = re(avant.places); l.recopieCorrigee = (l.recopieCorrigee || 0) + 1; });
  (B.annule = B.annule || []).push({ k: B.k, pid: a.pid, id: a.id, avant, retiree, i: B.i });
  saveState(); B.A = rcArrets(B.k); B.i = Math.min(B.i, B.A.length); B.note = "Faute de recopie : « " + (g.eleve || "∅") + " » devient « " + (sub || "∅") + " ». Ctrl + Z pour la remettre."; rcBandeRendre();
}
function rcBandeRemettre() {
  const B = RC.bd, u = B && B.annule && B.annule.pop(); if (!u) { toast("Rien à remettre."); return; }
  rcLigneMaj(u.k, u.pid, u.id, l => Object.assign(l, JSON.parse(JSON.stringify(u.avant))));
  if (u.retiree) { const s = scCopie(u.k); s.marques[u.retiree.id] = u.retiree; scNumeroter(u.k); }
  saveState(); B.A = rcArrets(B.k); B.i = Math.min(u.i, B.A.length); B.note = "Faute remise."; rcBandeRendre();
}
function rcBandeClavier(ev) {
  const B = RC.bd; ev.stopPropagation();
  if (ev.key === "Escape") { ev.preventDefault(); rcBandeFermer(); return true; }
  if (B.attente) { if (ev.key === "Enter") { ev.preventDefault(); rcBandeCommencer(); } return true; }
  if ((ev.key === "Enter" || ev.key === " ") && !ev.ctrlKey && !ev.metaKey) { ev.preventDefault(); rcBandeDecider("o"); return true; }
  if ((ev.key === "n" || ev.key === "N") && !ev.ctrlKey && !ev.metaKey) { ev.preventDefault(); rcBandeDecider("n"); return true; }
  if (ev.key === "Backspace") { ev.preventDefault(); B.i = Math.max(0, B.i - 1); B.note = ""; rcBandeRendre(); return true; }
  if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") { ev.preventDefault(); rcBandeGlisser(ev.key === "ArrowLeft" ? -0.004 : 0.004); saveState(); return true; }
  if ((ev.ctrlKey || ev.metaKey) && (ev.key === "z" || ev.key === "Z")) { ev.preventDefault(); rcBandeRemettre(); return true; }
  return true;
}
function rcClavier(ev) {
  if (!RC.ouvert) return false;
  if (ev.isComposing) return true;
  const input = ev.target && ev.target.classList && ev.target.classList.contains("rc-saisie");
  if (RC.bd) return rcBandeClavier(ev);
  if (RC.iaOuvert) { if (ev.key === "Escape") { ev.preventDefault(); rcIAFermer(); } ev.stopPropagation(); return true; }
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

/* ═══ [C14 1.4.4] RECYCLÉ TEL QUEL de correction_dictee.html (prod, 31/10/2026) : le moteur grammatical (l. 1797-2312) et le reclassement en C (l. 1635-1642).
   Sert à donner à chaque faute de la bande le type de la dictée (G, L, C…), donc sa couleur : l’élève n’est jamais dépaysé. Rien n’y est changé. */
/* [L15h — dette 126] LE RECLASSEMENT EN C : une erreur L dont la recopie, une fois retirés les seuls accents aigu, grave, circonflexe, tréma,
   la majuscule et le trait d'union, est le mot attendu. JAMAIS : une lettre en plus, en moins ou changée ; une cédille (lexicale) ;
   un homophone grammatical (a/à, la/là, ou/où, du/dû, sur/sûr : G) ; une erreur L sans recopie. */
var HOMOPHONES_GRAMMATICAUX_L15H=["a","\u00e0","la","l\u00e0","ou","o\u00f9","du","d\u00fb","sur","s\u00fbr"];
function signesCL15h(w){return String(w||"").normalize("NFD").replace(/[\u0300\u0301\u0302\u0308]/g,"").normalize("NFC").replace(/-/g,"").toLowerCase();}
function reclassableEnC(fautif,attendu){var f=String(fautif||"").trim(),w=String(attendu||"").trim();if(!f||!w||f===w)return false;
  if(HOMOPHONES_GRAMMATICAUX_L15H.indexOf(w.toLowerCase())>=0||HOMOPHONES_GRAMMATICAUX_L15H.indexOf(f.toLowerCase())>=0)return false;
  return signesCL15h(f)===signesCL15h(w);}
var GRAMM = {};

// ─────────────────────────────────────────────────────
// 1. HOMOPHONES GRAMMATICAUX (complet cycle 3-4)
// ─────────────────────────────────────────────────────
// Chaque entrée : group, confusions {forme→code}, rule (test de substitution)

GRAMM.HOMOPHONES = {};
function _h(forms, group, rule) {
  forms.forEach(function(f) {
    var confusions = {};
    forms.forEach(function(f2) { if (f2 !== f) confusions[f2] = "G-HOM"; });
    GRAMM.HOMOPHONES[f] = {group: group, forms: forms, confusions: confusions, rule: rule};
  });
}

// a/à/as
_h(["a","à","as"], "a/à", "« a/as » = verbe avoir (→ avait/avais). « à » = préposition.");
// et/est/es/ai
_h(["et","est","es","ai"], "et/est", "« et » = conjonction (→ et puis). « est/es » = être (→ était/étais). « ai » = avoir 1re pers.");
// ou/où
_h(["ou","où"], "ou/où", "« ou » = choix (→ ou bien). « où » = lieu/temps.");
// son/sont
_h(["son","sont"], "son/sont", "« son » = possessif (→ mon). « sont » = être (→ étaient).");
// on/ont/on n'
_h(["on","ont"], "on/ont", "« on » = pronom sujet (→ il). « ont » = avoir (→ avaient).");
// ce/se/ceux
_h(["ce","se"], "ce/se", "« ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal).");
// c'est/s'est/ces/ses/sais/sait
_h(["c'est","s'est","ces","ses","sais","sait"], "c'est/s'est/ces/ses",
  "« c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait.");
// leur/leurs
_h(["leur","leurs"], "leur/leurs", "« leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel.");
// mon/m'ont
_h(["mon","m'ont"], "mon/m'ont", "« mon » = possessif (→ le mien). « m'ont » = me + ont (→ m'avaient).");
// ton/t'ont
_h(["ton","t'ont"], "ton/t'ont", "« ton » = possessif (→ le tien). « t'ont » = te + ont (→ t'avaient).");
// ma/m'a/m'as
_h(["ma","m'a","m'as"], "ma/m'a", "« ma » = possessif fém. (→ la mienne). « m'a/m'as » = me + a/as (→ m'avait/m'avais).");
// ta/t'a
_h(["ta","t'a"], "ta/t'a", "« ta » = possessif fém. (→ la tienne). « t'a » = te + a (→ t'avait).");
// mes/mais/m'est/met/mets
_h(["mes","mais","m'est","met","mets"], "mes/mais/m'est/met",
  "« mes » = possessif pl. « mais » = opposition (→ cependant). « m'est » = me+est (→ m'était). « met/mets » = verbe mettre.");
// la/là/l'a/l'as
_h(["la","là","l'a","l'as"], "la/là/l'a", "« la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait).");
// quand/quant/qu'en
_h(["quand","quant","qu'en"], "quand/quant/qu'en",
  "« quand » = temps (→ lorsque). « quant à » = en ce qui concerne. « qu'en » = que+en.");
// quel/quelle/quels/quelles/qu'elle/qu'elles
_h(["quel","quelle","quels","quelles","qu'elle","qu'elles"], "quel/qu'elle",
  "« quel(le)(s) » = interrogatif/exclamatif. « qu'elle(s) » = que+elle(s) (→ qu'il).");
// sans/s'en/sens/sent
_h(["sans","s'en","sens","sent"], "sans/s'en",
  "« sans » = préposition privation (→ avec). « s'en » = se+en (→ de cela). « sens/sent » = verbe sentir.");
// dans/d'en
_h(["dans","d'en"], "dans/d'en", "« dans » = préposition lieu/temps. « d'en » = de+en.");
// peu/peux/peut
_h(["peu","peux","peut"], "peu/peux/peut",
  "« peu » = adverbe quantité (→ pas beaucoup). « peux » = pouvoir 1re/2e (→ pouvais). « peut » = pouvoir 3e (→ pouvait).");
// ni/n'y
_h(["ni","n'y"], "ni/n'y", "« ni » = conjonction négative. « n'y » = ne+y (devant verbe).");
// si/s'y
_h(["si","s'y"], "si/s'y", "« si » = condition/intensité. « s'y » = se+y (→ il s'y rend).");
// ça/sa/çà
_h(["ça","sa"], "ça/sa", "« ça » = pronom démonstratif (→ cela). « sa » = possessif fém. (→ ma).");
// tout/tous/toute/toutes
_h(["tout","tous","toute","toutes"], "tout/tous", "« tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte.");
// prêt/près
_h(["prêt","prêts","près"], "prêt/près", "« prêt(s) » = adjectif (→ terminé). « près » = adverbe/préposition de lieu (→ à côté).");
// plus tôt/plutôt
_h(["plutôt"], "plus tôt/plutôt", "« plutôt » = de préférence. « plus tôt » = inverse de plus tard.");
// or/hors
_h(["or","hors"], "or/hors", "« or » = conjonction coordination. « hors » = préposition (→ en dehors de).");
// tant/temps/t'en
_h(["tant","temps","t'en"], "tant/temps/t'en",
  "« tant » = adverbe (→ tellement). « temps » = nom commun. « t'en » = te+en (→ m'en).");
// quoique/quoi que — traité comme paire
_h(["quoique"], "quoique/quoi que", "« quoique » = conjonction (→ bien que). « quoi que » = quelle que soit la chose.");
// du/dû
_h(["du","dû"], "du/dû", "« du » = article contracté (de le). « dû » = participe passé de devoir (accent au masc. sing.).");
// sur/sûr
_h(["sur","sûr","sûre","sûrs","sûres"], "sur/sûr",
  "« sur » = préposition. « sûr(e)(s) » = adjectif (→ certain). « sur » adj. = acide.");
// mur/mûr
_h(["mur","mûr","mûre","mûrs","mûres"], "mur/mûr", "« mur » = nom (paroi). « mûr(e)(s) » = adjectif (→ à maturité).");
// cru/crû
_h(["cru","crû"], "cru/crû", "« cru » = PP de croire / adj. (pas cuit). « crû » = PP de croître.");
// voie/voix
_h(["voie","voix"], "voie/voix", "« voie » = chemin, moyen. « voix » = son produit par les cordes vocales.");
// compte/conte/comte
_h(["compte","conte","comte"], "compte/conte/comte",
  "« compte » = calcul (→ compter). « conte » = récit (→ conter). « comte » = titre noblesse.");
// ver/vers/verre/vert
_h(["ver","vers","verre","vert"], "ver/vers/verre/vert",
  "« ver » = animal. « vers » = direction/poésie. « verre » = matière/récipient. « vert » = couleur.");
// cour/cours/court/courre
_h(["cour","cours","court"], "cour/cours/court",
  "« cour » = espace ouvert. « cours » = enseignement/écoulement. « court » = adj. bref.");
// père/paire/pair
_h(["père","paire","pair"], "père/paire/pair",
  "« père » = papa. « paire » = ensemble de deux. « pair » = nombre divisible par 2.");
// mère/maire/mer
_h(["mère","maire","mer"], "mère/maire/mer",
  "« mère » = maman. « maire » = élu municipal. « mer » = étendue d'eau salée.");
// maître/mètre/mettre
_h(["maître","mètre","mettre"], "maître/mètre/mettre",
  "« maître » = celui qui enseigne. « mètre » = unité de mesure. « mettre » = verbe (placer).");
// ancre/encre
_h(["ancre","encre"], "ancre/encre", "« ancre » = marine. « encre » = liquide pour écrire.");
// tante/tente
_h(["tante","tente"], "tante/tente", "« tante » = sœur du père/de la mère. « tente » = abri de camping.");
// salle/sale
_h(["salle","sale"], "salle/sale", "« salle » = pièce. « sale » = pas propre.");
// pain/pin/peint
_h(["pain","pin","peint"], "pain/pin/peint", "« pain » = aliment. « pin » = arbre. « peint » = PP de peindre.");
// sang/cent/sans/sent
_h(["sang","cent","sans","sent"], "sang/cent/sans/sent",
  "« sang » = liquide rouge. « cent » = 100. « sans » = préposition privation. « sent » = verbe sentir.");
// champ/chant
_h(["champ","chant"], "champ/chant", "« champ » = terrain cultivé. « chant » = mélodie.");
// cou/coup/coût
_h(["cou","coup","coût"], "cou/coup/coût", "« cou » = partie du corps. « coup » = choc. « coût » = prix.");
// seau/sot/saut/sceau
_h(["seau","sot","saut","sceau"], "seau/sot/saut", "« seau » = récipient. « sot » = stupide. « saut » = bond. « sceau » = cachet.");
// date/datte
_h(["date","datte"], "date/datte", "« date » = jour. « datte » = fruit du palmier.");
// dessin/dessein
_h(["dessin","dessein"], "dessin/dessein", "« dessin » = tracé, image. « dessein » = intention, projet.");
// repère/repaire
_h(["repère","repaire"], "repaire/repère", "« repère » = point de référence. « repaire » = cachette.");
// pause/pose
_h(["pause","pose"], "pause/pose", "« pause » = arrêt. « pose » = installation / action de poser.");
// poids/pois/poix
_h(["poids","pois","poix"], "poids/pois", "« poids » = masse. « pois » = légume. « poix » = résine.");
// foi/foie/fois
_h(["foi","foie","fois"], "foi/foie/fois", "« foi » = croyance. « foie » = organe. « fois » = occurrence.");
// raisonner/résonner
_h(["raisonner","résonner"], "raisonner/résonner", "« raisonner » = réfléchir. « résonner » = produire un écho.");
// tâche/tache
_h(["tâche","tache"], "tâche/tache", "« tâche » = travail à faire. « tache » = marque, salissure.");
// parti/partie
_h(["parti","partie"], "parti/partie", "« parti » = choix / organisation politique. « partie » = portion / jeu.");

// ─────────────────────────────────────────────────────
// 2. TERMINAISONS VERBALES CONFONDABLES
// ─────────────────────────────────────────────────────
GRAMM.TERMINAISONS = [
  // -er / -é / -ée / -és / -ées / -ez / -ait / -ais / -aient
  {src:"er", alts:[
    {t:"é",code:"G-CONJ",rule:"Infinitif (-er) / participe passé (-é). Test : vendre/vendu."},
    {t:"ée",code:"G-PP",rule:"Infinitif (-er) / PP féminin (-ée)."},
    {t:"és",code:"G-PP",rule:"Infinitif (-er) / PP pluriel (-és)."},
    {t:"ées",code:"G-PP",rule:"Infinitif (-er) / PP fém. pluriel (-ées)."},
    {t:"ez",code:"G-CONJ",rule:"Infinitif (-er) / 2e pers. pluriel (-ez)."},
    {t:"ait",code:"G-CONJ",rule:"Infinitif (-er) / imparfait 3e sing. (-ait)."},
    {t:"ais",code:"G-CONJ",rule:"Infinitif (-er) / imparfait 1re-2e sing. (-ais)."},
    {t:"aient",code:"G-CONJ",rule:"Infinitif (-er) / imparfait 3e pl. (-aient)."}
  ]},
  {src:"é", alts:[
    {t:"er",code:"G-CONJ",rule:"PP (-é) / infinitif (-er). Test : vendu/vendre."},
    {t:"ée",code:"G-PP",rule:"Accord PP : féminin (-ée) manquant ou en trop."},
    {t:"és",code:"G-PP",rule:"Accord PP : pluriel (-és) manquant ou en trop."},
    {t:"ées",code:"G-PP",rule:"Accord PP : fém. pl. (-ées) manquant ou en trop."},
    {t:"ez",code:"G-CONJ",rule:"PP (-é) / 2e pers. pl. (-ez)."},
    {t:"ait",code:"G-CONJ",rule:"PP (-é) / imparfait (-ait)."}
  ]},
  {src:"ait", alts:[
    {t:"ais",code:"G-CONJ",rule:"Imparfait 3e (-ait) / 1re-2e pers. (-ais)."},
    {t:"er",code:"G-CONJ",rule:"Imparfait (-ait) / infinitif (-er)."},
    {t:"é",code:"G-CONJ",rule:"Imparfait (-ait) / PP (-é)."},
    {t:"aient",code:"G-ACC",rule:"Accord sujet-verbe : singulier (-ait) / pluriel (-aient)."}
  ]},
  {src:"aient", alts:[
    {t:"ait",code:"G-ACC",rule:"Accord sujet-verbe : pluriel (-aient) / singulier (-ait)."},
    {t:"er",code:"G-CONJ",rule:"Imparfait 3e pl. (-aient) / infinitif (-er)."}
  ]},
  {src:"ent", alts:[
    {t:"ant",code:"G-CONJ",rule:"3e pers. pluriel (-ent) / participe présent (-ant)."},
    {t:"e",code:"G-ACC",rule:"Accord sujet-verbe : pluriel (-ent) / singulier (-e)."}
  ]},
  // Passé simple
  {src:"èrent", alts:[
    {t:"erent",code:"L-ACC",rule:"Accent manquant sur passé simple (-èrent)."},
    {t:"ère",code:"G-ACC",rule:"Passé simple pluriel (-èrent) / singulier."}
  ]},
  {src:"ut", alts:[
    {t:"u",code:"G-CONJ",rule:"Passé simple 3e sing. (-ut) / PP (-u). Ex : il aperçut / aperçu."},
    {t:"ût",code:"L-ACC",rule:"Accent circonflexe : passé simple (-ut) ≠ subjonctif (-ût)."}
  ]},
  {src:"it", alts:[
    {t:"i",code:"G-CONJ",rule:"Passé simple 3e sing. (-it) / PP (-i). Ex : il comprit / compris."},
    {t:"is",code:"G-CONJ",rule:"Confusion terminaison passé simple (-it / -is)."},
    {t:"ît",code:"L-ACC",rule:"Accent circonflexe : passé simple (-it) ≠ subjonctif (-ît)."}
  ]},
  // Futur / conditionnel
  {src:"rai", alts:[
    {t:"rais",code:"G-CONJ",rule:"Futur 1re sing. (-rai) / conditionnel (-rais). Test : demain je… / si je…"}
  ]},
  {src:"ra", alts:[
    {t:"rait",code:"G-CONJ",rule:"Futur 3e sing. (-ra) / conditionnel (-rait)."}
  ]},
  {src:"rais", alts:[
    {t:"rai",code:"G-CONJ",rule:"Conditionnel 1re sing. (-rais) / futur (-rai). Test : si je… / demain je…"}
  ]},
  {src:"rait", alts:[
    {t:"ra",code:"G-CONJ",rule:"Conditionnel 3e sing. (-rait) / futur (-ra)."}
  ]},
  {src:"rions", alts:[
    {t:"rons",code:"G-CONJ",rule:"Conditionnel 1re pl. (-rions) / futur (-rons)."}
  ]},
  {src:"riez", alts:[
    {t:"rez",code:"G-CONJ",rule:"Conditionnel 2e pl. (-riez) / futur (-rez)."}
  ]},
  {src:"raient", alts:[
    {t:"ront",code:"G-CONJ",rule:"Conditionnel 3e pl. (-raient) / futur (-ront)."}
  ]},
    {src:"rons", alts:[
    {t:"rions",code:"G-CONJ",rule:"Futur 1re pl. (-rons) / conditionnel (-rions)."}
  ]},
  {src:"rez", alts:[
    {t:"riez",code:"G-CONJ",rule:"Futur 2e pl. (-rez) / conditionnel (-riez)."}
  ]},
  {src:"ront", alts:[
    {t:"raient",code:"G-CONJ",rule:"Futur 3e pl. (-ront) / conditionnel (-raient)."}
  ]}
];

// ─────────────────────────────────────────────────────
// 3. RÈGLES D'ACCORD
// ─────────────────────────────────────────────────────
GRAMM.ACCORDS = [
  // ── Pluriel régulier -s ──
  {name:"pl_s", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    if(cl===tl+"s")return{code:"G-ACC",rule:"Pluriel manquant : « "+c+" » prend un -s."};
    if(tl===cl+"s")return{code:"G-ACC",rule:"Marque du pluriel en trop : « "+c+" » est au singulier."};return null}},
  // ── Pluriel -x ──
  {name:"pl_x", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    if(cl===tl+"x")return{code:"G-ACC",rule:"Pluriel manquant : « "+c+" » prend un -x."};
    if(tl===cl+"x")return{code:"G-ACC",rule:"Marque du pluriel en trop : « "+c+" » est au singulier."};return null}},
  // ── Féminin -e ──
  {name:"fem_e", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    if(cl===tl+"e"&&cl.length>3)return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" »."};
    if(tl===cl+"e"&&tl.length>3)return{code:"G-ACC",rule:"Accord au féminin en trop : « "+c+" » est au masculin."};return null}},
  // ── Féminin -e + pluriel -s → -es ──
  {name:"fem_pl_es", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    if(cl===tl+"es"&&cl.length>4)return{code:"G-ACC",rule:"Accord fém. pluriel manquant : « "+c+" » → -es."};
    if(tl===cl+"es"&&tl.length>4)return{code:"G-ACC",rule:"Accord fém. pluriel en trop : « "+c+" »."};
    // singulier féminin → pluriel féminin
    if(cl===tl.replace(/e$/,"es"))return{code:"G-ACC",rule:"Pluriel manquant sur le féminin : « "+c+" » → -es."};
    if(tl===cl.replace(/es$/,"e"))return{code:"G-ACC",rule:"Pluriel en trop : « "+c+" » est au singulier féminin."};
    return null}},
  // ── Pluriel -al → -aux ──
  {name:"pl_aux", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    if(cl.match(/aux$/)&&tl===cl.replace(/aux$/,"al"))return{code:"G-ACC",rule:"Pluriel irrégulier manquant : « "+c+" » → -aux (et non -als)."};
    if(tl.match(/aux$/)&&cl===tl.replace(/aux$/,"al"))return{code:"G-ACC",rule:"Singulier attendu : « "+c+" » → -al."};
    // Erreur inverse: écrire -als au lieu de -aux
    if(cl.match(/aux$/)&&tl===cl.replace(/aux$/,"als"))return{code:"G-ACC",rule:"Pluriel irrégulier : « "+c+" » → -aux (pas -als)."};
    return null}},
  // ── Exceptions pluriel -al → -als (bals, festivals, carnavals, récitals, régals, chacals) ──
  {name:"pl_als_exception", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    var exceptions=["bals","festivals","carnavals","récitals","régals","chacals","narvals"];
    if(exceptions.indexOf(cl)>=0&&tl===cl.replace(/als$/,"aux"))return{code:"G-ACC",rule:"Exception : « "+c+" » fait -als au pluriel (pas -aux)."};
    return null}},
  // ── Pluriel -eau → -eaux ──
  {name:"pl_eaux", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    if(cl.match(/eaux$/)&&tl===cl.replace(/eaux$/,"eau"))return{code:"G-ACC",rule:"Pluriel manquant : « "+c+" » → -eaux."};
    if(tl.match(/eaux$/)&&cl===tl.replace(/eaux$/,"eau"))return{code:"G-ACC",rule:"Pluriel en trop : « "+c+" » → -eau."};return null}},
  // ── Pluriel -eu → -eux ──
  {name:"pl_eux", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    if(cl.match(/eux$/)&&tl===cl.replace(/eux$/,"eu"))return{code:"G-ACC",rule:"Pluriel manquant : « "+c+" » → -eux."};
    if(tl.match(/eux$/)&&cl===tl.replace(/eux$/,"eu"))return{code:"G-ACC",rule:"Pluriel en trop : « "+c+" » → -eu."};return null}},
  // ── Pluriel -ou → -oux (7 exceptions) ──
  {name:"pl_oux", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    var oux=["bijoux","cailloux","choux","genoux","hiboux","joujoux","poux"];
    if(oux.indexOf(cl)>=0&&tl===cl.replace(/oux$/,"ou"))return{code:"G-ACC",rule:"Pluriel irrégulier manquant : « "+c+" » → -oux (exception)."};
    if(oux.indexOf(tl)>=0&&cl===tl.replace(/oux$/,"ou"))return{code:"G-ACC",rule:"Pluriel irrégulier en trop : « "+c+" » → -ou."};
    // Erreur: écrire -ous au lieu de -oux
    if(oux.indexOf(cl)>=0&&tl===cl.replace(/oux$/,"ous"))return{code:"G-ACC",rule:"Pluriel irrégulier : « "+c+" » → -oux (pas -ous)."};
    return null}},
  // ── Pluriel -ail → -aux (exceptions: travaux, vitraux, coraux, émaux) ──
  {name:"pl_ail_aux", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    var pairs={"travaux":"travail","vitraux":"vitrail","coraux":"corail","émaux":"émail"};
    if(pairs[cl]&&tl===pairs[cl])return{code:"G-ACC",rule:"Pluriel irrégulier manquant : « "+c+" » (pluriel de "+pairs[cl]+")."};
    var inv={};Object.keys(pairs).forEach(function(k){inv[pairs[k]]=k});
    if(inv[cl]&&tl===inv[cl])return{code:"G-ACC",rule:"Singulier attendu : « "+c+" »."};
    return null}},
  // ── Participe passé : -é / -ée / -és / -ées ──
  {name:"pp_accord", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    var ppForms=[[/é$/,/ée$/,"fém."],[/é$/,/és$/,"masc.pl."],[/é$/,/ées$/,"fém.pl."],
      [/ée$/,/é$/,"masc.sing."],[/és$/,/é$/,"masc.sing."],[/ées$/,/é$/,"masc.sing."],
      [/ée$/,/és$/,"masc.pl."],[/és$/,/ée$/,"fém.sing."],[/ée$/,/ées$/,"fém.pl."],
      [/ées$/,/ée$/,"fém.sing."],[/ées$/,/és$/,"masc.pl."],[/és$/,/ées$/,"fém.pl."],
      [/i$/,/ie$/,"fém."],[/i$/,/is$/,"masc.pl."],[/i$/,/ies$/,"fém.pl."],
      [/is$/,/i$/,"masc.sing."],[/ie$/,/i$/,"masc.sing."],
      [/u$/,/ue$/,"fém."],[/u$/,/us$/,"masc.pl."],[/u$/,/ues$/,"fém.pl."],
      [/us$/,/u$/,"masc.sing."],[/ue$/,/u$/,"masc.sing."]];
    for(var i=0;i<ppForms.length;i++){
      var f=ppForms[i];
      if(f[0].test(cl)&&f[1].test(tl)){
        var base1=cl.replace(f[0],""),base2=tl.replace(f[1],"");
        if(base1===base2&&base1.length>1)return{code:"G-PP",rule:"Accord du participe passé : « "+c+" » attendu ("+f[2]+" incorrect)."};
      }
    }return null}},
  // ── Accord adjectif : détection de différences de marques de genre/nombre ──
  {name:"adj_accord", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    // -eux/-euse/-euses/-eux
    if(cl.match(/euse$/)&&tl===cl.replace(/euse$/,"eux"))return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" » (fém. de "+tl+")."};
    if(cl.match(/eux$/)&&tl===cl.replace(/eux$/,"euse"))return{code:"G-ACC",rule:"Masculin attendu : « "+c+" »."};
    // -if/-ive
    if(cl.match(/ive$/)&&tl===cl.replace(/ive$/,"if"))return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" » (fém. de "+tl+")."};
    if(cl.match(/if$/)&&tl===cl.replace(/if$/,"ive"))return{code:"G-ACC",rule:"Masculin attendu : « "+c+" »."};
    // -eux/-euses
    if(cl.match(/euses$/)&&tl===cl.replace(/euses$/,"eux"))return{code:"G-ACC",rule:"Accord fém. pluriel manquant : « "+c+" »."};
    // -el/-elle
    if(cl.match(/elle$/)&&tl===cl.replace(/elle$/,"el"))return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" » (doublement de consonne)."};
    if(cl.match(/el$/)&&tl===cl.replace(/el$/,"elle"))return{code:"G-ACC",rule:"Masculin attendu : « "+c+" »."};
    // -en/-enne
    if(cl.match(/enne$/)&&tl===cl.replace(/enne$/,"en"))return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" » (doublement de consonne)."};
    // -on/-onne
    if(cl.match(/onne$/)&&tl===cl.replace(/onne$/,"on"))return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" » (doublement de consonne)."};
    // -er/-ère
    if(cl.match(/ère$/)&&tl===cl.replace(/ère$/,"er"))return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" »."};
    if(cl.match(/er$/)&&tl===cl.replace(/er$/,"ère"))return{code:"G-ACC",rule:"Masculin attendu : « "+c+" »."};
    // -eur/-euse (adjectifs)
    if(cl.match(/euse$/)&&tl===cl.replace(/euse$/,"eur"))return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" »."};
    // -teur/-trice
    if(cl.match(/trice$/)&&tl===cl.replace(/trice$/,"teur"))return{code:"G-ACC",rule:"Accord au féminin manquant : « "+c+" »."};
    return null}},
  // ── Accord sujet-verbe : -e/-es/-ent (présent) ──
  {name:"sv_present", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    if(cl.match(/ent$/)&&tl===cl.replace(/ent$/,"e")&&cl.length>4)return{code:"G-ACC",rule:"Accord sujet-verbe : 3e pers. pluriel (-ent) attendu."};
    if(cl.match(/e$/)&&!cl.match(/ent$/)&&tl===cl+"nt"&&cl.length>3)return{code:"G-ACC",rule:"Accord sujet-verbe : singulier (-e) attendu, pas pluriel (-ent)."};
    return null}},
  // ── Couleurs invariables ──
  {name:"couleur_inv", test:function(c,t){var cl=c.toLowerCase(),tl=t.toLowerCase();
    var inv=["marron","orange","cerise","crème","turquoise","kaki","olive"];
    if(inv.indexOf(cl)>=0&&(tl===cl+"s"||tl===cl+"e"||tl===cl+"es"))
      return{code:"G-ACC",rule:"Adjectif de couleur invariable : « "+c+" » ne s'accorde pas."};
    return null}}
];

// ─────────────────────────────────────────────────────
// 4. MOTS INVARIABLES (programme cycle 3 + cycle 4)
// ─────────────────────────────────────────────────────
GRAMM.INVARIABLES = [
  // Conjonctions de coordination
  "mais","ou","et","donc","or","ni","car",
  // Conjonctions de subordination
  "que","comme","quand","lorsque","puisque","si",
  // Prépositions
  "à","dans","par","pour","en","vers","avec","de","sans","sous","sur",
  "devant","derrière","chez","entre","contre","malgré","pendant","durant",
  "depuis","avant","après","selon","hormis","parmi","sauf",
  // Adverbes de temps
  "alors","après","aujourd'hui","aussitôt","autrefois","avant",
  "bientôt","déjà","demain","depuis","désormais","enfin","ensuite",
  "hier","jadis","jamais","longtemps","maintenant","naguère",
  "parfois","puis","quelquefois","soudain","souvent","tantôt",
  "tard","tôt","toujours",
  // Adverbes de lieu
  "ailleurs","autour","dedans","dehors","dessous","dessus",
  "devant","derrière","ici","là","loin","partout","près",
  // Adverbes de manière
  "bien","mal","mieux","vite","ensemble","exprès","volontiers","vraiment",
  // Adverbes de quantité
  "assez","aussi","autant","beaucoup","combien","davantage",
  "encore","environ","guère","moins","peu","plus","presque",
  "tant","très","trop",
  // Adverbes de négation/affirmation
  "non","oui","peut-être","certes",
  // Adverbes de liaison
  "cependant","d'abord","d'ailleurs","néanmoins","pourtant",
  "plutôt","seulement","surtout","toutefois"
];

// ─────────────────────────────────────────────────────
// 5. DOUBLES CONSONNES + ORTHOGRAPHE LEXICALE
// ─────────────────────────────────────────────────────
GRAMM.DOUBLES_CONSONNES = {
  // pp
  "apparaître":"pp","appeler":"pp","apporter":"pp","appréhender":"pp",
  "approcher":"pp","apprendre":"pp","appuyer":"pp","frapper":"pp",
  "enveloppe":"pp","opposer":"pp","proposer":"pp","rappeler":"pp",
  "supplier":"pp","supplément":"pp","supposer":"pp",
  // rr
  "arrêter":"rr","arriver":"rr","arracher":"rr","courrier":"rr",
  "derrière":"rr","erreur":"rr","horrible":"rr","nourrir":"rr",
  "pierre":"rr","pourrir":"rr","terrible":"rr","terre":"rr",
  "terreur":"rr","torrent":"rr","verrou":"rr","barrière":"rr",
  "corriger":"rr","correspondre":"rr","interrompre":"rr","irrégulier":"rr",
  // tt
  "attendre":"tt","attraper":"tt","atteindre":"tt","attention":"tt",
  "battre":"tt","combattre":"tt","flatter":"tt","jeter":"tt",
  "lettre":"tt","lutter":"tt","mettre":"tt","permettre":"tt",
  "quitter":"tt","regretter":"tt","transmettre":"tt","nettoyer":"tt",
  // ll
  "balle":"ll","belle":"ll","briller":"ll","coller":"ll",
  "colline":"ll","grille":"ll","illustre":"ll","installer":"ll",
  "intelligence":"ll","mille":"ll","tranquille":"ll","village":"ll",
  "allumer":"ll","alliance":"ll","tellement":"ll","étoile":"ll",
  // mm
  "comme":"mm","commander":"mm","commencer":"mm","commerce":"mm",
  "communiquer":"mm","femme":"mm","flamme":"mm","grammaire":"mm",
  "homme":"mm","immense":"mm","immobile":"mm","mammifère":"mm",
  "nommer":"mm","programme":"mm","sommet":"mm","mammifère":"mm",
  // nn
  "année":"nn","bonne":"nn","colonne":"nn","connaître":"nn",
  "connecter":"nn","donner":"nn","étonner":"nn","innocent":"nn",
  "monnaie":"nn","personne":"nn","personnel":"nn","prisonnier":"nn",
  "raisonner":"nn","résonner":"nn","sonner":"nn","tonne":"nn",
  // ss
  "assez":"ss","assassin":"ss","baisser":"ss","blesser":"ss",
  "boisson":"ss","chasser":"ss","classe":"ss","dessiner":"ss",
  "essayer":"ss","glisser":"ss","intéresser":"ss","laisser":"ss",
  "message":"ss","mission":"ss","passer":"ss","passion":"ss",
  "posséder":"ss","poisson":"ss","pression":"ss","puissant":"ss",
  "rassurer":"ss","réussir":"ss","tousser":"ss",
  // ff
  "affaire":"ff","affiche":"ff","affreux":"ff","différent":"ff",
  "difficile":"ff","effort":"ff","effet":"ff","offrir":"ff",
  "officier":"ff","siffler":"ff","souffler":"ff","souffrir":"ff",
  "suffire":"ff",
  // cc
  "accéder":"cc","accepter":"cc","accident":"cc","accord":"cc",
  "accorder":"cc","accrocher":"cc","accueil":"cc","accueillir":"cc",
  "occasion":"cc","occuper":"cc","raccourcir":"cc","succès":"cc"
};

// ─────────────────────────────────────────────────────
// 6. FONCTIONS
// ─────────────────────────────────────────────────────

// Analyse un texte et retourne les pièges
GRAMM.analyseTexte = function(texte) {
  var mots = texte.split(/\s+/).map(function(m) {
    return m.replace(/^[.,;:!?"«»()]+/, "").replace(/[.,;:!?"«»()]+$/, "");
  }).filter(function(m) { return m.length > 0; });
  var pieges = [];
  var seen = {};
  mots.forEach(function(mot, idx) {
    var low = mot.toLowerCase();
    if (seen[low]) return;
    if (GRAMM.HOMOPHONES[low]) {
      var h = GRAMM.HOMOPHONES[low];
      pieges.push({mot:mot,index:idx,type:"homophone",group:h.group,code:"G-HOM",
        rule:h.rule,confusions:Object.keys(h.confusions)});
      seen[low] = true;
    }
    if (!seen[low]) {
      for (var ti=0;ti<GRAMM.TERMINAISONS.length;ti++) {
        var term=GRAMM.TERMINAISONS[ti];
        if (low.length > term.src.length + 1 && low.substring(low.length-term.src.length) === term.src) {
          pieges.push({mot:mot,index:idx,type:"terminaison",code:term.alts[0].code,
            rule:term.alts[0].rule,confusions:[]});
          seen[low] = true;
          break;
        }
      }
    }
    if (GRAMM.DOUBLES_CONSONNES[low] && !seen[low]) {
      pieges.push({mot:mot,index:idx,type:"orthographe",code:"L-ORT",
        rule:"Double consonne : « "+mot+" » s'écrit avec -"+GRAMM.DOUBLES_CONSONNES[low]+"-.",confusions:[]});
      seen[low] = true;
    }
    if (GRAMM.INVARIABLES.indexOf(low) >= 0 && !seen[low]) {
      pieges.push({mot:mot,index:idx,type:"invariable",code:"G-INV",
        rule:"« "+mot+" » est un mot invariable.",confusions:[]});
      seen[low] = true;
    }
  });
  return pieges;
};

// Classification enrichie d'une erreur
GRAMM.classify = function(typed, correct) {
  var tl = typed.toLowerCase(), cl = correct.toLowerCase();
  if (tl === cl) return null;
  // 1) Homophones
  var hRef = GRAMM.HOMOPHONES[cl];
  if (hRef && hRef.confusions[tl]) return {code:hRef.confusions[tl], rule:hRef.rule};
  // Aussi chercher en sens inverse
  var hTyp = GRAMM.HOMOPHONES[tl];
  if (hTyp && hTyp.confusions[cl]) return {code:"G-HOM", rule:hTyp.rule};
  // 2) Terminaisons verbales
  for (var ti=0;ti<GRAMM.TERMINAISONS.length;ti++) {
    var term = GRAMM.TERMINAISONS[ti];
    if (cl.length > term.src.length && cl.substring(cl.length-term.src.length) === term.src) {
      var base = cl.substring(0, cl.length-term.src.length);
      for (var ai=0;ai<term.alts.length;ai++) {
        var alt = term.alts[ai];
        if (tl === base + alt.t) return {code:alt.code, rule:alt.rule};
      }
    }
  }
  // 3) Accords
  for (var i=0;i<GRAMM.ACCORDS.length;i++) {
    var r = GRAMM.ACCORDS[i].test(correct, typed);
    if (r) return r;
  }
  // 4) Doubles consonnes
  if (GRAMM.DOUBLES_CONSONNES[cl]) {
    var dc = GRAMM.DOUBLES_CONSONNES[cl];
    if (typeof dc==="string"&&dc.length===2) {
      var single=dc[0];
      if(cl.replace(dc,single)===tl) return{code:"L-ORT",rule:"Double consonne manquante : « "+correct+" » → -"+dc+"-."};
      if(tl.replace(single,dc)===cl) return{code:"L-ORT",rule:"Double consonne en trop ou manquante sur « "+correct+" »."};
    }
  }
  // 5) Accent manquant/erroné
  var clNorm=cl.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  var tlNorm=tl.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  if(clNorm===tlNorm&&tl!==cl) return{code:"L-ACC",rule:"Accent manquant ou erroné sur « "+correct+" »."};
  return null;
};

