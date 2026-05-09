import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import PageHeader from "../components/PageHeader";
import api, { getApiError } from "../api/client";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/currency";

const PAYMENT_METHODS = ["Card", "Mobile Money", "Bank Transfer"];

export default function CartScreen() {
  const navigation = useNavigation();
  const { cart, loading, refreshCart, updateItemQty, removeFromCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");

  useFocusEffect(
    useCallback(() => {
      refreshCart().catch((refreshError) => {
        setError(getApiError(refreshError, "Failed to load cart."));
      });
    }, [])
  );

  const updateQty = async (item, change) => {
    const next = item.quantity + change;
    if (next < 1) {
      return;
    }
    setBusyId(item.productId);
    setError("");
    try {
      await updateItemQty(item.productId, next);
    } catch (updateError) {
      setError(getApiError(updateError, "Failed to update quantity."));
    } finally {
      setBusyId("");
    }
  };

  const removeItem = async (productId) => {
    setBusyId(productId);
    setError("");
    try {
      await removeFromCart(productId);
    } catch (removeError) {
      setError(getApiError(removeError, "Failed to remove item."));
    } finally {
      setBusyId("");
    }
  };

  const checkout = async () => {
    setProcessing(true);
    setStatus("");
    setError("");
    try {
      const { data } = await api.post("/checkout", {
        paymentMethod,
        shippingAddress: "Not required"
      });
      await refreshCart();
      navigation.navigate("CheckoutSuccess", { order: data.order, orderId: data.order.id });
    } catch (checkoutError) {
      setError(getApiError(checkoutError, "Checkout failed."));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d7b78" />
      </View>
    );
  }

  const totals = cart.summary || {};

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <PageHeader
        title="Shopping Cart"
        subtitle="Review item quantities, verify totals, and continue to secure checkout."
        fallback="Products"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {status ? <Text style={styles.status}>{status}</Text> : null}

      {cart.items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add products from the Products tab to begin.</Text>
        </View>
      ) : (
        <>
          <View style={styles.itemsPanel}>
            <Text style={styles.sectionTitle}>Cart Items</Text>
            {cart.items.map((item) => (
              <View key={item.productId} style={styles.itemCard}>
                {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.itemImage} /> : null}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{item.category}</Text>
                  <Text style={styles.itemMeta}>{formatMoney(item.price)} x {item.quantity}</Text>
                  <Text style={styles.itemMeta}>Subtotal: {formatMoney(item.subtotal)}</Text>
                </View>
                <View style={styles.itemActions}>
                  <View style={styles.qtyRow}>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => updateQty(item, -1)}
                      disabled={busyId === item.productId}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </Pressable>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => updateQty(item, 1)}
                      disabled={busyId === item.productId}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => removeItem(item.productId)}
                    disabled={busyId === item.productId}
                  >
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.summaryPanel}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <SummaryLine label="Subtotal" value={formatMoney(totals.subtotal || cart.total)} />
            <SummaryLine label="Tax" value={formatMoney(totals.tax || 0)} />
            <SummaryLine label="Delivery" value={formatMoney(totals.deliveryFee || 0)} />
            <SummaryLine label="Grand Total" value={formatMoney(totals.grandTotal || cart.total)} total />

            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.paymentRow}>
              {PAYMENT_METHODS.map((method) => (
                <Pressable
                  key={method}
                  style={[styles.paymentChip, paymentMethod === method && styles.paymentChipActive]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text
                    style={[
                      styles.paymentChipText,
                      paymentMethod === method && styles.paymentChipTextActive
                    ]}
                  >
                    {method}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.checkoutBtn, processing && styles.disabledBtn]}
              onPress={checkout}
              disabled={processing}
            >
              <Text style={styles.checkoutBtnText}>
                {processing ? "Processing..." : "Place Order"}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function SummaryLine({ label, value, total }) {
  return (
    <View style={[styles.summaryLine, total && styles.totalLine]}>
      <Text style={[styles.summaryLabel, total && styles.totalText]}>{label}</Text>
      <Text style={[styles.summaryValue, total && styles.totalText]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f4f8f7"
  },
  content: {
    padding: 12,
    paddingBottom: 28,
    gap: 10
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f8f7"
  },
  error: {
    color: "#b2353b",
    backgroundColor: "#fceced",
    borderWidth: 1,
    borderColor: "#f4c9cb",
    borderRadius: 10,
    padding: 10,
    fontWeight: "700"
  },
  status: {
    color: "#1e7d52",
    backgroundColor: "#eaf9f0",
    borderWidth: 1,
    borderColor: "#c4e9d2",
    borderRadius: 10,
    padding: 10,
    fontWeight: "700"
  },
  emptyBox: {
    borderWidth: 1,
    borderColor: "#d9e4e0",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16
  },
  emptyText: {
    color: "#15374a",
    fontWeight: "900",
    fontSize: 18
  },
  emptySub: {
    color: "#5c7381",
    marginTop: 4
  },
  itemsPanel: {
    borderWidth: 1,
    borderColor: "#d8e5e1",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 12,
    gap: 10
  },
  summaryPanel: {
    borderWidth: 1,
    borderColor: "#d8e5e1",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 14,
    gap: 9
  },
  sectionTitle: {
    color: "#12384b",
    fontSize: 20,
    fontWeight: "900"
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#d7e4e0",
    borderRadius: 14,
    padding: 10,
    gap: 9,
    backgroundColor: "#fff"
  },
  itemImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: "#eef3f7"
  },
  itemInfo: {
    gap: 3
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#173b4c"
  },
  itemMeta: {
    color: "#5a7081"
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#e6f6f2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c3ddd7"
  },
  qtyBtnText: {
    color: "#0e706e",
    fontWeight: "900",
    fontSize: 18
  },
  qtyText: {
    minWidth: 22,
    textAlign: "center",
    fontWeight: "900",
    color: "#1d3e50"
  },
  removeBtn: {
    backgroundColor: "#c73f45",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  removeBtnText: {
    color: "#fff",
    fontWeight: "900"
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  summaryLabel: {
    color: "#5f7380",
    fontWeight: "800"
  },
  summaryValue: {
    color: "#07142a",
    fontWeight: "900"
  },
  totalLine: {
    borderTopWidth: 1,
    borderTopColor: "#d8e5e1",
    paddingTop: 10,
    marginTop: 2
  },
  totalText: {
    color: "#0b5f5c",
    fontSize: 18,
    fontWeight: "900"
  },
  label: {
    color: "#24404c",
    fontWeight: "900",
    marginTop: 4
  },
  paymentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  paymentChip: {
    borderWidth: 1,
    borderColor: "#c8deda",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff"
  },
  paymentChipActive: {
    borderColor: "#0644ca",
    backgroundColor: "#eef4ff"
  },
  paymentChipText: {
    color: "#173240",
    fontWeight: "800"
  },
  paymentChipTextActive: {
    color: "#0644ca"
  },
  checkoutBtn: {
    backgroundColor: "#0e7a78",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4
  },
  checkoutBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16
  },
  disabledBtn: {
    opacity: 0.65
  }
});
