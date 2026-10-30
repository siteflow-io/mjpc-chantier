// ── LES STICKERS — maquette seulement (C13 tour 417 ; Paul, 30/10 13:54) ──
// « Je ne remplis jamais la grille, mais je pose des stickers dans le texte. La pose de ces stickers répond aux questions et remplit la grille
// d'évaluation. […] pour que les stickers ne cachent pas systématiquement le texte avec leur dénomination, il faut un code couleur et surtout
// des liens. On a les marques dans la copie et le passage ou le clic au survol ouvre le détail. »
// Inclus par gen-maquette.py seulement avec STICKERS=1, jamais dans un fichier de mise en ligne (PROD=1).
// Un sticker : une couleur, aucune étiquette sur la copie. « À reprendre » = souligné ondulé de sa couleur ; « réussi » = surligné de sa couleur.
// Il répond à UNE question de la grille (un fait, un point). Sa présence répond ; son absence aussi (pas de répétition marquée : « rarement ? » oui ;
// pas de mot de 14-18 marqué : « des mots de 14-18 ? » non). Certaines questions se calculent sur les stickers (combien, où).
// Les noms et les phrases sont lus par l'élève : à valider par Paul (1507). Le seuil (1513) reste une butée.
const SC_ST = [
  { id: "rep", txt: "Répétition", coul: "#e07b00", point: "lexique", q: 1, sens: "non", seuil: 3, dit: "Ce mot revient déjà plus haut. Trouve un autre mot." },
  { id: "mot", txt: "Mot à reprendre", coul: "#8e44ad", point: "lexique", q: 0, sens: "non", seuil: 3, dit: "Ce mot ne va pas dans une lettre écrite : mal employé, familier ou argotique. Trouve le mot juste." },
  { id: "1418", txt: "Mot de 14-18", coul: "#2e9d5b", point: "lexique", q: 2, sens: "oui", dit: "Un mot de l'époque : il fait vivre ta lettre." },
  { id: "simple", txt: "Phrase simple", coul: "#1f7a72", point: "complexes", q: 0, sens: "non", dit: "Une phrase simple : un seul verbe conjugué. Ajoute une proposition." },
  { id: "princ", txt: "Sans principale", coul: "#a0522d", point: "complexes", q: 3, sens: "non", dit: "Cette phrase n'a que des subordonnées : il lui manque sa proposition principale." },
  { id: "rel", txt: "Relatif à revoir", coul: "#2c5aa0", point: "complexes", q: 4, sens: "non", dit: "Ce pronom relatif n'est pas le bon." },
  { id: "modal", txt: "Modalisation", coul: "#4caf50", point: "modalisation", q: 0, sens: "oui", dit: "Une modalisation : tu nuances ce que tu dis." },
  { id: "litote", txt: "Litote", coul: "#d4a900", point: "modalisation", q: 2, sens: "oui", dit: "Une litote : tu en dis moins pour faire entendre plus." }
];
// les questions qui se calculent sur les stickers, et celles qui ne se calculent pas encore (à transformer avec Paul)
const SC_ST_CALC = {
  "complexes:1": { dit: "calculé : 2 phrases simples au plus", f: k => scStNombre(k, "simple") <= 2 },
  "complexes:2": { dit: "calculé : moins de la moitié de phrases simples", f: k => true },
  "modalisation:1": { dit: "à calculer avec tes paragraphes (passe du thème)", f: null },
  "modalisation:3": { dit: "oui tant qu'aucune litote n'est marquée « plate »", f: k => true }
};
const SC_ST_AUTO = ["lexique", "complexes", "modalisation"];   // les points que les stickers remplissent dans cette maquette
function scStDef(id) { return SC_ST.find(d => d.id === id) || null; }
function scStCrit(d) { const c = SC.grille && SC.grille.criteres.find(c => c.points.some(p => p.id === d.point)); return c ? c.id : null; }
function scStNombre(k, id) { return k ? Object.values(scCopie(k).marques).filter(m => m.forme === "sticker" && m.st === id).length : 0; }
function scStDe(k, id) { return k ? Object.values(scCopie(k).marques).filter(m => m.forme === "sticker" && m.st === id) : []; }
function scStInfo(m) { const d = m.st && scStDef(m.st); return d ? { txt: d.txt, dit: d.dit, coul: d.coul, sens: d.sens } : null; }
function scStVague(c) { return "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><path d="M0 3 Q2 0.5 4 3 T8 3" fill="none" stroke="' + c + '" stroke-width="1.7"/></svg>') + "')"; }
function scStEchantillon(d) { return d.sens === "oui" ? `<i class="sc-st-ech" style="background:${d.coul}55"></i>` : `<i class="sc-st-ech" style="background-image:${scStVague(d.coul)}"></i>`; }
// la grille qui se remplit seule : chaque question liée répond par la présence ou l'absence de son sticker
function scStRemplir(pt, k) { if (!k || SC_ST_AUTO.indexOf(pt.id) < 0) return; const s = scCopie(k); s.rep[pt.id] = s.rep[pt.id] || {};
  pt.questions.forEach(q => { const d = SC_ST.find(d => d.point === pt.id && d.q === q.id), c = SC_ST_CALC[pt.id + ":" + q.id];
    if (d) s.rep[pt.id][q.cle] = scStNombre(k, d.id) ? (d.sens === "non" ? "n" : "o") : (d.sens === "non" ? "o" : "n");
    else if (c && c.f) s.rep[pt.id][q.cle] = c.f(k) ? "o" : "n"; else delete s.rep[pt.id][q.cle]; }); }
const scCase0 = scCase;
scCase = function (pt, k) { scStRemplir(pt, k); return scCase0(pt, k); };
// le pinceau : un sticker choisi dans la palette le temps d'un tracé ; un clic sur un mot le prend (la détection du mot)
const scOutil0 = scOutil;
scOutil = function () { if (SC.outil && String(SC.outil).indexOf("st:") === 0) { const d = scStDef(SC.outil.slice(3)); if (d) return { forme: "sticker", st: d.id, sens: d.sens, coul: d.coul }; } return scOutil0(); };
const scPoser0 = scPoser;
scPoser = function (m) {
  if (m.forme === "sticker" || (SC.outil && String(SC.outil).indexOf("st:") === 0)) { const d = scStDef(String(SC.outil).slice(3)); if (d) { const pt = scTousPoints().find(p => p.id === d.point);
    m.forme = "sticker"; m.st = d.id; m.sens = d.sens; m.point = d.point; m.q = pt ? scCleDe(pt, d.q) : null; m.passe = scStCrit(d);
    const E = SC.encres && SC.encres[m.page], Pg = SC.pages[m.page], pas = E && E.pas ? E.pas / E.H : (Pg && Pg.lignes && Pg.lignes.pas) || 0.024;
    /* un trait tiré sous les mots (sans hauteur) : la marque prend la hauteur d'une ligne d'écriture, au-dessus du trait */ if (m.y1 - m.y0 < pas * 0.4) { const y = m.y1; m.y0 = y - pas * 0.75; m.y1 = y + pas * 0.08; } } SC.outil = null; }
  return scPoser0(m); };
const scCaler0 = scCaler;   // un sticker n'est pas recalé sur les lignes : il reste où ta main l'a posé (comme sur une photo)
scCaler = function (m, p) { if (m.forme !== "sticker" && !(SC.outil && String(SC.outil).indexOf("st:") === 0)) return scCaler0(m, p);
  const ya = Math.min(m.y0, m.y1), yb = Math.max(m.y0, m.y1), xa = Math.min(m.x0, m.x1), xb = Math.max(m.x0, m.x1); m.x0 = xa; m.x1 = xb; m.y0 = ya; m.y1 = yb; m.l0 = m.l1 = null; return m; };
// le dessin sur la copie : aucune étiquette ; souligné ondulé (à reprendre) ou surligné (réussi), de la couleur du sticker
const scSvgMarque0 = scSvgMarque;
scSvgMarque = function (m, p, sel) {
  if (m.forme !== "sticker") return scSvgMarque0(m, p, sel); const d = scStDef(m.st); if (!d) return "";
  const H = Math.round(1000 * p.h / p.w), X = x => x * 1000, Y = y => y * H, u = SC.upx || 1, fl = SC.stFlash && SC.stFlash.indexOf(m.id) >= 0;
  let s = `<g class="sc-m sc-stm${sel ? " sel" : ""}${fl ? " sc-st-flash" : ""}" data-id="${m.id}" data-st="${d.id}"><rect x="${X(m.x0)}" y="${Y(m.y0)}" width="${X(m.x1 - m.x0)}" height="${Y(m.y1 - m.y0) + 6 * u}" fill="transparent"/>`;
  if (d.sens === "oui") s += `<rect x="${X(m.x0) - 2 * u}" y="${Y(m.y0)}" width="${X(m.x1 - m.x0) + 4 * u}" height="${Y(m.y1 - m.y0)}" rx="${3 * u}" fill="${d.coul}" fill-opacity="${fl ? 0.6 : 0.33}" style="mix-blend-mode:multiply"/>`;
  else { const y = Y(m.y1) + 2.5 * u, a = 2.6 * u, per = 8 * u; let dd = `M${X(m.x0)} ${y}`; for (let x = X(m.x0); x < X(m.x1); x += per) dd += ` q${per / 4} ${-a} ${per / 2} 0 t${per / 2} 0`;
    s += `<path d="${dd}" fill="none" stroke="${d.coul}" stroke-width="${fl ? 3.4 : 2}" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`; }
  if (sel) { const v = 16 * u, z = 34 * u; s += `<rect x="${X(m.x0) - 3}" y="${Y(m.y0) - 3}" width="${X(m.x1 - m.x0) + 6}" height="${Y(m.y1 - m.y0) + 6}" fill="none" stroke="#2b2520" stroke-dasharray="6 4" stroke-width="1.5"/>`;
    [["a", m.x0, m.y0], ["b", m.x1, m.y1]].forEach(([k, x, y]) => { s += `<rect class="sc-poignee" data-p="${k}" x="${X(x) - z / 2}" y="${Y(y) - z / 2}" width="${z}" height="${z}" fill="transparent"/><rect class="sc-poignee" data-p="${k}" x="${X(x) - v / 2}" y="${Y(y) - v / 2}" width="${v}" height="${v}" fill="#fff" stroke="#2b2520" stroke-width="2" vector-effect="non-scaling-stroke"/>`; }); }
  return s + "</g>"; };
// le lien de la grille vers la copie : un clic sur une ligne de la grille fait clignoter ses stickers
function scStFlash(ids) { SC.stFlash = String(ids || "").split(",").filter(Boolean); scDessinerPages(); clearTimeout(SC.stFlashT); SC.stFlashT = setTimeout(() => { SC.stFlash = null; scDessinerPages(); }, 1600); }
// le lien de la copie vers la grille : au survol d'un sticker, sa bulle (son nom, ce qu'il veut dire, la question à laquelle il répond, où en est le point)
function scStBulle() { let b = document.getElementById("scStBulle"); if (!b) { b = document.createElement("div"); b.id = "scStBulle"; b.className = "sc-st-bulle"; b.hidden = true; document.body.appendChild(b); } return b; }
function scStBulleDe(m) { const d = scStDef(m.st), pt = scTousPoints().find(p => p.id === d.point), q = pt && pt.questions.find(x => x.id === d.q), r = pt && scCase(pt, scK());
  return `<div class="sc-st-bt">${scStEchantillon(d)}<b>${escapeHtml(d.txt)}</b></div><div>${escapeHtml(d.dit)}</div><div class="sc-st-bq">Répond « ${d.sens} » à : ${escapeHtml(q ? q.texte : "")}</div>${r ? `<div class="sc-st-bq">${escapeHtml(pt.titre)} : <b style="color:${SC_COUL[r.c.niveau]}">${escapeHtml((ECHELON_COULEUR[r.c.niveau] || {}).label || "")}</b>, ${String(pt.bareme[String(r.c.niveau)]).replace(".", ",")} sur ${pt.poids}</div>` : ""}<div class="sc-m">Clic : le choisir · Suppr : l'effacer</div>`; }
document.addEventListener("mouseover", e => { const g = e.target && e.target.closest && e.target.closest("#scCopie .sc-stm"); const B = scStBulle();
  if (!g) { B.hidden = true; return; } const m = scK() && scCopie(scK()).marques[g.dataset.id]; if (!m) { B.hidden = true; return; }
  B.innerHTML = scStBulleDe(m); B.hidden = false; const r = g.getBoundingClientRect(), w = B.offsetWidth, h = B.offsetHeight;
  B.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left)) + "px"; B.style.top = (r.top - h - 10 > 8 ? r.top - h - 10 : r.bottom + 10) + "px"; });
// le panneau : la palette (la légende des couleurs) et la grille qui se remplit seule ; les questions à « Oui / Non » disparaissent
const scPanneau0 = scPanneau;
scPanneau = function () { scPanneau0(); const Z = document.getElementById("scPanneau"), P = scP(), k = scK(); if (!Z || !P || !k || SC.attrib || P.id === "retours") return;
  const L = SC_ST.filter(d => scStCrit(d) === P.crit); if (!L.length) return;
  Z.querySelectorAll(".sc-bloc").forEach(b => { const t = (b.querySelector("h3") || {}).textContent || ""; if (b.querySelector(".sc-q") || /^La case où tombe|^Sur ce point, les copies/.test(t)) b.remove(); });
  const pal = `<div class="sc-bloc sc-st-pal"><h3>Tes stickers · leurs couleurs</h3><p class="sc-m">Un clic choisit le sticker, un clic sur le mot (ou un trait sous plusieurs mots) le pose ; le pinceau revient. Aucun nom sur la copie : le survol l'ouvre.</p><div class="sc-st-liste">${L.map(d => {
      const n = scStNombre(k, d.id), plein = d.seuil && n >= d.seuil, on = SC.outil === "st:" + d.id;
      return `<button class="sc-st${on ? " on" : ""}" ${plein ? "disabled" : ""} onclick="SC.outil=SC.outil==='st:${d.id}'?null:'st:${d.id}';scRendre()" title="${escapeHtml("« " + d.txt + " » : " + d.dit + " " + (d.sens === "oui" ? "Surligné : ce qui est réussi." : "Souligné ondulé : ce qui est à reprendre.") + " Un clic, puis un clic sur le mot.")}">${scStEchantillon(d)}<span class="sc-st-nom">${escapeHtml(d.txt)}</span><span class="sc-st-n">${n}${d.seuil ? " / " + d.seuil : ""}</span>${plein ? `<span class="sc-st-seuil">seuil atteint : inutile d'en poser d'autres</span>` : ""}</button>`; }).join("")}</div></div>`;
  const pts = P.pts.filter(pt => SC_ST_AUTO.indexOf(pt.id) >= 0);
  const gr = `<div class="sc-bloc sc-gr"><h3>La grille se remplit avec tes stickers</h3>${pts.map(pt => { const r = scCase(pt, k), rep = (scCopie(k).rep[pt.id] || {});
      return `<div class="sc-gr-pt"><div class="sc-gr-t"><b>${escapeHtml(pt.titre)}</b>${r && r.complet ? `<span class="sc-gr-niv" style="background:${SC_FOND[r.c.niveau]};border-color:${SC_COUL[r.c.niveau]}">${escapeHtml((ECHELON_COULEUR[r.c.niveau] || {}).label || "")} · ${String(pt.bareme[String(r.c.niveau)]).replace(".", ",")} / ${pt.poids}</span>` : `<span class="sc-gr-niv">en attente</span>`}</div>${scQuestions(pt, rep).map(q => {
        const d = SC_ST.find(d => d.point === pt.id && d.q === q.id), c = SC_ST_CALC[pt.id + ":" + q.id], v = rep[q.cle], ms = d ? scStDe(k, d.id) : [];
        const src = d ? (ms.length ? `${scStEchantillon(d)}${ms.length} ${escapeHtml(d.txt.toLowerCase())}${ms.length > 1 && !/s$/.test(d.txt) ? "s" : ""}` : `${scStEchantillon(d)}aucun sticker « ${escapeHtml(d.txt)} »`) : c ? escapeHtml(c.dit) : "—";
        return `<div class="sc-gr-q${ms.length ? " lien" : ""}" ${ms.length ? `onclick="scStFlash('${ms.map(m => m.id).join(",")}')"` : ""} title="${escapeHtml(ms.length ? "Clic : ses stickers clignotent sur la copie." : d ? "Pas de sticker « " + d.txt + " » sur cette copie : la réponse vient de leur absence." : "Cette question se calcule, tu n'y réponds pas.")}"><span>${escapeHtml(q.texte)}</span><span class="sc-gr-r ${v === "o" ? "o" : v === "n" ? "n" : "a"}">${v === "o" ? "oui" : v === "n" ? "non" : "à calculer"}</span><span class="sc-gr-s">${src}</span></div>`; }).join("")}${r && r.complet ? `<div class="sc-gr-fait">« ${escapeHtml(r.txt)} »</div>` : ""}</div>`; }).join("")}</div>`;
  const b = Z.querySelector(".sc-bloc"); if (b) b.insertAdjacentHTML("afterend", pal + (pts.length ? gr : "")); else Z.insertAdjacentHTML("afterbegin", pal + gr); };
document.head.insertAdjacentHTML("beforeend", `<style>.sc-st-liste{display:flex;flex-wrap:wrap;gap:6px}.sc-st{display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px;border:1px solid #d6cfc1;background:#fff;border-radius:9px;padding:5px 9px;cursor:pointer;font:inherit;font-size:14px}.sc-st.on{box-shadow:0 0 0 2px #2b2520}.sc-st:disabled{opacity:.6;cursor:not-allowed}.sc-st-n{font-size:12.5px;color:#7a6e5f}.sc-st-seuil{font-size:12px;color:#7a3f00;flex-basis:100%;text-align:left}
.sc-st-ech{display:inline-block;width:22px;height:12px;border-radius:3px;background-repeat:repeat-x;background-position:0 50%;vertical-align:middle;margin-right:4px;flex:none}
.sc-gr-pt{border-top:1px solid #e6dfd2;padding:8px 0 4px}.sc-gr-pt:first-of-type{border-top:0}.sc-gr-t{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px}.sc-gr-niv{font-size:12.5px;border:1.5px solid #d6cfc1;border-radius:8px;padding:2px 8px;white-space:nowrap}
.sc-gr-q{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:5px 6px;border-radius:7px;font-size:13.5px}.sc-gr-q.lien{cursor:pointer}.sc-gr-q.lien:hover{background:#f3ebdd}.sc-gr-s{grid-column:1/3;font-size:12.5px;color:#7a6e5f;display:flex;align-items:center}
.sc-gr-r{font-weight:700;font-size:12.5px}.sc-gr-r.o{color:#3a6e1c}.sc-gr-r.n{color:#c54040}.sc-gr-r.a{color:#7a6e5f;font-weight:400;font-style:italic}.sc-gr-fait{font-size:13px;color:#2b2520;margin:4px 6px 0;font-style:italic}
.sc-st-bulle{position:fixed;z-index:960;max-width:330px;background:#fffdf8;border:1px solid #d4b87a;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.18);padding:9px 12px;font:14px/1.4 system-ui,sans-serif;color:#2b2520;pointer-events:none}.sc-st-bulle>div{margin:2px 0}.sc-st-bt{display:flex;align-items:center;gap:4px}.sc-st-bq{font-size:13px;color:#5a4a3a}
@keyframes scStClign{0%,100%{opacity:1}50%{opacity:.25}}.sc-st-flash{animation:scStClign .4s ease-in-out 4}</style>`);
// dans le fichier de l'élève : la vague, l'échantillon de couleur, la bulle au survol (injectés dans scEleveLecture)
function scStEleveOutils() {
  const vague = c => "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><path d="M0 3 Q2 0.5 4 3 T8 3" fill="none" stroke="' + c + '" stroke-width="1.7"/></svg>') + "')";
  const ech = (c, s) => s === "oui" ? '<i class="sw" style="background:' + c + '55"></i>' : '<i class="sw" style="background-image:' + vague(c) + '"></i>';
  const e2 = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const bul = document.createElement("div"); bul.className = "bul"; bul.hidden = true; document.body.appendChild(bul);
  document.addEventListener("mouseover", e => { const g = e.target.closest && e.target.closest("[data-b]"); if (!g) { bul.hidden = true; return; } const [n, d, c, s] = g.dataset.b.split("|");
    bul.innerHTML = '<div style="display:flex;align-items:center">' + ech(c, s) + "<b>" + e2(n) + "</b></div><div>" + e2(d) + '</div><div style="font-size:13px;color:#7a6e5f">Clic : ce point de ta grille</div>'; bul.hidden = false;
    const r = g.getBoundingClientRect(); bul.style.left = Math.max(8, Math.min(innerWidth - bul.offsetWidth - 8, r.left)) + "px"; bul.style.top = (r.top - bul.offsetHeight - 10 > 8 ? r.top - bul.offsetHeight - 10 : r.bottom + 10) + "px"; });
  return { vague, ech }; }
// le fichier de l'élève : les mêmes marques de couleur, sans nom ; la légende de ses couleurs ; le survol (ou le clic sur téléphone) ouvre le détail
scEleveDonnees = (0, eval)("(" + scEleveDonnees.toString().replace("forme: m.forme, x0: m.x0,", "forme: m.forme, st: scStInfo(m), x0: m.x0,") + ")");
(function () { let t = scEleveLecture.toString();
  const r = (a, b) => { if (t.split(a).length !== 2) throw new Error("stickers : motif introuvable " + a.slice(0, 40)); t = t.replace(a, b); };
  r(".g{border-radius:4px}.mk.on{", ".g{border-radius:4px}.mk.stv{background-repeat:repeat-x;background-position:0 100%;margin-top:-1px}.mk.sth{mix-blend-mode:multiply;border-radius:3px}.mk.stv.on,.mk.sth.on{outline:2px solid #2b2520;outline-offset:3px}.bul{position:fixed;z-index:20;max-width:300px;background:#fffdf8;border:1px solid #d4b87a;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.18);padding:8px 11px;font-size:14px;pointer-events:none}.sw{display:inline-block;flex:none;width:22px;height:12px;border-radius:3px;background-repeat:repeat-x;background-position:0 50%;vertical-align:middle;margin-right:6px}.mk.on{");
  r('else Q.insertAdjacentHTML("beforeend", `<div class="mk ${m.forme === "marge" ? "g" : "e"}',
    'else if (m.st) Q.insertAdjacentHTML("beforeend", m.st.sens === "oui" ? `<div class="mk sth${on("p", i) ? " on" : ""}" data-v="p:${i}" data-b="${esc(m.st.txt)}|${esc(m.st.dit)}|${m.st.coul}|oui" style="left:${pc(m.x0 - 0.002)};top:${pc(m.y0)};width:${pc(m.x1 - m.x0 + 0.004)};height:${pc(m.y1 - m.y0)};background:${m.st.coul}55"></div>` : `<div class="mk stv${on("p", i) ? " on" : ""}" data-v="p:${i}" data-b="${esc(m.st.txt)}|${esc(m.st.dit)}|${m.st.coul}|non" style="left:${pc(m.x0)};top:${pc(m.y0)};width:${pc(m.x1 - m.x0)};height:calc(${pc(m.y1 - m.y0)} + 7px);background-image:${vague(m.st.coul)}"></div>`);\n        else Q.insertAdjacentHTML("beforeend", `<div class="mk ${m.forme === "marge" ? "g" : "e"}');
  r("const app = document.createElement(\"div\");", "const { vague, ech } = (" + scStEleveOutils.toString() + ")();\n  const app = document.createElement(\"div\");");
  r(': ""}${retour}</div>`; }', ': ""}${(() => { const vu = {}; const L = p.marques.filter(m => m.st && !vu[m.st.txt] && (vu[m.st.txt] = 1)); return L.length ? `<div class="bloc" style="margin:10px 0 0;background:#fff"><h3>Par exemple, sur ta copie</h3>${L.map(m => `<div style="margin:6px 0;display:flex;align-items:flex-start">${ech(m.st.coul, m.st.sens)}<span><b>${esc(m.st.txt)}</b> : ${esc(m.st.dit)}</span></div>`).join("")}</div>` : ""; })()}${retour}</div>`; }');
  r('<div class="bloc"><h3>Ta grille</h3>', '${(() => { const vu = {}, L = []; D.points.forEach(p => p.marques.forEach(m => { if (m.st && !vu[m.st.txt]) { vu[m.st.txt] = 1; L.push(m.st); } })); return L.length ? `<div class="bloc"><h3>Les couleurs sur ta copie</h3>${L.map(s => `<div style="margin:5px 0;display:flex;align-items:center">${ech(s.coul, s.sens)}${esc(s.txt)}</div>`).join("")}<div class="m">Passe sur une couleur, ou clique-la : tu lis ce qu\'elle veut dire.</div></div>` : ""; })()}<div class="bloc"><h3>Ta grille</h3>');
  scEleveLecture = (0, eval)("(" + t + ")"); })();
