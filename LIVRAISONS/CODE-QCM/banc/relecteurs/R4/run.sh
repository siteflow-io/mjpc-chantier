#!/bin/bash
cd /home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteurs/R4; rm -f out.txt; cat > cmd.js; for i in $(seq 1 600); do [ -f out.txt ] && break; sleep 0.1; done; cat out.txt
