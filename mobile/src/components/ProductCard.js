import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatMoney } from "../utils/currency";
import ProductImage from "./ProductImage";
import { colors, radii, shadows } from "../theme";

export default function ProductCard({
  product,
  busy,
  wishlisted,
  onAddToCart,
  onDetails,
  onQuickView,
  onWishlist
}) {
  const discountPercent = Number(product.discountPercent || 0);
  const discountedPrice = Number(
    (Number(product.price || 0) * (1 - discountPercent / 100)).toFixed(2)
  );
  const isService = product.type === "service";
  const isOutOfStock = !isService && Number(product.stock || 0) <= 0;
  const openQuickView = onQuickView || onDetails;

  return (
    <View style={styles.card}>
      <View style={styles.imageFrame}>
        <ProductImage uri={product.imageUrl} style={styles.image} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatMoney(discountedPrice)}</Text>
        <View style={styles.savings}>
          {discountPercent > 0 ? (
            <>
              <Text style={styles.oldPrice}>{formatMoney(product.price)}</Text>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </>
          ) : null}
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.lightButton} onPress={() => openQuickView?.(product)}>
            <Text style={styles.lightButtonText}>Quick View</Text>
          </Pressable>
          <Pressable style={styles.lightButton} onPress={() => onDetails?.(product)}>
            <Text style={styles.lightButtonText}>Details</Text>
          </Pressable>
        </View>

        <View style={styles.cartRow}>
          <Pressable
            style={[styles.addButton, (busy || isOutOfStock) && styles.disabled]}
            onPress={() => onAddToCart?.(product.id)}
            disabled={busy || isOutOfStock}
          >
            <Text style={styles.addButtonText}>
              {busy ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Text>
          </Pressable>

          {onWishlist ? (
            <Pressable style={styles.wishlistButton} onPress={() => onWishlist(product.id)}>
              <Text style={[styles.wishlistButtonText, wishlisted && styles.wishlistActive]}>
                {wishlisted ? "Saved" : "Save"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#e4e9f1",
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    overflow: "hidden",
    ...shadows.soft
  },
  imageFrame: {
    height: 176,
    margin: 14,
    marginBottom: 0,
    borderRadius: radii.image,
    overflow: "hidden",
    backgroundColor: "#f5f8fb"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  body: {
    padding: 13,
    gap: 6,
    backgroundColor: colors.surface
  },
  title: {
    minHeight: 40,
    color: colors.navy,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900"
  },
  price: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 15
  },
  savings: {
    minHeight: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  oldPrice: {
    color: "#82919e",
    textDecorationLine: "line-through",
    fontWeight: "700",
    fontSize: 12
  },
  discountText: {
    borderRadius: 4,
    backgroundColor: "#ffe9e9",
    color: "#d73535",
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 11,
    fontWeight: "900"
  },
  actionRow: {
    flexDirection: "row",
    gap: 8
  },
  lightButton: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: "#f5f8ff",
    paddingVertical: 8,
    alignItems: "center"
  },
  lightButtonText: {
    color: colors.webBlue,
    fontWeight: "900",
    fontSize: 12
  },
  cartRow: {
    flexDirection: "row",
    gap: 8
  },
  addButton: {
    flex: 1,
    minHeight: 38,
    borderWidth: 1,
    borderColor: "#b8cef5",
    borderRadius: 5,
    backgroundColor: colors.surface,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center"
  },
  addButtonText: {
    color: colors.webBlue,
    fontWeight: "900",
    fontSize: 13
  },
  wishlistButton: {
    minWidth: 62,
    borderWidth: 1,
    borderColor: "#b8cef5",
    borderRadius: 5,
    backgroundColor: "#f5f8ff",
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center"
  },
  wishlistButtonText: {
    color: "#51637d",
    fontWeight: "900",
    fontSize: 12
  },
  wishlistActive: {
    color: colors.webBlue
  },
  disabled: {
    opacity: 0.6
  }
});
