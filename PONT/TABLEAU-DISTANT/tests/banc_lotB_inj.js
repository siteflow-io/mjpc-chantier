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
      ecrit(p,b); return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'null'}); }
    return r.abort();});
  await page.goto('file://'+CIBLE,{waitUntil:'load'}); await new Promise(x=>setTimeout(x,1400));
  await page.evaluate(()=>{document.body.classList.add('admin-mode');TRACK.eleve={is_prof:true};
    var v=document.getElementById('page-validation'); if(v)v.style.display='none';
    /* la porte « chapitre » exige la clé de chiffrement (secuExigeCle) : on la marque valide
       DANS LE BANC seulement — aucune donnée réelle n'est touchée, aucune écriture ne part. */
    if(typeof SECU!=='undefined')SECU.valide=true;});
  await page.evaluate(()=>new Promise(res=>{currentLevel='3e';loadPublished('3e');
    loadClasses(function(){atChargerChapitres('3e',function(){res();});});}));
  R.diagPorte=await page.evaluate(()=>new Promise(res=>{
    const out={secu:(typeof SECU!=='undefined')?SECU.valide:'(SECU absent)'};
    let fait={taxo:false,annee:false,prompt:false,rendu:false};
    try{ chChargerTaxo(function(){ fait.taxo=true;
      chChargerEtatAnnee(function(){ fait.annee=true;
        atIAChargerPrompt(function(){ fait.prompt=true; try{ chRendre(); fait.rendu=!!document.getElementById('ch-coller'); }catch(e){ out.excRendre=String(e.message).slice(0,90); } });
      }); }); }catch(e){ out.exc=String(e.message).slice(0,90); }
    setTimeout(()=>{ out.etapes=fait; res(out); },6000);
  }));
  const passe=async(n)=>{
    await page.evaluate(()=>{ atelierOuvrir(); chOuvrir(); });
    for(let k=0;k<30;k++){ await new Promise(r=>setTimeout(r,300));
      const pret=await page.evaluate(()=>!!document.getElementById('ch-coller')); if(pret)break; }
    await page.evaluate((J)=>{
      const t=document.getElementById('ch-coller'); if(!t)return;
      t.value=JSON.stringify(J);
      if(typeof chVerifier==='function')chVerifier();
    },JSONCH);
    for(let k=0;k<30;k++){ await new Promise(r=>setTimeout(r,300));
      const pret=await page.evaluate(()=>!!document.querySelector('.ch-choix button')); if(pret)break; }
    return await page.evaluate(()=>({
      chapIdx:(typeof CH!=='undefined')?CH.chapIdx:'(CH absent)',
      detecte:(function(){var z=document.getElementById('ch-inv');
        var m=z?z.textContent.replace(/\s+/g,' ').match(/Ce que tu as d\u00e9j\u00e0[^\u2022]{0,70}/):null; return m?m[0].trim().slice(0,70):null;})(),
      boutons:[].slice.call(document.querySelectorAll('.ch-choix button')).map(b=>b.textContent.trim()),
      jumeaux:(function(){var j=document.querySelector('.ch-jumeaux');return j?j.textContent.replace(/\s+/g,' ').slice(0,110):null;})(),
      msg:(document.getElementById('ch-msg')||{}).textContent||null
    }));
  };
  await page.evaluate(()=>{ atelierOuvrir(); chOuvrir(); });
  await new Promise(r=>setTimeout(r,3000));   /* préchauffage : taxonomie et prompt chargés une fois */
  R.passe1=await passe(1);
  await page.screenshot({path:'lotB-inj-'+(CIBLE.indexOf('lotB')>=0?'apres':'avant')+'-1.png'});
  // on écrit réellement (dans le hub simulé) via le bouton, puis on rejoue
  R.confirmation=await page.evaluate(()=>new Promise(res=>{
    var b=[].slice.call(document.querySelectorAll('.ch-choix button')).filter(x=>/Cr\u00e9er/.test(x.textContent))[0];
    if(!b)return res({bouton:null});
    var libBouton=b.textContent; b.click();
    setTimeout(()=>{
      var m=document.getElementById('at-modale');
      var txt=m?m.querySelector('.at-modale-m').textContent.replace(/\s+/g,' ').slice(0,260):null;
      var val=m?[].slice.call(m.querySelectorAll('button')).filter(x=>!/Annuler/.test(x.textContent))[0]:null;
      if(val)val.click();
      setTimeout(()=>res({bouton:libBouton, modale:txt,
        msg:(document.getElementById('ch-msg')||{}).textContent}),2200);
    },800);
  }));
  await page.screenshot({path:'lotB-inj-'+(CIBLE.indexOf('lotB')>=0?'apres':'avant')+'-2.png'});
  R.hubApres=Object.keys(STORE['/site/3e/chapitres']).map(k=>(STORE['/site/3e/chapitres'][k]||{}).title);
  R.passe2=await passe(2);
  R.err=err.slice(0,4);
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();
