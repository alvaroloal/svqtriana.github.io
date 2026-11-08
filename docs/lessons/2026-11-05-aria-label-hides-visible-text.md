# Un `aria-label` sustituye al texto visible, no lo completa

## Qué pasó

Los enlaces sociales del pie tenían `aria-label="Contactar por Instagram"` y el
texto visible `@PS_SVQTRIANA`. Axe marcó `label-content-name-mismatch`: el
nombre accesible no contiene el texto que se ve. Un usuario de control por voz
que diga «pulsa @PS_SVQTRIANA» no activa el enlace, porque el nombre que expone
el navegador es otro. Pasaba igual en la tarjeta de producto y en los vídeos.

## Mecanismo

El nombre accesible se calcula con precedencia: `aria-label` gana al contenido.
No es que se sumen; el `aria-label` lo reemplaza. WCAG 2.5.3 (Label in Name)
exige que el texto visible esté contenido en el nombre accesible, así que un
`aria-label` más «limpio» pero distinto es un fallo, no una mejora.

## Qué lo impide ahora

Los `aria-label` incluyen el texto visible
(`Contactar por Instagram: @PS_SVQTRIANA`, `Pídelo: <producto> por Instagram…`)
y el sufijo de pestaña nueva va en un `<span class="sr-only">`, no en un
`aria-label` que oculte el resto. `tests/a11y.spec.ts` ejecuta axe con las
etiquetas WCAG 2.0/2.1 A y AA en las cinco páginas y falla con cualquier
violación `serious` o `critical`.
