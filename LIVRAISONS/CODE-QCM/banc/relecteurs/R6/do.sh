#!/bin/bash
cd /home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteurs/R6; rm -f out.txt; cat > cmd.tmp; mv cmd.tmp cmd.js; for i in $(seq 1 900); do [ -f out.txt ] && break; sleep 0.2; done; sleep 0.1; cat out.txt
