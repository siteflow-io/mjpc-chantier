// T66 — audit de la conscience n°13 sur p8-5g (protocole du 12/10 : l'écran changé + un voisin, par le geste, sans rejouer le banc unique)
// usage : node T66-audit-p8-5g.mjs <chemin de la maquette>
// A. l'écran changé : « 🖥 Écran 2 » ouvert à 0, 9, 13 dévoilés et à 9 avec la page 2 choisie à la molette → dans la seconde, même compteur et mêmes lignes que le pilote, rien hors du cadre
// B. le voisin : la répétition → Écran 2 → ▶ → « ■ Arrêter » → ce que la fenêtre du tableau montre (trouvaille des relecteurs neufs, à confirmer)
import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve(process.argv[2]);
const D = []; const ok = (c, m) => { if (!c) D.push(m); };
const browser = await chromium.launch();
const lire = ctx => ctx.evaluate(() => { const mur = document.getElementById('mur') || document.querySelector('.mur.tableau'); const mb = mur.getBoundingClientRect(); const c = mur.querySelector('.corpsd'); const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0'); const hors = els.filter(e => { const b = e.getBoundingClientRect(); return b.top < mb.top - 1 || b.bottom > mb.bottom + 1; }); return { page: ((mur.querySelector('.page') || {}).textContent || '').trim(), lignes: els.map(l => l.getAttribute('data-p') || l.textContent.slice(0, 20)), hors: hors.length, police: getComputedStyle(c).fontSize }; });
const preparer = async () => { const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); await page.goto(file); await page.waitForTimeout(500);
  await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
  await page.click('#mur .p8-ecrire'); for (let i = 1; i <= 8; i++) { await page.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 2 }); if (i < 8) await page.keyboard.press('Enter'); }
  await page.keyboard.press('Escape'); await page.waitForTimeout(400); return page; };
const ouvrirTableau = async page => { const [fen] = await Promise.all([page.waitForEvent('popup'), page.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.waitForTimeout(900); return fen; };
const pareil = (p, t) => p.page === t.page && JSON.stringify(p.lignes) === JSON.stringify(t.lignes);

// A — l'écran changé
for (const cas of [{ nDev: 0 }, { nDev: 9 }, { nDev: 13 }, { nDev: 9, molette: true }]) {
  const page = await preparer();
  await page.click('#ong-pilotage'); await page.waitForTimeout(300); await page.click('[data-lancer="1"]'); await page.waitForTimeout(500);
  for (let i = 0; i < cas.nDev; i++) { await page.click('#bdev'); await page.waitForTimeout(60); }
  if (cas.molette) { const mr = await page.$eval('#mur', e => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); await page.mouse.move(mr.x, mr.y); await page.mouse.wheel(0, 300); await page.waitForTimeout(500); }
  await page.waitForTimeout(300);
  const pil = await lire(page); const fen = await ouvrirTableau(page); const t0 = await lire(fen);
  const nom = `A · ouvert à ${cas.nDev} dévoilés${cas.molette ? ', page 2 à la molette' : ''}`;
  ok(pareil(pil, t0) && t0.hors === 0, `${nom} : pilote ${pil.page} ${pil.lignes.length} lignes · tableau ${t0.page} ${t0.lignes.length} lignes, hors ${t0.hors}`);
  if (cas.molette) ok(pil.page.includes('page 2'), `${nom} : la molette a bien choisi la page 2 au pilote (${pil.page})`);
  await page.click('#bdev'); await page.waitForTimeout(500); const p1 = await lire(page), t1 = await lire(fen);
  ok(pareil(p1, t1) && t1.hors === 0, `${nom}, puis un ▶ : pilote ${p1.page} ${p1.lignes.length} · tableau ${t1.page} ${t1.lignes.length}, hors ${t1.hors}`);
  console.log(`${nom} — pilote ${pil.page} (${pil.lignes.length} l.) · tableau à l'ouverture ${t0.page} (${t0.lignes.length} l., police ${t0.police}, hors ${t0.hors}) · après ▶ : pilote ${p1.page} / tableau ${t1.page}`);
  await fen.close(); await page.close();
}

// B — le voisin : la répétition, puis « ■ Arrêter »
{ const page = await preparer();
  await page.click('#at-jouer'); await page.waitForTimeout(500);
  const fen = await ouvrirTableau(page);
  for (let i = 0; i < 10; i++) { await page.click('#bdev'); await page.waitForTimeout(60); } await page.waitForTimeout(400);
  const pr = await lire(page), tr = await lire(fen);
  ok(pareil(pr, tr), `B · répétition, 10 ▶ : pilote ${pr.page} ${pr.lignes.length} · tableau ${tr.page} ${tr.lignes.length}`);
  await page.click('#rep-stop'); await page.waitForTimeout(600);
  const apres = await lire(fen); const ongl = await page.evaluate(() => (document.querySelector('.ong.on, .onglet.on, [id^=ong-].on') || {}).id || '?');
  console.log(`B · répétition : pilote ${pr.page} (${pr.lignes.length} l.) = tableau ${tr.page} (${tr.lignes.length} l.) · après « ■ Arrêter » (onglet ${ongl}) : le tableau montre ${apres.page || 'sans compteur'}, ${apres.lignes.length} lignes visibles ; identique à la répétition : ${pareil(tr, apres)}`);
  ok(!pareil(tr, apres), `B · après « ■ Arrêter », le tableau garde ce qu'il montrait en répétition (${apres.page}, ${apres.lignes.length} ligne(s) dévoilée(s) en répétition encore visible(s) : ${apres.lignes.join(' ')}) alors que l'atelier l'a oublié`);
  await fen.close(); await page.close(); }

console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await browser.close();
