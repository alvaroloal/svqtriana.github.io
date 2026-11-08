import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Versión mostrada en el footer. Orden de precedencia:
 *   1. PUBLIC_SITE_VERSION, que deploy.yml fija desde CHANGELOG.md.
 *   2. La primera entrada `## vYYYYMMDD` de CHANGELOG.md (build local).
 *   3. La fecha del build, con formato vYYYYMMDD.
 *
 * `import.meta.url` no sirve aquí: durante el build Astro evalúa este módulo
 * desde un bundle temporal, así que la ruta relativa al fuente no existe. Se
 * lee desde la raíz del proyecto, que es el cwd de `astro build` y `astro dev`.
 */
function versionFromChangelog(): string | undefined {
  try {
    const changelog = readFileSync(resolve(process.cwd(), 'CHANGELOG.md'), 'utf8');
    return changelog.match(/^## (v\d{8}(?:\.\d+)?)/m)?.[1];
  } catch {
    return undefined;
  }
}

function versionFromDate(): string {
  return `v${new Date().toISOString().slice(0, 10).replaceAll('-', '')}`;
}

export const siteVersion: string =
  import.meta.env.PUBLIC_SITE_VERSION || versionFromChangelog() || versionFromDate();
