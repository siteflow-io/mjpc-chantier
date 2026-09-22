import { chromium } from '/home/claude/.npm-global/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1536, height: 864 } }); page.on('pageerror', e => console.log('ERREUR', e.message)); const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/C12/maquette-v9c14b2-courante.html'); await p(600); await page.click('#edt-cases [data-lancer="1"]'); await p(300);
// parcours 1 : tout jouer par ▶ jusqu'au bout de l'heure (le fil), sans rien sauter
for (let k = 0; k < 40; k++) { await page.keyboard.press('ArrowRight'); await p(60); if (await ev(() => document.getElementById('garde-cahier').classList.contains('on'))) break; }
const etat = await ev(() => { const E = seance().ecrans; const o = ordreHeure(1); return { garde: document.getElementById('gc-titre').textContent, lignes: Array.from(document.querySelectorAll('#gc-corps .gc-l')).map(l => l.innerText.replace(/\s+/g, ' ')), finies: o.map(i => E[i].act.slice(0, 22) + ' → ' + (finie(E[i], i) ? 'finie' : 'NON ' + (vuMax[K(i)] || 0) + '/' + elements(E[i]).length)) }; });
console.log('PARCOURS 1 (tout par ▶) :', JSON.stringify(etat, null, 1).slice(0, 1500));
await nav.close();
