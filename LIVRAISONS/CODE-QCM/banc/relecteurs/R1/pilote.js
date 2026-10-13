// garde les appareils ouverts ; exécute les snippets envoyés en POST sur :18741
const R = require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");
const fs=require("fs"); const info = JSON.parse(fs.readFileSync(__dirname+"/info.json"));
const http=require("http");
(async()=>{
 const nav = await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
 const D={}; global.D=D;
 const txt=async(p)=>await p.evaluate(()=>document.body.innerText);
 const shot=async(p,n)=>{await p.screenshot({path:__dirname+"/cap/"+n+".png"}); return n;};
 const ouvrir=(q,w,h)=>R.ouvrir(nav,info,q,w,h);
 http.createServer((req,res)=>{let b="";req.on("data",c=>b+=c);req.on("end",async()=>{
   try{ const f=eval("(async()=>{"+b+"})"); const r=await f(); res.end(typeof r==="string"?r:JSON.stringify(r,null,1)); }catch(e){res.end("ERR "+e.stack);} });}).listen(18741);
 console.log("pret");
})();
