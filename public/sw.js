// public/sw.js — Kill-switch del service worker de la web antigua (<= v20260905).
// Mantener publicado al menos 6 meses tras la migración. No registrar desde ninguna página.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('svq-triana-')).map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      // Recarga para que la página salga del control del SW y pida la versión nueva.
      clients.forEach((client) => client.navigate(client.url));
    } catch (err) {
      console.warn('[sw-killswitch]', err);
    }
  })());
});
// Sin listener de 'fetch': las peticiones van directas a la red.
