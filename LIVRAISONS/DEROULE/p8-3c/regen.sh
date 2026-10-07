#!/bin/sh
# régénère la maquette p8-3c : gabarit p7 → patch p8-2 → patch p8-3 → patch p8-3b → patch p8-3c → générateur (bloc de données de la v9c13)
ICI=$(cd "$(dirname "$0")" && pwd); P=$ICI/../../../TRANSCRIPTS/C12/pieces; D2=$ICI/../p8-2; D3=$ICI/../p8-3; D3B=$ICI/../p8-3b; T=$(mktemp -d)
mkdir -p $T/vis $T/C12 && cp $P/T142-v9c13-template.html $T/vis/v9c13-template.html && cp $P/T280-maquette-v9c13-courante.html $T/C12/maquette-v9c13-courante.html
python3 $ICI/patch-p8-2.py $P/T265-v9c15p7-template.html $ICI/p8-moteur.js $T/g2.html > /dev/null || exit 1
cmp -s $T/g2.html $D2/v9c15p8-2-template.html || { echo "le gabarit p8-2 régénéré diffère de celui livré en p8-2"; exit 1; }
python3 $ICI/patch-p8-3.py $T/g2.html $ICI/p8-3-gestes.js $T/g3.html > /dev/null || exit 1
cmp -s $T/g3.html $D3/v9c15p8-template.html || { echo "le gabarit p8-3 régénéré diffère de celui livré en p8-3"; exit 1; }
python3 $ICI/patch-p8-3b.py $T/g3.html $T/g3b.html > /dev/null || exit 1
cmp -s $T/g3b.html $D3B/v9c15p8-template.html || { echo "le gabarit p8-3b régénéré diffère de celui livré en p8-3b"; exit 1; }
python3 $ICI/patch-p8-3c.py $T/g3b.html $ICI/v9c15p8-template.html || exit 1
(cd $T && python3 $P/T159-gen-par-difference.py $ICI/v9c15p8-template.html $ICI/maquette-pilotage-ordi-v9c15p8-manipulable.html) | sed "s#$ICI/##" || exit 1
rm -rf $T; cd $ICI && md5sum v9c15p8-template.html maquette-pilotage-ordi-v9c15p8-manipulable.html
