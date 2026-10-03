# DICTÉE — L'ÉCRAN DE CORRECTION · L13b — l'heure se ferme seule à fin + 10 minutes ; la session appartient à son heure

*Exécutant du complément L15, livraison L13b (réponse de Paul à la question 291 ; T1 à T4 validés). Rien n'est promu.*

## Ce que ça change pour la classe
- **T1 — une heure est close au premier de « Clôturer » ou « fin + 10 minutes »**, une seule règle partout (`heureActive`, `heureClose`, `heureFinEffective`) : côté élève (dans l'heure, hors classe, la fin de sa fenêtre, le masquage de la dictée corrigée) et côté professeur (le Suivi et sa colonne « Pas fini, à terminer »). **Pendant les 10 minutes qui suivent la fin**, sans clôture, l'élève est encore **dans l'heure** : pas de bandeau, sa fenêtre court jusqu'à fin + 10. Au Suivi, la carte « ⏰ L'heure est dépassée » (+10 min / Clôturer) ne s'affiche que pendant ces 10 minutes.
- **T2 — hors classe, 45 minutes à chaque ouverture faite APRÈS la clôture (ou après fin + 10)** : le bandeau « 🏠 Tu es hors classe : tu as 45 minutes. Il te reste 44 min. » (texte inchangé). Une ouverture faite avant reste dans son heure jusqu'à sa fin.
- **T3 — une session appartient à l'heure pendant laquelle elle a commencé** : rattachée si `debut − 10 min ≤ sessionDebut ≤ fin + 10 min` (la fenêtre de 6 h ne sert plus depuis L13). Une dictée relancée n'étend donc plus une session d'avant ; un élève qui rouvre **pendant** une heure en cours y travaille jusqu'à sa fin, même si sa première session date d'avant.
- **T4 (C1) — tu vois qu'une heure s'est fermée seule** : « heure fermée seule à 10 h 10 (non clôturée) », **au Suivi de la dictée et sur sa ligne à l'accueil**, avec une infobulle. L'aide « ? » (Données) le dit.
- Quatre dictées dans une matinée = quatre heures indépendantes : une heure oubliée sur l'une ne touche pas les autres (le banc le joue).

## Le fichier
- Base **6.7.0-L15a en ligne** (834 940 o, md5 `022bd99d02197698bbb9a2a001ba0d74`, vérifiée à la commande) → **6.7.0-L13b** : **837,270 o** (+2,330), md5 `1f1593e42222d7ded743b1c0a984bf2f`.
- Ajoutées : `GRACE_HEURE`, `heureFinEffective`, `heureClose`, `heureFermeeSeule`, `hhMinL13b` ; modifiées : `heureActive` (fin + 10), `finDeFenetre` (la fin effective), `dansHeureLancee` (T3), dans l'autocorrection `horsClasseL13` (l'ouverture après la clôture) et `finEffL13` (une heure en cours) ; au Suivi : la colonne « Pas fini, à terminer », la carte de l'heure (dépassée pendant 10 minutes, puis « fermée seule ») ; l'accueil (la ligne) ; une ligne d'aide. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L13b_geste.py`** (par le geste, 6 vérifications) : une heure non clôturée, l'élève rouvre **à fin + 5 min → dans l'heure** (pas de bandeau, il corrige) ; **à fin + 11 min → « … Il te reste 44 min. »** ; **la même dictée relancée** (sa session date d'une heure 4 h plus tôt, une heure en cours) → il travaille dans l'heure en cours, sans bandeau ; **deux dictées**, la première jamais clôturée (fin il y a 70 min), la seconde en cours → **à l'accueil, la ligne « heure fermée seule à … (non clôturée) » sur la première seulement** ; **son Suivi** : la même ligne, et plus de fenêtre « heure dépassée » ; 0 erreur.
**Banc unique sur L13b : VERT, 0 échec** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b (dont **L13**, l'attente et les 45 minutes), vue élève identique à la 6.6.3.

## Captures (`captures/`)
`H1-accueil.png` (la ligne de la dictée) ; `H2-suivi.png` (son Suivi) ; `H3-eleve.png` (l'élève qui rouvre à fin + 11).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une dictée → Données → Suivi → « ▶ Lancer l'autocorrection » avec une fin proche ; ne clôture pas.
2. Entre la fin et 10 minutes après : « ⏰ L'heure est dépassée » (+10 min / Clôturer) ; un élève qui rouvre est encore dans l'heure.
3. Après fin + 10 : au Suivi et sur la ligne de la dictée à l'accueil, « heure fermée seule à … (non clôturée) » ; l'élève qui rouvre voit « Tu es hors classe : tu as 45 minutes. Il te reste 44 min. ».
