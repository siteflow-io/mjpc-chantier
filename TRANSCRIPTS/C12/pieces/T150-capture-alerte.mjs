import { chromium } from '/home/claude/.npm-global/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1536, height: 864 } }); const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/C12/maquette-v9c13-courante.html'); await p(600); await page.click('#edt-cases [data-lancer="1"]'); await p(300);
for (let k = 0; k < 4; k++) await page.keyboard.press('ArrowRight'); await ev(() => { S.di = 7; S.page = null; tout(); }); await p(100); await page.keyboard.press('ArrowRight');
for (const [ini, txt] of [['ga', 'Une nature immense face à un homme petit.'], ['rd', 'La solitude et le silence.']]) { await page.click('#mur .rep.libre .ini'); await page.keyboard.type(ini); await page.keyboard.press('Enter'); await page.keyboard.type(txt); await page.keyboard.press('Enter'); await p(150); }
await page.keyboard.press('Escape'); await ev(() => { document.getElementById('notes') && (document.getElementById('notes').textContent = 'Dire que la réponse validée est recopiée dans le cahier, partie cours. Ne pas laisser passer « la nature est belle » sans demander pourquoi.'); });
await ev(() => {
  const st = document.createElement('style'); st.textContent = `
  .pp-alerte{margin:8px 0 0;background:#1c1712;border:1px solid var(--or);border-radius:10px;padding:9px 12px 9px 8px;display:flex;gap:12px;align-items:center;box-shadow:0 6px 18px rgba(0,0,0,.35);position:relative;font-size:.95rem}
  .pp-alerte .pp-poignee{cursor:grab;color:var(--sourd);font-size:1.3rem;padding:0 4px;user-select:none;letter-spacing:-2px}
  .pp-alerte b{color:var(--or)}.pp-alerte .pp-txt{flex:1;line-height:1.35}.pp-alerte .pp-txt span{color:var(--texte2)}
  .pp-alerte .btn{white-space:nowrap}.pp-alerte .pp-x{position:absolute;right:8px;top:4px;color:var(--sourd);font-size:.8rem}`; document.head.appendChild(st);
  const outils = document.querySelector('.outils'); const a = document.createElement('div'); a.className = 'pp-alerte'; a.title = 'T-5 : l\'alerte, non bloquante. Saisis la poignée ⠿ pour la déplacer et lire ce qu\'il y a derrière ; « Plus tard » la replie.';
  a.innerHTML = '<span class="pp-poignee" title="Déplacer la boîte">⠿</span><div class="pp-txt"><b>T-5 — il reste 5 minutes.</b> <span>L\'activité en cours : <b style="color:var(--texte)">Activité 2 — Question-bilan</b>, dans les temps. La diapo de fin d\'heure attend — le tableau ne bouge pas tant que tu n\'y vas pas.</span></div><button class="btn or">Aller à la fin d\'heure</button><button class="btn">Plus tard</button>';
  outils.insertAdjacentElement('afterend', a); });
await p(250); await page.screenshot({ path: 'vis/T150-alerte-plein-ecran.png' });
// la même boîte, déplacée à la souris vers le haut-gauche de la diapo (elle flotte)
await ev(() => { const a = document.querySelector('.pp-alerte'); const r = a.getBoundingClientRect(); a.style.cssText += 'position:fixed;left:' + (r.left) + 'px;top:' + (r.top) + 'px;width:' + r.width + 'px;z-index:50;margin:0'; const ph = document.createElement('div'); ph.style.height = r.height + 8 + 'px'; a.insertAdjacentElement('afterend', ph); });
const r = await ev(() => { const b = document.querySelector('.pp-alerte .pp-poignee').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
await page.mouse.move(r[0], r[1]); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(r[0] + 6 * i, r[1] - 48 * i); await ev(([x, y]) => { const a = document.querySelector('.pp-alerte'); a.style.left = (x - 18) + 'px'; a.style.top = (y - 18) + 'px'; }, [r[0] + 6 * i, r[1] - 48 * i]); } await page.mouse.up(); await p(200);
await page.screenshot({ path: 'vis/T150-alerte-deplacee-plein-ecran.png' }); await nav.close(); console.log('captures');
