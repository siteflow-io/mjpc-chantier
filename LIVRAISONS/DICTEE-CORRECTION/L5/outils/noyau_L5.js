function tokenize(text){if(!text)return[];var t=[],re=/(\s+)|(['\u2019"\u00ab\u00bb\u201c\u201d])|([.,;:!?\u2026()\-\u2013\u2014]+)|([^\s.,;:!?\u2026\u00ab\u00bb\u201c\u201d()'\u2019"\-\u2013\u2014]+)/g,m;while((m=re.exec(text))!==null){if(!m[1])t.push(m[2]||m[3]||m[4])}return t}
function isPunct(w){return/^[.,;:!?\u2026\u00ab\u00bb\u201c\u201d\u2018\u2019'"()\-\u2013\u2014]+$/.test(w)}
function estApostrophe(w){return/^['\u2019]$/.test(w)}
function estSigne(w){w=String(w||"").trim();return !!w&&isPunct(w)&&!estApostrophe(w);}
function reclassementPonctuation(c,tokens,baseDictee,bareme){
  if(!c||typeof c!=="object")return null;
  var errs=toArr(c.errors||[]).filter(function(e){return e!=null}),exts=toArr(c.extras||[]).filter(function(e){return e!=null}),n=0,mp=[];
  var ne=errs.map(function(e){var t=tokens[e.idx];if(e.type==="M"&&t&&estSigne(t)){n++;mp.push(e.idx);return Object.assign({},e,{type:"P"});}return e;});
  var nx=exts.map(function(x){if(x.type!=="P"&&estSigne(x.word)){n++;return Object.assign({},x,{type:"P"});}return x;});
  if(!n)return null;
  var sc=computeNote(ne,nx,baseDeCopie(c,baseDictee),bareme);
  return {champs:{errors:ne,extras:nx,note:sc.note,deduction:sc.deduction,counts:sc.counts},n:n,mVersP:mp};
}
function computeNote(errors,extras,base,bareme){
  errors=errors||[];extras=extras||[];base=base||20;
  var brevet = (bareme==="brevet");
  var COST = brevet ? TYPE_COST_BREVET : TYPE_COST;
  var horsCompte = brevet ? bonusRepetitions(errors) : [];
  var ded=0, nP=0;
  errors.forEach(function(e,i){
    if(horsCompte.indexOf(i)>=0) return;          /* repetition : deja comptee */
    if(brevet && e.type==="P"){ nP++; return; }   /* ponctuation : au forfait */
    ded+=(COST[e.type]||0);
  });
  /* [L5] un signe de ponctuation « en trop » (marqué type P) est compté au forfait ponctuation, plus comme un mot en trop */
  var nXP=0;extras.forEach(function(x){if(x&&x.type==="P"){nXP++;if(brevet)nP++;else ded+=(COST.P||0);}else ded+=COST.X});
  if(brevet) ded += Math.floor(nP/4) * 0.5 * (base/10);
  var counts={G:0,L:0,M:0,I:0,P:0,A:0,E:0,X:extras.length-nXP};
  errors.forEach(function(e){counts[e.type]=(counts[e.type]||0)+1});counts.P+=nXP;
  return{note:Math.round(Math.max(0,base-ded)*10)/10,deduction:Math.round(ded*10)/10,
         counts:counts,total:errors.length+extras.length,
         repetees:horsCompte.length,bareme:brevet?"brevet":"preparee"}
}
function bonusRepetitions(errors){
  /* les occurrences supplementaires d'une meme faute sur un meme mot */
  var vus={},repetees=[];
  (errors||[]).forEach(function(e,i){
    if(!e) return;
    var k=String(e.word||"").toLowerCase()+"|"+e.type;
    if(vus[k]!==undefined) repetees.push(i); else vus[k]=i;
  });
  return repetees;   /* index, dans errors, des erreurs NON facturees */
}
function toArr(v){if(!v)return[];if(Array.isArray(v))return v;return Object.values(v)}
function baseDeCopie(r,baseDictee){return (r&&r.amenagee===true&&r.base)?r.base:baseDictee;}
var TYPE_COST={G:1,L:0.5,M:1,I:1,X:0.5,P:0.5,A:0,E:0.5};
var TYPE_COST_BREVET={G:1,L:0.5,M:0.5,I:0.5,X:0.5,P:0,A:0,E:0.5};
module.exports={tokenize,reclassementPonctuation};
