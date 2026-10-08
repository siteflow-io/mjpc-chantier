const path=require("path");const {chromium}=require(path.join(__dirname,"../banc/node_modules/playwright"));
(async()=>{const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});const p=await b.newPage();
await p.goto("file://"+path.join(__dirname,"livret.html"));await p.waitForLoadState("load");await p.waitForTimeout(500);
await p.pdf({path:path.join(__dirname,"LIVRET-FLUX-BINOME.pdf"),format:"A4",landscape:true,printBackground:true,margin:{top:"9mm",bottom:"9mm",left:"10mm",right:"10mm"}});
await b.close();})();
