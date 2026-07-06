import { defineConfig } from '@playwright/test';
import 'dotenv/config';

/**
 * Playwright configuration for the reqres.in API automation suite.
 * SUT: https://reqres.in/
 *
 * No browser project is defined — these are pure HTTP tests driven through
 * Playwright's APIRequestContext. The API key header required by reqres.in is
 * attached globally via `extraHTTPHeaders`.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://reqres.in',
    extraHTTPHeaders: {
      // reqres.in returns 401 without a valid personal key (from app.reqres.in).
      'x-api-key': process.env.REQRES_API_KEY ?? '',
      'Content-Type': 'application/json',
    },
  },
});
