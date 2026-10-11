# Consigne du relecteur — maquette v7 du QCM de MJPC

Tu relis, seul et sans rien modifier, une partie de la maquette d'une application de classe. Paul est professeur de français au collège. Ses élèves passent des évaluations QCM sur tablette, deux élèves par tablette, une moitié d'écran chacun. Paul pilote depuis sa console (ordinateur), son téléphone et le tableau, et il règle ses classes dans un site nommé MJPC (les écrans `m-…`).

La maquette a été validée trop vite : des défauts visibles ont échappé à la relecture précédente. Par exemple, une infobulle dont le texte sortait de sa bulle et s'écrivait en blanc par-dessus la ligne suivante. **Ton travail est de trouver tout ce qui ne va pas, écran par écran**, en regardant vraiment.

## Ce que tu as

- **Les captures** : `/home/claude/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/captures/NNN-ID.png`, une par écran (scène), l'écran entier. Ouvre chacune avec l'outil Read : c'est une image.
- **La liste des scènes** : `/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/lecture/scenes.json`. Pour chaque scène, on y trouve :
  - `n` : le numéro ;
  - `id` ;
  - `vue` : console = l'ordinateur de Paul ; telephone ; tableau ; tablette = deux moitiés d'élèves ; eleve = l'élève hors séance ;
  - `titre` : ce que la scène doit montrer.
- **La maquette elle-même**, à manipuler : `/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html`. Ouvre une scène avec `file://…/v7.html#scene=ID`, dans Chromium par Playwright :
  - le module : `require("/opt/node22/lib/node_modules/playwright")` ;
  - le navigateur : `chromium.launch({executablePath: "/opt/pw-browsers/chromium"})` ;
  - les tailles de la console : 1366×768, 1536×864, 1920×1080 ; tablette et tableau : 1280×800 ; téléphone : 390×844.

  Écris tes scripts et tes captures **dans ton dossier de travail seulement** (indiqué dans ta mission). Ne modifie aucun fichier ailleurs.

## Ce que tu vérifies, sur chaque scène de ta part

1. **L'affichage**, sur la capture puis dans la maquette, aux tailles de sa vue :
   - un texte coupé ou tronqué ;
   - un texte qui sort de son cadre ;
   - deux éléments qui se chevauchent, ou du texte par-dessus du texte ;
   - un élément hors de la fenêtre ou hors de sa carte ;
   - des boutons mal alignés ;
   - une barre de défilement inattendue ;
   - un contraste illisible ou un texte minuscule ;
   - un vide qui a l'air cassé ;
   - « [object Object] », « undefined », « NaN » ;
   - des doublons.
2. **Les infobulles.** Elles ne concernent que les écrans de Paul : console, téléphone et MJPC.
   - Survole une dizaine d'éléments variés : boutons, pastilles, compteurs, chronos, en-têtes, noms, et les « i » jaunes.
   - Y a-t-il une infobulle ? Se lit-elle en entier, dans l'écran, sans rien par-dessus ?
   - Dit-elle ce qu'est l'élément et ce qu'il fait ici, maintenant ?
   - Sur les écrans d'élève (tablette, élève) et au tableau, il ne doit y avoir **aucune** infobulle.
3. **Les gestes.** Clique les boutons de la scène.
   - Chacun fait-il quelque chose qui se voit : un changement à l'écran, une autre scène, une fenêtre ?
   - Un bouton qui ne fait rien est un défaut, sauf s'il est grisé avec sa raison.
   - Un bouton qui mène à une scène sans rapport est un défaut.
4. **Les textes** :
   - les fautes de français, les accents et l'espacement de la ponctuation française (espace avant « : ; ! ? », guillemets « ») ;
   - les pluriels bricolés, comme « bonne(s) réponse(s) » ;
   - un même mot pour deux choses, ou deux mots pour une même chose (par exemple « séance » et « session ») ;
   - les nombres incohérents dans une scène ou entre scènes voisines : présents, absents, notes, dates, comptes ;
   - côté élève, des règles strictes :
     - jamais « touche », mais « clique » ;
     - jamais « recopie », « sanction », « attestation », « va voir ton professeur » ;
     - jamais l'intitulé officiel d'une compétence, seulement son libellé élève (par exemple « Travailler seul et de façon responsable », et non « Être autonome et responsable ») ;
     - aucun mot technique ;
   - sur les écrans de Paul, **les paragraphes qui expliquent une règle** au lieu de montrer un état ou une donnée : relève-les.
5. **La logique.**
   - L'écran a-t-il du sens à ce moment de la séance (le titre de la scène) ?
   - Contredit-il un écran voisin ? Par exemple, un élève absent qui répond, un compteur qui ne suit pas, une note différente d'un écran à l'autre.

## Ce que tu rends

Un fichier markdown, au chemin indiqué dans ta mission, avec :
- **une ligne par défaut** : `scène | type (affichage, infobulle, geste, texte, logique) | ce qui ne va pas, en citant le texte exact | où à l'écran | gravité (bloquant, gênant, mineur) | comment le reproduire` ;
- à la fin, la liste des scènes relues, avec « rien » quand tu n'as rien trouvé.

Seulement ce que tu as vu ou mesuré, pas de supposition. Quand tu n'es pas sûr, écris-le dans la ligne. Ne propose pas de correction : décris le défaut.
