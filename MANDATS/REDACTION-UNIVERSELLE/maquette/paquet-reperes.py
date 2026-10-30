# Deux copies inventées écrites sur la copie vierge de l'appli (repères aux coins, lignes à leur place), scannées de travers.
from PIL import Image, ImageDraw, ImageFont
import sys
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerifCondensed-Italic.ttf', 30)
K = 1240 / 210   # points par millimètre
def mm(v): return int(round(v * K))
L = open('paquet-essai.py', encoding='utf8').read().split('TEXTE = """')[1].split('"""')[0].split('\n')
def copie(nom, nl, angle):
    im = Image.new('RGB', (1240, 1754), (255, 255, 255)); d = ImageDraw.Draw(im)
    for i in range(30): y = mm(36 + 8 * i); d.line([(mm(27), y), (mm(195), y)], fill=(188, 208, 232), width=2)
    d.line([(mm(35), mm(28)), (mm(35), mm(270))], fill=(240, 184, 184), width=2)
    for i, (x, y) in enumerate([(20, 20), (190, 20), (190, 277), (20, 277)]):
        d.rectangle([mm(x - 8), mm(y - 8), mm(x + 8), mm(y + 8)], fill=(0, 0, 0))
        if i == 0: d.rectangle([mm(x - 4), mm(y - 4), mm(x + 4), mm(y + 4)], fill=(255, 255, 255))
    d.text((mm(120), mm(27) - 34), nom, font=F, fill=(40, 55, 140))
    for i, t in enumerate(L[:nl]): d.text((mm(37), mm(36 + 8 * i) - 36), t, font=F, fill=(38, 56, 150))
    fond = Image.new('RGB', (1400, 1900), (205, 205, 200)); r = im.rotate(angle, expand=True, fillcolor=(205, 205, 200), resample=Image.BICUBIC)
    fond.paste(r.resize((int(r.width * 0.95), int(r.height * 0.95))), (40, 30)); return fond
P = [copie('BESNARD Tom', 24, 2.2), copie('COLAS Raphaël', 17, -1.4)]
P[0].save(sys.argv[1], save_all=True, append_images=P[1:], resolution=150); print(sys.argv[1], len(P), 'pages')
