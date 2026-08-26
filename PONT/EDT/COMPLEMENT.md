# LOT 2bis — COMPLÉMENT AVANT PROMOTION (conscience n°10, cadrage de Paul des 26/08, tours 138-140)
*Base : ton candidat au sas, `PONT/EDT/index.html`, 8.71.0, md5 `f0fca98748077a6e5d41d468b00b357b`, 1 614 210 o. Audité, sans dette, garde VERTE et rouge sur trois contrôles négatifs refaits par la conscience. **Paul ne promeut pas avant ce complément.***

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul
« très régulièrement, la respo edt me dit que j'ai une heure qui change, qui se décale etc. Donc je dois pouvoir faire ça, glisser déposer une séance. et il faut bien que le site me distingue que je change L'HORAIRE, l'unité de temps, et que ça n'a rien à voir avec le contenu prévu. »
« oui évidemment l'ancien créneau reste vrai avant cette date. sinon on casse tout ce qui est déjà joué, or on ne modifie pas le passé, on le fige (sauf cas particulier type relecture etc). »
« actuellement on raisonne sur de l'emploi du temps provisoire. à la rentrée on pourrait me dire que finalement j'ai une heure le vendredi en fin d'après-midi jusqu'à la fin de l'année. »
« pourquoi le glisser déposer est important pour moi, parce que je suis visuel, et que je raisonne sur mon edt affiché en semaine, mois année. j'ai besoin d'entrer par la case de la grille. »
En clair : l'emploi du temps de Paul **change en cours d'année**, plusieurs fois, à des dates qu'il ne connaît pas d'avance. Aujourd'hui ton candidat n'a qu'une grille, valable pour toute l'année : le jour où un créneau change, **les semaines déjà jouées deviendraient fausses**.

---

## ① LA GRILLE DEVIENT UNE SUITE DE VERSIONS DATÉES
`/site/edt/grille/<annee>` porte aujourd'hui `{annee, source, creneaux[…], creneauxFictifs, …}`. Il portera **une liste ordonnée de versions**, chacune avec sa date d'effet :
```
{ annee, source, versions:[ { debut:"2026-09-01", libelle:"rentrée", creneaux:[…] },
                            { debut:"2026-11-03", libelle:"changement du 3 novembre", creneaux:[…] } ] }
```
- **`edtGrilleA(iso)`** rend la version en vigueur à cette date : la dernière dont `debut <= iso`. Toute lecture de cases passe par elle — `edtCasesDuJour`, `edtProjeter`, `edtPeindreSemaine`, `edtPeindreMois`, `edtPeindreAnnee`, la vue Année comprise.
- **Compatibilité obligatoire** : un objet à l'ancienne forme (`creneaux` à la racine, sans `versions`) est lu comme **une seule version datée du 1er août** de l'année scolaire. Aucune réinjection n'est exigée de Paul, et le JSON déjà validé au sas reste valable. Le prompt de la grille produit désormais la forme `versions` avec une seule entrée.
- **Le passé ne bouge pas** : une semaine affichée lit la version de **sa** date. Une trace d'heure déjà jouée garde le créneau qu'elle porte, quoi qu'il arrive à la grille — c'est déjà ta règle sur les créneaux horaires, elle s'étend ici.
- **L'écran des versions**, dans la section Emploi du temps du panneau prof : la liste des versions avec leur date d'effet et leur libellé, la version en vigueur aujourd'hui marquée ; ajouter une version (à partir d'une date), la renommer, changer sa date, la supprimer. Refus nommés : deux versions à la même date, une date hors de l'année scolaire, une version sans aucun créneau.

## ② DEUX GESTES, JAMAIS CONFONDUS
Quand Paul agit sur une case, le site doit savoir — et **dire** — lequel des deux il fait.
- **CHANGEMENT D'EMPLOI DU TEMPS** — l'horaire, l'unité de temps. « Cette classe n'est plus à ce créneau, elle est là désormais. » → écrit **dans la grille** : une nouvelle version datée (ou la version en vigueur si elle commence à cette date), le créneau retiré d'un côté, ajouté de l'autre. **Aucun contenu n'est touché** : ni séance, ni chapitre, ni décision, ni trace. Le prévu se recalcule sur la nouvelle version. Le geste demande **une date d'effet**, proposée au lundi de la semaine affichée, modifiable ; le libellé est libre.
- **DÉPLACEMENT D'UNE HEURE** — un contenu, une fois. C'est ce que tu as déjà codé (`edtDeplacerVers`) : deux décisions, départ vidé, arrivée épinglée, ↶ Annuler des deux côtés. La grille ne bouge pas.
**Marques distinctes sur la grille** : une heure déplacée garde son 📌 ; un créneau né d'un changement d'emploi du temps ne porte **aucune épingle** — c'est un créneau ordinaire de la nouvelle version — mais la semaine affiche discrètement « emploi du temps modifié le <date> » quand la version en vigueur n'est pas la première.
**Journal** : les changements d'emploi du temps s'écrivent dans un journal à eux (date du geste, date d'effet, ce qui a changé), lisible dans l'écran des versions. Les déplacements restent dans le journal des décisions horaires. Deux journaux, deux natures.

## ③ LE GLISSER-DÉPOSER — le geste d'entrée, pas un supplément
Paul est visuel et **entre par la case**. La liste dans la modale reste, mais elle devient le second chemin.
- **Sur la vue Semaine** : une case portant une séance se saisit et se dépose sur une autre case. Souris **et** doigt (pointer events, comme la modale). Pendant le glissé : la case de départ s'estompe, les cases où le dépôt est possible s'éclairent, celles où il est impossible restent inertes.
- **Au dépôt, une question en un clic** : « **Changement d'emploi du temps** (durable, à partir du …) » ou « **Déplacer cette heure** (une fois) » — deux boutons, la date d'effet modifiable sur le premier, rien d'autre. Échap ou un clic ailleurs annule le glissé sans rien écrire.
- **Sur la vue Mois** : le même geste, d'un jour vers un autre — le créneau visé est choisi dans la question du dépôt quand le jour d'arrivée en a plusieurs. **Sur la vue Année** : pas de glisser-déposer (l'échelle ne le permet pas), et c'est à dire à l'écran plutôt qu'à laisser deviner.
- **Ce qu'un dépôt ne peut jamais faire** : écraser une case déjà occupée par une autre classe sans le dire (il propose alors l'échange ou refuse, nommément), poser une heure dans le **passé**, poser sur un **jour sans cours** (vacances, férié), poser le mercredi après-midi.
- **Accessibilité** : tout ce que le glissé permet reste possible sans lui, par la modale — un clavier ou une main qui tremble ne doit pas priver Paul d'un geste.

## ④ DÉPLACER PLUS LOIN, ET SUR UN TROU
Paul a répondu **oui** aux trois : au-delà de 21 jours, sur un trou de son emploi du temps, et par glisser-déposer.
- **Au-delà de 21 jours** : `edtCreneauxOu` ne s'arrête plus à trois semaines. La liste couvre **jusqu'à la fin de l'année scolaire**, groupée par semaine, avec un champ de recherche par date si elle est longue. Les jours sans cours restent exclus.
- **Sur un trou** : la liste propose aussi les **créneaux libres de l'emploi du temps de Paul** (un créneau de la grille où il n'a aucune classe, ou un créneau horaire vide ce jour-là), marqués « créneau libre — heure ajoutée ». Poser une heure là n'est pas un déplacement : **c'est une heure ajoutée** ; elle est épinglée, dite comme telle dans la modale et au journal, et compte dans la prévision horaire de la classe.
- **Refus nommés** : jamais sur un créneau où Paul a déjà une autre classe (sauf échange explicite), jamais un jour sans cours, jamais dans le passé.

## ⑤ CE QUE ÇA NE DOIT PAS CASSER
Rien de ce qui est déjà prouvé ne doit changer de comportement : la porte du pilotage (six champs), le prévu, les décisions horaires et ↶ Annuler, les photos, la divergence, la classe expérimentale, l'absence, les périodes, le sans-scroll, les trois portes, les trois exceptions. **Le contrat ne s'élargit pas** : si un appel nouveau est nécessaire, il entre dans `verif_edt.py` avec sa raison, jamais en silence.

## ⑥ PREUVES EXIGÉES — chacune mesurée, aucune affirmée
1. **Versions datées** : grille à deux versions (1er septembre, 3 novembre) où la 4e Hugo passe du mardi 13:00 au jeudi 11:04 → la semaine du 7 septembre montre le mardi, celle du 9 novembre montre le jeudi, **la même page, deux dates**. Capture des deux.
2. **Le passé ne bouge pas** : une heure jouée le 8 septembre au créneau d'alors reste affichée à ce créneau après un changement d'emploi du temps daté du 3 novembre — trace inchangée au hub, champ à champ.
3. **Compatibilité** : le JSON de grille déjà validé (forme sans `versions`) se charge, se lit, s'affiche — **aucune réinjection exigée**. Mesuré sur le fichier du sas tel quel.
4. **Glisser-déposer, choix « déplacer cette heure »** : la grille glisse comme aujourd'hui, deux décisions au hub, ↶ Annuler défait les deux côtés — **identique au geste par la liste**, comparé champ à champ.
5. **Glisser-déposer, choix « changement d'emploi du temps »** : une version datée apparaît dans la grille, **zéro décision horaire écrite**, zéro trace touchée, le prévu recalculé sur la nouvelle version. Journal des changements d'EDT : une ligne.
6. **Dépôts refusés** : sur un jour de vacances, sur le mercredi après-midi, dans le passé, sur une case d'une autre classe → **quatre refus nommés**, capture de l'un d'eux.
7. **Heure ajoutée sur un trou** : proposée dans la liste, marquée « créneau libre », épinglée après le geste, comptée dans la prévision.
8. **Déplacement lointain** : un créneau de mai proposé et retenu depuis une case de septembre.
9. **Sans glissé** : tout ce qui précède reste faisable par la modale (le banc rejoue le 4 et le 5 sans glissé).
10. **Sans scroll** toujours vrai (1366×768 et 1920×1080, `scrollY` 0 après tentative à 4000 px) · **garde VERTE** et **rouge sur les trois contrôles négatifs** · **moteur intact** · `secu*` 29 · `published` 97 · double parseur vert · **matrice actions × état** refaite, glissé compris.

## ⑦ MÉTHODE
Livraisons courtes, chacune poussée au sas et close par un arrêt ; Paul relance par « continuer ». Découpe proposée : **①** versions datées + compatibilité + écran des versions · **②** glisser-déposer et la question du dépôt · **③** déplacement lointain, trou, refus nommés · **④** bancs complets, garde, matrice, rapport de complément.
**Aucune dette à la livraison finale.** Rapport écrit pour une conscience qui n'a pas vu la conversation.
**La `SEQUENCE-TEST-PAUL.md` est à mettre à jour** (glissé, changement d'emploi du temps, heure ajoutée) : Paul la jouera **après** la promotion, comme d'habitude — ne la lui donne pas maintenant.
Livrable : `PONT/EDT/` — `index.html` (8.72.0), `rapport-complement.md`, `tests/` mis à jour, `SEQUENCE-TEST-PAUL.md` à jour, `outils/verif_edt.py` à jour. **STOP après chaque livraison. Ne promeus jamais.**
