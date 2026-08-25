/* CLICS RÉELS — on ne fabrique aucun état : on appuie sur ce que le professeur
   voit. Chaque geste est journalisé avec ce qu'il a trouvé. */
export const attendre = ms => new Promise(r=>setTimeout(r,ms));

export async function cliquerSel(page, sel, pause){
  await page.waitForSelector(sel, {visible:true, timeout:8000});
  await page.click(sel);
  await attendre(pause||500);
  return sel;
}

/* clique le premier élément visible dont le texte contient `txt` */
export async function cliquerTexte(page, sel, txt, pause){
  const trouve = await page.evaluate((sel, txt)=>{
    const vis = el => { const r = el.getBoundingClientRect();
      return r.width>0 && r.height>0 && getComputedStyle(el).visibility!=='hidden'; };
    const cible = [].slice.call(document.querySelectorAll(sel))
      .filter(vis).filter(el => (el.textContent||'').indexOf(txt) >= 0)[0];
    if(!cible) return null;
    cible.setAttribute('data-banc-cible','1');
    return (cible.textContent||'').trim().slice(0,50);
  }, sel, txt);
  if(!trouve) throw new Error('geste impossible : rien de visible ne porte « '+txt+' » ('+sel+')');
  await page.click('[data-banc-cible="1"]');
  await page.evaluate(()=>{ const e=document.querySelector('[data-banc-cible="1"]');
    if(e) e.removeAttribute('data-banc-cible'); });
  await attendre(pause||500);
  return trouve;
}

/* l'état du déroulé vu d'une page, quel que soit son rôle */
export async function etatDeroule(page){
  return page.evaluate(()=>{
    const cadre = document.getElementById('at-dr-iframe');
    const W = cadre && cadre.contentWindow;
    if(!W || !W.ECRANS) return {absent:true};
    const e = W.ECRANS[W.i];
    return {
      nbEcrans: W.ECRANS.length,
      i: W.i,
      act: e ? String(e.act||'').slice(0,44) : null,
      suite: e ? (e.suite||0) : null,
      grp: e ? (e.grp||null) : null,
      rev: e ? (e.rev===undefined?null:e.rev) : null,
      vues: e ? (e.blocs||[]).map(b=>b.vues|0) : null,
      eids: W.ECRANS.map(x => x.suite ? ('suite'+x.suite) : (x.eid||'AUCUN')),
      gele: !!W.gele
    };
  });
}

/* ce que la CLASSE voit réellement : le contenu peint dans la toile du tableau */
export async function toileTableau(page){
  return page.evaluate(()=>{
    const t = document.getElementById('ses-tab-toile');
    const d = t && t.contentDocument;
    if(!d || !d.body) return {absent:true};
    const act = d.querySelector('.act');
    return {
      act: act ? act.textContent.trim().slice(0,44) : null,
      signes: (d.body.textContent||'').replace(/\s+/g,' ').trim().length,
      texte: (d.body.textContent||'').replace(/\s+/g,' ').trim().slice(0,150),
      attente: (document.getElementById('ses-tab-att')||{}).style
               ? document.getElementById('ses-tab-att').style.display : '?'
    };
  });
}
