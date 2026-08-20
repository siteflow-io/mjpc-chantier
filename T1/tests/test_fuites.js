const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
(async()=>{
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1440,height:900}});
  const page=await browser.newPage();
  page.on('dialog',async d=>{await d.dismiss();});
  await page.setContent('<html><body><div id="hote"></div></body></html>');
  const avant=await page.evaluate(()=>Object.keys(window));
  // socle minimal : _modaleConfirme factice pour le test de fuite
  await page.evaluate(()=>{window._modaleConfirme=function(t,c,ok){ok&&ok();};});
  await page.addScriptTag({content:fs.readFileSync('dr_bloc_final.js','utf8')});
  // ouvrir + manipuler pour déclencher les chemins qui affectent des implicites
  const err=[];
  page.on('pageerror',e=>err.push(String(e)));
  await page.evaluate(()=>{
    DR.dr_ouvrir('hote',[{act:'Écran un',h:'10:00',dur:5,comp:[],blocs:[{t:'consigne',pic:'📕',txt:'Consigne de banc.',etapes:['a','b'],vues:0}]},{act:'Écran deux',h:'10:05',dur:5,comp:[],blocs:[{t:'question',pic:'❓',q:'Question ?',reps:[{i:'x',r:'y'}],vues:0}]}]);
    DR.va(1); DR.devoile&&DR.devoile(); DR.gel(); DR.gel(); DR.chrono(); DR.chrono(); DR.va(0);
  });
  await new Promise(r=>setTimeout(r,500));
  const apres=await page.evaluate(()=>Object.keys(window));
  const fuites=apres.filter(k=>!avant.includes(k) && k!=='DR' && k!=='_modaleConfirme');
  console.log(JSON.stringify({fuites, pageerrors:err.slice(0,6)},null,1));
  await browser.close();
})();
