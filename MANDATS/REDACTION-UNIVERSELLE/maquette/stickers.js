// ── LES STICKERS — maquette seulement (C13 tour 416 ; Paul, 30/10 12:59 : « montre moi une capture des stickers ») ──
// Inclus par gen-maquette.py seulement avec STICKERS=1, jamais dans un fichier de mise en ligne (PROD=1).
// Un sticker = la marque d'une question de ta grille, avec une étiquette courte posée sur le mot (1501). Il appartient à une seule question,
// donc à un seul point (« une case, un fait »). Les mots des étiquettes et de leurs explications sont lus par l'élève : à valider par Paul (1507).
// Le seuil (1513) : une butée ; dès qu'il est atteint, la palette le dit et le bouton se grise — tu marques des exemples, jamais tout.
const SC_ST = [
  { id: "rep", txt: "Rép.", point: "lexique", q: 1, sens: "non", seuil: 3, dit: "Une répétition : ce mot revient déjà plus haut. Trouve un autre mot." },
  { id: "mot", txt: "Mot ?", point: "lexique", q: 0, sens: "non", seuil: 3, dit: "Ce mot ne va pas dans une lettre écrite : il est mal employé, familier ou argotique. Trouve le mot juste." },
  { id: "1418", txt: "14-18", point: "lexique", q: 2, sens: "oui", vert: true, dit: "Un mot de l'époque : il fait vivre ta lettre." },
  { id: "anachr", txt: "Pas en 14-18", point: "theme", q: 6, sens: "non", dit: "Cela n'existait pas en 14-18." },
  { id: "lu", txt: "Lu en classe", point: "lectures", q: 0, sens: "oui", vert: true, dit: "Un détail repris des textes lus en classe." },
  { id: "simple", txt: "Simple", point: "complexes", q: 0, sens: "non", dit: "Une phrase simple : un seul verbe conjugué." },
  { id: "princ", txt: "Sans principale", point: "complexes", q: 3, sens: "non", dit: "Cette phrase n'a que des subordonnées : il lui manque sa proposition principale." },
  { id: "rel", txt: "Qui/que ?", point: "complexes", q: 4, sens: "non", dit: "Ce pronom relatif n'est pas le bon." },
  { id: "modal", txt: "Modalisation", point: "modalisation", q: 0, sens: "oui", vert: true, dit: "Une modalisation : tu nuances ce que tu dis." },
  { id: "litote", txt: "Litote", point: "modalisation", q: 2, sens: "oui", vert: true, dit: "Une litote : tu en dis moins pour faire entendre plus." },
  { id: "temps", txt: "Temps", point: "personne", q: 3, sens: "non", dit: "Ce verbe change de temps sans raison au milieu du passage." },
  { id: "je", txt: "Je ?", point: "personne", q: 1, sens: "non", dit: "Ici, tu ne dis plus « je »." },
  { id: "code", txt: "Code ?", point: "codes", q: 4, sens: "non", dit: "Ce code de la lettre n'est pas à sa place." }
];
const SC_ST_VERT = "#3a6e1c";
function scStDef(id) { return SC_ST.find(d => d.id === id) || null; }
function scStCrit(d) { const c = SC.grille && SC.grille.criteres.find(c => c.points.some(p => p.id === d.point)); return c ? c.id : null; }
function scStCoul(d) { return d.vert ? SC_ST_VERT : (SC_CRIT[scStCrit(d)] || "#6b1a2a"); }
function scStNombre(k, id) { return k ? Object.values(scCopie(k).marques).filter(m => m.forme === "sticker" && m.st === id).length : 0; }
function scStInfo(m) { const d = m.st && scStDef(m.st); return d ? { txt: d.txt, dit: d.dit, vert: !!d.vert, coul: scStCoul(d) } : null; }
// le pinceau : un sticker choisi dans la palette le temps d'un tracé
const scOutil0 = scOutil;
scOutil = function () { if (SC.outil && String(SC.outil).indexOf("st:") === 0) { const d = scStDef(SC.outil.slice(3)); if (d) return { forme: "sticker", st: d.id, sens: d.sens, coul: scStCoul(d) }; } return scOutil0(); };
// poser : le sticker répond à SA question (pas à la question en cours), puis le pinceau revient
const scPoser0 = scPoser;
scPoser = function (m) {
  if (m.forme === "sticker" || (SC.outil && String(SC.outil).indexOf("st:") === 0)) { const d = scStDef(String(SC.outil).slice(3)); if (d) { const pt = scTousPoints().find(p => p.id === d.point);
    m.forme = "sticker"; m.st = d.id; m.sens = d.sens; m.point = d.point; m.q = pt ? scCleDe(pt, d.q) : null; m.passe = scStCrit(d);
    const E = SC.encres && SC.encres[m.page], Pg = SC.pages[m.page], pas = E && E.pas ? E.pas / E.H : (Pg && Pg.lignes && Pg.lignes.pas) || 0.024;
    /* un trait tiré sous les mots (sans hauteur) : le cadre prend la hauteur d'une ligne d'écriture, au-dessus du trait */ if (m.y1 - m.y0 < pas * 0.4) { const y = m.y1; m.y0 = y - pas * 0.75; m.y1 = y + pas * 0.08; } } SC.outil = null; }
  return scPoser0(m); };
// un sticker n'est pas recalé sur les lignes : il reste où ta main l'a posé (comme sur une photo)
const scCaler0 = scCaler;
scCaler = function (m, p) { if (m.forme !== "sticker" && !(SC.outil && String(SC.outil).indexOf("st:") === 0)) return scCaler0(m, p);
  const ya = Math.min(m.y0, m.y1), yb = Math.max(m.y0, m.y1), xa = Math.min(m.x0, m.x1), xb = Math.max(m.x0, m.x1); m.x0 = xa; m.x1 = xb; m.y0 = ya; m.y1 = yb; m.l0 = m.l1 = null; return m; };
// le dessin sur la copie : le mot encadré finement, l'étiquette posée au-dessus, à taille d'écran constante
const scSvgMarque0 = scSvgMarque;
scSvgMarque = function (m, p, sel) {
  if (m.forme !== "sticker") return scSvgMarque0(m, p, sel); const d = scStDef(m.st); if (!d) return "";
  const H = Math.round(1000 * p.h / p.w), X = x => x * 1000, Y = y => y * H, u = SC.upx || 1, c = scStCoul(d);
  const h = 16 * u, fs = 11 * u, w = (d.txt.length * 6.6 + 12) * u, x0 = X(m.x0) - 3 * u, y0 = Y(m.y0) - 2 * u;
  let s = `<g class="sc-m${sel ? " sel" : ""}" data-id="${m.id}"><title>${escapeHtml("« " + d.txt + " » : " + d.dit)} — clic : le choisir ; le tirer le déplace ; ses poignées le redimensionnent ; Suppr : l'effacer</title>`;
  s += `<rect x="${x0}" y="${y0}" width="${X(m.x1 - m.x0) + 6 * u}" height="${Y(m.y1 - m.y0) + 4 * u}" rx="${4 * u}" fill="${c}1a" stroke="${c}" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`;
  s += `<rect x="${x0}" y="${y0 - h - 1 * u}" width="${w}" height="${h}" rx="${h / 2}" fill="${c}" fill-opacity=".92"/><text x="${x0 + w / 2}" y="${y0 - 1 * u - h / 2 + fs * 0.36}" font-size="${fs}" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif">${escapeHtml(d.txt)}</text>`;
  if (sel) { const v = 16 * u, z = 34 * u; s += `<rect x="${x0 - 3}" y="${y0 - 3}" width="${X(m.x1 - m.x0) + 6 * u + 6}" height="${Y(m.y1 - m.y0) + 4 * u + 6}" fill="none" stroke="#2b2520" stroke-dasharray="6 4" stroke-width="1.5"/>`;
    [["a", m.x0, m.y0], ["b", m.x1, m.y1]].forEach(([k, x, y]) => { s += `<rect class="sc-poignee" data-p="${k}" x="${X(x) - z / 2}" y="${Y(y) - z / 2}" width="${z}" height="${z}" fill="transparent"/><rect class="sc-poignee" data-p="${k}" x="${X(x) - v / 2}" y="${Y(y) - v / 2}" width="${v}" height="${v}" fill="#fff" stroke="#2b2520" stroke-width="2" vector-effect="non-scaling-stroke"/>`; }); }
  return s + "</g>"; };
// la palette : les stickers de la passe en cours, dans le panneau, sous l'en-tête de la copie
const scPanneau0 = scPanneau;
scPanneau = function () { scPanneau0(); const Z = document.getElementById("scPanneau"), P = scP(), k = scK(); if (!Z || !P || !k || SC.attrib || P.id === "retours") return;
  const L = SC_ST.filter(d => scStCrit(d) === P.crit); if (!L.length) return;
  const h = `<div class="sc-bloc sc-st-pal"><h3>Les stickers de cette passe</h3><p class="sc-m">Un clic choisit le sticker, un tracé le pose sur le mot, puis le pinceau revient. L'élève clique l'étiquette et lit ce qu'elle veut dire.</p><div class="sc-st-liste">${L.map(d => {
      const n = scStNombre(k, d.id), plein = d.seuil && n >= d.seuil, c = scStCoul(d), on = SC.outil === "st:" + d.id;
      return `<button class="sc-st${on ? " on" : ""}" ${plein ? "disabled" : ""} onclick="SC.outil=SC.outil==='st:${d.id}'?null:'st:${d.id}';scRendre()" title="${escapeHtml("Le sticker « " + d.txt + " » : " + d.dit + (d.vert ? " (en vert : ce qui est réussi)" : "") + " Il répond à une question du point « " + ((scTousPoints().find(p => p.id === d.point) || {}).titre || d.point) + " ». Un clic, puis un tracé sur le mot.")}"><span class="sc-st-eti" style="background:${c}">${escapeHtml(d.txt)}</span><span class="sc-st-n">${n}${d.seuil ? " / " + d.seuil : ""}</span>${plein ? `<span class="sc-st-seuil">seuil atteint : inutile d'en poser d'autres</span>` : ""}</button>`; }).join("")}</div></div>`;
  const b = Z.querySelector(".sc-bloc"); if (b) b.insertAdjacentHTML("afterend", h); else Z.insertAdjacentHTML("afterbegin", h); };
// le fichier de l'élève : l'étiquette sur sa copie, et « par exemple » dans le point qu'elle ouvre
scEleveDonnees = (0, eval)("(" + scEleveDonnees.toString().replace("forme: m.forme, x0: m.x0,", "forme: m.forme, st: scStInfo(m), x0: m.x0,") + ")");
(function () { let t = scEleveLecture.toString();
  const r = (a, b) => { if (t.split(a).length !== 2) throw new Error("stickers : motif introuvable " + a.slice(0, 40)); t = t.replace(a, b); };
  r(".g{border-radius:4px}.mk.on{", ".g{border-radius:4px}.mk.st{transform:translateY(-100%);margin-top:-2px;color:#fff;font:700 11px/16px system-ui,sans-serif;padding:0 8px;border-radius:10px;white-space:nowrap}.mk.on{");
  r('else Q.insertAdjacentHTML("beforeend", `<div class="mk ${m.forme === "marge" ? "g" : "e"}',
    'else if (m.st) Q.insertAdjacentHTML("beforeend", `<div class="mk e${on("p", i) ? " on" : ""}" data-v="p:${i}" style="left:${pc(m.x0 - 0.003)};top:${pc(m.y0 - 0.002)};width:${pc(m.x1 - m.x0 + 0.006)};height:${pc(m.y1 - m.y0 + 0.004)};border-width:2px;border-color:${m.st.coul};background:${m.st.coul}1a"></div><div class="mk st" data-v="p:${i}" style="left:${pc(m.x0 - 0.003)};top:${pc(m.y0 - 0.002)};background:${m.st.coul}">${esc(m.st.txt)}</div>`);\n        else Q.insertAdjacentHTML("beforeend", `<div class="mk ${m.forme === "marge" ? "g" : "e"}');
  r(': ""}${retour}</div>`; }', ': ""}${(() => { const vu = {}; const L = p.marques.filter(m => m.st && !vu[m.st.txt] && (vu[m.st.txt] = 1)); return L.length ? `<div class="bloc" style="margin:10px 0 0;background:#fff"><h3>Par exemple, sur ta copie</h3>${L.map(m => `<div style="margin:6px 0"><span class="mk st" style="position:static;display:inline-block;transform:none;margin:0 6px 0 0;background:${m.st.coul}">${esc(m.st.txt)}</span>${esc(m.st.dit)}</div>`).join("")}</div>` : ""; })()}${retour}</div>`; }');
  scEleveLecture = (0, eval)("(" + t + ")"); })();
document.head.insertAdjacentHTML("beforeend", `<style>.sc-st-liste{display:flex;flex-wrap:wrap;gap:6px}.sc-st{display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px;border:1px solid #d6cfc1;background:#fff;border-radius:9px;padding:4px 8px;cursor:pointer;font:inherit}.sc-st.on{box-shadow:0 0 0 2px #2b2520}.sc-st:disabled{opacity:.6;cursor:not-allowed}.sc-st-eti{color:#fff;font:700 12.5px/19px system-ui,sans-serif;padding:0 8px;border-radius:10px;white-space:nowrap}.sc-st-n{font-size:12.5px;color:#7a6e5f}.sc-st-seuil{font-size:12px;color:#7a3f00;flex-basis:100%;text-align:left}</style>`);
