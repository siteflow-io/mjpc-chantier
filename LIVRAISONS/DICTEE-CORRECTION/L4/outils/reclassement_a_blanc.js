/* L4 — LE RECLASSEMENT À BLANC : rien n'est écrit. Avec les fonctions mêmes de la dictée (noyau_note.js, extraites de 6.7.0-L3).
   Deux reclassements, et rien d'autre :
   (1) une erreur « M » posée sur un signe de ponctuation (hors apostrophe) → « P »  (la règle exacte du bouton « M→P ») ;
   (2) un « mot en trop » qui est un signe de ponctuation (hors apostrophe) → compté au forfait ponctuation (comme une erreur P).
   Entrée : JSON {correction_dictee, classes} ; sortie : JSON du rapport (clés des élèves REMPLACÉES par leur rang). */
const fs=require('fs'),crypto=require('crypto'),N=require('./noyau_note.js');
const [entree,sortie]=process.argv.slice(2); const D=JSON.parse(fs.readFileSync(entree,'utf8'));
const CD=D.correction_dictee||{},CL=D.classes||{};
const sha=o=>crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
const san=n=>String(n).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
function ordreGrille(cfg,res){ const nom=cfg.classe||''; let c=CL[nom]; if(!c){const k=Object.keys(CL).find(k=>san(k)===san(nom)); c=k?CL[k]:null;}
  const el=c&&c.eleves?(Array.isArray(c.eleves)?c.eleves:Object.values(c.eleves)).map(e=>typeof e==='string'?e:(e&&e.nomComplet)||''):[];
  const cles=el.map(san).filter(k=>k in res); const reste=Object.keys(res).filter(k=>!cles.includes(k)).sort(); return {ordre:cles.concat(reste),grille:cles.length>0}; }
function reclasser(c,tokens,base,bareme){   /* rend la copie reclassée, ou LA MÊME copie (même objet) si rien n'est à reclasser */
  const errs=N.toArr(c.errors||[]).filter(e=>e!=null), exts=N.toArr(c.extras||[]).filter(e=>e!=null);
  const conv=[]; const nErrs=errs.map(e=>{ const t=tokens[e.idx];
    if(e.type==='M'&&t&&N.isPunct(t)&&!N.estApostrophe(t)){conv.push({cas:'M sur un signe → P',signe:t,position:e.idx});return Object.assign({},e,{type:'P'});} return e;});
  const nExts=exts.map(x=>{ const w=String(x.word||'').trim();
    if(w&&N.isPunct(w)&&!N.estApostrophe(w)&&x.type!=='P'){conv.push({cas:'signe « en trop » → forfait ponctuation',signe:w,position:'après le mot '+x.afterIdx,collisionFormeA:errs.some(e=>e.idx===x.afterIdx)});return Object.assign({},x,{type:'P'});} return x;});
  if(!conv.length) return {copie:c,conv:[]};
  const b=N.baseDeCopie(c,base);
  /* la note : les signes en trop comptent comme des P (forfait en brevet, coût P en préparée) */
  const pourNote=nErrs.concat(nExts.filter(x=>x.type==='P').map(x=>({idx:x.afterIdx,type:'P',word:x.word}))), restants=nExts.filter(x=>x.type!=='P');
  const sc=N.computeNote(pourNote,restants,b,bareme);
  const n=Object.assign({},c,{errors:nErrs,extras:nExts,note:sc.note,deduction:sc.deduction,counts:sc.counts}); /* la trace (amenagee, mode, base), fastIdx, texteIdx… gardés */
  return {copie:n,conv,base:b};
}
const R={dictees:[],totaux:{copiesTouchees:0,mSurSigne:0,signesEnTrop:0,copiesIntactes:0,collisionsFormeA:0,ecartsNoteStockee:0}};
for(const id of Object.keys(CD).sort()){ if(id.startsWith('_'))continue; const d=CD[id]||{},cfg=d.config||{},res=d.results||{}; if(!Object.keys(res).length)continue;
  const tokens=N.tokenize(cfg.text||''),base=cfg.base||20,bareme=cfg.bareme||'preparee'; const {ordre,grille}=ordreGrille(cfg,res);
  const dd={id,titre:cfg.title||id,classe:cfg.classe||'',base,bareme,ordre:grille?'rang dans la grille de la classe':'rang alphabétique des copies (classe absente)',touchees:[],intactes:[],mSurSigne:0,signesEnTrop:0};
  ordre.forEach((k,i)=>{ const c=res[k]; if(!c||typeof c!=='object')return; const avantSha=sha(c);
    const errs=N.toArr(c.errors||[]).filter(e=>e!=null),exts=N.toArr(c.extras||[]).filter(e=>e!=null);
    const recalc=N.computeNote(errs,exts,N.baseDeCopie(c,base),bareme).note;
    const r=reclasser(c,tokens,base,bareme);
    if(!r.conv.length){ const apresSha=sha(r.copie); dd.intactes.push({eleve:i+1,sha_avant:avantSha.slice(0,16),sha_apres:apresSha.slice(0,16),identique:avantSha===apresSha&&r.copie===c}); R.totaux.copiesIntactes++; return;}
    const mS=r.conv.filter(x=>x.cas.startsWith('M')).length,sT=r.conv.length-mS; dd.mSurSigne+=mS; dd.signesEnTrop+=sT; R.totaux.collisionsFormeA+=r.conv.filter(x=>x.collisionFormeA).length;
    if(typeof c.note==='number'&&Math.abs(c.note-recalc)>1e-9)R.totaux.ecartsNoteStockee++;
    dd.touchees.push({eleve:i+1,conversions:r.conv,base_copie:r.base,note_stockee:c.note,note_recalculee_avant:recalc,note_apres:r.copie.note,aménagée:c.amenagee===true}); });
  R.totaux.copiesTouchees+=dd.touchees.length; R.totaux.mSurSigne+=dd.mSurSigne; R.totaux.signesEnTrop+=dd.signesEnTrop; R.dictees.push(dd); }
fs.writeFileSync(sortie,JSON.stringify(R,null,1)); console.log(JSON.stringify(R.totaux));
for(const d of R.dictees) console.log(d.titre,'|',d.classe,'|',d.bareme,'sur',d.base,'| M sur signe',d.mSurSigne,'| signes en trop',d.signesEnTrop,'('+d.touchees.length+' copies) | intactes',d.intactes.length,'| toutes identiques :',d.intactes.every(x=>x.identique));
