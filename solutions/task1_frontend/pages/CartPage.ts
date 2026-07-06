import { type Page, type Locator, expect } from '@playwright/test';

/** Page Object for the shopping cart. */
export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Your Cart');
  }

  async itemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async names(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
