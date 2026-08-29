/* Zählt die Fassung hoch.  npm run fassung  [gross|mittel|klein]

   package.json ist die einzige Wahrheit. Von dort holt der Bau die Nummer
   für den Dienst, für das Anzeigeblatt und für die App selbst — so können
   die drei nicht auseinanderlaufen, wie es bei VANI passieren kann. */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const weg = join(wurzel, 'package.json');
const paket = JSON.parse(readFileSync(weg, 'utf8'));

const [gross, mittel, klein] = paket.version.split('.').map(Number);
const art = (process.argv[2] || 'klein').toLowerCase();

const neu =
  art === 'gross' ? [gross + 1, 0, 0] :
  art === 'mittel' ? [gross, mittel + 1, 0] :
  [gross, mittel, klein + 1];

paket.version = neu.join('.');
writeFileSync(weg, JSON.stringify(paket, null, 2) + '\n');

console.log(`${gross}.${mittel}.${klein}  ->  ${paket.version}`);
console.log('Jetzt: npm run build');
