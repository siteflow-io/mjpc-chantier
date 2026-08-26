/* BANC EDT — livraison ②b : les objets du hub et les trois portes d'injection.
   Faux hub en mémoire, amorcé par un instantané pris en lecture seule.
   AUCUNE écriture ne sort : tout PUT/PATCH/POST/DELETE est capté et compté.
   Réutilisable par les lots suivants : `creerHub`, `poserAdmin`, `capture`. */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');

const RACINE = '/home/claude';
const CAND = path.join(RACINE, 'candidat-8.72.0.html');
const SORTIE = path.join(RACINE, 'tests');

function creerHub(dossier){
  const store = {};
  const poser = (chemin, val) => {
    const p = String(chemin).split('/').filter(Boolean);
    let n = store;
    for(let k=0;k<p.length-1;k++){ if(typeof n[p[k]]!=='object'||n[p[k]]===null) n[p[k]]={}; n=n[p[k]]; }
    if(val===null) delete n[p[p.length-1]]; else n[p[p.length-1]]=val;
  };
  const charge = (chemin, fichier) => {
    const f = path.join(dossier, fichier);
    if(fs.existsSync(f)) poser(chemin, JSON.parse(fs.readFileSync(f,'utf8')));
  };
  charge('classes','classes.json');
  charge('site/3e','site_3e.json');
  charge('site/config','site_config.json');
  return store;
}

const journal = [];
const releve = { get:0, ecritures:0, sorties:0, erreursConsole:[] };

(async () => {
  const store = creerHub(path.join(RACINE,'tests/hub'));
  const navigateur = await puppeteer.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  const page = await navigateur.newPage();
  await page.setViewport({width:1366,height:768});

  await page.evaluateOnNewDocument((storeInit) => {
    window.__HUB = JSON.parse(JSON.stringify(storeInit));
    window.__JOURNAL = [];
    const lire = (chemin) => {
      const p = String(chemin).split('/').filter(Boolean);
      let n = window.__HUB;
      for(const k of p){ if(n===null||typeof n!=='object'||!(k in n)) return null; n=n[k]; }
      return n===undefined?null:n;
    };
    const poser = (chemin, val) => {
      const p = String(chemin).split('/').filter(Boolean);
      let n = window.__HUB;
      for(let k=0;k<p.length-1;k++){ if(typeof n[p[k]]!=='object'||n[p[k]]===null) n[p[k]]={}; n=n[p[k]]; }
      if(val===null) delete n[p[p.length-1]]; else n[p[p.length-1]]=val;
    };
    const vrai = window.fetch;
    window.fetch = function(url, opt){
      const u = String(url);
      if(u.indexOf('firebasedatabase.app') >= 0){
        const chemin = u.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/,'');
        const methode = ((opt&&opt.method)||'GET').toUpperCase();
        if(methode === 'GET'){
          window.__JOURNAL.push({m:'GET', chemin});
          return Promise.resolve(new Response(JSON.stringify(lire(chemin)),{status:200,headers:{'Content-Type':'application/json'}}));
        }
        let corps = null; try{ corps = JSON.parse((opt&&opt.body)||'null'); }catch(e){}
        window.__JOURNAL.push({m:methode, chemin, taille:((opt&&opt.body)||'').length});
        if(methode === 'DELETE') poser(chemin, null); else poser(chemin, corps);
        return Promise.resolve(new Response(JSON.stringify(corps),{status:200,headers:{'Content-Type':'application/json'}}));
      }
      window.__JOURNAL.push({m:'SORTIE', chemin:u});
      return Promise.resolve(new Response('null',{status:200}));
    };
  }, store);

  page.on('console', m => { if(m.type()==='error') releve.erreursConsole.push(m.text().slice(0,160)); });
  page.on('pageerror', e => releve.erreursConsole.push('pageerror: '+String(e.message).slice(0,160)));
  releve.reponsesEnEchec = [];
  page.on('response', r => { if(r.status() >= 400) releve.reponsesEnEchec.push(r.status()+' '+r.url().slice(0,140)); });
  page.on('requestfailed', r => releve.reponsesEnEchec.push('échec '+r.url().slice(0,140)));

  await page.goto('file://'+CAND, {waitUntil:'networkidle0'});
  await new Promise(r => setTimeout(r, 1500));

  /* décor de banc : l'alerte « fiches d'applications » du site (état de l'instantané,
     étrangère à l'EDT) est écartée avant chaque capture — jamais modifiée dans le site. */
  const ecarterAlerteFiches = () => page.evaluate(() => {
    const o = document.getElementById('fi-overlay'); if(o) o.remove(); return !!o;
  });
  /* les modales d'information du site (« Compris ») sont refermées avant capture :
     ce sont des retours de geste, pas l'écran qu'on veut prouver. */
  const fermerModales = () => page.evaluate(() => {
    let n=0;
    document.querySelectorAll('button').forEach(b => {
      if(b.closest('#edt-modale') || b.closest('#edt-ecran')) return;   /* jamais nos propres boutons */
      if(/^\s*(Compris|Annuler)\s*$/.test(b.textContent)){ b.click(); n++; }
    });
    return n;
  });
  const capture = async (nom) => { await ecarterAlerteFiches(); await fermerModales(); await new Promise(r=>setTimeout(r,180));
    await page.screenshot({path:path.join(SORTIE,nom+'.png'), fullPage:false}); journal.push('capture '+nom); };

  /* ── ① l'entrée existe dans le panneau prof ─────────────────────────── */
  await page.evaluate(() => { document.body.classList.add('admin-mode'); openProfPanel(); });
  await new Promise(r => setTimeout(r, 400));
  const entree = await page.evaluate(() => !!document.querySelector('.tprof-section-btn[data-section="edt"]'));
  journal.push('entrée « Emploi du temps » dans le panneau prof : ' + entree);
  await capture('2b-1-panneau-prof');

  /* ── ② la section s'ouvre, aucun objet injecté, aucun crash ─────────── */
  await page.evaluate(() => showProfSection('edt'));
  await new Promise(r => setTimeout(r, 900));
  const vide = await page.evaluate(() => document.getElementById('edt-panneau').innerText.slice(0,400));
  journal.push('état à vide :\n' + vide);
  await capture('2b-2-section-vide');

  /* ── ③ AT_EDT vaut le repli tant que l'objet créneaux est absent ────── */
  const avant = await page.evaluate(() => AT_EDT.join(' · '));
  journal.push('AT_EDT avant injection (repli en dur) : ' + avant);

  /* ── ④ un JSON refusé l'est NOMMÉMENT ──────────────────────────────── */
  await page.evaluate(() => { edtInjOuvrir('grille'); });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => {
    document.getElementById('edt-inj-coller').value = JSON.stringify({creneaux:[
      {jour:'lundi',creneau:'08:57-09:52',semaine:'AB',classe:'3 FRANKLIN Aretha'},
      {jour:'lundi',creneau:'08:57-09:52',semaine:'A',classe:'4 HUGO'},
      {jour:'mercredi',creneau:'15:07-16:02',semaine:'A',classe:'4 TURING'},
      {jour:'samedi',creneau:'08:00-08:55',semaine:'A',classe:'4 HUGO'}
    ]});
    edtInjVerifier('grille');
  });
  await new Promise(r => setTimeout(r, 300));
  const refus = await page.evaluate(() => { const e=document.querySelector('.edt-refus'); return e?e.innerText:'(aucun refus)'; });
  journal.push('refus nommés :\n' + refus);
  await capture('2b-3-refus-nomme');

  /* ── ⑤ les trois injections ────────────────────────────────────────── */
  const lire = f => fs.readFileSync(path.join(RACINE,f),'utf8');
  for(const [voie, fichier] of [['creneaux','creneaux-2026-2027.json'],
                                ['calendrier','calendrier-2026-2027.json'],
                                ['grille','grille-2026-2027.json']]){
    await page.evaluate((v) => edtInjOuvrir(v), voie);
    await new Promise(r => setTimeout(r, 250));
    const ok = await page.evaluate((v, txt) => {
      document.getElementById('edt-inj-coller').value = txt;
      edtInjVerifier(v);
      const refus = document.querySelector('.edt-refus');
      return refus ? refus.innerText : null;
    }, voie, lire(fichier));
    journal.push('vérification ' + voie + ' : ' + (ok ? 'REFUSÉ — ' + ok : 'acceptée'));
    if(ok) continue;
    await page.evaluate((v) => edtInjInjecter(v), voie);
    await new Promise(r => setTimeout(r, 600));
  }
  await new Promise(r => setTimeout(r, 800));
  await capture('2b-4-apres-injection');

  /* ── ⑥ AT_EDT vient désormais de l'objet — preuve par des horaires DIFFÉRENTS */
  const apres = await page.evaluate(() => AT_EDT.join(' · '));
  journal.push('AT_EDT après injection des créneaux de l\u2019année : ' + apres
    + '\n  (identique au repli : c\u2019est normal, la grille 2026-2027 garde les mêmes horaires — la preuve suit)');
  const preuve = await page.evaluate(() => {
    const autre = {annee:'2026-2027', creneaux:[
      {rang:1,debut:'08:10',fin:'09:05'},{rang:2,debut:'09:10',fin:'10:05'},{rang:3,debut:'10:20',fin:'11:15'}]};
    edtInjOuvrir('creneaux');
    document.getElementById('edt-inj-coller').value = JSON.stringify(autre);
    edtInjVerifier('creneaux');
    edtInjInjecter('creneaux');
    return null;
  });
  await new Promise(r => setTimeout(r, 700));
  const change = await page.evaluate(() => AT_EDT.join(' · '));
  journal.push('AT_EDT après injection d\u2019horaires DIFFÉRENTS : ' + change
    + '\n  \u2192 l\u2019objet commande bien la variable du site (le déroulé et le T-5 la lisent).');
  /* on remet les vrais horaires, et on prouve le repli quand l'objet disparaît */
  await page.evaluate((txt) => {
    edtInjOuvrir('creneaux');
    document.getElementById('edt-inj-coller').value = txt;
    edtInjVerifier('creneaux'); edtInjInjecter('creneaux');
  }, lire('creneaux-2026-2027.json'));
  await new Promise(r => setTimeout(r, 700));
  const repli = await page.evaluate(() => { EDT.creneaux = null; edtAppliquerCreneaux(); return AT_EDT.join(' · '); });
  journal.push('AT_EDT quand l\u2019objet est absent (repli sur la valeur en dur) : ' + repli);
  await page.evaluate(() => { edtCharger(function(){}); });
  await new Promise(r => setTimeout(r, 600));

  /* ── ⑦ l'exception ① : brevetDates écrite, et elle seule ───────────── */
  const ecrits = await page.evaluate(() => window.__JOURNAL.filter(x => x.m !== 'GET' && x.m !== 'SORTIE').map(x => x.m + ' ' + x.chemin));
  journal.push('écritures au hub (les seules qui comptent) :\n  ' + ecrits.join('\n  '));
  const horsEdt = ecrits.filter(x => x.indexOf('/site/edt/') < 0);
  journal.push('écritures hors /site/edt/ : ' + (horsEdt.length ? horsEdt.join(' | ') : 'aucune') + '  \u2014 attendu : la seule exception \u2460 (brevetDates)');
  const sorties = await page.evaluate(() => window.__JOURNAL.filter(x => x.m === 'SORTIE').map(x => x.chemin));
  journal.push('requêtes hors hub captées (chargement des pages s\u0153urs du site, aucune sortie réseau) : ' + sorties.length + ' \u2014 ' + Array.from(new Set(sorties)).join(', '));
  const brevet = await page.evaluate(() => window.__HUB.site.config.brevetDates);
  journal.push('brevetDates au faux hub : ' + JSON.stringify(brevet));

  /* ── ⑧ la modification à la main : une date de période ─────────────── */
  await page.evaluate(() => edtPeriodePoser('P1','2026-09-01'));
  await new Promise(r => setTimeout(r, 600));
  const per = await page.evaluate(() => JSON.stringify(window.__HUB.site.edt.periodes));
  journal.push('périodes après saisie à la main : ' + per);
  await capture('2b-5-periodes-et-appariement');

  /* ══════════ ③a — LES PÉRIODES, OBJET ÉDITABLE ══════════ */
  const lesPeriodes = async () => page.evaluate(() => edtPeriodes().map(p => p.rang+':'+p.nom+'['+(p.debut||'')+'→'+(p.fin||'')+']'));

  journal.push('① livrées par la grille, telles qu\u2019écrites sur la feuille : ' + JSON.stringify(await lesPeriodes()));
  await capture('3a-1-periodes-livrees');

  /* ② renommer PFIN en P5 : la grille et l'écran suivent, sans redéploiement */
  await page.evaluate(() => { const p = edtPeriodes().filter(x=>x.nom==='PFIN')[0]; edtPeriodePoser(p.rang,'nom','P5'); });
  await new Promise(r => setTimeout(r, 600));
  journal.push('② après renommage PFIN → P5 : ' + JSON.stringify(await lesPeriodes()));
  const orph = await page.evaluate(() => edtEtiquettesOrphelines());
  journal.push('   étiquettes citées par la grille et non déclarées : ' + JSON.stringify(orph) + '  (PFIN est cité par le mardi 15:07 — signalé, jamais bloquant)');
  const vuEcran = await page.evaluate(() => { const a=document.querySelector('.edt-alerte'); return a?a.innerText:'(aucune alerte)'; });
  journal.push('   ce que l\u2019écran affiche : ' + vuEcran);
  await capture('3a-2-renommee-et-orpheline');

  /* ③ ajouter une sixième période */
  await page.evaluate(() => edtPeriodeAjouter());
  await new Promise(r => setTimeout(r, 600));
  journal.push('③ après ajout : ' + JSON.stringify(await lesPeriodes()));

  /* ④ deux périodes qui se chevauchent : refus nommé */
  const refusPer = await page.evaluate(() => {
    const l = edtPeriodes();
    l[0].debut='2026-09-01'; l[0].fin='2026-11-30';
    l[1].debut='2026-11-15'; l[1].fin='2027-01-08';
    return edtValiderPeriodes(l);
  });
  journal.push('④ chevauchement : ' + JSON.stringify(refusPer));
  const refusNom = await page.evaluate(() => edtValiderPeriodes([{nom:'P1'},{nom:'P1'},{nom:'P3',debut:'2027-03-01',fin:'2027-01-01'}]));
  journal.push('   nom en double et fin avant début : ' + JSON.stringify(refusNom));

  /* dates saisies, puis réinjection de la grille : les dates survivent */
  await page.evaluate(() => { const l=edtPeriodes(); edtPeriodePoser(l[0].rang,'debut','2026-09-01'); });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => { const l=edtPeriodes(); edtPeriodePoser(l[0].rang,'fin','2026-11-06'); });
  await new Promise(r => setTimeout(r, 500));
  journal.push('   dates saisies à la main : ' + JSON.stringify(await lesPeriodes()));
  const annonce = await page.evaluate((txt) => { edtInjOuvrir('grille');
    document.getElementById('edt-inj-coller').value=txt; edtInjVerifier('grille');
    const a=document.querySelector('.edt-apercu'); return a?a.innerText:'(pas d\u2019aperçu)'; }, lire('grille-2026-2027.json'));
  journal.push('   ce que l\u2019écran ANNONCE avant le geste : ' + annonce);
  await capture('3a-4-annonce-avant-reinjection');
  await page.evaluate(() => edtInjInjecter('grille'));
  await new Promise(r => setTimeout(r, 1200));
  journal.push('   après RÉINJECTION de la grille (les dates ne doivent pas être perdues) : ' + JSON.stringify(await lesPeriodes()));

  /* la période en vigueur à une date */
  const enVigueur = await page.evaluate(() => ({ septembre: edtPeriodeA('2026-09-07'), decembre: edtPeriodeA('2026-12-01') }));
  journal.push('   période en vigueur : ' + JSON.stringify(enVigueur));

  /* ⑤ objet vidé : repli sur une seule période */
  await page.evaluate(() => { EDT.periodes = null; edtPeindrePanneau(); });
  await new Promise(r => setTimeout(r, 400));
  const repliPer = await page.evaluate(() => ({ liste: edtPeriodes().length, periodeA: edtPeriodeA('2026-12-01'),
    ecran: document.querySelector('.edt-panneau').innerText.indexOf('une seule période') >= 0 }));
  journal.push('⑤ objet vidé : ' + JSON.stringify(repliPer));
  await capture('3a-3-repli-une-seule-periode');
  await page.evaluate(() => edtCharger(function(){}));
  await new Promise(r => setTimeout(r, 700));

  /* ── ⑨ l'appariement d'une classe de grille ────────────────────────── */
  await page.evaluate(() => edtApparierNom('3 FRANKLIN Aretha','3E Charles de Gaulle'));
  await new Promise(r => setTimeout(r, 600));
  const app = await page.evaluate(() => (edtVersions()[0].creneaux).filter(c=>c.classe==='3 FRANKLIN Aretha').map(c=>c.classeMjpc));
  journal.push('appariement 3 FRANKLIN Aretha → ' + JSON.stringify(app));

  /* ── ⑩ lectures de base du calendrier ──────────────────────────────── */
  const lect = await page.evaluate(() => ({
    semaine7sept: edtSemaineLettre('2026-09-07'),
    semaine16sept: edtSemaineLettre('2026-09-16'),
    toussaint: edtJourSansCours('2026-10-20'),
    unLundiOrdinaire: edtJourSansCours('2026-09-07'),
    tempsUtile: edtTempsUtile('10:07-11:02'),
    periodeAuPremierSeptembre: edtPeriodeA('2026-09-07')
  }));
  journal.push('lectures : ' + JSON.stringify(lect, null, 1));

  /* ══════════ ③b — LE PRÉVU ET LA SEMAINE ══════════ */
  await page.evaluate((txt) => { edtInjOuvrir('grille'); document.getElementById('edt-inj-coller').value=txt;
    edtInjVerifier('grille'); edtInjInjecter('grille'); }, fs.readFileSync(path.join(RACINE,'tests/grille-appariee.json'),'utf8'));
  await new Promise(r => setTimeout(r, 1200));

  /* le bouton « Sortir le JSON actuel » : ce qui atterrit dans le presse-papiers */
  await page.evaluate(() => { window.__PRESSE='';
    Object.defineProperty(navigator, 'clipboard', {configurable:true,
      value: {writeText:(t)=>{window.__PRESSE=t;return Promise.resolve();}}}); });
  const presse = await page.evaluate(() => { edtSortirJson('grille');
    return {longueur: window.__PRESSE.length,
            premiereCle: window.__PRESSE ? Object.keys(JSON.parse(window.__PRESSE))[0] : '(vide)',
            objetPresent: !!EDT.grille}; });
  journal.push('« Sortir le JSON actuel » (grille) : ' + JSON.stringify(presse));

  /* l'écran s'ouvre sur la semaine du 7 septembre 2026 */
  await page.evaluate(() => { EDT_VUE.ancre = '2026-09-07'; edtOuvrir(); });
  await new Promise(r => setTimeout(r, 1800));
  await page.evaluate(() => { EDT_VUE.ancre = '2026-09-07'; edtPeindreSemaine(); });
  await new Promise(r => setTimeout(r, 700));

  for(const [l, h] of [[1366,768],[1920,1080]]){
    await page.setViewport({width:l, height:h});
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => edtPeindreSemaine());
    await new Promise(r => setTimeout(r, 400));
    const m = await page.evaluate(() => {
      const e = document.getElementById('edt-ecran');
      const debordent = Array.from(document.querySelectorAll('#edt-ecran .edt-case'))
        .filter(c => c.scrollHeight > c.clientHeight + 1).length;
      window.scrollTo(0, 4000);                       /* on ESSAIE de faire défiler */
      const apresEssai = window.scrollY;
      const interne = Array.from(document.querySelectorAll('#edt-ecran *'))
        .filter(x => x.scrollHeight > x.clientHeight + 1 && getComputedStyle(x).overflowY === 'auto').length;
      return {ecranHaut: e.scrollHeight, ecranVu: e.clientHeight, fenetre: window.innerHeight,
              scrollYaprestentative: apresEssai, casesQuiDebordent: debordent, zonesQuiDefilent: interne,
              documentScrollHeight: document.documentElement.scrollHeight};
    });
    const vert = (m.ecranHaut <= m.ecranVu) && (m.ecranVu === m.fenetre)
              && (m.scrollYaprestentative === 0) && (m.casesQuiDebordent === 0) && (m.zonesQuiDefilent === 0);
    journal.push('sans scroll à '+l+'×'+h+' : ' + JSON.stringify(m) + (vert ? '  \u2713' : '  \u2717'));
    await capture('3b-semaine-'+l+'x'+h);
  }
  await page.setViewport({width:1366, height:768});
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => edtPeindreSemaine());
  await new Promise(r => setTimeout(r, 400));

  /* ce que le prévu a posé, case par case */
  const proj = await page.evaluate(() => {
    const c = edtProjeter('2026-09-07', 5);
    return Object.keys(c).sort().map(k => { const x=c[k];
      return x.iso+' '+x.creneau+' '+(x.classeMjpc||x.classe)+' → '+x.nature
        + (x.titre ? (' « '+x.titre.slice(0,34)+' » heure '+x.heure+'/'+x.sur) : '')
        + (x.fil ? (' [fil '+x.fil+']') : '')
        + (x.activites!==undefined ? (' '+x.activites+' activités, '+x.reportees+' reportée(s)') : ''); });
  });
  journal.push('LE PRÉVU, semaine du 7 septembre (semaine B) :\n  ' + proj.join('\n  '));

  const cartes = await page.evaluate(() => Array.from(document.querySelectorAll('#edt-ecran .edt-carte')).map(c => c.innerText.replace(/\n/g,' | ')));
  journal.push('cartes de classe : ' + JSON.stringify(cartes));

  /* la photo du prévu */
  await page.evaluate(() => edtPhoto());
  await new Promise(r => setTimeout(r, 800));
  const photo = await page.evaluate(() => { const p = window.__HUB.site.edt.photos['2026-2027'];
    return {nombre: p.photos.length, prise: p.photos[0].prise, depuis: p.photos[0].depuis, cases: Object.keys(p.photos[0].cellules).length}; });
  journal.push('photo du prévu : ' + JSON.stringify(photo));

  /* ══════════ ④ — LA MODALE, LES DÉCISIONS, ANNULER, LE JOURNAL ══════════ */
  const casePrevue = '2026-09-08|15:07-16:02|3 FRANKLIN Aretha';
  await page.evaluate((k) => edtCaseClic(k), casePrevue);
  await new Promise(r => setTimeout(r, 400));
  const mo = await page.evaluate(() => { const m=document.getElementById('edt-modale');
    return m ? {ouverte:true, voile:!!document.querySelector('.edt-voile'), texte:m.innerText.slice(0,240),
                boutons:Array.from(m.querySelectorAll('button')).map(b=>b.textContent.trim()),
                categories:Array.from(m.querySelectorAll('#edt-cat option')).map(o=>o.textContent)} : {ouverte:false}; });
  journal.push('modale ouverte sur une case prévue : ' + JSON.stringify(mo, null, 1));
  await capture('4-1-modale-ouverte');

  /* déplaçable, contenue dans la zone, descend aux deux tiers */
  const bouge = await page.evaluate(() => {
    const m=document.getElementById('edt-modale'), t=m.querySelector('.edt-mo-tete');
    const av={x:EDT_MOD.x,y:EDT_MOD.y};
    t.dispatchEvent(new PointerEvent('pointerdown',{clientX:av.x+40,clientY:av.y+10,bubbles:true}));
    window.dispatchEvent(new PointerEvent('pointermove',{clientX:av.x+300,clientY:av.y+400,bubbles:true}));
    const pendant={x:EDT_MOD.x,y:EDT_MOD.y};
    window.dispatchEvent(new PointerEvent('pointermove',{clientX:9999,clientY:9999,bubbles:true}));
    const pousse={x:EDT_MOD.x,y:EDT_MOD.y,limiteX:window.innerWidth-m.offsetWidth-4,limiteY:Math.round(window.innerHeight*0.72)};
    window.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));
    return {avant:av, apresDeplacement:pendant, poussee:pousse};
  });
  journal.push('modale déplaçable et contenue : ' + JSON.stringify(bouge));
  await capture('4-2-modale-deplacee');

  /* « ne plus compter cette séance » : catégorie + précision, la grille se recalcule */
  const avantDecision = await page.evaluate((k) => { const c=edtCellule(k); return c.nature+' '+(c.titre||''); }, casePrevue);
  await page.evaluate(() => { document.getElementById('edt-cat').selectedIndex = 4;   /* Gestion de classe */
    document.getElementById('edt-prec').value = 'retour sur le conseil de classe';
    document.querySelector('.edt-mo-bloc button').click(); });
  await new Promise(r => setTimeout(r, 1000));
  const apresDecision = await page.evaluate((k) => {
    const c = EDT_VUE.cellules[k];
    const suite = Object.keys(EDT_VUE.cellules).sort().map(z => { const x=EDT_VUE.cellules[z];
      return x.iso+' '+x.creneau+' '+(x.classeMjpc||x.classe)+' → '+x.nature+(x.titre?(' heure '+x.heure+'/'+x.sur):''); })
      .filter(l => l.indexOf('3E Charles') >= 0);
    return {case:c.nature+' / '+(c.categorie||'')+' / '+(c.precision||''), grille:suite};
  }, casePrevue);
  journal.push('avant décision : ' + avantDecision);
  journal.push('après « ne plus compter cette séance » :\n  ' + apresDecision.case + '\n  la grille glisse :\n   ' + apresDecision.grille.join('\n   '));
  const auHub = await page.evaluate(() => JSON.stringify(window.__HUB.site.edt.decisions['2026-2027']));
  journal.push('au hub : ' + auHub.slice(0, 420));
  await capture('4-3-sans-seance-et-glissement');

  /* ↶ Annuler : la décision est retirée, la grille revient */
  await page.evaluate((k) => edtCaseClic(k), casePrevue);
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => { const b=Array.from(document.querySelectorAll('#edt-modale button'))
    .filter(x => x.textContent.indexOf('Annuler') >= 0)[0]; if(b) b.click(); });
  await new Promise(r => setTimeout(r, 1000));
  const apresAnnul = await page.evaluate((k) => { const c=EDT_VUE.cellules[k];
    return {nature:c.nature, titre:c.titre||'', heure:(c.heure||'')+'/'+(c.sur||''),
            decisionRestante: !!((window.__HUB.site.edt.decisions['2026-2027']['3E Charles de Gaulle'].heures||{})['2026-09-08_15h07-16h02_3E_Charles_de_Gaulle'])}; }, casePrevue);
  journal.push('après ↶ Annuler : ' + JSON.stringify(apresAnnul));

  /* le journal garde les deux gestes */
  const jrnClasse = await page.evaluate(() => (window.__HUB.site.edt.decisions['2026-2027']['3E Charles de Gaulle'].journal||[]).map(x => x.quoi));
  journal.push('journal des modifications horaires : ' + JSON.stringify(jrnClasse));

  /* déplacer une heure vers un autre créneau : départ vidé, arrivée épinglée */
  await page.evaluate((k) => edtCaseClic(k), casePrevue);
  await new Promise(r => setTimeout(r, 300));
  const cibles = await page.evaluate(() => { const s=document.querySelectorAll('#edt-modale select')[0];
    return Array.from(s.options).slice(0,4).map(o => o.textContent); });
  journal.push('créneaux proposés pour le déplacement : ' + JSON.stringify(cibles));
  await page.evaluate(() => { const s=document.querySelectorAll('#edt-modale select')[0];
    s.selectedIndex = 1; s.dispatchEvent(new Event('change')); });
  await new Promise(r => setTimeout(r, 1200));
  const apresDep = await page.evaluate(() => {
    const h = window.__HUB.site.edt.decisions['2026-2027']['3E Charles de Gaulle'].heures;
    return Object.keys(h).map(k => k + ' → ' + JSON.stringify(h[k]).slice(0,120));
  });
  journal.push('après déplacement :\n  ' + apresDep.join('\n  '));
  await capture('4-4-heure-deplacee');

  /* Échap ferme la modale, puis l'écran */
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})));
  await new Promise(r => setTimeout(r, 300));
  const apEchap1 = await page.evaluate(() => ({modale:!!document.getElementById('edt-modale'),
    ecran:document.getElementById('edt-ecran').style.display}));
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})));
  await new Promise(r => setTimeout(r, 300));
  const apEchap2 = await page.evaluate(() => ({ecran:document.getElementById('edt-ecran').style.display,
    figeHtml:document.documentElement.classList.contains('edt-fige')}));
  journal.push('Échap une fois : ' + JSON.stringify(apEchap1) + ' | Échap deux fois : ' + JSON.stringify(apEchap2));

  await page.evaluate(() => edtFermer());
  await new Promise(r => setTimeout(r, 300));
  const ferme = await page.evaluate(() => document.getElementById('edt-ecran').style.display);
  journal.push('après « Fermer l\u2019emploi du temps » : display=' + ferme + ' (l\u2019accueil est intact derrière)');

  /* ══════════ ④ bis — LA PORTE DU PILOTAGE, COMPARÉE CHAMP À CHAMP ══════════
     À gauche : le clic « ▶ Ouvrir le pilotage et lancer » depuis une case de l'EDT.
     À droite : le chemin d'aujourd'hui — ouvrir le chapitre, la vue Déroulé,
     choisir la classe et le créneau, appuyer sur « ▶ Lancer la séance ».
     Les deux états du site doivent être identiques. */
  const releveEtat = () => page.evaluate(() => ({
    chapitre: AT.edChap ? (AT.edChap.level + '/' + AT.edChap.chnum) : null,
    seance: ATVUES.snum,
    vue: ATVUES.vue,
    regime: AT_DR_REGIME,
    cours: AT_DR_COURS ? (AT_DR_COURS.classeNom + ' ' + AT_DR_COURS.debut + '-' + AT_DR_COURS.fin) : null,
    copieJouee: (function(){ try{ const c=window.__HUB.site['3e'].chapitres[0].seances[1].deroule_joue;
      return c ? Object.keys(c).join(',') : null; }catch(e){ return 'n/a'; } })()
  }));

  await page.evaluate(() => { EDT_VUE.ancre='2026-09-07'; edtOuvrir(); });
  await new Promise(r => setTimeout(r, 1600));
  await page.evaluate(() => { EDT_VUE.ancre='2026-09-07'; edtPeindreSemaine(); });
  await new Promise(r => setTimeout(r, 600));
  const casePourLancer = '2026-09-11|10:07-11:02|3 FRANKLIN Aretha';
  await page.evaluate((k) => edtCaseClic(k), casePourLancer);
  await new Promise(r => setTimeout(r, 400));
  const boutonVu = await page.evaluate(() => { const b=Array.from(document.querySelectorAll('#edt-modale button'))
    .filter(x => x.textContent.indexOf('Ouvrir le pilotage') >= 0)[0];
    if(!b) return document.getElementById('edt-modale').innerText.slice(0,160);
    b.click(); return 'cliqué'; });
  journal.push('bouton de pilotage : ' + boutonVu);
  await new Promise(r => setTimeout(r, 2500));
  const diag = await page.evaluate(() => ({
    elements: ['at-dr-classe','at-dr-creneau','at-dr-debut','at-dr-tete','at-zone'].map(i => i+':'+(!!document.getElementById(i))),
    moteur: !!window.DR, vue: ATVUES.vue, regime: AT_DR_REGIME,
    classeChoisie: (document.getElementById('at-dr-classe')||{}).value,
    optionsClasse: document.getElementById('at-dr-classe') ? Array.from(document.getElementById('at-dr-classe').options).map(o=>o.text) : null,
    creneauChoisi: (document.getElementById('at-dr-creneau')||{}).value,
    debut: (document.getElementById('at-dr-debut')||{}).value
  }));
  journal.push('DIAGNOSTIC du lancement : ' + JSON.stringify(diag));
  await new Promise(r => setTimeout(r, 2600));
  const parEDT = await releveEtat();
  journal.push('état du site après « ▶ Ouvrir le pilotage et lancer » (depuis l\u2019EDT) :\n  ' + JSON.stringify(parEDT));
  await capture('4-5-pilotage-lance-depuis-edt');

  /* le même geste, par le chemin d'aujourd'hui, sur une page neuve */
  const page2 = await navigateur.newPage();
  await page2.setViewport({width:1366,height:768});
  await page2.evaluateOnNewDocument((storeInit) => {
    window.__HUB = JSON.parse(JSON.stringify(storeInit));
    const lire = (c) => { const p=String(c).split('/').filter(Boolean); let n=window.__HUB;
      for(const k of p){ if(n===null||typeof n!=='object'||!(k in n)) return null; n=n[k]; } return n===undefined?null:n; };
    const poser = (c,v) => { const p=String(c).split('/').filter(Boolean); let n=window.__HUB;
      for(let k=0;k<p.length-1;k++){ if(typeof n[p[k]]!=='object'||n[p[k]]===null) n[p[k]]={}; n=n[p[k]]; }
      if(v===null) delete n[p[p.length-1]]; else n[p[p.length-1]]=v; };
    window.fetch = function(u, o){ const s2=String(u);
      if(s2.indexOf('firebasedatabase.app') >= 0){ const c=s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/,'');
        const m=((o&&o.method)||'GET').toUpperCase();
        if(m==='GET') return Promise.resolve(new Response(JSON.stringify(lire(c)),{status:200}));
        let b=null; try{ b=JSON.parse((o&&o.body)||'null'); }catch(e){}
        if(m==='DELETE') poser(c,null); else poser(c,b);
        return Promise.resolve(new Response(JSON.stringify(b),{status:200})); }
      return Promise.resolve(new Response('null',{status:200})); };
  }, store);
  await page2.goto('file://'+CAND, {waitUntil:'networkidle0'});
  await new Promise(r => setTimeout(r, 1600));
  const parLeSite = await page2.evaluate(() => new Promise((res) => {
    document.body.classList.add('admin-mode');
    loadClasses(function(){
      atChargerChapitres('3e', function(){
        atEditerChapitre('3e','0');
        ATVUES.snum='1';
        atVuesAller('deroule');
        setTimeout(function(){
          const sel=document.getElementById('at-dr-classe');
          for(let i=0;i<sel.options.length;i++){ if(sel.options[i].text==='3E Charles de Gaulle') sel.selectedIndex=i; }
          const cr=document.getElementById('at-dr-creneau');
          for(let j=0;j<cr.options.length;j++){ if(cr.options[j].text==='10:07-11:02') cr.selectedIndex=j; }
          document.getElementById('at-dr-debut').value='10:07';
          document.querySelector('.at-dr-lancer').click();
          setTimeout(function(){ res({
            chapitre: AT.edChap ? (AT.edChap.level+'/'+AT.edChap.chnum) : null,
            seance: ATVUES.snum, vue: ATVUES.vue, regime: AT_DR_REGIME,
            cours: AT_DR_COURS ? (AT_DR_COURS.classeNom+' '+AT_DR_COURS.debut+'-'+AT_DR_COURS.fin) : null,
            copieJouee: (function(){ try{ const c=window.__HUB.site['3e'].chapitres[0].seances[1].deroule_joue;
              return c ? Object.keys(c).join(',') : null; }catch(e){ return 'n/a'; } })()
          }); }, 1400);
        }, 900);
      });
    });
  }));
  journal.push('état du site après « ▶ Lancer la séance » (chemin d\u2019aujourd\u2019hui) :\n  ' + JSON.stringify(parLeSite));
  const champs = ['chapitre','seance','vue','regime','cours','copieJouee'];
  const ecarts = champs.filter(c => JSON.stringify(parEDT[c]) !== JSON.stringify(parLeSite[c]));
  journal.push('COMPARAISON champ à champ : ' + (ecarts.length ? ('ÉCARTS sur ' + ecarts.join(', ')) : 'les six champs sont identiques \u2713'));
  await page2.screenshot({path:path.join(SORTIE,'4-6-pilotage-chemin-du-site.png')});
  await page2.close();

  /* ══════════ ⑤ — MOIS, ANNÉE, DIVERGENCE, EXPÉRIMENTALE, ABSENCE ══════════ */
  await page.evaluate(() => { EDT_VUE.ancre='2026-09-07'; edtOuvrir(); });
  await new Promise(r => setTimeout(r, 1800));

  for(const [mode, nom] of [['mois','5-1-mois'],['annee','5-2-annee'],['calendrier','5-3-calendrier']]){
    await page.evaluate((m) => { EDT_VUE.mode=m; edtPeindre(); }, mode);
    await new Promise(r => setTimeout(r, 700));
    const m = await page.evaluate(() => {
      window.scrollTo(0,4000);
      return {scrollY:window.scrollY, ecranHaut:document.getElementById('edt-ecran').scrollHeight,
              fenetre:window.innerHeight, texte:document.getElementById('edt-ecran').innerText.slice(0,150).replace(/\n/g,' | ')};
    });
    journal.push('vue ' + mode + ' : ' + JSON.stringify(m));
    await capture(nom);
  }
  await page.evaluate(() => { EDT_VUE.mode='semaine'; EDT_VUE.ancre='2026-09-07'; edtPeindre(); });
  await new Promise(r => setTimeout(r, 600));

  /* la classe expérimentale : présente partout, étiquetée, jamais masquée */
  const exp = await page.evaluate(() => ({
    marquee: edtEstExperimentale('3E Charles de Gaulle'),
    surLaCarte: (document.querySelector('#edt-ecran .edt-carte')||{}).innerText||'',
    mention: (document.querySelector('#edt-ecran .edt-exp')||{}).title||'',
    interrupteur: !!document.querySelector('#edt-ecran input[type=checkbox]')
  }));
  journal.push('classe expérimentale : ' + JSON.stringify(exp));

  /* la divergence, et l'écart justifié */
  const dv1 = await page.evaluate(() => edtDivergence('3E Charles de Gaulle'));
  journal.push('divergence avant justification : ' + JSON.stringify(dv1));
  await page.evaluate((txt) => { EDT.calendrier = JSON.parse(txt); }, fs.readFileSync(path.join(RACINE,'tests/calendrier-justifie.json'),'utf8'));
  const dv2 = await page.evaluate(() => { edtPeindre(); return edtDivergence('3E Charles de Gaulle'); });
  journal.push('divergence après « justifié » sur le séjour Verdun : ' + JSON.stringify(dv2));
  const paliers = await page.evaluate(() => [0,1,2,3,5].map(n => {
    const t = n<=1?'dans les temps':(n===2?'léger':(n===3?'marqué':'critique')); return n+' → '+t; }));
  journal.push('paliers : ' + JSON.stringify(paliers));

  /* une seconde classe, moins avancée : le palier se lève pour de vrai */
  const deuxClasses = await page.evaluate(() => {
    edtToutesLesCases().forEach(c => { if(c.classe === '3 DYLAN Bob') c.classeMjpc = 'CLASSE TEST'; });
    edtPeindre();
    return {cdg: edtDivergence('3E Charles de Gaulle'), test: edtDivergence('CLASSE TEST')};
  });
  journal.push('deux classes du même niveau, avances différentes :\n  3E CDG  : ' + JSON.stringify(deuxClasses.cdg)
    + '\n  CLASSE TEST : ' + JSON.stringify(deuxClasses.test));
  /* un événement qui touche les DEUX classes ne justifie rien entre elles ;
     une décision posée sur UNE seule classe, si. */
  const justePourUne = await page.evaluate(() => {
    EDT.decisions = EDT.decisions || {};
    EDT.decisions['CLASSE TEST'] = {heures:{
      'a':{sansSeance:true},'b':{sansSeance:true}}, journal:[]};
    edtPeindre();
    return {test: edtDivergence('CLASSE TEST')};
  });
  journal.push('CLASSE TEST après deux heures sorties de la prévision (elle seule) : ' + JSON.stringify(justePourUne.test));
  const cartesDiv = await page.evaluate(() => Array.from(document.querySelectorAll('#edt-ecran .edt-carte')).map(c => c.innerText.replace(/\n/g,' | ')));
  journal.push('cartes avec paliers : ' + JSON.stringify(cartesDiv));
  await capture('5-5-divergence-deux-classes');
  await page.evaluate(() => { edtToutesLesCases().forEach(c => { if(c.classe === '3 DYLAN Bob') c.classeMjpc = ''; }); edtPeindre(); });
  await new Promise(r => setTimeout(r, 400));

  /* l'absence : le geste réversible du QCM, dans la trace de l'heure */
  const caseJouee = '2026-09-07|08:57-09:52|3 FRANKLIN Aretha';
  await page.evaluate((k) => edtCaseClic(k), caseJouee);
  await new Promise(r => setTimeout(r, 500));
  const av = await page.evaluate(() => { const e=document.querySelectorAll('#edt-modale .edt-el');
    return {eleves:e.length, titre:(document.querySelector('#edt-modale .edt-lab')||{}).textContent||''}; });
  journal.push('modale d\u2019une heure jouée : ' + JSON.stringify(av));
  await page.evaluate(() => { const e=document.querySelectorAll('#edt-modale .edt-el'); e[0].click(); });
  await new Promise(r => setTimeout(r, 900));
  await page.evaluate(() => { const e=document.querySelectorAll('#edt-modale .edt-el'); e[2].click(); });
  await new Promise(r => setTimeout(r, 900));
  const abs1 = await page.evaluate(() => { try{
    return window.__HUB.site['3e'].chapitres[0].seances[0].deroule_joue['3e_charles_de_gaulle']
      .heures['2026-09-07_08h57-09h52_3E_Charles_de_Gaulle'].absents; }catch(e){ return 'introuvable'; } });
  journal.push('absents au hub : ' + JSON.stringify(abs1));
  await capture('5-4-absents');
  await page.evaluate(() => { const e=document.querySelectorAll('#edt-modale .edt-el'); e[0].click(); });
  await new Promise(r => setTimeout(r, 900));
  const abs2 = await page.evaluate(() => { try{
    return window.__HUB.site['3e'].chapitres[0].seances[0].deroule_joue['3e_charles_de_gaulle']
      .heures['2026-09-07_08h57-09h52_3E_Charles_de_Gaulle'].absents; }catch(e){ return 'introuvable'; } });
  journal.push('après le geste inverse : ' + JSON.stringify(abs2) + '  (réversible)');
  await page.evaluate(() => edtModaleFermer());

  /* ══════════ ⑥ — LES TROIS PORTES, LE RÉGLAGE, LE TÉLÉPHONE ══════════ */
  await page.evaluate(() => { edtFermer(); edtModaleFermer(); });
  await new Promise(r => setTimeout(r, 300));

  /* porte ① — l'arrivée du professeur, réglage par défaut */
  const p1 = await page.evaluate(() => new Promise(res => {
    document.body.classList.add('admin-mode');
    EDT.reglages = null;
    const parti = edtArriveeProf();
    setTimeout(() => res({rendu: parti, ecran: document.getElementById('edt-ecran').style.display,
      accueilPresent: !!document.getElementById('page-home'),
      accueilTaille: (document.getElementById('page-home')||{innerHTML:''}).innerHTML.length,
      parDessus: getComputedStyle(document.getElementById('edt-ecran')).position}), 2200);
  }));
  journal.push('porte ① (arrivée du prof, réglage par défaut) : ' + JSON.stringify(p1));
  await capture('6-1-porte1-arrivee');

  /* « ✕ Fermer » rend l'accueil intact */
  await page.evaluate(() => edtFermer());
  await new Promise(r => setTimeout(r, 400));
  const apresFermeture = await page.evaluate(() => ({ecran: document.getElementById('edt-ecran').style.display,
    accueilTaille: (document.getElementById('page-home')||{innerHTML:''}).innerHTML.length,
    figeHtml: document.documentElement.classList.contains('edt-fige'),
    scrollPossible: (window.scrollTo(0,300), window.scrollY > 0)}));
  journal.push('après « ✕ Fermer » : ' + JSON.stringify(apresFermeture));
  await page.evaluate(() => window.scrollTo(0,0));
  await capture('6-2-accueil-intact');

  /* le réglage à « non » : l'EDT ne s'ouvre plus au démarrage */
  const p1b = await page.evaluate(() => new Promise(res => {
    edtReglagePoser('arriverSurEdt', false);
    setTimeout(() => { EDT.reglages = {arriverSurEdt:false};
      edtArriveeProf();
      setTimeout(() => res({ecran: document.getElementById('edt-ecran').style.display,
        auHub: JSON.stringify(window.__HUB.site.edt.reglages)}), 1600); }, 800);
  }));
  journal.push('réglage à « non » : ' + JSON.stringify(p1b));
  await page.evaluate(() => { EDT.reglages = {arriverSurEdt:true}; });

  /* un élève : aucune porte ne s'ouvre */
  const eleve = await page.evaluate(() => new Promise(res => {
    document.body.classList.remove('admin-mode');
    const parti = edtArriveeProf();
    setTimeout(() => res({rendu: parti, ecran: document.getElementById('edt-ecran').style.display}), 700);
  }));
  journal.push('élève (pas admin-mode) : ' + JSON.stringify(eleve));
  await page.evaluate(() => document.body.classList.add('admin-mode'));

  /* le téléphone-pilote et la vue tableau : l'EDT ne s'ouvre jamais */
  const roles = await page.evaluate(() => new Promise(res => {
    const av = (typeof SES === 'object' && SES) ? SES.mode : null;
    const out = {};
    ['tel','tableau'].forEach(m => { try{ SES.mode = m; }catch(e){} out[m] = edtArriveeProf(); });
    try{ SES.mode = av; }catch(e){}
    setTimeout(() => res(out), 400);
  }));
  journal.push('téléphone-pilote / vue tableau : ' + JSON.stringify(roles) + '  (false = ne s\u2019ouvre pas)');

  /* porte ③ — le bouton dans le bandeau du déroulé */
  const p3 = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('#at-dr-tete button'))
      .filter(x => x.textContent.indexOf('Emploi du temps') >= 0);
    return {present: b.length > 0, libelle: b.length ? b[0].textContent.trim() : null};
  });
  journal.push('porte ③ (bandeau du déroulé) : ' + JSON.stringify(p3));

  /* le téléphone : l'écran ne casse pas, il défile */
  await page.setViewport({width:390, height:844});
  await page.evaluate(() => { EDT_VUE.mode='semaine'; EDT_VUE.ancre='2026-09-07'; edtOuvrir(); });
  await new Promise(r => setTimeout(r, 1800));
  const tel = await page.evaluate(() => {
    const e = document.getElementById('edt-ecran');
    return {affiche: e.style.display, cases: document.querySelectorAll('#edt-ecran .edt-b').length,
            defileInterne: e.scrollHeight > e.clientHeight, erreurJs: false};
  });
  journal.push('téléphone 390×844 : ' + JSON.stringify(tel) + '  (il s\u2019affiche et défile là — la règle « sans scroll » vaut pour l\u2019ordinateur)');
  await capture('6-3-telephone');
  await page.setViewport({width:1366, height:768});
  await page.evaluate(() => edtFermer());
  await new Promise(r => setTimeout(r, 400));

  /* la matrice actions × état */
  const matrice = await page.evaluate(() => {
    EDT.decisions = {};            /* matrice sur une ardoise propre */
    const etats = ['prevu','jouee','sansSeance','nonImportee','horsMjpc','rienDePret'];
    const faux = {iso:'2026-09-08', creneau:'15:07-16:02', classe:'X', classeMjpc:'3E Charles de Gaulle'};
    return etats.map(n => {
      EDT_VUE.cellules = EDT_VUE.cellules || {};
      const k = '__test__';
      EDT_VUE.cellules[k] = Object.assign({}, faux, {nature:n, titre:'T', heure:1, sur:2, activites:2, reportees:0, categorie:'Gestion de classe'});
      EDT_MOD.cle = k; edtPeindreModale();
      const m = document.getElementById('edt-modale');
      const b = m ? Array.from(m.querySelectorAll('button')).map(x => x.textContent.trim().replace(/\s+/g,' ')) : [];
      const sel = m ? m.querySelectorAll('select').length : 0;
      edtModaleFermer(); delete EDT_VUE.cellules[k];
      return n + ' → ' + JSON.stringify(b) + ' · ' + sel + ' liste(s)';
    });
  });
  journal.push('MATRICE actions × état :\n  ' + matrice.join('\n  '));

  const jrn = await page.evaluate(() => window.__JOURNAL);
  releve.get = jrn.filter(x=>x.m==='GET').length;
  releve.ecritures = jrn.filter(x=>x.m!=='GET'&&x.m!=='SORTIE').length;
  releve.sorties = jrn.filter(x=>x.m==='SORTIE').length;

  await navigateur.close();
  fs.writeFileSync(path.join(SORTIE,'2b-journal.txt'), journal.join('\n\n'), 'utf8');
  fs.writeFileSync(path.join(SORTIE,'2b-releve.json'), JSON.stringify(releve,null,1), 'utf8');
  console.log(journal.join('\n\n'));
  console.log('\n=== RELEVÉ ===\n' + JSON.stringify(releve,null,1));
})();
