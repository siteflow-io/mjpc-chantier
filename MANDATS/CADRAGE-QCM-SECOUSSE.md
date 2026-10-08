# Cadrage QCM — la secousse du 08/10 (tour 593)

*Conscience n°12, 08/10/2026, 18:0x. Ordre de Paul (17:44) : « maintenant, il faut secouer le cadrage et vérifier que tout tient. » Le cadrage relu en entier (1205 lignes, points 1 à 318) deux fois : par la conscience, et par un relecteur indépendant qui n'avait pas suivi la journée. Chaque constat sur le code a été revérifié dans `evaluation-qcm.html` 7.7.1 (md5 `ecae6562…`). Les numéros 319 à 342 sont ceux de la réponse à Paul (cadrage, tour 593). Document : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/CADRAGE-QCM.md*

**Verdict : ça ne tient pas encore.** Trois mesures étaient fausses ; des points remplacés n'étaient pas marqués ; dix-huit sujets restent à trancher par Paul.

## 1. Trois mesures fausses de la conscience (320)

- **105** disait : à « Rouvrir pour tous », l'élève qui a répondu « retrouve ses choix avec sa réponse cochée ». Faux. `EleveEval` vide l'affichage à chaque changement de phase (`useEffect … setSelection([])`, deps `[qIdx, phase]`, l. 3184-3187) et ne relit la réponse enregistrée qu'au changement de question (`[qIdx, sess.id]`, l. 3246-3252). Il voit donc les choix sans rien de coché ; un toucher part d'une sélection vide et remplace toute sa réponse enregistrée (`toggleChoix`, l. 3218-3230) : en réponses multiples, il perd ses autres cases.
- **106** disait : on ne rouvre que pour un élève sans réponse, une fois par question. Vrai seulement au poste de pilotage (l. 8052, 7621-7624). Au téléphone, `VuePhone` propose « 🔁 Rouvrir Qn pour cet élève uniquement » en réponse comme en attente, qu'il ait répondu ou non (l. 5745), et `sessActions.rouvrirIndividuel` (l. 3899-3911) n'a aucune limite.
- **113** disait : « sans cette saisie, ses résultats détaillés restent fermés ». Vrai pour « Tes évaluations passées » (`EleveSessionPasseeRow` → `EleveResultats` → `EleveSaisieBeta`). Faux pour « Mes évaluations » (`MesEvaluations`, l. 2615-2682) : il ouvre le bilan archivé (`bilanHTML`, calculé sur la tablette) sans aucune saisie, avec un pourcentage pondéré par niveau.

## 2. Passe de propreté faite au cadrage (321)

Marqués « remplacé — ne pas coder » en tête du cadrage, avec leur remplaçant :
- la ligne d'état de 14:31 (« bonus de 1 point fixe », « marquée sur chaque question concernée », « bénéfice du doute dans la console ») → règle consolidée 288 à 293, terminologie 282 ;
- **173** (« la question compte 0, sans aucun bonus ») et **181** (« "aucun des choix" vaut 0 sans exception ») → 176 et 290 : feuille « aucun des choix » et tablette entièrement juste = « Trouvée au dernier moment » (Nathan, 294) ;
- **237** (« 1 point fixe », sur chaque question concernée) → 275 et 290 ; l'endroit du + vert reste à trancher (332) ;
- **19** (binômes formés après l'appel) → 109 (proposés dès le choix de la classe, absents retirés à l'appel) ;
- **le découpage en lots** (45 à 50 sans objet, « lot 2 après le 09/10 » de la dette 181, « après le lot 1 » de 67 et de la dette 186) → Paul, 578 : une exécutante code tout d'un coup ;
- **40** (classer sur « le score app pondéré ») → plus de pondération (273) ; le résultat de classement est à trancher (323) ;
- **35, 36, 56, 61** pour ce qu'ils disent des « points » des niveaux → 273 et 295 ; les niveaux de difficulté gardent la couleur (et le bilan) ;
- **169** (exemple « sa note passe de 14 à 11 points ») → avec 1 point par question (273), une question corrigée d'après la feuille fait perdre 1 point, pas 3 ;
- **234**, pour son motif (« Chaque question rapporte 1 point, ce qui est faux depuis 112 ») → avec 273, l'encadré du tout ou rien redevient juste ; c'est l'encadré du mode partiel (« Chaque bonne case cochée te rapporte 1 point », l. 3270-3280) qui est faux ; la proposition d'attestation (234) reste ouverte ;
- **105, 106, 113** → corrigés en 320.

Registre : dettes 181, 186, 193, 196 alignées ; dettes 201 à 204 ajoutées (ci-dessous et 322).

## 3. À inscrire au mandat sans décision de Paul (322)

- **Le collage du JSON jette tout champ nouveau, sans message** (dette 201). `parseEvaluation` (l. 2273-2316) ne garde que `titre`, `mode` et, par question, `enonce`, `choix`, `bonnes`, `niveau`, `explication`. Les temps par question (56, 185), les compétences (307, 315), le chapitre (317) seraient perdus. Le collage doit les garder et les vérifier, avec un message qui cite l'élément fautif (déjà le canon `mjpcValidation`).
- **« Viens me voir » dans l'écran de connexion** (dette 202). `EleveLogin` (l. 2748) : « Ton code n'est pas encore enregistré. Viens me voir pour qu'on le mette en place. » Contraire à la règle permanente de Paul (06/10) : jamais « va voir ton professeur » ; en classe, l'élève lève la main. Les mots nouveaux sont à donner par Paul.
- **En mode partiel, la console compte en tout ou rien** (dette 203). `Scoresheet.isJuste` (l. 8282-8286) ne connaît que l'égalité exacte, quel que soit le mode, alors que la page de l'élève compte en partiel. Contraire à « une seule note, la même partout » (112, 213).
- **La réouverture** (dette 204) : les deux constats de 320 (105 et 106) ; ce que l'élève doit retrouver est à trancher (331).

## 4. À trancher par Paul (323 à 340)

323. **Les binômes : sur quel résultat classer ?** 40 visait le score pondéré, qui disparaît (273). La note est la feuille, qui n'existe qu'après la saisie (223), et pas pour l'élève sans saisie ; 42 ne traite que les absents. Proposition : la note de la feuille ; à défaut, la tablette ; l'absent comme en 42.

324. **L'archive, « Mes évaluations » et le profil longitudinal se calculent sur la tablette.** `archiverDansProfilsMJPC` (l. 3647-3741) n'est appelé qu'à la dernière question corrigée (l. 7598), et ne lit que les réponses de la tablette. Le cadrage ne dit pas que l'archive doit suivre la note (la feuille) après la saisie, puis après une correction de Paul (168-170), ni ce qu'elle garde pour un élève sans saisie. Le code dit au contraire « on ne recompte jamais après coup » (l. 2634-2635).

325. **« Aucune note avant la saisie » (223) : quatre écrans montrent déjà un score.** Pendant la correction, la tablette affiche « x bonnes réponses » sur « y questions déjà corrigées », avec des pastilles vertes et rouges (l. 4335-4350). En fin de séance : l'estimation (« tu en as eu 5 sur 11 »), la comparaison à la classe (médiane, plus bas, plus haut) et les 5 dernières évaluations (l. 4189-4262). « Mes évaluations » : un pourcentage (l. 2657). À trancher : ce qu'on masque jusqu'à la saisie (l'estimation, qui sert à la métacognition, compare justement à la tablette).

326. **Le moment de la saisie (143, 249).** Encore ouvert. Télescopage : la tablette oublie ses deux élèves à « Terminer la session » (64, 38), alors que la saisie ne s'ouvre aujourd'hui qu'après « Terminer » (246). 249 (la saisie avant la correction) règle aussi ce télescopage, la consigne de correction (248) et la garde de débordement (58, qui ne compte pas encore le temps de la saisie).

327. **Les temps.** 56 met le temps de réponse dans le JSON de chaque question ; 199 et 239 font corriger la case « ✋ Réponse ». Laquelle gagne ? Avec deux tours (25), « +5 / +10 / +30 s » ajouté au tour 1 vaut-il aussi pour le tour 2 (Paul ajoute du temps 34 à 44 fois par séance, 57) ? Quel geste coupe un tour de réponse, puisque « ✋ Autoriser la réponse » ne coupe que la réflexion (Paul, 584) ? Et « changer le niveau en direct » (l. 7575-7587), qui rallongeait la réflexion, n'a plus de sens si le temps ne dépend plus du niveau (1, 56).

328. **Les questions « BONUS ».** Ta 4e du 09/10 a une Q21 « BONUS — … » et ton interro de 3e du chapitre 1 une Q10 « BONUS — … ». Avec 1 point par question et la note sur le nombre de questions (297), une question bonus compte au dénominateur : ce n'est plus un bonus. Et 282 a retiré le mot « bonus » dans un autre sens. À trancher : une question bonus sort-elle du dénominateur ?

329. **L'ordre mélangé ne protège pas en réponses multiples** (74). « Aucune bonne réponse ne garde sa lettre » n'empêche pas que les lettres justes restent les mêmes : si A et C sont bonnes et échangées, les lettres justes du second restent A et C, et recopier son voisin est juste. La règle qui tient : « les lettres justes du second ne sont pas celles du premier ». Une règle plus forte (aucune lettre juste en commun) est impossible dès que plus de la moitié des choix sont bons (Misérables 2 : Q1, 5 bonnes sur 8).

330. **Ce que l'élève saisit.** Pour « Sur ta copie, écris une phrase… » (258) : sa feuille porte une phrase, pas une réponse. Et la phrase recopiée (160, 164) n'est pas tranchée ; 166 et 173 la supposent. L'exécutante ne sait pas si elle code un champ de texte par question, sur une demi-tablette.

331. **La réouverture** (après 320). Que retrouve l'élève qui avait déjà répondu, à « Rouvrir pour tous » et à la réouverture individuelle ? Et la même limite partout (poste, téléphone, tableau), puisque n'importe quel écran pilote (91) ? 105 et 106 restent sans réponse de Paul.

332. **Où mettre le + vert de « Trouvée au dernier moment »** (300, sans réponse). Sur la seule question qui compte, ou sur chaque question où la feuille est fausse et la tablette juste (Sacha : 4 questions, 1 point) ?

333. **« 1 élève » sur une tablette de classe.** Paul, 7 : « zéro raccourci MJPC sur les tablettes » ; 127 (ouvert) garde le raccourci en « 1 élève », comme la dictée. Paul, 13 : « jamais de choisis ta classe » ; 88 ne retire le choix de la classe qu'en « 2 élèves ». Un élève qui touche « 1 » par erreur sur une tablette retombe sur l'un ou l'autre.

334. **Les lettres** (117, 95, ouverts). L'argument de 118 contre la suppression des lettres (« tu ne pourrais plus dire "la B" ») ne tient plus : au tableau, les choix ne s'affichent jamais en réponse (Paul, 21) et s'affichent sans lettres en correction (95). Supprimer les lettres partout redevient possible ; le coût restant est la saisie (142) et le tableau des scores.

335. **Le rattrapage.** L'app permet de relancer une évaluation pour des absents (l. 7035, 7099). Une séance de rattrapage à deux élèves deviendrait « le QCM précédent » de toute la classe (41) et ferait les binômes suivants. Et la note d'un élève qui passe deux fois la même évaluation n'est pas cadrée.

336. **L'élève parti en cours, ou arrivé en retard.** Les questions qu'il a manquées comptent-elles 0 sur le nombre de questions (297), ou sortent-elles du compte (le code annonce « sa note sera calculée au prorata », l. 7518, sans le faire) ? Que saisit-il pour elles ?

337. **La séance interrompue, ou terminée avant la fin de la correction.** La fenêtre « Session interrompue détectée » (l. 6969-7012) bloque le poste, pendant que les autres écrans font passer les phases (91) ; rien ne dit comment on reprend au milieu d'un tour. Et « Terminer » avant la dernière question corrigée n'écrit aucune archive (l. 7596-7601).

338. **Aucun geste ne te permet de fixer une note.** 223 : « c'est toi qui la fixes d'après sa feuille » (élève sans saisie) ; 120 : l'évaluation sans connexion. 168 ne corrige qu'une saisie existante. Proposition : la fenêtre « Que dit la feuille ? » (168) marche aussi sans saisie, question par question, et vaut saisie.

339. **Les compétences** (307, 315). Une question « Trouvée au dernier moment » compte-t-elle pour sa compétence ? Une compétence portée par une seule question donne 0 % ou 100 %. Comment la part de points d'une compétence passe-t-elle aux bornes posées « sur la note finale » (108, 131) ? L'autoévaluation garde ses seuils fixes à 25, 50 et 75 % (l. 3948-3955) : suit-elle les tranches de 131 et le lexique de 313 ?

340. **L'arrondi.** Les fractions du mode partiel (274) et la note ramenée sur 20 (297) donnent des décimales ; avec des paliers « de 5 à 5,99 » (35), une note à 5,995 tombe entre deux.

## 5. Restent sans réponse de Paul (341)

64 (l'heure de fin de séance) · 97 et 142 (le texte des choix dans la saisie) · 115 (le scan) · 120 (sans connexion) · 121 (le choix des binômes au JSON, pour plusieurs classes) · 165 (une sanction ou non) · 234 (l'attestation) · 313 (le lexique du socle) · 317 (l'évaluation porte son chapitre) · les mots vus par l'élève, jamais donnés (145, 169 « corrigé d'après ta feuille », 173 « Ma feuille ne dit aucun de ces choix », 230 la phrase sous « Trouvée au dernier moment ») · les préalables au mandat : les captures de la console (73) et l'inventaire « tout visible » (147, 148).

## 6. Vérifié dans le code, et qui tient

2 (case « ✋ Réponse » de 3 à 30 s, remise à 5 à chaque séance, l. 7377, 7878) · 5 et dette 180 (33 `off()` sans argument sur 38) · 7 (raccourci MJPC de 12 h, l. 1280) · 8 (chrono à l'horloge de chaque tablette, l. 3207) · 9 (l'écoute `sessions/<sid>` jamais retirée, l. 2794) · 10 et 68 (seul le poste fait passer les phases, l. 7447-7463) · 19 (l'appel au lancement, l. 7053-7095) · 61 (« Durées des niveaux » replié, pondération dans Sauvegarde, l. 7182, 7841, 8776) · 64 (aucune heure de fin) · 67 (contenu de l'archive, l. 3721-3741) · 93 (vue tableau en réponse et en correction) · 107 (fourchettes fixes, l. 4000-4005) · 111 et 270 (« 1 pt » en tout ou rien, « Points pour la note » pondéré) · 138 (saisie enregistrée à « Envoyer », puis rechargement) · 139 (le meilleur des deux, sans limite) · 162 (« Mes évaluations » en pourcentage pondéré) · 171 (« Envoyer quand même ? ») · 188 (le choix enregistré, pas la lettre) · 196 (App, Papier, Écart) · 198 (`bonnes` non défini, l. 4365) · 199 (la case non prise au passage automatique, l. 7458) · 246 (saisie sur séances terminées, l. 2817) · 248 (consigne de correction selon la tablette, l. 4385-4391) · 262 (mode partiel) · 265 (les trois textes contraires au code) · 294 (recompte de la fausse classe) · 305 (aucune compétence) · 313 (« Faible… Très bien » au bilan de classe et au suivi de l'autoévaluation, l. 7306, 7680) · 317 (aucun champ chapitre). Non vérifiable d'ici (hub ou dictée 6.7.0) : 57, 60, 110, 126, 177, 316 — 316 a été mesuré au hub au tour 592.

## 7. Les propositions (tour 594, Paul : « fais tes propositions pour chaque. logique et simple. »)

**Le fil qui rend tout simple : la saisie avant la correction (326).** La séance devient : les questions (deux tours, l'un après l'autre) ; la saisie, chacun sur sa moitié ; l'estimation ; la correction ; la note. Au moment de la correction, l'app connaît déjà toutes les feuilles. Plusieurs points se règlent d'eux-mêmes.

**323 — Les binômes.** On les forme sur la note de la feuille du QCM précédent. Un élève sans note est traité comme un absent (42) : les élèves sans note sont mis ensemble.

**324 — L'archive.** Elle s'écrit d'après la note (la feuille, avec « Trouvée au dernier moment »), plus d'après la tablette. Quand tu corriges une feuille (168) ou fixes une note (338), l'archive se met à jour, et l'ancienne valeur reste gardée (170). Un élève sans saisie est archivé « sans note » jusqu'à ce que tu la fixes.

**325 — Ce qu'on masque.** Avec 326, plus rien : la saisie est faite avant que le moindre score s'affiche. Seul l'élève qui n'a pas fait sa saisie voit, à la place de sa note : « Ta note s'ouvrira quand tu auras fait ta saisie. »

**326 — Le moment de la saisie.** En classe, juste après la dernière question, avant l'estimation et la correction (249). La tablette garde ses deux élèves jusqu'à « Terminer », donc plus de télescopage avec 64. Je ne sais pas combien de temps prend la saisie : la garde de débordement (58) part de 10 secondes par question, puis prend la durée mesurée dès ta première séance.

**327 — Les temps.** Chaque question a ses deux temps, réflexion et réponse, donnés au JSON (56) ; la case « ✋ Réponse » disparaît. Les deux élèves ont le même temps de réponse (25). « +5 / +10 / +30 s » vaut pour le tour en cours. « ✋ Autoriser la réponse » coupe la réflexion ; un bouton « Tour suivant » coupe le tour 1, et « 🔒 Clore la question » coupe le tour 2. « Changer le niveau en direct » disparaît, puisque le niveau ne fixe plus le temps.

**328 — Les questions BONUS.** Une question marquée « bonus » dans le JSON compte dans les points gagnés, pas dans le total. La note ne dépasse jamais le maximum (20 sur 20). Le mot « bonus » reste pour ces questions ; c'est seulement « Trouvée au dernier moment » qui ne s'appelle plus ainsi (282).

**329 — L'ordre mélangé.** La règle devient : « les bonnes réponses du second ne sont jamais à la même place que celles du premier ». Seule exception : quand tous les choix sont bons.

**330 — Ce que l'élève saisit.** Seulement ses réponses, en touchant les choix, sans phrase à recopier (160 et 164 tombent). Pour une question « Sur ta copie, écris une phrase… », la feuille porte la phrase et, en dessous, la réponse courte à la question ; seule la réponse se saisit. Le prompt écrit chaque question pour qu'on puisse y répondre en quelques mots sur la feuille.

**331 — La réouverture.** Une réponse donnée est définitive. Rouvrir, pour tous ou pour un seul, ne rouvre que pour ceux qui n'ont pas répondu, une seule fois par question, et c'est la même règle au poste, au téléphone et au tableau. Pendant ce tour rouvert, son voisin porte le voile ordinaire. Cela remplace 105 et règle ta crainte de 30 : « il n'avait pas pu répondre ».

**332 — Le + vert.** Sur la seule question qui compte. Les autres questions dans le même cas restent fausses, comme la feuille. En tout ou rien, s'il y en a plusieurs, c'est la première dans l'ordre de l'évaluation.

**333 — « 1 élève » sur une tablette.** « Choisis ta classe » disparaît partout : l'élève donne son code, son prénom et son nom, et l'app trouve sa classe (13). En « 1 élève », le raccourci MJPC reste (7), mais il demande d'abord « Tu es bien Julien ? » : « Oui » entre, « Non » ouvre l'écran du code (89). L'app ne peut pas distinguer une tablette de classe d'un ordi du CDI ; c'est donc le moyen le plus simple. Même chose dans la dictée, qui a le même risque (126, dette 194).

**334 — Les lettres.** On les supprime partout. Chaque choix est un bouton avec son texte, sur la tablette, dans la saisie et dans ta fiche ; le tableau n'en a déjà plus (21, 95). Dans ton tableau des scores, chaque question s'affiche ✓ ou ✗, et le détail en texte s'ouvre dans la fiche de l'élève. Le mélange garde sa force, puisqu'il change les places. 117, 118 et 195 tombent.

**335 — Le rattrapage.** Une évaluation déjà passée par la classe se relance en « rattrapage » (l'app le sait déjà, elle t'avertit). Un rattrapage ne sert jamais de « QCM précédent » pour les binômes. Une évaluation donne une note par élève : celle de la première séance où il était présent.

**336 — Parti ou en retard.** Les questions manquées sortent du total : la note porte sur les questions auxquelles il était là, ramenée sur 20. Sa ligne dans ta console le dit (« noté sur 7 questions sur 11 »), et tu peux toujours fixer sa note (338).

**337 — Séance interrompue ou terminée tôt.** « Terminer » écrit toujours l'archive, avec les notes telles qu'elles sont, quelle que soit la phase. À la reprise d'une séance interrompue, le tour en cours recommence au début, voile compris.

**338 — Fixer une note.** La fenêtre « Que dit la feuille ? » (168) marche aussi sans saisie : tu touches, question par question, ce que dit la feuille, et cela vaut saisie. C'est aussi la voie de l'évaluation sans connexion (120).

**339 — Les compétences.** Une question « Trouvée au dernier moment » compte comme juste pour sa compétence aussi. Chaque compétence évaluée l'est par au moins deux questions : le prompt le respecte, et l'app avertit au collage. La part des points d'une compétence se met sur l'échelle de la note, puis passe dans les mêmes tranches (131). L'estimation suit, elle aussi, ces tranches et ces mots (313) : une seule échelle partout.

**340 — L'arrondi.** La note s'arrondit au dixième, au plus proche. Les tranches s'écrivent « de 5 à moins de 6 » : aucune note ne tombe entre deux.

**64 — L'heure de fin.** Lancement + 55 minutes, modifiable à l'appel. La tablette oublie ses élèves à « Terminer », ou à l'heure de fin + 10 minutes.

**97 et 142 — La saisie.** Elle montre le texte des choix, dans l'ordre que l'élève a vu (avec 334, sans lettres), plus la case « Ma feuille ne dit aucun de ces choix » (173).

**115 — Le scan.** On le retire : il n'a jamais servi, et la feuille ramassée suffit (168).

**120 — Sans connexion.** On imprime les énoncés seuls (119), puis tu fixes chaque note par 338.

**121 — Les binômes au JSON.** Rien dans le JSON, puisqu'une même évaluation sert à plusieurs classes : l'app décide classe par classe. C'est le placement libre au premier QCM de la classe, sinon d'après le précédent (323).

**165 — La sanction.** Aucune dans l'app : la question corrigée compte d'après la feuille, et le reste est ton affaire, hors de l'app.

**234 — L'attestation.** Oui, reprise de la dictée, sur chaque moitié, avant la question 1. Elle dit la règle de 288 à 290 et sa raison, avec tes mots (577).

**313 — Le lexique.** 🔴 Maîtrise insuffisante, 🟠 Maîtrise fragile, 🔵 Maîtrise satisfaisante, 🟢 Très bonne maîtrise, partout.

**317 — Le chapitre.** Oui : l'évaluation porte son chapitre, le prompt reçoit ses compétences, et l'app refuse au collage une compétence hors du chapitre.

**169, 173 et 230 — Les mots vus par l'élève.** Je te les proposerai tous d'un bloc, sur les captures, pour que tu donnes les tiens.

**73 et 148 — Les préalables.** Dès que tu as tranché ces points, je fais l'inventaire « tout visible » et les captures de ta console.
