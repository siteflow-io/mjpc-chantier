/* BANC MÉMOIRE SITE-COURS-2a — le parcours ①→⑧, la génération prouvée par
   composante factice, les refus nommés. Hub simulé, journal, aucune écriture réelle. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,200)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,220));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function bloc(src,debut,fin){const i=src.indexOf(debut);const j=src.indexOf(fin,i);return src.slice(i,j+fin.length);}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const idx=fs.readFileSync('index.staging.html','utf8');
  const HUB={};const journal=[];const ELS={};
  function el(id){if(!ELS[id])ELS[id]={value:'',innerHTML:'',textContent:'',className:''};return ELS[id];}
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,clearTimeout,navigator:{},
    document:{getElementById:(id)=>ELS[id]||null},
    _modales:[],
    atModaleChoix:(msg,btns)=>{env._modales.push({msg,btns});},
    atRendreEditeur:()=>{env._rendu=(env._rendu||0)+1;},
    atEsc:x=>String(x==null?'':x),
    _siteGet:(ch,cb)=>{journal.push({op:'GET',ch});cb(ch in HUB?JSON.parse(JSON.stringify(HUB[ch])):null);},
    atSitePut:(ch,val,cb)=>{journal.push({op:'PUT',ch,val:JSON.stringify(val).slice(0,200)});
      if(env._archiveKO&&ch.indexOf('/corbeille')===0){cb(false,{etat:'echec'});return;}
      HUB[ch]=JSON.parse(JSON.stringify(val));cb(true);},
    atEnregistrerMaintenant:(suite)=>{journal.push({op:'PUT',ch:env.AT_NOEUD+'/'+env.AT.docId,val:JSON.stringify(env.AT.doc).slice(0,120)});
      HUB[env.AT_NOEUD+'/'+env.AT.docId]=JSON.parse(JSON.stringify(env.AT.doc));if(suite)suite();},
    AT_NOEUD:'/site/atelier/documents',
    ATELIER_VERSION:'1.0.0',
  };
  env.window=env;vm.createContext(env);
  /* le schéma, les produits, les helpers de l'atelier, puis la section IA */
  vm.runInContext(bloc(idx,'function AC(fam,nature,zone,lib,extra){','\n};\n'),env);          /* AC + CH + ATELIER_COMPOSANTES */
  vm.runInContext(bloc(idx,'var ATELIER_PRODUITS={','\n};'),env);
  for(const f of ['atValeurTypee','atDocNeuf','atCorbeilleCle'])vm.runInContext(extraire(idx,f),env);
  vm.runInContext("var AT={doc:null,docId:null,liste:{},previewIdx:0};",env);
  vm.runInContext(bloc(idx,"var AT_IA_NOEUD='/site/atelier/prompts';","/* ═══ fin § ZONE PROMPT IA ═══ */"),env);

  /* ═══ la génération de la liste ═══ */
  const liste=vm.runInContext('atPromptComposantes()',env);
  const nbListe=(liste.match(/^- /gm)||[]).length;
  const total=vm.runInContext('Object.keys(ATELIER_COMPOSANTES).length',env);
  const res=vm.runInContext('Object.keys(ATELIER_COMPOSANTES).filter(function(k){return ATELIER_COMPOSANTES[k].reserve;})',env);
  verdict('liste g\u00e9n\u00e9r\u00e9e : '+nbListe+' \u00e9l\u00e9ments = '+total+' \u2212 '+res.length+' r\u00e9serv\u00e9es (Q1 : toutes les non r\u00e9serv\u00e9es)',
    nbListe===total-res.length&&total===121&&res.length===7,`${nbListe}/${total}/${res.length}`);
  verdict('aucune r\u00e9serv\u00e9e dans la liste (l\u2019IA ne propose pas ce qui n\u2019existe pas)',
    res.every(r=>liste.indexOf('- '+r+' :')<0),JSON.stringify(res.filter(r=>liste.indexOf('- '+r+' :')>=0)));
  verdict('la liste porte les libell\u00e9s fran\u00e7ais et les champs typ\u00e9s',
    /- titre : Afficher le titre de la feuille \u2192 champs : texte \(Titre, texte court\)/.test(liste)
    &&/liste de lignes/.test(liste)&&/texte long/.test(liste),liste.split('\n').slice(0,3).join(' | '));

  /* PREUVE : une composante FACTICE ajoutée au schéma paraît sans qu'aucune liste soit retouchée */
  vm.runInContext("ATELIER_COMPOSANTES.composante_factice_banc=AC('C','structure','contenu','Composante factice du banc',{champs:[CH('texte','Texte du banc')]});",env);
  const liste2=vm.runInContext('atPromptComposantes()',env);
  verdict('PREUVE DE G\u00c9N\u00c9RATION : une composante ajout\u00e9e au sch\u00e9ma para\u00eet dans la liste, aucune liste retouch\u00e9e',
    liste2.indexOf('- composante_factice_banc : Composante factice du banc')>=0
    &&(liste2.match(/^- /gm)||[]).length===nbListe+1,String((liste2.match(/^- /gm)||[]).length));
  /* et une factice RÉSERVÉE reste dehors */
  vm.runInContext("ATELIER_COMPOSANTES.factice_reservee_banc=AC('C','structure','contenu','Factice r\u00e9serv\u00e9e',{reserve:true});",env);
  const liste3=vm.runInContext('atPromptComposantes()',env);
  verdict('une composante factice R\u00c9SERV\u00c9E reste exclue',liste3.indexOf('factice_reservee_banc')<0);
  vm.runInContext("delete ATELIER_COMPOSANTES.composante_factice_banc;delete ATELIER_COMPOSANTES.factice_reservee_banc;",env);

  /* ═══ ① la zone, le prompt, la copie ═══ */
  ELS['at-zone']=el('at-zone');ELS['at-ia-msg']=el('at-ia-msg');ELS['at-ia-apercu']=el('at-ia-apercu');
  ELS['at-ia-coller']=el('at-ia-coller');ELS['at-ia-copie']=el('at-ia-copie');
  await new Promise(r=>{vm.runInContext('atIAChargerPrompt(function(){})',env);setTimeout(r,50);});
  const tpl=vm.runInContext('atPromptTexte()',env);
  verdict('\u2460 prompt compos\u00e9 : cadrage impos\u00e9, JSON lib\u00e9r\u00e9 sur ordre, liste incorpor\u00e9e, seed en repli',
    /NE PRODUIS AUCUN JSON TOUT DE SUITE/.test(tpl)&&/attends mes validations/.test(tpl)
    &&/QUAND, ET SEULEMENT QUAND, JE TE DIS/.test(tpl)&&tpl.indexOf('@@COMPOSANTES@@')<0&&/- titre :/.test(tpl),
    String(tpl.length)+' caractères');

  /* ═══ ⑤⑥⑦ les refus NOMMÉS, qui s'accumulent ═══ */
  function refus(txt){ELS['at-ia-coller'].value=txt;vm.runInContext('atIAVerifier()',env);return ELS['at-ia-msg'].innerHTML||ELS['at-ia-msg'].textContent;}
  let r=refus('{"cases":{"objectif":true,"machin_invente":true}}');
  verdict('\u2464 identifiant inconnu \u2192 refus\u00e9 EN LE NOMMANT',/machin_invente/.test(r)&&/n\u2019existe pas dans l\u2019atelier/.test(r),r.slice(0,150));
  r=refus('{"cases":{"qr_code":true}}');
  verdict('\u2465 composante r\u00e9serv\u00e9e \u2192 refus\u00e9e avec sa raison',/qr_code/.test(r)&&/pas encore/.test(r),r.slice(0,150));
  r=refus('{}');
  verdict('\u2466a JSON vide \u2192 refus clair',/aucun \u00e9l\u00e9ment \u00e0 \u00e9crire/.test(r),r.slice(0,140));
  r=refus('{"cases":{"objectif":true},');
  verdict('\u2466b JSON tronqu\u00e9 \u2192 refus clair, dit quoi faire',/incompl\u00e8te ou mal ferm\u00e9e/.test(r)&&/en entier/.test(r),r.slice(0,150));
  r=refus('{"valeurs":{"criteres_reussite":{"items":"une seule cha\u00eene"}}}');
  verdict('type list re\u00e7oit un texte \u2192 refus\u00e9, dit quoi corriger',/attend une liste de lignes/.test(r),r.slice(0,150));
  r=refus('{"valeurs":{"date_seance":{"texte":"le 3 septembre"}}}');
  verdict('date mal form\u00e9e \u2192 refus\u00e9 avec le format attendu',/AAAA-MM-JJ/.test(r),r.slice(0,150));
  r=refus('{"valeurs":{"objectif":{"champ_qui_nexiste_pas":"x"}}}');
  verdict('champ inconnu \u2192 composante ET champ cit\u00e9s, champs possibles donn\u00e9s',
    /objectif/.test(r)&&/champ_qui_nexiste_pas/.test(r)&&/Champs possibles/.test(r),r.slice(0,170));
  r=refus('{"produit":"produit_bidon","cases":{"objectif":true,"inconnu_a":true,"inconnu_b":true}}');
  const nbLi=(r.match(/<li>/g)||[]).length;
  verdict('les refus S\u2019ACCUMULENT (produit inconnu + 2 identifiants) : '+nbLi+' motifs d\u2019un coup',nbLi>=3,r.slice(0,180));

  /* ═══ ② JSON valide → aperçu → nouvelle feuille ═══ */
  const bon={produit:'fiche_seance',titre:'Le portrait de Fantine',
    cases:{titre:true,objectif:true,criteres_reussite:true},
    valeurs:{titre:{texte:'Le portrait de Fantine'},objectif:{texte:'Rep\u00e9rer les proc\u00e9d\u00e9s du portrait'},
             criteres_reussite:{items:["J\u2019ai relev\u00e9 trois adjectifs","J\u2019ai cit\u00e9 le texte"]}},
    blocs:[{id:'consigne',valeurs:{texte:'Rel\u00e8ve les adjectifs du portrait.'}}]};
  ELS['at-ia-coller'].value=JSON.stringify(bon);
  vm.runInContext('atIAVerifier()',env);
  const ap=ELS['at-ia-apercu'].innerHTML;
  verdict('\u2461a JSON valide \u2192 APER\u00c7U : cases nomm\u00e9es en fran\u00e7ais, contenus, et \u00ab rien n\u2019est enregistr\u00e9 \u00bb',
    /Rien n\u2019est enregistr\u00e9 tant que tu n\u2019as pas choisi/.test(ap)&&/Afficher le titre de la feuille/.test(ap)
    &&/Le portrait de Fantine/.test(ap),ap.slice(0,140));
  verdict('\u2461b le choix : DEUX boutons de m\u00eame poids, aucun pr\u00e9-choisi',
    /Cr\u00e9er une nouvelle feuille/.test(ap)&&/Remplacer la feuille ouverte/.test(ap)
    &&(ap.match(/at-btn-prim/g)||[]).length===2&&!/checked|selected/.test(ap));
  const putsAvant=journal.filter(j=>j.op==='PUT').length;
  verdict('\u2461c aucune \u00e9criture avant le choix',putsAvant===0,String(putsAvant));
  vm.runInContext('atIAInjecterNeuve()',env);await dodo(50);
  const doc=env.AT.doc;
  verdict('\u2461d NOUVELLE FEUILLE cr\u00e9\u00e9e et remplie (titre, cases, valeurs typ\u00e9es, bloc r\u00e9p\u00e9t\u00e9)',
    doc&&doc.titre==='Le portrait de Fantine'&&doc.cases.objectif===true
    &&doc.valeurs.objectif.texte==='Rep\u00e9rer les proc\u00e9d\u00e9s du portrait'
    &&Array.isArray(doc.valeurs.criteres_reussite.items)&&doc.valeurs.criteres_reussite.items.length===2
    &&(doc.contenu||[]).length===1&&doc.contenu[0].id==='consigne'
    &&doc.cases.date_edition===true,   /* les défauts d'atDocNeuf sont conservés */
    JSON.stringify({t:doc&&doc.titre,c:Object.keys(doc.cases||{}).length,b:(doc.contenu||[]).length}));

  /* ═══ ③ remplacement explicite : archive AVANT ═══ */
  const idAvant=env.AT.docId;
  const docAvant=JSON.parse(JSON.stringify(env.AT.doc));
  env._modales.length=0;journal.length=0;
  ELS['at-ia-coller'].value=JSON.stringify(Object.assign({},bon,{titre:'Version remplac\u00e9e'}));
  vm.runInContext('atIAVerifier()',env);
  vm.runInContext('atIARemplacer()',env);
  const mod=env._modales[env._modales.length-1];
  verdict('\u2462a la confirmation CHIFFRE ce qui sera perdu et dit que la version part \u00e0 la corbeille',
    /Tu perdras \d+ case\(s\) coch\u00e9e\(s\) et \d+ bloc\(s\)/.test(mod.msg)&&/corbeille/.test(mod.msg)
    &&mod.btns.length===2&&/Annuler/.test(mod.btns[0].lib),mod.msg.slice(0,160));
  mod.btns[1].fn();await dodo(80);
  const puts=journal.filter(j=>j.op==='PUT');
  const iArch=puts.findIndex(p=>p.ch.indexOf('/corbeille/')===0);
  const iDoc=puts.findIndex(p=>p.ch.indexOf('/site/atelier/documents/')===0);
  verdict('\u2462b L\u2019ARCHIVE PART AVANT le remplacement (journal : arch@'+iArch+' < doc@'+iDoc+')',iArch===0&&iDoc>iArch);
  const cleArch=Object.keys(HUB).find(k=>k.indexOf('/corbeille/')===0);
  const arch=HUB[cleArch];
  verdict('\u2462c l\u2019archive {_meta,data} porte l\u2019ANCIENNE version, retrouvable',
    arch&&arch._meta&&arch._meta.chemin==='/site/atelier/documents/'+idAvant&&arch.data.titre===docAvant.titre,
    cleArch);
  verdict('\u2462d la feuille ouverte porte d\u00e9sormais la nouvelle version, m\u00eame identifiant',
    env.AT.docId===idAvant&&env.AT.doc.titre==='Version remplac\u00e9e');

  /* ═══ ④ archive en échec → ABANDON ═══ */
  env._archiveKO=true;
  const titreAvant=env.AT.doc.titre;const nHubAvant=Object.keys(HUB).length;
  ELS['at-ia-coller'].value=JSON.stringify(Object.assign({},bon,{titre:'NE DOIT PAS PASSER'}));
  vm.runInContext('atIAVerifier()',env);
  vm.runInContext('atIARemplacer()',env);
  env._modales[env._modales.length-1].btns[1].fn();await dodo(80);
  verdict('\u2463 archive en \u00e9chec \u2192 ABANDON : \u00ab rien n\u2019a \u00e9t\u00e9 remplac\u00e9 \u00bb, la feuille est intacte',
    env.AT.doc.titre===titreAvant&&/rien n\u2019a \u00e9t\u00e9 remplac\u00e9/.test(ELS['at-ia-msg'].textContent)
    &&Object.keys(HUB).length===nHubAvant,ELS['at-ia-msg'].textContent.slice(0,120));
  env._archiveKO=false;

  /* ═══ ⑧ le prompt modifié vient de Firebase et survit au rechargement ═══ */
  ELS['at-ia-tpl']=el('at-ia-tpl');
  ELS['at-ia-tpl'].value='MON PROMPT \u00c0 MOI\n@@COMPOSANTES@@';
  vm.runInContext('atIAEnregistrerTpl()',env);await dodo(50);
  verdict('\u2467a le prompt modifi\u00e9 est \u00e9crit au hub (pas sur le poste)',
    HUB['/site/atelier/prompts/fiche_seance']==='MON PROMPT \u00c0 MOI\n@@COMPOSANTES@@'
    &&/enregistr\u00e9/.test(ELS['at-ia-msg'].textContent),ELS['at-ia-msg'].textContent.slice(0,100));
  vm.runInContext('AT_IA.tpl=null;AT_IA.charge=false;',env);   /* rechargement : nouvelle session */
  await new Promise(r=>{vm.runInContext('atIAChargerPrompt(function(){})',env);setTimeout(r,50);});
  const t2=vm.runInContext('atPromptTexte()',env);
  verdict('\u2467b apr\u00e8s rechargement : le prompt de Paul est CONSERV\u00c9, la liste toujours incorpor\u00e9e',
    /^MON PROMPT \u00c0 MOI/.test(t2)&&/- titre :/.test(t2),t2.slice(0,60));
  /* et le seed fait foi si la base ne répond pas */
  delete HUB['/site/atelier/prompts/fiche_seance'];
  vm.runInContext('AT_IA.tpl=null;AT_IA.charge=false;',env);
  await new Promise(r=>{vm.runInContext('atIAChargerPrompt(function(){})',env);setTimeout(r,50);});
  verdict('\u2467c base muette \u2192 le seed en dur fait foi',/NE PRODUIS AUCUN JSON/.test(vm.runInContext('atPromptTexte()',env)));

  /* aucune écriture hors les nœuds attendus */
  const hors=journal.filter(j=>j.op==='PUT'&&!/^\/(corbeille|site\/atelier)\//.test(j.ch));
  verdict('journal : aucune \u00e9criture hors /site/atelier et /corbeille',hors.length===0,JSON.stringify(hors.map(h=>h.ch)));

  fs.writeFileSync('banc2a-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE SITE-COURS-2a : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});
