#!/usr/bin/env python3
# ══ SITE-COURS-2c — index.html : le prompt maître de CHAPITRE ══
import re
s=open("index.base.html",encoding='utf-8').read()

def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    s=s.replace(a,n)

# ── 0. LE SOCLE : index.html embarque le canon 1.3.0 (mesuré) — il n'a jamais
#      reçu la §12 (SITE-COURS-2a est antérieur à M-PROMPT-1), et ce morceau en
#      dépend. ⚠ PARTICULARITÉ D'index.html : la pastille APP_VERSION et son
#      en-tête sont INSÉRÉS AU MILIEU du socle embarqué (entre §9 et §11) —
#      remplacer le socle en bloc les supprimerait. On AJOUTE donc la §12 seule,
#      verbatim, sans toucher à une ligne du reste.
CANON=open('canon.js',encoding='utf-8').read()
_i12=CANON.index('// ── 12. Zone prompt IA')
_f12=CANON.index('var MJPC_CORE_VERSION="1.4.0";')
SECTION12=CANON[_i12:_f12]
_anc='var MJPC_CORE_VERSION="1.3.0";'
assert s.count(_anc)==1
s=s.replace(_anc,SECTION12+'var MJPC_CORE_VERSION="1.4.0";')

# ── 1. LA PREUVE « ajouter un produit = une entrée de plus » : le seed du chapitre ──
sub("""var ATELIER_PROMPT_SEED={
  fiche_seance:""",
"""var ATELIER_PROMPT_SEED={
  /* SITE-COURS-2c : le CHAPITRE — une entrée de plus, la mécanique de la fiche
     de séance n'est pas touchée (atPromptTexte, atIAChargerPrompt, l'édition et
     la persistance sont partagées telles quelles). */
  chapitre:
    "Tu vas m\\u2019aider \\u00e0 mettre en forme un CHAPITRE de mon cours de fran\\u00e7ais au coll\\u00e8ge.\\n\\n"+
    "CE QUE JE T\\u2019APPORTE, ET CE QUE TU FAIS : la progression vient de MOI. Tu ne l\\u2019inventes pas : "+
    "tu la structures, tu la tagues, et tu me signales ses trous.\\n\\n"+
    "NE PRODUIS AUCUN JSON TOUT DE SUITE.\\n"+
    "Commence par une discussion de cadrage, un point \\u00e0 la fois. Proc\\u00e8de par allers-retours : "+
    "reformule, propose, mais attends mes validations. Demande-moi d\\u2019abord :\\n"+
    "  1. de quels documents je dispose pour ce chapitre (textes, diaporamas, fiches, \\u00e9valuations d\\u00e9j\\u00e0 faites) ;\\n"+
    "  2. le niveau, le titre du chapitre et son rang dans l\\u2019ann\\u00e9e ;\\n"+
    "  3. l\\u2019\\u0153uvre ou le corpus, et la probl\\u00e9matique ;\\n"+
    "  4. ce qui existe d\\u00e9j\\u00e0 s\\u00e9ance par s\\u00e9ance, et ce qui manque ;\\n"+
    "  5. les travaux d\\u2019\\u00e9l\\u00e8ves pr\\u00e9vus (dict\\u00e9e, r\\u00e9\\u00e9criture, \\u00e9tude de texte, r\\u00e9daction, QCM) et \\u00e0 quel moment.\\n\\n"+
    "MISE EN COH\\u00c9RENCE \\u2014 c\\u2019est le c\\u0153ur de ton travail. Signale-moi, en le disant clairement :\\n"+
    "  \\u2022 une s\\u00e9ance sans aucune comp\\u00e9tence travaill\\u00e9e ;\\n"+
    "  \\u2022 une notion qui d\\u00e9borde des attendus du niveau (chaque notion porte ses niveaux entre crochets) ;\\n"+
    "  \\u2022 un trou dans la progression (une notion annonc\\u00e9e nulle part reprise, une \\u00e9tape qui saute) ;\\n"+
    "  \\u2022 un doublon (deux s\\u00e9ances qui font la m\\u00eame chose).\\n"+
    "Ces signalements, tu me les donnes EN DISCUSSION, pas dans le JSON.\\n\\n"+
    "TYPES DE S\\u00c9ANCE disponibles (n\\u2019en invente aucun autre) :\\n"+
    "@@TYPES_SEANCE@@\\n\\n"+
    "NOTIONS ET COMP\\u00c9TENCES \\u2014 tu ne peux utiliser QUE les identifiants de la liste ci-dessous, "+
    "exactement orthographi\\u00e9s. N\\u2019en invente aucun. Entre crochets, les niveaux o\\u00f9 la notion est attendue.\\n"+
    "@@TAXONOMIE@@\\n\\n"+
    "QUAND, ET SEULEMENT QUAND, JE TE DIS \\u00ab produis le JSON \\u00bb, tu produis un objet JSON SEUL, "+
    "sans commentaire ni texte autour, sans balises de code, \\u00e0 ce format :\\n"+
    "{\\n"+
    "  \\"produit\\": \\"chapitre\\",\\n"+
    "  \\"niveau\\": \\"3e\\",\\n"+
    "  \\"chapitre\\": { \\"title\\": \\"titre du chapitre\\", \\"ordre\\": 3, \\"seances\\": [\\n"+
    "    { \\"title\\": \\"titre de la s\\u00e9ance\\", \\"type\\": \\"etude_texte\\", \\"ordre\\": 2,\\n"+
    "      \\"notions\\": [\\"identifiant\\"], \\"competences\\": [\\"identifiant\\"],\\n"+
    "      \\"items\\": { \\"cle-courte\\": { \\"title\\": \\"\\u2026\\", \\"subtitle\\": \\"\\u2026\\", \\"kind\\": \\"doc\\",\\n"+
    "          \\"source\\": \\"drive\\", \\"ref\\": \\"\\", \\"ordre\\": 1, \\"icon\\": \\"\\ud83d\\udcc4\\",\\n"+
    "          \\"notions\\": [\\"identifiant\\"], \\"competences\\": [\\"identifiant\\"] } } } ] },\\n"+
    "  \\"aLier\\": [ { \\"seance\\": \\"titre de la s\\u00e9ance\\", \\"item\\": \\"cle-courte\\", \\"outil\\": \\"dictee\\", \\"pourquoi\\": \\"\\u2026\\" } ]\\n"+
    "}\\n"+
    "R\\u00e8gles du JSON, imp\\u00e9ratives :\\n"+
    "  \\u2022 \\"kind\\" vaut doc, dictee, reecriture, analyse_logique, qcm ou tache ; \\"source\\" vaut drive, html, external ou firebase_app.\\n"+
    "  \\u2022 un travail \\u00e0 faire dans une autre application se d\\u00e9clare \\"source\\": \\"firebase_app\\" avec \\"ref\\": \\"\\" "+
    "et une phrase de sous-titre disant \\u00e0 quoi le lier ; ajoute-le AUSSI dans \\"aLier\\".\\n"+
    "  \\u2022 tu n\\u2019\\u00e9cris JAMAIS \\"published\\" : la publication est mon geste, pas le tien.\\n"+
    "  \\u2022 les cl\\u00e9s d\\u2019items sont courtes, en minuscules, sans accent ni espace (ex. \\"etude-de-texte\\").\\n",
  fiche_seance:""")

# ── 2. LA SECTION, collée après la zone existante (même portée, top-level) ──
# l'ancre existe DEUX fois (CSS et JS) — piège de portée : on vise celle du JS,
# identifiée par la ligne qui la précède (fin de atIARemplacerConfirme).
ANCRE="""  });
}
/* ═══ fin § ZONE PROMPT IA ═══ */"""
SECTION = r"""
/* ═══════════════════════════════════════════════════════════════════════════
   § PROMPT MAÎTRE DE CHAPITRE (SITE-COURS-2c) — le second produit de la zone.
   PREUVE DE L'ARCHITECTURE : le chapitre s'ajoute par UNE entrée de plus dans
   ATELIER_PROMPT_SEED et une source de vocabulaire ; atPromptTexte,
   atIAChargerPrompt, l'édition et la persistance sont partagées SANS RETOUCHE.
   La progression vient de Paul : l'IA structure, tague et signale les trous.
   La taxonomie (154 notions, 5 domaines, 40 familles + les compétences) est
   GÉNÉRÉE depuis /taxonomie, jamais recopiée — et donnée ENTIÈRE : 10 900 c.,
   moins que le prompt de worktrack, et borner priverait Paul du spiralaire.
   L'injection ÉCRIT PAR INDEX (/site/<niveau>/chapitres/<i>/…), jamais la liste
   entière : la réécrire ferait disparaître le trou d'index 0 et décalerait les
   neuf chapitres d'un rang, donc tous les `ordre` et les liens qui en dépendent.
   `published` n'est JAMAIS écrit : publier reste le geste de Paul.
   ═══════════════════════════════════════════════════════════════════════════ */
var CH_TYPES_SEANCE=[
  {id:'intro_image',libelle:'Introduction et analyse d\u2019image'},
  {id:'etude_texte',libelle:'\u00c9tude de texte'},
  {id:'notions',libelle:'Le\u00e7on de notions'},
  {id:'dictee_reecriture',libelle:'Dict\u00e9e et r\u00e9\u00e9criture'},
  {id:'atelier_ecriture',libelle:'Atelier d\u2019\u00e9criture'},
  {id:'remediation',libelle:'Rem\u00e9diation'},
  {id:'tache_finale',libelle:'T\u00e2che finale'}
];
var CH_KINDS=['doc','dictee','reecriture','analyse_logique','qcm','tache'];
var CH_SOURCES=['drive','html','external','firebase_app'];
var CH={taxo:null,niveau:'3e',chapIdx:null,json:null,inventaire:null,voie:null};

/* Le vocabulaire de la taxonomie, GÉNÉRÉ (mjpcPromptVocabulaire du canon §12).
   Chaque notion porte ses niveaux entre crochets : l'IA peut signaler elle-même
   un débordement d'attendus. Les notions inactives sont exclues. */
function chVocabulaireTaxo(taxo){
  if(!taxo)return '(taxonomie indisponible)';
  var out=[];
  (taxo.domaines||[]).forEach(function(dom){
    var src={};
    (dom.familles||[]).forEach(function(f){
      (f.notions||[]).forEach(function(n){
        if(n.actif===false)return;                       /* réservées/inactives exclues */
        src[n.id]={libelle:n.libelleProf||n.libelleEleve||'',note:(n.niveaux?String(n.niveaux):'')};
      });
    });
    if(!Object.keys(src).length)return;
    out.push('### '+(dom.libelle||dom.id));
    out.push(mjpcPromptVocabulaire(src,{}));
  });
  var comp={};
  ['francaisC4','transversales'].forEach(function(bloc){
    ((taxo.competences||{})[bloc]||[]).forEach(function(b){
      (b.items||[]).forEach(function(i){
        if(i.actif===false)return;
        comp[i.id]={libelle:i.libelle||''};
      });
    });
  });
  if(Object.keys(comp).length){
    out.push('### Comp\u00e9tences');
    out.push(mjpcPromptVocabulaire(comp,{}));
  }
  return out.join('\n');
}
function chVocabulaireTypes(){
  var src={};CH_TYPES_SEANCE.forEach(function(t){src[t.id]={libelle:t.libelle};});
  return mjpcPromptVocabulaire(src,{});
}
/* Les identifiants valides, à plat — pour refuser une notion inventée EN LA NOMMANT. */
function chIdsTaxo(taxo){
  var n={},c={};
  ((taxo||{}).domaines||[]).forEach(function(dom){
    (dom.familles||[]).forEach(function(f){(f.notions||[]).forEach(function(x){n[x.id]=x.libelleProf||x.libelleEleve||x.id;});});
  });
  ['francaisC4','transversales'].forEach(function(bloc){
    (((taxo||{}).competences||{})[bloc]||[]).forEach(function(b){(b.items||[]).forEach(function(i){c[i.id]=i.libelle||i.id;});});
  });
  return {notions:n,competences:c};
}
function chChargerTaxo(cb){
  if(CH.taxo){cb(CH.taxo);return;}
  secuLire('/taxonomie').then(function(v){CH.taxo=v||null;cb(CH.taxo);});
}

/* LA VALIDATION — motifs ACCUMULÉS, élément CITÉ, message qui dit quoi corriger. */
function chValiderChapitre(o,taxo){
  var V=mjpcValidation(8);
  var ids=chIdsTaxo(taxo);
  if(!o||typeof o!=='object'||Array.isArray(o)){V.exige(false,'La r\u00e9ponse doit \u00eatre un chapitre complet.');return V;}
  V.exige(o.chapitre&&o.chapitre.title,'Il manque le titre du chapitre.');
  V.exige(o.niveau&&/^[3-6]e$/.test(String(o.niveau)),'Il manque le niveau (6e, 5e, 4e ou 3e).');
  var ses=(o.chapitre&&o.chapitre.seances)||[];
  V.exige(Array.isArray(ses)&&ses.length,'Il manque les s\u00e9ances (une liste non vide).');
  function verifTags(objet,ref){
    (objet.notions||[]).forEach(function(id){
      if(!ids.notions[id])V.cite(ref,'utilise une notion qui n\u2019existe pas (\u00ab '+id+' \u00bb). Reprends un identifiant de la liste du prompt.');
    });
    (objet.competences||[]).forEach(function(id){
      if(!ids.competences[id])V.cite(ref,'utilise une comp\u00e9tence qui n\u2019existe pas (\u00ab '+id+' \u00bb). Reprends un identifiant de la liste du prompt.');
    });
  }
  (Array.isArray(ses)?ses:[]).forEach(function(se,i){
    var ref=(se&&se.title)||('s\u00e9ance n\u00b0 '+(i+1));
    if(!se||!se.title){V.cite('s\u00e9ance n\u00b0 '+(i+1),'n\u2019a pas de titre.');return;}
    if(!se.type||CH_TYPES_SEANCE.map(function(t){return t.id;}).indexOf(se.type)<0)
      V.cite(ref,'a un type de s\u00e9ance inconnu (\u00ab '+(se.type||'')+' \u00bb). Types possibles : '+CH_TYPES_SEANCE.map(function(t){return t.id;}).join(', ')+'.');
    verifTags(se,ref);
    var it=se.items||{};
    if(typeof it!=='object'||Array.isArray(it)){V.cite(ref,'a des \u00e9l\u00e9ments mal form\u00e9s : il faut un ensemble de cl\u00e9s courtes.');return;}
    Object.keys(it).forEach(function(k){
      var x=it[k]||{};var r2=ref+' \u00b7 '+k;
      if(!/^[a-z0-9-]+$/.test(k))V.cite(r2,'a une cl\u00e9 non conforme : minuscules, chiffres et tirets seulement.');
      if(!x.title)V.cite(r2,'n\u2019a pas de titre.');
      if(x.kind&&CH_KINDS.indexOf(x.kind)<0)V.cite(r2,'a un type inconnu (\u00ab '+x.kind+' \u00bb). Types possibles : '+CH_KINDS.join(', ')+'.');
      if(x.source&&CH_SOURCES.indexOf(x.source)<0)V.cite(r2,'a une provenance inconnue (\u00ab '+x.source+' \u00bb). Possibles : '+CH_SOURCES.join(', ')+'.');
      if(Object.prototype.hasOwnProperty.call(x,'published'))V.cite(r2,'ne doit pas d\u00e9cider de la publication : retire \u00ab published \u00bb, c\u2019est mon geste.');
      verifTags(x,r2);
    });
  });
  return V;
}

/* L'INVENTAIRE FACE À FACE — l'existant PRÉCIS, pas un compte. */
function chInventaire(existant,propose,taxo){
  var ids=chIdsTaxo(taxo);
  var lignes=[],aLier=[];
  var parTitre={};
  ((existant&&existant.seances)||[]).forEach(function(se,i){
    if(!se)return;
    parTitre[String(se.title||'').toLowerCase()]={se:se,i:i};
  });
  ((propose&&propose.seances)||[]).forEach(function(np){
    var cle=String(np.title||'').toLowerCase();
    var m=parTitre[cle];
    var etatSe=m?'DÉJÀ LÀ':'NOUVEAU';
    var items=[];
    Object.keys(np.items||{}).forEach(function(k){
      var x=np.items[k];
      var dejaLa=!!(m&&m.se.items&&m.se.items[k]);
      var etat=dejaLa?(String((m.se.items[k]||{}).title||'')===String(x.title||'')?'DÉJÀ LÀ':'DIFFÉRENT'):'NOUVEAU';
      items.push({cle:k,titre:x.title,kind:x.kind,source:x.source,etat:etat,
        notions:(x.notions||[]).map(function(id){return ids.notions[id]||id;}),
        competences:(x.competences||[]).map(function(id){return ids.competences[id]||id;})});
      if(x.source==='firebase_app'&&!x.ref)aLier.push({seance:np.title,item:k,titre:x.title,outil:x.kind||'?',pourquoi:x.subtitle||''});
    });
    lignes.push({seance:np.title,type:np.type,etat:etatSe,idx:m?m.i:null,items:items,
      notions:(np.notions||[]).map(function(id){return ids.notions[id]||id;}),
      competences:(np.competences||[]).map(function(id){return ids.competences[id]||id;})});
  });
  (propose&&propose.aLier||[]).forEach(function(a){
    if(!aLier.some(function(x){return x.seance===a.seance&&x.item===a.item;}))
      aLier.push({seance:a.seance,item:a.item,titre:a.item,outil:a.outil||'?',pourquoi:a.pourquoi||''});
  });
  var exist=[];
  ((existant&&existant.seances)||[]).forEach(function(se,i){
    if(!se)return;
    var its=Object.keys(se.items||{}).map(function(k){
      var x=se.items[k]||{};
      return {cle:k,titre:x.title,kind:x.kind,source:x.source,
        lie:!(x.source==='firebase_app'&&!x.ref),
        notions:(x.notions||[]).map(function(id){return ids.notions[id]||id;})};
    });
    exist.push({i:i,titre:se.title,type:se.type,items:its});
  });
  return {existant:exist,propose:lignes,aLier:aLier};
}
/* ═══ fin § PROMPT MAÎTRE DE CHAPITRE ═══ */
"""
sub(ANCRE,ANCRE+SECTION)

# ── 3. atPromptTexte : les deux jetons du chapitre, sans toucher celui de la fiche ──
sub("""function atPromptTexte(){
  var brut=(AT_IA.tpl!=null?AT_IA.tpl:ATELIER_PROMPT_SEED[AT_IA.produit])||'';
  return brut.replace('@@COMPOSANTES@@',atPromptComposantes());
}""",
"""function atPromptTexte(){
  var brut=(AT_IA.tpl!=null?AT_IA.tpl:ATELIER_PROMPT_SEED[AT_IA.produit])||'';
  /* SITE-COURS-2c : chaque produit apporte ses jetons ; la fiche de séance garde
     exactement le sien (@@COMPOSANTES@@), le chapitre ajoute les siens. */
  var t=brut.replace('@@COMPOSANTES@@',atPromptComposantes());
  if(t.indexOf('@@TYPES_SEANCE@@')>=0)t=t.replace('@@TYPES_SEANCE@@',chVocabulaireTypes());
  if(t.indexOf('@@TAXONOMIE@@')>=0)t=t.replace('@@TAXONOMIE@@',chVocabulaireTaxo(CH.taxo));
  return t;
}""")

# ── 4. pastille ──
sub('var APP_VERSION="8.11.0"','var APP_VERSION="8.12.0"')

open("index.staging.html","w",encoding='utf-8').write(s)
print(f"passage 1 : {len(s)} car. (écran et injection au passage 2)")
