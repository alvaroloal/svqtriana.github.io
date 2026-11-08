# Blanco al 80 % sobre rojo no llega a 4,5:1

## Qué pasó

La tarjeta de precios destacada usaba `text-white/80` y `text-white/85` sobre
`bg-sevilla-500` (#df0606). Axe calculó 3,51:1 y 3,86:1. El texto era pequeño
(12 y 14 px), así que el umbral AA es 4,5:1. El rojo de marca es oscuro pero no
tanto: cualquier blanco con alfa pierde el contraste que el blanco puro sí tiene
(5,2:1).

## Mecanismo

El contraste se calcula sobre el color **compuesto**, no sobre el declarado. Un
`/80` de Tailwind no es «un blanco suave»: es blanco mezclado con el fondo, y el
resultado se acerca al rojo. En una tarjeta con texto de 12 px no hay margen.

## Qué lo impide ahora

`PriceCard.astro` usa `text-white` para la etiqueta y el precio con camiseta en
la variante destacada. `tests/a11y.spec.ts` ejecuta axe en `/` y falla si
`color-contrast` vuelve a aparecer como `serious` o `critical`. La paleta y los
pares verificados están en `MIGRACION-ASTRO.md` §6.2.
