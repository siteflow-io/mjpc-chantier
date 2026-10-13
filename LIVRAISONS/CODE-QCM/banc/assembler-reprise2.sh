#!/bin/bash
# QCM-4 · BANC — l'assemblage court de la reprise 2 (13/10, 08:50) : build.py, les contrôles de la conscience, l'heure de demain
# et les points 1 à 5 de la reprise 2 rejoués par le geste (banc-reprise2.js), en même temps.
cd "$(dirname "$0")/../../.." || exit 2
R=$PWD; L=$R/LIVRAISONS/CODE-QCM; H=$(TZ=Europe/Paris date +%Y-%m-%d_%H%M); O=$L/sorties/$H; mkdir -p "$O"
BANC=$R/AUDITS/QCM-MODE-TEST-09-10/banc; t0=$(date +%s)
{ echo "Assemblage court (reprise 2) QCM-4 · BANC — $(TZ=Europe/Paris date '+%d/%m/%Y %H:%M') — code-qcm $(git rev-parse --short HEAD)"
  ( cd "$L" && timeout 300 python3 build.py ) > "$O/build.txt" 2>&1; echo "build.py : code $?"
  echo "app : $(md5sum "$L/evaluation-qcm.staging.html" | cut -c1-32)"
  ( cd "$R/AUDITS/CONTROLES-QCM-APP" && md5sum -c EMPREINTES.md5 ) 2>&1 | sed 's/^/  /'; } > "$O/resume.txt"
APP=$L/evaluation-qcm.staging.html
( a=$(date +%s); APP_FILE="$APP" BANC="$BANC" timeout 900 node "$R/AUDITS/CONTROLES-QCM-APP/controles-app.js" "$O/controles.txt" > "$O/controles.log" 2>&1; echo "contrôles de la conscience : $(( $(date +%s) - a )) s, $(grep -c '^ *ok' "$O/controles.txt") ok, $(grep -c 'ÉCHEC' "$O/controles.txt") échecs" > "$O/.c" ) &
( a=$(date +%s); APP_FILE="$APP" BANC="$BANC" timeout 900 node "$L/banc/banc-demain.js" "$O" > "$O/demain.log" 2>&1; echo "l'heure de demain : $(( $(date +%s) - a )) s — $(sed -n 2p "$O/demain.txt")" > "$O/.d" ) &
( a=$(date +%s); APP_FILE="$APP" BANC="$BANC" timeout 600 node "$L/banc/banc-reprise2.js" "$O" > "$O/reprise2.log" 2>&1; echo "reprise 2, points 1 à 5 : $(( $(date +%s) - a )) s — $(sed -n 2p "$O/reprise2.txt")" > "$O/.r" ) &
wait
cat "$O/.c" "$O/.r" "$O/.d" >> "$O/resume.txt" 2>/dev/null; rm -f "$O/.c" "$O/.r" "$O/.d"
echo "Durée totale : $(( $(date +%s) - t0 )) s" >> "$O/resume.txt"; cat "$O/resume.txt"; echo "→ $O"
