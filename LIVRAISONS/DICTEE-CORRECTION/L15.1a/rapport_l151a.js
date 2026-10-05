/* L15.1a — le rapport À BLANC de l'analyse des erreurs, sur les copies du hub (lues en lecture seule, aucun nom). */
const A=require('./analyse_l151.js'),fs=require('fs');
const D=JSON.parse(fs.readFileSync('/tmp/hub_l15h.json','utf8')).cd;
const hom={};require('./homophones_existants.json').forEach(h=>h.forms.forEach(f=>{(hom[f]=hom[f]||[]).push({forms:h.forms,regle:h.regle,groupe:h.groupe})}));
const ctx={homophones:hom};const nomCat={};A.CATEGORIES_L151.forEach(c=>nomCat[c.id]=c.nom);nomCat['cat-autre']='Autre (le commentaire honnête)';
const quoi=[['3_dylan_bob','3E Dylan'],['3_franklin_aretha','3E Franklin'],['4_hugo','4E Hugo'],['4_turing','4E Turing']];
const out={dictees:[],categories:{},lignes:[],autres:{}};
const toArr=x=>Array.isArray(x)?x:(x&&typeof x==='object'?Object.keys(x).sort((a,b)=>+a-+b).map(k=>x[k]):[]);
for(const [cl,lib] of quoi){for(const id of Object.keys(D).sort()){const d=D[id],c=d.config||{};if(c.classe!==cl||!/n°1/.test(c.title||''))continue;
  const res=d.results||{},cles=Object.keys(res).sort();let n=0,nRec=0,nHors=0,nAutre=0;
  cles.forEach((k,i)=>{const r=res[k];if(!r||typeof r!=='object')return;toArr(r.errors).forEach(e=>{if(!e||!/^[GLC]$/.test(e.type))return;n++;if(!e.fautif||!String(e.fautif).trim())return;
    const a=A.analyserEcartL151(e.fautif,e.word,e.type,ctx);if(e.sansCout&&e.motif==='acceptee')return;
    nRec++;if(a.horsType)nHors++;if(!a.reconnu)nAutre++;
    out.categories[a.categorie]=out.categories[a.categorie]||{n:0,reconnus:0};out.categories[a.categorie].n++;if(a.reconnu)out.categories[a.categorie].reconnus++;
    if(!a.reconnu){const kk=e.fautif+' → '+e.word;out.autres[kk]=(out.autres[kk]||0)+1;}
    out.lignes.push({d:lib,copie:i+1,type:e.type,forme:e.fautif,mot:e.word,cat:a.categorie,ecarts:a.ecarts,reconnu:a.reconnu,hors:!!a.horsType,com:a.commentaire,long:A.motLongL151(e.word)});});});
  out.dictees.push({lib,titre:c.title,n,nRec,reconnus:nRec-nAutre,nHors,nAutre});}}
fs.writeFileSync('/tmp/l151a.json',JSON.stringify(out));
out.dictees.forEach(x=>console.log(x.lib,'| erreurs G/L/C',x.n,'| recopiées',x.nRec,'| reconnues',x.reconnus,'('+Math.round(100*x.reconnus/x.nRec)+' %)','| honnêtes (autre)',x.nAutre,'dont type incompatible',x.nHors));
console.log(Object.entries(out.categories).sort((a,b)=>b[1].n-a[1].n).map(([k,v])=>nomCat[k]+' '+v.n).join(' ; '));
console.log('autres les plus fréquents :',Object.entries(out.autres).sort((a,b)=>b[1]-a[1]).slice(0,40).map(x=>x[0]+' ×'+x[1]).join(' | '));
