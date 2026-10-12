// QCM-4 · BANC — le relevé d'un écran : son texte, ses gestes, ses infobulles (le même pour la maquette et pour l'app).
// Utilisé par releve-maquette.js (la référence) et par fidelite.js (l'app, au moment de chaque scène).
// Une page Playwright → {texte: [lignes], gestes: [{l, ferme}], bulles: [textes]}, cadres compris, sans le sommaire ⚙ de la maquette.
async function releve(p){
  const un = () => {
    const vis = e => { const r = e.getBoundingClientRect(); if(r.width < 1 || r.height < 1) return false; let x = e; while(x && x.nodeType === 1){ const cs = getComputedStyle(x); if(cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false; x = x.parentElement; } return true; };
    const n = s => (s || "").replace(/[   ]/g, " ").replace(/\s+/g, " ").trim();
    const horsSim = e => !e.closest("#som-racine,.som-gear,.som-fond");
    const docs = [document]; document.querySelectorAll("iframe").forEach(f => { try { if(f.contentDocument && f.contentDocument.body) docs.push(f.contentDocument); } catch(e){} });
    const texte = [], gestes = [], bulles = [];
    for(const d of docs){
      const root = d.getElementById && d.getElementById("root") || d.body;
      (root.innerText || "").split("\n").map(n).filter(Boolean).forEach(l => texte.push(l));
      d.querySelectorAll("button, a[href], [role=button], [data-va], select, input[type=checkbox], input[type=radio], .tc").forEach(e => {
        if(!horsSim(e) || !vis(e)) return;
        const c = e.cloneNode(true); c.querySelectorAll(".info-tip,.info-i").forEach(x => x.remove());
        const l = n(e.tagName === "SELECT" ? (e.options[e.selectedIndex] || {}).text : (c.textContent || e.getAttribute("aria-label") || e.value || ""));
        gestes.push({l, ferme: !!(e.disabled || e.getAttribute("aria-disabled") === "true")});
      });
      d.querySelectorAll("[title]").forEach(e => { if(horsSim(e) && vis(e) && n(e.getAttribute("title"))) bulles.push(n(e.getAttribute("title"))); });
      d.querySelectorAll(".info-tip").forEach(e => { if(horsSim(e) && n(e.textContent)) bulles.push(n(e.textContent)); });
    }
    return {texte, gestes, bulles};
  };
  return p.evaluate(un);
}
// « aux données près » : les noms d'élèves, les nombres, les heures, les dates deviennent des jetons
function donneesPres(s, noms){
  let t = String(s || "");
  for(const nm of (noms || [])){ const esc = nm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); t = t.replace(new RegExp(esc, "g"), "«élève»"); }
  return t.replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g, "«date»").replace(/\b\d{1,2}:\d{2}(:\d{2})?\b/g, "«heure»").replace(/\d+([,.]\d+)?/g, "#").replace(/\s+/g, " ").trim();
}
module.exports = { releve, donneesPres };
