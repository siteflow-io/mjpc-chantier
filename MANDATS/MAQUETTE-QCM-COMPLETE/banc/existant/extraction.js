// Ce qu'un écran montre, relevé dans la page : la même fonction pour la 7.7.1 (sur le faux hub) et pour la maquette.
// Boutons (libellé sans l'« i », infobulle), champs (indication ou étiquette), cases (étiquette), infobulles posées ailleurs
// que sur un bouton (une ligne, une zone, un nom cliquable) et, pour un écran d'élève, ses phrases.
// Les énoncés et les choix d'une évaluation sont des données : ils sont mis à part.
// Chaque iframe de la page est lue aussi, comme une partie de l'écran (complément 1, §4).
function extraireEcran(opts){
  opts = opts || {};
  const docs = [document];
  document.querySelectorAll("iframe").forEach(f => { try { if(f.contentDocument && f.contentDocument.body) docs.push(f.contentDocument); } catch(e){} });
  const out = {boutons: [], champs: [], cases: [], titres: [], phrases: [], classes: []};
  let trouve = false;
  docs.forEach((doc, di) => {
    const racine = opts.racine ? doc.querySelector(opts.racine) : doc.body;
    if(!racine) return;
    trouve = true;
    const win = doc.defaultView;
    const visible = el => { const r = el.getBoundingClientRect(); if(r.width < 1 || r.height < 1) return false; const cs = win.getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none"; };
    const lab = b => { const c = b.cloneNode(true); c.querySelectorAll(".info-i,.info-tip").forEach(x => x.remove()); return (c.textContent || "").replace(/\s+/g, " ").trim(); };
    const horsSommaire = el => !el.closest("#som-racine,.som-fond,.deco");
    const DONNEES = ".eleve-q-enonce,.eleve-choix,.correction-choix,.correction-explication,.board-enonce,.board-reponse-enonce,.board-choix-grille,.board-explication,.pilot-q-mini-enonce,.pilot-q-mini-bonnes,.enonce,.enonce-next";
    racine.querySelectorAll("button").forEach(b => { if(visible(b) && horsSommaire(b) && !b.closest(".eleve-choix,.correction-choix")){ const l = lab(b); if(l) out.boutons.push({l, t: b.getAttribute("title") || ""}); } });
    racine.querySelectorAll("input,select,textarea").forEach(i => {
      if(!visible(i) || !horsSommaire(i)) return;
      const typ = (i.type || "").toLowerCase();
      const voisin = i.closest(".m8tx-champ,.field");
      const etiq = (i.closest("label") && lab(i.closest("label"))) || (voisin && voisin.querySelector("label") && lab(voisin.querySelector("label"))) || "";
      if(typ === "checkbox" || typ === "radio") out.cases.push(etiq || i.getAttribute("aria-label") || "");
      else if(typ !== "file") out.champs.push(i.getAttribute("placeholder") || i.getAttribute("aria-label") || etiq || i.tagName.toLowerCase());
    });
    racine.querySelectorAll("[title]").forEach(el => {
      if(/^(BUTTON|INPUT|SELECT|TEXTAREA|IFRAME)$/.test(el.tagName) || !visible(el) || !horsSommaire(el)) return;
      const t = el.getAttribute("title"); if(t && t.trim()) out.titres.push(t.trim());
    });
    racine.querySelectorAll("[class]").forEach(el => { if(visible(el) && horsSommaire(el)) String(el.className).split(/\s+/).forEach(c => { if(c) out.classes.push(c); }); });
    if(opts.phrases){
      const tw = doc.createTreeWalker(racine, win.NodeFilter.SHOW_TEXT); let n;
      while((n = tw.nextNode())){
        const v = n.nodeValue.replace(/\s+/g, " ").trim(); if(!v || !/\p{L}{2}/u.test(v)) continue;
        const el = n.parentElement; if(!el || !visible(el) || !horsSommaire(el) || el.closest(DONNEES) || el.closest("button") || el.closest(".info-tip") || el.closest("style,script")) continue;
        out.phrases.push(v);
      }
    }
  });
  if(!trouve) return null;
  out.classes = [...new Set(out.classes)];
  return out;
}
if(typeof module !== "undefined") module.exports = {extraireEcran};
