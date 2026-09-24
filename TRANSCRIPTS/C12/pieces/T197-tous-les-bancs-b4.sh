#!/bin/sh
cd /home/claude; r=0; for f in test-b4 test-b3-b4 test-d-b4 test-c-b4 test-b2-apercu-b4 test-b-b4 test-cahier-b4 test-a0-b4 regression-b4 tout-cliquer-b4 audit-affichage-b4; do out=$(timeout 400 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
