// 59a : les cartes sont éprouvées après les corrections déjà jouées par le banc.
export async function eprouverAvancement({pg,verif,cap,att}) {
  await pg.locator('.sc-passe').nth(0).click();
  await pg.locator('.sc-vig').nth(1).click();
  const k = await pg.evaluate(() => SC.copies[1]);
  const lig = pg.locator('#scLig');
  if (await lig.count() && !(await lig.inputValue())) { await lig.fill('24'); await lig.press('Enter'); }
  await pg.locator('#scZoom').click();
  for(let i=0;i<18;i++) {
    if(await pg.evaluate(k=>SC.passe!==0 || SC.copies[SC.ic]!==k,k))break;
    await pg.keyboard.press('Enter'); await att(90);
  }
  const langue = await pg.evaluate(k=>!!state.copies[k].scan.vu.langue,k);
  await pg.locator('button[onclick="scFermer()"]').click(); await att(1600);
  const carte = nom=>pg.locator('#gridEleves .eleve-card').filter({hasText:nom});
  const texte = nom=>carte(nom).locator('.eleve-statut').innerText();
  const fini = await texte('CHAUVIN Emma'), partiel = await texte('ARNAUD Léa');
  verif('avancement : la copie passée en entier est Corrigé, 100 %, sur sa carte', /Corrigé/.test(fini)&&/100%/.test(fini));
  verif('avancement : langue terminée, deux rubriques sur douze donnent En cours, 17 %', langue&&/En cours/.test(partiel)&&/17%/.test(partiel));
  verif('avancement : une copie encore intacte reste Non commencé, 0 %', /Non commencé/.test(await texte('BRUNEAU Manon'))&&/\b0%/.test(await texte('BRUNEAU Manon')));
  verif('avancement : le compteur de la classe compte la copie corrigée, une sur trente', /1\/30/.test(await pg.locator('#ruSousTitre').innerText()));
  const copies = await pg.evaluate(()=>JSON.stringify(scFb(state.copies)));
  const ecritures = await pg.evaluate(()=>(window.__LOG||[]).length);
  await pg.selectOption('#triSelect','alpha'); await att(800);
  await pg.selectOption('#triSelect','ordre'); await att(1000);
  verif('avancement : lire et retrier les cartes ne change ni copie, marque, réponse, ligne ou note', copies===await pg.evaluate(()=>JSON.stringify(scFb(state.copies))));
  verif('avancement : lire et retrier les cartes ne réécrit aucune copie au faux hub', ecritures===await pg.evaluate(()=>(window.__LOG||[]).length));
  await pg.reload(); await pg.locator('#gridEleves .eleve-card').first().waitFor({state:'visible',timeout:20000}); await att(800);
  const froid = await pg.evaluate(()=>SC.grille===null&&Object.keys(SC.imgs).length===0);
  verif('avancement : après rechargement, 100 % et 17 % sont justes avant d’ouvrir les scans, sans charger les images', froid&&await texte('CHAUVIN Emma')===fini&&await texte('ARNAUD Léa')===partiel&&copies===await pg.evaluate(()=>JSON.stringify(scFb(state.copies))));
  const tailles=[];
  for(const [width,height] of [[1280,720],[1366,768],[1536,864],[1920,1080]]) {
    await pg.setViewportSize({width,height}); await att(150);
    tailles.push(await carte('ARNAUD Léa').locator('.eleve-statut').evaluate(e=>{
      const a=e.children[0].getBoundingClientRect(),b=e.children[1].getBoundingClientRect();
      return a.right<=b.left+1&&b.right<=e.getBoundingClientRect().right+1;
    }));
    await cap('C15-59a-tableau-'+width);
  }
  verif('avancement : statut et pourcentage restent séparés aux quatre tailles de bureau',tailles.every(Boolean));
  await pg.setViewportSize({width:1536,height:864}); await pg.click('#btnScan');
  await pg.locator('#scanEcran').waitFor({state:'visible'}); await att(500);
}
