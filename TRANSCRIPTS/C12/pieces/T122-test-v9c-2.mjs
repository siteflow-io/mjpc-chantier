import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const F = 'file:///home/claude/C12/maquette-v9c2-courante.html';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 } }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
const menuA = async (sel, txt) => { await page.click(sel, { button: 'right' }); await p(120); const b = page.locator('#menu .it', { hasText: txt }); if (await b.count() === 0) { D.push('entrée absente : ' + txt); await page.keyboard.press('Escape'); return; } await b.first().click(); await p(200); };
await page.goto(F); await p(500);
// H1, lundi : on joue 3 diapos, une réponse, une note versée, un absent, une prise de parole ; on retire une diapo en réserve
ok(/lundi 14 septembre/.test(await ev(() => document.getElementById('hou').textContent)), 'la tête ne dit pas lundi');
await menuA('#liste div:nth-child(3)', 'Absent');
for (let k = 0; k < 4; k++) await page.keyboard.press('ArrowRight');
await page.click('#volet .vig[data-i="7"]'); await p(100); await page.click('#garde-devant'); await p(200); await page.keyboard.press('ArrowRight'); await p(100);
await page.click('#mur .ajout .ini'); await page.keyboard.type('ze'); await page.keyboard.press('Enter'); await page.keyboard.type('Une nature immense face à un homme petit.'); await page.keyboard.press('Enter'); await p(200); await page.click('#mur ol.reps li'); await page.keyboard.press('Escape');
await page.fill('#vif', 'cj'); await page.click('.motifs [data-m="1"]'); await p(100); await page.keyboard.press('Escape');
await page.keyboard.press('n'); await page.keyboard.type('Line a dit le sublime sans le mot.'); await page.keyboard.press('Enter'); await p(100); await page.click('#fnotes [data-v="0"]'); await page.keyboard.press('Escape');
await menuA('#volet .vig[data-i="9"]', 'en réserve');
// fin de H1 : Tableau 1 (index 1, non joué) à terminer… il n'est pas commencé → « préparer » ; Tableau 2 glisse par défaut ; clore
await page.click('#bfin'); await p(500); ok(/Fin de l'heure/.test(await ev(() => document.querySelector('#fin h2').textContent)), 'pas l\'écran de fin');
const c1 = page.locator('#fin .carte', { hasText: 'Activité 1' }); await c1.locator('[data-c="terminer"]').click(); await p(300);
await page.fill('#f-mot', 'Rattrape le tableau à trois colonnes.'); await page.click('#f-clore'); await p(500);
// l'écran d'ouverture de H2
const ouv = await ev(() => document.getElementById('fin').innerText);
ok(/Où en est la 3E Charles de Gaulle — mardi 15 septembre 2026, 10:07-11:02 · heure 2 sur 2/.test(ouv), 'pas l\'écran d\'ouverture de H2 : ' + ouv.slice(0, 120));
ok(/close à/.test(ouv), 'l\'heure 1 n\'est pas dite close'); ok(/glissée de l'heure 1/.test(ouv), 'les glissées ne sont pas annoncées'); ok(/réactivation/.test(ouv), 'la réactivation n\'est pas en tête');
ok(/mot aux absents : « Rattrape/.test(ouv), 'le mot aux absents n\'est pas rappelé');
await page.screenshot({ path: 'vis/v9c-01-ouverture-H2.png' });
await page.click('#o-lancer'); await p(400);
// H2, mardi : l'ordre — réactivation, puis les glissées de H1 (Tableau 1 à préparer, Tableau 2…), puis H2, le bilan en dernier
const ordre = await ev(() => Array.from(document.querySelectorAll('#volet .vig:not(.hors)')).map(v => { const t = v.title.split(' — '); return t.length > 1 ? t[1] : t[0]; }));
console.log('ordre H2 :', ordre.join(' › '));
ok(ordre[0] === 'Où en sommes-nous ?', 'H2 ne commence pas par la réactivation'); ok(ordre[1] === 'Analyse d\'images : la routine' && ordre[2] === 'Tableau 1' && ordre[3] === 'Tableau 2', 'les glissées ne suivent pas la réactivation dans l\'ordre : ' + ordre.slice(0, 4).join(' › ')); ok(ordre[ordre.length - 1] === 'Question-bilan et travail à faire', 'le bilan n\'est pas dernier');
ok(/mardi 15 septembre/.test(await ev(() => document.getElementById('hou').textContent)), 'la tête ne dit pas mardi'); ok((await ev(() => document.getElementById('numero').textContent)).startsWith('Diapo 9'), 'le pilotage ne s\'ouvre pas sur la réactivation');
ok(await ev(() => document.querySelector('#volet .vig[data-i="1"]').title.includes('glissée de l\'heure 1, à terminer')), 'la vignette ne dit pas « glissée, à terminer »');
await page.screenshot({ path: 'vis/v9c-02-H2-volet.png' });
// jouer H2 : ▶ suit l'ordre (réactivation → Tableau 1)
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await p(200);
ok((await ev(() => ecran().act)) === 'Analyse d\'images : la routine', '▶ après la réactivation n\'arrive pas sur la première glissée : ' + await ev(() => ecran().act));
// le bilan : la coche ; la fin de séance
await page.click('#volet .vig[data-i="18"]'); await p(100); await page.click('#garde-devant'); await p(300);
ok(await ev(() => document.getElementById('bcoche').style.display !== 'none'), 'la coche du bilan n\'apparaît pas sur la diapo bilan'); await page.click('#bcoche'); await p(100); ok(await ev(() => S.bilanCoche), 'la coche ne se coche pas');
await page.click('#bfin'); await p(500); const fin2 = await ev(() => document.getElementById('fin').innerText);
ok(/dernière heure de la séance/.test(fin2), 'la fin de H2 ne se dit pas fin de séance'); ok(/Reporter à la séance suivante/.test(fin2), 'pas de « reporter à la séance suivante »'); ok(/Le bilan de la séance est attesté/.test(fin2), 'la clôture ne dit pas le bilan attesté');
const c2 = page.locator('#fin .carte', { hasText: 'Les règles héritées' }); if (await c2.count()) { await c2.locator('[data-c="reporter"]').click(); await p(300); }
await page.click('#f-clore'); await p(500);
ok(await ev(() => document.body.classList.contains('vue-relecture')), 'la relecture ne s\'ouvre pas après la fin de séance');
// la relecture : trois faces ; le récit de H1 (lundi, la note, Zélia) ; le récit de H2 (mardi) ; la séance
const faces = await ev(() => Array.from(document.querySelectorAll('#faces .ong')).map(b => b.textContent)); console.log('faces :', faces.join(' | '));
ok(faces.length === 5, 'il n\'y a pas 5 faces (2 récits, 2 ce qui s\'est passé, la séance)');
await page.click('#faces [data-f="recit"][data-h="1"]'); await p(300); const r1 = await ev(() => document.getElementById('rel').innerText);
ok(/lundi 14 septembre 2026 · heure 1/.test(r1), 'le récit de H1 ne porte pas lundi'); ok(/Zélia a répondu/.test(r1) && /Line a dit le sublime/.test(r1), 'le récit de H1 a perdu la réponse ou la note'); ok(/tu n'étais pas là lundi/.test(r1), 'le mot de l\'absent de H1 ne dit pas lundi');
await page.click('#faces [data-f="recit"][data-h="2"]'); await p(300); const r2 = await ev(() => document.getElementById('rel').innerText);
ok(/mardi 15 septembre 2026 · heure 2/.test(r2), 'le récit de H2 ne porte pas mardi'); ok(!/Zélia a répondu/.test(r2), 'le récit de H2 contient la réponse de lundi'); ok(/Activité 3 — Les règles héritées », qu'on fera à la prochaine séance/.test(r2), 'le report n\'est pas dans le bilan de H2');
await page.click('#faces [data-f="seance"]'); await p(300); const rs = await ev(() => document.getElementById('rel').innerText); console.log('séance (extrait) :', rs.replace(/\s+/g, ' ').slice(0, 300));
ok(/Ce qu'on a fait dans cette séance/.test(rs) && /Heure 1 — lundi/.test(rs) && /Heure 2 — mardi/.test(rs), 'le récit de séance n\'a pas ses deux heures'); ok(/Pour mardi/.test(rs), 'le travail donné lundi pour mardi n\'est pas rappelé : ' + rs.replace(/\s+/g, ' ').slice(0, 200)); ok(/Sur la séance, on a/.test(rs) && /Le bilan de la séance a été écrit/.test(rs), 'pas de bilan de séance');
await page.screenshot({ path: 'vis/v9c-03-relecture-seance.png' });
await page.click('#faces [data-f="passe"][data-h="1"]'); await p(300); const p1 = await ev(() => document.getElementById('rel').innerText); ok(/Absent/i.test(p1) || /absent/.test(p1), 'l\'appel de H1 manque dans ce qui s\'est passé');
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs));
console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
