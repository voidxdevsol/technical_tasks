# Technical Task #3 — Mobile Test Automation

Automated tests for the **iOS Settings** app (`com.apple.Preferences`) running on
the **iOS Simulator**, built with **Appium + WebdriverIO + TypeScript** using the
**Screen Object Model**.

> **SUT note:** the brief suggests a built-in app such as Calculator, but Apple
> **does not bundle Calculator in the iOS Simulator**. The always-present
> **Settings** app is used instead — same idea, fully reproducible on any Mac.

## Tech stack

| Concern | Choice |
|---|---|
| Test runner | [WebdriverIO](https://webdriver.io/) |
| Mobile automation | [Appium](https://appium.io/) + `appium-xcuitest-driver` |
| SUT | iOS Settings on the iOS Simulator |
| Language | TypeScript |
| Runtime / package manager | [Bun](https://bun.sh/) (installs); Node LTS runs WebdriverIO |
| Design pattern | Screen Object Model |
| Reporting | `spec` (console) + [Allure](https://allure.qameta.io/) (bonus) |

## Prerequisites

1. **Full Xcode** (not just Command Line Tools) — Appium's XCUITest driver needs
   it to build WebDriverAgent and boot simulators.

   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```

2. **An iOS Simulator runtime.** Xcode 26 ships without one; install it and
   confirm a device exists:

   ```bash
   xcodebuild -downloadPlatform iOS
   xcrun simctl list devices available | grep iPhone
   ```

3. **Node LTS (18–22).** WebdriverIO's HTTP client does not yet support the very
   newest Node releases (Node 24+ throws `UND_ERR_INVALID_ARG` on session
   start). An [`.nvmrc`](.nvmrc) pins Node 22:

   ```bash
   nvm use            # or: fnm use
   node -v            # expect v22.x
   ```

## Setup

```bash
bun install
bunx appium driver install xcuitest    # one-time: install the iOS driver
```

## Run the tests

```bash
bun run test        # boots Appium + simulator, runs both scenarios
```

The Appium server is started and stopped automatically by
`@wdio/appium-service`, so a single command runs everything from the CLI.

### Choosing a simulator

Device and iOS version are read from env vars (defaults: `iPhone 17`, newest
installed runtime):

```bash
IOS_DEVICE_NAME="iPhone 17" IOS_PLATFORM_VERSION="26.5" bun run test
```

### Reporting (bonus)

Allure results are written to `allure-results/`. Generate and open the report:

```bash
bun run report      # requires the Allure CLI: brew install allure
```

## Test scenarios

| # | Scenario | Why essential |
|---|----------|---------------|
| 1 | Navigate **General → About** and verify device-info rows (Name, iOS Version, Model Name) | A multi-hop journey must load each correct screen and render the expected data |
| 2 | Open the **Accessibility** section and verify a child option (Motion) | Proves navigation works across a different top-level branch, not just one path |

Both scenarios live in [`test/settings.e2e.ts`](test/settings.e2e.ts) and each
relaunches the app first, so they are order-independent.

## Design notes

- **Screen Object Model** — [`screens/SettingsScreen.ts`](screens/SettingsScreen.ts)
  owns every locator and exposes intent-revealing actions (`open`, `openRow`,
  `isOnPage`, `isRowDisplayed`). Tests read as user journeys, not raw taps.
- **Stable locators** — rows are addressed by iOS **accessibility identifiers**
  (`~General`, `~About`) and screens are asserted via **predicate strings** on
  the navigation bar — the most robust XCUITest selector types.
- **Portable assertions** — the About test checks that labelled info *rows*
  exist rather than pinning device-specific values (e.g. the exact model), so it
  passes on any simulator.
- **Why not Calculator / search** — Calculator is absent from the Simulator, and
  Settings' search index is empty on a fresh Simulator (every query returns "No
  Results"). Navigation-based scenarios are the reliable, deterministic choice.
- **Self-managing infra** — the Appium server lifecycle is handled by the WDIO
  Appium service; no separate terminal needed.
- **Env-driven device** — no hard-coded simulator, so the suite runs on whatever
  runtime is installed.

## Project structure

```
task3_mobile/
├── screens/
│   └── SettingsScreen.ts     # Screen Object (locators + actions)
├── test/
│   └── settings.e2e.ts       # 2 scenarios
├── wdio.conf.ts              # WebdriverIO + Appium + reporters config
├── .nvmrc                    # pins Node 22 for WebdriverIO
├── tsconfig.json
└── package.json
```
