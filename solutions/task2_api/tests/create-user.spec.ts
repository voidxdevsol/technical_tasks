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

for (const payload of users) {
  test(`creates a user from data: ${payload.name} / ${payload.job}`, async ({ request }) => {
    const start = Date.now();
    const response = await request.post('/api/users', { data: payload });
    const elapsedMs = Date.now() - start;

    // HTTP code.
    expect(response.status()).toBe(201);

    const body = await response.json();

    // id + createdAt timestamp are present and valid.
    expect(body).toHaveProperty('id');
    expect(body.id).toBeTruthy();
    expect(body).toHaveProperty('createdAt');
    expect(Number.isNaN(Date.parse(body.createdAt))).toBe(false);

    // Echoed input.
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);

    // Response time under the configured budget.
    expect(elapsedMs).toBeLessThan(RESPONSE_TIME_LIMIT_MS);

    // Bonus: full response-schema validation.
    expect(() => CreateUserSchema.parse(body)).not.toThrow();
  });
}
