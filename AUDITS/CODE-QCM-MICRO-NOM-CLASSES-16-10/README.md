# Micro de la conscience n°12 — le nom des classes à l'écran (16/10/2026, dette n°12 · 215)

Paul, 16/10, 07:15 : « tu me fais en micro l'affichage du nom des classes (il y avait eu le même problème sur correction dictée, le nom des classes s'affichait en brut) ».

## Verdict : ça va ; en ligne comme 8.0.2

## Ce qui était mesuré sur la 8.0.1 (md5 `054fcca3…`)

`sonde-classes.js` joue l'app sur le faux hub, avec une classe fictive au format réel du registre de Paul (clé `3_essai`, nom « 3 ESSAI », niveau 3e, comme `3_dylan_bob` / « 3 DYLAN BOB » au hub ; une seconde, `4_essai`). Sortie : `sonde-classes-avant-054fcca3.txt`, captures `captures-avant/`. La clé paraît telle quelle dans le menu « Classe » (« 3_essai (25 élèves) »), l'appel, le titre de la console, le téléphone et le tableau ; le nom en capitales dans « 📚 Séances précédentes », Résultats, « passée par », le tableau de la séance, « 📄 Lire les copies ».

## Ce qui est fait (code-qcm `eb21db62`, bancs `99a7de1d`)

`nomClasseV`, en tête de `src/c3-base.js`, la règle de `nomClasseLisibleL15c` de `correction_dictee.html` : le nom du registre s'il a des minuscules (« 3E Charles de Gaulle ») ; sinon ce nom, ou la clé, rendu lisible : « 3e Dylan Bob », « 3e Franklin Aretha », « 4e Hugo », « 4e Turing » ; une classe interne (« _test_… ») telle quelle. Branchée sur `CLASSE` (`c3-base.js`, `c3-pilot.js`, `etape2.js` : les titres, l'en-tête des tablettes, le téléphone, le tableau), le menu « Classe » (`etape2.js`), le libellé des séances (`v3Eleves`, `c4-seances.js` : Résultats, le tableau de la séance, « Lire les copies », le PDF), « passée par » et « 👥 » (`c3-evals.js`), « Séances précédentes » et la corbeille (`c3-soir.js`), « Terminer » et les séances en cours (`c3-scenes.js`). À l'écran seulement : la clé reste l'identifiant dans la base, les gestes et les tris.

## Les épreuves, sur l'app md5 `a1b62f182c9ef189fe73d937490a0478`

| Épreuve | Résultat |
| --- | --- |
| Sonde du nom des classes, après | aucune forme brute (`sonde-classes-apres-a1b62f18.txt`) ; la forme lisible partout où la brute était (`sonde-classes-apres-a1b62f18-lisible.txt`, `captures-apres/`) |
| Contrôles de la conscience (K1 suit le nom à l'écran, md5 `35a0f5c2…`) | 32 / 32 |
| Sonde B, sonde de l'œil | 17 / 17, 4 / 4 |
| Banc commun de QCM-4 | 211 / 211, joué seul (`bancs/banc-seul.txt`) ; joué en même temps qu'un autre banc sur les 2 processeurs de l'atelier, 3 échecs d'une seule cause, le second clic de Julien à Q2 arrivé trop tard (`bancs/banc-en-parallele.txt`) |
| L'heure de demain, gestes rares, reprises 2 à 5, 7-a à 7-e | 109 / 109, 47 / 47, 22, 15, 27, 10, 40, 85, 141, 87, 9 : aucun échec |
| Les scènes jamais atteintes (`banc-jamais.js`) | 10 échecs, plafond de 5 min ; 12 échecs sur la 8.0.1 et avant : banc d'exploration, comme au VERDICT du 15/10 |
| Fidélité à la maquette v9 | sur les 97 scènes atteintes par le banc commun, aucun écart nouveau par rapport au 15/10 12:05 ; la classe écrite « 3e Essai » au lieu de « 3 ESSAI » est nommée dans `ecarts-maquette.json` |
| `qcm/sessionActive` au hub, lu avant la mise en ligne | vide (`null`) |

Les bancs, corrigés pour suivre le nom à l'écran (la fausse classe s'écrit « 3e Essai ») : leurs menus cherchent « 3 ESSAI » ou « 3e Essai », 7-d choisit la classe par sa clé, 7-a, l'heure de demain et le PDF acceptent « 3e Essai ».
