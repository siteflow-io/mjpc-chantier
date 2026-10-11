// T45 — audit de la conscience sur la maquette livrée p8-5c : par le geste, indépendant du banc de l'exécutant
import { chromium } from 'playwright';
import path from 'path';
const file = 'file://' + path.resolve('../LIVRAISONS/DEROULE/p8-5c/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch();
const R = []; const dire = (n, ok, d) => { R.push(ok); console.log((ok ? 'ça va      ' : 'ÇA NE VA PAS') + ' · ' + n + (d ? ' — ' + d : '')); };

for (const W of [1280, 1920]) {
  const page = await browser.newPage({ viewport: { width: W, height: 800 } });
  const err = []; page.on('pageerror', e => err.push(e.message));
  await page.goto(file); await page.waitForTimeout(500);
  await page.click('[data-atelier]'); await page.waitForTimeout(250);
  const fixesAvant = await page.$$eval('body *', l => l.filter(x => getComputedStyle(x).position === 'fixed').length);
  await page.click('#at-jouer'); await page.waitForTimeout(400);
  const fixesPendant = await page.$$eval('body *', l => l.filter(x => getComputedStyle(x).position === 'fixed').length);
  const centre = async id => page.$eval('#' + id, b => { const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { visible: r.width > 0, lui: !!(e && (e === b || b.contains(e))) }; });
  const t = await centre('btableau'), e2 = await centre('bvideoproj'), st = await centre('rep-stop');
  const finCache = await page.$eval('#bfin', b => b.getBoundingClientRect().width === 0);
  const deborde = await page.$eval('.haut', h => h.scrollWidth > h.clientWidth + 1);
  const prefixe = await page.$eval('.haut', h => h.textContent.includes('RÉPÉTITION ·'));
  await page.click('#btableau'); await page.waitForTimeout(200);
  const vueBascule = await page.evaluate(() => !!S.vueTableau);
  await page.click('#rep-stop'); await page.waitForTimeout(300);
  const finRevenu = await page.$eval('#bfin', b => b.getBoundingClientRect().width > 0);
  const fixesApres = await page.$$eval('body *', l => l.filter(x => getComputedStyle(x).position === 'fixed').length);
  dire(`Répétition à ${W} px`, fixesAvant === fixesPendant && fixesPendant === fixesApres && t.visible && t.lui && e2.visible && e2.lui && st.visible && st.lui && finCache && !deborde && prefixe && vueBascule && finRevenu && !err.length,
    `fixes ${fixesAvant}/${fixesPendant}/${fixesApres} · Tableau ${t.lui} · Écran 2 ${e2.lui} · Arrêter ${st.lui} · Fin cachée ${finCache} · déborde ${deborde} · préfixe ${prefixe} · Tableau bascule ${vueBascule} · Fin revenue ${finRevenu} · erreurs ${err.length}`);
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const err = []; page.on('pageerror', e => err.push(e.message));
await page.goto(file); await page.waitForTimeout(500);

// Atelier : écrire deux paragraphes accrochés (étape 1, étape 3), par le geste
await page.click('[data-atelier]'); await page.waitForTimeout(300);
const ecrire = async (k, texte) => {
  await page.click(`#mur li[data-k="${k}"]`); await page.waitForTimeout(100);
  const p = await page.$$('#notesd [contenteditable]'); await p[p.length - 1].click(); await page.keyboard.press('End');
  await page.keyboard.press('Enter'); await page.keyboard.type(texte); await page.waitForTimeout(150);
};
await ecrire(0, 'Note pour la première étape.');
await ecrire(2, 'Note pour la troisième étape.');
await page.keyboard.press('Escape'); await page.waitForTimeout(3500); // « ✔ enregistré »
const notes = await page.evaluate(() => (DATA.notes[cle()] || []).map(n => n.p + ' | ' + n.html.replace(/<[^>]+>/g, '').slice(0, 30)));
dire('Atelier : deux paragraphes écrits et accrochés', notes.some(n => n.startsWith('0.0 |')) && notes.some(n => n.startsWith('0.2 |')), JSON.stringify(notes));

// Classe : lancer l'heure, ▶ ×3 → le vif est le paragraphe de l'étape 3
await page.click('#ong-pilotage'); await page.waitForTimeout(300);
await page.click('[data-lancer="1"]'); await page.waitForTimeout(400);
const vifDe = () => page.$$eval('#notesd > *', l => l.map(x => ({ vif: /vif/.test(x.className), fait: /fait/.test(x.className), rep: (x.querySelector('button, .k, [class*=rep]') || {}).textContent || '' })));
let v0 = await vifDe();
for (let i = 0; i < 3; i++) { await page.click('#bdev'); await page.waitForTimeout(150); }
let v3 = await vifDe();
await page.click('#bprec'); await page.waitForTimeout(150);
let v2 = await vifDe();
const iVif3 = v3.findIndex(x => x.vif), iVif2 = v2.findIndex(x => x.vif);
dire('Classe : ▶ ×3 → vif = étape 3 ; ◀ → vif = étape 1', iVif3 >= 0 && /3/.test(v3[iVif3].rep.trim()) && v3.slice(0, iVif3).every(x => x.fait) && iVif2 >= 0 && /1/.test(v2[iVif2].rep.trim()), `à 0 : ${JSON.stringify(v0.map(x => x.rep.trim() + (x.vif ? '*' : '')))} · à 3 : ${JSON.stringify(v3.map(x => x.rep.trim() + (x.vif ? '*' : '')))} · à 2 : ${JSON.stringify(v2.map(x => x.rep.trim() + (x.vif ? '*' : '')))}`);
const journalNotes = await page.evaluate(() => J.filter(x => /note/.test(x.type)).length);
dire('Classe : aucune entrée de journal pour les notes', journalNotes === 0, `entrées=${journalNotes}`);

// Notes, mise en forme par le geste : double-clic sur un mot du paragraphe de l'étape 1, « ab » vert
const para = (await page.$$('#notesd [contenteditable]'))[iVif2];
const box = await para.boundingBox();
await page.mouse.dblclick(box.x + 40, box.y + box.height / 2); await page.waitForTimeout(100);
const selTxt = await page.evaluate(() => String(window.getSelection()));
await page.click('#bsurl'); await page.click('#pal-surl .p8-p[data-c="vert"]'); await page.waitForTimeout(200);
const markNotes = await page.$$eval('#notesd mark', l => l.map(m => m.dataset.coul));
const murMarks = await page.$$eval('#mur mark', l => l.length);
const journalApres = await page.evaluate(() => J.filter(x => /surligne|couleur/.test(x.type)).length);
dire('Notes : « ab » vert sur un mot sélectionné à la souris', selTxt.trim().length > 0 && markNotes.includes('vert') && murMarks === 0 && journalApres === 0, `sélection « ${selTxt.trim()} » · marques notes=${JSON.stringify(markNotes)} · mur=${murMarks} · journal=${journalApres}`);
// « A » bleu sur le même mot, puis ✕ ✕
await page.mouse.dblclick(box.x + 40, box.y + box.height / 2); await page.click('#btxt'); await page.click('#pal-txt .p8-p[data-c="bleu"]'); await page.waitForTimeout(200);
const spanNotes = await page.$$eval('#notesd span[data-coul]', l => l.map(s => s.dataset.coul + ':' + getComputedStyle(s).color));
dire('Notes : « A » bleu, teinte claire', spanNotes.some(s => s.startsWith('bleu:')) && spanNotes.some(s => /138, 184, 255/.test(s)), JSON.stringify(spanNotes));
await page.mouse.dblclick(box.x + 40, box.y + box.height / 2); await page.click('#bsurl'); await page.click('#pal-surl .p8-aucune'); await page.waitForTimeout(150);
await page.mouse.dblclick(box.x + 40, box.y + box.height / 2); await page.click('#btxt'); await page.click('#pal-txt .p8-aucune'); await page.waitForTimeout(150);
const nu = await page.$$eval('#notesd', l => l[0].querySelectorAll('mark, span[data-coul]').length);
dire('Notes : ✕ retire les deux', nu === 0, `restantes=${nu}`);

// Tableau : « A » rouge sur l'étape 2, teinte foncée, journal, et la palette se ferme ; Échap ferme une palette ouverte
await page.evaluate(() => { const li = document.querySelector('#mur li[data-k="1"]'); const tn = Array.from(li.childNodes).find(n => n.nodeType === 3 && n.textContent.trim().length > 8); const r = document.createRange(); r.setStart(tn, 2); r.setEnd(tn, 10); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
await page.click('#btxt');
const palOuverte = await page.$eval('#pal-txt', p => getComputedStyle(p).display !== 'none' && p.getBoundingClientRect().height > 0);
await page.click('#pal-txt .p8-p[data-c="rouge"]'); await page.waitForTimeout(250);
const palFermee = await page.$eval('#pal-txt', p => getComputedStyle(p).display === 'none' || p.getBoundingClientRect().height === 0);
const spanMur = await page.$$eval('#mur li[data-k="1"] span[data-coul], #mur li[data-k="1"] .p8-ct', l => l.map(s => getComputedStyle(s).color));
const jCT = await page.evaluate(() => J.filter(x => x.type === 'couleur-texte').length);
dire('Tableau : « A » rouge → teinte foncée, journal, palette fermée', palOuverte && palFermee && spanMur.some(c => /192, 57, 43/.test(c)) && jCT === 1, `palette ouverte ${palOuverte} → fermée ${palFermee} · couleur ${JSON.stringify(spanMur)} · journal couleur-texte=${jCT}`);
await page.click('#bsurl'); await page.keyboard.press('Escape'); await page.waitForTimeout(150);
const palSurlFermee = await page.$eval('#pal-surl', p => getComputedStyle(p).display === 'none' || p.getBoundingClientRect().height === 0);
dire('Palette : Échap ferme', palSurlFermee);

// Répétition : lecture seule des notes
await page.click('#ong-atelier'); await page.waitForTimeout(300); await page.click('#at-jouer'); await page.waitForTimeout(400);
const editables = await page.$$eval('#notesd [contenteditable="true"], #notesd [contenteditable="plaintext-only"]', l => l.length);
dire('Répétition : notes en lecture seule', editables === 0, `éditables=${editables}`);
await page.screenshot({ path: 'T45-repetition-notes.png' });
console.log('erreurs JS :', err.length ? err : 'aucune');
console.log('bilan : ' + R.filter(Boolean).length + ' ça va, ' + R.filter(x => !x).length + ' ça ne va pas, sur ' + R.length);
await browser.close();
