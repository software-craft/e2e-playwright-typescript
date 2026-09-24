# Project Presentation Brief

## English

### One-minute summary

This project is a Playwright and TypeScript end-to-end test framework for a
financial web application. It covers login, registration, account creation,
and a money-transfer journey across authenticated users. The design keeps tests
readable, reuses authenticated sessions, and uses the signup API only for fast
test-data preparation.

### What was built

- A browser test suite under `tests/`.
- Page Objects and reusable dialogs under `pages/`.
- API preparation utilities under `utils/`.
- Shared and generated test data under `data/`.
- Playwright projects for setup, Chromium, Firefox, and WebKit.
- HTML reporting and retry traces for diagnosis.

### Demonstration story

1. Start the frontend at `http://localhost:3000` and the API at
   `http://localhost:6007`.
2. Run `npm install`, `npx playwright install`, and `npm test`.
3. Explain that `register.setup.ts` creates a unique sender through the API.
4. Show the sender logging in through the UI and creating a debit account with
   `1000`.
5. Show the persisted storage states in `.playwright/.auth/`.
6. Run the transaction flow: sender sends `10`; receiver polls until `+ 10.00`
   appears.
7. Open the HTML report with `npx playwright show-report`.

### Key engineering messages

- **Maintainability:** Page Objects isolate selectors and expose business
  actions.
- **Speed:** API setup avoids repeating slow registration UI steps.
- **Coverage:** UI, API preconditions, authentication, and a cross-user
  transaction are covered.
- **Diagnostics:** HTML reports and first-retry traces make failures easier to
  investigate.
- **Honesty about isolation:** the sender is unique, but the receiver is fixed,
  so transaction runs share application data and should not overlap


## Español

### Resumen para presentación

Este proyecto es un framework de pruebas end-to-end con Playwright y TypeScript
para una aplicación financiera. Cubre login, registro, creación de cuentas y
transferencias entre usuarios autenticados. Los Page Objects mantienen los
tests legibles y el API acelera la preparación de datos.

### Historia de demostración

Inicie el frontend en `http://localhost:3000`, el API en `http://localhost:6007`
y ejecute `npm test`. Explique
que `register.setup.ts` crea un emisor único por API, inicia sesión por UI,
crea una cuenta débito con `1000` y guarda estados de autenticación. Después,
`transaction.spec.ts` envía `10` al receptor fijo y espera hasta que aparezca
`+ 10.00`. Termine mostrando el reporte HTML.