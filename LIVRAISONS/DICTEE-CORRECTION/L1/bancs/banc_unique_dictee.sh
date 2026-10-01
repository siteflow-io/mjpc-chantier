#!/bin/bash
# BANC UNIQUE — mandat « L'écran de correction » : rejoue le kit et les bancs des livraisons ; échoue si UN SEUL échoue.
# usage : FICHIER=<livrée> BASE=<6.6.3> CAPTURES=<dossier> bash banc_unique_dictee.sh
cd "$(dirname "$0")"; echec=0; R=/tmp/bu_dictee; mkdir -p $R
etape(){ n=$1; shift; s=$(date +%s); timeout 1500 "$@" > $R/$n.txt 2>&1; c=$?; echo "[$n] code $c — $(( $(date +%s)-s )) s"; return $c; }
etape modes python3 scenarios_modes.py
if grep -q "rouverte : 10 ZZTEST Kilo /10 · · −0" $R/modes.txt || ! grep -q "hub après Enregistrer : \[(0, 'G'), (2, 'L'), (9, 'M')\]" $R/modes.txt; then echo "  ÉCHEC S1 (perte) ou S2"; echec=1; else echo "  OK S1 sans perte, S2 correct"; fi
etape fc1 env NB=5 GRAINE=1 python3 fuzz_correction.py; grep -q "5 copies, 0 bugs" $R/fc1.txt && echo "  OK fuzz_correction graine 1 : 0 bug" || { echo "  ÉCHEC fuzz_correction graine 1"; echec=1; }
etape fc2 env NB=4 GRAINE=2 python3 fuzz_correction.py; grep -q "4 copies, 0 bugs" $R/fc2.txt && echo "  OK fuzz_correction graine 2 : 0 bug" || { echo "  ÉCHEC fuzz_correction graine 2"; echec=1; }
etape fr env NB=3 GRAINE=2 python3 fuzz_rapide.py; grep -q "3 copies, 0 bugs" $R/fr.txt && echo "  OK fuzz_rapide : 0 bug" || { echo "  ÉCHEC fuzz_rapide"; echec=1; }
etape gr python3 scenarios_grille.py; grep -q "erreurs de page : \[\]" $R/gr.txt && echo "  OK grille : 0 erreur de page" || { echo "  ÉCHEC grille"; echec=1; }
for b in $BANCS_LIVRAISONS; do etape $b python3 $b.py && echo "  OK $b" || { echo "  ÉCHEC $b"; echec=1; }; done
etape eleve python3 vue_eleve_dictee.py && echo "  OK vue élève inchangée" || { echo "  ÉCHEC vue élève"; echec=1; }
[ $echec = 0 ] && echo "BANC UNIQUE : VERT (0 échec)" || echo "BANC UNIQUE : ROUGE"; exit $echec
