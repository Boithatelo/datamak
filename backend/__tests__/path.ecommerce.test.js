const bcrypt = require("bcryptjs");
const { buildDemoProducts } = require("../src/data/catalog");
const { calculateCartTotals } = require("../src/data/store");

const timestamp = "2026-05-27T00:00:00.000Z";
let idCounter = 0;
const products = buildDemoProducts(timestamp, () => `path-product-${++idCounter}`);

const users = [
  {
    id: "customer-1",
    email: "customer@datamak.local",
    passwordHash: bcrypt.hashSync("Customer@123", 10),
    role: "customer"
  },
  {
    id: "admin-1",
    email: "admin@datamak.local",
    passwordHash: bcrypt.hashSync("Admin@123", 10),
    role: "admin"
  }
];

function loginPath(email, password) {
  if (!email || !password) {
    return { status: 400, path: "missing credentials" };
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return { status: 401, path: "unknown email" };
  }

  if (!bcrypt.compareSync(password, user.passwordHash)) {
    return { status: 401, path: "wrong password" };
  }

  return { status: 200, path: "valid login", role: user.role };
}

function productCatalogPath({ search, category, sort } = {}) {
  let results = [...products];

  if (search) {
    const searchTerm = String(search).toLowerCase().trim();
    results = results.filter((product) =>
      [
        product.name,
        product.description,
        product.category,
        product.subcategory,
        product.type,
        ...(product.badges || [])
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  if (category) {
    results = results.filter(
      (product) => product.category.toLowerCase() === String(category).toLowerCase().trim()
    );
  }

  if (sort === "price_asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    results.sort((a, b) => b.price - a.price);
  }

  return results;
}

function addToCartPath(cartItems, productId, quantity = 1) {
  if (!productId) {
    return { status: 400, path: "missing product id" };
  }

  const parsedQuantity = Number(quantity);
  if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
    return { status: 400, path: "invalid quantity" };
  }

  const product = products.find((entry) => entry.id === productId);
  if (!product) {
    return { status: 404, path: "product not found" };
  }

  if (product.type !== "service" && product.stock < parsedQuantity) {
    return { status: 400, path: "stock exceeded" };
  }

  const existingItem = cartItems.find((item) => item.productId === productId);
  if (existingItem) {
    if (product.type !== "service" && existingItem.quantity + parsedQuantity > product.stock) {
      return { status: 400, path: "combined stock exceeded" };
    }
    existingItem.quantity += parsedQuantity;
  } else {
    cartItems.push({ productId, quantity: parsedQuantity });
  }

  return {
    status: 201,
    path: existingItem ? "existing item quantity increased" : "new item added",
    cart: calculateCartTotals(cartItems, products)
  };
}

function toggleWishlistPath(wishlistIds, productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) {
    return { status: 404, path: "product not found" };
  }

  if (wishlistIds.includes(productId)) {
    return {
      status: 200,
      path: "removed from wishlist",
      productIds: wishlistIds.filter((entry) => entry !== productId)
    };
  }

  return {
    status: 200,
    path: "added to wishlist",
    productIds: [...wishlistIds, productId]
  };
}

describe("Datamak e-commerce path tests", () => {
  test("PT-01 covers successful customer login path", () => {
    expect(loginPath("customer@datamak.local", "Customer@123")).toEqual({
      status: 200,
      path: "valid login",
      role: "customer"
    });
  });

  test("PT-02 covers rejected login paths for missing, unknown, and wrong credentials", () => {
    expect(loginPath("", "Customer@123").path).toBe("missing credentials");
    expect(loginPath("missing@datamak.local", "Customer@123").path).toBe("unknown email");
    expect(loginPath("customer@datamak.local", "wrongpass").path).toBe("wrong password");
  });

  test("PT-03 covers product search and category filter path", () => {
    const results = productCatalogPath({ search: "Dell", category: "Computers" });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((product) => product.category === "Computers")).toBe(true);
    expect(results.some((product) => product.name.includes("Dell"))).toBe(true);
  });

  test("PT-04 covers sorted catalog path by ascending price", () => {
    const results = productCatalogPath({ category: "ICT Products", sort: "price_asc" });
    const prices = results.map((product) => product.price);

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("PT-05 covers add-to-cart path for a new product item", () => {
    const logitech = products.find(
      (product) => product.name === "Logitech Wireless Keyboard and Mouse Combo"
    );
    const result = addToCartPath([], logitech.id, 1);

    expect(result.status).toBe(201);
    expect(result.path).toBe("new item added");
    expect(result.cart.total).toBe(79);
  });

  test("PT-06 covers add-to-cart error paths for missing product, invalid quantity, and stock exceeded", () => {
    const lenovo = products.find(
      (product) => product.name === "Lenovo ThinkPad X1 Carbon Gen 12"
    );

    expect(addToCartPath([], "", 1).path).toBe("missing product id");
    expect(addToCartPath([], lenovo.id, 0).path).toBe("invalid quantity");
    expect(addToCartPath([], "does-not-exist", 1).path).toBe("product not found");
    expect(addToCartPath([], lenovo.id, lenovo.stock + 1).path).toBe("stock exceeded");
  });

  test("PT-07 covers existing cart item quantity increase path", () => {
    const ssd = products.find((product) => product.name === "Samsung T7 Shield 2TB Portable SSD");
    const cartItems = [{ productId: ssd.id, quantity: 1 }];
    const result = addToCartPath(cartItems, ssd.id, 1);

    expect(result.status).toBe(201);
    expect(result.path).toBe("existing item quantity increased");
    expect(result.cart.items[0].quantity).toBe(2);
  });

  test("PT-08 covers wishlist add and remove paths", () => {
    const tablet = products.find((product) => product.name === "Samsung Galaxy Tab S9 FE");
    const added = toggleWishlistPath([], tablet.id);
    const removed = toggleWishlistPath(added.productIds, tablet.id);

    expect(added.path).toBe("added to wishlist");
    expect(added.productIds).toContain(tablet.id);
    expect(removed.path).toBe("removed from wishlist");
    expect(removed.productIds).not.toContain(tablet.id);
  });

  test("PT-09 covers checkout total path for physical and service products", () => {
    const dell = products.find((product) => product.name === "Dell UltraSharp 27-inch 4K");
    const microsoft365 = products.find((product) => product.name === "Microsoft 365 Business Standard");
    const cart = calculateCartTotals(
      [
        { productId: dell.id, quantity: 1 },
        { productId: microsoft365.id, quantity: 1 }
      ],
      products
    );

    expect(cart.items).toHaveLength(2);
    expect(cart.total).toBe(563.72);
  });

  test("PT-10 covers empty checkout path", () => {
    const cart = calculateCartTotals([], products);

    expect(cart.items).toHaveLength(0);
    expect(cart.total).toBe(0);
  });
});
