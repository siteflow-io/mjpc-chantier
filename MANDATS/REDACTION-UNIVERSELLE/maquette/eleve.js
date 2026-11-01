// ── le fichier de l'élève, rendu par École Directe : sa photo et tes marques dedans (la photo ne passe jamais par le hub) ──
// Sans interactivité (un téléphone qui ouvre la pièce jointe sans l'exécuter) : la copie et les marques se voient quand même.
// Avec : la traversée, puis le parcours (les fautes d'abord, puis les points de haut en bas), les papillons, la note à la fin.
function scBlobUrl(b) { return new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b); }); }
function scSlug(t) { return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function scEleveDonnees(k, test) {
  const ps = scPagesDe(k); const s = scCopie(k); scNumeroter(k);
  const ordre = ps.map(p => p.id);
  const place = m => ({ page: ordre.indexOf(m.page), y: m.y0 });
  const M = Object.values(s.marques).filter(m => ordre.indexOf(m.page) >= 0);
  const fautes = M.filter(m => m.forme === "faute").sort((a, b) => (ordre.indexOf(a.page) - ordre.indexOf(b.page)) || (a.y0 - b.y0) || (a.x0 - b.x0))
    .map(m => { const p = SC.pages[m.page]; const l = m.l0 != null && m.l0 >= 0 ? m.l0 + 1 : null; return { id: m.id, page: ordre.indexOf(m.page), x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, num: m.num, rang: m.rang || 0, ligne: l, bonne: m.bonne || null, t: (m.bande && m.bande.code) || null }; });
  const pts = []; SC.grille.criteres.forEach(c => c.points.forEach(pt => { const r = scCase(pt, k); if (!r || !r.complet) return;   // seuls les points que tu as passés partent chez l'élève
    const ms = M.filter(m => m.point === pt.id && m.forme !== "faute" && m.forme !== "etoile").sort((a, b) => (ordre.indexOf(a.page) - ordre.indexOf(b.page)) || (a.y0 - b.y0));
    const pl = ms.length ? place(ms[0]) : { page: 0, y: 0 };
    pts.push({ id: pt.id, crit: c.id, critNom: c.nom, titre: pt.titre, poids: pt.poids, niveau: r.c.niveau, pts: pt.bareme[String(r.c.niveau)], fait: r.txt, tache: r.tache != null ? r.tache : (r.c.tache || ""),
      question: pt.questionEleve || "", relire: r.c.relire !== false,
      bareme: pt.bareme, place: pl, marques: ms.map(m => ({ page: ordre.indexOf(m.page), forme: m.forme, x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, seg: scSegments(m, SC.pages[m.page]) })) }); }));
  const etoile = M.filter(m => m.forme === "etoile").map(m => ({ page: ordre.indexOf(m.page), seg: scSegments(m, SC.pages[m.page]) }));
  const remarques = M.filter(m => m.forme === "remarque" && m.texte).map(m => ({ id: m.id, page: ordre.indexOf(m.page), x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, texte: m.texte, place: place(m) }));
  const nt = scNote(k), stD = typeof stEleve === "function" ? stEleve(k, ordre) : null, rp = (s.recopie || {}).pages || {};   // [C14 1.4.16] une copie corrigée avec les stickers : ses stickers et sa grille ; sinon, comme avant
  return { titre: SUJET.titre || "Rédaction", nom: nomEleveDe(k) || k, aRefaire: SC.aRefaire || "", cle: k, red: RU.id, classe: RU.classe, hub: RU_BASE, test: !!(test || RU.test || window.__FAUX_HUB), correctionEleve: scCorrectionEleve(),
    criteres: SC.grille.criteres.filter(c => c.id !== "langue").map(c => ({ id: c.id, nom: c.nom })), note: stD ? stD.note : nt.ok ? nt.n : null, total: stD ? stD.total : nt.tot,
    stickers: stD ? stD.stickers : null, grilleSt: stD ? stD.grille : null,
    pages: ps.map(p => { const d = (RC.copie === k && RC.documents && RC.documents[p.id]) || rp[p.id], m = d && d.marge; return { w: p.w, h: p.h, marge: m && isFinite(m.xh) && isFinite(m.xb) ? { xh: m.xh, xb: m.xb } : null }; }),   // [C14 1.4.17] la vraie marge rouge (Paul 15:09)
    reprendre: stD ? stD.reprendre || [] : [], fautes, points: stD ? [] : pts, etoile, remarques: stD ? [] : remarques, coul: SC_CRIT, fond: SC_FOND, bord: SC_COUL, types: scTypesEleve(),
    niveaux: Object.keys(ECHELON_COULEUR).map(n => ECHELON_COULEUR[n].label) };
}
/* [C14 1.4.12] (Paul 31/10 14:03 : « les mots sont soulignés dans la couleur de leur erreur et ils ont le détail dans la marge » ; C14 226) : les couleurs et
   les lettres de la correction de dictée (TYPE_STYLE, « Badge type ») ; une faute sans type d'erreur : gris, « • » */
const SC_COURT = { G: "G", M: "∅", I: "?", L: "L", C: "Acc.", P: "P", E: "E", X: "+", A: "⚠" };
function scTypesEleve() { const o = { _: { couleur: "#6b7280", fond: "#f3f4f6", libelle: "", court: "•" } }; if (typeof RC_TYPES === "object") Object.keys(RC_TYPES).forEach(c => { o[c] = Object.assign({}, RC_TYPES[c], { court: SC_COURT[c] || c }); }); return o; }
/* la marge ajoutée à gauche de la photo : à la hauteur de chaque ligne fautive, une pastille par faute, dans l'ordre de la ligne (sans la bonne forme) */
function scPastilles(D, i) {
  const F = D.fautes.map((f, j) => ({ f, j })).filter(o => o.f.page === i).sort((a, b) => ((a.f.y0 + a.f.y1) - (b.f.y0 + b.f.y1)) || (a.f.x0 - b.f.x0)), rangs = [];
  F.forEach(o => { const y = (o.f.y0 + o.f.y1) / 2, r = rangs.find(g => Math.abs(g.y - y) < 0.012); if (r) { r.l.push(o); r.y = (r.y * (r.l.length - 1) + y) / r.l.length; } else rangs.push({ y, l: [o] }); });
  rangs.forEach(g => g.l.sort((a, b) => a.f.x0 - b.f.x0));
  return rangs;
}
function scEleveFichier(k, test) {
  const D = scEleveDonnees(k, test); const ps = scPagesDe(k);
  return Promise.all(ps.map(p => SC.imgs[p.id] ? scBlobUrl(SC.imgs[p.id].blob) : Promise.resolve(""))).then(srcs => {
    const pc = (v) => (v * 100).toFixed(3) + "%";
    const statique = ps.map((p, i) => { let mk = "";
      D.fautes.filter(f => f.page === i).forEach(f => { const T = D.types[f.t] || D.types._; mk += `<div class="mk f" style="left:${pc(f.x0)};top:${pc(f.y1)};width:${pc(f.x1 - f.x0)};border-top-color:${T.couleur}"></div>`; });
      D.etoile.filter(e => e.page === i).forEach(e => e.seg.forEach(r => { mk += `<div class="mk s" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${SC_CRIT.etoile}40"></div>`; }));
      (D.stickers || []).filter(t => t.page === i).forEach(t => { mk += `<div class="mk e" style="left:${pc(t.x0 - 0.004)};top:${pc(t.y0 - 0.003)};width:${pc(t.x1 - t.x0 + 0.008)};height:${pc(t.y1 - t.y0 + 0.006)};border-color:${SC_CRIT[t.crit] || "#6b1a2a"}"></div>`; });
      D.points.forEach(pt => pt.marques.filter(m => m.page === i).forEach(m => { const c = SC_CRIT[pt.crit] || "#6b1a2a";
        if (m.forme === "surligne") m.seg.forEach(r => { mk += `<div class="mk s" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${c}40"></div>`; });
        else mk += `<div class="mk ${m.forme === "marge" ? "g" : "e"}" style="left:${pc(m.x0)};top:${pc(m.y0)};width:${pc(m.x1 - m.x0)};height:${pc(m.y1 - m.y0)};${m.forme === "marge" ? "background:" + c : "border-color:" + c}"></div>`; }));
      const mg = D.pages[i].marge, xm = y => mg.xh + (mg.xb - mg.xh) * y, sp = g => g.l.map(o => { const T = D.types[o.f.t] || D.types._; return `<span style="background:${T.fond};color:${T.texte || T.couleur};border-color:${T.couleur}">${T.court}</span>`; }).join("");
      const rq = (D.reprendre || []).filter(g => g.page === i).map(g => mg ? `<div class="pas2" style="left:${pc(xm(g.y) - 0.004)};top:${pc(g.y)}"><span class="rqn">${g.n}</span></div>` : "").join("");
      const marge = scPastilles(D, i).map(g => mg ? `<div class="pas2" style="left:${pc(xm(g.y) - 0.034)};top:${pc(g.y)}">${sp(g)}</div>` : `<div class="pas" style="top:${pc(g.y)}">${sp(g)}</div>`).join("");
      return `<div class="pgx">${mg ? "" : `<div class="marge">${marge}</div>`}<div class="pg" data-i="${i}" style="aspect-ratio:${p.w}/${p.h}"><img src="${srcs[i]}" alt="">${mk}${mg ? marge + rq : ""}</div></div>`; }).join("");
    const css = `*{box-sizing:border-box}body{margin:0;background:#f5f1ea;color:#2b2520;font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
.tete{background:linear-gradient(#c08a4a,#a67a44);color:#fff;padding:10px 16px;font:600 19px Georgia,serif}.tete small{font:14px system-ui;opacity:.9;margin-left:8px}
.copie{max-width:900px;margin:0 auto;padding:10px}.pg{position:relative;width:100%;margin-bottom:12px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)}.pg img{display:block;width:100%;height:100%}
.mk{position:absolute}.mk.f{height:0;border-top:3px solid #c54040;border-radius:2px}.pgx{display:flex;align-items:stretch;gap:4px;margin-bottom:12px}.pgx .pg{margin-bottom:0;flex:1;min-width:0}.marge{position:relative;width:46px;flex:none}.pas{position:absolute;left:0;right:0;transform:translateY(-50%);display:flex;flex-wrap:wrap;gap:2px;justify-content:center}.pas span{font:700 11px/1 system-ui;border:1.5px solid;border-radius:6px;padding:3px 3px;min-width:18px;text-align:center;cursor:pointer}.pas span.on{box-shadow:0 0 0 2px #2b2520}.mk.e{border:2.5px solid;border-radius:4px}.mk.g{border-radius:4px}.pas2{position:absolute;z-index:2;transform:translate(-100%,-50%);display:flex;flex-direction:row-reverse;gap:2px;align-items:center}.pas2 span{font:700 11px/1 system-ui;border:1.5px solid;border-radius:6px;padding:3px 3px;min-width:18px;text-align:center;background:#fff}.pas2 span.rqn,.rqn{background:#2b2520;color:#fff;border:0;border-radius:50%;width:22px;height:22px;min-width:22px;padding:0;font:700 12px/22px system-ui;text-align:center}`;
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(D.titre)} — ${escapeHtml(D.nom)}</title><style>${css}</style></head><body>
<div class="tete">${escapeHtml(D.titre)}<small>${escapeHtml(D.nom)}</small></div><div class="copie" id="statique">${statique}</div>
<script>const D=${JSON.stringify(D).replace(/</g, "\\u003c")};const IMG=${JSON.stringify(srcs)};(${(D.correctionEleve ? scEleveApp : scEleveLecture).toString()})(D,IMG);<\/script></body></html>`;
    return { html, nom: "Redaction-" + scSlug(D.titre).slice(0, 40) + "-" + scSlug(D.nom) + ".html", D };
  });
}
// ── 1463 : le fichier de l'élève en LECTURE SEULE (tant que la correction par l'élève n'est pas codée) ──
// Sa copie, tes marques (le pochoir), sa grille et sa note. Il clique une marque ou un point de sa grille : il voit le point, son échelle, sa case,
// ce qu'il a à reprendre ; il va et vient librement. Il n'écrit rien, rien ne part au site. La bonne forme d'une faute ne se montre pas :
// elle servira à la correction par l'élève, quand elle sera ouverte.
function scEleveLecture(D, IMG) {
  const $ = s => document.querySelector(s); const pc = v => (v * 100).toFixed(3) + "%"; const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const Ty = f => (D.types && (D.types[f.t] || D.types._)) || { couleur: "#c54040", fond: "#fde8e8", libelle: "", court: "•" };   // [C14 1.4.12] le type d'erreur d'une faute, sa couleur et sa lettre
  let vue = null;   // null : la grille ; { t: "p", i } un point ; { t: "f", i } une faute ; { t: "r", i } une remarque ; { t: "e" } la phrase dorée
  if (D.test) document.body.insertAdjacentHTML("afterbegin", `<div style="background:#fff3d6;border-bottom:1px solid #d4b87a;color:#5a3010;padding:5px 14px;font:14px system-ui">🧪 Mode test : le fichier tel que l'élève le verra. Il le lit, il n'y écrit rien.</div>`);
  const st = document.createElement("style"); st.textContent = `#statique{display:none}
.app{display:flex;gap:16px;padding:12px;min-height:calc(100vh - 50px)}.col{flex:1;min-width:0}.pan{width:420px;flex:none;position:sticky;top:10px;align-self:flex-start;max-height:calc(100vh - 20px);overflow:auto}
.pg{position:relative;width:100%;max-width:1000px;margin:0 auto 12px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)}.pg img{display:block;width:100%;height:100%}
.mk{position:absolute;cursor:pointer}#col .mk.f{height:12px;margin-top:-9px;border:0;border-radius:0}#col .mk.f::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:2px;background:var(--c,#c54040)}#col .mk.f.on{outline:0}#col .mk.f.on::after{height:5px;bottom:-1px;box-shadow:0 0 0 3px #2b252033}.pgx{display:flex;align-items:stretch;gap:4px;max-width:1046px;margin:0 auto 12px}.pgx .pg{margin:0;flex:1;min-width:0}.marge{position:relative;width:46px;flex:none}.pas{position:absolute;left:0;right:0;transform:translateY(-50%);display:flex;flex-wrap:wrap;gap:2px;justify-content:center}.pas span{font:700 11px/1 system-ui;border:1.5px solid;border-radius:6px;padding:3px 3px;min-width:18px;text-align:center;cursor:pointer}.pas span.on{box-shadow:0 0 0 2px #2b2520}.e{border:2.5px solid;border-radius:4px}.g{border-radius:4px}.mk.on{outline:3px solid #2b2520;outline-offset:2px}
.num{position:absolute;transform:translate(-50%,-50%);background:#c54040;color:#fff;border-radius:50%;width:22px;height:22px;font:700 12px/22px system-ui;text-align:center;cursor:pointer}
.pin{position:absolute;left:.4%;transform:translateY(-50%);width:26px;height:26px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3);cursor:pointer}.pin.on{box-shadow:0 0 0 3px #2b2520}
.bloc{background:#fdfbf7;border:1px solid #d6cfc1;border-radius:10px;padding:12px 14px;margin-bottom:10px}.bloc h3{margin:0 0 6px;font:600 12.5px system-ui;letter-spacing:.1em;text-transform:uppercase;color:#6b1a2a}
.note{font:700 32px Georgia,serif}.ligne{display:grid;grid-template-columns:16px 1fr auto;gap:8px;align-items:start;padding:6px 4px;border-radius:7px;cursor:pointer}.ligne:hover{background:#f3ebdd}.ligne i{width:14px;height:14px;border-radius:50%;margin-top:4px}.ligne b{white-space:nowrap}
.crit{font:600 13px system-ui;color:#6b1a2a;margin:10px 0 2px}.m{color:#7a6e5f;font-size:14px}
.ech{display:flex;gap:4px;margin:8px 0}.ech span{flex:1;border:2px solid;border-radius:7px;padding:4px;font-size:12px;text-align:center;opacity:.45}.ech span.on{opacity:1;font-weight:700;box-shadow:0 0 0 2px #2b2520}
button{font:inherit;border:0;border-radius:8px;background:#6b1a2a;color:#fff;padding:8px 14px;margin-top:8px;cursor:pointer}button.clair{background:#fff;color:#6b1a2a;border:1px solid #d6cfc1}
.trav{position:fixed;inset:0;background:#f5f1ea;z-index:9;display:flex;flex-direction:column;align-items:center;justify-content:center}.sc3{perspective:1400px;height:62vh;width:100%;display:flex;align-items:center;justify-content:center}
.pile{position:relative;width:min(34vh,60vw);aspect-ratio:${D.pages[0] ? D.pages[0].w + "/" + D.pages[0].h : "210/297"};transform-style:preserve-3d;transform:rotateX(55deg) rotateZ(-28deg)}
.feuille{position:absolute;inset:0;border:2px solid;border-radius:4px;background:rgba(255,255,255,.25)}.feuille b{position:absolute;right:-4px;top:-26px;color:#fff;font:700 13px system-ui;padding:2px 8px;border-radius:6px 6px 0 0}
.cp{position:absolute;inset:0;transition:transform 1.4s ease}.cp img{width:100%;height:100%;display:block;border-radius:4px;box-shadow:0 14px 26px rgba(0,0,0,.3)}
.leg{max-width:640px;text-align:center;font-size:18px;padding:0 16px;min-height:3em}.passer{position:absolute;right:16px;bottom:16px;background:#fff;color:#6b1a2a;border:1px solid #d6cfc1}
.pas2{position:absolute;z-index:2;transform:translate(-100%,-50%);display:flex;flex-direction:row-reverse;flex-wrap:wrap;justify-content:flex-start;gap:2px;align-items:center}.pas2 span{font:700 11px/1 system-ui;border:1.5px solid;border-radius:6px;padding:3px 3px;min-width:18px;text-align:center;cursor:pointer;background:#fff}.pas2 span.on,.pas span.on{box-shadow:0 0 0 2px #2b2520}
.rqn,.pas2 span.rqn,.pas span.rqn{display:inline-block;background:#2b2520;color:#fff;border:0;border-radius:50%;width:24px;height:24px;min-width:24px;padding:0;margin:0 2px;font:700 13px/24px system-ui;text-align:center;cursor:pointer;vertical-align:middle}.rqn.on{box-shadow:0 0 0 3px #e0a800}
#col .mk.rq{border:2.5px dashed #2b2520;border-radius:5px;cursor:default}.rq1{border-left:4px solid var(--c);padding:4px 0 4px 10px;margin:10px 0}.rqa{font-weight:600;color:var(--c)}.rqp{background:#fff;border:1px solid #e3dccf;border-radius:8px;padding:8px 10px;margin:6px 0;font-size:16px}.rqp small{display:block;font:600 11px system-ui;letter-spacing:.08em;text-transform:uppercase;color:#7a6e5f}.rqp mark{background:#fde68a;color:inherit;border-radius:3px;padding:0 2px}.rqt{font-size:17px;margin-top:4px}
.tys{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.ty{font:14px system-ui;border:1.5px solid;border-radius:8px;padding:5px 9px;margin:0;cursor:pointer}.ty b{font-weight:700}.ty.on{box-shadow:0 0 0 2px #2b2520}.rqs{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.ech span b{font-weight:700}.gc{position:fixed;inset:0;background:rgba(30,25,20,.55);z-index:20;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:16px}.gc-c{background:#fdfbf7;border-radius:12px;max-width:1200px;width:100%;padding:14px 16px}.gc-h{display:flex;gap:16px;align-items:center;justify-content:space-between;margin-bottom:10px;font:600 18px Georgia,serif}.gc-h button{margin:0}.gc-t{overflow-x:auto}.gc table{border-collapse:collapse;width:100%;font-size:14px;min-width:760px}.gc td,.gc th{border:1px solid #e3dccf;padding:6px 8px;vertical-align:top;text-align:left}.gc th{font:600 12px system-ui;letter-spacing:.05em;text-transform:uppercase}.gc td.on{outline:3px solid #2b2520;outline-offset:-3px;font-weight:700}.gc .gc-crit{font:600 13px system-ui;background:#f3ebdd}.gc small{color:#7a6e5f}
@media (max-width:820px){.rqn,.pas2 span.rqn{width:18px;height:18px;min-width:18px;font-size:10px;line-height:18px}.pas2 span{font-size:8.5px;min-width:13px;padding:2px 1px;border-width:1px}.app{display:block;padding:6px}.pan{position:fixed;z-index:6;left:0;right:0;bottom:0;top:auto;width:auto;max-height:46vh;margin:0;border-radius:14px 14px 0 0;box-shadow:0 -4px 14px rgba(0,0,0,.15);background:#f5f1ea;padding:8px}.col{padding-bottom:48vh}}`;
  document.head.appendChild(st);
  const app = document.createElement("div"); app.className = "app"; app.innerHTML = `<div class="col" id="col"></div><div class="pan" id="pan"></div>`; document.body.appendChild(app);
  const montrer = (page, y) => { const P = document.querySelectorAll(".pg")[page]; if (!P) return; const r = P.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top + r.height * y - window.innerHeight * 0.3, behavior: "smooth" }); };
  function copie() {
    const on = (t, i) => vue && vue.t === t && vue.i === i;
    const rangs = i => { const F = D.fautes.map((f, j) => ({ f, j })).filter(o => o.f.page === i).sort((a, b) => ((a.f.y0 + a.f.y1) - (b.f.y0 + b.f.y1)) || (a.f.x0 - b.f.x0)), R = [];   // la même règle que scPastilles (ce code tourne seul chez l'élève)
      F.forEach(o => { const y = (o.f.y0 + o.f.y1) / 2, r = R.find(g => Math.abs(g.y - y) < 0.012); if (r) { r.l.push(o); r.y = (r.y * (r.l.length - 1) + y) / r.l.length; } else R.push({ y, l: [o] }); }); R.forEach(g => g.l.sort((a, b) => a.f.x0 - b.f.x0)); return R; };
    /* [C14 1.4.17] (Paul 15:09 : « pourquoi ne pas utiliser la vraie marge ? […] il faut utiliser la marge ») : les pastilles des fautes et le numéro des remarques,
       dans la marge rouge de la copie, contre le trait ; une copie sans marge connue garde la colonne ajoutée à gauche */
    const tyOn = f => vue && vue.t === "ty" && vue.c === (f.t || "_");
    const fSpan = o => `<span class="${on("f", o.j) || tyOn(o.f) ? "on" : ""}" data-v="f:${o.j}" title="Faute ${o.f.num}" style="background:${Ty(o.f).fond};color:${Ty(o.f).texte || Ty(o.f).couleur};border-color:${Ty(o.f).couleur}">${Ty(o.f).court}</span>`;
    const rangsM = i => { const R = rangs(i).map(g => ({ y: g.y, f: g.l, q: null })); (D.reprendre || []).filter(g => g.page === i).forEach(g => { const r = R.find(x => !x.q && Math.abs(x.y - g.y) < 0.014); if (r) r.q = g; else R.push({ y: g.y, f: [], q: g }); }); return R; };
    const rqSpan = r => r.q ? `<span class="rqn${on("q", r.q.n - 1) ? " on" : ""}" data-v="q:${r.q.n - 1}" title="À reprendre">${r.q.n}</span>` : "";
    const xm = (i, y) => { const m = D.pages[i].marge; return m.xh + (m.xb - m.xh) * y; };
    const dansMarge = i => rangsM(i).map(r => `<div class="pas2" style="left:${pc(xm(i, r.y) - 0.004)};top:${pc(r.y)};max-width:${pc(Math.max(0.05, xm(i, r.y) - 0.01))}">${rqSpan(r)}${r.f.map(fSpan).join("")}</div>`).join("");
    const marge = i => rangsM(i).map(r => `<div class="pas" style="top:${pc(r.y)}">${rqSpan(r)}${r.f.map(fSpan).join("")}</div>`).join("");
    const col = $("#col"); col.innerHTML = D.pages.map((p, i) => `<div class="pgx">${p.marge ? "" : `<div class="marge">${marge(i)}</div>`}<div class="pg" data-i="${i}" style="aspect-ratio:${p.w}/${p.h}"><img src="${IMG[i]}" alt="">${p.marge ? dansMarge(i) : ""}</div></div>`).join("");
    const pgs = col.querySelectorAll(".pg");
    D.etoile.forEach(e => e.seg.forEach(r => pgs[e.page] && pgs[e.page].insertAdjacentHTML("beforeend", `<div class="mk${vue && vue.t === "e" ? " on" : ""}" data-v="e" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${D.coul.etoile}40"></div>`)));
    D.fautes.forEach((f, i) => { const P = pgs[f.page]; if (!P) return;
      P.insertAdjacentHTML("beforeend", `<div class="mk f${on("f", i) || tyOn(f) ? " on" : ""}" data-v="f:${i}" style="left:${pc(f.x0)};top:${pc(f.y1)};width:${pc(f.x1 - f.x0)};--c:${Ty(f).couleur}"></div>`); });
    (D.stickers || []).forEach((t, i) => { const P = pgs[t.page]; if (!P) return; const k = D.coul[t.crit] || "#6b1a2a";   // [C14 1.4.16] un sticker réussi : encadré dans la couleur de son critère ; un clic, son texte
      P.insertAdjacentHTML("beforeend", `<div class="mk e st${on("s", i) ? " on" : ""}" data-v="s:${i}" title="${esc(t.texte)}" style="left:${pc(t.x0 - 0.004)};top:${pc(t.y0 - 0.003)};width:${pc(t.x1 - t.x0 + 0.008)};height:${pc(t.y1 - t.y0 + 0.006)};border-color:${k};background:${k}14"></div>`); });
    if (vue && vue.t === "q") { const g = (D.reprendre || [])[vue.i]; if (g) g.l.forEach(x => { const P = pgs[g.page]; if (!P || x.x0 == null) return; P.insertAdjacentHTML("beforeend", `<div class="mk rq" style="left:${pc(x.x0 - 0.004)};top:${pc(x.y0 - 0.004)};width:${pc(x.x1 - x.x0 + 0.008)};height:${pc(x.y1 - x.y0 + 0.008)}"></div>`); }); }   // [C14 1.4.17] le passage visé par la remarque
    (D.remarques || []).forEach((r0, i) => { const P = pgs[r0.page]; if (!P) return; P.insertAdjacentHTML("beforeend", `<div class="mk e${on("r", i) ? " on" : ""}" data-v="r:${i}" style="left:${pc(r0.x0 - 0.004)};top:${pc(r0.y0 - 0.003)};width:${pc(r0.x1 - r0.x0 + 0.008)};height:${pc(r0.y1 - r0.y0 + 0.006)};border:2px dashed #6b1a2a"></div>`); });
    const pris = {}; D.points.forEach((p, i) => { const P = pgs[p.place.page]; if (!P) return; const k = D.coul[p.crit] || "#6b1a2a"; const cle = p.place.page + ":" + Math.round(p.place.y * 40); const dx = (pris[cle] = (pris[cle] || 0) + 1) - 1;
      p.marques.forEach(m => { const Q = pgs[m.page]; if (!Q) return;
        if (m.forme === "surligne") m.seg.forEach(r => Q.insertAdjacentHTML("beforeend", `<div class="mk${on("p", i) ? " on" : ""}" data-v="p:${i}" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${k}${on("p", i) ? "66" : "40"};mix-blend-mode:multiply"></div>`));
        else Q.insertAdjacentHTML("beforeend", `<div class="mk ${m.forme === "marge" ? "g" : "e"}${on("p", i) ? " on" : ""}" data-v="p:${i}" style="left:${pc(m.x0)};top:${pc(m.y0)};width:${pc(m.x1 - m.x0)};height:${pc(m.y1 - m.y0)};${m.forme === "marge" ? "background:" + k : "border-color:" + k}"></div>`); });
      P.insertAdjacentHTML("beforeend", `<div class="pin${on("p", i) ? " on" : ""}" data-v="p:${i}" style="top:${pc(Math.max(0.015, p.place.y))};margin-left:${dx * 30}px;background:${D.bord[p.niveau]}"></div>`); });
    col.querySelectorAll("[data-v]").forEach(e => e.addEventListener("click", () => { const [t, i] = e.dataset.v.split(":"); vue = { t, i: i == null ? null : +i }; copie(); panneau(); }));
  }
  const retour = `<button class="clair" id="gr">← Ta grille</button>`;
  function panneau() {
    const pan = $("#pan");
    const num = x => String(x).replace(".", ",");
    if (!vue && D.grilleSt || vue && vue.t === "ty" && D.grilleSt) {   // [C14 1.4.16] la grille en stickers ; [C14 1.4.17] (Paul 15:09) formulée pour l'élève, la langue en couleurs, ce qui est à reprendre
      const crit = []; D.grilleSt.forEach((l, i) => { let c = crit.find(x => x.id === l.crit); if (!c) crit.push(c = { id: l.crit, nom: l.critNom, l: [] }); c.l.push({ l, i }); });
      const ty = {}; D.fautes.forEach(f => { const c = f.t || "_"; ty[c] = (ty[c] || 0) + 1; });
      pan.innerHTML = `<div class="bloc"><h3>Ta note</h3><div class="note">${D.note != null ? num(D.note) + " / " + D.total : "…"}</div><button class="clair" id="gc" title="Toute ta grille d'un coup d'œil">🪟 Voir ma grille complète</button></div>
        ${D.fautes.length ? `<div class="bloc"><h3>La langue</h3><div>${D.fautes.length} soulignée${D.fautes.length > 1 ? "s" : ""} sur ta copie, chacune dans la couleur de son type d'erreur.</div><div class="tys">${Object.keys(ty).map(c => { const T = D.types[c] || D.types._; return `<button class="ty${vue && vue.t === "ty" && vue.c === c ? " on" : ""}" data-ty="${c}" style="background:${T.fond};color:${T.texte || T.couleur};border-color:${T.couleur}"><b>${esc(T.court)}</b> ${esc(T.libelle || "")} · ${ty[c]}</button>`; }).join("")}</div></div>` : ""}
        ${(D.reprendre || []).length ? `<div class="bloc"><h3>À reprendre</h3><div>Clique les numéros dans la marge de ta copie.</div><div class="rqs">${D.reprendre.map((g, i) => `<button class="rqn" data-q="${i}" title="À reprendre">${g.n}</button>`).join("")}</div></div>` : ""}
        <div class="bloc"><h3>Ta grille</h3>${crit.map(c => `<div class="crit" style="color:${D.coul[c.id] || "#6b1a2a"}">${esc(c.nom)}</div>` + c.l.map(({ l, i }) => `<div class="ligne" data-l="${i}"><i style="background:${l.niveau != null ? D.bord[l.niveau] : "#d6cfc1"}"></i><span>${esc(l.eleve || l.titre)}${l.reussis.length || l.manquent.length ? `<br><span class="m">${"★".repeat(l.reussis.length)}${"☆".repeat(l.manquent.length)}</span>` : ""}</span><b>${num(l.points)} / ${num(l.poids)}</b></div>`).join("")).join("")}</div>`;
      pan.querySelectorAll("[data-l]").forEach(e => e.addEventListener("click", () => { vue = { t: "l", i: +e.dataset.l }; copie(); panneau(); const l = D.grilleSt[vue.i], t = (D.stickers || []).find(x => x.ligne === l.id && x.page >= 0); if (t) montrer(t.page, t.y0); }));
      pan.querySelectorAll("[data-ty]").forEach(e => e.addEventListener("click", () => { const c = e.dataset.ty; vue = vue && vue.t === "ty" && vue.c === c ? null : { t: "ty", c }; copie(); panneau(); const f = D.fautes.find(x => (x.t || "_") === c); if (vue && f) montrer(f.page, f.y0); }));
      pan.querySelectorAll("[data-q]").forEach(e => e.addEventListener("click", () => { vue = { t: "q", i: +e.dataset.q }; copie(); panneau(); const g = D.reprendre[vue.i]; montrer(g.page, g.y); }));
      $("#gc").onclick = grilleComplete;
      return;
    }
    if (vue && vue.t === "l") { const l = D.grilleSt[vue.i];
      const ech = l.echelle && l.echelle.length ? `<div class="ech">${l.echelle.map(e => `<span class="${e.n === l.niveau ? "on" : ""}" style="background:${D.fond[e.n]};border-color:${D.bord[e.n]}">${esc(D.niveaux[e.n])}<br><b>${num(e.points)} pt</b>${e.texte ? `<br>${esc(e.texte)}` : ""}</span>`).join("")}</div>` : "";
      pan.innerHTML = `<div class="bloc"><h3 style="color:${D.coul[l.crit] || "#6b1a2a"}">${esc(l.critNom)}</h3><div style="font-weight:700;font-size:17px">${esc(l.eleve || l.titre)}</div><div class="m">${l.eleve ? esc(l.titre) + " · " : ""}${num(l.points)} / ${num(l.poids)}</div>${ech}${l.fait ? `<div style="font-size:16px;margin:6px 0">${esc(l.fait)}</div>` : ""}
        ${l.reussis.map(t => `<div style="font-size:17px;margin-top:6px">★ ${esc(t)}</div>`).join("")}${l.manquent.length ? `<div class="bloc" style="margin:10px 0 0;background:#fff"><h3>Pas encore réussi</h3>${l.manquent.map(t => `<div style="margin-top:8px">☆ ${esc(t.texte)}${t.n ? ` <button class="rqn" data-q="${t.n - 1}" title="À reprendre">${t.n}</button>` : ""}${t.r ? `<div class="rqt" style="font-size:16px">${esc(t.r)}</div>` : ""}</div>`).join("")}</div>` : ""}${retour}</div>`;
      pan.querySelectorAll("[data-q]").forEach(e => e.addEventListener("click", () => { vue = { t: "q", i: +e.dataset.q }; copie(); panneau(); const g = D.reprendre[vue.i]; montrer(g.page, g.y); }));
      $("#gr").onclick = () => { vue = null; copie(); panneau(); }; return; }
    if (vue && vue.t === "q") { const g = D.reprendre[vue.i];   // [C14 1.4.17] une remarque : ce qui était attendu, sa phrase telle que tu l'as recopiée, puis la remarque
      pan.innerHTML = `<div class="bloc"><h3>À reprendre · ${g.n}</h3>${g.l.map(x => `<div class="rq1" style="--c:${D.coul[x.crit] || "#6b1a2a"}"><div class="rqa">☆ ${esc(x.attendu)}</div>${x.phrase ? `<div class="rqp"><small>Ta phrase</small>« ${esc(x.phrase.avant)}${x.phrase.passage ? `<mark>${esc(x.phrase.passage)}</mark>` : ""}${esc(x.phrase.apres)} »</div>` : ""}<div class="rqt">${esc(x.r)}</div></div>`).join("")}${retour}</div>`;
      $("#gr").onclick = () => { vue = null; copie(); panneau(); }; return; }
    if (!vue) {
      const crit = []; D.points.forEach((p, i) => { let c = crit.find(x => x.id === p.crit); if (!c) crit.push(c = { id: p.crit, nom: p.critNom, l: [] }); c.l.push({ p, i }); });
      pan.innerHTML = `<div class="bloc"><h3>Ta note</h3><div class="note">${D.note != null ? String(D.note).replace(".", ",") + " / " + D.total : "…"}</div></div>
        <div class="bloc"><h3>Ta grille</h3>${crit.map(c => `<div class="crit">${esc(c.nom)}</div>` + c.l.map(({ p, i }) => `<div class="ligne" data-p="${i}"><i style="background:${D.bord[p.niveau]}"></i><span>${esc(p.titre)}<br><span class="m">${esc(p.fait)}</span></span><b>${String(p.pts).replace(".", ",")} / ${p.poids}</b></div>`).join("")).join("")}</div>
        ${D.fautes.length ? `<div class="bloc"><h3>Tes fautes</h3><div>${D.fautes.length} soulignée${D.fautes.length > 1 ? "s" : ""} sur ta copie, chacune dans la couleur de son type d'erreur.</div></div>` : ""}
        ${(D.remarques || []).length ? `<div class="bloc"><h3>Mes remarques</h3>${D.remarques.map((r, i) => `<div class="ligne" data-r="${i}"><i style="background:#6b1a2a"></i><span>${esc(r.texte)}</span><b></b></div>`).join("")}</div>` : ""}`;
      pan.querySelectorAll("[data-p]").forEach(e => e.addEventListener("click", () => { const i = +e.dataset.p; vue = { t: "p", i }; copie(); panneau(); const p = D.points[i]; montrer(p.place.page, p.place.y); }));
      pan.querySelectorAll("[data-r]").forEach(e => e.addEventListener("click", () => { const i = +e.dataset.r; vue = { t: "r", i }; copie(); panneau(); const r = D.remarques[i]; montrer(r.page, r.y0); }));
      return;
    }
    if (vue.t === "p") { const p = D.points[vue.i];
      pan.innerHTML = `<div class="bloc"><h3>${esc(p.critNom)}</h3><div style="font-weight:700">${esc(p.titre)}</div>
        <div class="ech">${[0, 1, 2, 3].map(n => `<span class="${n === p.niveau ? "on" : ""}" style="background:${D.fond[n]};border-color:${D.bord[n]}">${esc(D.niveaux[n])}<br>${String(p.bareme[n]).replace(".", ",")}</span>`).join("")}</div>
        <div style="font-size:17px">${esc(p.fait)}</div>${p.tache ? `<div class="bloc" style="margin:10px 0 0;background:#fff"><h3>À reprendre</h3>${esc(p.tache)}</div>` : ""}${retour}</div>`; }
    else if (vue.t === "f") { const f = D.fautes[vue.i], T = Ty(f); pan.innerHTML = `<div class="bloc"><h3>Faute ${f.num} sur ${D.fautes.length}</h3><div class="tys"><span class="ty on" style="background:${T.fond};color:${T.texte || T.couleur};border-color:${T.couleur}"><b>${esc(T.court)}</b> ${esc(T.libelle || "")}</span></div>${retour}</div>`; }
    else if (vue.t === "r") { const r = D.remarques[vue.i]; pan.innerHTML = `<div class="bloc"><h3>Ma remarque</h3><div style="font-size:17px">${esc(r.texte)}</div>${retour}</div>`; }
    else pan.innerHTML = `<div class="bloc"><h3>La phrase qui m'a marqué</h3><div>Surlignée en or sur ta copie.</div>${retour}</div>`;
    $("#gr").onclick = () => { vue = null; copie(); panneau(); };
  }
  function grilleComplete() {
    const num = x => String(x).replace(".", ","), crit = []; (D.grilleSt || []).forEach(l => { let c = crit.find(x => x.id === l.crit); if (!c) crit.push(c = { id: l.crit, nom: l.critNom, l: [] }); c.l.push(l); });
    const G = document.createElement("div"); G.className = "gc";
    G.innerHTML = `<div class="gc-c" role="dialog" aria-label="Ma grille complète"><div class="gc-h"><span>Ma grille complète · ${D.note != null ? num(D.note) + " / " + D.total : "…"}</span><button class="clair" id="gcF">Fermer</button></div><div class="gc-t"><table><tr><th>Ce qui est attendu</th>${[0, 1, 2, 3].map(n => `<th style="background:${D.fond[n]}">${esc(D.niveaux[n])}</th>`).join("")}<th>Tes points</th></tr>`
      + crit.map(c => `<tr><td colspan="6" class="gc-crit" style="color:${D.coul[c.id] || "#6b1a2a"}">${esc(c.nom)}</td></tr>` + c.l.map(l => `<tr><td><b>${esc(l.eleve || l.titre)}</b>${l.eleve ? `<br><small>${esc(l.titre)}</small>` : ""}</td>${(l.echelle || []).map(e => `<td class="${e.n === l.niveau ? "on" : ""}"${e.n === l.niveau ? ` style="background:${D.fond[e.n]}"` : ""}>${e.texte ? esc(e.texte) + "<br>" : ""}<b>${num(e.points)} pt</b></td>`).join("")}<td><b>${num(l.points)} / ${num(l.poids)}</b></td></tr>`).join("")).join("") + `</table></div></div>`;
    document.body.appendChild(G); G.querySelector("#gcF").onclick = () => G.remove(); G.addEventListener("click", ev => { if (ev.target === G) G.remove(); });
  }
  // la traversée (cadrée le 29/10) : à l'ouverture, la copie passe à travers la grille, la langue d'abord
  function traversee() {
    const crit = [{ id: "langue", nom: "La langue" }].concat(D.criteres); const nomsC = D.criteres.map(c => c.nom.replace(/^L[ae]s? |^L'/, m => m.toLowerCase()));
    const liste = nomsC.length > 1 ? nomsC.slice(0, -1).join(", ") + " et " + nomsC[nomsC.length - 1] : (nomsC[0] || "");
    const L = ["La grille de correction est au-dessus de ta copie : une feuille par critère.", "Ta copie passe d'abord à travers la langue : tes erreurs apparaissent, soulignées dans la couleur de leur type d'erreur.",
      "Puis à travers " + liste + " : leurs points apparaissent sur ta copie.", "Ta copie est passée à travers toute la grille."];
    const T = document.createElement("div"); T.className = "trav";
    T.innerHTML = `<div class="sc3"><div class="pile">${crit.map((c, i) => `<div class="feuille" style="transform:translateZ(${(i + 1) * 46}px);border-color:${D.coul[c.id] || "#6b1a2a"}"><b style="background:${D.coul[c.id] || "#6b1a2a"}">${esc(c.nom)}</b></div>`).join("")}<div class="cp" id="cp"><img src="${IMG[0] || ""}" alt=""></div></div></div><div class="leg" id="leg"></div><button class="passer" id="passer">⏭ Passer</button>`;
    document.body.appendChild(T); let i = 0, fait = false;
    const pas = () => { if (fait) return; $("#leg").textContent = L[Math.min(i, 3)]; $("#cp").style.transform = "translateZ(" + (i === 0 ? 0 : i === 1 ? 70 : i === 2 ? 46 * (crit.length) - 10 : 46 * (crit.length + 1)) + "px)"; i++; if (i <= 4) setTimeout(i === 4 ? fin : pas, 2600); };
    const fin = () => { if (fait) return; fait = true; T.remove(); }; $("#passer").onclick = fin; setTimeout(pas, 400);
  }
  copie(); panneau(); traversee();
}
// ════ SECTION À CODER : LA CORRECTION PAR L'ÉLÈVE (voir SC_CORRECTION_ELEVE_CODEE dans scan.js, et docs/MJPC6-DETTES.md) ════
// L'ancien parcours, gardé pour être repris, jamais appelé tant que la correction par l'élève est fermée. Ce que Paul a écarté le 30/10 :
// la question avant la case, la tâche écrite et sa relecture (« je n'ai pas de relecture de correction à faire ») ; ce qui se recycle :
// le transport des retours (site, onglet de test, ce navigateur) et la vérification d'une faute contre ta bonne forme.
// le code qui tourne chez l'élève (il ne voit rien d'autre de l'app : aucune variable extérieure)
function scEleveApp(D, IMG) {
  const $ = s => document.querySelector(s); const pc = v => (v * 100).toFixed(3) + "%"; const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const R = {}; let etape = 0;
  // Les retours : lus à l'ouverture, écrits à chaque réponse, et tes verdicts reçus sans recharger — le même code pour l'élève et pour ton test.
  // Seul le transport change : le site pour l'élève ; en mode test (celui de MJPC, ou la maquette), l'onglet de correction qui a ouvert ce fichier
  // (« Tester comme l'élève »), qui lit et écrit comme le site, dans son mode test ; ouvert seul, ce navigateur. Jamais le site en mode test.
  const url = cle => D.hub + "/redactions/" + encodeURIComponent(D.red) + "/retours/" + encodeURIComponent(D.classe) + "/" + encodeURIComponent(D.cle) + (cle ? "/" + encodeURIComponent(cle) : "") + ".json";
  const voisin = D.test ? (window.opener && !window.opener.closed ? window.opener : (window.parent !== window ? window.parent : null)) : null;
  const cleLocale = "mjpc_retours_test_" + D.red + "_" + D.cle; let nreq = 0; const attente = {};
  if (voisin) addEventListener("message", e => { const d = e.data && e.data.mjpcReponse; if (d && e.source === voisin && attente[d.n]) { attente[d.n](d.v); delete attente[d.n]; } });
  const demander = o => new Promise(res => { const n = ++nreq; attente[n] = res; try { voisin.postMessage({ mjpcDemande: Object.assign({ n, red: D.red, eleve: D.cle }, o) }, "*"); } catch (e) { res(null); } setTimeout(() => { if (attente[n]) { delete attente[n]; res(null); } }, 4000); });
  const poserA = (o, s, v) => { if (!s.length) return v; o = (o && typeof o === "object") ? Object.assign({}, o) : {}; const r = poserA(o[s[0]], s.slice(1), v); if (r == null) delete o[s[0]]; else o[s[0]] = r; return o; };
  const T = !D.test ? {
      lire: () => fetch(url()).then(r => r.ok ? r.json() : null).catch(() => null),
      ecrire: (cle, v) => fetch(url(cle), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) }).catch(() => null),
      abonner: f => { if (typeof EventSource !== "function") return; let miroir = null; const es = new EventSource(url());
        const app = (ev, patch) => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } if (!m || typeof m.path !== "string") return; const sg = m.path.split("/").filter(Boolean);
          if (patch) Object.keys(m.data || {}).forEach(k => { miroir = poserA(miroir, sg.concat(k.split("/").filter(Boolean)), m.data[k]); }); else miroir = poserA(miroir, sg, m.data); f(miroir || {}); };
        es.addEventListener("put", ev => app(ev, false)); es.addEventListener("patch", ev => app(ev, true)); } }
    : voisin ? { lire: () => demander({ op: "lire" }), ecrire: (cle, v) => demander({ op: "ecrire", cle, v }),
      abonner: f => addEventListener("message", e => { const d = e.data && e.data.mjpcPousse; if (d && e.source === voisin && d.eleve === D.cle) f(d.v || {}); }) }
    : { lire: () => Promise.resolve((() => { try { return JSON.parse(localStorage.getItem(cleLocale) || "null"); } catch (e) { return null; } })()),
      ecrire: (cle, v) => { try { const t = JSON.parse(localStorage.getItem(cleLocale) || "{}"); t[cle] = v; localStorage.setItem(cleLocale, JSON.stringify(t)); } catch (e) {} return Promise.resolve(); },
      abonner: f => addEventListener("storage", e => { if (e.key === cleLocale) { try { f(JSON.parse(e.newValue || "{}")); } catch (x) {} } }) };
  const lire = () => T.lire(); const ecrire = (cle, v) => { R[cle] = v; return T.ecrire(cle, v); };
  // un verdict arrivé pendant que l'élève écrit attend qu'il ait quitté son champ : un redessin ne touche jamais le champ en cours
  let aRedessiner = false; const enCours = () => { const a = document.activeElement; return !!a && ["rep", "pap", "rq"].includes(a.id); };
  const recevoir = v => { if (JSON.stringify(v || {}) === JSON.stringify(R)) return; Object.keys(R).forEach(k => delete R[k]); Object.assign(R, v || {}); if (enCours()) { aRedessiner = true; return; } if (!document.querySelector(".trav")) suite(); };
  document.addEventListener("focusout", () => setTimeout(() => { if (aRedessiner && !enCours()) { aRedessiner = false; suite(); } }, 0));
  if (D.test) document.body.insertAdjacentHTML("afterbegin", `<div style="background:#fff3d6;border-bottom:1px solid #d4b87a;color:#5a3010;padding:5px 14px;font:14px system-ui">🧪 Mode test${voisin ? " : relié à ta correction. Ce que tu écris ici arrive dans « Les retours des élèves » ; rien ne part au site." : " : rien ne part au site."}</div>`);
  const st = document.createElement("style"); st.textContent = `#statique{display:none}
.app{display:flex;gap:16px;max-width:1500px;margin:0 auto;padding:12px}.col{flex:1;min-width:0}.pan{width:400px;flex:none;position:sticky;top:10px;align-self:flex-start;max-height:calc(100vh - 20px);overflow:auto}
.pg{position:relative;width:68%;margin-bottom:12px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)}.pg img{display:block;width:100%;height:100%}
.mk{position:absolute;transition:opacity .5s}.f{height:0;border-top:3px solid #c54040}.f.ok{border-color:#3a6e1c}.f.cour{border-top-width:5px}.e{border:2.5px solid;border-radius:4px}.g{border-radius:4px}
.num{position:absolute;transform:translate(-50%,-50%);background:#c54040;color:#fff;border-radius:50%;width:22px;height:22px;font:700 12px/22px system-ui;text-align:center}.num.ok{background:#3a6e1c}
.pin{position:absolute;left:.4%;transform:translateY(-50%);width:26px;height:26px;border-radius:50%;background:#9a9086;color:#fff;font:800 15px/26px system-ui;text-align:center;border:3px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.pin.cour{background:#2b2520}.pin.fait{color:#fff}
.bloc{background:#fdfbf7;border:1px solid #d6cfc1;border-radius:10px;padding:12px 14px;margin-bottom:10px}.bloc h3{margin:0 0 6px;font:600 12.5px system-ui;letter-spacing:.1em;text-transform:uppercase;color:#6b1a2a}
.ech{display:flex;gap:4px;margin:8px 0}.ech span{flex:1;border:2px solid;border-radius:7px;padding:4px;font-size:12px;text-align:center;opacity:.45}.ech span.on{opacity:1;font-weight:700;box-shadow:0 0 0 2px #2b2520}
input,textarea{font:inherit;width:100%;border:1px solid #c9bba4;border-radius:7px;padding:8px 10px;background:#fff}textarea{min-height:110px;resize:vertical;font-family:"Segoe Script","Bradley Hand",cursive;color:#2a3f8f}
button{font:inherit;border:0;border-radius:8px;background:#6b1a2a;color:#fff;padding:8px 14px;margin-top:8px;cursor:pointer}.m{color:#7a6e5f;font-size:14px}.ok{color:#3a6e1c;font-weight:700}.ko{color:#c54040;font-weight:700}
.pap{position:absolute;left:102%;width:45%;background:#fffbe6;border:1px solid #e0c870;box-shadow:2px 3px 8px rgba(0,0,0,.25);padding:6px 8px;font-family:"Segoe Script","Bradley Hand",cursive;color:#2a3f8f;font-size:14px;transform:rotate(-1deg);white-space:pre-wrap}
.trav{position:fixed;inset:0;background:#f5f1ea;z-index:9;display:flex;flex-direction:column;align-items:center;justify-content:center}.sc3{perspective:1400px;height:62vh;width:100%;display:flex;align-items:center;justify-content:center}
.pile{position:relative;width:min(34vh,60vw);aspect-ratio:${D.pages[0] ? D.pages[0].w + "/" + D.pages[0].h : "210/297"};transform-style:preserve-3d;transform:rotateX(55deg) rotateZ(-28deg)}
.feuille{position:absolute;inset:0;border:2px solid;border-radius:4px;background:rgba(255,255,255,.25)}.feuille b{position:absolute;right:-4px;top:-26px;color:#fff;font:700 13px system-ui;padding:2px 8px;border-radius:6px 6px 0 0}
.cp{position:absolute;inset:0;transition:transform 1.4s ease}.cp img{width:100%;height:100%;display:block;border-radius:4px;box-shadow:0 14px 26px rgba(0,0,0,.3)}
.leg{max-width:640px;text-align:center;font-size:18px;padding:0 16px;min-height:3em}.passer{position:absolute;right:16px;bottom:16px;background:#fff;color:#6b1a2a;border:1px solid #d6cfc1}
@media (max-width:820px){.pg{width:100%}.pap{left:auto;right:0;width:62%;opacity:.96}.app{display:block;padding:6px}.pan{position:fixed;left:0;right:0;bottom:0;width:auto;max-height:46vh;margin:0;border-radius:14px 14px 0 0;box-shadow:0 -4px 14px rgba(0,0,0,.15);background:#f5f1ea;padding:8px}.col{padding-bottom:48vh}.pap{width:60%}}`;
  document.head.appendChild(st);
  // les étapes : les fautes d'abord, de haut en bas ; puis les points, à leur place sur la copie
  const E = D.fautes.map(f => ({ t: "f", f, cle: f.id })).concat(D.points.map(p => ({ t: "p", p, cle: p.id, pl: p.place })).concat((D.remarques || []).map(r => ({ t: "r", r, cle: r.id, pl: r.place }))).sort((a, b) => (a.pl.page - b.pl.page) || (a.pl.y - b.pl.y)));
  // le point est fini quand l'élève a répondu à la question (1360), puis fait sa tâche
  const fini = s => { const r = R[s.cle]; if (s.t === "r") return !!r; if (s.t === "f") return !!r && r.etat !== "arefaire" && (r.ok || (!s.f.bonne && !!r.texte)); if (s.p.question && !R[s.cle + ":q"]) return false; if (!r || r.etat === "arefaire") return false; return !s.p.tache || !!r.texte; };
  const repondu = p => !p.question || !!R[p.id + ":q"];
  const app = document.createElement("div"); app.className = "app"; app.innerHTML = `<div class="col" id="col"></div><div class="pan" id="pan"></div>`; document.body.appendChild(app);
  function copie() {
    const col = $("#col"); col.innerHTML = D.pages.map((p, i) => `<div class="pg" data-i="${i}" style="aspect-ratio:${p.w}/${p.h}"><img src="${IMG[i]}" alt=""></div>`).join("");
    const pgs = col.querySelectorAll(".pg"); const cour = E[etape];
    D.etoile.forEach(e => e.seg.forEach(r => pgs[e.page] && pgs[e.page].insertAdjacentHTML("beforeend", `<div class="mk" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${D.coul.etoile}40"></div>`)));
    D.fautes.forEach(f => { const ok = fini({ t: "f", f, cle: f.id }); const c = cour && cour.t === "f" && cour.f === f; const P = pgs[f.page]; if (!P) return;
      P.insertAdjacentHTML("beforeend", `<div class="mk f${ok ? " ok" : ""}${c ? " cour" : ""}" style="left:${pc(f.x0)};top:${pc(f.y1)};width:${pc(f.x1 - f.x0)}"></div><div class="num${ok ? " ok" : ""}" style="left:${pc(0.022 + (f.rang || 0) * 0.03)};top:${pc((f.y0 + f.y1) / 2)}">${ok ? "✓" : f.num}</div>`); });
    (D.remarques || []).forEach(r0 => { const P = pgs[r0.page]; const i = E.findIndex(s => s.t === "r" && s.r === r0); if (!P || i > etape) return; P.insertAdjacentHTML("beforeend", `<div class="mk e" style="left:${pc(r0.x0 - 0.004)};top:${pc(r0.y0 - 0.003)};width:${pc(r0.x1 - r0.x0 + 0.008)};height:${pc(r0.y1 - r0.y0 + 0.006)};border:2px dashed #6b1a2a"></div>`); });
    const pris = {}; D.points.forEach(p => { const P = pgs[p.place.page]; if (!P) return; const cle = p.place.page + ":" + Math.round(p.place.y * 40); const dx = (pris[cle] = (pris[cle] || 0) + 1) - 1; const ouvert = E.findIndex(s => s.t === "p" && s.p === p) <= etape; const c = cour && cour.t === "p" && cour.p === p;
      if (ouvert && repondu(p)) p.marques.forEach(m => { const Q = pgs[m.page]; if (!Q) return; const k = D.coul[p.crit] || "#6b1a2a";
        if (m.forme === "surligne") m.seg.forEach(r => Q.insertAdjacentHTML("beforeend", `<div class="mk" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${k}${c ? "66" : "40"};mix-blend-mode:multiply"></div>`));
        else Q.insertAdjacentHTML("beforeend", `<div class="mk ${m.forme === "marge" ? "g" : "e"}" style="left:${pc(m.x0)};top:${pc(m.y0)};width:${pc(m.x1 - m.x0)};height:${pc(m.y1 - m.y0)};${m.forme === "marge" ? "background:" + k : "border-color:" + k}"></div>`); });
      P.insertAdjacentHTML("beforeend", `<div class="pin${c ? " cour" : ""}${ouvert && !c ? " fait" : ""}" style="top:${pc(Math.max(0.015, p.place.y))};margin-left:${dx * 30}px;${ouvert && repondu(p) ? "background:" + D.bord[p.niveau] : ""}">${ouvert && repondu(p) ? "" : "?"}</div>`);
      const r = R[p.id]; if (r && r.texte) P.insertAdjacentHTML("beforeend", `<div class="pap" style="top:${pc(Math.min(0.92, p.place.y + 0.01))}">${esc(r.texte)}</div>`); });
  }
  function panneau() {
    const pan = $("#pan"); const s = E[etape];
    if (!s) {
      pan.innerHTML = (D.note != null ? `<div class="bloc"><h3>Ta note</h3><div style="font:700 30px Georgia,serif">${String(D.note).replace(".", ",")} / ${D.total}</div></div>` : "") + D.points.map(p => `<div class="bloc"><h3>${esc(p.critNom)} · ${esc(p.titre)}</h3><div>${esc(p.fait)}</div><div class="m">${String(p.pts).replace(".", ",")} / ${p.poids}</div></div>`).join(""); return; }
    const r = R[s.cle] || {};
    if (s.t === "r") { const r0 = s.r; pan.innerHTML = `<div class="bloc"><h3>${etape + 1} / ${E.length}</h3><div style="font-size:17px">${esc(r0.texte)}</div><button id="ok">→</button></div>`;
      $("#ok").onclick = () => { ecrire(r0.id, { type: "vu", texte: "", ok: true, le: new Date().toISOString() }).then(suite); }; return; }
    if (s.t === "f") { const f = s.f;
      pan.innerHTML = `<div class="bloc"><h3>${etape + 1} / ${E.length}${f.ligne ? " · ligne " + f.ligne : ""}</h3>${r.etat === "arefaire" ? '<div class="ko">à refaire</div>' + ((r.phrase || D.aRefaire) ? '<div>' + esc(r.phrase || D.aRefaire) + '</div>' : "") : ""}<input id="rep" autocomplete="off" value="${esc(r.texte || "")}"><button id="ok">${f.bonne ? "Vérifier" : "Envoyer"}</button><div id="msg"></div></div>`;
      const go = () => { const v = $("#rep").value.trim(); if (!v) return; const n = x => x.normalize("NFC").replace(/[’ʼ]/g, "'").replace(/\s+/g, " ").trim();
        if (f.bonne) { const ok = n(v) === n(f.bonne); ecrire(f.id, { type: "faute", texte: v, ok, le: new Date().toISOString(), marque: f.id }); if (ok) { suite(); } else { $("#msg").innerHTML = '<span class="ko">✗</span>'; } }
        else { ecrire(f.id, { type: "faute", texte: v, ok: false, le: new Date().toISOString(), marque: f.id, groupe: "0-fautes", titre: "Une faute sans bonne forme", consigne: "" }).then(suite); } };
      $("#ok").onclick = go; $("#rep").onkeydown = e => { if (e.key === "Enter") go(); }; setTimeout(() => $("#rep").focus(), 0); return; }
    const p = s.p;
    if (!repondu(p)) { pan.innerHTML = `<div class="bloc"><h3>${etape + 1} / ${E.length} · ${esc(p.critNom)}</h3><div style="font-weight:700">${esc(p.titre)}</div><div style="font-size:17px;margin:8px 0">${esc(p.question)}</div><textarea id="rq" style="min-height:70px;font-family:inherit;color:inherit"></textarea><button id="ok">→</button></div>`;
      $("#ok").onclick = () => { const v = $("#rq").value.trim(); if (!v) return; ecrire(p.id + ":q", { type: "reponse", texte: v, ok: true, le: new Date().toISOString(), point: p.id }).then(() => { copie(); panneau(); }); }; setTimeout(() => $("#rq").focus(), 0); return; }
    pan.innerHTML = `<div class="bloc"><h3>${etape + 1} / ${E.length} · ${esc(p.critNom)}</h3><div style="font-weight:700">${esc(p.titre)}</div>
      <div class="ech">${[0, 1, 2, 3].map(n => `<span class="${n === p.niveau ? "on" : ""}" style="background:${D.fond[n]};border-color:${D.bord[n]}">${esc(D.niveaux[n])}<br>${String(p.bareme[n]).replace(".", ",")}</span>`).join("")}</div>
      <div style="font-size:17px">${esc(p.fait)}</div>${p.tache ? `<div class="bloc" style="margin:10px 0 0;background:#fff"><b>${esc(p.tache)}</b>${r.etat === "arefaire" ? '<div class="ko">à refaire</div>' + ((r.phrase || D.aRefaire) ? '<div>' + esc(r.phrase || D.aRefaire) + '</div>' : "") : ""}<textarea id="pap">${esc(r.texte || "")}</textarea><button id="ok">Envoyer</button></div>` : `<button id="ok">Suivant</button>`}</div>`;
    $("#ok").onclick = () => { if (!p.tache) { ecrire(p.id, { type: "vu", texte: "", ok: true, le: new Date().toISOString() }).then(suite); return; }
      const v = $("#pap").value.trim(); if (!v) return; ecrire(p.id, { type: "papillon", texte: v, ok: !p.relire, le: new Date().toISOString(), point: p.id, groupe: p.id + "-" + p.niveau, titre: p.critNom + " · " + p.titre, consigne: p.tache }).then(suite); };
  }
  function suite() { etape = E.findIndex(s => !fini(s)); if (etape < 0) etape = E.length; copie(); panneau(); }
  // la traversée : à l'ouverture, la copie passe à travers la grille, la langue d'abord
  function traversee() {
    const crit = [{ id: "langue", nom: "La langue" }].concat(D.criteres); const nomsC = D.criteres.map(c => c.nom.replace(/^L[ae]s? |^L'/, m => m.toLowerCase()));
    const liste = nomsC.length > 1 ? nomsC.slice(0, -1).join(", ") + " et " + nomsC[nomsC.length - 1] : (nomsC[0] || "");
    const L = ["La grille de correction est au-dessus de ta copie : une feuille par critère.", "Ta copie passe d'abord à travers la langue : tes erreurs apparaissent, soulignées dans la couleur de leur type d'erreur.",
      "Puis à travers " + liste + " : leurs points apparaissent sur ta copie, gris, avec un « ? ».", "Ta copie est passée à travers toute la grille."];
    const T = document.createElement("div"); T.className = "trav";
    T.innerHTML = `<div class="sc3"><div class="pile">${crit.map((c, i) => `<div class="feuille" style="transform:translateZ(${(i + 1) * 46}px);border-color:${D.coul[c.id] || "#6b1a2a"}"><b style="background:${D.coul[c.id] || "#6b1a2a"}">${esc(c.nom)}</b></div>`).join("")}<div class="cp" id="cp"><img src="${IMG[0] || ""}" alt=""></div></div></div><div class="leg" id="leg"></div><button class="passer" id="passer">⏭</button>`;
    document.body.appendChild(T); let i = 0, fait = false;
    const pas = () => { if (fait) return; $("#leg").textContent = L[Math.min(i, 3)]; $("#cp").style.transform = "translateZ(" + (i === 0 ? 0 : i === 1 ? 70 : i === 2 ? 46 * (crit.length) - 10 : 46 * (crit.length + 1)) + "px)"; i++; if (i <= 4) setTimeout(i === 4 ? fin : pas, 2600); };
    const fin = () => { if (fait) return; fait = true; T.remove(); suite(); }; $("#passer").onclick = fin; setTimeout(pas, 400);
  }
  lire().then(v => { Object.assign(R, v || {}); copie(); traversee(); T.abonner(recevoir); });
}
// ── la fenêtre des fichiers : un par élève, à déposer sur École Directe ──
function scFichiersED() {
  if (!SC.copies.length) { toast("Aucune copie : charge d'abord ton paquet."); return; }
  const Q = scCopiesED(), nAbs = SC.copies.length - Q.length;   // [C14 1.4.13] un élève marqué absent n'a pas de fichier
  const lignes = Q.map((k, i) => { const nt = typeof stCorrigeeAvec === "function" && stCorrigeeAvec(k) ? stNoteBilan(k) : scNote(k); const faits = scTousPoints().filter(pt => { const r = scCase(pt, k); return r && r.complet; }).length; const tous = scTousPoints().length;
    return `<tr><td>${i + 1}</td><td>${escapeHtml(nomEleveDe(k) || k)}</td><td>${scPagesDe(k).length}</td><td>${nt.ok ? "<b>" + String(nt.n).replace(".", ",") + " / " + nt.tot + "</b>" : faits + " points sur " + tous}</td>
      <td><button class="sc-btn" onclick="scTesterEleve('${escapeAttr(k)}')" title="Ouvrir le fichier de cet élève dans un nouvel onglet, exactement comme il le verra, en mode test : sa copie, tes marques, sa grille et sa note, en lecture seule. Rien ne va au site.">🧪 Tester comme l'élève</button> <button class="sc-btn" onclick="scTelecharger('${escapeAttr(k)}')" title="Télécharger le fichier de cet élève, à déposer sur École Directe. Sa photo est dedans : elle ne passe pas par le site.">Télécharger</button></td></tr>`; }).join("");
  scModale(`<h3>Les fichiers École Directe</h3><p>Un fichier par élève : sa copie scannée et tes marques dedans. Tu le déposes sur École Directe ; la photo ne passe jamais par le site. L'élève y lit sa copie corrigée, sa grille et sa note : il clique tes marques, il n'écrit rien.</p>
    <label class="sc-coche" title="Pas encore codée : cette coche reste grisée et décochée. Quand elle le sera, elle ouvrira la correction par l'élève, à lancer en classe comme la correction de dictée."><input type="checkbox" disabled> Ouvrir la correction par l'élève <span class="sc-m">— pas encore codée : aujourd'hui, l'élève lit sa copie corrigée, il ne la corrige pas.</span></label>${window.__FAUX_HUB || RU.test ? '<p class="sc-alerte">🧪 Mode test : les fichiers fabriqués ici n\'envoient rien au site.</p>' : ""}
    <table class="sc-table"><tr><th></th><th>Élève</th><th>Pages</th><th>Correction</th><th></th></tr>${lignes}</table>${nAbs ? `<p class="sc-m">${nAbs} élève${nAbs > 1 ? "s" : ""} marqué${nAbs > 1 ? "s" : ""} absent${nAbs > 1 ? "s" : ""} : pas de fichier.</p>` : ""}<button class="sc-btn" onclick="scToutTelecharger()" title="Télécharger les ${Q.length} fichiers l'un après l'autre (le navigateur peut te demander d'autoriser plusieurs téléchargements).">Tout télécharger</button>`);
}
function scTelecharger(k) { return scEleveFichier(k).then(f => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([f.html], { type: "text/html" })); a.download = f.nom; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }); }
function scCopiesED() { return SC.copies.filter(k => !(typeof avAbsent === "function" && avAbsent(k))); }
function scToutTelecharger() { let ch = Promise.resolve(); scCopiesED().forEach(k => { ch = ch.then(() => scTelecharger(k)).then(() => new Promise(r => setTimeout(r, 500))); }); }
// tester le flux de l'élève : son fichier, en mode test, dans un onglet relié à cette correction (l'onglet s'ouvre au clic, le fichier s'y pose ensuite)
SC.fenetres = [];
function scTesterEleve(k) {
  const w = window.open("", "_blank"); if (!w) { toast("Le navigateur a bloqué le nouvel onglet : autorise les fenêtres pour ce fichier."); return; }
  SC.fenetres.push(w); scModaleFermer();
  scEleveFichier(k, true).then(f => { w.location.href = URL.createObjectURL(new Blob([f.html], { type: "text/html" })); });
}
// l'onglet de test de l'élève : ses lectures et ses écritures passent par celles de la correction (ruLire, ruEcrire), donc par son mode test
addEventListener("message", e => {
  const d = e.data && e.data.mjpcDemande; if (!d || SC.fenetres.indexOf(e.source) < 0 || d.red !== RU.id || !state.classe.some(n => eleveId(n) === d.eleve)) return;
  const repondre = v => { try { e.source.postMessage({ mjpcReponse: { n: d.n, v } }, "*"); } catch (x) {} };
  if (d.op === "lire") { ruLire(scCheminRetours([d.eleve])).then(v => { const loc = (SC.retours || {})[d.eleve]; repondre(Object.assign({}, v || {}, RU.test || window.__FAUX_HUB ? {} : loc || {})); }, () => repondre(null)); return; }
  if (d.op === "ecrire") { SC.retours[d.eleve] = SC.retours[d.eleve] || {}; SC.retours[d.eleve][d.cle] = d.v; const fin = () => { repondre(true); scPousser(d.eleve); if (SC.ouvert) scRendre(); };
    if (RU.test || window.__FAUX_HUB) ruEcrire(scCheminRetours([d.eleve, d.cle]), d.v, "un retour (test)").then(fin, fin); else fin(); }   // hors mode test : gardé dans cette page seulement, jamais au site
});
function scPousser(k) { (SC.fenetres || []).forEach(w => { try { if (!w.closed) w.postMessage({ mjpcPousse: { eleve: k, v: (SC.retours || {})[k] || {} } }, "*"); } catch (e) {} }); }
