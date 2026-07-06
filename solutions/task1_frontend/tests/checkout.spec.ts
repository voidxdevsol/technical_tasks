import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFO } from '../fixtures/users';

/**
 * Test case #3 — Checkout end-to-end.
 *
 * Why essential: Checkout is the revenue path. A user can browse and add items,
 * but the business only earns money when the full flow — cart, customer info,
 * overview, finish — completes and confirms the order. This test exercises that
 * entire chain and asserts the final confirmation, protecting the most
 * business-critical journey in the app.
 */
test('completes a purchase from product to order confirmation', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login(USERS.standard);
  await inventory.expectLoaded();

  await inventory.addToCart('Sauce Labs Backpack');
  await inventory.openCart();
  await cart.expectLoaded();

  await cart.checkout();
  await checkout.fillInformation(
    CHECKOUT_INFO.firstName,
    CHECKOUT_INFO.lastName,
    CHECKOUT_INFO.postalCode,
  );
  await checkout.finish();

  await checkout.expectOrderComplete();
});
