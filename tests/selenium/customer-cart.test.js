const assert = require("node:assert/strict");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = process.env.WEB_URL || "http://localhost:5173";
const TIMEOUT = 20000;
const PAUSE_MS = Number(process.env.SELENIUM_PAUSE_MS || 0);

async function waitForText(driver, text) {
  const compact = (value) => String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
  const expected = compact(text);
  await driver.wait(
    async () => {
      const body = await driver.findElement(By.css("body")).getText();
      return compact(body).includes(expected);
    },
    TIMEOUT,
    `Timed out waiting for text: ${text}`
  );
}

async function clickWhenReady(driver, locator) {
  const element = await getElementWhenReady(driver, locator);
  await element.click();
  return element;
}

async function getElementWhenReady(driver, locator) {
  const element = await driver.wait(until.elementLocated(locator), TIMEOUT);
  await driver.wait(until.elementIsVisible(element), TIMEOUT);
  await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", element);
  await driver.wait(until.elementIsEnabled(element), TIMEOUT);
  return element;
}

async function findOptional(driver, locator, timeout = 5000) {
  try {
    return await driver.wait(until.elementLocated(locator), timeout);
  } catch {
    return null;
  }
}

async function main() {
  const options = new chrome.Options();
  options.addArguments("--window-size=1366,768");
  if (process.env.SELENIUM_HEADLESS === "true") {
    options.addArguments("--headless=new");
  }

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    await driver.get(`${BASE_URL}/auth`);
    await driver.executeScript("localStorage.clear()");
    await driver.get(`${BASE_URL}/auth`);

    await waitForText(driver, "Member Login");
    await driver.findElement(By.css('input[name="email"]')).sendKeys("customer@datamak.local");
    await driver.findElement(By.css('input[name="password"]')).sendKeys("Customer@123");
    await clickWhenReady(driver, By.css('button[type="submit"]'));

    await driver.wait(
      async () => driver.executeScript('return Boolean(localStorage.getItem("shop_token"))'),
      TIMEOUT,
      "Login token was not stored in localStorage."
    );

    await driver.get(`${BASE_URL}/catalog`);
    await waitForText(driver, "Product Catalog");
    await waitForText(driver, "Add to Cart");
    const addButton = await getElementWhenReady(driver, By.css("button.product-cart-btn:not([disabled])"));
    await driver.executeScript("arguments[0].click();", addButton);

    const dialog = await findOptional(driver, By.css('[role="alertdialog"]'));
    if (dialog) {
      await waitForText(driver, "Product added to cart.");
      await clickWhenReady(driver, By.xpath("//button[contains(normalize-space(.), 'OK')]"));
    }

    await driver.get(`${BASE_URL}/cart`);
    await waitForText(driver, "Shopping Cart");
    await waitForText(driver, "Order Summary");

    const cartText = await driver.findElement(By.css("body")).getText();
    assert.match(cartText, /Grand Total/i);

    if (PAUSE_MS > 0) {
      console.log(`Manual capture pause: ${PAUSE_MS}ms at ${await driver.getCurrentUrl()}`);
      await driver.sleep(PAUSE_MS);
    }

    console.log("PASS: SEL-001 Customer Login And Add To Cart");
    console.log(`Web URL: ${BASE_URL}`);
    console.log("Actual result: Customer logged in, added a product to cart, and viewed the order summary.");
  } catch (error) {
    throw error;
  } finally {
    await driver.quit();
  }
}

main().catch((error) => {
  console.error("FAIL: SEL-001 Customer Login And Add To Cart");
  console.error(error);
  process.exit(1);
});
