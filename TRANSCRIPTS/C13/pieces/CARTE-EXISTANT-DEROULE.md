# CARTE DE L'EXISTANT — LE DÉROULÉ, L'ÉDITEUR ET CE QUI S'Y BRANCHE
*Conscience n°13, pièce du transcript, ouverte le 05/10/2026 (tour 12) sur l'ordre de Paul : « avant de piloter un exécutant tu dois avoir une connaissance vraiment complète de déroulé, de l'éditeur, de toutes les implications aussi (liens, calendrier, etc) ». Écrite zone par zone, poussée à chaque tour : ce qui est ici est lu dans le code ou joué dans le navigateur, jamais de mémoire ; ce qui n'est pas encore lu est dit « pas lu ».*

**Base lue** : `index.html` de production, commit `c0f76b4`, 1808861 o, md5 `ac792b28f40d`.

## Z0 · Inventaire (fait, 05/10, tour 12)
- 1341 fonctions dans `index.html` ; deux scripts : le principal, et `pont-fusion` (à l'octet 1046889).
- Le moteur de l'ancien déroulé est embarqué en base64 dans `AT_DR_B64` (309812 caractères ; décodé : une page de 229 960 o, 157 fonctions).
- Les familles de fonctions, par taille (préfixe · nombre · Ko, de la déclaration à la suivante) :
  - `at` · 239 · 552 Ko
  - `edt` · 230 · 236 Ko
  - `_dr` · 58 · 78 Ko
  - `ed` · 81 · 69 Ko
  - `ses` · 47 · 55 Ko
  - `ch` · 28 · 43 Ko
  - `mjpc` · 31 · 37 Ko
  - `secu` · 29 · 29 Ko
  - `eli` · 35 · 28 Ko
  - `CH` · 1 · 27 Ko
  - `_prof` · 15 · 23 Ko
  - `render` · 8 · 19 Ko
  - `open` · 17 · 17 Ko
  - `elf` · 28 · 17 Ko
  - `fiches` · 18 · 15 Ko
  - `_taxo` · 23 · 14 Ko
  - `atelier` · 7 · 13 Ko
  - `show` · 8 · 12 Ko
  - `_b` · 20 · 12 Ko
  - `_uni` · 13 · 10 Ko
  - `_corb` · 11 · 9 Ko
  - `ctx` · 7 · 9 Ko
  - `on` · 4 · 8 Ko
  - `_purge` · 8 · 8 Ko

## Les zones à lire et à jouer, dans l'ordre
- **Z1 · le parcours réel, joué** sur le faux hub (`PONT/EDT/tests/hub/`) — joué au tour 14 : panneau prof → atelier → chapitres → « Modifier » → onglet Déroulé (préparation) → séance « Étude de texte accompagnée » → l'écran de la carte ; **pas joué** : « Lancer » depuis l'emploi du temps, la classe en direct, la relecture (p8 n'y touche pas ; le mandat de production devra les jouer).
- **Z2 · le pont et le cadre** (`_dr*`, le script `pont-fusion`) : onglets, sommaire, régimes, temps, T-5, reprise, vécu. — lu en structure (tour 13), ci-dessous
- **Z3 · le moteur** (157 fonctions) : rendu des blocs, schémas, participation, récit, dévoilement, gel. — schémas lus ligne à ligne (tours 10-11) ; le reste lu en structure (tour 14), ci-dessous
- **Z4 · l'éditeur de chapitre et l'atelier** (`ed*`, `at*` hors moteur, `ch*`, fiches, feuilles, import « Compléter le chapitre », prompts au hub). — lu en structure (tour 13), ci-dessous
- **Z5 · l'emploi du temps et le calendrier** (`edt*`). — lu en structure (tour 13), ci-dessous
- **Z6 · le tableau distant et le cours actif** (`ses*`). — lu en structure (tour 13), ci-dessous
- **Z7 · le hub et les liens sortants** : les nœuds lus et écrits par Z2 à Z6 ; la dictée (`heure.seanceId`, la fiche de préparation), le profil, la taxonomie, les élèves et le PAP. — relevé des chemins (tour 13), ci-dessous
- **Z8 · la confrontation** : ce que Z1 à Z7 changent au mandat p8 (version 2) et au futur mandat de production. — fait au tour 14, ci-dessous

## Ce que chaque zone écrit ici
Par fonction ou groupe : ce qu'elle fait pour Paul (dans ses mots), sa taille, qui l'appelle, ce qu'elle lit et écrit au hub ; les gestes joués ; **ce que ça implique pour le mandat**.

---
*« Lu en structure » : chaque fonction de la zone a été relevée avec son rôle (son premier commentaire), sa taille et les chemins du hub qu'elle cite — l'index complet est la pièce `CARTE-EXISTANT-INDEX-FONCTIONS.md`. Ce n'est pas une lecture ligne à ligne : celle-ci est faite là où le mandat touche (les schémas, tours 10-11) et se fera, zone par zone, là où un mandat touchera.*

## Z2 · Le pont du déroulé (`_dr*`, 58 fonctions, 78 Ko)
- **Le cadre** : le moteur (`deroule86.html`) tourne dans une iframe, vérifiée à son empreinte au démarrage (`_drVerifier`) ; le site l'enveloppe sans jamais modifier son fichier (`_drEnvelopper`, 18 Ko : suivi de l'écran courant, vécu) ; il masque au runtime la barre et les vignettes du moteur, qui feraient doublon (`_drHabiller`) ; la boîte suit le partage d'écran (`_drTailleCadre`).
- **L'identité** : toute trame qui entre est identifiée (`_drNormaliserTrame`, LOT C2) ; un « fils du zoom » (morceau d'écran) n'a jamais d'identité propre : le vécu, la participation et les décisions s'ancrent au père (`_drEidDuRang`, `_drRangPere`, `_drVuePere`) ; chaque appareil a son rang local (`_drRangDeLEid`).
- **La trace de l'heure** : le paquet de l'heure (`_drPaquetHeure`), écrit au fil (débounce 900 ms, `_drTraceAuto`) et repris dans le même créneau (`_drTraceReprendre`) ; une heure close ne se reprend plus (`_drHeureCloseAu`) ; `cours_actif` n'est que le reflet de la trace ouverte (`_drCoursActifEffacerSi`).
- **La copie de la classe** suit au fil (`_drCopieAuto`) ; en classe, rien ne remonte à la préparation ; les étapes coupées se recollent avant export, copie, relecture et récit (`_drRecollerEtapes`, `_drRefusionner`).
- **Le direct** : le champ des initiales pour la participation (`_drVifInstaller`, ² ou F2), la palette Maj+Espace (`_drPaletteOuvrir`) ; les prénoms viennent de la classe réelle (`_drPrenomsDeLaClasse`), jamais du trombinoscope de maquette.

## Z4 · L'éditeur de chapitre et l'atelier (`ed*` 83, `at*` 247, `ch*` 30, `fiches` 18)
- **Deux éditeurs** : l'atelier des feuilles (`at*` : composantes, charte, aperçu navigable élève par élève, impression, dépôt et envoi aux élèves, archives et différentiel, prompts IA et injection vérifiée) et l'éditeur de chapitre (`ed*`, `ed2*` : séances et items, insertion, déplacement, duplication, publication, papier A4 paginé à la mesure, liaisons proposées entre feuilles et items).
- **L'import d'un chapitre** (`ch*`) : trois voies d'injection, écriture par index, validation à motifs accumulés, inventaire face à face, sommaire calculé, vocabulaire de la taxonomie généré.
- **Le déroulé dans l'atelier** (`atDr*`, `atSom*`, `atT5*`, `atVecu*`) : le bandeau du déroulé (`atDrMonter`, « porte n°3 » depuis l'EDT), « Jouer » (`atDrJouer` : la copie horodatée au démarrage, une par classe ; le professeur a tous les droits, on avertit, on ne bloque jamais), le sommaire natif des écrans, le T-5 (dans le bandeau, plus sur la scène), la clôture et la reprise d'une heure (`atDrReprendre`, chemin `heures/`), l'import de déroulés par une IA (`atP2*`), Relecture et Papier = les vues déjà construites du moteur (`atDrVueInterne`).
- **Les fiches des applications** (`fiches*`) : l'état « à jour » de chaque app, l'alerte bloquante à l'ouverture du panneau prof.

## Z5 · L'emploi du temps et le calendrier (`edt*`, 230 fonctions, 236 Ko)
- La grille (versions datées, créneaux, périodes, semaines A/B jamais déduites d'une parité), les dates de l'année et du brevet, l'injection par prompt avec reconduction des identités et différentiel nominatif.
- La projection de la semaine, du mois, de l'année ; les heures perdues, banalisées, ajoutées, à replacer (trois issues : échanger, écraser, déplacer) ; les absences ; la photo du prévu (automatique aux échéances).
- **Le lien avec le déroulé** : le chapitre en cours d'une classe (`edtChapitreEnCours`), la file des séances qui attendent (`edtFileDAttente`), la trace d'une heure (`edtChercherTrace`, `edtCheminTrace`), et **« Lancer »** (`edtLancer` → `edtQuandPilotagePret`, qui attend le bandeau du déroulé et ses trois champs).

## Z6 · Le tableau distant, le téléphone, la session (`ses*`, 47 fonctions, 55 Ko)
- **Trois appareils** : le pilote (l'ordinateur), le tableau distant (`?vue=tableau`, « un terminal muet : il peint ») et le téléphone (`?vue=tel`).
- **Le téléphone est une télécommande**, raccordée par le QR (corrigé au tour 14, sur la remarque de Paul : « non, tout ne doit pas rentrer dans l'écran de téléphone, il sert de télécommande grâce au QR code justement ») : lu dans `sesBootTel` et `sesTelPeindre`, il porte un prompteur (des cartes de texte : le libellé du bloc et ses 220 premiers caractères, les réponses à taper), la palette (◀ replier, ▶ dévoiler, écran précédent / suivant, gel, à écrire, chrono, au tableau, qui a participé, + participation) et la télécommande du zoom du tableau (deux gros boutons, crans 1 à 5). **Il ne dessine pas les schémas.** Il monte le moteur caché pour rejoindre la copie jouée et envoyer les gestes.
- Le tableau distant monte le moteur dans une iframe cachée (`sesTabMonter`) : ce qui s'affiche au tableau est le dessin du moteur.
- La scène passe par une **photo** (`sesPhoto`, l'équivalent côté données de l'envoi au tableau) ; le moteur écrit le rang de l'écran dans la part (`sesPartEmettre`) ; la reprise d'un cours en cours sur tout appareil (`sesReprendre`).
- **Le QR existe** (`sesQROuvrir`, `qrScans`) : raccorder un appareil par QR est déjà dans le site — le point « QR code » du cadrage 1 §14 n'est pas à inventer.

## Z7 · Le hub (chemins relevés dans le code, hors moteur)
- `site/<niveau>/chapitres/<n>/seances/<s>/items` (le chapitre, ses séances, ses items ; la trame du déroulé est portée par la séance) ; `deroule_joue` (la copie de chaque classe) ; `heures` (la trace d'une heure) ; `site/cours_actif` (le reflet de la trace ouverte) ; `site/edt/{grille,creneaux,calendrier}` ; `site/config/brevetDates` ; `site/atelier/{documents,prompts,prompts_archives,envois,config}` ; `site/textes/seanceSansDoc` ; `site/annonces` ; `taxonomie` ; `classes`, `eleves`, `amenagements` ; `qrScans`.
- **Les liens sortants** : la dictée s'accroche à l'heure (`heure.seanceId`, passation C12→C13) ; la fiche de préparation de la dictée sortira au format de l'éditeur (une fiche dans une feuille du chapitre, tranché par Paul le 05/10) — elle arrivera donc dans `site/atelier/documents` et se liera à un item de séance comme toute feuille.

## Ce que Z2 à Z7 impliquent déjà (avant Z8)
- **Pour le mandat p8 (maquette)** : rien ne le contredit. La règle « la classe garde sa copie » (p8-3) est celle de l'existant (`atDrJouer` : copie horodatée au démarrage, une par classe).
- **Pour le futur mandat de production** : le dessin des schémas sert **deux écrans** (le pilote et le tableau distant) ; le téléphone, télécommande, reçoit seulement la carte de texte du schéma et le geste ▶ ; le dévoilement « une bulle par ▶ » passera par la photo de scène et la part (`sesPhoto`, `sesPartEmettre`) ; « Lancer » depuis l'emploi du temps attend le bandeau du déroulé et ses trois champs (`edtQuandPilotagePret`) : tout nouveau pilotage doit tenir ce contrat ou le remplacer explicitement.
- **Pour les cadrages** : le QR existe (Z6) ; le point « QR code » du cadrage 1 §14 se ferme sur l'existant.

## Z1 · Joué le 05/10 (tour 14) — le déroulé en préparation et la vraie carte
- Pièces : `T14-Z1-deroule-preparation.png`, `T14-Z1-vraie-carte-existant.png` (1536 × 864).
- **Le déroulé en préparation** : quatre onglets (Structure · Déroulé · Relecture · Papier) ; à gauche le chapitre, ses documents et ses séances horodatées ; la colonne des écrans ; la scène ; dessous la palette (◀ ▶, Gel, Mettre en lumière, À écrire, G, S, quatre couleurs, Annuler, la réglette 32 pt, le chrono, Départ, Chrono au tableau, Qui a participé, Ouvrir le tableau) ; à droite « Ajouter à cet écran » (+ Consigne, + Fiche, + Question, + Schéma, + Image) ; en tête : la classe, le créneau, le début, « maintenant », le temps utile, « Lancer la séance », « Emploi du temps », l'appoint.
- **La vraie carte « Les figures de style »** (séance « Étude de texte accompagnée », écran 15/18) : huit familles colorées, vingt-sept notions en bulles, dessinées au milieu de la scène, **notions visiblement minuscules** (la mesure de leur taille au navigateur n'a pas abouti : je ne donne pas de chiffre). Le panneau « SCHÉMA » à droite : la forme (Carte mentale · Frise · Arbre · Cycle · Tableau), **« Un à un / Tout ensemble »** (ici « Tout ensemble »), « Contenu » avec la règle d'écriture sous le champ (« Une famille par ligne, membres après « : », séparés par des virgules »), **« ⌖ Réordonner »** ; « + Schéma » **grisé** : l'écran a déjà son schéma.

## Z3 · Le moteur au-delà des schémas (lu en structure, tour 14)
- L'écran : `rendre` (8 Ko), `html`, `cls` (les marques), `ouvre` (la fiche, jamais montrée à la classe), `borneRev` (le dévoilement ne dépasse jamais le contenu), `elems` (ce qui se dévoile dans un bloc), `devoile` / `replie`, `gel`, `zoom` (les suites n'existent que par le zoom ; `reabsorbe`, `supprimeSuite`).
- Le texte trop long : `coupeTexte`, `scinde`, `degorge`, `verifDeborde` — « rien n'est jamais refusé : on coupe » (le moteur coupe seul ; la base saine l'a remplacé par le geste de Paul, cadrage 4 · 0.4).
- La participation et le récit : `partAjoute`, `partRetire`, `histoire`, `ouvrirPart`, `corrigePart`, `rendRecit`, `recit`, `imparfait`, `citations`, `copierED` (le collage vers École Directe).
- Le tableau : `tableau` (9 Ko), `cale` (« même loi que le pilotage : 32 pt = 5,6 % de la hauteur »), `envoie` (le point de sortie unique vers le tableau), `allumeTableau` (gel : le tableau ne reçoit rien), `majVignette`.
- La préparation : `reglages` (le panneau de droite, jamais reconstruit pendant qu'on y écrit), `ajoute`, `menuEcran`, `selVide`, `selSup`, `forme` (glisser les blocs par leur bordure), `blocImg`, `marquePris`, `calibreMarques`, `supMk` (les marques des images).

## Z8 · La confrontation avec le mandat p8 (tour 14)
- **Le mandat version 2 ne tenait pas** sur trois points, lus ou joués ici : il traitait « Un à un / Tout ensemble » comme un état à abandonner, alors que c'est un réglage de préparation, visible à l'écran ; il ne reprenait pas le panneau du schéma (forme, contenu et sa règle d'écriture, « ⌖ Réordonner ») ; il oubliait qu'on tire un point de frise pour changer sa date. **Corrigé en version 3.**
- « + Schéma » grisé quand l'écran a déjà son schéma : **c'est déjà l'existant** (la décision 1 le confirme).
- **Une question à Paul** : l'existant affiche « Tout ensemble » quand rien n'est réglé ; le cadrage 4 §3.2 dit « élément par élément ».
- Le reste du mandat tient : rien de lu ni de joué ne le contredit.

## Pour le mandat de production — ce que l'import fait aujourd'hui des schémas (mesuré le 06/10, tour 21)
- **Paul, 06/10** : « au json, une instance ne pourra jamais faire ces absurdités ».
- **Mesuré dans le code** : `atP2ValiderDeroule` vérifie seulement que chaque bloc a un type connu (consigne, fiche, question, schema, image), qu'une question n'est pas vide, qu'une image a sa source. **Il ne refuse ni deux schémas sur un écran, ni un schéma noyé dans du texte.** Ce « jamais » devient vrai quand le mandat de production écrit ces refus dans la validation de l'import (décision 1 du mandat p8), avec le message dans les mots de Paul et la marche à suivre.
- **Mesuré dans le code** : `atP2NormaliserBloc` reconstruit un schéma importé comme `{id, t:'schema', forme, titre, z:1, pos:{}, src, vues:0}`. Il **perd le réglage « Un à un / Tout ensemble »** (`devoilerTout`) et les places à la main (`pos`). Un schéma injecté arrive donc toujours « Tout ensemble ». Le JSON étant la voie principale de Paul, le contrat d'injection et l'import devront porter ce réglage (décision 6 ter du mandat p8 : un schéma créé part « Un à un »).
