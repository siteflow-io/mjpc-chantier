# Relecture de la maquette v7 du QCM : scènes 130 à 169

Comment j'ai relu :
- j'ai ouvert chaque capture (`captures/NNN-ID.png`), en zoomant sur les zones denses ;
- j'ai joué chaque scène dans `v7.html` aux tailles de sa vue : console en 1366×768, 1536×864 et 1920×1080, tablette et élève en 1280×800 ;
- j'ai survolé tous les « i » jaunes (la position de la bulle est mesurée et photographiée), relevé l'infobulle de chaque bouton et de chaque élément qui en porte une, cliqué chaque bouton dans une page neuve, essayé Échap sur les fenêtres et le tri de « Trier par ».

Scripts et preuves : `r4/analyse.js`, `r4/jouer.js`, `r4/out/*.json` (mesures), `r4/cap/` (photos).

## Les défauts

Les lignes sont rangées par gravité : bloquant, puis gênant, puis mineur.

| scène | type | ce qui ne va pas | où à l'écran | gravité | comment le reproduire |
|---|---|---|---|---|---|
| 148, 149 (contre 133, 141) | logique | Lou n'a pas la même note sur deux écrans. Son bilan dit « Ta note : 1 / 3 », « 6,7 / 20 », « Maîtrise fragile », « Question 3 · faux · Corrigé d'après ta feuille. ». Le tableau de la console dit « ZELLER Lou · 2/3 · 13,3 · Maîtrise satisfaisante », avec Q3 ✓ et rien dans « À lire sur la feuille ». Le tableau d'après le rendu des copies (141) dit la même chose. | 149 : carte orange de la note ; 148 : carte « Évaluation d'essai » ; 133 et 141 : ligne ZELLER Lou | bloquant | Ouvrir `#scene=e-bilan-lou`, puis `#scene=c-resultats-rendues` : comparer la ligne ZELLER Lou. |
| 168 | affichage | À 1536×864, l'écran de Paul, la fenêtre « en grand » est fixe et ne défile pas. Les champs « 📝 Feuille de Élise » et « 📝 Feuille de Gatien » (où Paul tape la feuille) sont hors de l'écran, sans moyen d'y aller : ils sont à y = 892 à 920 pour une fenêtre de 864. Même chose pour la phrase « Élise a écrit « 6 pattes »… ». Même chose à 1366×768. La capture, haute de 1150 px, ne le montre pas. | bas de la fenêtre « Tablette 1 · … en grand » | bloquant | Ouvrir `#scene=x620-3-mode-test-en-grand` en 1536×864 et faire défiler : rien ne bouge, les deux champs restent invisibles. |
| 130 (et toutes les consoles QCM de ma part : 130 à 146, 150 à 152, 165 à 168) | texte | Deux mots pour une même chose. Les boutons disent « 🔴 1 session en cours », « 🛑 Terminer la session », « Lancer une nouvelle session », « Sessions précédentes ». Leurs infobulles disent « Les séances encore ouvertes… », « Termine la séance… ». L'infobulle de « 🚫 Départ d'un élève » dit « parti en cours de session ». | en-tête, boutons du pilotage | gênant | Survoler « 🛑 Terminer la session » dans `#scene=c-papier-correction`. |
| 130 (toutes les consoles QCM) | infobulle | « 📺 Ouvrir vue tableau » : « Utilise W+P en mode "Étendre" sur Windows… ». Le raccourci est faux (c'est Windows+P), les guillemets sont droits, il y a des majuscules (« NOUVELLE FENÊTRE », « QUE ») et quatre phrases qui expliquent une règle. | en-tête | gênant | Survoler « 📺 Ouvrir vue tableau ». |
| 130 | geste | Chacun des 24 noms soulignés mène à `c-autonomie`. Cette scène ouvre toujours la fenêtre de « FOUCHER Hugo », dans la correction sur tablettes (« Question 1 / 3 — Q2 · révélée »). C'est sans rapport avec le nom cliqué et avec la séance sur papier. | grille « D'après ta grille » | gênant | Cliquer « ABRIAL Julien » dans `#scene=c-papier-correction`. |
| 130 | logique | Le « i » du titre dit : « Le point d'autonomie ne se retire qu'en direct, d'un clic sur le nom. ». Or les scènes 134 à 136 montrent « ⛔ Retirer le point d'autonomie » le soir, dans la fiche. Je ne suis pas sûr : la phrase vise peut-être la seule séance sur papier. | « i » à droite de « 3 ESSAI » | gênant | Survoler le « i » du titre, puis ouvrir `#scene=c-fiche-garde`. |
| 131 | infobulle | Sur un écran d'élève, « 📊 Mes évaluations » porte une infobulle : « Ouvre « Mes évaluations » : tes évaluations passées et leur bilan. ». C'est vrai sur les deux moitiés. | haut de chaque moitié | gênant | Survoler « 📊 Mes évaluations » dans `#scene=t-papier-correction`. |
| 131 | geste | Sur la moitié de Julien et sur celle de Michel, « 📊 Mes évaluations » ouvre la page de « ZELLER Lou » (`e-mes-evals`). Ce bouton reste là en pleine correction. | haut de chaque moitié | gênant | Cliquer « 📊 Mes évaluations » sur la moitié « ABRIAL JULIEN ». |
| 132 (et 138, 140) | geste | Pour « 3e Chapitre 1 … (séance 3) » et « QCM — Le jambon-beurre », « 📊 Ouvrir » et « copies rendues le 26/09 » ou « le 17/09 » ouvrent le tableau d'« Évaluation d'essai — 3 questions » (`c-resultats-rendues`). Leur « 🗑️ » ouvre la garde « Mettre cette séance à la corbeille ? … Évaluation d'essai — 3 questions » (scène 143). | boutons à droite des 2e et 3e séances | gênant | Dans `#scene=c-seances`, cliquer le « 📊 Ouvrir » de « QCM — Le jambon-beurre ». |
| 133, 141 | affichage | À 1366×768, le tableau est plus large que son cadre (1274 px pour 1248). Une barre de défilement horizontale apparaît et la colonne « À lire sur la feuille » est coupée à droite (« À lire sur la feu », « Q1 : a dit que sa feuille ne disait pas son clic… » rogné). | colonne de droite du tableau | gênant | Ouvrir `#scene=c-resultats` en 1366×768. |
| 133, 141 | geste | Les 24 noms sont violets et le curseur devient une main, mais seul « DUVERNAY Michel » ouvre une fiche : « ABRIAL Julien » et les autres ne font rien. L'en-tête « Élève » annonce « Cliquer pour trier par nom (asc/desc) » et ne trie pas. | colonne « Élève » | gênant | Cliquer « ABRIAL Julien », puis l'en-tête « Élève » : rien ne change. |
| 133 | logique | La console affiche « 5 feuilles à lire ». Le bilan de classe de la fin de l'heure (121) annonçait « À lire sur les feuilles, ce soir (7) » : « PERRAUD Jade — Q2 » et « MAILLARD Noah — Q3 » ont disparu de la colonne « À lire sur la feuille ». Et « 5 feuilles » compte 5 questions réparties sur 4 élèves (Michel en a deux). | ligne sous le titre, colonne de droite | gênant | Comparer `#scene=c-bilan` (cadre orange) et `#scene=c-resultats`. |
| 134 (et 135 à 137) | logique | Dans la colonne « SA FEUILLE, LUE PAR JULIEN », la ligne Q1 dit « Rome ». Or la pastille dit « Julien y a lu Venise », et le « i » dit que la colonne montre « ce que Julien a lu sur sa feuille à la correction ». | ligne Q1 de la fiche | gênant | Ouvrir `#scene=c-fiche`. |
| 134 | geste | Les trois « La feuille dit autre chose » (Q1, Q2 et Q3) ouvrent la même fenêtre : « Que dit la feuille ? DUVERNAY Michel — Q3 · Combien de pattes a une araignée ? ». Q1 et Q2 ouvrent donc la question 3. | boutons à droite des lignes Q1, Q2 | gênant | Cliquer « La feuille dit autre chose » de la ligne Q1. |
| 136 | logique | Le point est retiré (« 🔴 Point d'autonomie retiré le 10/10 à 19:12. »), mais le « 📝 Bilan général » ne change pas : il ne parle toujours pas d'autonomie. Et « ↻ Regénérer » reste grisé, avec « Le texte est déjà celui de l'app. ». Or la garde (135) annonçait « Son bilan général le dira ». | Bilan général | gênant | Ouvrir `#scene=c-fiche-retire` et lire le bilan. |
| 142 | logique | Le PDF ouvert depuis « Évaluation d'essai — 3 questions » du 08/10 (141) est celui d'une autre évaluation : « 3e- éval 1 Analyse logique - Construire une phrase complexe », « 09/10/2026 · 11 questions », compétences c4-langue-04 et c4-ecrire-02. Les notes ne sont pas les mêmes : ABRIAL Julien 10,9 au lieu de 13,3, DUVERNAY Michel 10,9 au lieu de 6,7, ZELLER Lou 10,9. | toute la page | gênant | Dans `#scene=c-resultats-rendues`, cliquer « 📄 PDF notes et compétences ». |
| 144 (et 145, 146) | geste | « 🗑️ Tout purger » ouvre la même garde que « Purger les évaluations » : « Purger les évaluations ? Toutes les évaluations partent à la corbeille, gardées un an. ». | Zone dangereuse | gênant | Cliquer « 🗑️ Tout purger » dans `#scene=c-sauvegarde`. |
| 144 (et 145, 146) | infobulle | L'infobulle de « 🧹 Nettoyer les sessions zombies » est écrite avec les noms du code : « entrées sessionActive qui pointent vers une session inexistante … « en_cours » … corrigé en « termine » … (réponses, scans) … AVANT exécution … 24h ». | Maintenance | gênant | Survoler le bouton. |
| 147, 148 | infobulle | Sur un écran d'élève, les cartes portent des infobulles : « Ta copie n'est pas encore rendue. », « Tu n'as pas passé cette évaluation. », « Ouvre ton bilan. ». « ← Retour » porte même l'infobulle écrite pour Paul : « Revient à l'écran précédent. Une séance en cours continue : elle se retrouve par « 🔴 sessions en cours ». ». | cartes, bouton « ← Retour » | gênant | Survoler les cartes et « ← Retour » dans `#scene=e-mes-evals`. |
| 147, 148 | geste | La carte « QCM — Le jambon-beurre · 15/09/2026 · 6 / 10 · 12 / 20 », dont la copie est rendue, montre un curseur en main mais ne s'ouvre pas. La carte « Évaluation d'essai », rendue elle aussi, ouvre bien le bilan (148). | 3e carte | gênant | Cliquer la carte « QCM — Le jambon-beurre ». |
| 151, 152 | logique | Le prompt dit : « 3. Correction, après toutes les questions : l'élève recopie sur la tablette ce que dit sa feuille, puis je révèle la réponse et je commente. ». Or à la correction, c'est le voisin qui lit la feuille et clique (« Michel lit la feuille de Julien »). | bloc du prompt, « COMMENT SE PASSE UNE QUESTION EN CLASSE » | gênant | Ouvrir `#scene=c-reglages-prompt` et lire le point 3. |
| 165 | geste | « 🚀 Lancer le rattrapage » ne concerne que YVON Adam. Il mène pourtant à `c-appel`, l'appel de toute la classe du 08/10 (« 3 ESSAI — 25 élèves », YVON Adam marqué absent). Son infobulle dit : « seuls les élèves pas encore notés sont proposés ». | bouton violet | gênant | Cliquer « 🚀 Lancer le rattrapage » dans `#scene=c-rattrapage`. |
| 165 | logique | La liste dit « 3e Chapitre 1 … (séance 3) · 24/09/2026 · 23 présents · 2 feuilles à lire ». À 132, la même séance a ses « copies rendues le 26/09 ». Or rendre les copies suppose toutes les feuilles lues (139 : « Les 5 feuilles à lire sont lues »). La liste affiche aussi « Évaluation d'essai … 5 feuilles à lire », alors que 138 à 140 montraient « 5 feuilles lues » et les copies rendues. | Sessions précédentes | gênant | Comparer `#scene=c-rattrapage` et `#scene=c-seances`. |
| 165 | geste | Le 2e « 📊 Résultats » (« 3e Chapitre 1 ») ouvre le tableau d'« Évaluation d'essai — 3 questions » (`c-resultats`). | Sessions précédentes, 2e ligne | gênant | Cliquer le 2e « 📊 Résultats ». |
| 165, 166 | infobulle | À 1366×768, la bulle du « i » de « Classe » sort de l'écran à gauche : son bord est à x = −23 (−13 à la scène 166). On lit « es classes de la console MJPC. ». | « i » à droite de « Classe » | gênant | En 1366×768, survoler le « i » de « Classe » dans `#scene=c-rattrapage`. |
| 166, 167 | geste | Les 15 « 🔍 Jouer en grand » ouvrent tous la même scène, « Tablette 1 · AUDEBERT Élise · AUGEREAU Gatien », déjà au 1er tour (« Temps fini : ton clic est enregistré. »). C'est vrai même depuis 166, où les tablettes en sont à « Combien êtes-vous sur cette tablette ? ». Les « 👤 1 élève » et « 👥 2 élèves » des tablettes simulées mènent à `t-un-eleve` et `t-login`, les tablettes de la vraie classe (« Tu es bien Julien ? »). | tablettes simulées | gênant | Cliquer « 🔍 Jouer en grand » de la tablette 15 dans `#scene=x620-1-mode-test-ouverture`. |
| 167, 168 | geste | En mode test, les boutons de la console mènent aux scènes de la vraie séance de 3 ESSAI : « ✋ Autoriser la réponse » ouvre `c-q1-tour1` (question 1, Julien), « ⏭️ Tour suivant » (168) ouvre `c-q1-tour2`, « ❌ Écarter » ouvre la garde de la question 3 de l'éval d'essai. Même chose pour « 👁 », « 🚫 Départ d'un élève » et « 🛑 Terminer la session ». | Panneau prof | gênant | Cliquer « ✋ Autoriser la réponse » dans `#scene=x620-2-mode-test-reflexion`. |
| 167 | infobulle | La bulle du « i » de « 📋 Toutes les questions » est rognée par le cadre de droite, aux trois tailles : « Les temps des questions à venir s… », « retire une question pas encore po… ». Les cartes passent par-dessus. | « i » de « Toutes les questions » | gênant | Survoler ce « i » en 1536×864 (photo : `r4/cap/167-…-1536-i2.png`). |
| 167, 168 | texte | « QUESTION 3 / 3 — 1 BONNE(S) RÉP. » : pluriel bricolé et abréviation. | carte violette de la question en cours | gênant | Ouvrir `#scene=x620-2-mode-test-reflexion`. |
| 167 | logique | Les temps de la question en cours se contredisent. À gauche : « RÉFLEXION … 20 s » et « RÉPONSE … 15 s ». Sur la carte Q3 de « Toutes les questions » : « Réflexion 30 s · Réponse 20 s par tour ». | colonne de gauche, carte Q3 | gênant | Ouvrir la scène et comparer. |
| 167 | logique | La question 3 / 3 est en réflexion, alors que Q1 et Q2 portent encore « ❌ Écarter », geste réservé à une question « pas encore posée ». | « Toutes les questions » | gênant | Ouvrir la scène. |
| 167, 168 | infobulle | Champs de temps des cartes Q1 et Q2 : « Le temps de  de cette question, pour cette séance : l'évaluation elle-même ne change pas. ». Il manque un mot (double espace après « de »). | champs 🧠 et ✋ des cartes Q1, Q2 | gênant | Survoler le champ « 20 » de la carte Q1. |
| 167, 168 | logique | L'infobulle de la carte Q3 dit « Question en cours — 14/24 justes pour le moment ». Or la classe de test a 30 élèves, et la scène affiche « 0/30 ONT RÉPONDU » et « — JUSTES ». | carte Q3 | gênant | Survoler la carte Q3. |
| 166, 167, 168 | infobulle | Infobulles écrites avec les mots du code : « Appelle cloturerSession() — le chemin exact du bouton… », « peutRepondre refuse immédiatement », « Monte le VRAI composant élève (AppEleve → EleveLogin) », « supprime la classe _TEST », « (200-1500ms) … ET en phase « autoeval » », « Exporte un snapshot complet de la base de données … en cas de bug à investiguer », « le geste qui causait le recalcul rétroactif ». | bandeaux du haut, « 🎲 Tous les élèves répondent » | gênant | Survoler « 🔒 Clôturer (chemin réel) ». |
| 169 | infobulle | Sur un écran d'élève, « 📊 Mes évaluations » porte une infobulle (« Ouvre « Mes évaluations »… »), et la pastille « 1 pt » aussi (« Nombre de points que vaut cette question »). En plein milieu d'une question, « 📊 Mes évaluations » mène à la page de Lou. | haut de la moitié, pastille « 1 pt » | gênant | Survoler « 1 pt » dans `#scene=t-annexe`. |
| 130 | affichage | À 1366×768, la page défile de 34 px (802 px pour 768). | toute la page | mineur | Ouvrir la scène en 1366×768. |
| 130 (et toutes les consoles QCM) | infobulle | Le « i » jaune placé dans « 🧪 Mode test » n'a pas de bulle noire : seule l'infobulle du bouton apparaît. | en-tête | mineur | Survoler le « i » du bouton. |
| 130 (et toutes les bulles « i ») | affichage | Le texte des bulles noires s'écrit en police à empattements (Georgia), différente du reste de l'app. | toutes les bulles | mineur | Survoler n'importe quel « i » (photo : `r4/cap/134-c-fiche-1366-i1.png`). |
| 130 | geste | « ← Question précédente » est grisé, mais son infobulle ne dit pas pourquoi : « Revenir à la question précédente dans l'ordre de correction (utile si…) ». On est à la question 1/3. | sous la carte de la question | mineur | Survoler le bouton. |
| 130 | texte | Le bandeau dit « Question 1 / 3 — Q2 · toutes les corrections à la suite, dans l'ordre des erreurs de ta grille » : deux numéros pour la même question, et une règle au lieu d'un état. | bandeau rose | mineur | Ouvrir la scène. |
| 130, 131, 165, 167 | affichage | Contraste faible. Texte blanc sur vert vif (noms et « ✓ 1 pt » de la grille, « Bonne réponse », « vert », « Rome ✓ ») : rapport d'environ 2,3. « Standard », blanc sur orange : environ 2,1. En-tête « 📱 Tablette 1 · seul » : environ 2,2. | | mineur | Mesuré dans `r4/out/*.json` (contraste). |
| 130 | affichage | « ✗ 0 » et « ✓ 1 pt » s'écrivent en 10,6 px. | pastilles de la grille | mineur | |
| 131 | texte | Doublon : « ❌ Tu avais faux. » en bandeau, puis juste dessous « ❌ Tu avais faux. Barre ta réponse en rouge… ». | les deux moitiés | mineur | Ouvrir `#scene=t-papier-correction`. |
| 131 | affichage | Les étiquettes « BONNE RÉPONSE » et « TA RÉPONSE » font 9,9 px. | choix | mineur | |
| 132 (et 138, 140, 143, 147, 148, 165) | texte | « Poésie et peinture au XIXème siècle » : il faut écrire « XIXe ». | titre de la séance « 3e Chapitre 1 » | mineur | |
| 132 | geste | La pastille « copies non rendues » n'est pas cliquable, alors que « copies rendues le 26/09 » l'est. | 1re séance | mineur | Cliquer la pastille. |
| 132 (et 138, 140) | texte | Une phrase de règle sous le titre : « Un clic sur « 📊 Ouvrir » ouvre le tableau de la séance. ». | sous « 📊 Résultats » | mineur | |
| 133, 141 | texte | Les en-têtes des compétences sont tronqués : « Mobiliser des références culturelles… », « Contrôler sa compréhension… », en 9,9 px. Aucune infobulle ne donne le libellé entier. | en-têtes de colonnes | mineur | Survoler l'en-tête « c4-culture-01 » : rien. |
| 133, 141 | infobulle | L'infobulle de l'en-tête « Élève » contient de l'anglais technique : « … ouvre son Student Report (drill-down) », « (asc/desc) ». | en-tête « Élève » | mineur | |
| 133, 141 | infobulle | Le « ← Retour » de l'en-tête dit « Retour à la liste des sessions. » (le mot « sessions »), mais il mène à l'accueil de l'app (`c-accueil`). | en-tête | mineur | Cliquer « ← Retour » en haut à droite. |
| 133 | affichage | Le « ✓ » vert sur fond vert pâle a un contraste d'environ 1,9. | colonnes Q1 à Q3 | mineur | |
| 134 (et 135 à 137) | texte | « ↻ Regénérer » : il faut écrire « Régénérer ». | sous le bilan | mineur | |
| 134 | texte | « CE QU'IL A DIT (B) » et le « (B) » du « i » : c'est la lettre d'une phase interne. | en-tête de colonne | mineur | |
| 134, 149 | texte | Le bilan pré-rempli dit « Évaluation fragile. », alors que c'est la maîtrise qui est fragile. Il dit aussi « ton estimation de ton nombre de bonnes réponses ». | Bilan général (134), « 📝 Bilan » (149) | mineur | |
| 134 | geste | Je ne suis pas sûr de ce défaut. « ✔ Marquer lue » devient bien « ✔ lue », mais la pastille orange « ⚠️ a dit que sa feuille… » ne change pas, alors que l'infobulle annonce que « le signalement passe à « lu » ». | ligne Q1 | mineur | Cliquer « ✔ Marquer lue » de la ligne Q1. |
| 137 (et 151, 152) | texte | La même case a deux noms : « Aucun des choix » (le choix de la fenêtre), et « aucun de ces choix » dans la même fenêtre (« Julien a lu « Sa feuille ne dit aucun de ces choix » »), dans le tableau et dans le prompt. | dernier choix | mineur | |
| 138 | logique | « 📊 Ouvrir », une fois les 5 feuilles lues, ouvre le tableau `c-resultats`, qui affiche encore « 5 feuilles à lire » et aucun « ✔ lue ». | 1re séance | mineur | Cliquer « 📊 Ouvrir » dans `#scene=c-seances-lues`. |
| 139 | affichage | Un guillemet ouvrant reste seul en fin de ligne : « son bilan et le « », puis à la ligne « 📝 Bilan » de sa fiche ». | texte de la garde | mineur | |
| 140 | logique | Je ne suis pas sûr que ce soit un défaut. « 🙈 Masquer les copies » n'existe que pour la dernière séance : les séances aux « copies rendues le 26/09 » et « le 17/09 » n'en ont pas. | liste | mineur | |
| 143 | logique | Derrière la garde, la liste est revenue à « copies non rendues » et « 📌 5 feuilles à lire ». Les scènes 138 à 141 montraient « 5 feuilles lues » et « copies rendues le 10/10 ». | fond de la fenêtre | mineur | |
| 144 (et 145, 146) | logique | La corbeille dit « Évaluation d'essai — 3 questions … mise à la corbeille le 08/10 à 18:40 ». Or la séance est encore dans Résultats le 10/10 : point retiré le 10/10 à 19:12, copies rendues le 10/10. | Corbeille | mineur | |
| 144 (et 145, 146) | texte | Deux mots pour une même chose : « sessions fantômes » puis « sessions zombies ». La page dit « base QCM (évaluations, sessions, réponses) », la garde 145 dit « évaluations, séances, réponses ». Et « snapshot » est un mot anglais. | Sauvegarde, Maintenance | mineur | |
| 144 | texte | Paragraphes qui expliquent une règle : « Avant d'importer, le QCM d'aujourd'hui part à la corbeille : rien n'est perdu. », « Si la vue tableau ou le pilotage te montrent des sessions fantômes … utilise le nettoyage ci-dessous. », « Tout part d'abord à la corbeille, gardé un an. Pense quand même à exporter un snapshot. ». | | mineur | |
| 146 | affichage | Un guillemet fermant commence seul une ligne : « La démo « 🎓 Démo — apprendre le déroulé », puis à la ligne « » n'est pas touchée ». | texte de la garde | mineur | |
| 147, 148 | affichage | « Tu étais absente » s'écrit en blanc sur un gris clair, peu lisible. | 2e carte | mineur | |
| 149 | texte | « ⚠️ Tu pensais avoir mieux fait », puis « Tu pensais avoir 2 bonnes réponses 🔵 mais tu en as eu 1 sur 3 (1 bonne réponse 🟠) » : « Tu pensais » répété, et des pastilles de couleur au milieu de la phrase. | Ton estimation | mineur | |
| 150 | affichage | Les deux « 💾 Enregistrer » n'ont pas la même forme : une barre pleine largeur (durées), un petit bouton (niveaux). | cartes durées et niveaux | mineur | |
| 150 | texte | « Les tranches s'écrivent « de 5 à moins de 6 » » : l'exemple ne correspond à aucune tranche affichée (la grille dit « de 5 à moins de 10 »). | sous les niveaux | mineur | |
| 150 | texte | « Évaluations QCM — version de la livraison · socle MJPC-CORE » : la version n'a pas de numéro. | carte Version | mineur | |
| 150 | affichage | Une bande vide sous « Pilotage Données Réglages ? », à la place des sous-onglets. | haut de page | mineur | |
| 150 | texte | Paragraphes qui expliquent une règle : « Les listes d'élèves… appartiennent au site MJPC… », « Il ne devine jamais un temps : … ne produit le JSON qu'à ton « produis le JSON » », « Éditeur des messages élève. Ces phrases s'affichent… », « Vu quand tu as terminé la session. Ce texte s'affiche quel que soit le résultat… » (avec le mot « session »). | cartes | mineur | |
| 150, 151, 152 | infobulle | Mots techniques. « ✏️ Modifier le prompt » : « enregistrées dans Firebase ». « 💾 Enregistrer » (152) : « … dans Firebase. Il sera réutilisé à chaque ouverture du modal ». | | mineur | |
| 150 à 152 | texte | Un même geste porte trois noms : « 🤖 Prompt IA » sur la carte, « 📋 Copier le prompt » dans la fenêtre, « Le prompt de création d'éval » en titre. | | mineur | |
| 151, 152 | affichage | La phrase d'en-tête touche ce qui est dessous : « …puis te rendra le JSON. » est collée au bouton « 📋 Copier le prompt », « …limites de longueur. » est collée au cadre du prompt. | haut de la fenêtre | mineur | |
| 153 (et 154, 155) | texte | Jargon de chantier : « Le clair reste en place tant que les applications en ont besoin — la protection sera effective au 3e temps du chantier sécurité. ». | Codes déverrouillés | mineur | |
| 153 | logique | Je ne suis pas sûr de ce défaut. La page dit « 25 codes préparés », et « Retirer les codes en clair » dit « 25 codes portent encore leur clair ». Or YVON Adam n'a pas de code (« — ») et le bouton dit « Générer 1 code manquant ». | | mineur | Cliquer « Retirer les codes en clair ». |
| 153 | infobulle | « Où la clé est mémorisée » : « Les appareils où la clé est mémorisée. ». L'infobulle ne dit pas ce que fait le bouton. | | mineur | |
| 154 | texte | « Refusé : pas d'exclusion entre Inès et Jade : ESNAULT Inès a déjà 3 exclusions… Retire d'abord une exclusion de ESNAULT Inès. » : « de ESNAULT » au lieu de « d'ESNAULT », deux deux-points dans la même phrase. Et une phrase de règle : « Avec 3 au plus, il existe toujours des binômes possibles, absents compris, dès 8 présents. ». | message rouge | mineur | |
| 155 | affichage | Le champ « synthèse (facultatif) » s'écrit en police à chasse fixe, différente du reste de la fiche. | Synthèse | mineur | |
| 156 | affichage | L'écran est presque vide : un titre, une phrase et « Ouvrir l'éditeur ». Le référentiel annoncé par le titre de la scène n'apparaît pas (ni la version, ni le nombre de domaines). | toute la page | mineur | |
| 157 à 161 | texte | « Version 1.4.0 · 2026-08-02 » : date à l'anglaise, ailleurs on écrit 02/08/2026. Et de longs paragraphes de règle : « Une notion ne se supprime jamais et son identifiant ne change jamais… », « Les 28 compétences du référentiel. Le libellé officiel reste pour École Directe… ». | haut de la page | mineur | |
| 159, 161 | texte | Le formulaire dit « Libellé professeur », le paragraphe dit « Le libellé officiel ». | formulaire | mineur | |
| 160 | affichage | La capture (2600 px) s'arrête à « tr-langages-01 ». Il en manque 9 des 28 compétences, et les groupes « Les méthodes… » et « La formation de la personne… ». Le titre dit pourtant « les 28 ». Les 28 sont bien dans la maquette, en faisant défiler. | bas de la capture | mineur | |
| 162 à 164 | texte | Vocabulaire technique : « Les objets vivent au hub sous /site/edt/ », « injecté le jeudi 3 septembre », « Sortir le JSON », « Réinjecter maintenant… ». L'infobulle de « Plus tard » contient « (edtRappelPlusTard) ». | | mineur | |
| 163, 164 | texte | « JSON de « calendrier » copié — 19717 caractères. », « « creneaux », « periodes », « reglages » … copié — 33349 caractères. » : identifiants sans accents, nombres sans espace des milliers. | message | mineur | |
| 163, 164 | geste | Échap ne ferme pas ce message, alors que les autres fenêtres se ferment à Échap. Seul « Compris » le ferme. | message | mineur | Ouvrir `#scene=m-emploi-du-temps-un`, appuyer sur Échap. |
| 165 | logique | « Durée estimée : 15 min » compte « deux tours » et « co-évaluation et bilan 2 min » pour un élève seul. La carte dit pourtant « il n'a pas de co-évaluation ». | encadré vert | mineur | |
| 165 | logique | Je ne suis pas sûr que la liste doive être complète. « Sessions précédentes — 3 ESSAI » ne montre que 2 séances : « QCM — Le jambon-beurre » (15/09), présent dans Résultats (132), manque. | | mineur | |
| 166, 167 | affichage | Le contenu des tablettes simulées est rogné à droite et en bas (cadre de 402 à 424 px pour 430). Les boutons « 1 élève » et « 2 élèves » et les textes font environ 7 px, illisibles. | tablettes simulées | mineur | |
| 166 | affichage | À 1366×768, des noms sont coupés dans les binômes : « CHALUMEAU » devient « CHALUMEA », « BOURREAU » et « DELACROIX » touchent le bord. | Binômes proposés | mineur | |
| 166 à 168 | texte | Identifiant technique visible : « 🧪 _test_evaluation-qcm (30 élèves) », « Démo — … — _test_evaluation-qcm », « _TEST_EVALUATION-QCM · AUDEBERT ÉLISE » sur la moitié d'élève. Jargon : « Session : pas encore lancée · énoncé non conservé ». Trois noms pour le même mode : « mode test », « bac à sable », « Environnement de test isolé ». | | mineur | |
| 167, 168 | texte | Élisions manquantes : « 📝 Feuille de Élise », « Feuille de Eden », « Feuille de Aymeric », « Feuille de Angèle », « Ce que Élise écrit sur sa feuille ». | sous les tablettes simulées | mineur | |
| 167, 168 | infobulle | Infobulles des compteurs : « … vs. nombre total », « 'Autoriser la réponse' » entre guillemets droits simples, « Remet le chrono à zéro … (durée pleine ré-injectée) ». | compteurs, « 🔄 Relancer chrono » | mineur | |
| 167 | geste | Je ne suis pas sûr de ce défaut. « 🔓 Rouvrir pour un élève » reste actif pendant la réflexion de Q3, alors qu'aucune question n'est close. | barre des boutons | mineur | |
| 168 | logique | Le compteur dit « 14/15 ONT RÉPONDU », alors que la scène 167 affichait « 0/30 ONT RÉPONDU » et que l'infobulle parle du « nombre total ». Et la scène est au 1er tour, alors qu'on l'ouvre depuis la réflexion (167). | compteurs | mineur | |
| 168 | infobulle | Je ne suis pas sûr de ce défaut. Sur la moitié d'élève simulée, les choix portent une infobulle écrite à l'élève : « Le temps de réponse est fini : ton clic ne change plus. ». Si c'est le vrai composant élève, cette infobulle sera aussi sur la tablette. | choix de la moitié d'Élise | mineur | |
| 169 | texte | « … dans quel sens va la flèche à l'étape 4? » : il manque l'espace avant « ? ». Dans « 3e- éval 1 Analyse logique - Construire une phrase complexe », les tirets sont mal placés. | énoncé, titre | mineur | |

## Les scènes relues

Le nombre entre parenthèses compte les lignes du tableau où la scène apparaît.

- 130 c-papier-correction : 12 défauts.
- 131 t-papier-correction : 5 défauts.
- 132 c-seances : 6 défauts.
- 133 c-resultats : 9 défauts.
- 134 c-fiche : 7 défauts.
- 135 c-fiche-garde : défauts de 134 (colonne « lue par Julien », « Regénérer »), et ceux de l'en-tête console.
- 136 c-fiche-retire : 1 défaut propre, plus ceux de 134.
- 137 c-que-dit-la-feuille : 1 défaut propre, plus ceux de 134.
- 138 c-seances-lues : 1 défaut propre, plus ceux de 132.
- 139 c-rendre : 1 défaut.
- 140 c-copies-rendues : 1 défaut propre, plus ceux de 132.
- 141 c-resultats-rendues : défauts de 133 (tableau coupé à 1366, noms et tri inactifs, en-têtes tronqués), plus la note de Lou.
- 142 x632-pdf : 1 défaut.
- 143 c-corbeille : 1 défaut propre, plus celui des « 🗑️ » de 132.
- 144 c-sauvegarde : 5 défauts.
- 145 c-importer : défauts de 144 (vocabulaire).
- 146 c-purger : 1 défaut propre, plus ceux de 144.
- 147 e-mes-evals : 4 défauts.
- 148 e-mes-evals-rendue : 4 défauts, dont le bloquant.
- 149 e-bilan-lou : 3 défauts, dont le bloquant. Aucune infobulle : c'est correct pour un écran d'élève.
- 150 c-reglages : 7 défauts.
- 151 c-reglages-prompt : 5 défauts.
- 152 c-reglages-prompt-modifier : 5 défauts.
- 153 m-classe-exclusions : 3 défauts.
- 154 m-exclusion-refusee : 1 défaut propre, plus le jargon de 153.
- 155 m-fiche-eleve : 1 défaut propre, plus le jargon de 153.
- 156 m-taxonomie : 1 défaut.
- 157 m-taxonomie-editeur : 1 défaut (date, paragraphes de règle).
- 158 m-taxonomie-domaine : rien de plus que la ligne 157 à 161.
- 159 m-taxonomie-notion : 1 défaut, plus la ligne 157 à 161.
- 160 m-taxonomie-competences : 1 défaut (capture coupée), plus la ligne 157 à 161.
- 161 m-taxonomie-competence : 1 défaut, plus la ligne 157 à 161.
- 162 m-emploi-du-temps : 1 défaut.
- 163 m-emploi-du-temps-un : 3 défauts.
- 164 m-emploi-du-temps-tous : 3 défauts.
- 165 c-rattrapage : 7 défauts.
- 166 x620-1-mode-test-ouverture : 6 défauts.
- 167 x620-2-mode-test-reflexion : 14 défauts.
- 168 x620-3-mode-test-en-grand : 9 défauts, dont le bloquant.
- 169 t-annexe : 2 défauts. La mesure annoncée est juste : la carte finit à 733 px sur 800, soit 67 px de reste.

## Le compte

- 2 bloquants.
- 33 gênants.
- 62 mineurs.
- 97 lignes en tout.
