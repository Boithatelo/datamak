const express = require("express");
const {
  readDb,
  writeDb,
  getOrCreateCart,
  calculateCartTotals
} = require("../data/store");

const router = express.Router();

function withSummary(cartData) {
  const subtotal = Number(cartData.total || 0);
  const hasPhysical = cartData.items.some((item) => item.type !== "service");
  const deliveryFee = hasPhysical ? (subtotal >= 800 ? 0 : 25) : 0;
  const tax = Number((subtotal * 0.15).toFixed(2));
  const grandTotal = Number((subtotal + deliveryFee + tax).toFixed(2));
  return {
    ...cartData,
    summary: {
      subtotal,
      tax,
      deliveryFee,
      grandTotal
    }
  };
}

router.get("/", async (req, res) => {
  const db = await readDb();
  const cart = getOrCreateCart(db, req.user.id);
  const details = calculateCartTotals(cart.items, db.products);
  return res.json({
    cart: withSummary({
      userId: cart.userId,
      ...details
    })
  });
});

router.post("/items", async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId is required." });
  }

  const parsedQuantity = Number(quantity);
  if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
    return res.status(400).json({ message: "Quantity should be at least 1." });
  }

  const db = await readDb();
  const product = db.products.find((entry) => entry.id === productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  if (product.type !== "service" && product.stock < parsedQuantity) {
    return res.status(400).json({ message: "Requested quantity exceeds stock." });
  }

  const cart = getOrCreateCart(db, req.user.id);
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    if (product.type !== "service" && existingItem.quantity + parsedQuantity > product.stock) {
      return res
        .status(400)
        .json({ message: "Requested quantity exceeds available stock." });
    }
    existingItem.quantity += parsedQuantity;
  } else {
    cart.items.push({ productId, quantity: parsedQuantity });
  }

  await writeDb(db);
  const details = calculateCartTotals(cart.items, db.products);
  return res.status(201).json({
    message: "Item added to cart.",
    cart: withSummary({ userId: cart.userId, ...details })
  });
});

router.put("/items/:productId", async (req, res) => {
  const { quantity } = req.body;
  const parsedQuantity = Number(quantity);

  if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
    return res.status(400).json({ message: "Quantity should be at least 1." });
  }

  const db = await readDb();
  const product = db.products.find((entry) => entry.id === req.params.productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  if (product.type !== "service" && parsedQuantity > product.stock) {
    return res
      .status(400)
      .json({ message: "Requested quantity exceeds available stock." });
  }

  const cart = getOrCreateCart(db, req.user.id);
  const item = cart.items.find((entry) => entry.productId === req.params.productId);
  if (!item) {
    return res.status(404).json({ message: "Cart item not found." });
  }

  item.quantity = parsedQuantity;
  await writeDb(db);
  const details = calculateCartTotals(cart.items, db.products);
  return res.json({
    message: "Cart updated.",
    cart: withSummary({ userId: cart.userId, ...details })
  });
});

router.delete("/items/:productId", async (req, res) => {
  const db = await readDb();
  const cart = getOrCreateCart(db, req.user.id);
  const currentLength = cart.items.length;
  cart.items = cart.items.filter((entry) => entry.productId !== req.params.productId);

  if (cart.items.length === currentLength) {
    return res.status(404).json({ message: "Cart item not found." });
  }

  await writeDb(db);
  const details = calculateCartTotals(cart.items, db.products);
  return res.json({
    message: "Item removed from cart.",
    cart: withSummary({ userId: cart.userId, ...details })
  });
});

router.delete("/", async (req, res) => {
  const db = await readDb();
  const cart = getOrCreateCart(db, req.user.id);
  cart.items = [];
  await writeDb(db);
  return res.json({
    message: "Cart cleared.",
    cart: withSummary({ userId: cart.userId, items: [], total: 0 })
  });
});

module.exports = router;
