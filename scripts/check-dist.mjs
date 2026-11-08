#!/usr/bin/env node
/**
 * Comprueba el HTML generado en dist/ antes de publicarlo.
 *
 * Cada comprobación existe porque algo se rompió de verdad en el sitio
 * anterior: títulos duplicados, canonical con .html, navegación inyectada por
 * JS, ads.txt con mayúsculas, versiones que no coinciden con el CHANGELOG,
 * scripts inline bloqueados por la CSP o assets referenciados que no existen.
 *
 * Uso: node scripts/check-dist.mjs  (requiere haber hecho npm run build)
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://svqtriana.com';

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const read = (path) => readFileSync(path, 'utf8');
const one = (pattern, text) => text.match(pattern)?.[1]?.trim();

const PAGES = [
  { file: 'index.html', path: '/', title: 'PS SVQ Triana | Peña sevillista de Triana, Sevilla' },
  { file: 'nosotros.html', path: '/nosotros', title: 'Nuestra historia | PS SVQ Triana' },
  { file: 'productos.html', path: '/productos', title: 'Material oficial | PS SVQ Triana' },
  { file: 'media.html', path: '/media', title: 'Galería de vídeos | PS SVQ Triana' },
  { file: 'encuentro.html', path: '/encuentro', title: 'Dónde nos vemos | PS SVQ Triana' },
];

const REQUIRED_FILES = [
  'index.html',
  'nosotros.html',
  'productos.html',
  'media.html',
  'encuentro.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'ads.txt',
  'llms.txt',
  'sw.js',
  'CNAME',
  'images/site.webmanifest',
  'images/cartel-27.jpg',
  'favicon.ico',
];

for (const file of new Set(REQUIRED_FILES)) {
  check(existsSync(join(DIST, file)), `falta dist/${file}`);
}

// Ficheros raíz que GitHub Pages sirve tal cual.
check(read(join(DIST, 'CNAME')).trim() === 'svqtriana.com', 'CNAME no apunta a svqtriana.com');
check(
  read(join(DIST, 'ads.txt')).trim() === 'google.com, pub-5217718596352992, DIRECT, f08c47fec0942fa0',
  'ads.txt no conserva la línea de AdSense',
);
check(
  read(join(DIST, 'robots.txt')).includes(`Sitemap: ${SITE}/sitemap.xml`),
  'robots.txt no anuncia /sitemap.xml',
);

const htmlFiles = readdirSync(DIST).filter((name) => name.endsWith('.html'));
const html = new Map(htmlFiles.map((name) => [name, read(join(DIST, name))]));

const titles = new Map();
const canonicals = new Map();

for (const page of PAGES) {
  const text = html.get(page.file);

  check(Boolean(text), `no se generó ${page.file}`);
  if (!text) continue;

  const title = one(/<title>(.*?)<\/title>/s, text);
  check(title === page.title, `${page.file}: título inesperado (${title})`);

  const canonical = one(/<link rel="canonical" href="(.*?)"/, text);
  const expectedCanonical = `${SITE}${page.path}`;
  check(canonical === expectedCanonical, `${page.file}: canonical ${canonical} != ${expectedCanonical}`);
  check(!canonical?.endsWith('.html'), `${page.file}: el canonical conserva .html`);
  check(!canonical?.endsWith('/') || page.path === '/', `${page.file}: el canonical lleva barra final`);

  const ogUrl = one(/<meta property="og:url" content="(.*?)"/, text);
  check(ogUrl === canonical, `${page.file}: og:url ${ogUrl} != canonical ${canonical}`);

  check(/<meta name="description" content="[^"]+"/.test(text), `${page.file}: falta meta description`);
  check(/<html lang="es"/.test(text), `${page.file}: falta lang="es"`);
  check((text.match(/<h1\b/g) ?? []).length === 1, `${page.file}: debe tener exactamente un <h1>`);

  const robots = one(/<meta name="robots" content="([^"]+)"/, text);
  check(robots === 'index, follow', `${page.file}: robots es "${robots}" y debería ser index, follow`);

  // Menú y pie están en el HTML servido (nada de inyectarlos con JS).
  for (const href of ['/#home', '/nosotros', '/productos', '/media', '/encuentro']) {
    check(text.includes(`href="${href}"`), `${page.file}: falta el enlace ${href} en el HTML`);
  }

  // Ningún enlace interno con .html ni con barra final.
  for (const match of text.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = match[1];
    check(!href.endsWith('.html'), `${page.file}: enlace interno con .html (${href})`);
    check(href === '/' || !href.endsWith('/'), `${page.file}: enlace interno con barra final (${href})`);
  }

  titles.set(page.file, title);
  canonicals.set(page.file, canonical);
}

check(titles.size === new Set(titles.values()).size, 'hay títulos duplicados entre páginas');
check(canonicals.size === new Set(canonicals.values()).size, 'hay canonical duplicados entre páginas');

// 404: noindex y enlaces a las cinco secciones.
const notFound = html.get('404.html');
check(notFound !== undefined, 'no se generó 404.html');
if (notFound) {
  check(
    /<meta name="robots" content="noindex, follow"/.test(notFound),
    '404.html: debe ser noindex, follow',
  );
  for (const href of ['/#home', '/nosotros', '/productos', '/media', '/encuentro']) {
    check(notFound.includes(`href="${href}"`), `404.html: falta el enlace ${href}`);
  }
}

// Sin scripts inline ejecutables: la CSP no lleva 'unsafe-inline'.
for (const [file, text] of html) {
  const inline = text.match(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/gi) ?? [];
  check(inline.length === 0, `${file}: ${inline.length} <script> inline ejecutable(s)`);
  check(!/\sstyle="/.test(text), `${file}: contiene atributos style="" inline`);
  check(!/<style\b/i.test(text), `${file}: contiene un bloque <style> inline`);
}

// Nada de assets de terceros (solo enlaces <a>, que no cargan recursos).
for (const [file, text] of html) {
  const remoteScript = text.match(/<script\b[^>]*\bsrc="(?:https?:)?\/\//gi) ?? [];
  const remoteImage = text.match(/<img\b[^>]*\bsrc="(?:https?:)?\/\//gi) ?? [];
  const remoteLink =
    text.match(
      /<link\b[^>]*\brel="(?:stylesheet|preload|icon|manifest|apple-touch-icon)"[^>]*\bhref="(?:https?:)?\/\//gi,
    ) ?? [];
  check(remoteScript.length === 0, `${file}: script remoto (${remoteScript[0]})`);
  check(remoteImage.length === 0, `${file}: imagen remota (${remoteImage[0]})`);
  check(remoteLink.length === 0, `${file}: stylesheet/fuente remota (${remoteLink[0]})`);
}

// JSON-LD parseable y con @context/@type.
for (const [file, text] of html) {
  for (const raw of text.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      const data = JSON.parse(raw[1]);
      check(Boolean(data['@context']), `${file}: JSON-LD sin @context`);
      check(Boolean(data['@type']), `${file}: JSON-LD sin @type`);
    } catch (error) {
      failures.push(`${file}: JSON-LD inválido (${error.message})`);
    }
  }
}

const productosHtml = html.get('productos.html') ?? '';
check(
  (productosHtml.match(/"@type":"Offer"|"@type":"AggregateOffer"/g) ?? []).length === 4,
  'productos.html: el JSON-LD debe listar los 4 productos',
);
check(productosHtml.includes('Pulsera oficial'), 'productos.html: falta la pulsera');

// Galería: seis enlaces a YouTube, ni un iframe.
const mediaHtml = html.get('media.html') ?? '';
const youtubeIds = [
  'Nz1E1GyG1EA',
  'NZbk3zVNMaY',
  'gyamGKXwkMc',
  'BQ16EOFLZEM',
  '0v1XvikTbIo',
  'C85CSoQkVy8',
];
for (const id of youtubeIds) {
  check(mediaHtml.includes(`https://youtu.be/${id}`), `media.html: falta el vídeo ${id}`);
}
check(!/<iframe\b/i.test(mediaHtml), 'media.html: no debe incluir iframes');

// Encuentro: mapa bajo demanda, con enlace externo y sin iframe inicial.
const encuentroHtml = html.get('encuentro.html') ?? '';
check(encuentroHtml.includes('data-map-load'), 'encuentro.html: falta el botón data-map-load');
check(
  encuentroHtml.includes('data-map-src="https://www.google.com/maps/embed'),
  'encuentro.html: falta la URL del mapa de Google',
);
check(!/<iframe\b/i.test(encuentroHtml), 'encuentro.html: el iframe no debe cargarse de inicio');
check(encuentroHtml.includes('Abrir en Google Maps'), 'encuentro.html: falta el enlace a Google Maps');
check(
  /<meta name="robots" content="index, follow"/.test(encuentroHtml),
  'encuentro.html: debe ser indexable',
);

// Pie de página: versión coherente con el CHANGELOG.
const changelog = read(join(ROOT, 'CHANGELOG.md'));
const changelogVersion = changelog.match(/^## (v\d{8}(?:\.\d+)?)/m)?.[1];
check(Boolean(changelogVersion), 'CHANGELOG.md: falta una entrada ## vYYYYMMDD');
for (const page of PAGES) {
  const text = html.get(page.file) ?? '';
  const version = text.match(/class="footer-version[^"]*"[^>]*>(v[^<]+)</)?.[1];
  check(version === changelogVersion, `${page.file}: versión ${version} != ${changelogVersion}`);
}

// Sitemap: las cinco URLs, sin barra final, con lastmod ISO.
const sitemap = read(join(DIST, 'sitemap.xml'));
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const expectedLocs = PAGES.map((page) => `${SITE}${page.path}`);
check(
  JSON.stringify(locs) === JSON.stringify(expectedLocs),
  `sitemap.xml: URLs ${JSON.stringify(locs)} != ${JSON.stringify(expectedLocs)}`,
);
check((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) ?? []).length === 5, 'sitemap.xml: faltan lastmod');

// llms.txt: las cinco páginas, sin la mención obsoleta a la camiseta oficial.
const llms = read(join(DIST, 'llms.txt'));
for (const page of PAGES) {
  check(llms.includes(`${SITE}${page.path}`), `llms.txt: falta ${page.path}`);
}
check(!/camiseta oficial/i.test(llms), 'llms.txt: sigue mencionando la camiseta oficial');
check(llms.includes('Cervecería el Punto de Triana'), 'llms.txt: falta el punto de encuentro');

// Kill-switch del service worker antiguo.
const sw = read(join(DIST, 'sw.js'));
check(sw.includes('caches.keys()'), 'sw.js: falta la limpieza de cachés');
check(sw.includes('registration.unregister()'), 'sw.js: falta unregister()');
check(!/addEventListener\(\s*['"]fetch['"]/.test(sw), 'sw.js: no debe interceptar fetch');

/** Resuelve una URL local contra dist/, como hace GitHub Pages. */
function resolveLocal(url, fromFile) {
  const clean = url.split(/[?#]/)[0];
  if (!clean || clean.startsWith('data:') || clean.startsWith('#')) return null;
  if (/^(?:https?:)?\/\//.test(clean) || /^(?:mailto|tel|javascript):/.test(clean)) return null;

  let base;
  if (clean.startsWith('/')) {
    base = join(DIST, clean.slice(1));
  } else {
    base = resolve(dirname(fromFile), clean);
  }

  const candidates = [base];
  if (clean.endsWith('/')) candidates.push(join(base, 'index.html'));
  if (!/\.\w+$/.test(clean)) candidates.push(`${base}.html`, join(base, 'index.html'));

  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

// Todos los assets y enlaces locales referenciados existen.
for (const [file, text] of html) {
  const fromFile = join(DIST, file);
  const urls = [];

  for (const match of text.matchAll(/\b(?:src|href)="([^"]+)"/g)) urls.push(match[1]);
  for (const match of text.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) urls.push(candidate.trim().split(/\s+/)[0]);
  }

  for (const url of new Set(urls)) {
    if (url.startsWith('data:')) continue;
    if (resolveLocal(url, fromFile) === null) {
      // Los enlaces externos y mailto se ignoran dentro de resolveLocal.
      if (/^(?:https?:)?\/\//.test(url) || /^(?:mailto|tel):/.test(url) || url.startsWith('#')) continue;
      failures.push(`${file}: referencia local rota (${url})`);
    }
  }
}

// Los url() de los CSS también existen.
const astroDir = join(DIST, '_astro');
if (existsSync(astroDir)) {
  for (const name of readdirSync(astroDir).filter((entry) => entry.endsWith('.css'))) {
    const cssFile = join(astroDir, name);
    const css = read(cssFile);
    for (const match of css.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)) {
      const url = match[2];
      if (url.startsWith('data:')) continue;
      if (resolveLocal(url, cssFile) === null && !/^(?:https?:)?\/\//.test(url)) {
        failures.push(`_astro/${name}: asset CSS roto (${url})`);
      }
    }
  }
}

// Ningún PNG generado. El fallback de <Picture> se deriva del formato del
// maestro; si el maestro es WebP o JPEG, un PNG en _astro significa que Astro
// está emitiendo una versión mucho más pesada que el original (pasó con la
// pulsera: 275 kB de PNG para un WebP de 21 kB). Los maestros PNG legítimos
// deberían convertirse antes de importarlos.
if (existsSync(astroDir)) {
  for (const name of readdirSync(astroDir).filter((entry) => entry.endsWith('.png'))) {
    failures.push(`_astro/${name}: PNG generado; revisa el formato del maestro`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} fallo(s) en dist/:\n`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`ok: ${PAGES.length} páginas, 404, sitemap, llms.txt y assets coherentes`);
