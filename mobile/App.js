import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, View } from "react-native";
import AuthScreen from "./src/screens/AuthScreen";
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ICONS = {
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
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#0c3e58"
        },
        headerTitleStyle: {
          fontWeight: "700"
        },
        headerTintColor: "#f6fbff",
        sceneStyle: { backgroundColor: "#f4f8f7" },
        tabBarActiveTintColor: "#0e7a78",
        tabBarInactiveTintColor: "#6b7f89",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#d5e2de",
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700"
        },
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ fontSize: focused ? 16 : 14, color, fontWeight: "800" }}>
            {ICONS[route.name]}
          </Text>
        )
      })}
    >
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
