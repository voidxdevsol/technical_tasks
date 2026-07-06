import { $, browser } from '@wdio/globals';

const BUNDLE_ID = 'com.apple.Preferences';

/**
 * Screen Object for the iOS Settings app.
 *
 * Design pattern: Screen Object Model (the mobile equivalent of the Page Object
 * Model). Every locator and interaction lives here; tests speak in intent
 * (`search`, `openRow`, `isOnPage`) rather than raw selectors, so a UI change
 * is fixed in one place.
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

  /** Relaunch Settings from a clean state so each test starts at the root. */
  async open(): Promise<void> {
    await browser.execute('mobile: terminateApp', { bundleId: BUNDLE_ID });
    await browser.execute('mobile: launchApp', { bundleId: BUNDLE_ID });
    await this.searchField.waitForExist({ timeout: 15000 });
  }

  /** Tap a row by its visible label. */
  async openRow(name: string): Promise<void> {
    const el = this.row(name);
    await el.waitForDisplayed({ timeout: 10000 });
    await el.click();
  }

  /** Whether a row with the given label is currently displayed. */
  async isRowDisplayed(name: string): Promise<boolean> {
    return this.row(name).isDisplayed();
  }

  /** Whether the navigation bar for the given screen title is displayed. */
  async isOnPage(title: string): Promise<boolean> {
    const bar = this.navBar(title);
    await bar.waitForDisplayed({ timeout: 10000 }).catch(() => {});
    return bar.isDisplayed();
  }
}
