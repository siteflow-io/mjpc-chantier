# MANDAT C — LA CASE DES INITIALES (C16 551, 557, 558, 562, 623 à 630)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/c`, depuis le dernier commit de `nuit/a`.*

## 0 · CE QUE PAUL A DIT (ses mots)
- 07:36 : « le site ne devrait jamais mettre "un élève", parce que la participation doit être enregistrée absolument, sinon ce n'est pas juste pour l'élève. Si je tape des initiales qui n'existent pas dans la classe, le site devrait me le dire. Et surtout, au tableau des élèves, quand moi je tape "YC", il faudrait que eux voient le prénom de l'élève. »
- 12:45 : « Pour tab d'ailleurs, quand je cliquais dessus le curseur allait dans le champ du titre d'activité. »
- 13:07 : « le champ des initiales élève peut très bien accueillir du texte. […] il faudrait deja que le champ élève n'accepte rien d'autre que ce pourquoi il existe ( donc que des majuscules deja, même si je tape en minuscules, que je n'ai pas besoin de faire maj), et que dès que l'élève est identifié, ca passe au champ de sa réponse. […] Pour les noms composés, moi dans ma tête cest simple je tape MGC […]. Pour les initiales identiques, oui ta proposition mais je dois pouvoir piloter au clavier ( le site doit me les proposer par numéro, et je tape le numéro du bon élève ). Enfin, dès lors que je tape la première lettre dans le champ initiales élève, je dois voir la liste de tous les prénoms commençant ainsi, numérotés, et même système: je tape le numéro au clavier. On ne va pas au delà de 9 […]. Enfin, au tableau, ce doit être le prénom et la première lettre du nom qui s'affiche. »
- 13:50 : « Pour la tension mgc oui pour ta proposition. Le principe est que la case attend la totalité des initiales élève, quel que soit le mode de validation ( numérotation ou automatique une fois toutes les initiales tapées ). »
- 15:37 : un élève au nom de famille en deux mots « apparaît non pas en prénom simple, mais en Nom Prénom ».

## 1 · CE QUE TU FAIS
1. La case n'accepte que des lettres (mises en majuscules toutes seules) et les chiffres 1 à 9 pour choisir.
2. Dès la première lettre : la liste numérotée des prénoms qui commencent par elle (9 au plus) ; un chiffre choisit l'élève.
3. Le saut à la réponse : quand toutes les initiales d'un seul élève possible sont tapées, ou au chiffre ; jamais avant (MGC : pas de saut à « MG »). Deux élèves aux mêmes initiales : la liste numérotée, le chiffre.
4. Le nom de famille = tous les mots en capitales, le prénom = le reste ; les initiales = la première lettre du prénom, puis celle de chaque mot du nom (MGC) ; partout, le prénom seul (« Nom Prénom » jamais).
5. Entrée et Tab ne vont jamais au titre de l'activité ; aucune lettre n'y part.
6. Des initiales qui ne sont celles d'aucun élève : le site le dit à la frappe ; jamais « un élève ».
7. Au tableau : le prénom et la première lettre du nom, puis la réponse.

## 2 · LA SUPPOSITION (mesurée par `mesure/initiales` `c5825f9cd`, sa NOTE ; À VÉRIFIER)
`dr_initiales` (dr-socle) prend le premier mot pour le nom ; la ligne de réponse (dr-classe, `ini.oninput`, `ini.onkeydown`, `dit.onkeydown`) ; `dr_iniExact`, `dr_iniSeul`, `dr_candidats`, `dr_iniVu` ; Entrée et Tab sur la première ligne remontent à l'écouteur de `brancherAtelier` (actif en classe), qui appelle `focaliser` ; le vert n'arrive qu'à la première lettre de la réponse (la participation exige `r.r`) ; le tableau montre les initiales. La base contient déjà 571 (`dr_repEleveSuit` dans `ini.oninput` / `ini.onkeydown`) : garde-le.

## 3 · LA PREUVE
La sonde `LIVRAISONS/DEROULE-01-11/MESURE-INITIALES/sonde-initiales.mjs` (`c5825f9cd`), reprise, à vitesse humaine (120 à 200 ms entre deux touches) : base → après, compté, pour 1 à 7 (deux MB ; un nom en deux mots ; des initiales inconnues ; Entrée et Tab sur la première ligne ; le tableau) ; la sonde du gel (`RECIT-GEL/sonde-recit-gel.mjs`) toujours verte ; le parcours vert ; la frappe au tableau (`FRAPPE-TABLEAU/sonde-frappe-tableau.mjs`, sur `banc/chrono-v3` `bc38d53fb`) si elle lit la case : mise à jour dans ta branche.
