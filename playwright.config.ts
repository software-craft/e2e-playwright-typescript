import { defineConfig, devices } from '@playwright/test';

// Configuración compartida de descubrimiento, ejecución, navegadores e informes de Playwright.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000',
  },

  projects: [
    {
      // Prepara los estados autenticados que reutilizan algunas pruebas.
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      // Chromium espera a que el proyecto de preparación termine correctamente.
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    {
      // Proyectos adicionales para comprobar el flujo en otros motores de navegador.
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      // Safari se prueba mediante el motor WebKit incluido en Playwright.
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
