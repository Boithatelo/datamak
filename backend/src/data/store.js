const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const {
  CATALOG_VERSION,
  buildDemoProducts,
  normalizeProductTaxonomy
} = require("./catalog");

const DB_PATH = path.join(__dirname, "../../data/db.json");

const REQUIRED_KEYS = [
  "users",
  "products",
  "carts",
  "orders",
  "wishlists",
  "passwordResets",
  "recentViews"
];

function nowIso() {
  return new Date().toISOString();
}

function seedProducts() {
  return buildDemoProducts(nowIso(), uuid);
}

function createSeedData() {
  const timestamp = nowIso();
  const adminId = uuid();
  const userId = uuid();

  return {
    catalogVersion: CATALOG_VERSION,
    users: [
      {
        id: adminId,
        name: "System Admin",
        email: "admin@datamak.local",
        passwordHash: bcrypt.hashSync("Admin@123", 10),
        role: "admin",
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: userId,
        name: "Sample Customer",
        email: "customer@datamak.local",
        passwordHash: bcrypt.hashSync("Customer@123", 10),
        role: "customer",
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ],
    products: seedProducts(),
    carts: [{ userId, items: [] }],
    orders: [],
    wishlists: [{ userId, productIds: [] }],
    passwordResets: [],
    recentViews: [{ userId, productIds: [] }]
  };
}

function ensureDirectory() {
  const directory = path.dirname(DB_PATH);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function isValidDbShape(db) {
  return db && REQUIRED_KEYS.every((key) => Array.isArray(db[key]));
}

function normalizeProduct(product) {
  const normalized = { ...product };
  const taxonomy = normalizeProductTaxonomy(normalized);
  normalized.category = taxonomy.category;
  normalized.subcategory = taxonomy.subcategory;
  normalized.type = taxonomy.type;
  normalized.stock =
    normalized.type === "service"
      ? 0
      : Math.max(0, Math.trunc(Number(normalized.stock) || 0));
  normalized.rating = Number(normalized.rating || 4.5);
  normalized.reviewsCount = Number(normalized.reviewsCount || 0);
  normalized.popularity = Number(normalized.popularity || 50);
  normalized.discountPercent = Number(normalized.discountPercent || 0);
  normalized.isFeatured = Boolean(normalized.isFeatured);
  normalized.badges = Array.isArray(normalized.badges) ? normalized.badges : [];
  normalized.specifications = Array.isArray(normalized.specifications)
    ? normalized.specifications
    : [];
  normalized.gallery = Array.isArray(normalized.gallery)
    ? normalized.gallery
    : normalized.imageUrl
    ? [normalized.imageUrl]
    : [];
  normalized.updatedAt = normalized.updatedAt || normalized.createdAt || nowIso();
  normalized.createdAt = normalized.createdAt || normalized.updatedAt;
  return normalized;
}

function migrateCatalogProducts(db) {
  db.products = db.products.map(normalizeProduct);

  const existingSubcategories = new Set(
    db.products.map((product) => `${product.category}::${product.subcategory}`)
  );
  const timestamp = nowIso();
  buildDemoProducts(timestamp, uuid).forEach((product) => {
    const key = `${product.category}::${product.subcategory}`;
    if (!existingSubcategories.has(key)) {
      db.products.push(product);
      existingSubcategories.add(key);
    }
  });

  db.catalogVersion = CATALOG_VERSION;
  return db;
}

function normalizeDb(db) {
  const normalized = { ...db };
  REQUIRED_KEYS.forEach((key) => {
    if (!Array.isArray(normalized[key])) {
      normalized[key] = [];
    }
  });

  normalized.users = normalized.users.map((user) => ({
    ...user,
    updatedAt: user.updatedAt || user.createdAt || nowIso()
  }));

  normalized.products = normalized.products.map(normalizeProduct);
  normalized.carts = normalized.carts.map((cart) => ({
    userId: cart.userId,
    items: Array.isArray(cart.items)
      ? cart.items
          .map((item) => ({
            productId: item.productId,
            quantity: Math.max(1, Math.trunc(Number(item.quantity) || 1))
          }))
          .filter((item) => item.productId)
      : []
  }));

  normalized.wishlists = normalized.wishlists.map((entry) => ({
    userId: entry.userId,
    productIds: Array.from(new Set(Array.isArray(entry.productIds) ? entry.productIds : []))
  }));

  normalized.recentViews = normalized.recentViews.map((entry) => ({
    userId: entry.userId,
    productIds: Array.from(new Set(Array.isArray(entry.productIds) ? entry.productIds : [])).slice(
      0,
      20
    )
  }));

  normalized.passwordResets = normalized.passwordResets.filter(
    (entry) => entry && entry.token && entry.userId
  );

  return normalized;
}

function ensureDb() {
  ensureDirectory();
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(createSeedData(), null, 2), "utf-8");
    return;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    if (!isValidDbShape(parsed)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(createSeedData(), null, 2), "utf-8");
      return;
    }
    const normalized = normalizeDb(parsed);
    if (normalized.catalogVersion !== CATALOG_VERSION) {
      migrateCatalogProducts(normalized);
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(normalized, null, 2), "utf-8");
  } catch (error) {
    fs.writeFileSync(DB_PATH, JSON.stringify(createSeedData(), null, 2), "utf-8");
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return normalizeDb(JSON.parse(raw));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(normalizeDb(db), null, 2), "utf-8");
}

function withDb(mutator) {
  const db = readDb();
  const result = mutator(db);
  writeDb(db);
  return result;
}

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function getOrCreateCart(db, userId) {
  let cart = db.carts.find((entry) => entry.userId === userId);
  if (!cart) {
    cart = { userId, items: [] };
    db.carts.push(cart);
  }
  return cart;
}

function getOrCreateWishlist(db, userId) {
  let wishlist = db.wishlists.find((entry) => entry.userId === userId);
  if (!wishlist) {
    wishlist = { userId, productIds: [] };
    db.wishlists.push(wishlist);
  }
  return wishlist;
}

function getOrCreateRecentView(db, userId) {
  let recentView = db.recentViews.find((entry) => entry.userId === userId);
  if (!recentView) {
    recentView = { userId, productIds: [] };
    db.recentViews.push(recentView);
  }
  return recentView;
}

function calculateCartTotals(cartItems, products) {
  const detailedItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return null;
      }
      const listPrice = Number(product.price || 0);
      const discountPercent = Number(product.discountPercent || 0);
      const unitPrice = Number((listPrice * (1 - discountPercent / 100)).toFixed(2));
      const subtotal = Number((unitPrice * item.quantity).toFixed(2));
      return {
        productId: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        type: product.type,
        listPrice,
        price: unitPrice,
        discountPercent,
        quantity: item.quantity,
        stock: product.stock,
        imageUrl: product.imageUrl,
        subtotal
      };
    })
    .filter(Boolean);

  const total = Number(
    detailedItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)
  );

  return { items: detailedItems, total };
}

module.exports = {
  nowIso,
  readDb,
  writeDb,
  withDb,
  sanitizeUser,
  getOrCreateCart,
  getOrCreateWishlist,
  getOrCreateRecentView,
  calculateCartTotals
};
