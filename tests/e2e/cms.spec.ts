import { test, expect } from '@playwright/test';

test('the seeded site and all admin sections work with the local API', async ({ page, context }) => {
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!password) throw new Error('E2E_ADMIN_PASSWORD must be set for the disposable test environment.');
  const browserErrors: string[] = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });

  // Keep the test entirely local: do not contact analytics, fonts, or other third parties.
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') await route.continue();
    else await route.fulfill({ status: 200, body: '', contentType: route.request().resourceType() === 'script' ? 'application/javascript' : 'text/css' });
  });

  await page.goto('/');
  await expect(page.getByText('BERLIN 2025')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'SOFT LANDING - RARE FASHION WEEK EVENT' })).toBeVisible();
  await expect(page.getByText('Garments sewn on canvas, 118 x 78 cm')).toBeVisible();
  await expect.poll(() => page.locator('img[src^="/img/"]').evaluateAll((images) =>
    images.length >= 9 && images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)
  )).toBe(true);
  await page.getByAltText('Urban Spill 1').click();
  await expect(page.getByRole('dialog').getByAltText('Urban Spill 1')).toBeVisible();
  await page.getByRole('button', { name: 'Next image' }).click();
  await expect(page.getByRole('dialog').getByAltText('Urban Spill 2')).toBeVisible();
  await page.getByRole('button', { name: 'Close lightbox' }).click();

  await page.goto('/admin/login');
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin\/events$/);
  await expect(page.getByRole('heading', { name: 'Manage Events' })).toBeVisible();

  await page.getByRole('row', { name: /BERLIN FASHION WEEK - RARE COLLECTIVE/ }).getByRole('button', { name: 'Edit' }).click();
  let dialog = page.getByRole('dialog');
  await dialog.getByLabel('Title').fill('Updated exhibition');
  await dialog.getByRole('button', { name: 'Save Event' }).click();
  await expect(page.getByRole('row', { name: /Updated exhibition/ })).toBeVisible();

  await page.getByRole('link', { name: 'Artworks' }).click();
  await page.getByRole('row', { name: /Urban Spill 1/ }).getByRole('button', { name: 'Edit' }).click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('Title').fill('Updated artwork');
  await dialog.getByLabel('Image').setInputFiles('public/img/studio-2.png');
  await dialog.getByRole('button', { name: 'Save Artwork' }).click();
  await expect(page.getByRole('row', { name: /Updated artwork/ })).toBeVisible();

  await page.getByRole('link', { name: 'Interventions' }).click();
  await page.getByRole('row', { name: /Fabric Remnants/ }).getByRole('button', { name: 'Edit' }).click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('Title').fill('Updated intervention');
  await dialog.getByRole('button', { name: 'Save Urban Intervention' }).click();
  await expect(page.getByRole('row', { name: /Updated intervention/ })).toBeVisible();

  await page.getByRole('link', { name: 'Posts' }).click();
  await page.getByRole('row', { name: /SOFT LANDING/ }).getByRole('button', { name: 'Edit' }).click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('Title', { exact: true }).fill('Updated event post');
  await dialog.getByRole('button', { name: 'Save Event Post' }).click();
  await expect(page.getByRole('row', { name: /Updated event post/ })).toBeVisible();

  await page.getByRole('link', { name: 'Hero' }).click();
  await page.getByLabel('Last Exhibition').fill('Updated hero');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Exhibition info updated successfully.', { exact: true })).toBeVisible();

  await page.goto('/');
  await expect(page.getByText('Updated hero')).toBeVisible();
  await expect(page.getByRole('link', { name: /Updated exhibition/ })).toBeVisible();
  await expect(page.getByText('Updated artwork')).toBeVisible();
  await expect(page.getByText('Updated intervention')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Updated event post' })).toBeVisible();
  await expect(page.getByText(/Wind down after hours with style/)).toBeVisible();
  await expect(page.getByAltText('Updated artwork')).toHaveAttribute('src', /\/uploads\//);

  await page.goto('/admin/events');
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto('/admin/events');
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect(browserErrors).toEqual([]);
});

test('the public site remains usable at a narrow mobile width', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') await route.continue();
    else await route.fulfill({ status: 200, body: '', contentType: route.request().resourceType() === 'script' ? 'application/javascript' : 'text/css' });
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'STUDIO PIECES' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
