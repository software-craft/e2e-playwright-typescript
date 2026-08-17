# E2E Login Test - Playwright + TypeScript

A **professional, production-ready End-to-End testing framework** built with Playwright and TypeScript. This project demonstrates best practices in test automation, including the Page Object Model pattern, test data management, API testing, and comprehensive documentation.

> **Portfolio Project** — Created as a reference implementation for QA automation best practices.

---

## 🎯 Project Overview

This project automates end-to-end testing for a **login and registration system**. It includes:

✅ **User Authentication Tests** — Login with valid/invalid credentials  
✅ **User Registration Tests** — Registration flow validation with API integration  
✅ **Form Validation Tests** — Email uniqueness, required fields, error messages  
✅ **Cross-browser Testing** — Chromium, Firefox, WebKit  
✅ **API Testing** — Backend endpoint validation alongside UI tests  
✅ **Test Data Management** — Centralized test data with unique email generation  
✅ **HTML Reporting** — Built-in Playwright test reports  

---

## 📋 Quick Start

### Prerequisites
- **Node.js** v16+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A running local application at `http://localhost:6007`

### Setup (2 minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd e2e-login-test

# 2. Install dependencies
npm install

# 3. (Optional) Download Playwright browsers
npx playwright install

# 4. Update baseURL in playwright.config.ts if needed
# Default: http://localhost:6007
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/login.spec.ts

# Run tests in debug mode
npm test -- --debug

# Run tests with UI mode
npm test -- --ui

# Run specific test by name
npm test -- --grep "TC-07"

# Generate HTML report
npm test -- --reporter=html
```

---

## 📁 Project Structure

```
e2e-login-test/
├── tests/                    # Test specifications
│   ├── login.spec.ts         # Login flow tests
│   ├── register.spec.ts      # Registration flow tests
│   ├── transaction.spec.ts   # Transaction/dashboard tests
│   └── register.setup.ts     # Setup fixtures for test data
│
├── pages/                    # Page Object Models (POM)
│   ├── loginPage.ts          # Login page interactions
│   ├── registerPage.ts       # Registration page interactions
│   ├── dashboardPage.ts      # Dashboard page interactions
│   └── createAccountModal.ts # Modal component interactions
│
├── data/                     # Test data management
│   ├── testData.json         # Test data fixtures
│   └── testData.ts           # Test data utilities
│
├── utils/                    # Shared utilities
│   └── backendUtils.ts       # API testing helpers
│
├── playwright/               # Playwright configuration
│   └── test/                 # Auth tokens for API tests
│
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

**Learn more:** See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed component explanations.

---

## 🏗️ Architecture

### Page Object Model (POM)

This project follows the **Page Object Model** pattern for maintainability:

```typescript
// pages/loginPage.ts
export class LoginPage {
  constructor(page: Page) { /* ... */ }
  
  async visitLoginPage() { /* navigate to login */ }
  async loginWithCredentials(email: string, password: string) { /* ... */ }
}

// tests/login.spec.ts
const loginPage = new LoginPage(page);
await loginPage.visitLoginPage();
await loginPage.loginWithCredentials('user@example.com', 'password123');
```

**Benefits:**
- ✅ Reduced test code duplication
- ✅ Easy to maintain selectors in one place
- ✅ Clear, readable test steps
- ✅ Reusable across multiple tests

### Test Data Management

Test data is centralized in `data/testData.json`:

```json
{
  "validUser": {
    "firstName": "Software",
    "lastName": "Craft",
    "email": "software@hotmail.com",
    "password": "123456"
  }
}
```

For unique emails (to avoid duplicates):
```typescript
import { generateUniqueEmail } from '../data/testData';
const email = generateUniqueEmail('prefix');  // prefix1692345678@hotmail.com
```

### API Testing Integration

Test backend APIs alongside UI tests using `BackendUtils`:

```typescript
import { BackendUtils } from '../utils/backendUtils';

const { email, password } = await BackendUtils.registerUser(
  request,
  'John', 'Doe', 'john@example.com', 'password123'
);
```

---

## 📊 Test Coverage

| Test Suite | Count | Coverage |
|-----------|-------|----------|
| Login Tests | 1 | Valid credential login |
| Registration Tests | 9 | Form validation, API integration, error handling |
| Transaction Tests | - | Dashboard functionality |
| **Total** | **10+** | **Login & Registration flows** |

### Test Naming Convention

All tests follow the `TC-##` naming convention:
- **TC-01 to TC-05**: Registration page tests
- **TC-06 to TC-10**: Registration validation & edge cases
- **TC-07**: Login test

---

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:6007',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    { name: 'chromium', use: devices['Desktop Chrome'], dependencies: ['setup'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
```

**Key features:**
- ✅ Parallel test execution
- ✅ Automatic retry on CI
- ✅ Multi-browser testing
- ✅ Trace recording for failed tests

### Environment Variables

Create a `.env` file (optional):
```env
BASE_URL=http://localhost:6007
TIMEOUT=30000
```

---

## 🐛 Debugging Tests

### View Test Report
```bash
npx playwright show-report
```

### Run in Debug Mode
```bash
npm test -- --debug
```

### Run in UI Mode (Interactive)
```bash
npm test -- --ui
```

### Inspect Selectors
```bash
npx playwright codegen http://localhost:6007
```

### View Traces
Traces are automatically recorded for failed tests. Open them with:
```bash
npx playwright show-trace trace/file.zip
```

---

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Deep dive into project structure and design patterns
- **[SETUP.md](./SETUP.md)** — Detailed setup and environment configuration
- **[TESTING.md](./TESTING.md)** — Testing strategies and best practices
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — How to add new tests and maintain quality

---

## ✨ Features

- 🎭 **Page Object Model** — Clean, maintainable test code
- 🔄 **Test Setup & Fixtures** — Reusable test data and authentication
- 📡 **API Integration** — Test backend endpoints alongside UI
- 📊 **HTML Reports** — Built-in test reporting with traces
- 🌐 **Multi-browser** — Run tests on Chrome, Firefox, Safari
- ⚡ **Parallel Execution** — Fast test runs with concurrent workers
- 📝 **Well Documented** — Code comments and guides for all skill levels
- 🔗 **Git Ready** — Configured for CI/CD pipelines

---

## 🚀 CI/CD Integration

This project is ready for CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

---

## 💡 Best Practices Demonstrated

✅ **Page Object Model** — Separation of concerns  
✅ **Test Data Management** — Centralized, reusable data  
✅ **Unique Identifiers** — Timestamps for uniqueness  
✅ **API Testing** — Backend validation  
✅ **Clear Assertions** — Meaningful test expectations  
✅ **Comprehensive Documentation** — Easy onboarding  
✅ **TypeScript** — Type safety and better IDE support  
✅ **Scalability** — Easy to add new tests and pages  

---

## 📚 Resources

- [Playwright Official Docs](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged_practices/page_object_models/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding tests and improving the project.

---

## 📄 License

ISC — See [LICENSE](./LICENSE) file for details.

---

## 👤 Author

Created as a reference implementation for QA automation portfolio projects.

**Questions?** Feel free to open an issue or check the documentation files.

---

**Last Updated:** August 2026  
**Framework Version:** Playwright 1.61.1  
**Node Version:** 16+
