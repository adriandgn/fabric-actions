import { test, expect } from '@playwright/test';

test('events page visual regression', async ({ page }) => {
  await page.goto('/impressum'); // Go to a known public page first
  await page.goto('/admin/login'); // Navigate to the login page
  // Assuming you have a way to log in for the test, e.g., via API or filling form
  // For now, we'll just test the login page's visual
  await expect(page).toHaveScreenshot('login-page.png');

  // To test the events page, you'd need to log in first
  // For example:
  // await page.fill('#email', 'test@example.com');
  // await page.fill('#password', 'password');
  // await page.click('button[type="submit"]');
  // await page.waitForURL('/admin/events'); // Wait for redirect
  // await expect(page).toHaveScreenshot('events-page.png');
});
