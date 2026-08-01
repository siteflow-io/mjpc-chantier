#!/usr/bin/env python3
# ══ SITE-COURS-3a passage 2 — relecture, écriture, viewer élève, gabarit CSS ══
import re
s=open("index.staging.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    s=s.replace(a,n)

ANCRE="/* ═══ fin § DIAPORAMAS ═══ */"
ECRAN = r"""
var DP={json:null,relus:{},id:null,existant:null};
/* ── L'ÉCRAN — troisième produit de la zone ── */
function diapoOuvrir(){
  if(!secuExigeCle())return;
  AT_IA.produit='diaporama';AT_IA.tpl=null;AT_IA.charge=false;
  DP.json=null;DP.relus={};DP.id=null;DP.existant=null;
  atIAChargerPrompt(function(){diapoRendreEcran();});
}
function diapoRendreEcran(){
  var z=document.getElementById('at-zone');if(!z)return;
  z.innerHTML='<div class="at-ia">'
    +'<div class="at-ia-haut"><button class="at-btn" onclick="atIAOuvrir()">\u2190 Retour</button>'
    +'<h3 class="at-ia-titre">\ud83d\uddbc\ufe0f Transformer un diaporama en texte</h3></div>'
    +'<div class="at-ia-sous">Tes diapositives deviennent du texte : lisibles au t\u00e9l\u00e9phone sans zoom, cherchables, corrigeables, et toutes dans la m\u00eame pr\u00e9sentation. '
    +'<button class="at-i" onclick="diapoInfo()" aria-label="En savoir plus">\u24d8</button></div>'
    +'<div class="dp-critere"><b>Ce qui passe en texte, ce qui reste une image :</b> si tu pouvais le <i>dicter</i> \u00e0 quelqu\u2019un qui le retaperait, c\u2019est du texte. Si tu devais le lui <i>d\u00e9crire</i> (une \u0153uvre, une photo, une frise, un sch\u00e9ma fl\u00e9ch\u00e9), c\u2019est une image : tu la d\u00e9poseras toi-m\u00eame.</div>'
    +'<div class="at-ia-etape"><b>1.</b> Copie ce texte, colle-le dans ton IA avec tes captures d\u2019\u00e9cran.</div>'
    +'<div class="at-ia-actions">'
    +'<button class="at-btn at-btn-prim" onclick="atIACopier()">Copier le prompt</button>'
    +'<button class="at-btn" onclick="atIAModifier()">Modifier le prompt</button></div>'
    +'<div id="at-ia-copie" class="at-ia-flash" aria-live="polite"></div>'
    +'<div class="at-ia-etape"><b>2.</b> Colle sa r\u00e9ponse ici, puis relis chaque bloc avant d\u2019enregistrer.</div>'
    +'<textarea id="dp-coller" class="at-ia-zone" placeholder="Colle ici la r\u00e9ponse de l\u2019IA"></textarea>'
    +'<div class="at-ia-actions"><button class="at-btn at-btn-prim" onclick="diapoVerifier()">V\u00e9rifier</button></div>'
    +'<div id="dp-msg" class="at-ia-msg" aria-live="polite"></div>'
    +'<div id="dp-relecture" class="dp-relecture"></div>'
    +'</div>';
}
function diapoInfo(){
  atModaleChoix('Une diapositive photographi\u00e9e est un mur de pixels : illisible au t\u00e9l\u00e9phone sans zoom, introuvable par la recherche, impossible \u00e0 corriger sans rouvrir PowerPoint.<br><br>'
    +'En texte, elle se replie toute seule sur l\u2019\u00e9cran, se lit \u00e0 voix haute par un lecteur d\u2019\u00e9cran, se retrouve par un mot, et se corrige en un champ. Et comme la pr\u00e9sentation vient du site, tes diaporamas de toutes les ann\u00e9es se ressemblent enfin.<br><br>'
    +'<b>L\u2019IA peut mal recopier.</b> C\u2019est pourquoi tu relis chaque bloc avant que quoi que ce soit ne s\u2019enregistre : une r\u00e8gle de grammaire recopi\u00e9e de travers se propagerait aux \u00e9l\u00e8ves avec l\u2019autorit\u00e9 du site.',
    [{lib:'Compris',prim:true,fn:function(){}}]);
}
function diapoVerifier(){
  var brut=(document.getElementById('dp-coller')||{}).value||'';
  var msg=document.getElementById('dp-msg'),rel=document.getElementById('dp-relecture');
  DP.json=null;DP.relus={};if(rel)rel.innerHTML='';
  var t=String(brut).trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
  if(!t){if(msg){msg.className='at-ia-msg at-ia-ko';msg.textContent='Colle d\u2019abord la r\u00e9ponse de l\u2019IA.';}return;}
  var o;
  try{o=JSON.parse(t);}
  catch(e){if(msg){msg.className='at-ia-msg at-ia-ko';
    msg.innerHTML='Je ne peux pas lire cette r\u00e9ponse : elle est incompl\u00e8te ou mal ferm\u00e9e ('+atEsc(String(e.message))+'). Demande \u00e0 l\u2019IA de redonner le r\u00e9sultat en entier, sans rien autour.';}
    return;}
  var V=diapoValider(o);
  if(!V.ok()){if(msg){msg.className='at-ia-msg at-ia-ko';
    msg.innerHTML='Je ne peux pas utiliser cette r\u00e9ponse :<ul>'+V.motifs().map(function(x){return '<li>'+atEsc(x)+'</li>';}).join('')+'</ul>';}
    return;}
  DP.json=o;
  if(msg){msg.className='at-ia-msg at-ia-ok';msg.textContent='R\u00e9ponse comprise. Relis maintenant chaque bloc : \u00e0 gauche ce que verra l\u2019\u00e9l\u00e8ve, \u00e0 droite le texte exact.';}
  diapoRelecture();
}
/* LA RELECTURE bloc à bloc — forme finale ET texte brut en regard.
   L'écriture reste fermée tant que tout n'est pas relu. */
function diapoCles(){
  var l=[];
  ((DP.json||{}).diapos||[]).forEach(function(d,i){(d.blocs||[]).forEach(function(b,j){l.push(i+'-'+j);});});
  return l;
}
function diapoRelecture(){
  var o=DP.json;if(!o)return;
  var rel=document.getElementById('dp-relecture');if(!rel)return;
  var total=diapoCles().length,faits=Object.keys(DP.relus).filter(function(k){return DP.relus[k];}).length;
  var h='<div class="dp-rel-tete"><b>Relecture</b> \u2014 <span id="dp-compteur">'+faits+' bloc(s) relu(s) sur '+total+'</span>'
    +' <button class="at-btn" onclick="diapoToutRelu()">Tout marquer relu</button></div>';
  (o.diapos||[]).forEach(function(d,i){
    h+='<div class="dp-rel-diapo"><div class="dp-rel-num">Diapositive '+(i+1)+(d.titre?(' \u2014 '+atEsc(d.titre)):'')+'</div>';
    (d.blocs||[]).forEach(function(b,j){
      var k=i+'-'+j;
      h+='<div class="dp-rel-bloc'+(DP.relus[k]?' dp-relu':'')+'" id="dp-rb-'+k+'">'
        +'<div class="dp-rel-forme">'+diapoRendreBloc(b)+'</div>'
        +'<div class="dp-rel-brut"><div class="dp-rel-type">'+atEsc((DIAPO_BLOCS[b.type]||{}).libelle||b.type)+'</div>'
        +'<pre class="dp-brut">'+atEsc(diapoTexteBrut(b))+'</pre></div>'
        +'<label class="dp-rel-case"><input type="checkbox" id="dp-cb-'+k+'"'+(DP.relus[k]?' checked':'')+' onchange="diapoMarquer(\''+k+'\',this.checked)"> relu</label>'
        +'</div>';
    });
    h+='</div>';
  });
  h+='<div class="dp-choix"><div class="at-ia-choix-lib">Enregistrer ce diaporama</div>'
    +'<input type="text" id="dp-id" class="cm-input" placeholder="nom court, sans accent (ex. portrait-seance-2)" value="'+atEsc(diapoIdPropose(o.titre))+'">'
    +'<div class="at-ia-actions">'
    +'<button class="at-btn at-btn-prim" id="dp-btn-ecrire" onclick="diapoEnregistrer()"'+(faits<total?' disabled':'')+'>Enregistrer</button></div>'
    +'<p class="dp-vide" id="dp-garde">'+(faits<total?('Il reste '+(total-faits)+' bloc(s) \u00e0 relire avant d\u2019enregistrer.'):'Tout est relu. Rien n\u2019est \u00e9crit tant que tu n\u2019as pas cliqu\u00e9.')+'</p></div>';
  rel.innerHTML=h;
}
function diapoTexteBrut(b){
  var out=[];
  Object.keys(b).forEach(function(k){
    if(k==='type')return;
    var v=b[k];
    if(Array.isArray(v))out.push(k+' : '+v.map(function(x){return Array.isArray(x)?x.join(' | '):x;}).join('\n       '));
    else out.push(k+' : '+String(v==null?'':v));
  });
  return out.join('\n');
}
function diapoMarquer(k,val){
  DP.relus[k]=!!val;
  var el=document.getElementById('dp-rb-'+k);if(el)el.className='dp-rel-bloc'+(val?' dp-relu':'');
  var total=diapoCles().length,faits=Object.keys(DP.relus).filter(function(x){return DP.relus[x];}).length;
  var c=document.getElementById('dp-compteur');if(c)c.textContent=faits+' bloc(s) relu(s) sur '+total;
  var b=document.getElementById('dp-btn-ecrire');if(b)b.disabled=(faits<total);
  var g=document.getElementById('dp-garde');
  if(g)g.textContent=(faits<total)?('Il reste '+(total-faits)+' bloc(s) \u00e0 relire avant d\u2019enregistrer.'):'Tout est relu. Rien n\u2019est \u00e9crit tant que tu n\u2019as pas cliqu\u00e9.';
}
/* Geste EXPLICITE de Paul : il assume, il n'est pas piégé. */
function diapoToutRelu(){
  atModaleChoix('Marquer les '+diapoCles().length+' blocs comme relus ? Tu peux le faire si tu as d\u00e9j\u00e0 v\u00e9rifi\u00e9 le texte \u00e0 l\u2019\u00e9cran \u2014 mais c\u2019est toi qui r\u00e9ponds de ce qui sera publi\u00e9.',
    [{lib:'Annuler',fn:function(){}},
     {lib:'Oui, j\u2019ai tout relu',prim:true,fn:function(){diapoCles().forEach(function(k){DP.relus[k]=true;});diapoRelecture();}}]);
}
function diapoIdPropose(titre){
  return sanMJPC(String(titre||'diaporama')).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48)||'diaporama';
}
/* L'ÉCRITURE : aperçu passé, verdict, archive AVANT remplacement, abandon si échec. */
function diapoEnregistrer(){
  var o=DP.json;if(!o)return;
  var total=diapoCles().length,faits=Object.keys(DP.relus).filter(function(x){return DP.relus[x];}).length;
  if(faits<total)return;                                  /* garde : jamais d'écriture non relue */
  var id=String((document.getElementById('dp-id')||{}).value||'').trim()||diapoIdPropose(o.titre);
  DP.id=id;
  var msg=document.getElementById('dp-msg');
  secuLire(DIAPO_NOEUD+'/'+id).then(function(ancien){
    var det=ancien
      ? 'Un diaporama porte d\u00e9j\u00e0 ce nom : il partira d\u2019abord \u00e0 la corbeille, puis sera remplac\u00e9.'
      : 'Rien ne porte ce nom : rien ne sera perdu.';
    atModaleChoix('Enregistrer \u00ab '+atEsc(o.titre)+' \u00bb ? '+det+' Il ne sera visible des \u00e9l\u00e8ves que lorsque tu l\u2019auras reli\u00e9 \u00e0 une s\u00e9ance.',
      [{lib:'Annuler',fn:function(){}},
       {lib:'Enregistrer',prim:true,danger:!!ancien,fn:function(){diapoEcrire(id,o,ancien);}}]);
  });
}
function diapoEcrire(id,o,ancien){
  var msg=document.getElementById('dp-msg');
  var dire=function(t,ok){if(msg){msg.className='at-ia-msg '+(ok?'at-ia-ok':'at-ia-ko');msg.innerHTML=t;}};
  var payload=JSON.parse(JSON.stringify(o));
  payload.maj=Date.now();
  var ecrire=function(){
    secuEcrire(DIAPO_NOEUD+'/'+id,payload).then(function(r){
      if(!r.ok){dire('L\u2019enregistrement n\u2019a pas abouti'+(ancien?' \u2014 l\u2019ancien est \u00e0 la corbeille, rien n\u2019a \u00e9t\u00e9 perdu.':' \u2014 rien n\u2019a chang\u00e9.'),false);return;}
      dire('Diaporama enregistr\u00e9 sous \u00ab '+atEsc(id)+' \u00bb.'+(ancien?' L\u2019ancien est \u00e0 la corbeille.':'')
        +'<br>Pour que les \u00e9l\u00e8ves le voient : ajoute-le \u00e0 une s\u00e9ance comme \u00e9l\u00e9ment de type <b>diaporama</b>, avec ce nom comme r\u00e9f\u00e9rence.',true);
    });
  };
  if(!ancien){ecrire();return;}                            /* rien à perdre : pas d'archive de rien */
  var ts=Date.now();
  secuEcrire(atCorbeilleCle('site-diaporama'),
    {_meta:{motif:'site-diaporama',chemin:DIAPO_NOEUD+'/'+id,app:'site',ts:ts},data:ancien}).then(function(a){
      if(!a.ok){dire('La mise \u00e0 la corbeille a \u00e9chou\u00e9 \u2014 <b>rien n\u2019a \u00e9t\u00e9 remplac\u00e9</b>. R\u00e9essaie quand la connexion est stable.',false);return;}
      ecrire();
    });
}
/* ── LE VIEWER ÉLÈVE — sans lui, le morceau produirait des données que rien ne lit.
      Branché dans openItem par kind:'diaporama' + source:'firebase_app'. ── */
function openDiaporamaById(ref,titre){
  var ex=document.getElementById('dp-viewer');if(ex)ex.remove();
  var ov=document.createElement('div');ov.id='dp-viewer';ov.className='dp-viewer';
  ov.innerHTML='<div class="dp-viewer-barre">'
    +'<button class="dp-viewer-x" onclick="var e=document.getElementById(\'dp-viewer\');if(e)e.remove();" aria-label="Fermer">\u2715</button>'
    +'<span class="dp-viewer-titre">'+atEsc(titre||'Diaporama')+'</span>'
    +'<button class="dp-viewer-imp" onclick="window.print()">\ud83d\udda8\ufe0f</button></div>'
    +'<div class="dp-viewer-corps" id="dp-viewer-corps"><p class="dp-vide">Chargement\u2026</p></div>';
  document.body.appendChild(ov);
  secuLire(DIAPO_NOEUD+'/'+ref).then(function(dp){
    var c=document.getElementById('dp-viewer-corps');if(!c)return;
    if(!dp){c.innerHTML='<p class="dp-vide">Ce diaporama n\u2019est pas encore disponible.</p>';return;}
    c.innerHTML=diapoRendre(dp);
  });
}
"""
sub(ANCRE,ECRAN+ANCRE)

# ── la branche dans openItem (patron gallery) ──
sub("""  if(item.kind==='dictee' && src==='firebase_app'){if(typeof openDicteeById==='function')openDicteeById(ref);return;}""",
"""  /* SITE-COURS-3a : le diaporama en texte, viewer interne (patron gallery) */
  if(item.kind==='diaporama' && src==='firebase_app'){openDiaporamaById(ref,item.title);return;}
  if(item.kind==='dictee' && src==='firebase_app'){if(typeof openDicteeById==='function')openDicteeById(ref);return;}""")

# ── le bouton d'accès dans la zone ──
sub("""    +'<div class="at-ia-actions"><button class="at-btn" onclick="chOuvrir()">\\ud83d\\udcda Construire un chapitre\\u2026</button></div>'""",
"""    +'<div class="at-ia-actions"><button class="at-btn" onclick="chOuvrir()">\\ud83d\\udcda Construire un chapitre\\u2026</button>'
    +'<button class="at-btn" onclick="diapoOuvrir()">\\ud83d\\uddbc\\ufe0f Transformer un diaporama\\u2026</button></div>'""")

# ── CSS : le gabarit, le mobile 390, l'impression (ancre ^<body) ──
CSS="""<style>
/* ═══ § DIAPORAMAS (SITE-COURS-3a) — LE GABARIT : une forme par bloc ═══ */
.dp-doc{max-width:820px;margin:0 auto;padding:4px}
.dp-doc-titre{font-size:1.5rem;margin:0 0 14px 0}
.dp-diapo{position:relative;border:1px solid rgba(0,0,0,.15);border-radius:12px;padding:16px 14px 14px;margin:0 0 16px 0;background:rgba(255,255,255,.55)}
.dp-num{position:absolute;top:-10px;left:12px;font-size:.72rem;padding:1px 8px;border-radius:8px;background:#2e2750;color:#fff}
.dp-titre{font-size:1.18rem;margin:.2rem 0 .6rem}
.dp-sstitre{font-size:1.02rem;margin:.6rem 0 .3rem;opacity:.85}
.dp-p{margin:.5rem 0;line-height:1.6}
.dp-ul,.dp-ol{margin:.5rem 0 .5rem 1.1rem;line-height:1.6}
.dp-ul li,.dp-ol li{margin:.25rem 0}
.dp-def{margin:.6rem 0;padding:.6rem .8rem;border-left:4px solid #2e2750;border-radius:0 8px 8px 0;background:rgba(46,39,80,.06)}
.dp-terme{display:block;margin-bottom:.15rem}
.dp-ex{margin:.6rem 0;padding:.6rem .8rem;border:1px dashed rgba(0,0,0,.3);border-radius:8px}
.dp-ex-lib{display:block;font-size:.74rem;text-transform:uppercase;letter-spacing:.06em;opacity:.7;margin-bottom:.2rem}
.dp-cit{margin:.7rem 0;padding:.5rem 0 .5rem 1rem;border-left:3px solid rgba(0,0,0,.35);font-style:italic}
.dp-src{display:block;font-style:normal;font-size:.82rem;opacity:.75;margin-top:.3rem}
.dp-note{margin:.6rem 0;padding:.6rem .8rem;border-radius:8px;background:rgba(255,214,102,.22);border:1px solid rgba(180,140,0,.35)}
.dp-note-att{background:rgba(230,57,70,.12);border-color:rgba(230,57,70,.4)}
.dp-note-lib{display:block;font-size:.74rem;text-transform:uppercase;letter-spacing:.06em;opacity:.75;margin-bottom:.2rem}
.dp-fig{margin:.7rem 0;text-align:center}
.dp-img{max-width:100%;height:auto;border-radius:8px}
.dp-img-vide{padding:1rem;border:1px dashed rgba(0,0,0,.35);border-radius:8px;font-size:.9rem;opacity:.8}
.dp-leg{font-size:.82rem;opacity:.8;margin-top:.3rem}
.dp-tab-hote{overflow-x:auto;margin:.6rem 0}
.dp-tab{width:100%;border-collapse:collapse;font-size:.92rem}
.dp-tab th,.dp-tab td{border:1px solid rgba(0,0,0,.2);padding:.45rem .55rem;text-align:left}
.dp-tab th{background:rgba(46,39,80,.08)}
/* ── mobile 390 : le tableau devient une liste de paires libellé/valeur ── */
@media (max-width:480px){
  .dp-tab-hote{overflow-x:visible}
  .dp-tab,.dp-tab thead,.dp-tab tbody,.dp-tab tr,.dp-tab td{display:block;width:100%;box-sizing:border-box}
  .dp-tab thead{display:none}
  .dp-tab tr{border:1px solid rgba(0,0,0,.2);border-radius:8px;margin-bottom:.5rem}
  .dp-tab td{border:0;border-bottom:1px solid rgba(0,0,0,.1);padding:.4rem .55rem}
  .dp-tab td:last-child{border-bottom:0}
  .dp-tab td:before{content:attr(data-ent);display:block;font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;opacity:.65}
  .dp-doc{padding:0}
  .dp-diapo{padding:14px 10px 12px}
}
/* ── l'écran de relecture ── */
.dp-critere{margin:10px 0;padding:10px 12px;border:1px solid rgba(0,0,0,.2);border-radius:10px;font-size:.9rem;line-height:1.5}
.dp-relecture{margin-top:14px}
.dp-rel-tete{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
.dp-rel-tete .at-btn{min-height:44px}
.dp-rel-diapo{margin-bottom:14px}
.dp-rel-num{font-weight:700;margin-bottom:6px}
.dp-rel-bloc{display:flex;gap:12px;align-items:flex-start;border:1px solid rgba(0,0,0,.15);border-radius:10px;padding:10px;margin-bottom:8px;flex-wrap:wrap}
.dp-rel-bloc.dp-relu{border-color:rgba(46,125,79,.5);background:rgba(46,125,79,.06)}
.dp-rel-forme{flex:1;min-width:200px}
.dp-rel-brut{flex:1;min-width:200px}
.dp-rel-type{font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;opacity:.7;margin-bottom:.2rem}
.dp-brut{white-space:pre-wrap;word-break:break-word;font-size:.82rem;margin:0;padding:.5rem;background:rgba(0,0,0,.05);border-radius:6px;font-family:ui-monospace,monospace}
.dp-rel-case{display:flex;align-items:center;gap:6px;min-height:44px;min-width:44px;font-size:.9rem}
.dp-rel-case input{width:20px;height:20px}
.dp-choix{margin-top:16px;border-top:1px solid rgba(0,0,0,.12);padding-top:12px}
.dp-choix .cm-input{width:100%;max-width:420px;box-sizing:border-box;min-height:44px;margin:8px 0}
.dp-choix .at-btn{min-height:44px;min-width:44px}
.dp-choix .at-btn[disabled]{opacity:.5;cursor:not-allowed}
.dp-vide{font-size:.85rem;opacity:.75;margin:6px 0}
/* ── le viewer élève ── */
.dp-viewer{position:fixed;inset:0;z-index:9600;background:#faf7f2;color:#1c1830;overflow:auto}
.dp-viewer-barre{position:sticky;top:0;display:flex;align-items:center;gap:10px;padding:8px 10px;background:#2e2750;color:#fff}
.dp-viewer-titre{flex:1;font-weight:700;font-size:1rem}
.dp-viewer-x,.dp-viewer-imp{min-width:44px;min-height:44px;border:0;background:transparent;color:#fff;font-size:1.1rem;cursor:pointer}
.dp-viewer-corps{padding:14px 10px 40px}
@media (max-width:480px){.dp-rel-bloc{flex-direction:column}}
/* ── l'impression : c'est un cours ── */
@media print{
  .dp-viewer{position:static;background:#fff}
  .dp-viewer-barre{display:none}
  .dp-viewer-corps{padding:0}
  .dp-diapo{border:1px solid #999;break-inside:avoid;page-break-inside:avoid;background:#fff;margin-bottom:10mm}
  .dp-num{background:#000;color:#fff}
  .dp-note,.dp-def,.dp-ex{background:#fff;border:1px solid #999}
  .dp-tab th{background:#eee}
  .dp-img{max-width:60%}
}
/* ═══ fin § DIAPORAMAS ═══ */
</style>
"""
m=re.search(r'^<body[\s>]',s,re.M)
s=s[:m.start()]+CSS+s[m.start():]
open("index.staging.html","w",encoding='utf-8').write(s)
print(f"passage 2 : {len(s)} car.")
