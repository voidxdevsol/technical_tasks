# Technical Task #1 — Frontend Test Automation

Automated UI tests for **[saucedemo.com](https://www.saucedemo.com/)** (Swag Labs) built with
**Playwright + TypeScript** using the **Page Object Model**.

## Tech stack

| Concern | Choice |
|---|---|
| Test framework | [Playwright Test](https://playwright.dev/) |
| Language | TypeScript |
| Runtime / package manager | [Bun](https://bun.sh/) |
| Browser | WebKit (Desktop Safari profile) |
| Design pattern | Page Object Model |

## Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
  - Prefer Node? `npm install && npx playwright install webkit` works identically.

## Setup

```bash
bun install
bunx playwright install webkit    # one-time browser download
```

## Run the tests

```bash
bun test                # headless, all tests (list + HTML report)
bun run test:headed     # watch it drive a real browser
bun run test:ui         # Playwright interactive UI mode
bun run report          # open the last HTML report
```

Run a single spec:

```bash
bunx playwright test tests/checkout.spec.ts
```

## Test cases

Each test documents **why the functionality is essential** in a header comment
inside its spec file.

| # | Spec | Scenario | Why essential |
|---|------|----------|---------------|
| 1 | `tests/login.spec.ts` | `standard_user` logs in; `locked_out_user` is rejected | Login gates the whole app — must let valid users in and keep blocked users out |
| 2 | `tests/cart.spec.ts` | Add 2 products → badge count + cart contents match | Core e-commerce action; a wrong cart means lost revenue and trust |
| 3 | `tests/checkout.spec.ts` | Product → cart → info → finish → order confirmation | The revenue path; the business only earns when this full flow completes |
| 4 | `tests/sort.spec.ts` | Sort "Price low → high" → assert ascending order | Product-discovery tool users trust to make buying decisions |

## Project structure

```
task1_frontend/
├── pages/                 # Page Objects (one class per screen)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/                 # Test specs (one file per functionality)
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── sort.spec.ts
├── fixtures/
│   └── users.ts           # Test users + checkout data
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Design notes

- **Page Object Model** — every screen is a class exposing intent-revealing
  methods (`login`, `addToCart`, `checkout`). Tests read as business steps and
  selectors live in one place, so UI changes are fixed once.
- **Stable selectors** — locators use SauceDemo's `data-test` attributes and
  ARIA roles (`getByRole`) rather than brittle CSS/XPath, so they survive
  styling changes.
- **Meaningful assertions** — e.g. the sort test asserts the prices are actually
  ascending, not merely that the dropdown was clicked.

Test users and the shared password (`secret_sauce`) are published on the login
page itself, so nothing secret is committed here.
