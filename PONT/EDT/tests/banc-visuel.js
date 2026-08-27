const m=require('@sparticuz/chromium'); const chromium=m.default||m;
const puppeteer=require('puppeteer-core');
(async()=>{
  const b=await puppeteer.launch({
    args:[...chromium.args,'--no-sandbox','--allow-file-access-from-files'],
    executablePath: await chromium.executablePath(),
    headless:'shell'
  });
  const p=await b.newPage();
  await p.setViewport({width:1366,height:768});
  // COUCHE 1 — aucune écriture ne sort : PUT/POST/PATCH/DELETE bloqués
  const tentatives=[];
  await p.setRequestInterception(true);
  p.on('request',r=>{
    const m=r.method();
    if(m!=='GET'&&m!=='HEAD'){ tentatives.push(m+' '+r.url().slice(0,90)); return r.abort(); }
    r.continue();
  });
  const erreurs=[];
  p.on('pageerror',e=>erreurs.push(String(e).slice(0,120)));
  await p.goto('file:///home/claude/edt/candidat.html',{waitUntil:'domcontentloaded'});
  await new Promise(r=>setTimeout(r,2500));
  const mesure=await p.evaluate(()=>({
    edt:Object.keys(window).filter(k=>/^edt/.test(k)&&typeof window[k]==='function').length,
    annee:typeof EDT_ANNEE!=='undefined'?EDT_ANNEE:null,
    version:typeof VERSION!=='undefined'?VERSION:null,
    familles:typeof EDT_FAMILLES!=='undefined'?Object.keys(EDT_FAMILLES).length:null,
    poser:typeof edtPoserIds==='function',
    apparier:typeof edtApparier==='function',
    niveau:typeof edtMettreANiveau==='function'
  }));
  await p.screenshot({path:'capture_accueil.png'});
  console.log("── BANC VISUEL, candidat 8.73.0-①");
  console.log("   fonctions edt* exposées :",mesure.edt);
  console.log("   VERSION :",mesure.version,"| EDT_ANNEE :",mesure.annee,"| EDT_FAMILLES :",mesure.familles,"familles");
  console.log("   edtPoserIds/edtApparier/edtMettreANiveau :",mesure.poser,mesure.apparier,mesure.niveau);
  console.log("   erreurs de page :",erreurs.length,erreurs.slice(0,3).join(' | '));
  console.log("   écritures sortantes tentées :",tentatives.length,tentatives.slice(0,3).join(' | '));
  await b.close();
})().catch(e=>{console.log("ÉCHEC:",e.message);process.exit(1)});
