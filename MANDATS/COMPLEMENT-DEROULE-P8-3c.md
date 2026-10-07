# COMPLÉMENT — MAQUETTE p8 · livraison p8-3c : trois corrections avant que la maquette p8 serve de référence
*Conscience n°13, 06/10/2026 (C13, tour 20, élargi aux tours 22 et 24 après les tests de Paul). Soumis à Paul avant tout dépôt. Se lit après le mandat (version 3) et le complément p8-3b, qui restent en vigueur.*

## CE QUE ÇA CHANGE POUR LA CLASSE
La maquette p8 deviendra la référence du vrai site. Elle ne doit contenir ni fausse alerte, ni état impossible posé par une simulation, ni infobulle qui décrit l'écran au lieu de dire quoi faire.

### 1 · Le cahier de textes
« À régler » est la seule liste de ce que Paul a à faire (cadrage 4). Elle ne doit jamais contenir une fausse alerte. Aujourd'hui, chaque diapo « Cahier de textes » y apparaît comme « Objet non lisible « cahier » ». La diapo s'affiche pourtant (`test-cahier-p7` le prouve).

### 2 · La diapo 6 de l'heure 2 (« Les mouvements du siècle »)
Paul l'a testée le 06/10 (tour 22) : « + bloc » y est grisé, parce que la diapo porte une consigne de quatre lignes **et** un schéma. Cet état a été posé par la simulation `b-sim-schema` : la n°12 l'avait ajoutée en p7 pour montrer « trop dense », et le mandat p8-3 l'avait gardée. Or ce cas ne peut plus arriver : Paul, 06/10 (tour 21), « au json, une instance ne pourra jamais faire ces absurdités ». L'import le refusera (décision 1, mandat de production).
**Décision de Paul (tours 23 et 24)** : « plausible voulait dire schéma qui rentre dans une diapo normale, et schéma précédé d'une phrase de consigne, c'est tout. »
- La simulation `b-sim-schema` est retirée de la diapo 6 : la diapo redevient sa consigne seule, comme avant la p7.
- À sa place, **une diapo nouvelle juste après** (même heure, même activité) porte **une consigne d'une ligne, puis un schéma qui tient dans la diapo** :
  - la consigne est une phrase prise telle quelle dans le chapitre de la maquette, pas inventée ;
  - le schéma est une carte de trois familles de la vraie carte (« Figures d'analogie », « Figures d'opposition », « Figures d'insistance », avec leurs notions), dans les mots de Paul ;
  - mesure à zéro.
- La règle d'« À régler » (« Schéma avec du texte : donne-lui sa diapo ») reste dans le code. Un banc l'éprouve sur une **copie** des données, jamais sur ce que Paul joue.
- Les bancs qui exerçaient `b-sim-schema` (`test-p7-schema-envoi` et d'autres : tu les cherches tous) sont recalés sur cette diapo. La NOTE dit chaque vérification changée.

### 3 · Les infobulles des gestes grisés
Mesuré au tour 22 : l'infobulle de « + bloc » grisé commence par « Grisé : … ». Ce mot décrit l'écran ; il ne dit pas à Paul quoi faire. Toutes les infobulles des gestes grisés ajoutés en p8-3 (+ bloc, + étape, Schéma…, taille « petit », Coller, Dupliquer, Couper le schéma ici sur la première bulle) sont réécrites ainsi :
- jamais « Grisé » ni un mot qui décrit l'interface ;
- ce qui empêche, puis ce qu'il faut faire, dans les mots de Paul. Exemple pour « + bloc » : « Cette diapo a son schéma : écris la suite dans la diapo suivante, ou coupe : clic droit sur le schéma → Couper la diapo ici ». 

La NOTE donne la liste avant / après.

### 4 · Le bloc question au tableau (dettes n°13 · 4 et 5, déclarées par Paul le 06/10, tour 23, capture `TRANSCRIPTS/C13/pieces/T23-paul-repetition-question.png`)
- **Le chevron recouvert.** Au tableau, tant qu'aucune réponse n'est écrite, le chevron de la ligne de réponse vide est recouvert par la question suivante. Correction : aucune ligne du bloc ne se chevauche, réponse vide comprise. Mesure : les boîtes réelles, au pilote et au tableau.
- **La question suivante paraît d'emblée.** Seules les réponses se dévoilent, ce qui va contre le dévoilement au fur et à mesure (Paul). Tu mesures d'abord le modèle actuel du bloc question (ce qu'est un « élément »), et la NOTE le décrit. Puis :
  - **chaque question se dévoile à son tour (▶)**, jamais avant ;
  - ses lignes de réponse la suivent.
- Un banc, par le geste : un bloc à deux questions. Au premier ▶, la première question seule, au pilote et au tableau. Au ▶ suivant, la seconde. Aucun chevauchement à aucun moment.

## L'AUDIT DE p8-3b (conscience n°13)
**Ça va.** Le banc unique a été rejoué chez la conscience en trois lots : 26 bancs à 0. La maquette se régénère à l'identique (md5 `f3b4eb2b…`). La capture du morceau « Figures d'analogie » a été regardée : chaque trait va de la famille à sa notion.

## LA DETTE (préexistante : elle est déjà dans la maquette p7 validée)
Elle a été mesurée par la conscience dans `T265` (p7) et dans p8-3b. Dans les deux, « À régler » contient 2 lignes « Objet non lisible « cahier » » (diapos 9 et 22). Elle avait aussi été vue par l'exécutant (p8-3, « Ce qui reste »).
La cause est lue dans le gabarit : la liste `TYPES` du rendu de la diapo (`consigne, texte, question, fiche, schema, image, video, page, doc`) ne contient pas `cahier`. Le bloc tombe alors dans la branche « objet non lisible ».

## LA LIVRAISON p8-3c
Branche `deroule/p8-3c`, partie de `deroule/p8-3b`. Jamais `main`.
1. **Le cahier : corriger la cause, pas l'alerte.**
   - Si la diapo « Cahier de textes » a déjà son propre rendu, `cahier` entre dans la liste des objets connus.
   - Sinon, la NOTE dit ce qui s'affiche réellement à sa place.
   - Avant de corriger, tu cherches s'il existe d'autres types légitimes de la maquette absents de `TYPES`. La NOTE les liste.
2. **Un banc, par le geste** : ouvrir « À régler » au chargement, et compter **0** ligne « Objet non lisible » pour un objet que la maquette sait afficher, **et 0 ligne « Schéma avec du texte »**. Un vrai objet inconnu, et un schéma avec du texte posés dans une copie, restent signalés : l'épreuve du banc, comme en p8-1.
2 bis. **La diapo 6 de l'heure 2** : on y joue « + bloc » puis « Schéma… » : le schéma part sur la diapo suivante (le test de Paul, rejoué par le geste). La diapo « consigne d'une ligne + schéma » qui suit tient lisible (mesure à zéro).
2 ter. **Les infobulles** : un banc relève toutes les infobulles des gestes grisés et échoue si l'une contient « Grisé ».
3. **Les 26 bancs rejoués (recalés là où le point 2 l'exige), plus ces bancs, et le banc unique à 0.**
4. Livraison dans `LIVRAISONS/DEROULE/p8-3c/` : la NOTE (tailles avant et après de chaque fonction touchée), les bancs, les sorties, une capture d'« À régler » avant et après, une capture de la diapo 6 de l'heure 2 avant et après, le gabarit, les patches, la maquette, les empreintes. Puis tu t'arrêtes.
