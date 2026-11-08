/**
 * Datos del cartel que se usa como imagen social (Open Graph / Twitter).
 *
 * Vive aparte de `temporada.ts` a propósito: `temporada.ts` importa el maestro
 * de la imagen, y `site.ts` (que usan todas las páginas) solo necesita la ruta
 * pública y el alt. Separarlo evita arrastrar el asset a todos los módulos.
 *
 * Al cambiar de temporada se editan los tres valores aquí y el import de
 * `temporada.ts`. Lo comprueba `npm run check:dist` (og:image y JSON-LD).
 */
export const cartelOg = '/images/cartel-27.jpg';
export const cartelOgSize = { width: 1131, height: 1600 };
export const cartelAlt =
  'Cartel oficial de la temporada 2026/2027 de PS SVQ Triana: renovación 20€ (28€ con camiseta) y nueva alta 25€ (35€ con camiseta)';
