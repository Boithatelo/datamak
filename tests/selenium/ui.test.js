const assert = require("node:assert/strict");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = process.env.WEB_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || "http://localhost:4000/api";
const TIMEOUT = 20000;
const PAUSE_MS = Number(process.env.SELENIUM_PAUSE_MS || 0);

const CUSTOMER = {
  email: "customer@datamak.local",
  password: "Customer@123"
};

const ADMIN = {
  email: "admin@datamak.local",
  password: "Admin@123"
};

function compact(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function createDriver() {
  const options = new chrome.Options();
  options.addArguments("--window-size=1366,768");
  if (process.env.SELENIUM_HEADLESS === "true") {
    options.addArguments("--headless=new");
  }
  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function resetBrowser(driver) {
  await driver.get(BASE_URL);
  await driver.executeScript("localStorage.clear(); sessionStorage.clear();");
}

async function waitForText(driver, text) {
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

async function getElementWhenReady(driver, locator) {
  const element = await driver.wait(until.elementLocated(locator), TIMEOUT);
  await driver.wait(until.elementIsVisible(element), TIMEOUT);
  await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", element);
  await driver.wait(until.elementIsEnabled(element), TIMEOUT);
  return element;
}

async function clickWhenReady(driver, locator) {
  const element = await getElementWhenReady(driver, locator);
  await element.click();
  return element;
}

async function jsClickWhenReady(driver, locator) {
  const element = await getElementWhenReady(driver, locator);
  await driver.executeScript("arguments[0].click();", element);
  return element;
}

async function findOptional(driver, locator, timeout = 5000) {
  try {
    return await driver.wait(until.elementLocated(locator), timeout);
  } catch {
    return null;
  }
}

function writeResult(id, title, status, lines) {
  console.log(`${status}: ${id} ${title}`);
  lines.forEach((line) => console.log(line));
}

async function login(driver, account) {
  await driver.get(`${BASE_URL}/auth`);
  await waitForText(driver, "Member Login");
  await driver.findElement(By.css('input[name="email"]')).sendKeys(account.email);
  await driver.findElement(By.css('input[name="password"]')).sendKeys(account.password);
  await clickWhenReady(driver, By.css('button[type="submit"]'));
  await driver.wait(
    async () => driver.executeScript('return Boolean(localStorage.getItem("shop_token"))'),
    TIMEOUT,
    "Login token was not stored in localStorage."
  );
}

async function clearCartWithApi(driver) {
  await driver.executeAsyncScript(
    `const done = arguments[arguments.length - 1];
     const token = localStorage.getItem("shop_token");
     fetch("${API_URL}/cart", {
       method: "DELETE",
       headers: { Authorization: "Bearer " + token }
     }).then((res) => done(res.ok)).catch(() => done(false));`
  );
}

async function addFirstAvailableProduct(driver) {
  await driver.get(`${BASE_URL}/catalog`);
  await waitForText(driver, "Product Catalog");
  await waitForText(driver, "Add to Cart");
  await jsClickWhenReady(driver, By.css("button.product-cart-btn:not([disabled])"));

  const dialog = await findOptional(driver, By.css('[role="alertdialog"]'));
  if (dialog) {
    await clickWhenReady(driver, By.xpath("//button[contains(normalize-space(.), 'OK')]"));
  }
}

async function pauseForManualCapture(driver) {
  if (PAUSE_MS > 0) {
    const currentUrl = await driver.getCurrentUrl().catch(() => BASE_URL);
    console.log(`Manual capture pause: ${PAUSE_MS}ms at ${currentUrl}`);
    await driver.sleep(PAUSE_MS);
  }
}

async function runTest(id, title, testBody) {
  const driver = await createDriver();
  try {
    await resetBrowser(driver);
    await testBody(driver);
    await pauseForManualCapture(driver);
    writeResult(id, title, "PASS", [
      `Web URL: ${BASE_URL}`,
      "Actual result: Test completed successfully."
    ]);
  } catch (error) {
    writeResult(id, title, "FAIL", [
      `Web URL: ${BASE_URL}`,
      `Error: ${error.message}`
    ]);
    throw error;
  } finally {
    await driver.quit();
  }
}

async function testSel001(driver) {
  await login(driver, CUSTOMER);
  await clearCartWithApi(driver);
  await addFirstAvailableProduct(driver);
  await driver.get(`${BASE_URL}/cart`);
  await waitForText(driver, "Shopping Cart");
  await waitForText(driver, "Order Summary");
  const body = await driver.findElement(By.css("body")).getText();
  assert.match(body, /Grand Total/i);
}

async function testSel002(driver) {
  await driver.get(`${BASE_URL}/auth`);
  await waitForText(driver, "Member Login");
  await driver.findElement(By.css('input[name="email"]')).sendKeys("wrong@datamak.local");
  await driver.findElement(By.css('input[name="password"]')).sendKeys("WrongPass123");
  await clickWhenReady(driver, By.css('button[type="submit"]'));
  await waitForText(driver, "Invalid email or password");
  const hasToken = await driver.executeScript('return Boolean(localStorage.getItem("shop_token"))');
  assert.equal(hasToken, false);
}

async function testSel003(driver) {
  await driver.get(`${BASE_URL}/catalog`);
  await waitForText(driver, "Product Catalog");
  const computersButton = By.xpath(
    "//button[contains(@class, 'shop-category-card') and .//*[contains(normalize-space(.), 'Computers')]]"
  );
  await clickWhenReady(driver, computersButton);
  await driver.wait(async () => (await driver.getCurrentUrl()).includes("category=Computers"), TIMEOUT);
  const pressed = await driver.findElement(computersButton).getAttribute("aria-pressed");
  assert.equal(pressed, "true");
}

async function testSel004(driver) {
  await login(driver, CUSTOMER);
  await clearCartWithApi(driver);
  await addFirstAvailableProduct(driver);
  await driver.get(`${BASE_URL}/cart`);
  await waitForText(driver, "Proceed to Checkout");
  await jsClickWhenReady(driver, By.xpath("//a[contains(normalize-space(.), 'Proceed to Checkout')]"));
  await driver.wait(async () => (await driver.getCurrentUrl()).includes("/checkout"), TIMEOUT);
  await waitForText(driver, "Secure Checkout");
  await clickWhenReady(driver, By.xpath("//button[contains(normalize-space(.), 'Continue')]"));
  await waitForText(driver, "Order Review");
  await clickWhenReady(driver, By.xpath("//button[contains(normalize-space(.), 'Place Order')]"));
  await driver.wait(async () => (await driver.getCurrentUrl()).includes("/checkout/success/"), TIMEOUT);
  await waitForText(driver, "Payment Successful");
  await waitForText(driver, "Order ID");
}

async function testSel005(driver) {
  await login(driver, ADMIN);
  await waitForText(driver, "Admin Control Center");
  await waitForText(driver, "Products");
  await waitForText(driver, "Orders");
  await waitForText(driver, "Users");
}

async function testSel006(driver) {
  await login(driver, CUSTOMER);
  await driver.get(`${BASE_URL}/admin`);
  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl();
    return !currentUrl.includes("/admin");
  }, TIMEOUT);
  await waitForText(driver, "Power Your World");
  const currentUrl = await driver.getCurrentUrl();
  assert.equal(currentUrl.endsWith("/admin"), false);
}

async function main() {
  const tests = [
    ["SEL-001", "Customer Login And Add To Cart", testSel001],
    ["SEL-002", "Invalid Login Is Rejected", testSel002],
    ["SEL-003", "Product Category Filter Works", testSel003],
    ["SEL-004", "Checkout Creates An Order", testSel004],
    ["SEL-005", "Admin Login Opens Dashboard", testSel005],
    ["SEL-006", "Customer Cannot Access Admin Dashboard", testSel006]
  ];

  for (const [id, title, testBody] of tests) {
    await runTest(id, title, testBody);
  }

  console.log("\nSelenium suite complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
