/**
 * Único JavaScript propio del sitio:
 *  - menú móvil <details>: cerrar con Esc, clic fuera o al navegar;
 *  - galerías de producto: botones anterior/siguiente con scroll-snap;
 *  - mapa de Google: cargar el iframe solo al pulsar (click-to-load).
 */
const menus = document.querySelectorAll<HTMLDetailsElement>('details[data-mobile-nav]');

if (menus.length > 0) {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    for (const menu of menus) {
      if (!menu.open) continue;
      menu.open = false;
      menu.querySelector('summary')?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    for (const menu of menus) {
      if (menu.open && !menu.contains(target)) menu.open = false;
    }
  });

  for (const menu of menus) {
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.open = false;
      });
    });
  }
}

const galleryButtons = document.querySelectorAll<HTMLButtonElement>(
  '[data-gallery-prev], [data-gallery-next]',
);

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.galleryTarget;
    const gallery = id ? document.getElementById(id) : null;
    if (!gallery) return;

    const direction = button.hasAttribute('data-gallery-prev') ? -1 : 1;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gallery.scrollBy({
      left: direction * gallery.clientWidth,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  });
});

const mapButtons = document.querySelectorAll<HTMLButtonElement>('[data-map-load]');

mapButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const src = button.dataset.mapSrc;
    if (!src) return;

    // El iframe solo existe tras la interacción: sin cookies de terceros al cargar.
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = button.dataset.mapTitle ?? 'Mapa de Google';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.setAttribute('allowfullscreen', '');
    iframe.className = 'block h-[22rem] w-full border-0';

    button.replaceWith(iframe);
    iframe.focus();
  });
});
