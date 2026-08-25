# MICRO 8.67.1 — LE T-5 NOMME LES NOTIONS (conscience n°10, promu le 25/08/2026 sur promeus de Paul)
Base : 8.67.0 md5 9968969807aae52052ca0e6254d3daf9 · Promu : commit 0a954dfbc77696e7b80307ef42bd9b2dd7ae014f, md5 d93207f7d49fbd673955a9567a010bfe, 1 490 438 o, vérifié bit à bit au commit et sur main.
Défaut (constat de Paul, mesuré au banc) : la modale T-5 affichait les notions en codes bruts (litt-036, tr-personne-02…).
Cause prouvée : (A) CH.taxo et TAXO_CACHE nuls au moment du T-5 ; (B) atTaxoLibelle ne résolvait que francaisC4.
Diff (3 remplacements, 12 lignes) : APP_VERSION 8.67.1 · chChargerTaxo(function(){}) au passage en régime classe (lancement) · atTaxoLibelle voie ① par chIdsTaxo (notions + francaisC4 + transversales). Moteur base64 intact (SHA-256 dd338b0e…).
Preuve : même banc avant/après, cinq codes → cinq intitulés en clair ; capture écran entier de la modale (t5-candidat-8.67.1.png dans la conversation). Repli inchangé si le hub ne répond pas.
Point de retour : 8.67.0.
