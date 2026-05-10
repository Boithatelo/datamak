import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import api, { getApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import { SHOP_CATEGORIES, getSubcategoriesForCategory } from "../data/shopCategories";

const DEFAULT_FILTERS = {
  search: "",
  category: "",
  subcategory: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest"
};
const LOGIN_TO_CART_MESSAGE = "Please login or register to add products to cart.";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest", api: "newest" },
  { value: "oldest", label: "Oldest", api: "oldest" },
  { value: "popularity", label: "Most Popular", api: "popularity_desc" },
  { value: "rating", label: "Top Rated", api: "rating_desc" },
  { value: "discount", label: "Best Discount", api: "discount_desc" },
  { value: "price_asc", label: "Price: Low to High", api: "price_asc" },
  { value: "price_desc", label: "Price: High to Low", api: "price_desc" },
  { value: "name", label: "Name: A-Z", api: "name_asc" },
  { value: "name_desc", label: "Name: Z-A", api: "name_desc" }
];

export default function ProductsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist, refreshWishlist } = useShop();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState("");

  const subcategories = useMemo(
    () => getSubcategoriesForCategory(filters.category),
    [filters.category]
  );

  const fetchProducts = async (nextFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const selectedSort =
        SORT_OPTIONS.find((option) => option.value === nextFilters.sort) || SORT_OPTIONS[0];
      const { data } = await api.get("/products", {
        params: {
          search: nextFilters.search || undefined,
          category: nextFilters.category || undefined,
          subcategory: nextFilters.subcategory || undefined,
          type: nextFilters.type || undefined,
          minPrice: nextFilters.minPrice || undefined,
          maxPrice: nextFilters.maxPrice || undefined,
          sort: selectedSort.api
        }
      });
      setProducts(data.products || []);
    } catch (fetchError) {
      setError(getApiError(fetchError, "Failed to load products."));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      refreshWishlist().catch(() => {});
    }, [])
  );

  const updateFilters = (updates, apply = false) => {
    const next = { ...filters, ...updates };
    if (updates.category !== undefined) {
      next.subcategory = "";
      next.type = updates.category === "Web Hosting Services" ? "service" : "";
    }
    setFilters(next);
    if (apply) {
      fetchProducts(next);
    }
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    fetchProducts(DEFAULT_FILTERS);
  };

  const onAddToCart = async (productId) => {
    if (!user) {
      setStatus(LOGIN_TO_CART_MESSAGE);
      return;
    }
    setStatus("");
    setBusyId(productId);
    try {
      await addToCart(productId, 1);
      setStatus("Product added to cart.");
    } catch (addError) {
      setStatus(getApiError(addError, "Could not add item."));
    } finally {
      setBusyId("");
    }
  };

  const onWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      setStatus("Wishlist updated.");
    } catch (wishlistError) {
      setStatus(getApiError(wishlistError, "Could not update wishlist."));
    }
  };

  return (
    <View style={styles.page}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <PageHeader
              eyebrow="Datamak Marketplace"
              title="Product Catalog"
              subtitle="Find computers, ICT gear, networking devices, software licenses, and cloud hosting packages from one curated catalog."
            />

            <View style={styles.panel}>
              <View style={styles.panelHead}>
                <Text style={styles.panelTitle}>Shop by Category</Text>
                <Pressable onPress={clearFilters}>
                  <Text style={styles.linkText}>View all</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {SHOP_CATEGORIES.map((item) => (
                  <Pressable
                    key={item.category}
                    style={[
                      styles.categoryCard,
                      filters.category === item.category && styles.categoryCardActive
                    ]}
                    onPress={() => updateFilters({ category: item.category }, true)}
                  >
                    <ProductImage uri={item.imageUrl} style={styles.categoryImage} />
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                    <Text style={styles.categoryDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.panel}>
              <TextInput
                style={styles.input}
                placeholder="Search products..."
                value={filters.search}
                onChangeText={(value) => updateFilters({ search: value })}
                onSubmitEditing={() => fetchProducts()}
              />
              <View style={styles.twoCol}>
                <TextInput
                  style={styles.input}
                  placeholder="Min price"
                  keyboardType="numeric"
                  value={filters.minPrice}
                  onChangeText={(value) => updateFilters({ minPrice: value })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Max price"
                  keyboardType="numeric"
                  value={filters.maxPrice}
                  onChangeText={(value) => updateFilters({ maxPrice: value })}
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {["", "physical", "service"].map((type) => (
                  <Pressable
                    key={type || "all"}
                    style={[styles.chip, filters.type === type && styles.chipActive]}
                    onPress={() => updateFilters({ type }, true)}
                  >
                    <Text style={[styles.chipText, filters.type === type && styles.chipTextActive]}>
                      {type ? type : "All Types"}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              {subcategories.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {subcategories.map((subcategory) => (
                    <Pressable
                      key={subcategory}
                      style={[styles.chip, filters.subcategory === subcategory && styles.chipActive]}
                      onPress={() => updateFilters({ subcategory }, true)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          filters.subcategory === subcategory && styles.chipTextActive
                        ]}
                      >
                        {subcategory}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              ) : null}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {SORT_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[styles.chip, filters.sort === option.value && styles.chipActive]}
                    onPress={() => updateFilters({ sort: option.value }, true)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.sort === option.value && styles.chipTextActive
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View style={styles.buttonRow}>
                <Pressable style={styles.secondaryButton} onPress={clearFilters}>
                  <Text style={styles.secondaryButtonText}>Clear</Text>
                </Pressable>
                <Pressable style={styles.primaryButton} onPress={() => fetchProducts()}>
                  <Text style={styles.primaryButtonText}>Apply Filters</Text>
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {status ? (
              <Text style={status === LOGIN_TO_CART_MESSAGE ? styles.error : styles.status}>
                {status}
              </Text>
            ) : null}
            {loading ? (
              <View style={styles.loadingInline}>
                <ActivityIndicator color="#0e7a78" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>Adjust search, category, type, or price filters.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            busy={busyId === item.id}
            wishlisted={wishlistIds.includes(item.id)}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
            onDetails={(product) => navigation.navigate("ProductDetails", { productId: product.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f4f8f7"
  },
  listContent: {
    padding: 12,
    paddingBottom: 28,
    gap: 10
  },
  panel: {
    borderWidth: 1,
    borderColor: "#d8e5e1",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 12,
    gap: 10,
    marginBottom: 2
  },
  panelHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  panelTitle: {
    color: "#081327",
    fontSize: 18,
    fontWeight: "900"
  },
  linkText: {
    color: "#0644ca",
    fontWeight: "900"
  },
  categoryCard: {
    width: 210,
    minHeight: 160,
    borderWidth: 1,
    borderColor: "#e2e8f2",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 12,
    gap: 6
  },
  categoryImage: {
    width: "100%",
    height: 76,
    borderRadius: 10,
    backgroundColor: "#eef3f7"
  },
  categoryCardActive: {
    borderColor: "#0644ca",
    backgroundColor: "#eef4ff"
  },
  categoryTitle: {
    color: "#081327",
    fontWeight: "900",
    fontSize: 16
  },
  categoryDescription: {
    color: "#5d7380",
    lineHeight: 18
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccddda",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff"
  },
  twoCol: {
    flexDirection: "row",
    gap: 8
  },
  chipRow: {
    gap: 8,
    paddingVertical: 2
  },
  chip: {
    borderWidth: 1,
    borderColor: "#c8deda",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff"
  },
  chipActive: {
    borderColor: "#0644ca",
    backgroundColor: "#eef4ff"
  },
  chipText: {
    color: "#173240",
    fontWeight: "800",
    textTransform: "capitalize"
  },
  chipTextActive: {
    color: "#0644ca"
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#0e7a78",
    alignItems: "center",
    paddingVertical: 12
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "900"
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#f2f8f6",
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#c8deda"
  },
  secondaryButtonText: {
    color: "#173240",
    fontWeight: "900"
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
  loadingInline: {
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  loadingText: {
    color: "#174254",
    fontWeight: "800"
  },
  empty: {
    borderWidth: 1,
    borderColor: "#d8e5e1",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 16
  },
  emptyTitle: {
    color: "#15384b",
    fontSize: 18,
    fontWeight: "900"
  },
  emptyText: {
    color: "#5f7480",
    marginTop: 4
  }
});
