export const PRODUCT_CATEGORIES = [
  {
    title: "Computers",
    category: "Computers",
    defaultType: "physical",
    subcategories: ["Laptops", "Desktops", "Components", "Monitors", "Computer Bundles"],
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    description: "Laptops, desktops, components, monitors, and complete computer bundles."
  },
  {
    title: "ICT Products",
    category: "ICT Products",
    defaultType: "physical",
    subcategories: [
      "Accessories",
      "Storage Devices",
      "Printers & Scanners",
      "Networking Equipment",
      "Power & Protection",
      "Audio & Video",
      "Smart Devices",
      "Office Equipment",
      "Security Products"
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
    description: "Accessories, storage, printers, networking, power, AV, smart, and office gear."
  },
  {
    title: "Web Hosting Services",
    category: "Web Hosting Services",
    defaultType: "service",
    subcategories: [
      "Hosting Packages",
      "Domain Services",
      "Website Services",
      "Email Hosting",
      "Server Services",
      "Security Services",
      "Cloud Services",
      "Developer Services",
      "Ecommerce Services"
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    description: "Hosting, domains, websites, email, servers, security, cloud, developer, and store services."
  }
];

export const SHOP_CATEGORIES = PRODUCT_CATEGORIES;

export function getCategoryConfig(category) {
  return PRODUCT_CATEGORIES.find((entry) => entry.category === category);
}

export function getSubcategoriesForCategory(category) {
  return getCategoryConfig(category)?.subcategories || [];
}

export function getDefaultSubcategory(category) {
  return getSubcategoriesForCategory(category)[0] || "";
}

export function getDefaultProductType(category) {
  return getCategoryConfig(category)?.defaultType || "physical";
}
