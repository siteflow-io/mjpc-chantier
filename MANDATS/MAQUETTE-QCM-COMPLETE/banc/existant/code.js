// Les inventaires tirés du code (complément 1, garde 1) : les écrans de MJPC (index.html de la production) et les deux écrans
// de la 7.7.1 qui restent vides à l'écran (la correction de l'élève : « bonnes is not defined », AUDITS/QCM-FAUSSE-CLASSE-3E-08-10).
// Chaque élément porte la ligne d'où il vient ; le script vérifie que la ligne citée contient bien ce qu'il en dit,
// puis écrit banc/existant/mjpc-<écran>.json et banc/existant/code-<écran>.json.
//   node banc/existant/code.js   (PROD=<clone de la production>)
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const PROD = process.env.PROD || "/home/user/siteflow-io/monsieurjaipascompris";
const md5 = f => crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex");
const fichiers = {index: path.join(PROD, "index.html"), qcm: path.join(PROD, "evaluation-qcm.html")};
const lignes = {}; for(const k in fichiers) lignes[k] = fs.readFileSync(fichiers[k], "utf8").split("\n");
const decode = s => s.replace(/\\u([0-9a-fA-F]{4})/g, (m, x) => String.fromCharCode(parseInt(x, 16))).replace(/\\'/g, "'").replace(/&amp;/g, "&").replace(/&#10;/g, "\n");
let fautes = 0;
function voir(f, n, cherche){ const l = decode(lignes[f][n - 1] || ""); if(!l.includes(cherche)){ fautes++; console.log("✗ " + f + " l." + n + " ne contient pas « " + cherche + " »"); } return n; }
// b(ligne, libellé, infobulle, fragment cherché si le libellé est calculé)
const B = (f, n, l, t, cherche) => { voir(f, n, cherche || l); if(t) voir(f, n, t); return {l, t: t || "", ligne: n}; };
const CH = (f, n, l) => { voir(f, n, l.split("\n")[0]); return {l, ligne: n}; };
const T = (f, n, t) => { voir(f, n, t); return {t, ligne: n}; };
const K = (f, n, c) => { voir(f, n, c); return {c, ligne: n}; };
const P = (f, n, p, cherche) => { voir(f, n, cherche || p); return {p, ligne: n}; };
const inventaires = [];
function inv(id, fichier, o){ inventaires.push(Object.assign({ecran: id, source: path.basename(fichiers[fichier]) + " (md5 " + md5(fichiers[fichier]) + "), lu dans le code", fichier}, o)); }
const i = "index";

/* ── Le panneau prof et son menu (l.1620–1646) ── */
const MENU = [[1629, "🏠Tableau de bord"], [1631, "🏫Classes"], [1632, "👥Élèves & codes"], [1633, "🧪Profil test"], [1635, "📂Architecture"], [1636, "📦Archives"],
  [1637, "🗑Corbeille"], [1638, "📢Annonces aux élèves"], [1639, "🎓Dates de l’année"], [1640, "📚Taxonomie"], [1641, "📅Emploi du temps"], [1642, "🛠Atelier"],
  [1644, "⚙Configuration & Firebase"], [1645, "📡Présence live"]];
const MENU_SCENES = ["m-classe-exclusions", "m-exclusion-refusee", "m-fiche-eleve", "m-taxonomie", "m-taxonomie-editeur", "m-taxonomie-domaine", "m-taxonomie-notion", "m-taxonomie-competences", "m-taxonomie-competence"];
inv("panneau-menu", i, {comment: "Le panneau prof : l'en-tête et les 14 entrées du menu, sous « Vue d'ensemble », « Personnes », « Contenu », « Système ».", scenes: MENU_SCENES,
  boutons: [B(i, 2069, "🧪 Mode test", "", "🧪 Mode test"), B(i, 1624, "✕")].concat(MENU.map(m => B(i, m[0], m[1], "", m[1].replace(/^\S+?(?=[A-ZÉ])/u, "")))),
  classes: [K(i, 1620, "tprof-overlay"), K(i, 1621, "tprof-box"), K(i, 1622, "tprof-header"), K(i, 1627, "tprof-sidebar"), K(i, 1628, "tprof-sidebar-label"), K(i, 1629, "tprof-section-btn"), K(i, 1629, "tps-icon"), K(i, 1647, "tprof-content")],
  phrases: [P(i, 1623, "🛠 Panneau prof"), P(i, 1623, "— configuration du site"), P(i, 1628, "Vue d'ensemble"), P(i, 1630, "Personnes"), P(i, 1634, "Contenu"), P(i, 1643, "Système")]});

/* ── Élèves & codes, la clé saisie (l.5507–5532 ; l'encart l.14749–14772 ; l'import l.5555–5566) ── */
inv("eleves-codes", i, {comment: "« 👥 Élèves & codes », la clé saisie : l'encart de la clé, l'import du fichier de classe, la barre des classes, le cadre de secours, la barre d'outils, une ligne par élève.",
  scenes: ["m-classe-exclusions", "m-exclusion-refusee"],
  boutons: [B(i, 14757, "Oublier la clé sur cet appareil"), B(i, 14758, "Où la clé est mémorisée"), B(i, 14759, "Relancer la préparation"), B(i, 14760, "Retirer les codes en clair"), B(i, 14761, "Code professeur"),
    B(i, 5518, "+ Importer / compléter"), B(i, 5523, "Générer # codes manquants", "", "manquant"), B(i, 5524, "🖨 Imprimer"), B(i, 5525, "Tout régénérer"),
    B(i, 5529, "↻", "Régénérer le code"), B(i, 5529, "✕", "Retirer l’élève")],
  champs: [CH(i, 5518, "Un élève par ligne \nex : DUPONT Marie")],
  titres: [T(i, 5559, "Dépose ou choisis le fichier de la classe : il est lu ici, dans ton navigateur. Rien n’est écrit tant que tu n’as pas validé l’aperçu."),
    T(i, 5529, "Ouvre la fiche de l’élève : sexe, dispositif, cases PAP. Rien n’est écrit tant que tu n’enregistres pas.")],
  classes: [K(i, 14750, "secu-encart"), K(i, 5556, "eli-bloc"), K(i, 5517, "lens-bar"), K(i, 5518, "el-import"), K(i, 5522, "el-toolbar"), K(i, 5526, "el-list"), K(i, 5529, "el-row"),
    K(i, 5529, "el-num"), K(i, 5529, "el-name"), K(i, 5529, "elf-flag"), K(i, 5529, "el-code"), K(i, 5529, "el-acts")],
  phrases: [P(i, 5508, "Élèves & codes"), P(i, 14754, "🔓 Codes déverrouillés sur cet appareil"), P(i, 5557, "Importer la liste d’une classe"),
    P(i, 5558, "Le fichier du logiciel de vie scolaire, tel quel — ou le tableau collé depuis Excel. Rien n’est envoyé ailleurs : le fichier est lu dans ce navigateur."),
    P(i, 5560, "Dépose ici le fichier .xlsx de la classe"), P(i, 5561, "ou clique pour le choisir · ou colle le tableau (Ctrl + V) n’importe où sur cette page")]});

/* ── La fiche de l'élève, la clé saisie (elfOuvrir l.5917, elfFicheHtml l.5936–5967) ── */
const PAP = []; for(let n = 5889; n <= 5903; n++){ const m = /\['(pap-\d\d)',"(.*)"\]/.exec(lignes.index[n - 1]); PAP.push([n, m[1], m[2]]); }
inv("fiche-eleve", i, {comment: "La fiche de l'élève, ouverte d'un clic sur son nom, la clé saisie : l'encart de la clé au-dessus (l.5509).", scenes: ["m-fiche-eleve"],
  boutons: [B(i, 14757, "Oublier la clé sur cet appareil"), B(i, 14758, "Où la clé est mémorisée"), B(i, 14759, "Relancer la préparation"), B(i, 14760, "Retirer les codes en clair"), B(i, 14761, "Code professeur"),
    B(i, 5942, "← 3 ESSAI · Élèves & codes", "Revient à la liste de la classe. Ce qui n’est pas enregistré est perdu.", "Élèves & codes</button>"),
    B(i, 5946, "F", "", "toUpperCase()"), B(i, 5946, "M", "", "toUpperCase()"), B(i, 5948, "oui", "", "['oui',true]"), B(i, 5948, "non", "", "['non',false]"),
    B(i, 5963, "Enregistrer la fiche", "Chiffre avec ta clé et écrit : le dispositif, les cases, les remarques, la synthèse et la date du jour ; publie pour les apps « dictée aménagée » (la case pap-15). Ta clé est nécessaire."),
    B(i, 5964, "Fermer", "Revient à la liste de la classe. Ce qui n’est pas enregistré est perdu.")],
  cases: PAP.map(p => ({l: p[2] + " " + p[1], ligne: voir(i, p[0], p[2])})),
  champs: PAP.map(p => CH(i, 5957, "remarque (facultatif)")).concat([CH(i, 5960, "synthèse (facultatif)")]),
  titres: [T(i, 5945, "Le sexe, lu par les apps (le QCM). Un clic l’enregistre aussitôt, sans ta clé : il n’est pas chiffré."),
    T(i, 5947, "Élève à dispositif (PAP). Le choix s’écrit quand tu enregistres la fiche ; le nombre de la classe suit."), T(i, 5965, "Réservé : rien ne s’y écrit encore.")],
  classes: [K(i, 14750, "secu-encart"), K(i, 5941, "elf"), K(i, 5942, "elf-retour"), K(i, 5943, "elf-tete"), K(i, 5950, "elf-sous"), K(i, 5954, "elf-bloc"), K(i, 5956, "elf-ligne"), K(i, 5960, "elf-syn"), K(i, 5961, "elf-apps"), K(i, 5963, "elf-pied"), K(i, 5965, "elf-reserve")],
  phrases: [P(i, 5950, "Fiche élève · né le", "Fiche élève · "), P(i, 5953, "Pour toutes les disciplines — la fiche PAP de l’établissement, ligne à ligne"), P(i, 5953, "Évaluations"),
    P(i, 5960, "Synthèse — remarques, points de vigilance"), P(i, 5961, "Ce que les apps liront : dictée aménagée"), P(i, 5965, "Historique et progression de l’élève"),
    P(i, 5965, "Cette partie arrivera avec le profil de l’élève : ses dictées et résultats, ses évaluations, ses carnets d’erreurs, sa progression notion par notion — dans l’année seulement.")]});

/* ── La taxonomie (_profSectionTaxo l.2084, _blocTaxonomie l.2605–2612, l'éditeur l.2484–2604) ── */
inv("taxonomie", i, {comment: "« 📚 Taxonomie », l'éditeur fermé.", scenes: ["m-taxonomie"],
  boutons: [B(i, 2609, "Ouvrir l’éditeur", "", "Ouvrir l’éditeur")],
  classes: [K(i, 2607, "m8-bloc"), K(i, 2607, "m8-titre"), K(i, 2608, "m8-p"), K(i, 2609, "m8-btn")],
  phrases: [P(i, 2085, "📚 Taxonomie — le référentiel des notions"), P(i, 2608, "L’arbre Domaine › Famille › Notion que lisent les applications. Ici tu peux créer une notion, corriger ses libellés, ses niveaux et son exemple, ou la désactiver.")]});
inv("taxonomie-editeur", i, {comment: "L'éditeur ouvert : l'état du référentiel, la règle, les sept domaines repliés.", scenes: ["m-taxonomie-editeur", "m-taxonomie-domaine", "m-taxonomie-notion", "m-taxonomie-competences", "m-taxonomie-competence"],
  boutons: [B(i, 2609, "Fermer l’éditeur", "", "Fermer l’éditeur")],
  classes: [K(i, 2610, "m8tx-editeur"), K(i, 2582, "m8tx-etat"), K(i, 2584, "m8tx-regle"), K(i, 2560, "m8tx-dom"), K(i, 2561, "m8tx-dom-titre"), K(i, 2562, "m8tx-fleche"), K(i, 2564, "m8tx-eleve-lab"), K(i, 2565, "m8tx-compte")],
  phrases: [P(i, 2584, "Une notion ne se supprime jamais et son identifiant ne change jamais : le travail des élèves est étiqueté par ces identifiants, une étiquette qui disparaît ou change de numéro décrocherait des années de travail. Une notion qui ne sert plus se", "Une notion ne se supprime jamais")]});
inv("taxonomie-domaine", i, {comment: "Un domaine ouvert, une famille ouverte : ses notions, « ✏️ Modifier », « Désactiver » ou « Réactiver », « + Nouvelle notion ».", scenes: ["m-taxonomie-domaine"],
  boutons: [B(i, 2530, "✏️ Modifier", "", "Modifier"), B(i, 2531, "Désactiver", "", "Désactiver"), B(i, 2551, "+ Nouvelle notion")],
  classes: [K(i, 2542, "m8tx-fam"), K(i, 2543, "m8tx-fam-titre"), K(i, 2521, "m8tx-notion"), K(i, 2522, "m8tx-n-l1"), K(i, 2522, "m8tx-id"), K(i, 2523, "m8tx-prof"), K(i, 2526, "m8tx-n-l2"), K(i, 2529, "m8tx-n-actions")],
  phrases: [P(i, 2526, "Élève :")]});
inv("taxonomie-notion", i, {comment: "Une notion en cours de modification (_taxoFormEdition, l.2496–2506).", scenes: ["m-taxonomie-notion"],
  boutons: [B(i, 2502, "Enregistrer"), B(i, 2503, "Annuler")],
  champs: [CH(i, 2498, "Libellé professeur"), CH(i, 2499, "Libellé élève"), CH(i, 2500, "6e-3e"), CH(i, 2501, "« … »")],
  classes: [K(i, 2497, "m8tx-form"), K(i, 2493, "m8tx-champ"), K(i, 2493, "m8tx-lab"), K(i, 2494, "m8-input"), K(i, 2502, "m8tx-actions"), K(i, 2504, "m8tx-note")],
  phrases: [P(i, 2498, "Libellé professeur"), P(i, 2499, "Libellé élève"), P(i, 2500, "Niveaux"), P(i, 2501, "Exemple (facultatif)"), P(i, 2504, "ne change jamais : c’est lui qui étiquette le travail des élèves.")]});

/* ── La correction de l'élève dans la 7.7.1 (EleveCorrection, l.4267–4445) : vide à l'écran, lue dans le code ── */
const q = "qcm";
inv("eleve-correction-avant", q, {comment: "La correction, avant « 💡 Révéler » : l'écran plante dans la 7.7.1 (« bonnes is not defined », l.4365 ; dette 198), il est lu dans le code.", eleve: true,
  scenes: ["t-corr-q2-lecture", "t-corr-q3-lecture", "t-corr-q1-lecture", "x610-3-a-correction", "t-corr-seul"],
  boutons: [], phrases: [P(q, 4333, "📝 Correction"), P(q, 4334, "💡 On corrige d'abord les questions les plus ratées par la classe."), P(q, 4338, "bonne réponse"), P(q, 4339, "sur"), P(q, 4341, "question déjà corrigée"),
    P(q, 4362, "👀 Écoute le prof — la correction sera révélée.")]});
inv("eleve-correction-apres", q, {comment: "La correction, après « 💡 Révéler » : même écran, la réponse révélée et la consigne au stylo (l.4358–4441).", eleve: true,
  scenes: ["t-corr-q2-apres", "t-corr-q3-apres", "t-corr-q1-apres"],
  boutons: [], phrases: [P(q, 4333, "📝 Correction"), P(q, 4334, "💡 On corrige d'abord les questions les plus ratées par la classe."), P(q, 4338, "bonne réponse"), P(q, 4341, "question déjà corrigée")]});

for(const v of inventaires){
  const nom = (v.fichier === "index" ? "mjpc-" : "code-") + v.ecran + ".json"; delete v.fichier;
  fs.writeFileSync(path.join(__dirname, nom), JSON.stringify(v, null, 1));
  console.log("✓ " + nom + " : " + (v.boutons || []).length + " boutons, " + (v.champs || []).length + " champs, " + (v.cases || []).length + " cases, " + (v.titres || []).length + " infobulles, " + (v.classes || []).length + " classes, " + (v.phrases || []).length + " phrases");
}
if(fautes){ console.log(fautes + " citation(s) fausse(s)"); process.exit(1); }
