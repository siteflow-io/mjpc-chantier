# CHANTIER T1 — intégration du déroulé · cahier vivant
*Tenu par la conscience n°7. Mode de travail en cours : développement DIRECT sur le clone d'`index.html`, livraisons locales coiffées (bac à sable), aucun push GitHub, aucune écriture Firebase — protocole établi par Paul le 20/08.*

## ÉTAT DE LA BASE
- Production en ligne : `index.html` **8.57.1** · md5 `54da80f2847d865b7f1aea5ad3fcb984` — INTACTE, rien n'a été promu.
- Clone de travail : `travail.html` (= 8.57.1 + bloc déroulé scellé + corrections conscience).
- Clone vérifié **fidèle** : 0 fonction, 0 id, 0 règle CSS, 0 variable de la production manquante ; 0 ligne supprimée ; le diff n'est que de l'ajout.
- Livraison T1 de l'exécutant au sas (`T1/index.html`, md5 `2e5029873f75579c383bb89745e0fb27`) : **à jeter** (décision de Paul) — deux colonnes gauches rivales, double barre d'onglets.

## FAIT (éprouvé au banc, captures vues)
1. **Colonne gauche unique** = le SOMMAIRE NATIF de l'éditeur (`ed2Documents`+`ed2Sommaire`), donc la corrélation à trois colonnes est préservée par construction (halo, défilement panneau+papier, retour depuis le papier). L'arbre parallèle de l'exécutant est supprimé.
2. **Doublons de la maquette masqués** : sa barre d'onglets interne et sa colonne « Écrans · séance ».
3. **Pliage des séances** : toutes visibles, une seule dépliée ; le chevron plie, le libellé garde son clic d'origine.
4. **Miniatures des écrans** (variante A) sous la séance, les documents restent des lignes.
5. **Deux régimes** : PRÉPARATION (mon cours préparé, au niveau — aucune classe, rien de projeté) / EN CLASSE (copie de la préparation, une par classe). Bandeau distinct, bascule par « Lancer la séance » / « Clore la séance ».
6. **Le temps au canon worktrack** : cours = objet partagé `{debut,fin}` écrit au lancement · fin CONNUE de l'EDT (ne bouge pas) · temps utile = fin − début − 5 min d'agenda. Vérifié sur l'exemple du cadrage : 10h14 → 11h02 = **43 min**. Créneaux EDT 2026-2027 embarqués. Heure de début saisie exactement (+ bouton « maintenant »), temps utile calculé AVANT le lancement.
7. **Le suivi n'existe qu'en classe** : « Où on en est », « Participation », « Temps par activité » retirés en préparation, avec une note qui explique ; le bouton « Qui a participé » masqué en préparation (prouvé : `none` en prépa, `block` en classe).
8. **Les autres outils restent dans les deux régimes** (chrono, gel, mise en lumière, à écrire, surligneurs) — décision de Paul : ils servent à prévoir, modifier, anticiper, et à éprouver la séance pour de vrai.
9. **Enregistrement automatique** de la préparation + confirmation verte datée (« Enregistré à jj/mm/aaaa hh:mm »), comme partout ailleurs dans l'éditeur ; signalement franc si la liaison manque. Le bouton manuel « Enregistrer la trame » est supprimé.
10. **Vocabulaire** : « trame » → « mon cours préparé » / « ma préparation ». À la clôture : « **Reprendre dans ma préparation** » (jamais « verser »).

## LE VÉCU DE LA SÉANCE — fait le 21/08 *(demandé par Paul)*
Le moteur calcule les horaires depuis les durées PRÉVUES (`horaires()`) : `h` dit ce qui était prévu, jamais ce qui a été vécu. On mesure donc à part et on écrit à la clôture, dans `deroule_joue/<classe>/vecu` : début et fin RÉELS · temps RÉEL par activité (horodatage à chaque changement d écran, via l enveloppe de `DR.va`) · passages · notions déclarées · décisions du T-5. Le panneau « Temps par activité » affiche le réel à côté du prévu, en orange au dépassement. Prouvé au banc : « Plan de la séance : prévu 4 / réel 12 ». C est la matière de la rétro-ingénierie : sans elle, l IA ne comparerait que du prévu à du prévu.

## RESTE À FAIRE (T1)
- ~~Bandeau T-5~~ → **FAIT et refondu** : il n'occupe plus la scène (il l'écrasait) ; appel discret dans le bandeau, détail dans une MODALE qui nomme l'activité, en donne un extrait, et **nomme les notions** qui ne seront pas travaillées (au lieu de « coût : 2 compétences », obscur). Formulation revue : « Ton cours devait finir à 08:55. Tu es allé 100 minutes au-delà du temps d'agenda. »
- ~~Horaires présentés comme des modifications~~ → **CORRIGÉ** : l'horaire est recalculé par le moteur au lancement, ce n'est pas une modification du professeur ; la comparaison porte désormais sur le CONTENU SIGNIFIANT (titre + textes), pas sur le JSON brut (qui inclut ids et compteurs du moteur).
- **« Reprendre dans ma préparation »** à la clôture : les modifications faites en classe RESTENT attachées à cette classe (règle : *rien ne circule entre classes*, remontée par geste explicite, jamais automatique) ; Paul peut en reprendre certaines dans sa préparation, **rien repris par défaut**.
- **Placement des miniatures** sous la séance active (elles se rendent, le placement est à recaler).
- Mémoire de la séance dépliée d'une fois sur l'autre (optionnel, à confirmer).

## QUESTION OUVERTE — LE MODE TEST DU DÉROULÉ *(point NEUF, non traité avec la n°6, soulevé par Paul le 21/08)*
MJPC a déjà un mode test (`m8TestOn`, `M8_TEST_STORE` en mémoire, rien n'est écrit ; classes isolées `_test_<nomapp>`). Paul veut pouvoir **éprouver la participation et le jeu sans rien enregistrer**.
**À trancher** : le déroulé de test vit-il dans une classe dédiée `_test_deroule` (comme les autres apps), ou par un drapeau sur la séance jouée ? À consigner au CADRAGE dès reprise des push.

## DETTE À VÉRIFIER — LE RENDU COMPLET DANS L'ÉDITEUR *(soulevée par Paul le 21/08)*
La loi `[LOT1-①]` est inscrite dans le code de production : **« sélection seule — plus de rendu complet ici »**, « un défilement POSÉ ne vaut pas un suivi », « pas de suivi juste après un geste ». Elle a été appliquée à la colonne du déroulé (prouvé : le nœud DOM est le même avant et après un clic).
**RESTE À VÉRIFIER** : le même défaut existe-t-il ailleurs dans l'éditeur de chapitre — clic sur un DOCUMENT du sommaire, sur une séance, retour depuis le papier ? Si oui, c'est un **défaut préexistant de MJPC**, hors périmètre du T1, à traiter comme dette propre. À mesurer (même méthode : comparer l'identité du nœud DOM avant/après le geste), pas à estimer.

## DETTES ET CHANTIERS HORS T1
- **M-SÉCU** — hub ouvert en écriture/lecture anonyme à la racine, PROUVÉ (22 nœuds, dont `codes` 126 clés et données de mineurs). Échéance dure : la rentrée.
- LOT ⑫ résiduel : 4 règles CSS inertes `dp-rel-tete`/`dp-choix` · mention caduque `ATELIER_COMPOSANTES.diapositive_json`.
- Questions EDT en attente : dates P1→PFIN · créneaux « X Français » · BANKSY/PYTHAGORE classes ou séances.
- `pilotage_debat_s3.html` : refonte multi-classes en suspens (« chantier à reprendre »).
- Banque d'exercices à extraire de `correction_dictee`.
- Dette QCM : champ `niveau` d'une classe → `deduireNiveauDuNom`.
- Étanchéité des jetons (le jeton du sas a push sur la production).
- `published:true` à l'upload.
- Deux questions PROMPTS en attente (diaporama fidèle vs adapté ; corrélation feuille/lieux).
- Jalon Toussaint : relecture anti-télescopage.
- Lacune du journal 22/07→18/08 (sessions n°4-6 à reconstituer).

MEMO
