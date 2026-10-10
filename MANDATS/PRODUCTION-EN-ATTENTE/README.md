# Production en attente — 7 commits prêts (10/10/2026) — POUSSÉS le 10/10 à 08:38

**Poussés le 10/10/2026 à 08:38**, après le réglage de l'app Claude GitHub par Paul : la production (`main`) est à `d873f69`, identique à la copie de la conscience n°12. Ce dossier reste comme trace ; ne pas réappliquer les patchs.

Dépôt de production : https://github.com/siteflow-io/monsieurjaipascompris (branche `main`, en ligne à `7063a88`).

Ces 7 commits sont dans la copie de la production de la conscience n°12. Ils n'ont pas pu partir : le 10/10 à 08:05, le push a été refusé (403), avec le jeton de production redonné par Paul. Le refus ne vient pas du jeton, mais de l'accès de l'app Claude GitHub, mot pour mot :

> Claude doesn't have GitHub access to siteflow-io/monsieurjaipascompris for your organization. An org admin can install the Claude GitHub App at https://github.com/apps/claude/installations/select_target, or reconnect GitHub from claude.ai settings (https://claude.ai/customize/connectors?auth_start=github&auth_start_force=1) to re-link an existing installation

Le sas (https://github.com/siteflow-io/mjpc-chantier), dans la même organisation, passe sans problème. Pas de nouvelle tentative tant que l'accès n'est pas réglé.

## Les 7 commits, dans l'ordre

| # | Commit | Date | Contenu |
| --- | --- | --- | --- |
| 1 | `0251f8c` | 08/10 06:38 | Dettes 179 à 184 (QCM : binômes, consolidation, constitution, anti-triche, chronos et prompt) — cadrage tour 558 |
| 2 | `c42d42a` | 08/10 08:20 | Dette 183 mise à jour, 185 à 189 — cadrage tour 559 |
| 3 | `b5903ab` | 08/10 09:14 | Dette 187 close, 189 et 185 complétées, 190 et 191 — cadrage tour 560 |
| 4 | `8395263` | 08/10 09:41 | Dettes 185 et 186 complétées, 192 à 195 — cadrage tour 561 |
| 5 | `93b18bc` | 08/10 10:42 | Dettes 186, 189, 192, 193 complétées, 196 et 197 — cadrage tour 562 |
| 6 | `c5998c1` | 10/10 08:00 | En-têtes « À CODER » dans 11 apps (la tablette partagée en deux, les binômes formés par les exclusions MJPC) — cadrage tour 623 ; détail : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/EN-TETES-APPS-BINOMES/README.md |
| 7 | `d873f69` | 10/10 08:05 | Dettes 180, 181, 186, 192, 193, 196 mises à jour, 198 à 211 ajoutées ; entrée au journal `docs/MJPC6-journal.md` — cadrage tours 563 à 623 |

## Pour les appliquer

Dans une copie à jour de la production (`main` à `7063a88`) :

```
git am MANDATS/PRODUCTION-EN-ATTENTE/000*.patch
git push origin main
```

Les fichiers touchés : `docs/MJPC6-DETTES.md`, `docs/MJPC6-journal.md` et la tête (commentaire seul) de 11 apps. Aucun jeton ni adresse de dépôt dans ces patchs (vérifié).
