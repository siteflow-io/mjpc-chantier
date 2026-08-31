import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
const chromium = chromiumMod.default || chromiumMod;
const CAL = JSON.parse(fs.readFileSync('calendrier-2026-2027.json','utf8'));
const nav=await puppeteer.launch({executablePath:await chromium.executablePath(),args:[...chromium.args,'--no-sandbox','--allow-file-access-from-files'],headless:true});
const page=await nav.newPage();
await page.setRequestInterception(true);
page.on('request',r=>r.url().startsWith('file://')?r.continue():r.abort());
page.on('pageerror',()=>{});
await page.goto('file://'+process.cwd()+'/'+(process.argv[2]||'index.html'),{waitUntil:'load'});
console.log(await page.evaluate(cal=>{
  const n=edtPoserIdsObjet('calendrier',cal);
  const par={}; ['evenementsClasse','jalons','etablissement','feries','vacances'].forEach(k=>{
    (cal[k]||[]).forEach(x=>{const p=(x.id||'').split(':')[0]; par[p]=(par[p]||0)+1;});});
  const tous=[]; ['evenementsClasse','jalons','etablissement','feries','vacances'].forEach(k=>(cal[k]||[]).forEach(x=>tous.push(x.id)));
  return {poses:n, parPrefixe:par, distincts:new Set(tous).size, total:tous.length,
          collisions:tous.filter(x=>/#\d/.test(x)).length};
}, CAL));
await nav.close();
