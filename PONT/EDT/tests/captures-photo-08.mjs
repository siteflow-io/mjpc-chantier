/* CAPTURES ⑧ — LA PHOTO DU PRÉVU, PAR CLICS, AVANT / APRÈS.
   Deux parcours identiques, une seule différence : dans le premier l'échéance a
   déjà sa photo, dans le second elle ne l'a pas. Écran entier à chaque fois, et
   un journal qui dit ce que le hub contient — pas seulement qu'il contient.
   Une seule ligne n'est pas un clic, et elle est déclarée : `admin-mode`.
   Usage : node tests/captures-photo-08.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const GRILLE = JSON.parse(fs.readFileSync('grille-appariee.json', 'utf8'));

const PERIODES = [
  { id: 'per:UN', rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
  { id: 'per:DEUX', rang: 2, nom: 'Trimestre 2', debut: '2026-12-01', fin: '2027-03-15' }
];
const hub = (photos) => ({ classes: {},
  site: { config: { brevetDates: { debutAnnee: '2026-09-01', finAnnee: '2027-06-26' } },
    edt: { grille: { '2026-2027': GRILLE },
      reglages: { '2026-2027': { annee: '2026-2027', semaineA: 'A' } },
      periodes: { '2026-2027': { annee: '2026-2027', periodes: PERIODES } },
      photos: { '2026-2027': { annee: '2026-2027', photos: photos } } } } });

const faux = s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; }
    return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; }
    if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) {
      const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      if (((o && o.method) || 'GET').toUpperCase() === 'GET')
        return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push(c); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 }));
    }
    return Promise.resolve(new Response('null', { status: 200 })); };
  window.__photos = () => ((((window.__HUB.site || {}).edt || {}).photos || {})['2026-2027'] || {}).photos || [];
};

const journal = [];
const dit = t => { journal.push(t); console.log(t); };
const contenu = l => l.map(p => '      · ' + (p.id || '(sans id)') + ' — « ' + (p.nom || '(sans nom)') + ' »'
  + (p.echeance ? (' — échéance ' + p.echeance) : ' — à la main')
  + ' — prise le ' + p.prise + ', semaine du ' + p.depuis
  + ', ' + Object.keys(p.cellules || {}).length + ' cases').join('\n');

const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
page.on('pageerror', e => dit('   ⚠ erreur de page : ' + String(e).slice(0, 110)));

const shot = async n => { await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await page.screenshot({ path: 'tests/08-photo-' + n + '.png' }); };

const arriver = async (etat) => {
  await page.evaluateOnNewDocument(faux, etat);
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(700);
  await page.evaluate(() => document.body.classList.add('admin-mode'));   /* déclaré : pas un clic */
  await page.click('#tprof-btn'); await pause(700);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
  await pause(1400);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-panneau [onclick]'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf('edtOuvrir') >= 0)[0]; if (b) b.click(); });
  await pause(1900);
};
const photos = () => page.evaluate(() => window.__photos());

/* ══ PARCOURS A — L'ÉCHÉANCE A DÉJÀ SA PHOTO : rien ne doit se prendre ══ */
const dejaLa = [{ id: 'pho:20260901083000', nom: 'Trimestre 1', echeance: 'per:UN',
  prise: '2026-09-01', depuis: '2026-08-31', cellules: {} }];
dit('══ PARCOURS A — l\'échéance « Trimestre 1 » a déjà sa photo ══');
dit('   AVANT — le hub porte ' + dejaLa.length + ' photo :');
dit(contenu(dejaLa));
await arriver(hub(dejaLa));
await shot('a1-arrivee-rien-a-prendre');
let p = await photos();
dit('   APRÈS l\'arrivée par clics — le hub porte ' + p.length + ' photo :');
dit(contenu(p));
dit('   écritures photos pendant l\'arrivée : ' + JSON.stringify(
  (await page.evaluate(() => window.__ECR.slice())).filter(c => c.indexOf('/photos/') >= 0)));

/* ══ PARCOURS B — MÊME PARCOURS, L'ÉCHÉANCE N'A PAS SA PHOTO ══ */
dit('\n══ PARCOURS B — même parcours, l\'échéance n\'a pas sa photo ══');
dit('   AVANT — le hub porte 0 photo.');
await arriver(hub([]));
await shot('b1-arrivee-photo-prise-toute-seule');
p = await photos();
dit('   APRÈS l\'arrivée par clics — le hub porte ' + p.length + ' photo :');
dit(contenu(p));
dit('   modale ouverte par-dessus l\'écran : ' + JSON.stringify(
  await page.evaluate(() => { const m = document.getElementById('at-modale'); return m ? m.innerText.slice(0, 60) : null; })));

/* ══ LA PHOTO À LA MAIN — CLIC RÉEL SUR LE BOUTON ══ */
dit('\n══ LE BOUTON « 📷 Photo du prévu » — clic réel ══');
const bouton = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.indexOf('Photo du prévu') >= 0)[0];
  if (!b) return null; const r = b.getBoundingClientRect();
  return { texte: b.innerText.trim(), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; });
dit('   bouton trouvé : ' + JSON.stringify(bouton));
await page.mouse.click(bouton.x, bouton.y);
await pause(1100);
await shot('b2-apres-clic-photo-a-la-main');
dit('   ce que le site dit : ' + JSON.stringify(await page.evaluate(() => {
  const m = document.getElementById('at-modale'); return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 90) : '(rien)'; })));
await page.evaluate(() => { const b = document.querySelector('#at-modale button'); if (b) b.click(); });
await pause(500);
/* un second clic, le même jour : rien n'écrase rien */
await page.mouse.click(bouton.x, bouton.y);
await pause(1100);
await page.evaluate(() => { const b = document.querySelector('#at-modale button'); if (b) b.click(); });
await pause(400);
await shot('b3-deux-photos-le-meme-jour');
p = await photos();
dit('   APRÈS deux clics — le hub porte ' + p.length + ' photos :');
dit(contenu(p));
dit('   identifiants tous distincts : ' + (new Set(p.map(x => x.id)).size === p.length));

/* ══ L'ARCHIVE — ce qu'elle CONTIENT ══ */
const arc = await page.evaluate(() => { let out = null;
  Object.keys(window.__HUB.corbeille || {}).forEach(j => Object.keys(window.__HUB.corbeille[j] || {}).forEach(k => {
    const a = window.__HUB.corbeille[j][k];
    if (a && a._meta && String(a._meta.chemin).indexOf('/photos/') >= 0) out = a; }));
  return out ? { chemin: out._meta.chemin, photos: (out.data.photos || []).map(x => ({ id: x.id, nom: x.nom })) } : null; });
dit('\n══ L\'ARCHIVE ÉCRITE AVANT LA DERNIÈRE PHOTO ══');
dit('   ' + JSON.stringify(arc));

fs.writeFileSync('tests/08-photo-journal.txt', journal.join('\n') + '\n');
await nav.close();
console.log('\ncaptures : tests/08-photo-a1…, b1…, b2…, b3… · journal : tests/08-photo-journal.txt');
