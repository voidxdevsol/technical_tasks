import type { Options } from '@wdio/types';

/**
 * WebdriverIO configuration for the iOS Calculator automation suite.
 *
 * SUT: Apple Calculator (bundleId com.apple.calculator) on the iOS Simulator.
 * Driver: Appium XCUITest. The Appium server is started/stopped automatically
 * by @wdio/appium-service, so a single `bun run test` boots everything.
 *
 * Device name and platform version are read from env vars so the suite adapts
 * to whatever simulator runtime is installed:
 *   IOS_DEVICE_NAME      (default: "iPhone 15")
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
      // Reuse an already-booted simulator when present; speeds up local reruns.
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
