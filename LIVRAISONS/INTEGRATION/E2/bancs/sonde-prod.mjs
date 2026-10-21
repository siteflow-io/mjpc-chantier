// LA SONDE DE LA PRODUCTION — mission 0 d'E2 : ce que le site fait AUJOURD'HUI, par le geste, sur le faux hub.
// usage : node sonde-prod.mjs <index.html de production> [sortie.txt]
// 1. la case EDT de 3E Charles de Gaulle le 14/09 à 09:00 : quelle séance, quelle « heure n/N » ; « ▶ Ouvrir le pilotage et lancer » → quelle séance lancée
// 2. la reprise d'aujourd'hui : recharger en pleine heure (même hub), la bannière, « Reprendre le cours », puis un écran de plus → le paquet H s'écrit-il encore ?
// 3. le mode test : le lancement depuis la case, combien d'écritures partent au hub
import fs from 'fs'; import { ouvrir, rapport } from './hub.mjs';
const F = process.argv[2]; const OUT = process.argv[3];
const r = rapport('sonde E2 sur la production', F); const { dire, pas } = r;
const caseCharles = async page => page.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); if (!c) return null; const t = c.innerText.replace(/\s+/g, ' '); c.click(); return t; });

dire(''); dire('1 — la case EDT et le lancement');
let s = await ouvrir(F);
await s.page.click('#tprof-btn'); await s.attendre(600);
await s.page.evaluate(() => edtOuvrir()); await s.attendre(1500);
const txtCase = await caseCharles(s.page); await s.attendre(800);
pas('1', txtCase ? 'ok' : 'ÉCHEC', 'la case de 3E Charles de Gaulle (lun. 14/09)', txtCase);
const modale = await s.page.evaluate(() => { const m = document.getElementById('edt-modale'); return m ? m.innerText.replace(/\s+/g, ' ').slice(0, 400) : null; });
dire('      modale : ' + modale);
const cel = await s.page.evaluate(() => { const c = edtCellule(EDT_MOD.cle); return c && { cle: EDT_MOD.cle, iso: c.iso, creneau: c.creneau, classe: c.classeMjpc, titre: c.titre, heure: c.heure, sur: c.sur, nature: c.nature }; });
dire('      cellule : ' + JSON.stringify(cel));
const avant = (await s.ecrits()).length;
await s.page.evaluate(k => edtLancer(k), cel.cle); await s.attendre(6000);
const lance = await s.page.evaluate(() => ({ snum: ATVUES.snum, titre: (((chapitresData[AT.edChap.level] || {})[AT.edChap.chnum] || {}).seances || {})[ATVUES.snum] && chapitresData[AT.edChap.level][AT.edChap.chnum].seances[ATVUES.snum].title, cours: window.AT_DR_COURS, regime: window.AT_DR_REGIME }));
dire('      lancé : ' + JSON.stringify(lance));
pas('1', lance.regime === 'classe' ? 'ok' : 'ÉCHEC', 'edtLancer lance', 'séance ' + lance.snum + ' « ' + String(lance.titre).slice(0, 50) + ' »');
pas('1', String(lance.titre) === String(cel.titre) ? 'ok' : 'ÉCHEC', 'la séance lancée est celle que la case annonce', 'case « ' + cel.titre + ' » · lancée « ' + lance.titre + ' »');
(await s.ecrits()).slice(avant).forEach(x => dire('      ' + x));

dire(''); dire('2 — la reprise d\'aujourd\'hui (recharger en pleine heure)');
await s.attendre(4000);
const hub1 = await s.hub(); const sk = lance.snum;
const H0 = hub1.site['3e'].chapitres[0].seances[sk].deroule_joue['3E Charles de Gaulle'].heures;
const cleH = Object.keys(H0 || {}).find(k => k.startsWith('2026-09-14'));
dire('      avant rechargement : H = ' + cleH + ' · maj ' + (H0 && H0[cleH] && H0[cleH].maj) + ' · cours_actif ' + JSON.stringify(hub1.site.cours_actif).slice(0, 160));
await s.ctx.close();
s = await ouvrir(F, { quand: '2026-09-14T09:05:00+02:00', store: hub1, nav: s.navigateur });
await s.attendre(7000);
const banniere = await s.page.evaluate(() => { const b = document.getElementById('ses-reprise'); return b ? b.innerText.replace(/\s+/g, ' ') : null; });
pas('2', banniere ? 'ok' : 'ÉCHEC', 'la bannière « un cours est en cours »', banniere);
if (banniere) {
  await s.page.evaluate(() => sesReprendre()); await s.attendre(5000);
  const ap = await s.page.evaluate(() => ({ regime: window.AT_DR_REGIME, cours: window.AT_DR_COURS, vecu: !!window.AT_DR_VECU }));
  dire('      après « Reprendre » : ' + JSON.stringify(ap));
  const n0 = (await s.ecrits()).length;
  await s.page.evaluate(() => { try { _drTraceAuto(); } catch (e) {} try { _drCopieAuto(); } catch (e) {} }); await s.attendre(2500);
  const e2 = (await s.ecrits()).slice(n0); e2.forEach(x => dire('      ' + x));
  pas('2', ap.vecu ? 'ok' : 'ÉCHEC', 'après la reprise, le vécu de l\'heure (AT_DR_VECU) est remonté', ap.vecu ? '' : 'AT_DR_VECU nul : _drTraceAuto sort sans rien écrire');
  pas('2', e2.some(x => /\/heures\//.test(x)) ? 'ok' : 'ÉCHEC', 'après la reprise, le paquet H s\'écrit encore', e2.length + ' écriture(s)');
}
await s.ctx.close();

dire(''); dire('3 — le mode test (lancement depuis la case)');
s = await ouvrir(F, { nav: s.navigateur });
await s.page.evaluate(() => { M8_TEST = true; }); await s.page.click('#tprof-btn'); await s.attendre(600);
await s.page.evaluate(() => edtOuvrir()); await s.attendre(1500); await caseCharles(s.page); await s.attendre(800);
const n1 = (await s.ecrits()).length;
await s.page.evaluate(() => edtLancer(EDT_MOD.cle)); await s.attendre(6000);
const et = (await s.ecrits()).slice(n1); et.forEach(x => dire('      ' + x));
pas('3', et.length === 0 ? 'ok' : 'ÉCHEC', 'mode test : zéro écriture au hub au lancement', et.length + ' écriture(s)');
dire(''); dire('erreurs JS : ' + (s.errs.join(' ; ') || 'aucune'));
await s.navigateur.close();
dire(''); dire('— ' + r.echecs() + ' constat(s) rouge(s) sur la production (attendu : ce sont les points de l\'audit)');
if (OUT) fs.writeFileSync(OUT, r.R.join('\n') + '\n');
