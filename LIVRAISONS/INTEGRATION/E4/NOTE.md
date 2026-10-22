# E4 — NOTE (le récit et le papier)

*État au 21/10/2026 10:18 UTC. Cette note est tenue à jour jusqu'à la fin du chantier ; ce qui n'est pas fait est écrit (section 7).*

## 1 · Ce que ça change pour la classe
Après l'heure (ou pendant), Paul ouvre **Relecture** dans la barre du site (Structure · Atelier · Pilotage · Relecture) : **le récit** de ce que la classe a réellement vu — par activité, à l'heure réelle, avec les prénoms des élèves qui ont répondu ou pris la parole, les fiches reprises (« pour réviser avant l'évaluation »), ce qu'elle a surligné et recopié, ce qui a été corrigé en classe — en trois temps (début, milieu, fin). Il le corrige s'il veut (« ma version »), et sa version **survit au rechargement** (`C/recit/<heure>` au hub). Il le **copie pour École Directe** en un clic, en HTML propre (comme l'ancien), le travail à faire avec le lien de l'espace de travail de la classe s'il est saisi. La face **Papier** compose la feuille du cahier depuis ce récit relu (entête classe · chapitre · séance · date, « À relire — », le travail, le pied MJPC) puis les fiches montrées « à coller dans le cahier » ; **l'impression ne sort que la feuille**. « Ce qui s'est passé » (pour Paul), « La séance », « Le chapitre » sont ceux de la maquette. Les **documents de Structure** s'ouvrent dans l'écran sans être recopiés (« vient de Structure · Séance N », Drive en `/preview`), et voyagent avec la scène jusqu'au tableau. Paul peut relire une **autre classe** qui a joué la séance.

## 2 · Les empreintes
| | md5 |
|---|---|
| production de départ `index.html` 8.74.0-③ | `ac792b28f40d3a0510e725fc4a6b6985` |
| maquette p8-5g | `62d9557ac8fedcfbdd8b157a2588cbee` |
| `dr/dr-recit.js` (arrivée) | `522927fe0814d84cc15b249014f6c131` (110802 o) |
| `assemble/index.html` joué en dernier | `f795aab05a787d0ee4035e37d584c8ae` |

## 3 · Ce qui est pris de la maquette, ce qui tombe
- **Repris** dans `dr-recit.js` : l. 382-442 (le moteur du récit), 888-891 et 916-917 (`docHtml`, `videoHtml`, `loupeSur`, déplacés du rendu), 1435-1448 (le panneau des documents, la vidéo), 1644-1803 (la relecture). **Pas pris** : 444-623 (simulations, socle, schémas — audit F1) et 1640-1643 (`voir`, raccourcis de l'atelier — audit F10) : au socle (E1).
- **Tombé dans mon territoire** : toute lecture de `DATA` (classe, chapitre, activités, taxonomie, prochaines heures, documents : 18 lectures), `HEURES_SIM` (12), `ELEVES` en dur, `[1, 2]` (les heures simulées), le document simulé de `docHtml` (pages « en dur ») — chacun remplacé par une lecture du hub, la table en tête du module. La vue `papier` du site et `AT_DR_DERNIER` sont tombés avec le pont (E1).
- **Fonctions** : 113 noms dans le module — 28 repris tels quels, 25 repris et changés (chaque changement porte un commentaire `(E4 …) lisait …`), 60 nouveaux. Tailles (`toString().length`, maquette → site) :

| nom | avant | après | |
|---|---|---|---|
| `adverbeEtape` | 141 | 263 | repris, changé |
| `alerteVideo` | 1885 | 1894 | repris, changé |
| `basculerRecit` | 498 | 501 | repris, changé |
| `brancherChapitre` | 391 | 658 | repris, changé |
| `brancherPapier` | — | 398 | nouveau (E4) |
| `brancherSelecteur` | — | 204 | nouveau (E4) |
| `chapitreHtml` | 7285 | 7338 | repris, changé |
| `connecteur` | 98 | 98 | repris tel quel |
| `docHtml` | 571 | 836 | repris, changé |
| `dr_docEtat` | — | 230 | nouveau (E4) |
| `dr_docHtmlRef` | — | 1175 | nouveau (E4) |
| `dr_docsPanneau` | — | 1683 | nouveau (E4) |
| `dr_documents` | — | 276 | nouveau (E4) |
| `dr_papierFiches` | — | 1341 | nouveau (E4) |
| `dr_papierPreparer` | — | 581 | nouveau (E4) |
| `dr_papierRelire` | — | 489 | nouveau (E4) |
| `dr_papierRetirer` | — | 101 | nouveau (E4) |
| `dr_recitA` | — | 124 | nouveau (E4) |
| `dr_recitAHeure` | — | 382 | nouveau (E4) |
| `dr_recitActivites` | — | 319 | nouveau (E4) |
| `dr_recitAuTableau` | — | 115 | nouveau (E4) |
| `dr_recitAuto` | — | 629 | nouveau (E4) |
| `dr_recitBloc` | — | 165 | nouveau (E4) |
| `dr_recitChamps` | — | 135 | nouveau (E4) |
| `dr_recitChampsEtat` | — | 406 | nouveau (E4) |
| `dr_recitChapitre` | — | 325 | nouveau (E4) |
| `dr_recitCharger` | — | 558 | nouveau (E4) |
| `dr_recitChargerClasse` | — | 1310 | nouveau (E4) |
| `dr_recitChemin` | — | 267 | nouveau (E4) |
| `dr_recitCitations` | — | 828 | nouveau (E4) |
| `dr_recitClasseNom` | — | 490 | nouveau (E4) |
| `dr_recitClasseParDefaut` | — | 241 | nouveau (E4) |
| `dr_recitClassesJouees` | — | 664 | nouveau (E4) |
| `dr_recitContenuED` | — | 155 | nouveau (E4) |
| `dr_recitCopierED` | — | 950 | nouveau (E4) |
| `dr_recitDecalage` | — | 426 | nouveau (E4) |
| `dr_recitDocuments` | — | 916 | nouveau (E4) |
| `dr_recitEcranVu` | — | 414 | nouveau (E4) |
| `dr_recitEnCours` | — | 126 | nouveau (E4) |
| `dr_recitEtatDe` | — | 349 | nouveau (E4) |
| `dr_recitHeure` | — | 1452 | nouveau (E4) |
| `dr_recitHeuresTouchees` | — | 174 | nouveau (E4) |
| `dr_recitHm` | — | 172 | nouveau (E4) |
| `dr_recitHtmlPropre` | — | 934 | nouveau (E4) |
| `dr_recitJourDe` | — | 348 | nouveau (E4) |
| `dr_recitLienED` | — | 276 | nouveau (E4) |
| `dr_recitOuvrirItem` | — | 362 | nouveau (E4) |
| `dr_recitPoser` | — | 574 | nouveau (E4) |
| `dr_recitProchaines` | — | 372 | nouveau (E4) |
| `dr_recitRappel` | — | 258 | nouveau (E4) |
| `dr_recitSeanceN` | — | 356 | nouveau (E4) |
| `dr_recitSeanceTitre` | — | 132 | nouveau (E4) |
| `dr_recitSelecteurHtml` | — | 720 | nouveau (E4) |
| `dr_recitSim` | — | 110 | nouveau (E4) |
| `dr_recitSnum` | — | 288 | nouveau (E4) |
| `dr_recitTaxo` | — | 251 | nouveau (E4) |
| `dr_recitTexteDe` | — | 290 | nouveau (E4) |
| `dr_recitUrlDe` | — | 508 | nouveau (E4) |
| `dr_relectureVisible` | — | 158 | nouveau (E4) |
| `dr_rx` | — | 202 | nouveau (E4) |
| `eleveDitJe` | 611 | 663 | repris, changé |
| `empreinte` | 100 | 100 | repris tel quel |
| `gardeCopie` | 473 | 746 | repris, changé |
| `heuresJouees` | 99 | 479 | repris, changé |
| `imparfait` | 118 | 118 | repris tel quel |
| `jeInterieur` | 649 | 649 | repris tel quel |
| `loupeSur` | 403 | 403 | repris tel quel |
| `narrativiser` | 613 | 613 | repris tel quel |
| `nettoyer` | 212 | 212 | repris tel quel |
| `ouvrirDocs` | 804 | 938 | repris, changé |
| `pagePrecedente` | 337 | 340 | repris, changé |
| `papierHtml` | — | 1996 | nouveau (E4) |
| `participeDe` | 215 | 215 | repris tel quel |
| `passeHtml` | 5629 | 6333 | repris, changé |
| `personne` | 108 | 108 | repris tel quel |
| `poserVersion` | 270 | 270 | repris tel quel |
| `recit` | 1229 | 1229 | repris tel quel |
| `recitEtape` | 291 | 767 | repris, changé |
| `recitHtml` | 603 | 1099 | repris, changé |
| `recitHtml0` | 16214 | 21800 | repris, changé |
| `recitPourED` | 472 | 472 | repris tel quel |
| `recitPourED0` | 369 | 369 | repris tel quel |
| `recitSeanceHtml` | 4387 | 4578 | repris, changé |
| `relecture` | 2473 | 4298 | repris, changé |
| `reprendreSuite` | 306 | 309 | repris, changé |
| `repsJ` | 196 | 196 | repris tel quel |
| `suiteDepuis` | 613 | 722 | repris, changé |
| `suiteHtml` | 274 | 274 | repris tel quel |
| `tempsActiviteH` | 421 | 421 | repris tel quel |
| `tempsDe` | 156 | 159 | repris, changé |
| `troisTemps` | 3786 | 4246 | repris, changé |
| `versionsDe` | 154 | 154 | repris tel quel |
| `videoAtteignable` | 130 | 130 | repris tel quel |
| `videoHtml` | 603 | 612 | repris, changé |
| `videoPrecedent` | 244 | 247 | repris, changé |
| `videoSuivant` | 377 | 380 | repris, changé |
| `vuJ` | 229 | 229 | repris tel quel |
| `ADVERBES_ETAPES` | 84 | 84 | repris tel quel |
| `AVEC_ETRE` | 2 | 2 | repris tel quel |
| `CONNECTEURS` | 259 | 259 | repris tel quel |
| `DR_MOTIFS_RAPPEL` | — | 237 | nouveau (E4) |
| `DR_RECIT_CLASSE` | — | — | nouveau (E4) |
| `DR_RECIT_DOCS` | — | 2 | nouveau (E4) |
| `DR_RECIT_ECRIT` | — | 2 | nouveau (E4) |
| `DR_RECIT_HEURES` | — | 2 | nouveau (E4) |
| `DR_RECIT_JOURS` | — | 67 | nouveau (E4) |
| `IMPARFAIT_JE` | 514 | 514 | repris tel quel |
| `IRREGULIERS` | 963 | 963 | repris tel quel |
| `PERSONNE` | 144 | 159 | repris, changé |
| `PRESENT_IMPARFAIT` | 401 | 401 | repris tel quel |
| `TEMPS` | 81 | 81 | repris tel quel |
| `VERBES` | 579 | 579 | repris tel quel |
| `barreRecit` | 600 | 600 | repris tel quel |

## 4 · Les bancs et leurs sorties
- **`E4/bancs/banc.mjs`** (banc unique, échoue si un seul échoue), trois entrées : le site intégré (`MJPC_ENTREE=site`, `assemble/index.html`, faux hub) ; la maquette + socle simulé (`MJPC_ENTREE=simule`) ; la maquette seule. Épreuves : R1 le récit (diapo, heure, prénom, réponse, parole hors question, zéro erreur JS) · R2 ma version et `C/recit/1` au hub, K15 (E4 n'écrit que `C/recit/<h>`) · P1 le Papier, l'entête, le travail, le pied, `@media print` · ED la copie HTML propre, le texte, le presse-papier, le lien (avec et sans `ed`) · R3 le rechargement · R4 le rappel d'une fiche, le bilan, « ce qu'on colle » · D1 le document Drive en `/preview` et sa provenance · 13·8 la copie de la classe dans le récit · P0 rien avant un lancement · T la langue (accents, « un élève », « devant nous », étapes, ma version et sa garde).
- **Dernières sorties** : site **38 ok · 0 échec · 1 absent** (R3 recomposé : dépend du `C/journal` d'E2) ; sans `ed` : 38 ok ; socle simulé 35 ok ; maquette 29 ok · 3 absents. Toutes dans `E4/sorties/` (horodatées, md5 du fichier joué en tête).
- **`banc.sh` de la conscience** : P10 (Relecture) et P11 (Papier) **verts** ; ses rouges sont hors de mon territoire (P8 tableau avant E3, P5 en mode test, P12 E2, les K arrêtés par le voile `#fi-overlay` — audit E1 F15).
- **Captures** : `E4/captures/E4-*.png` (le récit, le papier, l'impression, la fiche à coller, le document, après rechargement), écran entier 1366 × 768, du site intégré.

## 5 · Les relecteurs neufs
Quatre : deux en passe préalable sur la maquette (`E4/relecteurs/R1-pre-E1a.md`, `R2-pre-E1a.md`), deux en passe obligatoire sur `assemble/index.html` (`R3-R4-site.md`). 13 + 15 + 2 × ~15 trouvailles ; celles de mon territoire corrigées, avec une garde au banc quand elle se mesure ; celles des autres territoires écrites pour leurs propriétaires dans `JOURNAL.md`.

## 6 · L'audit du mandat
`E4/AUDIT-DU-MANDAT.md` (F1-F10, C1-C7, M1-M8, I1-I4) ; ce que j'ai fait sur les points contestés, en attendant la conscience : F2 `C/recit/<h>` porte `{version, texte, moiT, versions, k, relu, aChange, copieED}` ; F7 la Relecture montre les notes au fil (comme la maquette), pas les notes du professeur ; F8 le lien ED est dans la copie du travail ; C1 `ouvrirDocs` est chez moi ; C3 le papier a « ce qu'on colle » ; C4 un sélecteur de classe ; C5 les heures passées par `dr_heureJouee` d'E2.

## 7 · Ce qui reste (jamais une dette cachée)
- **Dépend d'E2** : le récit d'une heure close ou rechargée se recompose depuis `C/journal`, que E2 n'écrit qu'au lancement (mesuré deux fois) ; « Clore l'heure » plante (`edt is not defined`) : le papier après une vraie clôture n'est pas encore éprouvé de bout en bout.
- **Dépend d'E1** : les activités sans numéro sur la trame réelle (« Activité n — », cadrage 2 · 1.1 bis) ; ▶ qui dévoile derrière un document projeté (le récit raconte alors un élément non vu).
- **Dans mon territoire** : la transposition de l'ancien moteur reste fragile sur certaines étapes nominales (« on a vu qu'une période…, c'était je la reporte… ») ; après des sauts de diapo, `troisTemps` peut sortir de l'ordre du temps ; les pages d'un document Drive ne se tournent pas aux flèches (iframe d'une autre origine — audit I2) ; la vidéo reste celle de la maquette (point 18 du POINT, hors mandat) ; le papier « Le chapitre entier » du cadrage n°7 n'est pas fait (contradiction C3, à Paul).
- `C/recit/<h>` est indexé par le numéro d'heure : une séance rejouée par la même classe réécrit le même récit (audit I4).

## 8 · La deuxième mission (relance E4-2, 12:50) — état au 12:06 UTC
- **Le recyclage** (`dr/dr-recyclage.js`, chargé après `dr-recit.js` ; quatre crochets d'une ligne marqués `/* E4 */` dans `dr-socle.js` : `elements` et le rendu de l'image (R1), le rendu de la fiche (R2), `etatDiapo` (R5) ; aucune ligne changée dans `dr-atelier.js`) :
  - **R1 les marques sur une image** — fait : point · étiquette · flèche · cadre · légende ; Document analysé / Illustration ; une à une / toutes ensemble (une marque = un élément, comme une étape) ; poser, éditer en place, ✕ / Suppr ; calibrées à la largeur de l'image (pilote, tableau, vignettes) ; au hub ; dans le récit (« où on a repéré « … » »).
  - **En une ligne (réveil n°6, 17:10)** : R1 **fait** (RC1, B3 : poser, écrire, tracer un cadre, menu d'une marque, ↶ marque par marque) · R2 **fait** (RC2) · R4 **fait** (RC4, ↶ pas à pas) · R5 **fait** (RC5, clic droit et Suppr de la sélection) · R6 **fait** (RC6, sur R13 d'E1) — **rien en cours, rien qui reste** de la relance E4-2 A ; ce qui reste est dans RELECTURE-CONTINUE (lignes « à moi »).
  - **R4 ↶ Annuler (Ctrl+Z) dans l'Atelier** — fait : `dr_sauve` enveloppée (40 états), le bouton dans la barre, Ctrl+Z hors d'un champ ; dans un champ, celui du navigateur.
  - **R2 le rappel d'une fiche** — fait : la question à la pose d'une fiche déjà dans le chapitre, quatre motifs ou un texte libre, « ↻ Rappel — … » sur la fiche (classe et tableau), le récit et le papier. Écart : sans feuille ni référence (les fiches du site, F17), la même fiche se reconnaît par son titre.
  - **R5 la sélection multiple** — fait : Ctrl+clic, « Supprimer les N éléments », « ✍🏻 Marquer « à écrire » » (dans la trame par identité, devient le ✍🏻 de la classe), Échap. Écart : pas de lasso, pas de copier/couper de plusieurs blocs.
  - **R6 Ctrl+B / Ctrl+U** — **fait à 13:10**. Il était bloqué tant qu'E1 n'avait pas livré R13 ; c'est fait (`dr_grasSoul`, e.forme). Le raccourci, sur une sélection dans la diapo, appelle ce geste ; hors d'une sélection, il n'intercepte rien. Les infobulles de G et S disent déjà « Ctrl+B ». Garde : **RC6**.
- **Bancs** : `E4/bancs/banc.mjs`, épreuves RC1, RC2, RC4, RC5 — dernière sortie site **74 ok · 0 échec**.
- **La relecture continue** : `E4/RELECTURE-CONTINUE.md` (33 défauts relevés dans les territoires d'E1, E2, E3 par quatre passages de relecteurs neufs sur tout le parcours, chacun daté, avec le commit joué, la source et la capture ; deux à moi, réglés).

## 9. Bilan de la Relecture (réveil n°8, 21:20) — les dix lignes de ma synthèse (p2 : 3, 4, 19 à 25, 28)
- **Réglées : 6.**
  - L13, ma version n'écrit que `C/recit` ;
  - L111, la copie relue après la clôture ;
  - L112, rechargée sans reprise : les rangs, « Diapo par diapo » et la participation au rang ;
  - L118, « Le chapitre », sauf l'échéance ;
  - L125, le bilan après le travail ;
  - L117, le gras sur la 2ᵉ occurrence, réglé par E1 et vérifié à 19:35.
- **À E2 : 5.**
  - L108, « ce qui reste (n à décider) », poussé par E2 et à revérifier ;
  - L116, le rang d'une diapo hors de l'heure ;
  - L134, « à faire : activité 6 · » sans titre ;
  - L118, l'échéance après un rechargement ;
  - L12, les rôles des diapos de l'heure non relus : le rituel numéroté après rechargement.
- **À Paul : 2.**
  - L125, l'aparté « bilan non attesté », s'il le veut ailleurs qu'à l'écran ;
  - l'heure de fin du récit, 09 h 52 contre 09 h 44 (lignes 12:33 et 140).
- **À moi : 0** ligne ouverte. Ligne 139, « Les hypothèses » après la clôture : réglée, revérifiée sur `42be2a0a`.



## 10. La passe finale (réveil n°11, 23:15) — le bilan en chiffres
- **156 lignes** dans `RELECTURE-CONTINUE.md`, chacune avec « ÉTAT : … (commit) » en tête de cellule pour celles revérifiées en passe finale :
  - **133 réglées** ;
  - **8 écartées** (pas un défaut, tranché, ou par conception) ;
  - **3 à Paul**, une seule question vue trois fois (lignes 50, 140, 163) : le récit dit la fin du créneau (09 h 52), l'en-tête l'heure close (09 h 44 ou 09 h 47) ;
  - **12 pas réglées**, toutes chez les autres territoires ({'E2': 8, 'E1': 4}) ;
  - **0 ouverte**.
- **Chez E4 : 41 lignes portent E4.** 37 sont réglées, 3 écartées (L89, L91 et L125, dont l'aparté « bilan non attesté », par conception) et 1 à Paul (L50). **Aucune n'est pas réglée, aucune n'est ouverte.**
- **Les pas réglées, sur `250193a1`** (passe finale) ou sur le dernier commit revérifié :
  - L32 [E2 (E1)] — lancer la séance 0 depuis le Pilotage (`250193a1`)
  - L66 [E1] — boîte « Supprimer la diapo », panneaux « + bloc », « Envoyer vers… » (`250193a1`)
  - L107 [E2] — après « Clore l'heure » (`250193a1`)
  - L109 [E2] — EDT après la clôture (`250193a1`)
  - L150 [E2 (E1)] — clore une heure avec des retouches faites par l'onglet Atelier (`250193a1`)
  - L155 [E2] — arriver à la fin de l'heure sans toucher à l'échéance (`250193a1`)
  - L156 [E1 (E2)] — ◀ depuis la diapo 7 de l'heure (`250193a1`)
  - L157 [E2] — « Préparer le cahier de textes » (`250193a1`)
  - L158 [E2] — étape 7 (`250193a1`)
  - L160 [E1 (E2)] — Atelier hors classe (`250193a1`)
  - L161 [E1 (E2)] — Atelier le mercredi 16/09 après la clôture du lundi (`250193a1`)
  - L162 [E2 (E1)] — « Préparer le cahier de textes » à T-5 (`250193a1`)
- Les deux graves qui bloquaient l'audit, L148 et L149, sont **réglées** sur `de6cd19c`.
- **Mis à jour à 23:30**, sur `f42ea048` (la poussée 25 d'E2) : L155 et L157 sont réglées. Le compte devient **135 réglées, 10 pas réglées (E2 6, E1 4), 8 écartées, 3 à Paul, 0 ouverte**.
- **Réveil n°12 (02:05)** : l'audit final s'appuie sur ce bilan. Il reste **10 pas réglées**, à revérifier une à une sur les poussées d'E1 (L66, L156, L160, L161, et sa part de L150) et d'E2 (L32, L107, L109, L150, L158, L162). Cette ligne deviendra « 0 pas réglée (commit) » quand les dix seront réglées. L32 : « heure n » juste ; les deux copies viennent de la donnée héritée du faux hub, le site suit §12.13 ; migrer ou non est à trancher.
- **02:45, revérifié sur `7fd900ea`** (la poussée 18 d'E1), les dix, aux deux tailles :
  - **5 réglées** : L32, L66, L150, L156, L158 ;
  - **5 pas réglées** : L107 et L109 (E2), L160 et L161 (E1/E2), L162 (E2/E1) ;
  - 3 lignes faibles nouvelles et une 4ᵉ à Paul, la même question.
- **Compte : 160 lignes, dont 140 réglées, 8 pas réglées, 8 écartées, 4 à Paul (une seule question), 0 ouverte.** Pas encore « 0 pas réglée » : il en reste 8, dont 3 faibles nouvelles.
- **03:15, revérifié sur `afd475d6`** (la poussée 26 d'E2), aux deux tailles :
  - **réglées** : L107 et L109 ;
  - **pas réglées** : L160, L161, L162, L164, L165, L167 ;
  - **nouvelles** : une à moi, le numéro d'activité qui changeait au rechargement, **réglée** à 00:19 ; une 5ᵉ à Paul (la même question) ; deux faibles chez E2 et E1.
- **Compte : 164 lignes, dont 143 réglées, 8 pas réglées (E1 et E2), 8 écartées, 5 à Paul (une seule question), 0 ouverte.** Chez E4 : aucune pas réglée.

- **00:40, L162 réglée** sur `4699143e` (poussée 27 d'E2), rejouée par moi aux deux tailles : le cahier de textes s'affiche en préparation. **Compte : 164 lignes, dont 144 réglées, 7 pas réglées, 8 écartées, 5 à Paul, 0 ouverte.**
- **01:05, sur `4130482a`** (poussée 19 d'E1) : **L160 et L171 réglées**. Pas réglées : L161, L164, L165, L167, L170. Quatre nouvelles : trois chez E1/E2 (les dates de l'Atelier le lundi, le nombre d'heures dans « Envoyer vers… », l'EDT du mercredi), une à Paul (deux bilans dans sa trame de la séance 1). **Compte : 168 lignes, dont 146 réglées, 8 pas réglées, 8 écartées, 6 à Paul, 0 ouverte.**
- **La convergence, demandée au réveil n°13.** Voici les lignes nouvelles par passe de relecteur, depuis 18:50 UTC :

| Passe (UTC) | Commit | Nouvelles |
|---|---|---|
| 18:50 | `43c1d2f0` | 4 |
| 19:35 | `42be2a0a` | 2 |
| 20:10 | `613ade62` | 4 |
| 20:50 | `aaf6d7f4` | 7, dont les **2 graves** (148, 149) |
| 22:00 | `b10fe923` | 5, dont N1 (le même défaut que 148) |
| 22:45 | `de6cd19c` | 3 |
| 23:10 | `250193a1` | 2 |
| ≈ 23:45 | `7fd900ea` | 4 |
| ≈ 00:10 | `afd475d6` | 4 |
| 01:00 | `4130482a` | 4 |

  - Cela fait **39 lignes nouvelles en 6 h 10, soit ≈ 6,3 par heure**. Sur les trois dernières heures (22:00 → 01:00), 22 lignes : ≈ 7 par heure.
  - **Aucune grave depuis 20:50.** Depuis 22:45, les nouvelles sont faibles ou moyennes. La moitié tient à deux familles qui se recoupent : les dates et les créneaux des heures (L161, L167, L170, L172, L175), que le §12.18 tranche, et les gestes des panneaux de l'Atelier.
  - La pente des réglées est plus forte que celle des nouvelles : 146 réglées à 01:00, contre 105 à 21:25.
  - Les heures « 02:40 » et « 03:10 » de la table sont des erreurs de date de ma part. Les passes ont eu lieu vers 23:45 et 00:10 UTC, sur les commits indiqués.

- **01:45, sur `fa6ff3d4`** (poussée 28 d'E2) : **L165, L167, L170 réglées**. Pas réglées : L161, L164, L172, L173, L175. **2 lignes nouvelles** (l'infobulle de « Lancer », trois suites contradictoires le mercredi) ; le 3ᵉ point du relecteur est déjà L32. Convergence : **2 nouvelles en 40 min** (contre 4 aux trois passes d'avant). **Compte : 170 lignes, dont 149 réglées, 7 pas réglées, 8 écartées, 6 à Paul, 0 ouverte.**
- **02:20, sur `913a9a75`** (réveil n°14) : **L175 écartée** — la case du mercredi 16 à 10:07 dit « aucune séance prête · fil « langue » », la lecture de la conscience (fil langue sans chapitre publié) ; le 3/3 au mardi passé reste suivi en L177. Pas de poussée d'E1 ni d'E2 depuis `fa6ff3d4` : **0 ligne nouvelle**. **Compte : 170 lignes, dont 149 réglées, 6 pas réglées (E1 : 161, 164, 172, 173, 177 ; E2 : 176), 9 écartées, 6 à Paul, 0 ouverte.** Chez E4, aucune pas réglée.
- **02:50, sur `d32cde68`** (poussées 29 d'E2 ; E3 `3beda214` ne touche que sa relance) : **L176 réglée** (l'infobulle de « Lancer » dit « la case de ton emploi du temps » le lundi 09:00 et le mardi 15:00). **L175 écartée, relue sur une copie fraîche** : la lecture de 02:20 tournait sur une copie périmée de la page assemblée dans l'espace des relecteurs ; même résultat. Pas réglées : L172 (le lundi, « Lancer » heure 2/3, l'Atelier « H1 · mardi 15 »), L177 (le mercredi, Pilotage et Atelier au 16 à 10 h 07, l'EDT « fil langue »), L161, L164, L173 — toutes chez E1. **0 ligne nouvelle.** **Compte : 170 lignes, dont 150 réglées, 5 pas réglées (toutes E1), 9 écartées, 6 à Paul, 0 ouverte.**
- **03:15, sur `586b5779`** (E1 `46710b3e` et `d184420f`, §12.18 par `dr_heuresDeLaClasse`) : **L161, L164, L172, L173 réglées.** L'Atelier date chaque heure : la jouée à sa date jouée, les autres à leur case. « + bloc » et « Envoyer vers… » cerclent le choix d'Entrée, qui suit le survol. Chaque séance porte son nombre d'heures. **Reste L177** (E1 / E2) : le mercredi, « Lancer » vise le 16 à 10 h 07, une case que l'EDT dit « fil langue » ; l'EDT garde « heure 3/3 » au mardi passé et met L'Albatros au vendredi, que l'Atelier donne à H3. **0 ligne nouvelle** à mes revérifications ; un relecteur neuf est lancé sur le §12.18. **Compte : 170 lignes, dont 154 réglées, 1 pas réglée (L177), 9 écartées, 6 à Paul, 0 ouverte.**
- **03:30, réveil n°15** (« E1 a poussé les cinq dernières », `88301b93`) : revérifiées par le geste exact, aux deux tailles. **161, 164, 172, 173 réglées. 177 pas réglée** sur `88301b93`, le mercredi, hub frais comme après clôture : l'EDT met L'Albatros 1/3 au vendredi 18, l'Atelier y met la Poésie (H2 ou H3), « Lancer » vise le mercredi 10 h 07 « fil langue ». **Donc pas encore « 0 pas réglée »** : il reste L177, dont les trois sources sont chez E2. **Le relecteur neuf sur le §12.18 trouve 4 lignes nouvelles** (L178-L181, captures revues) : l'Atelier ne marque pas « jouée » l'heure close avant rechargement ; une heure du lundi manquée décale le n de l'EDT d'un cran par rapport à « Lancer » et à l'Atelier ; sur la séance L'Albatros, « Lancer » nomme une case qui n'est pas la sienne et nie la case en cours ; l'Atelier de L'Albatros saute la case « heure 1/3 » du vendredi. **Convergence : 4 neuves en 1 h 45 depuis 01:45 (≈ 2,3 par heure, contre ≈ 6 sur la soirée) ; aucune grave ; toutes dans la famille §12.18.** **Compte : 174 lignes, dont 154 réglées, 5 pas réglées (L177-L181), 9 écartées, 6 à Paul, 0 ouverte.**
