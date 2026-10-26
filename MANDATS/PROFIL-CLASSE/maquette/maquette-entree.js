/* MAQUETTE SEULEMENT — l'entrée du professeur sans code (le fichier ouvert hors de son adresse habituelle n'a ni la clé ni l'empreinte
   de l'appareil) : à l'ouverture, la session prof s'ouvre d'elle-même (`loginAsProf`, l'entrée quotidienne de Paul) et l'emploi du
   temps paraît comme à son arrivée (`edtArriveeProf`). Ce bloc n'est PAS du code à promouvoir : il n'existe que dans la maquette. */
window.addEventListener('load',function(){
  setTimeout(function(){
    try{ if(typeof TRACK==='object'&&TRACK&&TRACK.eleve)return; }catch(e){}
    try{ loginAsProf(); }catch(e){ try{ document.body.classList.add('admin-mode'); edtOuvrir(); }catch(e2){} }
    var voile=function(){ var o=document.getElementById('fi-overlay'); if(o)o.remove(); };
    setTimeout(voile,800); setTimeout(voile,2500); setTimeout(voile,5000);
  },1200);
});
