# Testing Guide

## English

### Run the suite

```bash
npm test
npm test tests/login.spec.ts
npm test -- --grep "TC-07"
npm test -- --debug
npm test -- --ui
npx playwright show-report
```

The `package.json` scripts also provide `npm run test:debug`,
`npm run test:ui`, `npm run test:headed`, `npm run test:report`, and
`npm run codegen`.

### Test structure

Tests describe behavior and assertions; Page Objects contain locators and UI
actions. A typical test creates a page object, navigates, performs a business
action, and checks an observable result:

```ts
const loginPage = new LoginPage(page);
await loginPage.visitLoginPage();
await loginPage.registerFormCompleteAndSubmit(email, password);
await expect(page).toHaveURL(/.*dashboard/);
```

### Conventions

- Use names such as `TC-07 Verify login with valid credentials`.
- Use Page Objects for UI interaction.
- Prefer `getByRole`, `getByTestId`, and other stable locators.
- Assert visible state, URLs, messages, or other user-observable outcomes.
- Wait for a condition with `expect` or `waitFor`; avoid arbitrary delays.
- Keep tests independent, while respecting the shared receiver caveat described
  in [ARCHITECTURE.md](./ARCHITECTURE.md).

### Debugging and evidence

Start with the HTML report and browser logs:

```bash
npm run test:debug
npm run test:ui
npm run test:report
```

The configuration collects a trace on the first retry. Use an explicit
`networkidle` wait only when the behavior genuinely depends on network
completion:

```ts
await page.waitForLoadState('networkidle');
// or
await page.goto(url, { waitUntil: 'networkidle' });
```

If a locator fails, inspect it with Playwright Inspector and replace brittle
selectors with stable roles or test IDs. Do not add fixed waits to hide timing
problems.

### CI expectations

When `CI` is set, Playwright enables two retries, uses one worker, and fails if
`test.only` remains in the source. CI must install dependencies and browsers,
start the application at the configured URL, and then run `npm test`.

## Español

### Ejecución y depuración

Use `npm test` para toda la suite, el nombre de un archivo para una prueba
concreta y `--grep "TC-##"` para filtrar por nombre. `--debug` abre el
inspector; `--ui` permite ejecutar desde la interfaz; `npx playwright show-report`
muestra el informe HTML.

### Estilo de pruebas

Los tests deben expresar el comportamiento y los Page Objects deben contener
los localizadores y acciones. Use nombres `TC-## Verify ...`, aserciones
observables y localizadores estables. Espere condiciones reales en vez de
tiempos fijos.

### Evidencia y CI

El trace se recopila en el primer reintento. En CI se activan dos reintentos,
un worker y la prohibición de `test.only`. La aplicación y los navegadores
deben estar instalados antes de ejecutar la suite.

