# M-PROMPT-ARCHIVES-2 — la liste des archives, et deux constats
**04/08 · exécutant → conscience n°4**

## 1. Base
Repris au sas : **722 848 o · `4ff12f6a1150053a20b75eb885aae609` · 8.25.0** → **livré 728 247 o · `5c2d4b6fb7e9d007481fd35dd0887c54` · 8.26.0 · parse VERT**.

## 2. ⚠ ② LE DÉFAUT N'EXISTE PAS — ma mesure fait foi, et elle me contredit
J'avais rapporté « le champ est vide sur `atIARendre` » et proposé une hypothèse. **Mesurée, elle est fausse** : `atIAOuvrir` attend bien `atIAChargerPrompt(function(){atIARendre();})`, comme `chOuvrir` et `diapoOuvrir`.
**Diagnostic direct au navigateur** : `AT_IA.produit='fiche_seance'`, `atPromptTexte()` = **17 761 c.**, `atPromptComplet()` = **17 761 c.**, **champ après `atIAOuvrir` = 17 761 c.**
**LA CAUSE ÉTAIT MON BANC** : j'appelais `atIAOuvrir()` **dans le même `evaluate`** que `atelierOuvrir()` et `atNouvelleFeuille()` — l'écran n'était pas prêt, le champ était lu avant d'être rempli. En séparant les passes, **le champ affiche 18 007 c.** et le verdict passe au vert.
**Rien n'était à corriger dans le produit. Le défaut était dans l'instrument de mesure** — je l'ai écrit dans le banc, à l'endroit exact, pour que personne ne le refasse.

## 3. ⑤ LA LISTE DES ARCHIVES — codée, branchée, NON PROUVÉE À L'ÉCRAN
**Livré** : `atArchivesOuvrir/Rendre/Cocher`, `atArchiveRelire`, `atArchiveRestaurer`, `atArchivesComparer`, plus le CSS (liste défilante `max-height:46vh`, cibles ≥ 44 px, empilement à 390 px). Branché dans « Retravailler le prompt… » (`at-arch-zone`, 3 occurrences), parse **VERT**.
**Les trois gestes sont là** : **relire** · **restaurer** — qui **archive l'état actuel AVANT de le remplacer**, par le même `atArchiverPuisEcrire` que l'enregistrement, avec le même abandon si l'archive échoue · **comparer** deux archives **par le même `atDiffHtml`** qu'à l'enregistrement (une seconde implémentation aurait divergé de la première).
**⚠ MAIS LES TROIS VERDICTS D'ÉCRAN SONT ROUGES** : la liste rend **0 version** alors que mon hub simulé porte deux archives sous `/site/atelier/prompts_archives/fiche_seance`. **Je n'ai pas identifié la cause** avant d'épuiser le temps de ce passage. `_siteGet` compose `FIREBASE_BASE + chemin + '.json'` et mon interception décode le `pathname` — la piste la plus probable est un **écart d'un caractère entre la clé que je pose dans le hub simulé et celle que l'app demande** (double barre, ou préfixe de `FIREBASE_BASE`). **C'est déclaré non résolu, pas écarté** : le code est peut-être juste et le banc faux, comme au §2 — mais **je ne l'ai pas prouvé, donc je ne l'affirme pas.**

## 4. ③ L'overlay des manifestes, neutralisé
Les fiches du hub simulé portent désormais **le socle courant** (`1.6.0`) et une date récente : **aucun overlay ne masque plus les captures**. C'était la cause du masquage signalé.

## 5. Ce qui est prouvé — 8/11
| verdict | |
|---|---|
| ② le champ montre **18 007 c.**, aucun repère `@@`, MJPC présent | ✓ |
| le bouton « Enregistrer » **grisé au départ** | ✓ |
| ① **chapitre** 8 040 c. · **diaporama** 6 754 c., trois actions | ✓ |
| ④ le différentiel, la zone critique nommée, « ce n'est pas un refus » | ✓ |
| ③ **l'archive part AVANT** l'écriture (arch@0 < prompt@1) | ✓ |
| **390 px** : zéro débordement, trois actions ≥ 44 px | ✓ |
| journal : aucune écriture hors `/site/atelier` | ✓ |
| ⑤ liste · comparaison · restauration à l'écran | **✗ non prouvés** |
**Captures livrées** : `arc2-1-liste-archives.png`, `arc2-2-comparaison.png`, `arc2-3-restauration.png` (elles montrent l'écran **sans** les archives — je les livre telles quelles plutôt que de laisser croire qu'elles prouvent ce qu'elles ne prouvent pas), `arc2-4-390px.png`, et les captures du premier passage avec overlay neutralisé.

## 6. DÉCLARATION DE COUVERTURE
**Testé** : les 8 verdicts verts ci-dessus, le diagnostic du §2, le parse, le journal réseau.
**NON PROUVÉ** : la liste des archives, la comparaison et la restauration **à l'écran** (§3) — les fonctions sont prouvées en mémoire au morceau précédent (16/16), l'interface non.
**NON TESTÉ** : le hub réel · un vrai téléphone · une vraie IA.
**Ce que cela veut dire pour la promotion** : le point ② est clos (rien à corriger), l'overlay est neutralisé, mais **⑤ n'est pas démontré** et le morceau ne doit pas être promu comme si l'écran des archives avait été vu fonctionner.
