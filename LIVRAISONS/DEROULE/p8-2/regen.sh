#!/bin/sh
# régénère le gabarit p8-2 (patch sur le gabarit p7) puis la maquette (générateur T159, bloc de données de la v9c13)
ICI=$(cd "$(dirname "$0")" && pwd); P=$ICI/../../../TRANSCRIPTS/C12/pieces; T=$(mktemp -d)
mkdir -p $T/vis $T/C12 && cp $P/T142-v9c13-template.html $T/vis/v9c13-template.html && cp $P/T280-maquette-v9c13-courante.html $T/C12/maquette-v9c13-courante.html
python3 $ICI/patch-p8-2.py $P/T265-v9c15p7-template.html $ICI/p8-moteur.js $ICI/v9c15p8-2-template.html || exit 1
(cd $T && python3 $P/T159-gen-par-difference.py $ICI/v9c15p8-2-template.html $ICI/maquette-pilotage-ordi-v9c15p8-2-manipulable.html) || exit 1
rm -rf $T; md5sum $ICI/v9c15p8-2-template.html $ICI/maquette-pilotage-ordi-v9c15p8-2-manipulable.html
