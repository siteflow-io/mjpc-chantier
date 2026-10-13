#!/bin/bash
D=/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteurs/R8; n=$(ls $D/cmd*.js 2>/dev/null | wc -l); cat > $D/cmd$n.js; while [ ! -f $D/out$n.txt ]; do sleep 0.2; done; cat $D/out$n.txt
