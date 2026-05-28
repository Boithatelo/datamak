function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function getPathSegments(url) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean);
  } catch (error) {
    return String(url || "")
      .split("?")[0]
      .split("/")
      .filter(Boolean);
  }
}

function getLastPathSegment(url) {
  const segments = getPathSegments(url);
  return segments[segments.length - 1] || "";
}

function calculateCartSummary(items) {
  const normalizedItems = items.map((item) => ({
    ...item,
    quantity: Number(item.quantity || 1),
    price: Number(item.price || 0),
    subtotal: Number((Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2))
  }));

  const subtotal = Number(
    normalizedItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0).toFixed(2)
  );
  const tax = Number((subtotal * 0.15).toFixed(2));
  const hasPhysical = normalizedItems.some((item) => item.type !== "service");
  const deliveryFee = hasPhysical && normalizedItems.length ? 120 : 0;
  const grandTotal = Number((subtotal + tax + deliveryFee).toFixed(2));

  return {
    items: normalizedItems,
    total: grandTotal,
    summary: {
      subtotal,
      tax,
      deliveryFee,
      grandTotal
    }
  };
}

function createCartForUser(userId, seedCart = null) {
  const baseCart = seedCart
    ? deepClone(seedCart)
    : {
        userId,
        items: [],
        total: 0,
        summary: {
          subtotal: 0,
          tax: 0,
          deliveryFee: 0,
          grandTotal: 0
        }
      };

  const cartWithSummary = calculateCartSummary(baseCart.items || []);
  return {
    userId,
    items: cartWithSummary.items,
    total: cartWithSummary.total,
    summary: cartWithSummary.summary
  };
}

function createOrderFromCart({ orderId, orderNumber, user, paymentMethod, cart }) {
  const timestamp = new Date().toISOString();
  const transactionRef = `TX-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

  return {
    id: orderId,
    orderNumber,
    userId: user.id,
    customer: {
      email: user.email,
      name: user.name
    },
    items: cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    })),
    totals: {
      subtotal: cart.summary.subtotal,
      tax: cart.summary.tax,
      deliveryFee: cart.summary.deliveryFee,
      discountAmount: 0,
      grandTotal: cart.summary.grandTotal
    },
    total: cart.summary.grandTotal,
    payment: {
      method: paymentMethod || "Card",
      transactionRef
    },
    shippingAddress: "Not required",
    billingAddress: "Not required",
    status: "Paid",
    createdAt: timestamp,
    statusHistory: [
      {
        timestamp,
        status: "Pending",
        note: "Order placed by customer."
      },
      {
        timestamp,
        status: "Paid",
        note: "Payment approved."
      }
    ]
  };
}

function buildAdminSummary(state, adminFixture) {
  const revenue = Number(
    state.orders.reduce((sum, order) => sum + Number(order.total || 0), 0).toFixed(2)
  );

  const statusOrder = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];
  const computedByStatus = {};
  statusOrder.forEach((status) => {
    computedByStatus[status] = 0;
  });

  state.orders.forEach((order) => {
    if (computedByStatus[order.status] === undefined) {
      computedByStatus[order.status] = 0;
    }
    computedByStatus[order.status] += 1;
  });

  const salesByMonth = {};
  state.orders.forEach((order) => {
    const month = new Date(order.createdAt).toLocaleString("en-US", { month: "short" });
    salesByMonth[month] = Number((salesByMonth[month] || 0) + Number(order.total || 0)).toFixed(2);
  });

  const monthEntries = Object.entries(salesByMonth).map(([month, total]) => ({
    month,
    total: Number(total)
  }));

  const topSellingMap = {};
  state.orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (!topSellingMap[item.productId]) {
        topSellingMap[item.productId] = {
          productId: item.productId,
          name: item.name,
          quantity: 0,
          revenue: 0
        };
      }
      topSellingMap[item.productId].quantity += Number(item.quantity || 0);
      topSellingMap[item.productId].revenue = Number(
        (topSellingMap[item.productId].revenue + Number(item.subtotal || 0)).toFixed(2)
      );
    });
  });

  const topSellingProducts = Object.values(topSellingMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    users: state.users.length,
    products: state.products.length,
    orders: state.orders.length,
    totalRevenue: revenue,
    ordersByStatus: {
      ...(adminFixture.ordersByStatus || {}),
      ...computedByStatus
    },
    monthlySales: monthEntries.length ? monthEntries : adminFixture.monthlySales || [],
    topSellingProducts
  };
}

export function registerEcommerceApiMocks({
  authFixture,
  productsFixture,
  cartFixture,
  ordersFixture,
  adminFixture,
  options = {}
}) {
  const customerUser = deepClone(authFixture.users.customer);
  const adminUser = deepClone(authFixture.users.admin);

  const state = {
    users: [customerUser, adminUser],
    products: deepClone(productsFixture.products || []),
    orders: deepClone(ordersFixture.orders || []),
    cartsByUserId: {
      [customerUser.id]: createCartForUser(customerUser.id, cartFixture.customerCart || null),
      [adminUser.id]: createCartForUser(adminUser.id, cartFixture.emptyCart || null)
    },
    wishlistByUserId: {},
    recentByUserId: {},
    userIdByToken: new Map([
      [authFixture.tokens.customer, customerUser.id],
      [authFixture.tokens.admin, adminUser.id]
    ]),
    tokenByUserId: new Map([
      [customerUser.id, authFixture.tokens.customer],
      [adminUser.id, authFixture.tokens.admin]
    ]),
    nextUserNumber: 3,
    nextOrderNumber: 2000
  };

  const requireAuthUser = (req) => {
    const rawAuth = String(req.headers.authorization || "");
    const token = rawAuth.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return null;
    }
    const userId = state.userIdByToken.get(token);
    if (!userId) {
      return null;
    }
    return state.users.find((user) => user.id === userId) || null;
  };

  const getOrCreateCart = (userId) => {
    if (!state.cartsByUserId[userId]) {
      state.cartsByUserId[userId] = createCartForUser(userId, cartFixture.emptyCart || null);
    }
    return state.cartsByUserId[userId];
  };

  const syncCartSummary = (cart) => {
    const summary = calculateCartSummary(cart.items || []);
    cart.items = summary.items;
    cart.total = summary.total;
    cart.summary = summary.summary;
  };

  const unauthorized = (req, message = "Unauthorized.") => {
    req.reply({
      statusCode: 401,
      body: { message }
    });
  };

  const forbidden = (req, message = "Forbidden.") => {
    req.reply({
      statusCode: 403,
      body: { message }
    });
  };

  cy.intercept("POST", "**/api/auth/login", (req) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const user = state.users.find((entry) => entry.email.toLowerCase() === email);

    if (!user || user.password !== password) {
      req.reply({
        statusCode: 401,
        body: { message: "Invalid email or password." }
      });
      return;
    }

    let token = state.tokenByUserId.get(user.id);
    if (!token) {
      token = `token-${user.id}`;
      state.tokenByUserId.set(user.id, token);
      state.userIdByToken.set(token, user.id);
    }

    req.reply({
      statusCode: 200,
      body: {
        token,
        user: sanitizeUser(user)
      }
    });
  }).as("apiLogin");

  cy.intercept("POST", "**/api/auth/register", (req) => {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!name || !email || !password) {
      req.reply({
        statusCode: 400,
        body: { message: "All required fields must be provided." }
      });
      return;
    }

    const existing = state.users.find((entry) => entry.email.toLowerCase() === email);
    if (existing) {
      req.reply({
        statusCode: 409,
        body: { message: "An account with this email already exists." }
      });
      return;
    }

    const userId = `usr-customer-${String(state.nextUserNumber).padStart(3, "0")}`;
    state.nextUserNumber += 1;
    const newUser = {
      id: userId,
      name,
      email,
      password,
      role: "customer",
      createdAt: new Date().toISOString()
    };
    state.users.push(newUser);

    const token = `token-${userId}`;
    state.tokenByUserId.set(userId, token);
    state.userIdByToken.set(token, userId);
    state.cartsByUserId[userId] = createCartForUser(userId, cartFixture.emptyCart || null);

    req.reply({
      statusCode: 201,
      body: {
        token,
        user: sanitizeUser(newUser)
      }
    });
  }).as("apiRegister");

  cy.intercept("GET", "**/api/auth/me", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }

    req.reply({
      statusCode: 200,
      body: { user: sanitizeUser(user) }
    });
  }).as("apiAuthMe");

  cy.intercept("PATCH", "**/api/auth/me", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }

    user.name = String(req.body?.name || user.name);
    req.reply({
      statusCode: 200,
      body: { user: sanitizeUser(user) }
    });
  }).as("apiProfileUpdate");

  cy.intercept("POST", "**/api/auth/forgot-password", {
    statusCode: 200,
    body: { message: "Password reset instructions sent." }
  }).as("apiForgotPassword");

  cy.intercept("POST", "**/api/auth/reset-password", {
    statusCode: 200,
    body: { message: "Password reset complete." }
  }).as("apiResetPassword");

  cy.intercept("GET", /\/api\/products(\?.*)?$/, (req) => {
    req.reply({
      statusCode: 200,
      body: {
        products: state.products,
        page: 1,
        pageSize: Number(req.query?.pageSize || state.products.length),
        total: state.products.length
      }
    });
  }).as("apiProductsList");

  cy.intercept("GET", /\/api\/products\/[^/?]+(\?.*)?$/, (req) => {
    const id = getLastPathSegment(req.url);
    const product = state.products.find((entry) => entry.id === id);
    if (!product) {
      req.reply({
        statusCode: 404,
        body: { message: "Product not found." }
      });
      return;
    }
    req.reply({
      statusCode: 200,
      body: { product }
    });
  }).as("apiProductDetails");

  cy.intercept("POST", "**/api/uploads/images", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    if (user.role !== "admin") {
      forbidden(req);
      return;
    }

    const images = req.body?.images || [];
    req.reply({
      statusCode: 200,
      body: {
        images: images.map((image, index) => ({
          url: `/images/upload-${Date.now()}-${index + 1}-${String(image?.name || "asset").replace(/\s+/g, "-")}`
        }))
      }
    });
  }).as("apiUploadImages");

  cy.intercept("POST", "**/api/products", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    if (user.role !== "admin") {
      forbidden(req);
      return;
    }

    const payload = req.body || {};
    const id = `prd-custom-${Date.now()}`;
    const product = {
      id,
      name: payload.name || "New Product",
      description: payload.description || "",
      category: payload.category || "Computers",
      subcategory: payload.subcategory || "Laptops",
      type: payload.type || "physical",
      price: Number(payload.price || 0),
      stock: payload.type === "service" ? 999 : Number(payload.stock || 0),
      imageUrl: payload.imageUrl || "/images/default-product.jpg",
      discountPercent: Number(payload.discountPercent || 0),
      popularity: Number(payload.popularity || 50),
      rating: Number(payload.rating || 4.5),
      reviewsCount: Number(payload.reviewsCount || 0),
      createdAt: new Date().toISOString()
    };

    state.products.unshift(product);
    req.reply({
      statusCode: 201,
      body: { product }
    });
  }).as("apiCreateProduct");

  cy.intercept("PUT", /\/api\/products\/[^/?]+(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    if (user.role !== "admin") {
      forbidden(req);
      return;
    }

    const id = getLastPathSegment(req.url);
    const product = state.products.find((entry) => entry.id === id);
    if (!product) {
      req.reply({
        statusCode: 404,
        body: { message: "Product not found." }
      });
      return;
    }

    Object.assign(product, req.body || {});
    req.reply({
      statusCode: 200,
      body: { product }
    });
  }).as("apiUpdateProduct");

  cy.intercept("DELETE", /\/api\/products\/[^/?]+(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    if (user.role !== "admin") {
      forbidden(req);
      return;
    }

    const id = getLastPathSegment(req.url);
    state.products = state.products.filter((entry) => entry.id !== id);
    Object.values(state.cartsByUserId).forEach((cart) => {
      cart.items = (cart.items || []).filter((item) => item.productId !== id);
      syncCartSummary(cart);
    });
    req.reply({
      statusCode: 200,
      body: { success: true }
    });
  }).as("apiDeleteProduct");

  cy.intercept("GET", "**/api/wishlist", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    const ids = state.wishlistByUserId[user.id] || [];
    const wishlist = state.products.filter((product) => ids.includes(product.id));
    req.reply({
      statusCode: 200,
      body: {
        productIds: ids,
        wishlist
      }
    });
  }).as("apiWishlist");

  cy.intercept("POST", /\/api\/wishlist\/[^/?]+(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    const productId = getLastPathSegment(req.url);
    const ids = state.wishlistByUserId[user.id] || [];
    const nextIds = ids.includes(productId)
      ? ids.filter((id) => id !== productId)
      : [...ids, productId];
    state.wishlistByUserId[user.id] = nextIds;
    const wishlist = state.products.filter((product) => nextIds.includes(product.id));
    req.reply({
      statusCode: 200,
      body: {
        productIds: nextIds,
        wishlist
      }
    });
  }).as("apiWishlistToggle");

  cy.intercept("DELETE", /\/api\/wishlist\/[^/?]+(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    const productId = getLastPathSegment(req.url);
    const ids = state.wishlistByUserId[user.id] || [];
    const nextIds = ids.filter((id) => id !== productId);
    state.wishlistByUserId[user.id] = nextIds;
    const wishlist = state.products.filter((product) => nextIds.includes(product.id));
    req.reply({
      statusCode: 200,
      body: {
        productIds: nextIds,
        wishlist
      }
    });
  }).as("apiWishlistRemove");

  cy.intercept("GET", "**/api/recently-viewed", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    req.reply({
      statusCode: 200,
      body: {
        recentlyViewed: state.recentByUserId[user.id] || []
      }
    });
  }).as("apiRecentlyViewed");

  cy.intercept("POST", /\/api\/products\/[^/?]+\/view(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      req.reply({ statusCode: 204 });
      return;
    }
    const segments = getPathSegments(req.url);
    const productId = segments[segments.length - 2];
    const product = state.products.find((entry) => entry.id === productId);
    if (product) {
      const current = state.recentByUserId[user.id] || [];
      state.recentByUserId[user.id] = [product, ...current.filter((entry) => entry.id !== product.id)].slice(
        0,
        12
      );
    }
    req.reply({ statusCode: 200, body: { success: true } });
  }).as("apiMarkViewed");

  cy.intercept("GET", "**/api/cart", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    const cart = getOrCreateCart(user.id);
    syncCartSummary(cart);
    req.reply({
      statusCode: 200,
      body: { cart }
    });
  }).as("apiCartGet");

  cy.intercept("POST", "**/api/cart/items", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    const cart = getOrCreateCart(user.id);
    const productId = String(req.body?.productId || "");
    const quantity = Math.max(1, Number(req.body?.quantity || 1));
    const product = state.products.find((entry) => entry.id === productId);

    if (!product) {
      req.reply({
        statusCode: 404,
        body: { message: "Product not found." }
      });
      return;
    }

    if (product.type !== "service" && Number(product.stock || 0) <= 0) {
      req.reply({
        statusCode: 400,
        body: { message: "Product is out of stock." }
      });
      return;
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      if (product.type !== "service") {
        existingItem.quantity = Math.min(existingItem.quantity, Number(product.stock || existingItem.quantity));
      }
    } else {
      cart.items.push({
        productId,
        name: product.name,
        imageUrl: product.imageUrl,
        category: product.category,
        subcategory: product.subcategory,
        type: product.type,
        stock: Number(product.stock || 999),
        price: Number(product.price || 0),
        quantity: product.type === "service" ? quantity : Math.min(quantity, Number(product.stock || quantity)),
        subtotal: 0
      });
    }

    syncCartSummary(cart);
    req.reply({
      statusCode: 200,
      body: { cart }
    });
  }).as("apiCartAdd");

  cy.intercept("PUT", /\/api\/cart\/items\/[^/?]+(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    const cart = getOrCreateCart(user.id);
    const productId = getLastPathSegment(req.url);
    const quantity = Math.max(1, Number(req.body?.quantity || 1));
    const item = cart.items.find((entry) => entry.productId === productId);

    if (!item) {
      req.reply({
        statusCode: 404,
        body: { message: "Cart item not found." }
      });
      return;
    }

    if (item.type !== "service") {
      item.quantity = Math.min(quantity, Number(item.stock || quantity));
    } else {
      item.quantity = quantity;
    }
    syncCartSummary(cart);

    req.reply({
      statusCode: 200,
      body: { cart }
    });
  }).as("apiCartUpdate");

  cy.intercept("DELETE", /\/api\/cart\/items\/[^/?]+(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    const cart = getOrCreateCart(user.id);
    const productId = getLastPathSegment(req.url);
    cart.items = cart.items.filter((entry) => entry.productId !== productId);
    syncCartSummary(cart);
    req.reply({
      statusCode: 200,
      body: { cart }
    });
  }).as("apiCartRemove");

  cy.intercept("DELETE", "**/api/cart", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    state.cartsByUserId[user.id] = createCartForUser(user.id, cartFixture.emptyCart || null);
    req.reply({
      statusCode: 200,
      body: { cart: state.cartsByUserId[user.id] }
    });
  }).as("apiCartClear");

  cy.intercept("POST", "**/api/checkout", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }

    const cart = getOrCreateCart(user.id);
    if (!cart.items.length) {
      req.reply({
        statusCode: 400,
        body: { message: "Cart is empty." }
      });
      return;
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `DTMK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${state.nextOrderNumber}`;
    state.nextOrderNumber += 1;
    const order = createOrderFromCart({
      orderId,
      orderNumber,
      user,
      paymentMethod: req.body?.paymentMethod || "Card",
      cart
    });

    state.orders.unshift(order);
    state.cartsByUserId[user.id] = createCartForUser(user.id, cartFixture.emptyCart || null);

    req.reply({
      statusCode: 200,
      body: { order }
    });
  }).as("apiCheckout");

  cy.intercept("GET", /\/api\/orders(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }

    const orders =
      user.role === "admin"
        ? state.orders
        : state.orders.filter((order) => order.userId === user.id || order.customer?.email === user.email);

    req.reply({
      statusCode: 200,
      body: { orders }
    });
  }).as("apiOrdersList");

  cy.intercept("GET", /\/api\/orders\/[^/?]+(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    const orderId = getLastPathSegment(req.url);
    const order = state.orders.find((entry) => entry.id === orderId);
    if (!order) {
      req.reply({
        statusCode: 404,
        body: { message: "Order not found." }
      });
      return;
    }
    if (user.role !== "admin" && order.userId !== user.id) {
      forbidden(req);
      return;
    }
    req.reply({
      statusCode: 200,
      body: { order }
    });
  }).as("apiOrderDetails");

  cy.intercept("PATCH", /\/api\/orders\/[^/?]+\/status(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    if (user.role !== "admin") {
      forbidden(req);
      return;
    }
    const segments = getPathSegments(req.url);
    const orderId = segments[segments.length - 2];
    const order = state.orders.find((entry) => entry.id === orderId);
    if (!order) {
      req.reply({
        statusCode: 404,
        body: { message: "Order not found." }
      });
      return;
    }
    order.status = String(req.body?.status || order.status);
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      timestamp: new Date().toISOString(),
      status: order.status,
      note: req.body?.note || `Updated to ${order.status}.`
    });
    req.reply({
      statusCode: 200,
      body: { order }
    });
  }).as("apiOrderStatusUpdate");

  cy.intercept("GET", "**/api/admin/summary", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    if (user.role !== "admin") {
      forbidden(req);
      return;
    }
    req.reply({
      statusCode: 200,
      body: buildAdminSummary(state, adminFixture || {})
    });
  }).as("apiAdminSummary");

  cy.intercept("GET", "**/api/admin/users", (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    if (user.role !== "admin") {
      forbidden(req);
      return;
    }
    req.reply({
      statusCode: 200,
      body: {
        users: state.users.map((entry) => sanitizeUser(entry))
      }
    });
  }).as("apiAdminUsers");

  cy.intercept("PATCH", /\/api\/admin\/users\/[^/?]+\/role(\?.*)?$/, (req) => {
    const user = requireAuthUser(req);
    if (!user) {
      unauthorized(req);
      return;
    }
    if (user.role !== "admin") {
      forbidden(req);
      return;
    }
    const segments = getPathSegments(req.url);
    const userId = segments[segments.length - 2];
    const target = state.users.find((entry) => entry.id === userId);
    if (!target) {
      req.reply({
        statusCode: 404,
        body: { message: "User not found." }
      });
      return;
    }
    target.role = String(req.body?.role || target.role);
    req.reply({
      statusCode: 200,
      body: { user: sanitizeUser(target) }
    });
  }).as("apiAdminRoleChange");

  if (options.simulateCatalogDelayMs) {
    cy.intercept("GET", /\/api\/products(\?.*)?$/, (req) => {
      req.reply({
        delay: options.simulateCatalogDelayMs,
        statusCode: 200,
        body: {
          products: state.products,
          page: 1,
          pageSize: state.products.length,
          total: state.products.length
        }
      });
    }).as("apiProductsListWithDelay");
  }
}
