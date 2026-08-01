/* BANC MÉMOIRE SITE-COURS-2c — le parcours ①→⑦, la taxonomie générée, une notion
   inventée refusée en étant nommée, l'écriture PAR INDEX. Les stubs copient les
   signatures réelles (secuLire → Promise(valeur) ; secuEcrire → Promise({ok,issue})). */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,220)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,240));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cst(src,nom){const m=new RegExp('^var '+nom+'\\s*=[\\s\\S]*?;$','m').exec(src);if(!m)throw new Error('cst: '+nom);return m[0];}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const idx=fs.readFileSync('index.staging.html','utf8');
  const base=fs.readFileSync('index.base.html','utf8');
  const canon=fs.readFileSync('canon.js','utf8');
  const taxo=JSON.parse(fs.readFileSync('taxonomie.json','utf8'));
  const HUB={},journal=[];
  const ELS={};
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
    document:{getElementById:(id)=>ELS[id]||null},
    atEsc:x=>String(x==null?'':x),
    atModaleChoix:(msg,btns)=>{env._modales.push({msg,btns});},_modales:[],
    secuExigeCle:()=>true,
    atCorbeilleCle:(motif)=>'/corbeille/2026-08-01/'+motif+'_120000',
    secuLire:(ch)=>{journal.push({op:'GET',ch});return Promise.resolve(ch in HUB?JSON.parse(JSON.stringify(HUB[ch])):null);},
    secuEcrire:(ch,val)=>{journal.push({op:'PUT',ch,val:JSON.stringify(val).slice(0,90)});
      if(env._archiveKO&&ch.indexOf('/corbeille/')===0)return Promise.resolve({ok:false,issue:{etat:'panne'}});
      if(env._ecritureKO&&env._ecritureKO(ch))return Promise.resolve({ok:false,issue:{etat:'panne'}});
      HUB[ch]=JSON.parse(JSON.stringify(val));return Promise.resolve({ok:true});},
  };
  env.window=env;vm.createContext(env);
  for(const f of ['mjpcPromptVocabulaire','mjpcValidation'])vm.runInContext(extraire(canon,f),env);
  for(const c of ['CH_TYPES_SEANCE','CH_KINDS','CH_SOURCES','CH'])vm.runInContext(cst(idx,c),env);
  for(const f of ['chVocabulaireTaxo','chVocabulaireTypes','chIdsTaxo','chChargerTaxo','chValiderChapitre','chInventaire','chInjecter','chInjecterConfirme','chNettoyerPublished'])
    vm.runInContext(extraire(idx,f),env);
  env.CH.taxo=taxo;

  /* ═══ LA PREUVE « ajouter un produit = une entrée de plus » ═══ */
  const seedBase=base.slice(base.indexOf('var ATELIER_PROMPT_SEED='),base.indexOf('function atPromptTexte'));
  const seedLivre=idx.slice(idx.indexOf('var ATELIER_PROMPT_SEED='),idx.indexOf('function atPromptTexte'));
  verdict('PREUVE ARCHITECTURE : la fiche de s\u00e9ance est INTACTE dans le seed (son entr\u00e9e n\u2019est pas retouch\u00e9e)',
    seedLivre.includes(seedBase.slice(seedBase.indexOf('fiche_seance:'))),'');
  const mecanique=['function atIAChargerPrompt','function atIACopier','function atIAModifier','function atIAEnregistrerTpl','function atIAValider','function atIAApercu','function atIAAppliquer','function atIAInjecterNeuve','function atIARemplacer'];
  verdict('PREUVE ARCHITECTURE : la m\u00e9canique de la zone n\u2019est pas touch\u00e9e (9 fonctions identiques \u00e0 l\u2019octet)',
    mecanique.every(f=>{const a=extraire(base,f.replace('function ','')),b=extraire(idx,f.replace('function ',''));return a===b;}));

  /* ═══ ① LA TAXONOMIE GÉNÉRÉE ═══ */
  let voc=vm.runInContext('chVocabulaireTaxo(CH.taxo)',env);
  const nb=(voc.match(/^- /gm)||[]).length;
  verdict('\u2460a taxonomie G\u00c9N\u00c9R\u00c9E : '+nb+' entr\u00e9es (154 notions + compétences), niveaux affich\u00e9s',
    nb>=154&&/\[6e-3e\]/.test(voc)&&/### Comp\u00e9tences/.test(voc),String(nb));
  const t2=JSON.parse(JSON.stringify(taxo));
  t2.domaines[0].familles[0].notions.push({id:'factice-banc-001',libelleProf:'Notion factice du banc',niveaux:'4e',actif:true});
  const voc2=vm.runInContext('chVocabulaireTaxo('+JSON.stringify(t2)+')',env);
  verdict('\u2460b PREUVE DE G\u00c9N\u00c9RATION : une notion ajout\u00e9e para\u00eet, aucune liste retouch\u00e9e',
    /- factice-banc-001 : Notion factice du banc \[4e\]/.test(voc2)&&(voc2.match(/^- /gm)||[]).length===nb+1);
  const t3=JSON.parse(JSON.stringify(taxo));
  t3.domaines[0].familles[0].notions[0].actif=false;
  const voc3=vm.runInContext('chVocabulaireTaxo('+JSON.stringify(t3)+')',env);
  verdict('\u2460c une notion INACTIVE est exclue',(voc3.match(/^- /gm)||[]).length===nb-1);
  const types=vm.runInContext('chVocabulaireTypes()',env);
  verdict('\u2460d les 7 types de s\u00e9ance mesur\u00e9s sont donn\u00e9s',
    (types.match(/^- /gm)||[]).length===7&&/- etude_texte/.test(types)&&/- tache_finale/.test(types));

  /* ═══ ⑦ LES REFUS : accumulés, cités ═══ */
  const ids=vm.runInContext('chIdsTaxo(CH.taxo)',env);
  const uneVraieNotion=Object.keys(ids.notions)[0];
  const uneVraieComp=Object.keys(ids.competences)[0];
  let R=vm.runInContext('chValiderChapitre('+JSON.stringify({niveau:'3e',chapitre:{title:'T',seances:[
    {title:'S1',type:'sardine',items:{}},
    {title:'S2',type:'etude_texte',notions:['notion-inventee-par-ia'],items:{}},
    {title:'S3',type:'notions',items:{'Cle Majuscule':{title:'x'}}},
    {title:'S4',type:'notions',items:{'ok':{kind:'poisson',published:true}}}
  ]}})+',CH.taxo)',env);
  let m=R.motifs();
  verdict('\u2466 CINQ d\u00e9fauts \u2192 motifs accumul\u00e9s, chacun citant l\u2019\u00e9l\u00e9ment',
    m.length>=5&&m.some(x=>/sardine/.test(x))&&m.some(x=>/Cle Majuscule/.test(x))&&m.some(x=>/poisson/.test(x))&&m.some(x=>/published/.test(x)),JSON.stringify(m).slice(0,300));
  verdict('PREUVE : une notion INVENT\u00c9E est refus\u00e9e EN \u00c9TANT NOMM\u00c9E',
    m.some(x=>/notion-inventee-par-ia/.test(x)&&/n\u2019existe pas/.test(x)),JSON.stringify(m.filter(x=>/inventee/.test(x))));
  const bon={niveau:'3e',chapitre:{title:'La satire et l\u2019argumentation',ordre:3,seances:[
    {title:'\u00c9tude de texte',type:'etude_texte',ordre:2,notions:[uneVraieNotion],competences:[uneVraieComp],
     items:{'etude-de-texte':{title:'\u00c9tude de texte',kind:'doc',source:'drive',ref:'',ordre:1,notions:[uneVraieNotion]},
            'dictee-du-chapitre':{title:'Dict\u00e9e du chapitre',subtitle:'\u00c0 lier \u00e0 une dict\u00e9e existante',kind:'dictee',source:'firebase_app',ref:'',ordre:2}}},
    {title:'Nouvelle s\u00e9ance de rem\u00e9diation',type:'remediation',ordre:9,items:{'fiche':{title:'Fiche de rem\u00e9diation',kind:'doc',source:'drive',ref:''}}}
  ]},aLier:[]};
  verdict('un chapitre valide passe',vm.runInContext('chValiderChapitre('+JSON.stringify(bon)+',CH.taxo).ok()',env)===true);

  /* ═══ ② L'INVENTAIRE FACE À FACE ═══ */
  const existant={title:'La satire et l\u2019argumentation',ordre:3,published:{'3e_charles_de_gaulle':true},seances:[
    {title:'Introduction et analyse d\u2019image',type:'intro_image',items:{'diapo':{title:'Diaporama',kind:'doc',source:'drive',ref:''}}},
    {title:'\u00c9tude de texte',type:'etude_texte',items:{'etude-de-texte':{title:'\u00c9tude de texte',kind:'doc',source:'drive',ref:''}}}
  ]};
  const inv=vm.runInContext('chInventaire('+JSON.stringify(existant)+','+JSON.stringify(bon.chapitre)+',CH.taxo)',env);
  verdict('\u2461a inventaire : l\u2019EXISTANT est list\u00e9 PR\u00c9CIS\u00c9MENT (s\u00e9ances, items, outil, liaison), pas compt\u00e9',
    inv.existant.length===2&&inv.existant[0].items[0].titre==='Diaporama'&&inv.existant[0].items[0].kind==='doc');
  verdict('\u2461b face \u00e0 face : DÉJÀ LÀ / NOUVEAU / DIFFÉRENT par item',
    inv.propose[0].etat==='DÉJÀ LÀ'&&inv.propose[1].etat==='NOUVEAU'
    &&inv.propose[0].items.find(x=>x.cle==='etude-de-texte').etat==='DÉJÀ LÀ'
    &&inv.propose[0].items.find(x=>x.cle==='dictee-du-chapitre').etat==='NOUVEAU',JSON.stringify(inv.propose.map(p=>p.etat)));
  verdict('\u2461c les notions sont nomm\u00e9es EN LIBELL\u00c9 (r\u00e8gle des deux publics), jamais l\u2019identifiant seul',
    inv.propose[0].notions[0]===ids.notions[uneVraieNotion]&&inv.propose[0].notions[0]!==uneVraieNotion,inv.propose[0].notions[0]);
  verdict('\u2465 LISTE DE TRAVAIL : l\u2019item \u00e0 lier est rep\u00e9r\u00e9 et nomm\u00e9 avec son outil',
    inv.aLier.length===1&&inv.aLier[0].item==='dictee-du-chapitre'&&inv.aLier[0].outil==='dictee'&&/lier/.test(inv.aLier[0].pourquoi),JSON.stringify(inv.aLier));

  /* ═══ ③ COMPLÉTER : n'écrit que les manques, ÉCRITURE PAR INDEX ═══ */
  HUB['/site/3e/chapitres']=[null,{title:'Autre',ordre:1,seances:[]},null,JSON.parse(JSON.stringify(existant))];
  env.CH.json=bon;env.CH.niveau='3e';env.CH.chapIdx=3;env.CH.inventaire=inv;
  ELS['ch-msg']={innerHTML:'',className:'',textContent:''};
  journal.length=0;
  vm.runInContext("chInjecterConfirme('completer')",env);await dodo(200);
  const puts=journal.filter(j=>j.op==='PUT');
  verdict('\u2462a COMPL\u00c9TER : \u00e9criture PAR INDEX, jamais la liste enti\u00e8re, jamais push',
    puts.length>0&&puts.every(p=>/^\/site\/3e\/chapitres\/\d+\//.test(p.ch))&&!puts.some(p=>p.ch==='/site/3e/chapitres'),
    JSON.stringify(puts.map(p=>p.ch)));
  verdict('\u2462b seuls les MANQUES sont \u00e9crits : l\u2019item d\u00e9j\u00e0 l\u00e0 n\u2019est pas retouch\u00e9',
    !puts.some(p=>/\/items\/etude-de-texte$/.test(p.ch))&&puts.some(p=>/\/items\/dictee-du-chapitre$/.test(p.ch)),
    JSON.stringify(puts.map(p=>p.ch)));
  verdict('\u2462c la s\u00e9ance nouvelle est ajout\u00e9e \u00e0 un rang neuf, l\u2019existante n\u2019est pas remplac\u00e9e',
    puts.some(p=>/\/seances\/2$/.test(p.ch))&&!puts.some(p=>/\/seances\/[01]$/.test(p.ch)));
  verdict('\u2462d le trou d\u2019index 0 est TRAVERS\u00c9, jamais supprim\u00e9',HUB['/site/3e/chapitres'][0]===null);
  const ecritItem=HUB['/site/3e/chapitres/3/seances/1/items/dictee-du-chapitre'];
  verdict('\u2462e `published` n\u2019est JAMAIS \u00e9crit',ecritItem&&!('published' in ecritItem),JSON.stringify(Object.keys(ecritItem||{})));
  verdict('\u2462f les tags (notions/comp\u00e9tences) de la s\u00e9ance sont ajout\u00e9s l\u00e0 o\u00f9 il n\u2019y en avait pas',
    puts.some(p=>/\/seances\/1\/notions$/.test(p.ch))&&puts.some(p=>/\/seances\/1\/competences$/.test(p.ch)));

  /* ═══ ④ REMPLACER : archive AVANT, abandon si elle échoue ═══ */
  journal.length=0;
  env._archiveKO=true;
  const avant=JSON.stringify(HUB['/site/3e/chapitres'][3]);
  vm.runInContext("chInjecterConfirme('remplacer')",env);await dodo(200);
  verdict('\u2463a archive en \u00c9CHEC \u2192 ABANDON : \u00ab rien n\u2019a \u00e9t\u00e9 remplac\u00e9 \u00bb, aucune \u00e9criture du chapitre',
    /rien n\u2019a \u00e9t\u00e9 remplac\u00e9/.test(ELS['ch-msg'].innerHTML)&&!journal.some(j=>j.op==='PUT'&&/chapitres\/3$/.test(j.ch)),
    ELS['ch-msg'].innerHTML.slice(0,120));
  env._archiveKO=false;journal.length=0;
  vm.runInContext("chInjecterConfirme('remplacer')",env);await dodo(200);
  const p2=journal.filter(j=>j.op==='PUT');
  const iA=p2.findIndex(p=>/corbeille/.test(p.ch)),iD=p2.findIndex(p=>/chapitres\/3$/.test(p.ch));
  verdict('\u2463b l\u2019ARCHIVE part AVANT le remplacement (journal : arch@'+iA+' < doc@'+iD+')',iA===0&&iD>iA);
  const arch=Object.keys(HUB).find(k=>/corbeille/.test(k));
  verdict('\u2463c l\u2019archive {_meta,data} porte l\u2019ancien chapitre',
    HUB[arch]&&HUB[arch]._meta.chemin==='/site/3e/chapitres/3'&&HUB[arch].data.title===existant.title);
  verdict('\u2463d la publication existante est CONSERV\u00c9E, jamais d\u00e9cid\u00e9e ici',
    HUB['/site/3e/chapitres/3'].published&&HUB['/site/3e/chapitres/3'].published['3e_charles_de_gaulle']===true);

  /* ═══ ⑤ JUMEAU ═══ */
  journal.length=0;
  env.CH.chapIdx=3;
  vm.runInContext("chInjecterConfirme('jumeau')",env);await dodo(200);
  const pj=journal.filter(j=>j.op==='PUT');
  const cle=pj[0]&&pj[0].ch;
  const neuf=HUB[cle];
  verdict('\u2464 JUMEAU : ajout\u00e9 \u00e0 un rang neuf en fin de liste, marqu\u00e9 \u00ab proposition \u00bb, NON publi\u00e9',
    /\/chapitres\/4$/.test(cle)&&/\(proposition\)$/.test(neuf.title)&&!('published' in neuf)
    &&!(neuf.seances||[]).some(se=>'published' in se),JSON.stringify({cle:cle,titre:neuf.title}));

  /* ═══ le geste non terminé si une écriture échoue ═══ */
  journal.length=0;env.CH.chapIdx=3;
  HUB['/site/3e/chapitres'][3]=JSON.parse(JSON.stringify(existant));
  env._ecritureKO=(ch)=>/\/items\/dictee-du-chapitre$/.test(ch);
  vm.runInContext("chInjecterConfirme('completer')",env);await dodo(250);
  verdict('une \u00e9criture en \u00e9chec \u2192 le geste se d\u00e9clare NON TERMIN\u00c9 (patron allSettled)',
    /n\u2019est pas termin\u00e9/.test(ELS['ch-msg'].innerHTML)&&/Relance/.test(ELS['ch-msg'].innerHTML),ELS['ch-msg'].innerHTML.slice(0,150));
  env._ecritureKO=null;

  fs.writeFileSync('bancsc2c-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE SITE-COURS-2c : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});
