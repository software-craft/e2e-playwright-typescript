# E2E Login Test

Playwright + TypeScript project for login and registration flows.

## Requirements

- Node.js 18+
- npm
- App running at http://localhost:6007

## Quick start

```bash
npm install
npx playwright install
npm test
```

## Useful commands

```bash
npm test
npm test tests/login.spec.ts
npm test -- --ui
npx playwright show-report
```

## Project structure

```text
e2e-login-test/
├── tests/
├── pages/
├── data/
├── utils/
├── playwright.config.ts
├── package.json
├── README.md
├── SETUP.md
├── TESTING.md
└── ARCHITECTURE.md
```

## Notes

- Tests use the Page Object Model.
- Test names follow the TC-## pattern.
- Browser config is in `playwright.config.ts`.
- Default base URL: `http://localhost:6007`.
