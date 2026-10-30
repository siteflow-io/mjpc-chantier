# Rédaction sur les scans — LA CORRECTION PAR L'ÉLÈVE : section entière à coder

> Décision de Paul, 30/10/2026 10:57 (C13, tour 410) : « la correction élève est une étape qui arrive dans un second temps. Pour l'instant on ne le code pas (tu marques dans le code que c'est une section entière à coder quand même et tu t'organises pour que lorsqu'on le codera ça ne cassera rien). Il faut donc une coche d'ouverture de correction élève. Quand cette coche est active, on peut lancer la correction en classe, comme celle de dictée. […] Pour l'instant cette case est décochée par défaut, et l'élève reçoit juste sa correction de copie avec le pochoir et la photo […]. C'est de la lecture seule. […] Les dettes du parcours de correction élève sont à mettre sur GitHub. »
> Registre unique : `docs/MJPC6-DETTES.md` (production), dettes consignées non ordonnancées — Paul dit quand elles entrent.

## Ce qui est en place (maquette v10)

- `scan.js` : `SC_CORRECTION_ELEVE_CODEE = false` et `scCorrectionEleve()` — tant qu'il est faux : la passe « Les retours des élèves » n'apparaît pas (`scRendre`, `scAllerPasse`), les marques « ✎ relue / ✓ seul » ne s'affichent pas, rien ne lit ni n'écrit `config/correctionEleve`.
- `eleve.js` : `scEleveLecture` — le fichier de l'élève en lecture seule (sa copie, le pochoir, sa grille, sa note ; il clique ; il n'écrit rien ; aucun appel au site). `scEleveFichier` choisit `scEleveLecture` tant que `D.correctionEleve` est faux.
- La fenêtre « 📨 Fichiers École Directe » : la coche « Ouvrir la correction par l'élève », grisée, décochée, avec sa raison écrite.
- Banc : 3 vérifications de la lecture seule, 1 de la coche, 1 de l'absence de la passe des retours, 1 du fichier réel sans appel au site.

## Ce qui reste en place, derrière le drapeau, à reprendre (jamais appelé aujourd'hui)

- `eleve.js` `scEleveApp` : l'ancien parcours. À RECYCLER : le transport des retours (`T` : site par `fetch` + `EventSource` ; onglet de test par `postMessage` ; ce navigateur), la vérification d'une faute contre la bonne forme (`n()` : NFC, apostrophes, espaces ; accents et lettres comptent), la reprise sans recharger, le garde du champ en cours. À NE PAS REPRENDRE (écarté par Paul le 30/10) : la question avant la case (1360), la tâche écrite (« papillon ») et sa relecture, la file imposée.
- `scan.js` : `scPanneauRetours`, `scDessinerRetour`, `scVerdict`, `scARefaireFixer`, `scRetoursListe`, la passe « retours » dans `SC.passes` ; `eleve.js` : `scPousser`, l'écoute `mjpcDemande`. À revoir entièrement : Paul n'a pas de relecture à faire.

## Les dettes du parcours de correction par l'élève (à cadrer avec Paul avant tout code)

1. La coche d'ouverture : où elle vit (`config/correctionEleve` du sujet), qui la change, ce qu'elle débloque.
2. Le lancement en classe « comme la correction de dictée » : à mesurer dans `correction_dictee.html` (panneau, lancement, suivi) ; même panneau, mêmes touches (préférences de Paul du 27/10 et du 29/10).
3. Le parcours de l'élève : il corrige ses fautes soulignées, dans l'ordre qu'il veut, revient sur n'importe laquelle ; juste / faux aussitôt ; un compteur ; aucun champ libre, rien qu'il puisse écrire « n'importe quoi » (tour 409 : 1453 à 1459).
4. Aucune relecture par Paul (tour 409, 10:28) : ce qui ne se vérifie pas seul n'est pas demandé à l'élève.
5. **Le quota de bonnes formes (décision de Paul, 30/10 12:59, C13 tour 416, remplace la proposition 1459)** : « je dois pouvoir fixer un quota dans les réglages d'une rédaction. L'élève en correction sait qu'il a des mots dont la bonne forme est enregistrée, et que sa correction compte sur ces mots là. Mais pour le hors quota, les mots que je ne fais que souligner, l'élève les corrige quand même mais l'app ne confronte rien vu qu'elle n'a pas la bonne forme. » — à cadrer : le quota dans les réglages de la rédaction (à côté de la coche d'ouverture) ; ce que l'élève voit d'une faute dans le quota et d'une faute hors quota ; ce que Paul voit au récapitulatif quand le quota n'est pas atteint (aujourd'hui : « sans bonne forme »).
6. Ce que Paul voit : « fautes corrigées : 9 / 14 » par copie, compté seul, sans recharger (récapitulatif, tableau).
7. Le fichier envoyé par École Directe avant l'ouverture, puis l'ouverture : le même fichier se met-il à jour, ou un second fichier ? À trancher.
8. Le transport réel au site (`retours/<classe>/<élève>`) : jamais écrit sur le vrai hub ; règles du hub à mesurer.
9. Les mots vus par l'élève dans ce parcours : tous à donner ou valider par Paul (règle « aucune phrase vue par l'élève que Paul n'a pas donnée » ; 1374).
10. Le test sur iPhone : une pièce jointe d'École Directe exécute-t-elle le fichier ? (`ecoledirecte/essai-ecoledirecte.html`, test de Paul en attente.)
11. **Une note d'autocorrection, comme la dictée** (Paul, 30/10 12:59 : « Peut-être que la correction donnera lieu à une note d'autocorrection, comme la dictée ») : à mesurer dans `correction_dictee.html` (le bonus G/L/M/I/X, son barème) avant de cadrer ; jamais mélangée à la note de la grille (une case, un fait).
12. **Les noms des retours au site** (C14, 30/10) : `scCheminRetours([élève, cle])` met l'identité d'une question dans le chemin ; elle porte un point, que le site refuse (mesuré le 30/10 : « Key value can't be empty or contain $ # [ ] / or . »). Au codage : la même forme que les réponses de 1.2.3 (`scCleSite`, %2E), et le faux hub qui refuse déjà ces noms.
