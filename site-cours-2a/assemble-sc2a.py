#!/usr/bin/env python3
# ══ SITE-COURS-2a — index.html : la zone prompt IA → JSON de l'atelier ══
import re
s=open("index.base.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    s=s.replace(a,n)

# ── 1. LE BOUTON dans la barre haute de l'éditeur (à côté de « Mes feuilles ») ──
sub("""  h+='<div class="at-barre-haut">'
    +'<button class="at-btn" onclick="atRetourListe()">\\u2190 Mes feuilles</button>'""",
"""  h+='<div class="at-barre-haut">'
    +'<button class="at-btn" onclick="atRetourListe()">\\u2190 Mes feuilles</button>'
    +'<button class="at-btn at-btn-ia" onclick="atIAOuvrir()">\\u2728 \\u00c9crire avec une IA</button>'""")

# ── 2. LA SECTION, collée avant le générateur (ancre § GÉNÉRATEUR) ──
ANCRE="/* ══ § GÉNÉRATEUR — un document HTML AUTONOME"
SECTION = r"""/* ═══════════════════════════════════════════════════════════════════════════
   § ZONE PROMPT IA → JSON (SITE-COURS-2a) — le patron worktrack, porté à
   l'atelier et débarrassé de sa dette : le prompt VIT EN FIREBASE.
   Trois temps : ① copier un prompt qui impose à l'IA une discussion de cadrage
   AVANT tout JSON ② coller sa réponse, qui est VÉRIFIÉE avec des refus NOMMÉS
   ③ un aperçu, puis le choix explicite : nouvelle feuille ou remplacement de
   la feuille ouverte (archive en corbeille AVANT, abandon si elle échoue).
   La liste des composantes remise à l'IA est GÉNÉRÉE depuis ATELIER_COMPOSANTES
   (les réservées exclues) : aucune liste recopiée, rien à maintenir en double.
   ═══════════════════════════════════════════════════════════════════════════ */
var AT_IA_NOEUD='/site/atelier/prompts';
var AT_IA={produit:'fiche_seance',tpl:null,charge:false,json:null,apercu:null};

/* ── La liste des composantes, GÉNÉRÉE. Une composante ajoutée au schéma y
      paraît sans qu'aucune liste soit retouchée (Q1 : toutes les non réservées). ── */
function atPromptComposantes(){
  var zones={entete:'En-t\u00eate',contexte:'Contexte',contenu:'Contenu',travail:'Travail de l\u2019\u00e9l\u00e8ve',
             differenciation:'Diff\u00e9renciation',liens:'Liens',ancrage:'Ancrage',mise_en_page:'Mise en page',pied:'Pied de page'};
  var par={};
  Object.keys(ATELIER_COMPOSANTES).forEach(function(id){
    var c=ATELIER_COMPOSANTES[id];
    if(c.reserve)return;                                  /* jamais ce qui n'existe pas encore */
    var z=c.zone||'contenu';
    (par[z]=par[z]||[]).push({id:id,c:c});
  });
  var out=[];
  Object.keys(zones).forEach(function(z){
    var l=par[z];if(!l||!l.length)return;
    out.push('### '+zones[z]);
    l.forEach(function(x){
      var c=x.c;var ligne='- '+x.id+' : '+c.libelle;
      if(c.multiple)ligne+=' [peut se r\u00e9p\u00e9ter : utilise "blocs"]';
      if(c.exige)ligne+=' [se remplit tout seul depuis la fiche : ne mets pas de valeur]';
      var ch=(c.champs||[]);
      if(ch.length){
        ligne+=' \u2192 champs : '+ch.map(function(f){
          var t=f.kind==='list'?'liste de lignes':(f.kind==='area'?'texte long':(f.kind==='date'?'date AAAA-MM-JJ':'texte court'));
          return f.k+' ('+f.l+', '+t+')';
        }).join(', ');
      }
      out.push(ligne);
    });
  });
  return out.join('\n');
}
/* ── Le seed en dur : il fait foi si la base ne répond pas (patron PROMPT_CHAPTER).
      Table indexée par produit : ajouter un des sept autres = UNE entrée de plus. ── */
var ATELIER_PROMPT_SEED={
  fiche_seance:
    "Tu vas m\u2019aider \u00e0 pr\u00e9parer une FICHE DE S\u00c9ANCE pour mon cours de fran\u00e7ais au coll\u00e8ge.\n\n"+
    "NE PRODUIS AUCUN JSON TOUT DE SUITE.\n"+
    "Commence par une discussion de cadrage, un point \u00e0 la fois. Procède par allers-retours : reformule, propose, mais attends mes validations. Interroge-moi sur :\n"+
    "  1. le niveau, la classe, le chapitre et le num\u00e9ro + titre de la s\u00e9ance ;\n"+
    "  2. l\u2019objectif de la s\u00e9ance, formul\u00e9 c\u00f4t\u00e9 \u00e9l\u00e8ve ;\n"+
    "  3. les notions travaill\u00e9es et le support (texte, \u0153uvre, extrait) ;\n"+
    "  4. le contenu de cours : ce que l\u2019\u00e9l\u00e8ve doit retenir, et sous quelle forme ;\n"+
    "  5. le travail de l\u2019\u00e9l\u00e8ve : consignes, ce qu\u2019il \u00e9crit, o\u00f9 il l\u2019\u00e9crit ;\n"+
    "  6. les crit\u00e8res de r\u00e9ussite, dits \u00e0 la premi\u00e8re personne (\u00ab J\u2019ai relev\u00e9\u2026 \u00bb) ;\n"+
    "  7. le travail \u00e0 faire pour la fois suivante.\n"+
    "R\u00e8gles de r\u00e9daction : vocabulaire de la classe vis\u00e9e ; consignes \u00e0 l\u2019imp\u00e9ratif, une t\u00e2che par consigne ; aucune mention de moi dans les textes destin\u00e9s \u00e0 l\u2019\u00e9l\u00e8ve.\n\n"+
    "QUAND, ET SEULEMENT QUAND, JE TE DIS \u00ab produis le JSON \u00bb, tu produis un objet JSON SEUL, sans commentaire ni texte autour, sans balises de code, \u00e0 ce format :\n"+
    "{\n"+
    "  \"produit\": \"fiche_seance\",\n"+
    "  \"titre\": \"titre de la feuille, pour moi\",\n"+
    "  \"cases\": { \"identifiant\": true },\n"+
    "  \"valeurs\": { \"identifiant\": { \"champ\": \"valeur\" } },\n"+
    "  \"blocs\": [ { \"id\": \"identifiant\", \"valeurs\": { \"champ\": \"valeur\" } } ]\n"+
    "}\n"+
    "R\u00e8gles du JSON, imp\u00e9ratives :\n"+
    "  \u2022 n\u2019utilise QUE les identifiants de la liste ci-dessous, exactement orthographi\u00e9s. N\u2019en invente aucun.\n"+
    "  \u2022 \"cases\" dit ce qui appara\u00eet sur la feuille ; \"valeurs\" donne le contenu des champs de chaque \u00e9l\u00e9ment.\n"+
    "  \u2022 un champ marqu\u00e9 \u00ab liste de lignes \u00bb re\u00e7oit un tableau de cha\u00eenes ; un champ \u00ab texte long \u00bb re\u00e7oit une cha\u00eene (les retours \u00e0 la ligne sont permis) ; une date s\u2019\u00e9crit AAAA-MM-JJ.\n"+
    "  \u2022 \"blocs\" ne sert qu\u2019aux \u00e9l\u00e9ments marqu\u00e9s \u00ab peut se r\u00e9p\u00e9ter \u00bb, quand il en faut plusieurs.\n"+
    "  \u2022 les \u00e9l\u00e9ments marqu\u00e9s \u00ab se remplit tout seul \u00bb se cochent sans valeur.\n\n"+
    "\u00c9L\u00c9MENTS DISPONIBLES (la liste fait foi) :\n"+
    "@@COMPOSANTES@@\n"
};
function atPromptTexte(){
  var brut=(AT_IA.tpl!=null?AT_IA.tpl:ATELIER_PROMPT_SEED[AT_IA.produit])||'';
  return brut.replace('@@COMPOSANTES@@',atPromptComposantes());
}
function atIAChargerPrompt(suite){
  if(AT_IA.charge){if(suite)suite();return;}
  _siteGet(AT_IA_NOEUD+'/'+AT_IA.produit,function(v){
    AT_IA.tpl=(typeof v==='string'&&v.length)?v:null;   /* la base sinon le seed */
    AT_IA.charge=true;if(suite)suite();
  });
}

/* ── L'écran ── */
function atIAOuvrir(){
  var z=document.getElementById('at-zone');if(!z)return;
  atIAChargerPrompt(function(){atIARendre();});
}
function atIARendre(){
  var z=document.getElementById('at-zone');if(!z)return;
  var h='<div class="at-ia">'
    +'<div class="at-ia-haut"><button class="at-btn" onclick="atRendreEditeur()">\u2190 Retour \u00e0 la feuille</button>'
    +'<h3 class="at-ia-titre">\u2728 \u00c9crire avec une IA</h3></div>'
    +'<div class="at-ia-sous">Discute d\u2019abord avec l\u2019IA, elle pr\u00e9pare la feuille, tu gardes la main sur tout. '
    +'<button class="at-i" onclick="atIAInfo()" aria-label="En savoir plus">\u24d8</button></div>'
    +'<div class="at-ia-etape"><b>1.</b> Copie ce texte et colle-le dans ton IA. Elle te posera des questions avant d\u2019\u00e9crire quoi que ce soit.</div>'
    +'<div class="at-ia-actions">'
    +'<button class="at-btn at-btn-prim" onclick="atIACopier()">Copier le prompt</button>'
    +'<button class="at-btn" onclick="atIAModifier()">Modifier le prompt</button>'
    +'</div>'
    +'<div id="at-ia-copie" class="at-ia-flash" aria-live="polite"></div>'
    +'<div class="at-ia-etape"><b>2.</b> Quand la discussion te convient, demande-lui de produire le r\u00e9sultat, puis colle sa r\u00e9ponse ici.</div>'
    +'<textarea id="at-ia-coller" class="at-ia-zone" placeholder="Colle ici la r\u00e9ponse de l\u2019IA"></textarea>'
    +'<div class="at-ia-actions"><button class="at-btn at-btn-prim" onclick="atIAVerifier()">V\u00e9rifier</button></div>'
    +'<div id="at-ia-msg" class="at-ia-msg" aria-live="polite"></div>'
    +'<div id="at-ia-apercu" class="at-ia-apercu"></div>'
    +'</div>';
  z.innerHTML=h;
}
function atIAInfo(){
  atModaleChoix('L\u2019IA ne d\u00e9cide rien : elle propose. Tu copies le texte pr\u00e9par\u00e9 ici, tu discutes avec elle autant que tu veux, '
    +'et quand le r\u00e9sultat te convient tu colles sa r\u00e9ponse. Tu vois alors exactement ce qui sera \u00e9crit, et tu choisis : '
    +'une nouvelle feuille, ou remplacer celle qui est ouverte. Rien n\u2019est enregistr\u00e9 avant ce choix.',
    [{lib:'Compris',prim:true,fn:function(){}}]);
}
function atIACopier(){
  var t=atPromptTexte();
  var fin=function(ok){
    var d=document.getElementById('at-ia-copie');
    if(d){d.textContent=ok?'Prompt copi\u00e9.':'La copie automatique a \u00e9chou\u00e9 \u2014 le texte est ouvert, copie-le \u00e0 la main.';}
    if(!ok)atIAModifier();
  };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(function(){fin(true);},function(){fin(false);});
  }else fin(false);
}
function atIAModifier(){
  var z=document.getElementById('at-zone');if(!z)return;
  var brut=(AT_IA.tpl!=null?AT_IA.tpl:ATELIER_PROMPT_SEED[AT_IA.produit])||'';
  z.innerHTML='<div class="at-ia">'
    +'<div class="at-ia-haut"><button class="at-btn" onclick="atIARendre()">\u2190 Retour</button>'
    +'<h3 class="at-ia-titre">Modifier le prompt</h3></div>'
    +'<div class="at-ia-sous">Tes modifications te suivent d\u2019un appareil \u00e0 l\u2019autre. La liste des \u00e9l\u00e9ments disponibles s\u2019ajoute automatiquement \u00e0 la fin : garde le rep\u00e8re @@COMPOSANTES@@ o\u00f9 tu veux qu\u2019elle apparaisse.</div>'
    +'<textarea id="at-ia-tpl" class="at-ia-zone at-ia-zone-haute">'+atEsc(brut)+'</textarea>'
    +'<div class="at-ia-actions">'
    +'<button class="at-btn at-btn-prim" onclick="atIAEnregistrerTpl()">Enregistrer</button>'
    +'<button class="at-btn" onclick="atIARestaurerTpl()">Revenir au texte d\u2019origine</button></div>'
    +'<div id="at-ia-msg" class="at-ia-msg" aria-live="polite"></div></div>';
}
function atIAEnregistrerTpl(){
  var t=(document.getElementById('at-ia-tpl')||{}).value||'';
  var d=document.getElementById('at-ia-msg');
  if(d)d.textContent='Enregistrement\u2026';
  atSitePut(AT_IA_NOEUD+'/'+AT_IA.produit,t,function(ok){
    if(ok){AT_IA.tpl=t;if(d){d.className='at-ia-msg at-ia-ok';d.textContent='Prompt enregistr\u00e9. Il te suivra sur tes autres appareils.'}}
    else if(d){d.className='at-ia-msg at-ia-ko';d.textContent='L\u2019enregistrement a \u00e9chou\u00e9 \u2014 ton texte est toujours \u00e0 l\u2019\u00e9cran. R\u00e9essaie quand la connexion est stable.';}
  });
}
function atIARestaurerTpl(){
  var t=document.getElementById('at-ia-tpl');
  if(t)t.value=ATELIER_PROMPT_SEED[AT_IA.produit]||'';
}

/* ── LA VÉRIFICATION — refus NOMMÉS, et ils s'ACCUMULENT (jamais le premier seul) ── */
function atIAValider(o){
  var e=[];
  if(!o||typeof o!=='object'||Array.isArray(o)){return ['Le texte coll\u00e9 n\u2019est pas une r\u00e9ponse exploitable : attendu un objet, avec des \u00e9l\u00e9ments \u00e0 cocher et leurs contenus.'];}
  if(o.produit&&!ATELIER_PRODUITS[o.produit])e.push('Le type de feuille \u00ab '+String(o.produit)+' \u00bb n\u2019existe pas. Attendu : '+Object.keys(ATELIER_PRODUITS).join(', ')+'.');
  var cases=o.cases||{},valeurs=o.valeurs||{},blocs=o.blocs||[];
  var nb=Object.keys(cases).length+Object.keys(valeurs).length+(Array.isArray(blocs)?blocs.length:0);
  if(!nb)e.push('La r\u00e9ponse ne contient aucun \u00e9l\u00e9ment \u00e0 \u00e9crire. Demande \u00e0 l\u2019IA de produire le r\u00e9sultat complet.');
  if(o.blocs&&!Array.isArray(o.blocs))e.push('\u00ab blocs \u00bb doit \u00eatre une liste d\u2019\u00e9l\u00e9ments r\u00e9p\u00e9t\u00e9s.');
  function verifId(id,ou){
    var c=ATELIER_COMPOSANTES[id];
    if(!c){e.push('\u00ab '+id+' \u00bb ('+ou+') n\u2019existe pas dans l\u2019atelier. Demande \u00e0 l\u2019IA de n\u2019utiliser que les \u00e9l\u00e9ments de la liste du prompt.');return null;}
    if(c.reserve){e.push('\u00ab '+id+' \u00bb ('+c.libelle+') n\u2019est pas encore disponible : cet \u00e9l\u00e9ment est pr\u00e9vu mais pas encore r\u00e9alis\u00e9. Retire-le de la r\u00e9ponse.');return null;}
    return c;
  }
  Object.keys(cases).forEach(function(id){verifId(id,'\u00e0 cocher');});
  function verifChamps(id,c,vals,ou){
    if(!c)return;
    Object.keys(vals||{}).forEach(function(k){
      var ch=(c.champs||[]).filter(function(x){return x.k===k;})[0];
      if(!ch){
        var dispo=(c.champs||[]).map(function(x){return x.k;});
        e.push('\u00ab '+id+' \u00bb ('+ou+') n\u2019a pas de champ \u00ab '+k+' \u00bb. '+(dispo.length?('Champs possibles : '+dispo.join(', ')+'.'):'Cet \u00e9l\u00e9ment ne prend aucun contenu : coche-le simplement.'));
        return;
      }
      var v=vals[k];
      if(ch.kind==='list'&&!Array.isArray(v))e.push('\u00ab '+id+' \u00b7 '+ch.l+' \u00bb attend une liste de lignes, pas un texte. Demande \u00e0 l\u2019IA de mettre chaque ligne dans une liste.');
      if(ch.kind!=='list'&&Array.isArray(v))e.push('\u00ab '+id+' \u00b7 '+ch.l+' \u00bb attend un texte, pas une liste.');
      if(ch.kind==='date'&&typeof v==='string'&&v&&!/^\d{4}-\d{2}-\d{2}$/.test(v))e.push('\u00ab '+id+' \u00b7 '+ch.l+' \u00bb doit s\u2019\u00e9crire AAAA-MM-JJ (re\u00e7u : \u00ab '+v+' \u00bb).');
      if(ch.kind!=='list'&&v!=null&&typeof v!=='string'&&typeof v!=='number'&&typeof v!=='boolean')e.push('\u00ab '+id+' \u00b7 '+ch.l+' \u00bb attend un texte simple.');
    });
  }
  Object.keys(valeurs).forEach(function(id){
    var c=ATELIER_COMPOSANTES[id]?verifId(id,'contenu'):verifId(id,'contenu');
    verifChamps(id,c,valeurs[id],'contenu');
  });
  if(Array.isArray(blocs))blocs.forEach(function(b,i){
    if(!b||!b.id){e.push('Un \u00e9l\u00e9ment r\u00e9p\u00e9t\u00e9 (n\u00b0 '+(i+1)+') n\u2019indique pas de quel \u00e9l\u00e9ment il s\u2019agit.');return;}
    var c=verifId(b.id,'\u00e9l\u00e9ment r\u00e9p\u00e9t\u00e9 n\u00b0 '+(i+1));
    if(c&&!c.multiple)e.push('\u00ab '+b.id+' \u00bb ne peut pas se r\u00e9p\u00e9ter : mets son contenu dans \u00ab valeurs \u00bb, une seule fois.');
    verifChamps(b.id,c,b.valeurs,'\u00e9l\u00e9ment r\u00e9p\u00e9t\u00e9 n\u00b0 '+(i+1));
  });
  return e.slice(0,8);
}
function atIAVerifier(){
  var brut=(document.getElementById('at-ia-coller')||{}).value||'';
  var msg=document.getElementById('at-ia-msg'),ap=document.getElementById('at-ia-apercu');
  if(ap)ap.innerHTML='';
  AT_IA.json=null;
  var t=String(brut).trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
  if(!t){if(msg){msg.className='at-ia-msg at-ia-ko';msg.textContent='Colle d\u2019abord la r\u00e9ponse de l\u2019IA.';}return;}
  var o;
  try{o=JSON.parse(t);}
  catch(err){
    if(msg){msg.className='at-ia-msg at-ia-ko';
      msg.innerHTML='Je ne peux pas lire cette r\u00e9ponse : elle est incompl\u00e8te ou mal ferm\u00e9e ('+atEsc(String(err.message))+'). '
        +'Demande \u00e0 l\u2019IA de redonner le r\u00e9sultat en entier, sans rien autour.';}
    return;
  }
  var errs=atIAValider(o);
  if(errs.length){
    if(msg){msg.className='at-ia-msg at-ia-ko';
      msg.innerHTML='Je ne peux pas \u00e9crire cette feuille :<ul>'+errs.map(function(x){return '<li>'+atEsc(x)+'</li>';}).join('')+'</ul>';}
    return;
  }
  AT_IA.json=o;
  if(msg){msg.className='at-ia-msg at-ia-ok';msg.textContent='R\u00e9ponse comprise. Voici ce qui sera \u00e9crit.';}
  atIAApercu();
}

/* ── L'APERÇU, puis LE CHOIX (deux boutons de même poids, aucun pré-choisi) ── */
function atIAApercu(){
  var o=AT_IA.json;if(!o)return;
  var ap=document.getElementById('at-ia-apercu');if(!ap)return;
  var cases=Object.keys(o.cases||{}).filter(function(k){return o.cases[k];});
  var h='<div class="at-ia-apercu-boite"><div class="at-ia-apercu-titre">Voici ce qui sera \u00e9crit. Rien n\u2019est enregistr\u00e9 tant que tu n\u2019as pas choisi.</div>';
  h+='<div class="at-ia-ap-l"><b>Titre de la feuille :</b> '+atEsc(o.titre||'(sans titre)')+'</div>';
  if(o.produit&&ATELIER_PRODUITS[o.produit])h+='<div class="at-ia-ap-l"><b>Type :</b> '+atEsc(ATELIER_PRODUITS[o.produit].libelle)+'</div>';
  h+='<div class="at-ia-ap-l"><b>\u00c9l\u00e9ments qui appara\u00eetront ('+cases.length+') :</b><ul>';
  cases.forEach(function(id){h+='<li>'+atEsc(ATELIER_COMPOSANTES[id].libelle)+'</li>';});
  h+='</ul></div>';
  var vs=Object.keys(o.valeurs||{});
  if(vs.length){
    h+='<div class="at-ia-ap-l"><b>Contenus remplis :</b><ul>';
    vs.forEach(function(id){
      var c=ATELIER_COMPOSANTES[id];
      Object.keys(o.valeurs[id]||{}).forEach(function(k){
        var ch=(c.champs||[]).filter(function(x){return x.k===k;})[0];
        var v=o.valeurs[id][k];
        var apercu=Array.isArray(v)?(v.length+' ligne(s) : '+v.slice(0,2).join(' \u00b7 ')):String(v||'');
        if(apercu.length>110)apercu=apercu.slice(0,110)+'\u2026';
        h+='<li><b>'+atEsc(c.libelle)+'</b> \u2014 '+atEsc(ch?ch.l:k)+' : '+atEsc(apercu)+'</li>';
      });
    });
    h+='</ul></div>';
  }
  if((o.blocs||[]).length)h+='<div class="at-ia-ap-l"><b>\u00c9l\u00e9ments r\u00e9p\u00e9t\u00e9s :</b> '+o.blocs.length+'</div>';
  h+='<div class="at-ia-choix"><div class="at-ia-choix-lib">Que veux-tu faire ?</div><div class="at-ia-actions">'
    +'<button class="at-btn at-btn-prim" onclick="atIAInjecterNeuve()">Cr\u00e9er une nouvelle feuille</button>'
    +'<button class="at-btn at-btn-prim" onclick="atIARemplacer()">Remplacer la feuille ouverte</button>'
    +'</div></div></div>';
  ap.innerHTML=h;
}
/* la recopie contrôlée — le JSON épouse atDocNeuf, aucun traducteur */
function atIAAppliquer(doc,o){
  if(o.titre)doc.titre=String(o.titre);
  if(o.produit&&ATELIER_PRODUITS[o.produit])doc.produit=o.produit;
  Object.keys(o.cases||{}).forEach(function(id){if(o.cases[id])doc.cases[id]=true;else delete doc.cases[id];});
  doc.valeurs=doc.valeurs||{};
  Object.keys(o.valeurs||{}).forEach(function(id){
    doc.cases[id]=true;
    doc.valeurs[id]=doc.valeurs[id]||{};
    Object.keys(o.valeurs[id]).forEach(function(k){doc.valeurs[id][k]=atValeurTypee(id,k,Array.isArray(o.valeurs[id][k])?o.valeurs[id][k].join('\n'):o.valeurs[id][k]);});
  });
  doc.contenu=doc.contenu||[];
  (o.blocs||[]).forEach(function(b){
    doc.cases[b.id]=true;
    var bloc={id:b.id,valeurs:{},reformulations:{}};
    Object.keys(b.valeurs||{}).forEach(function(k){bloc.valeurs[k]=atValeurTypee(b.id,k,Array.isArray(b.valeurs[k])?b.valeurs[k].join('\n'):b.valeurs[k]);});
    doc.contenu.push(bloc);
  });
  doc.dates=doc.dates||{};doc.dates.modifieLe=Date.now();
  return doc;
}
function atIAInjecterNeuve(){
  var o=AT_IA.json;if(!o)return;
  var id='feuille_'+Date.now();
  AT.docId=id;AT.doc=atIAAppliquer(atDocNeuf(),o);AT.previewIdx=0;
  atEnregistrerMaintenant(function(){atRendreEditeur();});
}
function atIARemplacer(){
  var o=AT_IA.json;if(!o||!AT.doc||!AT.docId)return;
  var nbCases=Object.keys(AT.doc.cases||{}).filter(function(k){return AT.doc.cases[k];}).length;
  var nbBlocs=(AT.doc.contenu||[]).length;
  atModaleChoix('Remplacer \u00ab '+atEsc(AT.doc.titre||'Sans titre')+' \u00bb ? Tu perdras '+nbCases+' case(s) coch\u00e9e(s) et '+nbBlocs
    +' bloc(s) de contenu. La version actuelle part d\u2019abord \u00e0 la corbeille, tu pourras la retrouver.',
    [{lib:'Annuler',fn:function(){}},
     {lib:'Mettre \u00e0 la corbeille puis remplacer',danger:true,fn:function(){atIARemplacerConfirme();}}]);
}
function atIARemplacerConfirme(){
  var o=AT_IA.json;if(!o||!AT.doc||!AT.docId)return;
  var msg=document.getElementById('at-ia-msg');
  var chemin=AT_NOEUD+'/'+AT.docId;
  var payload={_meta:{motif:'atelier-remplacement',chemin:chemin,app:'site',ts:Date.now()},data:JSON.parse(JSON.stringify(AT.doc))};
  /* L'ARCHIVE PART AVANT. Si elle échoue : ABANDON, rien n'est remplacé. */
  atSitePut(atCorbeilleCle('atelier-remplacement'),payload,function(ok){
    if(!ok){
      if(msg){msg.className='at-ia-msg at-ia-ko';msg.textContent='La mise \u00e0 la corbeille a \u00e9chou\u00e9 \u2014 rien n\u2019a \u00e9t\u00e9 remplac\u00e9. R\u00e9essaie quand la connexion est stable.';}
      return;
    }
    AT.doc=atIAAppliquer(AT.doc,o);AT.previewIdx=0;
    atEnregistrerMaintenant(function(){atRendreEditeur();});
  });
}
/* ═══ fin § ZONE PROMPT IA ═══ */

"""
sub(ANCRE,SECTION+ANCRE)

# ── 3. CSS (ancre ^<body) ──
CSS="""<style>
/* ═══ § ZONE PROMPT IA (SITE-COURS-2a) ═══ */
.at-ia{padding:4px 2px 24px}
.at-ia-haut{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:6px}
.at-ia-titre{margin:0;font-size:1.15rem}
.at-ia-sous{font-size:.9rem;opacity:.85;line-height:1.5;margin-bottom:14px}
.at-ia-etape{margin:16px 0 8px;font-size:.95rem;line-height:1.5}
.at-ia-actions{display:flex;gap:10px;flex-wrap:wrap;margin:8px 0}
.at-ia-actions .at-btn{min-height:44px;min-width:44px;padding:10px 16px}
.at-ia-zone{width:100%;box-sizing:border-box;min-height:150px;font-family:ui-monospace,monospace;font-size:.82rem;padding:10px;border-radius:10px}
.at-ia-zone-haute{min-height:320px}
.at-ia-flash{font-size:.88rem;min-height:1.2em;opacity:.9}
.at-ia-msg{margin:10px 0;font-size:.92rem;line-height:1.5}
.at-ia-msg.at-ia-ok{color:#2e7d4f}
.at-ia-msg.at-ia-ko{color:#a33}
.at-ia-msg ul{margin:8px 0 0 0;padding-left:20px}
.at-ia-msg li{margin:5px 0}
.at-ia-apercu-boite{border:1px solid rgba(0,0,0,.18);border-radius:12px;padding:14px;margin-top:12px}
.at-ia-apercu-titre{font-weight:700;margin-bottom:10px}
.at-ia-ap-l{margin:8px 0;font-size:.92rem;line-height:1.5}
.at-ia-ap-l ul{margin:6px 0 0 0;padding-left:20px}
.at-ia-choix{margin-top:16px;border-top:1px solid rgba(0,0,0,.12);padding-top:12px}
.at-ia-choix-lib{font-weight:700;margin-bottom:8px}
.at-i{border:0;background:transparent;cursor:pointer;font-size:1rem;min-width:44px;min-height:44px}
@media (max-width:480px){
  .at-ia-actions{flex-direction:column;align-items:stretch}
  .at-ia-actions .at-btn{width:100%}
  .at-ia-zone{font-size:.9rem}
}
/* ═══ fin § ZONE PROMPT IA ═══ */
</style>
"""
m=re.search(r'^<body[\s>]',s,re.M)
s=s[:m.start()]+CSS+s[m.start():]

# ── 4. pastille ──
sub('var APP_VERSION="8.10.1"','var APP_VERSION="8.11.0"')

open("index.staging.html","w",encoding='utf-8').write(s)
print(f"index.staging.html écrit ({len(s)} car.)")
