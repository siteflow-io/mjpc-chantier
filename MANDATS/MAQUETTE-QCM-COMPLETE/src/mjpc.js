/* ═══════════════ MJPC (complément 1, défaut 1) : les écrans partent d'index.html ═══════════════
   Le panneau prof et son menu (l. 1620–1650), « 👥 Élèves & codes » (l. 5507–5532 ; l'encart de la clé, l. 14749 ;
   l'import du fichier de classe, l. 5555), la fiche de l'élève (elfOuvrir l. 5917, elfFicheHtml l. 5936) et
   « 📚 Taxonomie » (_profSectionTaxo l. 2084, _blocTaxonomie l. 2605, l'éditeur l. 2484–2604), repris de la production
   (index.html, md5 ac792b28f40d3a0510e725fc4a6b6985) : le balisage, les classes CSS (src/mjpc.css, copié par
   outils/css-mjpc.py) et les textes. Le cadrage n'y ajoute que « 🚫 Jamais avec… » dans la ligne de l'élève (585, 590)
   et la section « Les compétences » de l'éditeur (637).
   Les données sont inventées, pour « 3 ESSAI » ; la taxonomie est la vraie (src/donnees/taxonomie_atelier.json, md5
   26128f95a0c0b59f45f6cc672218497b) et les libellés élève aussi (libelles_eleve.json, md5 17e9a9876c0372bd7716e5a5acb542b0).
   Chaque geste fait ce que sa fonction fait dans index.html (la ligne est citée à côté) ; rien n'est écrit au hub :
   l'écran change sur place. Une boîte de la vraie app (_showConsoleModal, _modaleConfirme, alert) est dessinée dans la page,
   avec son texte exact. */

var MJPC_INCHANGE = "Inchangé : cet écran reste celui d'aujourd'hui.";
// l. 1628–1645 : les quatre titres et les 14 entrées ; seules « Élèves & codes » et « Taxonomie » ont leur scène
var MJPC_MENU = [
  ["Vue d'ensemble", [["dashboard", "🏠", "Tableau de bord"]]],
  ["Personnes", [["classes", "🏫", "Classes"], ["eleves", "👥", "Élèves & codes"], ["profil-test", "🧪", "Profil test"]]],
  ["Contenu", [["archi", "📂", "Architecture"], ["archives", "📦", "Archives"], ["corbeille", "🗑", "Corbeille"], ["annonces", "📢", "Annonces aux élèves"],
    ["brevet", "🎓", "Dates de l’année"], ["taxo", "📚", "Taxonomie"], ["edt", "📅", "Emploi du temps"], ["atelier", "🛠", "Atelier"]]],
  ["Système", [["config", "⚙", "Configuration & Firebase"], ["presence", "📡", "Présence live"]]]];
var MJPC_VERS = {eleves: "m-classe-exclusions", taxo: "m-taxonomie"};

/* ── Les boîtes de la vraie app, dessinées dans la page ── */
// _showConsoleModal (l. 6965) : un titre, un corps, des boutons ; _modaleConfirme (l. 6986) : « Annuler », « Oui, continuer »,
// ou « Confirmer » après le mot tapé ; alert : le texte et « OK ».
function BoiteConsole(p){
  var s = useState(""), mot = s[0], setMot = s[1];
  var s2 = useState(false), rouge = s2[0], setRouge = s2[1];
  return h("div", {id: "console-modal", className: "fen-fond", style: {display: "flex"}},
    h("div", {className: "cm-box"},
      h("div", {className: "cm-title"}, p.b.titre),
      h("div", {className: "cm-body"}, p.b.corps,
        p.b.mot && h(F, null, h("div", {className: "cm-sub", style: {marginTop: 10}}, "Pour confirmer, tape ", h("code", null, p.b.mot), " :"),
          h("input", {type: "text", id: "cm-confirm-input", className: "cm-input", autoComplete: "off", value: mot, title: "Tape le mot demandé pour confirmer.",
            style: {width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid " + (rouge ? "#ef4444" : "rgba(251,191,36,.5)"), background: "rgba(255,255,255,.06)", color: "#fff", font: "inherit", fontSize: ".95rem"},
            onChange: function(ev){ setMot(ev.target.value); }}))),
      h("div", {className: "cm-actions"}, p.b.actions.map(function(a, i){
        return h("button", {key: i, className: "cm-btn " + (a.cls || ""), "data-local": "1", title: a.titre,
          onClick: function(){ if(p.b.mot && a.confirme && mot.trim() !== p.b.mot){ setRouge(true); return; } p.fermer(); if(a.faire) a.faire(); }}, a.label);
      }))));
}
function BoiteAlerte(p){   // la boîte système « alert » de la vraie app, dessinée : son texte exact, et « OK »
  return h("div", {className: "fen-fond alerte-native"},
    h("div", {className: "alerte-boite"}, h("div", {className: "alerte-texte"}, p.texte),
      h("div", {className: "alerte-pied"}, h("button", {className: "alerte-ok", "data-local": "1", title: "Ferme le message.", onClick: p.fermer}, "OK"))));
}
// _modaleConfirme(titre, corps, cbOui, motConfirmation) : les deux boutons de la vraie app
function confirmeMJPC(titre, corps, faire, mot){
  return {titre: titre, corps: h("div", {className: "cm-sub"}, corps), mot: mot || null,
    actions: [{label: "Annuler", cls: "ghost", titre: "Ferme la fenêtre sans rien changer."},
      {label: mot ? "Confirmer" : "Oui, continuer", cls: "warn", confirme: true, titre: "Confirme : le geste se fait.", faire: faire}]};
}

/* ── Le panneau prof (l. 1620–1650) ── */
function PanneauMJPC(p){
  var s = useState(false), test = s[0], setTest = s[1];
  var s2 = useState(null), boite = s2[0], setBoite = s2[1];
  var s3 = useState(null), alerte = s3[0], setAlerte = s3[1];
  var outils = {boite: setBoite, alerte: setAlerte, test: test};
  return h("div", {className: "tprof-overlay visible", id: "tprof-overlay"},
    h("div", {className: "tprof-box"},
      h("div", {className: "tprof-header"},
        // l. 1623 ; la pastille du mode test (m8RendreIndicateursTest, l. 2062) ; m8BasculerModeTest (l. 1811) la bascule
        h("div", {className: "tprof-header-title"}, "🛠 Panneau prof ", h("span", {className: "tprof-header-sub"}, "— configuration du site"),
          h("button", {className: "tprof-testpill" + (test ? " on" : ""), id: "tprof-testpill", "data-local": "1",
            title: test ? "Quitte le mode test : les écritures reviennent au référentiel." : "Passe en mode test : rien n’est enregistré tant qu’il est actif.",
            onClick: function(){ setTest(!test); }},
            test ? h(F, null, h("span", {className: "tprof-testpill-dot"}), "Mode test actif ", h("span", {className: "tprof-testpill-sub"}, "— rien n’est enregistré")) : "🧪 Mode test")),
        h("button", {className: "tprof-close", "data-va": "c-reglages", title: "Ferme le panneau prof et revient aux Réglages du QCM."}, "✕")),
      h("div", {className: "tprof-body"},
        h("div", {className: "tprof-sidebar"}, MJPC_MENU.map(function(g){
          return h(F, {key: g[0]}, h("div", {className: "tprof-sidebar-label"}, g[0]), g[1].map(function(e){
            var va = MJPC_VERS[e[0]], actif = e[0] === p.section;
            return h("button", {key: e[0], className: "tprof-section-btn" + (actif ? " active" : ""), "data-section": e[0],
              "data-va": va || null, disabled: !va, "aria-pressed": actif ? "true" : null,
              title: va ? "Ouvre la section « " + e[2] + " » du panneau prof." : MJPC_INCHANGE}, h("span", {className: "tps-icon"}, e[1]), e[2]);
          }));
        })),
        h("div", {className: "tprof-content", id: "tprof-content"}, typeof p.contenu === "function" ? p.contenu(outils) : p.contenu))),
    boite && h(BoiteConsole, {b: boite, fermer: function(){ setBoite(null); }}),
    alerte && h(BoiteAlerte, {texte: alerte, fermer: function(){ setAlerte(null); }}));
}

/* ── L'encart de la clé (secuEncartHtml, l. 14749), dans l'état « clé saisie » ── */
var SECU_BILAN_AUTO = "25 codes préparés, 0 refusé, 0 en panne, 0 entrée ancienne ignorée. Le clair reste en place tant que les applications en ont besoin — la protection sera effective au 3e temps du chantier sécurité.";
var SECU_BILAN_RELANCE = "0 code à préparer, 25 déjà prêts, 0 entrée ancienne ignorée.";   // secuMigrerCodes(true), l. 14671 : rien à préparer
var SECU_APPAREILS = [["Poste de la salle 12", "02/10/2026", true], ["Ordinateur portable", "15/09/2026", false]];
function EncartCle(p){
  var o = p.outils;
  if(!p.cle.valide){
    return h("div", {className: "secu-encart", id: "secu-encart"},
      h("div", {className: "secu-titre"}, "🔒 Les codes sont verrouillés sur cet appareil"),
      h("div", {className: "secu-txt"}, "Saisis ta clé de chiffrement pour les afficher. ",
        h("button", {className: "secu-i", "aria-label": "En savoir plus", "data-local": "1", title: "Ce qu’est la clé de chiffrement.",
          onClick: function(){ o.boite({titre: "La clé de chiffrement", corps: h("div", {className: "cm-sub"}, "La clé transforme les codes en données illisibles pour quiconque n’a pas la clé. Elle reste sur cet appareil : elle n’est jamais envoyée.", h("br"), h("br"), "Saisie une fois, elle est mémorisée ici — tu n’auras pas à la retaper. Sur un poste partagé, utilise « Oublier la clé » en partant.", h("br"), h("br"), "À ce stade du chantier, le clair reste en place pour les applications : la protection complète arrive au 3e temps."), actions: [{label: "Compris", cls: "primary", titre: "Ferme la fenêtre."}]}); }}, "ⓘ")),
      h("div", {className: "secu-saisie"}, h("input", {type: "password", id: "secu-cle-input", className: "cm-input", placeholder: "Clé de chiffrement (8 caractères ou plus)", title: "Ta clé de chiffrement."}),
        h("button", {className: "mjpc-act", "data-local": "1", title: "Vérifie la clé saisie et affiche les codes.", onClick: function(){ p.setCle({valide: true, bilan: SECU_BILAN_AUTO}); }}, "Afficher les codes")),
      h("div", {className: "secu-msg", id: "secu-cle-msg"}));
  }
  return h("div", {className: "secu-encart", id: "secu-encart"},
    h("div", {className: "secu-titre"}, "🔓 Codes déverrouillés sur cet appareil"),
    h("div", {className: "secu-txt"}, p.cle.bilan),
    h("div", {className: "secu-actions"},
      // secuOublier (l. 14362)
      h("button", {className: "mjpc-act", "data-local": "1", title: "Les codes redeviennent illisibles ici, jusqu’à la prochaine saisie de la clé.", onClick: function(){
        o.boite(confirmeMJPC("Oublier la clé sur cet appareil", h(F, null, "Les codes redeviendront illisibles ici jusqu’à la prochaine saisie. Les données ne bougent pas.", h("br"), h("br"), "À faire en quittant un poste partagé (salle de classe, CDI) : la clé mémorisée y afficherait les codes à quiconque s’assoit."),
          function(){ p.setCle({valide: false}); })); }}, "Oublier la clé sur cet appareil"),
      // secuVoirAppareils (l. 14378)
      h("button", {className: "mjpc-act", "data-local": "1", title: "Les appareils où la clé est mémorisée.", onClick: function(){
        o.boite({titre: "Où la clé est mémorisée", corps: h(F, null, h("div", {className: "cm-sub"}, "Sur chacun de ces appareils, les codes s’affichent SANS saisie. Un poste de salle laissé avec la clé montre tous les codes à l’élève qui s’y assoit pendant l’interclasse : pense au bouton « Oublier la clé » en quittant un poste partagé."),
          SECU_APPAREILS.map(function(a, i){ return h("div", {key: i, className: "secu-app-ligne"}, a[0], a[2] ? h(F, null, " ", h("b", null, "(cet appareil)")) : null, " — clé mémorisée depuis le " + a[1]); })),
          actions: [{label: "Fermer", cls: "primary", titre: "Ferme la fenêtre."}]}); }}, "Où la clé est mémorisée"),
      // secuMigrerCodes(true) (l. 14660) : tout est déjà prêt, le bilan se recompte
      h("button", {className: "mjpc-act", "data-local": "1", title: "Recompte les codes à préparer avec la clé.", onClick: function(){ p.setCle({valide: true, bilan: SECU_BILAN_RELANCE}); }}, "Relancer la préparation"),
      // secuRetirerClair (l. 14400) : la vérification, puis le compte et « Retirer maintenant »
      h("button", {className: "mjpc-act secu-retrait", "data-local": "1", title: "Retire le clair des codes : ensuite, un code ne se lit plus qu’avec la clé.", onClick: function(){
        o.boite({titre: "Retirer les codes en clair", corps: h("div", {className: "cm-sub"}, h("b", null, "25"), " codes portent encore leur clair — tous vérifiés conformes (chiffrés et vérifiables).", h("br"), h("br"), "Après ce geste, un code ne se lit plus qu’avec la clé de chiffrement. ", h("b", null, "Rien n’est perdu"), " : le chiffré reste, et une archive datée part en corbeille avant tout retrait.", h("br"), "Cette action s’exécute ", h("b", null, "une fois, après déploiement et vérification"), "."),
          actions: [{label: "Annuler", cls: "", titre: "Ferme la fenêtre sans rien retirer."},
            {label: "Retirer maintenant", cls: "primary", titre: "Archive les codes en corbeille, puis retire leur clair.", faire: function(){
              o.boite({titre: "Retrait terminé", corps: h("div", {className: "cm-sub"}, "Clair retiré : ", h("b", null, "25/25"), ". Archive en corbeille.", h("br"), h("br"), "✅ Terminé. Un code ne se lit plus qu’avec la clé."), actions: [{label: "Fermer", cls: "primary", titre: "Ferme la fenêtre."}]}); }}]}); }}, "Retirer les codes en clair"),
      // secuCodeProfOuvrir (l. 14494) : la section « Code professeur », inchangée
      h("button", {className: "mjpc-act", disabled: true, title: MJPC_INCHANGE}, "Code professeur")));
}

/* ── L'import du fichier de classe (eliSectionHtml, l. 5555) ── */
function ImportFichier(p){
  return h("div", {className: "eli-bloc", id: "eli-bloc"},
    h("div", {className: "eli-titre"}, "Importer la liste d’une classe"),
    h("div", {className: "eli-sous"}, "Le fichier du logiciel de vie scolaire, tel quel — ou le tableau collé depuis Excel. Rien n’est envoyé ailleurs : le fichier est lu dans ce navigateur."),
    h("div", {className: "eli-zone", id: "eli-zone", tabIndex: 0, title: "Dépose ou choisis le fichier de la classe : il est lu ici, dans ton navigateur. Rien n’est écrit tant que tu n’as pas validé l’aperçu."},
      h("div", {className: "eli-zone-t"}, "Dépose ici le fichier .xlsx de la classe"),
      h("div", {className: "eli-zone-s"}, "ou clique pour le choisir · ou colle le tableau (Ctrl + V) n’importe où sur cette page")),
    h("div", {id: "eli-apercu"}));
}

/* ── « 👥 Élèves & codes » (_profSectionEleves, l. 5507) ── */
var NOMS_ESSAI_MJPC = NOMS_ESSAI;   // les 25 élèves de « 3 ESSAI », dans l'ordre de la liste
var CODES_ESSAI = {}; NOMS_ESSAI_MJPC.forEach(function(n, i){ if(n !== "YVON Adam") CODES_ESSAI[n] = String(2101 + i * 7); });   // Adam n'a pas encore de code
var FLECHES_ESSAI = {"DUVERNAY Michel": "15/09/2026", "RAMBAUD Lina": "22/09/2026"};   // les élèves à dispositif (◆), cases cochées le …
function ElevesCodes(p){
  var o = p.outils;
  var s1 = useState({valide: true, bilan: SECU_BILAN_AUTO}), cle = s1[0], setCle = s1[1];
  var s2 = useState(NOMS_ESSAI_MJPC), noms = s2[0], setNoms = s2[1];
  var s3 = useState(CODES_ESSAI), codes = s3[0], setCodes = s3[1];
  var s4 = useState(""), ta = s4[0], setTa = s4[1];
  var s5 = useState(null), apercu = s5[0], setApercu = s5[1];
  var s6 = useState(p.ouvert), ouvert = s6[0], setOuvert = s6[1];
  var init = {}; NOMS_ESSAI.forEach(function(n){ init[n] = exclusionsDe(n); });
  if(p.trois){ init[p.ouvert] = ["CARRÉ Tom", "OLLIVIER Sacha", "QUINTON Enzo"]; ["OLLIVIER Sacha", "QUINTON Enzo"].forEach(function(x){ init[x] = init[x].concat([p.ouvert]); }); }
  var s7 = useState(init), ex = s7[0], setEx = s7[1];
  var s8 = useState(p.refus || null), refus = s8[0], setRefus = s8[1];
  function basculer(a, b){
    var la = ex[a] || [], lb = ex[b] || [];
    if(refus && refus[1] === b){ setRefus(null); return; }
    if(la.indexOf(b) >= 0){ var o1 = Object.assign({}, ex); o1[a] = la.filter(function(x){ return x !== b; }); o1[b] = lb.filter(function(x){ return x !== a; }); setEx(o1); setRefus(null); return; }
    if(la.length >= 3){ setRefus([a, b, a]); return; }
    if(lb.length >= 3){ setRefus([a, b, b]); return; }
    var o2 = Object.assign({}, ex); o2[a] = la.concat([b]); o2[b] = lb.concat([a]); setEx(o2); setRefus(null);
  }
  function nouveauCode(n){ var pris = {}; Object.keys(codes).forEach(function(k){ pris[codes[k]] = 1; }); var c = 1000 + ((n.length * 811 + Object.keys(pris).length * 37) % 8999); while(pris[String(c)]) c++; return String(c); }
  var sansCode = noms.filter(function(n){ return !codes[n]; }).length;
  var nbEx = 0; Object.keys(ex).forEach(function(k){ nbEx += ex[k].length; }); nbEx = nbEx / 2;
  return h(F, null,
    h("h2", null, "Élèves & codes"),
    h("div", {className: "tprof-section-sub"}, "Choisis une classe, colle ta liste (un élève par ligne, NOM Prénom), puis génère les codes. Liste partagée avec tes apps (dictée, etc.) ; code à 4 chiffres mutualisé (login rapide). Régénérable élève par élève."),
    h(EncartCle, {cle: cle, setCle: setCle, outils: o}),
    h(ImportFichier, {apercu: apercu}),
    h("div", {className: "lens-bar"}, h("span", {className: "lens-pill on", style: {background: "#a78bfa"}}, h("span", {className: "lpd", style: {background: "#10071a66"}}), CLASSE)),
    // le cadre de secours (l. 5518) et _importEleves (l. 5534)
    h("div", {className: "el-import"}, h("textarea", {id: "el-import-ta", placeholder: "Un élève par ligne \nex : DUPONT Marie", value: ta, title: "Colle ici ta liste : un élève par ligne, NOM Prénom.", onChange: function(ev){ setTa(ev.target.value); }}),
      h("button", {className: "tprof-add-btn", "data-local": "1", title: "Ajoute à la classe les élèves collés qui n’y sont pas encore.", onClick: function(){
        var lus = ta.split("\n").map(function(l){ return l.trim(); }).filter(Boolean);
        if(!lus.length){ o.alerte("Colle au moins un nom."); return; }
        var neufs = lus.filter(function(n){ return noms.indexOf(n) < 0; });
        if(!neufs.length){ o.alerte("Ces élèves sont déjà présents."); return; }
        setNoms(noms.concat(neufs)); setTa(""); }}, "+ Importer / compléter")),
    h("div", {className: "ex-entete"}, "🚫 Les exclusions de la classe : deux élèves exclus ne sont jamais sur la même tablette. Elles passent avant toute règle de binômes, dans chaque app. ", h("strong", null, nbEx + " exclusion" + (nbEx > 1 ? "s" : "")), " dans " + CLASSE + "."),
    h("div", {className: "el-toolbar"},
      // _genererCodesClasse (l. 6082)
      sansCode > 0 && h("button", {className: "mjpc-act", "data-local": "1", title: "Donne un code à 4 chiffres à chaque élève qui n’en a pas.", onClick: function(){ var c = Object.assign({}, codes); noms.forEach(function(n){ if(!c[n]){ c[n] = nouveauCode(n); } }); setCodes(c); }}, "Générer " + sansCode + " code" + (sansCode > 1 ? "s" : "") + " manquant" + (sansCode > 1 ? "s" : "")),
      // _printCodesClasse (l. 6101) : la page des codes, telle qu'elle s'imprime
      h("button", {className: "mjpc-act", "data-local": "1", title: "Ouvre la page des codes de la classe, à imprimer.", onClick: function(){ o.boite({titre: "Codes — " + CLASSE, corps: h("table", {className: "codes-imprimes"}, h("thead", null, h("tr", null, h("th", null, "Élève"), h("th", null, "Code"))), h("tbody", null, noms.map(function(n){ return h("tr", {key: n}, h("td", null, n), h("td", {className: "c"}, codes[n] || "—")); }))), actions: [{label: "Fermer", cls: "primary", titre: "Ferme la page des codes."}]}); }}, "🖨 Imprimer"),
      // _resetAllCodesClasse (l. 6084) : le mot « CODES » à taper
      h("button", {className: "mjpc-act danger", "data-local": "1", title: "Remplace tous les codes de la classe : les anciens ne fonctionneront plus.", onClick: function(){
        o.boite(confirmeMJPC("Régénérer tous les codes", h(F, null, "⚠ TOUS les codes de cette classe seront remplacés. ", h("b", null, "Les anciens ne fonctionneront plus"), " — chaque élève devra recevoir son nouveau code."),
          function(){ var c = {}; noms.forEach(function(n, i){ c[n] = String(3000 + ((i * 271 + 17) % 6999)); }); setCodes(c); }, "CODES")); }}, "Tout régénérer")),
    h("div", {className: "el-list"}, noms.map(function(n, i){
      var l = ex[n] || [], ouv = ouvert === n, code = codes[n];
      return h("div", {key: n, className: "el-bloc"},
        h("div", {className: "el-row"},
          h("span", {className: "el-num"}, i + 1),
          // elfOuvrir (l. 5917) : un clic sur le nom ouvre sa fiche
          h("span", {className: "el-name elf-cliquable", title: "Ouvre la fiche de l’élève : sexe, dispositif, cases PAP. Rien n’est écrit tant que tu n’enregistres pas.", onClick: function(){ window.FICHE_NOM = n; versScene("m-fiche-eleve"); }}, n),
          h("span", {className: "elf-flag", id: "elf-flag-" + i, title: cle.valide && FLECHES_ESSAI[n] ? "élève à dispositif — cases cochées le " + FLECHES_ESSAI[n] : null}, cle.valide && FLECHES_ESSAI[n] ? "◆" : ""),
          // « 🚫 Jamais avec… » : dans la ligne, juste après le ◆ (585), au plus 3 (590)
          h("button", {className: "ex-btn" + (l.length ? " a" : "") + (ouv ? " ouv" : ""), "data-local": "1", "aria-expanded": ouv, title: "Les camarades avec qui " + pre(n) + " n'est jamais sur une tablette : au plus 3. Un clic " + (ouv ? "replie la liste." : "ouvre la liste à cocher."), onClick: function(){ setOuvert(ouv ? null : n); setRefus(null); }},
            "🚫 Jamais avec…" + (l.length ? " · " + l.length : "")),
          h("span", {className: "el-code", id: "code-aff-" + i}, code ? (cle.valide ? code : h("span", {className: "secu-masque"}, "✻✻✻✻")) : h("span", {className: "el-nocode"}, "—")),
          h("span", {className: "el-acts"},
            // _regenCodeEleve (l. 6083) : sans confirmation
            h("button", {className: "admin-action-btn", "data-local": "1", title: "Régénérer le code", onClick: function(){ var c = Object.assign({}, codes); c[n] = nouveauCode(n + "↻"); setCodes(c); }}, "↻"),
            // _deleteEleveCls (l. 6085)
            h("button", {className: "admin-action-btn danger", "data-local": "1", title: "Retirer l’élève", onClick: function(){
              o.boite(confirmeMJPC("Retirer un élève", h(F, null, "Retirer ", h("b", null, n), " de la classe ? Une copie (élève + code) part d’abord en corbeille."), function(){ setNoms(noms.filter(function(x){ return x !== n; })); })); }}, "✕"))),
        ouv && h("div", {className: "ex-panneau"},
          h("div", {className: "ex-t"}, "🚫 " + n + " n'est jamais sur une tablette avec… ", h("span", {className: "ex-c"}, l.length + " / 3")),
          h("div", {className: "ex-grille"}, NOMS_ESSAI.filter(function(x){ return x !== n; }).map(function(x){
            var on = l.indexOf(x) >= 0;
            return h("button", {key: x, className: "ex-case" + (on ? " on" : ""), "data-local": "1", title: on ? "Retire l'exclusion entre " + pre(n) + " et " + pre(x) + ", dans les deux sens. Un clic l'enregistre aussitôt." : "Exclut " + pre(n) + " et " + pre(x) + " : jamais ensemble sur une tablette, dans les deux sens, pour toutes les apps. Un clic l'enregistre aussitôt.", onClick: function(){ basculer(n, x); }}, h("span", {className: "ck"}, on ? "✓" : ""), x);
          })),
          refus && h("div", {className: "ex-refus"}, h("strong", null, "🚫 Refusé : "), "pas d'exclusion entre " + pre(refus[0]) + " et " + pre(refus[1]) + " : " + refus[2] + " a déjà 3 exclusions, le plus que permet MJPC. Avec 3 au plus, il existe toujours des binômes possibles, absents compris, dès 8 présents. Retire d'abord une exclusion de " + refus[2] + "."),
          h("div", {className: "ex-note"}, "Elle vaut dans les deux sens, et pour toutes les apps qui partagent une tablette (le QCM, la correction de dictée…). Aucun écran d'élève ne la montre.")));
    })));
}
function ScElevesCodes(trois){
  return h(PanneauMJPC, {section: "eleves", contenu: function(o){ return h(ElevesCodes, {outils: o, ouvert: "ESNAULT Inès", trois: trois, refus: trois ? ["ESNAULT Inès", "PERRAUD Jade", "ESNAULT Inès"] : null}); }});
}

/* ── La fiche de l'élève (elfFicheHtml, l. 5936–5967 ; ELF_PAP, l. 5888–5904) ── */
var ELF_PAP = [
  ["pap-01", "Proposer des supports écrits aérés et agrandis (exemple : ARIAL 14)"],
  ["pap-02", "Limiter la copie (synthèse du cours photocopiée, placée sur École Directe…)"],
  ["pap-03", "Lecture par un tiers ou lecture immersive (prévoir MPA)"],
  ["pap-04", "Décomposer les consignes, hiérarchiser"],
  ["pap-05", "Aider à la mise en place de méthodes de travail (systèmes d'organisation répétitifs, accompagnement personnalisé)"],
  ["pap-06", "Prendre en compte les contraintes associées (fatigue, lenteur…)"],
  ["pap-07", "Utilisation de l'informatique : MPA"],
  ["pap-08", "Accorder un temps majoré"],
  ["pap-09", "Privilégier les évaluations sur le mode oral"],
  ["pap-10", "Diminuer le nombre d'exercices, de questions quand la mise en place du temps majoré n'est pas possible ou peu souhaitable"],
  ["pap-11", "Limiter la quantité d'écrit (recours possible aux QCM, exercices à trous, schémas…)"],
  ["pap-12", "Ne pas pénaliser les erreurs (orthographe grammaticale, d'usage) et le soin dans les travaux écrits"],
  ["pap-13", "Ne pas pénaliser le manque de participation à l'oral"],
  ["pap-14", "Limiter le « par cœur », demander à ce que les notions clés uniquement soient retenues"],
  ["pap-15", "Proposer des dictées aménagées (à trous, avec un choix parmi plusieurs propositions…)"]];
// les données inventées des fiches : Michel, né le 14/03/2011, sexe M, à dispositif, deux cases cochées le 15/09/2026 ;
// Lina, à dispositif aussi ; les autres, sans dispositif ni case cochée (la scène ouvre la fiche de l'élève cliqué, Michel par défaut)
var FICHES_ESSAI = {"DUVERNAY Michel": {naissance: "14/03/2011", sexe: "m", dispositif: true, pap: {"pap-01": true, "pap-08": true}, majLe: "15/09/2026"},
  "RAMBAUD Lina": {naissance: "02/11/2011", sexe: "f", dispositif: true, pap: {"pap-08": true, "pap-15": true}, majLe: "22/09/2026"}};
function ficheDe(n){ var f = FICHES_ESSAI[n] || {naissance: "", sexe: "", dispositif: false, pap: {}, majLe: null}; return Object.assign({nom: n}, f); }
function FicheEleve(p){
  var o = p.outils;
  var s1 = useState({valide: true, bilan: SECU_BILAN_AUTO}), cle = s1[0], setCle = s1[1];
  var e = ficheDe(window.FICHE_NOM || "DUVERNAY Michel");
  var s2 = useState(e.sexe), sexe = s2[0], setSexe = s2[1];
  var s3 = useState({dispositif: e.dispositif, pap: Object.assign({}, e.pap), remarques: {}, synthese: ""}), B = s3[0], setB = s3[1];
  var s4 = useState(e.majLe), majLe = s4[0], setMajLe = s4[1];
  var s5 = useState(""), message = s5[0], setMessage = s5[1];
  var lisible = cle.valide, disp = lisible ? B.dispositif : null;
  function maj(champ, v){ var n = Object.assign({}, B); n[champ] = v; setB(n); }
  return h(F, null,
    h("h2", null, "Élèves & codes"),
    h(EncartCle, {cle: cle, setCle: setCle, outils: o}),
    h("div", {className: "elf", id: "elf"},
      h("button", {className: "elf-retour", "data-va": "m-classe-exclusions", title: "Revient à la liste de la classe. Ce qui n’est pas enregistré est perdu."}, "← " + CLASSE + " · Élèves & codes"),
      h("div", {className: "elf-tete"}, (disp ? "◆ " : "") + e.nom + " — " + CLASSE),
      h("div", {className: "elf-sous"}, "Fiche élève · ", lisible ? (e.naissance ? "né le " + e.naissance : "date de naissance inconnue") : h("span", {className: "elf-cle"}, "né le … : saisis ta clé"), " · sexe ",
        // elfSexe (l. 5972) : un clic l'enregistre aussitôt, sans la clé
        h("span", {className: "elf-seg", title: "Le sexe, lu par les apps (le QCM). Un clic l’enregistre aussitôt, sans ta clé : il n’est pas chiffré."},
          ["f", "m"].map(function(v){ return h("button", {key: v, className: "elf-segb" + (sexe === v ? " on" : ""), id: "elf-sexe-" + v, "data-local": "1", "aria-pressed": sexe === v ? "true" : null, title: "Le sexe, lu par les apps (le QCM). Un clic l’enregistre aussitôt, sans ta clé : il n’est pas chiffré.", onClick: function(){ setSexe(v); }}, v.toUpperCase()); })),
        " · dispositif : ",
        lisible ? h("span", {className: "elf-seg", title: "Élève à dispositif (PAP). Le choix s’écrit quand tu enregistres la fiche ; le nombre de la classe suit."},
          [["oui", true], ["non", false]].map(function(x){ return h("button", {key: x[0], className: "elf-segb" + (B.dispositif === x[1] ? " on" : ""), id: "elf-disp-" + x[0], "data-local": "1", "aria-pressed": B.dispositif === x[1] ? "true" : null, title: "Élève à dispositif (PAP). Le choix s’écrit quand tu enregistres la fiche ; le nombre de la classe suit.", onClick: function(){ maj("dispositif", x[1]); }}, x[0]); }))
          : h("span", {className: "elf-cle"}, "saisis ta clé"),
        " · cases cochées le ", h("b", {id: "elf-majle"}, majLe || "jamais"),
        " · ", h("span", {className: "elf-cadenas"}, "🔒 la fiche est chiffrée avec ta clé — " + (cle.valide ? "saisie ✔" : "à saisir (encart en haut)"))),
      [["Pour toutes les disciplines — la fiche PAP de l’établissement, ligne à ligne", 0, 7], ["Évaluations", 7, 15]].map(function(bl){
        return h("div", {key: bl[0], className: "elf-bloc"}, h("div", {className: "elf-bloc-t"}, bl[0]),
          ELF_PAP.slice(bl[1], bl[2]).map(function(r){ var id = r[0], on = lisible && !!B.pap[id];
            return h("div", {key: id, className: "elf-ligne"},
              h("label", {className: "elf-lab"}, h("input", {type: "checkbox", id: "elf-c-" + id, checked: on, disabled: !lisible, title: r[1], onChange: function(ev){ var pp = Object.assign({}, B.pap); pp[id] = ev.target.checked; maj("pap", pp); }}), " ", h("span", null, r[1]), " ", h("span", {className: "elf-id"}, id)),
              h("input", {className: "elf-rem", id: "elf-r-" + id, placeholder: "remarque (facultatif)", disabled: !lisible, value: lisible ? (B.remarques[id] || "") : "", title: "Une remarque sur cette ligne (facultatif).", onChange: function(ev){ var rr = Object.assign({}, B.remarques); rr[id] = ev.target.value; maj("remarques", rr); }}));
          }));
      }),
      h("div", {className: "elf-bloc"}, h("div", {className: "elf-bloc-t"}, "Synthèse — remarques, points de vigilance"),
        h("textarea", {className: "elf-syn", id: "elf-syn", disabled: !lisible, placeholder: lisible ? "synthèse (facultatif)" : "saisis ta clé pour lire et écrire la fiche", value: lisible ? B.synthese : "", title: "La synthèse de la fiche (facultatif).", onChange: function(ev){ maj("synthese", ev.target.value); }})),
      h("div", {className: "elf-apps"}, "Ce que les apps liront : dictée aménagée ", lisible ? h("b", null, B.pap["pap-15"] ? "oui" : "non") : "…", ", sexe ", h("b", null, sexe ? sexe.toUpperCase() : "—"), " — jamais la fiche."),
      message && h("div", {className: "eli-msg", id: "elf-msg"}, message),
      h("div", {className: "elf-pied"},
        // elfEnregistrer (l. 5978) : sans la clé, la fenêtre « Ta clé est nécessaire »
        h("button", {className: "eli-btn prim", id: "elf-enregistrer", "data-local": "1", title: "Chiffre avec ta clé et écrit : le dispositif, les cases, les remarques, la synthèse et la date du jour ; publie pour les apps « dictée aménagée » (la case pap-15). Ta clé est nécessaire.", onClick: function(){
          if(!cle.valide){ o.boite({titre: "Ta clé est nécessaire", corps: h("div", {className: "cm-sub"}, "Ta clé est nécessaire pour enregistrer la fiche : le dispositif, les cases, les remarques et la synthèse sont chiffrés avec elle. Saisis-la dans l’encart en haut, puis enregistre. Rien n’a été écrit."), actions: [{label: "Compris", cls: "primary", titre: "Ferme la fenêtre."}]}); return; }
          setMajLe("10/10/2026"); setMessage("✔ Fiche enregistrée — cases cochées le 10/10/2026 ; les apps liront : dictée aménagée " + (B.pap["pap-15"] ? "oui" : "non") + "."); }}, "Enregistrer la fiche"),
        h("button", {className: "eli-btn", "data-va": "m-classe-exclusions", title: "Revient à la liste de la classe. Ce qui n’est pas enregistré est perdu."}, "Fermer")),
      h("div", {className: "elf-reserve", title: "Réservé : rien ne s’y écrit encore."}, h("div", {className: "elf-bloc-t"}, "Historique et progression de l’élève"), "Cette partie arrivera avec le profil de l’élève : ses dictées et résultats, ses évaluations, ses carnets d’erreurs, sa progression notion par notion — dans l’année seulement.")));
}
function ScFicheEleve(){ return h(PanneauMJPC, {section: "eleves", contenu: function(o){ return h(FicheEleve, {outils: o}); }}); }

/* ── La taxonomie (_blocTaxonomie l. 2605, _taxoHtml l. 2569), sur la vraie taxonomie ── */
function taxoTotal(t){ var n = 0; t.domaines.forEach(function(d){ (d.familles || []).forEach(function(f){ n += (f.notions || []).length; }); }); return n; }
function taxoVersionSuivante(v){ var m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(v || "")); return m ? m[1] + "." + m[2] + "." + (parseInt(m[3], 10) + 1) : String(v || "0.0.0") + ".1"; }   // _taxoVersionSuivante, l. 2339
var TAXO_JOUR = "2026-10-10";   // _taxoJourISO(new Date()) le jour de la maquette
var COMP_CATEGORIES = [["Français — cycle 4", "francaisC4"], ["Compétences transversales", "transversales"]];
function Taxonomie(p){
  var o = p.outils;
  var s1 = useState(p.ouvert), ouvert = s1[0], setOuvert = s1[1];
  var s2 = useState(p.doms || {}), doms = s2[0], setDoms = s2[1];
  var s3 = useState(p.fams || {}), fams = s3[0], setFams = s3[1];
  var s4 = useState(p.edit || null), edit = s4[0], setEdit = s4[1];
  var s5 = useState(null), creation = s5[0], setCreation = s5[1];
  var s6 = useState(TAXO), t = s6[0], setT = s6[1];
  var s7 = useState(p.groupes || {}), groupes = s7[0], setGroupes = s7[1];
  var s8 = useState(LIB_ELEVE), libs = s8[0], setLibs = s8[1];
  function ecrire(modifier){ var n = JSON.parse(JSON.stringify(t)); modifier(n); n.meta = Object.assign({}, n.meta, {version: taxoVersionSuivante(n.meta.version), date: TAXO_JOUR}); setT(n); }   // _taxoMetaSuivant, l. 2348
  function lireChamps(racine){ var l = function(s){ var e = racine.querySelector("[id$='" + s + "']"); return e ? e.value.trim() : ""; }; return {libelleProf: l("-prof"), libelleEleve: l("-eleve"), niveaux: l("-niveaux"), exemple: l("-exemple")}; }
  function valider(v, comp){   // _taxoValiderChamps, l. 2419 : les trois alert de la vraie app
    if(!v.libelleProf){ o.alerte("Écris d’abord le libellé professeur."); return false; }
    if(!v.libelleEleve){ o.alerte("Écris aussi le libellé élève (ce que lisent les élèves)."); return false; }
    if(!comp && !v.niveaux){ o.alerte("Indique les niveaux concernés (par exemple : 6e-3e)."); return false; }
    return true;
  }
  function champ(prefixe, suffixe, etiquette, valeur, indice){   // _taxoChampForm, l. 2492
    return h("div", {key: suffixe, className: "m8tx-champ"}, h("label", {className: "m8tx-lab"}, etiquette),
      h("input", {type: "text", className: "m8-input", id: prefixe + suffixe, defaultValue: valeur || "", placeholder: indice || "", title: etiquette + "."}));
  }
  function formEdition(n, comp){   // _taxoFormEdition, l. 2496 ; une compétence a le même formulaire, avec son « Libellé élève » (637)
    return h("div", {className: "m8tx-form"},
      champ("m8tx-f", "-prof", "Libellé professeur", comp ? n.libelle : n.libelleProf, ""),
      champ("m8tx-f", "-eleve", "Libellé élève", comp ? libs[n.id] : n.libelleEleve, ""),
      !comp && champ("m8tx-f", "-niveaux", "Niveaux", n.niveaux, "6e-3e"),
      !comp && champ("m8tx-f", "-exemple", "Exemple (facultatif)", n.exemple, "« … »"),
      h("div", {className: "m8tx-actions"},
        h("button", {className: "m8-btn m8-btn-min", "data-local": "1", title: "Enregistre la " + (comp ? "compétence" : "notion") + " au référentiel ; le numéro de version avance d’un cran.", onClick: function(ev){   // taxoEditerEnregistrer, l. 2431
          var v = lireChamps(ev.target.closest(".m8tx-form")); if(!valider(v, comp)) return;
          if(comp){ ecrire(function(x){ for(var k in x.competences) x.competences[k].forEach(function(g){ g.items.forEach(function(it){ if(it.id === n.id) it.libelle = v.libelleProf; }); }); }); var lb = Object.assign({}, libs); lb[n.id] = v.libelleEleve; setLibs(lb); }
          else ecrire(function(x){ x.domaines.forEach(function(d){ d.familles.forEach(function(f){ (f.notions || []).forEach(function(nn){ if(nn.id === n.id){ nn.libelleProf = v.libelleProf; nn.libelleEleve = v.libelleEleve; nn.niveaux = v.niveaux; if(v.exemple) nn.exemple = v.exemple; else delete nn.exemple; } }); }); }); });
          setEdit(null); }}, "Enregistrer"),
        h("button", {className: "m8-btn m8-btn-min", "data-local": "1", title: "Ferme le formulaire sans rien changer.", onClick: function(){ setEdit(null); }}, "Annuler")),   // taxoEditerAnnuler, l. 2430
      h("p", {className: "m8tx-note"}, "L’identifiant ", h("code", null, n.id), " ne change jamais : c’est lui qui étiquette le travail des élèves."));
  }
  function formCreation(f){   // _taxoFormCreation, l. 2507
    return h("div", {className: "m8tx-form"},
      h("div", {className: "m8tx-form-titre"}, "Nouvelle notion"),
      champ("m8tx-c", "-prof", "Libellé professeur", "", "Identifier… / Écrire… / Distinguer…"),
      champ("m8tx-c", "-eleve", "Libellé élève", "", "Ce que liront les élèves"),
      champ("m8tx-c", "-niveaux", "Niveaux", "6e-3e", "6e-3e"),
      champ("m8tx-c", "-exemple", "Exemple (facultatif)", "", "« … »"),
      h("div", {className: "m8tx-actions"},
        h("button", {className: "m8-btn m8-btn-min", "data-local": "1", title: "Crée la notion, avec un identifiant neuf qui ne changera jamais.", onClick: function(ev){ var v = lireChamps(ev.target.closest(".m8tx-form")); if(!valider(v)) return; setCreation(null); }}, "Créer la notion"),
        h("button", {className: "m8-btn m8-btn-min", "data-local": "1", title: "Ferme le formulaire sans rien créer.", onClick: function(){ setCreation(null); }}, "Annuler")),
      h("p", {className: "m8tx-note"}, "L’identifiant sera fabriqué automatiquement (numéro suivant du domaine) et ne changera jamais."));
  }
  function basculer(n){   // taxoBasculer, l. 2457 : la garde de _modaleConfirme pour désactiver, rien pour réactiver
    var faire = function(){ ecrire(function(x){ x.domaines.forEach(function(d){ d.familles.forEach(function(f){ (f.notions || []).forEach(function(nn){ if(nn.id === n.id) nn.actif = (n.actif === false); }); }); }); }); };
    if(n.actif !== false) o.boite(confirmeMJPC("Désactiver la notion", h(F, null, "Désactiver « ", h("b", null, n.libelleProf || n.id), " » ?", h("br"), h("br"), "Elle sortira des choix proposés par les applications. L’historique des élèves qui portent cette étiquette reste lisible, et tu pourras la réactiver à tout moment."), faire));
    else faire();
  }
  function ligneNotion(n, comp){   // _taxoLigneNotion, l. 2519 ; une compétence sur le même modèle (637)
    var inactif = n.actif === false;
    return h("div", {key: n.id, className: "m8tx-notion" + (inactif ? " m8tx-inactive" : "")},
      h("div", {className: "m8tx-n-l1"}, h("span", {className: "m8tx-id"}, n.id), h("span", {className: "m8tx-prof"}, comp ? n.libelle : (n.libelleProf || "")), inactif ? h("span", {className: "m8tx-badge"}, "désactivée") : null),
      h("div", {className: "m8tx-n-l2"}, comp ? "Élève : " + (libs[n.id] || "") : "Élève : " + (n.libelleEleve || "") + " · " + (n.niveaux || "") + (n.exemple ? " · " + n.exemple : "")),
      h("div", {className: "m8tx-n-actions"},
        h("button", {className: "m8-btn m8-btn-min", "data-local": "1", title: "Ouvre le formulaire : corriger les libellés" + (comp ? "" : ", les niveaux et l’exemple") + ".", onClick: function(){ setEdit(n.id); setCreation(null); }}, "✏️ Modifier"),
        h("button", {className: "m8-btn m8-btn-min" + (inactif ? "" : " m8-btn-rouge"), "data-local": "1", title: inactif ? "Réactive : elle revient dans les choix des applications." : "Désactive : elle sort des choix des applications ; l’historique reste lisible.", onClick: function(){ basculer(n); }}, inactif ? "Réactiver" : "Désactiver")),
      edit === n.id ? formEdition(n, comp) : null);
  }
  function ligneFamille(f){   // _taxoLigneFamille, l. 2537
    var nots = f.notions || [], actives = nots.filter(function(x){ return x && x.actif !== false; }).length, dep = !!fams[f.id];
    return h("div", {key: f.id, className: "m8tx-fam"},
      h("div", {className: "m8tx-fam-titre", onClick: function(){ var o2 = Object.assign({}, fams); o2[f.id] = !dep; setFams(o2); }},
        h("span", {className: "m8tx-fleche"}, dep ? "▼" : "▶"), " ", f.libelleProf || f.id,
        " ", h("span", {className: "m8tx-compte"}, nots.length + " notion" + (nots.length > 1 ? "s" : "") + (actives < nots.length ? " (" + actives + " active" + (actives > 1 ? "s" : "") + ")" : ""))),
      dep && h(F, null, nots.map(function(n){ return ligneNotion(n); }),
        creation === f.id ? formCreation(f) : h("button", {className: "m8-btn m8-btn-min m8tx-ajout", "data-local": "1", title: "Ouvre le formulaire d’une nouvelle notion dans cette famille.", onClick: function(){ setCreation(f.id); setEdit(null); }}, "+ Nouvelle notion")));
  }
  function ligneDomaine(d){   // _taxoLigneDomaine, l. 2555
    var fs = d.familles || [], total = 0, dep = !!doms[d.id]; fs.forEach(function(f){ total += (f.notions || []).length; });
    return h("div", {key: d.id, className: "m8tx-dom"},
      h("div", {className: "m8tx-dom-titre", onClick: function(){ var o2 = Object.assign({}, doms); o2[d.id] = !dep; setDoms(o2); }},
        h("span", {className: "m8tx-fleche"}, dep ? "▼" : "▶"), " ", d.libelleProf || d.id,
        " ", h("span", {className: "m8tx-eleve-lab"}, "(élève : " + (d.libelleEleve || "") + ")"),
        " ", h("span", {className: "m8tx-compte"}, fs.length + " familles · " + total + " notions")),
      dep && fs.map(ligneFamille));
  }
  // « Les compétences » (637), après l'arbre, sur le modèle des notions : les 28, rangées sous leurs groupes
  function sectionCompetences(){
    return h("div", {className: "m8tx-comps"},
      h("div", {className: "m8-titre"}, "🧩 Les compétences"),
      h("p", {className: "m8-p"}, "Les 28 compétences du référentiel. Le libellé officiel reste pour École Directe et le PDF « notes et compétences » ; tout ce que voit l'élève prend le libellé élève. L'identifiant ne change jamais."),
      COMP_CATEGORIES.map(function(c){
        return h("div", {key: c[1], className: "m8tx-comp-cat"}, h("div", {className: "m8tx-comp-cat-t"}, c[0]),
          t.competences[c[1]].map(function(g){
            var dep = !!groupes[g.id];
            return h("div", {key: g.id, className: "m8tx-fam"},
              h("div", {className: "m8tx-fam-titre", onClick: function(){ var o2 = Object.assign({}, groupes); o2[g.id] = !dep; setGroupes(o2); }},
                h("span", {className: "m8tx-fleche"}, dep ? "▼" : "▶"), " ", g.libelle, " ", h("span", {className: "m8tx-compte"}, g.items.length + " compétence" + (g.items.length > 1 ? "s" : ""))),
              dep && g.items.map(function(it){ return ligneNotion(it, true); }));
          }));
      }));
  }
  var total = taxoTotal(t);
  return h(F, null,
    h("h2", null, "📚 Taxonomie — le référentiel des notions"),
    h("div", {id: "m8-console"},
      h("div", {className: "m8-bloc"}, h("div", {className: "m8-titre"}, "📚 Taxonomie — le référentiel des notions"),
        h("p", {className: "m8-p"}, "L’arbre Domaine › Famille › Notion que lisent les applications. Ici tu peux créer une notion, corriger ses libellés, ses niveaux et son exemple, ou la désactiver."),
        // taxoOuvrirEditeur, l. 2484
        h("button", {className: "m8-btn", "data-va": ouvert ? "m-taxonomie" : "m-taxonomie-editeur", title: ouvert ? "Ferme l’éditeur du référentiel." : "Ouvre l’éditeur du référentiel : les domaines, les familles, les notions, les compétences."}, ouvert ? "Fermer l’éditeur" : "Ouvrir l’éditeur"),
        h("div", {id: "m8tx-editeur", className: "m8tx-editeur"}, ouvert && h(F, null,
          o.test && h("div", {className: "m8tx-bandeau-test"}, "🧪 MODE TEST — tu édites une COPIE de la taxonomie. Rien n’est enregistré au référentiel : toutes tes modifications disparaîtront en quittant le mode test."),
          h("div", {className: "m8tx-etat"}, "Version " + t.meta.version + " · " + t.meta.date + " · " + t.domaines.length + " domaines · " + total + " notions"),
          h("p", {className: "m8tx-regle"}, "Une notion ne se supprime jamais et son identifiant ne change jamais : le travail des élèves est étiqueté par ces identifiants, une étiquette qui disparaît ou change de numéro décrocherait des années de travail. Une notion qui ne sert plus se ", h("strong", null, "désactive"), " — elle sort des choix des applications, l’historique reste lisible."),
          t.domaines.map(ligneDomaine),
          sectionCompetences())))));
}
function ScTaxo(o){ return h(PanneauMJPC, {section: "taxo", contenu: function(x){ return h(Taxonomie, Object.assign({outils: x}, o)); }}); }

/* ── Les scènes de MJPC ── */
refaire("m-classe-exclusions", function(){ return ScElevesCodes(false); });
refaire("m-exclusion-refusee", function(){ return ScElevesCodes(true); });
refaire("m-taxonomie-competences", function(){ return ScTaxo({ouvert: true, groupes: {"c4-oral": true, "c4-lire": true, "c4-ecrire": true, "c4-langue": true, "c4-culture": true, "tr-langages": true, "tr-methodes": true, "tr-personne": true}}); });
SCENES = SCENES.concat([
  {id: "m-fiche-eleve", vue: "console", vh: 1500, render: ScFicheEleve},
  {id: "m-taxonomie", vue: "console", render: function(){ return ScTaxo({ouvert: false}); }},
  {id: "m-taxonomie-editeur", vue: "console", vh: 1100, render: function(){ return ScTaxo({ouvert: true}); }},
  {id: "m-taxonomie-domaine", vue: "console", vh: 1500, render: function(){ return ScTaxo({ouvert: true, doms: {"dom-ortho-lex": true}, fams: {"fam-01": true}}); }},
  {id: "m-taxonomie-notion", vue: "console", vh: 1500, render: function(){ return ScTaxo({ouvert: true, doms: {"dom-ortho-lex": true}, fams: {"fam-01": true}, edit: "ortho-lex-001"}); }},
  {id: "m-taxonomie-competence", vue: "console", vh: 1500, render: function(){ return ScTaxo({ouvert: true, groupes: {"tr-personne": true}, edit: "tr-personne-03"}); }}
]);
SCENES.filter(function(s){ return /^m-(classe-exclusions|exclusion-refusee)$/.test(s.id); }).forEach(function(s){ s.vh = 1900; });
SCENES.filter(function(s){ return s.id === "m-taxonomie-competences"; })[0].vh = 2600;
