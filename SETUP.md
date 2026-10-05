# Configuración del proyecto

## Requisitos

- Node.js 18 o posterior
- npm
- Git
- El frontend disponible en `http://localhost:3000`
- El API disponible en `http://localhost:6007`

## Instalación

```bash
git clone https://github.com/software-craft/e2e-playwright-typescript.git
cd e2e-login-test
npm install
npx playwright install
```

`npm install` instala las dependencias declaradas en `package.json`.
`npx playwright install` descarga los navegadores necesarios para los proyectos
configurados.

## Configuración de ejecución

La configuración compartida está en `playwright.config.ts`:

- `testDir` apunta a `./tests`.
- `baseURL` es `http://localhost:3000` para la navegación del navegador.
- Está habilitado el reporter HTML.
- El proyecto `setup` detecta archivos `*.setup.ts`.
- Chromium depende de `setup`; Firefox y WebKit son proyectos independientes.

Si la aplicación usa otro host o puerto, actualice `baseURL` y revise las URL
explícitas de los Page Objects. El auxiliar de API envía solicitudes a
`http://localhost:6007/api/auth/signup`.

## Datos de autenticación generados

La preparación genera:

- `.playwright/.auth/userSendAuth.json`
- `.playwright/.auth/userReceiveAuth.json`

Estos estados contienen información de autenticación local del navegador. Se
generan para el entorno de pruebas y no deben compartirse fuera de él. La
preparación también crea un emisor único y una cuenta de débito; el receptor se
obtiene de `data/testData.json`.

## Primera ejecución

Inicie la aplicación y ejecute:

```bash
npm test
```

Consulte [TESTING.md](./TESTING.md) para conocer los comandos y la depuración, y
[ARCHITECTURE.md](./ARCHITECTURE.md) para ver las decisiones de diseño.

## English

# Project Setup

## Requirements

- Node.js 18 or later
- npm
- Git
- The frontend running at `http://localhost:3000`
- The API running at `http://localhost:6007`

## Installation

```bash
git clone https://github.com/software-craft/e2e-playwright-typescript.git
cd e2e-login-test
npm install
npx playwright install
```

`npm install` installs the dependencies declared in `package.json`.
`npx playwright install` downloads the browsers required by the configured
projects.

## Runtime configuration

Shared configuration lives in `playwright.config.ts`:

- `testDir` points to `./tests`.
- `baseURL` is `http://localhost:3000` for browser navigation.
- The HTML reporter is enabled.
- The `setup` project discovers `*.setup.ts` files.
- Chromium depends on `setup`; Firefox and WebKit are independent projects.

If the application uses another host or port, update `baseURL` and review the
explicit URLs in the Page Objects. The API helper posts to
`http://localhost:6007/api/auth/signup`.

## Generated authentication data

Setup generates:

- `.playwright/.auth/userSendAuth.json`
- `.playwright/.auth/userReceiveAuth.json`

These storage states contain local browser authentication data. They are
generated for the test environment and should not be shared outside it. Setup
also creates a unique sender and a debit account; the receiver comes from
`data/testData.json`.

## First run

Start the application, then run:

```bash
npm test
```

See [TESTING.md](./TESTING.md) for commands and debugging, and
[ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions.
