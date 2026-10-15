/* ═══════════════ Complément 3 — changement 2 : une infobulle sur chaque élément des écrans de Paul ═══════════════
   Écrites pour Paul dans trois mois : ce que c'est, ce que cela fait ici, dans l'état de l'écran, et pour un geste, ce qu'il coûte.
   Par composant : chaque sorte d'élément (une pastille de tuile, un nom, une note, un niveau de maîtrise, une ligne de séance…)
   a sa fonction, qui lit l'élément et le moment de la scène ; la même pastille dit ainsi la bonne chose partout.
   Les infobulles d'aujourd'hui (la 7.7.1, index.html, la correction de dictée clonée) ne sont jamais touchées : seul un élément
   qui n'en a pas en reçoit une. Les écrans des élèves et le tableau restent sans infobulle (règle de Paul du 06/10). */

var B_ELEVE = ".tablette,.eleve-page,.sim,.grand-tab,.voir-tab-in,.feuille-a4,.bilan-imprime-page,.pdf-page,iframe,.feuille-fond,.board-active,.board-attente,.board-aside-eleves";
var B_GESTE = "button,a[href],input,select,textarea,[role=button],.tel-el,.qdf-c,label";
function bTexte(e){ if(!e) return ""; var c = e.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll(".info-tip,.info-i"), function(x){ x.remove(); }); return (c.textContent || e.value || e.placeholder || "").replace(/\s+/g, " ").trim(); }
function bPhrase(s){ s = String(s).replace(/\s+/g, " ").trim(); return /[.!?…»)]$/.test(s) ? s : s + "."; }
function bNomTuile(e){ var m = e.closest(".tab-mini-m"); var n = m && m.querySelector(".nm"); return n ? bTexte(n).replace(/^⠿\s*/, "") : ""; }
function bTablette(e){ var t = e.closest(".tab-mini"); var h0 = t && t.querySelector(".tab-mini-h"); var m = h0 && /Tablette\s*(\d+)/.exec(bTexte(h0)); return m ? m[1] : ""; }
function bCote(e){ var m = e.closest(".tab-mini-m"); if(!m || !m.parentElement) return ""; return m.parentElement.firstElementChild === m ? "gauche" : "droite"; }
function bColonne(td){ var tr = td.closest("tr"), table = td.closest("table"); if(!tr || !table) return ""; var i = Array.prototype.indexOf.call(tr.children, td), th = table.querySelector("thead tr"); return th && th.children[i] ? bTexte(th.children[i]) : ""; }
function bLigne(td){ var tr = td.closest("tr"); return tr && tr.firstElementChild ? bTexte(tr.firstElementChild) : ""; }
function bQuestionDe(e){ var c = e.closest(".pilot-q-mini,.preview-q,.fiche-q,.qcard"); var n = c && /Q\s*(\d+)/.exec(bTexte(c.querySelector(".pilot-q-mini-num,.num,.preview-q-num") || c)); return n ? n[1] : ""; }
function bPhase(){ var m = MOM(); return m.ph || ""; }
function bSeanceEnCours(){ return typeof seanceEnCours === "function" && seanceEnCours(); }
function bF(n){ return typeof SCN !== "undefined" && SCN.SEXE && SCN.SEXE[bPrenom(n)] === "F"; }
function bIl(n){ return bF(n) ? "elle" : "il"; }
function bSec(t){ var v = parseInt(t, 10); return isNaN(v) ? t : v + (v > 1 ? " secondes" : " seconde"); }
function bPrenom(nom){ var t = String(nom || "").split(" "); return t.length > 1 ? t.slice(1).join(" ") : nom; }

/* ── Les pastilles d'état des tuiles (« .st ») : l'état de cet élève, à ce moment ── */
var B_ETATS = [
  [/^juste$/, function(n){ return n + " a la bonne réponse à cette question, pour le moment."; }],
  [/^faux$/, function(n){ return n + " n'a pas la bonne réponse à cette question, pour le moment."; }],
  [/^une sur deux/, function(n){ return n + " a coché une des deux bonnes réponses, et pas l'autre."; }],
  [/^toutes les bonnes \+ une en trop|^✓\+/, function(n){ return n + " a coché toutes les bonnes réponses, et une de trop."; }],
  [/^✓ 1 pt$/, function(n){ return "La question " + deNom(n) + " vaut 1 point, d'après sa feuille lue par son voisin."; }],
  [/^✗ 0$/, function(n){ return "La question " + deNom(n) + " vaut 0 point, d'après sa feuille lue par son voisin."; }],
  [/^🙈/, function(n){ return n + " attend son tour : sa moitié est voilée pendant que son voisin répond."; }],
  [/^✋ dit si sa feuille/, function(n){ return n + " dit en ce moment " + (bF(n) ? "si elle" : "s'il") + " avait bien écrit sa réponse sur sa feuille, avant de voir la bonne réponse."; }],
  [/^✋/, function(n){ return n + " répond en ce moment, pendant son tour."; }],
  [/^✓ prêt · (\d\d:\d\d)/, function(n, m){ return n + " a coché toutes les lignes de l'attestation, à " + m[1] + "."; }],
  [/^attestation (\d+)\/(\d+)/, function(n, m){ return n + " a coché " + m[1] + " lignes de l'attestation sur " + m[2] + "."; }],
  [/^pas encore entr/, function(n){ return n + " n'est pas encore entré" + (bF(n) ? "e" : "") + " sur sa moitié de tablette."; }],
  [/^✍️ écrit/, function(n){ return n + " écrit sa réponse sur sa feuille, pendant la réflexion."; }],
  [/^✅ bien lu/, function(n){ return n + " pense que son voisin a bien lu sa feuille."; }],
  [/^❌ mal lu Q(\d+)/, function(n, m){ return n + " pense que son voisin a mal lu sa feuille à la question " + m[1] + " : c'est une alerte."; }],
  [/^❌ Q(\d+) · tranché/, function(n, m){ return "L'alerte " + deNom(n) + " sur la question " + m[1] + " est tranchée."; }],
  [/^🤔 peut-être Q(\d+)/, function(n, m){ return n + " pense que son voisin a peut-être mal lu sa feuille à la question " + m[1] + " : à relire ce soir."; }],
  [/^⏳ pas encore répondu/, function(n){ return n + " n'a pas encore dit si son voisin a bien lu sa feuille."; }],
  [/^🚪 parti à (\d\d:\d\d)/, function(n, m){ return n + " est parti" + (bF(n) ? "e" : "") + " à " + m[1] + " : " + bIl(n) + " ne bloque plus la séance."; }],
  [/^↔️ va sur la tablette (\d+)/, function(n, m){ return n + " change de tablette : " + bIl(n) + " va sur la tablette " + m[1] + " et retape son code."; }],
  [/^📄 feuille lue|^📄 lue/, function(n){ return "La feuille " + deNom(n) + " est lue par son voisin."; }],
  [/^⏳ pas encore lue|feuille pas encore lue/, function(n){ return "La feuille " + deNom(n) + " n'est pas encore lue par son voisin."; }],
  [/^Oui, la même chose/, function(n){ return n + " dit avoir bien écrit sa réponse sur sa feuille."; }],
  [/^Non, autre chose/, function(n){ return n + " dit avoir écrit autre chose sur sa feuille."; }],
  [/^rien dit/, function(n){ return n + " n'a pas dit " + (bF(n) ? "si elle" : "s'il") + " avait bien écrit sa réponse sur sa feuille."; }],
  [/Trouvée au dernier moment/, function(n){ return n + " : sa feuille était fausse et son clic tout juste ; la question compte, une fois par évaluation."; }],
  [/^(juste|faux|une en trop|une sur deux) · 🙈/, function(n, m){ return n + (m[1] === "juste" ? " a la bonne réponse" : m[1] === "faux" ? " n'a pas la bonne réponse" : m[1] === "une en trop" ? " a coché toutes les bonnes réponses et une de trop" : " a coché une des deux bonnes réponses") + " pour le moment ; sa moitié est voilée pendant que son voisin répond."; }],
  [/^une en trop/, function(n){ return n + " a coché toutes les bonnes réponses, et une de trop."; }],
  [/^⏳ pas de réponse|^pas de réponse/, function(n){ return n + " n'a encore rien coché à cette question."; }],
  [/^∅|aucun de ces choix/, function(n){ return "La feuille " + deNom(n) + " ne dit aucun des choix de la question."; }]
];
function bulleEtat(e){
  var t = bTexte(e), n = bNomTuile(e) || "Cet élève";
  for(var i = 0; i < B_ETATS.length; i++){ var m = B_ETATS[i][0].exec(t); if(m) return B_ETATS[i][1](n, m); }
  return "L'état " + deNom(n) + " à ce moment de la séance : « " + t + " ».";
}
/* ── Les drapeaux sous un nom (« .flag ») ── */
function bulleFlag(e){
  var t = bTexte(e), n = bNomTuile(e) || (e.closest(".fiche-q") ? "cet élève" : "cet élève");
  if(/alerte : à trancher/.test(t) && /retiré/.test(t)) return "L'alerte " + deNom(n) + " est encore ouverte, en haut ; son point d'autonomie est déjà retiré.";
  if(/alerte : à trancher/.test(t)) return "L'alerte " + deNom(n) + " attend ta décision, en haut de l'écran.";
  if(/retiré/.test(t)) return "Le point d'autonomie " + deNom(n) + " est retiré : ses deux compétences d'autonomie sont en Maîtrise insuffisante.";
  if(/à relire ce soir|À relire/.test(t)) return "La feuille " + deNom(n) + " est à relire ce soir, dans Résultats.";
  if(/✔ lue/.test(t)) return "Tu as lu la feuille : le signalement est marqué « lu ».";
  if(/corrigée en classe/.test(t)) return "La question a été corrigée en classe, la feuille en main : " + t.replace(/^corrigée en classe : /, "") + ".";
  if(/Corrigé d'après sa feuille/.test(t)) return "La question est corrigée d'après sa feuille : sa note suit la feuille.";
  if(/a dit que sa feuille|n'a pas dit|pense qu|aucun de ces choix/.test(t)) return "Ce que l'élève a signalé pour cette question : sa feuille est à lire ce soir.";
  return "Un signalement sur cette question : « " + t + " ».";
}
/* ── Les niveaux de maîtrise ── */
function bulleMaitrise(e){
  var t = bTexte(e), td = e.closest("td"), qui = td ? bLigne(td) : "", col = td ? bColonne(td) : "";
  var niv = t.replace(/^[^\p{L}⛔]+/u, "");
  if(/retiré/.test(t)) return (qui ? qui + " : p" : "P") + "oint d'autonomie retiré " + t.replace(/^⛔ retiré /, "") + " ; ses deux compétences d'autonomie sont en Maîtrise insuffisante.";
  if(col && /Autonomie/.test(col)) return (qui ? qui + " a gardé" : "L'élève a gardé") + " son point d'autonomie : ses deux compétences d'autonomie sont en " + niv + ".";
  if(col && /Maîtrise de la note/.test(col)) return "Le niveau de maîtrise de la note " + deNom(qui) + " : " + niv + ", d'après les tranches des Réglages.";
  if(col) return "Le niveau " + deNom(qui) + " pour la compétence « " + (col.replace(/^🧩\s*/, "").match(/^[a-z0-9]+(-[a-z0-9]+)+/) || [col.replace(/^🧩\s*/, "").split(" ")[0]])[0] + " » : " + niv + ", sur ses questions.";
  var l = e.closest(".fiche-comp-l,.comp-l");
  if(l) return "Le niveau de cette compétence : " + niv + ", d'après ses questions.";
  return "Le niveau de maîtrise : " + niv + ".";
}
/* ── Les cases d'un tableau de notes ── */
function bulleCase(e){
  var col = bColonne(e), qui = bLigne(e), t = bTexte(e);
  if(/^Q\d+/.test(col)){ var q = col.replace(/\D.*$/, "").replace(/^Q/, "");
    return qui + ", question " + col.match(/\d+/)[0] + " : " + (t === "✓" ? (e.classList.contains("cell-trouvee") || /orange/.test(e.className) ? "Trouvée au dernier moment, la question compte" : "juste d'après la feuille") : t === "∅" ? "sa feuille ne dit aucun de ces choix" : t === "✗" ? "faux d'après la feuille" : t) + (e.classList.contains("cell-corrigee") ? ", corrigé d'après sa feuille" : "") + "."; }
  if(/^Note$/.test(col)) return "La note " + deNom(qui) + " : " + t.replace("/", " sur ") + " bonnes réponses, d'après sa feuille.";
  if(/^Sur \d+/.test(col)) return "La note " + deNom(qui) + " ramenée sur 20 : " + t + ".";
  if(/À lire/.test(col)) return t ? "Ce qui est à lire sur la feuille " + deNom(qui) + " : " + t + "." : "Rien à lire sur la feuille " + deNom(qui) + ".";
  if(/Élève/.test(col)) return qui + " : sa ligne du tableau.";
  if(col) return qui + " — " + col + " : " + t + ".";
  return "Une case du tableau : " + t + ".";
}
/* ── Les cartes de « 📋 Toutes les questions » ── */
function bulleCarteQ(e){
  var q = bQuestionDe(e), t = bTexte(e);
  if(e.classList.contains("pilot-q-mini-num")) return "La question " + q + " de l'évaluation, dans l'ordre où elle se pose.";
  if(e.classList.contains("pilot-q-mini-enonce")) return "L'énoncé de la question " + q + ", tel que les élèves le lisent.";
  if(e.classList.contains("bon")) return "« " + t.replace(/\s*✓$/, "") + " » : une bonne réponse de la question " + q + ".";
  if(e.classList.contains("pilot-q-mini-choix")) return "« " + t + " » : un choix de la question " + q + ", qui n'est pas une bonne réponse.";
  if(e.classList.contains("pilot-q-mini-niv")) return "La difficulté de la question " + q + " : " + t + ".";
  if(e.classList.contains("pilot-q-mini-status")) return "Les deux temps de la question en cours, tels qu'ils se règlent à gauche : " + t + ".";
  return null;
}
/* ── Les en-têtes de colonne ── */
function bulleEntete(e){
  var t = bTexte(e);
  var M = {"Note":"La note : les bonnes réponses sur le nombre de questions qui comptent.", "Sur 20":"La note ramenée sur 20.",
    "Maîtrise de la note":"Le niveau de maîtrise que donne la note, d'après les tranches des Réglages.", "🤝 Autonomie":"Le point d'autonomie de chaque élève : gardé, ou retiré, et quand.",
    "À lire sur la feuille":"Ce qui reste à lire sur la feuille de chaque élève, avec sa raison.", "Qui, et quand":"Qui a dit quoi, et à quel moment de la séance.",
    "La feuille de Michel dit":"Ce que la feuille de Michel dirait, selon chacun.", "Point":"Le point que vaudrait la question, selon chacun."};
  if(M[t]) return M[t];
  if(/^Q\d+/.test(t)) return "La question " + t.match(/\d+/)[0] + " : ✓ juste, ✗ faux, d'après la feuille de chaque élève.";
  if(/^Élève/.test(t)) return "Les élèves de la classe.";
  return null;
}

/* ── Le registre : sélecteur → fonction (l'élément, son texte) ; la première qui répond gagne ── */
var B_REGISTRE = [
  // la console : en-tête, onglets
  ["h1", function(e, t){ return /MODE TEST/i.test(t) ? "L'app des évaluations QCM, en mode test : la classe de test, isolée de tes vraies classes." : "L'app des évaluations QCM, en mode professeur : ta console. Les élèves ne la voient pas."; }],
  [".badge", function(e, t){ return /test/i.test(t) ? "Tu es dans le mode test : rien n'y touche tes vraies classes." : "Tu es dans la console du professeur : les élèves ne la voient pas."; }],
  [".info-i", function(){ return null; }],
  // les tuiles des tablettes
  [".tab-mini-h span", function(e, t){ var n = /Tablette\s*(\d+)/.exec(t); if(n) return "La tablette " + n[1] + " : ses deux moitiés, à gauche et à droite" + (e.closest(".tab-mini.seul") ? ", avec un seul élève" : "") + "."; if(/^seul$/.test(t)) return "Un seul élève sur cette tablette : il répond à chaque tour."; return null; }],
  [".tab-mini-m .st,.tab-mini-m .stt,.st", bulleEtat],
  [".flag", bulleFlag],
  [".tab-mini-m .nm", function(e, t){ var n = t.replace(/^⠿\s*/, ""); if(/moitié libre/.test(t)) return "Cette moitié est libre : glisse un nom dessus pour y asseoir l'élève."; return n + " : tablette " + bTablette(e) + ", moitié de " + bCote(e) + (e.closest(".binomes-box") ? " ; glisse son nom sur un autre pour échanger leurs places." : "."); }],
  [".grip", function(){ return "Prends le nom par ici et glisse-le sur un autre : les deux élèves échangent leur place."; }],
  [".tour-chip", function(e, t){ return "Les moitiés qui répondent à ce tour : " + t.replace(/^moitiés de /, "celles de ") + "."; }],
  // les cartes de question
  [".pilot-q-mini-num,.pilot-q-mini-enonce,.pilot-q-mini-choix,.pilot-q-mini-niv,.pilot-q-mini-status", bulleCarteQ],
  ["label.tm-l", function(e, t){ var q = bQuestionDe(e); return /🧠/.test(t) ? "Le temps de réflexion de la question " + q + ", en secondes, pour cette séance." : "Le temps de réponse de chaque tour de la question " + q + ", en secondes, pour cette séance."; }],
  [".q-marque", function(e, t){ return /Écartée/.test(t) ? "Cette question est écartée : elle ne sera ni posée ni corrigée, et ne compte pas." : "Cette question a été posée puis annulée : elle ne compte pas, ses réponses restent gardées."; }],
  [".q-alerte,.fen-alerte", function(e, t){ return "Les compétences de cette question n'auraient plus que deux questions : leurs quatre niveaux ne seraient plus possibles."; }],
  // le chrono et les temps
  [".pilot-chrono-card .label,.label", function(e, t){ if(/Réflexion/.test(t)) return "Le temps de réflexion de la question en cours : l'énoncé sans les choix."; if(/Réponse/.test(t)) return "Le temps de réponse de chaque tour de la question en cours."; if(/À venir/.test(t)) return "La question qui suit, avec ses deux temps."; return null; }],
  [".pilot-chrono-card .v,.v", function(e, t){ var c = e.closest(".pilot-chrono-card"); var lab = c ? bTexte(c.querySelector(".label")) : ""; return /Réflexion/.test(lab) ? "Le temps de réflexion de la question : " + bSec(t) + (/EN COURS/.test(bTexte(c)) ? ", décompté en ce moment." : ".") : /Réponse/.test(lab) ? "Le temps de réponse d'un tour : " + bSec(t) + (/EN COURS/.test(bTexte(c)) ? ", décompté en ce moment pour les moitiés qui répondent." : ".") : "Un temps de la question : " + t + "."; }],
  [".pilot-chrono-card .desc,.desc", function(e, t){ if(/EN COURS/.test(t)) return "Ce temps se décompte en ce moment."; if(/pour cette question/.test(t)) return "Ce temps vaut pour cette question seulement."; if(/par tour/.test(t)) return "Ce temps vaut pour chacun des deux tours."; if(/sur \d+ s/.test(t)) return "Le temps total de cette phase, en secondes."; return null; }],
  [".t-s,.pilot-chrono-card .t-s", function(e){ var c = e.closest(".pilot-chrono-card"); var lab = c ? bTexte(c.querySelector(".label")) : ""; return "L'unité du champ à côté : le temps " + (/Réflexion/.test(lab) ? "de réflexion" : "de réponse") + " de cette question se compte en secondes."; }],
  // les compteurs
  [".pilot-stat .l,.pilot-stat div:last-child", function(e, t){ return null; }],
  // les tableaux
  ["td.cell-juste,td.cell-faux,td.cell-trouvee,td.score-cell,td.alire-cell,td.comp-cell,td", bulleCase],
  ["th", bulleEntete],
  [".comp-det", function(e, t){ return "Le détail de cette compétence, question par question : ✓ juste, ✗ faux, ∅ aucun de ces choix ; à droite, le compte."; }],
  [".maitrise-pill", bulleMaitrise],
  // MJPC
  [".tprof-sidebar-label", function(e, t){ return "Les entrées du panneau prof qui touchent à : " + t.toLowerCase() + "."; }],
  [".tprof-header-sub", function(){ return "Le panneau prof configure le site : les classes, les élèves, la taxonomie, l'emploi du temps."; }],
  [".el-num", function(e, t){ var l = e.closest(".el-row,.eleve-ligne,li,tr,div"); return "Le numéro de l'élève dans la liste de la classe : " + t + "."; }],
  [".el-code", function(e, t){ return "Le code personnel de l'élève, à 4 chiffres : il le tape pour entrer sur sa moitié de tablette."; }],
  [".el-nocode", function(){ return "Cet élève n'a pas encore de code : « Générer 1 code manquant » lui en donne un."; }],
  [".m8tx-fleche", function(e, t){ return t === "▼" ? "Ce groupe est ouvert : un clic le replie." : "Ce groupe est replié : un clic l'ouvre."; }],
  [".m8tx-compte", function(e, t){ return "Ce que contient ce groupe : " + t + "."; }],
  [".m8tx-id,code", function(e, t){ return "L'identifiant de la notion ou de la compétence, « " + t + " » : il ne change jamais."; }],
  [".m8tx-prof", function(e, t){ return "Le libellé professeur de cette notion, tel que tu le lis dans tes écrans."; }],
  [".m8tx-n-l2", function(e, t){ return "Le libellé élève de cette notion, tel que les élèves le lisent."; }],
  [".m8tx-eleve-lab", function(e, t){ return "Le nom du domaine pour les élèves."; }],
  [".m8tx-dom-titre", function(e, t){ return "Un domaine de la taxonomie : un clic l'ouvre ou le replie, avec ses familles et ses notions."; }],
  [".m8tx-fam-titre", function(e, t){ return "Une famille du référentiel : un clic l'ouvre ou la replie."; }],
  [".m8tx-comp-cat-t", function(e, t){ return "Un groupe de compétences du référentiel : " + t + "."; }],
  [".m8tx-etat", function(e, t){ return "La version de la taxonomie et ce qu'elle contient."; }],
  [".niv-bulle", function(e, t){ if(/^Difficulté/.test(t)) return "La difficulté de la question : " + t.replace(/^Difficulté : /, "") + "."; return "Une compétence de la question : « " + t + " »."; }],
  [".secu-titre", function(){ return "Les codes des élèves, déchiffrés sur cet appareil avec ta clé."; }],
  [".secu-txt", function(e, t){ return "Où en sont les codes de la classe sur cet appareil : " + t.split(".")[0] + "."; }],
  [".elf-tete", function(e, t){ return "La fiche de l'élève : " + t.replace(/^◆\s*/, "") + "."; }],
  [".elf-sous", function(){ return "Ce que la fiche dit de l'élève : sa date de naissance, son sexe, son dispositif, la date des cases cochées."; }],
  [".elf-cadenas", function(){ return "La fiche est chiffrée avec ta clé : elle ne se lit que sur un appareil où la clé est mémorisée."; }],
  [".elf-apps", function(){ return "Ce que les apps de la classe liront de cette fiche."; }],
  [".elf-bloc-t", function(e, t){ return "Une partie de la fiche : " + t + "."; }],
  [".ex-entete,.ex-t", function(e, t){ return "Les exclusions de la classe : deux élèves qui ne sont jamais ensemble sur une tablette."; }],
  [".ex-c", function(e, t){ return "Le nombre d'exclusions de cet élève, sur 3 au plus."; }],
  [".edt-etat", function(e, t){ return "Ce que contient cet objet de l'emploi du temps : " + t.split(" — ").slice(1).join(" — ") + "."; }],
  [".edt-groupe-t", function(e, t){ return "Un groupe de gestes de l'emploi du temps : " + t.replace(/^\S+\s/, "") + "."; }],
  [".edt-titre", function(){ return "Injecter un objet de l'emploi du temps : colle son JSON, l'app le vérifie."; }],
  [".lens-pill", function(e, t){ return "La classe affichée : " + t + "."; }],
  // les listes de séances
  [".results-eval-row .titre,.titre", function(e, t){ if(/Démo faite/.test(t)) return "La démo faite avec la classe : rien n'y compte, elle ne laisse que cette ligne."; return "La séance de « " + t.replace(/ — sur papier$/, "") + " »" + (/sur papier/.test(t) ? ", sur papier" : "") + " ; ses boutons ouvrent ses résultats."; }],
  [".results-eval-row .meta,.meta", function(e, t){ if(/QCM précédent/.test(t)) return "Cette séance est le « QCM précédent » : son classement sert à former les binômes."; return "La date, l'état et les présents de cette séance : " + t + "."; }],
  [".meta-lire", function(){ return "Les feuilles qui restent à lire pour cette séance, avant de rendre les copies."; }],
  [".meta-lus", function(){ return "Toutes les feuilles de cette séance sont lues : les copies peuvent être rendues."; }],
  [".classe-titre", function(e, t){ return "Les séances de cette classe : " + t.replace(/^👥\s*/, "") + "."; }],
  // les évaluations
  [".eval-titre", function(e, t){ return "Le titre de l'évaluation : « " + t.replace(/🔒 Permanente$/, "") + " »."; }],
  [".eval-passee", function(e, t){ return /pas encore/.test(t) ? "Aucune classe n'a encore passé cette évaluation." : "Les classes qui ont passé cette évaluation, et quand : " + t.replace(/^passée par /, "") + "."; }],
  [".eval-etat", function(e, t){ return /Prête/.test(t) ? "L'évaluation est complète : elle se lance depuis « 🎯 Pilotage classe »." : "Ce qui manque avant de pouvoir lancer cette évaluation."; }],
  // l'éditeur
  [".ed-resume", function(e, t){ return "L'énoncé de cette question, replié : un clic sur la question la déplie."; }],
  [".ed-lbl", function(e, t){ return "Un champ de la question : " + t.replace(/\s*:$/, "") + "."; }],
  [".ed-titre-ouvert", function(e, t){ return "Le titre entier de l'évaluation ouverte."; }],
  [".preview-titre-meta", function(e, t){ return "Le compte des questions et des points de l'évaluation : " + t + "."; }],
  [".ed-comp-autres", function(){ return "Les compétences permises viennent du chapitre choisi."; }],
  [".ed-reste", function(){ return "Ce qu'il reste à remplir avant d'enregistrer l'évaluation."; }],
  [".multi-tag", function(){ return "Cette question a plusieurs bonnes réponses : l'élève coche tout ce qui est juste."; }],
  [".comp-chip", function(e, t){ return /aucune/.test(t) ? "Aucune compétence n'est encore choisie pour cette question." : "Une compétence de la question : « " + t.replace(/✕$/, "") + " »."; }],
  ["li", function(e, t){ return "Un point à corriger dans le JSON, avant que l'évaluation s'enregistre."; }],
  [".preview-ok", function(){ return "Ce que l'app a vérifié et trouvé juste dans le JSON."; }],
  // les alertes de co-évaluation
  [".al-t", function(e, t){ return /tranchée/.test(t) ? "La décision prise sur cette alerte, et la note qui en sort." : "L'alerte : un élève pense que son voisin a mal lu sa feuille ; elle attend ta décision."; }],
  [".al-l", function(e, t){ if(/^Q\d+ ·/.test(t)) return "La question de l'alerte, et sa bonne réponse."; if(/^⚠️/.test(t)) return "Les deux lectures se contredisent : la feuille tranche."; if(/^👉/.test(t)) return "Ce que l'élève disait avant de connaître la réponse : un indice pour trancher."; if(/^Appelle/.test(t)) return "Le geste à faire : voir la feuille avec les deux élèves."; return "Ce que chacun a dit de cette question."; }],
  [".al-ch", function(e, t){ return (e.classList.contains("bon") ? "Une bonne réponse de la question : " : "Un choix de la question : ") + t.replace(/^[A-F]\s*✓?\s*/, "") + "."; }],
  [".al-auto-t", function(){ return "Retirer le point d'autonomie d'un des deux élèves, ou des deux, s'il n'a pas joué le jeu."; }],
  ["td.lt", function(e, t){ return "Ce que dirait la feuille, selon cette personne : " + t + "."; }],
  ["td.pt", function(e, t){ return "Le point que vaudrait la question : " + t + "."; }],
  // la fiche du soir
  [".fiche-q .num,.num", function(e, t){ if(/^Q\d+$/.test(t)) return "La question " + t.slice(1) + " de l'évaluation."; if(/^Question \d+/.test(t)) return "La question en cours, et son nombre de bonnes réponses."; return null; }],
  [".val", function(e, t){ var q = e.closest(".fiche-q"); var i = q ? Array.prototype.indexOf.call(q.children, e) : -1; var cols = ["", "", "Ce que le voisin a lu sur sa feuille, à la correction", "Ce que l'élève a cliqué sur la tablette", "Ce que l'élève a dit à la fin de son temps de réponse", "La bonne réponse"]; return (cols[i] || "Une valeur de la question") + " : " + t + "."; }],
  [".pts", function(e, t){ return "Ce que vaut la question pour cet élève : " + t.replace("pt", "point") + "."; }],
  [".fiche-comp", function(e, t){ return "Les compétences que travaille cette question : " + t.replace(/^🧩\s*/, "") + "."; }],
  [".fiche-comp-l .c,span.c", function(e, t){ return "Le code de la compétence : " + t + "."; }],
  [".fiche-comp-l .d,span.d", function(e, t){ return /autonomie/.test(t) ? "Cette compétence se tient par le point d'autonomie." : "Le détail de la compétence, question par question, et son compte."; }],
  [".st628", function(){ return "Ce bilan général est celui que l'app a rempli d'après la note ; tu peux le modifier."; }],
  [".fiche-head span", function(e, t){ return {"Question":"L'énoncé de la question, et les compétences qu'elle travaille.", "Bonne réponse":"La bonne réponse de la question.", "Points":"Ce que vaut la question pour l'élève.", "Sa tablette":"Ce que l'élève a cliqué sur la tablette."}[t] || (/^Sa feuille, lue par/.test(t) ? "Ce que le voisin a lu sur la feuille, à la correction." : /^Ce qu'(il|elle) a dit/.test(t) ? "Ce que l'élève a dit à la fin de son temps de réponse." : null); }],
  [".fiche-q > span", function(e, t){ return "L'énoncé de la question, et les compétences qu'elle travaille."; }],
  [".fiche-comp-l span", function(e, t){ return "Le libellé officiel de la compétence."; }],
  // les lignes des fenêtres de départ et de retour
  [".depart-l > span", function(e, t){ var m = /^(.+?) — parti à (\d\d:\d\d)/.exec(t); return m ? m[1] + ", parti" + (bF(m[1]) ? "e" : "") + " à " + m[2] + " : « ↩️ Revenu » à côté " + (bF(m[1]) ? "la" : "le") + " fait revenir sur sa moitié." : t + ", présent" + (bF(t) ? "e" : "") + " : « 🚫 Parti » à côté " + (bF(t) ? "la" : "le") + " marque comme parti" + (bF(t) ? "e" : "") + "."; }],
  // l'enseigne des fenêtres
  [".checkin-sub", function(e, t){ return "De quoi parle cette fenêtre : " + t + "."; }],
  // la séance
  [".pilot-status", function(e, t){ var c = e.querySelector(".tour-chip"); var ch = c ? bTexte(c) : ""; var sans = ch ? t.replace(ch, "").trim() : t; return "La phase de la séance en ce moment : " + sans.replace(/\s+/g, " ") + (ch ? " (" + ch + ")" : "") + "."; }],
  [".pilot-eleve-help", function(){ return "Où commence la correction, et pourquoi."; }],
  [".enonce,.enonce-next,.e,.bilan-classe-insight-enonce", function(e, t){ return "L'énoncé de la question, tel que les élèves le lisent."; }],
  [".pilot-q-bonne,.b", function(e, t){ return "La ou les bonnes réponses de la question, que les élèves ne voient pas encore."; }],
  [".duree-box", function(e, t){ return "La durée estimée de la séance, d'après les temps des questions et les durées des Réglages."; }],
  [".excl-note", function(e, t){ return "Les exclusions de MJPC que les binômes proposés respectent."; }],
  [".refus-excl", function(){ return "L'échange est refusé : il mettrait ensemble deux élèves exclus l'un de l'autre."; }],
  [".rattrapage-box", function(){ return "Le rattrapage : seuls les élèves pas encore notés à cette évaluation sont proposés."; }],
  [".noms", function(e, t){ return "Les élèves qui n'ont pas encore fini : " + t.replace(/ · /g, ", ") + "."; }],
  [".ss", function(e, t){ return "Où en est la classe : " + t + "."; }],
  [".bilan-classe-stat-label", function(e, t){ return {"Moyenne":"La moyenne des notes de la classe.", "Médiane":"La note du milieu : la moitié de la classe a plus, la moitié a moins.", "Plage":"La plus basse et la plus haute note de la classe."}[t] || null; }],
  [".bilan-classe-stat-num", function(e, t){ return "La valeur : " + t + "."; }],
  [".bilan-classe-insight-titre", function(e, t){ return /ratée/.test(t) ? "La question la plus ratée de la classe, avec son taux de réussite." : "La question la mieux réussie de la classe, avec son taux de réussite."; }],
  [".pc-t", function(e, t){ return "Une compétence de l'évaluation, et les questions qui la travaillent."; }],
  [".pc-auto", function(e, t){ return "Combien d'élèves ont gardé leur point d'autonomie, et qui l'a perdu."; }],
  [".legende-tab span:not(.c)", function(e, t){ var p = t.split(" : "); var ou = e.closest(".tel") ? "Dans la liste" : "Sur les tuiles"; return p.length > 1 ? ou + ", « " + p[0].trim() + " » veut dire : " + p.slice(1).join(" : ").trim().replace(/\.$/, "") + "." : ou + ", cette couleur veut dire : " + t + "."; }],
  [".legende-res", function(e, t){ return "La légende du tableau : ce que veut dire chaque marque des cases, et la marque d'une question annulée ou écartée."; }],
  [".session-menu-nom", function(e, t){ return "La classe de cette séance en cours : " + t + "."; }],
  [".session-menu-meta", function(e, t){ return "Où en est cette séance : " + t + "."; }],
  [".sessions-menu-intro", function(){ return "Les séances encore ouvertes, ici ou sur un autre appareil."; }],
  [".sauv-p,.fen-note", function(e, t){ return "Un conseil pour cette partie de la Sauvegarde."; }],
  [".codeblock", function(){ return "Le prompt, tel que l'app le copie : ton chapitre, ses compétences, les limites de longueur."; }],
  [".d", function(e, t){ return "Quand cet élément est parti à la corbeille : " + t.replace(/^mise à la corbeille /, "") + "."; }],
  [".k", function(e, t){ return "La sorte d'élément mis à la corbeille : " + t.toLowerCase() + "."; }],
  [".at-modale-m", function(e, t){ return "Ce qui vient d'être copié, et sa longueur."; }],
  [".grand-p", function(){ return "La tablette, à la taille d'une vraie tablette."; }],
  [".grand-note", function(){ return "Ce que montre la feuille de l'élève, pour le tour en cours."; }],
  [".pdf-barre", function(){ return "L'aperçu de l'impression du navigateur : « Enregistrer au format PDF » garde le fichier."; }],
  // le téléphone
  [".tel-tab-n", function(e, t){ return "La tablette " + t.replace("T", "") + " de cette ligne."; }],
  [".tel-tour", function(e, t){ return "Le tour en cours, ou l'état de la question : " + t + "."; }],
  [".tel-liste-h", function(e, t){ return "Les tablettes de la classe ; un clic sur un nom agit sur l'élève."; }],
  [".tel-leg", function(e, t){ return "La légende de la liste des tablettes : " + t.replace(/ · /g, ", ") + "."; }],
  [".tel-chrono", function(e, t){ return "Le chrono de la phase en cours, sur ton téléphone."; }],
  [".tel-fin", function(e, t){ return "L'heure où la séance finira, si tout continue ainsi."; }],
  [".tel-suiv-e", function(e, t){ var c = e.closest(".tel-suiv"); return "L'énoncé de la question qui suit" + (c && c.querySelector("button") ? " : « ❌ Écarter » à côté la retire avant qu'elle soit posée." : ", tel que les élèves le liront."); }],
  [".tel-suiv > span:first-child", function(e, t){ return "Le numéro de la question qui suit."; }],
  [".tel-suiv", function(){ return null; }],
  [".tel-suivi,.tel-lire", function(e, t){ return "Où en est la correction, et ce qui reste à lire ce soir."; }],
  [".tel-manquent", function(e, t){ return "Les élèves qu'attend la séance avant d'aller plus loin."; }],
  [".tel-etat", function(e, t){ return "Ce que dit le scénario de cet élève, en ce moment."; }],
  [".tel-st-l", function(){ return "Les taux de réussite sur les tablettes, avant la correction."; }],
  [".tel-expl,.t", function(){ return "L'explication de la question, que les élèves lisent à la correction."; }],
  [".tel-al-note", function(){ return "Ce que veut dire ⛔ sur ces boutons."; }],
  [".lb", function(e, t){ return "Le nom du chrono de cette phase."; }],
  [".n", function(e, t){ return "La question en cours, sa difficulté et ses deux temps."; }],
  // les libellés de champs
  ["label.tri-l", function(){ return "L'ordre de la liste : ce menu la range autrement, sans rien changer."; }],
  ["label.reg-l", function(e, t){ return "Une durée de la séance, utilisée par la fin prévue et la garde de durée : " + t.replace(/(min|s)$/, "") + "."; }],
  ["label.elf-lab", function(e, t){ return "Une case de la fiche PAP de l'établissement : cochée, elle vaut pour toutes les disciplines."; }],
  ["label.simt-f", function(e, t){ return "Ce que cet élève écrit sur sa feuille, tapé par toi pour le mode test."; }],
  ["label.m8tx-lab", function(e, t){ return "Un champ de la notion : " + t + "."; }],
  ["label.ed-temps", function(e, t){ return /Réflexion/.test(t) ? "Le temps de réflexion de cette question, à remplir." : "Le temps de réponse de chaque tour de cette question, à remplir."; }],
  ["label.ed-bonus", function(e, t){ return /bonus/.test(t) ? "Coche-la si la question est un bonus : elle compte dans les points gagnés, pas dans le total." : "Coche-la si tu assumes la longueur : la moitié de l'élève défilera seule."; }],
  ["label.preview-q-explication-label", function(){ return "L'explication de la question, que les élèves lisent à la correction."; }],
  ["label", function(e, t){ if(/^Classe/.test(t)) return "La classe de la séance."; if(/^Évaluation/.test(t)) return "L'évaluation de la séance."; if(/^Mode/.test(t)) return "Le mode de la séance : sur tablettes ou sur papier."; if(/JSON/.test(t)) return "Le JSON de l'évaluation, que l'app vérifie."; if(/Avant|À la fin/.test(t)) return "Le moment où les élèves lisent ce message : " + t.toLowerCase() + "."; return null; }],
  // les titres de section
  ["h2,h3,.tt,.test-section-title,.sauv-h,.eli-titre,.tprof-header-title,.div-titre", bulleTitre],
  ["strong,b", bulleFort],
  ["p,div,span", bulleTexte]
];
/* ── Les titres : la section, et ce qu'on y fait ── */
var B_TITRES = [
  [/^🎯 Lancer une nouvelle séance/, "Prépare une séance : la classe, l'évaluation, le mode, puis l'appel."],
  [/^📚 Séances précédentes — (.+)/, "Les séances déjà faites par cette classe, la plus récente en tête."],
  [/^📝 Correction sur papier/, "La correction de la séance sur papier, question par question, d'après ta grille."],
  [/^📝 Correction — /, "La correction de la séance en cours, question par question, la plus ratée d'abord."],
  [/^🤝 Co-évaluation/, "Chacun dit, dans sa moitié, s'il pense que son voisin a bien lu sa feuille."],
  [/^📊 Autoévaluation/, "Chaque élève dit combien de bonnes réponses il pense avoir."],
  [/^🏁 Bilan classe/, "Le bilan de la classe à la fin de l'heure : notes, compétences, autonomie, estimation."],
  [/^📄 Séance sur papier/, "La séance sur papier en cours : chacun répond seul sur sa feuille."],
  [/^⏸️ Séance à reprendre/, "Une séance en pause : « ▶️ Reprendre » la reprend là où elle était."],
  [/^📊 Résultats/, "Les séances passées, rangées par niveau puis par classe."],
  [/^📝 Évaluations/, "Tes évaluations, rangées par niveau : la démo en tête."],
  [/^📊 .+ — /, "Le tableau de la séance : la note de chaque élève, ses compétences, son autonomie, ce qui reste à lire."],
  [/^🎯 /, "Le pilotage de la séance en cours : les tablettes, la question, le chrono."],
  [/^➕ Nouvelle évaluation/, "Colle le JSON que l'instance de création d'éval t'a rendu : l'app le vérifie avant de l'enregistrer."],
  [/^✏️ Compléter l'évaluation|^✏️ Modifier l'évaluation/, "L'éditeur : chaque champ de l'évaluation se modifie ici."],
  [/^📱 Pilotage mobile/, "Le QR qui ouvre ta télécommande sur ton téléphone."],
  [/^📖 Mode d'emploi/, "Le mode d'emploi de la console, section par section."],
  [/^💾 Sauvegarde/, "Exporter, importer, la corbeille et le nettoyage de la base QCM."],
  [/^⏱️ Les durées/, "Les durées de la séance : elles font la fin prévue et la garde de durée."],
  [/^💬 Ce que lisent les élèves/, "Les phrases que l'app affiche aux élèves, à chaque moment."],
  [/^ℹ️ Version/, "La version de l'app."],
  [/^📱 Tablettes/, "Les tablettes de la classe : qui est assis où, et où en est chacun."],
  [/^📄 Leur feuille|^📄 La lecture de leur feuille/, "La feuille de chaque élève, d'après la lecture de son voisin."],
  [/^Que dit la feuille/, "Coche ce que dit la feuille de l'élève : sa question se recalcule."],
  [/^⛔ Retirer le point d'autonomie/, "La garde du retrait du point d'autonomie : ses deux compétences d'autonomie passeraient en Maîtrise insuffisante."],
  [/^👤 .+ — \d/, function(e, t){ var nom = t.replace(/^👤\s*/, "").split(" — ")[0]; return "La fiche " + deNom(nom) + ", le soir : sa feuille lue, sa tablette, ce qu'" + bIl(nom) + " a dit, son point d'autonomie."; }],
  [/^👤 /, "La fiche de l'élève, pendant la séance : son point d'autonomie, son départ."],
  [/^📝 Bilan général/, "Le bilan général de l'élève, pré-rempli par l'app d'après sa note."],
  [/^🗑️ Mettre cette évaluation à la corbeille/, "La garde de la corbeille : l'évaluation part, gardée un an."],
  [/^📋 Check-in/, "L'appel : coche les absents, puis lance la séance."],
  [/^📱 Tablette \d+ · .+ — en direct/, "Ce que montrent les deux moitiés de cette tablette, en ce moment."],
  [/^❌ Écarter la question/, "La garde de l'écart : la question ne serait ni posée ni corrigée."],
  [/^⚠️ Annuler la question/, "La garde de l'annulation : la question posée ne compterait pas."],
  [/^🔓 Rouvrir la question \d+ pour tous/, "La garde de la réouverture : ceux qui n'ont pas répondu répondent une fois de plus."],
  [/^🔓 Rouvrir pour un élève/, "Rouvre la question close pour un seul élève, une fois."],
  [/^🚫 Départ d'un élève/, "Choisis l'élève qui part : il ne bloque plus, ses questions sortent de son total."],
  [/^↩️ Retour d'un élève/, "Choisis l'élève qui revient : il répond aux questions à venir."],
  [/^🛑 Terminer la séance/, "La garde de la fin de séance : l'archive s'écrit avec les notes telles qu'elles sont."],
  [/^⏸️ Finir à une autre heure/, "La garde de la pause : la séance garde son état et se reprend à une heure suivante."],
  [/^📌 À lire sur les feuilles/, "Les feuilles à lire ce soir, avec la raison de chacune."],
  [/^📱 Binômes proposés/, "Les binômes proposés pour la séance : glisse un nom pour échanger deux élèves."],
  [/^🧩 Ses compétences/, "Les compétences de l'élève, chacune avec son niveau."],
  [/^🧩 Les compétences de cette évaluation/, "Les compétences de l'évaluation, et les questions de chacune."],
  [/^« 🏁 Afficher leur bilan|^« 💡 Révéler|^La correction commence/, "Ce qu'attend ce geste avant de s'ouvrir."],
  [/^👥 Tablettes simulées/, "Les tablettes simulées de la classe de test."],
  [/^🎯 Panneau prof/, "Le pilotage de la classe de test, tel qu'il est en classe."],
  [/^🧹 Maintenance/, "Le nettoyage des séances restées ouvertes par erreur."],
  [/^🗑️ Zone dangereuse/, "Ce qui part en bloc à la corbeille."],
  [/^🗑️ Corbeille/, "Ce qui a été mis à la corbeille, gardé un an."],
  [/^📚 Taxonomie/, "La taxonomie du site : domaines, familles, notions."],
  [/^Élèves & codes/, "Les élèves de la classe et leurs codes personnels."],
  [/^Importer la liste/, "Importer la liste d'une classe depuis le fichier de vie scolaire."],
  [/^🛠 Panneau prof/, "Le panneau prof : la configuration du site."],
  [/^La séance, en classe|^Une question|^La correction|^La note|^Le soir|^Préparer une évaluation|^La démo|^Le point d'autonomie/, "Une section du mode d'emploi : comment marche cette partie de la séance."],
  [/^🔓 Rouvrir la séance du/, "La garde de la réouverture d'une séance passée : ses copies seraient masquées aux élèves."],
  [/^🔴 Séances actuellement en cours/, "Les séances encore ouvertes, ici ou sur un autre appareil."],
  [/^⚠️ Séance interrompue détectée/, "La console a perdu la séance en cours : elle se reprend, se met en pause ou se termine."],
  [/^✍️ La seconde attestation/, "La seconde attestation : chaque élève coche ses lignes avant la correction."],
  [/^📊 Distribution/, "Combien d'élèves dans chaque niveau de maîtrise, d'après la note."],
  [/^🧩 Par compétence/, "Pour chaque compétence, combien d'élèves dans chaque niveau."],
  [/^🎯 Calibration/, "Comment chacun s'est estimé, comparé à sa note."],
  [/^💡 Questions remarquables/, "La question la plus ratée et la mieux réussie de la classe."],
  [/^👥 Détail par élève/, "Chaque élève, sa note et ses niveaux, du meilleur au moins bon."],
  [/^🤝 Ce que chacun pense/, "Ce que chaque élève pense de la lecture de sa feuille par son voisin."],
  [/^🎚️ Les niveaux de maîtrise/, "Les tranches de la note qui donnent les quatre niveaux de maîtrise."],
  [/^👥 Classes et élèves/, "Les classes et les élèves viennent du site MJPC."],
  [/^🤖 Le prompt de création/, "Le prompt qui guide l'instance de création d'éval : à copier, ou à modifier."],
  [/^📋 Toutes les questions/, "Toutes les questions de l'évaluation, avec leurs bonnes réponses."],
  [/^📄 .+ — sur papier/, "La séance sur papier de cette évaluation, avec cette classe."],
  [/^📄 D'après ta grille/, "Ce que dit ta grille, remplie d'après les feuilles."],
  [/^📤 Rendre les copies/, "La garde du rendu des copies : chaque élève voit sa note définitive et son bilan."],
  [/^🗑️ Mettre cette séance à la corbeille/, "La garde de la corbeille : la séance part, gardée un an."],
  [/^📤 Importer un snapshot/, "La garde de l'import : la base d'aujourd'hui part d'abord à la corbeille."],
  [/^🗑️ Purger les évaluations/, "La garde de la purge : toutes les évaluations partent à la corbeille."],
  [/^📅 Emploi du temps/, "La section de l'emploi du temps : la semaine, et les objets de l'année."],
  [/^📱 Tablette \d+ · /, "La tablette simulée en grand, et ses deux élèves."]
];
function bulleTitre(e, t){
  for(var i = 0; i < B_TITRES.length; i++) if(B_TITRES[i][0].test(t)) return typeof B_TITRES[i][1] === "function" ? B_TITRES[i][1](e, t) : B_TITRES[i][1];
  return null;
}
function bulleFort(e, t){
  if(/^\d+$/.test(t)){ var c = e.closest(".pilot-stat,.stat,.autoeval-prof-cell,.bilan-classe-distrib-cell,.bilan-classe-calib-cell"); if(c && c.matches(".bilan-classe-distrib-cell,.bilan-classe-calib-cell,.autoeval-prof-cell")) return "Le nombre d'élèves dans « " + bTexte(c).replace(t, "").trim() + " » : " + t + "."; if(c) return "Le compte : " + t + " " + bTexte(c).replace(t, "").trim().toLowerCase() + "."; return "Le nombre : " + t + "."; }
  if(/^Durée estimée/.test(t)) return "La durée estimée de la séance : " + t.replace(/^Durée estimée : /, "") + ".";
  if(/^[A-F]( ✓)?$/.test(t)) return "La lettre du choix " + t[0] + (/✓/.test(t) ? ", une bonne réponse." : ".");
  if(/^📌 À lire ce soir/.test(t)) return "Les feuilles à lire ce soir.";
  if(/^Feuille pas encore lue|^Pas encore répondu/.test(t)) return "Ceux qu'attend la séance.";
  if(/exclusions?$/.test(t)) return "Le nombre d'exclusions de la classe.";
  if(/^⛔ Point d'autonomie retiré/.test(t)) return "Le point d'autonomie de l'élève est retiré.";
  if(/^🚫 Échange refusé/.test(t)) return "L'échange demandé est refusé.";
  if(/^\d+ \/ \d+ justes$/.test(t)) return "Les justes, sur ceux qui ont répondu.";
  if(/^🔬/.test(t)) return "Les gestes qui éprouvent les mécanismes livrés, sur la classe de test.";
  if(/^non conservé$|^en_cours$|^désactive$/.test(t)) return "L'état de la séance de test.";
  var parTexte = bulleTexte(e, t); if(parTexte) return parTexte;   // un texte en gras se lit comme les autres textes (« Brouillon — … », « 📱 Tablette 1 · … »)
  if(t.length < 40) return "« " + t + " ».";
  return null;
}
/* ── Les textes sans classe : d'après leur forme ── */
var B_TEXTES = [
  [/^📱 Tablette \d+$/, function(e, t){ return "La tablette " + t.match(/\d+/)[0] + " : ses deux moitiés, à gauche et à droite."; }],
  [/^🕙 Fin de l'heure/, function(e, t){ return "L'heure de la fin de l'heure : le lancement et 55 minutes."; }],
  [/^🕙 Fin /, function(e, t){ return "L'heure de la fin de l'heure."; }],
  [/^🏁 Fin prévue/, function(e, t){ return "L'heure où la séance finira, d'après les temps des questions et les durées des Réglages."; }],
  [/^📋 Toutes les questions/, function(){ return "Toutes les questions de l'évaluation : leurs temps se changent pour cette séance seulement."; }],
  [/^✓ Bonnes? réponses? :/, function(){ return "La ou les bonnes réponses de la question."; }],
  [/^(juste|faux|une bonne sur deux|toutes les bonnes \+ une en trop|voilé : attend son tour|répond \(cadre vert\)|pas de réponse|✓ prêt|attestation en cours|pas encore entré|✍️ écrit|🚪 parti)/, function(e, t){ return "Une marque de la légende des tuiles : « " + t.split(" : ")[0] + " »."; }],
  [/^🎯 Tout ou rien|^✨ Partiel/, function(e, t){ return "Le mode de l'évaluation : " + t.replace(/^\S+\s/, "") + "."; }],
  [/^\d+ questions?$/, function(e, t){ return "Le nombre de questions de l'évaluation : " + t.split(" ")[0] + "."; }],
  [/^Créée le/, function(e, t){ return "La date où l'évaluation a été créée."; }],
  [/^🚫 \d+ absents? sur \d+|^Tout le monde présent/, function(e, t){ return "Le compte des absents cochés, sur les élèves de la classe : les autres sont présents."; }],
  [/^seul$/, function(){ return "Un seul élève sur cette tablette : il répond à chaque tour."; }],
  [/^📚 chapitre : —|^📚 /, function(e, t){ return /—$/.test(t) ? "L'évaluation n'a pas encore de chapitre : il donne son niveau et ses compétences." : "Le chapitre de l'évaluation, qui donne son niveau et ses compétences."; }],
  [/^🧩 \d+ compétences?/, function(e, t){ return "Le nombre de compétences que travaille l'évaluation."; }],
  [/^\d+ minutes$/, function(e, t){ return "La durée estimée d'une séance avec cette évaluation."; }],
  [/^✅ bien lu|^🤔 peut-être mal lu|^❌ mal lu|^⏳ pas encore répondu/, function(e, t){ return "Une marque de la légende : « " + t + " »."; }],
  [/^[🟢🔵🟠🔴] /u, function(e, t){ return "Un niveau de maîtrise : " + t.replace(/^\S+\s/, "") + "."; }],
  [/^\d+ ESSAI$/, function(e, t){ return "La classe : " + t + "."; }],
  [/^Évaluation d'essai/, function(e, t){ return "L'évaluation de la séance : « " + t + " »."; }],
  [/— Q\d+ : /, function(e, t){ return "Une feuille à lire ce soir : l'élève, la question, la raison."; }],
  [/^Difficulté (Facile|Standard|Approfondi|Expert)/, function(e, t){ return "La difficulté et les deux temps de la question qui vient."; }],
  [/^✅ \d+ pense(nt)? : bien lu|^🤔 \d+ pense(nt)?|^❌ \d+ pense(nt)?/, function(e, t){ return "Le compte de la co-évaluation : combien d'élèves disent cela de la lecture de leur feuille."; }],
  [/^Phase : /, function(e, t){ return "La phase de la séance, sur ton téléphone."; }],
  [/^tablette \d+, moitié/i, function(e, t){ return "Où est assis l'élève, et avec qui."; }],
  [/^📱 .+ (sont mis ensemble|reste seule?)/, function(){ return "Qui partage une tablette, d'après les absences cochées."; }],
  [/^▸ Voir tous les codes/, function(){ return "Montre les codes de toute la classe de test."; }],
  [/^❌ Rien n'est enregistré/, function(){ return "Le JSON a des erreurs : rien n'est enregistré tant qu'elles restent."; }],
  [/^📊 Mode de scoring/, function(){ return "Le mode de calcul des points de l'évaluation."; }],
  [/^État actuel/, function(){ return "Ce qu'on sait de l'élève en ce moment."; }],
  [/^Ici : /, function(){ return "L'élève concerné, et sa tablette."; }],
  [/^Exemple — /, function(){ return "Un élève de test pour entrer sur une tablette, avec son code."; }],
  [/^Pas encore : /, function(e, t){ return "Ceux qui n'ont pas encore donné leur estimation."; }],
  [/^de$/, function(){ return "Le bas de la tranche, compris."; }],
  [/^à moins de$/, function(){ return "Le haut de la tranche, qui n'y est pas compris."; }],
  [/^❌ \d+ pense : mal lu/, function(e, t){ return /tranché/.test(t) ? "Celui qui pense que son voisin a mal lu : son alerte est tranchée." : "Celui qui pense que son voisin a mal lu sa feuille : son alerte est en haut."; }],
  [/^📱 Tablette \d+ · /, function(e, t){ return "La tablette simulée " + t.match(/\d+/)[0] + " du mode test, et ses deux élèves."; }],
  [/^🧠 Réflexion \d+ s|^✋ Réponse \d+ s/, function(e, t){ return /Réflexion/.test(t) ? "Le temps de réflexion de la question en cours." : "Le temps de réponse de chaque tour de la question en cours."; }],
  [/^✅ Bien évalués|^🌟 Sous-évalués|^⚠️ Sur-évalués|^— Pas d'autoeval/, function(e, t){ return {"✅":"Ceux dont l'estimation correspond à leur note.", "🌟":"Ceux qui se sont sous-estimés.", "⚠️":"Ceux qui se sont surestimés.", "—":"Ceux qui n'ont pas donné d'estimation."}[t.split(" ")[0]]; }],
  [/^\d+,\d+ \/ \d+$|^\d+ \/ \d+$/, function(e, t){ return "Une note : " + t + "."; }],
  [/^\d+\/\d+\/\d{4} \d\d:\d\d · /, function(){ return "La date, les présents et l'état de cette séance."; }],
  [/^Ces boutons appellent/, function(){ return "Les gestes de cet encadré passent par le vrai code de l'application, sur la classe de test."; }],
  [/^Prépare ici tes évaluations/, function(){ return "L'onglet des évaluations : les préparer ; les lancer se fait dans « 🎯 Pilotage classe »."; }],
  [/^Scanne avec ton téléphone/, function(){ return "Le QR de ta télécommande : il s'ouvre sur ton téléphone."; }],
  [/^L’arbre Domaine|^Les \d+ compétences du référentiel/, function(){ return "Ce que contient cette partie de la taxonomie."; }],
  [/^Une notion ne se supprime jamais/, function(){ return "La règle des notions : une notion se désactive, elle ne se supprime pas."; }],
  [/^Choisis une classe, colle ta liste|^Le fichier du logiciel de vie scolaire/, function(){ return "Comment importer la liste d'une classe."; }],
  [/^Il a gardé son point d'autonomie|^Elle a gardé son point d'autonomie/, function(){ return "L'élève a gardé son point d'autonomie : « ⛔ Retirer » à côté le retire, après une confirmation."; }],
  [/^⛔ Point d'autonomie retiré/, function(){ return "Le point d'autonomie de l'élève est retiré ; « ↩️ Rendre » à côté le lui rend."; }],
  [/^Exporte ou importe l'ensemble/, function(){ return "Ce que gardent l'export et l'import : toute la base QCM, avec les classes."; }],
  [/^Éditeur des messages élève|^Vu par l'élève|^Vu quand/, function(){ return "Quand l'élève lit ce message, et ce qu'il lui dit."; }],
  [/^Évaluations QCM — version/, function(){ return "La version de l'app et le socle qu'elle embarque."; }],
  [/^Chapitre choisi/, function(){ return "Le chapitre dont le prompt porte les compétences."; }],
  [/^🚫 Refusé/, function(){ return "L'exclusion demandée est refusée, avec sa raison."; }],
  [/^L’identifiant .+ ne change jamais/, function(){ return "L'identifiant reste le même : les apps et l'historique s'y rapportent."; }],
  [/^Année \d+-\d+\. Les objets vivent|^Le calendrier de l’année a été injecté/, function(){ return "Où vivent les objets de l'emploi du temps, et quand ils ont été injectés."; }],
  [/^Séance : /, function(){ return "L'état de la séance de la classe de test."; }],
  [/^[🟢🔵🟠🔴]$/u, function(e, t){ return "La pastille de ce niveau de maîtrise."; }],
  [/^à$/, function(){ return "Le haut de la tranche, qui n'y est pas compris."; }],
  [/^Brouillon — |\(\d+ questions\)$/, function(e, t){ return "Ce qui est à la corbeille : « " + t + " »."; }],
  [/^3e- éval|^\de- /, function(e, t){ return "L'évaluation de la séance : « " + t + " »."; }],
  [/^Deux élèves par tablette|^Réflexion : l'énoncé|^Après l'estimation|^La note, c'est la feuille|^Données → Résultats|^Dans l'éditeur|^La démo : rien|^Chaque élève commence/, function(){ return "Le mode d'emploi : comment marche cette partie de la séance."; }]
];
function bulleTexte(e, t){
  for(var i = 0; i < B_TEXTES.length; i++) if(B_TEXTES[i][0].test(t)) return B_TEXTES[i][1](e, t);
  // une phrase de fenêtre de confirmation ou de mode d'emploi : elle se lit ; l'infobulle dit où elle est
  var fen = e.closest(".checkin-modal");
  if(fen && /^[A-ZÀ-ÖØ-Ý][A-ZÀ-ÖØ-Ý' -]+ [A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ-]+$/.test(t)) return t + " : l'élève de cette ligne ; le bouton à côté agit pour " + (bF(t) ? "elle" : "lui") + ".";
  if(fen){
    var ok = fen.querySelectorAll(".checkin-actions button"); var lb = ok.length ? bTexte(ok[ok.length - 1]) : "";
    var deb = t.split(/[.:;!?]/)[0].trim(); if(deb.length > 48) deb = deb.slice(0, 48).replace(/\s\S*$/, "") + "…";
    return (lb ? "Ce que ferait « " + lb + " »" : "Ce que dit cette fenêtre") + ", à lire avant de choisir : « " + deb + " »."; }
  if(e.closest(".mode-emploi,.me-corps,.me-bloc")) return "Le mode d'emploi : comment marche cette partie de la séance.";
  return null;
}

/* ── La pose : après chaque rendu, chaque élément sans infobulle en reçoit une ── */
function bPosee(t){ return t.hasAttribute("data-b3") && t.getAttribute("data-b3") === t.getAttribute("title"); }
function bLibre(e){
  // l'élément a-t-il déjà son infobulle, sur lui ou sur une enveloppe qui n'est qu'à lui ?
  var t = e.closest("[title]"); if(!t) return true;
  // une bulle posée ici même (data-b3 garde son texte) se recalcule à chaque rendu : la console n'est plus démontée d'une phase à l'autre ;
  // un title écrit par React ou par la 7.7.1 n'est jamais touché
  if(t === e) return !t.getAttribute("title").trim() || bPosee(t);
  var autres = Array.prototype.filter.call(t.querySelectorAll(B_GESTE), function(g){ return g !== e && !e.contains(g) && !g.contains(e); });
  var r = t.getBoundingClientRect();
  return autres.length > 0 || r.width * r.height > 120000 || !t.getAttribute("title").trim();
}
function bCandidats(racine){
  var vis = function(el){ var r = el.getBoundingClientRect(); if(r.width < 2 || r.height < 2) return false; var cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none"; };
  var propre = function(e){ return Array.prototype.some.call(e.childNodes, function(c){ return c.nodeType === 3 && c.nodeValue.trim(); }); };
  var geste = function(e){ return e.matches(B_GESTE) || (getComputedStyle(e).cursor === "pointer" && !(e.parentElement && getComputedStyle(e.parentElement).cursor === "pointer")); };
  return Array.prototype.filter.call(racine.querySelectorAll("*"), function(e){
    if(e.closest(B_ELEVE) || e.closest(".info-tip,.deco,style,script,option,svg")) return false;
    if(!(geste(e) && !e.parentElement.closest(B_GESTE + ",.info-i")) && !(propre(e) && !e.closest(B_GESTE + ",.info-i"))) return false;
    return vis(e);
  });
}
function poserBulles(){
  var racine = document.getElementById("root"); if(!racine) return;
  var sc = SCENES.filter(function(s){ return s.id === window.SCENE_COURANTE; })[0];
  if(!sc || ["console", "telephone", "mjpc"].indexOf(sc.vue) < 0 && !/^m-/.test(sc.id)) return;
  bCandidats(racine).forEach(function(e){
    if(!bLibre(e)) return;
    var t = bTexte(e), b = null;
    for(var i = 0; i < B_REGISTRE.length && !b; i++){ if(e.matches(B_REGISTRE[i][0])){ try { b = B_REGISTRE[i][1](e, t); } catch(x){ b = null; } } }
    if(b){ var ph = bPhrase(b).replace(/\s{2,}/g, " ").replace(/([?!.…])\s*\.$/, "$1"); if(e.getAttribute("title") !== ph){ e.setAttribute("title", ph); e.setAttribute("data-b3", ph); } }
    else if(bPosee(e)){ e.removeAttribute("title"); e.removeAttribute("data-b3"); }
  });
}
(function(){
  var racine = document.getElementById("root"); if(!racine || !window.MutationObserver) return;
  var prevu = false;
  function plusTard(){ if(prevu) return; prevu = true; requestAnimationFrame(function(){ prevu = false; poserBulles(); }); }
  new MutationObserver(function(muts){ if(muts.some(function(m){ return m.type === "childList" || m.type === "characterData"; })) plusTard(); }).observe(racine, {childList:true, subtree:true, characterData:true});
})();
// à chaque rendu d'une scène, tout de suite : les infobulles, et les émojis décoratifs entiers ou absents
var rendreAvantBulles = rendre;
rendre = function(){ var r = rendreAvantBulles.apply(this, arguments); try { decosEntiers(); poserBulles(); } catch(x){} return r; };
/* ── Une bulle « i » se place dans la fenêtre : sous son « i », ou au-dessus quand la place manque ; décalée près d'un bord ── */
function placerBulle(i){
  var tip = i.querySelector(".info-tip"); if(!tip) return;
  tip.classList.remove("placee"); tip.style.left = ""; tip.style.top = "";
  var r = i.getBoundingClientRect();
  tip.classList.add("placee"); tip.style.left = "0px"; tip.style.top = "0px"; tip.style.display = "block";
  var w = tip.offsetWidth, hh = tip.offsetHeight, m = 8;
  var x = Math.min(Math.max(m, r.left + r.width / 2 - w / 2), innerWidth - w - m);
  var y = r.bottom + 6 + hh <= innerHeight - m ? r.bottom + 6 : Math.max(m, r.top - 6 - hh);
  // un ancêtre transformé (« .btn-test:hover », une fenêtre) devient le repère de « position: fixed » : on retire son décalage
  var o = tip.getBoundingClientRect();
  tip.style.left = Math.round(x - o.left) + "px"; tip.style.top = Math.round(y - o.top) + "px"; tip.style.display = "";
}
document.addEventListener("mouseover", function(ev){ var i = ev.target && ev.target.closest ? ev.target.closest(".info-i") : null; if(i) placerBulle(i); }, true);
document.addEventListener("focusin", function(ev){ var i = ev.target && ev.target.closest ? ev.target.closest(".info-i") : null; if(i) placerBulle(i); }, true);
// au défilement, la bulle encore sous la souris se replace ; les autres reprennent leur place de repos
window.addEventListener("scroll", function(){ Array.prototype.forEach.call(document.querySelectorAll(".info-tip.placee"), function(t){ var i = t.closest(".info-i"); if(i && i.matches(":hover")) placerBulle(i); else { t.classList.remove("placee"); t.style.left = ""; t.style.top = ""; } }); }, true);
document.addEventListener("mousemove", function(ev){ var i = ev.target && ev.target.closest ? ev.target.closest(".info-i") : null; if(!i) return; var t = i.querySelector(".info-tip"); if(t && !t.classList.contains("placee")) placerBulle(i); }, true);
