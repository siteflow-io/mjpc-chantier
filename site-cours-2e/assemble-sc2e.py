#!/usr/bin/env python3
# ══ SITE-COURS-2e — le chapitre déclare, et se résume ══
import re
s=open("index.base.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    s=s.replace(a,n)

# ── ① LA RÉPARATION : les tags d'un item EXISTANT qui n'en a pas ──
sub("""        Object.keys(np.items||{}).forEach(function(k){
          if(m.se.items&&m.se.items[k])return;         /* jamais un item existant */
          var it=JSON.parse(JSON.stringify(np.items[k]));delete it.published;
          ecritures.push({chemin:base+'/'+idx+'/seances/'+m.i+'/items/'+k,val:it,quoi:'\\u00e9l\\u00e9ment \\u00ab '+(it.title||k)+' \\u00bb'});
        });""",
"""        Object.keys(np.items||{}).forEach(function(k){
          var dejaLa=m.se.items&&m.se.items[k];
          if(!dejaLa){
            var it=JSON.parse(JSON.stringify(np.items[k]));delete it.published;
            ecritures.push({chemin:base+'/'+idx+'/seances/'+m.i+'/items/'+k,val:it,quoi:'\\u00e9l\\u00e9ment \\u00ab '+(it.title||k)+' \\u00bb'});
            return;
          }
          /* SITE-COURS-2e — RÉPARATION : un item EXISTANT n'était jamais retouché,
             donc il ne recevait JAMAIS ses notions. Or c'est le cas le plus fréquent.
             « Compléter ne touche à rien » vaut pour ce qui EST écrit : un champ absent
             n'est pas un champ qu'on protège, c'est un champ qu'on remplit.
             Le reste de l'item (titre, kind, source, ref) n'est jamais modifié. */
          var np2=np.items[k]||{};
          if((np2.notions||[]).length&&!((dejaLa.notions)||[]).length)
            ecritures.push({chemin:base+'/'+idx+'/seances/'+m.i+'/items/'+k+'/notions',val:np2.notions,quoi:'notions de l\\u2019\\u00e9l\\u00e9ment \\u00ab '+(np2.title||k)+' \\u00bb'});
          if((np2.competences||[]).length&&!((dejaLa.competences)||[]).length)
            ecritures.push({chemin:base+'/'+idx+'/seances/'+m.i+'/items/'+k+'/competences',val:np2.competences,quoi:'comp\\u00e9tences de l\\u2019\\u00e9l\\u00e9ment \\u00ab '+(np2.title||k)+' \\u00bb'});
        });""")

# ── ② la déclaration du chapitre : écrite par les trois voies ──
sub("""    var cible=(idx!==null)?chaps[idx]:null;
    var ecritures=[];""",
"""    var cible=(idx!==null)?chaps[idx]:null;
    var ecritures=[];
    /* SITE-COURS-2e : la DÉCLARATION du chapitre (entrée, compétences majeures et
       mineures) s'écrit aussi en voie « compléter » — sinon elle ne survivrait qu'au
       remplacement, et l'aval lirait son absence comme une information. */
    if(cible){
      ['entree','competencesMajeures','competencesMineures'].forEach(function(ch2){
        var v=o.chapitre[ch2];
        var vide=(v==null)||(Array.isArray(v)&&!v.length)||(v==='');
        var dejaLa=cible[ch2];
        var dejaRempli=(dejaLa!=null)&&(!Array.isArray(dejaLa)||dejaLa.length);
        if(!vide&&!dejaRempli)
          ecritures.push({chemin:base+'/'+idx+'/'+ch2,val:v,quoi:'d\\u00e9claration du chapitre ('+ch2+')'});
      });
    }""")

# ── ③ LA SECTION ──
ANCRE="""  });
  return o;
}
/* ═══ fin § PROMPT MAÎTRE DE CHAPITRE ═══ */"""
SECTION = r"""
/* ═══════════════════════════════════════════════════════════════════════════
   § CHAPITRE : DÉCLARATION ET SOMMAIRE (SITE-COURS-2e)
   PREMIER MAILLON D'UNE CHAÎNE, pas une étiquette : ce que le chapitre déclare
   ici devient le point d'entrée de la Concordance, du profil longitudinal, du
   conseil et de M20. Les neuf apps portent `notions: []` en attente — c'est le
   chapitre qui saura ce qu'on travaille.
   TROIS APPORTS : ① le chapitre DÉCLARE (entrée du programme, compétences
   majeures et mineures — hiérarchisées, comme le programme du cycle 4 le
   prescrit) ② l'ÉTAT DE L'ANNÉE est généré pour que l'alternance soit fondée
   ③ le SOMMAIRE est CALCULÉ — un sommaire écrit mentirait dès qu'une séance
   change ; celui-ci se recalcule.
   ═══════════════════════════════════════════════════════════════════════════ */
/* Les entrées du programme. 4e et 3e sont ARRÊTÉES (ce que Paul enseigne cette
   année). 6e et 5e restent OUVERTES : une valeur inventée serait pire qu'un vide,
   personne ne saurait qu'il faut la corriger. */
var CH_ENTREES={
  '4e':[{id:'recit',libelle:'R\u00e9cit'},{id:'poesie',libelle:'Po\u00e9sie'},
        {id:'theatre',libelle:'Th\u00e9\u00e2tre'},{id:'discours_essai',libelle:'Discours et essai'}],
  '3e':[{id:'recit',libelle:'R\u00e9cit'},{id:'poesie',libelle:'Po\u00e9sie'},
        {id:'theatre',libelle:'Th\u00e9\u00e2tre'},{id:'articles_essai',libelle:'Articles et essai'}]
};
var CH_ENTREES_OUVERTES="La liste des entr\u00e9es de ce niveau n\u2019est pas encore arr\u00eat\u00e9e : ce que tu \u00e9criras sera accept\u00e9 tel quel, et je te le redemanderai le jour o\u00f9 elle le sera.";
function chEntreesDuNiveau(niv){return CH_ENTREES[String(niv)]||null;}
/* Les compétences du cycle 4, LUES dans la taxonomie (jamais recopiées). */
function chCompetencesC4(taxo){
  var out={};
  (((taxo||{}).competences||{}).francaisC4||[]).forEach(function(b){
    (b.items||[]).forEach(function(i){ if(i.actif!==false)out[i.id]={libelle:i.libelle||i.id,bloc:b.libelle||''}; });
  });
  return out;
}
function chVocabulaireCompetences(taxo){
  var c=chCompetencesC4(taxo),src={};
  Object.keys(c).forEach(function(id){src[id]={libelle:c[id].libelle,note:c[id].bloc};});
  return mjpcPromptVocabulaire(src,{});
}
function chVocabulaireEntrees(niv){
  var l=chEntreesDuNiveau(niv);
  if(!l)return "  (pas encore arr\u00eat\u00e9es pour ce niveau \u2014 propose ce qui te semble juste et dis-le-moi)";
  var src={};l.forEach(function(e){src[e.id]={libelle:e.libelle};});
  return mjpcPromptVocabulaire(src,{});
}

/* ── L'ÉTAT DE L'ANNÉE — GÉNÉRÉ depuis la liste des chapitres du niveau.
   chInventaire regarde UN chapitre ; ici on lit la LISTE, parce que l'alternance
   ne se décide qu'en voyant l'année. Compétences en LIBELLÉ (deux publics). ── */
function chEtatAnnee(chaps,niv,taxo){
  var c=chCompetencesC4(taxo);
  var ents={};(chEntreesDuNiveau(niv)||[]).forEach(function(e){ents[e.id]=e.libelle;});
  var lignes=[],compte={},entrees={};
  (chaps||[]).forEach(function(ch,i){
    if(!ch)return;                                   /* le trou de liste se traverse */
    var maj=(ch.competencesMajeures||[]).map(function(id){return (c[id]&&c[id].libelle)||id;});
    var e=ch.entree?((ents[ch.entree])||ch.entree):null;
    if(e)entrees[e]=(entrees[e]||0)+1;
    (ch.competencesMajeures||[]).forEach(function(id){compte[id]=(compte[id]||0)+1;});
    lignes.push('  \u2022 Chapitre '+(ch.ordre||i)+' \u2014 \u00ab '+(ch.title||'sans titre')+' \u00bb'
      +(e?(' \u00b7 entr\u00e9e : '+e):' \u00b7 entr\u00e9e : (non d\u00e9clar\u00e9e)')
      +(maj.length?(' \u00b7 majeure(s) : '+maj.join(', ')):' \u00b7 majeure(s) : (non d\u00e9clar\u00e9e)'));
  });
  if(!lignes.length)return "  (aucun chapitre d\u00e9clar\u00e9 pour ce niveau)";
  var res=lignes.join('\n');
  var dejaVues=Object.keys(compte).filter(function(id){return compte[id]>=2;})
    .map(function(id){return ((c[id]&&c[id].libelle)||id)+' ('+compte[id]+' fois)';});
  if(dejaVues.length)res+='\n  \u2192 D\u00e9j\u00e0 majeures plusieurs fois : '+dejaVues.join(' \u00b7 ');
  var manquantes=(chEntreesDuNiveau(niv)||[]).filter(function(e){return !entrees[e.libelle];})
    .map(function(e){return e.libelle;});
  if(manquantes.length)res+='\n  \u2192 Entr\u00e9es du programme pas encore abord\u00e9es : '+manquantes.join(', ')+'.';
  return res;
}

/* ── LE SOMMAIRE — CALCULÉ. Séance de rang 0, avec ses items, publiable à part.
   Il doit SE SUFFIRE À LUI-MÊME : à partir de lui seul, on doit pouvoir dire ce
   que le chapitre a travaillé, sans relire les séances. ── */
function chSommaire(chapitre,niv,taxo,ecrit){
  var c=chCompetencesC4(taxo);
  var ents={};(chEntreesDuNiveau(niv)||[]).forEach(function(e){ents[e.id]=e.libelle;});
  var lib=function(id){return (c[id]&&c[id].libelle)||id;};
  var typesLib={};(typeof CH_TYPES_SEANCE!=='undefined'?CH_TYPES_SEANCE:[]).forEach(function(t){typesLib[t.id]=t.libelle;});
  var notions={},plan=[];
  (chapitre.seances||[]).forEach(function(se,i){
    if(!se||se.type==='sommaire')return;              /* le sommaire ne se résume pas lui-même */
    plan.push({rang:(se.ordre!=null?se.ordre:i),titre:se.title||'',type:typesLib[se.type]||se.type||''});
    (se.notions||[]).forEach(function(n){notions[n]=true;});
    Object.keys(se.items||{}).forEach(function(k){
      ((se.items[k]||{}).notions||[]).forEach(function(n){notions[n]=true;});
    });
  });
  return {
    titre:chapitre.title||'',
    entree:chapitre.entree?((ents[chapitre.entree])||chapitre.entree):null,
    majeures:(chapitre.competencesMajeures||[]).map(lib),
    mineures:(chapitre.competencesMineures||[]).map(lib),
    notions:Object.keys(notions),
    plan:plan,
    problematique:(ecrit&&ecrit.problematique)||'',
    aRetenir:(ecrit&&ecrit.aRetenir)||''
  };
}
/* La séance de rang 0 : une séance ORDINAIRE (elle porte des items comme les
   autres), publiable séparément. `published` n'est JAMAIS écrit ici. */
function chSommaireSeance(som){
  var e=atEsc;
  var h='<div class="ch-som">';
  h+='<div class="ch-som-l"><b>Ce que nous travaillons</b></div>';
  if(som.entree)h+='<div class="ch-som-l"><b>Entr\u00e9e du programme :</b> '+e(som.entree)+'</div>';
  if(som.majeures.length)h+='<div class="ch-som-l"><b>Comp\u00e9tence(s) principale(s) :</b> '+som.majeures.map(e).join(' \u00b7 ')+'</div>';
  if(som.mineures.length)h+='<div class="ch-som-l"><b>Aussi travaill\u00e9es :</b> '+som.mineures.map(e).join(' \u00b7 ')+'</div>';
  if(som.problematique)h+='<div class="ch-som-l"><b>Notre question :</b> '+e(som.problematique)+'</div>';
  if(som.plan.length){
    h+='<div class="ch-som-l"><b>Le plan du chapitre</b><ol class="ch-som-plan">';
    som.plan.forEach(function(p){h+='<li>'+e(p.titre)+(p.type?(' <span class="ch-som-type">'+e(p.type)+'</span>'):'')+'</li>';});
    h+='</ol></div>';
  }
  if(som.notions.length)h+='<div class="ch-som-l"><b>Notions rencontr\u00e9es :</b> '+som.notions.map(e).join(' \u00b7 ')+'</div>';
  if(som.aRetenir)h+='<div class="ch-som-l ch-som-ret"><b>\u00c0 retenir :</b> '+e(som.aRetenir)+'</div>';
  return h+'</div>';
}
function chSommaireObjet(som){
  return {title:'Sommaire du chapitre',type:'sommaire',ordre:0,
          resume:som,html:chSommaireSeance(som),items:{}};
}
/* Le sommaire se suffit-il à lui-même pour l'IA du chapitre suivant ?
   Critère : pouvoir dire ce que le chapitre a travaillé SANS relire les séances. */
function chSommaireSuffisant(som){
  var manque=[];
  if(!som.titre)manque.push('le titre');
  if(!som.entree)manque.push('l\u2019entr\u00e9e du programme');
  if(!som.majeures.length)manque.push('la ou les comp\u00e9tences principales');
  if(!som.plan.length)manque.push('le plan des s\u00e9ances');
  return {ok:!manque.length,manque:manque};
}
/* ── LA VALIDATION de la déclaration : motifs ACCUMULÉS, élément CITÉ ── */
function chValiderDeclaration(o,taxo){
  var V=mjpcValidation(8);
  var ch=(o&&o.chapitre)||{};
  var c=chCompetencesC4(taxo);
  var niv=o&&o.niveau;
  var ents=chEntreesDuNiveau(niv);
  if(ch.entree&&ents&&!ents.some(function(e){return e.id===ch.entree;}))
    V.cite('entr\u00e9e \u00ab '+ch.entree+' \u00bb','n\u2019est pas une entr\u00e9e du programme pour ce niveau. Possibles : '+ents.map(function(e){return e.id;}).join(', ')+'.');
  var maj=ch.competencesMajeures||[],min=ch.competencesMineures||[];
  if(ch.competencesMajeures&&!Array.isArray(maj))V.exige(false,'\u00ab competencesMajeures \u00bb doit \u00eatre une liste, m\u00eame s\u2019il n\u2019y en a qu\u2019une.');
  if(ch.competencesMineures&&!Array.isArray(min))V.exige(false,'\u00ab competencesMineures \u00bb doit \u00eatre une liste.');
  (Array.isArray(maj)?maj:[]).concat(Array.isArray(min)?min:[]).forEach(function(id){
    if(!c[id])V.cite('comp\u00e9tence \u00ab '+id+' \u00bb','n\u2019existe pas dans le r\u00e9f\u00e9rentiel du cycle 4. Reprends un identifiant de la liste du prompt.');
  });
  if(Array.isArray(maj)&&Array.isArray(min))maj.forEach(function(id){
    if(min.indexOf(id)>=0)V.cite('comp\u00e9tence \u00ab '+((c[id]&&c[id].libelle)||id)+' \u00bb','est \u00e0 la fois majeure et mineure : il faut choisir.');
  });
  return V;
}
/* ═══ fin § CHAPITRE : DÉCLARATION ET SOMMAIRE ═══ */
"""
sub(ANCRE,ANCRE+SECTION)

# ── ④ les jetons du prompt chapitre ──
sub("""  if(t.indexOf('@@TAXONOMIE@@')>=0)t=t.replace('@@TAXONOMIE@@',chVocabulaireTaxo(CH.taxo));""",
"""  if(t.indexOf('@@TAXONOMIE@@')>=0)t=t.replace('@@TAXONOMIE@@',chVocabulaireTaxo(CH.taxo));
  /* SITE-COURS-2e : la déclaration et l'état de l'année */
  if(t.indexOf('@@ENTREES@@')>=0)t=t.replace('@@ENTREES@@',chVocabulaireEntrees(CH.niveau)+(chEntreesDuNiveau(CH.niveau)?'':'\\n  '+CH_ENTREES_OUVERTES));
  if(t.indexOf('@@COMPETENCES_C4@@')>=0)t=t.replace('@@COMPETENCES_C4@@',chVocabulaireCompetences(CH.taxo));
  if(t.indexOf('@@ETAT_ANNEE@@')>=0)t=t.replace('@@ETAT_ANNEE@@',CH.etatAnnee||'  (\\u00e9tat de l\\u2019ann\\u00e9e non lu)');""")

# ── ⑤ le prompt : la déclaration, l'alternance, le quantitatif ──
sub("""    "TYPES DE S\\u00c9ANCE disponibles (n\\u2019en invente aucun autre) :\\n"+""",
"""    "CE QUE LE CHAPITRE D\\u00c9CLARE \\u2014 tu me le PROPOSES, c\\u2019est MOI qui tranche.\\n"+
    "  \\u2022 son ENTR\\u00c9E du programme (une seule) :\\n@@ENTREES@@\\n"+
    "  \\u2022 sa ou ses COMP\\u00c9TENCES MAJEURES, et ses COMP\\u00c9TENCES MINEURES. Le programme du cycle 4 le dit : "+
    "ces comp\\u00e9tences ne peuvent toutes figurer \\u00e0 \\u00e9galit\\u00e9 dans un seul projet d\\u2019apprentissage \\u2014 on les "+
    "hi\\u00e9rarchise, et on \\u00e9quilibre l\\u2019ensemble sur l\\u2019ann\\u00e9e. Un chapitre = une comp\\u00e9taire majoritaire.\\n"+
    "@@COMPETENCES_C4@@\\n\\n"+
    "L\\u2019\\u00c9TAT DE L\\u2019ANN\\u00c9E \\u2014 ce que j\\u2019ai d\\u00e9j\\u00e0 trait\\u00e9 \\u00e0 ce niveau :\\n@@ETAT_ANNEE@@\\n"+
    "SERS-T\\u2019EN. Propose une ALTERNANCE fond\\u00e9e : ce n\\u2019est pas le type de s\\u00e9ance qui doit varier, c\\u2019est le "+
    "POIDS des comp\\u00e9tences. Un atelier d\\u2019\\u00e9criture reste possible au chapitre 2 \\u2014 mais l\\u2019\\u00e9criture n\\u2019y est "+
    "plus majeure. Signale-moi aussi les MANQUES du quantitatif annuel : 4 \\u0153uvres int\\u00e9grales de genres et "+
    "d\\u2019\\u00e9poques vari\\u00e9es, 3 lectures cursives, 2 groupements de textes, une dizaine de notions litt\\u00e9raires. "+
    "\\u26a0 Je ne d\\u00e9clare nulle part mes \\u0153uvres ni mes cursives : DEMANDE-MOI le d\\u00e9compte, ne le devine pas.\\n\\n"+
    "TYPES DE S\\u00c9ANCE disponibles (n\\u2019en invente aucun autre) :\\n"+""")
# le format de sortie : les trois champs déclarés
sub("""    "  \\"chapitre\\": { \\"title\\": \\"titre du chapitre\\", \\"ordre\\": 3, \\"seances\\": [\\n"+""",
"""    "  \\"chapitre\\": { \\"title\\": \\"titre du chapitre\\", \\"ordre\\": 3,\\n"+
    "    \\"entree\\": \\"identifiant d\\u2019entr\\u00e9e\\", \\"competencesMajeures\\": [\\"identifiant\\"], \\"competencesMineures\\": [\\"identifiant\\"],\\n"+
    "    \\"problematique\\": \\"la question qui tient le chapitre\\", \\"aRetenir\\": \\"ce que l\\u2019\\u00e9l\\u00e8ve doit retenir\\",\\n"+
    "    \\"seances\\": [\\n"+""")

# ── ⑥ l'état de l'année se lit à l'ouverture, la validation s'étend ──
sub("""function chAfficherInventaire(){""",
"""/* SITE-COURS-2e : l'état de l'année, lu pour le niveau visé. */
function chChargerEtatAnnee(cb){
  secuLire('/site/'+CH.niveau+'/chapitres').then(function(chaps){
    CH.etatAnnee=chEtatAnnee(chaps||[],CH.niveau,CH.taxo);
    if(cb)cb(CH.etatAnnee);
  });
}
function chAfficherInventaire(){""")
sub("""  var V=chValiderChapitre(o,CH.taxo);
  if(!V.ok()){""",
"""  var V=chValiderChapitre(o,CH.taxo);
  var V2=chValiderDeclaration(o,CH.taxo);          /* SITE-COURS-2e : les motifs s'ADDITIONNENT */
  if(!V.ok()||!V2.ok()){
    var tous=V.motifs().concat(V2.motifs()).slice(0,8);
    if(msg){msg.className='at-ia-msg at-ia-ko';
      msg.innerHTML='Je ne peux pas utiliser cette r\\u00e9ponse :<ul>'+tous.map(function(x){return '<li>'+atEsc(x)+'</li>';}).join('')+'</ul>';}
    return;
  }
  if(false){""")
sub("""function chOuvrir(){
  if(!secuExigeCle())return;
  AT_IA.produit='chapitre';AT_IA.tpl=null;AT_IA.charge=false;
  chChargerTaxo(function(){ atIAChargerPrompt(function(){ chRendre(); }); });
}""",
"""function chOuvrir(){
  if(!secuExigeCle())return;
  AT_IA.produit='chapitre';AT_IA.tpl=null;AT_IA.charge=false;
  chChargerTaxo(function(){ chChargerEtatAnnee(function(){ atIAChargerPrompt(function(){ chRendre(); }); }); });
}""")
# le changement de niveau recharge l'état de l'année
sub("""onchange="CH.niveau=this.value;chRendre()\"""","""onchange="CH.niveau=this.value;chChargerEtatAnnee(function(){chRendre();})\"""")

# ── ⑦ le sommaire : proposé, coché par défaut, décochable ──
sub("""    h+='<div class="ch-choix"><div class="at-ia-choix-lib">Que veux-tu faire ?</div><div class="at-ia-actions">'""",
"""    /* SITE-COURS-2e : le sommaire, proposé et COCHÉ — mais montré, jamais écrit en douce. */
    var som=chSommaire(o.chapitre,CH.niveau,CH.taxo,o.chapitre);
    var suf=chSommaireSuffisant(som);
    h+='<div class="ch-som-bloc"><label class="ch-som-case"><input type="checkbox" id="ch-som-oui" checked> '
      +'<b>Cr\\u00e9er la feuille sommaire</b> (s\\u00e9ance de rang 0, non publi\\u00e9e)</label>'
      +'<div class="ch-som-apercu">'+chSommaireSeance(som)+'</div>'
      +(suf.ok
        ? '<p class="ch-vide">Ce sommaire se suffit \\u00e0 lui-m\\u00eame : il dit ce que le chapitre travaille sans qu\\u2019on relise les s\\u00e9ances.</p>'
        : '<p class="ch-vide">\\u26a0 Il manque \\u00e0 ce sommaire : '+suf.manque.map(atEsc).join(', ')+'. Il sera cr\\u00e9\\u00e9 quand m\\u00eame, mais le chapitre suivant en saura moins.</p>')
      +'</div>';
    h+='<div class="ch-choix"><div class="at-ia-choix-lib">Que veux-tu faire ?</div><div class="at-ia-actions">'""")
# l'écriture du sommaire, dans les trois voies
sub("""    if(!ecritures.length){dire('Rien \\u00e0 ajouter : tout ce que l\\u2019IA propose existe d\\u00e9j\\u00e0.',true);return;}""",
"""    /* SITE-COURS-2e : la feuille sommaire, si Paul l'a laissée cochée. Séance de
       rang 0, publiable à part — `published` n'est JAMAIS écrit ici. */
    var veutSom=(document.getElementById('ch-som-oui')||{}).checked;
    if(veutSom&&cible){
      var dejaSom=(cible.seances||[]).some(function(se){return se&&se.type==='sommaire';});
      var rangSom=dejaSom?((cible.seances||[]).map(function(se,i2){return se&&se.type==='sommaire'?i2:-1;}).filter(function(x){return x>=0;})[0]):((cible.seances||[]).length+ecritures.filter(function(e){return e.quoi.indexOf('s\\u00e9ance')===0;}).length);
      var somObj=chSommaireObjet(chSommaire(Object.assign({},cible,o.chapitre),CH.niveau,CH.taxo,o.chapitre));
      ecritures.push({chemin:base+'/'+idx+'/seances/'+rangSom,val:somObj,quoi:'feuille sommaire'});
    }
    if(!ecritures.length){dire('Rien \\u00e0 ajouter : tout ce que l\\u2019IA propose existe d\\u00e9j\\u00e0.',true);return;}""")

# ── ⑧ CSS ──
CSS="""<style>
/* ═══ § CHAPITRE : DÉCLARATION ET SOMMAIRE (SITE-COURS-2e) ═══ */
.ch-som-bloc{margin-top:14px;border:1px solid rgba(0,0,0,.2);border-radius:12px;padding:12px}
.ch-som-case{display:flex;align-items:center;gap:8px;min-height:44px;font-size:.95rem}
.ch-som-case input{width:20px;height:20px}
.ch-som-apercu{margin-top:8px}
.ch-som{border:1px solid rgba(0,0,0,.18);border-radius:10px;padding:12px;background:rgba(255,255,255,.6)}
.ch-som-l{margin:6px 0;font-size:.93rem;line-height:1.55}
.ch-som-plan{margin:6px 0 0 18px}
.ch-som-plan li{margin:3px 0}
.ch-som-type{font-size:.78rem;opacity:.7}
.ch-som-ret{border-top:1px solid rgba(0,0,0,.12);padding-top:8px;margin-top:10px}
@media (max-width:480px){.ch-som{padding:10px}.ch-som-l{font-size:.9rem}}
@media print{
  .ch-som{border:1px solid #999;background:#fff;break-inside:avoid;page-break-inside:avoid}
  .ch-som-case,.ch-som-bloc{border:0;padding:0}
  .ch-som-case input{display:none}
}
/* ═══ fin § CHAPITRE : DÉCLARATION ET SOMMAIRE ═══ */
</style>
"""
m=re.search(r'^<body[\s>]',s,re.M)
s=s[:m.start()]+CSS+s[m.start():]
sub('var APP_VERSION="8.14.0"','var APP_VERSION="8.15.0"')
open("index.staging.html","w",encoding='utf-8').write(s)
print(f"écrit : {len(s)} car.")
