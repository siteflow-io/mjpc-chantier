#!/bin/sh
cd /home/claude; r=0; for f in test-b test-cahier-b test-a0-b regression-b tout-cliquer-b audit-affichage-b; do out=$(timeout 300 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
