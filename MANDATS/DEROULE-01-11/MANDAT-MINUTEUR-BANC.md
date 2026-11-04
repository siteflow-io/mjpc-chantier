# MANDAT — LE BANC DU CHRONO EST ROUGE : TROIS CAUSES À TROUVER ET RÉGLER (C16 687)
*Conscience n°16, 04/11/2026 (lancé à 21:05). L'ordre : Paul, 04/11 19:01 : « les seules choses qui seront donc intégrées dans le push une fois la maquette validée, ce sera le chrono et "ce que voit la classe" » ; 19:47 : « ok ça m'a l'air correct ». Aucune promotion sur un banc rouge. Un seul exécutant, neuf, court.*

## 0 · CE QUI EST MESURÉ (le banc de la conscience, sans le témoin, 20:02 → 21:04, sur `maquette/minuteur-v3` `30a9b4652`, assemblé `c781672e` ; sorties : `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/banc-chrono/`)
Vert : appel 147/0, fin d'heure 56/0, frappe 14/0, parcours ×2, Atelier 53/53, §12.66 27/0, bloc question 33, ouverture 126/0, fil 100/0, retour sûr 61/0, R 6 × 8/0. Rouge :
1. **K11** (`controles.txt`, l. 104-106) : « à 0 dévoilé : la vue dit « page 1 / 2 », comme le mur — vue « » » ; « ▶ jusqu'à la page 2 : la vue dit « page 2 / 2 » et montre les mêmes lignes que le mur — vue « » ».
2. **La sonde de la ⑩** (`banc.sh`, étape 8) : elle s'arrête sur une erreur de Node, sans bilan.
3. **La sonde des sessions** (étape 14, `etape14-console.txt`) : « ÉCHEC H · le dévoilement de l'ordinateur : chez les trois pilotes (la diapo, le dévoilement) », puis l'arrêt : « elementHandle.click: Element is not attached to the DOM » (`sonde-session.mjs` l. 270).
Sur la production 8.84.0 (`46d140ab6`, banc de 08:38 → 09:42 ce matin), les trois étaient verts.

## 1 · CE QUE TU FAIS
Pour chacune des trois : la cause, mesurée (base 8.84.0 contre le candidat, au même geste) ; si c'est le lot (le chrono, « Ce que voit la classe » devenue la page du tableau dans un cadre, la frappe), tu règles le code du lot et tu le prouves ; si c'est la sonde qui lit l'ancienne vue (« Ce que voit la classe » est maintenant la page du tableau dans un cadre, voulue par Paul), tu le prouves par le geste (ce que montre le cadre) et tu le dis : la conscience adaptera le contrôle ; si c'est un aléa, tu le prouves (plusieurs passages, base et candidat). Rien d'autre.

## 2 · LA SUPPOSITION (À VÉRIFIER)
- 1 : K11 lit le compteur de page et les lignes de l'ancienne vue de droite (`vueDroite`, dr-socle.js) ; la vue est maintenant un cadre (`#vue-mini iframe.dr-vig`, `?vue=tableau&local=1`) : la sonde ne lit plus rien. Ce que le cadre montre lui-même est à mesurer.
- 3 : chacun des trois pilotes de la sonde ouvre aussi une page du tableau dans son cadre ; si ce cadre écoute le hub ou la session, ou répond aux messages, il peut gêner le dévoilement des autres pilotes (et redessiner le pilote, d'où l'élément détaché).
- 2 : je ne sais pas.

## 3 · LES RÈGLES
- Ton dossier : `git worktree add -b chrono/integration <dossier> 30a9b4652` ; tu pousses sur `chrono/integration` seulement. Les sondes du banc viennent de `banc/vraie-horloge` (`0ff3d8ffd`) ; la base : `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/promo-8840/index.html` (la production 8.84.0, md5 `c6b75c7a`).
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est prouvé, tu t'arrêtes et tu dis ce qui reste). **Économe**.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`, ni `dr_classe`. Aucun vrai nom d'élève.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Le disque : propre ; ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`), avec le commit et le md5 de l'assemblé.
