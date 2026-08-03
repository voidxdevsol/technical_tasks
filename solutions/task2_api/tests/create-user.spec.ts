import { test, expect } from '@playwright/test';
import { CreateUserSchema } from '../lib/schemas';
import users from '../data/create-users.json' assert { type: 'json' };

/**
 * Test Case #2 — POST Create User  (POST /api/users)
 *
 * Why essential: write endpoints change server state. This proves a create
 * request is accepted (201), echoes the input, and returns a server-generated
 * id + timestamp — the minimum contract a client needs to track new resources.
 *
 * Data-driven: every entry in ../data/create-users.json produces its own test.
 */

// Response-time budget. reqres.in is a public service over the open internet,
// so a literal 100 ms (as in the brief's example) is unrealistic; the limit is
// externalised as an env var and defaults to a sane 2000 ms.
const RESPONSE_TIME_LIMIT_MS = Number(process.env.RESPONSE_TIME_LIMIT_MS ?? 2000);

// How far the server clock is allowed to differ from ours when judging
// `createdAt`. Not laziness — a deliberate tolerance: client and server clocks
// are never identical, so the window has to be wide enough to survive normal
// NTP drift and narrow enough that a wrong value (epoch 1970, a hardcoded
// constant, next year) still fails.
const CLOCK_SKEW_MS = Number(process.env.CLOCK_SKEW_MS ?? 5 * 60 * 1000);

for (const payload of users) {
  test(`creates a user from data: ${payload.name} / ${payload.job}`, async ({ request }) => {
    const start = Date.now();
    const response = await request.post('/api/users', { data: payload });
    const elapsedMs = Date.now() - start;

    // HTTP code.
    expect(response.status()).toBe(201);

    const body = await response.json();

    // id is present and non-empty.
    expect(body).toHaveProperty('id');
    expect(body.id).toBeTruthy();

    // --- createdAt: semantic validation, not just presence ---------------------
    // Presence + "it parses" is the weakest possible check — the epoch, a
    // hardcoded string or a date next year would all pass it. What the client
    // actually depends on is the VALUE: the timestamp must say when the record
    // was really created, or every downstream sort, audit trail and "created X
    // ago" label silently lies.
    expect(body).toHaveProperty('createdAt');

    const createdAt = Date.parse(body.createdAt);
    expect(Number.isNaN(createdAt)).toBe(false);

    // Reported in UTC — a naive local-time string is ambiguous the moment the
    // client and the server sit in different timezones.
    expect(body.createdAt).toMatch(/(Z|[+-]\d{2}:\d{2})$/);

    // The value falls inside the window in which the request actually happened
    // (widened by the allowed clock skew). This is what makes the assertion
    // mean "the server recorded the creation time" instead of "the server can
    // print a string".
    expect(createdAt).toBeGreaterThanOrEqual(start - CLOCK_SKEW_MS);
    expect(createdAt).toBeLessThanOrEqual(Date.now() + CLOCK_SKEW_MS);

    // Echoed input.
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);

    // Response time under the configured budget.
    expect(elapsedMs).toBeLessThan(RESPONSE_TIME_LIMIT_MS);

    // Bonus: full response-schema validation.
    expect(() => CreateUserSchema.parse(body)).not.toThrow();
  });
}
