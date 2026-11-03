#!/bin/bash
# la file des passages de l'audit horloge : chacun attend 30 s de machine libre (aucun navigateur, aucun témoin), passe par mesurer.sh ; chevauché : il attend et se rejoue (3 fois au plus)
S=/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad
A=$S/audit-horloge; F=$A/assemble/index.html; J=$A/journal.txt
M=/home/claude/audit-horloge/LIVRAISONS/DEROULE-01-11/AUDIT-HORLOGE/mesurer.sh
D=/home/claude/audit-horloge/LIVRAISONS/DEROULE-01-11
libre() { [ -z "$(ps -eo comm= | grep -E '^(chrom|headless)')" ] && [ ! -e $S/MACHINE-CONSCIENCE ] && [ ! -e $S/MACHINE-MESURE ]; }
LIBRE_N=${LIBRE_N:-15}   # nombre de contrôles de 2 s de machine libre avant un passage (15 = 30 s ; la machine donnée par la conscience : 2)
attendre() { local n=0; while [ $n -lt $LIBRE_N ]; do if libre; then n=$((n+1)); else n=0; fi; sleep 2; done; }
passer() { local nom=$1; shift; local k; for k in 1 2 3; do attendre; mkdir -p $A/$nom; "$M" "$S" "$J" "$@" > $A/$nom/console.txt 2>&1; local c=$?; echo "$nom (essai $k) : sortie $c · $(tail -1 $A/$nom/console.txt | cut -c1-80)" >> $J; [ $c = 4 ] || [ $c = 3 ] || return 0; done; }
E="env MJPC_PYQR=$S/pyqr MJPC_MEDIAS=$S/medias"
while [ $# -gt 0 ]; do
  case "$1" in
    appel-trace-date) passer m5-appel-date $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_PARTIES=P2T,XT,X MJPC_NOM=m5 timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m5-appel-date ;;
    appel-trace-simulee) passer m6-appel-simulee $E MJPC_TRACE=1 MJPC_PARTIES=P2T,XT,X MJPC_NOM=m6 timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m6-appel-simulee ;;
    session-trace-date-*) passer m7-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_PARTIES=T MJPC_NOM=m7-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-session-trace.mjs $F $A/m7-${1##*-} ;;
    sansechap-x-*) passer m13-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_SANS_ECHAP=1 MJPC_PARTIES=X MJPC_NOM=m13-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m13-${1##*-} ;;
    sansechap-xt-*) passer m14-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_SANS_ECHAP=1 MJPC_PARTIES=XT MJPC_NOM=m14-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m14-${1##*-} ;;
    session-sansechap-*) passer m15-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_SANS_ECHAP=1 MJPC_PARTIES=T MJPC_NOM=m15-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-session-trace.mjs $F $A/m15-${1##*-} ;;
    p2t-date-*) passer m16-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_PARTIES=P2T MJPC_NOM=m16-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m16-${1##*-} ;;
    p2h-sansechap-*) passer m17-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_SANS_ECHAP=1 MJPC_PARTIES=P2H MJPC_NOM=m17-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m17-${1##*-} ;;
    pg-date-*) passer m18-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_SANS_ECHAP=1 MJPC_PARTIES=PG MJPC_NOM=m18-${1##*-} timeout 1200 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m18-${1##*-} ;;
    x-regle-*) passer m19-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_X_REGLE=1 MJPC_PARTIES=X MJPC_NOM=m19-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m19-${1##*-} ;;
    xt-regle-*) passer m20-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_X_REGLE=1 MJPC_PARTIES=XT MJPC_NOM=m20-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m20-${1##*-} ;;
    xt-date-*) passer m9-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_PARTIES=XT MJPC_NOM=m9-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m9-${1##*-} ;;
    sansechap-date-*) passer m10-${1##*-} $E MJPC_HORLOGE=date MJPC_TRACE=1 MJPC_SANS_ECHAP=1 MJPC_PARTIES=XT,X MJPC_NOM=m10-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m10-${1##*-} ;;
    p2t-simulee-*) passer m11-${1##*-} $E MJPC_TRACE=1 MJPC_PARTIES=P2T MJPC_NOM=m11-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m11-${1##*-} ;;
    x-simulee-*) passer m12-${1##*-} $E MJPC_TRACE=1 MJPC_PARTIES=XT,X MJPC_NOM=m12-${1##*-} timeout 900 node $D/AUDIT-HORLOGE/sonde-appel-trace.mjs $F $A/m12-${1##*-} ;;
    appel-origine-date-*) passer m8-${1##*-} $E MJPC_HORLOGE=date MJPC_PARTIES=P2H,P2T,X,XT MJPC_NOM=m8-${1##*-} timeout 900 node $D/APPEL/sonde-appel.mjs $F $A/m8-${1##*-} ;;
  esac; shift
done
echo "FILE FINIE $(TZ=Europe/Paris date +%H:%M:%S)" >> $J
