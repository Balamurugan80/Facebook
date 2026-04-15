const { test, expect } = require('@playwright/test');

test('amazon sign-in page accepts username and password fields', async ({ page }) => {
  await page.goto('https://www.amazon.in/?&tag=googhydrabk1-21&ref=pd_sl_5szpgfto9i_e&adgrpid=155259813593&hvpone=&hvptwo=&hvadid=674893540034&hvpos=&hvnetw=g&hvrand=68841260709382339115&hvqmt=e&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9061907&hvtargid=kwd-64107830&hydadcr=14452_2316413&gad_source=1');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load', timeout: 15000 }),
    page.click('#nav-link-accountList'),
  ]);

  await expect(page.locator('#ap_email_login')).toBeVisible();
  await page.fill('#ap_email_login', '9500297374');
  await page.click('#continue');

  await expect(page.locator('#ap_password')).toBeVisible();
  await page.fill('#ap_password', 'your-password');

  // If you want to actually submit the form, uncomment the next line.
  // await page.click('#signInSubmit');
});

const { test, expect } = require('@playwright/test');

test('amazon sign-in page accepts username and password fields', async ({ page }) => {
  await page.goto('https://www.amazon.in/');

  await page.setViewportSize({ width: 1920, height: 1080 });

  const accountList = page.locator('#nav-link-accountList');
  await accountList.waitFor({ state: 'visible', timeout: 30000 });
  await accountList.hover();
  await page.click('text=Sign in');

  await page.waitForURL('**/signin**', { timeout: 30000 });
  await expect(page.locator('#ap_email_login')).toBeVisible();

  await page.fill('#ap_email_login', '9500297374');
  await page.click('#continue');

  await expect(page.locator('#ap_password')).toBeVisible();
  await page.fill('#ap_password', 'Bala@131366');

  // Assert the password field has the correct value
  await expect(page.locator('#ap_password')).toHaveValue('Bala@131366');

  await page.click('#signInSubmit');

  // Wait for the home page to show the logged-in user name
  await page.waitForURL('https://www.amazon.in/*', { timeout: 30000 });
  await expect(page.locator('text=Hello, Bala')).toBeVisible();

  // Save a screenshot after login
  await page.screenshot({ path: 'test-results/amazon-login-success.png' });
});

test('amazon search and add to cart', async ({ page }) => {
  await page.goto('https://www.amazon.in/s?k=motorola+edge+60+with+green+colour&crid=1XLJJFIMLPSM7&sprefix=motorola+edge+60+with+green+colour%2Caps%2C735&ref=nb_sb_noss_2');

  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.waitForSelector('#twotabsearchtextbox', { state: 'visible', timeout: 30000 });
  await expect(page.locator('#twotabsearchtextbox')).toHaveValue(/motorola edge 60 with green colour/i);

  await page.waitForSelector('div[data-component-type="s-search-result"]', { state: 'visible', timeout: 30000 });

  const firstAddToCart = page.locator('div[data-component-type="s-search-result"] button:has-text("Add to cart")').first();
  await firstAddToCart.waitFor({ state: 'visible', timeout: 30000 });
  await page.screenshot({ path: 'test-results/amazon-search-result-before-add-to-cart.png' });
  await firstAddToCart.click();

  // Open the cart page and wait for the cart summary
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }),
    page.click('#nav-cart'),
  ]);
  await page.waitForURL('**/gp/cart/view.html**', { timeout: 30000 });

  // Select the first cart item checkbox
  const cartCheckbox = page.locator('input[type="checkbox"]').first();
  await cartCheckbox.waitFor({ state: 'attached', timeout: 30000 });
  await cartCheckbox.check({ force: true });

  // Verify order summary text is present
  await expect(page.locator('text=Items:')).toBeVisible();
  await expect(page.locator('text=Delivery:')).toBeVisible();
  await expect(page.locator('text=Total:')).toBeVisible();
  await expect(page.locator('text=FREE Delivery')).toBeVisible();
  await expect(page.locator('text=Order Total:')).toContainText('₹27,990.00');

  // Save cart summary screenshot
  await page.screenshot({ path: 'test-results/amazon-cart-summary.png' });

  // Click "Proceed to Buy"
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }),
    page.click('text=Proceed to Buy'),
  ]);

  // Wait for checkout summary page and verify the order summary text
  await page.waitForSelector('text=Secure checkout', { timeout: 30000 });
  await expect(page.locator('text=Items:')).toBeVisible();
  await expect(page.locator('text=Delivery:')).toBeVisible();
  await expect(page.locator('text=Total:')).toBeVisible();
  await expect(page.locator('text=FREE Delivery')).toBeVisible();
  await expect(page.locator('text=Order Total:')).toContainText('₹27,990.00');

  // Save checkout summary screenshot
  await page.screenshot({ path: 'test-results/amazon-checkout-summary.png' });
});
