const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = process.env.WEB_BASE_URL || "http://localhost:5174";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000/api";
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const EVIDENCE_DIR = path.join(ROOT_DIR, "evidence", "selenium");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

function createDriver() {
  const options = new chrome.Options();
  if (fs.existsSync(CHROME_PATH)) {
    options.setChromeBinaryPath(CHROME_PATH);
  }
  options.addArguments("--window-size=1366,768");
  options.addArguments("--disable-notifications");
  options.addArguments("--disable-search-engine-choice-screen");

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function screenshot(driver, fileName) {
  const image = await driver.takeScreenshot();
  const filePath = path.join(EVIDENCE_DIR, fileName);
  fs.writeFileSync(filePath, image, "base64");
  return filePath;
}

async function waitVisible(driver, locator, timeout = 15000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

async function clearBrowserSession(driver) {
  await driver.get(BASE_URL);
  await driver.executeScript("window.localStorage.clear(); window.sessionStorage.clear();");
}

async function apiLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error(`Login failed for ${email}: HTTP ${response.status}`);
  }
  return response.json();
}

async function setBrowserSession(driver, session) {
  await driver.get(BASE_URL);
  await driver.executeScript(
    "window.localStorage.setItem('shop_token', arguments[0]); window.localStorage.setItem('shop_user', JSON.stringify(arguments[1]));",
    session.token,
    session.user
  );
}

async function clearCart(token) {
  await fetch(`${API_BASE_URL}/cart`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
}

async function runTest(results, name, fn) {
  const startedAt = Date.now();
  const driver = await createDriver();
  try {
    await fn(driver);
    results.push({
      name,
      status: "PASS",
      durationMs: Date.now() - startedAt
    });
    console.log(`PASS ${name}`);
  } catch (error) {
    const failureImage = `FAILED-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
    try {
      await screenshot(driver, failureImage);
    } catch (_) {
      // Screenshot is best-effort when the browser itself fails.
    }
    results.push({
      name,
      status: "FAIL",
      durationMs: Date.now() - startedAt,
      error: error.message,
      screenshot: failureImage
    });
    console.error(`FAIL ${name}: ${error.message}`);
  } finally {
    await driver.quit();
  }
}

async function loggedOutAddToCartDialog(driver) {
  await clearBrowserSession(driver);
  await driver.get(`${BASE_URL}/catalog?category=Computers`);
  const addButton = await waitVisible(
    driver,
    By.xpath("(//button[contains(normalize-space(.),'Add to Cart')])[1]")
  );
  await addButton.click();
  const dialog = await waitVisible(driver, By.css(".message-dialog"));
  const title = await dialog.findElement(By.css("h2")).getText();
  const message = await dialog.findElement(By.css("p")).getText();
  assert.strictEqual(title, "Login Required");
  assert.strictEqual(message, "Please login or register to add products to cart.");
  await screenshot(driver, "EV-SEL-003-login-required-dialog-pass.png");
}

async function customerLogin(driver) {
  await clearBrowserSession(driver);
  await driver.get(`${BASE_URL}/auth`);
  await waitVisible(driver, By.css("input[name='email']"));
  await driver.findElement(By.css("input[name='email']")).sendKeys("customer@datamak.local");
  await driver.findElement(By.css("input[name='password']")).sendKeys("Customer@123");
  await driver.findElement(By.css(".auth-submit")).click();
  const customerLink = await waitVisible(
    driver,
    By.xpath("//a[normalize-space()='Hi, Sample Customer']")
  );
  assert.strictEqual(await customerLink.getText(), "Hi, Sample Customer");
  await screenshot(driver, "EV-SEL-004-customer-login-pass.png");
}

async function catalogSort(driver) {
  await driver.get(`${BASE_URL}/catalog?category=Computers`);
  const trigger = await waitVisible(driver, By.css(".catalog-sort-trigger"));
  await trigger.click();
  const option = await waitVisible(driver, By.xpath("//button[normalize-space()='Best Discount']"));
  await option.click();
  await driver.wait(async () => {
    const text = await driver.findElement(By.css(".catalog-sort-trigger small")).getText();
    return text === "Best Discount";
  }, 10000);
  await waitVisible(driver, By.css(".product-card"));
  await screenshot(driver, "EV-SEL-005-catalog-sort-pass.png");
}

async function customerCheckout(driver) {
  const session = await apiLogin("customer@datamak.local", "Customer@123");
  await clearCart(session.token);
  await setBrowserSession(driver, session);
  await driver.get(`${BASE_URL}/hosting`);
  const buyButton = await waitVisible(driver, By.xpath("(//button[normalize-space()='Buy Plan'])[1]"));
  await buyButton.click();
  await waitVisible(driver, By.css(".message-dialog"));
  await driver.findElement(By.xpath("//button[normalize-space()='OK']")).click();
  await driver.get(`${BASE_URL}/cart`);
  const checkoutLink = await waitVisible(driver, By.linkText("Proceed to Checkout"));
  await checkoutLink.click();
  const continueButton = await waitVisible(driver, By.xpath("//button[normalize-space()='Continue']"));
  await continueButton.click();
  const placeOrderButton = await waitVisible(driver, By.xpath("//button[normalize-space()='Place Order']"));
  await placeOrderButton.click();
  await driver.wait(async () => (await driver.getCurrentUrl()).includes("/checkout/success/"), 30000);
  await waitVisible(driver, By.xpath("//h1[normalize-space()='Payment Successful']"), 15000);
  await screenshot(driver, "EV-SEL-006-checkout-pass.png");
}

async function adminLoginDashboard(driver) {
  await clearBrowserSession(driver);
  await driver.get(`${BASE_URL}/auth`);
  await waitVisible(driver, By.css("input[name='email']"));
  await driver.findElement(By.css("input[name='email']")).sendKeys("admin@datamak.local");
  await driver.findElement(By.css("input[name='password']")).sendKeys("Admin@123");
  await driver.findElement(By.css(".auth-submit")).click();
  await driver.wait(async () => (await driver.getCurrentUrl()).includes("/admin"), 30000);
  await waitVisible(driver, By.xpath("//h1[normalize-space()='Admin Control Center']"), 15000);
  await waitVisible(driver, By.css(".admin-dashboard-card-panel"));
  await screenshot(driver, "EV-SEL-007-admin-dashboard-pass.png");
}

async function main() {
  const results = [];
  await runTest(results, "Logged-out add to cart shows login dialog", loggedOutAddToCartDialog);
  await runTest(results, "Customer login works", customerLogin);
  await runTest(results, "Catalog sort menu works", catalogSort);
  await runTest(results, "Customer adds hosting plan and checks out", customerCheckout);
  await runTest(results, "Admin login opens dashboard", adminLoginDashboard);

  const summary = {
    tool: "Selenium WebDriver",
    browser: "Chrome",
    baseUrl: BASE_URL,
    apiBaseUrl: API_BASE_URL,
    ranAt: new Date().toISOString(),
    total: results.length,
    passed: results.filter((result) => result.status === "PASS").length,
    failed: results.filter((result) => result.status === "FAIL").length,
    results
  };

  fs.writeFileSync(
    path.join(EVIDENCE_DIR, "selenium-results.json"),
    JSON.stringify(summary, null, 2)
  );

  console.table(results.map(({ name, status, durationMs }) => ({ name, status, durationMs })));

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
