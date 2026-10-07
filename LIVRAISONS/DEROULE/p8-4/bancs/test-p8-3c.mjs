// (p8-3c) par le geste : « À régler » au chargement (0 « Objet non lisible » pour un objet que la maquette sait afficher, 0 « Schéma avec du texte ») ;
// l'épreuve sur une COPIE de la maquette (un vrai objet inconnu et un schéma avec du texte y restent signalés ; « Couper la diapo ici » fait tomber la ligne) ;
// la diapo 6 de l'heure 2 (« + bloc » puis « Schéma… » : le schéma part sur la diapo suivante) et la diapo « consigne d'une ligne + schéma » qui suit (mesure à zéro) ;
// les infobulles de tous les gestes grisés (aucune ne dit « grisé ») ; le bloc question au tableau (chaque question à son tour ; aucune ligne ne se chevauche, ligne vide comprise).
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const boites = []; page.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); });   /* aucune boîte système : chacune est un défaut */
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
const MES = []; const cinq = m => `chevauchements ${m.chevauchements} · hors du cadre visible ${m.horsCadre} · traits à travers un mot ${m.traits} · libellés sur deux lignes ${m.deuxLignes} · polices sous 26 pt ${m.sousPlancher}`;
const mesurer = (pg, sel) => pg.evaluate(s => { const m = p8MesureLisible(document.querySelector(s)); return { chevauchements: m.chevauchements, horsCadre: m.horsCadre, traits: m.traits, deuxLignes: m.deuxLignes, sousPlancher: m.sousPlancher, total: m.total, details: m.details.slice(0, 6) }; }, sel);
const idx = q => ev(q => seance().ecrans.findIndex(e => e.eid === q || e.act === q), q);
const allerA = async (pg, i) => { await pg.click('#volet .at-chap .d[data-at-di="' + i + '"]'); await pg.waitForTimeout(450); };
const items = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#menu .it')).map(b => ({ a: b.dataset.a, l: b.textContent, t: b.title, off: b.disabled })));
const ouvrirAtelier = async pg => { await pg.click('#edt-cases [data-atelier="1"]'); await pg.waitForTimeout(500); await pg.click('#at-aide .x'); await pg.waitForTimeout(200); };
const lignesRegler = async pg => { await pg.click('#at-regler'); await pg.waitForTimeout(400); return pg.evaluate(() => document.querySelector('.choix-obj').innerText.split('\n').filter(x => / — diapo \d+/.test(x))); };
const fermer = async pg => { await pg.click('.choix-obj .x'); await pg.waitForTimeout(200); };
const CONNUS = /Objet non lisible « (consigne|texte|question|fiche|schema|image|video|page|doc|cahier) »/;
/* les boîtes réelles des lignes d'un bloc question (la question, ses lignes, ses réponses) ; une ligne vide compte avec la hauteur de son chevron */
const chevauchementsQ = (pg, sel) => pg.evaluate(sel => { const mur = document.querySelector(sel); const L = Array.from(mur.querySelectorAll('.bloc .q, .bloc ul.etapes li, .bloc .rep')).filter(x => { const cs = getComputedStyle(x); return cs.display !== 'none' && cs.visibility !== 'hidden' && x.getBoundingClientRect().width > 0; }).map(x => { const r = x.getBoundingClientRect(); let bas = r.bottom; if (x.tagName === 'LI' && !x.textContent.trim()) { /* une ligne vide : son chevron a la hauteur d'une ligne écrite — mesurée sur une ligne témoin, posée puis retirée */ const t = x.cloneNode(false); t.textContent = 'x'; t.style.visibility = 'hidden'; x.parentElement.appendChild(t); const ht = t.getBoundingClientRect().height; t.remove(); bas = Math.max(bas, r.top + ht); } return { nom: (x.className.split(' ')[0] || x.tagName.toLowerCase()) + ' « ' + x.textContent.trim().slice(0, 24) + ' »', l: r.left, r: r.right, t: r.top, b: bas }; });
  const out = []; for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i], b = L[j]; const h = Math.min(a.b, b.b) - Math.max(a.t, b.t), w = Math.min(a.r, b.r) - Math.max(a.l, b.l); if (h > 1 && w > 1) out.push(a.nom + ' × ' + b.nom); } return out; }, sel);
const visiblesQ = (pg, sel) => pg.evaluate(sel => Array.from(document.querySelectorAll(sel + ' .bloc .q')).filter(x => getComputedStyle(x).display !== 'none' && !x.classList.contains('pas')).map(x => x.textContent.trim()), sel);

await page.goto(MAQUETTE); await p(600); await ouvrirAtelier(page);

// 1. « À régler » au chargement : aucune fausse alerte
const L1 = await lignesRegler(page); await page.screenshot({ path: capture('p8-3c-a-regler-apres.png') });
MES.push('p8-3c-a-regler-apres.png · « À régler » au chargement : ' + L1.length + ' lignes — ' + L1.map(x => x.split(' — ')[0]).join(' | '));
ok(L1.filter(x => CONNUS.test(x)).length === 0, '« À régler » signale un objet que la maquette sait afficher : ' + L1.filter(x => CONNUS.test(x)).join(' | '));
ok(L1.filter(x => /Schéma avec du texte/.test(x)).length === 0, '« À régler » porte une ligne « Schéma avec du texte » : ' + L1.filter(x => /Schéma avec du texte/.test(x)).join(' | '));
ok(L1.some(x => /Objet non lisible « tableau-double »/.test(x)), 'le vrai objet inconnu de la trame (« tableau-double », simulation p4a) n\'est plus signalé');
await fermer(page);
const iC = await ev(() => seance().ecrans.findIndex(e => (e.blocs || [])[0] && e.blocs[0].t === 'cahier')); await allerA(page, iC);
ok(await ev(() => !!document.querySelector('#mur .corpsd.cahier') && !document.querySelector('#mur .alertes-diapo')), 'la diapo « Cahier de textes » ne s\'affiche pas par son rendu, ou porte une alerte');

// 2. l'épreuve, sur une COPIE de la maquette (jamais sur ce que Paul joue) : un vrai objet inconnu et un schéma avec du texte y restent signalés
const vraie = fs.readFileSync(fileURLToPath(MAQUETTE), 'utf8'); const ancre = '/* (p8-3c) retirée : la simulation b-sim-schema';
ok(vraie.split(ancre).length === 2, 'la copie ne peut pas être posée : l\'ancre de la simulation n\'est pas unique');
const ajout = "(function(){ const E = DATA.seances[0].ecrans; const s = E.find(e => e.act === 'Le siècle des inventions'); s.blocs = s.blocs.concat([{ t: 'frise-animee', bid: 'b-epreuve-inconnu', txt: 'Une frise qui bouge' }, { t: 'schema', bid: 'b-epreuve-schema', txt: 'Trois inventions', forme: 'carte', src: 'Inventions : photographie, télégraphe, téléphone' }]); })(); ";
const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'mjpc-epreuve-')); const copie = path.join(dossier, 'copie-epreuve.html'); fs.writeFileSync(copie, vraie.replace(ancre, ajout + ancre));
const pc = await ctx.newPage(); pc.on('pageerror', e => errs.push('copie : ' + e.message)); pc.on('dialog', d => { boites.push('copie : ' + d.message()); d.dismiss(); });
await pc.goto(pathToFileURL(copie).href); await pc.waitForTimeout(600); await ouvrirAtelier(pc);
const L2 = await lignesRegler(pc); await pc.screenshot({ path: capture('p8-3c-epreuve-copie.png') }); await fermer(pc);
MES.push('p8-3c-epreuve-copie.png · la copie : ' + L2.filter(x => /frise-animee|Schéma avec du texte/.test(x)).map(x => x.split(' — ')[0]).join(' | '));
ok(L2.some(x => /Objet non lisible « frise-animee »/.test(x)), 'sur la copie, le vrai objet inconnu n\'est pas signalé');
ok(L2.some(x => /Schéma avec du texte : donne-lui sa diapo — clic droit sur le bloc → Couper la diapo ici/.test(x)), 'sur la copie, le schéma avec du texte n\'est pas signalé');
const iS = await pc.evaluate(() => seance().ecrans.findIndex(e => e.act === 'Le siècle des inventions')); await allerA(pc, iS);
ok(/Schéma avec du texte : donne-lui sa diapo/.test(await pc.evaluate(() => document.getElementById('droite-atelier').textContent)), 'sur la copie, « Sur la forme » ne dit pas « Schéma avec du texte »');
const cS = await pc.evaluate(() => { const z = document.querySelector('#mur .p8-dessin'); const r = z.getBoundingClientRect(); for (const [fx, fy] of [[0.02, 0.97], [0.98, 0.97], [0.02, 0.03], [0.98, 0.03]]) { const x = r.left + r.width * fx, y = r.top + r.height * fy; const h = document.elementFromPoint(x, y); if (h && z.contains(h) && !h.closest('g.p8-n')) return { x, y }; } return null; });
await pc.mouse.click(cS.x, cS.y, { button: 'right' }); await pc.waitForTimeout(300); await pc.click('#menu [data-a="b-couper-diapo"]'); await pc.waitForTimeout(700);
const apS = await pc.evaluate(i => { const E = seance().ecrans; return { b: E[i + 1].blocs.map(b => b.t).join(','), al: alertesForme().filter(a => (a.di === i || a.di === i + 1) && a.k === 'texte').length }; }, iS);
ok(apS.b === 'schema' && apS.al === 0, 'sur la copie, « Couper la diapo ici » ne donne pas au schéma sa diapo, ou la ligne ne tombe pas : ' + JSON.stringify(apS));
await pc.close(); fs.rmSync(dossier, { recursive: true, force: true });

// 3. la diapo 6 de l'heure 2 (« Les mouvements du siècle ») : sa consigne seule ; « + bloc » puis « Schéma… » : le schéma part sur la diapo suivante (le test de Paul, par le geste)
const iM = await idx('Les mouvements du siècle'); const h2 = await ev(i => { const E = seance().ecrans; return E.filter((e, j) => j <= i && e.heure === 2).length; }, iM);
ok(h2 === 6, '« Les mouvements du siècle » n\'est pas la diapo 6 de l\'heure 2 (' + h2 + ')');
await allerA(page, iM); await page.screenshot({ path: capture('p8-3c-diapo6-H2-apres.png') });
const av3 = await ev(i => { const E = seance().ecrans; return { n: E.length, blocs: JSON.stringify(E[i].blocs), types: E[i].blocs.map(b => b.t).join(',') }; }, iM);
ok(av3.types === 'consigne', 'la diapo 6 de l\'heure 2 n\'est pas redevenue sa consigne seule : ' + av3.types);
ok(await ev(() => { const b = document.getElementById('at-bloc'); return !b.disabled; }), 'sur la diapo 6 de l\'heure 2, « + bloc » est encore grisé');
await page.click('#at-bloc'); await p(300); await page.click('.choix-obj .c[data-t="schema"]'); await p(300); await page.selectOption('#of-forme', 'frise'); await page.fill('#of-t', 'Quatre mouvements'); await page.fill('#of-src', '1660 = classicisme\n1820 = romantisme\n1866 = Parnasse\n1886 = symbolisme'); await page.click('#of-ok'); await p(600);
const ap3 = await ev(i => { const E = seance().ecrans; return { n: E.length, blocs: JSON.stringify(E[i].blocs), suiv: E[i + 1].blocs.map(b => b.t).join(','), di: S.di }; }, iM);
ok(ap3.n === av3.n + 1 && ap3.blocs === av3.blocs && ap3.suiv === 'schema' && ap3.di === iM + 1, '« Schéma… » sur la diapo 6 de l\'heure 2 ne pose pas le schéma sur une diapo nouvelle juste après : ' + JSON.stringify(ap3).slice(0, 300));
// la diapo « consigne d'une ligne + schéma » qui suit (la simulation plausible) : elle tient lisible
const iP = await idx('e-sim-schema-plausible'); await allerA(page, iP); await p(300);
const mP = await mesurer(page, '#mur'); const tP = await ev(i => (p8MesureDiapo(i).blocs || {})[1] || null, iP); await page.screenshot({ path: capture('p8-3c-diapo-plausible.png') });
const bP = await ev(() => ecran().blocs.map(b => b.t + (b.t === 'consigne' ? ':' + p8LignesConsigne(b) : '')).join(','));
MES.push('p8-3c-diapo-plausible.png · « ' + await ev(() => ecran().act) + ' » (' + bP + ') · dans l\'atelier : ' + cinq(mP) + ' — ' + mP.details.join(' / ') + ' ; au tableau (la mesure de « À régler ») : ' + (tP ? cinq(tP) : '—'));
ok(bP === 'consigne:1,schema', 'la diapo plausible n\'est pas « une consigne d\'une ligne, puis un schéma » : ' + bP);
ok(mP.total === 0 && tP && tP.total === 0, 'la diapo « consigne d\'une ligne + schéma » ne tient pas lisible — atelier : ' + cinq(mP) + ' — ' + mP.details.join(' / ') + ' ; tableau : ' + (tP ? cinq(tP) : '—'));

// 4. les infobulles de tous les gestes grisés : ce qui empêche, puis quoi faire — jamais « grisé »
const RELEVE = []; const releve = async (ou) => { const t = await ev(() => Array.from(document.querySelectorAll('button:disabled, .choix-obj .c.off, #menu .it:disabled')).filter(x => (x.offsetParent !== null || x.closest('#menu.on')) && x.dataset.a !== 'titre') /* l'en-tête du menu n'est pas un geste */.map(x => ({ l: (x.querySelector('b') || x).textContent.trim().slice(0, 40), t: x.title || '', s: (x.querySelector('span') || {}).textContent || '' }))); t.forEach(x => RELEVE.push(ou + ' · ' + x.l + ' : ' + (x.t || '(sans infobulle)') + (x.s ? ' [' + x.s + ']' : ''))); };
await allerA(page, iP); await releve('diapo à schéma et consigne d\'une ligne');                                   /* la barre de l'atelier */
await page.click('#mur [data-p="0.t"]'); await p(300); await releve('diapo à schéma, bloc consigne choisi');        /* la barre du bloc */
await page.click('#mur [data-p="0.t"]', { button: 'right' }); await p(300); await releve('clic droit sur la consigne d\'une diapo à schéma'); await page.keyboard.press('Escape'); await p(150);
const iV = await idx('e-sim-vraie-carte'); await allerA(page, iV); await page.click('#at-bloc'); await p(300); await releve('« + bloc » sur une diapo à schéma seul'); await fermer(page);
const coin = async () => ev(() => { const z = document.querySelector('#mur .p8-dessin'); const r = z.getBoundingClientRect(); for (const [fx, fy] of [[0.02, 0.97], [0.98, 0.97], [0.02, 0.03], [0.98, 0.03]]) { const x = r.left + r.width * fx, y = r.top + r.height * fy; const h = document.elementFromPoint(x, y); if (h && z.contains(h) && !h.closest('g.p8-n')) return { x, y }; } return null; });
const bulle = async nom => ev(nom => { const g = document.querySelector('#mur .p8-dessin g.p8-n[data-k="' + p8Cle(nom) + '"]'); const r = g.querySelector('text').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, nom);
let q = await bulle("Figures d'analogie"); await page.mouse.click(q.x, q.y, { button: 'right' }); await p(300); await releve('clic droit sur la première famille'); await page.keyboard.press('Escape'); await p(150);
q = await bulle('comparaison'); await page.mouse.click(q.x, q.y, { button: 'right' }); await p(300); await releve('clic droit sur une notion'); await page.keyboard.press('Escape'); await p(150);
await allerA(page, await idx('Le siècle des inventions')); await page.click('#mur [data-p="0.t"]', { button: 'right' }); await p(300); await page.click('#menu [data-a="b-copier"]'); await p(200);
await allerA(page, iV); let c = await coin(); await page.mouse.click(c.x, c.y, { button: 'right' }); await p(300); await releve('clic droit sur le schéma, une consigne de plusieurs lignes copiée');
const ta = (await items(page)).find(x => x.a === 'b-taille'); RELEVE.push('clic droit sur le schéma · taille : ' + ta.l + ' : ' + ta.t); await page.keyboard.press('Escape'); await p(150);
fs.writeFileSync(capture('INFOBULLES-p8-3c.txt'), RELEVE.join('\n') + '\n');
MES.push('INFOBULLES-p8-3c.txt · ' + RELEVE.length + ' infobulles de gestes grisés relevées');
ok(RELEVE.length >= 12, 'trop peu d\'infobulles relevées (' + RELEVE.length + ') : le banc ne voit pas les gestes grisés');
const grise = RELEVE.filter(x => /gris[ée]/i.test(x)); ok(!grise.length, grise.length + ' infobulle(s) de geste grisé disent « grisé » : ' + grise.join(' | '));
const vides = RELEVE.filter(x => /\(sans infobulle\)/.test(x) && !/titre|«/.test(x.split(' · ')[1] || '')); ok(!vides.length, 'des gestes grisés sans infobulle : ' + vides.join(' | '));
ok(['+ bloc', '+ étape', '+ image', 'Dupliquer le bloc', 'Coller ici', 'Couper le schéma ici', 'Schéma…'].every(g => RELEVE.some(x => x.includes(' · ' + g))), 'un des gestes grisés de p8-3 n\'a pas été relevé : ' + RELEVE.map(x => x.split(' : ')[0]).join(' | '));

// 5. le bloc question au tableau — a) deux questions sur une diapo insérée : au premier ▶ la première seule, puis ses lignes, puis la seconde ; jamais un chevauchement
const iU = await idx('Un poète spécial…'); await allerA(page, iU); await page.keyboard.press('Control+Enter'); await p(500); const iQ = await ev(() => S.di);
for (const [qq, rr] of [['Où avons-nous placé Baudelaire ?', 'Hors de toute case.'], ['À quel mouvement appartient-il ?', 'Aux trois à la fois.']]) { await page.click('#at-bloc'); await p(300); await page.click('.choix-obj .c[data-t="question"]'); await p(300); await page.fill('#of-q', qq); await page.fill('#of-r', rr); await page.click('#of-ok'); await p(500); }
ok(await ev(() => ecran().blocs.filter(b => b.t === 'question').length === 2), 'les deux questions ne sont pas posées sur la diapo');
await page.click('#at-jouer'); await p(500); const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]); tab.on('pageerror', e => errs.push('tableau : ' + e.message)); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(700);
const EL = await ev(() => elements(ecran()).map(x => x.q ? 'Q' : x.t)); const k0 = EL.indexOf('Q'); const N = EL.length; ok(JSON.stringify(EL.slice(k0)) === JSON.stringify(['Q', 'question', 'Q', 'question']) && k0 >= 0, 'les éléments des deux questions ne sont pas « question, sa ligne, question, sa ligne » : ' + JSON.stringify(EL));
/* la diapo insérée porte sa consigne d'une ligne : ses éléments d'abord (k0), puis les questions */ for (let s = 0; s < k0; s++) { await page.keyboard.press('ArrowRight'); await p(400); }
const att = [[], ['Où avons-nous placé Baudelaire ?'], ['Où avons-nous placé Baudelaire ?'], ['Où avons-nous placé Baudelaire ?', 'À quel mouvement appartient-il ?'], ['Où avons-nous placé Baudelaire ?', 'À quel mouvement appartient-il ?']];
for (let s = 0; s <= N - k0; s++) {
  const vp = await visiblesQ(page, '#mur'), vt = await visiblesQ(tab, '#mur2'); const cp = await chevauchementsQ(page, '#mur'), ct = await chevauchementsQ(tab, '#mur2');
  ok(JSON.stringify(vt) === JSON.stringify(att[s]) && JSON.stringify(vp) === JSON.stringify(att[s]), 'à ' + s + ' ▶, les questions montrées ne sont pas ' + JSON.stringify(att[s]) + ' — pilote ' + JSON.stringify(vp) + ', tableau ' + JSON.stringify(vt));
  ok(!cp.length && !ct.length, 'à ' + s + ' ▶, des lignes se chevauchent — pilote : ' + cp.join(' / ') + ' ; tableau : ' + ct.join(' / '));
  if (s === 1) { await tab.screenshot({ path: capture('p8-3c-questions-tableau-1.png') }); await page.screenshot({ path: capture('p8-3c-questions-pilote-1.png') }); }
  if (s === 3) await tab.screenshot({ path: capture('p8-3c-questions-tableau-3.png') });
  if (s < N - k0) { await page.keyboard.press('ArrowRight'); await p(450); } }
ok(await ev(() => document.querySelectorAll('#mur .q.pas').length) === 0, 'la diapo finie, une question reste pâle au pilote');
MES.push('p8-3c-questions-tableau-1.png · au premier ▶ : la première question seule (tableau 1280 × 720) ; p8-3c-questions-pilote-1.png : au pilote, la seconde pâle à sa place ; p8-3c-questions-tableau-3.png : au troisième ▶, la seconde paraît');
await page.click('#rep-stop'); await p(500);
// b) le cas de Paul (capture T23) : « Un poète spécial… », une ligne vide sous la réponse (Entrée en fin de ligne), puis une seconde question ; aucune ligne ne se chevauche, ligne vide comprise
await allerA(page, iU); const li0 = await ev(() => { const li = document.querySelector('#mur .bloc ul.etapes li'); const r = li.getBoundingClientRect(); return { x: r.right - 4, y: r.bottom - 8 }; }); await page.mouse.click(li0.x, li0.y); await page.keyboard.press('End'); await page.keyboard.press('Enter'); await p(500);
ok(await ev(() => (ecran().blocs[0].el || []).length === 2 && ecran().blocs[0].el[1] === ''), 'Entrée en fin de ligne n\'a pas ouvert une ligne vide sous la réponse');
await page.click('#mur .corpsd .act'); await p(200); await page.click('#at-bloc'); await p(300); await page.click('.choix-obj .c[data-t="question"]'); await p(300); await page.fill('#of-q', 'que doit-on faire ?'); await page.fill('#of-r', 'manger du pain'); await page.click('#of-ok'); await p(500);
await page.click('#at-jouer'); await p(600); await tab.bringToFront(); await page.bringToFront();
const N2 = await ev(() => elements(ecran()).length); let pire = []; for (let s = 0; s <= N2; s++) { const cp = await chevauchementsQ(page, '#mur'), ct = await chevauchementsQ(tab, '#mur2'); if (cp.length || ct.length) pire.push(s + ' ▶ — pilote : ' + cp.join(' / ') + ' ; tableau : ' + ct.join(' / ')); if (s === 3) await tab.screenshot({ path: capture('p8-3c-ligne-vide-tableau.png') }); if (s < N2) { await page.keyboard.press('ArrowRight'); await p(450); } }
ok(!pire.length, 'des lignes du bloc question se chevauchent (le chevron de la ligne vide) : ' + pire.join(' | '));
MES.push('p8-3c-ligne-vide-tableau.png · le cas de Paul (T23) au 3e ▶ sur ' + N2 + ' : la ligne vide garde sa hauteur, son chevron n\'est plus recouvert — chevauchements à tous les ▶ : ' + pire.length);
await page.click('#rep-stop'); await p(400); await tab.close();

fs.writeFileSync(capture('MESURES-p8-3c.txt'), MES.join('\n') + '\n');
if (boites.length) D.push('boîtes système ouvertes : ' + JSON.stringify(boites));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
