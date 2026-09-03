# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ⑬ · LES MOTS, PUIS LES INFOBULLES
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 769 457 octets**, md5 **`8837063de4466afb71622e89181ae44a`**, **229 déclarations `edt*` pour 229 noms distincts**, version affichée **8.73.0-⑪**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-⑬**.*

## POURQUOI — dans les mots de Paul

« **bon maintenant il faut faire une passe de vocabulaire. est ce que tout est compréhensible ? et par ailleurs, il faut faire une passe de tooltips. je signale au passage que c'est une des dettes du site. tout codage doit être accompagné d'une passe de tooltips.** »

**RÈGLE POSÉE, qui vaut pour tous les mandats à venir : UNE LIVRAISON N'EST PAS CLOSE TANT QUE LES GESTES QU'ELLE AJOUTE NE PORTENT PAS LEUR INFOBULLE.**

**Le destinataire, tranché par Paul le 03/09 : « oui elles sont pour moi. »** Elles sont donc pour **Paul dans trois mois** — quelqu'un qui connaît son métier et son site, mais qui a oublié le détail. **Ni télégraphique, ni manuel pour un inconnu.** Une phrase qui dit **ce que le geste fait et ce qu'il coûte**, dans ses mots.

## ⓪ CE QUE PAUL A DÉJÀ PAYÉ SUR CE CHANTIER — lis-le avant d'écrire une seule bulle

**La conscience est allée chercher dans son journal, à sa demande. Il a déjà fait ce chantier, et il en a payé le prix.**

**LE BUG DU SURVOL TACTILE — journal du 05-06/08.** Paul signale : *« les clics des boutons de l'atelier ne fonctionnent plus »*, puis affine : *« je dois appuyer plusieurs fois sur Ouvrir »*, *« quand je clique sur Publier je suis obligé d'aller cliquer plus haut dans le vide »*. **Diagnostic** : **au tactile, le premier tap déclenche `:hover`**, et huit règles de survol déplaçaient la cible sous son doigt. **Résolution, encore dans le code aujourd'hui** — mesuré : **une seule occurrence** de
`@media (hover: hover) and (pointer: fine) { … }`
qui réserve les effets de survol aux appareils à souris.

**CE QUE ÇA COMMANDE POUR TOI, ET C'EST LE CŒUR DE CE MANDAT** : **Paul travaille au téléphone** — journal du 06/08, « la passe tactile du site » : il testait la vue élève **au téléphone**, et la vue prof comptait **192 cibles dont 166 sous la norme**. **Une infobulle mal posée est un piège tactile** : sur son téléphone, le premier tap peut l'afficher au lieu de déclencher le bouton. **Tu ne dois pas recréer le bug que Paul a déjà payé.**
**Donc : aucune infobulle ne doit changer le comportement d'un clic, ni au doigt, ni à la souris. Tu le prouves.**

**UNE PREUVE QUE SON JOURNAL DEMANDE DE GÉNÉRALISER, et qui va parfaitement ici** — 06/08 : *« la conscience a isolé le bloc ajouté et vérifié que **le livré privé de ce seul bloc redevient exactement la base**. C'est la preuve la plus forte possible d'un ajout non invasif : à généraliser chaque fois qu'un morceau se présente comme un ajout isolé. »* **Une passe d'infobulles est exactement ce cas. Tu la fournis.**

## ① LES MOTS — sept points, validés par Paul le 03/09

**Renommages seuls. Aucun mécanisme touché.**

1. **« Les objets vivent au hub sous `/site/edt/` »** (en tête du panneau) — **de la plomberie affichée au professeur.** À dire autrement ou à retirer.
2. **L'infobulle « hors français, jamais compté » et la phrase de la modale « groupe partagé, hors français. Cette heure ne compte jamais dans la progression. » SONT FAUSSES DEUX FOIS.**
   - **Le libellé « hors MJPC » de la case est JUSTE — Paul l'a tranché : *« c'est bien des heures que je fais, mais non fléchées dans l'edt mjpc »*. TU N'Y TOUCHES PAS.**
   - **C'est du français** : mesuré, 4 des 5 créneaux concernés s'appellent « X Français X. — 4 HUGO / 4 TURING / 4 BANKSY / 4 PYTHAGORE ». Seule « Concertation » n'en est pas.
   - **Et cette heure PEUT compter** : la conscience l'a prouvé sur la vraie grille — ces créneaux sont **déjà proposés dans la liste des destinations, marqués « créneau libre, heure ajoutée »**. Paul peut y poser une heure de français quand la responsable EDT la lui donne.
   - **Le texte doit dire ce que c'est et ce que Paul peut en faire.**
3. **« classe appariée »** et **« sa case s'affiche mais ne projette rien »** — deux mots du chantier, aucun geste de classe derrière.
4. **« 30 jalons · 15 événements de classe »** — « jalon » n'est pas un mot d'emploi du temps.
5. **Le filtre de la liste : « filtrer : 12/5 · mai · 37 · A ou B »** — le **37** (numéro de semaine) et le **A ou B** ne sont expliqués nulle part.
6. **« ⤓ Sortir le JSON »** — son infobulle dit « copier », **qui est le mot juste**.
7. **« expérimentale »** (carte de classe) et **« classe d'essai »** (mode test) — deux mots proches pour deux choses différentes.

**CE QUI EST DÉJÀ CLAIR ET QUE TU NE TOUCHES PAS** : « Ce que l'année t'a coûté », « aucune séance prête », « classe non encore importée », « heure 1/3 », « 50 min utiles », « dans les temps », les trois issues du dépôt, l'annonce de la banalisation. **Tout cela est déjà dans les mots de Paul.**

## ② LES INFOBULLES — 94 manquantes, mesurées écran par écran

État mesuré par clics : panneau Emploi du temps **33 cliquables / 6 bulles** · barre du haut **9 / 0** · modale d'une case **9 / 0** · Heures perdues **29 / 0** · vue Année **8 / 0** · Dates de l'année **12 / 0**. **TOTAL : 100 cliquables, 6 bulles, 94 sans.** Dans le code : bloc EDT **12 `title=` et 3 `aria-label` pour 35 boutons**.

**Ce qu'on attend :**
1. **Chaque élément cliquable visible porte son infobulle**, dans les mots de Paul : **ce que le geste fait, et ce qu'il coûte.** Exemple de ton : « prend le créneau — la classe qui l'occupait perd son heure, et le site te la rappellera ».
2. **Les six qui existent restent** si elles sont justes — « copier le JSON tel qu'il est au hub » l'est.
3. **Aucune ne change le comportement d'un clic.** Voir §⓪.
4. **Les deux dernières livraisons sont visées en premier** : « début de l'année », « fin de l'année », et la couleur de la classe d'essai **n'en ont aucune** — l'exécutant précédent l'a déclaré contre lui-même.

## ③ LE BANC QUI EMPÊCHE LA DETTE DE REVENIR

**Écris `tests/banc-infobulles.mjs`** : il ouvre chaque écran **par des clics**, relève **tout élément cliquable visible**, et **ÉCHOUE si l'un d'eux n'a ni `title` ni `aria-label`**. Il liste les manquants par leur libellé.

**Ajoute-le à `banc-tout.mjs`.** Sans lui, la dette revient à la livraison suivante — c'est ce que Paul veut empêcher.

## ④ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**.
- **Correctif du mode test dans `mjpcEcrireRest` : `668cda2757a5`**.
- **`function secu*` 29** · **`published` 97** · **`edt*` 229 déclarations / 229 noms**, aucune disparue, **aucun doublon**.
- **Trois portes** · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **`edt-fige` 9**.
- **`EDT_CATEGORIES` et `EDT_MOTIFS` inchangés**, mot pour mot.
- **`@media (hover: hover) and (pointer: fine)` : toujours présent, une occurrence.**
- **Les comptes ne changent pas** : hors mode test, 30 créneaux, mêmes comptes par classe, mêmes heures perdues. **Cette livraison change des mots, pas des chiffres.**
- **`banc-tout.mjs` VERT EN ENTIER** · **double parseur vert** · **garde verte sur ses cinq questions**.

## ⑤ PREUVES EXIGÉES — par le geste

1. **Les sept points de vocabulaire**, un par un : le texte avant, le texte après, **et la capture de l'écran où Paul le lira**.
2. **Le compte des infobulles** : 6 avant → combien après, écran par écran, **relevé par clics comme l'audit initial**.
3. **`banc-infobulles.mjs` ÉCHOUE quand tu retires une bulle** — retire-en une, montre le rouge, remets-la. **Sinon le banc ne prouve rien.**
4. **AUCUNE INFOBULLE NE MANGE UN CLIC** : sur au moins cinq boutons, **le clic déclenche l'action du premier coup**. **Et dis comment tu l'as éprouvé** — si ton banc ne sait pas simuler un doigt, **déclare-le** : c'est alors un test que Paul devra faire au téléphone.
5. **L'ajout est non invasif** : **le livré privé des infobulles redevient exactement la base**, aux octets près. C'est la preuve que son journal demande de généraliser.
6. **Les chiffres n'ont pas bougé** : comptes par classe et heures perdues, avant et après.
7. **Non-régression** : la liste chiffrée du §④, **`banc-tout` en entier**.
8. **Garde** : verte sur ses cinq questions, **et rouge sur cinq contrôles négatifs que tu poses toi-même**.
9. **Audit adverse** : une infobulle sur un bouton désactivé · deux boutons de même libellé dans deux écrans · un libellé qui change de longueur et casse une colonne · le mode test allumé (les bulles de la classe d'essai).

## ⑥ MÉTHODE ET DÉCOUPE

**Deux livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **⑬-a** — **LES MOTS** : les sept points du §①, renommages seuls. Version **8.73.0-⑬a**. Rapport, puis STOP.
- **⑬** — **LES INFOBULLES** : les 94, le banc du §③, les captures, l'audit adverse, `banc-tout` en entier, le rapport final. Version **8.73.0-⑬**. STOP.

**Le jeton du sas te sera donné dans la conversation, une fois.** **Livre au sas**, relis le md5 après poussée et publie-le. **Tu ne livres jamais avec une dette. Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑦ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · les captures dans `PONT/EDT/tests/13a/` et `tests/13/` · `tests/banc-infobulles.mjs` · `tests/banc-tout.mjs` enrichi · un rapport par livraison (`rapport-2ter-13a.md`, `rapport-2ter-13.md`). Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑤, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.
