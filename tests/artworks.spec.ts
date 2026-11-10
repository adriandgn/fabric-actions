import { test, expect } from '@playwright/test';

test('artworks gallery page visual regression', async ({ page }) => {
  await page.goto('/'); // Go to the home page
  // Assuming the gallery is part of the home page or accessible from it
  // You might need to navigate to the specific gallery section if it's a sub-route
  // For now, we'll just take a screenshot of the main page and assume gallery is visible
  await expect(page).toHaveScreenshot('artworks-gallery.png');
});
