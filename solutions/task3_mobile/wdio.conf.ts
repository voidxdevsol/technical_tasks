import type { Options } from '@wdio/types';

/**
 * WebdriverIO configuration for the iOS Settings automation suite.
 *
 * SUT: Apple Settings (bundleId com.apple.Preferences) on the iOS Simulator.
 * Calculator is not bundled with the simulator, so Settings is used instead.
 * Driver: Appium XCUITest. The Appium server is started/stopped automatically
 * by @wdio/appium-service, so a single `bun run test` boots everything.
 *
 * Device name and platform version are read from env vars so the suite adapts
 * to whatever simulator runtime is installed:
 *   IOS_DEVICE_NAME      (default: "iPhone 17")
 *   IOS_PLATFORM_VERSION (default: unset -> Appium picks the newest installed)
 */
export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: { project: './tsconfig.json', transpileOnly: true },
  },

  specs: ['./test/**/*.e2e.ts'],
  maxInstances: 1,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': process.env.IOS_DEVICE_NAME ?? 'iPhone 17',
      ...(process.env.IOS_PLATFORM_VERSION
        ? { 'appium:platformVersion': process.env.IOS_PLATFORM_VERSION }
        : {}),
      'appium:bundleId': 'com.apple.Preferences',
      // Keep the session alive between commands during slow simulator boots.
      'appium:newCommandTimeout': 120,
    },
  ],

  logLevel: 'info',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: ['appium'],
  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 120000 },

  reporters: [
    'spec',
    ['allure', { outputDir: 'allure-results', disableWebdriverStepsReporting: true }],
  ],
};
