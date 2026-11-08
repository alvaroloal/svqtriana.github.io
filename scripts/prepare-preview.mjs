#!/usr/bin/env node
/**
 * Prepara `dist/` para una vista previa en Cloudflare Pages.
 *
 * No toca producción y no publica nada: solo escribe los ficheros que Cloudflare
 * Pages lee y que GitHub Pages ignora.
 *
 *   - `_headers`: la CSP real (la misma de `infra/cloudflare/csp.txt`), noindex
 *     y caché larga para los assets con hash.
 *   - `robots.txt`: Disallow / para que un crawler no siga el sitemap de
 *     producción desde una URL de revisión.
 *   - elimina `CNAME`, que solo entiende GitHub Pages y aquí confunde.
 *
 * Uso: node scripts/prepare-preview.mjs   (después de npm run build)
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('No hay dist/index.html. Ejecuta `npm run build` antes.');
  process.exit(1);
}

const cspPath = join(ROOT, 'infra/cloudflare/csp.txt');
if (!existsSync(cspPath)) {
  console.error('Falta infra/cloudflare/csp.txt: la CSP es la fuente única.');
  process.exit(1);
}

const csp = readFileSync(cspPath, 'utf8').trim();
if (!csp.startsWith("default-src 'self'") || csp.includes('\n')) {
  console.error('infra/cloudflare/csp.txt debe ser una sola línea que empiece por default-src.');
  process.exit(1);
}

function git(command, fallback) {
  try {
    return execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return fallback;
  }
}

const commit = git('git rev-parse --short HEAD', 'sin-git');
const built = new Date().toISOString();

const headers = `# Generado por scripts/prepare-preview.mjs para Cloudflare Pages.
# No se versiona: vive en dist/ y solo existe en la vista previa.
/*
  Content-Security-Policy: ${csp}
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-Robots-Tag: noindex, nofollow
  X-Preview-Commit: ${commit}
  X-Preview-Built: ${built}

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-store
`;

writeFileSync(join(DIST, '_headers'), headers, 'utf8');

writeFileSync(
  join(DIST, 'robots.txt'),
  '# Vista previa: no indexar. Producción usa public/robots.txt.\nUser-agent: *\nDisallow: /\n',
  'utf8',
);

if (existsSync(join(DIST, 'CNAME'))) {
  rmSync(join(DIST, 'CNAME'));
}

console.log('dist/ preparado para Cloudflare Pages');
console.log(`  commit: ${commit}`);
console.log('  cabeceras: noindex, CSP de infra/cloudflare/csp.txt, /_astro/* inmutable');
console.log('  robots.txt: Disallow /');
console.log('  CNAME: eliminado (solo lo usa GitHub Pages)');
