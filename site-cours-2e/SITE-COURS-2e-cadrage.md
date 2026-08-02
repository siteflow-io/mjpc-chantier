# SITE-COURS-2e — CADRAGE (exécutant → conscience)
**02/08 · j'attends le feu vert**

## Lu (md5 mesurés)
**`MJPC6-plan-de-travail.md` 26 812 o · `bb37732b810ef75498ae5210e3d9e860` — son avertissement lu EN PREMIER** · DISPOSITIF `448f754e6c39821cab742a4d66268bb9` · **DOCTRINE `6918d27f3deb49dbc11083c9be127f79`** · doctrine du site `bbc34f10fd772eb16b0268cafaebe3f5` · CHANTIER `aae67ef9209a5043811a7bacb07f488a` · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · **journal `0ab22aa046f9b3bb8b2d41b414172b73`** · **canon `d9b40cc390a5034b294fbc8e31ca15cf` (1.5.0)**.
**Base mesurée moi-même** : `index.html` **663 038 o · `adb8623f19929e52f4862b3ea244ec87` · pastille 8.14.0**.

## Ce que j'ai compris de la chaîne en aval, et ce que mon morceau lui doit
Le chapitre déclare → **la Concordance** rend les notions canoniques d'une app à l'autre → **le profil longitudinal** agrège (M15 élève, M-PILOTAGE prof) → **le conseil** devient possible (« tu avais travaillé cette notion en séance 3 du chapitre 2 ») → **M20** reçoit l'entraînement prescrit ; le COCKPIT et la famille K lisent la même chaîne.
**Ce que mon morceau lui doit, concrètement** : ① que **rien de ce qui est déclaré ne se perde en chemin** — sinon l'aval lit l'absence comme une information ; ② que les identifiants écrits soient **ceux de la taxonomie**, jamais des chaînes libres, sinon la Concordance ne pourra pas rapprocher ; ③ que **le sommaire résume assez pour que le chapitre suivant n'ait pas à relire le précédent** — c'est la porte d'entrée du conseil longitudinal.

## ⚠ ① LA RÉPARATION — MA MESURE CONTREDIT LE MANDAT, ET JE LA SOURCE
Le mandat dit : *« `chInjecterConfirme` ne les écrit PAS au hub (mesuré : zéro occurrence) »*. **Faux : il y a 5 occurrences de `notions` et 4 de `competences` dans cette fonction.** Les quatre voies, mesurées une par une :
| voie | ce qui passe |
|---|---|
| **jumeau** | `JSON.parse(JSON.stringify(o.chapitre))` — **objet entier : tags inclus** ✓ |
| **remplacer** | idem, chapitre entier écrit — **tags inclus** ✓ |
| **compléter, chapitre absent** | `JSON.parse(JSON.stringify(o.chapitre))` — **tags inclus** ✓ |
| **compléter, séance nouvelle** | `JSON.parse(JSON.stringify(np))` — **tags de la séance inclus** ✓ |
| **compléter, items nouveaux** | `JSON.parse(JSON.stringify(np.items[k]))` — **tags de l'item inclus** ✓ |
| **compléter, séance existante** | tags écrits **seulement si la séance n'en avait aucun** (`if((np.notions||[]).length && !(m.se.notions||[]).length)`) — **volontaire** (« compléter ne touche à rien ») |
**LE VRAI TROU EST AILLEURS, ET IL EST RÉEL** : ⓐ **un item EXISTANT n'est jamais retouché** (`if(m.se.items&&m.se.items[k])return;`) — donc **un item déjà là ne recevra jamais ses notions**, alors que c'est le cas le plus fréquent (les chapitres de 3e ont des items sans tags) ; ⓑ **le chapitre lui-même n'a aucun champ à tagger aujourd'hui** — c'est l'objet du volet ②. **Je répare ⓐ** : les tags d'un item existant s'ajoutent **s'il n'en a pas**, sans jamais toucher au reste de l'item. Et je le prouve au journal réseau.

## L'état mesuré du hub — ce sur quoi le morceau va s'appliquer
`/site/<niveau>/chapitres` : **6e** 2 rangs / 1 chapitre · **5e** 2/1 · **4e** 4/3 · **3e** 10/9. Champs actuels : `title`, `ordre`, `published`, `seances`. **Aucun chapitre ne porte `entree`, `competencesMajeures` ni `competencesMineures`** — je les ajoute, rien ne change de forme.
`taxonomie/competences.francaisC4` : **5 blocs** (oral, lire, écrire, langue, culture), **18 identifiants** `c4-…`. Ce sont eux, et eux seuls, que `competencesMajeures`/`Mineures` accepteront.

## ② La forme des nouveaux champs
```json
{ "title":"…", "ordre":3, "published":{…}, "seances":[…],
  "entree":"recit",
  "competencesMajeures":["c4-ecrire-02"],
  "competencesMineures":["c4-lire-01","c4-langue-03"] }
```
**`entree`** : quatre valeurs par niveau, **une par genre** — `recit`, `poesie`, `theatre`, et la quatrième **selon le niveau** : `discours_essai` en 4e, `articles_essai` en 3e (en 6e/5e, je propose `recit`, `poesie`, `theatre`, `merveilleux_autre` — **à trancher par Paul, je ne l'invente pas seul**).
**Les deux listes de compétences** : identifiants de `francaisC4`, **validés en étant nommés** si inconnus. **Une compétence ne peut pas être à la fois majeure et mineure** — refus nommé.
**Le prompt fait PROPOSER, jamais trancher** : il demande à l'IA de **suggérer** une majeure et des mineures **en argumentant depuis l'entrée et l'état de l'année**, et de dire explicitement que **c'est Paul qui décide**.

## ③ L'état de l'année — généré, jamais écrit
`chEtatAnnee(niveau)` lit **la liste entière** `/site/<niveau>/chapitres` (là où `chInventaire` ne regarde qu'un chapitre) et produit, **pour chaque chapitre existant** : rang, titre, `entree`, `competencesMajeures` (en **libellé**, pas en identifiant — règle des deux publics). Le prompt le reçoit sous `@@ETAT_ANNEE@@`.
**Et il demande à l'IA de s'en servir** : ① proposer une **alternance fondée** — non pas changer le type de séance, mais **déplacer le poids des compétences** (« l'écriture a été majeure aux chapitres 1 et 2 : ici elle peut rester présente sans être majeure ») ; ② **signaler les manques du quantitatif annuel** : **4 œuvres intégrales de genres et d'époques variés, 3 lectures cursives, 2 groupements de textes, une dizaine de notions littéraires** — « il te manque une entrée théâtre et deux cursives ». **Le décompte des œuvres n'est pas mesurable aujourd'hui** (rien ne les déclare) : **l'IA le demande à Paul, elle ne l'invente pas** — je le dis au rapport comme une limite.

## ④ Le sommaire — séance de rang 0, calculé + écrit
`chSommaire(chapitre)` **calcule** : le plan (les séances dans l'ordre, avec leur type), les **notions** rencontrées (en libellé, dédoublonnées), les **compétences majeures et mineures** du chapitre, l'**entrée**. **Un sommaire écrit mentirait dès qu'une séance change ; celui-ci se recalcule.**
**Plus une zone ÉCRITE** — `problematique` et `aRetenir` — pour ce qui ne se calcule pas.
**C'est une séance ordinaire de rang 0** : `{title:"Sommaire du chapitre", type:"sommaire", ordre:0, items:{}}` — **elle porte donc des items** (lien de film, ressource externe) comme les autres, et **elle est publiable séparément** : `published` reste le geste de Paul, l'injection ne l'écrit jamais.
**Elle sert à l'IA du chapitre suivant** : je vérifierai qu'elle **se suffit à elle-même** — c'est-à-dire qu'à partir du seul sommaire, on peut dire ce que le chapitre a travaillé (entrée, majeures, mineures, notions, plan) **sans relire les séances**. Si un élément manque pour cet usage, je le dirai plutôt que de le supposer.

## Ancres et portées
Section nommée **`§ CHAPITRE : DÉCLARATION ET SOMMAIRE`**, posée **après `§ PROMPT MAÎTRE DE CHAPITRE`**, ancrée **par contexte** (le marqueur de fin existe en double, CSS et JS — payé deux fois). **Le socle n'est pas touché** (canon 1.5.0 déjà embarqué, et il n'est pas contigu dans ce fichier). Fonctions **top-level**, **vérifiées sur `window` au banc navigateur**.

## Questions (3)
**Q1 — les quatre entrées de 6e et 5e.** Le mandat donne la quatrième pour 4e et 3e seulement. **Je ne l'invente pas** : quelles valeurs pour 6e et 5e ?
**Q2 — le sommaire est-il créé automatiquement à l'injection, ou sur demande ?** Je propose : **proposé à l'injection, coché par défaut, décochable** — un chapitre « doit toujours commencer » par lui (décision de Paul), mais l'écrire sans le dire serait une écriture non demandée.
**Q3 — le quantitatif annuel n'est pas mesurable** (rien ne déclare les œuvres intégrales ni les cursives). Je fais **demander le décompte à Paul par l'IA**. Faut-il **prévoir dès maintenant un champ `oeuvres` au chapitre** pour que ce soit mesurable demain — ou est-ce un autre morceau ?
