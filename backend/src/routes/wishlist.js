const express = require("express");
const {
  readDb,
  writeDb,
  getOrCreateWishlist,
  getOrCreateRecentView
} = require("../data/store");

const router = express.Router();

function mapProductsByIds(ids, products) {
  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
}

router.get("/wishlist", (req, res) => {
  const db = readDb();
  const wishlist = getOrCreateWishlist(db, req.user.id);
  const products = mapProductsByIds(wishlist.productIds, db.products);
  return res.json({ wishlist: products, productIds: wishlist.productIds });
});

router.post("/wishlist/:productId", (req, res) => {
  const db = readDb();
  const product = db.products.find((entry) => entry.id === req.params.productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  const wishlist = getOrCreateWishlist(db, req.user.id);
  if (!wishlist.productIds.includes(product.id)) {
    wishlist.productIds.unshift(product.id);
  } else {
    wishlist.productIds = wishlist.productIds.filter((entry) => entry !== product.id);
  }

  writeDb(db);
  const products = mapProductsByIds(wishlist.productIds, db.products);
  return res.json({
    message: "Wishlist updated.",
    wishlist: products,
    productIds: wishlist.productIds
  });
});

router.delete("/wishlist/:productId", (req, res) => {
  const db = readDb();
  const wishlist = getOrCreateWishlist(db, req.user.id);
  wishlist.productIds = wishlist.productIds.filter((entry) => entry !== req.params.productId);
  writeDb(db);
  const products = mapProductsByIds(wishlist.productIds, db.products);
  return res.json({
    message: "Removed from wishlist.",
    wishlist: products,
    productIds: wishlist.productIds
  });
});

router.get("/recently-viewed", (req, res) => {
  const db = readDb();
  const recent = getOrCreateRecentView(db, req.user.id);
  const products = mapProductsByIds(recent.productIds, db.products);
  return res.json({ recentlyViewed: products, productIds: recent.productIds });
});

module.exports = router;
