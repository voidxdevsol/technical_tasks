import { $, browser, expect } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';

const BUNDLE_ID = 'com.apple.Preferences';

/**
 * Screen Object for the iOS Settings app.
 *
 * Design pattern: Screen Object Model (the mobile equivalent of the Page Object
 * Model). Every locator and interaction lives here; tests speak in intent
 * (`openRow`, `expectOnPage`) rather than raw selectors, so a UI change is
 * fixed in one place.
 *
 * Locators use iOS accessibility identifiers (`~name`) and predicate strings —
 * the most stable XCUITest selector types.
 */
export class SettingsScreen {
  /** The search field at the top of the Settings root list (used as a ready marker). */
  private get searchField() {
    return $('~Search');
  }

  /** A list row / label addressed by its visible text (e.g. "General"). */
  private row(name: string) {
    return $(`~${name}`);
  }

  /** A navigation bar with the given title — proves which screen is showing. */
  private navBar(title: string) {
    return $(
      `-ios predicate string:type == "XCUIElementTypeNavigationBar" AND name == "${title}"`,
    );
  }

  /**
   * Block until the element stops moving.
   *
   * XCUITest taps the coordinates an element occupied when the click was issued.
   * Settings inserts rows asynchronously after launch (e.g. the "Ready for Apple
   * Intelligence" banner), which shifts the list down mid-tap and lands the tap
   * on the wrong row. Playwright performs this stability check before every
   * action; Appium does not, so it is done explicitly here.
   */
  private async waitUntilStable(el: ChainablePromiseElement): Promise<void> {
    let previous: { x: number; y: number } | null = null;

    await browser.waitUntil(
      async () => {
        const { x, y } = await el.getLocation();
        const settled = previous !== null && previous.x === x && previous.y === y;
        previous = { x, y };
        return settled;
      },
      {
        timeout: 10000,
        interval: 200,
        timeoutMsg: 'Element kept moving — layout never settled',
      },
    );
  }

  /** Relaunch Settings from a clean state so each test starts at the root. */
  async open(): Promise<void> {
    await browser.execute('mobile: terminateApp', { bundleId: BUNDLE_ID });
    await browser.execute('mobile: launchApp', { bundleId: BUNDLE_ID });
    await this.searchField.waitForDisplayed({ timeout: 15000 });
  }

  /** Tap a row by its visible label, once it is displayed and no longer moving. */
  async openRow(name: string): Promise<void> {
    const el = this.row(name);
    await el.waitForDisplayed({ timeout: 10000 });
    await this.waitUntilStable(el);
    await el.click();
  }

  /** Assert the navigation bar for the given screen title is displayed. */
  async expectOnPage(title: string): Promise<void> {
    await expect(this.navBar(title)).toBeDisplayed();
  }

  /** Assert a row with the given label is displayed. */
  async expectRowDisplayed(name: string): Promise<void> {
    await expect(this.row(name)).toBeDisplayed();
  }
}
