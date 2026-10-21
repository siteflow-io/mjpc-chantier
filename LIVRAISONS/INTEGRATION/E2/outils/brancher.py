# LE BRANCHEMENT D'E2 DANS index.html — les fonctions du site que le contrat §6 m'attribue, rebranchées sur `dr-classe.js`.
# usage : python3 brancher.py <index.html> [--ecrire]      (sans --ecrire : dit ce qu'il ferait, n'écrit rien)
# Tout se fait PAR LE NOM de la fonction (fonctions.py), jamais par un numéro de ligne. Chaque changement est rapporté :
# nom, taille avant → après (pour la NOTE). Une fonction déjà rebranchée (elle porte « [E2] ») n'est pas touchée deux fois.
import sys, re
from fonctions import plage, remplacer, retirer
F = sys.argv[1]; ECRIRE = '--ecrire' in sys.argv
t = open(F, encoding='utf-8').read(); rapport = []

def neuf(nom, src):
    global t
    L = t.split('\n'); a, b = plage(L, nom)
    if '[E2]' in '\n'.join(L[a:b+1]): rapport.append('%-26s déjà rebranchée' % nom); return
    t, (n, o) = remplacer(t, nom, src); rapport.append('%-26s %5d o → %5d o  (rebranchée)' % (nom, o, len(src.rstrip('\n'))))
def tombe(nom):
    global t
    try: t, o = retirer(t, nom); rapport.append('%-26s %5d o → tombe' % (nom, o))
    except SystemExit as e: rapport.append('%-26s absente (%s)' % (nom, e))

# ── la porte : l'emploi du temps ─────────────────────────────────────────────────────────────────────────────────────
t2 = re.sub(r"var EDT_PILOTAGE_ELEMENTS=\[[^\]]*\];", "var EDT_PILOTAGE_ELEMENTS=['dr-zone','mur','volet'];   /* [E2] les ids du bloc du déroulé (contrat §7) — avant : at-dr-classe, at-dr-creneau, at-dr-debut, at-dr-tete, at-zone */", t, count=1)
rapport.append('EDT_PILOTAGE_ELEMENTS      ' + ('rebranché' if t2 != t else 'déjà rebranché ou absent')); t = t2
neuf('edtLancer', r'''function edtLancer(cle,preparer){
  /* [E2] « ▶ Ouvrir le pilotage et lancer » et « Préparer » : le premier temps est celui d'aujourd'hui (la séance visée,
     les classes et les chapitres chargés, le chapitre ouvert sur la séance) ; le second appelle `dr_lancer` avec la classe,
     le créneau et le NUMÉRO D'HEURE DE LA CASE (`edtCellule(cle).heure`, « heure 1 sur 3 » — audit E2, F1). « Préparer »
     s'arrête à l'Atelier : rien n'est lancé, rien n'est écrit (cadrage 4 §0.3). La séance visée garde le critère d'aujourd'hui
     (la première non jouée) : audit E2, F2, en attente de la conscience. */
  var c=edtCellule(cle); if(!c||!c.classeMjpc)return;
  var niv=edtNiveauDe(c.classeMjpc), l=EDT_CHAP[niv]||[];
  var vise=null;
  for(var i=0;i<l.length&&!vise;i++){
    if((l[i].fil||null)!==(c.fil||null))continue;
    var pub=false; try{ pub=isPubFor(l[i],c.classeMjpc); }catch(e){}
    if(!pub)continue;
    var se=edtListe(l[i].seances);
    for(var k=0;k<se.length&&!vise;k++){
      if(!edtSeanceJouee(se[k],c.classeMjpc))vise={ch:l[i],snum:String(se[k].__i)};
    }
  }
  if(!vise){ edtRienDePret(c); return; }
  edtFermer(); edtModaleFermer();
  try{
    loadClasses(function(){
      atChargerChapitres(niv,function(){
        try{
          try{ atelierOuvrir(); }catch(eo){}   /* dette 12 · 05 : le cours tournait, l'écran restait sur le panneau prof — l'atelier s'ouvre, le Pilotage se voit */
          atEditerChapitre(niv,vise.ch.__cle);
          ATVUES.snum=vise.snum;
          atVuesAller(preparer?'atelier':'pilotage');
        }catch(e){ if(typeof atInfo==='function')atInfo('Le pilotage ne s’ouvre pas : '+e.message+' — ouvre l’atelier.'); return; }
        edtQuandPilotagePret(function(manque){
          if(manque){ if(typeof atInfo==='function')atInfo('Pilotage indisponible — ouvre l’atelier. (manque : '+manque+')'); return; }
          if(preparer)return;
          try{ dr_lancer(dr_slugDe(c.classeMjpc), c.creneau, dr_debutPropose(c.creneau), c.heure||1); }catch(e2){ if(typeof atInfo==='function')atInfo('Le lancement a échoué : '+e2.message); }
        });
      });
    });
  }catch(e0){ if(typeof atInfo==='function')atInfo('Le pilotage ne s’ouvre pas : '+e0.message+' — ouvre l’atelier.'); }
}''')
neuf('edtQuandPilotagePret', r'''function edtQuandPilotagePret(apres,essai){
  /* [E2] sonde bornée : la zone du déroulé, son mur et son volet, et le déroulé monté (`window.dr`, contrat §5) — avant : `window.DR` */
  essai=essai||0;
  var manque=EDT_PILOTAGE_ELEMENTS.filter(function(id){return !document.getElementById(id);});
  var moteur=false; try{ moteur=!!window.dr; }catch(e){}
  if(!manque.length&&moteur){ apres(null); return; }
  if(essai>=30){ apres((manque.join(', ')||'le déroulé')); return; }
  setTimeout(function(){ edtQuandPilotagePret(apres,essai+1); },150);
}''')
# « Préparer » sur la case : un second bouton, à côté de « ▶ Ouvrir le pilotage et lancer »
LANCER = "h+='<button class=\"edt-btn edt-btn-prim edt-large\" onclick=\"edtLancer('+JSON.stringify(cle).replace(/\"/g,'&quot;')+')\">\\u25b6 Ouvrir le pilotage et lancer</button>';"
if LANCER in t and 'data-preparer' not in t:
    t = t.replace(LANCER, LANCER + "\n      h+='<button class=\"edt-btn edt-large\" data-preparer=\"1\" title=\"Ouvre l\\u2019Atelier sur cette séance pour la préparer : rien n\\u2019est lancé, rien n\\u2019est projeté, la classe ne voit rien.\" onclick=\"edtLancer('+JSON.stringify(cle).replace(/\"/g,'&quot;')+',true)\">\\u270e Préparer</button>';   /* [E2] cadrage 4 §0.3 */", 1)
    rapport.append('edtPeindreModale           « Préparer » ajouté')
else: rapport.append('edtPeindreModale           « Préparer » : ' + ('déjà là' if 'data-preparer' in t else 'LIGNE DU BOUTON INTROUVABLE'))

# ── l'heure : le lancement, la trace, la clôture, le pointeur — rebranchés sur dr-classe.js (les noms restent, pour tout appelant) ──
neuf('_drCloreHeureRestee', "function _drCloreHeureRestee(slugNeuf,nomNeuf){ dr_cloreHeureRestee(slugNeuf,nomNeuf); }   /* [E2] par dr_lire / dr_ecrire (13 · 25) */")
neuf('_drCoursActifEffacerSi', "function _drCoursActifEffacerSi(sig){ dr_coursActifEffacerSi(sig); }   /* [E2] par dr_lire / dr_ecrire (13 · 25) */")
neuf('_drHeureCloseAu', "function _drHeureCloseAu(c,cb){ var base=_drBaseHeureDe(c,c&&c.ts); if(!base){ cb(false); return; } dr_lire(base.replace(FIREBASE_BASE,'')+'/clos',function(v){ cb(v===true); }); }   /* [E2] par dr_lire : le mode test lit sa copie */")
neuf('_drPaquetHeure', "function _drPaquetHeure(clos){ return dr_paquetHeure(clos); }   /* [E2] composé depuis le journal */")
neuf('_drTraceAuto', "function _drTraceAuto(){ dr_traceAuto(); }   /* [E2] */")
neuf('_drTraceReprendre', "function _drTraceReprendre(){ dr_traceReprendre(); }   /* [E2] */")
neuf('_drCopieAuto', "function _drCopieAuto(){ dr_copieAuto(); }   /* [E2] */")
neuf('sesCoursEcrire', "function sesCoursEcrire(){ dr_coursEcrire(); }   /* [E2] par dr_ecrire (13 · 25) ; la scène neuve est celle d'E3 */")
neuf('sesCoursFermer', "function sesCoursFermer(){ dr_coursFermer(); sesArreter(); }   /* [E2] par dr_ecrire (13 · 25) */")
neuf('sesReprisePoser', r'''function sesReprisePoser(){
  /* [E2] la bannière « un cours est en cours » d'aujourd'hui, lue par `dr_lire` (13 · 25 : en test, la copie) */
  if(SES.mode)return;
  setInterval(function(){
    var prof=document.body.classList.contains('admin-mode')||(window.TRACK&&TRACK.eleve&&TRACK.eleve.is_prof);
    if(!prof){ sesRepriseRetirer(); return; }
    if(SES.actif||(typeof AT_DR_REGIME!=='undefined'&&AT_DR_REGIME==='classe')){ sesRepriseRetirer(); return; }   /* c'est déjà nous */
    dr_lire('/site/cours_actif',function(c){
      if(!c||!c.ts||(Date.now()-c.ts)>4*3600*1000){ sesRepriseRetirer(); return; }
      if(SES._repriseTue&&SES._repriseTue===_drSignatureCours(c))return;
      _drHeureCloseAu(c,function(close){ if(close){ sesRepriseRetirer(); return; } sesReprisePeindre(c); });
    });
  },5000);
}''')
neuf('sesReprendre', r'''function sesReprendre(){
  /* [E2] « Reprendre le cours » : le pointeur et la trace font foi (comme aujourd'hui), puis `dr_reprendre` remonte L'HEURE
     ENTIÈRE — la diapo, les dévoilements, le chrono, les décisions, les paroles, les notes — et le paquet repart (audit E2, M1 :
     aujourd'hui `AT_DR_VECU` restait nul et l'heure n'avait plus de trace). */
  var c=SES._reprise; if(!c)return;
  dr_lire('/site/cours_actif',function(p){
    if(!p||!p.ts||_drSignatureCours(p)!==_drSignatureCours(c)){ sesRepriseRetirer();
      atInfo('Ce cours n’est plus celui qui tourne : il a été clos ou remplacé par un autre. Rien n’est repris.'); return; }
    _drHeureCloseAu(c,function(close){
      if(close){ sesRepriseRetirer(); atInfo('Cette heure a été close : elle ne se reprend pas. Lance la classe pour ouvrir une heure neuve.'); return; }
      sesRepriseRetirer();
      atelierOuvrir();
      atChargerChapitres(c.niveau,function(){
        atEditerChapitre(c.niveau,c.chapitre);
        ATVUES.snum=c.seance;
        AT_DR_COURS={debut:c.debut,fin:c.fin,classeSlug:c.classeSlug,classeNom:c.classeNom};
        AT_DR_REGIME='classe';
        atVuesAller('pilotage');
        edtQuandPilotagePret(function(manque){
          if(manque){ atInfo('Le pilotage ne s’ouvre pas (manque : '+manque+').'); return; }
          dr_reprendre(function(ok){ if(!ok) atInfo('L’état de cette heure n’est pas au hub : relance-la depuis l’emploi du temps, sa trace sera reprise.'); });
        });
      });
    });
  });
}''')

# ── ce qui tombe (contrat §6, colonne E2) ──
for nom in ['atDrJouerClic', 'atDrClore', 'atDrCloreFin', 'atDrClotureModale', 'atDrSuiviAppliquer',
            'atVecuAfficher', 'atVecuDemarrer', 'atVecuEntrer', 'atVecuSortir', 'atVecuMinutes', 'atVecuEcrire',
            'atT5Reste', 'atT5Etat', 'atT5Zone', 'atT5Appliquer', 'atT5Appel', 'atT5Restantes', 'atT5Modale', 'atT5Choix', 'atT5Veille',
            '_drVifInstaller', '_drVifAller', '_drPaletteOuvrir', '_drPaletteBrancher', 'sesBrancherPilote', 'sesAppliquer', 'sesPollPilote', 'atDrMajUtile']:
    tombe(nom)

# les variables d'état du vécu et du T-5 d'aujourd'hui (le vécu est le journal, le T-5 la fin de l'heure de la maquette)
for v in [r"var AT_T5_VU=false;\n", r"var AT_T5_CHOIX=\{\}, AT_T5_TIMER=null;\n", r"var AT_DR_VECU=null;[^\n]*\n"]:
    t2 = re.sub(v, '', t, count=1); rapport.append('%-26s %s' % (v.split('=')[0].replace('var ', '').replace('\\', ''), 'tombe' if t2 != t else 'absente')); t = t2
# ── ce qui reste appelé après la chute : dit, jamais caché ──
for nom in ['atDrJouerClic', 'atDrClore', 'atDrCloreFin', 'atVecu', 'atT5', 'AT_DR_VECU', 'AT_T5_CHOIX', 'AT_T5_TIMER', '_drVif', '_drPalette', 'sesBrancherPilote', 'sesAppliquer', 'atDrSuiviAppliquer', 'atDrClotureModale', 'sesPut(']:
    n = len(re.findall(re.escape(nom), t))
    if n: rapport.append('  reste %-22s %d occurrence(s) : %s' % (nom, n, ' | '.join(sorted(set(m.group(0) for m in re.finditer(r'[^\n]{0,30}' + re.escape(nom) + r'[^\n]{0,30}', t)))[:4])))

print('\n'.join(rapport))
if ECRIRE: open(F, 'w', encoding='utf-8').write(t); print('— écrit :', F)
else: print('— rien écrit (ajouter --ecrire)')
