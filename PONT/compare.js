const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');

const TRAME = [
  {act:'Rituel',h:'10:07',dur:5,comp:[],blocs:[{id:'b1',t:'consigne',pic:'📝',txt:'Ouvrez le cahier.',etapes:[],vues:0}]},
  {act:'Question',h:'10:12',dur:5,comp:[],blocs:[{id:'b2',t:'question',q:'Quel effet ?',reps:[{i:'GA',r:'une réponse',refo:false}],vues:0}]}
];

// séquence de gestes identiques, jouée des deux côtés
const GESTES = [
  ['charger',      (A,T) => { var t=JSON.parse(JSON.stringify(T));
      if(A.dr_chargerTrame) A.dr_chargerTrame(t,{});
      else { ECRANS.length=0; t.forEach(function(e){ECRANS.push(e);}); i=0; rendre(); } }],
  ['devoile1',     A => A.devoile()],
  ['devoile2',     A => A.devoile()],
  ['va1',          A => A.va(1)],
  ['ajoute image', A => A.ajoute('image')],
  ['ajoute schema',A => A.ajoute('schema')],
  ['gel',          A => A.gel()],
  ['degel',        A => A.gel()],
];

async function jouer(url, prep){
  const b=await puppeteer.launch({args:[...chromium.args,'--disable-popup-blocking'],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1300,height:820}});
  const p=await b.newPage();
  await p.setRequestInterception(true);
  p.on('request',r=>{const u=r.url(); if(u.includes('firebasedatabase.app')){r.respond({status:200,contentType:'application/json',body:'null'});return;} (u.startsWith('file://')||u.startsWith('data:'))?r.continue():r.abort();});
  p.on('dialog',async d=>{await d.dismiss();});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,100)));
  await p.goto(url,{waitUntil:'load',timeout:30000});
  await new Promise(r=>setTimeout(r,900));
  if(prep){ await p.evaluate(prep); await new Promise(r=>setTimeout(r,1500)); }
  const rapport=[];
  for(const [nom,fn] of GESTES){
    const res=await p.evaluate((src,TRAME)=>{
      const A=window.DR||window;
      const out={};
      try{ eval('('+src+')')(A,TRAME); out.geste='ok'; }catch(e){ out.geste='ERR '+e.message; }
      try{
        const t=(A.dr_exporterTrame?A.dr_exporterTrame():ECRANS);
        out.ecrans=t.length;
        out.blocs=t.map(e=>(e.blocs||[]).map(x=>x.t).join('+')).join(' | ');
        out.vues=t.map(e=>(e.blocs||[]).map(x=>x.vues||0).join(',')).join(' | ');
      }catch(e){ out.etat='ERR '+e.message; }
      // état du DOM de pilotage, normalisé (sans préfixe dr-)
      const R=document.getElementById('dr-racine')||document.body;
      const n=s=>s.replace(/\bdr-/g,'');
      out.domSet = [...new Set(n([...R.querySelectorAll('[class]')].map(x=>typeof x.className==='string'?x.className:'').join(' ')).split(/\s+/).filter(Boolean))].sort();
      // classes dont AUCUNE règle CSS ne s'applique (le vrai symptôme visuel)
      out.sansRegle = out.domSet.filter(function(cl){
        var el=R.querySelector('.'+cl+', .dr-'+cl); if(!el) return false;
        return false;
      });
      return out;
    }, fn.toString(), TRAME);
    rapport.push({geste:nom, ...res});
    await new Promise(r=>setTimeout(r,320));
  }
  // et le tableau
  await p.evaluate(()=>{ const A=window.DR||window; try{ A.tableau(); }catch(e){} });
  await new Promise(r=>setTimeout(r,1100));
  const pages=await b.pages(); const pop=pages[pages.length-1];
  let tab={};
  try{ tab=await pop.evaluate(()=>{
    const t=document.getElementById('dr-t')||document.getElementById('t');
    const h=t?t.innerHTML:'';
    return {taille:h.length, extrait:h.replace(/\bdr-/g,'').slice(0,90).replace(/\s+/g,' ')};
  }); }catch(e){ tab={err:e.message}; }
  await b.close();
  return {rapport, tab, errs:errs.slice(0,3)};
}

(async()=>{
  const fs=require('fs');
  const chap=fs.readFileSync('/home/claude/chap_3e_10.json','utf8');
  const prepClone = new Function(
    "chapitresData['3e']=chapitresData['3e']||{};" +
    "chapitresData['3e']['10']=" + chap + ";" +
    "window.LINK_ATELIER_DOCS={__seed:{title:'x'}};" +
    "window._lvlClasses=function(){return [{slug:'3e_a',nom:'3e A'}];};" +
    "if(window.__poserDecor) __poserDecor();" +
    "atEditerChapitre('3e','10'); atVuesAller('deroule');"
  );
  const O=await jouer('file:///home/claude/DEROULE/deroule86.html', null);
  const C=await jouer('file:///mnt/user-data/outputs/T1-v19.html?n=3e', prepClone);
  console.log('=== COMPARAISON GESTE PAR GESTE ===');
  O.rapport.forEach((o,k)=>{
    const c=C.rapport[k];
    const d=[];
    ['geste','ecrans','blocs','vues'].forEach(ch=>{ if(String(o[ch])!==String(c[ch])) d.push('  '+ch+'\n     origine: '+o[ch]+'\n     clone  : '+c[ch]); });
    if(JSON.stringify(o.domSet)!==JSON.stringify(c.domSet)){
      const so=new Set(o.domSet), sc=new Set(c.domSet);
      const perdues=o.domSet.filter(x=>!sc.has(x)), ajoutees=c.domSet.filter(x=>!so.has(x));
      if(perdues.length) d.push('  classes PRÉSENTES à l origine, ABSENTES du clone : '+perdues.join(' '));
      if(ajoutees.length) d.push('  classes en plus dans le clone : '+ajoutees.slice(0,14).join(' '));
    }
    console.log((d.length?'DIVERGE ':'OK      ')+o.geste+(d.length?'\n'+d.join('\n'):''));
  });
  console.log('\nTABLEAU — origine:', JSON.stringify(O.tab));
  console.log('        — clone  :', JSON.stringify(C.tab));
  console.log('erreurs — origine:',O.errs,'· clone:',C.errs);
})().catch(e=>console.error('KO:',e.message));
