import { test, expect } from '@playwright/test';
import { ListUsersSchema } from '../lib/schemas';

/**
 * Test Case #1 — GET List Users  (GET /api/users?page=2)
 *
 * Why essential: listing/paginated reads are the most-hit endpoints of almost
 * any REST API. This verifies the server returns a well-formed, correctly
 * paginated payload — the contract every client depends on.
 */
test.describe('GET /api/users', () => {
  test('returns page 2 with the expected users and consistent pagination', async ({ request }) => {
    const response = await request.get('/api/users', { params: { page: 2 } });

    // Status + content type.
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    // --- Required assertions -------------------------------------------------
    // "total"
    expect(body.total).toBe(12);

    // "last_name" for the first and the second user in "data".
    expect(body.data[0].last_name).toBe('Lawson');
    expect(body.data[1].last_name).toBe('Ferguson');

    // Count users in "data" and compare to "total".
    // reqres paginates, so a single page holds `per_page` users, not `total`.
    // The correct, honest relationship is asserted here rather than a naive
    // (and false) data.length === total.
    expect(body.data.length).toBe(body.per_page);
    expect(body.data.length).toBeLessThanOrEqual(body.total);
    expect(body.per_page * body.total_pages).toBeGreaterThanOrEqual(body.total);

    // --- Bonus: data-type assertions for the response fields -----------------
    expect(typeof body.page).toBe('number');
    expect(typeof body.per_page).toBe('number');
    expect(typeof body.total).toBe('number');
    expect(typeof body.total_pages).toBe('number');
    expect(Array.isArray(body.data)).toBe(true);

    for (const user of body.data) {
      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
      expect(typeof user.first_name).toBe('string');
      expect(typeof user.last_name).toBe('string');
      expect(typeof user.avatar).toBe('string');
    }

    // Schema parse gives the same guarantees in one strongly-typed step.
    expect(() => ListUsersSchema.parse(body)).not.toThrow();
  });
});
