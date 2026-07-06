# Technical Task #2 — API Test Automation

Automated REST API tests for **[reqres.in](https://reqres.in/)** built with
**Playwright's `APIRequestContext` + TypeScript**. Same stack as Task 1, so the
whole repository runs on one toolchain.

## Tech stack

| Concern | Choice |
|---|---|
| Test framework | [Playwright Test](https://playwright.dev/) (API mode — no browser) |
| HTTP client | `APIRequestContext` (built into Playwright) |
| Language | TypeScript |
| Runtime / package manager | [Bun](https://bun.sh/) |
| Schema / type assertions | [zod](https://zod.dev/) |
| Config / secrets | [dotenv](https://github.com/motdotla/dotenv) (`.env`) |

## Prerequisites — API key

reqres.in now requires a **personal free API key**. Without it every request
returns `401 missing_api_key`.

1. Create a free key at **[app.reqres.in/api-keys](https://app.reqres.in/api-keys)**.
2. Copy `.env.example` to `.env` and paste your key:

   ```bash
   cp .env.example .env
   # then edit .env:
   # REQRES_API_KEY=your_key_here
   ```

`.env` is git-ignored, so your key never gets committed.

## Setup

```bash
bun install
```

## Run the tests

```bash
bun test            # headless, all tests (list + HTML report)
bun run test:ui     # Playwright interactive UI mode
bun run report      # open the last HTML report
```

Run a single spec:

```bash
bunx playwright test tests/list-users.spec.ts
```

## Test cases

| # | Spec | Scenario | Why essential |
|---|------|----------|---------------|
| 1 | `tests/list-users.spec.ts` | `GET /api/users?page=2` — assert `total`, first & second `last_name`, and page/total consistency | List/paginated reads are the most-hit endpoints; clients depend on a well-formed, correctly paginated contract |
| 2 | `tests/create-user.spec.ts` | `POST /api/users` — assert `201`, `id` + `createdAt`, response time, echoed input | Write endpoints change server state; the server-generated id + timestamp are the contract clients need to track new resources |

### Required assertions covered

**TC1 — GET List Users**
- Sends a proper request (`page=2`, API key header, JSON content type).
- Asserts `total`.
- Asserts `last_name` for the **first** (`Lawson`) and **second** (`Ferguson`) user in `data`.
- Counts users in `data` and compares to `total` — see the pagination note below.
- **Bonus:** data-type assertions on every field (`typeof` checks + a full `zod` schema parse).

**TC2 — POST Create**
- Sends a proper request.
- Asserts the HTTP code (`201`), the `id`, and the `createdAt` timestamp (parses to a real date).
- **Data-driven** from an external source — [`data/create-users.json`](data/create-users.json) — one test per row.
- Asserts response time is below a configurable limit (`RESPONSE_TIME_LIMIT_MS`).
- **Bonus:** full response-schema validation with `zod`.

## Design notes

- **`data` count vs `total`** — reqres paginates, so one page returns `per_page`
  users (6), not `total` (12). Rather than a naive (and false)
  `data.length === total`, the test asserts the *correct* relationship:
  `data.length === per_page`, `data.length <= total`, and
  `per_page * total_pages >= total`. This shows the pagination contract is
  understood, not just pattern-matched.
- **Response-time budget** — the brief's example uses `100 ms`, which is
  unrealistic for a public service over the open internet. The limit is
  externalised as `RESPONSE_TIME_LIMIT_MS` (default `2000`) so it can be tuned
  per environment without touching code.
- **Secrets** — the real API key lives only in a git-ignored `.env`. A committed
  `.env.example` documents what a reviewer needs to supply.
- **One assertion style, two guarantees** — explicit `typeof` checks read
  clearly for a reviewer, while the `zod` schemas assert shape + types in a
  single strongly-typed step and double as the schema-validation bonus.

## Project structure

```
task2_api/
├── tests/
│   ├── list-users.spec.ts    # TC1 — GET list users
│   └── create-user.spec.ts   # TC2 — POST create (data-driven)
├── data/
│   └── create-users.json     # external data source for the POST test
├── lib/
│   └── schemas.ts            # zod schemas (data-type + schema bonuses)
├── .env.example              # copy to .env and add your key
├── playwright.config.ts
├── tsconfig.json
└── package.json
```
