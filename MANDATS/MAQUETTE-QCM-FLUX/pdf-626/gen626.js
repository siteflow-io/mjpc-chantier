// Tour 626 — exemple du PDF « notes et compétences » (318) : la ligne « Commentaire » porte le bilan général personnalisé de l'élève,
// généré sur le modèle de generateBilan de correction_dictee.html (com625.js) ; souligné en pointillés : une phrase proposée, à valider.
// Données : la vraie évaluation de 3e d'analyse logique (11 questions, tout ou rien) ; la classe inventée « 3 ESSAI » (24 présents, Adam absent) ;
// compétences posées pour l'exemple, prises dans ton chapitre 1 de 3e (hub) : c4-langue-04 sur Q1 à Q11, c4-ecrire-02 sur Q5 à Q10.
// Règles : note = feuille, 1 point par question, sur 20, arrondie au dixième (288, 340) ; « Trouvée au dernier moment » compte juste (339) ;
// parti avant la fin : les questions manquées sortent du total (336) ; compétence = part de ses points, sur 20, puis les tranches (131, 339) ;
// point d'autonomie : 🟢 Très bonne maîtrise, ou 🔴 Maîtrise insuffisante s'il est retiré (436).
const path = require("path"), fs = require("fs");
const D = __dirname;
const { chromium } = require(path.join(D, "../../banc/node_modules/playwright"));
const { commentaireQCM } = require(path.join(D, "com626.js"));
const EV3 = (new Function(require("fs").readFileSync(path.join(D, "../ev3e.js"), "utf8") + ";return EV3;"))();
const NIVQ = EV3.questions.map(q => q.niveau);

const NQ = 11;
const COMPS = [
  {id:"c4-langue-04", lib:"Construire les notions permettant l'analyse et l'élaboration des textes et des discours", q:[0,1,2,3,4,5,6,7,8,9,10]},
  {id:"c4-ecrire-02", lib:"Adopter des stratégies et des procédures d'écriture efficaces", q:[4,5,6,7,8,9]}
];
const AUTO = [
  {id:"tr-personne-03", lib:"Être autonome et responsable"},
  {id:"tr-methodes-02", lib:"S'impliquer dans les activités en classe et dans son travail personnel"}
];
// J juste, F faux, T « Trouvée au dernier moment » (compte juste, une fois), - pas là
const R = {
  "ABRIAL Julien":"JFJFJJFFJJF", "BAUDRY Léa":"JJJJJJFJJJJ", "BRUNEAU Camille":"JFFFJFFFJJF", "CARRÉ Tom":"FFJFFFFFJJF",
  "CHEVALLIER Théo":"JJFJFFFJJJF", "DUVERNAY Michel":"JFFJJFJFJJF", "ESNAULT Inès":"JJJJJJJJJJJ", "FOUCHER Hugo":"JJFJJJFJJJF",
  "GALLOIS Manon":"JJJTJJFJJJF", "HÉBRARD Nathan":"JFFFFFFFJJF", "ISAMBERT Chloé":"JJJJJFJJJJJ", "JOUBERT Louis":"FFFFJFFFFJF",
  "LACOMBE Emma":"JJJJJJJJJJF", "MAILLARD Noah":"JFFJFFF----", "NOGARET Zoé":"JJFJJJFJJJJ", "OLLIVIER Sacha":"FFFFFFFFJFF",
  "PERRAUD Jade":"JJJJJJFFJJF", "QUINTON Enzo":"JFFFJFFFJJF", "RAMBAUD Lina":"JJJJJJJJTJJ", "SABATIER Malo":"JFJFJFFFJJF",
  "TESSIER Anna":"JFFFFFFFJJF", "VALLÉE Rayan":"JJFFJFFJJJF", "WEBER Clara":"JJJJJJJJJJF", "YVON Adam":null, "ZELLER Lou":"JJFFJJFFJJF"
};
const SANS_AUTONOMIE = ["ABRIAL Julien", "DUVERNAY Michel"];   // le cas ambigu : « ⛔ aux deux »
// la fourchette que chacun a estimée, avant la correction (444) ; Noah est parti avant
const ESTIM = {"ABRIAL Julien":"vert","BAUDRY Léa":"vert","BRUNEAU Camille":"bleu","CARRÉ Tom":"rouge","CHEVALLIER Théo":"bleu","DUVERNAY Michel":"vert",
  "ESNAULT Inès":"bleu","FOUCHER Hugo":"bleu","GALLOIS Manon":"vert","HÉBRARD Nathan":"orange","ISAMBERT Chloé":"vert","JOUBERT Louis":"orange","LACOMBE Emma":"vert",
  "NOGARET Zoé":"bleu","OLLIVIER Sacha":"bleu","PERRAUD Jade":"vert","QUINTON Enzo":"orange","RAMBAUD Lina":"vert","SABATIER Malo":"bleu","TESSIER Anna":"rouge",
  "VALLÉE Rayan":"bleu","WEBER Clara":"vert","ZELLER Lou":"orange"};


const NIV = [
  {min:15, lib:"Très bonne maîtrise", cls:"vert"},
  {min:10, lib:"Maîtrise satisfaisante", cls:"bleu"},
  {min:5,  lib:"Maîtrise fragile", cls:"orange"},
  {min:0,  lib:"Maîtrise insuffisante", cls:"rouge"}
];
const r1 = x => Math.round(x * 10) / 10;
const fr = x => String(r1(x)).replace(".", ",");
const niveau = sur20 => NIV.find(n => r1(sur20) >= n.min);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* « 🎯 Ton estimation » : fourchettes et phrases de la 7.7.1 (fourchetteDuScore, libelleFourchette, construireCalibrationBilan), en tout ou rien */
const IDX = {rouge:1, orange:2, bleu:3, vert:4};
function bornes(k, total){   // les bornes de la 7.7.1 : plus de 75 %, plus de 50 %, plus de 25 %
  const ks = []; for(let n = 0; n <= total; n++){ const p = n / total * 100; ks.push(p > 75 ? "vert" : p > 50 ? "bleu" : p > 25 ? "orange" : "rouge"); }
  const ns = ks.map((x, n) => x === k ? n : null).filter(n => n !== null); return {inf:ns[0], sup:ns[ns.length - 1]};
}
function libF(k, total){ const b = bornes(k, total); if(b.inf === b.sup) return b.inf + " bonne" + (b.inf > 1 ? "s" : "") + " réponse" + (b.inf > 1 ? "s" : ""); return "entre " + b.inf + " et " + b.sup + " bonnes réponses"; }
function fDuScore(n, total){ const p = n / total * 100; return p > 75 ? "vert" : p > 50 ? "bleu" : p > 25 ? "orange" : "rouge"; }
function typeEstim(est, n, total){ if(!est) return null; const iE = IDX[est], iR = IDX[fDuScore(n, total)]; return {type: iE === iR ? "ok" : iE > iR ? "sur" : "sous", ecart: Math.abs(iE - iR)}; }
const escP = ph => ph.map(x => x.p ? `<span class="prov">${esc(x.t)}</span>` : esc(x.t)).join(" ");
if(process.env.TRENTE){ ["AUBERT Paul","DELMAS Rose","FERRAND Ilan","GIRAUD Mia","LEROY Nino"].forEach(n => { R[n] = "JJFJJFJJJJF"; ESTIM[n] = "bleu"; }); }
const eleves = Object.keys(R).sort((a, b) => a.localeCompare(b, "fr"));
const TAUX = Array.from({length: NQ}, (_, q) => { const l = eleves.filter(n => R[n] && R[n][q] !== "-"); return l.filter(n => R[n][q] === "J" || R[n][q] === "T").length / l.length * 100; });
let nNotes = 0, nAbs = 0, nCom = 0;
const asavoir = [];
const lignes = eleves.map(nom => {
  const s = R[nom];
  if(s === null){ nAbs++; asavoir.push(`<b>${esc(nom)}</b> : absent, pas encore de rattrapage.`);
    return `<tbody class="un"><tr class="abs"><td class="el">${esc(nom)}</td><td class="note">Absent</td><td>—</td><td>—</td><td>—</td><td>—</td></tr><tr class="comrow"><td colspan="6"><span class="lab">Commentaire :</span> —</td></tr></tbody>`; }
  nNotes++;
  const la = [...s].map((c, i) => c === "-" ? null : i).filter(i => i !== null);
  const pt = i => (s[i] === "J" || s[i] === "T") ? 1 : 0;
  const total = la.reduce((a, i) => a + pt(i), 0);
  const note = total * 20 / la.length;
  const cells = COMPS.map(c => {
    const qs = c.q.filter(i => la.includes(i)), n = qs.reduce((a, i) => a + pt(i), 0), v = niveau(n * 20 / qs.length);
    return `<td class="niv ${v.cls}">${v.lib}<span class="pts">${n}/${qs.length}</span></td>`;
  });
  const auto = SANS_AUTONOMIE.includes(nom) ? NIV[3] : NIV[0];
  AUTO.forEach(() => cells.push(`<td class="niv ${auto.cls}">${auto.lib}</td>`));
  if(la.length < NQ) asavoir.push(`<b>${esc(nom)}</b> : parti après la question ${la.length} ; sa note et ses compétences portent sur les ${la.length} questions où il était là, et il n'a pas fait son estimation.`);
  const compsR = COMPS.map(c => { const qs = c.q.filter(i => la.includes(i)), n = qs.reduce((a, i) => a + pt(i), 0); return {lib: c.lib, niveau: niveau(n * 20 / qs.length).cls}; });
  const te = typeEstim(la.length === NQ ? ESTIM[nom] : null, total, NQ);
  const ph = commentaireQCM({niveau: niveau(note).cls, comps: compsR, autonomieRetiree: SANS_AUTONOMIE.includes(nom),
    facilesRatees: la.filter(i => !pt(i) && (NIVQ[i] === "facile" || TAUX[i] >= 50)).length,
    difficilesReussies: la.filter(i => pt(i) && (NIVQ[i] === "approfondi" || NIVQ[i] === "expert")).length,
    estimation: te && te.type, ecart: te ? te.ecart : 0});
  const com = escP(ph); nCom++;
  return `<tr><td class="el">${esc(nom)}</td><td class="note">${fr(note)}</td>${cells.join("")}</tr><tr class="comrow"><td colspan="6"><span class="lab">Commentaire :</span> ${com}</td></tr></tbody>`;
});

const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Notes et compétences — 3 ESSAI</title><style>
@page{size:A4 landscape;margin:7mm 9mm 11mm}
*{box-sizing:border-box}
body{font-family:"DejaVu Sans",Arial,sans-serif;font-size:7.5pt;line-height:1.2;color:#111;margin:0}
.haut{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #111;padding-bottom:1.2mm;margin-bottom:1.5mm}
h1{font-size:13pt;margin:0}
.classe{font-size:13pt;font-weight:bold}
.infos{display:grid;grid-template-columns:1fr 1fr;gap:.5mm 8mm;margin-bottom:1.6mm}
.infos div b{display:inline-block;min-width:24mm}
.mode{border:1px solid #111;padding:1mm 2.5mm;margin-bottom:1.8mm;font-size:7.4pt;line-height:1.3}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th,td{border:1px solid #777;padding:.2mm 1.3mm;vertical-align:middle;text-align:left}
td{white-space:nowrap;overflow:hidden}
thead th{background:#eee;font-size:7.6pt}
thead tr.g th{background:#ddd;text-align:center;font-size:7.8pt}
th .c{display:block;font-size:8pt}
th .l{display:block;font-weight:normal;font-size:6.3pt;color:#333;line-height:1.15}
td.el{font-weight:bold}
td.note{font-weight:bold;font-size:8.8pt;text-align:center}
td.niv{font-size:7.2pt}
td.niv .pts{float:right;color:#444;font-size:6.6pt;margin-left:1.5mm}
td.vert{background:#D1FADF}td.bleu{background:#DBEAFE}td.orange{background:#FFE4C7}td.rouge{background:#FECACA}
tr.abs td{color:#555;font-style:italic}
tr.abs td.note{font-size:7.2pt}
tbody tr:not(.comrow) td{border-bottom:1px solid #ccc}
tr.comrow td{font-size:7pt;padding:.2mm 1.3mm .5mm 4mm;border-top:none;border-bottom:1.6px solid #555;color:#222}
tr.comrow .lab{font-weight:bold;color:#555}
tr.comrow td{white-space:normal}
.prov{text-decoration:underline dotted #EA580C;text-decoration-thickness:1.5px;text-underline-offset:2px}
.exemple{background:#FFF7ED;border:1px solid #FDBA74;color:#9A3412;padding:.8mm 2.5mm;margin-bottom:1.5mm;font-size:7.2pt}
tbody.un{break-inside:avoid}
tbody.un tr{break-inside:avoid}
tbody.un tr:first-child{break-after:avoid}
tr.comrow td{line-height:1.38}
.ctrl{font-weight:bold;font-size:7.8pt;margin-top:1.2mm}
.asavoir{border:1px dashed #555;padding:1mm 2.5mm;margin-top:1.4mm;font-size:7.2pt;line-height:1.35}
.bas{display:grid;grid-template-columns:1.2fr 1fr;gap:6mm;margin-top:1.4mm;font-size:7pt;line-height:1.3}
.bas b{font-weight:bold}
</style></head><body>
<div class="exemple"><b>Exemple de la maquette.</b> Dans les commentaires, souligné en pointillés orange : une phrase proposée, pas encore validée par toi. Le reste vient mot pour mot de la correction de dictée (« dictée » devenu « évaluation ») ou de l'app d'aujourd'hui.</div>
<div class="haut"><h1>Notes et compétences</h1><div class="classe">Classe : 3 ESSAI</div></div>
<div class="infos">
<div><b>Évaluation :</b> 3e- éval 1 Analyse logique - Construire une phrase complexe</div>
<div><b>Chapitre :</b> 3e, chapitre 1 — Poésie et peinture au XIXe siècle</div>
<div><b>Séance :</b> 09/10/2026 · 11 questions · tout ou rien</div>
<div><b>Copies :</b> rendues le 10/10/2026 — les notes sont définitives</div>
<div><b>Note :</b> sur 20, arrondie au dixième</div>
<div><b>Questions :</b> aucune écartée, aucune annulée</div>
</div>
<div class="mode"><b>Pour École Directe.</b> Une ligne par élève, dans l'ordre alphabétique. « Note » : la note sur 20 du devoir.
Chaque colonne de compétence : le niveau de maîtrise de l'élève, en toutes lettres, parmi quatre : Très bonne maîtrise, Maîtrise satisfaisante, Maîtrise fragile, Maîtrise insuffisante.
« Commentaire », sur la ligne sous l'élève : son commentaire pour ce devoir, à entrer tel quel dans la zone commentaire ; « — » : pas de commentaire. « Absent » : ni note, ni niveau, ni commentaire.
Le cadre « À savoir », sous le tableau, ne s'entre pas.</div>
<table>
<colgroup><col style="width:50mm"><col style="width:17mm"><col style="width:58mm"><col style="width:58mm"><col style="width:48mm"><col style="width:48mm"></colgroup>
<thead>
<tr class="g"><th rowspan="2" style="text-align:left">Élève</th><th rowspan="2" style="text-align:center">Note<br>sur 20</th><th colspan="2">Compétences de l'évaluation</th><th colspan="2">Point d'autonomie</th></tr>
<tr>${COMPS.map(c => `<th><span class="c">${c.id}</span><span class="l">Q${c.q[0]+1} à Q${c.q[c.q.length-1]+1}</span></th>`).join("")}${AUTO.map(a => `<th><span class="c">${a.id}</span><span class="l">${esc(a.lib)}</span></th>`).join("")}</tr>
</thead>
${lignes.join("\n")}
</table>
<div class="ctrl">Contrôle : ${eleves.length} élèves · ${nNotes} notes · ${nAbs} absent${nAbs > 1 ? "s" : ""} · ${nCom} commentaires.</div>
<div class="asavoir"><b>À savoir — ne s'entre pas dans École Directe.</b><br>${asavoir.join("<br>")}</div>
<div class="bas">
<div><b>Les compétences</b><br>
${COMPS.map(c => `<b>${c.id}</b> — ${esc(c.lib)} (questions ${c.q.map(i => "Q" + (i+1)).join(", ")}).`).join("<br>")}<br>
${AUTO.map(a => `<b>${a.id}</b> — ${esc(a.lib)}.`).join("<br>")}</div>
<div><b>Comment le niveau se calcule</b><br>
Pour chaque compétence, la part des points de l'élève sur ses questions, ramenée sur 20 (« 8/11 » : 8 points sur 11 questions) :
Très bonne maîtrise de 15 à 20 ; Maîtrise satisfaisante de 10 à moins de 15 ; Maîtrise fragile de 5 à moins de 10 ; Maîtrise insuffisante de 0 à moins de 5.
Point d'autonomie : Très bonne maîtrise, ou Maîtrise insuffisante s'il a été retiré.<br>
<b>Le commentaire</b> : le bilan général de l'élève, rempli par l'app à partir de ses résultats, comme en correction de dictée, puis modifié et validé, ou non, dans sa fiche.</div>
</div>
</body></html>`;
const NOM = process.env.TRENTE ? "essai-30" : "notes-competences-3-ESSAI";
fs.writeFileSync(path.join(D, NOM + ".html"), html);

(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage();
  await p.goto("file://" + path.join(D, NOM + ".html"));
  await p.pdf({path: path.join(D, NOM + ".pdf"), preferCSSPageSize: true, printBackground: true, displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: '<div style="font-size:7pt;width:100%;padding:0 9mm;color:#555;display:flex;justify-content:space-between;font-family:DejaVu Sans,Arial,sans-serif"><span>evaluation-qcm · sorti le 10/10/2026 à 18:02 · 3 ESSAI · 3e- éval 1 Analyse logique</span><span>page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>'});
  await b.close();
  console.log("ok", nNotes, nAbs, nCom);
})();
