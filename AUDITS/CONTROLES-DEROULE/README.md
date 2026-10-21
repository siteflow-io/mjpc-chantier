# Les contrôles de la conscience n°13 — le déroulé, maquette p8

*Écrits le 12/10/2026 (C13, tour 65 ; K10 à K13 au tour 66), selon le protocole de l'audit validé par Paul à 11:28 : `PROTOCOLE-AUDIT-12-10.md`. Promis au tour 64, déposés à 14:48 : l'exécutant de p8-5g s'est arrêté avant p8-5h parce qu'ils manquaient (sa NOTE, en tête) — faute de la conscience.*

## Ce qu'il y a ici

1. **`controles.mjs`** — ce qui doit être vrai, par le geste (un clic, une touche, la molette, puis l'écran où ça mène), à 1280 × 800 (et 1920 où le cadrage le demande). Les attendus sont **écrits dans le fichier, à chaque contrôle, avec leur source** (le cadrage 1 et 4, les compléments p8-5c à p8-5h, les mots de Paul) : ils ne viennent pas de la version contrôlée.
   - **K1** la répétition propre (dette n°13 · 9) · **K2** les notes de présentateur par étape (13 · 10) · **K3** la mise en forme à deux boutons et palette, ▶ dans le cadre (13 · 11) · **K4** le panneau des notes suit toujours la diapo, le premier caractère après Entrée (13 · 13, 13 · 14) · **K5** la poignée des notes en permanence (13 · 15) · **K6** la diapo trop pleine se lit en pages, jamais hors du cadre, avec plusieurs blocs, dans l'atelier aussi (13 · 16) · **K7** la fenêtre du tableau reçoit les pages dès son ouverture (13 · 17) · **K8** une vignette par page dans la colonne de gauche (13 · 18) · **K10** après « ■ Arrêter », la fenêtre du tableau revient à ce qu'elle montrait avant la répétition (13 · 19) · **K11** la vue « ⧉ Tableau » porte le compteur de page et montre la même page (13 · 20) · **K12** dans l'atelier, le curseur reste dans le cadre dans un paragraphe plus haut que la diapo (13 · 21) · **K13** dans l'atelier, Échap sort de la ligne et Maj+← change de page (13 · 22) · **K9** le parcours fixe, le même à chaque audit : atelier → écrire dans la diapo → une note → lancer l'heure → ▶ ×3 → PageDown et la garde → 🖥 Écran 2 → « A » rouge → Jouer en avance → ▶ ×2 → ■ Arrêter → Fin de l'heure.
   - Chaque contrôle compte aussi : aucune erreur JS, aucune boîte système.
   - `node controles.mjs <maquette-pilotage-ordi-v9c15p8-manipulable.html> [sortie.txt]` ; code de sortie 1 si un seul contrôle échoue. Playwright : `MJPC_PLAYWRIGHT` (facultatif), sinon le Playwright global de la machine (`/opt/node22/lib/node_modules/playwright`), sinon `node_modules/` à côté de la maquette ; Chromium : `MJPC_CHROMIUM` (facultatif). **Durée mesurée : 3 min.** La première ligne de la sortie donne le md5 de `controles.mjs` et celui de la maquette jouée.
2. **`epreuves/`** — les contrôles éprouvés, chacun sur la version qui avait le défaut et sur celle qui l'a réglé (`sur-p8-5.txt` … `sur-p8-5g.txt`, les mêmes maquettes que les livraisons, md5 dans chaque sortie) :

   | contrôle | échoue sur | passe depuis |
   |---|---|---|
   | K1 (pastille, boutons recouverts) | p8-5 | p8-5c |
   | K2, K3 | p8-5 (les notes n'existent pas, pas de boutons) | p8-5c |
   | K4 | p8-5c (le panneau ne suit pas ; « Xyz 0 » → « z 0 ») | p8-5d |
   | K5 | p8-5d (poignée invisible hors préparation) | p8-5e |
   | K6 | p8-5e (huit lignes → pas de page, hors du cadre) | p8-5f |
   | K7 | p8-5f (ouvert à 0, 9 dévoilés et sur page manuelle : pas les pages du pilote) | p8-5g |
   | K8 | p8-5g (une seule vignette, pas de « · 2 pages ») | p8-5h, à livrer |
   | K10 | p8-5g (après l'arrêt, la fenêtre garde la répétition ; présent depuis p6) | p8-5h, à livrer |
   | K11 | p8-5g (la vue « ⧉ Tableau » sans compteur) | p8-5h, à livrer |
   | K12 | p8-5g (le curseur sous la diapo, la zone « ✎ » sur la ligne) | p8-5h, à livrer |
   | K13 | p8-5g (Échap ne sort pas de la ligne) | p8-5h, à livrer |
   | K9 | p8-5 (ne va pas au bout : pas de notes) | p8-5c |

   Sur p8-5c, K2 et K9 varient d'un passage à l'autre (28 puis 24 échecs) : c'est la dette n°13 · 14 elle-même (le premier caractère après Entrée se perdait selon le moment de la frappe) ; K4 la tient à chaque passage.

   K10 à K13 ont été ajoutés au tour 66 (Paul : « il n'y a pas de petites choses ou de petites dettes. Tout doit être nickel. ») : les dettes n°13 · 19 à 13 · 22 des relecteurs neufs de p8-5g se règlent dans p8-5h (complément, points 11 à 14).

   **Trouvé en les éprouvant, présent de p8-5c à p8-5g (dette n°13 · 23, complément p8-5h point 15)** : à 1280 px, heure lancée puis « Jouer en avance », dès que le chrono de la répétition s'écrit dans l'entête (« · répét. 00:02 · diapo 1, dévoilée 0 / 6 »), le bouton « ⚙ » est poussé hors du cadre (bord droit à 1301 px pour 1280). K1 le dit (« hors du cadre : ⚙ → 1301 ») et **échoue donc sur p8-5g** jusqu'à ce que ce soit réglé.
3. **`EMPREINTES.md5`** — les md5 de ces fichiers : un audit, et une livraison, commencent par les vérifier (`md5sum -c EMPREINTES.md5`).

## Pour l'exécutant
- Tire `main` du sas, vérifie `EMPREINTES.md5`, fais passer `controles.mjs` tel quel sur ta maquette, sortie dans `sorties/controles-conscience.txt` de ta livraison. **Tu ne modifies jamais ces fichiers.**
- Un contrôle qui échoue : tu corriges la maquette, pas le contrôle — si ton complément te ferme l'endroit, ou si tu crois le contrôle faux, tu l'écris dans la NOTE et tu t'arrêtes.
- Un défaut que tu trouves et corriges reçoit une garde dans ton banc ; la conscience en fait un contrôle ici.

## Pour la conscience, à chaque audit
1. `md5sum -c EMPREINTES.md5` ici, et la sortie `sorties/controles-conscience.txt` de la livraison : la même maquette (md5), zéro échec attendu — sinon le verdict est « ça ne va pas » ;
2. les écrans changés, ceux qui devaient changer, et leurs voisins, par le geste et en image (version auditée contre la précédente) ;
3. K9, le parcours fixe, lu en entier ;
4. un défaut trouvé devient un contrôle, éprouvé sur la version qui l'a (`epreuves/`), et une dette au registre.

## v2 — 21/10/2026 (l'intégration, contrat des quatre)
Les contrôles ne changent pas ; **l'entrée** devient paramétrable : `MJPC_ENTREE=site node controles.mjs <index.html assemblé>` joue K1-K13 sur le site intégré (faux hub `AUDITS/INTEGRATION-DEROULE/hub/`, horloge au 14/09 09:00, gestes réels jusqu'à l'onglet Atelier) ; sans la variable, la maquette seule, comme avant. `noteDe` lit `dr.notes()` quand le site l'expose (contrat §5). **Éprouvé** : sur p8-5g, v2 donne exactement les verdicts de v1 (`epreuves/sur-p8-5g-v2.txt` : 108 vérifications, 15 échecs, les mêmes). `controles.mjs` md5 `dbb8e8bce872858a468826bc9ad6b018`.
