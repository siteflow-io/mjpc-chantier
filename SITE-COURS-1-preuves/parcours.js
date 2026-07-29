/* PARCOURS JOUÉ — SITE-COURS-1. Navigateur réel (chromium), hub RTDB SIMULÉ par
   interception réseau (le circuit interdit d'écrire au hub réel depuis le conteneur) :
   les requêtes PARTENT réellement du code livré et sont journalisées — c'est le journal
   qui fait foi. Élèves fictifs canoniques (doctrine 16bis). */
const fs=require('fs');
const path=require('path');
const chromium=require('/home/claude/.chromium/node_modules/@sparticuz/chromium/build/index.js').default;
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');

const FICHIER='file:///home/claude/build/index.staging.html';
const CAP='/home/claude/build/captures';fs.mkdirSync(CAP,{recursive:true});
const FICTIFS=['BERNARD Emma','DUPONT Marie','LEROY Hugo','MARTIN Lucas','MOREAU L\u00e9a','PETIT Thomas'];

/* ── mock RTDB ── */
const store={
  classes:{'3e_temoin':{nom:'3e T\u00e9moin',niveau:'3e',eleves:FICTIFS.slice()},
           '_test_atelier':{nom:'_test_atelier',niveau:'3e',eleves:FICTIFS.slice()}},
  site:{'3e':{chapitres:{ch1:{titre:'Chapitre t\u00e9moin',published:true}}}}
};
let failPuts=false;
const journal=[];
function rtdbGet(p){let o=store;for(const k of p){if(o==null)return null;o=o[k];}return o===undefined?null:o;}
function rtdbPut(p,v){let o=store;for(let i=0;i<p.length-1;i++){o[p[i]]=o[p[i]]||{};o=o[p[i]];}o[p[p.length-1]]=v;}
function rtdbDel(p){let o=store;for(let i=0;i<p.length-1;i++){if(o==null)return;o=o[p[i]];}if(o)delete o[p[p.length-1]];}
function brancher(page,etiquette){
  page.on('request',async req=>{
    const u=req.url();
    if(u.includes('firebasedatabase.app')){
      const m=u.match(/firebasedatabase\.app\/(.*?)\.json/);
      const chemin=m?decodeURIComponent(m[1]):'';
      const parts=chemin.split('/').filter(Boolean);
      journal.push({page:etiquette,methode:req.method(),chemin:chemin,t:Date.now()});
      const H={'access-control-allow-origin':'*','content-type':'application/json'};
      if(req.method()==='GET')return req.respond({status:200,headers:H,body:JSON.stringify(rtdbGet(parts))});
      if(req.method()==='PUT'){
        if(failPuts)return req.respond({status:500,headers:H,body:'{"error":"panne simul\u00e9e"}'});
        rtdbPut(parts,JSON.parse(req.postData()||'null'));
        return req.respond({status:200,headers:H,body:req.postData()||'null'});
      }
      if(req.method()==='DELETE'){rtdbDel(parts);return req.respond({status:200,headers:H,body:'null'});}
      if(req.method()==='OPTIONS')return req.respond({status:200,headers:{...H,'access-control-allow-methods':'GET,PUT,DELETE,POST'},body:''});
      return req.respond({status:200,headers:H,body:'null'});
    }
    if(u.startsWith('file://'))return req.continue();
    return req.abort();  /* fonts etc. : hors ligne — le repli Georgia doit suffire */
  });
}
const V=[];
function verdict(nom,ok,detail){V.push({nom,ok,detail:detail||''});console.log((ok?'  OK  ':'ÉCHEC ')+nom+(detail?' — '+detail:''));}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

/* helpers dans la page */
async function clicTexte(page,selecteur,texte){
  const ok=await page.evaluate((sel,txt)=>{
    const els=[...document.querySelectorAll(sel)];
    const e=els.find(x=>x.textContent.trim().includes(txt)&&x.offsetParent!==null);
    if(e){e.click();return true;}return false;
  },selecteur,texte);
  if(!ok)throw new Error('introuvable au clic : '+texte);
}
async function cocher(page,libelle){
  const ok=await page.evaluate(txt=>{
    const libs=[...document.querySelectorAll('.at-case-lib')];
    const l=libs.find(x=>x.textContent.trim()===txt);
    if(!l)return false;
    const inp=l.closest('.at-case-l').querySelector('input[type=checkbox]');
    inp.click();return true;
  },libelle);
  if(!ok)throw new Error('case introuvable : '+libelle);
}
async function apercuHTML(page){
  return page.evaluate(()=>{const f=document.getElementById('at-apercu');return f?f.srcdoc||'':'';});
}

(async()=>{
  const browser=await puppeteer.launch({executablePath:await chromium.executablePath(),
    args:[...chromium.args,'--allow-file-access-from-files'],headless:'shell'});
  try{
    const page=await browser.newPage();
    await page.setViewport({width:1280,height:900});
    await page.setRequestInterception(true);
    brancher(page,'prof');
    page.on('pageerror',e=>console.log('  [erreur page]',String(e).slice(0,160)));
    await page.goto(FICHIER,{waitUntil:'networkidle0',timeout:60000});
    await dodo(600);

    /* ── B. panneau prof → bouton Atelier réel ── */
    await page.evaluate(()=>openProfPanel());
    await dodo(300);
    await clicTexte(page,'.tprof-section-btn','Atelier');
    await page.waitForSelector('#atelier-ecran.at-actif',{timeout:5000});
    const panneauFerme=await page.evaluate(()=>!document.getElementById('tprof-overlay').classList.contains('visible'));
    verdict('B. bouton du panneau prof ouvre l\u2019atelier plein \u00e9cran (panneau referm\u00e9)',panneauFerme);
    await dodo(400);
    await page.screenshot({path:CAP+'/img-01-liste-vide.png'});

    /* ── C. nouvelle feuille, cocher → apparaît, « + » → 2e bloc ── */
    await clicTexte(page,'.at-btn','Nouvelle feuille');
    await page.waitForSelector('.at-compo',{timeout:5000});
    await page.evaluate(()=>{const i=document.querySelector('.at-titre-doc');i.focus();});
    await page.type('.at-titre-doc','S\u00e9ance 3 \u2014 Les Mis\u00e9rables');
    await cocher(page,'Ajouter un encadr\u00e9 \u00ab \u00c0 retenir \u00bb');
    await dodo(400);
    await page.evaluate(()=>{
      const b=[...document.querySelectorAll('.at-bloc')].pop();
      const ta=b.querySelector('textarea');ta.value='Le narrateur omniscient voit tout.';ta.dispatchEvent(new Event('input'));
    });
    await dodo(400);
    let ap=await apercuHTML(page);
    verdict('C1. cocher fait APPARA\u00ceTRE (\u00c0 retenir dans l\u2019aper\u00e7u)',ap.includes('data-c="a_retenir"')&&ap.includes('narrateur omniscient'));
    await clicTexte(page,'.at-btn-plus','Ajouter');
    await dodo(300);
    const nbBlocs=await page.evaluate(()=>document.querySelectorAll('.at-bloc').length);
    verdict('C2. \u00ab \uff0b Ajouter \u00bb cr\u00e9e un second bloc du m\u00eame type (Q1)',nbBlocs>=2,nbBlocs+' blocs');
    await cocher(page,'Ajouter un encadr\u00e9 \u00ab \u00c0 retenir \u00bb'); /* décocher */
    await dodo(400);
    ap=await apercuHTML(page);
    verdict('C3. d\u00e9cocher fait DISPARA\u00ceTRE (les blocs restent gard\u00e9s, non rendus)',!ap.includes('data-c="a_retenir"'));
    await cocher(page,'Ajouter un encadr\u00e9 \u00ab \u00c0 retenir \u00bb'); /* recocher : réapparaît */
    await dodo(400);
    ap=await apercuHTML(page);
    verdict('C4. recocher fait r\u00e9appara\u00eetre la saisie intacte',ap.includes('narrateur omniscient'));

    /* ── D. case grisée : active quand même + avertissement ── */
    await cocher(page,'Afficher le nom de l\u2019\u00e9l\u00e8ve');
    await dodo(300);
    const modale=await page.evaluate(()=>{const m=document.querySelector('.at-modale-m');return m?m.textContent:'';});
    verdict('D1. case gris\u00e9e \u2192 avertissement \u00ab l\u2019aper\u00e7u fait foi \u00bb',modale.includes('aper\u00e7u'));
    await clicTexte(page,'.at-modale .at-btn','Compris');
    const activee=await page.evaluate(()=>{
      const libs=[...document.querySelectorAll('.at-case-lib')];
      const l=libs.find(x=>x.textContent.trim()==='Afficher le nom de l\u2019\u00e9l\u00e8ve');
      return l.closest('.at-case-l').querySelector('input').checked;
    });
    verdict('D2. la case gris\u00e9e est ACTIV\u00c9E quand m\u00eame (conseille, ne verrouille jamais)',activee);

    /* ── E. rattachement classe → toute la classe → aperçu navigable ── */
    const optionsClasse=await page.evaluate(()=>[...document.querySelectorAll('.at-sel')][1].textContent);
    verdict('E0. classes internes (_*) ABSENTES du s\u00e9lecteur hors mode test',!optionsClasse.includes('_test_atelier')&&optionsClasse.includes('3e T\u00e9moin'),optionsClasse.replace(/\s+/g,' ').slice(0,60));
    await page.evaluate(()=>{const s=[...document.querySelectorAll('.at-sel')][1];s.value='3e_temoin';s.dispatchEvent(new Event('change'));});
    await dodo(400);
    await page.evaluate(()=>{const s=[...document.querySelectorAll('.at-sel')][2];s.value='*';s.dispatchEvent(new Event('change'));});
    await dodo(600);
    let nav=await page.evaluate(()=>document.getElementById('at-ap-nav').textContent);
    ap=await apercuHTML(page);
    verdict('E1. lot classe : compteur \u00e9l\u00e8ve par \u00e9l\u00e8ve pr\u00e9sent',nav.includes('1 / 6'),nav.trim());
    verdict('E2. premier \u00e9l\u00e8ve du lot (tri alphab\u00e9tique) dans l\u2019aper\u00e7u',ap.includes('BERNARD Emma'));
    await clicTexte(page,'#at-ap-nav .at-btn','\u2192');
    await dodo(400);
    nav=await page.evaluate(()=>document.getElementById('at-ap-nav').textContent);
    ap=await apercuHTML(page);
    verdict('E3. navigation \u2192 : deuxi\u00e8me \u00e9l\u00e8ve',nav.includes('2 / 6')&&ap.includes('DUPONT Marie'),nav.trim());
    await page.screenshot({path:CAP+'/img-02-editeur-lot.png'});

    /* ── F. persistance : PUT au bon nœud + indicateur ── */
    await dodo(2000);
    const puts=journal.filter(j=>j.methode==='PUT'&&j.chemin.startsWith('site/atelier/documents/'));
    verdict('F1. \u00e9criture au n\u0153ud site/atelier/documents/<id> (journal r\u00e9seau)',puts.length>0,puts.length+' PUT');
    const etat=await page.evaluate(()=>document.getElementById('at-etat').textContent);
    verdict('F2. indicateur en fran\u00e7ais \u00ab Enregistr\u00e9 \u00e0 \u2026 \u00bb',etat.includes('Enregistr\u00e9 \u00e0'),etat);
    const horsNoeud=journal.filter(j=>(j.methode==='PUT'||j.methode==='DELETE')&&!j.chemin.startsWith('site/atelier/')&&!j.chemin.startsWith('corbeille/'));
    verdict('F3. l\u2019atelier n\u2019\u00e9crit NULLE PART ailleurs',horsNoeud.length===0,horsNoeud.map(j=>j.chemin).join(', ')||'aucun');

    /* ── F4. Q6 : les notions sont STOCKÉES en tableau de valeurs ── */
    await cocher(page,'Afficher les notions vis\u00e9es');
    await dodo(300);
    await page.evaluate(()=>{
      const libs=[...document.querySelectorAll('.at-case-lib')];
      const l=libs.find(x=>x.textContent.trim()==='Afficher les notions vis\u00e9es');
      const ta=l.closest('.at-case').querySelector('textarea');
      ta.value='La phrase complexe\nLes propositions subordonn\u00e9es';ta.dispatchEvent(new Event('input'));
    });
    await dodo(2200);
    const docsStore=rtdbGet(['site','atelier','documents'])||{};
    const doc0=Object.values(docsStore)[0]||{};
    const notionsVal=doc0.valeurs&&doc0.valeurs.notions&&doc0.valeurs.notions.items;
    verdict('F4. Q6 \u2014 notions stock\u00e9es en TABLEAU de valeurs (pas un texte \u00e0 lignes)',Array.isArray(notionsVal)&&notionsVal.length===2,JSON.stringify(notionsVal));

    /* ── G. imprimer : espion sur print() du cadre — le document au moment EXACT de l'appel ── */
    await page.evaluate(()=>{
      const f=document.getElementById('at-apercu');
      /* enregistré AVANT que le code livré pose son onload : à chaque load, le patch
         de print précède l'appel print du handler d'impression (ordre d'enregistrement) */
      f.addEventListener('load',()=>{try{f.contentWindow.print=function(){window.__imprime=f.srcdoc;};}catch(e){}});
      window.__espionPrint=setInterval(()=>{  /* filet pour le cas sans rechargement du cadre */
        try{if(f.contentWindow&&!f.contentWindow.__patche){f.contentWindow.__patche=true;
          f.contentWindow.print=function(){window.__imprime=f.srcdoc;};}}catch(e){}
      },40);
    });
    await clicTexte(page,'.at-ap-barre .at-btn','Imprimer');
    await page.waitForFunction(()=>window.__imprime,{timeout:8000});
    const srcLot=await page.evaluate(()=>{clearInterval(window.__espionPrint);return window.__imprime;});
    const nbFeuilles=(srcLot.match(/class="feuille/g)||[]).length;
    verdict('G. le clic Imprimer appelle print() sur le LOT : 6 feuilles (une par \u00e9l\u00e8ve)',nbFeuilles===6,nbFeuilles+' feuilles au moment du print');
    fs.writeFileSync('/home/claude/build/feuille-lot.html',srcLot);
    await dodo(900);  /* l'aperçu individuel se restaure */
    const apRestaure=await apercuHTML(page);
    verdict('G2. l\u2019aper\u00e7u individuel se restaure apr\u00e8s impression',(apRestaure.match(/class="feuille/g)||[]).length===1);

    /* ── H. panne d'écriture : refus explicite, jamais muet ── */
    failPuts=true;
    await page.type('.at-titre-doc',' \u2014 v2');
    await dodo(2200);
    const etatEchec=await page.evaluate(()=>document.getElementById('at-etat').textContent);
    verdict('H1. \u00e9chec d\u2019\u00e9criture DIT en fran\u00e7ais + gard\u00e9 sur l\u2019appareil',etatEchec.includes('\u00e9chou\u00e9')&&etatEchec.includes('appareil'),etatEchec.slice(0,80));
    failPuts=false;
    await clicTexte(page,'#at-etat .at-btn','R\u00e9essayer');
    await dodo(1200);
    const etatOk=await page.evaluate(()=>document.getElementById('at-etat').textContent);
    verdict('H2. R\u00e9essayer \u2192 \u00ab Enregistr\u00e9 \u00e0 \u2026 \u00bb',etatOk.includes('Enregistr\u00e9 \u00e0'),etatOk);

    /* ── I. coupure + rechargement : reprise proposée ── */
    failPuts=true;
    await page.type('.at-titre-doc',' TEXTE-RESCAPE');
    await dodo(2200);           /* le PUT échoue, le brouillon local est plus récent */
    failPuts=false;
    await page.reload({waitUntil:'networkidle0'});
    await dodo(600);
    await page.evaluate(()=>openProfPanel());
    await clicTexte(page,'.tprof-section-btn','Atelier');
    await page.waitForSelector('#atelier-ecran.at-actif');
    await dodo(500);
    await clicTexte(page,'.at-carte .at-btn','Ouvrir');
    await dodo(400);
    const modaleReprise=await page.evaluate(()=>{const m=document.querySelector('.at-modale-m');return m?m.textContent:'';});
    verdict('I1. au rechargement : reprise propos\u00e9e (brouillon local plus r\u00e9cent)',modaleReprise.includes('cet appareil'),modaleReprise.slice(0,70));
    await clicTexte(page,'.at-modale .at-btn','Reprendre la version de cet appareil');
    await dodo(1000);
    const titreRepris=await page.evaluate(()=>document.querySelector('.at-titre-doc').value);
    verdict('I2. la saisie rescap\u00e9e est L\u00c0',titreRepris.includes('TEXTE-RESCAPE'),titreRepris);
    await dodo(2000); /* laisser la sauvegarde repartir */

    /* ── J. dupliquer puis supprimer (dénombrement → corbeille → destruction) ── */
    await clicTexte(page,'.at-btn','Mes feuilles');
    await dodo(600);
    await clicTexte(page,'.at-carte .at-btn','Dupliquer');
    await dodo(800);
    let nbCartes=await page.evaluate(()=>document.querySelectorAll('.at-carte').length);
    verdict('J1. duplication : deux cartes',nbCartes===2,nbCartes+' cartes');
    await page.evaluate(()=>{  /* supprimer la copie */
      const c=[...document.querySelectorAll('.at-carte')].find(x=>x.textContent.includes('(copie)'));
      [...c.querySelectorAll('.at-btn')].find(b=>b.textContent.trim()==='Supprimer').click();
    });
    await dodo(300);
    const modaleSup=await page.evaluate(()=>{const m=document.querySelector('.at-modale-m');return m?m.textContent:'';});
    verdict('J2. suppression : d\u00e9nombrement affich\u00e9 (cases, blocs, corbeille)',modaleSup.includes('case(s) coch\u00e9e(s)')&&modaleSup.includes('corbeille'),modaleSup.slice(0,90));
    const avantJ=journal.length;
    await clicTexte(page,'.at-modale .at-btn','Mettre \u00e0 la corbeille puis supprimer');
    await dodo(1200);
    const depuisJ=journal.slice(avantJ);
    const putCorb=depuisJ.find(j=>j.methode==='PUT'&&j.chemin.startsWith('corbeille/'));
    const delDoc=depuisJ.find(j=>j.methode==='DELETE'&&j.chemin.startsWith('site/atelier/documents/'));
    verdict('J3. archive corbeille \u00c9CRITE puis destruction (ordre prouv\u00e9 au journal)',!!putCorb&&!!delDoc&&journal.indexOf(putCorb)<journal.indexOf(delDoc),(putCorb?putCorb.chemin:'?')+' \u2192 '+(delDoc?delDoc.chemin:'?'));
    const archive=putCorb?rtdbGet(putCorb.chemin.split('/')):null;
    verdict('J4. archive au format du site {_meta.chemin, data} (restaurable par l\u2019\u00e9cran Corbeille)',!!(archive&&archive._meta&&archive._meta.chemin&&archive._meta.chemin.indexOf('site/atelier/documents/')===0&&archive.data),archive?archive._meta.chemin:'absente');
    nbCartes=await page.evaluate(()=>document.querySelectorAll('.at-carte').length);
    verdict('J5. la carte a disparu, l\u2019originale demeure',nbCartes===1,nbCartes+' carte');

    /* ── K. MODE TEST : rien ne part au hub ── */
    await page.evaluate(()=>{if(!m8TestOn())m8BasculerModeTest();});
    await dodo(400);
    const enTest=await page.evaluate(()=>m8TestOn());
    verdict('K0. mode test actif (bascule r\u00e9elle du site)',enTest);
    const avantK=journal.length;
    await page.evaluate(()=>atelierOuvrir());
    await dodo(500);
    const bandeau=await page.evaluate(()=>{const b=document.querySelector('.at-bandeau-test');return b?b.textContent:'';});
    verdict('K1. guidage : bandeau mode test dans l\u2019atelier',bandeau.includes('rien ne part au hub'),bandeau.slice(0,60));
    await clicTexte(page,'.at-btn','Nouvelle feuille');
    await dodo(500);
    await page.type('.at-titre-doc','FEUILLE-DE-TEST');
    await cocher(page,'Ajouter une d\u00e9finition');
    await dodo(2200);
    await clicTexte(page,'.at-btn','Mes feuilles');
    await dodo(500);
    await page.evaluate(()=>{
      const c=[...document.querySelectorAll('.at-carte')].find(x=>x.textContent.includes('FEUILLE-DE-TEST'));
      [...c.querySelectorAll('.at-btn')].find(b=>b.textContent.trim()==='Supprimer').click();
    });
    await dodo(300);
    await clicTexte(page,'.at-modale .at-btn','Mettre \u00e0 la corbeille puis supprimer');
    await dodo(1000);
    const ecrituresTest=journal.slice(avantK).filter(j=>j.methode==='PUT'||j.methode==='DELETE');
    verdict('K2. compos\u00e9, enregistr\u00e9, supprim\u00e9 en mode test : Z\u00c9RO \u00e9criture r\u00e9seau',ecrituresTest.length===0,ecrituresTest.map(j=>j.methode+' '+j.chemin).join('; ')||'journal vide');
    await page.evaluate(()=>{if(m8TestOn())m8BasculerModeTest();});
    await page.evaluate(()=>atelierOuvrir());   /* retour en mode réel : la purge joue ici */
    await dodo(500);
    const restes=await page.evaluate(()=>{const r=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('mjpc_atelier_brouillon__test_')===0)r.push(k);}return r;});
    verdict('K3. retour en mode r\u00e9el : les brouillons de test sont purg\u00e9s (cycle r\u00e9el jou\u00e9)',restes.length===0,restes.join(', ')||'aucun reste');

    /* ── L. parcours ÉLÈVE témoin : site/atelier JAMAIS téléchargé ── */
    const pageEleve=await browser.newPage();
    await pageEleve.setViewport({width:1280,height:900});
    await pageEleve.setRequestInterception(true);
    brancher(pageEleve,'eleve');
    const avantL=journal.length;
    await pageEleve.goto(FICHIER,{waitUntil:'networkidle0',timeout:60000});
    await dodo(800);
    await pageEleve.evaluate(()=>{if(typeof loadPublished==='function')loadPublished('3e');});
    await dodo(1500);
    const reqEleve=journal.slice(avantL).filter(j=>j.page==='eleve');
    const fuiteAtelier=reqEleve.filter(j=>j.chemin.includes('atelier'));
    verdict('L. \u00e9l\u00e8ve t\u00e9moin (chargement + niveau 3e) : AUCUNE requ\u00eate vers site/atelier',reqEleve.length>0&&fuiteAtelier.length===0,reqEleve.length+' requ\u00eates \u00e9l\u00e8ve, chemins atelier : '+fuiteAtelier.length);
    fs.writeFileSync('/home/claude/build/journal-requetes.json',JSON.stringify(journal,null,1));
    await pageEleve.close();

    /* ── M. MOBILE 390 px : mesures des cibles, débordement ── */
    await page.setViewport({width:390,height:844});
    await page.evaluate(()=>atelierOuvrir());
    await dodo(500);
    await clicTexte(page,'.at-carte .at-btn','Ouvrir');
    await dodo(600);
    const mesures=await page.evaluate(()=>{
      const cibles=[...document.querySelectorAll('#atelier-ecran button, #atelier-ecran select, #atelier-ecran .at-case-l, #atelier-ecran .at-ifo, #atelier-ecran input, #atelier-ecran textarea')];
      const petites=[];
      cibles.forEach(e=>{
        let cible=e;
        /* la cible tactile d'une checkbox est son label englobant (cliquer le label coche) */
        if(e.matches&&e.matches('input[type=checkbox]')&&e.closest('.at-case-l'))cible=e.closest('.at-case-l');
        const r=cible.getBoundingClientRect();
        if(r.width===0&&r.height===0)return; /* non visibles */
        if(r.height<44||r.width<44)petites.push({t:(cible.textContent||cible.tagName).trim().slice(0,26),w:Math.round(r.width),h:Math.round(r.height)});
      });
      const ecran=document.getElementById('atelier-ecran');
      return {petites:petites,deborde:ecran.scrollWidth>390?ecran.scrollWidth:0,total:cibles.length};
    });
    verdict('M1. mobile 390 : toutes les cibles \u2265 44\u00d744 px ('+mesures.total+' mesur\u00e9es)',mesures.petites.length===0,JSON.stringify(mesures.petites.slice(0,5)));
    verdict('M2. mobile 390 : aucun d\u00e9bordement horizontal',mesures.deborde===0,mesures.deborde?('scrollWidth='+mesures.deborde):'');
    const empile=await page.evaluate(()=>{
      const g=document.querySelector('.at-gauche'),d=document.querySelector('.at-droite');
      return g&&d&&(d.getBoundingClientRect().top>=g.getBoundingClientRect().bottom-2);
    });
    verdict('M3. mobile : composition et aper\u00e7u EMPIL\u00c9S (Q2)',empile);
    await page.screenshot({path:CAP+'/img-03-mobile-editeur.png'});

    /* ── N. captures desktop + rendu papier ── */
    await page.setViewport({width:1280,height:900});
    await page.evaluate(()=>atelierOuvrir());
    await dodo(400);
    await clicTexte(page,'.at-carte .at-btn','Ouvrir');
    await dodo(800);
    await page.screenshot({path:CAP+'/img-04-editeur-desktop.png'});
    const pagePrint=await browser.newPage();
    await pagePrint.setContent(fs.readFileSync('/home/claude/build/feuille-lot.html','utf8'),{waitUntil:'load'});
    await dodo(400);
    await pagePrint.screenshot({path:CAP+'/img-05-feuille-ecran.png',fullPage:false});
    await pagePrint.pdf({path:CAP+'/img-06-feuille-papier.pdf',format:'A4',printBackground:true});
    verdict('N. captures produites (\u00e9cran et papier)',fs.existsSync(CAP+'/img-06-feuille-papier.pdf'));

  }finally{await browser.close();}
  const echecs=V.filter(v=>!v.ok);
  fs.writeFileSync('/home/claude/build/parcours-verdicts.json',JSON.stringify(V,null,1));
  console.log('\n══ PARCOURS : '+(V.length-echecs.length)+'/'+V.length+' verts ══');
  process.exit(echecs.length?1:0);
})().catch(e=>{console.error('ARRÊT :',e);process.exit(2);});
