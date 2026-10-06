#!/bin/sh
# régénère la maquette p8-3b : gabarit p7 → patch p8-2 → patch p8-3 → patch p8-3b → générateur (bloc de données de la v9c13)
ICI=$(cd "$(dirname "$0")" && pwd); P=$ICI/../../../TRANSCRIPTS/C12/pieces; D2=$ICI/../p8-2; D3=$ICI/../p8-3; T=$(mktemp -d)
mkdir -p $T/vis $T/C12 && cp $P/T142-v9c13-template.html $T/vis/v9c13-template.html && cp $P/T280-maquette-v9c13-courante.html $T/C12/maquette-v9c13-courante.html
python3 $ICI/patch-p8-2.py $P/T265-v9c15p7-template.html $ICI/p8-moteur.js $T/v9c15p8-2-template.html > /dev/null || exit 1
cmp -s $T/v9c15p8-2-template.html $D2/v9c15p8-2-template.html || { echo "le gabarit p8-2 régénéré diffère de celui livré en p8-2"; exit 1; }
python3 $ICI/patch-p8-3.py $T/v9c15p8-2-template.html $ICI/p8-3-gestes.js $T/v9c15p8-3-template.html > /dev/null || exit 1
cmp -s $T/v9c15p8-3-template.html $D3/v9c15p8-template.html || { echo "le gabarit p8-3 régénéré diffère de celui livré en p8-3"; exit 1; }
python3 $ICI/patch-p8-3b.py $T/v9c15p8-3-template.html $ICI/v9c15p8-template.html || exit 1
(cd $T && python3 $P/T159-gen-par-difference.py $ICI/v9c15p8-template.html $ICI/maquette-pilotage-ordi-v9c15p8-manipulable.html) || exit 1
rm -rf $T; md5sum $ICI/v9c15p8-template.html $ICI/maquette-pilotage-ordi-v9c15p8-manipulable.html
