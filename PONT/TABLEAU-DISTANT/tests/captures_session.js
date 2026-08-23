// BANC SESSION — trois pages simultanées : pilote-ordi · téléphone 390×844 · vue-tableau.
// Hub SIMULÉ en mémoire Node (STORE) : GET servis, PUT/DELETE acceptés SAUF depuis la
// vue (comptés + refusés). Latences mesurées en ms réelles.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
const STORE={
 '/classes':{ c3a:{nom:'3e Aretha Franklin',niveau:'3e',eleves:['GARCIA Amel','LEMOINE Marc','DUPONT Zo\u00e9']} },
 '/site/3e/chapitres':{ '1':{title:'Po\u00e9sie',published:true,seances:{'2':{title:'S2 \u2014 R\u00e9citation',ordre:1,published:true,
   deroule:{maj:1,ecrans:[
     {act:'\u00c0 une passante \u2014 dire de m\u00e9moire',h:'10:07',dur:10,blocs:[
       {t:'consigne',pic:'\ud83d\udcdd',txt:'Chaque \u00e9l\u00e8ve dit le sonnet de m\u00e9moire.',etapes:[]},
       {t:'question',q:'Question 1 \u2014 Quel effet produit l\u2019enjambement ?',vues:1,reps:[{i:'AG',r:'\u00c7a met en valeur la fugitive.'},{i:'',r:''}]}]},
     {act:'Passages 1 \u00e0 8',h:'10:17',dur:15,blocs:[{t:'consigne',pic:'\ud83c\udfb2',txt:'Ordre tir\u00e9 au sort.',etapes:[]}]}
   ]}}}}},
 '/site/4e/chapitres':{},'/site/5e/chapitres':{},'/site/6e/chapitres':{},
 '/site/config':{}, '/eleves_index':{}
};
function chemin(u){ const m=u.match(/firebasedatabase\.app(\/.*)\.json/); return m?m[1]:null; }
function lit(p){ // navigation dans STORE par chemin
  const parts=p.split('/').filter(Boolean); let n=STORE['/'+parts[0]];
  if(n===undefined){ // chemins composés stockés à plat
    for(const k of Object.keys(STORE)){ if(p===k)return STORE[k];
      if(p.startsWith(k+'/')){ let nn=STORE[k]; for(const q of p.slice(k.length+1).split('/')){ nn=(nn||{})[q]; } return nn; } }
    return null; }
  for(const q of parts.slice(1)){ n=(n||{})[q]; }
  return n===undefined?null:n;
}
function ecrit(p,val,method){
  if(method==='DELETE'){ val=null; }
  const parts=p.split('/').filter(Boolean);
  // racine connue ou création
  let rootKey='/'+parts[0];
  if(!(rootKey in STORE))STORE[rootKey]={};
  let n=STORE[rootKey];
  if(parts.length===1){ STORE[rootKey]=val; return; }
  for(let k=1;k<parts.length-1;k++){ if(typeof n[parts[k]]!=='object'||n[parts[k]]===null)n[parts[k]]={}; n=n[parts[k]]; }
  if(val===null)delete n[parts[parts.length-1]]; else n[parts[parts.length-1]]=val;
}
async function boot(query,vp,role,compte){
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:90000,defaultViewport:vp});
  const page=await browser.newPage();
  page.on('dialog',async d=>{await d.dismiss();});
  const err=[]; page.on('pageerror',e=>err.push(String(e).slice(0,140)));
  await page.setRequestInterception(true);
  page.on('request',async r=>{
    const u=r.url(),m=r.method();
    if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
    const p=chemin(u);
    if(p!==null){
      if(m==='GET'){ const v=lit(p); return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(v===undefined?null:v)}); }
      if(role==='vue'){ compte.ecritures++; return r.abort(); }
      let body=null; try{ body=r.postData()?JSON.parse(r.postData()):null; }catch(e){}
      ecrit(p,body,m); compte.puts=(compte.puts||0)+1;
      return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'null'});
    }
    if(m!=='GET'&&role==='vue'){ compte.ecritures++; return r.abort(); }
    return r.abort();   // tout autre réseau (fonts, qrserver…) : coupé
  });
  await page.goto('file:///home/claude/s95.html'+query,{waitUntil:'load',timeout:40000});
  await new Promise(r=>setTimeout(r,1200));
  return {browser,page,err};
}
(async()=>{
  const cptVue={ecritures:0};
  const A=await boot('',{width:1440,height:940},'pilote',{});
  await A.page.evaluate(()=>new Promise(res=>{
    currentLevel='3e';TRACK.eleve={is_prof:true,nom:'M',prenom:'P',niveau:'3e'};
    document.body.classList.add('admin-mode');
    loadClasses(function(){ atChargerChapitres('3e',function(){
      atelierOuvrir(); atEditerChapitre('3e','1');
      setTimeout(function(){ atVuesAller('deroule');
        setTimeout(function(){ ATVUES.snum='2'; atVuesAller('deroule'); setTimeout(res,700); },500); },400);
    });});
  }));
  await A.page.evaluate(()=>{ var s=document.getElementById('at-dr-classe'); s.value='c3a';
    window.atT5Veille=function(){}; atDrMaintenant(); atDrJouerClic(); });
  await new Promise(r=>setTimeout(r,1800));
  const V=await boot('?vue=tableau',{width:1360,height:800},'vue',cptVue);
  await new Promise(r=>setTimeout(r,4500));
  const T=await boot('?vue=tel&qr=capnonce',{width:390,height:844},'tel',{});
  await new Promise(r=>setTimeout(r,5200));
  await A.page.evaluate(()=>{ var W=drWin(); W.devoile(); W.devoile(); W.devoile(); });
  await new Promise(r=>setTimeout(r,2500));
  await A.page.screenshot({path:'cap-s-pilote.png'});
  const diagVue=await V.page.evaluate(()=>{ var D=document.getElementById('ses-tab-toile').contentDocument;
    var t=D.getElementById('t'), w=D.querySelector('.w');
    var cs=t?D.defaultView.getComputedStyle(t):null;
    return {tExiste:!!t, fontSize:cs&&cs.fontSize, hT:t&&t.getBoundingClientRect().height,
            hW:w&&w.getBoundingClientRect().height, hDoc:D.documentElement.clientHeight,
            extrait:(t&&t.innerHTML||'').slice(0,150), bodyCS:D.body?D.defaultView.getComputedStyle(D.body).height:null};
  });
  console.log('DIAGVUE',JSON.stringify(diagVue));
  console.log('SCENE-STORE',JSON.stringify(lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/scene')));
  console.log('VUE-SES',JSON.stringify(await V.page.evaluate(()=>({tabTs:SES._tabTs,tabTrame:SES._tabTrame,ctx:SES.ctx&&SES.ctx.classeSlug,perdu:SES.perduDepuis}))));
  console.log('PILOTE-SES',JSON.stringify(await A.page.evaluate(()=>({actif:SES.actif,ts:SES.ts,regime:AT_DR_REGIME,i:(drWin()||{}).i,rev:((drWin()||{}).ECRANS||[{}])[(drWin()||{}).i||0].rev}))));
  await V.page.screenshot({path:'cap-s-vue.png'});
  await T.page.screenshot({path:'cap-s-tel.png'});
  // le tel pendant la saisie (palette réduite) + la liste participation
  await T.page.evaluate(()=>{ document.getElementById('ses-tel').classList.add('ses-saisie'); });
  await T.page.screenshot({path:'cap-s-tel-saisie.png'});
  await T.page.evaluate(()=>{ document.getElementById('ses-tel').classList.remove('ses-saisie'); sesTelPart(); });
  await new Promise(r=>setTimeout(r,400));
  await T.page.screenshot({path:'cap-s-tel-part.png'});
  // la modale QR côté pilote
  await A.page.evaluate(()=>{ sesQROuvrir(); });
  await new Promise(r=>setTimeout(r,600));
  await A.page.screenshot({path:'cap-s-pilote-qr.png'});
  console.log('captures faites; écritures vue:',cptVue.ecritures);
  await A.browser.close(); await V.browser.close(); await T.browser.close();
})();