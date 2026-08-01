#!/usr/bin/env python3
# ══ SITE-COURS-3a — index.html : les diapositives deviennent du texte ══
import re
s=open("index.base.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    s=s.replace(a,n)

# ── 1. LE PRODUIT : une entrée de plus dans le seed (3e fois) ──
sub("""var ATELIER_PROMPT_SEED={""",
"""var ATELIER_PROMPT_SEED={
  /* SITE-COURS-3a : le DIAPORAMA — troisième produit, une entrée de plus.
     La mécanique de la zone (atPromptTexte, atIAChargerPrompt, l'édition, la
     persistance) n'est pas touchée : preuve au rapport, fonctions à l'octet. */
  diaporama:
    "Tu vas m\\u2019aider \\u00e0 transformer les diapositives d\\u2019un cours de fran\\u00e7ais en TEXTE.\\n\\n"+
    "POURQUOI : une diapositive n\\u2019est pas une image, c\\u2019est du texte mis en page. En texte, elle se lit "+
    "au t\\u00e9l\\u00e9phone sans zoom, se cherche, se corrige, et se pr\\u00e9sente dans la m\\u00eame charte que tout le site.\\n\\n"+
    "NE PRODUIS AUCUN JSON TOUT DE SUITE.\\n"+
    "Commence par une discussion de cadrage. Demande-moi d\\u2019abord de te donner mes captures d\\u2019\\u00e9cran "+
    "(une par diapositive, dans l\\u2019ordre), le titre du diaporama et le niveau de classe. "+
    "Puis, diapositive par diapositive, dis-moi ce que tu comptes en faire et attends ma validation.\\n\\n"+
    "CE QUI PASSE EN TEXTE, CE QUI RESTE UNE IMAGE \\u2014 le crit\\u00e8re :\\n"+
    "  \\u2022 si je pouvais le DICTER \\u00e0 quelqu\\u2019un qui le retaperait, c\\u2019est du TEXTE : titres, listes, "+
    "d\\u00e9finitions, exemples, citations, tableaux simples. C\\u2019est l\\u2019immense majorit\\u00e9 d\\u2019un cours de fran\\u00e7ais.\\n"+
    "  \\u2022 si je devais le lui D\\u00c9CRIRE, c\\u2019est une IMAGE : \\u0153uvre, photographie, frise, sch\\u00e9ma fl\\u00e9ch\\u00e9, "+
    "carte heuristique. Tu la d\\u00e9clares en bloc \\u00ab image \\u00bb : je la d\\u00e9poserai moi-m\\u00eame, tu \\u00e9cris seulement "+
    "sa l\\u00e9gende et sa description pour les lecteurs d\\u2019\\u00e9cran.\\n\\n"+
    "TU NE CHOISIS JAMAIS LA FORME. Ni couleur, ni police, ni taille, ni disposition : tu dis CE QUE C\\u2019EST, "+
    "le site dit comment \\u00e7a se voit. Un champ de mise en forme dans ta r\\u00e9ponse sera refus\\u00e9.\\n"+
    "TRANSCRIS FID\\u00c8LEMENT : n\\u2019am\\u00e9liore pas mes formulations, ne compl\\u00e8te pas ce qui manque, ne r\\u00e9sume pas. "+
    "Si un mot est illisible sur la capture, \\u00e9cris-le suivi de [?] et dis-le moi.\\n\\n"+
    "BLOCS DISPONIBLES (n\\u2019en invente aucun autre) :\\n"+
    "@@BLOCS@@\\n\\n"+
    "QUAND, ET SEULEMENT QUAND, JE TE DIS \\u00ab produis le JSON \\u00bb, tu produis un objet JSON SEUL, "+
    "sans commentaire ni texte autour, sans balises de code, \\u00e0 ce format :\\n"+
    "{\\n"+
    "  \\"produit\\": \\"diaporama\\",\\n"+
    "  \\"titre\\": \\"titre du diaporama\\",\\n"+
    "  \\"niveau\\": \\"3e\\",\\n"+
    "  \\"diapos\\": [ { \\"titre\\": \\"titre de la diapositive\\", \\"blocs\\": [ { \\"type\\": \\"puces\\", \\"items\\": [\\"\\u2026\\"] } ] } ]\\n"+
    "}\\n",""")

# ── 2. LA SECTION (après le § PROMPT MAÎTRE DE CHAPITRE, portée JS) ──
# l'ancre existe DEUX fois (CSS @87157 et JS @505789) — piège de portée déjà
# payé à 2c : on vise celle du JS par la ligne qui la précède.
ANCRE="""  return o;
}
/* ═══ fin § PROMPT MAÎTRE DE CHAPITRE ═══ */"""
SECTION = r"""

/* ═══════════════════════════════════════════════════════════════════════════
   § DIAPORAMAS (SITE-COURS-3a) — les diapositives deviennent du texte.
   DOCTRINE XIII.3, appliquée : JSON et non HTML. L'IA dit CE QUE C'EST, le
   gabarit dit COMMENT ÇA SE VOIT — sinon chaque diapositive arrive avec son
   style et le site redevient un patchwork de captures.
   OÙ ÇA VIT : /site/diaporamas/<id>. Pas dans l'atelier : l'atelier est
   l'établi (des brouillons qu'on jette), le site est la maison (des contenus
   que des items de séance désignent). Deux durées de vie ne se mêlent pas.
   RELECTURE : la doctrine dit qu'une règle recopiée de travers « se propage aux
   élèves avec l'autorité du site ». L'écriture reste donc fermée tant que chaque
   bloc n'a pas été relu — forme finale ET texte brut en regard.
   ═══════════════════════════════════════════════════════════════════════════ */
var DIAPO_NOEUD='/site/diaporamas';
/* Le vocabulaire des blocs — LA SOURCE. Un bloc ajouté ici paraît dans le prompt
   et devient rendable, sans qu'aucune liste soit retouchée. */
var DIAPO_BLOCS={
  titre:        {libelle:'Titre de la diapositive',champs:[{k:'texte',l:'le titre',kind:'text'}]},
  sous_titre:   {libelle:'Sous-titre',champs:[{k:'texte',l:'le sous-titre',kind:'text'}]},
  paragraphe:   {libelle:'Paragraphe de texte',champs:[{k:'texte',l:'le texte',kind:'area'}]},
  puces:        {libelle:'Liste \u00e0 puces',champs:[{k:'items',l:'les lignes',kind:'list'}]},
  numeros:      {libelle:'Liste num\u00e9rot\u00e9e (des \u00e9tapes)',champs:[{k:'items',l:'les \u00e9tapes',kind:'list'}]},
  definition:   {libelle:'D\u00e9finition',champs:[{k:'terme',l:'le mot d\u00e9fini',kind:'text'},{k:'texte',l:'la d\u00e9finition',kind:'area'}]},
  exemple:      {libelle:'Exemple (encadr\u00e9)',champs:[{k:'texte',l:'l\u2019exemple',kind:'area'}]},
  citation:     {libelle:'Citation avec sa source',champs:[{k:'texte',l:'la citation',kind:'area'},{k:'auteur',l:'l\u2019auteur',kind:'text'},{k:'oeuvre',l:'l\u2019\u0153uvre',kind:'text'}]},
  tableau:      {libelle:'Tableau simple',champs:[{k:'entetes',l:'les en-t\u00eates',kind:'list'},{k:'lignes',l:'les lignes (une liste par ligne)',kind:'list'}],note:'reste lisible au t\u00e9l\u00e9phone : \u00e9vite plus de 3 colonnes'},
  note:         {libelle:'Note ou rappel',champs:[{k:'texte',l:'le texte',kind:'area'},{k:'ton',l:'rappel ou attention',kind:'text'}]},
  image:        {libelle:'Image \u00e0 d\u00e9poser (ce qui est vraiment graphique)',champs:[{k:'legende',l:'la l\u00e9gende',kind:'text'},{k:'alt',l:'la description pour les lecteurs d\u2019\u00e9cran (obligatoire)',kind:'area'},{k:'ref',l:'laisse vide : je d\u00e9poserai le fichier',kind:'text'}]}
};
/* GÉNÉRÉ, jamais recopié (règle depuis SITE-COURS-2a). */
function diapoVocabulaireBlocs(){
  var src={};
  Object.keys(DIAPO_BLOCS).forEach(function(id){
    var b=DIAPO_BLOCS[id];
    if(b.reserve)return;
    src[id]={libelle:b.libelle,champs:b.champs,note:b.note||''};
  });
  return mjpcPromptVocabulaire(src,{});
}
/* Les champs de FORME que l'IA n'a pas le droit d'employer — refusés en étant nommés. */
var DIAPO_FORME_INTERDITE=['style','couleur','color','police','font','taille','size','classe','class','align','alignement','css','html','background','fond','gras','italique'];

/* LA VALIDATION — motifs ACCUMULÉS, bloc CITÉ, message qui dit quoi corriger. */
function diapoValider(o){
  var V=mjpcValidation(8);
  if(!o||typeof o!=='object'||Array.isArray(o)){V.exige(false,'La r\u00e9ponse doit \u00eatre un diaporama complet.');return V;}
  V.exige(o.titre&&typeof o.titre==='string','Il manque le titre du diaporama.');
  V.exige(Array.isArray(o.diapos)&&o.diapos.length,'Il manque les diapositives (une liste non vide).');
  (Array.isArray(o.diapos)?o.diapos:[]).forEach(function(d,i){
    var refD='Diapositive '+(i+1)+(d&&d.titre?(' \u00ab '+d.titre+' \u00bb'):'');
    if(!d||typeof d!=='object'){V.cite(refD,'n\u2019est pas lisible.');return;}
    if(!Array.isArray(d.blocs)||!d.blocs.length){V.cite(refD,'ne contient aucun bloc : il lui faut au moins un titre ou un texte.');return;}
    d.blocs.forEach(function(b,j){
      var ref=refD+' \u00b7 bloc '+(j+1);
      if(!b||typeof b!=='object'){V.cite(ref,'n\u2019est pas lisible.');return;}
      var def=DIAPO_BLOCS[b.type];
      if(!def){V.cite(ref,'utilise un type inconnu (\u00ab '+(b.type||'')+' \u00bb). Types possibles : '+Object.keys(DIAPO_BLOCS).join(', ')+'.');return;}
      /* un champ de FORME est refusé en étant nommé */
      Object.keys(b).forEach(function(k){
        if(DIAPO_FORME_INTERDITE.indexOf(String(k).toLowerCase())>=0)
          V.cite(ref,'contient un r\u00e9glage de mise en forme (\u00ab '+k+' \u00bb) : la forme est d\u00e9cid\u00e9e par le site, retire-le.');
      });
      (def.champs||[]).forEach(function(f){
        var v=b[f.k];
        if(f.kind==='list'){
          if(!Array.isArray(v)||!v.length)V.cite(ref,'attend une liste pour \u00ab '+f.l+' \u00bb.');
        }else if(b.type==='image'&&f.k==='ref'){
          /* la référence reste vide : Paul déposera le fichier */
        }else if(b.type==='image'&&f.k==='alt'){
          if(!v||!String(v).trim())V.cite(ref,'est une image sans description pour les lecteurs d\u2019\u00e9cran : ajoute \u00ab alt \u00bb, sinon elle sera invisible pour qui ne voit pas.');
        }else if(f.k==='ton'||f.k==='oeuvre'||f.k==='auteur'||f.k==='legende'){
          /* facultatifs */
        }else if(!v||!String(v).trim()){
          V.cite(ref,'n\u2019a pas de '+f.l+'.');
        }
      });
      if(b.type==='tableau'){
        var e=b.entetes||[],L=b.lignes||[];
        if(Array.isArray(e)&&Array.isArray(L)){
          L.forEach(function(li,k){
            if(!Array.isArray(li))V.cite(ref,'a une ligne de tableau (n\u00b0 '+(k+1)+') qui n\u2019est pas une liste de cellules.');
            else if(li.length!==e.length)V.cite(ref,'a une ligne de tableau (n\u00b0 '+(k+1)+') avec '+li.length+' cellule(s) pour '+e.length+' en-t\u00eate(s) : il en faut autant.');
          });
          if(e.length>3)V.cite(ref,'a '+e.length+' colonnes : au-del\u00e0 de 3, le tableau devient illisible au t\u00e9l\u00e9phone. Coupe-le en deux.');
        }
      }
    });
  });
  return V;
}

/* ── LE GABARIT : une forme par bloc, dans la charte, sans dépendance ── */
function diapoRendreBloc(b){
  var e=atEsc;
  var t=b.type;
  if(t==='titre')return '<h3 class="dp-titre">'+e(b.texte)+'</h3>';
  if(t==='sous_titre')return '<h4 class="dp-sstitre">'+e(b.texte)+'</h4>';
  if(t==='paragraphe')return '<p class="dp-p">'+e(b.texte)+'</p>';
  if(t==='puces')return '<ul class="dp-ul">'+(b.items||[]).map(function(x){return '<li>'+e(x)+'</li>';}).join('')+'</ul>';
  if(t==='numeros')return '<ol class="dp-ol">'+(b.items||[]).map(function(x){return '<li>'+e(x)+'</li>';}).join('')+'</ol>';
  if(t==='definition')return '<div class="dp-def"><b class="dp-terme">'+e(b.terme)+'</b><span class="dp-deftxt">'+e(b.texte)+'</span></div>';
  if(t==='exemple')return '<div class="dp-ex"><span class="dp-ex-lib">Exemple</span><div>'+e(b.texte)+'</div></div>';
  if(t==='citation')return '<blockquote class="dp-cit">'+e(b.texte)
      +'<cite class="dp-src">'+[e(b.auteur||''),e(b.oeuvre||'')].filter(Boolean).join(', ')+'</cite></blockquote>';
  if(t==='note')return '<div class="dp-note'+(String(b.ton||'').toLowerCase().indexOf('attention')>=0?' dp-note-att':'')+'">'
      +'<span class="dp-note-lib">'+e(b.ton||'\u00c0 retenir')+'</span><div>'+e(b.texte)+'</div></div>';
  if(t==='image'){
    var corps=b.ref
      ? '<img class="dp-img" src="https://drive.google.com/thumbnail?id='+encodeURIComponent(b.ref)+'&sz=w1000" alt="'+e(b.alt||'')+'">'
      : '<div class="dp-img-vide">\ud83d\uddbc \u00c0 d\u00e9poser \u2014 '+e(b.alt||'')+'</div>';
    return '<figure class="dp-fig">'+corps+(b.legende?('<figcaption class="dp-leg">'+e(b.legende)+'</figcaption>'):'')+'</figure>';
  }
  if(t==='tableau'){
    var ent=(b.entetes||[]),lig=(b.lignes||[]);
    var h='<div class="dp-tab-hote"><table class="dp-tab"><thead><tr>'+ent.map(function(x){return '<th>'+e(x)+'</th>';}).join('')+'</tr></thead><tbody>';
    lig.forEach(function(li){
      h+='<tr>'+(Array.isArray(li)?li:[li]).map(function(c,k){
        /* l'en-tête est porté par la cellule : sous 480 px, le tableau devient
           une liste de paires libellé/valeur (seule façon honnête au téléphone) */
        return '<td data-ent="'+e(ent[k]||'')+'">'+e(c)+'</td>';}).join('')+'</tr>';
    });
    return h+'</tbody></table></div>';
  }
  return '';
}
function diapoRendre(dp){
  var e=atEsc;
  var h='<div class="dp-doc"><h2 class="dp-doc-titre">'+e(dp.titre||'')+'</h2>';
  (dp.diapos||[]).forEach(function(d,i){
    h+='<section class="dp-diapo"><div class="dp-num">'+(i+1)+'</div>';
    if(d.titre)h+='<h3 class="dp-titre">'+e(d.titre)+'</h3>';
    (d.blocs||[]).forEach(function(b){h+=diapoRendreBloc(b);});
    h+='</section>';
  });
  return h+'</div>';
}
/* ═══ fin § DIAPORAMAS ═══ */
"""
sub(ANCRE,ANCRE+SECTION)

# ── 3. les jetons du produit dans atPromptTexte (une ligne, comme à 2c) ──
sub("""  if(t.indexOf('@@TAXONOMIE@@')>=0)t=t.replace('@@TAXONOMIE@@',chVocabulaireTaxo(CH.taxo));
  return t;""",
"""  if(t.indexOf('@@TAXONOMIE@@')>=0)t=t.replace('@@TAXONOMIE@@',chVocabulaireTaxo(CH.taxo));
  if(t.indexOf('@@BLOCS@@')>=0)t=t.replace('@@BLOCS@@',diapoVocabulaireBlocs());
  return t;""")

# ── 4. `diaporama` rejoint le vocabulaire des items (ajout, pas modification) ──
sub("""var CH_KINDS=['doc','dictee','reecriture','analyse_logique','qcm','tache'];""",
"""var CH_KINDS=['doc','dictee','reecriture','analyse_logique','qcm','tache','diaporama'];   /* SITE-COURS-3a : + diaporama (ajout de vocabulaire, le format d'item ne change pas) */""")

# ── 5. pastille ──
sub('var APP_VERSION="8.12.1"','var APP_VERSION="8.13.0"')

open("index.staging.html","w",encoding='utf-8').write(s)
print(f"passage 1 : {len(s)} car.")
