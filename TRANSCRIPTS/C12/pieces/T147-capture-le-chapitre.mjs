import { chromium } from '/home/claude/.npm-global/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1536, height: 864 } }); const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/C12/maquette-v9c13-courante.html'); await p(600); await page.click('#edt-cases [data-lancer="1"]'); await p(300);
for (let k = 0; k < 6; k++) await page.keyboard.press('ArrowRight'); await page.click('#bfin'); await p(500); await page.click('#f-clore'); await p(500); await page.click('#edt-cases [data-lancer="2"]'); await p(300); await page.click('#o-lancer'); await p(300);
for (let k = 0; k < 6; k++) await page.keyboard.press('ArrowRight'); await page.keyboard.press('r'); await p(500);
await ev(() => {
  const st = document.createElement('style'); st.textContent = `
  .pp-chap{max-width:1180px;margin:0 auto;color:var(--texte)}
  .pp-chap h3{font-size:1.05rem;color:var(--or);margin:18px 0 8px;letter-spacing:.02em}
  .pp-chap table{width:100%;border-collapse:collapse;font-size:.92rem}.pp-chap th{text-align:left;color:var(--sourd);font-weight:600;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;padding:6px 8px;border-bottom:1px solid var(--bord2)}.pp-chap td{padding:7px 8px;border-bottom:1px solid var(--bord);vertical-align:top}
  .pp-chap .deja{color:var(--texte2);font-style:italic}.pp-chap .avenir{color:var(--sourd)}.pp-chap .ok{color:var(--joue)}.pp-chap .maison{color:#e0c48c}.pp-chap .nonfait{color:#f0a0a0}.pp-chap .reporte{color:var(--gel)}.pp-chap .plus{color:#a8cbea}
  .pp-chap .bilan{display:grid;grid-template-columns:1fr 1fr;gap:16px}.pp-chap .bloc2{background:var(--carte);border:1px solid var(--bord);border-radius:10px;padding:10px 14px}.pp-chap .bloc2 b{display:block;margin-bottom:6px}.pp-chap .bloc2 li{margin:3px 0}.pp-chap .k{font-size:.78rem;color:var(--sourd)}
  #faces .ong.pp-on{border-color:var(--or);color:var(--or)}`; document.head.appendChild(st);
  const faces = document.getElementById('faces'); const b = document.createElement('button'); b.className = 'ong pp-on'; b.textContent = 'Le chapitre'; faces.querySelectorAll('.ong').forEach(x => x.classList.remove('on')); faces.appendChild(b);
  document.getElementById('rel').innerHTML = `<div class="pp-chap">
  <h2 style="margin:0 0 4px">Le chapitre — Poésie et peinture : le Romantisme en question · 3E Charles de Gaulle</h2>
  <div style="color:var(--texte2)">La relecture de tout le chapitre, heure par heure : le tracé des travaux à faire, ce qui a été fait et ce qui est parti à la maison, ce qui manquait et ce qui était en trop. Calculé à partir des journaux des heures closes ; les heures à venir sont lues dans la trame.</div>
  <h3>1 · Le tracé des travaux à faire</h3>
  <table><tr><th>Heure</th><th>Donné le</th><th>Pour le</th><th>Ce qui est parti dans École Directe</th><th>Déjà donné pour cette date</th></tr>
  <tr><td>S1 · H1</td><td>lundi 14 sept.</td><td>mardi 15 sept.</td><td>Terminer « Activité 1 — Analyse d'images : les cinq tableaux » : Tableau 3, 4 et 5 · Apprendre : Dire ce qu'on voit, avec les mots justes ; Savoir si l'on voit de près ou de loin</td><td class="deja">—</td></tr>
  <tr><td>S1 · H2</td><td>mardi 15 sept.</td><td>jeudi 17 sept.</td><td>Faire « Activité 3 — Les règles héritées » (reportée) · Relire la définition du Romantisme (fiche notion)</td><td class="deja">jeudi 10 : relire la fiche sur le champ lexical</td></tr>
  <tr class="avenir"><td>S2 · H1</td><td>jeudi 17 sept.</td><td>—</td><td>à venir — la trame prévoit : « Apprendre la frise »</td><td></td></tr>
  <tr class="avenir"><td>S2 · H2</td><td>lundi 21 sept.</td><td>—</td><td>à venir</td><td></td></tr></table>
  <h3>2 · Ce qui manquait, ce qui était en trop</h3>
  <div class="bilan">
    <div class="bloc2"><b class="maison">Parti à la maison ou reporté — le chapitre était trop plein</b><ul>
      <li><span class="maison">Activité 1</span> — les tableaux 3, 4 et 5 : terminés à la maison (lundi, 15 min prévues, 25 min passées : <i>tu dépassais</i>)</li>
      <li><span class="reporte">Activité 3</span> — Les règles héritées : reportée à la séance suivante (mardi)</li>
      <li><span class="nonfait">Activité 6</span> — Le siècle des inventions : non faite — <i>« pas le temps, vu en S2 »</i> (ton motif)</li></ul>
      <div class="k">3 activités sur 11 n'ont pas tenu dans les deux heures · 22 min de trop au total</div></div>
    <div class="bloc2"><b class="plus">Ce qui manquait — ajouté pendant l'heure, absent de la trame</b><ul>
      <li><span class="plus">Notion imprévue</span> — « le registre lyrique », déclarée sur la diapo 12 (mardi)</li>
      <li><span class="plus">Réponses gardées</span> — 6 réponses d'élèves écrites au tableau, 2 reformulées (versées dans la copie de classe)</li>
      <li><span class="plus">Notes versées au récit</span> — 3 (lundi 2, mardi 1)</li>
      <li><span class="plus">Diapo modifiée</span> — Tableau 2 : légende corrigée en classe, <i>non versée</i> dans la trame</li></ul>
      <div class="k">à relire avant la prochaine classe : ces manques disent ce que la trame n'avait pas prévu</div></div>
  </div>
  <h3>3 · Les notions du chapitre — travaillées ou pas</h3>
  <table><tr><th>Notion</th><th>Prévue</th><th>Travaillée</th><th>Donnée à apprendre</th></tr>
  <tr><td>Dire ce qu'on voit, avec les mots justes</td><td>S1</td><td class="ok">lundi (A1)</td><td class="ok">lundi → mardi</td></tr>
  <tr><td>Savoir si l'on voit de près ou de loin</td><td>S1</td><td class="ok">lundi (A1)</td><td class="ok">lundi → mardi</td></tr>
  <tr><td>Le registre lyrique</td><td class="plus">imprévue</td><td class="ok">mardi (A9)</td><td>—</td></tr>
  <tr><td>Les règles du sonnet</td><td>S1</td><td class="nonfait">non travaillée (A3 reportée)</td><td>—</td></tr>
  <tr><td>La frise du XIXe siècle</td><td>S2</td><td class="avenir">à venir</td><td class="avenir">à venir</td></tr></table>
  <div style="margin-top:14px;display:flex;gap:10px"><button class="btn or">Copier le tracé des travaux (pour École Directe)</button><button class="btn">Copier le bilan du chapitre</button></div>
  </div>`; });
await p(300); await page.screenshot({ path: 'vis/T147-chapitre-plein-ecran.png' }); await nav.close(); console.log('capture');
