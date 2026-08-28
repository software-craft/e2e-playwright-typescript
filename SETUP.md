# Setup & Installation Guide

A step-by-step guide to set up the e2e-login-test project on your local machine.

---

## Prerequisites

Before you start, make sure you have:

1. **Node.js** (v16 or higher)
2. **npm** (comes with Node.js)
3. **Git** (for cloning the repository)
4. **A running local application** at `http://localhost:6007`

### Verify Prerequisites

```bash
# Check Node.js version (should be v16+)
node --version

# Check npm version (should be v7+)
npm --version

# Check Git is installed
git --version
```

If you need to install Node.js, download from [nodejs.org](https://nodejs.org/)

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to the project folder
cd e2e-login-test
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install

# This will install:
# - @playwright/test (Playwright testing framework)
# - @types/node (TypeScript types for Node.js)
```

**Expected output:**
```
added XX packages in XXs
```

### Step 3: Download Playwright Browsers

```bash
# Download browser binaries for Chromium, Firefox, WebKit
npx playwright install

# This downloads ~1.2 GB of browser files (one-time only)
```

### Step 4: Update Configuration (if needed)

Open `playwright.config.ts` and verify the `baseURL`:

```typescript
use: {
  baseURL: 'http://localhost:6007',  // ← Update if your app runs on different port
  trace: 'on-first-retry',
},
```

If your application runs on a different port or URL, update it here.

### Step 5: Verify Installation

```bash
# Run tests to verify setup
npm test

# Expected: Tests run and you see a summary
```

---

## Directory Setup

After installation, your directory should look like this:

```
e2e-login-test/
├── node_modules/              # Dependencies (created by npm install)
├── tests/                      # Test files
├── pages/                      # Page Object Models
├── data/                       # Test data
├── utils/                      # Utilities
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project metadata
└── README.md                   # Project documentation
```

---

## Environment Configuration

### Option 1: Using Environment Variables (Recommended)

Create a `.env` file in the project root:

```bash
# .env
BASE_URL=http://localhost:6007
TIMEOUT=30000
CI=false
```

Then update `playwright.config.ts`:

```typescript
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:6007',
  },
});
```

### Option 2: Using Command-line Variables

```bash
# Set environment variable and run tests
BASE_URL=http://localhost:8080 npm test
```

### Option 3: Direct Configuration

Update `playwright.config.ts` directly (simplest for personal projects):

```typescript
export default defineConfig({
  use: {
    baseURL: 'http://localhost:6007',
  },
});
```

---

## Testing the Setup

### Run All Tests

```bash
npm test

# Expected: All tests run and pass
```

### Run Specific Test File

```bash
npm test tests/login.spec.ts

# Expected: Only login tests run
```

### Run Specific Test by Name

```bash
npm test -- --grep "TC-07"

# Expected: Only tests matching "TC-07" run
```

### Run in Debug Mode

```bash
npm test -- --debug

# Expected: Playwright Inspector opens
# - Step through tests line by line
# - Inspect elements
# - View logs
```

### Run in UI Mode (Interactive)

```bash
npm test -- --ui

# Expected: Opens UI Mode in browser
# - Watch tests run in real-time
# - Inspect elements
# - Time travel through test steps
```

### View HTML Report

```bash
npm test

# Then view report:
npx playwright show-report
```

---

## Package.json Scripts

Currently, the `package.json` has no scripts. Here's a recommended setup:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:report": "playwright show-report",
    "test:specific": "playwright test --grep",
    "test:trace": "playwright show-trace",
    "codegen": "playwright codegen"
  }
}
```

To add these scripts, open `package.json` and update the `scripts` section, then you can use:

```bash
npm run test:debug     # Run tests in debug mode
npm run test:ui        # Run tests in UI mode
npm run test:report    # View HTML report
npm run codegen        # Generate test code
```

---

## Troubleshooting

### Problem: Tests fail with "localhost:6007 refused"

**Solution:** Make sure your application is running:
```bash
# In another terminal, start your application
npm start

# Or if using a different command:
docker-compose up
```

### Problem: "Command not found: npm"

**Solution:** Node.js is not installed. Download from [nodejs.org](https://nodejs.org/)

### Problem: "Playwright browsers not found"

**Solution:** Install browser binaries:
```bash
npx playwright install
```

### Problem: Tests timeout

**Solution:** Increase timeout in `playwright.config.ts`:
```typescript
use: {
  navigationTimeout: 30000,
  actionTimeout: 10000,
}
```

### Problem: Port 6007 already in use

**Solution:** Check what's using the port and either:
1. Stop the other application
2. Update `baseURL` to a different port
3. Use `lsof -i :6007` (Mac/Linux) or `netstat -ano | findstr :6007` (Windows)

### Problem: "Cannot find module '@playwright/test'"

**Solution:** Dependencies not installed. Run:
```bash
npm install
```

---

## IDE Setup

### Visual Studio Code (Recommended)

1. **Install Playwright Test for VS Code:**
   - Open VS Code Extensions
   - Search for "Playwright Test for VS Code"
   - Click Install

2. **Features with extension:**
   - ✅ Run tests directly from editor
   - ✅ Debug tests with breakpoints
   - ✅ View test reports
   - ✅ Generate test code

### WebStorm / IntelliJ IDEA

1. Playwright is built-in (no installation needed)
2. Right-click test file → "Run" or "Debug"
3. Use built-in debugging features

### GitHub Copilot (VS Code)

If you have GitHub Copilot installed, it can help:
- Generate test code
- Complete test assertions
- Suggest page object methods

---

## Next Steps

After setup is complete:

1. ✅ Read [README.md](./README.md) for project overview
2. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
3. ✅ Read [TESTING.md](./TESTING.md) for testing strategies
4. ✅ Explore page objects in `pages/` folder
5. ✅ Run tests and view reports
6. ✅ Create your first test

---

## Git Setup (Optional)

If you're using Git with this project:

```bash
# Initialize git (if not already done)
git init

# Add .env file to gitignore (if using environment variables)
echo ".env" >> .gitignore

# Add node_modules to gitignore
echo "node_modules/" >> .gitignore

# Add test results and reports to gitignore
echo "test-results/" >> .gitignore
echo "playwright-report/" >> .gitignore

# Commit setup
git add .
git commit -m "Initial setup"
```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm install -D @playwright/test
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|------------|
| Node.js | v16 | v18+ |
| npm | v7 | v9+ |
| RAM | 4 GB | 8 GB+ |
| Disk Space | 2 GB (without browsers) | 3-4 GB |
| OS | Any | Ubuntu/Mac/Windows 10+ |

---

## Performance Tips

1. **Use parallel execution** (enabled by default)
2. **Run only needed tests:** `npm test -- --grep "pattern"`
3. **Use API setup** instead of UI registration when possible
4. **Enable headed mode** only when debugging: `npm test -- --headed`
5. **Run on CI with workers=1** for stability

---

## Support & Resources

- **Playwright Docs:** https://playwright.dev/docs/intro
- **Troubleshooting:** https://playwright.dev/docs/troubleshooting
- **Best Practices:** https://playwright.dev/docs/best-practices
- **VS Code Extension:** https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

---

## Checklist

- [ ] Node.js installed (v16+)
- [ ] Project cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install`)
- [ ] Application running on http://localhost:6007
- [ ] Tests run successfully (`npm test`)
- [ ] HTML report can be viewed (`npx playwright show-report`)
- [ ] Ready to write tests! 🎉

---

**Questions?** Check [README.md](./README.md) or [ARCHITECTURE.md](./ARCHITECTURE.md)
