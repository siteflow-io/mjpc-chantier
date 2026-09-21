# régénère une maquette à partir d'un gabarit : les trois zones (/*__DATA__*/, /*__ELEVES__*/, /*__RECIT__*/, consécutives dans le <script>) sont reprises de la maquette v9c13
import sys
tpl_ref = open('vis/v9c13-template.html', encoding='utf-8').read(); maq_ref = open('C12/maquette-v9c13-courante.html', encoding='utf-8').read()
deb = '<script>\n/*__DATA__*/\n/*__ELEVES__*/\n/*__RECIT__*/\n'; i = tpl_ref.index(deb); avant = tpl_ref[i - 80:i + len('<script>\n')]; apres = tpl_ref[i + len(deb):i + len(deb) + 80]
ia = maq_ref.index(avant) + len(avant); ib = maq_ref.index(apres, ia); BLOC = maq_ref[ia:ib]
tpl = open(sys.argv[1], encoding='utf-8').read(); out = tpl.replace('/*__DATA__*/\n/*__ELEVES__*/\n/*__RECIT__*/\n', BLOC)
open(sys.argv[2], 'w', encoding='utf-8').write(out); print('généré', sys.argv[2], len(out), 'octets · bloc repris', len(BLOC))
