# BANC de la maquette T374 — par le geste, 1366×768 : forme acceptée (0 du pavé, bouton, bascule, Réglages, recalcul, vue élève) et l'aide « ? » contextuelle.
import json,time
from playwright.sync_api import sync_playwright
ok=[]
def check(n,c,d): ok.append(c); print(('OK  ' if c else 'ÉCHEC ')+n+' — '+json.dumps(d,ensure_ascii=False)[:170])
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/google/chrome/chrome',args=['--no-sandbox']); pg=b.new_page(viewport={'width':1366,'height':768}); err=[]; pg.on('pageerror',lambda e:err.append(str(e)))
    pg.goto('file:///home/claude/MAQ2/T374-maquette-forme-acceptee-aide-v1.html'); time.sleep(.4)
    pave=lambda c: pg.locator('#touches button',has_text=c).first.click()
    aideOn=lambda: 'on' in (pg.locator('#voile').get_attribute('class') or '')
    aideOu=lambda: pg.locator('#aideOu').inner_text()
    # 1. ? ouvre l'aide du mode rapide ; Échap la ferme ; F1 aussi
    pg.keyboard.press('?'); time.sleep(.2); a1=(aideOn(), aideOu()); pg.keyboard.press('Escape'); time.sleep(.1); a2=aideOn(); pg.keyboard.press('F1'); time.sleep(.1); a3=aideOn(); pg.keyboard.press('Escape'); time.sleep(.1)
    check('? ouvre l\'aide « sur un mot », Échap la ferme, F1 l\'ouvre aussi', a1[0] and 'sur un mot' in a1[1] and not a2 and a3, a1)
    # 2. i = illisible (pas ?)
    pg.keyboard.press('i'); time.sleep(.2); check('i = illisible (une erreur I posée)', 'I' in pg.locator('#vueEleve').inner_text() and '1 err' in pg.locator('#compte').inner_text(), pg.locator('#compte').inner_text())
    # 3. G : la case ; l'aide suit (contexte « la case ») ; ? dans la case = texte
    pg.keyboard.press('g'); time.sleep(.2); pg.keyboard.press('F1'); time.sleep(.1); c1=aideOu(); pg.screenshot(path='/home/claude/MAQ2/capture-aide-case.png'); pg.keyboard.press('Escape'); time.sleep(.1)
    pg.locator('#in').focus(); pg.keyboard.type('?'); time.sleep(.1); v=pg.locator('#in').input_value(); pg.locator('#in').fill('')
    check('la case : l\'aide dit « la case » ; ? tapé dans la case = texte', 'case' in c1 and v=='?' and not aideOn(), [c1,v])
    # 4. la liste : « cadavre » ×7 marquée « acceptée chez les Dylan » ; pavé 1 → prise, note −1 (G)
    t=pg.locator('#liste').inner_text(); pave('1'); time.sleep(.3); n1=pg.locator('#noteV').inner_text()
    check('« cadavre » en 1, « acceptée chez les Dylan » ; pavé 1 → prise, l\'erreur G coûte 1 (note 18,5 : I 0,5 + G 1)', 'cadavre' in t and 'chez les Dylan' in t and n1=='19', [t[:60].replace('\n','|'),n1])
    # 5. G, pavé 1, puis 0 du pavé → forme acceptée : note remonte, vue élève « forme acceptée », Réglages la liste
    pg.keyboard.press('g'); time.sleep(.2); pave('1'); time.sleep(.3)   # (prise aussitôt : 10+ n'existe pas) → remplacée ; on rouvre pour accepter
    pg.keyboard.press('g'); time.sleep(.2); pg.locator('#in').fill('cadavre'); pave('0'); time.sleep(.3)
    n2=pg.locator('#noteV').inner_text(); ve=pg.locator('#vueEleve').inner_text(); lg=pg.locator('#log li').all_inner_texts()[-1]
    pg.locator('.onglets button',has_text='Réglages').click(); time.sleep(.2); rg=pg.locator('#reglListe').inner_text(); pg.keyboard.press('?'); time.sleep(.1); c2=aideOu(); pg.screenshot(path='/home/claude/MAQ2/capture-reglages.png'); pg.keyboard.press('Escape')
    check('0 du pavé → forme acceptée : note 20 (G ne coûte plus), l\'élève lit « forme acceptée », Réglages la liste, l\'aide suit (« Réglages »)', n2=='20' and 'forme acceptée' in ve and 'cadavre' in rg and 'Réglages' in c2 and 'FORME ACCEPTÉE' in lg, [n2, rg.replace('\n','|')[:60], c2])
    # 6. retirer dans Réglages → coûte à nouveau
    pg.locator('#reglListe button',has_text='retirer').first.click(); time.sleep(.2); n3=pg.locator('#noteV').inner_text(); check('retirer → la forme coûte à nouveau (note 19)', n3=='19', n3)
    # 7. retour rapide ; G + liste : « cadavre » marquée « acceptée » après un nouveau 0 ; le même 0 l'annule (bascule)
    pg.locator('.onglets button',has_text='rapide').click(); time.sleep(.2); pg.keyboard.press('g'); time.sleep(.2); pave('1'); time.sleep(.2)
    pg.keyboard.press('g'); time.sleep(.2); pg.locator('#in').fill('cadavre'); pave('0'); time.sleep(.3); pg.keyboard.press('g'); time.sleep(.2); t2=pg.locator('#liste').inner_text(); pg.screenshot(path='/home/claude/MAQ2/capture-liste-acceptee.png')
    pg.locator('#in').fill('cadavre'); pave('0'); time.sleep(.3); n4=pg.locator('#noteV').inner_text()
    check('la liste marque « acceptée » ; le même 0 annule (bascule : la note redescend à 19)', 'acceptée' in t2 and n4=='19', [t2[:50].replace('\n','|'), n4])
    # 8. fin de copie : l'aide suit (« Fin de copie »)
    pg.locator('#bTerminer').click(); time.sleep(.2); pg.keyboard.press('F1'); time.sleep(.1); c3=aideOu(); pg.keyboard.press('Escape'); check('fin de copie : l\'aide dit « Fin de copie »', 'Fin de copie' in c3, c3)
    check('0 erreur JS', not err, err)
    b.close()
print('BANC MAQUETTE 374 : '+('VERT' if all(ok) else 'ROUGE'))
