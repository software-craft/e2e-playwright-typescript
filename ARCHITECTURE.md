# Arquitectura y diseño de las pruebas

## Vista del sistema

```text
┌─────────────────────────────────────────────────────────────┐
│ tests/                                                      │
│ login.spec.ts · register.spec.ts · transaction.spec.ts      │
│ register.setup.ts                                           │
└───────────────┬───────────────────────┬─────────────────────┘
                │                       │
                ▼                       ▼
      ┌─────────────────┐     ┌──────────────────────┐
      │ pages/          │     │ utils/               │
      │ Page Objects    │     │ BackendUtils         │
      │ y diálogos      │     │ Precondiciones API   │
      └────────┬────────┘     └──────────┬───────────┘
               │                         │
               └────────────┬────────────┘
                            ▼
                 Frontend en localhost:3000
                 API en localhost:6007

 data/ ── valores compartidos y generación de correos únicos
 .playwright/.auth/ ── estados de navegador generados
 playwright-report/ ── informes HTML generados
```

La capa de pruebas define escenarios y aserciones. Los Page Objects contienen
los localizadores y las acciones de interfaz. `BackendUtils` prepara datos
mediante el API de registro. Los datos y artefactos de autenticación se
mantienen fuera de los Page Objects.

## Patrón Page Object Model

Las clases de `pages/` representan pantallas o diálogos reutilizables:

- `LoginPage`: abre la página de inicio de sesión y envía credenciales.
- `RegisterPage`: completa los campos de registro y envía el formulario.
- `DashboardPage`: verifica el panel, abre cuentas e inicia transferencias.
- `CreateAccountModal`: selecciona un tipo de cuenta e indica un importe.
- `SendMoneyModal`: indica destinatario e importe y envía dinero.

Cada constructor recibe un `Page` de Playwright y prepara localizadores. Los
métodos públicos describen acciones de usuario o de negocio para que las
pruebas no repitan selectores. Al ampliar la cobertura, prefiera roles, test IDs
o texto estable.

## Preparación y autenticación

`playwright.config.ts` configura `tests/` como `testDir`,
`http://localhost:3000` como `baseURL`, el reporter HTML y la recopilación de
traces en el primer reintento. La preparación por API usa
`http://localhost:6007`.

El proyecto `setup` detecta archivos `*.setup.ts`. En
`tests/register.setup.ts`:

1. `BackendUtils.registerUser` crea por API un emisor único mediante
   `POST http://localhost:6007/api/auth/signup` y espera el estado HTTP 201.
2. El emisor inicia sesión por la interfaz, crea una cuenta de débito con
   `1000` y guarda `.playwright/.auth/userSendAuth.json`.
3. El usuario fijo de `data/testData.json` inicia sesión y guarda
   `.playwright/.auth/userReceiveAuth.json`.

Chromium declara una dependencia del proyecto `setup`. Firefox y WebKit son
proyectos independientes. Los archivos de autenticación son datos locales
generados que contienen credenciales y no deben compartirse fuera del entorno
de pruebas.

## Flujo de transferencias

```text
proyecto setup
  ├─ API: crear emisor único
  ├─ UI: iniciar sesión → crear cuenta de débito (1000)
  ├─ guardar userSendAuth.json
  └─ iniciar sesión del receptor fijo → guardar userReceiveAuth.json

transaction.spec.ts (en serie)
  ├─ sesión del emisor → panel → enviar 10 al receptor fijo
  └─ sesión del receptor → recargar y esperar a que aparezca "+ 10.00"
```

La suite de transferencias se ejecuta explícitamente en serie. La prueba del
receptor espera hasta 30 segundos porque la actualización del saldo es
asíncrona.

## Limitación del aislamiento

El aislamiento es parcial, no completo. El emisor es único en cada preparación,
pero el receptor usa credenciales fijas de `data/testData.json`. Por tanto, la
transferencia modifica datos compartidos de la aplicación y las ejecuciones
repetidas o paralelas pueden interferir entre sí. Ejecute estas pruebas en un
entorno controlado y evite ejecuciones simultáneas contra el mismo backend. Los
estados de sesión se vuelven a generar y no sustituyen la limpieza de la base de
datos.

## Capas y comandos

| Capa | Responsabilidad | Ubicación principal |
| --- | --- | --- |
| UI | Navegación, formularios, mensajes visibles y comportamiento del navegador | `pages/`, `tests/` |
| API | Creación rápida de usuarios y validación del estado HTTP | `utils/backendUtils.ts` |
| Datos | Credenciales fijas y generación de correos únicos | `data/` |
| Configuración | Proyectos, navegadores, reintentos, reporter y URL base | `playwright.config.ts` |

```bash
npm install
npx playwright install
npm test
npm test tests/login.spec.ts
npm test -- --grep "TC-07"
npm test -- --debug
npm run test:ui
npx playwright show-report
```

## Convenciones

- Nombre los escenarios como `TC-## Verify ...`.
- Mantenga selectores y acciones de interfaz en los Page Objects.
- Compruebe el comportamiento observable, no detalles de implementación.
- Mantenga las pruebas independientes cuando los datos de la aplicación lo
  permitan.
- Prefiera condiciones explícitas a esperas fijas; conserve una espera solo si
  documenta una dependencia asíncrona real.
- Ejecute primero una prueba concreta y luego la suite relacionada.

## English

# Architecture and Test Design

## System view

```text
┌─────────────────────────────────────────────────────────────┐
│ tests/                                                      │
│ login.spec.ts · register.spec.ts · transaction.spec.ts      │
│ register.setup.ts                                           │
└───────────────┬───────────────────────┬─────────────────────┘
                │                       │
                ▼                       ▼
      ┌─────────────────┐     ┌──────────────────────┐
      │ pages/          │     │ utils/               │
      │ Page Objects    │     │ BackendUtils         │
      │ and modals      │     │ API preconditions    │
      └────────┬────────┘     └──────────┬───────────┘
               │                         │
               └────────────┬────────────┘
                            ▼
                 Frontend at localhost:3000
                 API at localhost:6007

 data/ ── shared values and unique email generation
 .playwright/.auth/ ── generated browser storage states
 playwright-report/ ── generated HTML results
```

The test layer owns scenarios and assertions. Page Objects own UI locators and
actions. `BackendUtils` prepares data through the signup API. Data and
authentication artefacts are kept outside the Page Objects.

## Page Object Model

The classes in `pages/` represent screens or reusable dialogs:

- `LoginPage` — opens the login page and submits credentials.
- `RegisterPage` — handles registration fields and submission.
- `DashboardPage` — verifies the dashboard, opens accounts, and starts transfers.
- `CreateAccountModal` — selects an account type and submits an amount.
- `SendMoneyModal` — enters a recipient and amount, then sends money.

Each constructor receives a Playwright `Page` and creates locators. Public
methods describe user or business actions, so tests do not repeat selectors.
Prefer stable role, test-id, or text locators when adding coverage.

## Setup and authentication

`playwright.config.ts` uses `tests/` as `testDir`,
`http://localhost:3000` as `baseURL`, the HTML reporter, and trace collection on
the first retry. API setup uses `http://localhost:6007`.

The `setup` project discovers `*.setup.ts`. In
`tests/register.setup.ts`:

1. `BackendUtils.registerUser` creates a unique sender through
   `POST http://localhost:6007/api/auth/signup` and expects HTTP 201.
2. The sender logs in through the UI, creates a debit account with `1000`, and
   saves `.playwright/.auth/userSendAuth.json`.
3. The fixed user from `data/testData.json` logs in and saves
   `.playwright/.auth/userReceiveAuth.json`.

Chromium declares a dependency on `setup`. Firefox and WebKit are independent
projects. Authentication files are generated local state containing credentials
and should not be shared outside the test environment.

## Transaction flow

```text
setup project
  ├─ API: create unique sender
  ├─ UI: sender login → create debit account (1000)
  ├─ save userSendAuth.json
  └─ fixed receiver login → save userReceiveAuth.json

transaction.spec.ts (serial)
  ├─ sender state → dashboard → send 10 to fixed receiver
  └─ receiver state → reload and poll until "+ 10.00" is visible
```

The transaction suite is explicitly serial. The receiver test polls for up to
30 seconds because the balance update is asynchronous.

## Test isolation caveat

Isolation is partial, not full. The sender is unique per setup run, but the
receiver uses the fixed credentials in `data/testData.json`. The transaction
therefore writes to shared application data, and repeated or parallel runs can
affect one another. Run transaction coverage in a controlled environment and
avoid overlapping executions against the same backend. Persisted storage
states are regenerated by setup and do not replace database cleanup.

## Layers and commands

| Layer | Responsibility | Main location |
| --- | --- | --- |
| UI | Navigation, forms, visible messages, and browser behavior | `pages/`, `tests/` |
| API | Fast user creation and HTTP status validation | `utils/backendUtils.ts` |
| Data | Fixed credentials and unique email generation | `data/` |
| Configuration | Projects, browsers, retries, reporter, and base URL | `playwright.config.ts` |

```bash
npm install
npx playwright install
npm test
npm test tests/login.spec.ts
npm test -- --grep "TC-07"
npm test -- --debug
npm run test:ui
npx playwright show-report
```

## Conventions

- Name scenarios `TC-## Verify ...`.
- Keep selectors and UI actions in Page Objects.
- Assert observable behavior, not implementation details.
- Keep tests independent where application data allows it.
- Use explicit conditions instead of fixed waits; retain a wait only when it
  documents a real asynchronous dependency.
- Run a focused test first, then the related suite.
