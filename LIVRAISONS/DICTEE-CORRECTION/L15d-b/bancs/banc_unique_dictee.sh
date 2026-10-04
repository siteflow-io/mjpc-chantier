#!/bin/bash
# BANC UNIQUE — mandat « L'écran de correction » : rejoue le kit et les bancs des livraisons ; échoue si UN SEUL échoue.
# Une commande : FICHIER=<livrée> BASE=<6.6.3> BANCS_LIVRAISONS="banc_L1_geste …" bash banc_unique_dictee.sh
# (en tranches, si l'environnement limite la durée d'une commande : ETAPES="modes fc1" …, puis ETAPES=bilan)
cd "$(dirname "$0")"; R=${R:-/tmp/bu_dictee}; mkdir -p $R
TOUTES="modes fc1 fc2 fr gr $BANCS_LIVRAISONS eleve"; ETAPES=${ETAPES:-"$TOUTES bilan"}
lance(){ n=$1; shift; s=$(date +%s); timeout 1500 "$@" > $R/$n.txt 2>&1; echo $? > $R/$n.code; echo "[$n] code $(cat $R/$n.code) — $(( $(date +%s)-s )) s"; }
verdict(){ n=$1; case $n in
  modes) ! grep -q "rouverte : 10 ZZTEST Kilo /10 · · −0" $R/modes.txt && grep -q "hub après Enregistrer : \[(0, 'G'), (2, 'L'), (9, 'M')\]" $R/modes.txt && ! grep -q "après ⇧R : 0 err" $R/modes.txt ;;
  fc1) grep -q "5 copies, 0 bugs" $R/fc1.txt ;; fc2) grep -q "4 copies, 0 bugs" $R/fc2.txt ;; fr) grep -q "3 copies, 0 bugs" $R/fr.txt ;;
  gr) grep -q "erreurs de page : \[\]" $R/gr.txt ;; *) [ "$(cat $R/$n.code 2>/dev/null)" = 0 ] ;; esac; }
for e in $ETAPES; do case $e in
  modes) lance modes python3 scenarios_modes.py ;; fc1) lance fc1 env NB=5 GRAINE=1 python3 fuzz_correction.py ;;
  fc2) lance fc2 env NB=4 GRAINE=2 python3 fuzz_correction.py ;; fr) lance fr env NB=3 GRAINE=2 python3 fuzz_rapide.py ;;
  gr) lance gr python3 scenarios_grille.py ;; eleve) lance eleve python3 vue_eleve_dictee.py ;;
  bilan) echec=0; for n in $TOUTES; do if verdict $n; then echo "  OK    $n"; else echo "  ÉCHEC $n"; echec=1; fi; done
         [ $echec = 0 ] && echo "BANC UNIQUE : VERT (0 échec)" || echo "BANC UNIQUE : ROUGE"; exit $echec ;;
  *) lance $e python3 $e.py ;; esac; done
