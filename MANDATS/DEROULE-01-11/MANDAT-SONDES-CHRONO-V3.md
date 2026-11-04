# MANDAT — DEUX SONDES DU BANC À METTRE AU CHRONO v3 (C16 689)
*Conscience n°16, 04/11/2026 (lancé à 21:29). Suite de `MANDAT-MINUTEUR-BANC.md` (l'exécutant, `e0d281387` sur `chrono/integration`, `LIVRAISONS/DEROULE-01-11/MINUTEUR-BANC/`) : les trois rouges du banc ne viennent pas du code du lot ; deux sondes lisent l'ancien écran, que Paul a voulu changer (le chrono P6, « Ce que voit la classe » = le tableau : Paul, 18:45 à 19:47). Un seul exécutant, neuf, court. Tu ne changes aucune ligne du site.*

## 1 · CE QUE TU FAIS
1. **La sonde de la ⑩** (`LIVRAISONS/INTEGRATION/EX/bancs/sonde-10.mjs`, branche `banc/vraie-horloge` `0ff3d8ffd`) : sa partie A4 (le minuteur) et ce qu'elle appelle (`minuteurBase`, la pause l. 257 environ) au chrono v3, sans rien perdre de ce qu'elle prouvait : la durée réglée par le geste v3 (un clic sur un chiffre, les chiffres au clavier ; la preuve de l'exécutant : `MINUTEUR-BANC/preuve-sonde-10-geste-v3.mjs`) ; « au tableau » allumé : la durée paraît, immobile, avant ▶ ; ▶ : il court au tableau distant (mesuré en ms) ; les crans du v3 (vert plus de la moitié, jaune jusqu'au quart, orange jusqu'au dixième, rouge le dernier dixième ; #4f9d5d, #e0b83a, #e07b2e, #e8484c) ; ⏸ sur `#dr-minut-go`, la reprise ; le rectangle or sur brun dans un coin sans texte ; la fin. Le son de la fin : s'il existe encore dans le v3, tu le gardes ; sinon tu le dis. Puis la suite de la sonde, inchangée.
2. **K11** (`AUDITS/CONTROLES-DEROULE/controles.mjs`, l. 229-236) : tu ne touches pas `AUDITS/` ; tu écris la nouvelle version de K11 dans `LIVRAISONS/DEROULE-01-11/SONDES-CHRONO-V3/K11-cadre.patch` (il lit le compteur et les lignes dans le cadre « Ce que voit la classe » : `pg.frames()` avec `vignette=1`, puis `#mur2`), avec la preuve qu'il passe sur le candidat et qu'il échouerait si le cadre ne montrait pas la même page. La conscience l'appliquera.

## 2 · LA PREUVE
La sonde de la ⑩ entière, sur le candidat (`chrono/integration` = `30a9b4652` + preuves, assemblé `c781672e`) : verte, comptée, à la vraie horloge (`MJPC_HORLOGE=date`, comme le banc). K11 patché, joué sur le candidat : vert.

## 3 · LES RÈGLES
- Ton dossier : `git worktree add -b banc/chrono-v3 <dossier> 0ff3d8ffd` ; tu y prends le site du candidat (`git checkout 30a9b4652 -- LIVRAISONS/INTEGRATION/`) seulement pour l'assembler et jouer, sans le committer ; tu pousses sur `banc/chrono-v3` seulement : `sonde-10.mjs` et `LIVRAISONS/DEROULE-01-11/SONDES-CHRONO-V3/` (le patch de K11, les preuves, les sorties).
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début). **Économe**.
- Tu ne touches ni `AUDITS/`, ni le site, ni `APP_VERSION`, ni la production, ni le vrai hub. Aucun vrai nom d'élève.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`).
