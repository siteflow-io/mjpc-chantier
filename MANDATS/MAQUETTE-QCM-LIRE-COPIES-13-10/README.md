# Maquette « 📄 Lire les copies » — le soir, copie par copie, dans l'ordre de ton tas (conscience n°12, 13/10/2026)

## Version 4 (tour 722, après Paul 20:36 : « Non je ne veux pas 1145. Et je veux pouvoir remettre un point d'autonomie si besoin. […] Enfin je veux voir les points retirés et ajoutés, le calcul de la note en direct quand je fais ma relecture le soir »)

Ce qui change par rapport à la version 3 (rangée dans `v3/`) :
- **Plus de « Sors du tas »** (1145 refusé).
- **Le point d'autonomie, dans les deux sens** : sous le nom de la copie, « 🤝 Tom a son point d'autonomie. » avec « ⛔ Retirer », ou « ⛔ Point d'autonomie de Michel retiré le 13/10 à 09:46. » avec « ↩️ Rendre » (`AutonomieL` : `retirerAutonomieSoirV` et `rendreAutonomieV`, les gestes de la fiche). Après la question de 1144, la case de la faute montre l'état du point dans la base, avec le même bouton : un point retiré au voisin se rend là.
- **La note en direct** (`NoteDirecteL`), à droite de la copie : les points de chaque question, « Question 1 : 0 → 1 point (+1) » (vert quand ça monte, rouge quand ça baisse), puis « ✍️ Note : 1 / 3 → 2 / 3 · 6,7 → 13,3 / 20 ». Elle se recalcule à chaque réponse, d'après la base.
- **« 🧮 Ce soir »**, en haut : tout ce que la relecture a changé depuis l'ouverture de l'écran (les notes, les points d'autonomie retirés ou rendus).
- **Limite de la maquette** : le point de départ de « Ce soir » et des flèches est pris à l'ouverture de l'écran (`LC_DEPART`) ; il repart de zéro si la page est rechargée. Le code devra le garder dans la base. Le « Non » de 1144 n'est toujours pas écrit dans la base.

Captures v4 (rejouées par `capture.js`, par le geste, aucune erreur de page) : `captures/1-debut.png`, `2-carre-tom.png`, `3-tom-corrige.png` (Rome : la note en direct, la question sur Léa), `4-lea-retire.png`, `5-lea-rendu.png` (« ↩️ Rendre » : la base sans `autonomie/baudry_lea`), `6-theo-avait-dit.png` (« ✅ Oui » : la question sur Théo), `7-michel-retire-en-classe.png`, `8-michel-rendu.png` (la base sans `autonomie/duvernay_michel`). App assemblée : md5 `9e76f2a6b14db4fed846758781564a4b`.

## Version 3 (tour 721, après Paul 20:23 : « 1144 oui. 1146. Oui. »)

Ce qui change par rapport à la version 2 (rangée dans `v2/`) :
- **1145, « Sors du tas »** : en haut, la liste des copies qui ont encore une question à lire (« 📤 Sors du tas : CARRÉ Tom, CHEVALLIER Théo, … (8) »). Elle raccourcit à chaque copie lue. Paul ne prend en main que ces copies-là.
- **1144, la conséquence en un clic** : après chaque réponse (« ✅ Oui » comme « ✏️ Autre chose »), l'app compare ce que dit la copie à ce que l'élève avait dit (la question de la fin du temps) et à ce que le voisin avait lu, avant d'écrire quoi que ce soit (`fautesL`). Pour chaque faute : « Tom avait dit avoir bien écrit « … ». Retirer son point d'autonomie ? » (ou « … avait dit avoir écrit autre chose que « … » »), ou « Léa avait lu « … ». Retirer son point d'autonomie ? », avec « ⛔ Oui » et « Non ». « ⛔ Oui » fait le geste du soir de la fiche (`retirerAutonomieSoirV` : `autonomie/<élève>` = retiré, « soir ») ; « Non » ne change rien. Un élève dont le point est déjà retiré n'est pas redemandé. L'élève qui n'a rien dit n'a rien affirmé : pas de question pour lui.
- **1117, ce que Paul écrit sur la copie**, sans rouge (1146 : l'élève corrige au vert seul) : « rien à changer » ; « barre le V vert, barre sa réponse et écris la bonne réponse à côté : « … » » ; « sa réponse barrée était juste ; mets un V vert dans la marge ».
- **Limite de la maquette** : le « Non » de 1144 n'est pas écrit dans la base ; si Paul quitte l'écran avant de répondre, la question ne revient pas. Le code devra garder la réponse (par exemple dans `aLire/<id>`).

Captures v3 (dans `v3/`, rejouées par `v3/capture.js`, par le geste, aucune erreur de page) : `v3/captures/1-sors-du-tas.png`, `2-tom-lea-a-mal-lu.png` (« Autre chose », Rome : Léa avait lu Venise), `3-lea-retire.png` (« ⛔ Oui » : retiré, vérifié dans la base), `4-theo.png`, `5-theo-avait-dit.png` (« ✅ Oui » : la copie dit Sydney, Théo avait dit avoir bien écrit Madrid), `6-theo-garde.png` (« Non »). App assemblée : md5 `e199976992716df9c17b23e0438e31e3`.

## Version 2 (tour 714, après Paul 16:08)

Paul, 16:08 : « si j'ai un tas qui n'est pas rangé dans l'ordre alpha, je veux pouvoir taper directement les initiales de l'élève suivant dans le tas, à la fin de la copie précédente, et ainsi de suite. Et évidemment, "lire les copies", ce ne sont que les questions qui ont besoin d'être lues par moi, pas l'ensemble! enfin, il faudrait que je sache ce que j'écris moi sur la copie de l'élève, à chaque question à vérifier. »

Ce qui change par rapport à la version 1 (rangée dans `v1/`) :
- **Le tas, dans son ordre.** Plus d'ordre alphabétique imposé. Paul prend la copie du dessus et tape ses initiales, comme à la fin d'une copie dans `correction_dictee.html` : même règle de recherche (`matchEleveInitials` : les deux initiales, nom puis prénom ou prénom puis nom, puis le début ou un morceau du nom ou du prénom, sans accents), le même texte « tape ses initiales (DM pour Dupont Marie), puis Entrée », jusqu'à 6 propositions, Entrée ouvre la première. Chaque proposition dit « n questions à lire », « ✔ lue » ou « rien à lire ».
- **Seulement les questions à lire.** Une copie sans rien à lire dit « Rien à lire sur cette copie : mets-la de côté. », et le champ des initiales vient tout de suite. Une copie à lire ne montre que ses questions à lire. En tête : « 📌 Encore n copies à lire, m questions en tout · les autres copies n'ont rien à lire ».
- **Ce que Paul écrit sur la copie.** Après chaque réponse, une phrase :
  - la copie dit ce que le voisin a lu (« ✅ Oui »), ou dit autre chose sans que la réponse devienne juste ou fausse : « ✍️ Sur la copie : rien à changer. » ;
  - le voisin avait lu une bonne réponse, la copie en dit une fausse : « ✍️ Sur la copie : barre le V vert, et écris en vert la bonne réponse : « … ». » ;
  - le voisin avait lu une réponse fausse, la copie dit la bonne : « ✍️ Sur la copie : barre la correction en rouge, et mets un V vert. » ;
  - et si la note change : « ✍️ Et la note : a → b. ».
  - **Hypothèse non vérifiée** : en classe, le voisin met un V vert quand ce qu'il lit est juste, et barre en rouge puis écrit la bonne réponse en vert sinon. Si ce n'est pas ce qu'écrivent les élèves, seules ces trois phrases changent (`aEcrireL`).

Ce qui ne change pas : « ✅ Oui » fait ce que fait « ✔ Marquer lue » (`marquerLueV`) ; « ✏️ Autre chose », puis le choix (ou « Aucun de ces choix »), puis « ✔ Valider », fait ce que fait « Que dit la feuille ? » (`feuilleDitV`) : la lecture devient celle de Paul, celle du voisin est gardée (« avant ») et reste visible dans la fiche, la note se recalcule, le bilan de l'élève dit « Corrigé d'après ta feuille », la ligne passe à « corrigée d'après la copie ».

## Ce qu'est cette maquette (PROTOCOLE-MAQUETTE §00)

Elle est écrite dans le code réel de l'app en ligne (`code-qcm` à `a5a69308`, dont les sources de l'app sont celles de la 8.0.0). Elle y ajoute un fichier, `lire-copies.js`, et deux lignes de branchement (`branchement.diff`) : le bouton « 📄 Lire les copies (n) » dans le tableau de la séance, et le fichier dans `build.py`.

Elle est jouée sur le faux hub, avec la séance que le banc commun de QCM-4 a jouée de bout en bout à 09:40 (`sorties/2026-10-13_0940/base-finale.json`, la classe fictive 3 ESSAI, 24 présents), remise à son état du soir : aucune ligne lue, les lectures du voisin rétablies (`base-faux-hub-soir.json`). Recompté par le geste au tour 714 : **8 lignes à lire, une sur chacune de 8 copies** ; les 16 autres copies n'ont rien à lire. (Le README de la v1 disait 9 lignes : c'était faux.)

## Captures (1536 × 864, l'écran de Paul), version 2 (dans `v2/captures/`)

Rejouées par `v2/capture.js`, par le geste : Données → Résultats → « 📊 Ouvrir » → « 📄 Lire les copies (8) ». Aucune erreur de page.

| Capture | Ce qu'on voit |
| --- | --- |
| `v2/captures/1-debut.png` | « Prends la première copie de ton tas et tape ses initiales » |
| `v2/captures/2-initiales-ab.png` | « ab » : ABRIAL Julien et SABATIER Malo, « rien à lire » |
| `v2/captures/3-rien-a-lire.png` | ABRIAL Julien : « Rien à lire sur cette copie : mets-la de côté. » |
| `v2/captures/4-carre-tom.png` | « ct », Entrée : CARRÉ Tom, Question 1, « La copie dit-elle « Venise » ? » |
| `v2/captures/5-autre-chose-rome.png` | « ✏️ Autre chose », puis Rome |
| `v2/captures/6-sur-la-copie.png` | après « ✔ Valider » : « barre la correction en rouge, et mets un V vert », « Et la note : 1 / 3 → 2 / 3 » |
| `v2/captures/7-oui-rien-a-changer.png` | « pj », Entrée : PERRAUD Jade, « ✅ Oui » : « Sur la copie : rien à changer. » |

Rejouer : `APP_FILE=<app assemblée> BANC=<faux hub, avec node_modules> BASE=base-faux-hub-soir.json TAXO=<taxonomie des compétences> CAP=<dossier> node capture.js`.

App assemblée : md5 `83a70dd34f59befc750eaca53a5c9171`. Elle n'est pas en ligne, et rien n'est poussé sur `code-qcm`.
