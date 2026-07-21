# M10 — NOTE DE CADRAGE (exécutant continué M8-MOBILE-2 → M8-IDENTITÉ → M10, 21/07/2026)
*Les jumelles réécriture : la grille complète, une passe, deux fichiers. Rien n'est codé : cette note attend l'audit.*

## Q0 — cette conversation est le fil M8-MOBILE-2/M8-IDENTITÉ (3e morceau)
Le prompt demande de lire « la conversation M8-IDENTITÉ » : c'est ce fil-ci — lecture ③ totale par construction (cadrage, feu vert, livraisons 8.4.0 et 8.4.1, audit vert, jusqu'à la demande du bouton code). **M8-IDENTITÉ 8.4.1 est AU SAS, en attente de ton audit** : deux morceaux vivent dans ce fil, sur des fichiers disjoints (`index` / `reecriture*`). Contrôle de traces fait (conteneur : tout de mes phases ; sas conforme). Arbitrage de continuation : acquis par précédent, je le déclare.

## 1. Lectures — méthode déclarée
- **INDEX** : lu (21/07). **DISPOSITIF** : contenu couvert par ma lecture INTÉGRALE du plan le 20/07 + contre-vérification mécanique du découpage (920/923 lignes identiques, 21/07 matin) + relecture CE JOUR de la grille L169-260 (le contrat) et du principe cardinal L146-168. Je déclare cette méthode plutôt que de simuler une relecture des 97 Ko.
- **CHANTIER** : chronologie, D-PORTAILS-MANQUANTS (ordre recommandé : bb4e et reecriture d'abord — mon morceau), **fiche des jumelles** L145-149 (bug ZNIDI réglé 15/07, « tout correctif de l'une se réplique dans l'autre »), registre des pièges A (dont le `ifo()` jamais appelée de reecriture et le `display:block` du shunt 4e — deux incidents SUR CES FICHIERS).
- **DOCTRINE** : E7 lu intégralement (manuscrit central, séance type, déploiement de l'année, absents « des apps ont déjà leurs systèmes — réécritures : nœud `absents` par lot »), §D Concordance et §T bilan autonome relus.
- **`MJPC6-audit-classification.md`** : **lu intégralement** (13 675 o) — le cycle visé, certifié/déduit, le taux jamais côté élève, et `reecriture` comme précédent de la capitalisation.

## 2. État vérifié (le fichier fait foi — empreintes EXACTES au prompt)
`reecriture.html` 239 262 o md5 `a4a73129…` · `reecriture_bb4e.html` 108 540 o md5 `5798f252…` · patron `correction_dictee.html` 541 588 o md5 `2d0d3941…` (socle **1.1.0** L279-473, shunt §8 câblé L5813-5817). Les deux jumelles : **React UMD**, socle **1.0.0** entre marqueurs identiques (`reecriture` L101-260 · `bb4e` L78-237), `san = sanMJPC`, manifestes présents et cohérents (`noeuds:["reecritures"]` / `["reecriture_bb4e"]`).

**FAIT SOURCÉ QUI CORRIGE LE PROMPT** : « ces apps portent trois fonctions de découpage » — **les trois vivent dans `reecriture` SEULE** (`mapSplitWordsToTokens`, `recomputeTokensForModif`, `tokenizeForCorrection`) ; **`reecriture_bb4e` n'en porte AUCUNE** (0 fonction de découpage, `tokenIdx` ×1, 0 « piege »). Le moteur de pièges (77 occurrences `piege(s)`, 141 `attendu`, 74 `fautif`, 52 `tokenIdx`, popup + auto-détection) est propre à `reecriture`. **La gémellité est de STRUCTURE (portail, socle, textes, écrans), pas de moteur** — « tout correctif se réplique » s'applique à ce qui existe des deux côtés ; il n'y a rien du moteur à répliquer dans bb4e, et je n'y transplanterai rien.

## 3. LA GRILLE — état mesuré, point par point (R = reecriture · B = bb4e)
| Pt | État R | État B | Traitement proposé |
|---|---|---|---|
| 1-2 panneau/navigation | liste de lots + création, pas de navigation nommée Pilotage/Données/Réglages | 3 lots fixes, pas de création | **Q3** : alignement MINIMAL (libellés + badges d'état) — la refonte complète du panneau React est un risque disproportionné (« fais au plus secure ») |
| 3 charte | charte propre existante | idem | conservée (variante : décision 15/07 pour QCM/applaudimètre — à confirmer pour celles-ci, Q3) |
| 4 Préparation | édition de lots existante | texte embarqué | constat au rapport |
| 5 Réglages | **ABSENT** (grep 0) | **ABSENT** | onglet Réglages DOTÉ (même peu garni) |
| 6 ⓘ | `ifo()` définie — **l'incident « jamais appelée » du registre** | idem | ⓘ posés et APPELÉS, visibilité RÉELLE testée (`offsetHeight>0`, leçon du registre A) |
| **7 identité** | `doLogin` nom+prénom SEULS, 0 code · branche `MENEY/monsieur` en dur · 0 `lireSessionMJPC` | idem | **le cœur** : portail code+nom+prénom (patron souche) + socle 1.1.0 + shunt §8 (useEffect, garde, exclusion prof, `validerEleveMJPC`) — voir §4-A |
| **8 « Mes réécritures »** | 0 occurrence | 0 | à construire sur les résultats existants (l'app stocke par élève) — patron « Mes dictées » de la souche |
| 9 branchement site | items `reecriture` existent côté site | — | constat |
| 10 annonces | **0 `site/annonces`** | 0 | le « ? » lit le canal central (cloner le filtre du lecteur de la souche, contrat M6) |
| 11 manifeste | présent, nœuds justes | présent | maintenu (version socle 1.1.0 publiée) |
| 13 concordance | les pièges sont des paires `{attendu,fautif}` SANS catégorie ; « consignes de transformation » ≠ référentiel d'erreurs | idem | **Q4 : rien à coudre ICI** — la matière attend le cycle certifié/déduit (audit-classification) ; déclaré, pas codé |
| 22 présence | nœud PROPRE `reecritures/<id>/presence` (9 occ.) | **0** | **Q5** : conserver l'existant de R (contrat de nœud ≠ /presence du site — migration = M15) ; bb4e : répliquer le mécanisme de R ou dette ? |
| 23 diagnostic + bilan | **0 bloc diagnostic** ; impression/bilans riches (57/116 occ.) | idem | bloc diagnostic inséré en tête des DEUX ; bilan autonome : constat de l'existant au rapport |
| 25/25bis/26/28 textes | « Bravo ! » inconditionnel · « en attente » · « pas encore corrigée » | « Bravo pour ce travail », « pas encore modifié » | relevé COMPLET au codage, reformulations SOUMISES ; champs éditables : constat (architecture dictionnaire = chantier ultérieur, point 26 appliqué en priorité aux clôtures) |
| 27 tokenisation | 3 fonctions — **INTACTES, md5 avant/après au rapport** ; le banc EMPRUNTE, jamais ne réimplémente | aucune | engagement absolu |
| pastille | **AUCUN `APP_VERSION`** (seul `MJPC_CORE_VERSION`) | idem | **créée** sur les deux + badge visible — **Q7** : numérotation proposée `2.0.0` (première pastille, passe majeure) |
| tactile | **0 media query** dans les DEUX fichiers | idem | passe tactile complète (élèves sur tablettes) : mesures avant/après aux deux tailles, desktop intact |

## 4. Plan de codage (ordre imposé par l'incident historique DE CES FICHIERS)
**A · SOCLE 1.1.0 (les deux)** — ① extraire le bloc `MJPC-CORE v1.1.0` de la souche (L279-473) ; ② **SUPPRIMER le bloc local 1.0.0 D'ABORD** (entre les marqueurs exacts) ; ③ insérer ; ④ **vérification NOMMÉE** : `sanMJPC, extractEleves, ecrireClasse, renvoyerVersMJPC, publierManifesteREST, MJPC_MANIFESTE, MJPC_PURGE, lireSessionMJPC, validerEleveMJPC` toutes présentes, une par une, par grep hors commentaires — l'ordre et la vérification sont la parade à l'incident du regex mangeur. Les constantes locales (`MJPC_APP`, manifeste) CONSERVÉES à l'identique.
**B · PORTAIL + SHUNT (les deux)** — champ code ajouté à `doLogin` (vérif contre `/codes`, textes soumis) ; shunt §8 en `useEffect` calqué sur la souche (garde anti-double, `is_prof` exclu, validation `/classes`) ; **branche `MENEY/monsieur` : Q1**.
**C · « Mes réécritures » (les deux)** — liste des travaux de l'élève identifié, libellé du point 8.
**D · TEXTES (les deux)** — relevé cardinal complet, « Bravo » conditionné ou reformulé, mots du code retirés des écrans élève, tout SOUMIS.
**E · PANNEAU/RÉGLAGES/ⓘ/ANNONCES/DIAGNOSTIC/PASTILLE (les deux, périmètre selon Q3)**.
**F · TACTILE (les deux)** — mesures avant, media queries, mesures après, deux colonnes.
**Preuves de gémellité au rapport** : table point-par-point R↔B ; fonctions communes md5-comparées ; le moteur de pièges de R **md5-identique avant/après**.

## 5. Questions avant code
- **Q0** continuation (3e morceau du fil) — acquise par précédent, à confirmer.
- **Q1** branche `MENEY/monsieur` (porte SANS code, dans les deux) : le plan a décidé son retrait pour la souche, mêmes raisons ici — mais ces apps n'ont PAS de mode test D1 : le retrait sec prive Paul de test rapide. Je propose : **retrait** (garder une porte sans code contredirait le morceau) + le test passe par un élève de CLASSE TEST avec code + dette « bac à sable à doter ». À trancher.
- **Q2** élève sans code en base : refus avec texte soumis (« Vérifie ton code avec moi en classe ») — même règle qu'au site.
- **Q3** périmètre points 1-4 : alignement minimal proposé (badges + libellés), pas de refonte du panneau React — confirmer.
- **Q4** point 13 : N/A motivé (déclaré, pas codé) — confirmer.
- **Q5** présence bb4e : répliquer le mécanisme de R (nouveau nœud `reecriture_bb4e/<id>/presence` → **écriture nouvelle au hub, à annoncer**) ou dette M15 ? Je penche dette (aucun contrat de nœud ne bouge dans ce morceau).
- **Q6** annonces : lecture seule de `site/annonces` via le filtre cloné de la souche — confirmer.
- **Q7** pastille : `2.0.0` sur les deux — confirmer la numérotation.

## 6. Écritures hub : ZÉRO
Lectures authentifiées (empreintes §2), harnais lecture seule stricte à venir (stub + GET réels), banc sur les tokenisations EMPRUNTÉES. Je ne promeus jamais.
