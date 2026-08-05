# SITE-COURS-3a — RAPPORT DE LIVRAISON
**L'atelier en trois éditeurs étanches : tableaux de bord, réouverture, liaison guidée.**
Exécutant SITE-COURS-3a (série n°5 — les codes 2x ont servi deux fois, note au registre), sous conscience n°5 · 05/08/2026. Commentaires code : **[C5-3a]**.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.30.0) | 775 489 o | `cde79195ffc264b15bbc6621a780c5ce` |
| LIVRÉ (8.31.0) | 802 232 o | `8533d8f913f79d0ad70775d6a2f530e4` |

Double parseur (acorn + node --check) : **VERT** sur base et livré. 17 éditions rejouées depuis la base à chaque correctif.

## 2 · Les trois éditeurs étanches (Q1 appliquée)

Accueil : **trois portes franches** — « ✨ Nouvelle feuille » · « 📚 Nouveau chapitre » · « 🖼️ Nouveau diaporama à convertir » — et **trois onglets** « Mes feuilles · Mes chapitres · Mes diaporamas » (patron cartes). Les boutons chapitre et diaporama **sortent de l'écran IA de la feuille** (Q1) ; l'étape 2 (collage) y reste intacte, prouvée au banc. Les retours des flux chapitre et diaporama deviennent « ← Atelier » → l'accueil (`atRendreListe`), plus jamais l'écran IA d'une feuille. Registre `AT.flux` posé par les entrées.

## 3 · ② Mes chapitres — l'éditeur EN PLACE

Cartes du niveau (sélecteur 3e/4e/5e/6e, défaut = niveau de la page) : titre, n° d'ordre, N séances · M items, publié/non, et le **compteur « N liaisons restantes » / « Tout est lié. »** (items sans `ref`). Gestes : **Modifier** (éditeur en place), **Voir dans le panneau prof** (passerelle : atelier fermé, chapitre déplié — clé plate `UI_OPEN[level+'::'+num]` mesurée), **Supprimer** (patron 2 boutons, §6). Passerelle inverse : bouton ✏️ « Modifier dans l'atelier » sur chaque chapitre du panneau admin.

**EXIGENCE A — les chemins Firebase écrits par l'éditeur, liste EXHAUSTIVE.** Un chemin par champ, via `secuEcrire`, jamais un nœud entier, `published` jamais :
- `/site/<niv>/chapitres/<i>/title` · `/entree` · `/competencesMajeures` · `/competencesMineures`
- `/site/<niv>/chapitres/<i>/seances/<j>/title` · `/seances/<j>/type` · `/seances/<j>/noteEleve`
- `/site/<niv>/chapitres/<i>/seances/<j>/items/<k>/title` · `/items/<k>/subtitle` · `/items/<k>/kind` · `/items/<k>/ordre`

`<i>`, `<j>`, `<k>` sont les clés RÉELLES (le helper `atSeances` garantit `<j>` même quand Firebase livre `seances` en objet — §7.1). Q2 : le contenu des séances-sommaire ne s'édite pas là ; l'écran le dit (« le contenu se régénère ») et la **proposition de sommaire** (jamais automatique) s'offre à la sortie d'une édition et après une injection réussie (`atProposerSommaire`/`atRegenererSommaire`, écriture sommaire au rang réel).

## 4 · ③ Mes diaporamas — liste + statut + liaison

Cartes de `/site/diaporamas` (une lecture, cache `AT_DIAPOS`) : titre, N diapositives, date, **statut** calculé en croisant les chapitres du niveau sélectionné (item `kind==='diaporama' && ref===id`) : « Lié dans <chapitre › séance> » / « Pas encore lié — invisible des élèves » / « liaison non vérifiable pour l'instant » (chapitres pas encore là). **Ouvrir** = `openDiaporamaById` réutilisé (rendu élève). **Lier** = modale deux menus (chapitre → séance) → **`itemCreer`**, l'écrivain unique de 2c — **EXIGENCE D prouvée au journal : l'item naît `{kind:'diaporama', source:'firebase_app', ref:<id>, published:false}`**. Le statut passe à « Lié dans … › … » aussitôt. NB : le diaporama n'a pas de champ `niveau` en base (payload mesuré : titre/diapos/maj) — le mandat le supposait ; le statut se rapporte donc au niveau sélectionné en tête d'onglet (écart déclaré).

## 5 · La liaison guidée

- **Pulse des LIER** : dans le panneau admin, tout item sans `ref` fait respirer son bouton 🔗 (`at-lier-pulse`, keyframe `atLierPulse` 1,8 s infinie douce — cousine d'`edPulse`, qui vit dans l'aperçu seulement : écart déclaré §7.4) ; éteint dès la liaison (prouvé : le diaporama lié ne pulse pas).
- **LIER pré-orienté** : l'info d'outil vit dans `item.kind` (mesuré) ; quand un bloc de la modale lui correspond (`#link-modal-<kind>`), la modale **défile et halo** ce bloc (`atHalo` de 2d). Sans kind exploitable : comportement inchangé.
- **GARDE D'ATTERRISSAGE (exigence C — LA preuve)** : le calcul des écritures de la voie « compléter » est extrait en `chCalculerEcritures(voie, chaps)` → `{ecritures, appariees:[{titre,ajouts}], ajoutees, position}` ; `chInjecterConfirme` l'appelle (une seule mesure, recalculée à la vérité du moment T). `chInjecter` lit les chapitres réels AVANT d'ouvrir sa modale et MONTRE : compléter → « Séances APPARIÉES par titre (complétées en place) : … · Séances AJOUTÉES : … » ; remplacer → titre + « N séances et M items partent à la corbeille d'abord » ; garder à côté → « Ajouté en position N ». **Jouée au banc sur le cas réel du chapitre 1 (titres homonymes)** : capture `p4b_garde_atterrissage.png` — l'appariement de « Tâche finale » (1 ajout) et l'ajout de la séance nouvelle, AVANT le clic — puis l'écrit vérifié conforme au montré (`seances/8/items/…` dans l'appariée ; `seances/9` et `10` ajoutées ; `published` nulle part).

## 6 · Gestes destructeurs (exigence B)

`atSupprimerChapitre` (les cartes ② ET `deleteChapter` du panneau, qui lui délègue — un seul geste partagé) et `atSupprimerDiapo` : modale à compte de contenu, **deux boutons** (« Mettre à la corbeille puis supprimer » / « Supprimer sans garder de copie »), gardes « prévenu, pas bloqué » (chapitre publié : « les élèves les perdront » ; diaporama lié : « l'item du cours affichera "document plus disponible" »). **EXIGENCE B prouvée** : corbeille écrite AVANT le delete (payload `_meta{motif:'site-chapitre'|'site-diaporama',chemin,app,ts}/data`) ; **échec d'archivage simulé → 0 DELETE au journal**, « rien n'a été supprimé, le chapitre est intact ». L'item mort après suppression d'un diaporama lié affiche le message doux existant. Aucune suppression automatique.

## 7 · Écarts au plan et observations (déclarés)

1. **`atSeances` / `atSeancesRangSuivant`** : Firebase livre `seances` en objet quand l'index 0 manque — la réalité du chapitre 1 réel. Tout le morceau lit par ce helper (paires `{j:clé réelle, se}`) ; **le cœur extrait `chCalculerEcritures` et le bloc sommaire préexistant de `chInjecterConfirme` sont alignés aussi** (E7b) : sans cela, la garde ET l'écrivain plantaient sur le chapitre 1 — la réparation était la condition de l'exigence C. L'idiome est celui du site (`Object.keys(ch.seances)`, l. 2974/9200).
2. **E4b** : `atRendreListe` respecte l'éditeur de chapitre en cours (le rendu asynchrone d'`atelierOuvrir` écrasait la passerelle « Modifier dans l'atelier »).
3. **Anti-boucle hub muet** : `atChapitresAssurer` ne recharge plus en boucle sur état `erreur` (le banc a révélé une tempête de requêtes) ; un bouton « Réessayer » (`atChapitresRecharger`) réarme explicitement. Prouvé : **0 relance en 3 s** sous hub muet.
4. La keyframe `edPulse` de 2d vit dans l'aperçu (srcdoc), pas dans la page : le pulse des LIER emploie `atLierPulse` (même famille dorée, respiration infinie douce au lieu du forwards — un bouton d'appel, pas un écho d'action).
5. Le mandat prêtait un champ `aLier` au JSON et un `niveau` au diaporama : mesuré, l'info d'outil vit dans `item.kind` (utilisée telle quelle) et le diaporama n'a pas de niveau (statut rapporté au niveau sélectionné).
6. **Amenées de banc (déclarées)** : `SECU.valide=true` (la clé M-SÉCU n'est pas l'objet du morceau ; les portes passent par `chOuvrir`/`diapoOuvrir` réels derrière elle) · vue admin posée par evaluate après stabilisation du boot (M8 relit la vue en asynchrone) · écran chapitre amené par `chRendre()`+`chAfficherInventaire()` (chOuvrir enchaîne trois chargements réseau) · l'onglet du parcours hub-muet actionné par `atOnglet()` (l'accueil se re-rend par à-coups sous hub muet ; l'objet testé — message + absence de tempête — est mesuré au journal).
7. **Banc en deux manches** (P1-P5 puis P6, navigateurs séparés) : le conteneur ne tient pas ~14 pages chromium d'affilée (TargetClosedError) ; aucune preuve n'en est affaiblie.
8. Tête de banc : `_poser` de la fusion convertit liste→dict sur clé non numérique (la réalité Firebase) — sans quoi les écritures fines de la manche cassaient les lectures d'ancêtres suivantes (défaut de banc, pas du livré).
9. **Observation** : la base (identité conforme) porte des marqueurs « SITE-COURS-2e » et « SITE-COURS-3a » antérieurs (produits n°3/n°4). Mes commentaires sont tous **[C5-3a]** ; aucun « SITE-COURS-3a » nu n'a été ajouté.
10. Environnement : des fichiers fantômes de commandes interrompues ont pollué `editer.py` deux fois (variante d'anti-boucle non demandée, textes sur-échappés) — remplacés en transaction unique, relecture des fonctions livrées faisant foi ; plus aucun `\\u` cassé au grep final.

## 8 · Fonctions — inventaire complet (0 supprimée)

BASE 706 → LIVRÉ 731. **696 intactes**. **25 ajoutées** : atSeances 322 · atSeancesRangSuivant 198 · atOnglet 50 · atTbNiveau 62 · atTbNiveauChange 60 · atTbSelecteur 282 · atChapitresAssurer ~310 · atChapitresRecharger ~110 · atChapitreLiaisons 196 · atRendreChapitres ~1 720 · atVoirPanneau ~400 · atEditerChapitre ~340 · atEditerChapitreRendre ~2 700 · atChampChapitre/atChampSeance/atChampItem (3 écrivains fins ~330 chacun) · atEditerChapitreSortie ~230 · atProposerSommaire ~480 · atRegenererSommaire ~640 · atSupprimerChapitre ~1 500 · AT_DIAPOS/atDiaposAssurer ~330 · diapoStatutLiaison 816 · atRendreDiapos 1 361 · diapoLierModal 2 168 · atSupprimerDiapo 1 623 · chCalculerEcritures 3 379. **10 modifiées** (relues entières) :

| fonction | avant | après | objet |
|---|---|---|---|
| chInjecterConfirme | 7 739 | 4 550 | **extraction chCalculerEcritures (décroissance attendue, déclarée)** + E7b sommaire-objet |
| deleteChapter | 485 | 240 | **délégation au geste partagé atSupprimerChapitre (décroissance motivée : un seul écrivain de suppression)** |
| atIARendre | 1 849 | 1 780 | **retrait Q1 des deux boutons (décroissance exigée)** |
| chInjecter | 1 182 | 2 480 | garde d'atterrissage (lecture réelle avant modale) |
| atRendreListe | 3 543 | 4 665+ | 3 portes, onglets, branches ②③, garde E4b |
| chRendre / diapoRendreEcran | 1 538/1 519 | +4 | retour « ← Atelier » |
| renderChapterCard | 2 438 | 2 669 | passerelle « Modifier dans l'atelier » |
| renderItem | 4 899 | 5 033 | pulse des LIER |
| openLinkModal | 1 630 | 2 255 | pré-orientation par kind |

CSS : onglets, cartes, at-btn-danger, atLierPulse, ch-atterrissage, éditeur (at-edch*). Pastille 8.31.0.

## 9 · Banc de preuve — **BILAN : 32/32 VERTS** (manche 1 : 28/28 · manche 2 : 4/4)

Playwright + Chromium, chemin réel au clic, hub intercepté, **aucune écriture réelle**, `published` jamais écrit (journal vérifié sur tout le banc).

```
VERT  · P1 · trois portes franches à l'accueil
VERT  · P1 · trois onglets de tableaux de bord
VERT  · P1 · la porte chapitre ouvre le flux chapitre
VERT  · P1 · ← Atelier (flux chapitre) revient à l'accueil, pas à l'IA d'une feuille
VERT  · P1 · la porte diaporama ouvre le flux diaporama
VERT  · P1 · ← Atelier (flux diaporama) revient à l'accueil
VERT  · P1 · l'écran IA de la feuille n'a PLUS les boutons chapitre/diaporama, l'étape 2 est intacte
VERT  · P2 · une carte par chapitre du niveau
VERT  · P2 · le compteur de liaisons est là (« N liaisons restantes » ou « Tout est lié. »)
VERT  · P2 · l'éditeur de chapitre s'ouvre en place
VERT  · P2 · exigence A : écritures par CHEMIN PRÉCIS (title, entree, seances/N/title), jamais un nœud entier, jamais published
VERT  · P2 · à la sortie : proposition de sommaire SEULEMENT s'il y a une séance sommaire (jamais automatique)
VERT  · P2 · « Voir dans le panneau prof » ferme l'atelier et déplie le chapitre
VERT  · P2 · « Modifier dans l'atelier » (panneau) ouvre l'éditeur du chapitre dans l'atelier
VERT  · P3 · la carte du diaporama et son statut « Pas encore lié
VERT  · P3 · « Ouvrir » montre le rendu que l'élève verra
VERT  · P3 · exigence D : l'item naît par itemCreer, kind diaporama, ref posée, published:false
VERT  · P3 · le statut passe à « Lié dans <chapitre › séance> »
VERT  · P4 · le bouton LIER d'un item non lié pulse
VERT  · P4 · la modale LIER s'ouvre PRÉ-ORIENTÉE sur la section de l'outil (halo sur le bloc dictée)
VERT  · P4 · l'item lié (le diaporama) ne pulse pas
VERT  · P4b · exigence C : la garde d'atterrissage montre l'APPARIEMENT PAR TITRE avant le clic
VERT  · P4b · l'écrit correspond au montré : l'item manquant entre DANS la séance appariée, la séance nouvelle s'AJOUTE
VERT  · P5 · garde « prévenu, pas bloqué » sur un chapitre publié
VERT  · P5 · exigence B : l'échec d'archivage ABANDONNE la suppression (aucun DELETE, message « rien n'a été supprimé »)
VERT  · P5 · garde sur un diaporama lié (« l'item du cours affichera « document plus disponible » »)
VERT  · P5 · sans copie : l'écriture null du diaporama, AUCUN passage corbeille
VERT  · P5 · l'item mort affiche le message doux
VERT  · P6 · hub muet : l'onglet chapitres le dit sans casser, AUCUNE tempête de recharges (garde anti-boucle)
VERT  · P6 · `published` : JAMAIS écrit sur tout le banc
VERT  · P6 · 390 : les trois portes et les onglets tiennent l'écran
VERT  · P6 · 390 : la garde d'atterrissage s'affiche (appariement montré)
=== manche 1 : 28/28 · manche 2 : 4/4 ===
```

## 10 · Captures (au sas, `captures/`)

`p1_accueil_portes_onglets` · `p1_ia_feuille_purge` · `p2_mes_chapitres` · `p2_editeur_chapitre` · `p3_mes_diaporamas` · `p4_pulse_lier` · `p4_lier_preoriente` · **`p4b_garde_atterrissage` (LA preuve — exigence C)** · `p5_garde_chapitre_publie` · `p6_accueil_390` · `p6_chapitres_390` · `p6_diaporamas_390` · `p6_garde_atterrissage_390`.

## 11 · Textes soumis à Paul

Portes : « Nouvelle feuille » / « Nouveau chapitre » / « Nouveau diaporama à convertir » (+ sous-titres) · onglets « Mes feuilles · Mes chapitres · Mes diaporamas » · « N liaisons restantes » / « Tout est lié. » · « Pas encore lié — invisible des élèves » / « Lié dans <chapitre › séance> » / « liaison non vérifiable pour l'instant » · éditeur : « Chaque champ s'enregistre dès que tu le quittes — directement dans le chapitre du site. La publication ne change pas ici. » · sommaire : « Le chapitre a changé — régénérer la feuille sommaire ? » [Régénérer] [Plus tard] · gardes de suppression (publié / lié, §6) · garde d'atterrissage (§5) · hub muet : « Les chapitres ne répondent pas pour l'instant. [Réessayer] » · liaison : « Lié — l'item est créé dans la séance, non publié : la publication reste ton geste. »

---
**STOP.** Livraison au sas complète : `SITE-COURS-3a/index.html` + `rapport.md` + 13 captures. J'attends l'audit de la conscience n°5 (captures livrées à Paul), puis le « promeus ».
*[exécutant SITE-COURS-3a]*
