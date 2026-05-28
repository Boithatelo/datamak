import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, View } from "react-native";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import CartScreen from "./src/screens/CartScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import HostingPlansScreen from "./src/screens/HostingPlansScreen";
import WishlistScreen from "./src/screens/WishlistScreen";
import CheckoutSuccessScreen from "./src/screens/CheckoutSuccessScreen";
import OrderDetailsScreen from "./src/screens/OrderDetailsScreen";
import InfoScreen from "./src/screens/InfoScreen";
import AdminScreen from "./src/screens/AdminScreen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { CartProvider, useCart } from "./src/context/CartContext";
import { ShopProvider, useShop } from "./src/context/ShopContext";
import BrandLogo from "./src/components/BrandLogo";
import { colors } from "./src/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ICONS = {
  Home: "D",
  Products: "P",
  Hosting: "H",
  Wishlist: "W",
  Cart: "C",
  Orders: "O",
  Profile: "U",
  Admin: "A"
};

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eef5f3"
      }}
    >
      <ActivityIndicator size="large" color="#0d7b78" />
      <Text style={{ marginTop: 12, color: "#174254", fontWeight: "700" }}>Loading...</Text>
    </View>
  );
}

function AppTabs() {
  const { user } = useAuth();
  const { cart } = useCart();
  const { wishlistIds } = useShop();
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      initialRouteName={user?.role === "admin" ? "Admin" : "Home"}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#ffffff"
        },
        headerShadowVisible: true,
        headerTitle: () => <BrandLogo compact />,
        headerTitleStyle: {
          fontWeight: "900",
          color: colors.navy
        },
        headerTintColor: colors.navy,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.webBlue,
        tabBarInactiveTintColor: "#53647c",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e8edf5",
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: "#0f172a",
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -6 },
          elevation: 8
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "900"
        },
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ fontSize: focused ? 16 : 14, color, fontWeight: "800" }}>
            {ICONS[route.name]}
          </Text>
        )
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Hosting" component={HostingPlansScreen} />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarBadge: wishlistIds.length > 0 ? wishlistIds.length : undefined
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: cartCount > 0 ? cartCount : undefined
        }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {user?.role === "admin" && <Tab.Screen name="Admin" component={AdminScreen} />}
    </Tab.Navigator>
  );
}

function AppStack() {
  const { user } = useAuth();

  return (
    <CartProvider>
      <ShopProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={AppTabs} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="CheckoutSuccess" component={CheckoutSuccessScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
          <Stack.Screen name="About" component={InfoScreen} initialParams={{ type: "about" }} />
          <Stack.Screen name="Contact" component={InfoScreen} initialParams={{ type: "contact" }} />
          <Stack.Screen name="FAQ" component={InfoScreen} initialParams={{ type: "faq" }} />
        </Stack.Navigator>
      </ShopProvider>
    </CartProvider>
  );
}

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <Stack.Screen name="Main" component={AppStack} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
