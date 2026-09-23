#!/bin/sh
cd /home/claude; r=0; for f in test-c test-b2-apercu-c test-bc test-cahier-c test-a0-c regression-c tout-cliquer-c audit-affichage-c; do out=$(timeout 300 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
