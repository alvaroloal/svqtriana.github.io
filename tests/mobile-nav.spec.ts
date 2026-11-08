import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test('el menú móvil abre, muestra las cinco secciones y navega', async ({ page }) => {
  await page.goto('/');

  const menu = page.locator('details[data-mobile-nav]');
  const summary = menu.locator('summary');

  await expect(summary).toBeVisible();
  await expect(menu).not.toHaveAttribute('open', '');

  await summary.click();
  await expect(menu).toHaveAttribute('open', '');

  const links = menu.locator('nav a');
  await expect(links).toHaveCount(5);

  for (const label of ['INICIO', 'NUESTRA HISTORIA', 'MATERIAL', 'GALERÍA', 'ENCUENTRO']) {
    await expect(menu.getByRole('link', { name: label })).toBeVisible();
  }

  await menu.getByRole('link', { name: 'ENCUENTRO' }).click();
  await expect(page).toHaveURL(/\/encuentro$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Ven con nosotros a ver el Sevilla',
  );
});

test('el menú móvil se cierra con Escape', async ({ page }) => {
  await page.goto('/nosotros');

  const menu = page.locator('details[data-mobile-nav]');
  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');

  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
});
