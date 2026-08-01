#!/usr/bin/env python3
# ══ SITE-COURS-2c passage 2 — l'écran, les trois voies, la liste de travail ══
import re
s=open("index.staging.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    s=s.replace(a,n)

ANCRE="/* ═══ fin § PROMPT MAÎTRE DE CHAPITRE ═══ */"
ECRAN = r"""
/* ── L'ÉCRAN — accès depuis la zone « Écrire avec une IA » ── */
function chOuvrir(){
  if(!secuExigeCle())return;
  AT_IA.produit='chapitre';AT_IA.tpl=null;AT_IA.charge=false;
  chChargerTaxo(function(){ atIAChargerPrompt(function(){ chRendre(); }); });
}
function chRendre(){
  var z=document.getElementById('at-zone');if(!z)return;
  var niv=['6e','5e','4e','3e'].map(function(n){
    return '<option value="'+n+'"'+(CH.niveau===n?' selected':'')+'>'+n+'</option>';}).join('');
  z.innerHTML='<div class="at-ia">'
    +'<div class="at-ia-haut"><button class="at-btn" onclick="atIAOuvrir()">\u2190 Retour</button>'
    +'<h3 class="at-ia-titre">\ud83d\udcda Construire un chapitre avec une IA</h3></div>'
    +'<div class="at-ia-sous">Tu apportes ta progression, l\u2019IA la met en forme, la relie \u00e0 tes notions et te dit ce qui manque. Rien ne s\u2019\u00e9crit sans toi. '
    +'<button class="at-i" onclick="chInfo()" aria-label="En savoir plus">\u24d8</button></div>'
    +'<div class="ch-ligne"><label for="ch-niveau">Niveau</label> <select id="ch-niveau" class="cm-input" onchange="CH.niveau=this.value;chRendre()">'+niv+'</select></div>'
    +'<div class="at-ia-etape"><b>1.</b> Copie ce texte et colle-le dans ton IA, avec tes documents. Elle te posera des questions avant d\u2019\u00e9crire.</div>'
    +'<div class="at-ia-actions">'
    +'<button class="at-btn at-btn-prim" onclick="atIACopier()">Copier le prompt</button>'
    +'<button class="at-btn" onclick="atIAModifier()">Modifier le prompt</button></div>'
    +'<div id="at-ia-copie" class="at-ia-flash" aria-live="polite"></div>'
    +'<div class="at-ia-etape"><b>2.</b> Quand le chapitre te convient, demande-lui le r\u00e9sultat et colle-le ici.</div>'
    +'<textarea id="ch-coller" class="at-ia-zone" placeholder="Colle ici la r\u00e9ponse de l\u2019IA"></textarea>'
    +'<div class="at-ia-actions"><button class="at-btn at-btn-prim" onclick="chVerifier()">V\u00e9rifier</button></div>'
    +'<div id="ch-msg" class="at-ia-msg" aria-live="polite"></div>'
    +'<div id="ch-inv" class="ch-inv"></div>'
    +'</div>';
  chAlerteGraphies();
}
function chInfo(){
  atModaleChoix('Tu donnes \u00e0 l\u2019IA ce que tu as d\u00e9j\u00e0 : tes textes, tes s\u00e9ances, tes documents. Elle ne l\u2019invente pas \u2014 elle le met en ordre, le relie \u00e0 tes notions et \u00e0 tes comp\u00e9tences, et te dit ce qui manque.<br><br>'
    +'Ensuite tu vois, s\u00e9ance par s\u00e9ance, ce qui existe d\u00e9j\u00e0 et ce qu\u2019elle apporte. Tu choisis : <b>compl\u00e9ter</b> (rien n\u2019est touch\u00e9, seuls les manques s\u2019ajoutent), <b>remplacer</b> (l\u2019ancien part \u00e0 la corbeille), ou <b>garder \u00e0 c\u00f4t\u00e9</b> comme proposition.<br><br>'
    +'La publication reste ton geste : rien n\u2019est montr\u00e9 aux \u00e9l\u00e8ves par cette op\u00e9ration.',
    [{lib:'Compris',prim:true,fn:function(){}}]);
}
/* Signalement discret des deux graphies de classes (dette, SANS bouton de correction) */
function chAlerteGraphies(){
  secuLire('/site/'+CH.niveau).then(function(n){
    var ch=(n&&n.chapitres)||[];var vues={};
    ch.forEach(function(c){ if(c&&c.published&&typeof c.published==='object')Object.keys(c.published).forEach(function(k){vues[k]=(vues[k]||0)+1;}); });
    var cles=Object.keys(vues);
    var doublons=cles.filter(function(a){return cles.some(function(b){return b!==a&&b.toLowerCase().replace(/[^a-z0-9]/g,'')===a.toLowerCase().replace(/[^a-z0-9]/g,'');});});
    if(doublons.length<2)return;
    var d=document.getElementById('ch-inv');if(!d)return;
    d.innerHTML='<div class="ch-note">\u2139 Deux \u00e9critures d\u2019un m\u00eame nom de classe coexistent dans ce niveau ('
      +doublons.map(function(x){return '\u00ab '+atEsc(x)+' \u00bb';}).join(' et ')
      +'). Rien n\u2019est cass\u00e9, et cette op\u00e9ration n\u2019y touche pas \u2014 c\u2019est \u00e0 revoir quand tu voudras.</div>'+d.innerHTML;
  });
}
function chVerifier(){
  var brut=(document.getElementById('ch-coller')||{}).value||'';
  var msg=document.getElementById('ch-msg'),inv=document.getElementById('ch-inv');
  CH.json=null;if(inv)inv.innerHTML='';
  var t=String(brut).trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
  if(!t){if(msg){msg.className='at-ia-msg at-ia-ko';msg.textContent='Colle d\u2019abord la r\u00e9ponse de l\u2019IA.';}return;}
  var o;
  try{o=JSON.parse(t);}
  catch(e){ if(msg){msg.className='at-ia-msg at-ia-ko';
    msg.innerHTML='Je ne peux pas lire cette r\u00e9ponse : elle est incompl\u00e8te ou mal ferm\u00e9e ('+atEsc(String(e.message))+'). Demande \u00e0 l\u2019IA de redonner le r\u00e9sultat en entier, sans rien autour.';}
    return; }
  var V=chValiderChapitre(o,CH.taxo);
  if(!V.ok()){ if(msg){msg.className='at-ia-msg at-ia-ko';
    msg.innerHTML='Je ne peux pas utiliser cette r\u00e9ponse :<ul>'+V.motifs().map(function(x){return '<li>'+atEsc(x)+'</li>';}).join('')+'</ul>';}
    return; }
  CH.json=o;if(o.niveau)CH.niveau=String(o.niveau);
  if(msg){msg.className='at-ia-msg at-ia-ok';msg.textContent='R\u00e9ponse comprise. Voici ce que tu as d\u00e9j\u00e0, et ce qu\u2019elle apporte.';}
  chAfficherInventaire();
}
/* L'INVENTAIRE FACE À FACE, puis les trois voies */
function chAfficherInventaire(){
  var o=CH.json;if(!o)return;
  secuLire('/site/'+CH.niveau).then(function(niv){
    var chaps=(niv&&niv.chapitres)||[];
    var cible=null,idx=null;
    chaps.forEach(function(c,i){
      if(!c)return;                                  /* le trou d'index 0 se traverse */
      if(String(c.title||'').toLowerCase()===String(o.chapitre.title||'').toLowerCase()){cible=c;idx=i;}
    });
    CH.chapIdx=idx;
    var inventaire=chInventaire(cible,o.chapitre,CH.taxo);
    CH.inventaire=inventaire;
    var d=document.getElementById('ch-inv');if(!d)return;
    var h='<div class="ch-face">';
    h+='<div class="ch-col"><h4>Ce que tu as d\u00e9j\u00e0'+(cible?(' \u2014 \u00ab '+atEsc(cible.title)+' \u00bb'):' \u2014 aucun chapitre \u00e0 ce titre')+'</h4>';
    if(!inventaire.existant.length)h+='<p class="ch-vide">Rien pour l\u2019instant.</p>';
    inventaire.existant.forEach(function(se){
      h+='<div class="ch-se"><b>'+atEsc(se.titre||'')+'</b> <span class="ch-type">'+atEsc(se.type||'')+'</span>';
      if(!se.items.length)h+='<div class="ch-vide">aucun \u00e9l\u00e9ment</div>';
      se.items.forEach(function(x){
        h+='<div class="ch-it">\u2022 '+atEsc(x.titre||x.cle)+' <span class="ch-type">'+atEsc(x.kind||'')+' \u00b7 '+atEsc(x.source||'')+'</span>'
          +(x.lie?'':' <span class="ch-alier">\u00e0 lier</span>')
          +(x.notions.length?('<div class="ch-tags">'+x.notions.map(atEsc).join(' \u00b7 ')+'</div>'):'')+'</div>';
      });
      h+='</div>';
    });
    h+='</div><div class="ch-col"><h4>Ce que l\u2019IA apporte</h4>';
    inventaire.propose.forEach(function(se){
      h+='<div class="ch-se"><b>'+atEsc(se.seance||'')+'</b> <span class="ch-type">'+atEsc(se.type||'')+'</span> <span class="ch-etat ch-'+(se.etat==='NOUVEAU'?'neuf':'deja')+'">'+se.etat+'</span>';
      if(se.notions.length)h+='<div class="ch-tags">'+se.notions.map(atEsc).join(' \u00b7 ')+'</div>';
      se.items.forEach(function(x){
        h+='<div class="ch-it">\u2022 '+atEsc(x.titre||x.cle)+' <span class="ch-type">'+atEsc(x.kind||'')+'</span> <span class="ch-etat ch-'+(x.etat==='NOUVEAU'?'neuf':(x.etat==='DIFFÉRENT'?'diff':'deja'))+'">'+x.etat+'</span>'
          +(x.notions.length?('<div class="ch-tags">'+x.notions.map(atEsc).join(' \u00b7 ')+'</div>'):'')+'</div>';
      });
      h+='</div>';
    });
    h+='</div></div>';
    /* LA LISTE DE TRAVAIL — ce qui reste à lier à la main */
    if(inventaire.aLier.length){
      h+='<div class="ch-travail"><h4>\u00c0 lier toi-m\u00eame ('+inventaire.aLier.length+')</h4><ul>';
      inventaire.aLier.forEach(function(a){
        h+='<li>Dans <b>'+atEsc(a.seance)+'</b> : \u00ab '+atEsc(a.titre||a.item)+' \u00bb \u2014 \u00e0 relier \u00e0 '+atEsc(a.outil)
          +(a.pourquoi?(' ('+atEsc(a.pourquoi)+')'):'')+'.</li>';
      });
      h+='</ul><p class="ch-vide">Ces \u00e9l\u00e9ments s\u2019\u00e9crivent quand m\u00eame : ils apparaissent marqu\u00e9s \u00ab \u00e0 lier \u00bb tant que tu ne les as pas rattach\u00e9s.</p></div>';
    }
    h+='<div class="ch-choix"><div class="at-ia-choix-lib">Que veux-tu faire ?</div><div class="at-ia-actions">'
      +'<button class="at-btn at-btn-prim" onclick="chInjecter(\'completer\')">Compl\u00e9ter (ne touche \u00e0 rien)</button>'
      +'<button class="at-btn at-btn-prim" onclick="chInjecter(\'remplacer\')">Remplacer ce chapitre</button>'
      +'<button class="at-btn at-btn-prim" onclick="chInjecter(\'jumeau\')">Garder \u00e0 c\u00f4t\u00e9 (proposition)</button>'
      +'</div><p class="ch-vide">Rien n\u2019est \u00e9crit tant que tu n\u2019as pas choisi. La publication reste ton geste : cette op\u00e9ration ne montre rien aux \u00e9l\u00e8ves.</p></div>';
    d.innerHTML=h;
  });
}
/* LES TROIS VOIES. Écriture PAR INDEX, jamais la liste entière, jamais push. */
function chInjecter(voie){
  var o=CH.json;if(!o)return;
  CH.voie=voie;
  if(voie==='remplacer'&&CH.chapIdx===null){
    var d=document.getElementById('ch-msg');
    if(d){d.className='at-ia-msg at-ia-ko';d.textContent='Il n\u2019y a pas de chapitre \u00e0 ce titre : utilise \u00ab Compl\u00e9ter \u00bb ou \u00ab Garder \u00e0 c\u00f4t\u00e9 \u00bb.';}
    return;
  }
  var lib={completer:'Compl\u00e9ter le chapitre',remplacer:'Remplacer le chapitre',jumeau:'Garder \u00e0 c\u00f4t\u00e9'}[voie];
  var det;
  if(voie==='completer')det='Seuls les \u00e9l\u00e9ments absents seront \u00e9crits. Rien de ce qui existe ne sera modifi\u00e9.';
  else if(voie==='remplacer')det='Le chapitre actuel part d\u2019abord \u00e0 la corbeille, puis il est remplac\u00e9. Les travaux des \u00e9l\u00e8ves ne sont pas touch\u00e9s (ils vivent \u00e0 part).';
  else det='Le chapitre est ajout\u00e9 en fin de liste, marqu\u00e9 \u00ab proposition \u00bb et non publi\u00e9. Rien de l\u2019existant n\u2019est touch\u00e9.';
  atModaleChoix(lib+' ? '+det,
    [{lib:'Annuler',fn:function(){}},
     {lib:lib,prim:true,danger:(voie==='remplacer'),fn:function(){chInjecterConfirme(voie);}}]);
}
function chInjecterConfirme(voie){
  var o=CH.json;var msg=document.getElementById('ch-msg');
  var base='/site/'+CH.niveau+'/chapitres';
  var dire=function(t,ok){if(msg){msg.className='at-ia-msg '+(ok?'at-ia-ok':'at-ia-ko');msg.innerHTML=t;}};
  dire('\u00c9criture en cours\u2026',true);
  secuLire(base).then(function(chaps){
    chaps=chaps||[];
    var idx=CH.chapIdx;
    /* JUMEAU : un rang neuf en FIN de liste, jamais push, jamais la liste entière */
    if(voie==='jumeau'){
      var neuf=JSON.parse(JSON.stringify(o.chapitre));
      neuf.title=String(neuf.title||'')+' (proposition)';
      neuf.ordre=(chaps.filter(function(c){return !!c;}).length)+1;
      delete neuf.published;
      chNettoyerPublished(neuf);
      secuEcrire(base+'/'+chaps.length,neuf).then(function(r){
        dire(r.ok?('Chapitre ajout\u00e9 \u00e0 c\u00f4t\u00e9, marqu\u00e9 \u00ab proposition \u00bb et non publi\u00e9.'):'L\u2019\u00e9criture n\u2019a pas abouti \u2014 rien n\u2019a chang\u00e9.',r.ok);
      });
      return;
    }
    /* REMPLACER : ARCHIVE AVANT, ABANDON si elle échoue */
    if(voie==='remplacer'){
      var ancien=chaps[idx];
      var ts=Date.now();
      var payload={_meta:{motif:'site-chapitre',chemin:base+'/'+idx,app:'site',ts:ts},data:ancien};
      secuEcrire(atCorbeilleCle('site-chapitre'),payload).then(function(a){
        if(!a.ok){dire('La mise \u00e0 la corbeille a \u00e9chou\u00e9 \u2014 <b>rien n\u2019a \u00e9t\u00e9 remplac\u00e9</b>. R\u00e9essaie quand la connexion est stable.',false);return;}
        var neuf=JSON.parse(JSON.stringify(o.chapitre));
        neuf.ordre=(ancien&&ancien.ordre)||neuf.ordre;
        if(ancien&&ancien.published)neuf.published=ancien.published;   /* la publication existante est CONSERVÉE, jamais décidée ici */
        chNettoyerPublished(neuf,true);
        secuEcrire(base+'/'+idx,neuf).then(function(r){
          dire(r.ok?('Chapitre remplac\u00e9. L\u2019ancien est \u00e0 la corbeille.'):'L\u2019\u00e9criture n\u2019a pas abouti \u2014 l\u2019ancien est \u00e0 la corbeille, rien n\u2019a \u00e9t\u00e9 perdu.',r.ok);
        });
      });
      return;
    }
    /* COMPLÉTER : n'écrit QUE ce qui manque, élément par élément, par index */
    var cible=(idx!==null)?chaps[idx]:null;
    var ecritures=[];
    if(!cible){                                        /* le chapitre n'existe pas : il s'ajoute en fin */
      var n2=JSON.parse(JSON.stringify(o.chapitre));
      delete n2.published;chNettoyerPublished(n2);
      ecritures.push({chemin:base+'/'+chaps.length,val:n2,quoi:'chapitre \u00ab '+n2.title+' \u00bb'});
    }else{
      var parTitre={};
      (cible.seances||[]).forEach(function(se,i){ if(se)parTitre[String(se.title||'').toLowerCase()]={se:se,i:i}; });
      (o.chapitre.seances||[]).forEach(function(np){
        var m=parTitre[String(np.title||'').toLowerCase()];
        if(!m){
          var se2=JSON.parse(JSON.stringify(np));delete se2.published;chNettoyerPublished(se2);
          var rang=(cible.seances||[]).length+ecritures.filter(function(e){return e.quoi.indexOf('s\u00e9ance')===0;}).length;
          ecritures.push({chemin:base+'/'+idx+'/seances/'+rang,val:se2,quoi:'s\u00e9ance \u00ab '+np.title+' \u00bb'});
          return;
        }
        /* la séance existe : on n'ajoute QUE les items absents, et les tags manquants */
        Object.keys(np.items||{}).forEach(function(k){
          if(m.se.items&&m.se.items[k])return;         /* jamais un item existant */
          var it=JSON.parse(JSON.stringify(np.items[k]));delete it.published;
          ecritures.push({chemin:base+'/'+idx+'/seances/'+m.i+'/items/'+k,val:it,quoi:'\u00e9l\u00e9ment \u00ab '+(it.title||k)+' \u00bb'});
        });
        if((np.notions||[]).length&&!(m.se.notions||[]).length)
          ecritures.push({chemin:base+'/'+idx+'/seances/'+m.i+'/notions',val:np.notions,quoi:'notions de \u00ab '+np.title+' \u00bb'});
        if((np.competences||[]).length&&!(m.se.competences||[]).length)
          ecritures.push({chemin:base+'/'+idx+'/seances/'+m.i+'/competences',val:np.competences,quoi:'comp\u00e9tences de \u00ab '+np.title+' \u00bb'});
      });
    }
    if(!ecritures.length){dire('Rien \u00e0 ajouter : tout ce que l\u2019IA propose existe d\u00e9j\u00e0.',true);return;}
    Promise.allSettled(ecritures.map(function(e){
      return secuEcrire(e.chemin,e.val).then(function(r){ if(!r.ok)throw e; return e; });
    })).then(function(vs){
      var ok=vs.filter(function(v){return v.status==='fulfilled';}).length;
      var ko=vs.filter(function(v){return v.status==='rejected';});
      var t='\u00c9crit : <b>'+ok+'/'+ecritures.length+'</b>.';
      if(ko.length){
        t+='<br>\u26a0 '+ko.length+' \u00e9criture(s) n\u2019ont pas abouti \u2014 <b>le geste n\u2019est pas termin\u00e9</b>. Relance : seuls les manques seront repris.';
      }else{
        t+=' Rien de ce qui existait n\u2019a \u00e9t\u00e9 modifi\u00e9.';
      }
      if(CH.inventaire&&CH.inventaire.aLier.length)t+='<br>Il te reste <b>'+CH.inventaire.aLier.length+'</b> \u00e9l\u00e9ment(s) \u00e0 lier \u00e0 la main (liste ci-dessus).';
      dire(t,!ko.length);
    });
  });
}
/* `published` n'est JAMAIS écrit par l'injection — nettoyage récursif. */
function chNettoyerPublished(o,garderRacine){
  if(!o||typeof o!=='object')return o;
  if(!garderRacine)delete o.published;
  (o.seances||[]).forEach(function(se){
    if(!se)return;delete se.published;
    Object.keys(se.items||{}).forEach(function(k){ if(se.items[k])delete se.items[k].published; });
  });
  return o;
}
"""
sub(ANCRE,ECRAN+ANCRE)

# ── le bouton d'accès dans la zone existante ──
sub("""    +'<div class="at-ia-etape"><b>1.</b> Copie ce texte et colle-le dans ton IA. Elle te posera des questions avant d\\u2019\\u00e9crire quoi que ce soit.</div>'""",
"""    +'<div class="at-ia-actions"><button class="at-btn" onclick="chOuvrir()">\\ud83d\\udcda Construire un chapitre\\u2026</button></div>'
    +'<div class="at-ia-etape"><b>1.</b> Copie ce texte et colle-le dans ton IA. Elle te posera des questions avant d\\u2019\\u00e9crire quoi que ce soit.</div>'""")

# ── CSS (ancre ^<body) ──
CSS="""<style>
/* ═══ § PROMPT MAÎTRE DE CHAPITRE (SITE-COURS-2c) ═══ */
.ch-ligne{display:flex;gap:10px;align-items:center;margin:10px 0}
.ch-ligne select{min-height:44px;max-width:160px}
.ch-inv{margin-top:14px}
.ch-face{display:flex;gap:16px;flex-wrap:wrap}
.ch-col{flex:1;min-width:260px}
.ch-col h4{margin:0 0 8px 0}
.ch-se{border:1px solid rgba(0,0,0,.15);border-radius:10px;padding:10px;margin-bottom:8px}
.ch-it{font-size:.9rem;margin:4px 0 4px 6px}
.ch-type{font-size:.78rem;opacity:.7}
.ch-tags{font-size:.78rem;opacity:.85;margin-left:10px}
.ch-etat{font-size:.72rem;padding:1px 6px;border-radius:6px;border:1px solid rgba(0,0,0,.2)}
.ch-neuf{background:#e6f4ea}.ch-deja{background:#eee}.ch-diff{background:#fdf0d5}
.ch-alier{font-size:.75rem;background:#fdf0d5;border-radius:6px;padding:1px 6px}
.ch-vide{font-size:.85rem;opacity:.7;margin:4px 0}
.ch-travail{margin-top:14px;border:1px solid rgba(0,0,0,.2);border-radius:10px;padding:12px}
.ch-travail h4{margin:0 0 6px 0}
.ch-note{border:1px solid rgba(0,0,0,.2);border-radius:10px;padding:10px;margin-bottom:12px;font-size:.88rem}
.ch-choix{margin-top:16px;border-top:1px solid rgba(0,0,0,.12);padding-top:12px}
.ch-choix .at-btn{min-height:44px;min-width:44px}
@media (max-width:480px){.ch-face{flex-direction:column}.ch-choix .at-ia-actions{flex-direction:column;align-items:stretch}}
/* ═══ fin § PROMPT MAÎTRE DE CHAPITRE ═══ */
</style>
"""
m=re.search(r'^<body[\s>]',s,re.M)
s=s[:m.start()]+CSS+s[m.start():]
open("index.staging.html","w",encoding='utf-8').write(s)
print(f"passage 2 : {len(s)} car.")
