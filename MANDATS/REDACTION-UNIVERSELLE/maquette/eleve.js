// ── le fichier de l'élève, rendu par École Directe : sa photo et tes marques dedans (la photo ne passe jamais par le hub) ──
// Sans interactivité (un téléphone qui ouvre la pièce jointe sans l'exécuter) : la copie et les marques se voient quand même.
// Avec : la traversée, puis le parcours (les fautes d'abord, puis les points de haut en bas), les papillons, la note à la fin.
function scBlobUrl(b) { return new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b); }); }
function scSlug(t) { return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function scEleveDonnees(k) {
  const ps = scPagesDe(k); const s = scCopie(k); scNumeroter(k);
  const ordre = ps.map(p => p.id);
  const place = m => ({ page: ordre.indexOf(m.page), y: m.y0 });
  const M = Object.values(s.marques).filter(m => ordre.indexOf(m.page) >= 0);
  const fautes = M.filter(m => m.forme === "faute").sort((a, b) => (ordre.indexOf(a.page) - ordre.indexOf(b.page)) || (a.y0 - b.y0) || (a.x0 - b.x0))
    .map(m => { const p = SC.pages[m.page]; const l = m.l0 != null && m.l0 >= 0 ? m.l0 + 1 : null; return { id: m.id, page: ordre.indexOf(m.page), x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, num: m.num, ligne: l, bonne: m.bonne || null }; });
  const pts = []; SC.grille.criteres.forEach(c => c.points.forEach(pt => { const r = scCase(pt, k); if (!r || !r.complet) return;   // seuls les points que tu as passés partent chez l'élève
    const ms = M.filter(m => m.point === pt.id && m.forme !== "faute" && m.forme !== "etoile").sort((a, b) => (ordre.indexOf(a.page) - ordre.indexOf(b.page)) || (a.y0 - b.y0));
    const pl = ms.length ? place(ms[0]) : { page: 0, y: 0 };
    pts.push({ id: pt.id, crit: c.id, critNom: c.nom, titre: pt.titre, poids: pt.poids, niveau: r.c.niveau, pts: pt.bareme[String(r.c.niveau)], fait: r.txt, tache: r.tache != null ? r.tache : (r.c.tache || ""),
      question: pt.questionEleve || "", relire: r.c.relire !== false,
      bareme: pt.bareme, place: pl, marques: ms.map(m => ({ page: ordre.indexOf(m.page), forme: m.forme, x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, seg: scSegments(m, SC.pages[m.page]) })) }); }));
  const etoile = M.filter(m => m.forme === "etoile").map(m => ({ page: ordre.indexOf(m.page), seg: scSegments(m, SC.pages[m.page]) }));
  const nt = scNote(k);
  return { titre: SUJET.titre || "Rédaction", nom: nomEleveDe(k) || k, aRefaire: SC.aRefaire || "", cle: k, red: RU.id, classe: RU.classe, hub: RU_BASE, maquette: !!window.__FAUX_HUB,
    criteres: SC.grille.criteres.filter(c => c.id !== "langue").map(c => ({ id: c.id, nom: c.nom })), note: nt.ok ? nt.n : null, total: nt.tot,
    pages: ps.map(p => ({ w: p.w, h: p.h })), fautes, points: pts, etoile, coul: SC_CRIT, fond: SC_FOND, bord: SC_COUL,
    niveaux: Object.keys(ECHELON_COULEUR).map(n => ECHELON_COULEUR[n].label) };
}
function scEleveFichier(k) {
  const D = scEleveDonnees(k); const ps = scPagesDe(k);
  return Promise.all(ps.map(p => SC.imgs[p.id] ? scBlobUrl(SC.imgs[p.id].blob) : Promise.resolve(""))).then(srcs => {
    const pc = (v) => (v * 100).toFixed(3) + "%";
    const statique = ps.map((p, i) => { let mk = "";
      D.fautes.filter(f => f.page === i).forEach(f => { mk += `<div class="mk f" style="left:${pc(f.x0)};top:${pc(f.y1)};width:${pc(f.x1 - f.x0)}"></div>`; });
      D.etoile.filter(e => e.page === i).forEach(e => e.seg.forEach(r => { mk += `<div class="mk s" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${SC_CRIT.etoile}40"></div>`; }));
      D.points.forEach(pt => pt.marques.filter(m => m.page === i).forEach(m => { const c = SC_CRIT[pt.crit] || "#6b1a2a";
        if (m.forme === "surligne") m.seg.forEach(r => { mk += `<div class="mk s" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${c}40"></div>`; });
        else mk += `<div class="mk ${m.forme === "marge" ? "g" : "e"}" style="left:${pc(m.x0)};top:${pc(m.y0)};width:${pc(m.x1 - m.x0)};height:${pc(m.y1 - m.y0)};${m.forme === "marge" ? "background:" + c : "border-color:" + c}"></div>`; }));
      return `<div class="pg" data-i="${i}" style="aspect-ratio:${p.w}/${p.h}"><img src="${srcs[i]}" alt="">${mk}</div>`; }).join("");
    const css = `*{box-sizing:border-box}body{margin:0;background:#f5f1ea;color:#2b2520;font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
.tete{background:linear-gradient(#c08a4a,#a67a44);color:#fff;padding:10px 16px;font:600 19px Georgia,serif}.tete small{font:14px system-ui;opacity:.9;margin-left:8px}
.copie{max-width:900px;margin:0 auto;padding:10px}.pg{position:relative;width:100%;margin-bottom:12px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)}.pg img{display:block;width:100%;height:100%}
.mk{position:absolute}.mk.f{height:0;border-top:3px solid #c54040;border-radius:2px}.mk.e{border:2.5px solid;border-radius:4px}.mk.g{border-radius:4px}`;
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(D.titre)} — ${escapeHtml(D.nom)}</title><style>${css}</style></head><body>
<div class="tete">${escapeHtml(D.titre)}<small>${escapeHtml(D.nom)}</small></div><div class="copie" id="statique">${statique}</div>
<script>const D=${JSON.stringify(D).replace(/</g, "\\u003c")};const IMG=${JSON.stringify(srcs)};(${scEleveApp.toString()})(D,IMG);<\/script></body></html>`;
    return { html, nom: "Redaction-" + scSlug(D.titre).slice(0, 40) + "-" + scSlug(D.nom) + ".html", D };
  });
}
// le code qui tourne chez l'élève (il ne voit rien d'autre de l'app : aucune variable extérieure)
function scEleveApp(D, IMG) {
  const $ = s => document.querySelector(s); const pc = v => (v * 100).toFixed(3) + "%"; const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const R = {}; let etape = 0;
  // les retours : au hub de la rédaction, dans la place de cet élève ; dans la maquette, jamais au vrai hub
  const url = cle => D.hub + "/redactions/" + encodeURIComponent(D.red) + "/retours/" + encodeURIComponent(D.classe) + "/" + encodeURIComponent(D.cle) + (cle ? "/" + encodeURIComponent(cle) : "") + ".json";
  const F = D.maquette ? ((window.parent && window.parent !== window && window.parent.__FAUX_HUB_FETCH) || null) : window.fetch.bind(window);
  const lire = () => F ? F(url()).then(r => r.ok ? r.json() : null).catch(() => null) : Promise.resolve((() => { try { return JSON.parse(localStorage.getItem("mjpc_retours_" + D.cle) || "null"); } catch (e) { return null; } })());
  const ecrire = (cle, v) => { R[cle] = v; if (F) return F(url(cle), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) }).catch(() => null); try { localStorage.setItem("mjpc_retours_" + D.cle, JSON.stringify(R)); } catch (e) {} return Promise.resolve(); };
  const st = document.createElement("style"); st.textContent = `#statique{display:none}
.app{display:flex;gap:16px;max-width:1500px;margin:0 auto;padding:12px}.col{flex:1;min-width:0}.pan{width:400px;flex:none;position:sticky;top:10px;align-self:flex-start;max-height:calc(100vh - 20px);overflow:auto}
.pg{position:relative;width:68%;margin-bottom:12px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)}.pg img{display:block;width:100%;height:100%}
.mk{position:absolute;transition:opacity .5s}.f{height:0;border-top:3px solid #c54040}.f.ok{border-color:#3a6e1c}.f.cour{border-top-width:5px}.e{border:2.5px solid;border-radius:4px}.g{border-radius:4px}
.num{position:absolute;transform:translate(3px,-50%);background:#c54040;color:#fff;border-radius:50%;width:22px;height:22px;font:700 12px/22px system-ui;text-align:center}.num.ok{background:#3a6e1c}
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
  const E = D.fautes.map(f => ({ t: "f", f, cle: f.id })).concat(D.points.slice().sort((a, b) => (a.place.page - b.place.page) || (a.place.y - b.place.y)).map(p => ({ t: "p", p, cle: p.id })));
  // le point est fini quand l'élève a répondu à la question (1360), puis fait sa tâche
  const fini = s => { const r = R[s.cle]; if (s.t === "f") return !!r && r.etat !== "arefaire" && (r.ok || (!s.f.bonne && !!r.texte)); if (s.p.question && !R[s.cle + ":q"]) return false; if (!r || r.etat === "arefaire") return false; return !s.p.tache || !!r.texte; };
  const repondu = p => !p.question || !!R[p.id + ":q"];
  const app = document.createElement("div"); app.className = "app"; app.innerHTML = `<div class="col" id="col"></div><div class="pan" id="pan"></div>`; document.body.appendChild(app);
  function copie() {
    const col = $("#col"); col.innerHTML = D.pages.map((p, i) => `<div class="pg" data-i="${i}" style="aspect-ratio:${p.w}/${p.h}"><img src="${IMG[i]}" alt=""></div>`).join("");
    const pgs = col.querySelectorAll(".pg"); const cour = E[etape];
    D.etoile.forEach(e => e.seg.forEach(r => pgs[e.page] && pgs[e.page].insertAdjacentHTML("beforeend", `<div class="mk" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${D.coul.etoile}40"></div>`)));
    D.fautes.forEach(f => { const ok = fini({ t: "f", f, cle: f.id }); const c = cour && cour.t === "f" && cour.f === f; const P = pgs[f.page]; if (!P) return;
      P.insertAdjacentHTML("beforeend", `<div class="mk f${ok ? " ok" : ""}${c ? " cour" : ""}" style="left:${pc(f.x0)};top:${pc(f.y1)};width:${pc(f.x1 - f.x0)}"></div><div class="num${ok ? " ok" : ""}" style="left:${pc(f.x1)};top:${pc(f.y1)}">${ok ? "✓" : f.num}</div>`); });
    const pris = {}; D.points.forEach(p => { const P = pgs[p.place.page]; if (!P) return; const cle = p.place.page + ":" + Math.round(p.place.y * 40); const dx = (pris[cle] = (pris[cle] || 0) + 1) - 1; const ouvert = E.findIndex(s => s.t === "p" && s.p === p) <= etape; const c = cour && cour.t === "p" && cour.p === p;
      if (ouvert && repondu(p)) p.marques.forEach(m => { const Q = pgs[m.page]; if (!Q) return; const k = D.coul[p.crit] || "#6b1a2a";
        if (m.forme === "surligne") m.seg.forEach(r => Q.insertAdjacentHTML("beforeend", `<div class="mk" style="left:${pc(r[0])};top:${pc(r[1])};width:${pc(r[2] - r[0])};height:${pc(r[3] - r[1])};background:${k}${c ? "55" : "30"}"></div>`));
        else Q.insertAdjacentHTML("beforeend", `<div class="mk ${m.forme === "marge" ? "g" : "e"}" style="left:${pc(m.x0)};top:${pc(m.y0)};width:${pc(m.x1 - m.x0)};height:${pc(m.y1 - m.y0)};${m.forme === "marge" ? "background:" + k : "border-color:" + k}"></div>`); });
      P.insertAdjacentHTML("beforeend", `<div class="pin${c ? " cour" : ""}${ouvert && !c ? " fait" : ""}" style="top:${pc(Math.max(0.015, p.place.y))};margin-left:${dx * 30}px;${ouvert && repondu(p) ? "background:" + D.bord[p.niveau] : ""}">${ouvert && repondu(p) ? "" : "?"}</div>`);
      const r = R[p.id]; if (r && r.texte) P.insertAdjacentHTML("beforeend", `<div class="pap" style="top:${pc(Math.min(0.92, p.place.y + 0.01))}">${esc(r.texte)}</div>`); });
  }
  function panneau() {
    const pan = $("#pan"); const s = E[etape];
    if (!s) {
      pan.innerHTML = (D.note != null ? `<div class="bloc"><h3>Ta note</h3><div style="font:700 30px Georgia,serif">${String(D.note).replace(".", ",")} / ${D.total}</div></div>` : "") + D.points.map(p => `<div class="bloc"><h3>${esc(p.critNom)} · ${esc(p.titre)}</h3><div>${esc(p.fait)}</div><div class="m">${String(p.pts).replace(".", ",")} / ${p.poids}</div></div>`).join(""); return; }
    const r = R[s.cle] || {};
    if (s.t === "f") { const f = s.f;
      pan.innerHTML = `<div class="bloc"><h3>${etape + 1} / ${E.length}${f.ligne ? " · ligne " + f.ligne : ""}</h3>${r.etat === "arefaire" ? '<div class="ko">à refaire</div>' + (D.aRefaire ? '<div>' + esc(D.aRefaire) + '</div>' : "") : ""}<input id="rep" autocomplete="off" value="${esc(r.texte || "")}"><button id="ok">${f.bonne ? "Vérifier" : "Envoyer"}</button><div id="msg"></div></div>`;
      const go = () => { const v = $("#rep").value.trim(); if (!v) return; const n = x => x.normalize("NFC").replace(/[’ʼ]/g, "'").replace(/\s+/g, " ").trim();
        if (f.bonne) { const ok = n(v) === n(f.bonne); ecrire(f.id, { type: "faute", texte: v, ok, le: new Date().toISOString(), marque: f.id }); if (ok) { suite(); } else { $("#msg").innerHTML = '<span class="ko">✗</span>'; } }
        else { ecrire(f.id, { type: "faute", texte: v, ok: false, le: new Date().toISOString(), marque: f.id, groupe: "0-fautes", titre: "Une faute sans bonne forme", consigne: "" }).then(suite); } };
      $("#ok").onclick = go; $("#rep").onkeydown = e => { if (e.key === "Enter") go(); }; setTimeout(() => $("#rep").focus(), 0); return; }
    const p = s.p;
    if (!repondu(p)) { pan.innerHTML = `<div class="bloc"><h3>${etape + 1} / ${E.length} · ${esc(p.critNom)}</h3><div style="font-weight:700">${esc(p.titre)}</div><div style="font-size:17px;margin:8px 0">${esc(p.question)}</div><textarea id="rq" style="min-height:70px;font-family:inherit;color:inherit"></textarea><button id="ok">→</button></div>`;
      $("#ok").onclick = () => { const v = $("#rq").value.trim(); if (!v) return; ecrire(p.id + ":q", { type: "reponse", texte: v, ok: true, le: new Date().toISOString(), point: p.id }).then(() => { copie(); panneau(); }); }; setTimeout(() => $("#rq").focus(), 0); return; }
    pan.innerHTML = `<div class="bloc"><h3>${etape + 1} / ${E.length} · ${esc(p.critNom)}</h3><div style="font-weight:700">${esc(p.titre)}</div>
      <div class="ech">${[0, 1, 2, 3].map(n => `<span class="${n === p.niveau ? "on" : ""}" style="background:${D.fond[n]};border-color:${D.bord[n]}">${esc(D.niveaux[n])}<br>${String(p.bareme[n]).replace(".", ",")}</span>`).join("")}</div>
      <div style="font-size:17px">${esc(p.fait)}</div>${p.tache ? `<div class="bloc" style="margin:10px 0 0;background:#fff"><b>${esc(p.tache)}</b>${r.etat === "arefaire" ? '<div class="ko">à refaire</div>' + (D.aRefaire ? '<div>' + esc(D.aRefaire) + '</div>' : "") : ""}<textarea id="pap">${esc(r.texte || "")}</textarea><button id="ok">Envoyer</button></div>` : `<button id="ok">Suivant</button>`}</div>`;
    $("#ok").onclick = () => { if (!p.tache) { ecrire(p.id, { type: "vu", texte: "", ok: true, le: new Date().toISOString() }).then(suite); return; }
      const v = $("#pap").value.trim(); if (!v) return; ecrire(p.id, { type: "papillon", texte: v, ok: !p.relire, le: new Date().toISOString(), point: p.id, groupe: p.id + "-" + p.niveau, titre: p.critNom + " · " + p.titre, consigne: p.tache }).then(suite); };
  }
  function suite() { etape = E.findIndex(s => !fini(s)); if (etape < 0) etape = E.length; copie(); panneau(); }
  // la traversée : à l'ouverture, la copie passe à travers la grille, la langue d'abord
  function traversee() {
    const crit = [{ id: "langue", nom: "La langue" }].concat(D.criteres); const nomsC = D.criteres.map(c => c.nom.replace(/^L[ae]s? |^L'/, m => m.toLowerCase()));
    const liste = nomsC.length > 1 ? nomsC.slice(0, -1).join(", ") + " et " + nomsC[nomsC.length - 1] : (nomsC[0] || "");
    const L = ["La grille de correction est au-dessus de ta copie : une feuille par critère.", "Ta copie passe d'abord à travers la langue : tes erreurs apparaissent, soulignées en rouge.",
      "Puis à travers " + liste + " : leurs points apparaissent sur ta copie, gris, avec un « ? ».", "Ta copie est passée à travers toute la grille."];
    const T = document.createElement("div"); T.className = "trav";
    T.innerHTML = `<div class="sc3"><div class="pile">${crit.map((c, i) => `<div class="feuille" style="transform:translateZ(${(i + 1) * 46}px);border-color:${D.coul[c.id] || "#6b1a2a"}"><b style="background:${D.coul[c.id] || "#6b1a2a"}">${esc(c.nom)}</b></div>`).join("")}<div class="cp" id="cp"><img src="${IMG[0] || ""}" alt=""></div></div></div><div class="leg" id="leg"></div><button class="passer" id="passer">⏭</button>`;
    document.body.appendChild(T); let i = 0, fait = false;
    const pas = () => { if (fait) return; $("#leg").textContent = L[Math.min(i, 3)]; $("#cp").style.transform = "translateZ(" + (i === 0 ? 0 : i === 1 ? 70 : i === 2 ? 46 * (crit.length) - 10 : 46 * (crit.length + 1)) + "px)"; i++; if (i <= 4) setTimeout(i === 4 ? fin : pas, 2600); };
    const fin = () => { if (fait) return; fait = true; T.remove(); suite(); }; $("#passer").onclick = fin; setTimeout(pas, 400);
  }
  lire().then(v => { Object.assign(R, v || {}); copie(); traversee(); });
}
// ── la fenêtre des fichiers : un par élève, à déposer sur École Directe ──
function scFichiersED() {
  if (!SC.copies.length) { toast("Aucune copie : charge d'abord ton paquet."); return; }
  const lignes = SC.copies.map((k, i) => { const nt = scNote(k); const faits = scTousPoints().filter(pt => { const r = scCase(pt, k); return r && r.complet; }).length; const tous = scTousPoints().length;
    return `<tr><td>${i + 1}</td><td>${escapeHtml(nomEleveDe(k) || k)}</td><td>${scPagesDe(k).length}</td><td>${nt.ok ? "<b>" + String(nt.n).replace(".", ",") + " / " + nt.tot + "</b>" : faits + " points sur " + tous}</td>
      <td><button class="sc-btn" onclick="scVoirEleve('${escapeAttr(k)}')" title="Ouvrir ce fichier comme l'élève le verra : la traversée, puis son parcours.">Voir comme l'élève</button> <button class="sc-btn" onclick="scTelecharger('${escapeAttr(k)}')" title="Télécharger le fichier de cet élève, à déposer sur École Directe. Sa photo est dedans : elle ne passe pas par le site.">Télécharger</button></td></tr>`; }).join("");
  scModale(`<h3>Les fichiers École Directe</h3><p>Un fichier par élève : sa copie scannée et tes marques dedans. Tu le déposes sur École Directe ; la photo ne passe jamais par le site. Ce que l'élève écrit (ses corrections, ses papillons) te revient dans la passe « Les retours des élèves ».</p>${window.__FAUX_HUB ? '<p class="sc-alerte">Maquette : un fichier téléchargé d\'ici n\'envoie rien au site.</p>' : ""}
    <table class="sc-table"><tr><th></th><th>Élève</th><th>Pages</th><th>Correction</th><th></th></tr>${lignes}</table><button class="sc-btn" onclick="scToutTelecharger()" title="Télécharger les ${SC.copies.length} fichiers l'un après l'autre (le navigateur peut te demander d'autoriser plusieurs téléchargements).">Tout télécharger</button>`);
}
function scTelecharger(k) { return scEleveFichier(k).then(f => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([f.html], { type: "text/html" })); a.download = f.nom; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }); }
function scToutTelecharger() { let ch = Promise.resolve(); SC.copies.forEach(k => { ch = ch.then(() => scTelecharger(k)).then(() => new Promise(r => setTimeout(r, 500))); }); }
function scVoirEleve(k) {
  scEleveFichier(k).then(f => { scModaleFermer(); const V = document.getElementById("scVueEleve"); V.querySelector("iframe").srcdoc = f.html; V.querySelector(".sc-ve-nom").textContent = f.D.nom + " — comme l'élève le voit"; V.classList.add("show"); });
}
function scVueEleveFermer() { const V = document.getElementById("scVueEleve"); V.classList.remove("show"); V.querySelector("iframe").srcdoc = ""; scRetoursRelire(); }
