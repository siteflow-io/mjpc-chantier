# Les relecteurs neufs du tableau (contrat §8.8) — 21/10, 12:30 → 13:00

Deux sous-agents, qui n'avaient que `MANDAT-E3-TABLEAU.md`, `CONTRAT.md` et `assemble/index.html` (md5 `c3e152ca…`), ont joué le tableau comme Paul (Playwright, faux hub, 14/09 09:00). Le premier : le territoire geste par geste ; le second : chercher à le casser. Leurs scripts et captures étaient dans `/tmp/relecteur1/`, `/tmp/relecteur2/` (session, non poussés).

## Ce qu'ils ont trouvé dans mon territoire — corrigé, chacun avec sa garde au banc
Chaque garde a été jouée **sur l'assemblé d'avant la correction (elle y échoue)** puis sur l'assemblé corrigé (elle y passe) — `sorties/1305/banc-E3-sur-l-ancien.txt`, `sorties/1305/banc-E3.txt`.

| trouvaille | cause | correction | garde |
|---|---|---|---|
| R1 n°5, R2 n°1 — une erreur JS par seconde dans toute page tableau (`tick` : `#fin` absent) | mon vidage provisoire de `#dr-zone` dans la page tableau | on ne retire plus que l'id du mur caché (`#mur` → `#dr-mur-gare`) | T1 : `?vue=tableau&local=1` chargée seule, 4 s, 0 erreur (l'ancien : 4) |
| R1 n°1, R2 n°4 — l'attente ne dit jamais la classe attendue | `_drProchainCreneau` n'en sait rien (audit F1, dette 12·17) | `dr_tabAttendre` : la grille et le calendrier de l'EDT lus **en lecture seule** (aucune `edt*` appelée), la semaine A/B lue au calendrier, l'heure MJPC qui commence dans le quart d'heure ou en cours → « Classe attendue : 3E Charles de Gaulle · 08:57 – 09:52 » | T5 à 08:50 |
| R2 n°3 — fenêtre rechargée (ou rouverte) pendant que Paul est dans l'Atelier en pleine heure : « Aucun cours en cours » | l'écoute `pret` sortait si `S.atelier` (`pousser` n'y pousse rien) | dans l'Atelier, la fenêtre reçoit `S.gel || S.mur` sans journal ni écriture | T9 |
| R2 n°5a — le distant accepte une scène plus récente alors que le pointeur est retiré | `dr_tabSonder` ne regardait pas le pointeur | `dr_tabPointeur` toutes les 3 s ; sans pilote présent, l'image reste | T5 |
| R2 n°5b — une scène à l'heure d'une horloge en avance bloque toutes les suivantes | ordre strict sur `ts` | une dernière scène « du futur » (> 5 min) ne bloque pas la suite | T5 |
| R2 n°5c — un `ts` en texte est accepté et bloque la suite | `ts` non vérifié | `ts` doit être un nombre fini | T5 |
| R2 n°8 — distant sans copie jouée lisible : page blanche | rendu sans écran | sans écran, rien ne se rend : l'attente ou la dernière image restent | T10 |
| R1 n°4 (en partie) — deux infobulles pour « 🖥 Écran 2 » (celle de la maquette avant le premier survol) | l'infobulle n'était posée qu'au survol | posée dès que le bouton est à l'écran | — (vu à l'œil, capture) |

## Ce qu'ils ont trouvé hors de mon territoire — signalé, non touché
- **à E1** (socle, gabarit) :
  - R2 n°2 : après une répétition en pleine heure, revenir au Pilotage projette **sans garde** la diapo où la répétition s'est arrêtée (`S.di` resté à 2, journal `diapo:2`).
  - R1 n°2 : « Chrono au tableau » (⋯) publie « ⏱ 07:00 » en dur (audit E3 F4) — le minuteur d'E2 (R3) passe, lui, par le même bandeau et marche.
  - R1 n°3 : la réglette « texte au tableau » plafonne la police au tableau (52 pt → 35 px) et aucune diapo ne passe en pages ; le compteur de page n'apparaît pas (le rendu et la pagination sont au socle ; la fenêtre reçoit bien `taille`).
  - R1 n°7 : l'infobulle de ❄ ne dit pas comment dégeler.
  - R2 n°9 : « 1 élève sur 29 ont participé » (accord).
  - R1 n°6 : l'aperçu « ⧉ Tableau » dit « ● tableau en Win K » (mot de Paul, cadrage 1 §1.6 — remarque, pas défaut).
  - `#dr-zone` posé dans la page tableau (cause de ma rustine `#dr-mur-gare`).
- **contradiction mandat / maquette** (R1 n°4, R2 n°9) : le bouton s'appelle « 🖥 Écran 2 » (le mot de Paul, cadrage 1 §1.7 « clique Écran 2 ») et le mandat dit « ⧉ Ouvrir le tableau ». Je n'ai pas renommé : à la conscience.
- **à la conscience** : R1 n°9 / R2 (remarque) — le retour à l'attente quand `cours_actif` disparaît (audit C3, toujours ouvert) ; R2 n°6 — le délai de bout en bout 0,9 à 1,1 s (audit I2) ; R2 n°7 — en répétition, la fenêtre locale suit la répétition (maquette p6 « le tableau reçoit ») et le distant non (rien n'est écrit en répétition).
- remarques sans suite : le QR est une image de `api.qrserver.com` (comme la production) ; la fenêtre s'ouvre en 1100×640 (F11 la met en plein écran, dit l'infobulle).
