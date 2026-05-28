import { StyleSheet, Text, View } from "react-native";
import { colors, shadows } from "../theme";

export default function BrandLogo({ compact = false, light = false, style }) {
  return (
    <View style={[styles.logo, compact && styles.logoCompact, style]}>
      <View style={[styles.mark, compact && styles.markCompact]}>
        <View style={styles.markBlue} />
        <View style={styles.markTeal} />
        <Text style={[styles.markLetter, compact && styles.markLetterCompact]}>D</Text>
        <View style={[styles.dot, styles.dotTop]} />
        <View style={[styles.dot, styles.dotBottomOne]} />
        <View style={[styles.dot, styles.dotBottomTwo]} />
      </View>
      <View style={styles.copy}>
        <Text
          style={[
            styles.name,
            compact && styles.nameCompact,
            light && styles.lightText
          ]}
          numberOfLines={1}
        >
          Datamak Technologies
        </Text>
        <Text
          style={[
            styles.tagline,
            compact && styles.taglineCompact,
            light && styles.lightTagline
          ]}
          numberOfLines={1}
        >
          SHOP SMART. BUILD FAST. HOST SECURE.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 0
  },
  logoCompact: {
    gap: 9,
    maxWidth: 260
  },
  mark: {
    position: "relative",
    width: 58,
    height: 58,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.webBlue,
    ...shadows.soft
  },
  markCompact: {
    width: 42,
    height: 42,
    borderRadius: 12
  },
  markBlue: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.webBlue
  },
  markTeal: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "48%",
    backgroundColor: "#0d948d"
  },
  markLetter: {
    position: "absolute",
    left: 15,
    top: 8,
    color: "#ffffff",
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "900"
  },
  markLetterCompact: {
    left: 11,
    top: 5,
    fontSize: 25,
    lineHeight: 32
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffb24a"
  },
  dotTop: {
    right: 10,
    top: 18
  },
  dotBottomOne: {
    right: 18,
    bottom: 12
  },
  dotBottomTwo: {
    right: 8,
    bottom: 12
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  name: {
    color: colors.navy,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900"
  },
  nameCompact: {
    fontSize: 14,
    lineHeight: 18
  },
  tagline: {
    color: "#27364f",
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700"
  },
  taglineCompact: {
    fontSize: 8,
    letterSpacing: 0.9
  },
  lightText: {
    color: "#ffffff"
  },
  lightTagline: {
    color: "rgba(255,255,255,0.78)"
  }
});
