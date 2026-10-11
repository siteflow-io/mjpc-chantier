# Audit final — le complément 1 de la maquette complète du QCM (10/10/2026, conscience n°12)

Branche auditée : `maquette-qcm` du sas (commit `5d1c204d`, 10/10 14:45 UTC). Complément : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md. Livraison : `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v6.html` (md5 `60778845d3ccf68e0b4fdd4a9ce7db30`, vérifié), 166 scènes.

## Verdict : ça ne va pas encore, pour un seul défaut

Les six défauts du complément sont corrigés, et cela a été vérifié ici par des relevés indépendants du banc de l'exécutant. Son banc, rejoué ici, passe : **18 245 vérifications, 0 échec** (`sorties/banc-audit-v6.txt`). Il reste un défaut que ce banc ne voit pas (ci-dessous).

## Ce qui a été vérifié

- **Le périmètre.** La branche n'écrit que dans `MANDATS/MAQUETTE-QCM-COMPLETE/`, hors la fusion de `main`. Les v1 à v5 sont intactes.
- **Le méta** (`scripts/meta-cadres.js`, cadres compris ; sortie `sorties/meta-cadres-v6.txt`). Aucun renvoi au cadrage ne reste. Les seules lignes relevées sont de faux positifs (« Proposition Principale », « Binômes proposés », « 👥 Classe (25) ») et le sommaire ⚙, qui est permis.
- **Les soulignés de proposition** (`scripts/soulignes.js`) : 0 sur les 166 scènes. Le PDF n'a plus l'encadré de validation (capture 142 regardée).
- **MJPC**, comparé à `index.html` de la production (md5 `ac792b28…`) :
  - « Élèves & codes » a l'encart de la clé, l'import du fichier, la barre des classes, « + Importer / compléter », la barre d'outils, et chaque ligne avec son nom vers la fiche, son ◆, son code, ↻ et ✕ ; « 🚫 Jamais avec… » est juste après le ◆ ;
  - la fiche de l'élève a ses cases PAP, sa synthèse, « Enregistrer la fiche » et « Fermer » ;
  - la Taxonomie affiche « Version 1.4.0 · 2026-08-02 · 7 domaines · 210 notions ». Les comptes par domaine (51 familles, 210 notions) et les 28 compétences en 8 groupes ont été recomptés contre `taxonomie_atelier.json` ;
  - les textes repris, comme « (élève : … ) » et « Une notion ne se supprime jamais… », ont été retrouvés aux lignes citées d'`index.html` ;
  - captures 153, 155, 157 et 161 regardées.
- **« 👀 Écoute le prof — la correction sera révélée. »** est rétablie (capture 75). « ✅ Réponse enregistrée — tu peux encore la changer » est bien au point 526.
- **L'estimation.** Le bloc de Michel dit « Tu as nettement surestimé ce que tu avais réussi. », comme son bilan général (capture 117).
- **Les limites** (`mesures/limites.json`) : elles ne croissent jamais avec le nombre de choix ni avec l'énoncé, et l'étalon est à 67 px. La question 3 de 3e dépasse la limite (137 caractères pour 70), et le README le dit.
- **Les retraits** (`banc/existant/retraits.json`, 107) : une cinquantaine relus contre leur citation. Tous sont justifiés par le point cité.
- **Réglages et prompt.** Il n'y a plus de renvoi, et les gestes de la 7.7.1 sont revenus (captures 150 et 151).

## Le défaut

**7. Les boutons « grisés » de MJPC ne se voient pas grisés** (protocole §2 : « un bouton fait ce qu'il dit, ou il est grisé avec la raison. Un bouton mort qui passe pour vrai est un faux vert »).

Cela touche 9 scènes `m-…`. Les 12 entrées du menu sans scène et « Code professeur » ont l'attribut `disabled` et l'infobulle « Inchangé : cet écran reste celui d'aujourd'hui. ». Mais :
- leur opacité est à 1 ;
- leur couleur est celle de « 📚 Taxonomie », qui marche (`rgba(255, 255, 255, 0.7)`), et « Code professeur » est blanc comme « Oublier la clé sur cet appareil » ;
- le curseur est la main (`pointer`).

Sur les captures, rien ne distingue une entrée qui marche d'une entrée fermée (`sorties/menu-mjpc.txt`, `sorties/grises-v6.txt`). La vérification 5 du banc tient un bouton pour grisé dès qu'il est `disabled` (`banc/controles.js`, l. 219 et 234), sans regarder son aspect.

`index.html` a déjà la forme d'un bouton fermé : `.eli-btn:disabled{opacity:.45;cursor:not-allowed}`.

Les autres boutons fermés relevés (`sorties/grises-v6.txt`) sont des états validés côté élève : le clic figé de B (captures 610) et les cartes de « Mes évaluations » en relecture. Ce ne sont pas des défauts.

## La garde qui manquait

Dans une vue de Paul (console, téléphone, MJPC), un bouton fermé se voit fermé :
- une opacité effective de 0,6 au plus, ou une couleur différente de celle d'un bouton actif de même classe ;
- un curseur qui n'est pas la main ;
- sa raison lisible au survol.
