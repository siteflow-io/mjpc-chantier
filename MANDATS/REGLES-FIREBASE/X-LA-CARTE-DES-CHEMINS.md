# MANDAT X — LES RÈGLES FIREBASE : LA CARTE DE CE QUE CHAQUE APP LIT ET ÉCRIT (mesure seule, rien ne change)
*Conscience n°16, 07/11/2026. Branche du sas : `secu/carte`, partie de `main`. **45 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 45 minutes tu pousses ce qui est mesuré, tu t'arrêtes et tu dis ce qui reste). **Très économe** : grep ciblé, extraits courts, jamais un fichier entier de 3 Mo.*

## 0 · CE QUI EST DIT
Paul, 07/11 06:57 : « Il faut s'occuper des règles firebase. Bétonner. »

## 1 · CE QUE ÇA CHANGE POUR LA CLASSE
Aujourd'hui, la base `mjpc-hub` ne connaît personne : aucune app ne s'y présente avec une identité, et son adresse est en clair dans chaque page publique. Qui a l'adresse peut lire les noms, les notes et les copies des élèves, et tout écrire ou tout effacer. Les règles qui viendront ne devront **jamais** refuser un geste de Paul ou d'un élève en classe. Cette carte est ce qui permet de les écrire sans rien casser. Tu mesures ; tu ne proposes pas de règles.

## 2 · LA SUPPOSITION FORTE DE LA CONSCIENCE (à vérifier d'abord)
- Les fichiers de la production (`/home/claude/monsieurjaipascompris`, commit `7c64d7d`, `index.html` 8.89.2-㉓-micro ; **lecture seule** : tu n'y modifies rien, tu n'y fais aucune commande git) qui parlent à la base : `index.html`, `mjpc-core.js`, `analyse_logique`, `applause_meter`, `correction_dictee`, `dictee_universelle`, `evaluation-qcm`, `pilotage_debat_s3`, `redaction`, `reecriture`, `reecriture_bb4e`, `worktrack` ; et peut-être `Console_ateliers_revisions`, `etude_dugain`, `redaction_dugain_v3`, `deploy-monitor` (un balayage simple n'y trouve aucun chemin écrit en clair : dis s'ils parlent à la base, et à laquelle).
- Aucune n'utilise Firebase Auth (les mots `firebase.auth` / `signIn…` trouvés sont dans le SDK embarqué, pas dans le code des apps).
- Deux voies d'accès : le REST (`FIREBASE_BASE + …`, `_siteGet`, `_sitePut`, `_siteDelete`, `mjpcEcrireRest`, `mjpcPutJson`, le socle) et le SDK (`firebase.database().ref(…)`, `.child(…)`, `.set/.update/.push/.remove/.transaction`, `.on/.once`, les requêtes `orderBy…`).
- Environ 40 nœuds de premier niveau ; les plus partagés : `classes` (12 fichiers), `manifestes` (12), `codes` (10), `corbeille` (7), `site` (6), `presence` (4). Les chemins bâtis par variables (gabarits, concaténations) sont là où le balayage s'arrête : c'est eux qu'il faut mesurer.

## 3 · À LIVRER (`LIVRAISONS/REGLES-FIREBASE/CARTE.md` et `carte.json`)
Pour chaque nœud de premier niveau : les fichiers qui le touchent, et les **gabarits de chemins jusqu'aux feuilles écrites**, avec des noms de variables comme dans les règles (`$classe`, `$eleve`, `$id`, `$niveau`…). Pour chaque gabarit :
- les opérations : lu une fois / abonné / écrit en entier (`set`, PUT) / fusionné (`update`, PATCH) / ajouté (`push`, POST) / effacé (`remove`, DELETE) / transaction ;
- qui le fait : écran du professeur, écran de l'élève, tableau, les deux ;
- un exemple `fichier:ligne` et le nombre d'endroits.

À signaler à part, en tête, parce que ce sont eux qui décident des règles :
1. toute écriture **à la racine ou sur un nœud parent entier** (remplacement complet) : imports, restaurations, « snapshot », purges, corbeille, remises à zéro ;
2. toute `update` à plusieurs chemins lancée haut dans l'arbre (à la racine ou presque) ;
3. toute **lecture d'un grand nœud entier depuis un écran d'élève** (par exemple tout `/classes` ou tout `/codes` pour un portail) ;
4. toute requête (`orderByChild`, `equalTo`, `shallow`) : les règles devront porter `.indexOn` ;
5. ce qui contient des données nominatives (noms, codes, notes, copies, absences) : le nœud et le chemin, **jamais une valeur**.

Et la faisabilité du banc : le Realtime Database **emulator** (`firebase-tools`, il demande Java) tourne-t-il dans ce conteneur ? Installe-le dans ton dossier du scratchpad seulement, démarre-le avec une règle `{"rules":{".read":true,".write":true}}`, fais un GET et un PUT dessus, arrête-le. Dis oui ou non, le temps et la place que ça prend. N'y branche aucune app.

## 4 · CE QUE TU NE FAIS PAS
Pas de brouillon de règles, aucun changement de code, rien dans la production, **jamais le vrai hub** (aucune requête vers `mjpc-hub`), aucun vrai nom d'élève, pas de capture. Tu ne touches ni `redaction.html`, ni `/redactions`, ni `correction_dictee.html` (tu les **lis** seulement pour la carte).

## 5 · LA FIN
Ton travail dans un worktree du sas, dans ton dossier du scratchpad (supprimé à la fin) ; tu pousses `secu/carte`. Puis trois lignes à la conscience (`SendMessage`, `to: "main"`) : ce qui est mesuré (compté : fichiers, nœuds, gabarits, les cinq signalements), le commit, l'émulateur oui/non, ce qui reste.
