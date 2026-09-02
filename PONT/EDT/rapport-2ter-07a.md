# RAPPORT — LOT 2ter · livraison ⑦-a · LE RENDU STATIQUE DE LA VUE ANNÉE
**Aucune ligne n'a été écrite dans `index.html`** : md5 inchangé, `966eaafd1e1f260c2cdef9e3826aebca`, version 8.73.0-⑥. C'est la méthode imposée.

## Livrable
`PONT/EDT/T-7a-annee.html` — **32 212 octets**, autonome, **sur le calendrier réel** (`json/calendrier-2026-2027.json` et `json/grille-2026-2027.json` embarqués). Captures : `tests/T-7a-annee-dezoome.png`, `-zoome.png`, `-a-cheval.png`. Mesures rejouables : `tests/shot-annee.mjs`.

## Ce que j'ai repris des quatre maquettes, et ce dont je me suis écarté
J'ai ouvert les quatre pièces avant d'écrire. **Repris tel quel de `T152-annee-dezoome`** : la palette (`--fond`, `--carte`, `--or`…), la structure `.an > .mois > .jours > .j` avec les trois colonnes `15px 15px 1fr` (numéro, initiale, piste), les trois couleurs de bandeau (`#4a3b6b` classe, `#2f3f5c` établissement, `#5c4a20` jalon), les fonds de vacances et de fériés, la classe `.plat` à 9 px, les pastilles 6×6 et la légende.
**Écarts, avec leur raison** : (1) les hauteurs de bandeau sont **calculées après peinture**, à partir de la hauteur réelle des lignes qu'ils couvrent — les maquettes les posaient en dur, ce qui ne tient pas quand les jours aplatis changent la hauteur des voisins ; (2) en zoomé, les colonnes passent à **330 px minimum** — à 230 px un libellé long restait tronqué, mesuré ; (3) j'ai ajouté au survol le titre complet et la période, et au clic un encart, parce que le §①.2 le demande.

## Preuves — §⑥
**⑥.2 — tout y est, compté à l'écran et comparé au JSON** :

| | à l'écran | dans le JSON |
|---|---|---|
| colonnes | **12** (août → juillet) | — |
| événements d'établissement | **59** | 59 |
| événements de classe | **15** | 15 |
| jalons | **30** | 30 |
| **total bandeaux** | **104** | 104 |
| jours de vacances (fond) | **118** | 7 périodes |
| fériés (fond) | **11** | 11 |

**⑥.3 — un séjour de trois jours est UN bandeau** : « Séjour Verdun 3e », `jours = 3`, **hauteur 152 px** — un seul élément, pas trois.

**⑥.4 — à cheval sur deux mois.** **Mesuré d'abord : le calendrier réel n'en contient aucun** (0 sur 104). Le rendu accepte donc `?demo=cheval`, qui ajoute un événement du 29 octobre au 3 novembre — **déclaré, et c'est le seul élément qui ne vient pas des données réelles**. Résultat : **2 bandeaux**, « Semaine des langues (démonstration à cheval) **→** » en octobre et « **←** Semaine des langues… » en novembre, 3 jours chacun, **0 débordement de colonne**.

**⑥.5 — aucun trait ne traverse les pistes** : 0 élément `hr`/barre/trait dans le rendu, et **0 bandeau qui déborde de sa colonne** (mesuré sur les 104). Capture pleine page à l'appui.

**⑥.6 — dézoomé, l'année tient sur une page** : hauteur du document **900 px** pour une fenêtre de **900 px**, **aucun défilement vertical**.

**⑥.7 — zoomé** : défilement horizontal **actif** (contenu 4 015 px pour 1 576 px de vue), et le libellé long « 13h45 photo 14h30-18h pré-rentrée » **se lit en entier** (`libelleEntier: true`).

**⑥.8 — jours aplatis** : un samedi fait **10 px**, un mardi de cours **32 px**, et le samedi affiche toujours **« 1 S »** — numéro et initiale lisibles dans les deux cas.

**⑥.9 — les pastilles** : une par classe, **quatre au maximum** (`pastillesMax: 4`), trois couleurs — vert jouée, gris prévue, ambre sans séance.

## Écarts signalés, jamais ajustés
1. **Les états des pastilles sont fictifs dans ce rendu.** Un fichier statique n'a pas de hub : trois décisions de démonstration sont écrites en clair dans le fichier (une heure jouée le 14/10, une jouée le 16/11, une sans séance le 17/11) **uniquement pour montrer les trois couleurs**. Dans le site, elles viendront du magasin des décisions. **La pastille d'événement (§②, `edtEvenementJustifie`) n'est pas branchée ici** : c'est la livraison ⑦.
2. **Les vacances marquent 118 jours de fond**, week-ends compris : le fond suit la période déclarée, il ne saute pas les samedis.
3. **La frise par classe est bien abandonnée**, comme le §①.1 le demande.
4. **Le zoom est à deux états** (dézoomé / zoomé), pas continu : Ctrl + molette bascule de l'un à l'autre. Les maquettes montraient deux états, je n'ai pas inventé de niveaux intermédiaires.

## Ce que je n'ai pas pu mesurer
- **Le rendu dans le site** : c'est ⑦-b, et je n'ai touché à aucune ligne d'`index.html`.
- **La pastille d'événement allumée/éteinte** (⑥.10) : elle demande le magasin des décisions, donc le site.
- **Le geste par clics dans le panneau prof** (⑥.13) : idem.

## ARRÊT
Le rendu est au sas avec ses trois captures. **Paul compare aux quatre maquettes et relance.** Je n'écris rien dans le site avant son mot.
