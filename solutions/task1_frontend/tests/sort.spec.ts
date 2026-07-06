import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../fixtures/users';

/**
 * Test case #4 — Sort products by price (low to high).
 *
 * Why essential: Sorting is a primary product-discovery tool. A shopper who
 * sorts "Price low to high" trusts the ordering to make a buying decision. If
 * sorting is broken, users are misled about prices — eroding trust and possibly
 * exposing pricing errors. This test asserts the resulting order is genuinely
 * ascending rather than just that the control was clicked.
 */
test('sorting by price low-to-high orders products ascending', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.goto();
  await login.login(USERS.standard);
  await inventory.expectLoaded();

  await inventory.sortBy('lohi');

  const prices = await inventory.prices();
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});
