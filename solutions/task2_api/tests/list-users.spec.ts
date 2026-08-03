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

    // --- Count users in "data" and compare to "total" ------------------------
    // The naive reading of the brief is `data.length === total`. That is false
    // for any paginated endpoint and would fail here (6 vs 12). What matters is
    // not the arithmetic but what it says about the system:
    //
    //   data.length  = how many records the user SEES on this page
    //   total        = how many records the system CLAIMS to hold
    //
    // The contract worth testing is that those two never contradict each other.
    // If they do, records silently disappear from the UI and nobody notices —
    // the list looks fine, it is just incomplete.

    // The server honoured the page we asked for; otherwise every assertion
    // below describes a page we never requested.
    expect(body.page).toBe(2);

    // A full page holds exactly `per_page` records, and no page can ever show
    // more records than the system says exist.
    expect(body.data.length).toBe(body.per_page);
    expect(body.data.length).toBeLessThanOrEqual(body.total);

    // Every record is reachable: the advertised number of pages is exactly the
    // number needed to cover `total`. Too few pages means the last records are
    // unreachable — the user can never scroll to them. Too many means empty
    // pages the client will render as blank. Both are real, shippable bugs.
    expect(body.total_pages).toBe(Math.ceil(body.total / body.per_page));

    // No record is served twice within a page — a duplicate here usually means
    // an unstable sort in the query behind the pagination, which also causes
    // records to be skipped on the neighbouring page.
    const ids = body.data.map((user: { id: number }) => user.id);
    expect(new Set(ids).size).toBe(ids.length);

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
