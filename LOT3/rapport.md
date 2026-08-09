# LOT ③ — LE CONTENU DES FEUILLES DANS L'ATELIER PAPIER
**Exécutant · 09/08/2026 · pastille 8.43.0 · base : production 917 693 o (md5 8fa33ef53c953179df48a668212e8255, vérifiée = LOT ② promu) · livré : 928 969 o**

## CE QUE LE LOT APPORTE
Chaque feuille de l'atelier papier affiche **le document que l'élève lira** — en-tête adressé, objectif, notions, consignes, zones lignées, mention à conserver, pied daté — et chaque zone est **cliquable** : le clic va à la ligne de SON champ dans le panneau, curseur dedans. La frappe met à jour **la seule zone concernée**. Le compteur de feuilles devient **vrai** (hauteurs mesurées sur le rendu). Les documents non éditables gardent leur carte ; un diaporama affiche ses **titres de diapositives**.

## LE RENDU RÉUTILISÉ, ET POURQUOI CELUI-LÀ
J'ai pris **`atelierDocumentHTML`** — le CORPS COMMUN de l'aperçu et de l'impression (mesuré : `atelierPageHTML` = enveloppe autonome `<html>` + charte + ce corps ; l'aperçu de l'éditeur de feuille = la même page en iframe `srcdoc`). Servi INLINE dans le papier plutôt qu'en iframes : ① le clic de zone se délègue directement (`[data-c]` → item ambiant) sans multiplexer l'écouteur `postMessage` existant, qui est STRICT sur UNE iframe et que je ne voulais pas affaiblir ; ② la hauteur se MESURE par `offsetHeight` ; ③ la mise à jour ciblée d'une zone est un `innerHTML` du seul cadre. **Le rendu d'impression n'est pas modifié** : `ed2ImprimerHTML`/`atelierPageHTML` continuent de servir la charte INTACTE.

**La charte, scopée pour l'écran** (`ed2CharteScopee`, cache `var ED2_CHARTE=null`) : la partie écran d'`atelierCharteCSS()` (avant `@media print`) transformée — `body` → `.ed2-fcadre`, `*` → `.ed2-fcadre *`, tout autre sélecteur préfixé. Posée UNE fois dans `<head>` (`<style id="ed2-charte">`), hors du innerHTML du papier.

## LES ZONES CLIQUABLES — le geste de Paul
Le rendu pose déjà `data-c="<composante>"` sur chaque zone (59 occurrences mesurées dans les formes). `ed2ClicPapier(ev,item)` : clic sur une zone → `ed2ClicDocument(item,'c-<composante>')` ; hors zone → comportement d'avant (`item-<k>`). Le panneau gagne, sous chaque item-feuille, **« Le contenu de la feuille »** : une ligne `data-champ="c-<id>"` par case COCHÉE portant des champs — composantes uniques (champs + intitulé), adresse en lecture (elle suit l'adresse de la feuille), et les BLOCS du contenu (consignes, zones…) ligne par ligne (le 1er bloc d'un id porte `c-<id>` — la cible du clic de zone —, les suivants `c-<id>-<i>`). **Les cases se cochent dans l'éditeur de feuille (bouton Éditer) : ici on édite les VALEURS, on ne compose pas** — dit et assumé. La sélection RESTE allumée des deux côtés (règle du LOT ①, vérifiée à 1 s).

## LA FRAPPE — jamais le papier entier
`ed2SetValeurFeuille` / `ed2SetBlocFeuille` écrivent dans le doc du cache via **le typage de l'atelier** (`atValeurTypee` — les listes redeviennent des tableaux), puis `ed2MajZone(ref)` re-rend **le seul cadre** de cette feuille (une feuille déposée deux fois se met à jour partout) et fait pulser la zone. La sauvegarde est débouncée (1 200 ms) par `ed2SauverFeuille` : `secuEcrire(AT_NOEUD/<ref>, doc)` — l'écrivain du nœud, verdict nommé en échec —, puis synchronisation des caches (`AT_DOCS[ref]=doc`, `AT.liste[ref]=copie profonde` — la même copie qu'`atEnregistrerMaintenant`, mesurée), puis **repagination mesurée**. Prouvé au banc : 0 appel à `atEditerChapitreRendre` pendant la frappe ET après la sauvegarde (découpe inchangée), focus conservé, UNE écriture (espion sur `_sitePut` : `[]` avant le débounce, `['/site/atelier/documents/feuille_1']` après), `versionDoc` incrémenté.

## LE COMPTEUR VRAI — hauteurs mesurées
`ed2Mesurer()` relève `offsetHeight` de chaque `.ed2-pdoc` après chaque rendu (`ED2_MESURES`, objet `{item:pixels}`, déclaré) ; `ed2HauteurDoc` sert la mesure d'abord, l'ancienne estimation ne reste que PREMIER JET avant la première mesure. `ed2Repaginer()` compare la signature de découpe mesurée à celle affichée : différente → UN rendu (changement de données de mise en page), garde anti-boucle par signature cible, libérée à la stabilité. Mesuré au banc : a=705 px, b=395, c=1 981 (la longue), cartes 68–122 ; « Au plus serré » 4 f. (a seul, b+e, **c seule — elle déborde une page et occupe la sienne : le papier ne coupe jamais À L'INTÉRIEUR d'un document, contrat existant conservé**, f+g), « Une séance par feuille » 4 f., « Un document par feuille » 6 f. — les trois coûts affichés sont les coûts mesurés. Limite assumée, dite : la hauteur mesurée est celle de la maquette ÉCRAN (largeur de la colonne), fidèle à ce que Paul voit — pas un rendu d'imprimante.

## DOCUMENTS NON ÉDITABLES
Drive, activités d'apps : carte d'avant. Diaporama : **ses titres de diapositives** (liste simple `<ol>`) si le cache `AT_DIAPOS` est là, sa carte sinon — le choix « simple » du cadrage.

## TAILLES — 3 fonctions modifiées, 13 nouvelles, 0 supprimée (835 → 848)
| Fonction modifiée | Avant | Après |
|---|---|---|
| atEditerChapitreRendre | 9 338 o | 9 921 o |
| ed2Papier | 3 998 o | 4 803 o |
| ed2HauteurDoc | 573 o | 659 o |
| *(pastille APP_VERSION)* | 8.42.0 | 8.43.0 |

Nouvelles : ed2CharteScopee (668 o réels) · ed2FeuilleHtml (217) · ed2DiapoHtml (334) · ed2ClicPapier (305) · ed2PanneauFeuille (2 057) · ed2ChampFHtml (842) · ed2SetValeurFeuille (327) · ed2SetBlocFeuille (337) · ed2MajZone (404) · ed2SauverFeuille (760) · ed2Mesurer (177) · ed2PagSignature (149) · ed2Repaginer (357). Plus : var ED2_CHARTE, var ED2_MESURES, var ED2_TIMERS, champs ED2_PAG.affichee/.reflow, CSS (.ed2-fcadre, .at-edch-fz, .ed2-zpulse).
*Artefacts du mesureur automatique, prouvés par comparaison du texte réel : `fichesExtraireObjet` inchangée (1 378 o octet pour octet des deux côtés — une regex en chaîne désynchronise l'équilibrage) ; `ed2CharteScopee` mesurée 121 Ko par le même défaut (la chaîne `'@media print{'`), taille réelle 668 o.*

## CACHES LUS OU ÉCRITS — déclarations mesurées
- `LINK_ATELIER_DOCS` (`var …=null`, objet `{id:doc}`) : LU par le rendu et les écrivains — l'objet du cache est MUTÉ puis sauvé ; `AT_DOCS[ref]` reçoit la même référence, `AT.liste[ref]` une copie profonde (le contrat d'`atEnregistrerMaintenant`).
- `AT_DIAPOS` (objet `{id:diaporama}`) : LU par ed2DiapoHtml, jamais écrit.
- `ED2_MESURES`, `ED2_CHARTE`, `ED2_TIMERS`, `ED2_PAG` : nouveaux, déclarés ci-dessus.
- `chapitresData[level]` : lu (ed2Documents/ed2Repaginer), non écrit par ce lot.
- `M8_TEST_STORE` : magasin du banc.

## AU BANC — chemin réel, hub intercepté, 0 écriture réelle
Même montage que LOT ② (M8 natif + filet `mjpcEcrireRest` journalisé, mur réseau en double filet), seed : chapitre mêlant **3 feuilles REMPLIES** (dont une LONGUE : 14 consignes + 26 lignes), un Drive, une dictée d'app, un diaporama (cache posé), une séance vide, un trou. Artefact de banc déclaré : cache et magasin partagent la référence d'objet (la mutation mémoire se voit « au magasin » avant la sauvegarde) — c'est l'espion `_sitePut` qui prouve l'écriture, pas la lecture du magasin.

| Cas | Verdict |
|---|---|
| rendu | ✔ 3 feuilles rendues (33 zones data-c, 32 lignes de zone lignée), charte UNE fois, cartes Drive/app, titres de diapo (3), panneau 30 lignes de contenu |
| **clic RÉEL (souris) sur la zone « Objectif »** | ✔ ligne `c-objectif` allumée à gauche, **curseur dans son textarea**, zone soulignée, halo document — sélection toujours là après 1 s — **capturé** |
| frappe dans le champ | ✔ zone seule re-rendue + pulse, **0 rendu du papier**, focus conservé, UNE écriture débouncée (espion), versionDoc+1, AT.liste synchronisé, 0 rendu après save (découpe stable) |
| coûts des trois positions | ✔ mesurés : 4 f. / 4 f. / 6 f., affichés dans la barre |
| feuille longue (1 981 px > 995 utiles) | ✔ seule sur sa page — le papier ne coupe pas dans un document |
| vue élève sur chapitre PUBLIÉ | ✔ 12 173 o de HTML identiques base ↔ LOT3, non vide, 0 exception, capturée des deux côtés |
| 390 px | ✔ capturé, 0 exception partout |

## CAPTURES (gestes réels, feuilles REMPLIES, examinées une à une)
`cap_papier_desktop.png` (le papier vivant : feuille complète rendue, compteur 4 f., coûts par position) · `cap_clic_zone.png` (**le geste de Paul** : zone Objectif cliquée → ligne dorée, curseur dedans) · `cap_papier_390px.png` · `cap_eleve_base.png` / `cap_eleve_lot3.png`.

## TEXTES FRANÇAIS SOUMIS À PAUL
« Le contenu de la feuille » (titre de section du panneau) · « Cette ligne suit l'adresse de la feuille. » (info-bulle) · « ⚠ La feuille n'a pas pu s'enregistrer — tes derniers changements ne sont pas en base. » · « (diapositive sans titre) » · « rendu impossible : … » (secours).

## SPEC VIVANTE (reprise en fin de message)
1. Différé : le cochage/décochage des cases depuis le panneau du chapitre (ici : valeurs seulement ; composer = bouton Éditer).
2. Différé : « ↩ Annuler » (LOT ②) ne couvre pas encore les champs de feuille du panneau.
3. Notée : la hauteur mesurée suit la maquette écran, pas la sortie imprimante.
4. Dettes des lots précédents inchangées : « Dupliquer » mort (select), présentation persistée avec le prompt, glisser-déposer, jumeaux de titre, _siteGet panne/vide, navigation élève abrégée du banc.


---

# CORRECTIF LOT ③b — LE POINTAGE FIN, COMME DANS LA MAQUETTE (09/08, même pastille 8.43.0)

**Ce qui manquait, mesuré chez moi.** L'inventaire exhaustif au banc (doc-sonde cochant les 114 composantes non réservées) a donné l'état vrai : 97 zones rendues portaient déjà leur `data-c` (les formes de l'atelier le posent), **mais le PANNEAU n'avait de ligne que pour les cases à champs** — le clic sur `date_edition`, `marque_mjpc`, `version_document`, `case_compris`… ne trouvait AUCUNE ligne et retombait en apparence sur la feuille ; et le **verbe d'action inline** (servi dans le bloc consigne via `ctx.verbeAction`, hors de sa forme dédiée) n'avait pas de repère.

**Les deux correctifs, fidèles à `corpsFeuille()` de la maquette (lue et rejouée) :**
1. **Une case cochée = une ligne**, sans exception : `ed2PanneauFeuille` pose désormais une ligne `data-champ="c-<id>"` pour TOUTE case cochée — celles sans champ portent leur libellé et la mention « se remplit tout seul » ou « réglage de rendu — il porte sur toute la feuille » (2 076 → 2 670 o).
2. Le span inline du verbe d'action reçoit `data-c="verbe_action"` — attribut neutre, rien d'affiché en plus, posé là où la zone se produit (forme `ATELIER_FORMES.bloc_consigne`, fragment 6 957 → 7 022 o). Le rendu partagé (aperçu, impression, feuille élève) n'affiche rien de nouveau.

**LA PREUVE EXIGÉE — zone cliquée → ligne ouverte, par clics souris réels sur la feuille remplie :**
| Zone cliquée | Ligne ouverte (data-champ · libellé) | Exacte |
|---|---|---|
| titre | `c-titre` · « Afficher le titre de la feuille » | ✔ |
| objectif | `c-objectif` · « Afficher l'objectif de la séance » | ✔ |
| notions | `c-notions` · « Afficher les notions visées » | ✔ |
| consigne (bloc) | `c-consigne` · « Ajouter une consigne » | ✔ |
| zone_lignee (bloc) | `c-zone_lignee` · « Ajouter une zone lignée pour écrire » | ✔ |
| mention_conserver | `c-mention_conserver` · « Afficher la mention « à conserver » » | ✔ |

Chaque fois : focus DANS la ligne ouverte. Capturé sur « Notions visées » (`cap_pointage_notions.png` : la zone soulignée à droite, LA ligne « Afficher les notions visées » dorée à gauche, curseur dans son champ — pas la première ligne).

**Le balayage EXHAUSTIF (au-delà des six)** : sur le doc-sonde aux 114 cases cochées, chaque zone `[data-c]` du document a été cliquée par le même chemin que la souris (`ed2ClicPapier`) : **97 zones rendues → 97 pointages exacts, 0 faux, 0 sans ligne** ; le panneau porte 155 lignes. Les 17 composantes sans zone propre, nommées : les 16 **réglages de rendu** (`police_adaptee`, `interligne`, `contraste`, `orientation_paysage`… — ils N'ONT pas de zone à eux : ils SONT l'apparence de toute la feuille, en classes `r-*` ; leur ligne existe au panneau et se pointe depuis lui) et `numerotation_lot` (ne se rend qu'avec un rang d'élève — sa ligne existe). Vue élève republiée : 12 173 o identiques base ↔ LOT3, 0 exception. 0 fonction supprimée (835 → 848 inchangé).
