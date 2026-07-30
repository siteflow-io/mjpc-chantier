# M-ÉCHECS-1 — RAPPORT DE LIVRAISON (sas)
30/07/2026 · base 8.6.1 (`ba698e667635164fb855282e844eb2fc`, 492 213 o, re-téléchargée à l'instant de l'édition) → 8.7.0

## Livré
- `index.staging.html` — site v8.7.0, socle MJPC-CORE **1.2.0** embarqué (canon entier : 1.0.0 + §8 session + §9 trois issues — Q1), 52 écritures sous verdict, bandeau unique anti-rafale, textes prof/élève du feu vert.
- `mjpc-core-1.2.0.js` — LE CANON, même livraison (Q2). §9 verbatim identique à l'embarqué.
- `M-ECHECS-1-impact.md` — le relevé : 3 volets, chaque entrée AVANT/APRÈS (complément ②), trois familles d'actions en clôture (complément ③).
- Preuves : `banc-verdicts.json` (21/21), `journal-banc.json`, `impact-refusTout.json`, captures img-01…04.

## Preuves et invariants
- Double parseur : 1 bloc script, 6 styles ouvrants/fermants, node --check + acorn OK.
- Invariants : 477 fonctions communes, **43 modifiées = exactement les 43 du périmètre**, 15 ajoutées (§8×2, §9, section ×12), 0 supprimée, empreintes md5 par fonction.
- Diff : 49 hunks (107−/340+), chaque ligne retirée appartient à l'une des 43 fonctions réécrites (aucun retrait hors périmètre).
- Les trois issues JOUÉES (B/C/D) : succès traversé (200), refus réel (401 CORS-correct, pire cas du cadrage), panne réelle (abort) — états d'écran et état local vérifiés à chaque fois. Complément ① prouvé par mesure : rendu de cascade 4 ms APRÈS le dernier verdict.
- Mode test : cb(true, acceptée), zéro réseau, zéro fausse alerte, même sous refus généralisé (J).
- Mobile 390 px : cibles mesurées ≥ 44 px, zéro débordement (L1/L2).
- Élève : panne → texte impersonnel sans jargon, réessai → « Bienvenue » (I1-I3).
- Hub réel (lecture seule) : audit T1-T6 — une seule trace d'échec passé (4 codes manquants, CLASSE TEST, fictifs canoniques), consignée au relevé.

## Déclaration de couverture (pas de vert nu)
COUVERT par jeu réel : les trois issues sur l'arbre, regroupement ×3 + Détail + Tout réessayer, cascade avec échec partiel nommé, LIER refusé (état intact), retrait élève en lot, mode test, login élève (panne puis succès), salve « tout refusé » (4 familles), mobile.
COUVERT par audit statique seulement : galerie (mjpcFetchOk sur les 7 PUT — non jouée faute d'upload réel), uploads Apps Script (chirurgie r.ok + textes ; service réel non sollicité), corbeille refus/panne (textes vérifiés au code, _fbPutPath porté par mjpcFetchOk éprouvé ailleurs), manifeste (verdict → MJPC_ECRITURES_DIAG).
NON COUVERT, assumé : parcours par les boutons admin réels (les gestes ont été joués par leurs fonctions puis leurs VRAIES modales — remplissage et clic réels — sans passer par la barre admin) ; succès contre le hub réel (interdit par mon circuit : hub en lecture seule — le succès a traversé le code face à un 200 d'interception) ; mode test toujours limité à `_site*` (constat de cadrage inchangé, dette).

## Constats et révisions en cours d'exécution
- Canon 1.1.0 : DEUX sections numérotées « 8 » (Manifeste et Session). Non renuméroté (hors périmètre) ; ma section est « 9 ». À corriger à la prochaine évolution du socle.
- Tri révisé sur pièces : les uploads Apps Script n'étaient PAS silencieux (réponse métier affichée, panne alertée) — l'inventaire du cadrage les surestimait. Traitement ramené à la chirurgie juste (refus HTTP testé, « Erreur réseau » remplacé par la cause vraie). `mjpcEcrireAppsScript`, devenu sans appelant, RETIRÉ (zéro code mort).
- Incident d'assemblage : un fragment C9 bancal (première passe) a cassé la syntaxe — détecté par le double parseur, corrigé, chaîne rejouée depuis la base. Les assertions d'ancres ont fait leur travail.

## Dettes portées au registre
1. File d'attente durable des pannes (survit à l'onglet) — morceau futur, frontière Q4.
2. M-SÉCU : toujours LE préalable ; ce morceau en est le prérequis d'affichage.
3. M-ÉCHECS-2 : diffusion du socle 1.2.0 aux autres apps.
4. Mode test : étendre la couverture au-delà de `_site*`.
5. Doublon §8/§8 du canon (renumérotation à la prochaine version du socle).
6. `loadDocsList_` : état d'écran de lecture en panne (hors écritures).
