/* FAUX HUB EN MÉMOIRE — lot D, phase 0.
   Le vrai hub n'est JAMAIS contacté par le navigateur : le décor vient d'un
   instantané pris par curl (lecture seule) et rangé dans hub/.
   GET  -> lit le store en mémoire
   PUT/PATCH/POST/DELETE -> écrit dans le store, COMPTE, ne sort jamais. */
import fs from 'fs';

export function creerHub(dossier){
  const store = {};
  const charge = (chemin, fichier) => {
    if(!fs.existsSync(fichier)) return;
    poser(store, chemin, JSON.parse(fs.readFileSync(fichier,'utf8')));
  };
  charge('site/3e',      dossier+'/site_3e.json');
  charge('classes',      dossier+'/classes.json');
  charge('taxonomie',    dossier+'/taxonomie.json');
  charge('site/config',  dossier+'/site_config.json');
  charge('manifestes',   dossier+'/manifestes.json');

  const compteur = { get:0, ecritures:0, journal:[] };
  return { store, compteur };
}

function decoupe(chemin){
  return String(chemin||'').split('/').filter(Boolean);
}
export function poser(store, chemin, valeur){
  const parts = decoupe(chemin);
  if(!parts.length) return;
  let n = store;
  for(let k=0;k<parts.length-1;k++){
    if(typeof n[parts[k]] !== 'object' || n[parts[k]]===null) n[parts[k]] = {};
    n = n[parts[k]];
  }
  const dernier = parts[parts.length-1];
  if(valeur === null) delete n[dernier]; else n[dernier] = valeur;
}
export function lire(store, chemin){
  const parts = decoupe(chemin);
  let n = store;
  for(const p of parts){
    if(n===null || typeof n!=='object' || !(p in n)) return null;
    n = n[p];
  }
  return n===undefined ? null : n;
}
export function fusionner(store, chemin, objet){
  Object.keys(objet||{}).forEach(k => poser(store, chemin+'/'+k, objet[k]));
}

/* branche l'interception sur une page Puppeteer */
export async function brancher(page, hub, etiquette){
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if(url.includes('firebasedatabase.app')){
      const u = new URL(url);
      let chemin = decodeURIComponent(u.pathname).replace(/\.json$/,'');
      const methode = req.method().toUpperCase();
      const cors = {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type,Authorization,X-Requested-With',
        'Access-Control-Max-Age':'600'
      };
      if(methode === 'OPTIONS'){   /* préalable CORS : ce n'est pas une écriture */
        return req.respond({status:204, headers:cors, body:''});
      }
      if(methode === 'GET'){
        hub.compteur.get++;
        const v = lire(hub.store, chemin);
        return req.respond({status:200, contentType:'application/json',
          headers:cors, body:JSON.stringify(v)});
      }
      /* TOUTE écriture est interceptée, comptée, rangée en mémoire — jamais transmise */
      hub.compteur.ecritures++;
      let corps = null;
      try{ corps = req.postData() ? JSON.parse(req.postData()) : null; }catch(e){}
      hub.compteur.journal.push({de:etiquette, methode, chemin,
        taille: req.postData() ? req.postData().length : 0});
      if(methode === 'PUT')        poser(hub.store, chemin, corps);
      else if(methode === 'PATCH') fusionner(hub.store, chemin, corps);
      else if(methode === 'DELETE')poser(hub.store, chemin, null);
      return req.respond({status:200, contentType:'application/json',
        headers:cors, body:JSON.stringify(corps===null?null:corps)});
    }
    /* aucune autre sortie réseau : ni polices, ni QR, ni Drive */
    if(url.startsWith('http://localhost') || url.startsWith('data:') || url.startsWith('about:')){
      return req.continue();
    }
    return req.abort();
  });
}
