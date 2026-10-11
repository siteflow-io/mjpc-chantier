// T34 — les boutons de la barre sous la diapo, un par un, PAR LE GESTE (clic, sélection, glisser), heure lancée.
import { chromium } from 'playwright';
import path from 'path';

const file = 'file://' + path.resolve('../LIVRAISONS/DEROULE/p8-5c/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const erreurs = [];
page.on('pageerror', e => erreurs.push(e.message));
const R = [];
const dire = (nom, ok, detail) => { R.push({ nom, ok, detail }); console.log((ok ? 'ça va      ' : 'ÇA NE VA PAS') + ' · ' + nom + (detail ? ' — ' + detail : '')); };

await page.goto(file);
await page.waitForTimeout(500);
await page.click('[data-lancer="1"]');
await page.waitForTimeout(400);

// ▶ Dévoiler ×3, ◀ ×1
for (let i = 0; i < 3; i++) { await page.click('#bdev'); await page.waitForTimeout(120); }
let compte = await page.textContent('#compte');
dire('▶ Dévoiler (trois clics)', /^3 \/ 6/.test(compte.trim()), compte.trim());
await page.click('#bprec'); await page.waitForTimeout(120);
compte = await page.textContent('#compte');
dire('◀ (un clic)', /^2 \/ 6/.test(compte.trim()), compte.trim());
await page.click('#bdev'); await page.waitForTimeout(120); // on revient à 3 / 6

// ✦ mettre en lumière : clic sur l'outil, puis sur l'étape 1
await page.click('#blum');
const lumArme = await page.$eval('#blum', b => b.classList.contains('on'));
await page.click('#mur li[data-k="0"]');
await page.waitForTimeout(150);
const spot = await page.$$eval('#mur .spot-on', l => l.length);
const lumRepose = await page.$eval('#blum', b => !b.classList.contains('on'));
dire('✦ Mettre en lumière', lumArme && spot === 1 && lumRepose, `armé=${lumArme}, éléments allumés=${spot}, outil reposé=${lumRepose}`);

// ✍ à écrire : clic sur l'outil, puis sur l'étape 2
await page.click('#becr');
await page.click('#mur li[data-k="1"]');
await page.waitForTimeout(150);
const aecrire = await page.$$eval('#mur li.aecrire', l => l.map(x => x.dataset.k));
dire('✍ À écrire', aecrire.length === 1 && aecrire[0] === '1', `marqués=${JSON.stringify(aecrire)}`);
await page.click('#becr'); // on repose l'outil (il reste armé après usage, par conception)
await page.keyboard.press('Escape');

// ⊞ toutes les diapos
await page.click('#btoutes');
await page.waitForTimeout(200);
const toutesOn = await page.$eval('#vtoutes', v => v.classList.contains('on'));
const nVig = await page.$$eval('#vtoutes .vig', l => l.length);
const nDiapos = await page.evaluate(() => seance().ecrans.length);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
const toutesOff = await page.$eval('#vtoutes', v => !v.classList.contains('on'));
dire('⊞ Toutes les diapos', toutesOn && nVig === nDiapos && toutesOff, `ouvert=${toutesOn}, vignettes=${nVig}/${nDiapos}, Échap ferme=${toutesOff}`);

// Surlignage : sélection à la souris d'un mot de l'étape 1, puis clic sur chaque couleur, puis ✕
const selectionner = async () => {
  await page.evaluate(() => {
    const li = document.querySelector('#mur li[data-k="0"]');
    const tn = Array.from(li.childNodes).find(n => n.nodeType === 3 && n.textContent.trim().length > 8) || li.firstChild;
    const r = document.createRange(); r.setStart(tn, 2); r.setEnd(tn, 12);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  });
};
const COUL = { jaune: '#ffe94a', vert: '#b6f0c2', rose: '#ffc9d6', bleu: '#bcd9ff' };
for (const c of Object.keys(COUL)) {
  await selectionner();
  await page.click('#bsurl'); await page.click(`#pal-surl .p8-p[data-c="${c}"]`);
  await page.waitForTimeout(150);
  const marks = await page.$$eval('#mur li[data-k="0"] mark', l => l.map(m => m.style.background));
  const hx = COUL[c]; const attendu = `rgb(${parseInt(hx.slice(1,3),16)}, ${parseInt(hx.slice(3,5),16)}, ${parseInt(hx.slice(5,7),16)})`;
  const ok = marks.length >= 1 && marks.some(m => m === attendu || m.replace(/\s/g,'').toLowerCase() === hx);
  dire(`Surligner en ${c}`, ok, `marques=${JSON.stringify(marks)}`);
  // retirer : resélectionner la marque et ✕
  await page.evaluate(() => { const m = document.querySelector('#mur li[data-k="0"] mark'); if (!m) return; const r = document.createRange(); r.selectNodeContents(m); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
  await page.click('#bsurl'); await page.click('#pal-surl .p8-aucune');
  await page.waitForTimeout(150);
  const reste = await page.$$eval('#mur li[data-k="0"] mark', l => l.length);
  dire(`✕ retirer le surlignage ${c}`, reste === 0, `marques restantes=${reste}`);
}

// 🔍 loupe : armer, tracer un cadre à la souris, puis second clic
await page.click('#bloupe');
const loupeArmee = await page.$eval('#bloupe', b => b.classList.contains('on'));
const mr = await page.$eval('#mur', m => { const r = m.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
await page.mouse.move(mr.x + mr.w * 0.2, mr.y + mr.h * 0.2);
await page.mouse.down();
await page.mouse.move(mr.x + mr.w * 0.4, mr.y + mr.h * 0.4, { steps: 6 });
const cadreVisible = await page.$eval('#cadre-loupe', c => c.style.display === 'block');
await page.mouse.move(mr.x + mr.w * 0.6, mr.y + mr.h * 0.6, { steps: 6 });
await page.mouse.up();
await page.waitForTimeout(200);
const zoom = await page.$$eval('#mur *', l => l.some(x => /scale\(/.test(x.style.transform)));
await page.click('#bloupe');
await page.waitForTimeout(200);
const dezoom = await page.$$eval('#mur *', l => !l.some(x => /scale\(/.test(x.style.transform)));
dire('🔍 Loupe', loupeArmee && cadreVisible && zoom && dezoom, `armée=${loupeArmee}, cadre pendant le tracé=${cadreVisible}, zone agrandie=${zoom}, second clic remet la diapo=${dezoom}`);

// ❄ gel
await page.click('#bgel'); await page.waitForTimeout(150);
const gelOn = await page.evaluate(() => document.body.classList.contains('gel') && document.getElementById('bgel').classList.contains('gelon'));
await page.click('#bgel'); await page.waitForTimeout(150);
const gelOff = await page.evaluate(() => !document.body.classList.contains('gel'));
dire('❄ Gel', gelOn && gelOff, `gel=${gelOn}, dégel=${gelOff}`);

// 👥 qui a participé
await page.click('#bqui'); await page.waitForTimeout(150);
const quiOn = await page.$$eval('#mur .quiw.on', l => l.length === 1);
await page.click('#bqui'); await page.waitForTimeout(150);
const quiOff = await page.$$eval('#mur .quiw', l => l.length === 0);
dire('👥 Qui a participé', quiOn && quiOff, `affiché=${quiOn}, retiré=${quiOff}`);

// ⋯ menu, puis « Chrono au tableau »
await page.click('#bplus'); await page.waitForTimeout(150);
const menuOn = await page.$eval('#menuplus', m => m.classList.contains('on'));
const items = await page.$$eval('#menuplus [data-a]', l => l.map(x => x.dataset.a));
await page.click('#menuplus [data-a="chrono"]'); await page.waitForTimeout(150);
const bandeauOn = await page.$eval('#mur', m => m.classList.contains('avec-bandeau'));
await page.click('#bplus'); await page.click('#menuplus [data-a="chrono"]'); await page.waitForTimeout(150);
const bandeauOff = await page.$eval('#mur', m => !m.classList.contains('avec-bandeau'));
dire('⋯ Menu + Chrono au tableau', menuOn && items.length >= 5 && bandeauOn && bandeauOff, `menu=${menuOn}, entrées=${items.join(',')}, chrono posé=${bandeauOn}, retiré=${bandeauOff}`);

// texte au tableau (le curseur) — sur la diapo 1 (pleine), la police est déjà au plancher : le curseur ne peut rien y changer (règle « jamais sous 26 pt, sinon pages ») ; on mesure sur une diapo courte, la 8, atteinte par sa vignette
await page.click('#volet .vig[data-i="7"]'); await page.waitForTimeout(250);
const gardeOuverte = await page.$eval('#garde', g => g.classList.contains('on'));
if (gardeOuverte) { await page.click('#garde-devant'); await page.waitForTimeout(250); } /* la garde « La classe te suivrait » : attendue en classe ; on y va devant la classe */
const act8 = await page.evaluate(() => ecran().act);
const fs0 = await page.$eval('#mur .corpsd', c => getComputedStyle(c).fontSize);
const l0 = await page.textContent('#taille-l');
await page.locator('#taille').fill('3'); await page.waitForTimeout(200);
const fs3 = await page.$eval('#mur .corpsd', c => getComputedStyle(c).fontSize);
const pages3 = await page.$eval('#mur .page', p => p.textContent.trim()).catch(() => '');
const l3 = await page.textContent('#taille-l');
await page.locator('#taille').fill('1'); await page.waitForTimeout(200);
dire('Texte au tableau (curseur)', parseFloat(fs3) > parseFloat(fs0) && l3 !== l0, `diapo 8 « ${act8} » : ${l0} ${fs0} → ${l3} ${fs3}${pages3 ? ' (en pages : ' + pages3 + ')' : ''}`);
await page.click('#volet .vig[data-i="0"]'); await page.waitForTimeout(250);
if (await page.$eval('#garde', g => g.classList.contains('on'))) { await page.click('#garde-devant'); await page.waitForTimeout(250); }
dire('Garde « La classe te suivrait » au changement de diapo', gardeOuverte, `ouverte=${gardeOuverte}`);

// Les mêmes couleurs sur le panneau « Notes pour cette diapo » (ce que Paul demande) : aujourd'hui ?
await page.evaluate(() => { const d = document.getElementById('notesd'); d.textContent = 'Note de présentateur pour le banc'; const r = document.createRange(); r.setStart(d.firstChild, 0); r.setEnd(d.firstChild, 4); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
await page.click('#bsurl'); await page.click('#pal-surl .p8-p[data-c="jaune"]'); await page.waitForTimeout(150);
const markNotes = await page.$$eval('#notesd mark', l => l.length);
const dern = await page.textContent('#dern').catch(() => '');
dire('Surligner dans « Notes pour cette diapo » (p8-5c)', markNotes > 0, `marques dans les notes=${markNotes}, message=« ${dern.trim()} »`);

await page.screenshot({ path: 'T45-fin.png' });
console.log('\nerreurs JS de la page :', erreurs.length ? erreurs : 'aucune');
console.log('bilan : ' + R.filter(r => r.ok).length + ' ça va, ' + R.filter(r => !r.ok).length + ' ça ne va pas, sur ' + R.length);
await browser.close();
