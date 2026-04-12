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
