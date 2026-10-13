#!/bin/bash
D=/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteurs/R11/q; n=c$RANDOM; cat > $D/$n.tmp; mv $D/$n.tmp $D/$n.js; for i in $(seq 1 300); do [ -f $D/$n.out ] && { cat $D/$n.out; rm $D/$n.out; exit; }; sleep 0.2; done; echo TIMEOUT
