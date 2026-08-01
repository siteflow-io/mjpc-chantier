/* BANC MÉMOIRE SITE-COURS-3a — le parcours ①→⑥, le vocabulaire généré, un champ
   de forme refusé en étant nommé, la relecture qui ferme l'écriture. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,220)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,240));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cst(src,nom){const m=new RegExp('^var '+nom+'\\s*=[\\s\\S]*?;$','m').exec(src);if(!m)throw new Error('cst: '+nom);return m[0];}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const idx=fs.readFileSync('index.staging.html','utf8');
  const base=fs.readFileSync('index.base.html','utf8');
  const canon=fs.readFileSync('canon.js','utf8');
  const HUB={},journal=[];const ELS={};
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,encodeURIComponent,
    document:{getElementById:(id)=>ELS[id]||null,createElement:()=>({style:{},className:'',id:'',set innerHTML(v){this._h=v;},get innerHTML(){return this._h||'';}}),body:{appendChild:()=>{}}},
    atEsc:x=>String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;'),
    atModaleChoix:(msg,btns)=>{env._modales.push({msg,btns});},_modales:[],
    secuExigeCle:()=>true,
    sanMJPC:x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]+/g,'_'),
    atCorbeilleCle:(m)=>'/corbeille/2026-08-01/'+m+'_120000',
    secuLire:(ch)=>{journal.push({op:'GET',ch});return Promise.resolve(ch in HUB?JSON.parse(JSON.stringify(HUB[ch])):null);},
    secuEcrire:(ch,val)=>{journal.push({op:'PUT',ch});
      if(env._archiveKO&&ch.indexOf('/corbeille/')===0)return Promise.resolve({ok:false});
      if(env._ecritureKO&&ch.indexOf('/site/diaporamas/')===0)return Promise.resolve({ok:false});
      HUB[ch]=JSON.parse(JSON.stringify(val));return Promise.resolve({ok:true});},
  };
  env.window=env;vm.createContext(env);
  for(const f of ['mjpcPromptVocabulaire','mjpcValidation'])vm.runInContext(extraire(canon,f),env);
  for(const c of ['DIAPO_NOEUD','DIAPO_BLOCS','DIAPO_FORME_INTERDITE','DP'])vm.runInContext(cst(idx,c),env);
  for(const f of ['diapoVocabulaireBlocs','diapoValider','diapoRendreBloc','diapoRendre','diapoCles','diapoTexteBrut',
                  'diapoMarquer','diapoIdPropose','diapoEnregistrer','diapoEcrire','diapoRelecture','openDiaporamaById'])
    vm.runInContext(extraire(idx,f),env);

  /* ═══ « ajouter un produit = une entrée de plus », 3e fois ═══ */
  const MECA=['atIAChargerPrompt','atIACopier','atIAModifier','atIAEnregistrerTpl','atIAValider','atIAApercu','atIAAppliquer','atIAInjecterNeuve','atIARemplacer','atIAVerifier','chValiderChapitre','chInventaire'];
  verdict('PREUVE (3e fois) : les '+MECA.length+' fonctions de la m\u00e9canique sont IDENTIQUES \u00c0 L\u2019OCTET',
    MECA.every(f=>extraire(base,f)===extraire(idx,f)),MECA.filter(f=>extraire(base,f)!==extraire(idx,f)).join(','));
  const seedB=base.slice(base.indexOf('var ATELIER_PROMPT_SEED='),base.indexOf('function atPromptTexte'));
  const seedL=idx.slice(idx.indexOf('var ATELIER_PROMPT_SEED='),idx.indexOf('function atPromptTexte'));
  verdict('PREUVE : les deux produits pr\u00e9c\u00e9dents sont intacts dans le seed',
    seedL.includes(seedB.slice(seedB.indexOf('chapitre:'))));

  /* ═══ LE VOCABULAIRE GÉNÉRÉ ═══ */
  let voc=vm.runInContext('diapoVocabulaireBlocs()',env);
  const n0=(voc.match(/^- /gm)||[]).length;
  /* 11 blocs livrés : les 10 du cadrage + `paragraphe` (un texte courant sans
     puces est fréquent dans un cours) — écart signalé au rapport. */
  verdict('\u2460a vocabulaire G\u00c9N\u00c9R\u00c9 : '+n0+' blocs (10 du cadrage + paragraphe), champs typ\u00e9s',
    n0===11&&/- citation :/.test(voc)&&/liste de lignes/.test(voc)&&/texte long/.test(voc),String(n0));
  vm.runInContext("DIAPO_BLOCS.bloc_factice_banc={libelle:'Bloc factice du banc',champs:[{k:'texte',l:'le texte',kind:'text'}]};",env);
  const voc2=vm.runInContext('diapoVocabulaireBlocs()',env);
  verdict('\u2460b PREUVE DE G\u00c9N\u00c9RATION : un bloc ajout\u00e9 para\u00eet, aucune liste retouch\u00e9e',
    /- bloc_factice_banc : Bloc factice du banc/.test(voc2)&&(voc2.match(/^- /gm)||[]).length===n0+1);
  vm.runInContext("delete DIAPO_BLOCS.bloc_factice_banc;",env);

  /* ═══ ⑥ LES REFUS : accumulés, cités ═══ */
  let R=vm.runInContext('diapoValider('+JSON.stringify({titre:'T',diapos:[{titre:'D1',blocs:[
    {type:'sardine',texte:'x'},
    {type:'puces',items:[],style:'gras'},
    {type:'image',legende:'une gravure'},
    {type:'tableau',entetes:['a','b'],lignes:[['1'],['1','2']]},
    {type:'definition',terme:'X'}
  ]}]})+')',env);
  let m=R.motifs();
  verdict('\u2465 cinq d\u00e9fauts \u2192 motifs accumul\u00e9s, chaque bloc CIT\u00c9',
    m.length>=5&&m.some(x=>/sardine/.test(x))&&m.some(x=>/bloc 4/.test(x)&&/cellule/.test(x))&&m.some(x=>/bloc 5/.test(x)),JSON.stringify(m).slice(0,300));
  verdict('PREUVE : un champ de FORME est refus\u00e9 EN \u00c9TANT NOMM\u00c9',
    m.some(x=>/\u00ab style \u00bb/.test(x)&&/la forme est d\u00e9cid\u00e9e par le site/.test(x)),JSON.stringify(m.filter(x=>/style/.test(x))));
  verdict('PREUVE : une image SANS description pour lecteur d\u2019\u00e9cran est refus\u00e9e',
    m.some(x=>/lecteurs d\u2019\u00e9cran/.test(x)&&/invisible pour qui ne voit pas/.test(x)));
  R=vm.runInContext('diapoValider('+JSON.stringify({titre:'T',diapos:[{titre:'D',blocs:[{type:'tableau',entetes:['a','b','c','d'],lignes:[['1','2','3','4']]}]}]})+')',env);
  verdict('un tableau \u00e0 4 colonnes est refus\u00e9 (illisible au t\u00e9l\u00e9phone), avec la conduite \u00e0 tenir',
    R.motifs().some(x=>/4 colonnes/.test(x)&&/Coupe-le en deux/.test(x)));
  const bon={titre:'Le portrait \u2014 s\u00e9ance 2',niveau:'3e',diapos:[{titre:'Les proc\u00e9d\u00e9s',blocs:[
    {type:'puces',items:['Le portrait physique','Le portrait moral']},
    {type:'definition',terme:'Un portrait',texte:'la description d\u2019un personnage'},
    {type:'citation',texte:'Elle \u00e9tait belle\u2026',auteur:'Hugo',oeuvre:'Les Mis\u00e9rables'},
    {type:'tableau',entetes:['Proc\u00e9d\u00e9','Effet'],lignes:[['Adjectif','pr\u00e9cise'],['Comparaison','image']]},
    {type:'image',legende:'Gravure de 1862',alt:'Portrait grav\u00e9 de Fantine',ref:''},
    {type:'note',texte:'Relire la fiche',ton:'\u00c0 retenir'}]}]};
  verdict('un diaporama valide passe',vm.runInContext('diapoValider('+JSON.stringify(bon)+').ok()',env)===true);

  /* ═══ LE RENDU : chaque bloc a une forme, aucune dépendance externe ═══ */
  const html=vm.runInContext('diapoRendre('+JSON.stringify(bon)+')',env);
  verdict('\u2461 le GABARIT rend chaque type de bloc',
    /dp-ul/.test(html)&&/dp-def/.test(html)&&/dp-cit/.test(html)&&/dp-tab/.test(html)&&/dp-fig/.test(html)&&/dp-note/.test(html));
  verdict('le tableau porte data-ent sur chaque cellule (bascule en paires au t\u00e9l\u00e9phone)',
    /data-ent="Proc\u00e9d\u00e9"/.test(html)&&/data-ent="Effet"/.test(html));
  verdict('l\u2019image sans r\u00e9f\u00e9rence annonce le d\u00e9p\u00f4t \u00e0 venir, avec sa description',
    /dp-img-vide/.test(html)&&/Portrait grav\u00e9 de Fantine/.test(html));
  verdict('aucune d\u00e9pendance externe dans le rendu (hors vignette Drive d\u2019une image d\u00e9pos\u00e9e)',
    !/<script|cdn\.|unpkg|googleapis/.test(html));
  verdict('le texte est du VRAI TEXTE (s\u00e9lectionnable) : aucun canvas, aucune image de texte',
    !/<canvas|<svg/.test(html)&&/Le portrait physique/.test(html));

  /* ═══ ② LA RELECTURE ferme l'écriture ═══ */
  env.DP.json=bon;env.DP.relus={};
  ELS['dp-relecture']={innerHTML:''};ELS['dp-msg']={innerHTML:'',className:'',textContent:''};
  vm.runInContext('diapoRelecture()',env);
  const rel=ELS['dp-relecture'].innerHTML;
  verdict('\u2461 relecture bloc \u00e0 bloc : forme finale ET texte brut en regard, une case par bloc',
    /dp-rel-forme/.test(rel)&&/dp-rel-brut/.test(rel)&&(rel.match(/type="checkbox"/g)||[]).length===6
    &&/0 bloc\(s\) relu\(s\) sur 6/.test(rel),rel.slice(0,120));
  verdict('\u2461bis le bouton d\u2019\u00e9criture est FERM\u00c9 tant que tout n\u2019est pas relu',
    /id="dp-btn-ecrire"[^>]*disabled/.test(rel)&&/Il reste 6 bloc\(s\) \u00e0 relire/.test(rel));
  verdict('le texte brut d\u2019un bloc image montre l\u2019alternative textuelle (ce que personne ne relit jamais)',
    /alt : Portrait grav\u00e9 de Fantine/.test(rel));
  /* on relit tout */
  ELS['dp-compteur']={textContent:''};ELS['dp-btn-ecrire']={disabled:true};ELS['dp-garde']={textContent:''};
  vm.runInContext('diapoCles().forEach(function(k){diapoMarquer(k,true);});',env);
  verdict('\u2461ter apr\u00e8s relecture compl\u00e8te : le bouton s\u2019ouvre, le compteur le dit',
    ELS['dp-btn-ecrire'].disabled===false&&/6 bloc\(s\) relu\(s\) sur 6/.test(ELS['dp-compteur'].textContent));

  /* ═══ ③④ RIEN NE S'ÉCRIT AVANT CONFIRMATION, puis écriture par verdict ═══ */
  ELS['dp-id']={value:'portrait-seance-2'};
  journal.length=0;env._modales.length=0;
  vm.runInContext('diapoEnregistrer()',env);await dodo(120);
  verdict('\u2462 aucune \u00e9criture avant confirmation (une modale, z\u00e9ro PUT)',
    env._modales.length===1&&journal.filter(j=>j.op==='PUT').length===0&&/Rien ne porte ce nom/.test(env._modales[0].msg));
  env._modales[0].btns.find(b=>/Enregistrer/.test(b.lib)).fn();await dodo(150);
  verdict('\u2463 \u00e9criture par verdict au bon n\u0153ud, et rien \u00e0 archiver la premi\u00e8re fois',
    HUB['/site/diaporamas/portrait-seance-2']&&!journal.some(j=>/corbeille/.test(j.ch))
    &&/Diaporama enregistr\u00e9/.test(ELS['dp-msg'].innerHTML),JSON.stringify(journal.map(j=>j.op+' '+j.ch)));
  verdict('le message dit comment le rendre visible (le lier \u00e0 une s\u00e9ance)',
    /\u00e9l\u00e9ment de type <b>diaporama<\/b>/.test(ELS['dp-msg'].innerHTML));

  /* ═══ ⑤ REMPLACEMENT : archive AVANT, abandon si elle échoue ═══ */
  journal.length=0;env._modales.length=0;env._archiveKO=true;
  const avant=JSON.stringify(HUB['/site/diaporamas/portrait-seance-2']);
  vm.runInContext('diapoEnregistrer()',env);await dodo(150);
  verdict('\u2464a la confirmation ANNONCE le remplacement et la corbeille',
    /partira d\u2019abord \u00e0 la corbeille/.test(env._modales[0].msg));
  env._modales[0].btns.find(b=>/Enregistrer/.test(b.lib)).fn();await dodo(150);
  verdict('\u2464b archive en \u00c9CHEC \u2192 ABANDON, \u00ab rien n\u2019a \u00e9t\u00e9 remplac\u00e9 \u00bb, le diaporama est intact',
    /rien n\u2019a \u00e9t\u00e9 remplac\u00e9/.test(ELS['dp-msg'].innerHTML)
    &&JSON.stringify(HUB['/site/diaporamas/portrait-seance-2'])===avant
    &&!journal.some(j=>j.op==='PUT'&&/diaporamas/.test(j.ch)),ELS['dp-msg'].innerHTML.slice(0,110));
  env._archiveKO=false;journal.length=0;env._modales.length=0;
  vm.runInContext('diapoEnregistrer()',env);await dodo(150);
  env._modales[0].btns.find(b=>/Enregistrer/.test(b.lib)).fn();await dodo(200);
  const puts=journal.filter(j=>j.op==='PUT');
  const iA=puts.findIndex(p=>/corbeille/.test(p.ch)),iD=puts.findIndex(p=>/diaporamas/.test(p.ch));
  verdict('\u2464c l\u2019ARCHIVE part AVANT le remplacement (arch@'+iA+' < doc@'+iD+')',iA===0&&iD>iA);
  const arch=Object.keys(HUB).find(k=>/corbeille/.test(k));
  verdict('\u2464d l\u2019archive {_meta,data} porte l\u2019ancien diaporama',
    HUB[arch]&&HUB[arch]._meta.chemin==='/site/diaporamas/portrait-seance-2'&&HUB[arch].data.titre===bon.titre);

  /* ═══ LE VIEWER ÉLÈVE et le lien avec le prompt maître ═══ */
  verdict('la branche openItem existe pour kind:diaporama + source:firebase_app',
    /if\(item\.kind==='diaporama' && src==='firebase_app'\)\{openDiaporamaById\(ref,item\.title\);return;\}/.test(idx));
  verdict('le prompt ma\u00eetre de chapitre peut d\u00e9signer un diaporama (CH_KINDS)',
    /var CH_KINDS=\['doc','dictee','reecriture','analyse_logique','qcm','tache','diaporama'\]/.test(idx));
  verdict('le format d\u2019item n\u2019a PAS chang\u00e9 (kind/source/ref inchang\u00e9s, CH_SOURCES intact)',
    /var CH_SOURCES=\['drive','html','external','firebase_app'\];/.test(idx));

  fs.writeFileSync('bancsc3a-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE SITE-COURS-3a : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});
