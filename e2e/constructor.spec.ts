import { test, expect } from '@playwright/test';

const KRATOR_BUN = 'Краторная булка N-200i';
const MAIN_INGREDIENT = 'Биокотлета из марсианской Магнолии';
const BUN_PLACEHOLDER = 'Перетащите сюда булку';

test.describe('тестирование конструктора бургеров', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('e2e/fixtures/api.har', {
      url: '**/api/**',
      update: false,
    });

    await page.addInitScript(() => { window.localStorage.setItem('refreshToken', 'test'); });
    await page.context().addCookies([{ name: 'accessToken', value: 'test', url: 'http://localhost:3000' }]);

    await page.goto('/');
  });

  test('рабочий процесс: модалки, drag-and-drop и оформление заказа', async ({ page }) => {
    const bunIngredient = page.getByText(KRATOR_BUN).first();
    const bunConstructorPlaceholder = page.getByText(BUN_PLACEHOLDER);
    const ingredientToDrag = page.getByText(MAIN_INGREDIENT).first();
    const fillPlaceholder = page.getByText('Добавьте начинку');

    await bunIngredient.click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
    await bunIngredient.dragTo(bunConstructorPlaceholder);
    await ingredientToDrag.dragTo(fillPlaceholder);

    await page.locator('button', { hasText: 'Оформить заказ' }).click();
    
    await expect(page.getByText('12345')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(bunConstructorPlaceholder).toBeVisible();
  });
});
