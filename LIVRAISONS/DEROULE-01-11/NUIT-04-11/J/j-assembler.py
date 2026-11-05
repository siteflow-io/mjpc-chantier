# MANDAT J (nuit du 04/11) — une image par paire : l'écran entier avant à gauche, après à droite, une ligne de titre en haut.
# usage : python3 -I j-assembler.py <dossier brut de j-captures.mjs> <dossier des images>
import os, sys
from PIL import Image, ImageDraw, ImageFont
BRUT, SORTIE = sys.argv[1], sys.argv[2]; os.makedirs(SORTIE, exist_ok=True)
F = '/usr/share/fonts/truetype/freefont/FreeSans.ttf'; FB = '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf'   # les chiffres cerclés (⑱, ⑲)
DEMI = 1920  # chaque écran ramené à 1920 x 1080 (le 1920 x 1080 pris en deviceScaleFactor 2, soit 3840 x 2160)
# (fichier, titre, [(sonde, image avant, image après), ...] — une rangée par couple)
PAIRES = [
  ('1-pilote-case-initiales-liste.png', '1 · Le pilote : la case des initiales après une lettre tapée (« m ») — la liste numérotée des prénoms', [('ci', 'J1', 'J1')]),
  ('2-pilote-qui-a-repondu.png', '2 · Le pilote : Entrée dans une réponse sans élève — « Qui a répondu ? »', [('ci', 'J2', 'J2')]),
  ('3-tableau-prenom-reponse.png', '3 · Le tableau : des réponses validées — « Prénom N. » puis la réponse', [('ci', 'J3', 'J3')]),
  ('4-relecture-autre-classe-qui-a-repondu.png', '4 · La Relecture d’une autre classe, entrée par la case du calendrier : la fenêtre « Qui a répondu » (sa classe seule, la case des initiales)', [('rd', 'J4base', 'J4')]),
  ('5-relecture-diapo-en-grand.png', '5 · La Relecture : une diapo de la colonne de gauche ouverte en grand', [('rd', 'J5', 'J5')]),
  ('6-le-chapitre-et-copier-pour-ia.png', '6 · « Le chapitre » : les heures closes, la règle des notions, ce qui manque à une notion ; en bas, « Copier la relecture pour analyse IA »', [('rd', 'J6a', 'J6a')]),
  ('7-pilote-lancement-lent.png', '7 · Un lancement lent (chaque lecture 3 s plus tard), 4 s après « Ouvrir le pilotage et lancer » — en haut, « L’heure se lance… »', [('rl', 'Q4-un-clic-04s', 'Q4-un-clic-04s')]),
]
def ecran(qui, sonde, nom):
  p = os.path.join(BRUT, qui + '-' + sonde, nom + '.png')
  if not os.path.exists(p): return None
  return Image.open(p).convert('RGB').resize((DEMI, DEMI * 9 // 16), Image.LANCZOS)
fT, fE = ImageFont.truetype(FB, 36), ImageFont.truetype(FB, 30)
for fichier, titre, rangs in PAIRES:
  H = DEMI * 9 // 16; G = 16; HT = 66; HE = 46
  im = Image.new('RGB', (DEMI * 2 + G * 3, HT + len(rangs) * (HE + H + G)), (255, 255, 255)); d = ImageDraw.Draw(im)
  d.text((G, 14), titre, font=fT, fill=(20, 20, 20)); manque = []
  for k, (s, av, ap) in enumerate(rangs):
    y = HT + k * (HE + H + G)
    for j, (qui, nom, lib) in enumerate([('avant', av, 'AVANT · 8.85.0-⑱ en ligne'), ('apres', ap, 'APRÈS · 8.86.0-⑲ candidat')]):
      x = G + j * (DEMI + G); e = ecran(qui, s, nom)
      d.text((x, y + 6), lib, font=fE, fill=(150, 30, 30) if j == 0 else (20, 110, 40))
      if e is None: d.rectangle([x, y + HE, x + DEMI, y + HE + H], outline=(150, 30, 30), width=4); d.text((x + 40, y + HE + 40), 'pas d’image', font=fT, fill=(150, 30, 30)); manque.append(qui + ' ' + nom)
      else: im.paste(e, (x, y + HE)); d.rectangle([x - 1, y + HE - 1, x + DEMI, y + HE + H], outline=(120, 120, 120), width=2)
  out = os.path.join(SORTIE, fichier); im.save(out, optimize=True)
  if os.path.getsize(out) > 3_000_000: im.quantize(256).save(out, optimize=True)
  print(fichier, im.size, os.path.getsize(out) // 1024, 'Ko', ('manque ' + ', '.join(manque)) if manque else '')
