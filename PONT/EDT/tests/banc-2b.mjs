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
const CAND = path.join(RACINE, 'candidat-8.71.0.html');
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
    document.querySelectorAll('button').forEach(b => { if(/^\s*Compris\s*$/.test(b.textContent)){ b.click(); n++; } });
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
  const app = await page.evaluate(() => window.__HUB.site.edt.grille['2026-2027'].creneaux.filter(c=>c.classe==='3 FRANKLIN Aretha').map(c=>c.classeMjpc));
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

  await page.evaluate(() => edtFermer());
  await new Promise(r => setTimeout(r, 300));
  const ferme = await page.evaluate(() => document.getElementById('edt-ecran').style.display);
  journal.push('après « Fermer l\u2019emploi du temps » : display=' + ferme + ' (l\u2019accueil est intact derrière)');

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
