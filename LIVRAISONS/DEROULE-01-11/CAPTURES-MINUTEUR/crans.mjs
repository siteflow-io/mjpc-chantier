import { createRequire } from 'module'; const req = createRequire(import.meta.url); const { chromium } = req('playwright');
const OR = '#e4b45c', BRUN = '#3a2c14'; const coul = f => f > 0.5 ? '#4f9d5d' : f > 0.25 ? '#e0b83a' : f > 0.1 ? '#e07b2e' : '#e8484c';
const L = 2 * Math.PI * 64; const D = 10;
const carte = (s, lib) => { const f = s / D; return `<figure><div class="c"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="14"/><circle cx="80" cy="80" r="64" fill="none" stroke="${coul(f)}" stroke-width="14" stroke-linecap="round" transform="rotate(-90 80 80)" stroke-dasharray="${f * L} ${L}"/></svg><b>00:${String(s).padStart(2, '0')}</b></div><figcaption>${lib}</figcaption></figure>`; };
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fffdf8;font-family:Georgia,serif;display:flex;gap:36px;justify-content:center;align-items:center;height:100vh}
figure{margin:0;text-align:center}.c{width:420px;height:140px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:14px;padding:0 18px;background:${BRUN};border:1px solid rgba(228,180,92,.55);border-radius:18px}
svg{width:108px;height:108px}b{font:700 76px "EB Garamond",Georgia,serif;color:${OR};letter-spacing:.03em}figcaption{margin-top:14px;font-size:24px;color:#2a2f3a}</style>
${carte(10, 'vert : plus de la moitié (10 à 6 s)')}${carte(5, 'jaune : jusqu’au quart (5 à 3 s)')}${carte(2, 'orange : jusqu’au dixième (2 s)')}${carte(1, 'rouge : le dernier dixième (1 à 0 s)')}`;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 360 }, deviceScaleFactor: 2 }); await pg.setContent(html); await pg.waitForTimeout(300);
await pg.screenshot({ path: process.argv[2] }); await b.close();
