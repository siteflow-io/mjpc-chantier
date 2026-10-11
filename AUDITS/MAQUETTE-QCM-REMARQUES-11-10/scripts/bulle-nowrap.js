const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1366,height:768}});
  await p.goto("file://" + process.argv[2] + "#scene=x627-3-editeur"); await p.waitForTimeout(1000);
  const r = await p.evaluate(() => { const t = document.querySelectorAll(".info-i")[11].querySelector(".info-tip"); const out = []; let x = t; while (x && x !== document.body) { const cs = getComputedStyle(x); out.push((x.className || x.tagName).toString().slice(0, 40) + " ws=" + cs.whiteSpace + (x.getAttribute("style") ? " style=" + x.getAttribute("style").slice(0, 80) : "")); x = x.parentElement; } return out; });
  console.log(r.join("\n"));
  await b.close();
})();
