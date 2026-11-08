import sharp from 'sharp';

// El master de la pulsera solo existe en WebP de 386 px. Se convierte a JPEG
// para que el fallback de <Picture> no pese más que el propio original.
await sharp('src/assets/productos/pulsera.webp')
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('src/assets/productos/pulsera.jpg');

console.log('pulsera.jpg generado');
