# LE DÉROULÉ — CE QUI RESTE À CADRER (pour la conscience qui reprend)

*Rapport écrit le 01/11/2026 en lecture seule : rien n'a été modifié dans les deux dépôts, aucun commit, aucun appel réseau. Production lue : `index.html` **8.77.0-⑩** (md5 `55694fe15bc27b5fb318eeb1e05910a1`, 26 639 lignes) ; « index.html:n » renvoie à ce fichier. Sas lu : `/home/claude/mjpc-chantier` (branche `main` du clone local). Le code a été vérifié par recherche de texte, le site n'a pas été joué : « absent » veut dire « 0 occurrence trouvée », pas « mesuré par le geste ». Ce qui n'est pas trouvé est dit « je ne sais pas ».*

*Comment lire : chaque sujet a un numéro (numérotation continue). « Décidé » cite Paul mot pour mot avec sa source ; « Ouvert » est la question telle qu'elle a été posée ou telle qu'elle découle des sources ; « Code » dit ce qu'on trouve dans `index.html` ; « Dépend de » dit ce qui doit être cadré avant.*

**Le compte : A = 13 sujets (cadrés, décidés, pas codés) · B = 7 sujets (commencés, points ouverts) · C = 8 sujets (jamais cadrés).**

---

## Ce qu'il faut savoir avant

1. **Ce qui est fait.** L'intégration de la maquette p8 est en production depuis le 23/10 (8.75.0-①), puis ② (25/10) à ⑩ (29/10) : le contrat `MANDATS/INTEGRATION-DEROULE/CONTRAT.md` §12.1 à §12.74 est codé, sauf ce qui est listé ci-dessous. **La ⑪ (§12.75) n'est pas en production.**

2. **Le plan de 10 jours n'a jamais tourné.** Paul a refusé son lancement le 25/10 à 20:17 : « Ok sauf 337 », 337 étant « go du plan de 10 jours » (`TRANSCRIPTS/C13/TRANSCRIPT-C13.md:3156`, appliqué l. 3158 et 3164 : « pas de plan de 10 jours ») ; confirmé dans `MANDATS/PROFIL-CLASSE/CADRAGE-RELU.md:13`. Il n'existe aucun dossier `LIVRAISONS/PLAN-10-JOURS/` au sas : les mandats A1 (attendus), P1 (prompt), D1, S sont écrits, jamais lancés. Le plan reste utile comme inventaire.

3. **Les points du déroulé laissés ouverts par la n°13.** Sa passation (`MANDATS/PASSATION-C13-C14.md:43`) : « 1126, 1026, 1008, 1001, 979 à 988, 905 à 917 (28-29/10) : l'Atelier et le déroulé […] **À reposer à Paul tels quels, ou à fermer avec lui** ; ne rien relancer seul. » La n°14 ne les a pas reposés (`TRANSCRIPTS/C14/TRANSCRIPT-C14.md:32` : « je te les reposerai un par un plus tard »). Attention : 905 à 917 et 1126 sont des points de la **rédaction** (les questions de la lettre, les captures de [l'élève]), pas du déroulé (`TRANSCRIPT-C13.md:6912-6936`, 7957). Les points du déroulé sont 979 à 988 (le profil de classe, sujet 18), 1001 et 1008 (les diapos au canon et « Annuler cette heure » ; ce dernier est codé), 1026 (les couleurs des canons, sujet 14).

4. **Pourquoi cette passation.** Le 01/11 à 18:48, Paul : « il faut que je lance une autre conscience et ses exécutants sur les dettes du déroulé » (`TRANSCRIPT-C14.md:3157`). La n°14 tient la rédaction (`redaction.html`) et partage seulement le registre, le journal, le point de retour, « où trouver quoi » et la branche `main` du sas (l. 3165).

---

## A · Cadré et décidé, pas codé (13)

5. **Le ◆ au pilotage et les anniversaires (« L'ÉLÈVE — 2 »).**
Décidé : cadrage 6 §3.4 et §4 (`DEROULE/CADRAGE-6-L-ELEVE.md:40-42`, `:56-59`) ; Paul : « la pastille oui, en revanche le texte doit être invariablement : bon anniversaire titouan. et moi dans ma console je vois l'âge » et « Je ne veux pas que ça soit en modale par dessus le cours » (cités dans `MANDATS/MANDAT-ELEVE-2.md:7`, tours T273-T274 de C12). Le mandat est écrit (`MANDATS/MANDAT-ELEVE-2.md`).
Ouvert : rien sur le comportement. Le mandat dit lui-même « à préciser sur le moteur retenu, avec la conscience, avant lancement » (`MANDAT-ELEVE-2.md:9`) : il a été écrit pour l'ancien moteur (`AT_DR_*`), il est à relire contre les modules `dr_*` d'aujourd'hui.
Code : absent. « Bon anniversaire » et « 🎂 » : 0. Le ◆ n'existe que dans la console des classes (index.html:5638, 6119) ; `amenagements` et `nbDispositifs` ne sont lus que par la console (index.html:5900-6515), jamais par le pilotage ni « qui a participé ».
Dépend de : rien à cadrer ; la clé de chiffrement (sans clé, aucun ◆, cadrage 6 §3.4).

6. **Les notions : créer une notion en classe et en fin d'heure, la garde Éduscol, les attendus au hub, compléter ou réécrire un libellé.**
Décidé : cadrage 3 §5 à §7 (`DEROULE/CADRAGE-3-LES-NOTIONS.md:29-46`), validé par Paul le 12/09 (« réglons tout ce qui est en attente de mon mot », l. 2). « Sans ce mandat, la garde n'existe pas : c'est un préalable » (l. 37). Paul, 28/10 07:12 : « La taxo doit s'appuyer sur eduscol » (`CONTRAT.md:299`).
Ouvert : le volet littérature de la taxonomie. Le mandat A1 ne fait que mesurer « les items des attendus de 5e, 4e, 3e dont aucune notion de la taxonomie ne se réclame » ; ensuite « à cadrer avec Paul, rien n'est créé » (`MANDATS/PLAN-10-JOURS.md:30`, `MANDATS/PLAN-10-JOURS/MANDAT-A1-ATTENDUS.md:21`). Le fragment « mouvements littéraires » v2 attend que Paul le colle (registre 13 · 71, prod `docs/MJPC6-DETTES.md:3138`).
Code : « + une notion » est posé mais grisé, infobulle « avec la garde Éduscol (les attendus ne sont pas dans la maquette) » (index.html:19032) ; `/attendus` : 0 ; la taxonomie a « ＋ Ajouter une notion » (index.html:2734, §12.48), sans rattachement à un attendu ; le refus d'une réécriture de libellé (§7.2) : non trouvé.
Dépend de : les attendus au hub (mandat A1, écrit le 22/10, jamais lancé). La garde vient après.

7. **Le tableau en Win K : le site voit l'écran étendu et propose d'y envoyer le tableau.**
Décidé : cadrage 1 §1.7 (`DEROULE/CADRAGE-1-LA-CLASSE.md:18`, Paul 17/09) : après Win+K, le site « propose, en un clic, d'y envoyer la fenêtre du tableau en plein écran » ; si l'écran décroche, il ferme cette fenêtre et dit « l'écran 2 a décroché — refais Win+K, puis clique Écran 2 ».
Ouvert : rien.
Code : absent (`getScreenDetails`, `isExtended` : 0). L'infobulle demande à Paul de le faire à la main : « Win+K ou Win+P « Étendre », puis F11 » (index.html:20501).
Dépend de : rien.

8. **L'ouverture de l'heure dit ce qui reste « à régler » dans l'Atelier.**
Décidé : cadrage 1 §6.7, ajout du 28/09 (`CADRAGE-1-LA-CLASSE.md:74`) : « n choses à régler dans l'atelier pour cette heure » avec le lien vers « À régler » ; si Paul lance quand même, c'est noté au journal et rien de technique ne s'affiche ensuite.
Code : absent de « Où en est la classe » (`ouvrirOuverture`, index.html:19273 ; « à régler dans » : 0). « À régler » existe dans l'Atelier (index.html:17900).
Dépend de : rien.

9. **Le numéro de l'espace de travail École Directe de chaque classe.**
Décidé : cadrage 4 §4b.6 (`DEROULE/CADRAGE-4-LA-PREPARATION.md:74`, Paul 15/09) : « Chaque classe porte, une fois pour toutes, le numéro de son espace de travail (saisi par Paul dans la fiche de la classe, avec l'appariement de l'emploi du temps) » ; le site compose « voici le lien de l'espace de travail […] ; clique ensuite sur le dossier Français… ».
Ouvert : la n°13 a reposé « Où saisir École Directe (`/classes/<slug>/ed`) : le panneau des classes de l'atelier ? » (`MANDATS/PLAN-INTEGRATION-DEROULE.md:191`) ; pas de réponse trouvée. Le cadrage 4 y répond déjà : contradiction à fermer d'une phrase avec Paul.
Code : le site lit `classes/<slug>/ed` (index.html:16942-16943) et s'en sert pour la consigne vidéo (index.html:19242) ; rien n'écrit `ed` (aucune saisie trouvée). La copie École Directe part sans lien (`CONTRAT.md:136`, §12.12).
Dépend de : rien.

10. **Les documents Word projetés.**
Décidé : cadrage 4 §3.2, objet « document » (`CADRAGE-4-LA-PREPARATION.md:51`, Paul 29/09 : « oui document, c'est surtout Word et PDF, mais aussi tout type de doc ») : Word « lu par le site (une bibliothèque libre, jamais un service payant) et projeté comme des pages, ou converti en PDF par Paul si la lecture échoue — la garde le dit ».
Code : le type `docx` est déclaré « projetable » (index.html:17664, 18293) mais aucune bibliothèque de lecture Word n'est chargée (seule `xlsx` 0.18.5). Hors document par référence, `docHtml` rend encore un texte de maquette (« Page n du document — le texte de la fiche méthode se lit ici… », index.html:21119-21120) : à mesurer par le geste.
Dépend de : rien.

11. **Le mode d'emploi dans le site et le compteur des pages HTML.**
Décidé : cadrage 4 §4.4 : « n pages HTML dans tes chapitres, n objets manquants à l'éditeur ; ce compteur doit tendre vers zéro » (`CADRAGE-4-LA-PREPARATION.md:60`) ; §6.1 : « une page « Comment on ajoute un objet » existe dans le panneau prof » (l. 88).
Code : absents (0). « À régler » et « Déclarer un objet manquant » existent (index.html:18269).
Dépend de : rien.

12. **La structure nommée « ici se branche le profil longitudinal ».**
Décidé : cadrage 1 §11b.5 (`CADRAGE-1-LA-CLASSE.md:122`, Paul 10/09 : « Ce qui n'existe pas encore ne tombe pas ») : à la clôture, par classe et par heure, le récit, le travail en entier, les absents avec heures et raisons, le mot par absent, « dans une structure nommée, à un seul endroit, avec le commentaire « ici se branche le profil longitudinal », listée dans « Où trouver quoi » ». Le cadrage 3 §3.1 y ajoute les notions de l'heure (`CADRAGE-3-LES-NOTIONS.md:22`).
Code : le commentaire est absent d'`index.html` et de `docs/MJPC6-OU-TROUVER-QUOI.md`. La donnée vit dans le paquet de l'heure `H` (`CONTRAT.md:133`, §12.9) et `S.mots` (index.html:19221). Je ne sais pas si la n°13 a tenu `H` pour cette structure : aucune source ne le dit.
Dépend de : rien ; le profil de classe (18) et le profil longitudinal (27) la liront.

13. **Le prompt d'injection dans le site, et ses ajouts du 29/10.**
Décidé : cadrage 4 §5 (`CADRAGE-4-LA-PREPARATION.md:81-85`) : le prompt est « au hub, composé par le site », maintenu le même jour que la validation et l'éditeur (§5.4) ; contrat §12.67 (5) (`CONTRAT.md:395`) : il écrit la phrase de chaque séance, met la compétence majeure en premier, marque les séances évaluées — Paul, 29/10 10:07 : « ce sont de nouveaux types de diapo à créer et le prompt d'injection à adapter » (`TRANSCRIPT-C13.md:7321`).
Code : la version 1.0 vit au sas (`MANDATS/PROMPT-INJECTION/PROMPT-INJECTION.md`) ; le site utilise encore `ATELIER_PROMPT_SEED` (index.html:8086 ; « Construire un chapitre avec une IA », l. 9002). La 1.0 ne parle pas des séances évaluées. Je ne sais pas si la 1.0 a été déposée au hub.
Dépend de : le sujet 14 (les nouveaux types de diapo).

14. **Les diapos d'ouverture au canon, et les compétences nommées par la phrase d'élève.**
Décidé : contrat §12.67 (`CONTRAT.md:395`) ; Paul, 29/10 10:07 : « Oui à tout après, sauf 996, la phrase élève, pas l'intitulé officiel évidemment » (`TRANSCRIPT-C13.md:7321`) ; les quatre canons au sas (`MANDATS/CANONS-DIAPOS/1` à `4`) ; les fonctions proposées 1016-1020 (dévoilement au clic, dates de la classe, séance du jour entourée d'or, cases jouées cochées en fin de chapitre, l. 7410) acquises par « ok pour le reste » (l. 7429) ; registre 13 · 91 (`docs/MJPC6-DETTES.md:3159`).
Ouvert : 1026, sans réponse : « Si tu as les fichiers de tes canons (PowerPoint), je prends les couleurs exactes dedans » (`TRANSCRIPT-C13.md:7445`). 995 (« le bleu vif des séances 3, 4, 5 et 7, ce sont les séances évaluées ? », l. 7308) est écrit au contrat comme acquis, mais `MANDATS/CANONS-DIAPOS/LISEZ-MOI.md:7` dit encore « sens à confirmer ».
Code : absent (« Les compétences du chapitre », « Le parcours du chapitre » : 0). Les quatre diapos invariables de §12.62 (3), que ces types doivent remplacer, sont en production. Les compétences prennent encore l'intitulé officiel (`dr_invCompLib` lit `libelle`, index.html:16656).
Dépend de : le sujet 21 (la charte des 3e est ce canon) et le sujet 13.

15. **La ⑪ : le récit, l'Atelier sans classe, le bilan de la classe, et six dettes.**
Décidé : contrat §12.75 (`CONTRAT.md:403`) ; Paul, 29/10 12:41 : « ok pour tout » (`TRANSCRIPT-C13.md:7731`, acté l. 7741 : « 1053 à 1063 sont acquis ») et « 1087 oui et du coup une diapo avec des pages dans la colonne de gauche sont encadrées d'un liseré fin » (l. 7811). Le contenu : le « je » d'une consigne est la classe (13 · 95) ; les quatre règles du récit et le modèle de la séance du Horla (1057, l. 7661) ; l'Atelier sans classe, la répétition toujours avec 3E Charles de Gaulle, répéter une vraie classe « depuis son profil, sur sa copie » ; la diapo vierge « le bilan de la classe » après le bilan, sans garde, mots-clés cochés seuls, sur plusieurs pages si besoin ; la garde du navigateur en répétition (13 · 97) ; poignées de Structure (13 · 98) ; texte justifié (13 · 99) ; « USB ✅ / USB ⌛ » (13 · 100) ; la feuille projetée pilotée depuis le pilotage (13 · 103) ; les pages dans la colonne (13 · 104).
Ouvert : rien sur le comportement. Attention : la diapo vierge après le bilan contredit la règle écrite du cadrage 1 §6.4 (« rien ne s'insère, ne se colle ni ne se déplace après lui », `CADRAGE-1-LA-CLASSE.md:70`) ; c'est Paul qui l'a changée le 29/10 (« la règle est qu'il n'y a pas de diapo après le bilan: en fait si, il en faut une vierge absolument », `TRANSCRIPT-C13.md:7641`). Le cadrage 1 n'est pas mis à jour.
Code : absent de la ⑩ (« Le bilan de la classe » : 0 ; « USB ✅ » : 0). Je ne trouve aucune branche du sas qui porte la ⑪ (la branche `integration` n'est pas dans le clone local).
Dépend de : la répétition « depuis son profil » dépend du sujet 18.

16. **« Relire l'heure » ouvre le profil de la classe.**
Décidé : Paul, 29/10 09:54 : « la relecture, une fois que j'ai l'encadré en haut qui me propose de relire, cette relecture se ferait dans le profil de classe, non? » (`TRANSCRIPT-C13.md:7288`) ; réponse 989 « oui » (l. 7296) ; contrat §12.69 (`CONTRAT.md:397`).
Code : « Relire l'heure » mène à la Relecture (index.html:19221, 20110) ; le profil n'existe pas.
Dépend de : le sujet 18.

17. **La carte de classe « dans les temps ».**
Décidé : proposition 955 (« le retard se compte en heures jouées sur toute la progression du niveau […] la carte dit lequel des deux est en cause », `TRANSCRIPT-C13.md:7159`), acquise sans commentaire de Paul selon sa règle (961 : « Ce que tu ne commentes pas dans 952 à 960 est acquis », l. 7171) ; registre 13 · 90 (`docs/MJPC6-DETTES.md:3158`).
Code : pas changé ; le clic sur la carte dit toujours « Profil de la classe … — il arrive au lot suivant » (index.html:24868).
Dépend de : le sujet 18.

---

## B · Commencé, avec des points ouverts (7)

18. **Le profil de la classe (Paul : « le profil longitudinal classe »).**
Décidé : 25/08 : « je veux la relecture (onglet relecture) de chaque séance horaire jouée. je veux aussi les stats, mais à coté. je ne veux pas tout dans le meme onglet. je veux que tout soit copiable par un bouton » (`docs/MJPC6-DETTES.md:136`) ; 26/10 09:07 : « je veux une vue où j'ai le déroulé complet d'une classe précise et que je peux préparer en avance » (`CADRAGE-RELU.md:14`) ; 26/10 11:20 : « deux endroits m'affichent le pilotage de la COPIE de CLASSE. l'edt, et le profil de classe. L'atelier n'est jamais le lieu où je vois jouer la copie de classe » (`MANDATS/PILOTAGE-EN-CLASSE/CADRAGE-26-10.md:7`) ; 29/10 08:47 : « Il faut construire le profil longitudinal classe ( entrée par l'encart en bas du calendrier). […] on garde le bouton d'activation désactivation, et je veux voir la diapo qui s'allume ou se grise, mais jamais ne disparaît. Quand elle est grisée elle n'apparait jamais au tableau. […] c'est là bas que je travaillerai le plus, car c'est là bas que j'adapte mes chapitres en fonction des classes » (`TRANSCRIPT-C13.md:7143`) ; 29/10 09:24 : « Ok. Sachant qu'il n'y a pas que les dictées et les rédactions » (l. 7253 ; 979 « les sept ajouts », l. 7261 ; 987 toutes les applis du hub par classe, « Rattacher » pour la dictée universelle et le débat, l. 7277). Matière : les tranchages T1-T7 (`CADRAGE-RELU.md:26-32`), la maquette « la classe » du 26/10 (`MANDATS/PROFIL-CLASSE/maquette/`), les captures construites du 29/10 (`MANDATS/PROFIL-CLASSE/captures-29-10/01` à `06`).
Ouvert : le cadrage n'existe nulle part en un seul document. T1-T7 n'ont pas eu de « oui » explicite (Paul a demandé « je veux voir à quoi ça ressemble », puis est passé à l'interface, tours 179-189) ; les décisions du 29/10 ne vivent qu'en captures (registre `docs/MJPC6-DETTES.md:44` : « à écrire au cadrage avant tout mandat »). Questions restées sans réponse : 961 « Je te propose ensuite comment on le construit » (jamais fait) ; 374, arrêter la liste des heures à la dernière heure du chapitre publié (l. 3377) ; 950, « réactivation » sortie de la liste des rôles de l'Atelier, renvoyée « avec la copie de classe » (l. 7132, 7153) ; ce que veut dire « j'adapte mes chapitres » : le badge « pas pour cette classe / pour cette classe seulement » (T3, T6), la durée par classe (972), la note de classe (971), ou plus ; « ✎ Préparer » qui atterrit dans cette vue avec la revue du chapitre (cadrage 4 §0.3, `CADRAGE-4-LA-PREPARATION.md:7`) ; répéter une vraie classe sur sa copie (§12.75 (2)).
Contradiction : la n°14 écrit 979 « acquis à 09:24 » et 980-988 « acquis » (`MANDATS/EXIGENCES-DEPUIS-29-10.md:10-11`) ; la n°13 les garde « ouverts » jusqu'à son dernier tour (`TRANSCRIPT-C13.md:9802`) et demande de les reposer (`PASSATION-C13-C14.md:43`).
Code : absent (index.html:24868 ; « pas pour cette classe », « Les travaux » : 0 ; la réactivation sur « non » n'est pas grisée, elle n'est pas construite).
Dépend de : rien en amont ; les sujets 12, 15, 16, 17 et 27 en dépendent.

19. **La clôture automatique d'une heure.**
Décidé : Paul, 26/10 11:20 : « il faut une garde à la cloture. Une heure terminée doit se fermer automatiquement et être considérée close (mesure le télescopage) » (`MANDATS/PILOTAGE-EN-CLASSE/CADRAGE-26-10.md:8`).
Ouvert : la proposition P4 (l. 29 : clôture 5 minutes après la fin du créneau, « pas de travail donné », « Compléter le cahier de textes » depuis la Relecture, seule écriture sur une heure close) et les télescopages T-a à T-e (l. 19-23 : « on avertit, on ne bloque jamais » ; « une heure close ne se reprend plus ») n'ont jamais eu de réponse. Paul a validé P1 seul (« Oui », l. 34), puis « l'UI des écrans » d'abord ; P2, P3, P5, P6 sont devenus §12.28 et sont codés ; P4 non (`MANDATS/MODE-DIRIGE/CADRAGE-26-10.md:20` : « P4, pas validée »).
Code : absent (« close d'elle-même », « Compléter le cahier de textes » : 0). Une heure non close est close par le lancement suivant de la classe (mesuré par la n°13, `PILOTAGE-EN-CLASSE/CADRAGE-26-10.md:15`).
Dépend de : R8 et « une heure close ne se reprend plus », à concilier.

20. **Le mode dirigé.**
Décidé : Paul, 26/10 20:05 : « un bouton qui active une sorte de bot qui me dit quoi faire quand, tout en me laissant libre sur les moments où par exemple j'écris au tableau […] Le but est de ne pas complexifier plus et surtout surtout de me décharger mentalement, et aussi de m'apprendre le flux. Une fois que je l'aurai en main, je pourrai désactiver le bouton » (`MANDATS/MODE-DIRIGE/CADRAGE-26-10.md:5`) ; 27/10 08:05 : « 460 à faire » (`TRANSCRIPT-C13.md:3988`), 460 étant : l'aide qui lit ce qui est à l'écran (ce chapitre, cette classe, ce qui vient ensuite) entre dans le mode dirigé (l. 3926).
Ouvert : D1 à D5 (`MODE-DIRIGE/CADRAGE-26-10.md:24-28`) jamais validés ; la n°13 écrit elle-même qu'ils sont dépassés : « D4 est déjà fait par la simplification […] D2 n'a plus sa place (la barre du bas n'existe plus) ; D3 change […] Nouveaux tranchages et images avant tout mandat » (l. 31).
Code : absent (« mode dirigé » : 0). Le « ? » de chaque écran existe (13 · 43, 13 · 47).
Dépend de : le « ? » et la simplification §12.29, faits.

21. **Les chartes visuelles.**
Décidé : Paul, 29/10 10:41 : « actuellement dans le déroulé il n'y a pas de charte visuelle. Or, les diapos que tu reconstruis sur mes canons en ont une. Est ce possible d'avoir 5 chartes visuelles que je choisis selon les chapitres et qui s'appliquent partout? » (`TRANSCRIPT-C13.md:7454`) ; 10:47 : « pour l'instant deux chartes suffisent, une pour les 4e, une pour les 3e » (l. 7483) ; contrat §12.73 (`CONTRAT.md:401`) : « À cadrer, captures d'abord » ; celle des 3e est le canon (bleu nuit).
Ouvert : la charte des 4e, « à proposer en captures » (jamais faite) ; choisie « selon les chapitres » (10:41) ou fixée par niveau (10:47) — la n°13 a écrit « une charte par niveau » (1034, l. 7491) sans le reposer ; ce que contient une charte (1029 : fond, titres, texte, accent, couleurs des domaines, polices, cadre des diapos d'ouverture, l. 7466) et la lisibilité des couleurs de texte et des surligneurs sur chaque fond (1031, l. 7470) : proposés, pas validés.
Code : absent (« charte » n'apparaît que pour les modales et les documents imprimés, index.html:7082, 10053).
Dépend de : le sujet 14 et la réponse à 1026.

22. **La forme du récit de séance et le papier en détail.**
Décidé : cadrage 2 §1.9 : « Le papier en découle : « ce qu'on relit » (le récit), « ce qu'on colle » (les fiches) » (`DEROULE/CADRAGE-2-LA-RELECTURE.md:28`) ; §4.1 les récits des heures bout à bout (l. 53) ; §3.8 le récit « composé par le site | ma version (modifier) » (l. 50).
Ouvert : §4.3 : « La forme exacte du récit de séance (un seul texte continu, ou un récit par heure sous un titre) : à décider avec Paul sur maquette » (l. 55) ; §6 : « le papier en détail » (l. 62). Posé par la n°12 (`TRANSCRIPTS/C12/TRANSCRIPT-C12.md:4299` : « ça te va, ou tu la veux autrement ? »), reposé (l. 5050 : « à trancher sur la face « la séance » de la maquette »), puis par la n°13 (`TRANSCRIPT-C13.md:1485` ; `PLAN-10-JOURS.md:43` : « le papier d'une séance de trois heures, c'est un récit par heure collé trois fois, ou un récit de séance ? ») : aucune réponse trouvée.
Code : une forme est codée sans son mot : la face « La séance », « les heures bout à bout, un seul bilan » (index.html:21160) ; le Papier, tranché par la conscience au réveil n°2 : « le récit relu puis chaque fiche montrée, annotée, une page A4 » (`CONTRAT.md:136`, §12.12) — pas de mot de Paul trouvé.
Contradiction : `MANDATS/POINT-DEROULE-RESTE-A-CODER.md:29` dit « Le récit figé et retouché, la forme du récit de séance, le papier en détail […] : jamais cadrés » ; le récit figé est cadré au cadrage 2 §3.8 (23-24/09) et codé (« ma version », index.html:15544). Seuls la forme du récit de séance et le papier restent ouverts.
Dépend de : rien.

23. **Ce que déclenche chaque case PAP.**
Décidé : cadrage 6 §3.1 à §3.4 quinquies ; la case pap-15 (la dictée aménagée) est codée côté dictée (`POINT-DEROULE-RESTE-A-CODER.md:22`).
Ouvert : cadrage 6 §3.3 : « proposition de la conscience, à valider par Paul case par case, et à mesurer app par app avant tout mandat » (`CADRAGE-6-L-ELEVE.md:38-39`, rappelé §5.1, l. 63). Pour le déroulé : pap-13 (« qui a participé » ne signale pas l'absence de participation), et pap-01, 03, 04 (la tablette, sujet 28).
Code : rien au pilotage (`amenagements` lu seulement par la console). Les apps n'ont pas été vérifiées ici (hors `index.html`).
Dépend de : la lecture de chaque app ; le sujet 28.

24. **La fiche de préparation de la dictée au format canonique (l'audit des pièges).**
Décidé : Paul, 05/10 : elle « sort au format canonique de l'éditeur MJPC — une « fiche » dans une feuille du chapitre, sous le contrat des objets du site, liable dans le déroulé par un bloc « fiche » » (`MANDATS/PASSATION-C12-C13-DEROULE.md:29`) ; registre 12 · 141, « CHANTIER À CADRER » (`docs/MJPC6-DETTES.md:3016`).
Ouvert : le périmètre (« cadrage 5 min avec Paul : le périmètre », `PLAN-10-JOURS.md:19`) et « la fiche sort dans quelle feuille du chapitre ? » (l. 45) : jamais posés.
Code : la liaison d'une dictée à une séance existe (item `correction_dictee`, §12.34 (6), index.html:3964) ; la fiche des pièges n'existe pas côté site ; `correction_dictee.html` n'a pas été vérifié ici.
Dépend de : la conscience de la dictée (« un seul objet ; la n°13 les tient », `PASSATION-C12-C13-DEROULE.md:29`).

---

## C · Jamais cadré (8)

25. **Ce que l'élève reçoit après l'heure : la page élève, l'absent, la révision, les rattrapages.**
Annoncé : cadrage 1 §14 (« ce que l'élève reçoit après l'heure », `CADRAGE-1-LA-CLASSE.md:137`) ; §11b.5 : « rien n'est montré aux élèves tant qu'ils n'existent pas, et le moment de leur publication (automatique ou geste de Paul) se décide dans leur cadrage » (l. 122) ; `POINT-DEROULE-RESTE-A-CODER.md:24` et `:38`.
Déjà dit par Paul le 19/08 (`DEROULE/CADRAGE-TEMPS.md`) : §8 « Cependant, tu peux réviser (et là, la liste de ce qui a déjà été fait depuis le début du chapitre, puis du début de l'année au fur et à mesure des chapitres) » (l. 168) ; §11 la déclaration de mise à jour par l'élève et le tableau des retards (l. 221-226) ; §12 les deux rattrapages et la liste « ce qui me manque » (l. 242-243) ; §14 la séance continuée à la maison et la liste du déjà-fait, « identique pour toute la classe, ou tenant compte de ce que l'élève a personnellement manqué ? » (l. 262-273).
Ouvert : TEMPS §8 et §11 n'ont été repris par aucun cadrage de la n°12. Question posée par la n°13 (« le cadrage 1 l'emporte, et §8 est à trancher par toi », `TRANSCRIPT-C13.md:30`), reposée (l. 1485 ; `PLAN-INTEGRATION-DEROULE.md:193` : « reste à trancher avant I2 ») : sans réponse. La relance E2 l'a classée « hors mandat » (`MANDATS/INTEGRATION-DEROULE/RELANCES/E2.md:32`).
Code : côté pilote, le mot personnalisé par absent (index.html:21321) et « pas de travail » (`prevu:false`) existent ; côté élève, rien (« Tu peux réviser », « j'ai recopié », « ce qui me manque » : 0 ; le récit n'est rendu que dans le pilotage, index.html:21260).
Dépend de : le sujet 12 ; le sujet 27.

26. **Le téléphone télécommande.**
Annoncé : cadrage 1 §0.2 : « Le téléphone n'est qu'une télécommande, à faire plus tard ; l'actuel est à jeter » (`CADRAGE-1-LA-CLASSE.md:6`) ; `POINT-DEROULE-RESTE-A-CODER.md:30`.
Déjà dit par Paul : 25/08 : « sur pilotage téléphone, je ne pilote que le zoom tableau sans corrélation sur mon affichage téléphone » (`docs/MJPC6-DETTES.md:9`) ; question du 23/08 jamais tranchée : « pilotage téléphone à palette réduite ou complète » (l. 11).
Ouvert : « les fonctions exactes (ma proposition : ▶ ◀, le gel, F2 initiales, le chrono ; rien d'autre) » (`PLAN-10-JOURS.md:44`) : jamais posée. Le QR est tombé avec le téléphone (§12.11, `CONTRAT.md:135`).
Code : retiré. `SES.mode` porte « [E3] le téléphone tombe » (index.html:22326) ; il ne reste que des commentaires (l. 22574-22582) ; `sesTel*` : 0.
Contradiction : `PLAN-10-JOURS.md:10` dit « Le téléphone se recycle depuis l'existant (`?vue=tel`, `sesTel*`) » ; ce code n'est plus en production. Il faudrait le reprendre dans une version antérieure (il est encore décrit dans la 8.74.0-③, `PLAN-INTEGRATION-DEROULE.md:96`) ; je ne sais pas quelle version le porte entier.
Dépend de : rien ; la répétition envoie déjà au téléphone ouvert sur l'adresse du tableau (§12.41).

27. **Le profil longitudinal de l'élève et le cockpit du professeur.**
Annoncé : `PLAN-10-JOURS.md:17` (« prévu, pas cadré (Paul d'abord) ») et §3, question 1 (l. 42), jamais posée ; `POINT-DEROULE-RESTE-A-CODER.md:31`.
Déjà dit par Paul : 25/08 : « dès que l'élève produit une donnée, elle doit être enregistrée » ; « le prof par élève. et oui la vue élève se déduit, c'est la vue prof moins certaines données » (`docs/MJPC6-DETTES.md:142`) ; les toggles en cascade classe → élève → donnée (l. 169) ; le cockpit lit heures par séance et séances par chapitre (l. 164) ; cadrage 1 §10.3 : les commentaires de classe « attendent le cockpit prof, qui posera les commentaires des classes côte à côte » (`CADRAGE-1-LA-CLASSE.md:109`) ; cadrage 6 §3.1 bis : la fiche élève en tête du profil, « dans l'année seulement » (`CADRAGE-6-L-ELEVE.md:36`) ; 28/10 : « On alimente déjà le profil longitudinal même s'il n'existe pas encore » (`TRANSCRIPT-C13.md:6418`).
Code : `mjpcProfils` existe, alimenté, jamais lu (registre, `docs/MJPC6-DETTES.md:18`) ; « cockpit » : 0.
Dépend de : le sujet 18 ; le sujet 12.

28. **La tablette des élèves fléchés et la version `adapte` (cadrage 7).**
Annoncé : cadrage 6 §3.5, §5.1 quater, §5.2 (`CADRAGE-6-L-ELEVE.md:52`, `:64`, `:67`) : le cadrage 7 « s'écrit quand Paul a donné le HTML du panneau ».
Déjà dit par Paul (C12, `TRANSCRIPT-C12.md:8862`) : « Ils ont le cours normal, mais en plus, ils ont un bot qui leur reformule ce qu'ils voient. c'est l'idée. […] au lieu d'un ? l'élève aurait un émoji prof, et le contenu de l'aide pourrrait être plus adapté pour eux (à cadrer) » ; « les tablettes sont avec un navigateur oui », le nombre « n'est pas fixe ».
Ouvert : le HTML du panneau d'aide, demandé (`TRANSCRIPT-C12.md:8878-8880`) : je ne trouve pas qu'il ait été donné ; comment Paul écrit la version `adapte` d'un bloc dans l'Atelier (`CADRAGE-6-L-ELEVE.md:52`).
Code : `adapte` absent du déroulé (seule la police adaptée des feuilles, index.html:7846).
Dépend de : le sujet 23.

29. **Travailler sans réseau.**
Annoncé : registre 13 · 77 (`docs/MJPC6-DETTES.md:3145`), Paul, 27/10 14:43 : « si internet tombe, je peux continuer à travailler sur du local » ; « À cadrer avec 586 (les médias en local) » ; `TRANSCRIPT-C13.md:5484`.
Ouvert : tout ; rien n'a été proposé. 586 a été tranché pour les médias seulement (§12.44 (4 ter)).
Code : aucun écouteur de retour du réseau trouvé ; les échecs d'écriture vivent en mémoire (registre, lu dans le code de la ⑤, pas mesuré par le geste).
Dépend de : la porte unique d'écriture et le mode test (aucune écriture qui passe à côté).

30. **Lancer une autocorrection de dictée depuis une heure du déroulé.**
Annoncé : Paul, 07/10 : « une séance d'autocorrection doit être horodatée ; elle devra pouvoir être branchée à terme dans le déroulé MJPC, afin de pouvoir lancer l'autocorrection directement depuis le calendrier MJPC » (registre 12 · 178, `docs/MJPC6-DETTES.md:3187`) ; « à cadrer avec la conscience du déroulé » (`TRANSCRIPT-C12.md:16205`) ; `POINT-DEROULE-RESTE-A-CODER.md:32`.
Ouvert : le geste, et la forme de `seanceId` (« format à définir par le chantier du déroulé », registre 12 · 178).
Code : `seanceId` : 0 dans `index.html` ; la liaison d'une dictée à une séance existe (index.html:3964).
Dépend de : le registre des séances d'autocorrection côté dictée (12 · 178).

31. **Le tiroir « Sous la main ».**
Annoncé : `DEROULE/CADRAGE-TEMPS.md:267` : « déjà cadré (approfondir la séance en cours ou rappeler les prérequis de la suivante, réglé sur la taxonomie, lien explicite affiché, jamais de temps en plus), à coder avec le temps ».
Source manquante : je ne trouve ce cadrage nulle part ailleurs (ni au sas, ni dans `docs/`) ; aucun cadrage de la n°12 ne le reprend, et le cadrage 1 §13 ne le fait pas tomber.
Code : 0.
Dépend de : la taxonomie réelle (sujet 6).

32. **L'appli de création de pages HTML.**
Annoncé : cadrage 4 §4.6 : « chantier à part, décidé par Paul le 14/09, hors de celui-ci » (`CADRAGE-4-LA-PREPARATION.md:62`) ; hors plan selon la règle du 21/10 « rien ne se crée qui n'existe pas déjà » (`PLAN-10-JOURS.md:10`).
Code : 0.
Dépend de : le mot de Paul pour l'ouvrir.

---

## Contradictions et sources qui manquent

33. **Les arbitrages du 25/08.** `POINT-DEROULE-RESTE-A-CODER.md:33` les dit « à cadrer ». La n°12 les a traités aux tours 87-88 (`TRANSCRIPT-C12.md:3362-3373`, réponse de Paul l. 3389) : vocabulaire fixé ; sort d'une séance close « fermé » ; pas de bandes au tableau ; tailles par bloc ; cinq formes de schéma ; « trop dense » mesuré ; légende de surlignage facultative par diapo (Paul : « je dois pouvoir l'associer à un code sur une diapo, mais facultatif. et la légende doit toujours apparaître si association faite »). Le cadrage 1 §14 (`CADRAGE-1-LA-CLASSE.md:137`) n'a pas été mis à jour. Je les tiens pour fermés.

34. **Le QR code.** `POINT-DEROULE-RESTE-A-CODER.md:33` : « se ferme sur l'existant » ; `CONTRAT.md:135` (§12.11, tranché par la conscience au réveil n°2, 21/10) : « le QR tombe avec le téléphone (remplacé par « Adresse du tableau », sans écriture) ». Code : `sesQROuvrir` 0, « Adresse du tableau » présent (index.html:20671). Pas de mot de Paul trouvé sur la chute du QR.

35. **La réactivation.** Le cadrage 4 §2.2 et §2.6 (réactivation et fin d'heure posées par le prompt dans la trame, `CADRAGE-4-LA-PREPARATION.md:25-26`) est remplacé par Paul le 22/10 et le 25/10 (`CONTRAT.md:146`, `:150`) : jamais en dur, construite à la clôture, dans la copie de classe seule, au choix. Les cadrages 1 et 4 ne sont pas mis à jour.

36. **Le bilan.** Cadrage 1 §6.4 contre la diapo vierge du 29/10 : voir le sujet 15.

37. **Le plan de 10 jours.** `PLAN-10-JOURS.md:51` note « Paul : « go » à 09:31 » (22/10) ; le 25/10, Paul refuse le « go du plan » (`TRANSCRIPT-C13.md:3156`). Le plan n'est pas un ordre en cours.

38. **Le profil de classe, 979-988** : « acquis » selon la n°14, « ouverts » selon la n°13 : voir le sujet 18.

39. **L'espace École Directe** (sujet 9) et **le récit figé** (sujet 22) : contradictions dites à leur place.

---

## Ordre proposé dans les sources

40. **`DEROULE/CADRAGE-TEMPS.md:277-283`, « ordre de travail arrêté par Paul » (19/08)** : le temps → l'intégration du déroulé → les prompts → le calendrier → le profil longitudinal. L'intégration est faite ; viennent ensuite les prompts (sujet 13).

41. **`MANDATS/POINT-DEROULE-RESTE-A-CODER.md:46-49` (20/10)**, après l'intégration : « un mandat par reste du B, dans l'ordre que Paul donne : les attendus au hub et les notions (13) · l'élève (14, 15, 16) · les documents, feuilles et la fiche de dictée (17) · la vidéo (18) · le prompt d'injection (20) · le récit et le papier (21, à cadrer d'abord) · la dictée (24) · le téléphone (22) · le profil (23) ». Je ne trouve pas d'ordre donné par Paul en réponse.

42. **`MANDATS/PLAN-10-JOURS.md` (21/10, refusé le 25/10)** : les cadrages avec Paul, un par jour, dans cet ordre (l. 41-46) : le profil longitudinal et le cockpit → le récit, le récit de séance et le papier → le téléphone télécommande → l'audit des pièges de la dictée → M-SÉCU ; les lots (l. 34-37) : L5 le reste cadré du déroulé, L6 le profil, L7 le récit et le papier, L8 la télécommande.

43. **`MANDATS/PILOTAGE-EN-CLASSE/CADRAGE-26-10.md:34`** : l'interface d'abord, « Ensuite on reprendra » ; P2 à P6 un sujet à la fois (faits, sauf P4). **`MANDATS/MODE-DIRIGE/CADRAGE-26-10.md:28`** : le mode dirigé après §12.28.

44. **`TRANSCRIPT-C13.md:7503` (1040, 29/10)** : « Les nouveaux types de diapo, les chartes et le profil de la classe viennent après lundi » (lundi 02/11). **`MANDATS/PASSATION-C13-C14.md:57`** : reposer à Paul les vieux points ouverts avant de relancer quoi que ce soit.

45. **Le registre, ordre du 25/08** (`docs/MJPC6-DETTES.md:11-21`) : le téléphone (2), le temps réel (3) … le profil de classe (7), les prompts (8), le profil longitudinal (9), les affichages menteurs (10), M-SÉCU (11), M17a en dernier (12).

---

## Hors du déroulé (pour mémoire, non classé)

46. La rédaction (le mode interrogatif « à cadrer » de §12.63 (3), les stickers) est chez la n°14. M-SÉCU (la base se lit sans clé ; cadrage 6 §5.1 « les règles de lecture de la base ») n'est pas du déroulé. Les gestes de Paul prévus dimanche 01/11 (mjpc-medias-2 et le relais de « Déposer en ligne », §12.49 ; les trois fichiers Drive, 13 · 88) ne sont pas des cadrages, mais « Déposer en ligne » en dépend (`PASSATION-C13-C14.md:46-49`).

---

## Sources lues

47. Sas `DEROULE/` : CADRAGE-1-LA-CLASSE, CADRAGE-2-LA-RELECTURE, CADRAGE-3-LES-NOTIONS, CADRAGE-4-LA-PREPARATION, CADRAGE-6-L-ELEVE, CADRAGE-INTEGRATION, CADRAGE-TEMPS (en entier). Sas `MANDATS/` : POINT-DEROULE-RESTE-A-CODER, PLAN-INTEGRATION-DEROULE, PLAN-10-JOURS (en entier) et PLAN-10-JOURS/CONTRAT-COMMUN (en entier), MANDAT-A1 et MANDAT-P1 (en-têtes et points à Paul), INTEGRATION-DEROULE/CONTRAT.md (en entier, §1 à §12.75), RELANCES/E2.md (point M7), PASSATION-C12-C13-DEROULE, PASSATION-C13-C14, PROFIL-CLASSE (CADRAGE-RELU, maquette/LISEZ-MOI, journal des captures), PILOTAGE-EN-CLASSE, MODE-DIRIGE (cadrage et mesure), CANONS-DIAPOS/LISEZ-MOI, PROMPT-INJECTION.md (en-tête, journal des versions, recherches), MANDAT-ELEVE-2, EXIGENCES-DEPUIS-29-10. Transcripts : C13 (messages de Paul et en-têtes « ouvert » de tous les tours, tours 1, 68-75, 163-189, 211-215, 270, 312-337, 341-366 lus) ; C12 (tours 31, 87-88, 112, 270-271 et recherches ciblées : à cadrer, tablette, récit de séance, autocorrection) ; C14 (lignes 32, 2136-2140, 3150-3189). Prod : `docs/MJPC6-DETTES.md` (en-tête, cadrage du 25/08, section H, entrées « à cadrer »), `index.html` 8.77.0-⑩ (recherches de texte).

À tester : rien, rien n'est livré (lecture seule).

01/11/2026 19:09
MEMO
