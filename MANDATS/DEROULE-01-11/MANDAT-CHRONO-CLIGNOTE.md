# MANDAT — LE CHRONO CLIGNOTE EN ROUGE, COMME AVANT (C16 696)
*Conscience n°16, 04/11/2026 (lancé à 21:48). L'ordre : Paul, 04/11 21:47 : « il faut garder le clignotement ». Un seul exécutant, neuf, très court : 15 minutes au plus.*

## 1 · CE QUE TU FAIS (ce point seulement)
Le rectangle du chrono v3 (sas `maquette/minuteur-v3` `30a9b4652`) clignote quand il est rouge et court, comme l'ancien chrono, au tableau, dans « Ce que voit la classe » et sur la diapo du pilote. Rien d'autre.

## 2 · LA SUPPOSITION (À VÉRIFIER)
L'ancien : `'#ses-tab .dr-tab-minut.m-rouge.m-court{animation:drMinutClig 1s steps(1,end) infinite'` et `@keyframes drMinutClig{50%{opacity:.25}}` (dr-tableau.js / dr.css de la production 8.84.0) ; le v3 a mis `animation: none` sur le rectangle (l'exécutant de `banc/chrono-v3` `bc38d53fb` l'a relevé).

## 3 · LA PREUVE (ciblée)
La sonde de la ⑩ au v3 (`banc/chrono-v3` `bc38d53fb`, `LIVRAISONS/INTEGRATION/EX/bancs/sonde-10.mjs`), à la vraie horloge (`MJPC_HORLOGE=date`) : verte, et le clignotement relevé au rouge (au tableau) ; le banc de la frappe et celui de la maquette (`MAQUETTE-MINUTEUR/banc-frappe-v3.mjs`, `banc-maquette-v2.mjs` sur la maquette régénérée) : verts.

## 4 · LES RÈGLES
- Ton dossier : `git worktree add -b chrono/clignote <dossier> 30a9b4652`, puis `git checkout bc38d53fb -- LIVRAISONS/INTEGRATION/EX/bancs/sonde-10.mjs` (jamais la sonde-10 du candidat) ; tu pousses sur `chrono/clignote` seulement.
- **15 minutes au plus**. **Économe**. Ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `dr_classe`. Aucun vrai nom d'élève.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = tu attends (la conscience fait tourner un banc jusque vers 22:06) ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`), avec le commit et le md5 de l'assemblé.
