#!/usr/bin/env python3
# E3 — le branchement des fonctions `ses*` d'index.html que le contrat §6 attribue à E3.
# usage : python3 brancher-index.py <index.html> [--essai]
#   Retire ce qui tombe (le rendu distant sur l'ancien moteur, la scène à l'ancienne, le téléphone),
#   rebranche ce qui est repris (la page tableau, le poll, le pointeur, l'ouverture, le QR) sur dr-tableau.js.
#   Chaque fonction est trouvée par son nom, à la colonne 0 ; sa fin est la ligne « } » à la colonne 0
#   (ou la même ligne pour une fonction d'une ligne). Rien d'autre n'est touché. Le bilan dit chaque fonction,
#   sa taille avant/après. --essai : n'écrit rien, dit seulement.
import re, sys, hashlib

src = sys.argv[1]; essai = '--essai' in sys.argv
html = open(src, encoding='utf-8').read()
L = html.split('\n')
bilan = []

def trouver(nom):
    pat = re.compile(r'^function ' + re.escape(nom) + r'\(')
    deb = [i for i, l in enumerate(L) if pat.match(l)]
    if len(deb) != 1: raise SystemExit('introuvable ou en double : %s (%d)' % (nom, len(deb)))
    i = deb[0]
    if L[i].rstrip().endswith('}') and L[i].count('{') == L[i].count('}'): return i, i
    j = i + 1
    while j < len(L) and L[j].rstrip() != '}': j += 1
    if j >= len(L): raise SystemExit('fin introuvable : ' + nom)
    return i, j

def remplacer(nom, neuf):
    global L
    i, j = trouver(nom); avant = len('\n'.join(L[i:j + 1]))
    L = L[:i] + (neuf.split('\n') if neuf is not None else []) + L[j + 1:]
    bilan.append('%-24s %7d o -> %s' % (nom, avant, ('%d o' % len(neuf)) if neuf is not None else 'retirée'))

def retirer(nom): remplacer(nom, None)

# ── ce qui tombe (contrat §6, colonne E3 ; plan §4) ──
for n in ['sesPhoto', 'sesEmettre', 'sesPartEmettre', 'sesTabMonter', '_sesTabBoite', '_sesTabComposer', 'sesTabChrono', 'sesTabQui',
          'sesBootTel', 'sesTelChercherCours', 'sesBrancherPiloteTel', 'sesTelGeste', 'sesTelCranPas', 'sesTelCran', 'sesTelMajCran',
          'sesTelChrono', 'sesCurseurFin', 'sesTelPeindre', 'sesTelPart', 'sesPartPeindre', 'sesPartMotifs', 'sesPartMotif',
          'sesPartRetirer', 'sesTelPlus1', 'sesPollPilote']:
    retirer(n)

# ── ce qui est repris et rebranché ──
remplacer('sesOuvrirTableau', '''function sesOuvrirTableau(){ return dr_ouvrirTableau(); }   /* [E3] une seule fenêtre : la page elle-même, ?vue=tableau&local=1 (dr-tableau.js) */''')
remplacer('sesBandeau', '''function sesBandeau(){
  /* [E3] la tête du déroulé (`#at-dr-tete`) tombe avec l'ancien moteur : le bandeau ne se pose que si elle existe.
     « Ouvrir la vue tableau » → la fenêtre unique ; « 📱 Téléphone » tombe (cadrage 1 §13). */
  var t=document.getElementById('at-dr-tete'); if(!t||document.getElementById('ses-etat'))return;
  t.insertAdjacentHTML('beforeend',
    '<span class="ses-etat" id="ses-etat" title="Session multi-appareils">\\u25cf session</span>'
   +'<button class="at-btn ses-tab-btn" onclick="sesOuvrirTableau()" title="'+DR_TAB_BULLE+'">\\u29c9 Ouvrir le tableau</button>'
   +'<button class="at-btn ses-qr-btn" onclick="sesQROuvrir()" title="Montre l\\u2019adresse du tableau en QR, pour l\\u2019ouvrir sur l\\u2019ordinateur de la classe ou une tablette : il suivra le cours tout seul, en lecture seule.">QR du tableau</button>');
}''')
remplacer('sesQROuvrir', '''function sesQROuvrir(){
  /* [E3] l'adresse du TABLEAU distant (le téléphone tombe) ; plus de fermeture au scan : la page tableau n'écrit
     jamais (`/qrScans` restait vide) et l'effacement était un fetch direct (audit F5). On ferme par ✕ ou à côté. */
  var url=window.location.origin+window.location.pathname+'?vue=tableau';
  var img='https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data='+encodeURIComponent(url);
  var d=document.createElement('div'); d.className='ses-qr-fond'; d.id='ses-qr';
  d.innerHTML='<div class="ses-qr-boite"><button class="ses-qr-x" onclick="sesQRFermer()" title="Ferme cette fenêtre">\\u2715</button>'
    +'<h3>\\u29c9 Le tableau sur un autre appareil</h3>'
    +'<p>Scanne avec l\\u2019appareil branché au vidéoprojecteur (ou ouvre l\\u2019adresse dans Chrome) : il attend le cours, puis suit ce que voit la classe. Il n\\u2019écrit jamais rien.</p>'
    +'<img src="'+img+'" alt="QR" width="280" height="280">'
    +'<div class="ses-qr-url">'+url+'</div></div>';
  d.addEventListener('click',function(ev){ if(ev.target===d)sesQRFermer(); });
  document.body.appendChild(d);
}''')
remplacer('sesQRFermer', '''function sesQRFermer(){ var d=document.getElementById('ses-qr'); if(d)d.remove(); }''')
remplacer('sesBootTableau', '''function sesBootTableau(){
  /* [E3] la page tableau : la garde lecture seule (plus haut) est déjà posée. Le rendu n'est plus l'ancien moteur dans une
     toile : c'est `rendre` du socle dans #mur2 (dr-tableau.js). `&local=1` : la fenêtre du pilote, qui reçoit l'état par postMessage. */
  document.title='Tableau \\u2014 MJPC';
  document.addEventListener('DOMContentLoaded',function(){ dr_tabDemarrer(); });
}''')
remplacer('sesTabVeillePointeur', '''function sesTabVeillePointeur(){
  sesGet(FIREBASE_BASE+'/site/cours_actif.json',function(c){
    if(!c||!c.ts||(Date.now()-c.ts)>4*3600*1000)return;   /* plus de cours : l'image RESTE */
    var cle=sesTabCle(c);
    if(!cle||cle===SES.tabPointeur)return;                /* même cours : rien à faire */
    SES.tabPointeur=cle; SES.ctx=c;
    dr_tabDireClasse(c.classeNom||c.classeSlug||'');     /* [E3] l'attente est posée par dr-tableau.js : ses ids y vivent */
    dr_tabMonter();                                        /* [E3] le nouveau cours prend la main : sa copie, puis sa scène */
  });
}''')
remplacer('sesTabChercherCours', '''function sesTabChercherCours(){
  var t=setInterval(function(){
    sesGet(FIREBASE_BASE+'/site/cours_actif.json',function(c){
      if(!c||!c.ts||(Date.now()-c.ts)>4*3600*1000){
        dr_tabDireClasse('Aucun cours en cours');
        return;
      }
      clearInterval(t);
      SES.ctx=c; SES.tabPointeur=sesTabCle(c);
      dr_tabDireClasse(c.classeNom||c.classeSlug||'');
      dr_tabMonter();                                      /* [E3] au lieu de sesTabMonter (l'ancien moteur) */
    });
  },2000);
}''')
remplacer('sesTabPoll', '''function sesTabPoll(){ dr_tabSonder(); }   /* [E3] la scène = l'état du tableau ; rendu par dr_rendreMur (dr-tableau.js) */''')

out = '\n'.join(L)
# la vue téléphone tombe : `?vue=tel` n'est plus un rôle de la page
n1 = out.count("mode:(location.search.match(/[?&]vue=(tableau|tel)/)||[])[1]||null,")
out = out.replace("mode:(location.search.match(/[?&]vue=(tableau|tel)/)||[])[1]||null,", "mode:(location.search.match(/[?&]vue=(tableau)/)||[])[1]||null,   /* [E3] le téléphone tombe */")
n2 = out.count("else if(SES.mode==='tel')sesBootTel();\n")
out = out.replace("else if(SES.mode==='tel')sesBootTel();\n", "")
bilan.append('SES.mode (tableau|tel → tableau) : %d ; boot du téléphone retiré : %d' % (n1, n2))
print('\n'.join(bilan))
print('taille %d -> %d o' % (len(html.encode()), len(out.encode())))
if not essai:
    open(src, 'w', encoding='utf-8').write(out)
    print('écrit ; md5 ' + hashlib.md5(out.encode()).hexdigest())
