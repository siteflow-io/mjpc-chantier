# RAPPORT — LOT 2ter · LIVRAISON ⑩ · LE PARCOURS COMPLET
*Joué le 02/09/2026 au soir. **Aucune ligne de code n'a été touchée.** Le candidat au sas est le même avant et après : **1 762 154 o**, md5 **`45337e4f5722d6fb118e918bcd792be2`**, version affichée **V8.73.0-⑨**, **226 déclarations `edt*`**.*

## CE QUE PAUL VOIT ICI
Le site qu'il va mettre en ligne, **d'un seul tenant** : 29 vues numérotées dans l'ordre, prises au fil d'un seul parcours, sur un seul chargement. Plus une vue de la production, pour montrer d'où il part.

## MÉTHODE — ce qui rend ces vues opposables
- **Tout passe par la souris.** Chaque geste est un vrai clic aux coordonnées de l'élément (le navigateur émet `pointerdown` / `pointermove` / `pointerup`), jamais un appel de fonction. Le glisser-déposer du §⑤ est un vrai glisser : bouton enfoncé, dix mouvements, bouton relâché.
- **Avant chaque clic, le banc vérifie que l'élément est bien sous le pointeur** et qu'il a une taille réelle. Un élément caché n'est pas un geste de Paul : le banc le refuse et l'écrit.
- **Écran entier à chaque capture**, 1366 × 768 — la taille d'écran de Paul.
- **Un seul chargement du candidat** pour les vues p02 à p29. Aucune reprise, aucune session intermédiaire.
- **Faux hub en arbre** (méthode de `tests/captures-clics-01ter.mjs`) : **aucune requête n'est sortie**. 17 écritures sont parties vers le faux hub ; zéro vers le vrai.
- **La seule ligne non cliquée, déclarée** : `document.body.classList.add('admin-mode')` — la marque du professeur connecté, comme dans tous les bancs du lot.
- **Décor** : `tests/parcours-grille.json` = la grille à **deux classes appariées** du banc ⑥ (sans deux classes, un dépôt sur une case occupée ne peut pas ouvrir les trois issues) **+ les quatre créneaux de la classe d'essai tels qu'ils sont injectés en grille de production** (lundi 08:00, mardi 08:00, jeudi 10:07, vendredi 13:00). Le reste — classes, site 3e, calendrier, créneaux — est repris tel quel des bancs du lot.
- **Le banc du parcours** : `tests/parcours-10.mjs`, joué en entier, sans intervention.

## ① LA LISTE DES CAPTURES, chacune avec le clic qui l'a produite

| vue | ce qu'elle montre | le geste qui l'a produite |
|---|---|---|
| `p01` | **la production 8.70.1** : le panneau prof **sans emploi du temps** | clic « 🛠 Panneau prof » sur `production.html` |
| `p02` | le panneau prof du candidat | clic « 🛠 Panneau prof » |
| `p03` | la section Emploi du temps | clic « 📅 Emploi du temps » |
| `p04` | l'écran ouvert | clic « 📅 Ouvrir l'emploi du temps » |
| `p05` | la semaine du 31/8 au 4/9 avec ses classes | (l'écran s'ouvre sur la semaine courante) |
| `p06` | une case ouverte : pilotage, déplacer, banaliser | clic sur la case `lundi 31/8 · 08:57-09:52 · 3E Charles de Gaulle` |
| `p07` | **les trois issues, le prix dit avant** | glisser de cette case sur `lundi 31/8 · 15:07-16:02 · 4E BANKSY` |
| `p08` | après l'échange | clic « Échanger les deux heures » |
| `p09` | après l'écrasement | glisser `mardi 8/9 · 15:07` sur `mardi 8/9 · 10:07 · 4E BANKSY`, puis clic « Prendre le créneau » |
| `p10` | **« ⏳ 1 heure à replacer » dans le bandeau** | (la grille, après l'écrasement) |
| `p11` | le rappel dans la vue de la classe | clic sur une case de 4E BANKSY |
| `p12` | la liste des destinations ouverte — **912 entrées, 911 proposées** | (la liste de la case ouverte) |
| `p13` | filtrée par mois — **70 entrées** | frappe « octobre » dans le champ de filtre |
| `p14` | filtrée par semaine — **entrées de la semaine 38** | frappe « 38 » |
| `p15` | filtrée par A/B — **471 entrées** | frappe « A » |
| `p16` | l'écran Heures perdues | clic « Heures perdues… » |
| `p17` | une coche : « 4E BANKSY · cette année, 1 heure perdue, dont 1 déclarée justifiée » | clic sur la case à cocher de `Tribunal Saumur 4e · jeudi 17 septembre` |
| `p18` | **la banalisation par-dessus, avec son annonce** | clic « Semaine », 2 clics sur « › », clic sur la case déjà comptée, clic « Banaliser cette heure » |
| `p19` | le total en tête après remplacement | clic « Remplacer le motif », puis clic « Heures perdues… » |
| `p20` | le mois | clic « Mois » |
| `p21` | l'année dézoomée | clic « Année » |
| `p22` | l'année zoomée | **Ctrl + molette** au centre de l'écran |
| `p23` | un événement cliqué (« 9h30 CODIR / 13h45 photo / pré-rentrée ») | clic sur la barre de l'événement |
| `p24` | l'écran « 🎓 Dates de l'année » | clic « ✕ Fermer l'emploi du temps », puis clic « 🎓 Dates de l'année » |
| `p25` | **un refus, avec son message** | clic « Calendrier de l'année », frappe d'un calendrier dont la Toussaint finit avant de commencer, clic « Vérifier » |
| `p26` | la photo du prévu : « **Photo du prévu prise — 18 cases.** » | clic « 📷 Photo du prévu » |
| `p27` | le mode test **éteint** : 18 cases, 30 créneaux lus | clic « Semaine » |
| `p28` | le mode test **allumé** : **22 cases, 34 créneaux lus** | clic « ✕ Fermer », clic sur la pastille « 🧪 Mode test », clic « 📅 Emploi du temps », clic « Ouvrir », clic « Semaine » |
| `p29` | le prompt : « **Prompt copié — 18 452 caractères, consigne et JSON ensemble.** » | clic « 📋 Copier le prompt — grille » |

Le journal complet des clics, geste par geste, est dans `tests/parcours/journal-des-clics.txt` (156 lignes).

**Sept vues ont été OUVERTES ET REGARDÉES**, pas seulement produites : `p01`, `p05`, `p07`, `p18`, `p25`, `p27`, `p28`. Ce qui suit vient de ce regard.

## ② CE QUE J'AI VU ET QUI NE VA PAS

**⚠ ①. LE DÉBUT ET LA FIN DE L'ANNÉE N'ONT AUCUN ÉCRAN. Ça ne va pas.**
L'écran « 🎓 Dates de l'année » (`p24`) ne porte **que les dates du brevet par niveau** (3ᵉ, 4ᵉ, 5ᵉ, 6ᵉ) et un bouton « Revenir aux dates par défaut ». Le début et la fin de l'année **ne s'y saisissent pas**.
Mesuré dans le fichier : `edtPoserDateAnnee` — la fonction qui pose ces deux dates **et qui refuse une fin antérieure au début** — **n'a qu'une seule occurrence : sa propre déclaration. Aucun appelant.** Ces deux dates n'arrivent donc que par l'injection du calendrier ; le refus qu'elle porte n'est atteignable par aucun geste de Paul.
**Conséquence directe pour le lot** : la bascule de fin d'année de la livraison ⑨ repose sur `edtFinAnnee()` ; si Paul veut corriger cette date à la main, il n'a pas d'endroit où le faire. **Je le déclare, je ne le corrige pas.**

**⚠ ②. LA CLASSE D'ESSAI APPARAÎT, MAIS RIEN NE LA NOMME À L'ÉCRAN. Ça ne va pas.**
C'est le point que la conscience n'avait jamais pu voir : **il est vu, et il est double.**
- **Elle apparaît**, mesuré et regardé : mode test éteint, **18 cases / 30 créneaux lus** ; allumé, **22 cases / 34 créneaux lus**. Les quatre cases de plus tombent **exactement** sur les quatre créneaux fictifs : lundi 14/9 08:00, mardi 15/9 08:00, jeudi 17/9 10:07, vendredi 18/9 13:00. `p27` et `p28` le montrent côte à côte : ces quatre cases sont vides à gauche, remplies à droite.
- **Mais elles portent « 3E Charles de Gaulle »**, comme une heure ordinaire. Le libellé du créneau fictif — « 3E Charles de Gaulle (classe d'essai) » — **est dans la donnée, pas à l'écran** : la case affiche le nom MJPC. Devant la grille, **rien ne dit à Paul que ces quatre heures sont des heures d'essai.**
- **Et le mode test vide la grille de ses séances** : dans `p28`, toutes les cases passent à « aucune séance prête », « Étude de texte accompagnée : L'Albatros » disparaît, les deux cartes du pied perdent leur chapitre. C'est cohérent (le mode test ne lit pas les données réelles), mais **une capture de mode test ressemble à une grille vide** : à savoir avant de la lire.

**✔ ③. LE FILTRE PAR NUMÉRO DE SEMAINE : ça va.**
Au premier passage, « 37 » ne rendait rien et j'ai failli l'écrire comme un défaut. **Mesuré avant de le dire** : cette liste ne propose que les semaines **38 à 51 puis 1 à 6** — les créneaux de la semaine en cours ne sont plus proposés. Sur une liste qui les porte, « 37 » rend **27 créneaux**. Le filtre fonctionne ; c'est la liste qui commence plus loin. `p14` montre donc le filtre sur « 38 ».

## ③ CE QUE JE N'AI PAS PU ATTEINDRE PAR UN CLIC

**①. La saisie d'une date dans un champ « date » — limite de MON BANC, pas du site.**
Ce que j'ai essayé, dans l'ordre : cliquer le champ « début » d'une période puis taper `01/03/2027` ; puis taper `01032027` ; puis frapper les huit chiffres touche par touche, chacune avec sa pause, suivies de Tab. **Dans les trois cas la valeur du champ reste vide** et la période garde `debut: ""`. Un champ `input[type=date]` ne se remplit pas au clavier dans un navigateur sans tête.
**Conséquence, dite franchement** : le refus « la fin précède le début » **sur une période** n'est pas prouvé par le geste. Je l'ai obtenu **sur le calendrier collé**, qui est le même geste de Paul et qui dit mot pour mot : *« Vacances "Toussaint" : la fin précède le début. »* (`p25`). **Le refus des périodes tient par le code (`edtValiderPeriodes`), pas par une capture. Je le déclare au lieu de l'affirmer.**

**②. Une liste déroulante déployée ne se capture pas.**
Le déploiement d'un `<select>` est dessiné par le système, hors de la page : aucune capture ne peut le montrer. `p12` à `p15` montrent donc **le champ, son intitulé et son filtre** ; le nombre d'entrées proposées est mesuré et porté au journal (911 → 70 → 471). Le choix dans la liste, lui, se fait bien par le geste.

**Tout le reste du mandat a été atteint par un clic.** Aucun écran du §① n'est resté hors de portée.

## ④ LE CANDIDAT, RELU APRÈS POUSSÉE
`PONT/EDT/index.html` — **1 762 154 octets**, md5 **`45337e4f5722d6fb118e918bcd792be2`**. **Inchangé.** Aucune ligne de code n'a été écrite ni au sas ni ailleurs ; cette livraison n'apporte que des images et ce rapport.

## ⑤ COMBIEN DE RECHARGEMENTS
**Deux, et seulement deux.**
1. La production, pour `p01` — c'est un autre fichier (`index.html` de `siteflow-io/monsieurjaipascompris`, 1 522 853 o, `6c7560af…`, 8.70.1). Il ne peut pas en être autrement.
2. Le candidat, pour `p02` à `p29` — **un seul chargement, tenu jusqu'au bout**, y compris les allers-retours entre l'écran de l'emploi du temps et le panneau prof (dates de l'année, pastille du mode test, prompt), qui se font par des clics de fermeture et de réouverture, jamais par un rechargement.

**Une leçon de ce parcours, à garder** : au premier passage, je fermais les fenêtres avec la touche Échap. **Échap ne ferme pas la fenêtre : il ferme tout l'emploi du temps.** Trois écrans que je croyais capturés étaient en réalité le panneau derrière. Depuis, le banc ferme comme Paul : par la croix, et par « ✕ Fermer l'emploi du temps ».
