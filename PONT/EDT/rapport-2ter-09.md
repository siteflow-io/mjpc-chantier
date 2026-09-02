# RAPPORT — LOT 2ter · livraison ⑨ (finale) · CE QUI BLOQUAIT LE PROMEUS EST FERMÉ
Version **8.73.0-⑨**. Exécutant 11.

## Base et candidat

| | octets | md5 | version |
|---|---|---|---|
| ⑨-b | 1 758 505 | `9393639ee38f0819ab0a9e52b4f35e4b` | 8.73.0-⑨b |
| **Candidat ⑨** | **1 762 154** | **`45337e4f5722d6fb118e918bcd792be2`** | **8.73.0-⑨** |

*(taille et md5 relus au sas après le push — voir la fin du rapport)*

## §⓪quater LE VERROU PAR CLÉ — la dette qui bloquait

Trouvée par l'audit adverse de ⑨-a : deux gestes lancés coup sur coup sur la même
heure donnaient **2 écritures, 0 archive, un journal réduit au second**. L'archive et
le journal sont le filet de Paul — c'est ce que « ↶ Annuler » relit. Les faire sauter
tous les deux rendait le geste précédent irrécupérable.

**Le patron n'a pas été inventé** : c'est celui de `EDT.miseANiveauEnCours`, posé en
①bis. `EDT.decisionsEnCours` est indexé **par clé** — classe + heure — donc deux
heures différentes s'écrivent toujours en même temps.

**Les preuves du §③ :**

| | mesuré |
|---|---|
| deux gestes sur **la même case** | **1 écriture** · **1 archive** · journal : `décision de départ`, `geste A` — le second n'y est pas |
| **l'archive porte l'état d'avant du premier** | catégorie « Vie scolaire », la décision qui précédait |
| **le second le dit** | *« Un geste est déjà en cours sur cette heure. Attends qu'il soit enregistré avant d'en faire un autre — sinon le premier serait perdu. »* |
| deux gestes sur **deux cases différentes** | **2 écritures**, aucun refus — le verrou porte sur la clé, pas sur le site |

**Un filet de sécurité, déclaré** : si le hub ne répond jamais, le verrou serait posé
pour la vie. Un minuteur le lève au bout de 8 secondes. `edtEcrireArchive` n'a pas de
rappel d'échec — c'est la seule voie disponible sans toucher au transport.

**Ce que je n'ai pas pu mesurer, et je le redis** : le comportement **sur un magasin
déjà rempli, en conditions réelles de réseau**. Ici le hub répond instantanément.
Le verrou est prouvé sur le geste, pas sur une latence réelle.

## §①.5 LA BASCULE DE FIN D'ANNÉE, ET LES DEUX LIBELLÉS

**`EDT_MOTIFS` n'a pas bougé** — md5 de la table inchangé. C'est `edtMotifEnClair`
qui compose, comme il le fait déjà pour `calendrier` et `banalisee` :

| état | ce que Paul lit |
|---|---|
| heure à replacer, l'année court encore | **« heure à replacer, en attente de replacement »** |
| heure à replacer, l'année est finie | **« heure à replacer jamais replacée »** |

Le libellé mentait depuis le lot ⑥ : une heure prise ce matin s'affichait « jamais
replacée » alors que Paul pouvait la replacer le lendemain.

La bascule est **une charge**, comme la mise à niveau : elle tourne au chargement,
écrit avec archive, et **dit ce qu'elle a fait**. Elle ne touche que les heures
`aReplacer:true` encore en attente.

**Les deux mesures du §③.7**, sur une année déjà close (`finAnnee` 2026-06-30) :

| | mesuré |
|---|---|
| l'heure prise par une autre classe | `jamaisReplacee: true` · **justifiée : false** · basculable : **true** · en clair : « heure à replacer jamais replacée » |
| **l'heure que Paul avait banalisée lui-même** | motif `banalisee`, **justifiée : true**, **non touchée** |

## §①.6 LA PHOTO AUTOMATIQUE SE RETENTE

**Deux drapeaux, pas un.** `photoAutoEnCours` empêche une seconde photo pendant que
le hub répond ; `photoAutoEmise` ne se pose **qu'après une écriture réussie**.

| | mesuré |
|---|---|
| le hub **refuse** l'écriture | **0 photo** au hub · `photoAutoEmise` : **null** · l'échéance `per:UN` **reste due** |
| **le chargement suivant** | **1 photo**, « Trimestre 1 », échéance `per:UN` · `photoAutoEmise` : `per:UN` |

Avant, le drapeau était posé avant l'écriture : un refus faisait perdre l'échéance
pour toute la session. Dette ouverte par ⑧, fermée ici.

## §③.9 NON-RÉGRESSION

- Moteur `AT_DR_B64` : **309 812** caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944` — identique.
- `function secu*` **29** · `published` **97**.
- `function edt*` : **226 déclarations / 226 noms**, **aucun doublon**. Cinq ajoutées sur tout le lot ⑨, toutes nommées : `edtBlocBanaliser`, `edtTraceExiste`, `edtSemaineDe`, `edtQuoiChercher`, `edtHeuresJamaisReplacees`.
- Trois portes inchangées · `edt-fige` **9** — rien renommé.
- `EDT_CATEGORIES` et `EDT_MOTIFS` **inchangés**.
- **Garde VERTE** sur ses cinq questions · **double parseur vert**.
- `tests/banc-verrou-bascule-09.mjs` — **5 repères, tous verts**.

### `banc-tout.mjs` — **32 bancs, tous verts, 93 repères**

Les deux bancs de ⑨ y sont inscrits. Le passage a été joué **en six tranches** : la
machine de l'exécutant coupe le processus avant la fin quand la course dépasse une
dizaine de minutes, et je préfère six comptes-rendus lus à un bilan que je n'aurais
pas vu.

```
0→5    ✔ ①bis-a · ①bis-b · ①ter · ②a · ②b                          15 repères
5→10   ✔ ② · ③a · ③b · ③ · ③bis-a                                  15 repères
10→15  ✔ ③bis-b · ④a · ④ · ⑤a · ⑤b                                 15 repères
15→21  ✔ ⑤c · ⑤c-bis · ⑤c-ter · audit ② · audit ③ · audit ③bis     14 repères
21→27  ✔ ⑥a · ⑥b · ⑥c · ⑥ · ⑦b · ⑦                                 19 repères
27→32  ✔ ⑤ · calendrier réel · ⑧a · ⑨b · ⑨                          15 repères
```

## UNE ERREUR QUE J'AI FAITE, ET CORRIGÉE

La version avait été écrite **`8.73.0-⑩`** au lieu de `⑨` : le caractère cerclé ⑨ est
`\u2468`, ⑩ est `\u2469`. Quatre marques de commentaire portaient la même faute.
Corrigé et vérifié avant tout push : `APP_VERSION="8.73.0-⑨"`.

## ÉTAT DES SEPT POINTS QUI BLOQUAIENT LE PROMEUS

| | état |
|---|---|
| ① les captures de ⑤ | **fermé** (⑨-a) — quatre écrans, et un geste qui n'existait pas a été ouvert |
| ② les captures et l'audit adverse de ⑥ | **fermé** (⑨-a) — cinq écrans, sept cas joués |
| ③ la liste à 120 jours, sans recherche | **fermé** (⑨-b) — 967 entrées vues au lieu de 60, recherche par mois, semaine, A/B |
| ④ le refus « trace existe » | **fermé** (⑨-b) — nommé, et il porte sur la trace, jamais sur la date |
| ⑤ la bascule de fin d'année | **fermé** (⑨) — avec les deux libellés |
| ⑥ la photo non retentée | **fermé** (⑨) — deux drapeaux |
| ⑦ les deux gestes concurrents | **fermé** (⑨) — verrou par clé |

## Écarts signalés, jamais ajustés

1. **Le verrou n'est pas éprouvé en conditions réelles de réseau** ni sur un magasin
   déjà rempli (§⓪quater le demandait explicitement : je le déclare).
2. **Le refus sur une heure réellement jouée n'est pas prouvé par le geste** : le jeu
   de données du banc ⑨-b ne contient aucune heure jouée dans la semaine affichée.
   Le refus tient par le code et par la modale.
3. **Le bloc « Banaliser » reste exclu sur une heure prise dans un déplacement**
   (⑨-a) : l'écrire couperait le lien avec son autre bout. **Signalé, jamais tranché.**
4. **`banc-tout` n'a pas été obtenu d'un seul tenant** sur ce candidat (six tranches).

## Ce que je n'ai pas pu mesurer

- Le geste sur le site réel de Paul : faux hub, le sas n'est pas publié en Pages.
- Le verrou sous une vraie latence réseau (écart 1).
- Le refus sur une heure jouée, par le geste (écart 2).

## ARRÊT

**Les sept points qui bloquaient le promeus sont fermés.** Il reste un point signalé
et jamais tranché — le bloc « Banaliser » sur une heure déplacée — et trois choses
que je n'ai pas pu mesurer, toutes nommées ci-dessus. **Rien n'est parti en
production : la promotion est le geste de Paul.**
