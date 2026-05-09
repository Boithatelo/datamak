import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PageHeader({ title, subtitle, eyebrow, fallback = "Products", children }) {
  const navigation = useNavigation();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate(fallback);
  };

  return (
    <>
      <View style={styles.navLine}>
        <Pressable style={styles.backButton} onPress={goBack} accessibilityLabel="Go back">
          <Text style={styles.backText}>{"<"}</Text>
        </Pressable>
        <Text style={styles.crumb}>{fallback === "Products" ? "Home / " : ""}{title}</Text>
      </View>
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  navLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(14, 122, 120, 0.24)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  backText: {
    color: "#0e7a78",
    fontSize: 22,
    fontWeight: "900"
  },
  crumb: {
    flex: 1,
    color: "#12384b",
    fontWeight: "800"
  },
  hero: {
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(14, 122, 120, 0.22)",
    borderRadius: 18,
    backgroundColor: "#117f94",
    padding: 16,
    marginBottom: 12
  },
  heroCircle: {
    position: "absolute",
    right: -70,
    top: -86,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(255,255,255,0.16)"
  },
  eyebrow: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    color: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "900"
  },
  subtitle: {
    color: "rgba(255,255,255,0.84)",
    marginTop: 6,
    lineHeight: 20
  }
});
