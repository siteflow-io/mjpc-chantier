const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1536,height:864}});
  await p.goto("file://" + V + "#scene=x627-3-editeur"); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const m = document.querySelector("#root .modal"); const cs = getComputedStyle(m); const r = m.getBoundingClientRect();
    const t = [...document.querySelectorAll("#root *")].find(e => e.children.length === 0 && /Il reste à compléter/.test(e.textContent));
    return {modal: [Math.round(r.top), Math.round(r.bottom)], ovY: cs.overflowY, sh: m.scrollHeight, ch: m.clientHeight, maxH: cs.maxHeight, parentOv: getComputedStyle(m.parentElement).overflowY, parentSh: m.parentElement.scrollHeight, parentCh: m.parentElement.clientHeight, txt: t ? Math.round(t.getBoundingClientRect().top) : null}; });
  console.log(JSON.stringify(r));
  await p.mouse.move(768, 500); for (let i = 0; i < 20; i++) await p.mouse.wheel(0, 800); await p.waitForTimeout(400);
  const r2 = await p.evaluate(() => { const t = [...document.querySelectorAll("#root *")].find(e => e.children.length === 0 && /Il reste à compléter/.test(e.textContent)); return t ? Math.round(t.getBoundingClientRect().top) : null; });
  console.log("après molette, texte à y=", r2);
  await p.screenshot({path: "v004-bas.png"});
  await b.close();
})();
