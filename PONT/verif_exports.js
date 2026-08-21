const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
(async()=>{
  const b=await puppeteer.launch({args:[...chromium.args],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1200,height:760}});
  const p=await b.newPage();
  await p.setRequestInterception(true);
  p.on('request',r=>(r.url().startsWith('file://')||r.url().startsWith('data:'))?r.continue():r.abort());
  p.on('dialog',async d=>{await d.dismiss();});
  await p.goto('file:///home/claude/travail.html',{waitUntil:'load',timeout:30000});
  await new Promise(r=>setTimeout(r,900));
  const r=await p.evaluate(()=>{
    const src=document.documentElement.innerHTML;
    const appels=[...new Set([...src.matchAll(/DR\.([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]))];
    const exports=Object.keys(window.DR||{});
    return { appels:appels.length, exports:exports.length,
             manquants: appels.filter(a=>exports.indexOf(a)<0) };
  });
  console.log('fonctions appelées par le HTML :', r.appels, '· exportées par DR :', r.exports);
  console.log('MANQUANTES :', JSON.stringify(r.manquants));
  await b.close();
})().catch(e=>console.error('KO:',e.message));
