# Testing

## Run tests

```bash
npm test
npm test tests/login.spec.ts
npm test -- --grep "TC-07"
npm test -- --debug
npm test -- --ui
```

## Basic structure

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test('TC-07 Verify login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.visitLoginPage();
  await loginPage.loginWithCredentials('user@example.com', 'password123');

  await expect(page).toHaveURL(/.*dashboard/);
});
```

## Good practices

- Use page objects for UI interactions.
- Keep test names clear: `TC-## ...`.
- Assert behavior, not implementation.
- Prefer stable selectors and explicit waits.
- Keep tests independent from each other.

## Common assertions

```ts
await expect(page).toHaveURL(/.*dashboard/);
await expect(locator).toBeVisible();
await expect(locator).toBeEnabled();
await expect(locator).toHaveText('Login');
```

## Debugging

```bash
npm test -- --debug
npm test -- --ui
npx playwright show-report
```

If a test fails, inspect the trace and browser logs before changing the test logic.
```typescript
// Application takes long to load
await page.waitForLoadState('networkidle'); // Wait for all network requests

// or
await page.goto(url, { waitUntil: 'networkidle' });
```

### Test Fails: "Element not found"
```typescript
// Check selector is correct
// Use inspector to verify selector:
await page.goto('about:blank'); // Then use inspector
```

### Test Fails: "Flaky" (Sometimes passes, sometimes fails)

Common causes:
- ❌ Not waiting for element to be ready
- ❌ Race conditions (multiple async operations)
- ❌ Timeout too short
- ❌ Network issues

**Solution:**
```typescript
// Wait explicitly for element
await expect(element).toBeVisible();
await element.click();

// Or wait for specific condition
await page.waitForLoadState('networkidle');
await page.waitForFunction(() => {
  return document.querySelectorAll('.item').length > 0;
});
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
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
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Reports

### View HTML Report
```bash
npm test
npx playwright show-report
```

**Report shows:**
- Test results summary
- Passed/failed tests
- Screenshots of failures
- Video recordings (if enabled)
- Test duration

---

## Next Steps

- ✅ Read [README.md](./README.md) for project overview
- ✅ Read [SETUP.md](./SETUP.md) for environment setup
- ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
- ✅ Explore page objects in `pages/` folder
- ✅ Run existing tests to see examples
- ✅ Create your first test

---

**Questions?** Check the [Playwright Documentation](https://playwright.dev)
