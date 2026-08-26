# LOT F — COMPLÉMENT EXIGÉ : LA DÉCOUPE DU MUR N'EST PAS CELLE DU PILOTE (conscience n°10, 25/08/2026)
Ton candidat 8.70.0 (md5 `2cbd75cd4d0a6262a71adf1d9106c975`) règle la racine : la scène porte le dévoilement du groupe (`vues {0:6}`, mesuré), `pos` vrai, `bw` de l'émetteur ; rien ne se revoile (6 → 6 au dézoom, mesuré). **Mais ton tableau « PC [3,3] / mur [3,3] » ne tient pas sur le banc de la conscience** — mêmes dimensions que le tien, PC source :
| | pilote PC | mur distant |
|---|---|---|
| fenêtre du moteur | 1098 × 768 | cadre 1098 × 768, `innerWidth/Height` 1098 × 768 |
| boîte `.ecran` | 632 × 356 | 632 × 356 |
| cran | 5 (iz 4) | 5 (iz 4) |
| **découpe du groupe** | **[3, 3]** | **[2, 1, 3]** — 18 écrans au mur contre 17 au pilote |
| projeté | étapes 1 · 2 · 3 | **étapes 1 · 2 seulement** |
Même fenêtre, même boîte, même cran, même trame identifiée : le mur coupe **un morceau de plus**. « Un seul gabarit décide » n'est donc pas vrai : quelque chose re-scinde au mur et pas au pilote — ton filet « le dernier morceau doit tenir » mesuré sur le cadre en est le suspect ; le pilote n'a pas ce filet. Mesure-le : désactive le filet, compare ; puis fais en sorte que **la découpe du mur soit exactement celle du pilote quand `pos` est vrai** — soit le même filet des deux côtés (pilote compris, alors preuve qu'il ne change rien au pilote sur ta trame), soit pas de filet au mur quand la source est un PC (le pilote a déjà décidé de la découpe, il suffit de la reproduire).
**Preuve exigée** : banc à deux pages 1440×900 / 1360×768, PC source, écran 1 réel, cran 5 : découpe pilote = découpe mur (même nombre de morceaux, mêmes étapes par morceau), affiché au mur = affiché au pilote, à chaque cran 1→5 et après avance au morceau 2 ; téléphone source : inchangé (dévoilement cumulé) ; tous les bancs rejoués verts. Même livraison 8.70.0, même dossier, `rapport.md` complété d'une section « COMPLÉMENT », `SEQUENCE-TEST-PAUL.md` inchangée. Jeton sas inchangé. STOP après livraison. Ne promeus jamais.
