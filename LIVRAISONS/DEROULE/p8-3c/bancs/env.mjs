// L'environnement des bancs : rien d'écrit en dur. Trois variables, chacune avec un défaut relatif au dossier de la livraison.
//   MJPC_MAQUETTE : la maquette jouée (chemin de fichier)  · défaut : la maquette de cette livraison, maquette-pilotage-ordi-v9c15p8-manipulable.html
//   MJPC_CHROMIUM : l'exécutable de Chromium              · défaut : le Chromium de Playwright
//   MJPC_CAPTURES : le dossier des captures              · défaut : captures/ de la livraison
//   MJPC_PLAYWRIGHT (facultatif) : le module Playwright  · défaut : « playwright », installé par npm dans le dossier de la livraison
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath, pathToFileURL } from 'node:url';
export const LIVRAISON = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pw = await import(process.env.MJPC_PLAYWRIGHT ? pathToFileURL(path.resolve(LIVRAISON, process.env.MJPC_PLAYWRIGHT)).href : 'playwright');
export const chromium = pw.chromium;
export const CHROMIUM = process.env.MJPC_CHROMIUM ? path.resolve(LIVRAISON, process.env.MJPC_CHROMIUM) : undefined;
export const MAQUETTE = pathToFileURL(path.resolve(LIVRAISON, process.env.MJPC_MAQUETTE || 'maquette-pilotage-ordi-v9c15p8-manipulable.html')).href;
export const CAPTURES = path.resolve(LIVRAISON, process.env.MJPC_CAPTURES || 'captures'); fs.mkdirSync(CAPTURES, { recursive: true });
export const capture = nom => path.join(CAPTURES, nom);
