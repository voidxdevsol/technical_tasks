import { SettingsScreen } from '../screens/SettingsScreen.js';

/**
 * Mobile test suite — iOS Settings (com.apple.Preferences).
 *
 * SUT note: Apple's Calculator is not bundled in the iOS Simulator, so the
 * always-present Settings app is used instead. Two independent scenarios, each
 * starting from a freshly relaunched app so they do not depend on order.
 */
describe('iOS Settings', () => {
  const settings = new SettingsScreen();

  beforeEach(async () => {
    await settings.open();
  });

  /**
   * Scenario 1 — Drill-down navigation and device-info verification.
   *
   * Why essential: reaching device information is a multi-step journey
   * (General -> About). Each hop must load the correct screen, and the
   * destination must render the expected data fields. This asserts both the
   * navigation path and the presence of the key "About" information rows.
   */
  it('navigates General -> About and shows device information', async () => {
    await settings.openRow('General');
    await settings.expectOnPage('General');

    await settings.openRow('About');
    await settings.expectOnPage('About');

    // The About screen renders its device-info fields (values are device- and
    // runtime-specific, so we assert the labelled rows exist rather than pin
    // exact values).
    await settings.expectRowDisplayed('Name');
    await settings.expectRowDisplayed('iOS Version');
    await settings.expectRowDisplayed('Model Name');
  });

  /**
   * Scenario 2 — Cross-section navigation into a different branch.
   *
   * Why essential: the settings tree has many independent branches. Opening a
   * separate top-level section (Accessibility) and confirming both its screen
   * and one of its child options proves navigation works beyond a single path.
   */
  it('opens the Accessibility section and shows its options', async () => {
    await settings.openRow('Accessibility');
    await settings.expectOnPage('Accessibility');

    // "Motion" is a stable child row of the Accessibility screen.
    await settings.expectRowDisplayed('Motion');
  });
});
