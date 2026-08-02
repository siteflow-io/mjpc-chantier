/* BANC MÉMOIRE SITE-COURS-2e — la réparation prouvée, l'état de l'année généré,
   le sommaire calculé et suffisant, la déclaration validée. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,220)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,240));};
function ex(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cs(src,nom){const m=new RegExp('^var '+nom+'\\s*=','m').exec(src);let i=m.index+m[0].length,q=null;
 for(;i<src.length;i++){const c=src[i];
  if(q){if(c==='\\'){i++;continue;}if(c===q)q=null;continue;}
  if(c==='"'||c==="'"||c==='`'){q=c;continue;}
  if(c==='/'&&src[i+1]==='/'){i=src.indexOf('\n',i);continue;}
  if(c===';')break;}
 return src.slice(m.index,i+1);}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const idx=fs.readFileSync('index.staging.html','utf8');
  const base=fs.readFileSync('index.base.html','utf8');
  const canon=fs.readFileSync('canon.js','utf8');
  const taxo=JSON.parse(fs.readFileSync('taxo.json','utf8'));
  const HUB={},journal=[],ELS={};
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
    document:{getElementById:(id)=>ELS[id]||null},
    atEsc:x=>String(x==null?'':x),
    atModaleChoix:(m,b)=>{env._modales.push({m,b});},_modales:[],
    secuExigeCle:()=>true,atCorbeilleCle:(m)=>'/corbeille/2026-08-02/'+m,
    secuLire:(ch)=>{journal.push({op:'GET',ch});return Promise.resolve(ch in HUB?JSON.parse(JSON.stringify(HUB[ch])):null);},
    secuEcrire:(ch,v)=>{journal.push({op:'PUT',ch,v:JSON.stringify(v).slice(0,80)});HUB[ch]=JSON.parse(JSON.stringify(v));return Promise.resolve({ok:true});}};
  env.window=env;vm.createContext(env);
  for(const f of ['mjpcPromptVocabulaire','mjpcValidation'])vm.runInContext(ex(canon,f),env);
  for(const c of ['CH_TYPES_SEANCE','CH_KINDS','CH_SOURCES','CH','CH_ENTREES','CH_ENTREES_OUVERTES'])vm.runInContext(cs(idx,c),env);
  for(const f of ['chEntreesDuNiveau','chCompetencesC4','chVocabulaireCompetences','chVocabulaireEntrees',
                  'chEtatAnnee','chSommaire','chSommaireSeance','chSommaireObjet','chSommaireSuffisant',
                  'chValiderDeclaration','chIdsTaxo','chValiderChapitre','chInventaire','chNettoyerPublished','chInjecterConfirme'])
    vm.runInContext(ex(idx,f),env);
  env.CH.taxo=taxo;env.CH.niveau='3e';

  /* ═══ ① LA RÉPARATION : un item EXISTANT reçoit ses notions ═══ */
  verdict('AVANT (base) : un item existant n\u2019\u00e9tait JAMAIS retouch\u00e9',
    /if\(m\.se\.items&&m\.se\.items\[k\]\)return;\s*\/\* jamais un item existant \*\//.test(base));
  const ids=vm.runInContext('chIdsTaxo(CH.taxo)',env);
  const uneNotion=Object.keys(ids.notions)[0];
  const existant={title:'La satire',ordre:3,published:{'3e_x':true},seances:[
    {title:'\u00c9tude de texte',type:'etude_texte',items:{'etude':{title:'\u00c9tude',kind:'doc',source:'drive',ref:''}}}]};
  HUB['/site/3e/chapitres']=[null,JSON.parse(JSON.stringify(existant))];
  const propose={niveau:'3e',chapitre:{title:'La satire',ordre:3,
    entree:'articles_essai',competencesMajeures:['c4-ecrire-01'],competencesMineures:['c4-lire-01'],
    problematique:'La satire peut-elle corriger ?',aRetenir:'Les proc\u00e9d\u00e9s de l\u2019ironie.',
    seances:[{title:'\u00c9tude de texte',type:'etude_texte',notions:[uneNotion],
      items:{'etude':{title:'\u00c9tude',kind:'doc',source:'drive',ref:'',notions:[uneNotion]}}}]}};
  env.CH.json=propose;env.CH.chapIdx=1;env.CH.inventaire={aLier:[]};
  ELS['ch-msg']={innerHTML:'',className:''};ELS['ch-som-oui']={checked:true};
  journal.length=0;
  vm.runInContext("chInjecterConfirme('completer')",env);await dodo(250);
  const puts=journal.filter(j=>j.op==='PUT');
  verdict('\u2460 R\u00c9PARATION PROUV\u00c9E : les notions d\u2019un item EXISTANT sont \u00e9crites au hub',
    puts.some(p=>/\/items\/etude\/notions$/.test(p.ch)),JSON.stringify(puts.map(p=>p.ch)));
  verdict('\u2460bis le reste de l\u2019item n\u2019est PAS touch\u00e9 (aucune \u00e9criture sur l\u2019item entier)',
    !puts.some(p=>/\/items\/etude$/.test(p.ch)));
  verdict('\u2461 la D\u00c9CLARATION du chapitre est \u00e9crite (entr\u00e9e + majeures + mineures)',
    puts.some(p=>/\/chapitres\/1\/entree$/.test(p.ch))&&puts.some(p=>/competencesMajeures$/.test(p.ch))
    &&puts.some(p=>/competencesMineures$/.test(p.ch)),JSON.stringify(puts.map(p=>p.ch)));
  verdict('\u2461bis relu au hub : les tags et la d\u00e9claration y sont',
    HUB['/site/3e/chapitres/1/entree']==='articles_essai'
    &&HUB['/site/3e/chapitres/1/seances/0/items/etude/notions'][0]===uneNotion);
  verdict('\u2462 la feuille SOMMAIRE est \u00e9crite en rang 0... ou en rang neuf, et JAMAIS publi\u00e9e',
    puts.some(p=>/\/seances\/\d+$/.test(p.ch))&&!puts.some(p=>p.v&&/published/.test(p.v)),
    JSON.stringify(puts.filter(p=>/seances\/\d+$/.test(p.ch)).map(p=>p.ch)));
  /* décochée : rien */
  ELS['ch-som-oui']={checked:false};journal.length=0;
  HUB['/site/3e/chapitres']=[null,JSON.parse(JSON.stringify(existant))];
  vm.runInContext("chInjecterConfirme('completer')",env);await dodo(250);
  verdict('\u2462bis d\u00e9coch\u00e9e : AUCUNE feuille sommaire \u00e9crite',
    !journal.some(j=>j.op==='PUT'&&/seances\/\d+$/.test(j.ch)&&/sommaire/.test(j.v||'')));

  /* ═══ ③ L'ÉTAT DE L'ANNÉE, GÉNÉRÉ ═══ */
  const chaps=[null,{title:'Chap 1',ordre:1,entree:'recit',competencesMajeures:['c4-ecrire-01']},
                    {title:'Chap 2',ordre:2,entree:'poesie',competencesMajeures:['c4-ecrire-01']}];
  let etat=vm.runInContext('chEtatAnnee('+JSON.stringify(chaps)+',"3e",CH.taxo)',env);
  verdict('\u2463 \u00e9tat de l\u2019ann\u00e9e G\u00c9N\u00c9R\u00c9 : chaque chapitre, son entr\u00e9e, ses majeures EN LIBELL\u00c9',
    /Chapitre 1/.test(etat)&&/R\u00e9cit/.test(etat)&&!/c4-ecrire-01/.test(etat),etat.split('\n')[0]);
  verdict('\u2463bis il SIGNALE ce qui revient (alternance) et ce qui manque',
    /D\u00e9j\u00e0 majeures plusieurs fois/.test(etat)&&/pas encore abord\u00e9es/.test(etat)&&/Th\u00e9\u00e2tre/.test(etat),etat.slice(-160));
  const chaps2=chaps.concat([{title:'Chapitre factice du banc',ordre:9,entree:'theatre',competencesMajeures:['c4-oral-01']}]);
  const etat2=vm.runInContext('chEtatAnnee('+JSON.stringify(chaps2)+',"3e",CH.taxo)',env);
  verdict('\u2463ter PREUVE DE G\u00c9N\u00c9RATION : un chapitre ajout\u00e9 para\u00eet, aucune liste retouch\u00e9e',
    /Chapitre factice du banc/.test(etat2)&&!/Th\u00e9\u00e2tre.{0,40}pas encore abord/.test(etat2));
  verdict('\u2463quater le trou de liste (rang null) est TRAVERS\u00c9',!/undefined|null/.test(etat));

  /* ═══ ④ LE SOMMAIRE, CALCULÉ ET SUFFISANT ═══ */
  const som=vm.runInContext('chSommaire('+JSON.stringify(propose.chapitre)+',"3e",CH.taxo,'+JSON.stringify(propose.chapitre)+')',env);
  verdict('\u2464 sommaire CALCUL\u00c9 : entr\u00e9e, majeures/mineures en libell\u00e9, plan, notions, probl\u00e9matique',
    som.entree==='Articles et essai'&&som.majeures.length===1&&!/c4-/.test(som.majeures[0])
    &&som.plan.length===1&&som.notions.length===1&&/corriger/.test(som.problematique),JSON.stringify(som).slice(0,180));
  const suf=vm.runInContext('chSommaireSuffisant('+JSON.stringify(som)+')',env);
  verdict('\u2464bis il SE SUFFIT \u00c0 LUI-M\u00caME : titre, entr\u00e9e, majeures, plan \u2014 sans relire les s\u00e9ances',suf.ok,JSON.stringify(suf));
  const somPauvre=vm.runInContext('chSommaire({title:"X",seances:[]},"3e",CH.taxo,{})',env);
  const sufP=vm.runInContext('chSommaireSuffisant('+JSON.stringify(somPauvre)+')',env);
  verdict('\u2464ter un sommaire incomplet le DIT, en nommant ce qui manque',
    !sufP.ok&&sufP.manque.length>=3,JSON.stringify(sufP.manque));
  const obj=vm.runInContext('chSommaireObjet('+JSON.stringify(som)+')',env);
  verdict('\u2464quater la s\u00e9ance de rang 0 porte des ITEMS comme les autres, et aucun `published`',
    obj.ordre===0&&obj.type==='sommaire'&&typeof obj.items==='object'&&!('published' in obj));

  /* ═══ ⑤ LA VALIDATION ═══ */
  let R=vm.runInContext('chValiderDeclaration('+JSON.stringify({niveau:'3e',chapitre:{
    entree:'bande_dessinee',competencesMajeures:['c4-ecrire-01','c4-inventee-99'],competencesMineures:['c4-ecrire-01']}})+',CH.taxo)',env);
  let m=R.motifs();
  verdict('\u2465 refus NOMM\u00c9S et accumul\u00e9s : entr\u00e9e inconnue, comp\u00e9tence invent\u00e9e, doublon majeure/mineure',
    m.length>=3&&m.some(x=>/bande_dessinee/.test(x))&&m.some(x=>/c4-inventee-99/.test(x))
    &&m.some(x=>/\u00e0 la fois majeure et mineure/.test(x)),JSON.stringify(m).slice(0,250));
  verdict('une d\u00e9claration valide passe',vm.runInContext('chValiderDeclaration('+JSON.stringify(propose)+',CH.taxo).ok()',env)===true);
  verdict('6e/5e : la liste reste OUVERTE (pas de refus), avec son message',
    vm.runInContext('chEntreesDuNiveau("6e")',env)===null
    &&vm.runInContext('chValiderDeclaration({niveau:"6e",chapitre:{entree:"conte"}},CH.taxo).ok()',env)===true
    &&/pas encore arr\u00eat\u00e9e/.test(vm.runInContext('CH_ENTREES_OUVERTES',env)));
  verdict('journal : aucune \u00e9criture hors /site/3e/chapitres et /corbeille',
    journal.filter(j=>j.op==='PUT'&&!/^\/(site\/3e\/chapitres|corbeille)/.test(j.ch)).length===0);
  fs.writeFileSync('bancsc2e-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE SITE-COURS-2e : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});
