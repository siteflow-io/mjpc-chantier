# MESURE INITIALES — la 8.84.0-⑰ (md5 c6b75c7a8a4fd99de7b2d156f6af4944, celui de la production), au faux hub rangé comme le vrai

Mandat : `MANDATS/DEROULE-01-11/MANDAT-MESURE-INITIALES.md` (a56a6a791). Aucune ligne du site changée.
Base : l'assemblé de `46d140ab6` avec la seule ligne de version `8.84.0-⑰` (md5 vérifié égal à la production). Les numéros de ligne ci-dessous sont ceux de cet assemblé.
Sonde : `sonde-initiales.mjs` (le harnais de MESURE-FRANKLIN ; parties I, J, K). Sorties : `sorties/passe-1-…`, `passe-2-…`, `passe-3-…`, `recit-initiales.txt`.

Ce qui est joué : la classe inventée des 3 Franklin (25 élèves + 2 au nom en deux mots : « LE GALLOIS Bastien », « DE VILLEMOR Anaïs »), sa vraie heure du mardi 15/09 15:08 (répétition : non), le tableau distant `?vue=tableau` ouvert à côté, fenêtre 1536×864. Diapo « Groupe 1 : l'hypothèse », puis « Groupe 2 : l'hypothèse ». Chaque touche une à une, 140 à 190 ms entre deux touches (130 ms + la lecture de l'état).

## 1 · La case des initiales — elle accepte tout
- Elle prend n'importe quoi : une phrase entière y entre (63 signes comptés, passe 1) ; « ab3 » reste « ab3 » à l'écran, la ligne garde « AB3 », à personne. Aucun filtre : `ini.oninput` (l.19695).
- En minuscules : « za » → l'élève est trouvé dès la 2ᵉ lettre, dans la ligne (élève 1), mais la case montre « za » jusqu'à Entrée ; à Entrée elle passe en « ZA » seulement si les initiales sont exactes (`ini.onkeydown`, l.19696).
- Les noms en deux mots : « LE GALLOIS Bastien » → « GL », « DE VILLEMOR Anaïs » → « VD ». « BL », « AD », « BLG », « ADV » ne trouvent personne (`dr_iniExact` = null, 6 sur 6). La ligne : `dr_initiales` (l.17857) prend le 1ᵉʳ mot pour le nom et le reste pour le prénom.

## 2 · L'ordre de reconnaissance — la supposition est incomplète
- **Initiales, puis Entrée (ou Tab), sur la 1ʳᵉ ligne d'une diapo : le curseur part dans le titre de l'activité.** Compté : 8 sur 8 premières lignes (Entrée 7, Tab 1). Le témoin du focus (passe 2) : `ini.onkeydown` (l.19696) met le curseur dans la case de la réponse, puis la même touche Entrée remonte au champ de la diapo et `brancherAtelier` (son écouteur de touches, l.19522, actif en classe) appelle `focaliser` (l.19509), qui pose le curseur dans le titre de l'activité. `ini.onkeydown` n'arrête pas la touche.
- Ensuite, la 1ʳᵉ lettre de la réponse s'écrit dans le titre (« Groupe 1 : l'hypothèseL ») ; 170 ms plus tard, le redessin remet le curseur dans la case des initiales, et **toute la suite de la réponse s'écrit dans la case des initiales** (passe 1 : 22 lettres → 1 dans le titre, 21 dans les initiales ; la réponse reste vide, l'élève est perdu dès la 2ᵉ lettre). Valider une réponse de la 1ʳᵉ ligne par Entrée renvoie aussi le curseur dans le titre (3 sur 3).
- Sur la 2ᵉ ligne d'une diapo : Entrée met le curseur dans la case de la réponse (lu 145 ms après ; 1 sur 1, seul cas mesuré) ; valider cette 2ᵉ réponse le met dans les initiales de la ligne suivante.
- Tab depuis le titre de l'activité : le curseur va dans le texte de la question (passe 1).
- Initiales puis la réponse sans Entrée : tout le texte va dans la case des initiales (« Le ciel est noir. » en entier, réponse vide, élève : personne).
- Quand l'élève est reconnu : dans la ligne, à la dernière lettre des initiales (l.19695). **Le vert, à la 1ʳᵉ lettre de la réponse** (passe 2, curseur remis dans la réponse par un clic : vert « non » à Entrée et au clic, « oui » à la lecture qui suit la 1ʳᵉ lettre, moins de 190 ms après la touche ; 4 sur 4 réponses). La ligne : `participation` (l.19753) ne compte un élève que si sa réponse a du texte (`r.eleve && r.r`). Paul a raison sur ce point.

## 3 · Le moment du dévoilement (tableau distant)
- Question pas dévoilée (« 0 / 1 dévoilés ») : la 1ʳᵉ lettre de la réponse la dévoile (« 1 / 1 ») et le tableau montre la réponse lettre à lettre (2 lettres sur 22 à la 2ᵉ lettre, 3 sur 22 à la 3ᵉ, 22 sur 22 à la fin ; chaque lettre est au tableau à la lecture suivante, moins de 190 ms après la touche). `dr_frappeReponse` (l.19710) → `pousser`.
- Entrée ne change rien au tableau. Le geste « dévoiler » après coup : la question est déjà dévoilée, la flèche passe à la diapo suivante.
- Ce que le tableau montre de l'élève : les initiales « ZA » (1 fois) ; jamais le prénom ni le nom (dans aucune lecture).
- Pendant le gel, le tableau ne bouge pas. Au dégel (« Dégeler ici »), il montre les deux réponses tapées pendant le gel, en entier (17 sur 17, 26 sur 26 lettres), lu 1,8 s après le clic.

## 4 · Le gel — la supposition est juste
- Gel sur la diapo d'après « Groupe 1 » (« Groupe 2 : Le lac » ; 1 réponse au journal), Paul passe à « Groupe 2 : l'hypothèse », y tape 2 réponses, dégèle par « Dégeler ici » (la garde : « La classe est sur la diapo 10, tu es à la diapo 11… »).
- Le journal de l'heure (`reponse`) : 1 avant, 1 après le dégel, toujours 1 au bout de 1,5 s. **Les 2 réponses du gel n'y sont pas (0 sur 2)**, alors qu'elles sont dans les diapos (3 réponses dans les diapos).
- Le récit et le Papier, après la clôture : la réponse d'avant le gel y est (1 sur 1) ; **les 2 du gel n'y sont pas (0 sur 2)**.
- La ligne : `pousser` (l.18281) n'écrit `reponse` que si le tableau était déjà sur la même diapo (`av.di === et.di`) ; au dégel il arrive d'une autre diapo, seule la `diapo` est écrite (l.18279). Le récit lit le journal (`repsJ`, l.22279).

## 5 · L'heure jouée et close
- Même jour, puis le lendemain : la case ne montre que « ✕ » et « Relire cette heure » (3 ouvertures sur 3 : 1 le jour même, 2 le lendemain). Ni « Reprendre l'heure », ni « ▶ Rattraper cette heure », ni « Ouvrir le pilotage et lancer ». On ne peut ni la rouvrir ni la rattraper par le geste. Les lignes : la fenêtre de la case (l.27400-27406 : « Reprendre » seulement si l'heure n'est pas close ; l.27422-27425 : « Rattraper » seulement pour une case passée sans heure jouée). Le message « … elle ne se rouvre pas » (l.20566) n'apparaît pas : aucun bouton n'y mène.
- Retrouver les réponses en rouvrant l'heure : impossible à mesurer, l'heure ne se rouvre pas.
- **Changer l'élève pendant l'heure** (réponse validée, initiales « ZA » → « lc », Entrée) : la ligne passe à l'élève 4 et le vert aussi ; **le journal garde l'élève 1 « ZA », et le récit nomme l'élève 1**. Aucune trace du changement au journal. La ligne : `pousser` (l.18283) ne met à jour que le texte et la reformulation d'une réponse déjà écrite, jamais l'élève.
- **Changer l'élève dans la Relecture** : aucun moyen trouvé. Le récit, « Ce qui s'est passé » et le Papier montrent la réponse (3 sur 3), sans élément cliquable ; clic droit : 0 menu ; 1 seul champ modifiable (le choix « Relire cette séance telle qu'une autre classe l'a… »).

## Pas mesuré
- Le vrai hub (interdit) : les chiffres 24 et 2 de la conscience ne sont pas revus.
- Le journal au faux hub : pas compté (le compte est fait dans la page, `J`).
- Pourquoi la 2ᵉ ligne d'une diapo garde le curseur et pas la 1ʳᵉ : pas cherché ; une seule 2ᵉ ligne mesurée.
- Les autres tailles d'écran (seulement 1536×864).

## Vu en passant (pas codé)
- La 1ʳᵉ lettre partie dans le titre de l'activité **change le titre de la diapo** (« Groupe 1 : l'hypothèseL » au tableau distant, passe 1).
