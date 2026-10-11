# p8-5 — écrire en classe, dans la copie de la classe
*Exécutant, session cloud de Claude Code, 07/10/2026. Complément `MANDATS/COMPLEMENT-DEROULE-P8-5.md` (C13, tour 28), lu après le mandat (version 3) et le complément p8-4. Branche `deroule/p8-5`, partie de `deroule/p8-4`.*

## Ce que ça change pour la classe
Pendant l'heure, Paul corrige un texte de la diapo d'un clic, comme dans l'atelier. La classe voit la correction tout de suite, au tableau. **La correction va dans la copie de la classe, jamais dans la trame.**

À « Fin de l'heure », si la copie diffère de la trame, le pas à pas de fin d'heure s'ouvre sur l'étape « avant de clore ». La liste des diapos modifiées y est, chacune en clair : « la classe a vu « … » — la trame dit « … » ». Pour chacune, Paul répond « Verser dans la trame ? Oui, verser / Non, garder la trame ». Sans réponse, la trame ne change pas. Aucune boîte système ne s'ouvre.

## La base et son md5
- Base : le gabarit livré en p8-4, md5 `c1190046607ec2d21b22ab67623198c0`.
- `regen.sh` refait toute la chaîne jusqu'à **p8-5**. Avant d'appliquer p8-5, il vérifie octet pour octet les gabarits livrés, de p8-2 à p8-4. Sa sortie est dans `sorties/regen.txt`.
- Livrés :
  - le gabarit et la maquette (md5 en fin de NOTE) ;
  - les patches p8-2 à p8-4 et **`patch-p8-5.py`**, avec son code à part, `p8-5-classe.js`.

## Ce que j'ai mesuré avant de coder
- **L'état par diapo (`parDiapo`) est rangé par `si|eid`, pas par heure.** Il a déjà un champ `textes`, que le rendu sait poser sur la diapo (`et.textes`). Mais **rien ne l'écrit**.
- **La liste « Diapos modifiées pendant l'heure — verser dans le chapitre ? »** existait dans `clotureHtml`, en cases à cocher. Ces cases n'étaient **lues nulle part**, et elles se fondaient sur ce champ `textes` vide. Je l'ai remplacée.
- **« Fin de l'heure »** n'ouvre pas un écran à part. Il ouvre, dans la colonne de droite, le pas à pas de fin d'heure en 7 étapes. La liste du versement vit dans l'étape 5, « avant de clore ».

## La donnée, comme le vrai site la tiendra
`S.copie[heure][eid de la diapo][bid du bloc] = { t : le texte de tête, el : { rang : le texte } }`.
- Il y a une copie par classe et par heure. La maquette n'a qu'une classe : la classe est donc implicite ici, et le vrai site l'ajoutera en tête de la clé.
- La copie est ancrée par l'identité de la diapo et du bloc.
- Il n'y a pas de second jeu de diapos.
- Au rendu, au pilote et au tableau, la copie se pose par identité de bloc sur les textes de la diapo (`p8TextesCopie`).
- Le versement compare la copie et la trame par identité (`p8DiffCopie`), et n'écrit que ce qui diffère (`p8Verser`).

## Les décisions, et comment je les ai lues
1. **Heure lancée.**
   - Le texte des blocs s'écrit d'un clic : consigne, étapes, question, réponse attendue, légende.
   - La frappe va dans la copie (`p8EcrireCopie`), et le pilote et le tableau sont redessinés à chaque frappe. Le texte où l'on écrit garde son focus, grâce à la correction de `morph` faite en p8-4.
   - L'infobulle dit : « la classe voit ta correction ; elle reste dans la copie de la classe — « Fin de l'heure » te proposera de la verser dans la trame ».
   - **Lecture dite : en classe, on écrit le texte, on ne touche pas à la structure.** Entrée passe au texte suivant au lieu de créer un élément. Échap ne retire pas de ligne, et Alt + flèches ne déplacent pas de bloc. La zone « écrire sous le dernier bloc » reste un geste de l'atelier et de la répétition (p8-4).
   - Les réponses s'écrivent comme avant.
2. **« Fin de l'heure ».** Si la copie diffère de la trame, le pas à pas s'ouvre à l'étape 5, où la liste est visible.
   - « Oui, verser » écrit la copie dans la trame, bloc par bloc, par identité, et dit « Versé dans la trame (n textes). ».
   - « Non, garder la trame » ne touche à rien et dit « La trame ne change pas. ».
   - Un « non » vaut pour ce qui a été montré : si la classe corrige encore, la question est reposée.
   - Sans réponse, rien ne change.
3. **La répétition ne laisse aucune copie.** En répétition, l'écriture va dans la séance, et l'instantané de p8-4 l'oublie à l'arrêt. `S.copie` fait partie de l'état restauré.

## Ce qui a été modifié, compté
`patch-p8-5.py` fait 12 remplacements, chacun exigé une fois. Chaque nom nouveau a été cherché dans le gabarit avant d'être écrit (`S.copie` est distinct de `S.copieED`, qui existe déjà). Tailles relevées par le patch (`sorties/regen.txt`) ; j'ai relu chaque fonction en entier.

| fonction | avant | après | quoi |
|---|---|---|---|
| `tout` | 5 267 o / 13 lignes | 5 454 o / 13 lignes | en classe, le rendu pose la copie de la classe ; les textes se rebranchent à chaque rendu |
| `brancherAtelier` | 3 192 o / 6 | 3 843 o / 6 | marche aussi en classe ; une infobulle propre ; pas de barre du bloc hors de l'atelier ; en classe, Entrée passe au texte suivant, et ni Échap ni Alt + flèches ne changent la structure |
| `ecrireDansDiapo` | 443 o | 505 o | en classe, la frappe va dans la copie |
| `clotureHtml` | 2 308 o / 7 | 2 110 o / 7 | l'ancienne liste de cases inertes est remplacée par la liste du versement |
| `$('bfin').onclick` | 42 o | 130 o | si la copie diffère, le pas à pas s'ouvre à l'étape 5 |
| style | — | 9 règles | `.p8-verse…` (préfixées, cherchées avant d'être écrites) |

**Ajouté, à part** (`p8-5-classe.js`, 5 503 o, 8 fonctions, plus une écoute du clic sur « oui » / « non ») :
- `p8EnClasse` (88 o), `p8CopieDiapo` (128 o) et `p8EcrireCopie` (427 o) ;
- `p8DiffCopie` (504 o), `p8TextesCopie` (356 o) et `p8Verser` (326 o) ;
- `p8CopieDiffere` (98 o) et `p8ListeVersement` (1 343 o).

Le tableau ne reçoit aucune fonction nouvelle : la copie lui arrive déjà posée dans les textes de la diapo.

## Les bancs, comptés
- **`test-p8-5-classe`** (nouveau, 16 `ok(`), par la souris et le clavier :
  1. **Heure lancée, une correction.** Le banc double-clique sur « discute » et tape « échange ».
     - Le texte s'écrit d'un clic, et son infobulle parle de la copie.
     - La copie a changé, la trame non.
     - Le pilote et le tableau montrent « Observe, échange, … ».
     - Entrée ne change pas la structure de la diapo.
  2. **« Fin de l'heure »**.
     - La liste propose la diapo, en clair, avec « oui » et « non » et leurs infobulles.
     - « Reprendre le cours » sans répondre : la trame n'a pas changé.
     - Puis « Oui, verser » : la trame a changé, et la liste dit « Versé ».
  3. **Une seconde correction**, « hypothèse » → « idée » : elle va dans la copie seule. « Fin de l'heure » la propose. « Non, garder la trame » : la trame n'a pas changé, et la liste dit « La trame ne change pas ».
  4. **La répétition.** Une correction en répétition, puis « ■ Arrêter » : la copie est vide, aucun `textes` n'est rempli, et la trame est identique (JSON de la séance).
- **Recalé** : `test-p8-4-ecrire` (24 `ok(`), sa partie 7 « heure lancée ». En p8-4, le texte y était fermé ; en p8-5, il s'écrit, dans la copie. La vérification devient : le texte est écrivable, la frappe va dans la copie, la trame ne change pas, et il n'y a pas de zone sous le dernier bloc. Elle est marquée « recalé en p8-5 ».
- Inchangés : les 27 autres bancs.
- 29 bancs dans le banc unique, 605 `ok(` en tout.

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`
- Lancé le 2026-10-07 à 13:21 UTC : node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37.
- Maquette jouée : md5 `3d8ba32d65dee7b3928f5caadfb14008`.
- **29 bancs, 29 × « fin : 0 défaut(s) », « TOUS LES BANCS : 0 défaut ».**

## Les captures (toutes regardées, écran entier) — les chiffres sont dans `captures/MESURES-p8-5.txt`
| capture | ce qu'elle prouve |
|---|---|
| `p8-5-classe-pilote.png` / `p8-5-classe-tableau.png` | heure 1 lancée (chrono 00:03) : « Observe, échange, fais une hypothèse sur le Romantisme. » au pilote et au tableau, alors que la trame dit encore « discute ». Au pilote, Entrée a mis le curseur dans l'étape 1 (le cadre) |
| `p8-5-fin-liste.png` | « Fin de l'heure » : la colonne s'ouvre à l'« étape 5 sur 7 : avant de clore ». La liste : « Diapo 1 · « Analyse d'images : la routine » — 1 texte écrit en classe : la classe a vu « Observe, échange… » — la trame dit « Observe, discute… » ; Verser dans la trame ? Oui, verser · Non, garder la trame », et « Sans réponse, la trame ne change pas » |
| `p8-5-fin-oui.png` | après « Oui, verser » : « Versé dans la trame (1 texte). » |
| `p8-5-fin-non.png` | après la seconde correction (« fais une idée ») et « Non, garder la trame » : « La trame ne change pas. ». La trame dit « Observe, échange, fais une hypothèse… », la copie garde « idée » |

## Les défauts trouvés et corrigés (avec leur cause)
1. **Dans mon premier banc, la liste ne s'ouvrait pas.** **Cause** : « Fin de l'heure » ouvre le pas à pas à son étape courante (1, l'échéance), et la liste vit à l'étape 5. Corrigé, comme le demande le complément (« la liste des diapos modifiées s'ouvre ») : si la copie diffère, le pas à pas s'ouvre à l'étape 5.
2. **Un « non » se reposait à chaque réouverture.** **Cause** : la liste est recalculée à chaque rendu du pas à pas. Corrigé : un « non » est gardé pour ce qui a été montré ; seule une nouvelle correction repose la question.

## Ce qui est simulé
Rien de nouveau. La maquette n'a qu'une classe : la copie est rangée par heure, et le vrai site ajoutera la classe en tête de la clé.

## Ce qui reste
- Le récit se fonde sur la trame. Ce que la classe a vu dans sa copie n'y est pas encore repris. Ce n'était pas demandé, je le signale.
- La copie de la classe n'est conservée que le temps de la maquette ; le vrai site l'enregistrera par classe et par heure, avec le journal.
- L'import et son refus : mandat de production.

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `3d8ba32d65dee7b3928f5caadfb14008`
- gabarit `v9c15p8-template.html` : `b1b229d76ff790459d4dbd0cab9bc7bb`
- tous les fichiers livrés : `EMPREINTES.md5`, vérifié par `md5sum -c` avant l'envoi.
