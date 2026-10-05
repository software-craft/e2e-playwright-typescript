# Guía de pruebas

## Ejecutar la suite

```bash
npm test
npm test tests/login.spec.ts
npm test -- --grep "TC-07"
npm test -- --debug
npm run test:ui
npx playwright show-report
```

Los scripts de `package.json` también incluyen `npm run test:debug`,
`npm run test:ui`, `npm run test:headed`, `npm run test:report` y
`npm run codegen`.

## Estructura de las pruebas

Las pruebas describen el comportamiento y las aserciones; los Page Objects
contienen los localizadores y las acciones de interfaz. Un caso típico crea un
Page Object, navega, realiza una acción de negocio y comprueba un resultado
observable:

```ts
const loginPage = new LoginPage(page);
await loginPage.visitLoginPage();
await loginPage.registerFormCompleteAndSubmit(email, password);
await expect(page).toHaveURL(/.*dashboard/);
```

## Convenciones

- Use nombres como `TC-07 Verify login with valid credentials`.
- Use Page Objects para interactuar con la interfaz.
- Prefiera `getByRole`, `getByTestId` y localizadores estables.
- Compruebe estados visibles, URL, mensajes u otros resultados observables.
- Espere condiciones con `expect` o `waitFor`; evite demoras arbitrarias.
- Mantenga las pruebas independientes y tenga en cuenta la limitación del
  receptor compartido descrita en [ARCHITECTURE.md](./ARCHITECTURE.md).

## Depuración y evidencias

Empiece por el informe HTML y los registros del navegador:

```bash
npm run test:debug
npm run test:ui
npm run test:report
```

La configuración recopila un trace en el primer reintento. Use una espera
explícita `networkidle` solo cuando el comportamiento dependa realmente de que
termine la actividad de red:

```ts
await page.waitForLoadState('networkidle');
// o
await page.goto(url, { waitUntil: 'networkidle' });
```

Si falla un localizador, inspecciónelo con Playwright Inspector y reemplace
selectores frágiles por roles o test IDs estables. No agregue esperas fijas para
ocultar problemas de sincronización.

## Expectativas de CI

Cuando se define `CI`, Playwright habilita dos reintentos, usa un worker y falla
si queda un `test.only` en el código. CI debe instalar las dependencias y los
navegadores, iniciar la aplicación en la URL configurada y ejecutar `npm test`.

## English

# Testing Guide

## Run the suite

```bash
npm test
npm test tests/login.spec.ts
npm test -- --grep "TC-07"
npm test -- --debug
npm run test:ui
npx playwright show-report
```

The `package.json` scripts also provide `npm run test:debug`,
`npm run test:ui`, `npm run test:headed`, `npm run test:report`, and
`npm run codegen`.

## Test structure

Tests describe behavior and assertions; Page Objects contain locators and UI
actions. A typical test creates a Page Object, navigates, performs a business
action, and checks an observable result:

```ts
const loginPage = new LoginPage(page);
await loginPage.visitLoginPage();
await loginPage.registerFormCompleteAndSubmit(email, password);
await expect(page).toHaveURL(/.*dashboard/);
```

## Conventions

- Use names such as `TC-07 Verify login with valid credentials`.
- Use Page Objects for UI interaction.
- Prefer `getByRole`, `getByTestId`, and other stable locators.
- Assert visible state, URLs, messages, or other user-observable outcomes.
- Wait for a condition with `expect` or `waitFor`; avoid arbitrary delays.
- Keep tests independent, while respecting the shared receiver caveat in
  [ARCHITECTURE.md](./ARCHITECTURE.md).

## Debugging and evidence

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

## CI expectations

When `CI` is set, Playwright enables two retries, uses one worker, and fails if
`test.only` remains in the source. CI must install dependencies and browsers,
start the application at the configured URL, and then run `npm test`.
