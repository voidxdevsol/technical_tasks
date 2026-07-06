import { z } from 'zod';

/**
 * Zod schemas used for the optional bonus tasks:
 *  - data-type assertions on the GET /users response
 *  - full response-schema validation on the POST /users response
 *
 * Parsing with these schemas asserts both the shape and the primitive type of
 * every field in one step, and produces a readable error if anything drifts.
 */

/** A single user object inside the GET /api/users "data" array. */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  avatar: z.string().url(),
});

/** Full GET /api/users?page=N response. */
export const ListUsersSchema = z.object({
  page: z.number().int(),
  per_page: z.number().int(),
  total: z.number().int(),
  total_pages: z.number().int(),
  data: z.array(UserSchema),
  support: z
    .object({ url: z.string().url(), text: z.string() })
    .optional(),
});

/** Full POST /api/users response body. */
export const CreateUserSchema = z.object({
  name: z.string(),
  job: z.string(),
  id: z.string(),
  // reqres returns an ISO-8601 timestamp; assert it parses to a real date.
  createdAt: z.string().datetime(),
});

export type ListUsers = z.infer<typeof ListUsersSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
