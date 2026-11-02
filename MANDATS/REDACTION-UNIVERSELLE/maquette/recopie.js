// Recopier dans le vrai écran des scans : données ajoutées, anciennes corrections conservées.
var RC = { ouvert: false, copie: null, page: null, ligne: null, documents: {}, annule: [], zoom: 1, drag: null, ui: null };
function rcCopieSource() { return ((state.copies[RC.copie] || {}).scan || {}).recopie || {}; }
function rcListe(v) { return Array.isArray(v) ? v.slice() : Object.values(v || {}); }
function rcBorne(v, a, b) { return Math.max(a, Math.min(b, Number(v) || 0)); }
/* [C14 1.4.6] (Paul 15:18, page 2 de la copie sans trait rouge) : depuis que les pages défilent à la suite, la page d'une copie peut se préparer
   avant que sa photo soit prête ; elle restait alors sans marge. Dès que la photo est là, la marge (et le bord droit) se trouvent, une fois. */
function rcMargeTardive(pid, d) {
  const im = SC.imgs[pid]; if (!d || d.marge || !im || !im.el.complete || !im.el.naturalWidth) return;
  const cv = document.createElement("canvas"); cv.width = im.w; cv.height = im.h; cv.getContext("2d").drawImage(im.el, 0, 0);
  const marge = rcMargeRouge(cv), bord = rcBordDroit(cv), auto = v => Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6;
  RC.sansMarge = RC.sansMarge || {}; RC.sansMarge[pid] = !marge;
  d.marge = marge ? { xh: rcBorne(marge(0), 0.01, 0.6), xb: rcBorne(marge(1), 0.01, 0.6) } : { xh: 0.15, xb: 0.15, absente: true };
  d.ordre.forEach(id => { const l = d.lignes[id]; if (!l || l.recale) return;
    if (marge && auto(l.x0)) l.x0 = rcBorne(marge((l.y0 + l.y1) / 2) - 0.008, 0, 0.97);
    if (bord && auto(l.x1)) l.x1 = bord; });
}
function rcDocument(pid) {
  if (RC.documents[pid]) { const d = RC.documents[pid]; if (!d.marge) rcMargeTardive(pid, d); return d; }
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
    '<output id="rcChrono" title="Ton temps sur cette copie, compté seul : à la recopie, puis dans la bande. Une minute sans geste ne compte pas ; la frappe compte. Le total de la classe est dans « 📋 Le flux »."></output>',
    '<output id="rcEtat" role="status"></output></header>',
    '<div class="rc-outils"><span id="rcCompte"></span>',
    '<button id="rcAjouter" class="sc-btn" title="Ajouter une ligne après la ligne en cours. Recale ses deux poignées avant de taper.">＋ Une ligne</button>',
    '<button id="rcRetirer" class="sc-btn" title="Retirer la ligne en cours de la feuille. Annuler permet de la remettre avec son texte.">− Cette ligne</button>',
    '<button id="rcAnnuler" class="sc-btn" title="Annuler le dernier ajout, retrait ou recalage de cette page. Dans le champ, Ctrl + Z annule la frappe.">↶ Annuler</button>',
    '<button id="rcMoins" class="sc-btn" title="Réduire ensemble la photo et la feuille.">−</button>',
    '<button id="rcLargeur" class="sc-btn" title="Remettre la photo et la feuille à la largeur de leurs colonnes. Ctrl + molette règle aussi leur zoom.">↔ Largeur</button>',
    '<button id="rcPlus" class="sc-btn" title="Agrandir ensemble la photo et la feuille.">＋</button>',
    '<button id="rcExportIA" class="sc-btn" title="Télécharger un fichier pour l’IA : ta consigne, puis tes copies recopiées, numérotées, sans aucun nom. Donne-le à l’IA, elle te rend le même fichier corrigé.">⇪ Exporter pour l’IA</button>',
    '<button id="rcRenvoyerIA" class="sc-btn" hidden title="Un retour de l’IA s’est perdu : redonne-lui les copies qui attendent encore leur retour, dans un nouveau fichier (8 au plus par clic). Rien n’est effacé.">↻ Renvoyer les copies en attente</button>',
    '<button id="rcImportIA" class="sc-btn" title="Coller ou choisir le retour de l’IA. L’app vérifie que toutes les lignes correspondent avant de rien changer.">⇩ Charger le corrigé de l’IA</button><button id="rcFluxOuvrir" class="sc-btn" title="Le flux de la classe : pour chaque copie, ce qui est recopié, envoyé à l’IA, chargé, et où en est la bande, avec l’heure de chaque étape.">📋 Le flux</button><span id="rcIAEtat" class="rc-ia-etat"></span>',
    '<button id="rcPhraseOuvrir" class="sc-btn" title="La fin de la recopie de cette copie : surligne la phrase qui t’a marqué (clic sur son premier mot, puis sur son dernier), ou coche « Pas de phrase ». Elle passe en or sur la copie de l’élève. Le flux ne coche « recopiée » qu’après.">★ La phrase qui m’a marqué</button>',
    '<button id="rcBandeOuvrir" class="sc-btn" title="La bande : elle s’arrête à chaque faute proposée par le corrigé de l’IA. Entrée ou Espace : c’est une faute ; N : non. Échap : revenir à la recopie.">▶ La bande</button>',
    '<button id="rcPhotoOuvrir" class="sc-btn" title="Les outils de la photo de cette page, des gestes rares : la remplacer, la tourner, la retoucher, changer l’ordre des pages, retirer les photos de ce navigateur.">📷 La photo</button>',
    '<button id="rcCharger" class="sc-btn" hidden title="Remettre le paquet dans ce navigateur ; les lignes et le texte déjà gardés restent en place.">Charger le paquet</button></div>',
    '<div class="rc-apercu"><div><b id="rcLigneTitre"></b><span>Recale les poignées vertes, puis recopie sans corriger.<br>Entrée : ligne suivante · ↑ ↓ : changer de ligne.</span></div>',
    '<div class="rc-zoom-bande-c"><span class="rc-zoom-boutons"><button id="rcZoomMoins" class="sc-btn" title="Revenir d\'un cran : à ×1, la ligne en grand va de la marge rouge au bord de la copie.">−</button><b id="rcZoomCran">×1</b><button id="rcZoomPlus" class="sc-btn" title="Grossir la ligne en grand d\'un cran : elle prend toute la largeur, la photo et tes lignes ne bougent pas.">+</button></span><canvas id="rcAgrandie" aria-label="La ligne manuscrite en grand"></canvas></div></div>',
    '<div id="rcDefile" class="rc-defile"><div id="rcPages" class="rc-pages"></div></div>',
    '<p id="rcMessage" class="rc-message"></p>',
    '<section id="rcBande" class="rc-bande" aria-label="La bande des fautes"><div class="rc-bande-g"><div class="rc-bande-haut"><button id="rcBandeRetour" class="sc-btn" title="Revenir à ta recopie (Échap). Tes réponses sont gardées.">← Revenir à la recopie</button><b id="rcBandeTitre"></b><button id="rcStPlus" class="sc-btn" title="Poser un sticker que l’IA n’a pas vu : sur le mot où tu es (mot par mot), ou sur le passage de l’arrêt en cours. Seuls les stickers validés se posent.">＋ Un sticker</button></div><div id="rcBandeAvis" class="rc-bande-avis" hidden></div><canvas id="rcBandePhoto" aria-label="La ligne de la photo" title="Glisse le cadre pour le déplacer. Double clic sur le cadre : deux poignées, une de chaque côté, pour régler sa longueur ; encore un double clic les retire. Clic droit sur le cadre : une faute de ta recopie."></canvas><div id="rcBandeContexte" class="rc-bande-contexte"></div><div id="rcBandeCarte" class="rc-bande-carte"></div><div id="rcBandeTouches" class="rc-bande-touches"></div><div id="rcRqListe" class="st-rq-liste" hidden></div></div><aside class="rc-bande-d"><h4>Les arrêts de cette copie</h4><ol id="rcBandeListe"></ol></aside></section>',
    '<div id="rcPhrase" class="rc-ia" hidden><div class="rc-ia-c rc-phrase-c" role="dialog" aria-label="La phrase qui m’a marqué"><b>La phrase qui m’a marqué</b><span>Clique le premier mot de la phrase : il s’écrit en dessous. Clique le dernier : toute la phrase s’écrit d’un coup. Un autre clic recommence. Elle passera en or sur la copie de l’élève. C’est la fin de la recopie de cette copie : sans elle (ou « Pas de phrase »), tu ne passes pas à la copie suivante.</span><div id="rcPhraseTexte" class="rc-phrase-t"></div><div id="rcPhraseChoix" class="rc-phrase-choix" aria-live="polite"></div><div class="rc-ia-b"><label class="rc-phrase-non" title="Aucune phrase ne t’a marqué dans cette copie : la recopie est finie quand même.">' + '<input type="checkbox" id="rcPhraseAucune"> Pas de phrase</label><button id="rcPhraseOui" class="sc-btn" disabled title="Choisis d’abord le premier et le dernier mot de la phrase.">✓ C’est elle</button><button id="rcPhraseFermer" class="sc-btn" title="Fermer (Échap) : rien ne change.">Fermer</button></div></div></div>',
    '<div id="rcPhotoF" class="rc-ia" hidden><div class="rc-ia-c rc-photo-c" role="dialog" aria-label="La photo de cette page"><b>📷 La photo</b><span id="rcPhotoQui"></span><div class="rc-photo-b">',
    '<button id="rcRemplacer" class="sc-btn" title="Remplacer la photo de cette page par une meilleure (une photo, ou un PDF d’une page). La feuille garde son identité : ta recopie reste et se recale sur la nouvelle photo, les cadres de la bande se replacent.">📷 Remplacer</button>',
    '<button id="rcPhTourner" class="sc-btn" title="Tourner cette page d’un quart de tour vers la droite (une photo prise de côté). Ta recopie, tes marques et les cadres tournent avec elle.">↻ Tourner</button>',
    '<button id="rcPhRetoucher" class="sc-btn" title="Retoucher cette page comme une photo : le cadre (ce qui dépasse disparaît de la copie et du fichier de l’élève) et la rotation degré par degré. Ta recopie et tes marques suivent leurs mots.">✂ Retoucher</button>',
    '<button id="rcPhOrdre" class="sc-btn" title="La dernière page de cette copie passe en premier (une copie photographiée dans le désordre). Chaque page garde sa recopie.">⇄ Ordre des pages</button>',
    '<button id="rcPhRetirer" class="sc-btn" title="Retirer les photos de cette copie de ce navigateur seulement. Une confirmation est demandée. Ta recopie, ta correction et tes marques restent au site.">🗑 Retirer les photos</button></div>',
    '<p id="rcPhotoPourquoi" class="rc-photo-pq"></p><div class="rc-ia-b"><button id="rcPhotoFermer" class="sc-btn" title="Fermer (Échap) : rien ne change.">Fermer</button></div></div></div>',
    '<div id="rcFlux" class="rc-ia" hidden><div class="rc-ia-c rc-flux-c" role="dialog" aria-label="Le flux de la classe"><b>Le flux de la classe</b><span>Chaque étape se valide toute seule, par ton geste : l’export, le chargement, la bande. Clique une copie pour l’ouvrir.</span><div id="rcFluxTable" class="rc-flux-t"></div><div class="rc-ia-b"><button id="rcSauvegarde" class="sc-btn" title="Télécharger la sauvegarde de toute la rédaction, telle qu’elle est au site : le sujet et sa grille de stickers, les copies (recopie, envois, corrigés, bande, stickers, remarques, temps), les pages du paquet, les retours des élèves. « 📤 Restaurer » la relit. Les photos n’y sont pas : elles ne quittent jamais ce navigateur.">💾 Télécharger la sauvegarde</button><button id="rcFluxFermer" class="sc-btn" title="Fermer (Échap)">Fermer</button></div></div></div>',
    '<div id="rcIA" class="rc-ia" hidden><div class="rc-ia-c" role="dialog" aria-label="Charger le corrigé de l’IA"><b>Charger le corrigé de l’IA</b><span>Colle ici tout le retour de l’IA, ou choisis le fichier qu’elle t’a rendu. Rien ne change tant que toutes les lignes ne correspondent pas.</span>',
    '<textarea id="rcIATexte" spellcheck="false" placeholder="Colle ici le retour de l’IA"></textarea>',
    '<div class="rc-ia-b"><label class="sc-btn" title="Choisir le fichier rendu par l’IA, ou tous ses fichiers d’un coup : ils se chargent l’un après l’autre, dans n’importe quel ordre.">Choisir un ou plusieurs fichiers<input id="rcIAFichier" type="file" multiple accept=".json,.txt,application/json,text/plain" hidden></label><button id="rcIAValider" class="sc-btn" title="Vérifier toutes les lignes, puis enregistrer le corrigé">Vérifier et charger</button><button id="rcIAFermer" class="sc-btn" title="Fermer sans rien changer (Échap)">Fermer</button><button id="rcIAEffacer" class="sc-btn rc-ia-effacer" title="Effacer, sur toute la classe, le corrigé de l’IA et tout ce qui vient de la bande (décisions, marques posées par la bande, cadres visés), pour tout refaire proprement. Ta recopie ne bouge pas. Une confirmation est demandée ; tout passe d’abord par la corbeille MJPC et un export.">🗑 Tout effacer : corrigés de l’IA et bande</button></div><p id="rcIAMessage" role="status"></p><div id="rcIAEffacerQ" class="rc-ia-q" hidden></div></div></div>'
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
  rcZoomBandeBrancher(e);
  e.querySelector("#rcMoins").onclick = () => rcZoom(RC.zoom / 1.15);
  e.querySelector("#rcPlus").onclick = () => rcZoom(RC.zoom * 1.15);
  e.querySelector("#rcLargeur").onclick = () => rcZoom(1);
  e.querySelector("#rcExportIA").onclick = () => rcExportIA(false); e.querySelector("#rcRenvoyerIA").onclick = () => rcExportIA(true);   // [C14 1.4.19] (C14 571)
  e.querySelector("#rcBandeOuvrir").onclick = () => { if (RC.bd) rcBandeFermer(); else rcBandeOuvrir(); };
  e.querySelector("#rcStPlus").onclick = () => { if (typeof stPlusOuvrir === "function") stPlusOuvrir(); };
  e.querySelector("#rcBandeRetour").onclick = () => rcBandeFermer();
  e.querySelector("#rcImportIA").onclick = rcIAOuvrir;
  e.querySelector("#rcIAFermer").onclick = rcIAFermer;
  /* [C14 1.4.12] (exigences du 29/10 : « max 30 clics par copie » ; « mesurer le gain ») : le temps de recopie, le temps de bande et les gestes de chaque copie, comptés seuls */
  e.addEventListener("pointerdown", () => rcCompter("clic"), true); e.addEventListener("keydown", ev => rcCompter(ev.target && ev.target.classList && ev.target.classList.contains("rc-saisie") ? "frappe" : "touche"), true); e.addEventListener("input", () => rcCompter("frappe"), true);
  e.querySelector("#rcRemplacer").onclick = () => rcPhotoFaire(pid => scRemplacerPage(pid));
  e.querySelector("#rcPhotoOuvrir").onclick = rcPhotoOuvrir; e.querySelector("#rcPhotoFermer").onclick = rcPhotoFermer;
  e.querySelector("#rcPhTourner").onclick = () => rcPhotoFaire(pid => scTournerPage(pid));
  e.querySelector("#rcPhRetoucher").onclick = () => rcPhotoFaire(pid => scRetoucher(pid));
  e.querySelector("#rcPhOrdre").onclick = () => rcPhotoFaire(() => scOrdrePages(RC.copie));
  e.querySelector("#rcPhRetirer").onclick = () => rcPhotoFaire(() => scRetirerPhotos());
  e.querySelector("#rcFluxOuvrir").onclick = rcFluxOuvrir; e.querySelector("#rcFluxFermer").onclick = rcFluxFermer; e.querySelector("#rcSauvegarde").onclick = () => svTelecharger();
  e.querySelector("#rcPhraseOuvrir").onclick = rcPhraseOuvrir; e.querySelector("#rcPhraseFermer").onclick = rcPhraseFermer; e.querySelector("#rcPhraseOui").onclick = rcPhraseValider;
  e.querySelector("#rcPhraseAucune").onchange = ev => { if (ev.target.checked) rcPhraseAucune(); };
  e.querySelector("#rcIAEffacer").onclick = rcIAEffacerDemander;
  e.querySelector("#rcIAValider").onclick = () => rcIACharger(e.querySelector("#rcIATexte").value);
  e.querySelector("#rcIAFichier").onchange = ev => { const fs = ev.target.files; if (fs && fs.length > 1) { rcIAChargerPlusieurs(Array.from(fs)); ev.target.value = ""; return; } const f = fs && fs[0]; if (!f) return; f.text().then(t => { e.querySelector("#rcIATexte").value = t; rcIACharger(t); }); ev.target.value = ""; };
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
      im.onload = () => { if (RC.ouvert) { rcMargeTardive(p.id, RC.documents[p.id]); rcPourPage(p.id, rcMettreEnPage); if (p.id === RC.page) rcAgrandir(); if (RC.bd) rcBandeRendre(); } };
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
  const v = { ouverte: RC.ouvert, copie: RC.copie, page: RC.page, ligne: RC.ligne }; if (RC.ouvert && RC.bd) v.bande = true;   // [C14 1.4.7] la bande ouverte se rouvre au rechargement
  if (JSON.stringify(state.scanRecopie || null) !== JSON.stringify(v)) { state.scanRecopie = v; saveState(); }
}
function rcOuvrir(reprendre) {
  if (!SC.ouvert || SC.attrib || !scK()) { toast("Donne d'abord chaque page à son élève."); return; }
  if (reprendre) SC.actif = Date.now(); else scChrono();   // [C14 dette ⓑ] la reprise à l'ouverture n'est pas un geste : elle ne compte pas de temps, la copie n'est pas réécrite
  const tr0 = state.scanRecopie;   // [C14 1.4.12.1] jamais la recopie d'un autre élève : la copie demandée n'a pas de page, la recopie ne s'ouvre pas
  if (reprendre && tr0 && tr0.ouverte && tr0.copie && !SC.copies.includes(tr0.copie)) { state.scanRecopie = Object.assign({}, tr0, { ouverte: false }); toast((nomEleveDe(tr0.copie) || "Cet élève") + " n'a pas de page dans le paquet : la recopie ne s'ouvre pas sur une autre copie."); return; }
  RC.ouvert = true; RC.documents = {}; RC.annule = []; RC.zoom = 1; state.scanDernier = "recopie";   // [C14 1.4.12] là où tu travailles : la carte d'un élève y rouvre sa copie
  const trace = state.scanRecopie;
  const dernier = trace && (reprendre ? trace.ouverte : trace.copie === scK()) ? trace : null;
  RC.copie = dernier && SC.copies.includes(dernier.copie) ? dernier.copie : scK();
  const i = SC.copies.indexOf(RC.copie); if (i >= 0) SC.ic = i;
  const pages = scPagesDe(RC.copie), r = dernier || rcCopieSource().reprise || {};
  RC.page = pages.some(p => p.id === r.page) ? r.page : pages[0] && pages[0].id;
  RC.ligne = r.ligne || null;
  const e = rcInterface(); e.hidden = false; document.body.classList.add("rc-ouvert");
  SC.copies.forEach(rcSeparerAnciens);   // [C14 1.4.5] les arrêts d'avant à plusieurs mots, coupés une fois pour toutes
  rcActualiser(true); rcBookmark(); SC.actif = Date.now(); if (typeof svBase === "function") svBase(); aidePoser("recopie");   // [C14 407]   // [C14] la sauvegarde se propose quand le paquet PASSE à « entièrement corrigé »
  rcSelectionner(RC.ligne, true, true);
  if (reprendre && dernier && dernier.bande && dernier.copie === RC.copie) rcBandeOuvrir(true);   // [C14 1.4.7] rechargée en mode bande : la bande, au même arrêt
}
function rcFermer(sansRendre) {
  if (!RC.ouvert) return; if (RC.bd) rcBandeFermer(true); RC.ouvert = false; RC.drag = null;
  if (RC.ui) RC.ui.hidden = true;
  document.body.classList.remove("rc-ouvert"); SC.actif = Date.now(); rcBookmark(); aidePoser(SC.ouvert ? "scan" : (SC.aideAvant || "correction"));
  if (!sansRendre) scRendre();
}
function rcChoisirCopie(k) {
  if (!SC.copies.includes(k)) return;
  if (!RC.bd && k !== RC.copie && rcPhraseManque(RC.copie)) { rcPhraseOuvrir(); if (RC.phrase) { RC.phraseApres = k; toast("D’abord la phrase qui t’a marqué (ou « Pas de phrase ») : c’est la fin de la recopie de cette copie."); } const sel = RC.ui.querySelector("#rcCopie"); if (sel) sel.value = RC.copie; return; }
  if (RC.bd) rcBandeFermer(true);
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
  rcBlocs(); rcToutesPages(() => { rcRapprocherLignes(); rcMettreEnPage(); }); rcMarques(); rcEtatLigne(); rcChronoRendre();
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
      input.onchange = () => { if (rcRetroactif(RC.copie, pageRow, id)) { rcGarder(); rcEtatIA(); } };   // [C14 1.4.12] une modif change partout (Paul 23:09)
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
/* [C14 1.4.7] (Paul 15:33 et 15:41) : la poignée latérale de la 1.4.6 décalait l'affichage des lignes vertes ; elle est retirée. À sa place,
   un zoom cranté de la seule ligne en grand : ×1, elle est alignée sur la feuille ; au-dessus, elle prend toute la largeur de l'écran (le texte
   d'aide se cache) et grossit, toujours entière, jamais de barre de défilement. Les lignes vertes et la photo ne bougent jamais. */
const RC_CRANS = [1, 1.5, 2, 2.5, 3];
function rcZoomBandeBrancher(e) {
  try { localStorage.removeItem("mjpc_rc_partage"); } catch (x) {}   // la poignée de la 1.4.6 : sa position gardée ne sert plus
  try { const z = parseFloat(localStorage.getItem("mjpc_rc_zoom_bande")); RC.zoomBande = RC_CRANS.includes(z) ? z : 1; } catch (x) { RC.zoomBande = 1; }
  const changer = sens => { const i = RC_CRANS.indexOf(RC.zoomBande), n = RC_CRANS[Math.max(0, Math.min(RC_CRANS.length - 1, i + sens))]; if (sens > 0 && RC.zoomPlein) return; RC.zoomBande = n; try { localStorage.setItem("mjpc_rc_zoom_bande", String(n)); } catch (x) {} rcAgrandir(); };
  e.querySelector("#rcZoomMoins").onclick = () => changer(-1); e.querySelector("#rcZoomPlus").onclick = () => changer(1);
}
function rcAgrandir() {
  if (!RC.ouvert || !RC.ui) return;
  const p = SC.pages[RC.page], l = rcCourante(), im = p && SC.imgs[p.id], cv = RC.ui.querySelector("#rcAgrandie");
  /* [C14 1.4.6] la ligne en grand suit la largeur de la feuille : plus la feuille est large, plus la bande est haute */
  const z = RC.zoomBande || 1; RC.ui.classList.toggle("rc-zoom-bande", z > 1);
  const w = Math.max(200, Math.round(cv.clientWidth || 500)), h = RC.hBande || 76;
  if (cv.style.height !== h + "px") cv.style.height = h + "px";
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  const x = cv.getContext("2d"); x.fillStyle = "#fffdf8"; x.fillRect(0, 0, w, h); RC.bande = null;
  if (!l || !im || !im.el.complete || !im.el.naturalWidth) return;
  const fr = RC.ui.querySelector("#rcFeuille").getBoundingClientRect(), cr = cv.getBoundingClientRect(); if (!fr.width) return;
  const d = rcDocument(RC.page), ys = d.ordre.map(id => (d.lignes[id].y0 + d.lignes[id].y1) / 2).sort((a, b) => a - b), ecarts = [];
  for (let i = 1; i < ys.length; i++) if (ys[i] - ys[i - 1] > 0.005) ecarts.push(ys[i] - ys[i - 1]);
  const pas = ecarts.length ? ecarts.sort((a, b) => a - b)[ecarts.length >> 1] : (p.lignes && p.lignes.pas) || 0.03;
  /* [C14 1.4.14] (Paul 01/11 09:22 : « à gauche elle est alignée sur le bord de l'image et non sur le bord de la ligne rouge. Or, c'est bien lui la limite. Si l'élève
     a écrit quelque chose dans la marge, je le verrai de toute façon sur la photo tout à gauche ») : ×1, la bande va de la marge rouge au bord de la copie, sur toute
     sa largeur ; au-dessus : plus grand, la ligne entière centrée dans toute la largeur de l'écran. (Avant : ×1 à l'échelle et à la place de la feuille, C14 31/10 07:47.) */
  const yM = (l.y0 + l.y1) / 2, m = d.marge && !d.marge.absente ? rcBorne(rcMargeX(d, yM), 0, 0.6) : Math.max(0, l.x0 - 0.01);
  const r = Math.min(1, Math.max.apply(null, d.ordre.filter(id => d.lignes[id]).map(id => d.lignes[id].x1).concat([l.x1])) + 0.01), large = Math.max(1, (r - m) * im.w);
  const b = Math.min(r, l.x1 + 0.01), utile = Math.max(1, (b - m) * im.w);   // au-dessus de ×1 aussi, la ligne commence à la marge rouge
  const kb = (Math.min(w, fr.width) - 8) / large, kPlein = (w - 16) / utile, k = z > 1 ? Math.min(kb * z, kPlein) : kb;
  RC.zoomPlein = z > 1 && kb * z >= kPlein - 1e-9;
  const gauche = z > 1 ? (w - utile * k) / 2 - m * im.w * k : 4 - m * im.w * k;
  const demi = Math.max(0.012, Math.min(0.035, pas * 0.55)) * im.h, dh = 2 * demi * k, dy = (h - dh) / 2, N = 60;
  const voulu = Math.max(76, Math.min(320, Math.ceil(dh + 12))); if (voulu !== h) { RC.hBande = voulu; return rcAgrandir(); }
  const zm = RC.ui.querySelector("#rcZoomCran"); if (zm) zm.textContent = "×" + String(z).replace(".", ",");
  const zp = RC.ui.querySelector("#rcZoomPlus"); if (zp) { zp.disabled = RC.zoomPlein || z >= RC_CRANS[RC_CRANS.length - 1]; zp.title = zp.disabled ? "La ligne remplit déjà toute la largeur : plus grand, elle ne serait plus entière." : "Grossir la ligne en grand d'un cran : elle prend toute la largeur, la photo et tes lignes ne bougent pas."; }
  const zmo = RC.ui.querySelector("#rcZoomMoins"); if (zmo) zmo.disabled = z <= 1;
  const yl = u => (l.y0 + (l.y1 - l.y0) * (u - l.x0) / ((l.x1 - l.x0) || 1)) * im.h;
  for (let i = 0; i < N; i++) { const u = (i + 0.5) / N, sx = i * im.w / N, sw = im.w / N + 1; x.drawImage(im.el, sx, yl(u) - demi, sw, 2 * demi, gauche + sx * k, dy, sw * k, dh); }
  RC.bande = { gauche, largeur: im.w * k, hauteur: dh, pas: pas * im.h * k, debut: m, fin: z > 1 ? b : r };
}
function rcGarder() {
  if (!RC.copie || !RC.page || !state.classe.some(n => eleveId(n) === RC.copie)) return;
  const s = scCopie(RC.copie); s.recopie = s.recopie || {}; s.recopie.schema = 1;
  s.recopie.pages = s.recopie.pages || {};
  /* [C14 1.4.15] rien de neuf sur la page (ouvrir la phrase, une copie demandée puis retenue) : son heure ne bouge pas, la copie ne se réécrit pas au site */
  const d = rcDocument(RC.page), anc = s.recopie.pages[RC.page], canon = o => JSON.stringify(o, (c, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.keys(v).sort().reduce((r, x) => (r[x] = v[x], r), {}) : v);
  if (anc && canon(Object.assign({}, anc, { modifieLe: 0 })) === canon(Object.assign({}, d, { modifieLe: 0 }))) d.modifieLe = anc.modifieLe; else d.modifieLe = new Date().toISOString();
  s.recopie.pages[RC.page] = JSON.parse(JSON.stringify(d)); if (!s.recopie.reprise || s.recopie.reprise.page !== RC.page || s.recopie.reprise.ligne !== RC.ligne) s.recopie.reprise = { page: RC.page, ligne: RC.ligne };
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
const RC_PAQUET_IA = 8;   // [C14 1.4.10] (Paul 17:03 : « charger plus que 4 copies ») : le retour compact est deux fois plus court (mesuré : 4 779 → 2 341 signes par copie)
/* [C14 1.4.10] (Paul 14:16 « l'IA fait le triage et c'est injecté au json » ; 17:18 « tout devait se faire en une fois, c'était ça le contrat ») :
   un seul envoi, qui rend la correction et le type de chaque faute, la lettre entre accolades juste après le mot corrigé (C14 283, acquis) */
const RC_CONSIGNE_IA = "Tu reçois des rédactions d'élèves de 3e, recopiées ligne par ligne par leur professeur, fautes comprises. Pour chaque ligne, rends la même ligne corrigée : orthographe, accords, conjugaison, ponctuation, majuscules. Corrige mot pour mot : ne reformule pas, ne change pas l'ordre des mots, n'ajoute ni ne retire aucun mot, sauf si la grammaire l'exige (un mot manquant, un mot en trop). Ne touche pas au style ni au vocabulaire quand ils ne sont pas fautifs. Garde exactement les mêmes copies, pages et lignes, dans le même ordre ; une ligne vide reste vide ; un mot coupé en fin de ligne reste coupé au même endroit. Un mot entre crochets [comme ceci] a été barré par l'élève : laisse-le tel quel. Les guillemets restent « français ». Dans chaque ligne corrigée, écris juste après chaque mot ou signe que tu as corrigé ou ajouté une lettre entre accolades, le type de la faute : {G} grammaire (accord, conjugaison, homophone grammatical), {L} lexique (l'orthographe du mot lui-même), {C} accent, majuscule ou trait d'union, {P} ponctuation, {E} élision (apostrophe), {M} mot manquant que tu ajoutes ; là où tu retires un mot en trop, écris {X} à sa place. Exemple : « Il sont allé a Paris » devient « Ils{G} sont allés{G} à{G} Paris ». Rends uniquement, sans aucun commentaire et sans recopier cette consigne, un JSON compact sur une seule ligne : {\"format\":\"mjpc-recopie-ia-3\",\"lignes\":{\"identifiant de la ligne\":\"la ligne corrigée, avec ses lettres\"}}, avec toutes les lignes reçues, dans le même ordre, même celles qui n'ont pas de faute.";
/* [C14 1.4.12] (Paul 31/10 23:19, « Ok » à 336) : quand le sujet laisse le choix entre plusieurs sujets, l'IA dit, en lisant la copie, lequel l'élève a traité ;
   plus aucun geste. Ton choix déjà fait sur une copie reste le tien. */
function rcVariantes() { return ((typeof SUJET === "object" && SUJET && SUJET.variantes) || []).filter(v => v && v.id); }
function rcConsigneVariantes() {
  const V = rcVariantes(); if (V.length < 2) return "";
  return " Ce sujet laisse le choix entre " + V.length + " sujets : " + V.map(v => "« " + v.id + " » (" + String(v.libelle || v.enonce || v.id).replace(/\s+/g, " ").slice(0, 160) + ")").join(", ") + ". Pour chaque copie, dis lequel l'élève a traité : ajoute au JSON \"sujets\":{\"identité de la copie (son champ copie)\":\"" + V[0].id + "\"}, avec l'identifiant du sujet traité.";
}
function rcEcrite(l) { return l && !l.retiree && (l.texte || "").trim(); }
function rcLignesEcrites(k) {
  const r = (((state.copies[k] || {}).scan || {}).recopie || {}).pages || {}, out = [];
  scPagesDe(k).forEach((p, j) => { const d = (RC.copie === k && RC.documents[p.id]) || r[p.id]; if (!d) return;
    const h = id => (d.lignes[id].y0 || 0) + (d.lignes[id].y1 || 0);
    rcListe(d.ordre).filter(id => rcEcrite(d.lignes[id])).sort((a, b) => h(a) - h(b)).forEach(id => out.push({ k, pid: p.id, page: j + 1, id, l: d.lignes[id] })); });
  return out;
}
function rcArretsLigne(l) { return l && typeof l.corrige === "string" && l.texte === l.corrigeDe ? rcEcarts(l.texte, l.corrige).segs : []; }
function rcCopieACorriger(k) { return rcLignesEcrites(k).some(x => typeof x.l.corrige !== "string" || x.l.texte !== x.l.corrigeDe); }
function rcExportIA(renvoi) {
  { const g = typeof stGardeExport === "function" ? stGardeExport() : null; if (g) { toast("Pas encore d’export : " + g + "."); rcEtatIA(); return; } }   // [C14 1.4.18] (Paul 20:31, C14 565) le sujet complet d'abord
  if (RC.page) rcGarder();
  /* 1.4.2 (Paul 10:57) : un retour d'IA trop long est coupé ; on exporte par paquets les copies qui n'ont pas encore leur corrigé à jour.
     [C14 1.4.10] 8 copies (retour compact) ; chaque ligne garde le texte envoyé et l'heure (dette C14 296 : l'import refuse une ligne qui a changé depuis) ;
     plus de bandeau après l'export (Paul 17:03) : le compteur d'en haut le dit. */
  const sti = typeof stEnvoiGrille === "function" ? stEnvoiGrille() : null;   // [C14 1.4.16] les stickers validés partent avec la correction, dans le même envoi
  /* [C14 1.4.19] (Paul 20:54 : « tout exporter à la suite en une fois puis tout importer ensuite à la suite en une fois » ; « Ok pour 571 », 22:16) :
     chaque export donne le paquet suivant ; une copie qui attend son retour ne repart que par « ↻ Renvoyer les copies en attente » */
  const besoin = SC.copies.filter(k => rcLignesEcrites(k).length && (rcCopieACorriger(k) || (sti && stAEnvoyer(k)))), attente = besoin.filter(rcEnAttente);
  const aFaire = renvoi ? attente.slice().sort((a, b) => ((scCopie(a).recopie.envoi || {}).n || 0) - ((scCopie(b).recopie.envoi || {}).n || 0)) : besoin.filter(k => !attente.includes(k));
  if (!sti && typeof stActifs === "function" && stActifs().length) toast("Les stickers ne partent pas encore : " + stPretTexte() + ".");
  if (!aFaire.length) { if (!renvoi && attente.length) toast("Toutes tes copies à corriger sont parties : " + attente.length + " attend" + (attente.length > 1 ? "ent" : "") + " son retour. Charge les retours ; si l’un s’est perdu : « ↻ Renvoyer les copies en attente »."); rcEtatIA(); return; }
  const paquetsEnAttente = new Set(attente.map(k => (scCopie(k).recopie.envoi || {}).n)).size;
  const copies = aFaire.slice(0, RC_PAQUET_IA), le = new Date().toISOString(), nEnvoi = 1 + SC.copies.reduce((m, k) => Math.max(m, (((scCopie(k).recopie || {}).envoi) || {}).n || 0), 0);
  copies.forEach(k => { const s = scCopie(k), c = state.copies[k]; if (c && !c.id) { c.id = idCopie(); if (!c.creeLe) c.creeLe = le; }   // [C14 1.4.16] une copie part toujours avec son identité interne (une copie toute neuve n'en avait pas encore)
    s.recopie = s.recopie || {}; s.recopie.envoi = Object.assign({ n: nEnvoi, le, lignes: rcLignesEcrites(k).length }, sti && !rcCopieACorriger(k) ? { seul: true } : {}); });   // [C14 1.4.11] le flux : l'envoi de chaque copie, numéroté et daté
  const o = { consigne: RC_CONSIGNE_IA + rcConsigneVariantes() + (sti ? RC_CONSIGNE_STICKERS + (typeof RC_CONSIGNE_POURQUOI === "string" ? RC_CONSIGNE_POURQUOI : "") + (typeof RC_CONSIGNE_REMARQUES === "string" ? RC_CONSIGNE_REMARQUES : "") : ""), format: "mjpc-recopie-ia-3", copies: copies.map((k, i) => { const L = rcLignesEcrites(k), pages = [], seul = !!sti && !rcCopieACorriger(k); let n = 0;
    L.forEach(x => { let pg = pages.find(q => q.page === x.page); if (!pg) pages.push(pg = { page: x.page, lignes: [] }); pg.lignes.push({ id: x.id, n: ++n, texte: x.l.texte });
      rcLigneMaj(k, x.pid, x.id, l => { l.envoiIA = { texte: l.texte, le }; }); });
    return Object.assign({ numero: i + 1, copie: (state.copies[k] || {}).id || null, pages }, seul ? { seulementStickers: true } : {}); }) };   // [C14 1.4.12] (Paul 15:59) l'identité interne de la copie, jamais son nom
  if (sti) { o.sujet = stEnonce(); o.grille = sti; }
  const nom = rcNomEnvoi({ n: copies.length, seuls: copies.filter(k => sti && !rcCopieACorriger(k)).length, renvoi, rang: paquetsEnAttente + 1, total: paquetsEnAttente + Math.ceil(aFaire.length / RC_PAQUET_IA) });
  o.fichier = nom; o.consigne += RC_CONSIGNE_FICHIER;   // [C14 1.4.19] (Paul 20:54 : « Nommés par leurs contenus ») le fichier rendu porte le même nom, précédé de « corrige_ »
  saveState();
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(o, null, 1)], { type: "application/json" }));
  a.download = nom; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  rcEtatIA();
}
function rcIAOuvrir() { if (RC.page) rcGarder(); RC.iaOuvert = true; const m = RC.ui.querySelector("#rcIA"); m.hidden = false; RC.ui.querySelector("#rcIAMessage").textContent = ""; RC.ui.querySelector("#rcIATexte").focus(); }
function rcIAFermer() { RC.iaOuvert = false; RC.ui.querySelector("#rcIA").hidden = true; const q = RC.ui.querySelector("#rcIAEffacerQ"); if (q) q.hidden = true; }
/* [C14 1.4.9] (Paul 19:27 : « un bouton de suppression des corrections déjà faites […] attention que le bouton ne supprime rien de ma recopie » ;
   19:39 : « Il faut que tout ce qui concerne la bande disparaisse […] nettoyer à fond puis refaire ») : efface, sur toute la classe, ce que l'IA a rendu
   (corrige, corrigeDe, corrigeLe, types, typesDe) et tout ce qui vient de la bande (décisions, cadres visés, marques posées par la bande, l'arrêt où
   on en était, le début de la bande). Ne touche jamais au texte recopié, aux lignes et à leurs places, aux lignes retirées, à la marge, ni aux marques
   d'avant mises de côté, ni aux autres marques. Export puis corbeille d'abord ; si la corbeille ne répond pas, rien n'est effacé. */
const RC_CHAMPS_IA = ["corrige", "corrigeDe", "corrigeLe", "corrigeMarque", "types", "typesDe", "envoiIA"], RC_CHAMPS_BANDE = ["decisions", "marquesBande", "places", "placesApp"];
function rcIANettoyage() {
  const r = { lignes: [], copies: new Set(), corriges: 0, decisions: 0, places: 0, marques: 0, data: {} };
  SC.copies.forEach(k => { const s = scCopie(k), rec = s.recopie || {}, o = {};
    const toutes = []; const pgs = rec.pages || {}; Object.keys(pgs).forEach(pid => Object.keys((pgs[pid] && pgs[pid].lignes) || {}).forEach(id => toutes.push({ k, pid, id, l: (RC.copie === k && RC.documents[pid] && RC.documents[pid].lignes[id]) || pgs[pid].lignes[id] })));
    if (RC.copie === k) Object.keys(RC.documents || {}).forEach(pid => Object.keys(RC.documents[pid].lignes || {}).forEach(id => { if (!toutes.some(t => t.pid === pid && t.id === id)) toutes.push({ k, pid, id, l: RC.documents[pid].lignes[id] }); }));
    /* toutes les lignes, même retirées ou vidées */
    toutes.forEach(x => { const l = x.l || {}, champs = {}; RC_CHAMPS_IA.concat(RC_CHAMPS_BANDE).forEach(f => { if (l[f] !== undefined) champs[f] = l[f]; });
      if (!Object.keys(champs).length) return; r.lignes.push(x); if (l.corrige !== undefined) r.corriges++; r.decisions += Object.keys(l.decisions || {}).length; r.places += Object.keys(l.places || {}).length;
      ((o.lignes = o.lignes || {})[x.pid] = o.lignes[x.pid] || {})[x.id] = champs; });
    const mb = Object.values(s.marques || {}).filter(m => m && m.bande); if (mb.length) { o.marques = {}; mb.forEach(m => { o.marques[m.id] = m; }); r.marques += mb.length; }
    if (rec.bandeArret) o.bandeArret = rec.bandeArret; if (rec.envoi) o.envoi = rec.envoi; if (rec.charge) o.charge = rec.charge; if (s.bandeDebut) o.bandeDebut = s.bandeDebut;
    if (Object.keys(o).length) { r.data[k] = o; r.copies.add(k); } });
  return r;
}
function rcIAEffacerDemander() {
  const r = rcIANettoyage(), q = RC.ui.querySelector("#rcIAEffacerQ"), n = r.copies.size, pl = (v, m) => v + " " + m + (v > 1 ? "s" : "");
  if (!n) { RC.ui.querySelector("#rcIAMessage").textContent = "Il n’y a rien à effacer : aucun corrigé de l’IA, rien de la bande."; return; }
  q.hidden = false;
  q.innerHTML = "<b>Tout effacer, sur " + pl(n, "copie") + " : le corrigé de l’IA de " + pl(r.corriges, "ligne") + ", et tout ce qui vient de la bande : " + pl(r.decisions, "décision") + ", " + pl(r.marques, "marque") + " posée" + (r.marques > 1 ? "s" : "") + " par la bande, " + pl(r.places, "cadre") + " visé" + (r.places > 1 ? "s" : "") + ", l’arrêt où tu en étais ?</b> Ta recopie ne bouge pas : ni le texte, ni les lignes, ni leurs places, ni la marge. Les marques d’avant mises de côté et tes autres marques restent. Tout est d’abord rangé dans la corbeille MJPC (un an) et un export est téléchargé. <button id=\"rcIAEffacerOui\" class=\"sc-btn\" title=\"Ranger dans la corbeille, télécharger l’export, puis tout effacer\">Tout effacer</button> <button id=\"rcIAEffacerNon\" class=\"sc-btn\" title=\"Ne rien effacer\">Annuler</button>";
  q.querySelector("#rcIAEffacerNon").onclick = () => { q.hidden = true; };
  q.querySelector("#rcIAEffacerOui").onclick = rcIAEffacer;
}
function rcIAEffacer() {
  const q = RC.ui.querySelector("#rcIAEffacerQ"), msg = RC.ui.querySelector("#rcIAMessage"), r = rcIANettoyage(); q.hidden = true; if (!r.copies.size) return;
  const chemin = ruCheminCopies().join("/"), jour = new Date().toISOString().slice(0, 10), data = scCles(r.data, true);
  ruTelecharger({ _meta: { source: chemin, exportedAt: new Date().toISOString(), exportedBy: "nettoyage_ia_et_bande", version: 1 }, data }, "corriges-ia-et-bande_" + RU.id + "_" + jour + ".json");
  msg.textContent = "Rangement dans la corbeille…"; msg.className = "rc-ia-msg";
  ruCorbeille("nettoyage-ia-et-bande", chemin, data, { redaction: RU.id, copies: r.copies.size, lignes: r.lignes.length, marques: r.marques }).then(i => {
    if (i.etat !== MJPC_ISSUE.ACCEPTEE) { msg.textContent = "Rien n’a changé : la corbeille MJPC n’a pas répondu. L’export est téléchargé."; msg.className = "rc-ia-msg ko"; return; }
    if (RC.bd) rcBandeFermer(true); if (RC.ui) { RC.ui.classList.remove("rc-mode-bande"); const b = RC.ui.querySelector("#rcBandeOuvrir"); if (b) b.textContent = "▶ La bande"; }
    r.lignes.forEach(x => rcLigneMaj(x.k, x.pid, x.id, l => { RC_CHAMPS_IA.concat(RC_CHAMPS_BANDE).forEach(f => { delete l[f]; }); }));
    r.copies.forEach(k => { const s = scCopie(k); Object.keys(r.data[k].marques || {}).forEach(id => { delete s.marques[id]; }); if (s.recopie) { delete s.recopie.bandeArret; delete s.recopie.envoi; delete s.recopie.charge; } delete s.bandeDebut; scNumeroter(k); });
    rcBookmark(); saveState(); rcEtatIA();
    msg.textContent = "Effacé, sur " + r.copies.size + " copie" + (r.copies.size > 1 ? "s" : "") + " : le corrigé de l’IA et tout ce qui vient de la bande. Ta recopie n’a pas bougé. Tu peux refaire l’export pour l’IA."; msg.className = "rc-ia-msg ok";
  });
}
function rcListeIA(v) { return Array.isArray(v) ? v : v && typeof v === "object" ? Object.values(v) : []; }
function rcIALire(txt) {
  const t = String(txt || ""), blocs = []; let prof = 0, deb = -1, chaine = false, ech = false;
  for (let i = 0; i < t.length; i++) { const c = t[i];
    if (chaine) { if (ech) ech = false; else if (c === "\\") ech = true; else if (c === '"') chaine = false; continue; }
    if (c === '"') { if (prof > 0) chaine = true; continue; }
    if (c === "{") { if (prof === 0) deb = i; prof++; } else if (c === "}" && prof > 0) { prof--; if (prof === 0) blocs.push(t.slice(deb, i + 1)); } }
  const r = { lignes: {}, coupe: prof > 0, doublons: 0, sansId: 0, repris: new Set(), copieDe: {}, sujets: {}, reussites: {}, aReprendre: {} };
  const poser = (id, v) => { if (r.lignes[id] !== undefined) r.doublons++; r.lignes[id] = v; };
  blocs.forEach(b => { let o; try { o = JSON.parse(b); } catch (e) { return; } if (!o || typeof o !== "object") return;
    if (o.copies) rcListeIA(o.copies).forEach(c => rcListeIA(c && c.pages).forEach(pg => rcListeIA(pg && pg.lignes).forEach(l => { if (!l || typeof l.id !== "string") { r.sansId++; return; } poser(l.id, String(l.texte == null ? "" : l.texte)); if (c && typeof c.copie === "string") r.copieDe[l.id] = c.copie; })));
    if (o.lignes && typeof o.lignes === "object" && !Array.isArray(o.lignes)) Object.keys(o.lignes).forEach(id => poser(id, String(o.lignes[id] == null ? "" : o.lignes[id])));
    if (o.sujets && typeof o.sujets === "object") Object.keys(o.sujets).forEach(c => { r.sujets[c] = String(o.sujets[c]); });
    if (o.reussites && typeof o.reussites === "object" && !Array.isArray(o.reussites)) Object.keys(o.reussites).forEach(c => { r.reussites[c] = rcListeIA(o.reussites[c]); });
    if (o.aReprendre && typeof o.aReprendre === "object" && !Array.isArray(o.aReprendre)) Object.keys(o.aReprendre).forEach(c => { r.aReprendre[c] = rcListeIA(o.aReprendre[c]); }); });
  /* [C14 1.4.10] un retour coupé : ses paires « identifiant : ligne » complètes sont gardées ; seules les copies entières se chargeront */
  if (r.coupe && deb >= 0) { const queue = t.slice(deb), re = /"([^"\\]+)"\s*:\s*"((?:[^"\\]|\\.)*)"/g; let m;
    while ((m = re.exec(queue))) { if (/^(format|consigne|id|texte|page)$/.test(m[1])) continue; let v; try { v = JSON.parse('"' + m[2] + '"'); } catch (e) { continue; } if (r.lignes[m[1]] === undefined) { r.lignes[m[1]] = v; r.repris.add(m[1]); } } }
  if (!blocs.length && !r.repris.size) throw r.coupe ? "Le retour de l’IA est coupé avant la fin de la première copie : demande-lui de tout rendre, ou exporte à nouveau." : "Je ne trouve pas de fichier dans ce que tu as collé.";
  return r;
}
/* [C14 1.4.10] la ligne corrigée, avec ses lettres : le texte sans les lettres, et la lettre de chaque arrêt (celle qui suit son mot corrigé ;
   {X} à la place d'un mot retiré) ; un arrêt sans lettre garde le type du moteur */
function rcLettres(brut, eleve) {
  const s = String(brut == null ? "" : brut), L = [], re = /\{([GLCPEMXIA])\}/gi; let net = "", dernier = 0, m;
  while ((m = re.exec(s))) { net += s.slice(dernier, m.index); dernier = m.index + m[0].length; const t = m[1].toUpperCase();
    if (t === "X" && (!net.length || /[ \u00a0]$/.test(net)) && /^[ \u00a0]/.test(s.slice(dernier))) dernier++;   // « très {X} grand » : un seul blanc reste
    L.push({ pos: net.length, t }); }
  net += s.slice(dernier);
  if (!L.length) return { texte: s, types: null };
  const P = rcPosMots(net), avant = pos => { let j = -1; P.forEach((q, i) => { if (q[1] <= pos && !net.slice(q[1], pos).trim()) j = i; }); return j; }, trou = pos => P.filter(q => q[1] <= pos).length;
  const types = {};
  rcEcarts(eleve, net).segs.forEach(g => { let t = null;
    if (g.a2 > g.de2) { const f = L.find(x => x.t !== "X" && (() => { const j = avant(x.pos); return j >= g.de2 && j < g.a2; })()); if (f) t = f.t; }
    else if (L.some(x => x.t === "X" && trou(x.pos) === g.de2)) t = "X";
    if (t && RC_TYPES[t]) types[rcCle(g)] = t; });
  return { texte: net, types: Object.keys(types).length ? types : null };
}
/* [C14 1.4.12] la ressemblance en lettres entre la ligne envoyée et la ligne rendue : 2 × la plus longue suite commune / la somme des longueurs.
   Mesurée sur les 869 vraies lignes de la classe de 3e (31/10, sas NUIT-31-10/SEUIL-A2.md) : la plus basse vaut 0,64 ; des lignes échangées passent sous 0,6 (sauf 1 sur 1 000). */
const RC_RESSEMBLANCE_IA = 0.6;
function rcRessemblance(a, b) {
  a = String(a || "").toLowerCase(); b = String(b || "").toLowerCase(); if (!a.length && !b.length) return 1;
  let p = new Array(b.length + 1).fill(0); for (let i = 0; i < a.length; i++) { const c = [0]; for (let j = 0; j < b.length; j++) c.push(a[i] === b[j] ? p[j] + 1 : Math.max(p[j + 1], c[j])); p = c; }
  return 2 * p[b.length] / (a.length + b.length);
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
  const erreurs = [], recu = {};
  if (o.sansId) erreurs.push("des lignes sans leur identifiant (l’IA les a enlevés : redemande-lui de garder chaque « id »)");
  Object.keys(o.lignes).forEach(id => { if (ici[id]) recu[id] = o.lignes[id]; else if (!o.repris.has(id)) erreurs.push("une ligne du retour n’existe pas, ou n’est plus écrite, dans tes recopies"); });
  if (o.doublons) erreurs.push(o.doublons + " ligne" + (o.doublons > 1 ? "s" : "") + " en double dans le retour");
  if (erreurs.length) { msg.textContent = "Rien n’a changé : " + [...new Set(erreurs)].slice(0, 4).join(" ; ") + "."; return false; }
  /* [C14 1.4.10] (Paul 17:09, « ok » à 273) : une copie se charge si toutes ses lignes écrites sont dans le retour, et si aucune n'a changé depuis l'envoi
     (dette C14 296) ; sinon elle attend le prochain export. Une ligne d'une autre copie ne s'y mêle jamais : chaque ligne a son identité. */
  const pc = {}; Object.keys(recu).forEach(id => { (pc[ici[id].k] = pc[ici[id].k] || []).push(id); });
  const ok = [], coupees = [], changees = [], melangees = [];
  Object.keys(pc).forEach(k => { const L = rcLignesEcrites(k), idc = (state.copies[k] || {}).id, ev = (scCopie(k).recopie || {}).envoi; if (ev && ev.seul && !rcCopieACorriger(k)) return;   // [C14 1.4.16] partie pour ses seules réussites : son corrigé et ta bande ne bougent pas
    if (!L.every(x => recu[x.id] !== undefined)) coupees.push(k); else if (L.some(x => x.l.envoiIA && x.l.envoiIA.texte !== x.l.texte)) changees.push(k);
    else if (L.some(x => (o.copieDe[x.id] && idc && o.copieDe[x.id] !== idc) || rcRessemblance(x.l.texte, rcLettres(recu[x.id], x.l.texte).texte) < RC_RESSEMBLANCE_IA)) melangees.push(k); else ok.push(k); });
  /* [C14 1.4.12] (Paul 15:59, « sinon c'est la porte ouverte au mélange de données ») : le refus est gardé dans la copie, pour le flux ; un chargement réussi l'efface */
  { const parId = {}; SC.copies.forEach(k => { const id = (state.copies[k] || {}).id; if (id) parId[id] = k; });   // [C14 1.4.19] (C14 591) un retour arrivé sans une copie de son envoi : elle repart au prochain export, comme le message le dit
    const touches = new Set(Object.keys(pc).concat(Object.keys(o.reussites || {}).map(id => parId[id]), Object.keys(o.aReprendre || {}).map(id => parId[id])).filter(Boolean).map(k => ((scCopie(k).recopie || {}).envoi || {}).n).filter(Boolean)), qt = new Date().toISOString();
    let libres = 0; if (touches.size) SC.copies.forEach(k => { const ev = (scCopie(k).recopie || {}).envoi; if (ev && touches.has(ev.n) && !ok.includes(k) && !(ev.retour && ev.retour >= ev.le)) { ev.retour = qt; libres++; } }); if (libres) saveState(); }
  const qr = new Date().toISOString(); melangees.forEach(k => { const s = scCopie(k); s.recopie = s.recopie || {}; s.recopie.refusIA = { le: qr, raison: "melange" }; }); ok.forEach(k => { const s = scCopie(k); if (s.recopie && s.recopie.refusIA) delete s.recopie.refusIA; });
  if (melangees.length) saveState();
  const aJour = SC.copies.filter(k => !ok.includes(k) && !melangees.includes(k) && rcLignesEcrites(k).length && !rcCopieACorriger(k)), stR = typeof stIAReussites === "function" && Object.keys(o.reussites || {}).length ? stIAReussites(o, ok.concat(aJour)) : null;
  const dSt = stR && stR.copies ? " Les stickers : " + stR.poses + " réussite" + (stR.poses > 1 ? "s" : "") + " proposée" + (stR.poses > 1 ? "s" : "") + " sur " + stR.copies + " copie" + (stR.copies > 1 ? "s" : "") + (stR.incompletes ? " (" + stR.incompletes + " dont la liste est coupée : au prochain export)" : "") + (stR.horsCopie ? " · " + stR.horsCopie + " sur une ligne d’une autre copie, refusée" + (stR.horsCopie > 1 ? "s" : "") : "") + (stR.inconnus ? " · " + stR.inconnus + " d’un numéro inconnu, laissée" + (stR.inconnus > 1 ? "s" : "") : "") + "." : "";
  const rqR = typeof stIARemarques === "function" && Object.keys(o.aReprendre || {}).length ? stIARemarques(o, ok.concat(aJour)) : null;   // [C14 1.4.17] les remarques, après les réussites
  const dRq = rqR && rqR.copies ? " Les remarques : " + rqR.n + " à relire à la fin de la bande" + (rqR.refusReussi ? " · " + rqR.refusReussi + " sur un sticker réussi, refusée" + (rqR.refusReussi > 1 ? "s" : "") : "") + (rqR.horsCopie ? " · " + rqR.horsCopie + " sur une ligne d’une autre copie, refusée" + (rqR.horsCopie > 1 ? "s" : "") : "") + (rqR.longues ? " · " + rqR.longues + " de plus de quarante mots, signalée" + (rqR.longues > 1 ? "s" : "") : "") + "." : "";
  const dMel = melangees.length ? " " + melangees.length + " copie" + (melangees.length > 1 ? "s" : "") + " refusée" + (melangees.length > 1 ? "s" : "") + " (" + melangees.map(k => nomEleveDe(k) || k).join(", ") + ") : une ligne rendue par l’IA ne ressemble plus à la ligne envoyée, l’IA a pu mélanger des lignes ; rien n’y est écrit, elle repart au prochain export." : "";   // [C14 1.4.17] dite avant d'être lue (elle était lue plus haut avant d'exister)
  if (!ok.length && stR && stR.copies) { saveState(); rcEtatIA(); if (RC.bd) rcBandeRendre(); msg.textContent = "Chargé." + dSt + dRq + dMel; return true; }
  if (!ok.length) { msg.textContent = "Rien n’a changé : " + (melangees.length && !changees.length && !coupees.length ? dMel.trim() : changees.length ? "une ligne de chaque copie du retour a changé depuis l’envoi à l’IA : exporte à nouveau." : o.coupe ? "le retour de l’IA est coupé avant la fin de la première copie : demande-lui de tout rendre, ou exporte à nouveau." : "il manque des lignes à chaque copie du retour (écrites après l’export ? refais l’export).") ; return false; }
  const quand = new Date().toISOString(); let fautes = 0, lignes = 0, typees = 0, sansLettre = 0, sujetsDits = 0;
  { const V = rcVariantes().map(v => v.id); if (V.length > 1) ok.forEach(k => { const c = state.copies[k] || {}, dit = c.id && o.sujets[c.id]; if (dit && V.includes(dit) && !c.sujet) { c.sujet = dit; c.sujetDe = "ia"; sujetsDits++; } }); }   // [C14 1.4.12] le sujet traité, dit par l'IA
  ok.forEach(k => { const s = scCopie(k); rcLignesEcrites(k).forEach(x => { const id = x.id, r = rcLettres(recu[id], x.l.texte), A = rcEcarts(x.l.texte, r.texte).segs;
    rcLigneMaj(k, x.pid, id, l => { l.corrige = r.texte; l.corrigeDe = l.texte; l.corrigeLe = quand; if (r.texte !== recu[id]) l.corrigeMarque = recu[id]; else delete l.corrigeMarque;
      if (r.types) { l.types = r.types; l.typesDe = r.texte; } else { delete l.types; delete l.typesDe; } });
    A.forEach(g => { if (r.types && r.types[rcCle(g)]) typees++; else sansLettre++; });
    Object.keys(x.l.marquesBande || {}).forEach(c => { const m = s.marques[x.l.marquesBande[c]]; if (m && m.bande && r.types && r.types[c]) m.bande.code = r.types[c]; });
    fautes += A.length; lignes++; }); });
  ok.forEach(k => { const s = scCopie(k), L = rcLignesEcrites(k); let f = 0, t = 0; L.forEach(x => rcArretsLigne(x.l).forEach(g => { f++; if (x.l.types && x.l.typesDe === x.l.corrige && x.l.types[rcCle(g)]) t++; })); s.recopie = s.recopie || {}; s.recopie.charge = { le: quand, fautes: f, types: t }; });   // [C14 1.4.11] le flux
  saveState(); rcEtatIA(); if (RC.bd) rcBandeRendre(); if (typeof svVerifier === "function") svVerifier();
  const reste = coupees.length + changees.length, pl = (v, m) => v + " " + m + (v > 1 ? "s" : "");
  msg.textContent = "Chargé : " + pl(ok.length, "copie") + ", " + lignes + " lignes, " + fautes + " faute" + (fautes > 1 ? "s" : "") + " proposée" + (fautes > 1 ? "s" : "") + " par l’IA" + (fautes ? ", dont " + typees + " avec leur type" + (sansLettre ? " (" + sansLettre + " sans lettre : le type du moteur)" : "") : "") + "."
    + (coupees.length ? " " + pl(coupees.length, "copie") + (o.coupe ? " coupée" + (coupees.length > 1 ? "s" : "") : " incomplète" + (coupees.length > 1 ? "s" : "")) + " : au prochain export." : "")
    + (changees.length ? " " + pl(changees.length, "copie") + " dont une ligne a changé depuis l’envoi : au prochain export." : "") + dMel
    + (o.coupe && !coupees.length ? " Le retour de l’IA était coupé : les copies qui manquent repartent au prochain export." : "") + (sujetsDits ? " Le sujet traité, dit par l’IA : " + sujetsDits + " copie" + (sujetsDits > 1 ? "s" : "") + "." : "") + dSt + dRq;
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
          const m = { page: x.pid, forme: "faute", sens: "lieu", passe: "langue", point: "orthographe", q: null, x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, bonne: u.corrige || null, bande: { ligne: x.id, cle: c, eleve: u.eleve, corrige: u.corrige, type: q.type.nom, code: (l.types && l.typesDe === l.corrige && l.types[c]) || rcCodeFaute(u) } };
          m.id = scId("marque"); m.eleve = k; m.creeLe = m.modifieLe = new Date().toISOString(); s.marques[m.id] = m;
          rcLigneMaj(k, x.pid, x.id, L => { L.marquesBande = Object.assign({}, L.marquesBande, { [c]: m.id }); }); }); }
      n++; });
  });
  if (n) { scNumeroter(k); saveState(); }
  return n;
}
/* [C14 1.4.8] (Paul 15:59 et 16:01 : « il n'est pas assez visible, je n'ai pas le compte sur le total. c'est lui qu'il faut mettre à jour. Pas créer un
   nouveau compteur ») : le même compteur, plus visible, avec le compte de toute la classe, compté comme l'export choisit les copies (une copie
   recopiée dont une ligne n'a pas de corrigé, ou a été retapée depuis) ; puis, comme avant, les fautes proposées sur cette copie */
/* [C14 1.4.11] (Paul 17:18 : « il me faut un flux, avec validation des étapes […] Sinon je ne sais plus ce que j'ai uploadé, ce que j'ai renvoyé à
   l'IA ») : les étapes de chaque copie, validées par les gestes eux-mêmes, et datées ; C14 284, acquis */
function rcHeure(iso) { if (!iso) return ""; const d = new Date(iso), j = new Date(), h = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); return d.toDateString() === j.toDateString() ? h : String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + " " + h; }
function rcFluxCopie(k) {
  const s = scCopie(k), rec = s.recopie || {}, L = rcLignesEcrites(k); let modif = ""; Object.values(rec.pages || {}).forEach(p => { if (p && p.modifieLe && p.modifieLe > modif) modif = p.modifieLe; });
  const A = rcArrets(k), dec = A.filter(a => a.l.decisions && a.l.decisions[a.cle]).length, corr = L.length && !rcCopieACorriger(k);
  return { k, nom: nomEleveDe(k) || k, lignes: L.length, modif, envoi: rec.envoi || null, envoiAJour: !!(rec.envoi && L.length && L.every(x => x.l.envoiIA && x.l.envoiIA.texte === x.l.texte)), charge: corr ? (rec.charge || { le: (L.map(x => x.l.corrigeLe || "").sort().pop() || ""), fautes: A.length, types: null }) : null, arrets: A.length, decides: dec, fini: A.length > 0 && dec === A.length, refus: rec.refusIA || null, finie: !!rec.phrase, temps: rec.temps || null, gestes: rec.gestes || null };
}
/* [C14 1.4.12] (Paul 31/10 23:09 : « à la fin d'une recopie je dois pouvoir surligner facilement la phrase qui m'a marqué ( pas touché, marqué). Si pas de
   phrase, pas de phrase ( coche pas de phrase ). Cette phase là marque la fin d'une recopie. ») : clic sur le premier mot, puis sur le dernier ;
   la phrase passe en or sur la photo (une marque « etoile » des scans, une bande par ligne) ; recopie.phrase garde la fin de la recopie, pour le flux */
function rcPhraseOuvrir() {
  if (RC.page) rcGarder(); const k = RC.copie, W = rcMotsCopie(k, []); if (!W.length) { toast("Recopie d’abord la copie : la phrase se choisit sur ta recopie."); return; }
  const ph = (scCopie(k).recopie || {}).phrase || {}, i = q => q ? W.findIndex(w => w.id === q.id && w.m === q.m) : -1;
  RC.phrase = { k, W, a: i(ph.debut), b: i(ph.fin) }; if (RC.phrase.a < 0 || RC.phrase.b < 0) RC.phrase.a = RC.phrase.b = -1;
  RC.ui.querySelector("#rcPhraseAucune").checked = !!ph.aucune; RC.ui.querySelector("#rcPhrase").hidden = false; rcPhraseRendre();
}
function rcPhraseFermer() { RC.phrase = null; RC.phraseApres = null; RC.ui.querySelector("#rcPhrase").hidden = true; const T = RC.ui.querySelector("#rcPhraseTexte"); if (T) { T.dataset.k = ""; T.dataset.n = ""; } const sel = RC.ui.querySelector("#rcCopie"); if (sel && RC.copie) sel.value = RC.copie; }
/* [C14 1.4.15] (Paul 01/11 13:12 : « à la fin d'une recopie, la phrase qui m'a marqué doit s'ouvrir toute seule et est bloquante pour passer à la copie suivante ») :
   la recopie d'une copie est au bout quand sa dernière page a une ligne recopiée ; sans phrase (ni « Pas de phrase »), on ne quitte pas la copie pour une autre */
function rcPhraseManque(k) { if (!k) return false; const s = scCopie(k), rec = s.recopie || {}; if (rec.phrase) return false; const P = scPagesDe(k), der = P.length && P[P.length - 1].id; return !!der && rcLignesEcrites(k).some(x => x.pid === der); }
/* [C14 1.4.15] (Paul 01/11 13:12 : « quand je clique sur un mot, le texte se peint aléatoirement […] il faut que le premier mot s'affiche en dessous, une fois que
   j'ai cliqué dessus, et quand je clique le deuxième, tous les mots entre le premier mot cliqué et le deuxième mot s'affichent en reconstituant la phrase d'un coup ») :
   avant, le premier clic peignait tout depuis le début du texte (le bas de l'intervalle valait -1). Le texte n'est dessiné qu'une fois ; un clic ne change que des couleurs. */
function rcPhraseRendre() {
  const P = RC.phrase, T = RC.ui.querySelector("#rcPhraseTexte");
  if (T.dataset.k !== P.k || T.dataset.n !== String(P.W.length)) { let h = "", ligne = null, fin = 0, Pm = [];   // [C14 1.4.17] (C14 466) les blancs et la ponctuation de ta recopie, tels quels
    P.W.forEach((w, j) => { if (w.id !== ligne) { h += (ligne ? "</p>" : "") + '<p><small>' + w.n + "</small> "; ligne = w.id; fin = 0; Pm = rcPosMots(w.l.texte); } const p = Pm[w.m] || [fin, fin]; h += escapeHtml(w.l.texte.slice(fin, p[0])) + '<span class="rc-mot" data-j="' + j + '">' + escapeHtml(w.g.eleve) + "</span>"; fin = p[1]; });
    T.innerHTML = h + "</p>"; T.dataset.k = P.k; T.dataset.n = String(P.W.length);
    T.onclick = ev => { const s = ev.target.closest && ev.target.closest("[data-j]"); if (!s) return; const j = +s.dataset.j; if (P.a < 0 || P.b >= 0) { P.a = j; P.b = -1; } else P.b = j; rcPhraseRendre(); }; }
  const lo = P.b >= 0 ? Math.min(P.a, P.b) : P.a, hi = P.b >= 0 ? Math.max(P.a, P.b) : P.a;
  T.querySelectorAll("[data-j]").forEach(s => { const j = +s.dataset.j; s.classList.toggle("or", P.a >= 0 && j >= lo && j <= hi); s.classList.toggle("debut", P.a >= 0 && P.b < 0 && j === P.a); });
  const C = RC.ui.querySelector("#rcPhraseChoix"); C.textContent = P.a < 0 ? "La phrase s’écrira ici." : P.b < 0 ? "« " + P.W[P.a].g.eleve + " … » : clique maintenant le dernier mot." : "« " + rcTexteMots(P.W.slice(lo, hi + 1)) + " »";
  C.classList.toggle("vide", P.a < 0);
  const ok = P.a >= 0 && P.b >= 0, b = RC.ui.querySelector("#rcPhraseOui"); b.disabled = !ok; b.title = ok ? "Garder cette phrase : elle passe en or sur la copie de l’élève, et la recopie de cette copie est finie." : "Choisis d’abord le premier et le dernier mot de la phrase.";
}
function rcTexteMots(W) { const C = []; let c = null; W.forEach(w => { if (!c || c.id !== w.id) C.push(c = { id: w.id, l: w.l, a: w.m, b: w.m }); else c.b = w.m; });
  return C.map(x => { const P = rcPosMots(x.l.texte); return P[x.a] && P[x.b] ? x.l.texte.slice(P[x.a][0], P[x.b][1]) : ""; }).join(" "); }
function rcPhraseRetirer(k) { const s = scCopie(k); Object.values(s.marques).filter(m => m.forme === "etoile" && m.recopie).forEach(m => scEffacer(m.id)); }
function rcPhrasePoser(k, a, b, W) {
  rcPhraseRetirer(k); const parPage = {};
  W.slice(a, b + 1).forEach(w => { const L = parPage[w.pid] = parPage[w.pid] || {}; (L[w.id] = L[w.id] || []).push(w); });
  Object.keys(parPage).forEach(pid => { const segs = Object.values(parPage[pid]).map(ws => { const w0 = ws[0], w1 = ws[ws.length - 1], q = rcPlaceSeg({ k, pid, id: w0.id, l: w0.l, g: { de: w0.m, a: w1.m + 1, de2: w0.m, a2: w1.m + 1, eleve: "x", corrige: "x" }, cle: "phrase" }); return [q.x0, q.y0, q.x1, q.y1]; });
    scPoser({ page: pid, forme: "etoile", sens: "lieu", passe: "langue", point: "etoile", q: null, x0: Math.min(...segs.map(s => s[0])), y0: Math.min(...segs.map(s => s[1])), x1: Math.max(...segs.map(s => s[2])), y1: Math.max(...segs.map(s => s[3])), segs, bonne: null, recopie: true, l0: null, l1: null }); });
}
function rcPhraseReposer(k) { const ph = (scCopie(k).recopie || {}).phrase, W = rcMotsCopie(k, []), i = q => W.findIndex(w => w.id === q.id && w.m === q.m), a = i(ph.debut), b = i(ph.fin); if (a >= 0 && b >= 0) rcPhrasePoser(k, Math.min(a, b), Math.max(a, b), W); }
function rcPhraseSuite() { const k = RC.phraseApres; RC.phraseApres = null; if (k && k !== RC.copie) rcChoisirCopie(k); }
function rcPhraseValider() {
  const P = RC.phrase; if (!P || P.a < 0 || P.b < 0) return; const apres = RC.phraseApres; const k = P.k, a = Math.min(P.a, P.b), b = Math.max(P.a, P.b), W = P.W.slice(a, b + 1);
  rcPhrasePoser(k, a, b, P.W);
  const s = scCopie(k); s.recopie = s.recopie || {}; s.recopie.phrase = { le: new Date().toISOString(), debut: { id: P.W[a].id, m: P.W[a].m }, fin: { id: P.W[b].id, m: P.W[b].m }, texte: rcTexteMots(W) };
  saveState(); rcPhraseFermer(); rcEtatIA(); toast("La phrase qui t’a marqué est gardée : la recopie de cette copie est finie."); RC.phraseApres = apres; rcPhraseSuite(); if (typeof svVerifier === "function") svVerifier();
}
function rcPhraseAucune() {
  const P = RC.phrase; if (!P) return; const apres = RC.phraseApres; rcPhraseRetirer(P.k); const s = scCopie(P.k); s.recopie = s.recopie || {}; s.recopie.phrase = { le: new Date().toISOString(), aucune: true };
  saveState(); rcPhraseFermer(); rcEtatIA(); toast("Pas de phrase : la recopie de cette copie est finie."); RC.phraseApres = apres; rcPhraseSuite(); if (typeof svVerifier === "function") svVerifier();
}
/* le temps compte comme le chrono des scans : une minute sans geste ne compte pas ; la frappe de la recopie compte du temps, pas des gestes */
function rcCompter(type) {
  if (!RC.ouvert || !RC.copie || !state.classe.some(n => eleveId(n) === RC.copie)) return; const s = scCopie(RC.copie); s.recopie = s.recopie || {};
  const t = Date.now(), d = t - (RC.dernierGeste || 0), lieu = RC.bd ? "bande" : "recopie", T = s.recopie.temps = s.recopie.temps || { recopie: 0, bande: 0 };
  if (RC.gesteCopie === RC.copie && d > 0 && d < 60000) T[lieu] = (T[lieu] || 0) + d;
  RC.dernierGeste = t; RC.gesteCopie = RC.copie;
  if (type !== "frappe") { const G = s.recopie.gestes = s.recopie.gestes || { recopie: 0, bande: 0 }; G[lieu] = (G[lieu] || 0) + 1; }
  rcChronoRendre();
}
/* [C14 403] le chrono de la copie affichée, en haut de la recopie : il ne touche que son texte, jamais le focus */
function rcDureeCourte(ms) { const s = Math.floor((ms || 0) / 1000); return s < 60 ? s + " s" : Math.floor(s / 60) + " min"; }
function rcChronoRendre() {
  if (!RC.ui || !RC.copie) return; const o = RC.ui.querySelector("#rcChrono"); if (!o) return;
  const T = ((scCopie(RC.copie).recopie || {}).temps) || {}, txt = "⏱ recopie " + rcDureeCourte(T.recopie) + " · bande " + rcDureeCourte(T.bande);
  if (o.textContent !== txt) o.textContent = txt;
}
function rcDuree(ms) { const s = Math.round((ms || 0) / 1000); return s < 60 ? s + " s" : Math.floor(s / 60) + " min" + (s % 60 ? " " + String(s % 60).padStart(2, "0") : ""); }
/* [C14 402] un seul bouton « 📷 La photo » : une petite fenêtre avec les gestes rares de la photo ; un bouton grisé dit pourquoi, en dessous */
function rcPhotoOuvrir() {
  if (!RC.page) return; rcGarder(); RC.photoOuvert = true; const e = RC.ui, P = scPagesDe(RC.copie), i = P.findIndex(p => p.id === RC.page), p = SC.pages[RC.page] || {}, a = !!SC.imgs[RC.page], app = !!(p.lignes && p.lignes.reperes) || !!p.vueTournee, pq = [];
  e.querySelector("#rcPhotoQui").textContent = "Page " + (i + 1) + " / " + P.length + " de la copie de " + (nomEleveDe(RC.copie) || RC.copie) + ". Ta recopie, tes marques et les cadres suivent toujours la page.";
  const gris = (sel, non, pourquoi) => { const b = e.querySelector(sel); b.disabled = !!non; b.setAttribute("aria-disabled", non ? "true" : "false"); if (non) pq.push(b.textContent + " : " + pourquoi); };
  gris("#rcPhTourner", !a, "la photo de cette page n’est pas dans ce navigateur (remets ton paquet, ou « 📷 Remplacer »).");
  gris("#rcPhRetoucher", !a || app, !a ? "la photo de cette page n’est pas dans ce navigateur." : "une copie de l’appli se remet droite et se recadre d’elle-même.");
  gris("#rcPhOrdre", P.length < 2, "cette copie n’a qu’une page.");
  gris("#rcPhRetirer", !P.some(q => SC.imgs[q.id]), "aucune photo de cette copie n’est dans ce navigateur.");
  e.querySelector("#rcPhotoPourquoi").textContent = pq.join(" · ");
  e.querySelector("#rcPhotoF").hidden = false;
}
function rcPhotoFermer() { RC.photoOuvert = false; if (RC.ui) RC.ui.querySelector("#rcPhotoF").hidden = true; }
function rcPhotoFaire(fn) { const pid = RC.page; if (!pid) return; rcGarder(); rcPhotoFermer(); fn(pid); }
function rcFluxOuvrir() { if (RC.page) rcGarder(); RC.fluxOuvert = true; RC.ui.querySelector("#rcFlux").hidden = false; rcFluxRendre(); }
function rcFluxFermer() { RC.fluxOuvert = false; RC.ui.querySelector("#rcFlux").hidden = true; }
/* [C14 403] le total de la classe, sous le flux */
function rcFluxTotal(F) {
  const S = F.reduce((s, f) => { const T = f.temps || {}, G = f.gestes || {}; s.r += T.recopie || 0; s.b += T.bande || 0; s.g += (G.recopie || 0) + (G.bande || 0); return s; }, { r: 0, b: 0, g: 0 });
  return '<tfoot><tr class="rc-flux-total"><td colspan="5">Toute la classe</td><td>recopie ' + rcDuree(S.r) + " · bande " + rcDuree(S.b) + " · " + S.g + " geste" + (S.g > 1 ? "s" : "") + "</td></tr></tfoot>";
}
function rcFluxRendre() {
  const t = RC.ui.querySelector("#rcFluxTable"), F = SC.copies.map(rcFluxCopie), ok = '<span class="rc-flux-ok">✓</span> ', non = '<span class="rc-flux-non">—</span>';
  t.innerHTML = '<table><thead><tr><th>Copie</th><th>Recopiée</th><th>Envoyée à l’IA</th><th>Corrigé chargé</th><th>Bande</th><th title="Comptés seuls : une minute sans geste ne compte pas ; la frappe de ta recopie compte du temps, pas des gestes.">Temps et gestes</th></tr></thead><tbody>' + F.map(f => '<tr data-k="' + escapeAttr(f.k) + '"' + (f.k === RC.copie ? ' class="on"' : "") + '><td>' + escapeHtml(f.nom) + "</td>"
    + "<td>" + (f.lignes ? (f.finie ? ok : "") + f.lignes + " ligne" + (f.lignes > 1 ? "s" : "") + (f.modif ? " · " + rcHeure(f.modif) : "") + (f.finie ? "" : " · la phrase qui m’a marqué : pas encore") : non) + "</td>"
    + "<td>" + (f.envoi ? (f.envoiAJour || f.charge ? ok : "⚠ ") + "envoi " + f.envoi.n + " · " + rcHeure(f.envoi.le) + (!f.envoiAJour && !f.charge ? " · retapée depuis" : "") : f.charge ? ok + "avant le flux" : non) + "</td>"
    + "<td>" + (f.charge ? ok + rcHeure(f.charge.le) + " · " + f.charge.fautes + " faute" + (f.charge.fautes > 1 ? "s" : "") + (f.charge.types != null ? ", " + f.charge.types + " avec leur type" : "") : f.envoi ? "en attente" : non) + (f.refus ? ' <span class="rc-flux-non">⚠ copie refusée ' + rcHeure(f.refus.le) + " : lignes mélangées par l’IA, au prochain export</span>" : "") + "</td>"
    + "<td>" + (f.arrets ? (f.fini ? ok : "") + f.decides + " / " + f.arrets : non) + "</td>"
    + "<td>" + (f.temps || f.gestes ? "recopie " + rcDuree((f.temps || {}).recopie) + " · bande " + rcDuree((f.temps || {}).bande) + " · " + (((f.gestes || {}).recopie || 0) + ((f.gestes || {}).bande || 0)) + " gestes" : non) + "</td></tr>").join("") + "</tbody>" + rcFluxTotal(F) + "</table>";
  t.querySelectorAll("tr[data-k]").forEach(tr => tr.onclick = () => { const k = tr.dataset.k; rcFluxFermer(); const sel = RC.ui.querySelector("#rcCopie"); if (sel && sel.value !== k) { sel.value = k; sel.dispatchEvent(new Event("change")); } });
}
function rcCompteIA() {
  const rec = SC.copies.filter(k => rcLignesEcrites(k).length), corr = rec.filter(rcCopieACorriger), st = typeof stEnvoiGrille === "function" && !!stEnvoiGrille();
  const attente = rec.filter(k => (rcCopieACorriger(k) || (st && stAEnvoyer(k))) && rcEnAttente(k)), aFaire = corr.filter(k => !attente.includes(k));   // [C14 1.4.19] une copie partie attend son retour (sa correction, ou ses seuls stickers)
  return { rec: rec.length, ok: rec.length - corr.length, aFaire: aFaire.length, attente: attente.length, envois: Math.ceil(aFaire.length / RC_PAQUET_IA) };
}
/* [C14 1.4.19] (C14 571) une copie partie chez l'IA, dont aucun retour n'est encore chargé et dont aucune ligne n'a changé depuis : elle attend son retour */
function rcEnAttente(k) {
  const rec = scCopie(k).recopie || {}, ev = rec.envoi; if (!ev || !ev.le) return false;
  const L = rcLignesEcrites(k); if (!L.length || !L.every(x => x.l.envoiIA && x.l.envoiIA.le === ev.le && x.l.envoiIA.texte === x.l.texte)) return false;
  const apres = o => !!(o && o.le && o.le >= ev.le); return !apres(rec.charge) && !apres(rec.stickersIA) && !apres(rec.remarquesIA) && !(ev.retour && ev.retour >= ev.le);
}
/* le nom du fichier dit ce qu'il contient : la rédaction, la classe, l'envoi (2 sur 4) ou le renvoi, le nombre de copies, la date et l'heure */
function rcNomEnvoi(p) {
  const d = new Date(), z = v => String(v).padStart(2, "0"), sl = v => (typeof scSlug === "function" ? scSlug(v) : String(v || "").replace(/[^A-Za-z0-9]+/g, "-"));
  return [sl((typeof SUJET === "object" && SUJET && SUJET.titre) || "Redaction").slice(0, 40).replace(/-$/, ""), sl(RU.classe || "classe"), p.renvoi ? "renvoi" : "envoi-" + p.rang + "-sur-" + Math.max(p.rang, p.total),
    p.n + "-copie" + (p.n > 1 ? "s" : "") + (p.seuls === p.n ? "-stickers-seuls" : ""), d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()), z(d.getHours()) + "h" + z(d.getMinutes())].join("_") + ".json";
}
const RC_CONSIGNE_FICHIER = " Rends ton travail dans un fichier JSON nommé « corrige_ » suivi exactement du nom donné dans « fichier ».";
/* plusieurs retours de l'IA choisis d'un coup : chargés l'un après l'autre ; le message dit, fichier par fichier, ce qui s'est chargé */
function rcIAChargerPlusieurs(fs) {
  const msg = RC.ui.querySelector("#rcIAMessage"), R = []; msg.textContent = "Vérification de " + fs.length + " fichiers…"; msg.className = "rc-ia-msg";
  fs.sort((a, b) => a.name.localeCompare(b.name)).reduce((p, f) => p.then(() => f.text().then(t => { try { rcIAChargerSuite(t); } catch (e) { msg.textContent = "Rien n’a changé : le retour de l’IA n’a pas la forme attendue (" + (e && e.message || e) + ")."; } R.push(f.name + " : " + msg.textContent); })), Promise.resolve())
    .then(() => { msg.textContent = R.join("\n"); msg.style.whiteSpace = "pre-line"; msg.className = "rc-ia-msg " + (R.every(x => /: Chargé/.test(x)) ? "ok" : "ko"); msg.scrollIntoView({ block: "nearest" }); });
}
function rcEtatIA() {
  if (!RC.ui || !RC.copie) return; const L = rcLignesEcrites(RC.copie), e = RC.ui.querySelector("#rcIAEtat"); if (!e) return;
  const c = rcCompteIA(), classe = !c.rec ? "" : c.aFaire ? "Corrigé de l’IA : " + c.ok + " copie" + (c.ok > 1 ? "s" : "") + " sur " + c.rec + " · " + c.aFaire + " à exporter (" + c.envois + " envoi" + (c.envois > 1 ? "s" : "") + " de " + RC_PAQUET_IA + " au plus)" : "Toutes tes copies recopiées ont leur corrigé de l’IA, à jour (" + c.rec + ")";
  const avec = L.filter(x => typeof x.l.corrige === "string");
  const f = avec.reduce((s, x) => s + rcEcarts(x.l.texte, x.l.corrige).fautes, 0), change = avec.filter(x => x.l.texte !== x.l.corrigeDe).length, sans = L.length - avec.length;
  const ici = !avec.length ? "" : "cette copie : " + f + " faute" + (f > 1 ? "s" : "") + " proposée" + (f > 1 ? "s" : "") + (change ? " · " + change + " ligne" + (change > 1 ? "s" : "") + " changée" + (change > 1 ? "s" : "") + " depuis" : "") + (sans ? " · " + sans + " sans corrigé" : "");
  const F = SC.copies.map(rcFluxCopie).filter(f => f.lignes), env = F.filter(f => f.envoi || f.charge).length, ch = F.filter(f => f.charge).length, fin = F.filter(f => f.fini).length;
  const finies = F.filter(f => f.finie).length, flux = F.length ? "Le flux : " + F.length + " recopiée" + (F.length > 1 ? "s" : "") + " · " + env + " envoyée" + (env > 1 ? "s" : "") + " · " + ch + " chargée" + (ch > 1 ? "s" : "") + " · " + fin + " bande" + (fin > 1 ? "s" : "") + " finie" + (fin > 1 ? "s" : "") + (finies < F.length ? " · la phrase qui m’a marqué : " + finies + " sur " + F.length : "") : "";
  const g = typeof stGardeExport === "function" ? stGardeExport() : null; { const b = RC.ui.querySelector("#rcExportIA");   // [C14 1.4.18] (C14 565) l'export grisé dit sa raison, à l'écran
    const rv = RC.ui.querySelector("#rcRenvoyerIA"); if (rv) rv.hidden = !c.attente;   // [C14 1.4.19] (C14 571)
    if (b) { b.classList.toggle("rc-gris", !!g); b.setAttribute("aria-disabled", g ? "true" : "false"); b.title = g ? "Pas encore : " + g + ". L’export partira quand le sujet sera complet." : "Télécharger un fichier pour l’IA : ta consigne, puis tes copies recopiées, numérotées, sans aucun nom. Donne-le à l’IA, elle te rend le même fichier corrigé."; }
  }
  e.textContent = [g ? "⇪ L’export attend : " + g : "", flux, c.aFaire && !g ? c.aFaire + " à exporter (" + c.envois + " envoi" + (c.envois > 1 ? "s" : "") + " de " + RC_PAQUET_IA + " au plus)" : "", c.attente ? c.attente + " en attente de leur retour" : "", ici].filter(Boolean).join(" · ");
  if (RC.fluxOuvert) rcFluxRendre();
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
  const col = new Array(w).fill(0), enc = new Uint8Array(w * h), parRang = new Array(h).fill(0); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const j = (y * w + x) * 4, r = px[j], g = px[j + 1], b = px[j + 2]; const l = r + g + b; if ((b - r > 12 && l < papier * 0.8) || l < papier * 0.35) { if (y >= ya && y < yb) col[x]++; enc[y * w + x] = 1; parRang[y]++; } }
  for (let y = 0; y < h; y++) if (parRang[y] > 0.5 * w) enc.fill(0, y * w, (y + 1) * w);
  /* [C14 1.4.7] (Paul 15:41 : le cadre encore collé en haut de la bande) : les traits verticaux du cahier traversent toute la hauteur lue et
     reliaient le mot au haut et au bas de la bande ; une colonne d'encre sur les trois quarts de la hauteur est un trait du cahier : elle ne relie rien,
     et ne compte pas comme un mot */
  for (let x = 0; x < w; x++) { let n = 0; for (let y = 0; y < h; y++) n += enc[y * w + x]; if (n >= 0.75 * h) { for (let y = 0; y < h; y++) enc[y * w + x] = 0; col[x] = 0; } }   // [C14 1.4.6] un rang d'encre sur presque toute la ligne est un trait du cahier : il ne relie rien   // 1.4.3 : l'encre est bleue (ou très sombre) ; le quadrillage et les ombres, non
  const seuil = Math.max(2, Math.round((yb - ya) * 0.05)), runs = []; for (let x = 0; x < w; x++) if (col[x] >= seuil) { const a = x; while (x < w && col[x] >= seuil) x++; if (x - a >= 2) runs.push([a, x]); }
  if (!runs.length) return (RC.encre[cle] = null);
  const r = [(x0 + runs[0][0]) / im.w, (x0 + runs[runs.length - 1][1]) / im.w];
  r.traits = runs.map(([a, b]) => [(x0 + a) / im.w, (x0 + b) / im.w]);
  /* [C14 1.4.6] (Paul 15:12 : « il faut que l'app ignore les pieds de lettres de la ligne supérieure ») : le haut et le bas d'un mot se suivent
     trait par trait depuis le corps de ses lettres ; les jambages de la ligne du dessus, qui ne le touchent pas, ne comptent plus ; jamais plus haut
     qu'une hampe (0,62 interligne au-dessus de la ligne). Sans encre sous le mot visé : la hauteur du corps des lettres de la ligne. */
  const vu = new Uint8Array(w * h), plafond = Math.max(0, Math.floor((Math.min(L.y0, L.y1) - 0.62 * pas) * im.h) - y0), etendue = (u0, u1) => {
    const a = Math.max(0, Math.floor(u0 * im.w) - x0 - 2), b = Math.min(w, Math.ceil(u1 * im.w) - x0 + 2); if (b <= a) return null;
    vu.fill(0); const pile = []; for (let y = ya; y < yb; y++) for (let x = a; x < b; x++) if (enc[y * w + x]) { vu[y * w + x] = 1; pile.push(y * w + x); }
    if (!pile.length) return null; let hh = h, bb = -1;
    while (pile.length) { const q = pile.pop(), y = (q / w) | 0, x = q - y * w; if (y < hh) hh = y; if (y > bb) bb = y;
      for (let dy = -3; dy <= 3; dy++) for (let dx = -1; dx <= 1; dx++) { const ny = y + dy, nx = x + dx; if ((!dy && !dx) || ny < plafond || ny >= h || nx < a || nx >= b) continue; const v = ny * w + nx; if (enc[v] && !vu[v]) { vu[v] = 1; pile.push(v); } } }
    return [hh, bb];
  };
  r.haut = (u0, u1) => { const v = etendue(u0, u1); return v ? (y0 + v[0]) / im.h : null; };
  r.bas = (u0, u1) => { const v = etendue(u0, u1); return v ? (y0 + v[1]) / im.h : null; };
  r.corps = [(y0 + ya) / im.h, (y0 + yb) / im.h];
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
  if ((a.st || a.rq || /^(stk|rq):/.test(a.cle || "")) && !type.manque && e.traits) { const cm = rcCalerMots(e, L.texte, x0, x1, c0, c1, u); x0 = cm[0]; x1 = cm[1]; }
  const ici = L.places && L.places[a.cle]; if (ici) { x0 = ici.x0; x1 = ici.x1; }
  const hh = e.haut && e.haut(x0 - (type.manque ? 0.015 : 0), x1 + (type.manque ? 0.015 : 0)), bb = e.bas && e.bas(x0 - (type.manque ? 0.015 : 0), x1 + (type.manque ? 0.015 : 0));
  return { x0, x1, y0: hh != null ? hh - 0.003 : e.corps ? e.corps[0] : yv(x0) - 0.012, y1: bb != null ? bb + 0.003 : e.corps ? e.corps[1] : yv(x1) + 0.004, encre: e, type };
}
/* [C14 1.4.17] (Paul 01/11 15:09, C14 464 : les cadres coupaient des mots, « froi|d », « jambe|s ») : le cadre d'un sticker ou d'une remarque prend ses mots
   entiers ; chaque bord se cale sur le blanc entre deux mots le plus proche, mesuré sur la photo (les traits d'encre de la ligne) ; au bout de la ligne, sur l'encre */
function rcCalerMots(e, texte, x0, x1, c0, c1, u) {
  const tr = e && e.traits; if (!tr || !tr.length) return [x0, x1];
  /* les mots de la ligne comme l'élève les écrit : les morceaux entre deux blancs de ta recopie, la ponctuation collée au mot d'avant (« Louise, », « j'écris ») */
  const T = String(texte || ""), W = [], re = /\S+/g; let m; while ((m = re.exec(T))) { if (W.length && /^[.,;:!?…»)\]]+$/.test(m[0])) W[W.length - 1].b = m.index + m[0].length; else W.push({ a: m.index, b: m.index + m[0].length }); }
  const bl = []; for (let i = 0; i + 1 < tr.length; i++) bl.push({ g: tr[i][1], d: tr[i + 1][0], l: tr[i + 1][0] - tr[i][1] });
  const tri = bl.map(b => b.l).sort((p, q) => q - p), n = W.length, i0 = W.findIndex(w => c0 < w.b), i1 = W.findIndex(w => Math.max(c0, c1 - 1) < w.b);
  /* 1. les mots d'encre : entre deux mots de ta recopie, le blanc de la photo qui est à la fois large et près de la place attendue (le meilleur choix, dans l'ordre,
     pour toute la ligne ; un grand blanc laissé par du blanc correcteur ne décale plus les mots qui suivent) ; le passage prend ses mots d'encre entiers */
  if (n >= 1 && i0 >= 0 && i1 >= i0 && bl.length >= n - 1) { let S = null;
    if (n === 1) S = [[e[0], e[1]]];
    else if (typeof u === "function") {
      /* [C14, la nuit du 02/11] (C14 479, 535 : sur le blanc correcteur, des cadres décalés d'un mot) : les mots d'encre se choisissent pour que chaque mot ait
         la largeur que ses lettres demandent (« qui » étroit, « rations » large), et que les blancs choisis soient larges ; un grand blanc (le blanc correcteur)
         peut séparer deux mots sans tirer les suivants vers la gauche. La place attendue ne compte plus qu'un peu, pour départager. */
      const K = n - 1, G = bl.length, lmax = tri[0] || 1, poids = ch => ch === " " ? 1.3 : "iljtf.,;:'’!|ïî-".includes(ch) ? 0.55 : "mwMW".includes(ch) ? 1.45 : ch !== ch.toLowerCase() ? 1.25 : 1;
      const om = W.map(w => { let s = 0; for (const ch of T.slice(w.a, w.b)) s += poids(ch); return Math.max(0.5, s); }), somme = om.reduce((a, b) => a + b, 0);
      const E = tr[tr.length - 1][1] - tr[0][0], s0 = Math.max(1e-4, (E - tri.slice(0, K).reduce((a, b) => a + b, 0)) / somme), est = W.slice(1).map(w => u(w.a));
      const mot = (k, a, b) => { const r = Math.max(1e-4, b - a) / (s0 * om[k]); return Math.log(r) ** 2; }, blanc = j => -0.6 * Math.log(Math.max(1e-4, bl[j].l) / lmax), place = (k, j) => 0.15 * (((bl[j].g + bl[j].d) / 2 - est[k]) / 0.1) ** 2;
      const f = [], de = []; for (let k = 0; k < K; k++) { f.push(new Array(G).fill(Infinity)); de.push(new Array(G).fill(-1)); }
      for (let j = 0; j < G; j++) f[0][j] = mot(0, tr[0][0], bl[j].g) + blanc(j) + place(0, j);
      for (let k = 1; k < K; k++) for (let j = k; j < G; j++) { let best = Infinity, bj = -1; for (let q = k - 1; q < j; q++) { if (!isFinite(f[k - 1][q])) continue; const v = f[k - 1][q] + mot(k, bl[q].d, bl[j].g); if (v < best) { best = v; bj = q; } } if (bj >= 0) { f[k][j] = best + blanc(j) + place(k, j); de[k][j] = bj; } }
      let jb = -1, vb = Infinity; for (let j = K - 1; j < G; j++) { if (!isFinite(f[K - 1][j])) continue; const v = f[K - 1][j] + mot(K, bl[j].d, tr[tr.length - 1][1]); if (v < vb) { vb = v; jb = j; } }
      if (jb >= 0 && isFinite(vb)) { const pick = new Array(K); for (let k = K - 1; k >= 0; k--) { pick[k] = jb; jb = de[k][jb]; } if (pick.every(x => x >= 0)) { S = []; let st = e[0]; pick.forEach(x => { S.push([st, bl[x].g]); st = bl[x].d; }); S.push([st, e[1]]); } } }
    if (S && S[i0] && S[i1] && S[i1][1] > S[i0][0] + 0.005) return [S[i0][0] - 0.003, S[i1][1] + 0.003]; }
  /* 2. sinon, chaque bord sur le blanc entre deux mots le plus proche ; au bout de la ligne, sur l'encre */
  const nMots = Math.max(1, n), seuil = tri.length ? 0.6 * tri[Math.min(tri.length - 1, Math.max(0, nMots - 2))] : 0, B = bl.filter(b => b.l >= seuil), mi = b => (b.g + b.d) / 2;
  const proche = x => B.reduce((r, b) => !r || Math.abs(mi(b) - x) < Math.abs(mi(r) - x) ? b : r, null), premier = i0 === 0, dernier = i1 === n - 1;
  let a = x0, z = x1;
  if (premier) a = e[0]; else { const b = proche(x0); if (b && Math.abs(mi(b) - x0) < 0.05) a = b.d; }
  if (dernier) z = e[1]; else { const b = proche(x1); if (b && Math.abs(mi(b) - x1) < 0.05) z = b.g; }
  return z > a + 0.01 ? [a - 0.003, z + 0.003] : [x0, x1];
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
/* [C14 1.4.12] (Paul 23:09, « 324 ok mais préparer le terrain ») : la notion précise que le moteur de la dictée trouve à une faute
   (G-CONJ, G-PP, un homophone…), gardée avec la faute pour brancher la taxonomie plus tard sans rien recorriger ; null quand il ne sait pas */
function rcNotion(g) {
  const e = rcRecoller(g.eleve), c = rcRecoller(g.corrige); if (!e || !c) return null;
  const E = e.split(/\s+/), K = c.split(/\s+/), paires = E.length === K.length ? E.map((x, i) => [x, K[i]]).filter(p => p[0] !== p[1]) : [[e, c]];
  for (const p of paires) { let r = null; try { r = GRAMM.classify(p[0], p[1]); } catch (x) {} if (r && r.code) return { code: r.code, regle: r.rule || null }; }
  return null;
}
/* [C14 1.4.10] le type donné par l'IA pour cet arrêt, s'il est là et à jour ; sinon le moteur de la dictée */
function rcCodeArret(a) { const l = a && a.l, t = l && l.types && l.typesDe === l.corrige && l.types[a.cle]; return RC_TYPES[t] ? t : rcCodeFaute(a.g); }
function rcStyleArret(a) { return a && a.st ? stStyle(a) : RC_TYPES[rcCodeArret(a)]; }
function rcPosMots(t) { const T = rcTokenize(t || ""), P = []; let i = 0; T.forEach(w => { const j = t.indexOf(w, i); P.push([j, j + w.length]); i = j + w.length; }); return P; }
function rcArretsBande(k) { return rcArrets(k).concat(typeof stArrets === "function" ? stArrets(k) : []); }   // [C14 1.4.16] après les fautes, les stickers proposés
function rcArrets(k) {
  const A = []; rcLignesEcrites(k).forEach((x, i) => { const l = x.l; if (typeof l.corrige !== "string" || l.texte !== l.corrigeDe) return;
    rcEcarts(l.texte, l.corrige).segs.forEach(g => A.push({ k, pid: x.pid, id: x.id, n: i + 1, g, cle: g.de + "-" + g.a + "/" + g.de2 + "-" + g.a2, l })); });
  return A;
}
/* [C14 1.4.12] ⇧R, le mot par mot (C14 183 « ⇧R = la dictée », C14 196 : F = faute, Entrée et Espace = le mot est correct, comme en dictée) :
   chaque mot et chaque ponctuation des lignes écrites, dans l'ordre de la copie ; un mot pris dans une faute proposée par l'IA porte cette faute (w.ia) */
const RC_NEUTRE = { couleur: "#6b7280", fond: "#f3f4f6", libelle: "Faute oubliée par l’IA" };
function rcMotsCopie(k, A) {
  const W = []; rcLignesEcrites(k).forEach((x, i) => { const l = x.l, P = rcPosMots(l.texte);
    P.forEach((p, m) => { const mot = l.texte.slice(p[0], p[1]), ia = (A || []).find(a => !a.st && a.id === x.id && a.g.a > a.g.de && m >= a.g.de && m < a.g.a) || null;
      W.push({ k, pid: x.pid, id: x.id, n: i + 1, l, mot: true, m, g: { de: m, a: m + 1, de2: m, a2: m + 1, eleve: mot, corrige: mot }, cle: "mot-" + m, ia }); }); });
  return W;
}
function rcBandeCourant() { const B = RC.bd; return !B ? null : B.mot ? B.W[B.j] : B.A[B.i]; }
function rcBandeCible() { const a = rcBandeCourant(); return a && a.mot && a.ia ? a.ia : a; }   // le cadre d'un mot pris dans une faute de l'IA est celui de la faute
function rcOubliee(w) { const mk = w.l.marquesBande && w.l.marquesBande[w.cle], m = mk && scCopie(w.k).marques[mk]; return m && m.bande && m.bande.oubliee ? m : null; }
/* F sur un mot que l'IA n'a pas proposé : une faute oubliée par l'IA, sans type (G et L n'existent pas en rédaction) ; F une deuxième fois la retire */
function rcBandeOubliee(w) {
  const s = scCopie(w.k), deja = rcOubliee(w);
  if (deja) { scEffacer(deja.id); rcLigneMaj(w.k, w.pid, w.id, l => { ["marquesBande", "decisions", "places"].forEach(f => { if (l[f] && l[f][w.cle] != null) { l[f] = Object.assign({}, l[f]); delete l[f][w.cle]; } }); }); saveState(); return false; }
  const q = rcPlaceSeg(w);
  const m = { page: w.pid, forme: "faute", sens: "lieu", passe: "langue", point: "orthographe", q: null, x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, bonne: null, bande: { ligne: w.id, cle: w.cle, eleve: w.g.eleve, corrige: null, type: q.type.nom, code: null, oubliee: true } };
  scPoser(m); rcLigneMaj(w.k, w.pid, w.id, l => { l.marquesBande = Object.assign({}, l.marquesBande, { [w.cle]: m.id }); l.decisions = Object.assign({}, l.decisions, { [w.cle]: "o" }); });
  saveState(); return true;
}
/* ⇧R : des arrêts au mot par mot, sur le mot de l'arrêt ; du mot par mot aux arrêts, sur l'arrêt le plus proche du mot */
function rcBandeBasculer() {
  const B = RC.bd; if (!B || B.attente) return;
  if (!B.mot) { const a = B.A[B.i]; B.W = rcMotsCopie(B.k, B.A); let j = 0;
    if (a) { j = B.W.findIndex(w => w.id === a.id && w.m >= a.g.de); if (j < 0) { const L = B.W.map((w, t) => w.id === a.id ? t : -1).filter(t => t >= 0); j = L.length ? L[L.length - 1] : 0; } }
    B.mot = true; B.j = Math.max(0, j); }
  else { const w = B.W[B.j], rang = x => [rcLignesEcrites(B.k).findIndex(y => y.id === x.id), x.g.de];
    let i = B.A.length; if (w) { const r = rang(w); i = B.A.findIndex(a => { const q = rang(a); return q[0] > r[0] || (q[0] === r[0] && q[1] >= r[1]); }); if (i < 0) i = B.A.length ? B.A.length - 1 : 0; }
    B.mot = false; B.i = i; }
  B.note = ""; rcBandeRendre();
}
function rcBandeMotClavier(ev) {
  const B = RC.bd, w = B.W[B.j], seul = !ev.ctrlKey && !ev.metaKey && !ev.altKey;
  if ((ev.key === "Enter" || ev.key === " ") && seul) { ev.preventDefault(); if (w) { B.j++; B.note = ""; rcBandeRendre(); } return true; }
  if ((ev.key === "f" || ev.key === "F") && seul && !ev.shiftKey) { ev.preventDefault(); if (!w) return true;
    if (w.ia) { const d = w.ia.l.decisions && w.ia.l.decisions[w.ia.cle]; rcDeciderArret(B.k, w.ia, d === "o" ? "n" : "o"); if (d !== "o") B.j++; B.note = d === "o" ? "Faute de l’IA refusée." : ""; }
    else { const cree = rcBandeOubliee(w); if (cree) B.j++; B.note = cree ? "" : "Faute retirée."; }
    rcBandeRendre(); return true; }
  if ((ev.key === "n" || ev.key === "N") && seul) { ev.preventDefault(); if (w && w.ia) { rcDeciderArret(B.k, w.ia, "n"); B.j++; B.note = ""; } else B.note = "N : seulement sur un mot proposé par l’IA."; rcBandeRendre(); return true; }
  if (ev.key === "Backspace") { ev.preventDefault(); B.j = Math.max(0, B.j - 1); B.note = ""; rcBandeRendre(); return true; }
  return false;
}
/* [C14 1.4.12] (Paul 31/10 23:09 : « si je viens retoucher une recopie après avoir validé l'erreur dans la bande, il faut que ce soit rétroactif
   bien sûr. Une modif change partout. ») : une ligne retapée après le corrigé de l'IA garde ce corrigé ; tes réponses de la bande suivent les mots
   qui n'ont pas changé ; la marque d'un mot qui a changé disparaît ; un mot nouveau que l'IA n'a pas vu devient un arrêt de la bande. */
function rcAligner(A, B) {   // les mots gardés d'un texte à l'autre (plus longue suite commune) : m[i] = la place du mot i dans B, ou -1
  const n = A.length, p = B.length, T = Array.from({ length: n + 1 }, () => new Array(p + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = p - 1; j >= 0; j--) T[i][j] = A[i] === B[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
  const m = new Array(n).fill(-1); let i = 0, j = 0; while (i < n && j < p) { if (A[i] === B[j]) { m[i] = j; i++; j++; } else if (T[i + 1][j] >= T[i][j + 1]) i++; else j++; }
  return m;
}
function rcRetroactif(k, pid, id) {
  const pg = ((scCopie(k).recopie || {}).pages || {})[pid], L0 = (RC.copie === k && RC.documents[pid] && RC.documents[pid].lignes[id]) || (pg && pg.lignes[id]);
  if (!L0 || typeof L0.corrige !== "string" || typeof L0.corrigeDe !== "string" || L0.texte === L0.corrigeDe) return false;
  const ancien = L0.corrigeDe, nouveau = L0.texte || "", corr = L0.corrige;
  if (rcRessemblance(ancien, nouveau) < RC_RESSEMBLANCE_IA) return false;   // une ligne qui a trop changé (une autre ligne, ou une moitié ajoutée) repart chez l'IA au prochain export
  const sig = segs => { const c = {}; return segs.map(x => { const b = x.eleve + "→" + x.corrige; c[b] = (c[b] || 0) + 1; return b + "#" + c[b]; }); };
  const anc = rcEcarts(ancien, corr).segs, nouv = rcEcarts(nouveau, corr).segs, sA = sig(anc), sN = sig(nouv), map = {};
  sA.forEach((v, i) => { const j = sN.indexOf(v); if (j >= 0) map[rcCle(anc[i])] = rcCle(nouv[j]); });
  const mots = t => rcPosMots(t).map(p => t.slice(p[0], p[1])), mm = rcAligner(mots(ancien), mots(nouveau));
  const re = o => { const r = {}; Object.keys(o || {}).forEach(x => { if (map[x]) r[map[x]] = o[x]; else if (/^stk:/.test(x)) r[x] = o[x]; else { const m = /^mot-(\d+)$/.exec(x); if (m && mm[+m[1]] >= 0) r["mot-" + mm[+m[1]]] = o[x]; } }); return r; };   // [C14 1.4.16] un sticker de la ligne reste
  const s = scCopie(k), mb = re(L0.marquesBande), gardees = new Set(Object.values(mb)), typesAJour = L0.types && L0.typesDe === corr, types = typesAJour ? re(L0.types) : null;
  Object.values(L0.marquesBande || {}).forEach(mid => { if (!gardees.has(mid) && s.marques[mid]) scEffacer(mid); });
  rcLigneMaj(k, pid, id, l => { l.corrigeDe = nouveau; l.decisions = re(l.decisions); l.marquesBande = mb; l.places = re(l.places); if (l.placesApp) l.placesApp = re(l.placesApp); if (typesAJour) l.types = types; l.retoucheeLe = new Date().toISOString(); });
  const Lf = (RC.copie === k && RC.documents[pid] && RC.documents[pid].lignes[id]) || pg.lignes[id], P = rcPosMots(nouveau);
  Object.keys(mb).forEach(c => { const m = s.marques[mb[c]]; if (!m) return; const mo = /^mot-(\d+)$/.exec(c), g = mo ? (w => ({ de: w, a: w + 1, de2: w, a2: w + 1, eleve: nouveau.slice(P[w][0], P[w][1]), corrige: nouveau.slice(P[w][0], P[w][1]) }))(+mo[1]) : nouv.find(x => rcCle(x) === c);
    if (!g || (mo && !P[+mo[1]])) return; const q = rcPlaceSeg({ k, pid, id, l: Lf, g, cle: c }); Object.assign(m, { x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, modifieLe: new Date().toISOString() }); if (m.bande) { m.bande.cle = c; m.bande.eleve = g.eleve; } });
  if (typeof stRetroactif === "function") stRetroactif(k, pid, id, mm, Lf);
  scNumeroter(k); saveState(); return true;
}
/* [C14 1.4.13] la photo d'une page remplacée (scRemplacerAvec) : les lignes de ta recopie se posent, dans l'ordre, sur les lignes trouvées dans la nouvelle photo ;
   leurs identités, leurs textes, le corrigé de l'IA et tes réponses ne bougent pas ; les cadres glissés sur l'ancienne photo sont oubliés ; les marques de la bande et la phrase se replacent */
function rcRecalerPage(k, pid) {
  const s = scCopie(k), st = s.recopie && s.recopie.pages && s.recopie.pages[pid]; if (!st) return "";
  const doc = (RC.copie === k && RC.documents[pid]) || st, im = SC.imgs[pid]; if (!im || !im.el.naturalWidth) return "";
  const cv = document.createElement("canvas"); cv.width = im.w; cv.height = im.h; cv.getContext("2d").drawImage(im.el, 0, 0);
  const tr = scLignes(cv, { recopie: true }), p = SC.pages[pid], L = ((tr.fiable !== false ? tr.l : (p.lignes && p.lignes.l)) || []).filter(l => l.ecrite !== false), marge = rcMargeRouge(cv), bord = rcBordDroit(cv);
  doc.marge = marge ? { xh: rcBorne(marge(0), 0.01, 0.6), xb: rcBorne(marge(1), 0.01, 0.6) } : { xh: 0.15, xb: 0.15, absente: true };
  const pose = (l, n) => { const yl = rcBorne(n.y, 0, 1); Object.assign(l, { x0: marge ? rcBorne(marge(yl) - 0.008, 0, 0.97) : rcBorne(n.x0, 0, 0.97), x1: bord || rcBorne(n.x1, 0.03, 1), y0: yl, y1: yl }); delete l.recale; delete l.places; delete l.placesApp; };
  const ids = rcListe(doc.ordre).filter(id => doc.lignes[id] && !doc.lignes[id].retiree).sort((a, b) => (doc.lignes[a].y0 + doc.lignes[a].y1) - (doc.lignes[b].y0 + doc.lignes[b].y1));
  ids.forEach((id, i) => { if (L[i]) pose(doc.lignes[id], L[i]); });
  for (let i = ids.length; i < L.length; i++) { const id = scId("ligne"); doc.lignes[id] = { id, texte: "" }; pose(doc.lignes[id], L[i]); doc.ordre = rcListe(doc.ordre).concat(id); }
  doc.modifieLe = new Date().toISOString(); s.recopie.pages[pid] = JSON.parse(JSON.stringify(doc)); if (RC.documents) delete RC.documents[pid]; RC.encre = {};
  rcReplacerBande(k);
  /* les fautes oubliées par l'IA (clé « mot-n ») et la phrase qui m'a marqué se replacent sur leurs mots */
  rcLignesEcrites(k).filter(x => x.pid === pid).forEach(x => Object.keys(x.l.marquesBande || {}).filter(c => /^mot-\d+$/.test(c)).forEach(c => { const m = s.marques[x.l.marquesBande[c]], w = +c.slice(4), P = rcPosMots(x.l.texte); if (!m || !P[w]) return;
    const mot = x.l.texte.slice(P[w][0], P[w][1]), q = rcPlaceSeg({ k, pid, id: x.id, l: x.l, g: { de: w, a: w + 1, de2: w, a2: w + 1, eleve: mot, corrige: mot }, cle: c }); Object.assign(m, { x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, modifieLe: new Date().toISOString() }); }));
  if (s.recopie.phrase && s.recopie.phrase.debut) rcPhraseReposer(k);
  scNumeroter(k); saveState();
  return " ; " + (ids.length <= L.length ? "les " + ids.length + " lignes de ta recopie recalées sur la nouvelle photo" : ids.length + " lignes recopiées, " + L.length + " trouvées sur la nouvelle photo : vérifie les poignées vertes des dernières");
}
function rcLigneMaj(k, pid, id, fn) { const pgs = (scCopie(k).recopie || {}).pages || {}; [pgs[pid] && pgs[pid].lignes[id], RC.copie === k && RC.documents[pid] && RC.documents[pid].lignes[id]].forEach(l => { if (l) fn(l); }); }
function rcNoteTexte(k) { const r = scNote(k); return r.ok ? (Math.round(r.n * 10) / 10) + " / " + r.tot : "incomplète"; }
function rcBandeOuvrir(reprise) {
  if (RC.page && !reprise) rcGarder(); const k = RC.copie; rcSeparerAnciens(k); rcLignesEcrites(k).forEach(x => rcRetroactif(k, x.pid, x.id)); const A = rcArretsBande(k);
  if (!A.length && !(typeof stRqARelire === "function" && stRqARelire(k))) { toast("Pas de faute ni de sticker proposés sur cette copie : charge d’abord le corrigé de l’IA."); return; }   // [C14] (trouvé par le banc de la sauvegarde) une copie sans arrêt mais avec des remarques de l'IA : la bande s'ouvre sur leur relecture, sinon l'élève ne les lirait jamais
  RC.bd = { k, i: 0, A }; aidePoser("bande"); rcBandeSouris(); RC.ui.classList.add("rc-mode-bande"); RC.ui.querySelector("#rcBandeOuvrir").textContent = "■ Fermer la bande";
  RC.ui.querySelector("#rcBandeTitre").textContent = "La bande de " + nomEleveDe(k); if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  rcReplacerBande(k);
  const s = scCopie(k), anc = Object.values(s.marques).filter(m => m.forme === "faute" && !m.bande).length, av = RC.ui.querySelector("#rcBandeAvis");
  if (anc && !s.bandeDebut) {
    RC.bd.attente = true; av.hidden = false;
    av.innerHTML = "<b>Cette copie a " + anc + " faute" + (anc > 1 ? "s" : "") + " marquée" + (anc > 1 ? "s" : "") + " avec la méthode d’avant.</b> En passant la bande, elles sont mises de côté : gardées, cachées, elles ne comptent plus. Note avant : <b>" + escapeHtml(rcNoteTexte(k)) + "</b>. <button id=\"rcBandeCommencer\" class=\"sc-btn\" title=\"Mettre de côté les fautes d’avant et commencer la bande (Entrée)\">Commencer la bande</button>";
    av.querySelector("#rcBandeCommencer").onclick = rcBandeCommencer;
  } else { av.hidden = true; if (!s.bandeDebut) rcBandeCommencer(); }
  const i = A.findIndex(a => a.st ? !stDecision(k, a.stId) : !(a.l.decisions && a.l.decisions[a.cle])); RC.bd.i = i >= 0 ? i : 0;
  /* [C14 1.4.7] (Paul 15:41 : « si je commence la bande, que je fais deux mots, je dois retomber à ce même mot ») : l'arrêt où tu étais, pour chaque élève */
  const ba = (scCopie(k).recopie || {}).bandeArret;
  if (ba && ba.mot) { const B = RC.bd; B.mot = true; B.W = rcMotsCopie(k, A); let j = ba.fin ? B.W.length : B.W.findIndex(w => w.id === ba.id && w.cle === ba.cle); if (j < 0) j = Math.max(0, B.W.findIndex(w => w.id === ba.id)); B.j = j; }   // [C14 1.4.12] rouverte en mot par mot, au même mot
  else if (ba && ba.fin) RC.bd.i = i >= 0 ? i : A.length; else if (ba) {   /* [C14] (trouvé par le banc de la sauvegarde) une bande finie le reste, sauf un arrêt nouveau (une ligne retapée) : elle s'ouvre sur lui */ let j = A.findIndex(a => a.id === ba.id && a.cle === ba.cle); if (j < 0) j = A.findIndex(a => a.id === ba.id); if (j >= 0) RC.bd.i = j; }
  rcBookmark(); rcBandeRendre(); if (typeof svVerifier === "function") svVerifier();   // [C14] une copie rouverte avec un arrêt de plus (une ligne retapée) n'est plus finie : la sauvegarde se reproposera quand elle le sera
}
function rcBandeMemoriser() {
  const B = RC.bd; if (!B || B.attente) return; const rec = scCopie(B.k).recopie; if (!rec) return; const a = rcBandeCourant();
  const v = Object.assign(a ? { id: a.id, cle: a.cle } : { fin: true }, B.mot ? { mot: true } : {});
  if (JSON.stringify(rec.bandeArret || null) !== JSON.stringify(v)) { rec.bandeArret = v; saveState(); }
}
function rcBandeCommencer() {
  const k = RC.bd.k, s = scCopie(k); s.bandeDebut = s.bandeDebut || { le: new Date().toISOString(), noteAvant: rcNoteTexte(k) };
  s.marquesAnciennes = s.marquesAnciennes || {};
  Object.values(s.marques).filter(m => m.forme === "faute" && !m.bande).forEach(m => { s.marquesAnciennes[m.id] = m; delete s.marques[m.id]; });
  scNumeroter(k); saveState(); RC.bd.attente = false; RC.ui.querySelector("#rcBandeAvis").hidden = true; rcBandeRendre();
}
function rcBandeFermer(seul) { RC.bd = null; if (RC.ouvert) aidePoser("recopie"); if (!seul) rcBookmark(); if (RC.ui) { RC.ui.classList.remove("rc-mode-bande"); const b = RC.ui.querySelector("#rcBandeOuvrir"); if (b) b.textContent = "▶ La bande"; } if (seul) return; rcActualiser(); rcSelectionner(RC.ligne, true, true); }
function rcBandeDecider(v) {
  const B = RC.bd, a = B.A[B.i]; if (!a) return; if (a.st) stDeciderArret(B.k, a, v); else rcDeciderArret(B.k, a, v);
  B.i = Math.min(B.A.length, B.i + 1); B.note = ""; rcBandeRendre(); if (typeof svVerifier === "function") svVerifier();   // [C14] le paquet fini propose sa sauvegarde
}
function rcDeciderArret(k, a, v) {   // [C14 1.4.12] la décision d'un arrêt de l'IA, la même depuis les arrêts et depuis le mot par mot
  const B = { k }, s = scCopie(B.k), deja = a.l.marquesBande && a.l.marquesBande[a.cle];
  if (v === "o" && !(deja && s.marques[deja])) {
    const q = rcPlaceSeg(a);
    const m = { page: a.pid, forme: "faute", sens: "lieu", passe: "langue", point: "orthographe", q: null, x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, bonne: a.g.corrige || null, bande: { ligne: a.id, cle: a.cle, eleve: a.g.eleve, corrige: a.g.corrige, type: q.type.nom, code: rcCodeArret(a), notion: rcNotion(a.g) } };
    scPoser(m); rcLigneMaj(B.k, a.pid, a.id, l => { l.marquesBande = Object.assign({}, l.marquesBande, { [a.cle]: m.id }); });
  }
  if (v === "n" && deja && s.marques[deja]) scEffacer(deja);
  rcLigneMaj(B.k, a.pid, a.id, l => { l.decisions = Object.assign({}, l.decisions, { [a.cle]: v }); if (v === "n" && l.marquesBande) { l.marquesBande = Object.assign({}, l.marquesBande); delete l.marquesBande[a.cle]; } });
  saveState();
}
function rcBandeRendre() {
  const B = RC.bd, e = RC.ui; if (!B) return; const a = B.A[B.i], s = scCopie(B.k); rcBandeMemoriser();
  e.querySelector("#rcBandeTitre").textContent = "La bande de " + nomEleveDe(B.k) + (B.mot ? " · mot par mot" : "");
  const liste = e.querySelector("#rcBandeListe"), wc = B.mot ? B.W[B.j] : null, estOn = (x, i) => B.mot ? !!(wc && wc.ia === x) : i === B.i;
  liste.innerHTML = B.A.map((x, i) => { if (x.st) { const d = stDecision(B.k, x.stId), c = stCouleur(x.sticker); return '<li class="rc-st-li' + (estOn(x, i) ? " on" : "") + '" data-i="' + i + '" style="border-left-color:' + c + (estOn(x, i) ? ";background:" + c + "18" : "") + '"><span><b style="color:' + c + '">' + escapeHtml(x.sticker.num || "★") + "</b> " + escapeHtml(x.sticker.texteEleve) + "</span><small>" + (x.lettre ? "toute la lettre" : "ligne " + x.n) + (d === "o" ? " ✓" : d === "n" ? " ✗" : "") + "</small></li>"; }
    const d = x.l.decisions && x.l.decisions[x.cle]; return '<li class="' + (estOn(x, i) ? "on" : "") + '" data-i="' + i + '" style="border-left-color:' + rcStyleArret(x).couleur + (estOn(x, i) ? ";background:" + rcStyleArret(x).fond : "") + '"><span>' + escapeHtml(x.g.eleve || "∅") + " → " + escapeHtml(x.g.corrige || "∅") + '</span><small>ligne ' + x.n + (d === "o" ? " ✓" : d === "n" ? " ✗" : "") + "</small></li>"; }).join("");
  liste.querySelectorAll("li").forEach(li => li.onclick = () => { B.mot = false; B.i = +li.dataset.i; B.note = ""; rcBandeRendre(); });
  const on = liste.querySelector("li.on"); if (on) on.scrollIntoView({ block: "nearest" });
  const ctx = e.querySelector("#rcBandeContexte"), carte = e.querySelector("#rcBandeCarte"), touches = e.querySelector("#rcBandeTouches");
  { const q = e.querySelector("#rcRqListe"), h = !a && !B.attente && !B.mot && typeof stRqRelecture === "function" ? stRqRelecture(B.k) : "";   // [C14 1.4.17] les remarques, relues à la fin de la bande
    if (q) { if (q.dataset.h !== h && !q.contains(document.activeElement)) { q.innerHTML = h; q.dataset.h = h; } q.hidden = !h; } }
  carte.style.borderColor = a && !B.attente ? rcStyleArret(a).couleur : "";
  if (B.attente) { carte.innerHTML = ""; ctx.innerHTML = ""; touches.innerHTML = ""; rcBandePhoto(null); return; }
  if (B.mot) { rcBandeRendreMots(B, ctx, carte, touches); return; }
  if (a && a.st) { stBandeCarte(B, a, ctx, carte, touches); return; }
  if (!a) { if (typeof rcEtatIA === "function") rcEtatIA();   // [C14 1.4.17] le flux d'en haut se met à jour au bout de la bande
    const F = B.A.filter(x => !x.st), faites = F.filter(x => x.l.decisions && x.l.decisions[x.cle] === "o").length, Sx = B.A.filter(x => x.st), gard = Sx.filter(x => stDecision(B.k, x.stId) === "o").length, nt = Sx.length && typeof stNoteCopie === "function" ? stNoteCopie(B.k) : null;
    carte.innerHTML = '<div class="rc-bande-mot">Bande finie</div><div class="rc-bande-pied">' + faites + " faute" + (faites > 1 ? "s" : "") + " gardée" + (faites > 1 ? "s" : "") + " sur " + F.length + " arrêts" + (Sx.length ? " · " + gard + " sticker" + (gard > 1 ? "s" : "") + " gardé" + (gard > 1 ? "s" : "") + " sur " + Sx.length + " · note : " + stNb(nt.n) + " / " + stNb(nt.tot) : "") + (Sx.length ? "" : " · note avant : " + escapeHtml((s.bandeDebut && s.bandeDebut.noteAvant) || "—") + " · note maintenant : " + escapeHtml(rcNoteTexte(B.k))) + "</div>";   // [C14 1.4.17] (C14 467) avec les stickers, l'ancienne grille ne parle plus
    ctx.innerHTML = ""; touches.innerHTML = '<b class="rc-bande-mode">Les arrêts</b><span><kbd>Retour</kbd> l’arrêt d’avant</span><span><kbd>⇧</kbd> + <kbd>R</kbd> mot par mot</span><span><kbd>Ctrl</kbd> + <kbd>Z</kbd> : remettre une faute</span><span><kbd>Échap</kbd> revenir à la recopie</span>' + (B.note ? '<em class="rc-bande-note">' + escapeHtml(B.note) + "</em>" : ""); rcBandePhoto(null); return;
  }
  const P = rcPosMots(a.l.texte), d = a.l.decisions && a.l.decisions[a.cle], T = rcStyleArret(a), st = ' style="background:' + T.fond + ";color:" + (T.texte || T.couleur) + ";box-shadow:inset 0 -2px 0 " + T.couleur + '"';
  let h = "", c = 0; P.forEach((p, i) => { h += escapeHtml(a.l.texte.slice(c, p[0])); const w = escapeHtml(a.l.texte.slice(p[0], p[1])); h += i >= a.g.de && i < a.g.a ? "<mark" + st + ">" + w + "</mark>" : '<span class="rc-mot" data-m="' + i + '">' + w + "</span>"; if (a.g.a === a.g.de && i === a.g.de - 1) h += ' <mark class="rc-manque"' + st + ">∧</mark>"; c = p[1]; });
  h += escapeHtml(a.l.texte.slice(c)); if (a.g.a === a.g.de && a.g.de === 0) h = '<mark class="rc-manque"' + st + ">∧</mark> " + h;
  rcRubanTexte(ctx, B.k, a, h);
  carte.innerHTML = '<div class="rc-bande-mot"><span class="rc-eleve">' + escapeHtml(a.g.eleve || "(mot manquant)") + '</span> <span class="rc-fleche">→</span> <span class="rc-corr">' + escapeHtml(a.g.corrige || "(mot en trop)") + "</span></div><div class=\"rc-bande-pied\"><b class=\"rc-bande-type\" style=\"background:" + T.fond + ";color:" + (T.texte || T.couleur) + ";border-color:" + T.couleur + "\">" + T.libelle + "</b> " + (rcTypeFaute(a.g).nom === T.libelle ? "" : rcTypeFaute(a.g).nom + " · ") + "proposé par l’IA · ligne " + a.n + " · arrêt " + (B.i + 1) + " sur " + B.A.length + (d === "o" ? " · gardée" : d === "n" ? " · refusée" : "") + "</div>";
  touches.innerHTML = '<b class="rc-bande-mode">Les arrêts</b>' + "<span><kbd>Entrée</kbd> ou <kbd>Espace</kbd> oui, c’est une faute</span><span><kbd>N</kbd> non</span><span><kbd>Retour</kbd> l’arrêt d’avant</span><span><kbd>⇧</kbd> + <kbd>R</kbd> mot par mot</span><span>glisser le cadre, ou <kbd>←</kbd> <kbd>→</kbd> : viser</span><span><kbd>clic droit</kbd> sur le cadre : faute de ma recopie</span><span><kbd>Ctrl</kbd> + <kbd>Z</kbd> : la remettre</span><span><kbd>Échap</kbd> revenir à la recopie</span>" + (B.note ? '<em class="rc-bande-note">' + escapeHtml(B.note) + "</em>" : "");
  rcBandePhoto(a);
}
/* [C14 1.4.12] le mot par mot : la carte dit le mot, sa faute s'il en a une ; les touches de ce mode sont écrites en clair (C14 183) */
function rcBandeRendreMots(B, ctx, carte, touches) {
  const w = B.W[B.j], N = B.W.length, nOub = B.W.filter(x => rcOubliee(x)).length, note = B.note ? '<em class="rc-bande-note">' + escapeHtml(B.note) + "</em>" : "";
  const badge = T => '<b class="rc-bande-type" style="background:' + T.fond + ";color:" + (T.texte || T.couleur) + ";border-color:" + T.couleur + '">' + T.libelle + "</b>", pl = (n, m) => n + " " + m + (n > 1 ? "s" : "");
  if (!w) { const faites = B.A.filter(x => x.l.decisions && x.l.decisions[x.cle] === "o").length; carte.style.borderColor = "";
    carte.innerHTML = '<div class="rc-bande-mot">Fin de la copie, mot par mot</div><div class="rc-bande-pied">' + pl(faites, "faute") + " de l’IA gardée" + (faites > 1 ? "s" : "") + " sur " + B.A.length + " · " + pl(nOub, "faute") + " oubliée" + (nOub > 1 ? "s" : "") + " par l’IA · note maintenant : " + escapeHtml(rcNoteTexte(B.k)) + "</div>";
    ctx.innerHTML = ""; touches.innerHTML = '<b class="rc-bande-mode">Mot par mot</b><span><kbd>Retour</kbd> le mot d’avant</span><span><kbd>⇧</kbd> + <kbd>R</kbd> revenir aux arrêts</span><span><kbd>Échap</kbd> revenir à la recopie</span>' + note; rcBandePhoto(null); return; }
  const ia = w.ia, oub = rcOubliee(w), d = ia && ia.l.decisions && ia.l.decisions[ia.cle], T = ia ? rcStyleArret(ia) : RC_NEUTRE;
  carte.style.borderColor = ia || oub ? T.couleur : "";
  rcRubanTexte(ctx, B.k, w, null, T);
  carte.innerHTML = '<div class="rc-bande-mot">' + (ia ? '<span class="rc-eleve">' + escapeHtml(ia.g.eleve || "(mot manquant)") + '</span> <span class="rc-fleche">→</span> <span class="rc-corr">' + escapeHtml(ia.g.corrige || "(mot en trop)") + "</span>" : '<span class="rc-eleve' + (oub ? "" : " rc-juste") + '">' + escapeHtml(w.g.eleve) + "</span>") + '</div><div class="rc-bande-pied">'
    + (ia ? badge(T) + " proposé par l’IA" + (d === "o" ? " · gardée" : d === "n" ? " · refusée" : "") + " · " : oub ? badge(RC_NEUTRE) + " · " : "") + "ligne " + w.n + " · mot " + (B.j + 1) + " sur " + N + "</div>";
  touches.innerHTML = '<b class="rc-bande-mode">Mot par mot</b><span><kbd>Entrée</kbd> ou <kbd>Espace</kbd> le mot est correct</span><span><kbd>F</kbd> faute (encore <kbd>F</kbd> : la retirer)</span><span><kbd>N</kbd> non, sur un mot proposé par l’IA</span><span><kbd>Retour</kbd> le mot d’avant</span><span>clic sur un mot du texte : y aller</span><span><kbd>⇧</kbd> + <kbd>R</kbd> revenir aux arrêts</span><span><kbd>Échap</kbd> revenir à la recopie</span>' + note;
  rcBandePhoto(rcBandeCible());
}
/* [C14 1.4.11] (Paul 15:41 : « le texte doit s'afficher en continu aussi, autant en recopié qu'en manuscrit. Le texte complet devient une immense
   bande qui s'affiche au fur et à mesure, comme une bande qu'on passerait entre ses doigts tout en regardant toujours l'endroit entre ses doigts.
   c'est le principe de correction dictée ») : toutes les lignes écrites de la copie, bout à bout, en un seul ruban ; le mot de l'arrêt au milieu ;
   d'un arrêt à l'autre, le ruban glisse. */
function rcRubanTexte(ctx, k, a, hCourante, T) {
  let ruban = ctx.querySelector(".rc-ruban-t"); if (!ruban) { ctx.innerHTML = '<span class="rc-bande-n"></span><div class="rc-ruban"><div class="rc-ruban-t"></div></div>'; ruban = ctx.querySelector(".rc-ruban-t"); }
  ctx.querySelector(".rc-bande-n").textContent = "ligne " + a.n;
  /* [C14 1.4.12] en mot par mot (T donné) : chaque mot de chaque ligne se clique, le mot en cours est marqué */
  const mots = (x, i) => { const t = x.l.texte, P = rcPosMots(t); let h = "", c = 0; P.forEach((p, m) => { h += escapeHtml(t.slice(c, p[0])); const w = escapeHtml(t.slice(p[0], p[1])), ici = x.id === a.id && m === a.m;
    h += ici ? '<mark class="rc-mot" data-id="' + escapeAttr(x.id) + '" data-m="' + m + '" style="background:' + T.fond + ";color:" + (T.texte || T.couleur) + ";box-shadow:inset 0 -2px 0 " + T.couleur + '">' + w + "</mark>" : '<span class="rc-mot" data-id="' + escapeAttr(x.id) + '" data-m="' + m + '">' + w + "</span>"; c = p[1]; }); return h + escapeHtml(t.slice(c)); };
  ruban.innerHTML = rcLignesEcrites(k).map((x, i) => '<span class="rc-ruban-l' + (x.id === a.id ? " on" : "") + '" data-n="' + (i + 1) + '">' + (T ? mots(x, i) : x.id === a.id ? hCourante : escapeHtml(x.l.texte)) + "</span>").join('<span class="rc-ruban-sep" aria-hidden="true"></span>');
  ctx.onclick = ev => { const B = RC.bd, t = ev.target && ev.target.closest && ev.target.closest(".rc-mot[data-id]"); if (!B || !B.mot || !t) return; const j = B.W.findIndex(w => w.id === t.dataset.id && w.m === +t.dataset.m); if (j >= 0) { B.j = j; B.note = ""; rcBandeRendre(); } };
  const m = ruban.querySelector("mark") || ruban.querySelector(".rc-ruban-l.on"), boite = ctx.querySelector(".rc-ruban");
  if (m && boite) { const c = m.offsetLeft + m.offsetWidth / 2; ruban.style.transform = "translateX(" + Math.round(boite.clientWidth / 2 - c) + "px)"; }
}
function rcRubanPhoto(k) {
  const marge = 0.022, out = []; let X = 0;
  rcLignesEcrites(k).forEach((x, i) => { const L = x.l, im = SC.imgs[x.pid], ok = im && im.el.complete && im.el.naturalWidth;
    const iw = ok ? im.w : 1000, ih = ok ? im.h : 1414, sx = Math.max(0, L.x0 - 0.01) * iw, sy = Math.max(0, Math.min(L.y0, L.y1) - marge) * ih, sw = Math.min(iw - sx, (L.x1 - L.x0 + 0.02) * iw), sh = Math.min(ih - sy, (Math.abs(L.y1 - L.y0) + marge * 1.5) * ih);
    out.push({ x, i, im: ok ? im : null, sx, sy, sw, sh, X }); X += 0; });
  return out;
}
/* [C14 1.4.17] (Paul 16:28 : « La bande et le paragraphe sont deux choses qui se télescopent géographiquement ») : le ruban met les lignes bout à bout ; un sticker
   de phrase ou de paragraphe ne s'y voit pas. Pour lui, la bande montre sa zone de la page, comme l'élève la verra : un cadre par ligne, ou l'accolade */
function rcBandeZone(cv, w, a) {
  const B = RC.bd, sg = typeof stSegments === "function" ? stSegments(B.k, a, a.sticker.taille) : null, im = SC.imgs[a.pid]; if (!sg || !im || !im.el.complete || !im.el.naturalWidth) return false;
  const par = a.sticker.taille === "paragraphe", xa = Math.max(0, Math.min(...sg.map(s => s[0])) - 0.02), xb = Math.min(1, Math.max(...sg.map(s => s[2])) + (par ? 0.045 : 0.02)), ya = Math.max(0, Math.min(...sg.map(s => s[1])) - 0.012), yb = Math.min(1, Math.max(...sg.map(s => s[3])) + 0.012);
  const sx = xa * im.w, sy = ya * im.h, sw = (xb - xa) * im.w, sh = (yb - ya) * im.h, k = Math.min(w / sw, 330 / sh), h = Math.max(60, Math.round(sh * k)), ox = Math.round((w - sw * k) / 2);   // au plus 330 points de haut : la carte reste visible sous la zone
  cv.width = w; cv.height = h; cv.style.height = Math.round(h * (cv.clientWidth || w) / w) + "px"; const x = cv.getContext("2d"); x.fillStyle = "#fffdf8"; x.fillRect(0, 0, w, h); x.drawImage(im.el, sx, sy, sw, sh, ox, 0, sw * k, h);
  const X = u => ox + (u * im.w - sx) * k, Y = v => (v * im.h - sy) * k, c = stCouleur(a.sticker), boite = s => [X(s[0]) - 3, Y(s[1]) - 2, X(s[2]) - X(s[0]) + 6, Y(s[3]) - Y(s[1]) + 4];
  if (par) { sg.forEach(s => { x.fillStyle = rcRgba(c, .16); x.fillRect(...boite(s)); });
    const xr = X(Math.min(0.975, Math.max(...sg.map(s => s[2])) + 0.01)), hy = Y(Math.min(...sg.map(s => s[1]))), by = Y(Math.max(...sg.map(s => s[3])));
    x.strokeStyle = c; x.lineWidth = 4; x.beginPath(); x.moveTo(xr - 10, hy); x.lineTo(xr, hy); x.lineTo(xr, by); x.lineTo(xr - 10, by); x.stroke(); }
  else sg.forEach(s => { x.fillStyle = rcRgba(c, .12); x.strokeStyle = c; x.lineWidth = 2; x.fillRect(...boite(s)); x.strokeRect(...boite(s)); });
  B.boite = null; B.ruban = null; B.rubanCentre = null; return true;
}
function rcBandePhoto(a, anime) {
  const cv = RC.ui.querySelector("#rcBandePhoto"), w = Math.max(300, Math.round(cv.clientWidth || 800)), h = 110;
  if (a && a.st && a.g && RC.bd && ["phrase", "paragraphe"].includes(a.sticker.taille) && rcBandeZone(cv, w, a)) return;
  cv.style.height = ""; if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  const x = cv.getContext("2d"); x.fillStyle = "#fffdf8"; x.fillRect(0, 0, w, h); if (!a) { if (RC.bd) RC.bd.ruban = null; return; }
  const B = RC.bd, R = rcRubanPhoto(B.k), ecart = 26; let X = 0; R.forEach(r => { r.k = h / r.sh; r.X = X; r.W = r.sw * r.k; X += r.W + ecart; });
  const cur = R.find(r => r.x.id === a.id); if (!cur || !cur.im) { if (B) B.ruban = null; return; }
  const im = cur.im, q = rcPlaceSeg(a), Xr = u => cur.X + (u * im.w - cur.sx) * cur.k, Y = v => (v * im.h - cur.sy) * cur.k;
  const centre = B.centreFige != null ? B.centreFige : (Xr(q.x0) + Math.max(Xr(q.x1), Xr(q.x0) + 6)) / 2;   // pendant qu'une poignée bouge, le ruban ne glisse pas : le bord suit la souris
  /* le ruban glisse d'un arrêt à l'autre (un sixième de seconde), puis s'arrête sur le mot */
  const depart = anime !== false && B.rubanCentre != null && Math.abs(B.rubanCentre - centre) > 2 ? B.rubanCentre : centre; B.rubanCentre = centre;
  const dessiner = c => {
    const sh = w / 2 - c; x.fillStyle = "#fffdf8"; x.fillRect(0, 0, w, h);
    R.forEach(r => { const g = r.X + sh; if (g > w || g + r.W < 0) return;
      if (r.im) x.drawImage(r.im.el, r.sx, r.sy, r.sw, r.sh, g, 0, r.W, h); else { x.fillStyle = "#f3eee4"; x.fillRect(g, 8, r.W, h - 16); }
      x.fillStyle = "#b9ab95"; x.font = "600 11px system-ui"; x.fillText(String(r.i + 1), g + r.W + 7, 14); x.fillRect(g + r.W + ecart / 2 - 0.5, 22, 1, h - 30); });
    return sh;
  };
  const finir = () => {
    const sh = dessiner(centre), a0 = Xr(q.x0) + sh, a1 = Math.max(Xr(q.x1) + sh, a0 + 6), b0 = Math.max(2, Y(q.y0)), b1 = Math.min(h - 2, Math.max(Y(q.y1), b0 + 10));
    const cd = a.mot || a.st ? null : rcCodeArret(a), T = a.st ? stStyle(a) : a.mot ? RC_NEUTRE : RC_TYPES[cd];   // [C14 1.4.12] un mot sans faute de l'IA : un cadre gris
    x.fillStyle = rcRgba(T.couleur, .22); x.strokeStyle = T.couleur; x.lineWidth = 2; x.fillRect(a0 - 3, b0 - 3, a1 - a0 + 6, b1 - b0 + 6); x.strokeRect(a0 - 3, b0 - 3, a1 - a0 + 6, b1 - b0 + 6);
    if (q.type.manque) { const m = (a0 + a1) / 2; x.strokeStyle = T.couleur; x.lineWidth = 3; x.beginPath(); x.moveTo(m - 9, b1 + 1); x.lineTo(m, b0 + 4); x.lineTo(m + 9, b1 + 1); x.stroke(); }
    const redim = B.redim === a.id + "|" + a.cle;
    if (redim) [a0 - 3, a1 + 3].forEach(px => { x.fillStyle = "#fff"; x.strokeStyle = T.couleur; x.lineWidth = 2; x.beginPath(); x.rect(px - 5, (b0 + b1) / 2 - 13, 10, 26); x.fill(); x.stroke(); x.fillStyle = T.couleur; x.fillRect(px - 1, (b0 + b1) / 2 - 7, 2, 14); });
    B.boite = { a0: a0 - (redim ? 12 : 6), a1: a1 + (redim ? 12 : 6), g: a0 - 3, d: a1 + 3, redim, par: 1 / (cur.k * im.w), q, code: cd, bord: a0 - 3, ym: (b0 + b1) / 2 };
    B.ruban = { lignes: R.map(r => ({ id: r.x.id, X: r.X + sh, W: r.W })), centre: w / 2 };
  };
  if (depart === centre || typeof requestAnimationFrame !== "function") { finir(); return; }
  const t0 = Date.now(), duree = 170, pas = () => { if (RC.bd !== B || B.rubanCentre !== centre) return; const t = Math.min(1, (Date.now() - t0) / duree), e = t * (2 - t); if (t < 1) { dessiner(depart + (centre - depart) * e); requestAnimationFrame(pas); } else finir(); };
  finir(); dessiner(depart); requestAnimationFrame(pas);
}
/* [C14 1.4.15] (Paul 01/11 13:12 : « dans la bande, parfois la largeur du rectangle est trop longue et je n'ai pas de moyen de la raccourcir. Un double clic sur le
   rectangle doit activer deux poignées de chaque côté du rectangle pour le redimensionner en longueur ») : cote « g » ou « d » ne bouge qu'un bord ; sans cote, tout le cadre */
function rcBandeGlisser(du, cote) {
  const B = RC.bd, a = B && rcBandeCible(); if (!a || B.attente || (a.st && !a.g) || (a.st && ["phrase", "paragraphe"].includes(a.sticker.taille))) return; const q = B.boite ? B.boite.q : rcPlaceSeg(a);   // [C14 1.4.17] une phrase ou un paragraphe ne se glisse pas : sa zone suit ses lignes
  let x0 = cote === "d" ? q.x0 : rcBorne(q.x0 + du, 0, 0.99), x1 = cote === "g" ? q.x1 : rcBorne(q.x1 + du, 0.01, 1); if (x1 - x0 < 0.008) { if (cote === "g") x0 = x1 - 0.008; else if (cote === "d") x1 = x0 + 0.008; }
  /* [C14 1.4.12] (C14 322, acquis) : la première fois que tu glisses un cadre, l'app garde aussi où elle l'avait posé ; la mesure de sa justesse se fait sur ton travail */
  const app = !(a.l.places && a.l.places[a.cle]) && !(a.l.placesApp && a.l.placesApp[a.cle]) ? (({ x0, x1, y0, y1 }) => ({ x0, x1, y0, y1 }))(rcPlaceSeg(a)) : null;
  rcLigneMaj(B.k, a.pid, a.id, l => { l.places = Object.assign({}, l.places, { [a.cle]: { x0, x1 } }); if (app) l.placesApp = Object.assign({}, l.placesApp, { [a.cle]: app }); });
  const mk = a.l.marquesBande && a.l.marquesBande[a.cle], m = mk && scCopie(B.k).marques[mk]; if (m) { const r = rcPlaceSeg(a); Object.assign(m, { x0: r.x0, x1: r.x1, y0: r.y0, y1: r.y1, modifieLe: new Date().toISOString() }); }
  rcBandePhoto(a, false);
}
function rcBandeSouris() {
  const cv = RC.ui.querySelector("#rcBandePhoto"); if (cv.dataset.branche) return; cv.dataset.branche = "1";
  const dedans = ev => { const b = RC.bd && RC.bd.boite, r = cv.getBoundingClientRect(), x = (ev.clientX - r.left) * cv.width / r.width; return b && x >= b.a0 && x <= b.a1 ? x : null; };
  cv.addEventListener("pointerdown", ev => { const x = dedans(ev); if (ev.button !== 0 || !RC.bd || x === null) return; ev.preventDefault(); cv.setPointerCapture(ev.pointerId); const b = RC.bd.boite;
    const cote = b.redim ? (Math.abs(x - b.g) <= 9 ? "g" : Math.abs(x - b.d) <= 9 ? "d" : null) : null; RC.bd.tire = { x: ev.clientX, cote }; if (cote) RC.bd.centreFige = RC.bd.rubanCentre; });
  cv.addEventListener("pointermove", ev => { const t = RC.bd && RC.bd.tire; if (!t) return; const r = cv.getBoundingClientRect(), dpx = (ev.clientX - t.x) * cv.width / r.width; t.x = ev.clientX; rcBandeGlisser(dpx * RC.bd.boite.par, t.cote); });
  const fin = () => { if (RC.bd && RC.bd.tire) { const re = RC.bd.centreFige != null; RC.bd.tire = null; RC.bd.centreFige = null; saveState(); if (re) rcBandePhoto(rcBandeCible()); } }; cv.addEventListener("pointerup", fin); cv.addEventListener("pointercancel", fin);
  cv.addEventListener("dblclick", ev => { if (!RC.bd || RC.bd.attente || dedans(ev) === null) return; ev.preventDefault(); const a = rcBandeCible(); if (!a) return; const cle = a.id + "|" + a.cle; RC.bd.redim = RC.bd.redim === cle ? null : cle; rcBandePhoto(a, false); });
  cv.addEventListener("contextmenu", ev => { if (!RC.bd || RC.bd.attente) return; ev.preventDefault(); if (dedans(ev) !== null) rcBandeRecopie(); });
}
/* 1.4.3 (Paul 12:15) : clic droit sur le cadre = une faute de ta recopie ; la ligne prend la forme du corrigé à cet endroit et la faute disparaît ; Ctrl + Z la remet */
function rcBandeRecopie() {
  const B = RC.bd, a = rcBandeCible(); if (!a) return; if (a.mot || a.st) { B.note = "Clic droit : seulement sur une faute proposée par l’IA."; rcBandeRendre(); return; }
  const L = a.l, t = L.texte, P = rcPosMots(t), Q = rcPosMots(L.corrige), g = a.g;
  const sub = g.a2 > g.de2 ? L.corrige.slice(Q[g.de2][0], Q[g.a2 - 1][1]) : ""; let n;
  if (g.a > g.de) { let c0 = P[g.de][0], c1 = P[g.a - 1][1]; if (sub) n = t.slice(0, c0) + sub + t.slice(c1); else { if (t[c1] === " ") c1++; else if (c0 > 0 && t[c0 - 1] === " ") c0--; n = t.slice(0, c0) + t.slice(c1); } }
  else { const pos = g.de > 0 ? P[g.de - 1][1] : 0, colle = /^[.,;:!?…)»]/.test(sub); n = pos === 0 ? sub + " " + t : t.slice(0, pos) + (colle ? "" : " ") + sub + t.slice(pos); }
  const sig = segs => { const c = {}; return segs.map(x => { const b = x.eleve + "→" + x.corrige; c[b] = (c[b] || 0) + 1; return b + "#" + c[b]; }); }, cle = x => x.de + "-" + x.a + "/" + x.de2 + "-" + x.a2;
  const anc = rcEcarts(t, L.corrige).segs, nouv = rcEcarts(n, L.corrige).segs, sA = sig(anc), sN = sig(nouv), map = {};
  sA.forEach((v, i) => { const j = sN.indexOf(v); if (j >= 0 && cle(anc[i]) !== a.cle) map[cle(anc[i])] = cle(nouv[j]); });
  const avant = { texte: t, corrigeDe: L.corrigeDe, decisions: JSON.parse(JSON.stringify(L.decisions || {})), marquesBande: JSON.parse(JSON.stringify(L.marquesBande || {})), places: JSON.parse(JSON.stringify(L.places || {})) };
  const s = scCopie(B.k), mk = L.marquesBande && L.marquesBande[a.cle], retiree = mk && s.marques[mk] ? JSON.parse(JSON.stringify(s.marques[mk])) : null; if (retiree) scEffacer(mk);
  /* [C14 1.4.12] une faute oubliée par l'IA (clé « mot-n ») suit son mot quand la recopie change avant lui */
  const dN = rcPosMots(n).length - P.length, re = o => { const r = {}; Object.keys(o || {}).forEach(x => { if (map[x]) r[map[x]] = o[x]; else { const mm = /^mot-(\d+)$/.exec(x); if (mm) { const i = +mm[1]; if (i < g.de) r[x] = o[x]; else if (i >= g.a) r["mot-" + (i + dN)] = o[x]; } } }); return r; };
  rcLigneMaj(B.k, a.pid, a.id, l => { l.texte = n; l.corrigeDe = n; l.decisions = re(avant.decisions); l.marquesBande = re(avant.marquesBande); l.places = re(avant.places); l.recopieCorrigee = (l.recopieCorrigee || 0) + 1; });
  (B.annule = B.annule || []).push({ k: B.k, pid: a.pid, id: a.id, avant, retiree, i: B.i, j: B.j });
  saveState(); B.A = rcArretsBande(B.k); B.i = Math.min(B.i, B.A.length); if (B.mot) { B.W = rcMotsCopie(B.k, B.A); B.j = Math.min(B.j, B.W.length); } B.note = "Faute de recopie : « " + (g.eleve || "∅") + " » devient « " + (sub || "∅") + " ». Ctrl + Z pour la remettre."; rcBandeRendre();
}
function rcBandeRemettre() {
  const B = RC.bd, u = B && B.annule && B.annule.pop(); if (!u) { toast("Rien à remettre."); return; }
  rcLigneMaj(u.k, u.pid, u.id, l => Object.assign(l, JSON.parse(JSON.stringify(u.avant))));
  if (u.retiree) { const s = scCopie(u.k); s.marques[u.retiree.id] = u.retiree; scNumeroter(u.k); }
  saveState(); B.A = rcArretsBande(B.k); B.i = Math.min(u.i, B.A.length); if (B.mot) { B.W = rcMotsCopie(B.k, B.A); B.j = Math.min(u.j != null ? u.j : B.j, B.W.length); } B.note = "Faute remise."; rcBandeRendre();
}
function rcBandeClavier(ev) {
  const B = RC.bd; ev.stopPropagation();
  if (ev.target && ev.target.closest && ev.target.closest("#rcRqListe")) { if (ev.key === "Escape") { ev.preventDefault(); ev.target.blur(); } return true; }   // [C14 1.4.17] tu corriges une remarque : les touches écrivent
  if (ev.key === "Escape") { ev.preventDefault(); rcBandeFermer(); return true; }
  if (B.attente) { if (ev.key === "Enter") { ev.preventDefault(); rcBandeCommencer(); } return true; }
  if (ev.shiftKey && (ev.key === "R" || ev.key === "r") && !ev.ctrlKey && !ev.metaKey && !ev.altKey) { ev.preventDefault(); rcBandeBasculer(); return true; }   // [C14 1.4.12] ⇧R, comme en dictée
  if (B.mot && rcBandeMotClavier(ev)) return true;
  if (ev.key === "Enter" && !B.A[B.i] && typeof stRqARelire === "function" && stRqARelire(B.k)) { ev.preventDefault(); stRqGarder(B.k); B.note = "Les remarques sont gardées : l’élève les lira."; rcBandeRendre(); return true; }
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
  if (typeof SC !== "undefined" && SC.rt) return false;   // [C14 402] la retouche, ouverte depuis la recopie, garde ses touches (Entrée, Échap, flèches)
  { const mo = document.getElementById("scModale"); if (mo && mo.classList.contains("show")) { if (ev.key === "Escape") { ev.preventDefault(); scModaleFermer(); } ev.stopPropagation(); return true; } }
  if (RC.bd) return rcBandeClavier(ev);
  if (RC.photoOuvert) { if (ev.key === "Escape") { ev.preventDefault(); rcPhotoFermer(); } ev.stopPropagation(); return true; }
  if (RC.fluxOuvert) { if (ev.key === "Escape") { ev.preventDefault(); rcFluxFermer(); } ev.stopPropagation(); return true; }
  if (RC.phrase) { if (ev.key === "Escape") { ev.preventDefault(); rcPhraseFermer(); } ev.stopPropagation(); return true; }
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
    if (ev.key === "Enter" && i === d.ordre.length - 1 && rcPhraseManque(RC.copie)) rcPhraseOuvrir();   // [C14 1.4.15] au bout de la recopie, la phrase s'ouvre seule
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

/* [C14 407] l'aide « ? » de la recopie et de la bande : seulement ce qui reste */
RU_AIDES.recopie = { ou: "Recopier", l: [
  ["les poignées vertes", "recale la ligne sur la photo (ses deux bouts), puis tape ce que l'élève a écrit, sans corriger"],
  ["Entrée · ↑ ↓", "la ligne suivante · changer de ligne ; à la dernière ligne, Entrée ouvre « ★ La phrase qui m'a marqué »"],
  ["⌫ au début d'une ligne", "remonter à la fin de la ligne d'avant"],
  ["« (guillemet droit)", "s'écrit en guillemets français, « » selon la place"],
  ["Ctrl + Z", "dans le champ : annuler la frappe ; hors du champ : annuler le dernier ajout, retrait ou recalage"],
  ["＋ Une ligne · − Cette ligne", "ajouter une ligne après celle en cours · retirer celle en cours"],
  ["− ↔ Largeur ＋ · Ctrl + molette", "la taille de la photo et de la feuille ensemble"],
  ["★ La phrase qui m'a marqué", "la fin de la recopie de cette copie : premier mot, dernier mot, « ✓ C'est elle » (ou « Pas de phrase ») ; sans elle, la copie suivante ne vient pas"],
  ["⇪ Exporter pour l'IA", "le paquet suivant, 8 copies au plus, sans nom d'élève ; grisé tant que l'énoncé ou ta grille de stickers manque, et il dit pourquoi ; « ↻ Renvoyer » si un retour s'est perdu"],
  ["⇩ Charger le corrigé de l'IA", "colle le retour, ou choisis ses fichiers, plusieurs d'un coup ; rien ne change tant que les lignes ne correspondent pas"],
  ["▶ La bande", "elle s'arrête à chaque faute proposée par l'IA, puis à chaque sticker"],
  ["📋 Le flux", "chaque copie : recopiée, envoyée, chargée, la bande, ton temps ; en bas, toute la classe ; « 💾 Télécharger la sauvegarde »"],
  ["⏱ en haut", "ton temps sur cette copie, compté seul : à la recopie, puis dans la bande"],
  ["📷 La photo", "les gestes rares : remplacer, tourner, retoucher, l'ordre des pages, retirer les photos de ce navigateur ; ta recopie suit la page"],
  ["Échap", "fermer la fenêtre ouverte ; sinon, revenir à l'écran des scans"]] };
RU_AIDES.bande = { ou: "La bande", l: [
  ["Entrée ou Espace", "c'est une faute (ou le sticker est réussi), puis l'arrêt suivant"],
  ["N", "non, puis l'arrêt suivant"],
  ["⌫", "revenir à l'arrêt d'avant"],
  ["← →", "glisser le cadre sur la photo"],
  ["le cadre", "tire-le ; double clic : une poignée de chaque côté pour régler sa longueur ; clic droit : une faute de ta recopie"],
  ["Ctrl + Z", "annuler ton dernier réglage du cadre"],
  ["⇧ R", "passer au mot par mot, comme en dictée, et en revenir : Entrée le mot suivant, F une faute (ou la retirer), N non, ⌫ le mot d'avant"],
  ["＋ Un sticker", "un sticker que l'IA n'a pas vu, sur le mot où tu es ou le passage de l'arrêt ; seuls les stickers validés se posent"],
  ["les remarques", "à la fin de la bande : corrige un texte en place, ✕ en retire une, Entrée les garde toutes"],
  ["la liste à droite", "les arrêts de cette copie ; un clic y va"],
  ["Échap", "revenir à ta recopie : tes réponses sont gardées"]] };
