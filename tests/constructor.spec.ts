import { test, expect } from '@playwright/test';

test.describe('тестирование конструктора бургеров', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/fixtures/api.har', {
      url: '**/api/**',
      update: false,
    });

    await page.addInitScript(() => { window.localStorage.setItem('refreshToken', 'test'); });
    await page.context().addCookies([{ name: 'accessToken', value: 'test', url: 'http://localhost:3000' }]);

    await page.goto('/');
  });

  test('рабочий процесс: модалки, drag-and-drop и оформление заказа', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await page.keyboard.press('Escape');

    await page.getByText('Краторная булка N-200i').first().dragTo(page.getByText('Перетащите сюда булку'));
    await page.getByText('Биокотлета из марсианской Магнолии').first().dragTo(page.getByText('Добавьте начинку'));

    await page.locator('button', { hasText: 'Оформить заказ' }).click();
    await expect(page.getByText('12345')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByText('Перетащите сюда булку')).toBeVisible();
  });
});
