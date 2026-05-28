import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import BrandLogo from "../components/BrandLogo";
import ProductImage from "../components/ProductImage";
import { useAuth } from "../context/AuthContext";
import { colors, radii, shadows } from "../theme";

const TRUST_ITEMS = [
  { title: "Secure Payments", text: "100% secure checkout" },
  { title: "Fast Delivery", text: "Across Lesotho" },
  { title: "Quality Products", text: "Genuine and reliable" },
  { title: "24/7 Support", text: "We're here to help" }
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.combinedCard}>
        <View style={styles.cardHeader}>
          <BrandLogo />
          <View style={styles.actions}>
            <Pressable onPress={() => navigation.navigate("Profile")}>
              <Text style={styles.actionText}>Hi, {user?.name || "Customer"}</Text>
            </Pressable>
            <Pressable onPress={logout}>
              <Text style={styles.actionText}>Logout</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>
              Power Your World{"\n"}with Reliable Technology
            </Text>
            <Text style={styles.heroText}>
              Shop the latest computers, ICT products and web hosting solutions.
            </Text>
            <Pressable style={styles.shopButton} onPress={() => navigation.navigate("Products")}>
              <Text style={styles.shopButtonText}>Shop Now</Text>
            </Pressable>
          </View>
          <ProductImage uri="/images/tech-e-comm.jpg" style={styles.heroImage} />
        </View>
      </View>

      <View style={styles.trustStrip}>
        {TRUST_ITEMS.map((item) => (
          <View style={styles.trustItem} key={item.title}>
            <View style={styles.trustIcon}>
              <Text style={styles.trustIconText}>D</Text>
            </View>
            <View style={styles.trustCopy}>
              <Text style={styles.trustTitle}>{item.title}</Text>
              <Text style={styles.trustText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg
  },
  content: {
    padding: 12,
    paddingBottom: 28,
    gap: 14
  },
  combinedCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#dbe5ef",
    borderRadius: radii.panel,
    backgroundColor: colors.surface,
    ...shadows.strong
  },
  cardHeader: {
    minHeight: 104,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    backgroundColor: colors.surface,
    gap: 12
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14
  },
  actionText: {
    color: colors.navy,
    fontWeight: "900"
  },
  hero: {
    backgroundColor: "#061333"
  },
  heroCopy: {
    padding: 22,
    gap: 14,
    backgroundColor: "#061333"
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900"
  },
  heroText: {
    maxWidth: 330,
    color: "rgba(255,255,255,0.82)",
    fontSize: 16,
    lineHeight: 24
  },
  shopButton: {
    alignSelf: "flex-start",
    borderRadius: radii.card,
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: colors.webBlue
  },
  shopButtonText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  heroImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#01040c"
  },
  trustStrip: {
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: "hidden",
    ...shadows.soft
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e9eef6"
  },
  trustIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: colors.webBlue,
    alignItems: "center",
    justifyContent: "center"
  },
  trustIconText: {
    color: colors.webBlue,
    fontWeight: "900"
  },
  trustCopy: {
    flex: 1
  },
  trustTitle: {
    color: colors.navy,
    fontWeight: "900"
  },
  trustText: {
    color: "#53647c",
    marginTop: 2
  }
});
