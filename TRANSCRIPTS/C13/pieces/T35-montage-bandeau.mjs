import { chromium } from 'playwright';
import path from 'path';

const file = 'file://' + path.resolve('./maquette.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', m => { if (m.type() === 'error') console.log('PAGE ERROR:', m.text()); });
page.on('pageerror', e => console.log('PAGE EXCEPTION:', e.message));

await page.goto(file);
await page.waitForTimeout(600);

// Entrer dans l'atelier puis lancer la répétition, comme Paul le fait
await page.click('[data-atelier]');
await page.waitForTimeout(300);
await page.click('#at-jouer');
await page.waitForTimeout(400);

// (capture "avant" déjà envoyée au tour précédent — on ne reprend que la proposition corrigée)

// Capture 2 : la proposition — mêmes données, CSS/DOM modifiés pour montrer la direction
await page.evaluate(() => {
  const bandeau = document.getElementById('rep-bandeau');
  const etat = document.getElementById('rep-etat');
  if (bandeau) bandeau.remove();
  if (etat) etat.remove();

  const haut = document.querySelector('.haut');
  if (haut) haut.classList.add('mock-repetition');

  // Préfixe "RÉPÉTITION ·" devant les onglets, dans la bande de titre existante
  const onglets = haut.querySelector('.onglets');
  if (onglets && !document.getElementById('mock-prefixe')) {
    const span = document.createElement('span');
    span.id = 'mock-prefixe';
    span.textContent = 'RÉPÉTITION ·';
    span.style.color = '#c99a4e';
    span.style.fontWeight = '700';
    span.style.letterSpacing = '.03em';
    span.style.marginRight = '10px';
    span.style.alignSelf = 'center';
    haut.insertBefore(span, onglets);
  }

  // "Tableau" et "Écran 2" restent (Paul s'en sert pour vérifier en répétition) ;
  // seul "Fin de l'heure" est retiré (aucune heure active en répétition) et remplacé par "Arrêter"
  const bfin = document.getElementById('bfin');
  if (bfin) bfin.style.display = 'none';
  if (!document.getElementById('mock-arreter')) {
    const btn = document.createElement('button');
    btn.id = 'mock-arreter';
    btn.className = 'btn or';
    btn.textContent = '■ Arrêter';
    bfin.insertAdjacentElement('afterend', btn);
  }

  // Chrono + diapo courante, déplacés dans la bande de titre (à côté de l'horloge existante)
  const chronoHost = document.getElementById('heure');
  if (chronoHost && !document.getElementById('mock-chrono')) {
    const span = document.createElement('span');
    span.id = 'mock-chrono';
    span.style.marginLeft = '8px';
    span.style.color = '#c99a4e';
    span.textContent = '· répét. 00:12 · diapo 2, dévoilée 1 / 3';
    chronoHost.insertAdjacentElement('afterend', span);
  }

  // Teinte discrète de l'entête en répétition (visuel suggéré)
  const style = document.createElement('style');
  style.textContent = `.haut.mock-repetition{background:#241c10!important;border-bottom:1.6px solid #c99a4e!important}`;
  document.head.appendChild(style);
});

await page.waitForTimeout(200);
await page.screenshot({ path: 'apres-proposition-2.png' });
console.log('apres-proposition-2.png capturé');

await browser.close();
