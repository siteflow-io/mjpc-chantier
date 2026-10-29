# Banc des repères : fabrique, à partir de la feuille imprimée (200 dpi), une feuille écrite, un scan, deux photos de téléphone
# (à plat et pliée), avec la vérité de terrain (millimètres de la page → points de l'image) pour juger la page de test.
import cv2, numpy as np, json, sys, math
from PIL import Image
D = sys.argv[1]
PX = 200 / 25.4                       # points par mm de la feuille rendue
f = cv2.imread(D + '/feuille.png')     # 1656 × 2339
H0, W0 = f.shape[:2]
rng = np.random.default_rng(7)
# ── une écriture : des boucles cursives bleues sur les lignes 52 à 116 mm ──
papier = f.copy()
for y in range(52, 121, 8):
    x = 40.0
    while x < 185:
        mot = rng.uniform(10, 26); pts = []
        for t in np.linspace(0, 1, int(mot * 6)):
            xx = x + t * mot; yy = y - 2.2 - 2.0 * math.sin(t * mot * 1.9) - (2.5 if rng.random() < 0.08 else 0)
            pts.append((xx * PX, yy * PX))
        cv2.polylines(papier, [np.array(pts, np.int32)], False, (150, 60, 25), 3, cv2.LINE_AA)
        x += mot + rng.uniform(3, 6)
cv2.imwrite(D + '/papier.png', papier)
verite = {}
# ── le scan : un léger biais et une petite réduction, comme au photocopieur ──
ang, ech = 0.7, 0.985
M = cv2.getRotationMatrix2D((W0 / 2, H0 / 2), ang, ech); M[0, 2] += 18; M[1, 2] += 12
scan = cv2.warpAffine(papier, M, (W0 + 40, H0 + 30), borderValue=(255, 255, 255))
scan = cv2.cvtColor(cv2.cvtColor(scan, cv2.COLOR_BGR2GRAY), cv2.COLOR_GRAY2BGR)
scan = np.clip(scan.astype(float) * 0.97 + rng.normal(0, 3, scan.shape), 0, 255).astype(np.uint8)
cv2.imwrite(D + '/scan.jpg', scan, [cv2.IMWRITE_JPEG_QUALITY, 85])
Image.open(D + '/scan.jpg').save(D + '/scan.pdf', resolution=200)
A = np.vstack([M, [0, 0, 1]]) @ np.diag([PX, PX, 1])
verite['scan'] = {'H': A.tolist(), 'w': scan.shape[1], 'h': scan.shape[0]}
# ── la photo : la feuille de travers sur une table sombre, lumière inégale, flou, bruit ──
def photo(src, nom, coins):
    PW, PH = 3024, 4032
    Hp = cv2.getPerspectiveTransform(np.float32([[0, 0], [W0, 0], [W0, H0], [0, H0]]), np.float32(coins))
    fond = np.zeros((PH, PW, 3), np.uint8); fond[:] = (40, 55, 75)
    fond = np.clip(fond + rng.normal(0, 12, fond.shape), 0, 255).astype(np.uint8)
    feuille = cv2.warpPerspective(src, Hp, (PW, PH))
    masque = cv2.warpPerspective(np.full((H0, W0), 255, np.uint8), Hp, (PW, PH))
    img = np.where(masque[..., None] > 0, feuille, fond)
    yy, xx = np.mgrid[0:PH, 0:PW]; lum = 0.72 + 0.28 * (xx / PW) * (1 - 0.3 * yy / PH)
    img = np.clip(img * lum[..., None] + rng.normal(0, 4, img.shape), 0, 255).astype(np.uint8)
    img = cv2.GaussianBlur(img, (0, 0), 1.6)
    cv2.imwrite(D + '/' + nom + '.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 80])
    verite[nom] = {'H': (Hp @ np.diag([PX, PX, 1])).tolist(), 'w': PW, 'h': PH}
coins = [[700, 900], [2420, 780], [2650, 3330], [480, 3420]]
photo(papier, 'photo', coins)
# la même feuille pliée : un bombement de 2,5 mm au plus au milieu, nul aux bords
gy, gx = np.mgrid[0:H0, 0:W0].astype(np.float32)
bosse = (2.5 * PX) * np.sin(np.pi * gx / W0) * np.sin(np.pi * gy / H0)
pliee = cv2.remap(papier, gx, gy - bosse, cv2.INTER_LINEAR, borderValue=(255, 255, 255))
verite['bosse_mm'] = 2.5
photo(pliee, 'photo-pliee', coins)
# une image vidéo de téléphone (1280 × 720) pour chronométrer la reconnaissance du cadre
p = cv2.imread(D + '/photo.jpg'); v = cv2.resize(cv2.rotate(p, cv2.ROTATE_90_CLOCKWISE), (1280, 720)); cv2.imwrite(D + '/video.jpg', v, [cv2.IMWRITE_JPEG_QUALITY, 80])
json.dump(verite, open(D + '/verite.json', 'w'))
print('ok', {k: (v['w'], v['h']) for k, v in verite.items() if isinstance(v, dict)})
