# MANDAT V6 — « ▶ REPRENDRE L'HEURE » PENDANT LA SÉANCE ENCHAÎNÉE · suite de `447fd83f5`

## 0 · Les erreurs du mandat
1. Pas d'erreur sur la cause : la supposition (§1.2) est la bonne, mesurée par le geste. Une précision : la reprise ne s'ouvrait pas « sur la séance 1 » ; elle s'arrêtait net. `edtCheminTrace` rend la trace de la séance 1 (close), et `dr_edtReprendre` répond « Cette heure a été close : elle ne se reprend pas. » (message au pilote, compté 1 fois). Rien ne s'ouvrait.
2. Les 2 erreurs « reading 'ecrans' » ne viennent pas de la reprise. Pile (`MJPC_PILE=6`) : `ecran` (l. 17999) ← `devoiler` (l. 18551) ← la sonde, qui clique « dévoiler » sur un pilote vide (partie 4). C'est une conséquence.

## 1 · Ce qui est fait et prouvé (par le geste, faux hub du banc)
- **La correction** (`dr/dr-classe.js`, `dr_edtReprendre`, 1 ligne) : quand le créneau porte plusieurs traces (`edtSeancesDeTrace`, triées par début), la reprise prend la dernière qui n'est pas close, donc l'heure qui tourne. Avec une seule trace, rien ne change.
- **Vraie heure, `MJPC_ROUV=1`** : avant, 23/34 (`sorties/v6-rouv-vh-avant.txt`, diagnostic `v6-rouv-vh-avant-diag.txt`) ; après, **34/34** (`sorties/v6-rouv-vh-apres.txt`). Ce qui est vérifié : la séance 2 reprise sur la même trace et la même diapo (inv-plan-s1), compteur « 1 / 9 dévoilés » ; les deux réponses tapées présentes ; l'horloge de la case continue (08:57:41 → 08:58:13, le même décalage, -189 s) ; le tableau reste sur la séance 2, sans écran d'attente ; la séance 1 reste close et intacte ; « Relire cette heure » montre le récit de la séance 1 puis celui de la séance 2 ; aucune erreur de page.
- **Comparaison avec une heure ordinaire** (§1.1, `LOT2C/sonde-lot2c.mjs`, partie M, M4 : une heure laissée pas close, reprise le lendemain par « ▶ Reprendre l'heure ») : base `46ce703a1` → après, **23/23 lignes identiques** (`sorties/v6-ord-reprendre-base-46ce703a1.txt`, `v6-ord-reprendre-apres.txt`). M4a, M4b et M9 sont ok des deux côtés. L'heure ordinaire se reprend : le défaut venait donc de l'enchaînement. Les 6 échecs (M1b, M2a, M5a/b, M6a/b) sont les mêmes des deux côtés. Ils portent sur l'horloge et le T-5, et cette ancienne sonde n'a pas été remise à jour : ce n'est pas la reprise.
- Sonde : le bloc R écrit la pile des erreurs de la page rouverte (`MJPC_PILE`) ; avec `MJPC_DIAG`, il écrit aussi la trace que rend `edtCheminTrace` et les messages au pilote.
- Assemblé : `86e8a269cf1b57b04e2e436f9cc6caa5` (avant : `f1840ad7`).

- **Rejoué sur l'assemblé `86e8a269`** : la sonde une heure, vraie heure **27/27** (`sorties/v6-vh-une-heure.txt`), mode test **29/29** (`v6-test-une-heure.txt`) ; le parcours P0-P12 **vert**, 30 contrôles, 0 échec (`v6-parcours.txt`).

## 2 · Ce qui reste (30 minutes atteintes)
- Pas rejoués sur `86e8a269` : deux heures (`MJPC_DEUX`), répétition, témoin, T-5 (`MJPC_T5`). La correction ne touche que « ▶ Reprendre l'heure » depuis la case, quand le créneau porte plusieurs traces.
- Le mode test : pas touché (NOTE-V5 §0.1, décision de Paul).
