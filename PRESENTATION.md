# Guion de presentación del proyecto

## Resumen de un minuto

Este proyecto es un framework de pruebas end-to-end con Playwright y TypeScript
para una aplicación financiera. Cubre inicio de sesión, registro, creación de
cuentas y un flujo de transferencias entre usuarios autenticados. El diseño
mantiene las pruebas legibles, reutiliza sesiones autenticadas y usa el API de
registro solo para preparar datos rápidamente.

## Qué se construyó

- Una suite de pruebas de navegador en `tests/`.
- Page Objects y diálogos reutilizables en `pages/`.
- Utilidades de preparación mediante API en `utils/`.
- Datos de prueba compartidos y generados en `data/`.
- Proyectos de Playwright para preparación, Chromium, Firefox y WebKit.
- Informes HTML y traces del primer reintento para facilitar el diagnóstico.

## Historia para la demostración

1. Inicie el frontend en `http://localhost:3000` y el API en
   `http://localhost:6007`.
2. Ejecute `npm install`, `npx playwright install` y `npm test`.
3. Explique que `register.setup.ts` crea un emisor único mediante el API.
4. Muestre al emisor iniciando sesión por la interfaz y creando una cuenta de
   débito con `1000`.
5. Muestre los estados de autenticación guardados en `.playwright/.auth/`.
6. Ejecute la transferencia: el emisor envía `10` y el receptor espera hasta
   que aparezca `+ 10.00`.
7. Abra el informe HTML con `npx playwright show-report`.

## Mensajes clave de ingeniería

- **Mantenibilidad:** los Page Objects aíslan selectores y exponen acciones de
  negocio.
- **Velocidad:** la preparación por API evita repetir pasos lentos del registro
  mediante la interfaz.
- **Cobertura:** se prueban la interfaz, las precondiciones del API, la
  autenticación y una transferencia entre usuarios.
- **Diagnóstico:** los informes HTML y los traces del primer reintento facilitan
  la investigación de fallos.
- **Aislamiento realista:** el emisor es único, pero el receptor es fijo; las
  transferencias comparten datos de la aplicación y no deben solaparse.

## English

# Project Presentation Brief

## One-minute summary

This project is a Playwright and TypeScript end-to-end test framework for a
financial web application. It covers login, registration, account creation,
and a money-transfer journey across authenticated users. The design keeps tests
readable, reuses authenticated sessions, and uses the signup API only for fast
test-data preparation.

## What was built

- A browser test suite under `tests/`.
- Page Objects and reusable dialogs under `pages/`.
- API preparation utilities under `utils/`.
- Shared and generated test data under `data/`.
- Playwright projects for setup, Chromium, Firefox, and WebKit.
- HTML reporting and retry traces for diagnosis.

## Demonstration story

1. Start the frontend at `http://localhost:3000` and the API at
   `http://localhost:6007`.
2. Run `npm install`, `npx playwright install`, and `npm test`.
3. Explain that `register.setup.ts` creates a unique sender through the API.
4. Show the sender logging in through the UI and creating a debit account with
   `1000`.
5. Show the persisted storage states in `.playwright/.auth/`.
6. Run the transaction flow: the sender sends `10`; the receiver polls until
   `+ 10.00` appears.
7. Open the HTML report with `npx playwright show-report`.

## Key engineering messages

- **Maintainability:** Page Objects isolate selectors and expose business
  actions.
- **Speed:** API setup avoids repeating slow registration UI steps.
- **Coverage:** UI, API preconditions, authentication, and a cross-user
  transaction are covered.
- **Diagnostics:** HTML reports and first-retry traces make failures easier to
  investigate.
- **Honesty about isolation:** the sender is unique, but the receiver is fixed,
  so transaction runs share application data and should not overlap.
