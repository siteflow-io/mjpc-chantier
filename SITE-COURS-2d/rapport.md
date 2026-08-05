# SITE-COURS-2d — RAPPORT DE LIVRAISON
**Le confort d'éditeur : conseil du filet, navigation aperçu↔éditeur, ⓘ d'injection.**
Exécutant SITE-COURS-2d, sous conscience n°5 · 05/08/2026

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.29.0) | 767 559 o | `3cf2d409bf62d0b4d318a1605b95ed84` |
| LIVRÉ (8.30.0) | 775 489 o | `cde79195ffc264b15bbc6621a780c5ce` |

Double parseur (acorn + node --check) : **VERT** sur base et livré.

## 2 · Objet ① — le conseil du filet local

- **Une seule mesure d'écart** : le cœur d'`atEnvoiEcart` (2c) est extrait en `atEcartDetail(a,b)` → `{nb, zones:[libellés]}` ; `atEnvoiEcart` devient son enveloppe numérique (939 → 81 o, **seule décroissance**, déclarée et attendue). Les zones portent les libellés que la feuille connaît d'elle-même (`ATELIER_COMPOSANTES[id].libelle`, « <libellé> (bloc N) » pour le contenu). Le **titre de la feuille** est comparé par le conseil lui-même, hors du cœur : ainsi le comportement d'`atEnvoiEcart` côté envoi (2c) est strictement inchangé — le titre interne « pour toi » ne compte pas dans l'écart d'envoi, mais compte dans le conseil du filet (« le titre de la feuille », en tête de liste).
- Contenus **identiques** → aucune question, base ouverte, filet effacé, et **une ligne discrète en console** (exigence C) : `[atelier] filet local identique à la base — effacé en silence (<id>)`.
- Contenus **différents** → « La version de cet appareil contient N modification(s) absente(s) de la base (…, …, …­…) — je conseille de la reprendre. » — 3 zones puis « … », boutons inchangés.
- Filet plus **ancien** → aucune question, comme avant.
- **Dette résorbée** : la « comparaison par horloge d'appareil » (consignée hier) ne décide plus seule — l'horodatage n'est plus qu'un pré-filtre, le contenu tranche.

## 3 · Objet ② — navigation aperçu↔éditeur

- **Patron worktrack repris** (mesuré au code, vérifié indépendamment par la conscience) : keyframe `edPulse` aux mêmes valeurs (halo + fond dorés, 5 s ease-out forwards), zone mémorisée par les setters (`AT.pulseComp`), relayée par le débonce existant, `scrollIntoView` nearest injecté. **Adapté** : granularité à la composante/section (`data-c`), la même échelle que les libellés du conseil.
- **Accordéons** : rattachement (« Cette feuille est pour… ») + les trois groupes, **tous repliés à l'ouverture** (Q1 confirmée : barre haute et pistons permanents). État `AT.sectionsOuvertes` tenu toute la session, remis à zéro par `atOuvrirDoc`. En-têtes tactiles ≥ 44 px, ⓘ des groupes conservés (stopPropagation).
- **Clic aperçu → section** : script injecté dans l'aperçu **seulement** (`options.apercu`) — clics sur `[data-c]` → `postMessage({type:'at-va',comp})` ; le parent ouvre l'accordéon, défile jusqu'à la case (`data-case-id`), halo `atHalo` (même décroissance). Mobile ≤ 900 px : la remontée de page vers la case ouverte, prouvée au banc à 390.
- **Exigence A honorée** : `atMessageApercu` n'entend que `type==='at-va'` + `comp` string + atelier ouvert + **source = l'iframe d'aperçu** (`e.source===fr.contentWindow`) ; tout le reste est strictement ignoré ; le gestionnaire ne fait qu'une navigation d'accordéon, aucune écriture, aucun autre état.
- La feuille **élève** (`openAtelierItem` → `atelierPageHTML` sans options) ne reçoit ni style ni script d'aperçu : rien ne change pour elle.

## 4 · Objet ③ — ⓘ d'injection

Les trois boutons de l'inventaire de chapitre gagnent chacun un ⓘ (patron `at-ifo`/`atInfo`) ; `atInfoInjection(voie)` dit **avant le clic** la substance que `chInjecter` dit déjà à la confirmation (mêmes phrases, redondance voulue) : compléter n'écrit que l'absent · remplacer met l'ancien à la corbeille d'abord (items compris ; feuilles de l'atelier et travaux des élèves non touchés) · garder à côté ajoute en fin de liste, « proposition », non publié.

## 5 · Fonctions — inventaire complet (0 supprimée)

BASE 698 → LIVRÉ 706. **688 intactes**. **8 ajoutées** : atEcartDetail 1 304 (avec ses internes `libelle` 88 et `noter` 67, comptées par l'inventaire) · atHtmlSection 375 · atSectionToggle 157 · atAllerComposante 590 · atMessageApercu 269 · atInfoInjection 674 o. **10 modifiées** (relues) :

| fonction | avant | après | objet |
|---|---|---|---|
| atEnvoiEcart | 939 | 81 | extraction du cœur (seule décroissance, déclarée) |
| atOuvrirDoc | 1 218 | 2 052 | conseil du filet + reset des sections |
| atRendreEditeur | 2 546 | 2 662 | accordéons (rattachement + groupes) |
| atelierPageHTML | 765 | 2 028 | style + script d'aperçu conditionnels |
| atRendreApercu | 1 118 | 1 269 | consommation de la zone, option aperçu |
| atSetTitre / atSetValeur / atToggleCase | 76/203/831 | 97/287/872 | pose de la zone touchée |
| atHtmlCase | 903 | 947 | `data-case-id` (cible d'atterrissage) |
| chAfficherInventaire | 4 618 | 4 840 | les trois ⓘ |

CSS : accordéons (.at-sec*), halo `atHalo`. HTML : rien d'autre. Pastille 8.30.0.

## 6 · Écarts au plan et observations (déclarés)

1. **Écart favorable — `atelierDocumentHTML` non modifiée (0 édition)** : le cadrage l'annonçait touchée pour poser les enveloppes ; la mesure fine du TEMPS 2 montre que **les 53 formes de rendu posent déjà `data-c="<id>"` partout** — les enveloppes existaient, le pulse et le clic s'y accrochent tels quels.
2. Le cadrage annonçait aussi `atHtmlRattachement` modifiée : non plus — l'accordéon l'enveloppe de l'extérieur (`atHtmlSection`), zéro risque dans la fonction.
3. `atSetRatt`/`atSetBlocValeur`/`atSetBlocReforme` n'ont pas reçu de pose de zone : les deux premiers re-rendent l'éditeur entier (le pulse serait consommé par un rendu concurrent) et les métas d'adresse pulsent déjà via le rendu ; les blocs pulsent par leur composante (`atSetValeur` du champ). Comportement homogène constaté au banc ; si Paul veut le pulse sur l'adresse elle-même, une ligne par setter suffit.
4. **Amenée d'écran au banc (P5)** : `chOuvrir` exige la clé M-SÉCU puis trois chargements réseau (taxo, état d'année, prompt) — hors périmètre d'un morceau écran/local. L'écran chapitre du banc est rendu par `chRendre()` + `chAfficherInventaire()` sur un chapitre minimal au format réel ; **les ⓘ, objet du test, sont joués au clic réel** et leurs textes lus dans la vraie modale.
5. **Observation** : la base (identité pourtant strictement conforme au mandat) contient des marqueurs « SITE-COURS-2e » (`chVerifier`, `chAfficherInventaire` : sommaire, validation de déclaration). Je le signale sans en juger la chronologie.
6. Environnement de banc : des processus et fichiers fantômes issus de commandes interrompues ont pollué deux runs (logs mêlés) ; discipline posée (sondes par `ps`, purge par PID, run.log recréé à chaque lancement).

## 7 · Banc de preuve — **BILAN : 25/25 VERTS**

Playwright + Chromium, chemin réel au clic, hub intercepté, **aucune écriture réelle**. Filets locaux fabriqués en `localStorage` avant chargement (cadre principal seulement — l'init d'iframe est neutralisé), horodatage futur.

```
VERT  · P1a · filet identique : AUCUNE question, feuille ouverte, filet effacé en silence
VERT  · P1a · la trace console existe (exigence C)
VERT  · P1b · conseil argumenté à 1 zone, libellé de la feuille elle-même
VERT  · P1b · [Reprendre] reprend bien la version de l'appareil
VERT  · P1c · 5 modifications, liste de 3 zones puis « … », le titre en tête
VERT  · P1c · [Garder la base] : le titre de base est gardé, le filet est effacé
VERT  · P1d · filet plus ancien : aucune question, la base s'ouvre
VERT  · P2 · à l'ouverture : toutes les sections présentes et TOUTES repliées
VERT  · P2 · deux sections ouvertes au clic (ratt, g0)
VERT  · P2 · l'état des sections survit aux re-rendus de la session
VERT  · P2 · exigence B : l'écran IA remplace l'éditeur, la mécanique des sections ne le replie ni ne le casse
VERT  · P2 · exigence B : au retour, l'éditeur est intact et l'état des sections aussi
VERT  · P2 · à la réouverture : tout replié à nouveau
VERT  · P3 · la zone d'aperçu de l'objectif pulse après la modification
VERT  · P3 · l'aperçu pulse même quand la section d'éditeur est repliée
VERT  · P3 · la zone pulsée se consomme (pas de re-pulse au rendu suivant)
VERT  · P4 · départ : tout replié
VERT  · P4 · le clic dans l'aperçu ouvre la section et pose le halo sur la case
VERT  · P4 · exigence A : messages hors iframe / mauvais type / comp non-string
VERT  · P5 · les trois ⓘ disent la substance AVANT le clic (textes exacts, apostrophes codepoints)
VERT  · P6 · 390 : le conseil argumenté s'affiche (l'écart réel compte aussi le titre modifié au fil du run)
VERT  · P6 · 390 : l'éditeur s'ouvre tout replié
VERT  · P6 · 390 : le pulse de l'aperçu joue
VERT  · P6 · 390 : le clic-aperçu ouvre la section et REMONTE la page jusqu'à la case
VERT  · P7 · aucune écriture nouvelle vers le hub (seuls les enregistrements existants de feuille), published jamais écrit
=== BILAN 2d : 25/25 VERTS ===
```

Cas limites couverts : filet identique (silence + effacement + trace) · 1 zone · 5 zones (liste tronquée, titre en tête) · plus ancien · état d'accordéons sous re-rendus · **aller-retour « Écrire avec une IA » intact (exigence B)** · repli à la réouverture · pulse sur section repliée · consommation du pulse · **écouteur strict (exigence A)** : mauvais type, comp non-string, message hors iframe — état inchangé · 390 px pour les trois objets (dont la remontée du clic-aperçu) · apostrophes en codepoints · aucune écriture nouvelle vers le hub, `published` jamais écrit (journal vérifié).

Non-couverture assumée : l'impression du bandeau/hover d'aperçu n'est pas testée (styles d'aperçu absents de la feuille élève par construction) ; le seuil du conseil n'a pas de réglage (il n'y en a pas : toute différence est dite).

## 8 · Captures (au sas, `captures/`)

`p1_conseil_1zone.png` · `p1_conseil_5zones.png` (le conseil argumenté, liste des zones) · `p2_editeur_replie.png` (l'éditeur tout replié à l'ouverture) · `p3_pulse_apercu.png` (un pulse d'aperçu) · `p4_clic_apercu_section.png` (le clic-aperçu ouvre la section, halo posé) · `p5_info_remplacer.png` + `p5_trois_i.png` (les trois ⓘ) · `p6_conseil_390.png` · `p6_editeur_replie_390.png` · `p6_clic_apercu_390.png`.

## 9 · Textes soumis à Paul

1. Conseil : « La version de cet appareil contient N modification(s) absente(s) de la base (le titre de la feuille, Afficher la durée prévue, Afficher ce qui sera évalué…) — je conseille de la reprendre. » [Reprendre la version de cet appareil] [Garder la version en base] — NB : les libellés de zones sont ceux des composantes (« Afficher l'objectif de la séance »…) ; s'ils paraissent longs à l'usage, un raccourcissement des libellés (ou une table de noms courts) est un morceau d'une ligne par composante, à ta main.
2. En-têtes d'accordéons : « Cette feuille est pour… » + les libellés de groupes existants.
3. Les trois ⓘ d'injection (§4).
4. Trace console : `[atelier] filet local identique à la base — effacé en silence (<id>)`.

---
**STOP.** Livraison au sas complète : `SITE-COURS-2d/index.html` + `rapport.md` + 10 captures. J'attends l'audit de la conscience n°5, puis le « promeus » de Paul.
*[exécutant SITE-COURS-2d]*
