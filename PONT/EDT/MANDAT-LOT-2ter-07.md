# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ⑦ · LA VUE ANNÉE
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 748 712 octets**, md5 **`966eaafd1e1f260c2cdef9e3826aebca`**, **210 fonctions `edt*`**, version affichée **8.73.0-⑥**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-⑦**.*

*Les livraisons ①, ②, ③, ③bis, ④, ⑤ et ⑥ sont closes et auditées. Tu t'appuies dessus, tu n'y reviens pas.*

## ⚠ MÉTHODE IMPOSÉE POUR CET ÉCRAN — MAQUETTE AVANT CODE

**C'est le seul écran du lot entièrement visuel. Tu ne touches pas au site tant que Paul n'a pas vu ton rendu.**

**Livraison ⑦-a** : tu produis **un rendu statique** de la vue Année, **sur le calendrier réel** (`PONT/EDT/json/calendrier-2026-2027.json` + `grille-2026-2027.json`), en fichier HTML autonome au sas, **avec ses captures**. **Puis tu t'arrêtes.** Paul compare ton rendu aux quatre maquettes qu'il a validées et te relance.

**Tu n'écris pas une ligne dans `index.html` avant son mot.**

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **à gauche, ce sont LES DATES DES JOURS DU MOIS.** »

« **il faut reprendre le même principe que l'agenda google.** »

« **pourquoi y a-t-il des grandes barres jaunes verticales ?** » — aucun trait ne traverse les pistes.

« **je raisonne sur mon edt affiché en semaine, mois, année. j'ai besoin d'entrer par la case de la grille.** »

**Concrètement.** Paul a besoin de voir son année d'un coup d'œil : où sont les vacances, où tombent les sorties, quelles semaines sont déjà mangées, et où il en est de ses classes. Aujourd'hui il n'a rien de tel. **Cette vue est celle qu'il regardera pour préparer une séquence, pour répondre au chef d'établissement, pour savoir s'il peut caser un contrôle.**

## ⓪ LECTURES · JETON · CE QUI EXISTE DÉJÀ

**LES QUATRE MAQUETTES DE RÉFÉRENCE, VALIDÉES PAR PAUL, SONT AU SAS** — `TRANSCRIPTS/C10/pieces/` : **`T151-annee-agenda-v2.html`**, **`T152-annee-dezoome.html`**, **`T152-annee-zoome.html`**, **`T152-calendrier-annee.html`**. Vérifié : les quatre répondent. **Elles sont faites sur le calendrier réel. C'est l'écran à obtenir — tu ne le réinventes pas, tu le retrouves.** Ouvre-les avant toute chose.

**Lis ensuite** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` **§⑬** (le cadrage complet, il fait foi) · `PONT/EDT/rapport-2ter-06.md` · `outils/verif_edt.py` (cinq questions). **`index.html` fait 1,75 Mo : ne le lis jamais en entier.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**RÈGLE DE NOMMAGE** : **tout nom de variable locale du bloc EDT commence par `edt`** — la garde a refusé deux livraisons de ce lot pour l'avoir ignoré.

**DEUX RÈGLES DE BANC, gravées par Paul :**
1. **UN BANC PASSE PAR LE GESTE, JAMAIS PAR LA FONCTION** — ce qui n'est pas atteignable par un clic n'est pas prouvé, **et se déclare comme tel**.
2. **UNE PREUVE DIT CE QU'ELLE CONTIENT**, pas seulement qu'elle existe.
**`tests/banc-tout.mjs` existe** : ajoute-lui tes bancs, **rejoue-le entier avant de livrer**, publie son compte-rendu.

**CHERCHER AVANT DE FABRIQUER — mesuré dans le candidat :**
- **`edtPeindreAnnee` existe déjà** (2 occurrences) et **`edtEvenementJustifie` n'a qu'un seul appelant : elle.** C'est là que la pastille se branche.
- **`edtJourSansCours`** (6 occurrences) sait déjà dire si un jour n'a pas cours : les jours aplatis s'appuient dessus.
- **`EDT_VUE`** (15 occurrences) porte l'état des vues.
- **Le calendrier réel** : **52 semaines · 7 vacances · 11 fériés · 30 jalons · 59 événements d'établissement · 15 événements de classe.** C'est ce que la vue doit afficher, en entier.

## ① LA FORME — douze mois en colonnes, les jours en lignes

1. **Douze colonnes**, août → juillet. **Les jours en lignes, 1 à 31.** Chaque ligne porte **le numéro du jour et l'initiale du jour**. **La frise par classe est abandonnée.**
2. **Les événements sont des bandeaux** sur les jours qu'ils occupent : un séjour de trois jours est **un bandeau de trois jours**, pas trois marques. **Empilés** quand ils se chevauchent, tronqués proprement, **libellé complet au survol et au clic**.
3. **Trois natures, trois couleurs** : événement d'établissement · événement de classe · jalon. **Une légende** dit les trois couleurs, les pastilles et les jours aplatis.
4. **Vacances et fériés** : **fond de case**, pas bandeau.
5. **Un événement à cheval sur deux mois donne DEUX bandeaux**, un par colonne, **avec une marque de continuité** — `→` en fin de mois, `←` en tête du suivant. **Une colonne ne déborde jamais sur la suivante.**
6. **AUCUN TRAIT NE TRAVERSE LES PISTES.** C'est la remarque de Paul sur la version précédente : pas de barre verticale qui coupe l'écran.

## ② CE QUE MJPC AJOUTE — les pastilles

Pour chaque jour, **une pastille par classe**, **quatre au maximum** :
- **jouée : vert** · **prévue : gris** · **sans séance : ambre**.

**La pastille de l'événement** : elle s'allume **dès qu'une seule** des heures que cet événement recouvre est marquée, et s'éteint quand plus aucune ne l'est. **C'est la règle tranchée par Paul le 31/08**, portée désormais par cette vue — `edtEvenementJustifie` existe et n'attend que d'être branchée ici.

## ③ LES JOURS APLATIS

**Week-ends, vacances et fériés sont réduits au minimum de hauteur** — **numéro et initiale toujours lisibles** — et **la hauteur libérée va aux jours de cours**. C'est ce qui permet à l'année entière de tenir sur une page.

## ④ LE ZOOM

- **Ctrl + molette.**
- **Dézoomé, l'année entière tient sur une page** — **c'est l'état par défaut**.
- **Zoomé**, les libellés se lisent en entier et **le défilement horizontal est autorisé : c'est le seul écran de l'emploi du temps où il l'est.**

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT — ne l'anticipe pas

- **Les photos du prévu, la matrice, `SEQUENCE-TEST-PAUL.md`** : livraison ⑧.
- **La passe de simplification des textes affichés** : dette à part. **Mais n'aggrave pas** : écris tes textes dans les mots de Paul.
- **Rien du calcul des heures perdues, des motifs, de l'appariement** : tout cela est clos. **Tu affiches, tu ne recalcules pas.**

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ⑤ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`function edt*` 210**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels**.
- **`EDT_CATEGORIES` et `EDT_MOTIFS` inchangés**, mot pour mot.
- **Les comptes d'heures perdues sont identiques avant et après** : cette vue **affiche**, elle ne recalcule rien.
- **La classe d'essai reste invisible hors mode test** : 30 créneaux, comptes par classe inchangés.
- **`banc-tout.mjs` VERT en entier** · **double parseur vert** · **garde verte sur ses cinq questions**.

## ⑥ PREUVES EXIGÉES — mesurées, aucune affirmée

1. **⑦-a — le rendu statique** : ton fichier au sas, ses captures **dézoomée et zoomée**, **sur le calendrier réel**. Dis ce que tu as repris des quatre maquettes et ce dont tu t'es écarté, avec ta raison.
2. **Tout y est** : **12 colonnes**, **52 semaines**, **7 vacances**, **11 fériés**, **30 jalons**, **59 événements d'établissement**, **15 de classe** — comptés à l'écran, comparés au JSON.
3. **Un séjour de trois jours est UN bandeau**, pas trois. Montre-le.
4. **Un événement à cheval sur deux mois** : deux bandeaux, marques `→` et `←`, **aucune colonne ne déborde**.
5. **Aucun trait ne traverse les pistes** : capture pleine page à l'appui.
6. **Dézoomé, l'année tient sur une page** : hauteur mesurée, sans défilement vertical.
7. **Zoomé, les libellés se lisent en entier**, et le défilement horizontal fonctionne.
8. **Jours aplatis** : hauteur d'un samedi comparée à celle d'un mardi de cours, **numéro et initiale lisibles dans les deux cas**.
9. **Les pastilles** : une par classe, **quatre au maximum**, trois couleurs. Montre un jour à quatre classes.
10. **La pastille de l'événement** s'allume dès **une** heure marquée, s'éteint à zéro. Deux mesures.
11. **Non-régression** : la liste chiffrée du §⑤, **`banc-tout.mjs` en entier**.
12. **Garde** : verte sur ses cinq questions, **et rouge sur cinq contrôles négatifs que tu poses toi-même**.
13. **Captures par clics** : entrer dans la vue depuis le panneau prof, dézoomer, zoomer, survoler un bandeau, cliquer un événement. Journal des clics.
14. **Audit adverse** : cherche ce qui casse. Un mois à 31 jours et un à 28 · un événement d'un seul jour · un événement de trois semaines · dix événements le même jour · un événement sans date de fin · une année sans aucun événement · le calendrier réinjecté pendant que la vue est ouverte · **une classe non appariée** (aucune pastille, et le site le dit).

## ⑦ MÉTHODE ET DÉCOUPE

**Trois livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **⑦-a** — **le rendu statique seul**, sur le calendrier réel, avec ses captures. **Aucune ligne dans `index.html`.** Version du fichier de maquette : `T-⑦a`. Rapport, puis **STOP — Paul compare et relance**.
- **⑦-b** — la vue dans le site : forme, bandeaux, jours aplatis, zoom (§① §③ §④). Version **8.73.0-⑦b**. STOP.
- **⑦** — les pastilles (§②), les captures, l'audit adverse, `banc-tout` en entier, le rapport final. Version **8.73.0-⑦**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison, avant la finale. **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑧ LIVRABLE

`PONT/EDT/T-7a-annee.html` (le rendu statique) et ses captures · puis `PONT/EDT/index.html` au sas (jamais en production) · `tests/banc-tout.mjs` enrichi · un rapport par livraison (`rapport-2ter-07a.md`, `-07b.md`, `-07.md`) · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑥, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.
