/**
 * generate-icons.mjs
 *
 * Generates PWA icon PNGs from public/favicon.svg using sharp.
 * Run once during project setup:
 *   node scripts/generate-icons.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const svgPath = resolve(projectRoot, 'public', 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

const targets = [
  { size: 512, dest: resolve(projectRoot, 'public', 'icon-512.png') },
  { size: 192, dest: resolve(projectRoot, 'public', 'icon-192.png') },
  { size: 180, dest: resolve(projectRoot, 'public', 'apple-touch-icon.png') },
  { size: 32,  dest: resolve(projectRoot, 'public', 'favicon-32x32.png') },
];

for (const { size, dest } of targets) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(dest);
  console.log(`✓ ${size}×${size}  →  ${dest}`);
}

// Write a tiny favicon.ico placeholder (browsers will use favicon.svg first)
// Duplicate the 32x32 PNG as a simple .ico substitute (binary-compatible enough)
const favicon32 = readFileSync(resolve(projectRoot, 'public', 'favicon-32x32.png'));
writeFileSync(resolve(projectRoot, 'public', 'favicon.ico'), favicon32);
console.log('✓ favicon.ico  (copy of favicon-32x32.png)');

console.log('\nAll icons generated.');
