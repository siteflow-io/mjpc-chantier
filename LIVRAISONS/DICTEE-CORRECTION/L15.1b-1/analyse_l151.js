/* [L15.1] L'ANALYSE DES ERREURS PAR L'ÉCART — le moteur (générique) et ses types de motif ; les catégories sont des OBJETS (seed embarqué,
   synchronisé au hub site/analyses/categories/<id> à la première ouverture) ; les commentaires, éditables par Paul, vivent au hub. */
var VOY_L151="aeiouyàâäéèêëîïôöùûüœæ";
function estVoyL151(c){return VOY_L151.indexOf(String(c||"").toLowerCase())>=0;}
/* syllabes(mot, {vers:false}) — la césure de la langue parlée (Paul, 05/10) : une consonne entre deux voyelles part avec la suivante ;
   deux consonnes se séparent sauf les groupes indissociables ; trois : après la première sauf groupe ; voyelles composées et nasales ensemble ;
   le -e muet final ne fait pas de syllabe (belle = 1) ; apostrophes et traits d'union coupent ; jamais de découpe par nombre de lettres. */
var GROUPES_INDISS_L151=["bl","br","cl","cr","dr","fl","fr","gl","gr","pl","pr","tr","vr","ch","ph","th","gn","qu","gu"];
function syllabes(mot,opts){var vers=!!(opts&&opts.vers),w=String(mot||"");if(!w)return [];
  if(/[-'\u2019 ]/.test(w)){var out=[];w.split(/([-'\u2019 ])/).forEach(function(x){if(!x)return;if(/^[-'\u2019 ]$/.test(x)){if(out.length)out[out.length-1]+=x;return;}syllabes(x,opts).forEach(function(y){out.push(y)});});
    var fus=[];out.forEach(function(x){if(fus.length&&!/[aeiouyàâäéèêëîïôöùûüœæ]/i.test(fus[fus.length-1].replace(/qu|gu/gi,"")))fus[fus.length-1]+=x;else fus.push(x);});return fus;}   /* d'eux, l'autre, qu'on : l'élision ne fait pas de syllabe */
  var low=w.toLowerCase(),n=low.length,noyaux=[],i=0;
  while(i<n){if(low[i]==="e"&&i>0&&(low[i-1]==="g"||low[i-1]==="c")&&"aouâàôû".indexOf(low[i+1]||"")>=0&&i+1<n){i++;continue;}   /* ge·a, ge·o : le e ne se prononce pas (changeant, mangeons) */
    if(estVoyL151(low[i])){var d=i;
      /* gu / qu + voyelle : le u appartient à la consonne */
      if(low[i]==="u"&&i>0&&(low[i-1]==="q"||low[i-1]==="g")&&i+1<n&&estVoyL151(low[i+1])){i++;continue;}
      while(i+1<n&&estVoyL151(low[i+1])){var duo=low[i]+low[i+1];
        /* deux voyelles qui ne font qu'un son : on reste dans le même noyau ; sinon (hiatus : é-a, o-é…) on coupe */
        var apresCR=i>=2&&!estVoyL151(low[i-2])&&(low[i-1]==="r"||low[i-1]==="l");   /* consonne + r/l puis i/u + voyelle : deux syllabes (ou·vri·er, cru·el) */
        if(/^(oy|ay|ey|uy)$/.test(duo)&&estVoyL151(low[i+2]||""))break;   /* le y entre deux voyelles ouvre la syllabe suivante (lo·yer) */
        if(((low[i]==="i"||low[i]==="y"||(low[i]==="u"&&low[i+1]!=="e"))&&!apresCR)||/^(ou|oi|ai|ei|au|eu|œu|oy|ay|ey|uy|ée)$/.test(duo)||((duo==="ue"||duo==="ie"||duo==="iè"||duo==="ié")&&!apresCR)||(duo==="ea"&&low[i+2]==="u")||(low[i]==="e"&&low[i+1]==="a"&&low[i+2]==="u")||/^(oe|œ)/.test(duo)){i++;continue;}
        break;}   /* deux voyelles qui ne forment pas un seul son : hiatus, on coupe (ex·tra·or·di·naire, pré·oc·cu·pa·tion) */
      noyaux.push([d,i]);}i++;}
  /* le -e muet final (et -es, -ent verbal après consonne) ne fait pas de syllabe — hors versification */
  if(!vers&&noyaux.length>1){var der=noyaux[noyaux.length-1],fin=low.slice(der[0]);
    var avantE=low[der[0]-1],uCons=avantE==="u"&&(low[der[0]-2]==="q"||low[der[0]-2]==="g");   /* -que, -gue : le u est une consonne */
    if((/^e$|^es$/.test(fin)||(/^ent$/.test(fin)&&n>4))&&der[0]===der[1]&&(!estVoyL151(avantE)||uCons))noyaux.pop();}
  if(noyaux.length<=1)return [w];
  var coupes=[];
  for(var k=0;k<noyaux.length-1;k++){var a=noyaux[k][1]+1,b=noyaux[k+1][0],cons=low.slice(a,b),c;
    /* les nasales : an/en/in/on/un (+ ain, ein, oin) restent avec la voyelle si suivies d'une consonne */
    if(/[gc]e$/.test(cons)&&cons.length>=2){c=a+cons.length-2;}   /* « ge », « ce » devant a/o/u : une seule consonne (chan·geant, man·geons) */
    else if(cons.length===0)c=a;
    else if(cons.length===1)c=a;
    else if(cons.length===2)c=(GROUPES_INDISS_L151.indexOf(cons)>=0)?a:a+1;
    else{var fin2=cons.slice(-2);c=(GROUPES_INDISS_L151.indexOf(fin2)>=0)?b-2:b-1;}   /* trois consonnes ou plus : avant la dernière, ou avant le groupe (ins·truire, comp·ter, ar·bre) */
    coupes.push(c);}
  var res=[],p=0;coupes.forEach(function(c){res.push(w.slice(p,c));p=c;});res.push(w.slice(p));return res.filter(Boolean);}
/* ── le moteur d'écart ── */
/* le mot attendu est-il un verbe ? le mot d'avant le dit (un pronom sujet → verbe ; un déterminant → nom) ; sinon sa fin (-e, -ent, -ait, -ais) */
var SUJETS_L151=["je","j","tu","il","elle","on","nous","vous","ils","elles","qui","ne","n","se","s","me","m","te","t"],DETS_L151=["le","la","les","l","un","une","des","du","au","aux","ce","cet","cette","ces","mon","ma","mes","ton","ta","tes","son","sa","ses","notre","nos","votre","vos","leur","leurs","quelque","quelques","chaque","plusieurs"];
function estVerbeL151(w,ctx){var av=String((ctx&&ctx.avant)||"").toLowerCase().replace(/['\u2019]$/,"");if(SUJETS_L151.indexOf(av)>=0)return true;if(DETS_L151.indexOf(av)>=0)return false;return /(e|ent|ait|ais|ons|ez)$/i.test(w);}
function sansAccL151(x){return String(x||"").normalize("NFD").replace(/[\u0300\u0301\u0302\u0308]/g,"").normalize("NFC");}
function sansDoublesL151(x){return String(x||"").replace(/([bcdfghjklmnpqrstvwxz])\1/gi,"$1");}
var NORMALISEURS_L151=[["accent",sansAccL151],["consonne-double",sansDoublesL151],["majuscule",function(x){return String(x||"").toLowerCase()}],["tiret",function(x){return String(x||"").replace(/-/g,"")}]];
function motifL151(m,f,w,ctx){var t=m.type;if(m.sauf&&new RegExp(m.sauf,"i").test(w))return null;if(m.siMot&&!new RegExp(m.siMot,"i").test(w))return null;
  if(m.siVerbe&&!estVerbeL151(w,ctx))return null;if(m.siNom&&estVerbeL151(w,ctx))return null;
  if(t==="ajout"){for(var q=0;q<m.suffixes.length;q++)if(f.toLowerCase()===(w+m.suffixes[q]).toLowerCase())return {lettre:m.suffixes[q]};return null;}
  if(t==="casse")return f!==w&&f.toLowerCase()===w.toLowerCase()?{}:null;
  if(t==="tiret")return f!==w&&f.replace(/-/g," ")===w.replace(/-/g," ")||(f.replace(/-/g,"")===w.replace(/-/g,"")&&f!==w)?{}:null;
  if(t==="collage")return f!==w&&f.replace(/[ '\u2019]/g,"")===w.replace(/[ '\u2019]/g,"")&&(/[ ]/.test(f)!==/[ ]/.test(w))?{}:null;
  if(t==="apostrophe")return f!==w&&f.replace(/['\u2019]/g,"")===w.replace(/['\u2019]/g,"")&&(/['\u2019]/.test(f)!==/['\u2019]/.test(w))?{}:null;
  if(t==="chiffre")return /\d/.test(f)&&!/\d/.test(w)?{}:null;
  if(t==="cedille")return f!==w&&f.replace(/ç/g,"c")===w.replace(/ç/g,"c")?{}:null;
  if(t==="homophone"){var hl=(ctx.homophones||{})[w.toLowerCase()]||[];if(!Array.isArray(hl))hl=[hl];var hw=hl.filter(function(g){return g.forms.indexOf(f.toLowerCase())>=0})[0];return hw&&f.toLowerCase()!==w.toLowerCase()?{regle:hw.regle||"",groupe:hw.groupe}:null;}
  if(t==="accent"){if(f===w||sansAccL151(f)!==sansAccL151(w))return null;for(var i=0;i<Math.max(f.length,w.length);i++){if(f[i]!==w[i]){var bw=sansAccL151(w[i]||""),fa=f[i],wa=w[i];
        var nom=function(c){return /[éÉ]/.test(c)?"aigu":/[èàùÈ]/.test(c)?"grave":/[êâîôûÊ]/.test(c)?"circonflexe":/[ëïüÿ]/.test(c)?"tréma":""};
        return {lettre:bw,accent:nom(wa)||nom(fa),sens:sansAccL151(wa)===wa?"en trop":(sansAccL151(fa)===fa?"manquant":"change"),ecrit:fa,attendu:wa};}}return {};}
  if(t==="double"){if(f===w||sansDoublesL151(f).toLowerCase()!==sansDoublesL151(w).toLowerCase())return null;var dbl=(w.match(/([bcdfghjklmnpqrstvwxz])\1/i)||f.match(/([bcdfghjklmnpqrstvwxz])\1/i)||[])[1]||"";
    var sens=f.length>w.length?"doublee":"dedoublee";if(m.sens&&m.sens!==sens)return null;return {lettre:dbl,sens:sens};}
  if(t==="suffixe"){var A=m.attendu,E=m.ecrit;if(!(w.slice(w.length-A.length)===A&&f.slice(f.length-E.length)===E))return null;var rw=w.slice(0,w.length-A.length),rf=f.slice(0,f.length-E.length);if(rw===rf&&rw.length>=1)return {attendu:A,ecrit:E,lettre:A||E};return null;}
  if(t==="terminaisons"){var L=m.liste;for(var a2=0;a2<L.length;a2++)for(var b2=0;b2<L.length;b2++){if(a2===b2)continue;var A2=L[a2],E2=L[b2];if(w.slice(-A2.length)===A2&&f.slice(-E2.length)===E2&&w.slice(0,-A2.length)===f.slice(0,-E2.length)&&w.length>A2.length)return {attendu:A2,ecrit:E2};}return null;}
  if(t==="lettre"){var de=m.de,ve=m.vers;var idx=w.indexOf(de);while(idx>=0){var cand=w.slice(0,idx)+ve+w.slice(idx+de.length);if(cand===f)return {attendu:de,ecrit:ve};idx=w.indexOf(de,idx+1);}return null;}
  if(t==="inversion"){if(f.length!==w.length)return null;for(var j=0;j<w.length-1;j++){if(w[j]!==f[j]){if(w[j]===f[j+1]&&w[j+1]===f[j]&&w.slice(j+2)===f.slice(j+2)&&w.slice(0,j)===f.slice(0,j))return {lettre:w[j]+w[j+1]};return null;}}return null;}
  if(t==="omise"){if(w.length!==f.length+1)return null;for(var k2=0;k2<w.length;k2++){if(w.slice(0,k2)+w.slice(k2+1)===f)return {lettre:w[k2]};}return null;}
  if(t==="ajoutee"){if(f.length!==w.length+1)return null;for(var k3=0;k3<f.length;k3++){if(f.slice(0,k3)+f.slice(k3+1)===w)return {lettre:f[k3]};}return null;}
  if(t==="changee"){if(f.length!==w.length)return null;var dif=[];for(var k4=0;k4<w.length;k4++)if(w[k4]!==f[k4])dif.push(k4);return dif.length===1?{attendu:w[dif[0]],ecrit:f[dif[0]]}:null;}
  if(t==="regex")return new RegExp(m.forme,"i").test(f)&&new RegExp(m.mot,"i").test(w)?{}:null;
  return null;}
/* ── les catégories livrées (seed embarqué : des objets, pas du code ; l'ordre = la priorité de détection) ──
   commentaire : {forme} {mot} {lettre} {accent} {ecrit} {attendu} {regle} ; court : pour nommer plusieurs écarts dans un même commentaire */
function catL151(id,nom,famille,competence,motifs,court,commentaire,exemples,extra){return Object.assign({id:id,nom:nom,famille:famille,competence:competence,motifs:motifs,court:court,commentaire:commentaire,exemples:exemples||[],actif:true,origine:"livré",version:1},extra||{});}
var INVARIABLES_L151="beaucoup|loin|encore|toujours|jamais|trop|très|assez|puis|alors|ensuite|souvent|aussi|bientôt|longtemps|ici|là|autrefois|parfois|déjà|vite|bien|mal|moins|plus|peu|tant|tôt|tard|hier|demain|aujourd'hui|dedans|dehors|partout|presque|vraiment|certes|pourtant|cependant|ainsi|donc|enfin|lorsque|quand|comme|avec|sans|sous|sur|dans|vers|chez|pendant|depuis|parmi|selon|malgré|entre|pour|par";
var CATEGORIES_L151=[
 catL151("cat-invariable","Mot invariable","mots","D1.1",[{type:"regex",mot:"^("+INVARIABLES_L151+")$",forme:"[sx]$"}],"un mot invariable","Tu as écrit « {forme} » : « {mot} » est un mot invariable, il ne prend jamais de -s.",[{forme:"beaucoups",mot:"beaucoup"}],{tousTypes:true}),
 catL151("cat-verbe-pour-nom","Verbe à la place du nom (le travail / il travaille)","homophones","D1.5",[{type:"ajout",suffixes:["le","les","lent","ls","ent"],siNom:true}],"le nom et le verbe","Tu as écrit « {forme} » : c'est le verbe ; ici c'est le nom « {mot} » (on peut mettre « un », « le » devant).",[{forme:"travaille",mot:"travail"}]),
 catL151("cat-verbe-2e-personne","Verbe : -s de la 2e personne en trop / manquant","conjugaison","D1.1",[{type:"suffixe",attendu:"",ecrit:"s",siVerbe:true},{type:"suffixe",attendu:"s",ecrit:"",siVerbe:true,siMot:"(es|is|as|ds|ts)$"}],"la personne du verbe (-s)","Tu as écrit « {forme} » : le -s est la marque de « tu » ; ici le sujet n'est pas « tu » : « {mot} ».",[{forme:"tombes",mot:"tombe"}]),
 catL151("cat-elision","Élision (qu', l', d'…)","mots","D1.2",[{type:"regex",forme:"e$",mot:"^(qu|l|d|j|m|n|s|t|c|jusqu|lorsqu|puisqu)['\u2019]?$"}],"l'élision","Tu as écrit « {forme} » : devant une voyelle, on élide : « {mot}' ».",[{forme:"que",mot:"qu"}]),
 catL151("cat-majuscule","Majuscule","mots","D1.2",[{type:"casse"}],"la majuscule","Tu as écrit « {forme} » : attention à la majuscule, on écrit « {mot} ».",[{forme:"paris",mot:"Paris"}]),
 catL151("cat-homophone","Homophone grammatical","homophones","D1.5",[{type:"homophone"}],"un homophone","« {forme} » et « {mot} » se prononcent de la même façon ; ici, il faut « {mot} ». {regle}",[{forme:"a",mot:"à"}]),
 catL151("cat-chiffre","Nombre en chiffres","mots","D1.2",[{type:"chiffre"}],"le nombre en lettres","Tu as écrit « {forme} » : dans une dictée, le nombre s'écrit en lettres : « {mot} ».",[{forme:"3",mot:"trois"}]),
 catL151("cat-tiret","Trait d'union","mots","D1.2",[{type:"tiret"}],"le trait d'union","Tu as écrit « {forme} » : attention au trait d'union, on écrit « {mot} ».",[{forme:"peut être",mot:"peut-être"}]),
 catL151("cat-apostrophe","Apostrophe","mots","D1.2",[{type:"apostrophe"}],"l'apostrophe","Tu as écrit « {forme} » : il faut l'apostrophe, on écrit « {mot} ».",[{forme:"larbre",mot:"l'arbre"}]),
 catL151("cat-collage","Mots collés ou coupés","mots","D1.2",[{type:"collage"}],"la séparation des mots","Tu as écrit « {forme} » : attention à la séparation des mots, on écrit « {mot} ».",[{forme:"parcontre",mot:"par contre"}]),
 catL151("cat-cedille","Cédille","lexique","D1.2",[{type:"cedille"}],"la cédille","Tu as écrit « {forme} » : il faut une cédille sous le c (ç) pour le son [s] : « {mot} ».",[{forme:"facon",mot:"façon"}]),
 catL151("cat-pluriel-manquant","Pluriel manquant (-s, -x)","accords","D1.1",[{type:"suffixe",attendu:"s",ecrit:""},{type:"suffixe",attendu:"x",ecrit:""}],"la marque du pluriel","Tu as écrit « {forme} » : il manque la marque du pluriel (-{lettre}). Il faut « {mot} ».",[{forme:"maison",mot:"maisons"}],{tousTypes:true}),
 catL151("cat-pluriel-en-trop","Pluriel en trop (-s, -x)","accords","D1.1",[{type:"suffixe",attendu:"",ecrit:"s"},{type:"suffixe",attendu:"",ecrit:"x"}],"un pluriel en trop","Tu as écrit « {forme} » : le -{lettre} est en trop, ici le mot est au singulier : « {mot} ».",[{forme:"abris",mot:"abri"}],{tousTypes:true}),
 catL151("cat-verbe-nt-manquant","Verbe : -nt manquant (3e du pluriel)","accords","D1.1",[{type:"suffixe",attendu:"nt",ecrit:""},{type:"suffixe",attendu:"aient",ecrit:"ait"},{type:"suffixe",attendu:"aient",ecrit:"ais",commentaire:"Tu as écrit « {forme} » (2e personne) ; le sujet est « ils / elles », au pluriel : « {mot} »."},{type:"suffixe",attendu:"ent",ecrit:"es",commentaire:"Tu as écrit « {forme} » (2e personne) ; le sujet est « ils / elles », au pluriel : « {mot} »."}],"l'accord du verbe au pluriel (-nt)","Tu as écrit « {forme} » : le sujet est au pluriel, le verbe prend -nt : « {mot} ».",[{forme:"mange",mot:"mangent"}]),
 catL151("cat-verbe-nt-en-trop","Verbe : -nt en trop","accords","D1.1",[{type:"suffixe",attendu:"",ecrit:"nt"},{type:"suffixe",attendu:"ait",ecrit:"aient"}],"un -nt en trop","Tu as écrit « {forme} » : le sujet est au singulier, le verbe ne prend pas -nt : « {mot} ».",[{forme:"mangent",mot:"mange"}]),
 catL151("cat-fem-pl-manquant","Féminin pluriel : -es manquant","accords","D1.1",[{type:"suffixe",attendu:"es",ecrit:""}],"le -es du féminin pluriel","Tu as écrit « {forme} » : il manque les marques du féminin et du pluriel (-es) : « {mot} ».",[{forme:"perdu",mot:"perdues"}]),
 catL151("cat-fem-pl-en-trop","Féminin pluriel : -es en trop","accords","D1.1",[{type:"suffixe",attendu:"",ecrit:"es"}],"un -es en trop","Tu as écrit « {forme} » : les marques du féminin et du pluriel (-es) sont en trop : « {mot} ».",[{forme:"perdues",mot:"perdu"}]),
 catL151("cat-feminin-manquant","Féminin : -e manquant","accords","D1.1",[{type:"suffixe",attendu:"e",ecrit:"",sauf:"(oi|ai|i|ui|ou|eu|ui|ê|d|t|c|v|p)re$"},{type:"suffixe",attendu:"es",ecrit:"s"}],"le -e du féminin","Tu as écrit « {forme} » : il manque le -e du féminin : « {mot} ».",[{forme:"grand",mot:"grande"}]),
 catL151("cat-feminin-en-trop","Féminin : -e en trop","accords","D1.1",[{type:"suffixe",attendu:"",ecrit:"e"},{type:"suffixe",attendu:"s",ecrit:"es"}],"un -e en trop","Tu as écrit « {forme} » : le -e est en trop, le mot est au masculin : « {mot} ».",[{forme:"grande",mot:"grand"}]),
 catL151("cat-eux-euse","-eux / -euse","accords","D1.1",[{type:"terminaisons",liste:["eux","euse","euses"]}],"-eux / -euse","Tu as écrit « {forme} » : -eux au masculin, -euse au féminin : « {mot} ».",[{forme:"heureux",mot:"heureuse"}]),
 catL151("cat-pluriel-aux","Pluriel en -aux","accords","D1.1",[{type:"terminaisons",liste:["aux","als","aus","al"]}],"le pluriel en -aux","Tu as écrit « {forme} » : ce mot en -al fait son pluriel en -aux : « {mot} ».",[{forme:"chevals",mot:"chevaux"}]),
 catL151("cat-ons-ont","-ons / -ont","conjugaison","D1.1",[{type:"terminaisons",liste:["ons","ont"]}],"-ons / -ont","Tu as écrit « {forme} » : -ons va avec « nous », -ont avec « ils, elles » : « {mot} ».",[{forme:"allont",mot:"allons"}]),
 catL151("cat-imparfait-passe-simple","Imparfait / passé simple","conjugaison","D1.1",[{type:"terminaisons",liste:["ait","a"]},{type:"terminaisons",liste:["aient","èrent"]},{type:"terminaisons",liste:["ais","ai"]}],"l'imparfait ou le passé simple","Tu as écrit « {forme} » : tu as confondu l'imparfait et le passé simple : « {mot} ».",[{forme:"marchait",mot:"marcha"}]),
 catL151("cat-terminaison-e-er","Terminaison -é / -er / -ez / -ai / -ait","conjugaison","D1.1",[{type:"terminaisons",liste:["é","er","ez","ai","ais","ait","aient","és","ée","ées","et","es","e","ent"]}],"la terminaison (-é, -er, -ez, -ai…)","Tu as écrit « {forme} » : la terminaison est -{attendu}, pas -{ecrit} : « {mot} ».",[{forme:"mangé",mot:"manger"}]),
 catL151("cat-verbe-personne","-s / -x / -t final du verbe (la personne)","conjugaison","D1.1",[{type:"terminaisons",liste:["t","s","x"]}],"la terminaison de la personne (-s, -x, -t)","Tu as écrit « {forme} » : la terminaison dépend de la personne du sujet : « {mot} ».",[{forme:"veux",mot:"veut"}]),
 catL151("cat-verbe-t-d","-t / -d final du verbe","conjugaison","D1.1",[{type:"terminaisons",liste:["d","t","ds","ts"]}],"le -d ou le -t final","Tu as écrit « {forme} » : ce verbe garde le -{attendu} de son radical : « {mot} ».",[{forme:"prent",mot:"prend"}]),
 catL151("cat-accent","Accent","lexique","D1.2",[{type:"accent"}],"l'accent","Tu as écrit « {forme} » : attention à l'accent {accent} sur le {lettre} : « {mot} ».",[{forme:"eleve",mot:"élève"}]),
 catL151("cat-consonne-double","Consonne double","lexique","D1.2",[{type:"double"}],"la consonne double","Tu as écrit « {forme} » : attention au {lettre}, simple ou double : « {mot} ».",[{forme:"apeler",mot:"appeler"}]),
 catL151("cat-lettre-muette","Lettre muette finale","lexique","D1.2",[{type:"suffixe",attendu:"t",ecrit:""},{type:"suffixe",attendu:"d",ecrit:""},{type:"suffixe",attendu:"p",ecrit:""},{type:"suffixe",attendu:"",ecrit:"t"},{type:"suffixe",attendu:"",ecrit:"d"},{type:"suffixe",attendu:"s",ecrit:""},{type:"suffixe",attendu:"x",ecrit:""}],"la lettre muette finale","Tu as écrit « {forme} » : attention à la lettre muette à la fin du mot ({lettre}) : « {mot} ».",[{forme:"bor",mot:"bord"}]),
 catL151("cat-y-i","y / i","lexique","D1.2",[{type:"lettre",de:"y",vers:"i"},{type:"lettre",de:"i",vers:"y"}],"le y ou le i","Tu as écrit « {forme} » : dans ce mot, il faut un {attendu} : « {mot} ».",[{forme:"sistème",mot:"système"}]),
 catL151("cat-son-s","Le son [s] (s, ss, c, ç, t)","lexique","D1.2",[{type:"lettre",de:"ss",vers:"s"},{type:"lettre",de:"s",vers:"ss"},{type:"lettre",de:"c",vers:"s"},{type:"lettre",de:"s",vers:"c"},{type:"lettre",de:"c",vers:"ss"},{type:"lettre",de:"ss",vers:"c"},{type:"lettre",de:"t",vers:"c"},{type:"lettre",de:"sc",vers:"s"}],"le son [s]","Tu as écrit « {forme} » : le son [s] s'écrit ici « {attendu} » : « {mot} ».",[{forme:"pousière",mot:"poussière"}]),
 catL151("cat-son-k","Le son [k] (c, qu, k)","lexique","D1.2",[{type:"lettre",de:"qu",vers:"c"},{type:"lettre",de:"c",vers:"qu"},{type:"lettre",de:"qu",vers:"k"},{type:"lettre",de:"k",vers:"qu"},{type:"lettre",de:"c",vers:"k"},{type:"lettre",de:"k",vers:"c"}],"le son [k]","Tu as écrit « {forme} » : le son [k] s'écrit ici « {attendu} » : « {mot} ».",[{forme:"cartier",mot:"quartier"}]),
 catL151("cat-son-g-j","Le son [g] / [ʒ] (g, gu, ge, j)","lexique","D1.2",[{type:"lettre",de:"gu",vers:"g"},{type:"lettre",de:"g",vers:"gu"},{type:"lettre",de:"ge",vers:"g"},{type:"lettre",de:"g",vers:"ge"},{type:"lettre",de:"j",vers:"g"},{type:"lettre",de:"g",vers:"j"}],"le g, le gu, le ge ou le j","Tu as écrit « {forme} » : ici on écrit « {attendu} » : « {mot} ».",[{forme:"mangons",mot:"mangeons"}]),
 catL151("cat-nasales","Les nasales (an/en, in/ain/ein, on/om)","lexique","D1.2",[{type:"lettre",de:"en",vers:"an"},{type:"lettre",de:"an",vers:"en"},{type:"lettre",de:"em",vers:"am"},{type:"lettre",de:"am",vers:"em"},{type:"lettre",de:"ain",vers:"in"},{type:"lettre",de:"in",vers:"ain"},{type:"lettre",de:"ein",vers:"in"},{type:"lettre",de:"in",vers:"ein"},{type:"lettre",de:"ain",vers:"ein"},{type:"lettre",de:"ein",vers:"ain"}],"le son nasal","Tu as écrit « {forme} » : le son s'écrit ici « {attendu} » : « {mot} ».",[{forme:"tamps",mot:"temps"}]),
 catL151("cat-m-devant-b-p","m devant b, p","lexique","D1.2",[{type:"lettre",de:"mb",vers:"nb"},{type:"lettre",de:"mp",vers:"np"},{type:"lettre",de:"mm",vers:"nm"}],"le m devant b, m, p","Tu as écrit « {forme} » : devant b, m ou p, on écrit m : « {mot} ».",[{forme:"tenps",mot:"temps"}]),
 catL151("cat-o-au-eau","o / au / eau","lexique","D1.2",[{type:"lettre",de:"au",vers:"o"},{type:"lettre",de:"o",vers:"au"},{type:"lettre",de:"eau",vers:"au"},{type:"lettre",de:"au",vers:"eau"},{type:"lettre",de:"eau",vers:"o"},{type:"lettre",de:"o",vers:"eau"}],"o, au ou eau","Tu as écrit « {forme} » : le son [o] s'écrit ici « {attendu} » : « {mot} ».",[{forme:"bato",mot:"bateau"}]),
 catL151("cat-h-muet","h muet","lexique","D1.2",[{type:"lettre",de:"h",vers:""}],"le h","Tu as écrit « {forme} » : il y a un h dans ce mot : « {mot} ».",[{forme:"abit",mot:"habit"}]),
 catL151("cat-lettres-inversees","Lettres inversées","lexique","D1.2",[{type:"inversion"}],"deux lettres inversées","Tu as écrit « {forme} » : deux lettres sont inversées : « {mot} ».",[{forme:"dagnereux",mot:"dangereux"}]),
 catL151("cat-lettre-omise","Lettre oubliée","lexique","D1.2",[{type:"omise"}],"une lettre oubliée","Tu as écrit « {forme} » : il manque une lettre ({lettre}) : « {mot} ».",[{forme:"chose",mot:"choses"}]),
 catL151("cat-lettre-ajoutee","Lettre en trop","lexique","D1.2",[{type:"ajoutee"}],"une lettre en trop","Tu as écrit « {forme} » : le {lettre} est en trop : « {mot} ».",[{forme:"maisoon",mot:"maison"}]),
 catL151("cat-lettre-changee","Lettre changée","lexique","D1.2",[{type:"changee"}],"une lettre changée","Tu as écrit « {forme} » : une lettre est changée ({ecrit} au lieu de {attendu}) : « {mot} ».",[{forme:"bacon",mot:"balcon"}])
];
var CAT_AUTRE_L151={id:"cat-autre",nom:"Autre",famille:"autre",competence:"",motifs:[],court:"",commentaire:"Compare lettre à lettre avec le mot juste : « {mot} ».",origine:"livré",actif:true};
var FAMILLE_TYPE_L151={G:["accords","conjugaison","homophones"],L:["lexique","mots","homophones"],C:["mots","lexique"]};
function remplirL151(t,d){return String(t||"").replace(/\{(\w+)\}/g,function(m,k){return d[k]!=null?String(d[k]):""}).replace(/\s+/g," ").trim();}
/* une seule catégorie qui explique tout l'écart ? (dans l'ordre de priorité) */
function uneCategorieL151(f,w,ctx,familles){var cats=(ctx.categories||CATEGORIES_L151),prem=null;for(var i=0;i<cats.length;i++){var c=cats[i];if(c.actif===false)continue;for(var j=0;j<(c.motifs||[]).length;j++){var r=motifL151(c.motifs[j],f,w,ctx);if(r){var x={cat:c,d:r,m:c.motifs[j]};if(!prem)prem=x;if(!familles||c.tousTypes||familles.indexOf(c.famille)>=0)return x;break;}}}return familles?(prem?Object.assign({},prem,{horsType:true}):null):prem;}
/* L'ANALYSE : l'écart entre ce que l'élève a écrit et le mot attendu → la catégorie (la première), tous les écarts nommés, le commentaire */
function analyserEcartL151(forme,attendu,type,ctx){ctx=ctx||{};var f=String(forme||"").trim(),w=String(attendu||"").trim();
  var res={categorie:"cat-autre",ecarts:[],reconnu:false,commentaire:"",famille:"autre"};
  if(!f||f===w){res.commentaire="";return res;}
  var compat0=FAMILLE_TYPE_L151[type]||null,u=uneCategorieL151(f,w,ctx,compat0),ec=[];if(u&&u.horsType){res.categorie=u.cat.id;res.famille=u.cat.famille;res.ecarts=[u.cat.id];res.horsType=true;res.commentaire=remplirL151(CAT_AUTRE_L151.commentaire,{forme:f,mot:w});return res;}
  if(u)ec=[u];
  else{/* deux écarts à la fois : on retire d'abord un écart de lettre (accent, double, casse, tiret), puis on cherche le reste */
    for(var i=0;i<NORMALISEURS_L151.length&&!ec.length;i++){var N=NORMALISEURS_L151[i],f2=N[1](f),w2=N[1](w);if(f2===f&&w2===w)continue;
      var cN=(ctx.categories||CATEGORIES_L151).filter(function(c){return c.id==="cat-"+N[0]})[0],dN=cN?motifL151(cN.motifs[0],f,N[0]==="accent"?sansAccL151(f)===sansAccL151(w)?w:(function(){var x="";for(var k=0;k<w.length;k++)x+=w[k];return x})():w,ctx):null;
      if(f2===w2){if(cN)ec=[{cat:cN,d:dN||{}}];break;}
      var u2=uneCategorieL151(f2,w2,ctx,compat0);if(u2&&!u2.horsType&&cN)ec=[{cat:cN,d:dN||{lettre:""}},u2];}}
  if(!ec.length){res.commentaire=remplirL151(CAT_AUTRE_L151.commentaire,{forme:f,mot:w});return res;}
  var prem=ec[0].cat,compat=FAMILLE_TYPE_L151[type]||null;
  /* jamais hors sujet : la catégorie doit convenir au type posé (une G sur un écart d'accent : seulement si c'est un homophone grammatical) */
  var ok=!compat||ec.some(function(x){return x.cat.tousTypes||compat.indexOf(x.cat.famille)>=0});
  res.categorie=prem.id;res.famille=prem.famille;res.ecarts=ec.map(function(x){return x.cat.id});
  if(!ok){res.commentaire=remplirL151(CAT_AUTRE_L151.commentaire,{forme:f,mot:w});res.horsType=true;return res;}
  res.reconnu=true;
  if(ec.length===1)res.commentaire=remplirL151((ec[0].m&&ec[0].m.commentaire)||prem.commentaire,Object.assign({forme:f,mot:w},ec[0].d));
  else res.commentaire=remplirL151("Tu as écrit « {forme} » : attention à "+ec.map(function(x){return x.cat.court}).join(", et à ")+" : « {mot} ».",{forme:f,mot:w});
  return res;}
/* « Mot long » : trois syllabes ou plus (jamais un nombre de lettres) */
function cesureL151(w){var s=syllabes(w),t="";s.forEach(function(x,i){t+=(i&&!/[-'\u2019]$/.test(s[i-1])?"·":"")+x;});return t;}
function motLongL151(w){return syllabes(w).filter(function(x){return /[a-zà-ÿœæ]/i.test(x)}).length>=3?"Mot long — décompose-le en syllabes : "+cesureL151(w)+".":"";}
if(typeof module!=="undefined")module.exports={cesureL151:cesureL151,syllabes:syllabes,analyserEcartL151:analyserEcartL151,CATEGORIES_L151:CATEGORIES_L151,motLongL151:motLongL151};
