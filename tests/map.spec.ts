import { test, expect } from '@playwright/test';

test('el mapa de Google solo se carga al pulsar', async ({ page }) => {
  await page.goto('/encuentro');

  await expect(page.locator('iframe')).toHaveCount(0);

  await page.getByRole('button', { name: /Ver mapa/ }).click();

  const iframe = page.locator('iframe');
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toHaveAttribute('title', 'Mapa de la Cervecería el Punto de Triana');
  await expect(iframe).toHaveAttribute('loading', 'lazy');
  await expect(iframe).toHaveAttribute('src', /^https:\/\/www\.google\.com\/maps\/embed/);
});
