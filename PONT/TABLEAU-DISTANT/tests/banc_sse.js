// D② — mesure de latence RÉELLE : EventSource (SSE REST) depuis un navigateur, sur le hub,
// dans le nœud _test_ses uniquement. Écritures faites par Node (curl-like), pas par la page.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
const HUB='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
(async()=>{
  const browser=await puppeteer.launch({args:[...chromium.args],executablePath:await chromium.executablePath(),headless:'shell'});
  const page=await browser.newPage();
  await page.goto('https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/_test_ses/ping.json',{waitUntil:'domcontentloaded'});
  const res=page.evaluate(async(HUB)=>{
    return await new Promise((res)=>{
      const recu=[]; let es;
      try{ es=new EventSource(HUB+'/_test_ses/scene.json'); }
      catch(e){ return res({eventSourceDispo:false, err:String(e)}); }
      es.addEventListener('put',ev=>{
        let d=null; try{ d=JSON.parse(ev.data); }catch(e){}
        recu.push({tArrivee:Date.now(), data:d&&d.data});
      });
      es.onerror=()=>recu.push({erreur:true,tArrivee:Date.now()});
      setTimeout(()=>{ es.close(); res({eventSourceDispo:true, recu}); },14000);
    });
  },HUB);
  // pendant ce temps, Node écrit 3 fois avec horodatage d'émission
  const emissions=[];
  for(let i=1;i<=3;i++){
    await new Promise(r=>setTimeout(r,2500));
    const t=Date.now();
    await fetch(HUB+'/_test_ses/scene.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({ecran:i,tEmission:t})});
    emissions.push({i,t});
  }
  const out=await res;
  const lat=[];
  (out.recu||[]).forEach(r=>{ if(r.data&&r.data.tEmission)lat.push(r.tArrivee-r.data.tEmission); });
  console.log(JSON.stringify({eventSourceDispo:out.eventSourceDispo, evenements:(out.recu||[]).length,
    latencesMs:lat, erreurs:(out.recu||[]).filter(r=>r.erreur).length},null,1));
  await fetch(HUB+'/_test_ses.json',{method:'DELETE'});
  await browser.close();
})();
