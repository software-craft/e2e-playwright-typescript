# Contributing Guide

Guidelines for adding tests and maintaining code quality in this project.

---

## Before You Start

1. Read [README.md](./README.md) for project overview
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
3. Read [TESTING.md](./TESTING.md) for testing practices
4. Explore existing tests to understand the patterns

---

## Adding a New Test

### Step 1: Plan Your Test

Ask yourself:
- What user behavior am I testing?
- What's the expected result?
- Which page object(s) do I need?
- Do I need to create test data first?

### Step 2: Create Page Objects (if needed)

If testing a new page or feature, create a page object:

```typescript
// pages/myNewPage.ts
import { Page, Locator } from '@playwright/test';

/**
 * MyNewPage - Page Object Model for my new page
 * 
 * Describe what this page represents and its main features.
 */
export class MyNewPage {
  readonly page: Page;
  readonly myElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myElement = page.locator('selector');
  }

  async navigateToPage() {
    await this.page.goto('http://localhost:3000/mypage');
  }

  async performAction() {
    await this.myElement.click();
  }
}
```

**Rules:**
- ✅ Encapsulate all selectors in the constructor
- ✅ Create separate methods for each user action
- ✅ Add JSDoc comments explaining each method
- ✅ Follow the naming convention: `myActionName()` (camelCase)
- ❌ Don't include test logic in page objects

### Step 3: Add Test Data (if needed)

Update `data/testData.json`:

```json
{
  "validUser": { /* existing */ },
  "newScenario": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

### Step 4: Write Your Test

Create or update a test file in `tests/`:

```typescript
// tests/myNewFeature.spec.ts
import { test, expect } from '@playwright/test';
import { MyNewPage } from '../pages/myNewPage';
import testData from '../data/testData.json';

test.describe('My New Feature', () => {
  let myPage: MyNewPage;

  test.beforeEach(async ({ page }) => {
    myPage = new MyNewPage(page);
    await myPage.navigateToPage();
  });

  test('TC-## Verify expected behavior', async ({ page }) => {
    // Arrange
    const testValue = testData.newScenario.field1;

    // Act
    await myPage.performAction();

    // Assert
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

**Test Naming:**
- Format: `TC-## Brief description`
- Examples:
  - ✅ `TC-15 Verify button is enabled when all fields are filled`
  - ✅ `TC-16 Verify error message on invalid email`
  - ❌ `TC-20 test` (too vague)

### Step 5: Run Your Test

```bash
# Run your new test
npm test -- --grep "TC-##"

# Run with debug mode
npm test -- --debug --grep "TC-##"

# Run with UI mode
npm test -- --ui --grep "TC-##"
```

### Step 6: Review & Refine

- ✅ Test passes consistently
- ✅ Page object methods are reusable
- ✅ Comments are clear and technical
- ✅ Follows project naming conventions
- ✅ No hardcoded URLs (use `baseURL` from config)

---

## Adding a New Page Object

### When to Create a Page Object

- Testing a new page/feature
- Grouping related UI elements
- Encapsulating complex interactions

### Page Object Template

```typescript
/**
 * [PageName] - Page Object Model for [description]
 * 
 * [What is this page and what features does it have]
 * 
 * Usage:
 *   const myPage = new MyPage(page);
 *   await myPage.navigateToPage();
 *   await myPage.performAction();
 */
export class MyPage {
  readonly page: Page;
  readonly myElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myElement = page.locator('selector');
  }

  /**
   * [Action description]
   * 
   * @param [param] - [param description]
   */
  async myAction(param: string) {
    // Implementation
  }
}
```

### Best Practices

1. **One responsibility**: One page object per page/feature
2. **Descriptive names**: `loginWithCredentials()` not `submit()`
3. **No logic**: Page objects shouldn't contain test logic
4. **Well documented**: JSDoc comments for every method
5. **Flexible methods**: Separate fill and submit for test flexibility

### Example: Good vs Bad

❌ **Bad - Mixed concerns:**
```typescript
export class LoginPage {
  async loginAndVerifyDashboard(email: string, password: string) {
    // Test logic mixed with page object
    await this.login(email, password);
    await expect(dashboard).toBeVisible(); // ← Test logic
  }
}
```

✅ **Good - Separated concerns:**
```typescript
export class LoginPage {
  async loginWithCredentials(email: string, password: string) {
    // Only UI interactions
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

---

## Code Style & Naming

### Naming Conventions

```typescript
// Classes - PascalCase
export class LoginPage { }
export class BackendUtils { }

// Methods/Functions - camelCase
async loginWithCredentials() { }
async fillRegisterForm() { }
const generateUniqueEmail = () => { }

// Constants - UPPER_SNAKE_CASE
const BASE_URL = 'http://localhost:6007';
const DEFAULT_TIMEOUT = 30000;

// Private members - with underscore prefix (optional)
private _internalState = '';
```

### File Naming

```
// Page objects
pages/
  loginPage.ts         # camelCase, descriptive name
  registerPage.ts
  dashboardPage.ts

// Tests
tests/
  login.spec.ts        # camelCase + .spec.ts suffix
  register.spec.ts
  register.setup.ts    # .setup.ts for fixture tests

// Data
data/
  testData.json        # camelCase
  testData.ts
```

### Comments

```typescript
// ✅ Good - Explains WHY
// Generate unique email to avoid duplicate user errors in registration tests
const uniqueEmail = generateUniqueEmail('test');

// ❌ Bad - States the obvious
// Generate an email
const uniqueEmail = generateUniqueEmail('test');

// ✅ Good - JSDoc comments
/**
 * Fill the login form with credentials
 * 
 * @param email - User email address
 * @param password - User password
 */
async fillLoginForm(email: string, password: string) { }

// ❌ Bad - No documentation
async fillLoginForm(email, password) { }
```

---

## Testing Checklist

Before submitting a test:

- [ ] Test passes consistently (run 3+ times)
- [ ] Test fails when expected (temporarily break code to verify)
- [ ] Test is isolated (doesn't depend on other tests)
- [ ] Uses page objects (no hardcoded selectors in tests)
- [ ] Follows TC-## naming convention
- [ ] Includes meaningful assertions
- [ ] Comments explain complex logic
- [ ] No hardcoded URLs (uses baseURL)
- [ ] No arbitrary wait times (`waitForTimeout`)
- [ ] Uses proper waits (`waitForLoadState`, `expect`, etc.)

---

## Common Patterns to Use

### Pattern 1: Test Independent Data

```typescript
// ✅ Good - Each test can run independently
test('Register user', async ({ page }) => {
  const email = generateUniqueEmail('test');
  await registerPage.registerWithData('John', 'Doe', email, 'password');
});

test('Login user', async ({ page }) => {
  // This test doesn't depend on the register test
  await loginPage.loginWithCredentials('existing@example.com', 'password');
});
```

### Pattern 2: Setup Data via API (Faster)

```typescript
// ✅ Good - Fast setup via API
test.beforeEach(async ({ request }) => {
  const { email, password } = await BackendUtils.registerUser(
    request, 'John', 'Doe', 'john@example.com', 'password123'
  );
  // Now you can use email/password in your test
});
```

### Pattern 3: Separate Concerns

```typescript
// ✅ Good - Separate fill and submit
test('Verify button state', async ({ page }) => {
  await registerPage.visitRegisterPage();
  
  // Form is empty - button disabled
  await expect(registerPage.registerButton).toBeDisabled();
  
  // Fill form - button enabled
  await registerPage.fillRegisterForm('John', 'Doe', 'john@example.com', 'password');
  await expect(registerPage.registerButton).toBeEnabled();
});
```

### Pattern 4: API Response Validation

```typescript
// ✅ Good - Validate API alongside UI
test('Verify signup returns token', async ({ page }) => {
  const responsePromise = page.waitForResponse('**/api/auth/signup');
  
  await registerPage.registerWithData('John', 'Doe', 'john@example.com', 'password');
  
  const response = await responsePromise;
  const body = await response.json();
  
  expect(response.status()).toBe(201);
  expect(body.token).toBeDefined();
});
```

---

## Git Workflow

### Commit Your Changes

```bash
# Add your changes
git add .

# Commit with clear message
git commit -m "TC-## Add test for feature XYZ"

# Examples:
# - "TC-15 Add login validation tests"
# - "Add LoginPage page object"
# - "Update TestData with new user credentials"
```

### Commit Message Format

```
TC-## [Brief description]

[Optional: Detailed explanation]

- Added tests for feature X
- Created page object Y
- Updated test data Z
```

---

## Before Submitting PR/Merge

1. Run all tests: `npm test`
2. View report: `npx playwright show-report`
3. Check for console errors
4. Verify tests pass consistently
5. Code review your changes
6. Update documentation if needed

---

## Project Maintainers

When reviewing contributions:

1. ✅ Tests follow TC-## naming convention
2. ✅ Page objects are used for all UI interactions
3. ✅ Tests are independent (can run in any order)
4. ✅ No hardcoded URLs (use baseURL)
5. ✅ Comments are clear and helpful
6. ✅ Follows naming conventions
7. ✅ Tests are reliable (not flaky)

---

## Questions?

- Check [TESTING.md](./TESTING.md) for testing practices
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
- Read existing tests for examples
- Review Playwright docs: https://playwright.dev

---

**Thank you for contributing!** 🎉
