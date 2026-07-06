# Moxymind — QA Technical Tasks

Solutions to the Moxymind technical assignment by **Volodymyr Neimet**.

Each task lives in its own self-contained folder under [`solutions/`](solutions/) with
its own README, dependencies and run instructions. The original assignment
briefs are in [`tasks/`](tasks/).

## Tasks

| # | Task | Brief | Solution | Status |
|---|------|-------|----------|--------|
| 1 | Frontend test automation | [PDF](tasks/Moxymind_technical_task1_Frontend_automation.docx.pdf) | [`solutions/task1_frontend/`](solutions/task1_frontend/) | ✅ Done |
| 2 | API test automation | [PDF](tasks/Moxymind_technical_task2_API_automation.pdf) | [`solutions/task2_api/`](solutions/task2_api/) | ✅ Done |
| 3 | Mobile test automation | [PDF](tasks/Moxymind_technical_task3_Mobile_automation.docx.pdf) | [`solutions/task3_mobile/`](solutions/task3_mobile/) | ✅ Done |

## Task 1 — Frontend (saucedemo.com)

Playwright + TypeScript UI suite using the Page Object Model. Four test cases
covering login (positive + negative), add-to-cart, end-to-end checkout and price
sorting.

→ **[Full README and run instructions](solutions/task1_frontend/README.md)**

```bash
cd solutions/task1_frontend
bun install
bunx playwright install webkit
bunx playwright test
```

## Task 2 — API (reqres.in)

Playwright `APIRequestContext` + TypeScript. Two scenarios: `GET` list users
(with data-type assertions) and a data-driven `POST` create user (with
response-time budget and schema validation).

→ **[Full README and run instructions](solutions/task2_api/README.md)**

```bash
cd solutions/task2_api
cp .env.example .env      # add your reqres.in API key
bun install
bunx playwright test
```

## Task 3 — Mobile (iOS Settings)

Appium + WebdriverIO + TypeScript on the iOS Simulator, using the Screen Object
Model. Two scenarios: drill-down navigation to device info (General → About) and
cross-section navigation (Accessibility). Calculator is used in the brief as an
example, but it is not bundled in the iOS Simulator, so the always-present
Settings app is the SUT.

→ **[Full README and run instructions](solutions/task3_mobile/README.md)**

```bash
cd solutions/task3_mobile
nvm use                                 # Node 22 (see .nvmrc)
bun install
bunx appium driver install xcuitest
bun run test
```

## Repository layout

```
technical_tasks/
├── tasks/          # Original assignment PDFs
├── solutions/      # One self-contained folder per task
│   ├── task1_frontend/
│   ├── task2_api/
│   └── task3_mobile/
└── README.md       # You are here
```
