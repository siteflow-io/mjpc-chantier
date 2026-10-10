// Tour 624 — exemple du PDF « notes et compétences » (318).
// Données : la vraie évaluation de 3e d'analyse logique (11 questions, tout ou rien) ; la classe inventée « 3 ESSAI » (24 présents, Adam absent) ;
// compétences posées pour l'exemple, prises dans ton chapitre 1 de 3e (hub) : c4-langue-04 sur Q1 à Q11, c4-ecrire-02 sur Q5 à Q10.
// Règles : note = feuille, 1 point par question, sur 20, arrondie au dixième (288, 340) ; « Trouvée au dernier moment » compte juste (339) ;
// parti avant la fin : les questions manquées sortent du total (336) ; compétence = part de ses points, sur 20, puis les tranches (131, 339) ;
// point d'autonomie : 🟢 Très bonne maîtrise, ou 🔴 Maîtrise insuffisante s'il est retiré (436).
const path = require("path"), fs = require("fs");
const D = __dirname;
const { chromium } = require(path.join(D, "../../banc/node_modules/playwright"));

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
const SANS_AUTONOMIE = ["ABRIAL Julien", "DUVERNAY Michel"];   // le cas ambigu de 616 : « ⛔ aux deux »

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

if(process.env.TRENTE){ ["AUBERT Paul","DELMAS Rose","FERRAND Ilan","GIRAUD Mia","LEROY Nino"].forEach(n => R[n] = "JJFJJFJJJJF"); }
const eleves = Object.keys(R).sort((a, b) => a.localeCompare(b, "fr"));
let nNotes = 0, nAbs = 0, nPartiel = 0;
const lignes = eleves.map(nom => {
  const s = R[nom];
  if(s === null){ nAbs++; return `<tr class="abs"><td class="el">${esc(nom)}</td><td class="note">Absent</td><td>—</td><td>—</td><td>—</td><td>—</td><td class="rq">Absent : pas de note</td></tr>`; }
  nNotes++;
  const la = [...s].map((c, i) => c === "-" ? null : i).filter(i => i !== null);
  const pt = i => (s[i] === "J" || s[i] === "T") ? 1 : 0;
  const total = la.reduce((a, i) => a + pt(i), 0);
  const note = total * 20 / la.length;
  const cells = COMPS.map(c => {
    const qs = c.q.filter(i => la.includes(i)), n = qs.reduce((a, i) => a + pt(i), 0), v = niveau(n * 20 / qs.length);
    return `<td class="niv ${v.cls}"><b>${v.lib}</b><span class="pts">${n} sur ${qs.length}</span></td>`;
  });
  const auto = SANS_AUTONOMIE.includes(nom) ? NIV[3] : NIV[0];
  AUTO.forEach(() => cells.push(`<td class="niv ${auto.cls}"><b>${auto.lib}</b></td>`));
  let rq = "";
  if(la.length < NQ){ nPartiel++; rq = `Parti : noté sur ${la.length} questions sur ${NQ}`; }
  return `<tr><td class="el">${esc(nom)}</td><td class="note">${fr(note)}</td>${cells.join("")}<td class="rq">${rq}</td></tr>`;
});

const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Notes et compétences — 3 ESSAI</title><style>
@page{size:A4 landscape;margin:7mm 10mm 11mm}
*{box-sizing:border-box}
body{font-family:"DejaVu Sans",Arial,sans-serif;font-size:7.7pt;line-height:1.2;color:#111;margin:0}
.haut{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #111;padding-bottom:1.2mm;margin-bottom:1.5mm}
h1{font-size:13pt;margin:0}
.classe{font-size:13pt;font-weight:bold}
.infos{display:grid;grid-template-columns:1fr 1fr;gap:.6mm 8mm;margin-bottom:2mm}
.infos div b{display:inline-block;min-width:24mm}
.mode{border:1px solid #111;padding:1mm 2.5mm;margin-bottom:2mm;font-size:7.7pt;line-height:1.3}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th,td{border:1px solid #777;padding:.15mm 1.4mm;vertical-align:middle;text-align:left}
td{white-space:nowrap;overflow:hidden}
thead th{background:#eee;font-size:7.8pt}
thead tr.g th{background:#ddd;text-align:center;font-size:8pt}
th .c{display:block;font-size:8.4pt}
th .l{display:block;font-weight:normal;font-size:6.6pt;color:#333;line-height:1.15}
td.el{font-weight:bold}
td.note{font-weight:bold;font-size:9pt;text-align:center}
td.niv b{font-weight:bold}
td.niv .pts{float:right;color:#444;font-size:7pt;margin-left:2mm}
td.vert{background:#D1FADF}td.bleu{background:#DBEAFE}td.orange{background:#FFE4C7}td.rouge{background:#FECACA}
tr.abs td{color:#555;font-style:italic}
tr.abs td.note{font-size:7.4pt}
td.rq{font-size:7pt;white-space:normal}
.bas{display:grid;grid-template-columns:1.25fr 1fr;gap:6mm;margin-top:1.5mm;font-size:7.2pt;line-height:1.3}
.bas b{font-weight:bold}
.ctrl{font-weight:bold;font-size:8pt;margin-top:1.2mm}
</style></head><body>
<div class="haut"><h1>Notes et compétences</h1><div class="classe">Classe : 3 ESSAI</div></div>
<div class="infos">
<div><b>Évaluation :</b> 3e- éval 1 Analyse logique - Construire une phrase complexe</div>
<div><b>Chapitre :</b> 3e, chapitre 1 — Poésie et peinture au XIXe siècle</div>
<div><b>Séance :</b> 09/10/2026 · 11 questions · tout ou rien</div>
<div><b>Copies :</b> rendues le 10/10/2026 — les notes sont définitives</div>
<div><b>Note :</b> sur 20, arrondie au dixième</div>
<div><b>Questions :</b> aucune écartée, aucune annulée</div>
</div>
<div class="mode"><b>Pour École Directe.</b> Une ligne par élève, dans l'ordre alphabétique. « Note » est la note sur 20 du devoir.
Chaque colonne de compétence donne le niveau de maîtrise de l'élève, en toutes lettres, parmi quatre : Très bonne maîtrise, Maîtrise satisfaisante, Maîtrise fragile, Maîtrise insuffisante.
« Absent » : ni note ni niveau.</div>
<table>
<colgroup><col style="width:39mm"><col style="width:15mm"><col style="width:52mm"><col style="width:52mm"><col style="width:36mm"><col style="width:36mm"><col></colgroup>
<thead>
<tr class="g"><th rowspan="2" style="text-align:left">Élève</th><th rowspan="2" style="text-align:center">Note<br>sur 20</th><th colspan="2">Compétences de l'évaluation</th><th colspan="2">Point d'autonomie</th><th rowspan="2">Remarque</th></tr>
<tr>${COMPS.map(c => `<th><span class="c">${c.id}</span><span class="l">Q${c.q[0]+1} à Q${c.q[c.q.length-1]+1}</span></th>`).join("")}${AUTO.map(a => `<th><span class="c">${a.id}</span><span class="l">${esc(a.lib)}</span></th>`).join("")}</tr>
</thead>
<tbody>${lignes.join("\n")}</tbody>
</table>
<div class="ctrl">Contrôle : ${eleves.length} élèves · ${nNotes} notes · ${nAbs} absent${nAbs > 1 ? "s" : ""} · ${nPartiel} noté${nPartiel > 1 ? "s" : ""} sur une partie des questions.</div>
<div class="bas">
<div><b>Les compétences</b><br>
${COMPS.map(c => `<b>${c.id}</b> — ${esc(c.lib)} (questions ${c.q.map(i => "Q" + (i+1)).join(", ")}).`).join("<br>")}<br>
${AUTO.map(a => `<b>${a.id}</b> — ${esc(a.lib)}.`).join("<br>")}</div>
<div><b>Comment le niveau se calcule</b><br>
Pour chaque compétence, la part des points de l'élève sur ses questions, ramenée sur 20 (« 8 sur 11 » : 8 points sur 11 questions) :
Très bonne maîtrise de 15 à 20 ; Maîtrise satisfaisante de 10 à moins de 15 ; Maîtrise fragile de 5 à moins de 10 ; Maîtrise insuffisante de 0 à moins de 5.
Point d'autonomie : Très bonne maîtrise, ou Maîtrise insuffisante s'il a été retiré.</div>
</div>
</body></html>`;
fs.writeFileSync(path.join(D, "notes-competences-3-ESSAI.html"), html);

(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage();
  await p.goto("file://" + path.join(D, "notes-competences-3-ESSAI.html"));
  await p.pdf({path: path.join(D, (process.env.TRENTE ? "essai-30.pdf" : "notes-competences-3-ESSAI.pdf")), preferCSSPageSize: true, printBackground: true, displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: '<div style="font-size:7pt;width:100%;padding:0 10mm;color:#555;display:flex;justify-content:space-between;font-family:DejaVu Sans,Arial,sans-serif"><span>evaluation-qcm · sorti le 10/10/2026 à 18:02 · 3 ESSAI · 3e- éval 1 Analyse logique</span><span>page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>'});
  await b.close();
  console.log("ok", nNotes, nAbs, nPartiel);
})();
