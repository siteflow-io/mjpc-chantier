# DICTÉE — L15.1a — L'ANALYSE DES ERREURS, À BLANC (le rapport ; rien n'est changé)

*Exécutant du complément L15, livraison **L15.1a** (dette n°12 · 107 ; C12 tours 469 → 479). **Rien n'est changé dans l'app ni au hub** : c'est le rapport que Paul relit ce soir ; L15.1b-1 (la dictée) code ce qu'il valide, demain matin au plus tôt.*

## Ce que ça change pour la classe (quand L15.1b sera là)
Le commentaire sous chaque erreur se déduira **de l'écart entre ce que l'élève a écrit et le mot attendu** (plus du mot seul) : « Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». » — jamais une règle inventée : un écart non reconnu, ou reconnu mais d'une famille qui ne va pas avec le type posé, reçoit **le commentaire honnête** (« Compare lettre à lettre avec le mot juste : « abri ». ») ; côté élève, la catégorie de repli s'appellera **« autre »**.

## Le moteur (joint : `analyse_l151.js`, tel qu'il entrera dans l'app)
- **Un moteur générique et ses types de motif** (les seuls « en dur ») : `casse`, `tiret`, `collage`, `apostrophe`, `chiffre`, `cedille`, `homophone`, `accent`, `double`, `suffixe`, `terminaisons`, `lettre`, `inversion`, `omise`, `ajoutee`, `changee`, `regex` (+ `sauf`, pour écarter des mots).
- **38 catégories livrées, des objets** (`id`, `nom`, `famille` — accords | conjugaison | homophones | lexique | mots —, `competence`, `motifs`, `commentaire` avec {forme} {mot} {lettre} {accent} {ecrit} {attendu} {regle}, `exemples`, `actif`, `origine: "livré"`, `version`) — elles iront au hub (`site/analyses/categories/<id>`) et dans le seed embarqué ; **l'ordre = la priorité**.
- **Deux écarts à la fois** : le moteur retire d'abord un écart de lettre (accent, consonne double, casse, tiret) puis cherche le reste ; le commentaire **nomme les deux** (« attention à la consonne double, et à un -nt en trop »).
- **Jamais hors sujet** : la catégorie retenue est **la première qui convient au type posé** (G : accords, conjugaison, homophones ; L : lexique, mots, homophones ; C : mots, lexique) ; sinon, le commentaire honnête.
- **La table des homophones existante** (56 groupes du code) est reprise telle quelle, toutes familles confondues (un mot peut être dans plusieurs) ; **une paire ajoutée** au vu des copies : ce / ceux.
- **« Mot long » = trois syllabes ou plus** (jamais un nombre de lettres) ; **`syllabes(mot, {vers:false})`**, la césure de la langue parlée : une consonne entre deux voyelles part avec la suivante ; deux se séparent sauf les groupes indissociables ; trois ou plus : avant la dernière, ou avant le groupe (ins·truire, comp·ter) ; voyelles composées et i + voyelle (le yod) ensemble ; ge / ce devant a, o, u comptent pour une consonne (chan·geantes) ; **le -e muet final (et -es, -ent verbal) ne fait pas de syllabe** (belle = 1, char·mante, lec·ture) ; l'élision ne fait pas de syllabe (d'eux, l'autre = 1) ; `vers: true` réservé aux apps de poésie.

## Les taux (les erreurs G, L, C recopiées — elles seules ont un écart)
```
3E Dylan | erreurs G/L/C 231 | recopiées 231 | reconnues 217 (94 %) | honnêtes (autre) 14 dont type incompatible 3
3E Franklin | erreurs G/L/C 229 | recopiées 229 | reconnues 215 (94 %) | honnêtes (autre) 14 dont type incompatible 2
4E Hugo | erreurs G/L/C 419 | recopiées 419 | reconnues 380 (91 %) | honnêtes (autre) 39 dont type incompatible 5
4E Turing | erreurs G/L/C 528 | recopiées 528 | reconnues 480 (91 %) | honnêtes (autre) 48 dont type incompatible 7
```
- Les « 514 erreurs des 3E » du complément = 254 (Dylan) + 260 (Franklin), tous types ; **460 sont des G/L/C recopiées**.
- Première mesure, avant les catégories ajoutées au vu des « autre » : 83 à 88 % ; **après** : 91 à 94 %. Ce qui reste en « autre » (tableau 3 du rapport) : des formes très éloignées (« ures » pour « eurent », « neuvent » pour « neuves »…) — le commentaire honnête y est le bon.
- **Catégories ajoutées au vu des copies** (la liste anticipée du complément, complétée) : l'élision, le féminin pluriel (-es) manquant / en trop, la personne du verbe (-s / -x / -t), le son [k] (c / qu / k), -s / -x muets (lexique) ; et l'exclusion des infinitifs en -re du « féminin manquant » (« boir » pour « boire » n'est pas un féminin).

## Le rapport (joint : `RAPPORT-A-BLANC-L15.1a.md`, 1 733 lignes)
1. **Les taux**, dictée par dictée. 2. **Les 38 catégories** : famille, compétence proposée, nombre d'erreurs, **le commentaire proposé — à réécrire dans tes mots**, un exemple. 3. **Ce qui reste en « autre »**, trié. 4. **Une ligne par erreur** (dictée, copie n°, type, forme → mot, catégorie(s), commentaire, mot long) — **raye les hors sujet**. 5. **La césure de 150 mots** des dictées — **corrige** ce qui est mal coupé (la fonction devra donner 100 % de ta liste).

## Ce que L15.1b-1 fera (demain), dans l'esprit de la doctrine (taxonomie, Principes 1, 9, 10)
Les catégories et les homophones **au hub, un seul lieu pour toutes les dictées** (+ seed) ; l'analyse à la correction (`categorie` sur l'erreur et l'objet forme de L10, recalculée quand les catégories changent, compté) ; les trois lecteurs du commentaire (la copie rendue, le bilan de fin, l'écran d'autocorrection) ; Réglages = la fenêtre sur ce lieu unique (les commentaires, ajouter une paire d'homophones), le bouton « 🤖 Prompt IA — catégories (JSON) », Vérifier, Injecter avec archive ; les alias proposés écrits dans `/taxonomie/alias/tables/correction_dictee` en statut `propose` ; le lien vers le Panneau prof → Correspondances ; **l'événement du profil branché** (`/profil/<clé>/events/<horodatage>`, `notion_ids` / `notions_proposees`, idempotent) ; au Bilan, les non-reconnus (cette dictée / toutes). **L15.1b-2** : l'onglet « Correspondances » de l'éditeur de taxonomie. **Avant tout code de L15.1b, je lis l'avertissement du plan de travail et la section D de la doctrine**, comme le demande le complément.

## Les fichiers joints
`RAPPORT-A-BLANC-L15.1a.md` (le rapport) ; `analyse_l151.js` (le moteur, les catégories, la césure) ; `homophones_existants.json` (la table du code + ce/ceux) ; `rapport_l151a.js`, `rapport_md.js` (le calcul et la mise en forme, rejouables).
