
/**
 * Backend Utilities - API Testing Helpers
 * 
 * This module provides utilities for testing backend APIs.
 * It allows tests to:
 * - Create test users via API (faster than UI registration)
 * - Validate API responses
 * - Set up test preconditions
 * 
 * Benefits:
 * - Faster test setup (no need for UI interactions)
 * - Test backend logic independently from UI
 * - Create test data for other tests
 */

import { APIRequestContext, expect } from '@playwright/test';

/**
 * UserPayload - Interface for user registration data
 * 
 * Defines the structure of user data sent to the registration API.
 * Using interfaces ensures type safety and makes code self-documenting.
 */
interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * BackendUtils - API testing utilities
 * 
 * Static methods for interacting with backend APIs.
 * All methods handle request/response validation.
 */
export class BackendUtils {
  /**
   * Register a new user via API
   * 
   * This method:
   * 1. Generates a unique email (timestamp-based)
   * 2. Sends registration request to backend
   * 3. Validates response status (201 Created)
   * 4. Returns user credentials for logging in
   * 
   * Why use this instead of UI registration?
   * - Faster: No browser UI rendering
   * - Cleaner: Backend validation separate from UI testing
   * - Setup: Perfect for creating test users in beforeEach/setup
   * 
   * @param apiRequestContext - Playwright API request context
   * @param firstName - User first name
   * @param lastName - User last name
   * @param email - Email base (will be made unique with timestamp)
   * @param password - User password
   * @returns Object with unique email and password for login
   * 
   * @throws If API response status is not 201
   * 
   * Example:
   *   const { email, password } = await BackendUtils.registerUser(
   *     request, 'John', 'Doe', 'john@example.com', 'password123'
   *   );
   *   // email will be: john1692876543210@example.com (unique)
   *   // Can now use these credentials to log in
   */
  static async registerUser(
    apiRequestContext: APIRequestContext,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    // Make email unique by adding timestamp
    // Split: john@example.com -> ['john', 'example.com']
    // Combine: john + timestamp + @example.com
    const uniqueEmail = email.split('@')[0] + Date.now() + '@' + email.split('@')[1];

    // Send registration request to backend API
    const response = await apiRequestContext.post('http://localhost:6007/api/auth/signup', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: uniqueEmail,
        password: password,
      },
    });

    // Validate response: 201 Created (successful registration)
    expect(response.status()).toBe(201);

    // Return credentials for use in tests
    return { email: uniqueEmail, password: password };
  }
}