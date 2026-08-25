/* SOCLE DU BANC — serveur local + navigateur + amorçage.
   Aucune sortie réseau hors localhost : voir hub-faux.brancher. */
import http from 'http';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import { creerHub, brancher } from './hub-faux.mjs';

export function servir(fichier, port){
  const html = fs.readFileSync(fichier);
  const srv = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.end(html);
  });
  return new Promise(r => srv.listen(port, ()=>r(srv)));
}

export async function ouvrirNavigateur(){
  return puppeteer.launch({
    executablePath:'/tmp/chromium', headless:true,
    args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage',
          '--disable-gpu','--font-render-hinting=none','--force-device-scale-factor=1']
  });
}

/* l'amorçage du site : admin-mode, coffre ouvert, garde masquée, niveau chargé.
   Ce sont les quatre premières étapes de la chaîne du mandat ; les suivantes
   (Panneau prof -> Atelier -> ... -> Lancer) se font par CLICS réels. */
export async function amorcer(page){
  await page.evaluate(()=>{
    document.body.classList.add('admin-mode');
    try{ SECU.valide = true; SECU.cle = 'banc'; SECU.secretPresent = true; SECU.raison=''; }catch(e){}
    /* la garde d'accès : on la masque, on ne la contourne pas dans le code */
    ['secu-garde','garde','gate','login-gate'].forEach(id=>{
      const el = document.getElementById(id); if(el) el.style.display='none';
    });
    document.querySelectorAll('.garde,.gate,#coffre-garde').forEach(el=>{ el.style.display='none'; });
  });
  await page.evaluate(()=>{ try{ loadPublished('3e'); }catch(e){ console.log('loadPublished KO', e.message); } });
  await new Promise(r=>setTimeout(r,900));
}

export async function nouvelleScene(baseFichier, port, hubDossier){
  const srv = await servir(baseFichier, port);
  const nav = await ouvrirNavigateur();
  const hub = creerHub(hubDossier);
  return { srv, nav, hub,
    async page(suffixe, etiquette, taille){
      const p = await nav.newPage();
      await p.setViewport(taille || {width:1440, height:900});
      await brancher(p, hub, etiquette);
      p.on('pageerror', e => { (hub.erreurs = hub.erreurs || []).push(etiquette+': '+e.message); });
      await p.goto('http://localhost:'+port+'/index.html'+(suffixe||''), {waitUntil:'domcontentloaded'});
      return p;
    },
    async fermer(){ await nav.close(); srv.close(); }
  };
}
