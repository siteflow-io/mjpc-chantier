const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");const info=require("./info.json");
const pw=require("/opt/node22/lib/node_modules/playwright");const fs=require("fs");
const S={R,info};
(async()=>{S.nav=await pw.chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
S.txt=async(p)=>(await p.evaluate(()=>document.body.innerText)).replace(/\n\s*\n/g,"\n");
S.cap=async(p,n)=>p.screenshot({path:"cap/"+n+".png",fullPage:true});
fs.writeFileSync("ready","1");
for(;;){ if(fs.existsSync("cmd.js")){const c=fs.readFileSync("cmd.js","utf8");fs.unlinkSync("cmd.js");let out;
 try{out=await (eval("(async()=>{"+c+"})")());}catch(e){out="ERR "+e.stack;}
 fs.writeFileSync("out.txt",String(out===undefined?"ok":(typeof out=="string"?out:JSON.stringify(out,null,1))));}
 await new Promise(r=>setTimeout(r,150));}})();
