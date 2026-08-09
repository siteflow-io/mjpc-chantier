# LOT ② — LES GESTES DE L'ÉDITEUR DE CHAPITRE
**Exécutant · 09/08/2026 · pastille 8.42.0 · base : production 897 421 o (md5 5918eb6eafc6f6ee19b4fe5eed8ad9b7, vérifiée = LOT ① promu) · livré : 917 693 o**

## CE QUE LE LOT APPORTE
| # | Geste | Où |
|---|-------|----|
| ⑥ | **« + insérer une séance ici »** entre deux séances | sommaire ET papier (liseré pointillé) |
| ⑦ | **« Déplacer vers… »** — un document change de séance sans être recréé | actes de chaque item du panneau |
| ⑧ | **« ✨ Écrire avec une IA »** depuis un trou — feuille créée ADRESSÉE, liée, écran IA existant ouvert avec l'adresse dans le prompt | chaque trou (pile et papier) |
| ⑨ | **héritage** — une feuille créée dans une séance reçoit ses notions et compétences, pré-remplies, modifiables | edCreerFeuilleIci, ⑧ et ⑪ |
| ⑩ | **« ↩ Annuler »** — un cran, qui NOMME ce qu'il rétablit | barre du panneau |
| ⑪ | **destination demandée** — injection sans feuille ouverte : « Dans quelle séance déposer la feuille ? » | écran d'injection |
| ⑫ | **« Prendre une feuille existante… »** — avec repère « déjà : Ch. N · S. R » | trous + actes de séance |

## LES DÉCISIONS, ET POURQUOI
**⑥ — le socle ordre fait tout.** La séance neuve s'écrit par l'écrivain d'`addSeance` (`mjpcPutJson`, mêmes valeurs de séance neuve), prend en MÉMOIRE un rang intercalaire (ordre voulu − 0,5), et c'est `ordResserrer` qui écrit TOUS les ordres vrais — le sien et ceux des suivantes, en écritures fines, sans trou. *Premier jet fautif attrapé par le banc : je décalais la mémoire à la main → le resserrement, idempotent, ne voyait plus rien à écrire, et les ordres décalés ne partaient JAMAIS en base (deux séances d'ordre 2 au rechargement). Corrigé, re-prouvé : `/seances/2/ordre=3` et `/seances/3/ordre=4` écrits au magasin.*

**⑦ — même uid, deux écritures en LOT.** L'item part TEL QUEL (copie profonde, même `uid`, même `ref`, même publication), ordre = fin de la séance cible, même clé si libre (sinon suffixe `-2`). PUT cible + DELETE source partent par `mjpcLot` — le pattern de `_swapOrdre` : l'écran ne bouge que si les DEUX verdicts sont acceptés. Pas de corbeille : c'est un déplacement. La source est resserrée après. `edDeplacerVersSeanceFaire(j,k,jc)` est séparée pour l'appel futur par glisser-déposer.

**⑧ — rien de réécrit, tout d'adressé.** La feuille se crée par les écrivains d'`edCreerFeuilleIci` (`secuEcrire` sur `AT_NOEUD`, caches mis à jour), héritée (⑨), LIÉE à l'item attendu par `edLierConfirme` — l'écrivain de « Lier par les titres », uid d'item intouché — ou déposée par `itemCreer` si la séance est vide. Puis l'écran IA EXISTANT s'ouvre (`atIAChargerPrompt` → `atIARendre`), en quittant l'éditeur de chapitre comme `edEditerFeuille` (AT_FIL garde le fil). **Le produit attendu** : le schéma du chapitre ne déclare AUCUN produit d'atelier par item (mesuré : les items déclarent un kind d'app — doc, dictee, reecriture… — jamais un produit) ; la seule déclaration portée par le chapitre est le TYPE de la séance → type `notions` → `fiche_notion`, tout autre type → `fiche_seance` (le produit par défaut du flux feuille).

**⑧ — la pièce d'adresse, assemblée, JAMAIS persistée.** `atPromptPieceAdresse()` se déduit de LA FEUILLE OUVERTE (son rattachement, ses notions héritées) : aucun état nouveau, aucune fuite d'une feuille à l'autre, vide dès que la feuille n'est pas adressée. Elle est bornée par deux sentinelles (`── ADRESSE DE LA FEUILLE … ──` / `── fin de l'adresse ──`) et `atConfirmerEnr` la RETIRE à la porte de persistance : le prompt enregistré de Paul reste propre (prouvé au banc : la consigne ajoutée par Paul est persistée, la pièce non, `AT_IA.tpl` propre). *Quirk HÉRITÉ non touché : `atConfirmerEnr` persiste le texte COMPOSÉ, présentation MJPC comprise — dette de la prod, signalée, hors périmètre.*

**⑨ — pré-rempli, jamais imposé.** `edHeriterSeance(doc,se)` coche `notions`/`competences` et pose les libellés en `valeurs.{notions,competences}.items` — SEULEMENT si rien n'y est déjà (ce que l'IA a rempli n'est pas écrasé). Libellés par la taxonomie (`chChargerTaxo` → `chIdsTaxo`), identifiants bruts si elle ne se lit pas.

**⑩ — sûreté, un cran, nommé.** Les trois écrivains fins du panneau (`atChampChapitre/Seance/Item` — les seuls enregistrements silencieux de cet écran) mémorisent l'ancienne valeur AVANT d'écrire et posent le cran APRÈS le verdict accepté. « ↩ Annuler » rétablit par le MÊME écrivain — l'annulation devient elle-même annulable — nomme (« Rétabli : le champ « title » de la séance « … » → « ancienne valeur » »), puis UN rendu. Tout autre geste du lot et les suppressions VIDENT le cran.

**⑪ — le chapitre courant.** L'adresse VALIDÉE du JSON prime ; sinon le fil du dernier chapitre travaillé (`AT_FIL`). Sans chapitre identifiable : comportement d'avant, mais NOMMÉ (« Feuille créée SANS adresse… »). L'option « Sans adresse (je la déposerai plus tard) » reste offerte — jamais bloqué.

**⑫ — le cache servi, pas rechargé.** `edPrendreFeuille` lit `LINK_ATELIER_DOCS` (chargé à l'entrée de l'écran — LOT ①) ; filet UNE fois par `atSiteGetDocs` s'il est encore vide. Le repère « déjà : Ch. N · S. R » se MESURE dans `chapitresData` du niveau. Attache d'un item attendu par `edLierConfirme` (uid inchangé) ; d'une séance par `itemCreer`. Le texte de la modale le dit : « La feuille reste UNE : la déposer ici ne la copie pas. »

## UN DÉFAUT DE LA PROD ATTRAPÉ EN ROUTE
`atModaleChoix` RETIRE la modale du DOM avant d'appeler le rappel du bouton : un `getElementById` dans ce rappel rend null. Mes trois selects capturent donc la valeur À LA SÉLECTION (`ED_SEL.v`, `onchange`). **Dette signalée, hors périmètre : `edDupliquerVers` (prod) lit son select de la même façon morte — le bouton « Dupliquer » de sa modale ne peut pas aboutir.** Mesuré au banc, non corrigé ici (pas dans le cadrage).

## TAILLES — 14 fonctions modifiées, 17 nouvelles, 0 supprimée (818 → 835)
| Fonction modifiée | Avant | Après |
|---|---|---|
| atChampChapitre | 381 o | 604 o |
| atChampSeance | 406 o | 692 o |
| atChampItem | 427 o | 719 o |
| atConfirmerEnr | 829 o | 1 122 o |
| atEditerChapitreRendre | 8 881 o | 9 338 o |
| atIAInjecterNeuve | 222 o | 684 o |
| atPromptTexte | 1 259 o | 1 301 o |
| ed2Papier | 3 469 o | 3 998 o |
| ed2Pile | 1 442 o | 1 757 o |
| ed2Sommaire | 851 o | 1 077 o |
| edCreerFeuilleIci | 1 808 o | 1 987 o |
| edSupprimerItem | 146 o | 182 o |
| edSupprimerSeance | 200 o | 280 o |
| *(pastille APP_VERSION)* | 8.41.0 | 8.42.0 |

Nouvelles : edInsererSeanceAvant (1 569 o) · edDeplacerVersSeance (911) · edDeplacerVersSeanceFaire (1 269) · edIAdepuisTrou (1 622) · edProduitDeclare (98) · edHeriterSeance (484) · edLibellesTaxo (206) · atPromptPieceAdresse (839) · atPromptSansAdresse (243) · atIAInjecterAvecDestination (2 636) · edPrendreFeuille (1 792) · edFeuilleDepots (331) · edUndoVider/Maj/Court/Poser/Jouer (49/196/153/103/228). Plus : var ED_UNDO, var ED_SEL, deux sentinelles, une classe CSS `.ed2-inserer`.
*Note du mesureur : `fichesExtraireObjet` apparaît modifiée dans l'extraction automatique — artefact (une regex en chaîne `'\\s*=\\s*\\{'` désynchronise l'équilibrage d'accolades) ; le texte réel de la fonction est IDENTIQUE octet pour octet (1 378 o des deux côtés, prouvé par comparaison directe).*

## CACHES LUS OU ÉCRITS — déclarations mesurées
- `LINK_ATELIER_DOCS` : `var LINK_ATELIER_DOCS=null` (objet `{id:document}` une fois chargé) — lu par ⑫ et les caches de ⑧/⑪, jamais rechargé si peuplé.
- `AT_DOCS`, `AT.liste` : objets `{id:document}` (AT.liste mesuré objet indexé — commentaire C5-ED1b de la prod) — tenus à jour à chaque feuille créée.
- `CH.taxo` : posé par `chChargerTaxo` (lit `secuLire('/taxonomie')`, cache en place) — lu par `edLibellesTaxo`.
- `chapitresData[level]` : la mémoire de vérité de l'écran — chaque geste l'aligne sur ses écritures avant l'unique rendu.
- `ED_UNDO` : `var ED_UNDO=null` (un seul cran `{desc,anc,rejouer}`) — nouveau, ce lot.
- `ED_SEL` : `var ED_SEL={v:null}` (valeur du select courant des modales) — nouveau, ce lot.
- `M8_TEST_STORE` : le magasin du mode test (banc) — plat, par chemin.
- `AT_FIL` : le fil du chapitre (`{level,chnum,ref}`) — posé par ⑧ comme par `edEditerFeuille` ; lu par ⑪.

## published — l'état des lieux
`published` ne part que sur un geste de Paul. Une précision HÉRITÉE : l'écrivain de séance neuve de la prod (`addSeance`) pose `published:true` sur la séance créée — ⑥ copie cet écrivain à l'identique (même valeur) ; les items, eux, naissent tous `published:false`, et l'écran élève ne montre que ce qui est publié à tous les étages. ⑦ transporte la publication TELLE QUELLE (ni ouverte ni fermée).

## AU BANC — chemin réel, hub intercepté, 0 écriture réelle
`_sitePut`/`secuEcrire` passent par le mode test natif (M8) ; les écrivains REST fins (`mjpcPutJson`, `mjpcDeleteJson`, `mjpcLot`) passent tous par `mjpcEcrireRest` — le banc le ROUTE vers le même magasin, page chargée (journal des écritures, verdict accepté), avec le mur réseau en double filet. Session élève posée par le banc (déclaré), taxonomie miniature seedée (2 notions, 1 compétence, avec libellés).

| Cas | Verdict |
|---|---|
| ⑥ insérer entre S1 et S2 (modale réelle) | ✔ clés intactes, neuve clé 4 ordre 2, ordres 1-2-3-4 sans trou, `/2/ordre=3` `/3/ordre=4` ÉCRITS |
| ⑦ déplacer « Rappel sur la versification » S1→S2 (bouton du panneau + modale) | ✔ même uid `it_a`, fin de cible (ordre 3), source vidée et resserrée (b→1, écrit), PUT+DELETE en lot |
| ⑧ ✨ depuis le trou `d` (clic réel) | ✔ écran IA ouvert, pièce d'adresse dans le prompt (chapitre, Séance 2 « Lire un tableau », notions « La rime », produit « Fiche notion » — type `notions` déclaré), feuille créée LIÉE (`d.ref` posé, uid `it_d` intact), AT_FIL posé — **capturé** |
| ⑧ ✨ depuis la séance 3 VIDE | ✔ produit « Fiche de séance », item créé lié |
| ⑨ « + Feuille » séance 1 (modale de titre réelle) | ✔ cases notions/compétences cochées, valeurs pré-remplies EN LIBELLÉS (« Vers et mètre », « La rime », « Écrire un texte bref »), rattachement complet, item lié |
| ⑩ champ titre modifié puis « ↩ Annuler » | ✔ bouton nommé (« Rétablir le champ « title » de la séance « … » »), valeur rétablie mémoire ET magasin, cran re-posé (annulation annulable) |
| pièce d'adresse et persistance | ✔ visible à l'écran, ABSENTE du prompt persisté, la consigne ajoutée par Paul y est, `AT_IA.tpl` propre |
| ⑪ injection sans feuille (AT_FIL posé) | ✔ modale destination, dépôt en séance choisie, `published:false`, rattachement posé |
| ⑫ prendre une feuille sur le trou `d` | ✔ repères « déjà : Ch. 1 · S. N » exacts (reflétant même le déplacement de ⑦ !), `d.ref=feuille_4`, uid `it_d` inchangé |
| vue élève sur chapitre PUBLIÉ | ✔ 10 939 o de HTML identiques base ↔ LOT2, non vide, 0 exception — capturée des deux côtés |
| balayage des nouveaux boutons (desktop + 390 px) | ✔ tous présents, toutes les modales s'ouvrent, capteur d'exceptions : AUCUNE |

Artefact du banc (identique des deux côtés, déclaré) : navigation élève abrégée — pied « Niveau : 3ème » et badge de coin gardent leur défaut.

## CAPTURES (gestes réels, examinées une à une)
`cap_ed2_desktop.png` (l'écran complet : liserés ⑥, trous à quatre gestes, barre avec ↩ Annuler) · `cap_ed2_trous.png` · `cap_ia_depuis_trou.png` (**la pièce d'adresse lisible dans le prompt**) · `cap_deplacer_390px.png` (la modale ⑦ au téléphone) · `cap_ed2_390px.png` · `cap_eleve_base.png` / `cap_eleve_lot2.png`.

## TEXTES FRANÇAIS SOUMIS À PAUL
Boutons : « + insérer une séance ici » · « ✨ Écrire avec une IA » · « Prendre une feuille existante… » / « Prendre une feuille… » · « Déplacer vers… » · « ↩ Annuler ». Modales : « Le document arrive en fin de séance choisie, tel quel (même identité, même liaison, même publication). » · « La feuille reste UNE : la déposer ici ne la copie pas, elle est simplement liée. » · « Dans quelle séance de « X » (4e) déposer la feuille ? » + « Sans adresse (je la déposerai plus tard) ». Messages : « Rétabli : … → « … ». » · « Feuille créée SANS adresse — dépose-la depuis un chapitre (« Prendre une feuille existante… »). » Pièce du prompt : « MON CONTEXTE — la feuille est déjà adressée, tiens-en compte sans que je le répète : … ». *Pas d'annonce élèves : l'écran élève ne change pas (outillage professeur).*

## SPEC VIVANTE (reprise en fin de message de livraison)
1. Dette PROD signalée ce lot : le « Dupliquer » d'`edDupliquerVers` lit un select retiré du DOM — bouton mort. À reprendre (une ligne, pattern ED_SEL).
2. Quirk hérité : `atConfirmerEnr` persiste la présentation MJPC avec le prompt (l'adresse, elle, est désormais retirée).
3. Différé du cadrage : glisser-déposer des documents (l'assise `edDeplacerVersSeanceFaire` est prête).
4. Hors périmètre depuis LOT ① : jumeaux de titre dans `chAfficherInventaire` ; `_siteGet` ne distingue pas panne/nœud vide.
5. Artefact banc à résorber un jour : navigation élève abrégée (pied de page non posé).
