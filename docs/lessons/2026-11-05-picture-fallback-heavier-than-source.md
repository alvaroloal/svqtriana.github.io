# Un fallback más pesado que el original

## Qué pasó

La pulsera solo tenía un maestro WebP de 386 px. `astro:assets` con
`<Picture formats={['avif', 'webp']}>` usa el formato del fichero de origen
como fallback para navegadores sin AVIF ni WebP, así que el fallback se generó
como PNG: 275 kB para una imagen de 21 kB. El navegador que no soportaba AVIF
ni WebP descargaba trece veces más de lo necesario, y Lighthouse lo notó.

## Mecanismo

`<Picture>` no elige el fallback por tamaño sino por formato: deriva del
`ImageMetadata` del import. Un maestro WebP obliga al fallback a PNG. La
solución no es tocar el componente sino convertir el maestro a JPEG, que
cualquier navegador entiende y que `sharp` comprime bien.

## Qué lo impide ahora

- `src/assets/productos/pulsera.jpg` es el import que usa `productos.ts`;
  `scripts/convert-pulsera.mjs` documenta de dónde salió.
- `scripts/check-dist.mjs` falla si aparece **cualquier** PNG en `dist/_astro/`.
  Todos los maestros del sitio son JPEG o WebP, así que un PNG solo puede venir
  de este fallback. Un presupuesto genérico de kB no habría servido: el cartel
  y varias pegatinas pesan más de 250 kB legítimamente.
