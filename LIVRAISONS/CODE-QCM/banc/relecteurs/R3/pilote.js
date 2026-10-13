// petit pilote : garde les pages ouvertes, exécute du code envoyé par HTTP
const http=require("http"),fs=require("fs");
const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");
const info=JSON.parse(fs.readFileSync(__dirname+"/info.json"));
const P={};let nav;
(async()=>{nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
http.createServer((req,res)=>{let b="";req.on("data",d=>b+=d);req.on("end",async()=>{
 try{const f=new Function("P","R","info","nav","fs","return (async()=>{"+b+"})()");const r=await f(P,R,info,nav,fs);res.end(typeof r==="string"?r:JSON.stringify(r,null,1));}
 catch(e){res.end("ERR "+e.stack);} });}).listen(9799);console.log("ok");})();
