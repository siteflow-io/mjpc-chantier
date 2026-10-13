#!/bin/bash
D=/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteurs/R5
rm -f $D/done; cat > $D/cmd.js
for i in $(seq 1 1500); do [ -f $D/done ] && break; sleep 0.2; done
cat $D/out.txt
