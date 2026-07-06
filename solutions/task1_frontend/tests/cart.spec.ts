import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS } from '../fixtures/users';

const PRODUCTS = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

/**
 * Test case #2 — Add to cart.
 *
 * Why essential: Adding items to the cart is the core e-commerce action that
 * precedes every purchase. The cart badge count and the cart contents must
 * exactly reflect what the user selected — a mismatch here directly translates
 * to lost revenue and lost customer trust.
 */
test.describe('Cart', () => {
  test('adding two products updates the badge and cart contents', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await login.goto();
    await login.login(USERS.standard);
    await inventory.expectLoaded();

    for (const product of PRODUCTS) {
      await inventory.addToCart(product);
    }
    expect(await inventory.cartCount()).toBe(PRODUCTS.length);

    await inventory.openCart();
    await cart.expectLoaded();
    expect(await cart.itemCount()).toBe(PRODUCTS.length);
    expect(await cart.names()).toEqual(PRODUCTS);
  });
});
