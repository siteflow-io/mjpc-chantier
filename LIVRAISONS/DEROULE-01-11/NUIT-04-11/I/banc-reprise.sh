# C16 nuit 05/11, mandat I — les parties rouges du banc de la nuit, rejouées sur le candidat (nuit/h cd88b59f9, assemblé md5 3e8a46c9) avec les sondes de banc/nuit, à la vraie horloge
S=/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad; O=$S/banc-reprise; rm -rf $O; mkdir -p $O; touch $S/MACHINE-CONSCIENCE; export MJPC_HORLOGE=date
W=$S/wt-banc; cd $W && git fetch -q origin +refs/heads/main:refs/remotes/origin/main +refs/heads/nuit/h:refs/remotes/origin/nuit/h && git checkout -q -f --detach cd88b59f9 && git checkout -q origin/main -- AUDITS/ || exit 9
git checkout -q banc/nuit -- LIVRAISONS/INTEGRATION/EX/bancs/sonde-10.mjs LIVRAISONS/DEROULE-01-11/SESSION-PARTOUT/sonde-session.mjs LIVRAISONS/DEROULE-01-11/APPEL/sonde-appel.mjs LIVRAISONS/DEROULE-01-11/QUESTION-ORDRE/sonde-question.mjs LIVRAISONS/DEROULE-01-11/FRAPPE-TABLEAU || exit 8
git rev-parse --short HEAD > $O/heures.txt; git rev-parse --short banc/nuit >> $O/heures.txt; git rev-parse --short origin/main >> $O/heures.txt
node AUDITS/INTEGRATION-DEROULE/assembler.mjs LIVRAISONS/INTEGRATION/index.html LIVRAISONS/INTEGRATION/assemble/index.html > $O/assemblage.txt 2>&1
A=$W/LIVRAISONS/INTEGRATION/assemble/index.html; md5sum $A >> $O/heures.txt; TZ=Europe/Paris date '+debut %H:%M:%S' >> $O/heures.txt
# 1. la sonde du bloc question, comme banc.sh l. 27 (le faux hub du banc, mode test)
cd $W && MJPC_HUB="$W/AUDITS/INTEGRATION-DEROULE/hub" MJPC_MODE_TEST=1 timeout 900 node LIVRAISONS/DEROULE-01-11/QUESTION-ORDRE/sonde-question.mjs $A $O/sonde-question > $O/sonde-question.txt 2>&1; echo "question code $?" >> $O/heures.txt; TZ=Europe/Paris date '+fin question %H:%M:%S' >> $O/heures.txt
# 2. l'étape 13, la frappe au tableau
cd $W/LIVRAISONS/DEROULE-01-11/FRAPPE-TABLEAU && MJPC_MEDIAS=$S/medias MJPC_NOM=banc timeout 900 node sonde-frappe-tableau.mjs $A $O/etape13 > $O/etape13-console.txt 2>&1; echo "etape13 code $?" >> $O/heures.txt; TZ=Europe/Paris date '+fin 13 %H:%M:%S' >> $O/heures.txt
# 3. l'étape 15, l'appel : les cinq parties rouges
cd $W/LIVRAISONS/DEROULE-01-11/APPEL && MJPC_PARTIES=P2H,Q,X,Z,RPH MJPC_NOM=banc MJPC_V879=$S/c16-appel/v879/index.html MJPC_PYQR=$S/pyqr MJPC_MEDIAS=$S/medias MJPC_CAPT=$O/capt15 timeout 1200 node sonde-appel.mjs $A $O/etape15 > $O/etape15-console.txt 2>&1; echo "etape15 code $?" >> $O/heures.txt; TZ=Europe/Paris date '+fin 15 %H:%M:%S' >> $O/heures.txt
# 4. les deux sondes de la nuit, comme leur mandat les a jouées (F : MJPC_Q4=normal,devoiler,fermer ; H : MJPC_COURT=1, montres +3 s / -3 s), à la vraie horloge
cd $W/LIVRAISONS/DEROULE-01-11/RESEAU-LENT && MJPC_PARTIES=Q4 MJPC_Q4=normal,devoiler,fermer timeout 900 node sonde-f.mjs $A $O/reseau-Q4 > $O/reseau-Q4-console.txt 2>&1; echo "reseau-Q4 code $?" >> $O/heures.txt; TZ=Europe/Paris date '+fin Q4 %H:%M:%S' >> $O/heures.txt
cd $W/LIVRAISONS/DEROULE-01-11/NUIT-04-11-H && MJPC_PARTIES=Q2R,Q2D MJPC_COURT=1 MJPC_TEL_DECAL=3000 MJPC_TAB_DECAL=-3000 timeout 900 node sonde-h-horloge.mjs $A $O/chrono-H > $O/chrono-H-console.txt 2>&1; echo "chrono-H code $?" >> $O/heures.txt; TZ=Europe/Paris date '+fin H %H:%M:%S' >> $O/heures.txt
md5sum $A >> $O/heures.txt; rm -f $S/MACHINE-CONSCIENCE; echo FINI >> $O/heures.txt
