import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { formatMoney } from "../utils/currency";

export default function ProductCard({
  product,
  busy,
  wishlisted,
  onAddToCart,
  onDetails,
  onWishlist
}) {
  const discountPercent = Number(product.discountPercent || 0);
  const discountedPrice = Number(
    (Number(product.price || 0) * (1 - discountPercent / 100)).toFixed(2)
  );
  const isService = product.type === "service";
  const isOutOfStock = !isService && Number(product.stock || 0) <= 0;

  return (
    <View style={styles.card}>
      <View style={styles.imageFrame}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
        <Pressable style={styles.wishlist} onPress={() => onWishlist?.(product.id)}>
          <Text style={[styles.wishlistText, wishlisted && styles.wishlistActive]}>♥</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description || product.subcategory}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatMoney(discountedPrice)}</Text>
          {discountPercent > 0 ? (
            <View style={styles.discount}>
              <Text style={styles.oldPrice}>{formatMoney(product.price)}</Text>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.stock}>{isService ? "Service item" : `Stock: ${product.stock}`}</Text>
        <View style={styles.actionRow}>
          <Pressable style={styles.lightButton} onPress={() => onDetails?.(product)}>
            <Text style={styles.lightButtonText}>Details</Text>
          </Pressable>
          <Pressable
            style={[styles.addButton, (busy || isOutOfStock) && styles.disabled]}
            onPress={() => onAddToCart?.(product.id)}
            disabled={busy || isOutOfStock}
          >
            <Text style={styles.addButtonText}>
              {busy ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#d8e5e1",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  imageFrame: {
    height: 184,
    margin: 12,
    marginBottom: 0,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f5f8fb"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  wishlist: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.86)"
  },
  wishlistText: {
    color: "#51637d",
    fontSize: 20,
    fontWeight: "900"
  },
  wishlistActive: {
    color: "#c4373a"
  },
  body: {
    padding: 12,
    gap: 7
  },
  category: {
    alignSelf: "flex-start",
    backgroundColor: "#e6f7f3",
    color: "#0d6e6c",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "800"
  },
  title: {
    minHeight: 44,
    fontSize: 18,
    fontWeight: "900",
    color: "#07142a"
  },
  description: {
    color: "#5d7380",
    lineHeight: 19
  },
  priceRow: {
    gap: 4
  },
  price: {
    color: "#07142a",
    fontWeight: "900",
    fontSize: 17
  },
  discount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  oldPrice: {
    color: "#82919e",
    textDecorationLine: "line-through",
    fontWeight: "700"
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
  stock: {
    color: "#5b7080"
  },
  actionRow: {
    flexDirection: "row",
    gap: 8
  },
  lightButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#f5f8ff",
    paddingVertical: 11,
    alignItems: "center"
  },
  lightButtonText: {
    color: "#0644ca",
    fontWeight: "900"
  },
  addButton: {
    flex: 1.25,
    borderRadius: 10,
    backgroundColor: "#0e7a78",
    paddingVertical: 11,
    alignItems: "center"
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "900"
  },
  disabled: {
    opacity: 0.6
  }
});
