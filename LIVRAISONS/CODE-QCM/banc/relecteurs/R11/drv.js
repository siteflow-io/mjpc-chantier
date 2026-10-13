const fs=require("fs");const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");const info=JSON.parse(fs.readFileSync(__dirname+"/info.json"));
const D=__dirname+"/q/";const G={};
(async()=>{G.nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
G.c=await R.ouvrir(G.nav,info,"?mode=prof",1536,864);G.t=await R.ouvrir(G.nav,info,"?mode=prof&view=phone",390,844);G.b=await R.ouvrir(G.nav,info,"?mode=prof&view=board",1536,864);
G.txt=async p=>(await p.evaluate(()=>document.body.innerText));
G.btn=async p=>(await p.$$eval("button,select,input",e=>e.filter(x=>x.offsetParent).map(x=>(x.innerText||x.value||x.tagName).trim().replace(/\s+/g," ")).join(" | ")));
G.clk=async(p,s)=>{const l=p.locator("button:visible",{hasText:s}).first();await l.click({timeout:4000});await p.waitForTimeout(700);};
G.shot=async(n)=>{for(const k of ["c","t","b"]) if(G[k]) await G[k].screenshot({path:__dirname+"/cap/"+n+"-"+k+".png",fullPage:k=="t"});};
G.info=info;G.R=R;
fs.writeFileSync(D+"ready","1");
while(true){for(const f of fs.readdirSync(D).filter(f=>f.endsWith(".js"))){const code=fs.readFileSync(D+f,"utf8");fs.unlinkSync(D+f);let out;
 try{out=await (eval("(async()=>{"+code+"})()"));}catch(e){out="ERR "+e.message.slice(0,500);}
 fs.writeFileSync(D+f.replace(".js",".out"),typeof out=="string"?out:JSON.stringify(out,null,1));}
 await new Promise(r=>setTimeout(r,200));}})();
