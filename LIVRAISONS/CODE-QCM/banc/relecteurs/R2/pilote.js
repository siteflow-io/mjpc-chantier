const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");
const fs=require("fs");const info=JSON.parse(fs.readFileSync(__dirname+"/info.json"));
const P={};let nav;
(async()=>{nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
require("http").createServer((q,r)=>{let b="";q.on("data",d=>b+=d);q.on("end",async()=>{
 try{const f=new Function("P","R","nav","info","fs",`return (async()=>{${b}})()`);const v=await f(P,R,nav,info,fs);r.end(typeof v==="string"?v:JSON.stringify(v,null,1));}catch(e){r.end("ERR "+e.stack);}});}).listen(9871,()=>console.log("pret"));})();
