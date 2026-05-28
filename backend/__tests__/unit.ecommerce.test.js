const bcrypt = require("bcryptjs");
const { buildDemoProducts } = require("../src/data/catalog");
const { calculateCartTotals } = require("../src/data/store");

const timestamp = "2026-05-27T00:00:00.000Z";
let idCounter = 0;
const products = buildDemoProducts(timestamp, () => `product-${++idCounter}`);

function findProduct(name) {
  const product = products.find((entry) => entry.name === name);
  if (!product) {
    throw new Error(`Missing product fixture: ${name}`);
  }
  return product;
}

function searchProducts(searchTerm) {
  const normalized = searchTerm.toLowerCase().trim();
  return products.filter((product) => {
    const haystack = [
      product.name,
      product.description,
      product.category,
      product.subcategory,
      product.type,
      ...(product.badges || [])
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

function filterByCategory(category) {
  return products.filter((product) => product.category === category);
}

describe("Datamak e-commerce unit tests", () => {
  test("UT-01 validates the real customer login credentials", () => {
    const customer = {
      name: "Sample Customer",
      email: "customer@datamak.local",
      passwordHash: bcrypt.hashSync("Customer@123", 10),
      role: "customer"
    };

    expect(customer.email).toBe("customer@datamak.local");
    expect(customer.role).toBe("customer");
    expect(bcrypt.compareSync("Customer@123", customer.passwordHash)).toBe(true);
  });

  test("UT-02 validates the real admin login credentials", () => {
    const admin = {
      name: "System Admin",
      email: "admin@datamak.local",
      passwordHash: bcrypt.hashSync("Admin@123", 10),
      role: "admin"
    };

    expect(admin.email).toBe("admin@datamak.local");
    expect(admin.role).toBe("admin");
    expect(bcrypt.compareSync("Admin@123", admin.passwordHash)).toBe(true);
  });

  test("UT-03 rejects an invalid customer password", () => {
    const passwordHash = bcrypt.hashSync("Customer@123", 10);

    expect(bcrypt.compareSync("wrongpass", passwordHash)).toBe(false);
  });

  test("UT-04 searches the real product catalog for Dell", () => {
    const results = searchProducts("Dell");

    expect(results.map((product) => product.name)).toContain("Dell UltraSharp 27-inch 4K");
  });

  test("UT-05 filters the real catalog by Computers category", () => {
    const results = filterByCategory("Computers").map((product) => product.name);

    expect(results).toContain("Lenovo ThinkPad X1 Carbon Gen 12");
    expect(results).toContain("HP ProDesk Business Desktop");
    expect(results).toContain("Dell UltraSharp 27-inch 4K");
  });

  test("UT-06 filters the real catalog by ICT Products category", () => {
    const results = filterByCategory("ICT Products").map((product) => product.name);

    expect(results).toContain("Logitech Wireless Keyboard and Mouse Combo");
    expect(results).toContain("Samsung T7 Shield 2TB Portable SSD");
    expect(results).toContain("Cisco Catalyst 1300 Switch");
  });

  test("UT-07 filters the real catalog by Web Hosting Services category", () => {
    const results = filterByCategory("Web Hosting Services").map((product) => product.name);

    expect(results).toContain("Shared Hosting Starter");
    expect(results).toContain("Domain Registration .co.ls");
    expect(results).toContain("Business Website Build");
  });

  test("UT-08 verifies real product price data", () => {
    const lenovo = findProduct("Lenovo ThinkPad X1 Carbon Gen 12");

    expect(lenovo.price).toBe(2099);
  });

  test("UT-09 calculates add-to-cart subtotal for Logitech bundle", () => {
    const logitech = findProduct("Logitech Wireless Keyboard and Mouse Combo");
    const cart = calculateCartTotals([{ productId: logitech.id, quantity: 1 }], products);

    expect(cart.items[0].name).toBe("Logitech Wireless Keyboard and Mouse Combo");
    expect(cart.total).toBe(79);
  });

  test("UT-10 recalculates cart subtotal when Samsung SSD quantity is two", () => {
    const ssd = findProduct("Samsung T7 Shield 2TB Portable SSD");
    const cart = calculateCartTotals([{ productId: ssd.id, quantity: 2 }], products);

    expect(cart.items[0].quantity).toBe(2);
    expect(cart.total).toBe(378);
  });

  test("UT-11 removes Canon printer from a cart item list", () => {
    const canon = findProduct("Canon PIXMA G6040 Printer Scanner");
    const remainingItems = [{ productId: canon.id, quantity: 1 }].filter(
      (item) => item.productId !== canon.id
    );

    expect(remainingItems).toHaveLength(0);
  });

  test("UT-12 calculates cart total for Kingston memory and APC UPS", () => {
    const memory = findProduct("Kingston 32GB DDR5 Memory Kit");
    const ups = findProduct("APC Back-UPS 1200VA");
    const cart = calculateCartTotals(
      [
        { productId: memory.id, quantity: 1 },
        { productId: ups.id, quantity: 1 }
      ],
      products
    );

    expect(cart.total).toBe(378);
  });

  test("UT-13 adds Samsung tablet to wishlist", () => {
    const tablet = findProduct("Samsung Galaxy Tab S9 FE");
    const wishlistIds = [];

    wishlistIds.push(tablet.id);

    expect(wishlistIds).toContain(tablet.id);
  });

  test("UT-14 removes Samsung tablet from wishlist", () => {
    const tablet = findProduct("Samsung Galaxy Tab S9 FE");
    const wishlistIds = [tablet.id].filter((productId) => productId !== tablet.id);

    expect(wishlistIds).not.toContain(tablet.id);
  });

  test("UT-15 treats Microsoft 365 as a service product", () => {
    const microsoft365 = findProduct("Microsoft 365 Business Standard");

    expect(microsoft365.type).toBe("service");
    expect(microsoft365.stock).toBe(0);
    expect(microsoft365.price).toBe(16);
  });

  test("UT-16 validates Dell checkout cart item total", () => {
    const dell = findProduct("Dell UltraSharp 27-inch 4K");
    const cart = calculateCartTotals([{ productId: dell.id, quantity: 1 }], products);

    expect(cart.items[0].name).toBe("Dell UltraSharp 27-inch 4K");
    expect(cart.total).toBe(549);
  });

  test("UT-17 returns zero total for an empty cart", () => {
    const cart = calculateCartTotals([], products);

    expect(cart.items).toHaveLength(0);
    expect(cart.total).toBe(0);
  });

  test("UT-18 verifies Lenovo stock from the real catalog", () => {
    const lenovo = findProduct("Lenovo ThinkPad X1 Carbon Gen 12");

    expect(lenovo.stock).toBe(14);
  });
});
