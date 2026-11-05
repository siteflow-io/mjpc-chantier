# MANDAT V2 — FINIR « ▶ SÉANCE SUIVANTE DANS CETTE HEURE » (mode test, répétition, témoin, la case)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base et la durée. Branche : `deroule/enchainer`, tu continues `23359ecdb`. **45 minutes au plus** ; à la limite, tu pousses ce qui est prouvé et tu dis ce qui reste. Le mandat V (`V-LA-SEANCE-SUIVANTE-DANS-CETTE-HEURE.md`) et la NOTE de l'exécutant V (`LIVRAISONS/DEROULE-01-11/ENCHAINER/NOTE.md`) d'abord, en entier.*

## 0 · CE QUI EST DIT
Le mandat V, §0 et §1 (les mots de Paul et les propositions acquises), sans rien changer. La vraie heure est prouvée par V (23/23, sa sonde `sonde-enchainer.mjs`). Le choix de V « la séance suivante dans cette heure part sans la question de la réactivation » est posé à Paul (C16) : garde-le tel quel ; s'il le refuse, la conscience te le dira.

## 1 · CE QUE TU FAIS (ce que V a laissé, ses mots)
1. **Mode test** : « la marque « séance faite » ne se relit pas au stockage du mode test » (V, échec 3) : elle se relit ; prouve-le avec une séance 1 prévue en **deux** heures, enchaînée à sa 2e heure (le cas de Paul demain : 3E, séance 1 heure 2/2, puis la séance 2) — la case suivante dit la séance 2. Et « 2 erreurs de page (« reading 'actId' ») à « Relire cette heure » » (V, échec 5) : 0 erreur.
2. **Répétition** : « la sonde arrive au bouton, puis dépasse 240 s après le clic sans résultat » : la séance 2 démarre en répétition, rien d'écrit pour la classe (compté), le tableau la suit.
3. **La case du jour** : V mesure « Close · 25 diapos jouées · 10 reportées » pour les deux séances ensemble (la séance 1 : 24 diapos, rien reporté). La case dit ce que chaque séance a fait, avec ses vrais nombres (« Séance 1 : … ; puis Séance 2 : … ») — en vraie heure et en mode test.
4. **Le témoin** : une classe qui n'enchaîne pas : rien ne change (compté, base `46ce703a1` → après), la case, la Relecture, la case suivante.
5. **Les sondes du banc qui lisent ce que V et toi changez** (cherche `dr_lancer`, la clôture, `edtSeanceEtat`, `edtSeanceDeTrace`, la case ouverte, « Relire cette heure ») : à jour dans la branche ; la séance (étape 14), l'appel (15), la fin d'heure (16) — lancées comme le banc de la conscience les lance (`$W` = ton worktree, `$A` = ton assemblé, `$S` = le scratchpad, `$O` = ta sortie ; `MJPC_HORLOGE=date` exporté) :
```
cd $W/LIVRAISONS/DEROULE-01-11/SESSION-PARTOUT && MJPC_PARTIES=T,H,QH,QT,R,RT,A MJPC_NOM=banc MJPC_PYQR=$S/pyqr MJPC_MEDIAS=$S/medias MJPC_CAPT=$O/capt14 timeout 1500 node sonde-session.mjs $A $O/etape14 > $O/etape14-console.txt 2>&1
cd $W/LIVRAISONS/DEROULE-01-11/APPEL && MJPC_NOM=banc MJPC_V879=$S/c16-appel/v879/index.html MJPC_PYQR=$S/pyqr MJPC_MEDIAS=$S/medias MJPC_CAPT=$O/capt15 timeout 1800 node sonde-appel.mjs $A $O/etape15 > $O/etape15-console.txt 2>&1
cd $W/LIVRAISONS/DEROULE-01-11/FIN-HEURE && MJPC_ANCIEN=$ANC MJPC_PYQR=$S/pyqr MJPC_MEDIAS=$S/medias MJPC_CAPT=$O/capt16 timeout 1800 node sonde-fin-heure.mjs $A $O/etape16 > $O/etape16-console.txt 2>&1
```
, le parcours P0-P12, la sonde du bilan partie B : verts.
Captures refaites pour Paul (écran entier) : la case du jour ouverte, en vraie heure ; le bouton en mode test.

**Avant ces étapes**, dans ton worktree, les sondes à jour du banc (sans les committer dans ta branche), comme le banc de la conscience : `$ANC` = `$S/v8782/index.html` ;
```
cd $W && git fetch -q origin +refs/heads/main:refs/remotes/origin/main +refs/heads/banc/vraie-horloge:refs/remotes/origin/banc/vraie-horloge +refs/heads/banc/chrono-v3:refs/remotes/origin/banc/chrono-v3 +refs/heads/banc/nuit:refs/remotes/origin/banc/nuit +refs/heads/deroule/bilan:refs/remotes/origin/deroule/bilan +refs/heads/banc/bilan:refs/remotes/origin/banc/bilan +refs/heads/deroule/attente:refs/remotes/origin/deroule/attente && git checkout -q -f --detach $C && git checkout -q origin/main -- AUDITS/ || exit 9
git checkout -q origin/banc/nuit -- LIVRAISONS/INTEGRATION/EX/bancs/sonde-10.mjs LIVRAISONS/DEROULE-01-11/FIL-NAVIGATION/sonde-fil.mjs LIVRAISONS/DEROULE-01-11/APPEL/sonde-appel.mjs LIVRAISONS/DEROULE-01-11/FIN-HEURE/sonde-fin-heure.mjs LIVRAISONS/DEROULE-01-11/SESSION-PARTOUT/sonde-session.mjs LIVRAISONS/DEROULE-01-11/DERNIERES-DETTES/sonde-fin.mjs LIVRAISONS/DEROULE-01-11/FRAPPE-TABLEAU/sonde-frappe-tableau.mjs LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/temoin-sessions.sh || exit 8
git checkout -q origin/banc/nuit -- LIVRAISONS/DEROULE-01-11/QUESTION-ORDRE/ && git checkout -q origin/banc/bilan -- LIVRAISONS/DEROULE-01-11/FIN-HEURE/sonde-fin-heure.mjs   # C16 : les sondes à jour (13:47)
```
