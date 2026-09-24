# Project Setup

## English

### Requirements

- Node.js 18 or later
- npm
- Git
- The frontend running at `http://localhost:3000`
- The API running at `http://localhost:6007`

### Installation

```bash
git clone https://github.com/software-craft/e2e-playwright-typescript.git
cd e2e-login-test
npm install
npx playwright install
```

`npm install` installs the dependencies declared in `package.json`.
`npx playwright install` downloads the browser binaries required by the
configured projects.

### Runtime configuration

The shared configuration is in `playwright.config.ts`:

- `testDir` is `./tests`.
- `baseURL` is `http://localhost:3000` for browser navigation.
- The HTML reporter is enabled.
- `setup` discovers `*.setup.ts`.
- Chromium depends on `setup`; Firefox and WebKit run as separate projects.

If the application uses another host or port, update `baseURL` and review the
explicit frontend URLs in Page Objects. The API helper currently posts to
`http://localhost:6007/api/auth/signup`.

### Generated authentication data

Running setup creates:

- `.playwright/.auth/userSendAuth.json`
- `.playwright/.auth/userReceiveAuth.json`

These storage states contain local browser authentication data. They are
generated for the test environment and should not be shared outside it. The
setup also creates a unique sender and a debit account, while the receiver
comes from `data/testData.json`.

### First run

Start the application, then run:

```bash
npm test
```

For command details and troubleshooting, see
[TESTING.md](./TESTING.md). For design decisions, see
[ARCHITECTURE.md](./ARCHITECTURE.md).

## Español

### Requisitos e instalación

Instale Node.js 18 o superior, npm y Git. Ejecute `npm install` y
`npx playwright install` después de clonar el repositorio. El frontend debe
estar disponible en `http://localhost:3000` y el API en `http://localhost:6007`.

### Configuración y sesiones

`playwright.config.ts` define `tests/`, la URL base, el reporter HTML y los
proyectos de navegador. Revise también las URLs explícitas de los Page Objects
y de `utils/backendUtils.ts` si cambia el puerto.

El setup genera los estados de sesión en `.playwright/.auth/`. Son artefactos
locales con datos de autenticación y no deben compartirse fuera del entorno de
prueba. El emisor se crea de forma única; el receptor usa los datos fijos de
`data/testData.json`. Inicie la aplicación antes de ejecutar `npm test`.
