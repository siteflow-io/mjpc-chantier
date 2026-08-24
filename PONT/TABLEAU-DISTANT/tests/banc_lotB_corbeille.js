// BANC INJECTION — le même JSON rejoué DEUX FOIS : la seconde doit détecter la première.
// Les PUT sont interceptés et rangés dans un hub simulé ; le hub réel n'est jamais touché.
const CIBLE=process.argv[2]||'/home/claude/lotB.html';
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
const STORE={'/site/3e/chapitres':[{title:'Po\u00e9sie et peinture au XIXe si\u00e8cle (proposition)',ordre:1,published:false,
  seances:{'0':{title:'S\u00e9ance 1',ordre:1,items:{}}}}],'/classes':{},'/site/4e/chapitres':{},'/site/5e/chapitres':{},'/site/6e/chapitres':{}};
const JSONCH={niveau:'3e',chapitre:{title:'Po\u00e9sie et peinture au XIXe si\u00e8cle',
  entree:'poesie',competences:[],notions:[],
  seances:[{title:'S\u00e9ance 1',type:'etude_texte',notions:[],competences:[],
    items:{'item-neuf':{title:'Un item neuf',kind:'doc',source:'html',url:'https://exemple.test/banc'}}}]}};
function chemin(u){const m=u.match(/firebasedatabase\.app(\/.*)\.json/);return m?m[1]:null;}
function lit(p){
  for(const k of Object.keys(STORE)){ if(p===k)return STORE[k];
    if(p.startsWith(k+'/')){let n=STORE[k];for(const q of p.slice(k.length+1).split('/'))n=(n||{})[q];return n===undefined?null:n;} }
  /* le chemin demandé est un PRÉFIXE de clés du STORE (ex. /site/3e quand on a
     /site/3e/chapitres) : on reconstruit le sous-arbre, comme le ferait le hub. */
  let out=null;
  for(const k of Object.keys(STORE)){
    if(k.startsWith(p+'/')){ out=out||{};
      const r=k.slice(p.length+1).split('/'); let n=out;
      for(let j=0;j<r.length-1;j++){ if(!n[r[j]])n[r[j]]={}; n=n[r[j]]; }
      n[r[r.length-1]]=STORE[k]; }
  }
  return out;}
function ecrit(p,v){let root=null;
  for(const k of Object.keys(STORE)){ if(p===k||p.startsWith(k+'/')){ if(!root||k.length>root.length)root=k; } }
  if(!root){root='/'+p.split('/').filter(Boolean)[0]; if(!(root in STORE))STORE[root]={};}
  if(p===root){STORE[root]=v;return;}
  const r=p.slice(root.length+1).split('/').filter(Boolean); let n=STORE[root];
  for(let k=0;k<r.length-1;k++){ if(typeof n[r[k]]!=='object'||!n[r[k]])n[r[k]]={}; n=n[r[k]]; }
  if(v===null)delete n[r[r.length-1]]; else n[r[r.length-1]]=v;}
const REFUS={actif:false,motif:/corbeille/i};
(async()=>{
  const R={cible:CIBLE,putSimules:0};
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:90000,defaultViewport:{width:1500,height:980}});
  const page=await browser.newPage();
  const err=[]; page.on('pageerror',e=>err.push(String(e).slice(0,110)));
  await page.setRequestInterception(true);
  page.on('request',r=>{const u=r.url(),m=r.method();
    if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
    const p=chemin(u);
    if(p!==null){ if(m==='GET')return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(lit(p))});
      R.putSimules++; let b=null; try{b=r.postData()?JSON.parse(r.postData()):null;}catch(e){}
      if(REFUS.actif && REFUS.motif.test(p)){ (R.refusees=R.refusees||[]).push(p);
        return r.respond({status:403,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'{"error":"refus de banc"}'}); }
      ecrit(p,b); (R.ecrites=R.ecrites||[]).push(p);
      return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'null'}); }
    return r.abort();});
  await page.goto('file://'+CIBLE,{waitUntil:'load'}); await new Promise(x=>setTimeout(x,1400));
  await page.evaluate(()=>{document.body.classList.add('admin-mode');TRACK.eleve={is_prof:true};
    var v=document.getElementById('page-validation'); if(v)v.style.display='none';
    if(typeof SECU!=='undefined')SECU.valide=true;});
  await page.evaluate(()=>new Promise(res=>{currentLevel='3e';loadPublished('3e');
    loadClasses(function(){atChargerChapitres('3e',function(){res();});});}));
  const ouvrirEtColler=async()=>{
    await page.evaluate(()=>{ atelierOuvrir(); chOuvrir(); });
    for(let k=0;k<30;k++){ await new Promise(r=>setTimeout(r,300));
      if(await page.evaluate(()=>!!document.getElementById('ch-coller')))break; }
    await page.evaluate((J)=>{ const t=document.getElementById('ch-coller'); if(!t)return;
      t.value=JSON.stringify(J); if(typeof chVerifier==='function')chVerifier(); },JSONCH);
    for(let k=0;k<30;k++){ await new Promise(r=>setTimeout(r,300));
      if(await page.evaluate(()=>!!document.querySelector('.ch-choix button')))break; }
  };
  const cliquerRemplacer=async()=>await page.evaluate(()=>new Promise(res=>{
    const b=[].slice.call(document.querySelectorAll('.ch-choix button')).filter(x=>/Remplacer/.test(x.textContent))[0];
    if(!b)return res({bouton:null});
    b.click();
    setTimeout(()=>{
      const m=document.getElementById('at-modale');
      const txt=m?m.querySelector('.at-modale-m').textContent.replace(/\s+/g,' ').slice(0,220):null;
      const val=m?[].slice.call(m.querySelectorAll('button')).filter(x=>!/Annuler/.test(x.textContent))[0]:null;
      if(val)val.click();
      setTimeout(()=>res({modale:txt,msg:(document.getElementById('ch-msg')||{}).textContent}),2500);
    },800);
  }));
  await page.evaluate(()=>{ atelierOuvrir(); chOuvrir(); });
  await new Promise(r=>setTimeout(r,3000));   /* préchauffage : taxonomie et prompt chargés une fois */
  // ═══ CAS 1 : l'archive RÉUSSIT — le chapitre est remplacé, l'ancien est en corbeille ═══
  await ouvrirEtColler();
  R.cas1=await cliquerRemplacer();
  R.cas1.corbeilleEcrite=(R.ecrites||[]).filter(p=>/corbeille/i.test(p)).length;
  R.cas1.titreApres=(lit('/site/3e/chapitres')||[]).map(c=>c&&c.title);
  R.cas1.itemsApres=Object.keys((((lit('/site/3e/chapitres')||[])[0]||{}).seances||{})).length;
  // ═══ CAS 2 : l'archive ÉCHOUE — le remplacement doit être ABANDONNÉ ═══
  ecrit('/site/3e/chapitres',[{title:'Po\u00e9sie et peinture au XIXe si\u00e8cle (proposition)',ordre:1,published:false,
    seances:{'0':{title:'S\u00e9ance intacte',ordre:1,items:{'x':{title:'Item intact',kind:'doc',source:'html'}}}}}]);
  R.ecrites=[]; REFUS.actif=true;
  await page.evaluate(()=>new Promise(res=>{ atChargerChapitres('3e',function(){res();}); }));
  await ouvrirEtColler();
  R.cas2=await cliquerRemplacer();
  R.cas2.refusees=(R.refusees||[]).length;
  R.cas2.ecrituresApresRefus=(R.ecrites||[]).filter(p=>!/corbeille/i.test(p));
  const apres=lit('/site/3e/chapitres')||[];
  R.cas2.chapitreIntact=!!(apres[0]&&apres[0].seances&&apres[0].seances['0']&&apres[0].seances['0'].title==='S\u00e9ance intacte');
  R.cas2.titreApres=apres.map(c=>c&&c.title);
  R.err=err.slice(0,4);
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();