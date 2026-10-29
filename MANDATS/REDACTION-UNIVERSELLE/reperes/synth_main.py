# Banc des repères, sans imprimante : une copie écrite sur toute la page, quatre carrés dessinés au feutre (pas aux places
# prévues, un peu tordus), une photo de référence prise d'au-dessus, une photo de travers, la même feuille bombée.
import cv2, numpy as np, json, sys, math
D = sys.argv[1]
PX = 200 / 25.4; W0, H0 = round(210 * PX), round(297 * PX)
rng = np.random.default_rng(11)
f = np.full((H0, W0, 3), 252, np.uint8)
for y in range(24, 290, 8): cv2.line(f, (0, int(y * PX)), (W0, int(y * PX)), (236, 214, 201), 2)          # lignes (BGR, bleu pâle)
cv2.line(f, (int(40 * PX), 0), (int(40 * PX), H0), (190, 190, 245), 2)                                    # marge rouge pâle
for y in range(48, 260, 8):                                                                                # l'écriture, toute la page
    x = 44.0 + rng.uniform(0, 6)
    while x < 186:
        mot = rng.uniform(8, 24); pts = []
        for t in np.linspace(0, 1, int(mot * 7)):
            xx = x + t * mot; yy = y - 2.0 - 1.8 * math.sin(t * mot * rng.uniform(1.6, 2.3)) - (2.6 if rng.random() < 0.06 else 0)
            pts.append((xx * PX, yy * PX))
        cv2.polylines(f, [np.array(pts, np.int32)], False, (140, 55, 30), 3, cv2.LINE_AA)
        x += mot + rng.uniform(2.5, 5.5)
vrais = [[22, 18], [187, 23], [192, 271], [17, 281]]                                                       # les carrés au feutre : à peu près, pas aux places prévues
for i, ((cx, cy), ang) in enumerate(zip(vrais, [-4, 3, -2, 5])):
    rect = ((cx * PX, cy * PX), (15 * PX, 14.5 * PX), ang)
    cv2.fillPoly(f, [cv2.boxPoints(rect).astype(np.int32)], (25, 25, 25))
    if i == 0: cv2.fillPoly(f, [cv2.boxPoints(((cx * PX, cy * PX), (7 * PX, 6.5 * PX), ang)).astype(np.int32)], (252, 252, 252))
for _ in range(400):                                                                                       # le feutre laisse des traînées claires
    cx, cy = vrais[rng.integers(0, 4)]; x, y = (cx + rng.uniform(-7, 7)) * PX, (cy + rng.uniform(-7, 7)) * PX
    cv2.line(f, (int(x), int(y)), (int(x + rng.uniform(-12, 12)), int(y + rng.uniform(-2, 2))), (90, 90, 90), 1)
verite = {'vrais': vrais}
def photo(src, nom, coins, flou=1.5):
    PW, PH = 3024, 4032
    Hp = cv2.getPerspectiveTransform(np.float32([[0, 0], [W0, 0], [W0, H0], [0, H0]]), np.float32(coins))
    fond = np.clip(np.full((PH, PW, 3), (40, 55, 75), float) + rng.normal(0, 12, (PH, PW, 3)), 0, 255).astype(np.uint8)
    feuille = cv2.warpPerspective(src, Hp, (PW, PH)); masque = cv2.warpPerspective(np.full((H0, W0), 255, np.uint8), Hp, (PW, PH))
    img = np.where(masque[..., None] > 0, feuille, fond)
    yy, xx = np.mgrid[0:PH, 0:PW]; lum = 0.75 + 0.25 * (xx / PW) * (1 - 0.3 * yy / PH)
    img = np.clip(img * lum[..., None] + rng.normal(0, 4, img.shape), 0, 255).astype(np.uint8)
    img = cv2.GaussianBlur(img, (0, 0), flou); cv2.imwrite(D + '/' + nom + '.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 82])
    verite[nom] = {'H': (Hp @ np.diag([PX, PX, 1])).tolist(), 'w': PW, 'h': PH}
photo(f, 'main-reference', [[230, 300], [2800, 270], [2840, 3720], [190, 3760]], 1.1)
photo(f, 'main-photo', [[700, 900], [2420, 780], [2650, 3330], [480, 3420]])
gy, gx = np.mgrid[0:H0, 0:W0].astype(np.float32)
bosse = (2.5 * PX) * np.sin(np.pi * gx / W0) * np.sin(np.pi * gy / H0)
photo(cv2.remap(f, gx, gy - bosse, cv2.INTER_LINEAR, borderValue=(252, 252, 252)), 'main-pliee', [[700, 900], [2420, 780], [2650, 3330], [480, 3420]])
verite['bosse_mm'] = 2.5
json.dump(verite, open(D + '/verite-main.json', 'w')); print('ok')
