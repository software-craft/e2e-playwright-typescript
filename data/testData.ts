/**
 * Test Data Utilities
 * 
 * This module provides helper functions for managing test data,
 * especially for generating unique identifiers to avoid conflicts.
 */

/**
 * Generate a unique email address for testing
 * 
 * Why this is needed:
 * - Registration tests create new users
 * - Email must be unique (no duplicates allowed)
 * - Tests can run multiple times (must not fail on re-runs)
 * - Tests can run in parallel (must not interfere with each other)
 * 
 * Solution: Use timestamp + random number to guarantee uniqueness
 * 
 * @param prefix - Email prefix (e.g., 'testuser' -> testuser_1692876543210_456@softwarecraft.com)
 * @returns A unique email address
 * 
 * Example:
 *   const email = generateUniqueEmail('john');  // john_1692876543210_456@softwarecraft.com
 *   const email = generateUniqueEmail('test');  // test_1692876543211_789@softwarecraft.com
 */
export const generateUniqueEmail = (prefix = 'user'): string => {
  // timestamp: Current time in milliseconds
  // Random: Additional random number to avoid collisions in millisecond boundary
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}@softwarecraft.com`;
};
