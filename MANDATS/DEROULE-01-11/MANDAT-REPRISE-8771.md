# MANDAT — LA 8.77.1-⑩ REPREND UNE HEURE APRÈS UN RECHARGEMENT (la dette ⑪, voie (b) de C16 79)
*Conscience n°16, 02/11/2026 06:08. **Préparé, pas lancé** : il ne part que si Paul choisit la voie (b) au point 79 (« (b) Je fais corriger la 8.77.1-⑩ à cet endroit seulement : elle relit les listes manquantes comme des listes vides. C'est vérifié geste par geste, puis mis en ligne sur ton « promeus ». »). Un seul exécutant, neuf. Registre : `docs/MJPC6-DETTES.md` (production), ligne du fil, dette ⑪. Transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
- Le geste : Paul, en pleine heure sur la version en ligne, recharge la page (F5), ou ferme l'onglet et rouvre le site, puis clique « Reprendre » : la diapo où il était se redessine, le compteur, ▶ et la classe au tableau reprennent comme avant le rechargement.
- Aujourd'hui (mesuré par le quatrième exécutant, partie S et témoin Z, sur un faux hub rangé comme le vrai) : « Cannot read properties of undefined (reading 'slice') » dans `etatComplet0` (`d.lum.slice()`, `index.html` de la production, l. 17767) ; le pilote reste sur la diapo 1. Cause : le vrai hub ne garde ni `null`, ni liste vide, ni objet vide ; la 8.77.1-⑩ relit `lum`, `ecr`, `reps`… de l'état par diapo sans valeur par défaut. Au faux hub ordinaire, elle reprend sans erreur.
- Les règles de Paul : jamais de promotion sur une dette ; jamais de perte silencieuse ; non mesuré = « je ne sais pas » ; rien en ligne sans son « promeus ».

## 1 · MISSION 0 — AUDITE CE MANDAT D'ABORD
Relis-le contre le code de la 8.77.1-⑩ et contre la NOTE des quatre dettes (`LIVRAISONS/DEROULE-01-11/QUATRE-DETTES/NOTE.md`, §1.3 et §2.2 : `dr_etatRempli`, `dr_parDiapoRempli`, la même faute réglée dans la nouvelle version). Écris dans ta NOTE chaque erreur, manque ou télescopage, et ce que tu as tranché. Tu ne t'arrêtes pas pour demander.

## 2 · LA BASE
La 8.77.1-⑩ : l'assemblé de `fc036e8` du sas (md5 `09a19419011c2a09ebeae21d4c4d41f0`), identique à `index.html` de la production à la ligne `APP_VERSION` près. Tu travailles **dans le sas**, branche neuve `reprise/8771` partie de `main`, ton propre dossier (`git worktree`) : `LIVRAISONS/REPRISE-8771/index.html` = la 8.77.1-⑩ corrigée (la ligne `APP_VERSION` laissée à `8.77.1-⑩` : la conscience la pose à la promotion). La machine a deux cœurs et peut être partagée avec un autre exécutant : avant toute mesure de temps, vérifie qu'aucun navigateur autre que les tiens ne tourne.

## 3 · CE QUE TU FAIS
1. **La correction, à cet endroit seulement** : là où la 8.77.1-⑩ relit l'état d'une heure (la reprise, et tout autre lecteur de cet état que tu trouves, nommé dans la NOTE), chaque diapo et l'état de l'heure reprennent les listes, objets et valeurs nulles que le hub n'a pas rangés (sur le modèle de `dr_etatRempli` / `dr_parDiapoRempli`) ; jamais ce que l'écriture retire exprès. Rien d'autre ne change : ni texte, ni geste, ni écriture au hub. Le diff contre la 8.77.1-⑩ tient en quelques lignes, toutes dans les lecteurs ; écris-le en entier dans la NOTE.
2. **La preuve par le geste** : la sonde des quatre dettes avec `MJPC_ANCIENNE=<ta 8.77.1-⑩ corrigée>` : sous le faux hub rangé comme le vrai, `MJPC_HUB=vrai MJPC_PARTIES=R,I,T,B,X,Z,S` — avant (la 8.77.1-⑩) 10 échecs en R, I, Z et 2 en S, comptés ; après : **0**. Au faux hub ordinaire, la partie S : 0. La sonde du retour sûr (`RETOUR-SUR/sonde-retour.mjs`, `MJPC_ANCIENNE=` ta version) : 0 échec. Aucune erreur JS, aucune boîte système.
3. **Ce que la correction ne doit pas casser** : la 8.77.1-⑩ corrigée, seule, sur une heure neuve (lancée par la case de l'emploi du temps, ▶ jusqu'à la fin, « Clore l'heure »), en mode test : les mêmes écrans, les mêmes écritures au faux hub qu'avant (comparées, comptées).

## 4 · CE QUE TU NE TOUCHES JAMAIS
La production (la conscience promeut sur le « promeus » de Paul) ; la branche `main` du sas, sauf par ta branche ; `redaction.html`, `correction_dictee.html` ; le vrai hub (ni écriture ni lecture) ; `AUDITS/` ; la ligne `APP_VERSION` ; la branche `deroule/diapos-ouverture`.

## 5 · CE QUE TU LIVRES, ET QUAND
Sur `reprise/8771` : le fichier corrigé, le diff, les sorties des sondes, `LIVRAISONS/REPRISE-8771/NOTE.md` (mission 0 ; le diff ; les vérifications comptées ; ce qui reste ouvert). **Au plus tard 1 h 15 après ton lancement** ; si l'heure ne suffit pas, tu le dis à l'heure dite.
