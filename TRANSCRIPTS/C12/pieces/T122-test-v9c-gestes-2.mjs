import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const F = 'file:///home/claude/C12/maquette-v9c2-courante.html';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1875, height: 868 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });

const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
const menuA = async (sel, btn, txt) => { await page.click(sel, { button: btn || 'right' }); await p(120); const b = page.locator('#menu .it', { hasText: txt }); if (await b.count() === 0) { D.push('entrée de menu absente : ' + txt); await page.keyboard.press('Escape'); return false; } await b.first().click(); await p(200); return true; };
await page.goto(F); await p(500);
// 1. l'appel dans la liste : absent, arrivée, parti, revenu ; un absent n'est pas proposé
await menuA('#liste div:nth-child(1)', 'right', 'Absent'); ok(await ev(() => document.querySelector('#liste div:nth-child(1)').classList.contains('abs')), 'l\'absent n\'est pas grisé');
const nom1 = await ev(() => document.querySelector('#liste div:nth-child(1)').dataset.e); await page.fill('#vif', nom1.split(' ').slice(1).join(' ').slice(0, 3)); await p(100);
ok(!(await ev(() => document.getElementById('cand').textContent)).includes(nom1.split(' ')[1]), 'un absent est proposé dans les initiales'); await page.fill('#vif', '');
await menuA('#liste div:nth-child(2)', 'right', 'Parti à'); await page.keyboard.type('infirmerie'); await page.keyboard.press('Enter'); await p(150); ok(await ev(() => document.querySelector('#liste div:nth-child(2)').classList.contains('parti')), 'le parti n\'est pas marqué');
await menuA('#liste div:nth-child(2)', 'right', 'Revenu'); await page.keyboard.press('Enter'); await p(150); ok(!(await ev(() => document.querySelector('#liste div:nth-child(2)').classList.contains('parti'))), 'le revenu reste parti');
console.log('appel :', await ev(() => J.filter(x => x.type === 'appel').map(x => x.eleve.split(' ')[1] + ':' + x.quoi).join(' ')), '| présents :', await ev(() => document.getElementById('presents').textContent));
// 2. dévoiler, prise de parole, note, commentaire, pastille
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
await page.fill('#vif', 'ze'); await p(100); await page.click('.motifs [data-m="2"]'); await p(100); ok((await ev(() => S.parts.length)) === 1, 'la prise de parole n\'est pas posée');
await page.keyboard.press('Escape'); await page.keyboard.press('n'); await p(100); await page.keyboard.type('Line a dit le sublime sans le mot.'); await page.keyboard.press('Enter'); await p(100);
await page.click('#fnotes [data-v="0"]'); await p(100); ok(await ev(() => S.notesFil[0].versee), 'la note n\'est pas versée'); await page.keyboard.press('Escape');
await menuA('#mur h2', 'right', 'Commenter'); await page.keyboard.type('Trop long : couper en deux l\'an prochain.'); await page.keyboard.press('Enter'); await p(150);
ok((await ev(() => document.getElementById('pastille').textContent)) === '💬 1', 'la pastille n\'affiche pas le commentaire'); await page.keyboard.press('Escape');
ok(await ev(() => document.querySelector('#volet .vig.cour .past') && document.querySelector('#volet .vig.cour .past').textContent === '💬1'), 'la vignette n\'a pas la pastille');
// 3. clic droit sur une ligne : lumière ; sur une diapo du volet : retirer (bilan grisé)
await menuA('#mur li[data-k="0"]', 'right', 'Mettre en lumière'); ok(await ev(() => document.querySelector('#mur li[data-k="0"]').classList.contains('lum')), 'la lumière n\'est pas posée par le clic droit');
await page.click('#volet .vig[data-i="18"]', { button: 'right' }); await p(120); const bilanOff = await ev(() => { const b = Array.from(document.querySelectorAll('#menu .it')).find(x => /Retirer/.test(x.textContent)); return b && b.disabled; }); ok(bilanOff, 'retirer n\'est pas grisé sur le bilan'); await page.keyboard.press('Escape');
await menuA('#volet .vig[data-i="9"]', 'right', 'en réserve'); ok(await ev(() => decisionDe(DATA.seances[0].ecrans[9]) && decisionDe(DATA.seances[0].ecrans[9]).choix === 'reserve'), 'l\'activité 3 n\'est pas en réserve');
ok(await ev(() => document.querySelector('#volet .vig[data-i="9"]').classList.contains('retiree')), 'la vignette retirée n\'est pas marquée');
// 4. la réserve en encart au tableau
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(500);
await page.click('#bplus'); await p(100); await page.click('#menuplus [data-a="reserve"]'); await p(150); await page.click('#freserve [data-enc]'); await p(300);
ok(/pour ceux qui ont fini/i.test(await tab.evaluate(() => (document.body.innerText||''))), 'l\'encart de réserve n\'est pas au tableau'); ok(await ev(() => J.some(x => x.type === 'reserve-affichee')), 'la réserve affichée n\'est pas au journal');
await page.screenshot({ path: 'vis/v9b-01-reserve-pilote.png' }); await tab.screenshot({ path: 'vis/v9b-01-reserve-mur.png' }); await page.keyboard.press('Escape');
// 5. les documents : projeter, tourner les pages, fermer
await page.click('#bplus'); await p(100); await page.click('#menuplus [data-a="docs"]'); await p(150); await page.click('#fdocs [data-doc="doc-methode"]'); await p(300); await page.click('#fdocs-x');
ok((await tab.evaluate(() => (document.body.innerText||''))).includes('page 1 / 3'), 'le document n\'est pas au tableau'); await page.keyboard.press('ArrowRight'); await p(200);
ok((await tab.evaluate(() => (document.body.innerText||''))).includes('page 2 / 3'), 'la page du document n\'a pas tourné'); await tab.screenshot({ path: 'vis/v9b-02-document-mur.png' });
await page.keyboard.press('Escape'); await p(200); ok(!(await tab.evaluate(() => (document.body.innerText||''))).includes('page 2 / 3'), 'le document ne s\'est pas fermé');
console.log('journal documents :', await ev(() => J.filter(x => /document/.test(x.type)).map(x => x.type).join(' ')));
// 6. la notion imprévue
await menuA('#mur h2', 'right', 'notion imprévue'); await page.fill('#fnotion-t', 'registre'); await p(150); const nRes = await ev(() => document.querySelectorAll('#fnotion-l [data-n]').length); ok(nRes > 0, 'aucune notion trouvée pour « registre »');
if (nRes) { await page.click('#fnotion-l [data-n]'); await p(100); ok(await ev(() => Object.keys(S.notionsImprevues).length === 1), 'la notion imprévue n\'est pas déclarée'); } await page.keyboard.press('Escape');
// 7. la légende de surlignage au tableau (diapo 10) ; la vidéo : garde en approche, passage automatique
await page.click('#volet .vig[data-i="9"]'); await p(120); await page.click('#garde-devant'); await p(300);
ok((await tab.evaluate(() => (document.body.innerText||''))).includes('jaune = à retenir'), 'la légende de surlignage n\'est pas au tableau'); await tab.screenshot({ path: 'vis/v9b-03-legende-mur.png' });
await page.click('#bsimu'); await page.selectOption('#s-cle', 'aucune'); await page.click('#fsimu-x'); await p(100);
await page.click('#volet .vig[data-i="16"]'); await p(120); await page.click('#garde-devant'); await p(300);
console.log('en approche :', await ev(() => document.getElementById('alerte-video').textContent.slice(0, 120)));
ok((await ev(() => document.getElementById('alerte-video').textContent)).includes('diapo suivante a une vidéo'), 'pas d\'alerte en approche de la vidéo');
await page.click('#volet .vig[data-i="17"]'); await p(120); await page.click('#garde-devant'); await p(300); console.log('à la vidéo :', await ev(() => document.getElementById('alerte-video').textContent.slice(0, 140)));
ok((await ev(() => document.getElementById('alerte-video').textContent)).includes('passée : pas de clé USB branchée'), 'pas d\'annonce de passage');
await p(2000); console.log('après le passage automatique : diapo', await ev(() => document.getElementById('numero').textContent), '|', await ev(() => J.filter(x => x.type === 'video-passee').length), 'passage(s) au journal');
ok((await ev(() => S.di)) === 18, 'la vidéo n\'est pas passée toute seule');
// 8. clé sur l'ordi portable, fenêtre : la vidéo se lit par repères
await page.click('#bsimu'); await page.selectOption('#s-cle', 'portable'); await page.click('#fsimu-x'); await p(100);
await page.click('#volet .vig[data-i="17"]'); await p(120); await page.click('#garde-devant'); await p(300); await page.keyboard.press('ArrowRight'); await p(200);
console.log('vidéo :', await ev(() => document.getElementById('mur').querySelector('.video .lb').textContent)); ok((await ev(() => S.videoPos['e-video-radeau'])) === 80, 'la vidéo n\'a pas avancé jusqu\'au repère « la composition »');
ok((await tab.evaluate(() => (document.body.innerText||''))).includes('1:20'), 'le tableau ne montre pas la vidéo au repère'); await tab.screenshot({ path: 'vis/v9b-04-video-mur.png' });
// 9. T-5 : les vignettes, la décision par défaut, le débordement, le travail à faire, le texte ED
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
await page.click('#bsimu'); await page.click('#s-t5'); await p(500);
const nCartes = await ev(() => document.querySelectorAll('#fin .carte').length); console.log('T-5 : cartes', nCartes, '| débordement :', await ev(() => document.getElementById('f-debord').textContent));
ok(nCartes >= 1, 'pas de cartes au T-5'); ok(await ev(() => document.querySelectorAll('#fin .carte .mini .mur .etiq').length === document.querySelectorAll('#fin .carte .mini').length && document.querySelectorAll('#fin .carte .mini').length > 0), 'les vignettes ne sont pas rendues');
ok(await ev(() => Array.from(document.querySelectorAll('#fin .carte')).filter(c => !/retirée en classe/.test(c.textContent)).every(c => c.querySelector('.dec .btn.on') && /heure suivante/.test(c.querySelector('.dec .btn.on').textContent))), 'la décision par défaut n\'est pas « à l\'heure suivante »');

await page.click('#fin .carte:nth-child(1) [data-c="terminer"], #fin .carte:nth-child(1) [data-c="preparer"]'); await p(300);
console.log('texte ED :', await ev(() => document.getElementById('f-ed').textContent.slice(0, 200)));
ok((await ev(() => document.getElementById('f-ed').textContent)).includes('Pour la prochaine séance'), 'le texte ED ne se compose pas');
ok(await ev(() => document.querySelectorAll('#fin .taxo [data-notion]').length > 0), 'aucune notion à apprendre'); await page.screenshot({ path: 'vis/v9b-05-t5.png', fullPage: false });
await page.click('#f-ok'); await p(200);
// 10. la fin de l'heure (clôture) puis la relecture : récit et ce qui s'est passé
await page.click('#bfin'); await p(500); ok(await ev(() => !!document.getElementById('f-clore')), 'pas de bouton clore'); await page.fill('#f-mot', 'Pense à rattraper le tableau à trois colonnes.'); await page.click('#f-clore'); await p(500);
await page.click('#o-relecture'); await p(300); ok(await ev(() => document.body.classList.contains('vue-relecture')), 'la relecture ne s\'ouvre pas depuis l\'écran d\'ouverture');
const recit = await ev(() => document.getElementById('rel').innerText); console.log('récit (extrait) :', recit.replace(/\s+/g, ' ').slice(0, 400));
ok(/Ce qu'on a fait aujourd'hui/.test(recit), 'pas de récit'); ok(/Pour la prochaine séance/.test(recit), 'pas de travail à faire dans le récit'); ok(/Line a dit le sublime/.test(recit), 'la note versée n\'est pas dans le récit'); ok(/élève[s]? sur \d+ présents/.test(recit), 'le bilan des prises de parole manque'); ok(!/Aucun élève/.test(recit), '');
ok(/tu n'étais pas là|tu es parti|tu es arrivé/.test(recit), 'pas de mot pour les absents');
await page.screenshot({ path: 'vis/v9b-06-recit.png' });
await page.click('#faces [data-f="passe"]'); await p(300); const passe = await ev(() => document.getElementById('rel').innerText); ok(/le fil de l'heure/i.test(passe) && /Verser au récit|Retirer du récit/.test(passe), 'ce qui s\'est passé incomplet'); await page.screenshot({ path: 'vis/v9b-07-passe.png' });
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs));
console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
