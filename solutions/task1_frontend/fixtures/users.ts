/**
 * Test users for SauceDemo. All credentials are published on the login page
 * itself (https://www.saucedemo.com/), so there is no secret to protect here.
 */
export const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

/** Checkout details used by the end-to-end purchase flow. */
export const CHECKOUT_INFO = {
  firstName: 'Volodymyr',
  lastName: 'Neimet',
  postalCode: '04011',
} as const;
