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
- **Z1 · le parcours réel, joué** sur le faux hub (`PONT/EDT/tests/hub/`) : l'emploi du temps → « Éditer dans l'atelier » / « Préparer » → le déroulé → « Lancer » → le tableau → la fin d'heure → la relecture ; captures d'écran entier. — pas fait
- **Z2 · le pont et le cadre** (`_dr*`, le script `pont-fusion`) : onglets, sommaire, régimes, temps, T-5, reprise, vécu. — lu en structure (tour 13), ci-dessous
- **Z3 · le moteur** (157 fonctions) : rendu des blocs, schémas, participation, récit, dévoilement, gel. — lu : les schémas seulement (tours 10-11)
- **Z4 · l'éditeur de chapitre et l'atelier** (`ed*`, `at*` hors moteur, `ch*`, fiches, feuilles, import « Compléter le chapitre », prompts au hub). — lu en structure (tour 13), ci-dessous
- **Z5 · l'emploi du temps et le calendrier** (`edt*`). — lu en structure (tour 13), ci-dessous
- **Z6 · le tableau distant et le cours actif** (`ses*`). — lu en structure (tour 13), ci-dessous
- **Z7 · le hub et les liens sortants** : les nœuds lus et écrits par Z2 à Z6 ; la dictée (`heure.seanceId`, la fiche de préparation), le profil, la taxonomie, les élèves et le PAP. — relevé des chemins (tour 13), ci-dessous
- **Z8 · la confrontation** : ce que Z1 à Z7 changent au mandat p8 (version 2) et au futur mandat de production. — pas fait

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
- **Trois écrans** : le pilote (l'ordinateur), le tableau distant (`?vue=tableau`, « un terminal muet : il peint ») et le téléphone (`?vue=tel`, un pilote de poche : prompteur, palette, cran par cran, chrono, +1 de participation).
- **Le tableau distant et le téléphone montent le moteur dans une iframe cachée** (`sesTabMonter`, `sesTelChercherCours`) : ce qui s'affiche au tableau est le dessin du moteur.
- La scène passe par une **photo** (`sesPhoto`, l'équivalent côté données de l'envoi au tableau) ; le moteur écrit le rang de l'écran dans la part (`sesPartEmettre`) ; la reprise d'un cours en cours sur tout appareil (`sesReprendre`).
- **Le QR existe** (`sesQROuvrir`, `qrScans`) : raccorder un appareil par QR est déjà dans le site — le point « QR code » du cadrage 1 §14 n'est pas à inventer.

## Z7 · Le hub (chemins relevés dans le code, hors moteur)
- `site/<niveau>/chapitres/<n>/seances/<s>/items` (le chapitre, ses séances, ses items ; la trame du déroulé est portée par la séance) ; `deroule_joue` (la copie de chaque classe) ; `heures` (la trace d'une heure) ; `site/cours_actif` (le reflet de la trace ouverte) ; `site/edt/{grille,creneaux,calendrier}` ; `site/config/brevetDates` ; `site/atelier/{documents,prompts,prompts_archives,envois,config}` ; `site/textes/seanceSansDoc` ; `site/annonces` ; `taxonomie` ; `classes`, `eleves`, `amenagements` ; `qrScans`.
- **Les liens sortants** : la dictée s'accroche à l'heure (`heure.seanceId`, passation C12→C13) ; la fiche de préparation de la dictée sortira au format de l'éditeur (une fiche dans une feuille du chapitre, tranché par Paul le 05/10) — elle arrivera donc dans `site/atelier/documents` et se liera à un item de séance comme toute feuille.

## Ce que Z2 à Z7 impliquent déjà (avant Z8)
- **Pour le mandat p8 (maquette)** : rien ne le contredit. La règle « la classe garde sa copie » (p8-3) est celle de l'existant (`atDrJouer` : copie horodatée au démarrage, une par classe).
- **Pour le futur mandat de production** : le dessin des schémas doit servir **trois écrans** (pilote, tableau distant, téléphone), qui montent tous le moteur ; le dévoilement « une bulle par ▶ » passera par la photo de scène et la part (`sesPhoto`, `sesPartEmettre`) ; « Lancer » depuis l'emploi du temps attend le bandeau du déroulé et ses trois champs (`edtQuandPilotagePret`) : tout nouveau pilotage doit tenir ce contrat ou le remplacer explicitement.
- **Pour les cadrages** : le QR existe (Z6) ; le point « QR code » du cadrage 1 §14 se ferme sur l'existant.
