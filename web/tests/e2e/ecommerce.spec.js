import { expect, test } from "@playwright/test";

const customer = {
  email: process.env.E2E_CUSTOMER_EMAIL || "customer@datamak.local",
  password: process.env.E2E_CUSTOMER_PASSWORD || "Customer@123"
};

async function loginAsCustomer(page) {
  await page.goto("/auth");
  await page.locator('input[name="email"]').fill(customer.email);
  await page.locator('input[name="password"]').fill(customer.password);
  await page.locator("form").getByRole("button", { name: /^login$/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText(/hi,\s*sample customer/i)).toBeVisible();
}

test.describe("Datamak ecommerce cross-browser flows", () => {
  test("visitor can open the homepage and browse to catalog", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: /datamak technologies/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /power your world/i })).toBeVisible();

    await page.getByRole("link", { name: /shop now/i }).click();

    await expect(page).toHaveURL(/\/catalog$/);
    await expect(page.getByRole("heading", { name: /product catalog/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /shop by category/i })).toBeVisible();
  });

  test("visitor can view catalog but cannot add to cart before login", async ({ page }) => {
    await page.goto("/catalog");

    await expect(page.getByRole("heading", { name: /product catalog/i })).toBeVisible();
    await page.getByRole("button", { name: /add to cart/i }).first().click();

    await expect(page.getByText(/please login or register to add products to cart/i)).toBeVisible();
  });

  test("protected cart redirects logged-out visitors to login", async ({ page }) => {
    await page.goto("/cart");

    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByText(/member login/i)).toBeVisible();
  });

  test("customer can log in and see account navigation", async ({ page }) => {
    await loginAsCustomer(page);

    await expect(page.getByRole("link", { name: /hi,\s*sample customer/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /login \/ register/i })).toHaveCount(0);
  });
});
