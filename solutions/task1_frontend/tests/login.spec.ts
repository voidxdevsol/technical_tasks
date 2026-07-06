import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../fixtures/users';

/**
 * Test case #1 — Login (positive + negative).
 *
 * Why essential: Login is the gate to the entire application. If a valid user
 * cannot get in, the whole product is unusable; if a blocked user CAN get in,
 * it is a security defect. Covering both the happy path and a rejected user
 * verifies the authentication boundary works in both directions.
 */
test.describe('Login', () => {
  test('standard_user logs in and reaches the products page', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login(USERS.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await inventory.expectLoaded();
  });

  test('locked_out_user is rejected with an error message', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(USERS.lockedOut);

    await expect(login.errorMessage).toBeVisible();
    await expect(login.errorMessage).toContainText('locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
