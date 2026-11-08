import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/nosotros', '/productos', '/media', '/encuentro'];

for (const route of ROUTES) {
  test(`${route} responde 200`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
  });
}

for (const route of ['/robots.txt', '/sitemap.xml', '/ads.txt', '/llms.txt', '/sw.js']) {
  test(`${route} responde 200`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
  });
}

test('una ruta inexistente responde 404 y sirve la página de error', async ({ request }) => {
  const response = await request.get('/esta-pagina-no-existe');
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain('Esta página no existe');
});
