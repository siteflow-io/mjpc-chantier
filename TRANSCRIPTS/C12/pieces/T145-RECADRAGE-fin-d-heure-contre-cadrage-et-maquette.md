# RECADRAGE — les décisions du 18/09 confrontées au cadrage écrit et à la maquette v9c.13 (avant toute livraison)
*Chaque décision de Paul (tours 143-144) est mise en tension avec les règles déjà écrites (cadrages 1, 2, 4) et avec ce que la maquette fait aujourd'hui. Verdicts : ✔ s'intègre · ⚠ télescope (et la règle qui tranche) · ∅ trou (et ce qu'il faut écrire).*

## 1. La diapo de fin d'heure est une vraie diapo (rôle « fin d'heure », dernière de chaque heure, remplie par l'avancée réelle)
| Contre | Verdict |
|---|---|
| Cadrage 4, 3.2 bis (l'activité est un objet ; la réactivation et le bilan sont des rôles, pas des activités) | ✔ un troisième rôle, « fin d'heure », sans numéro d'activité ; jamais glissé, jamais retiré, jamais mis en réserve (comme le bilan, 9.2) — **à écrire** |
| Cadrage 1, 6.1-6.4 (frontière d'heure dans la trame ; bilan unique à la dernière heure) | ⚠ à la dernière heure il y a deux diapos de rôle à la fin : **le bilan, puis la fin d'heure** (le bilan est une activité de classe, la fin d'heure clôt) — **à écrire** (6.4 bis) |
| Cadrage 1, 6.6 et maquette T139 (l'ordre de l'heure figé au lancement) | ✔ la diapo de fin est la dernière de l'ordre figé ; la reprise fléchée ne la concerne pas |
| Cadrage 1, 7.x et maquette (le T-5 : écran de décision avec les vignettes des activités restantes, décisions par activité) | ⚠ le T-5 n'est plus un écran : **l'alerte non bloquante** (2) + **la diapo de fin** au centre + **la séquence des décisions** dans la colonne de droite ; les cartes par activité restante y restent (7.1-7.4 inchangés) — **à réécrire** 7.0 (le lieu) |
| Cadrage 1, 8.1 (immuable pour la classe qui l'a vu) et maquette (édition d'une diapo au double-clic, journalisée) | ⚠ la diapo de fin est **remplie et modifiée en direct devant la classe** : c'est une exception de rôle — son contenu n'est pas la trame, c'est l'avancée de l'heure ; rien ne se verse dans la trame — **à écrire** (8.1 bis) |
| Cadrage 1, 1.5 (notes, commentaires, gris : jamais au tableau) et 4b.7 (« qui a participé » jamais pendant le gel) | ✔ la participation est un **élément dévoilé** de la diapo (le 4e) : elle part au tableau quand elle est dévoilée, comme tout élément, et le gel la fige comme le reste |
| Cadrage 2, 1.10 (jamais dans le récit : gel, pages, coupures, non montré) | ✔ **et** la diapo de fin elle-même ne se raconte pas (le récit ne dit pas « puis on a regardé le travail à faire ») — **à écrire** |
| Cadrage 2, 3.x (verser, retoucher avant, figer) | ⚠ le récit se modifie **dans la diapo** (figer, puis modifier) : **une seule source** par heure — le récit figé/édité dans la diapo est celui de la relecture, et inversement ; un seul état `figé` — **à écrire** (3.8) |
| Maquette : `finHeure` (rendu à part du mur), `S.enFin`, `#droite-fin`, le voile de l'ouverture | ⚠ tout ce mécanisme disparaît au profit d'une diapo ordinaire de rôle `fin` dans la trame ; l'ouverture (« Où en est la classe ») reste un voile |
| Maquette : la pagination (les réponses longues en pages) | ✔ le récit long de la diapo de fin se pagine par le même mécanisme (les éléments = les paragraphes du récit) |
| Cadrage 4 (le prompt de création de chapitre, le JSON d'injection) | ∅ **trou** : le rôle `fin` doit exister dans le JSON (`role: "fin"`, sans contenu) et le prompt doit le poser en dernière diapo de chaque heure — **à écrire** au cadrage 4 et à la validation à l'import (comme les numéros d'activité) |

## 2. Le T-5 non bloquant (worktrack)
| Contre | Verdict |
|---|---|
| Cadrage 1, 6.3 (« T-5 : décisions »), 6.7 (rattrapage avant lancement) | ⚠ 6.3 devient : **à T-5 une alerte au pilotage, non bloquante ; jamais de bascule du tableau ; la diapo de fin attend** ; 6.7 inchangé (le rattrapage se fait dans la séquence, sans classe) — **à réécrire** |
| Cadrage-temps §2 (worktrack : alerte T-5 non bloquante, réarmée à chaque cours ; quatre états) | ✔ repris tel quel, y compris les quatre états pour l'activité en cours |
| Maquette : `t5()` ouvre l'écran de fin ; ⚙ « faire arriver T-5 » | ⚠ `t5()` = l'alerte seulement ; ⚙ reste (simulation) |

## 3. Le récit en trois temps calés sur l'horaire
| Contre | Verdict |
|---|---|
| Cadrage 2, 1.2 (un paragraphe par activité) | ⚠ **les trois temps regroupent les activités par l'heure où elles ont commencé** ; dans chaque temps, un paragraphe par activité ; une activité qui se poursuit dans le temps suivant y est reprise par « on a continué… » — **à écrire** (1.2 ter) |
| Cadrage 2, 1.2 (heure 2 : « on a repris l'activité n là où on s'était arrêté ») | ✔ « Au début de l'heure, on a repris l'activité 1… » |
| Cadrage 1, 1.3 bis (le temps mis à part) | ✔ les temps du récit se calculent sur l'horaire **hors temps mis à part** — **à écrire** |
| Maquette : `recitHtml` (paragraphes par activité, connecteurs de l'ancien) | ⚠ une passe de regroupement avant les connecteurs ; le verdict « terminé / pas terminé / tout juste commencée » sur l'activité en cours à T-5 (1 à 5 min → « tout juste commencée ») — **à écrire** (1.2 quater) |

## 4. Les durées par activité, modifiables en direct, avec les états de worktrack
| Contre | Verdict |
|---|---|
| Cadrage 1, 5.x « Où on en est » (prévu / utile, dépasse) | ✔ l'en-tête reste ; la liste des durées vient dessous ; **la règle « tout dans le même écran sans défilement »** : une ligne par activité — au-delà de ce qui tient, la colonne s'élargit d'une poignée avant de défiler — **à écrire** |
| Cadrage 4 (la durée prévue se pose en préparation) et 8.1 (immuabilité) | ⚠ **une durée changée en classe vaut pour cette classe** (la copie), pas pour la trame ; à la clôture, la question « verser ? » s'applique aussi aux durées (8.4) — **à écrire** |
| L'ancien (`#durees`, `horaires()`, `ecranDuMoment()`, `.dur.retard`) | ✔ repris par activité, avec les quatre états de worktrack au lieu du seul « retard » |
| Maquette : `e.dur` par diapo, `HEURES_SIM`, `ouOnEnEst()` | ⚠ la durée devient par activité (somme de ses diapos, modifiable) ; l'heure prévue cumulée depuis le début de l'heure |

## 5. Le travail à faire
| Contre | Verdict |
|---|---|
| Cadrage 2, 1.6-1.6 quater (le travail clôt le récit ; contenu entier ; titre seul pour le reporté ; échéance) | ✔ inchangé ; la diapo de fin le montre |
| « Déjà donné pour cette échéance » | ∅ **trou** : la copie de classe au hub porte les travaux par échéance ; **le site ne lit pas l'agenda École Directe** (les collègues) — « déjà donné » = déjà donné par Paul, pour cette classe — **à écrire** (2 · 1.6 quinquies) ; simulé dans la maquette |
| Les cases (notions, trame, décisions) → le tableau à la lettre | ✔ (maquette : `texteTravail()` déjà recomposé à chaque case ; il suffit que la diapo se re-rende) |
| Le champ École Directe à part | ⚠ **supprimé** : la diapo est le champ ; `S.travailEdite` reste l'état |

## 6. La colonne de droite en fin d'heure : la séquence
| Contre | Verdict |
|---|---|
| Cadrage 1, 7.x (les décisions au T-5) | ✔ mêmes décisions, dans l'ordre 1 échéance → 2 ce qui reste et les notions → 3 avant de clore → 4 Clore ; les flèches de dévoilement entre les sections ; une section faite se replie sur une ligne-résumé — **à écrire** (7.0) |
| Cadrage 1, 6.7 (rattrapage) | ✔ la séquence s'ouvre avant le lancement de l'heure suivante si l'heure n'a pas été close |
| Maquette : `ouvrirFin(cloture)` — un seul écran pour T-5 et clôture | ⚠ un seul mécanisme aussi : la séquence, ouverte par l'alerte, par « Fin de l'heure », ou par le rattrapage |

## 7. La participation : un bouton, Maj + P
| Contre | Verdict |
|---|---|
| Cadrage 1, 4b.7 et 12 (« qui a participé » au tableau, jamais pendant le gel ; les outils) | ✔ un bouton dans la barre d'outils, bascule affiche / retire, **Maj + P** (aucun raccourci existant sur P ; Win+P est une touche Windows différente ; dans un champ, Maj+P écrit un P) — **à écrire** (12) |

## 8. Renvoyé au mandat (sur le mot de Paul)
- Modifier les diapos pendant l'heure et verser dans la trame (8.1-8.4) : la maquette garde le geste (double-clic, la question à la clôture) ; le mécanisme au branchement.

## Ce qui est à écrire avant de coder (sur validation de Paul) — dans l'ordre
Cadrage 4 : le rôle « fin d'heure » (JSON, prompt, validation à l'import) · Cadrage 1 : 6.3 (alerte), 6.4 bis (bilan puis fin d'heure), 7.0 (le lieu des décisions : la séquence), 8.1 bis (la diapo de fin, exception), 5.4 bis (la liste des durées, la règle sans défilement), 12 (Maj + P) · Cadrage 2 : 1.2 ter (trois temps), 1.2 quater (le verdict), 1.6 quinquies (déjà donné), 3.8 (une seule source pour le récit figé), 1.10 (la diapo de fin ne se raconte pas).
