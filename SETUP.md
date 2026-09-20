# Setup

## Requisitos

- Node.js 18+
- npm
- Git
- La app corriendo en http://localhost:6007

## Instalación

```bash
git clone https://github.com/usuario/repo.git
cd e2e-login-test
npm install
npx playwright install
```

## Configuración

Revisa `playwright.config.ts` y confirma que `baseURL` coincida con la app:

```ts
use: {
  baseURL: 'http://localhost:6007'
}
```

## Ejecutar pruebas

```bash
npm test
npm test tests/login.spec.ts
npm test -- --grep "TC-07"
npm test -- --ui
npx playwright show-report
```

## Estructura

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
├── ARCHITECTURE.md
└── playwright-report/
```
