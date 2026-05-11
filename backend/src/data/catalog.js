const CATALOG_VERSION = 11;

const CATEGORY_TREE = [
  {
    name: "Computers",
    defaultType: "physical",
    subcategories: ["Laptops", "Desktops", "Components", "Monitors", "Computer Bundles"]
  },
  {
    name: "ICT Products",
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
    ]
  },
  {
    name: "Web Hosting Services",
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
    ]
  }
];

const CATEGORY_ALIASES = {
  "ICT Accessories": "ICT Products",
  "Networking Devices": "ICT Products",
  Software: "ICT Products",
  "Web Hosting": "Web Hosting Services"
};

const SUBCATEGORY_ALIASES = {
  Computers: {
    "Gaming Laptops": "Laptops",
    Workstations: "Desktops",
    "All-in-One PCs": "Desktops"
  },
  "ICT Products": {
    Keyboards: "Accessories",
    "Pointing Devices": "Accessories",
    Accessories: "Accessories",
    Storage: "Storage Devices",
    Switches: "Networking Equipment",
    Routers: "Networking Equipment",
    Productivity: "Office Equipment",
    Security: "Security Products"
  },
  "Web Hosting Services": {
    "Shared Hosting": "Hosting Packages",
    "VPS Hosting": "Server Services",
    "Business Hosting": "Cloud Services",
    Domain: "Domain Services"
  }
};

const DEMO_PRODUCTS = [
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    description: "Premium 14-inch business ultrabook with enterprise security.",
    category: "Computers",
    subcategory: "Laptops",
    price: 2099,
    stock: 14,
    badges: ["Best Seller", "Business"],
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "HP ProDesk Business Desktop",
    description: "Reliable office desktop with expandable memory and fast SSD storage.",
    category: "Computers",
    subcategory: "Desktops",
    price: 899,
    stock: 18,
    badges: ["Office Ready"],
    imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Kingston 32GB DDR5 Memory Kit",
    description: "High-speed DDR5 RAM upgrade for modern workstations and gaming PCs.",
    category: "Computers",
    subcategory: "Components",
    price: 149,
    stock: 32,
    badges: ["Upgrade"],
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Dell UltraSharp 27-inch 4K",
    description: "Professional UHD monitor for design, engineering, and productivity teams.",
    category: "Computers",
    subcategory: "Monitors",
    price: 549,
    stock: 20,
    badges: ["Studio"],
    imageUrl: "/images/dell-ultrasharp-27-4k.webp"
  },
  {
    name: "Datamak Office Computer Bundle",
    description: "Complete office setup with desktop, monitor, keyboard, mouse, and surge guard.",
    category: "Computers",
    subcategory: "Computer Bundles",
    price: 1199,
    stock: 10,
    badges: ["Bundle"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Dell Latitude 7440 Business Laptop",
    description: "14-inch enterprise laptop powered by Intel Core i5 with SSD storage and TPM security.",
    category: "Computers",
    subcategory: "Laptops",
    price: 1399,
    stock: 16,
    badges: ["Business"],
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Dell Precision Tower 3680 Workstation",
    description: "Professional workstation with Intel Core i7 performance for CAD and content workflows.",
    category: "Computers",
    subcategory: "Desktops",
    price: 1899,
    stock: 9,
    badges: ["Workstation"],
    imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "HP EliteBook 840 G10",
    description: "Corporate ultrabook with Intel Core i5 processor, webcam privacy, and long battery life.",
    category: "Computers",
    subcategory: "Laptops",
    price: 1499,
    stock: 14,
    badges: ["Office Ready"],
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "HP Z2 Mini G9 Workstation",
    description: "Compact desktop workstation running Intel Core i7 for design, finance, and engineering teams.",
    category: "Computers",
    subcategory: "Desktops",
    price: 1699,
    stock: 11,
    badges: ["Workstation"],
    imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Lenovo ThinkCentre M90s Gen 4",
    description: "Secure small-form desktop with Intel Core i5 and modern enterprise manageability.",
    category: "Computers",
    subcategory: "Desktops",
    price: 1099,
    stock: 17,
    badges: ["Business"],
    imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Lenovo Legion Pro 5 Gaming Laptop",
    description: "High-performance gaming notebook with AMD Ryzen 7 and high refresh display.",
    category: "Computers",
    subcategory: "Laptops",
    price: 1799,
    stock: 8,
    badges: ["Gaming"],
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Datamak Creator Pro Desktop Bundle",
    description: "Creator setup bundle with Intel Core i3 desktop, monitor, and productivity peripherals.",
    category: "Computers",
    subcategory: "Computer Bundles",
    price: 999,
    stock: 13,
    badges: ["Bundle"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Datamak Studio Max Workstation",
    description: "Advanced rendering tower powered by Intel Core i9 for visual production pipelines.",
    category: "Computers",
    subcategory: "Desktops",
    price: 2399,
    stock: 7,
    badges: ["Studio"],
    imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Kingston Fury Gaming Tower Kit",
    description: "Gaming-oriented desktop kit featuring AMD Ryzen 5 and rapid NVMe storage.",
    category: "Computers",
    subcategory: "Computer Bundles",
    price: 1299,
    stock: 12,
    badges: ["Gaming"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Kingston Office Essential Desktop Pack",
    description: "Reliable office desktop package with AMD Ryzen 7 and productivity accessories.",
    category: "Computers",
    subcategory: "Computer Bundles",
    price: 1199,
    stock: 15,
    badges: ["Office Ready"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Dell G15 Performance Gaming Laptop",
    description: "Powerful gaming machine running AMD Ryzen 5 with dedicated graphics.",
    category: "Computers",
    subcategory: "Laptops",
    price: 1599,
    stock: 10,
    badges: ["Gaming"],
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "HP Victus 16 Gaming Laptop",
    description: "Modern gaming laptop with AMD Ryzen 7 platform and optimized thermal design.",
    category: "Computers",
    subcategory: "Laptops",
    price: 1499,
    stock: 10,
    badges: ["Gaming"],
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Lenovo ThinkPad P1 Gen 7",
    description: "Mobile workstation powered by Intel Core i7 for architects and analysts on the move.",
    category: "Computers",
    subcategory: "Laptops",
    price: 2199,
    stock: 9,
    badges: ["Workstation"],
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Logitech Wireless Keyboard and Mouse Combo",
    description: "Comfortable wireless input bundle for daily office productivity.",
    category: "ICT Products",
    subcategory: "Accessories",
    price: 79,
    stock: 48,
    badges: ["Popular"],
    imageUrl: "/images/ict.jpg"
  },
  {
    name: "Samsung T7 Shield 2TB Portable SSD",
    description: "Durable high-speed external SSD for backups and field work.",
    category: "ICT Products",
    subcategory: "Storage Devices",
    price: 189,
    stock: 24,
    badges: ["Fast Storage"],
    imageUrl: "https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Canon PIXMA G6040 Printer Scanner",
    description: "All-in-one ink tank printer and scanner for busy offices.",
    category: "ICT Products",
    subcategory: "Printers & Scanners",
    price: 329,
    stock: 16,
    badges: ["Office"],
    imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Cisco Catalyst 1300 Switch",
    description: "Managed 24-port Gigabit switch for SMB office networks.",
    category: "ICT Products",
    subcategory: "Networking Equipment",
    price: 799,
    stock: 11,
    badges: ["Enterprise"],
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "APC Back-UPS 1200VA",
    description: "Battery backup and surge protection for workstations and network gear.",
    category: "ICT Products",
    subcategory: "Power & Protection",
    price: 229,
    stock: 21,
    badges: ["Protection"],
    imageUrl: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Jabra Speak 510 Conference Speaker",
    description: "Portable USB and Bluetooth speakerphone for meetings and hybrid work.",
    category: "ICT Products",
    subcategory: "Audio & Video",
    price: 149,
    stock: 30,
    badges: ["Meetings"],
    imageUrl: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Samsung Galaxy Tab S9 FE",
    description: "Smart tablet for field teams, presentations, and business workflows.",
    category: "ICT Products",
    subcategory: "Smart Devices",
    price: 499,
    stock: 17,
    badges: ["Mobile"],
    imageUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Microsoft 365 Business Standard",
    description: "Cloud productivity suite for teams with desktop and web apps.",
    category: "ICT Products",
    subcategory: "Office Equipment",
    type: "service",
    price: 16,
    stock: 0,
    badges: ["Subscription"],
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Hikvision 4-Camera Security Kit",
    description: "Security camera bundle with DVR, night vision, and remote monitoring.",
    category: "ICT Products",
    subcategory: "Security Products",
    price: 699,
    stock: 9,
    badges: ["Security"],
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Starter Shared Hosting",
    description:
      "Linux shared hosting for personal sites and small business pages with cPanel and one-click apps.",
    category: "Web Hosting Services",
    subcategory: "Hosting Packages",
    type: "service",
    price: 299,
    stock: 0,
    badges: ["Starter"],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    specifications: [
      { label: "Hosting Type", value: "Shared Hosting" },
      { label: "Operating System", value: "Linux" },
      { label: "Storage Space", value: "10 GB SSD" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Billing Cycle", value: "Monthly" },
      { label: "SSL Included", value: "Free SSL Certificate" }
    ]
  },
  {
    name: "Domain & DNS Essentials",
    description:
      "Managed domain registration, DNS hosting, and domain forwarding for professional brand presence.",
    category: "Web Hosting Services",
    subcategory: "Domain Services",
    type: "service",
    price: 199,
    stock: 0,
    badges: ["Domain"],
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    specifications: [
      { label: "Hosting Type", value: "Reseller Hosting" },
      { label: "Operating System", value: "Linux" },
      { label: "Storage Space", value: "10 GB" },
      { label: "Bandwidth", value: "100 GB" },
      { label: "Billing Cycle", value: "Yearly" },
      { label: "Free Domain", value: "Included for annual plan" }
    ]
  },
  {
    name: "Website Builder Hosting",
    description:
      "Managed web hosting with visual site builder, templates, and staging tools for business websites.",
    category: "Web Hosting Services",
    subcategory: "Website Services",
    type: "service",
    price: 499,
    stock: 0,
    badges: ["Website"],
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
    specifications: [
      { label: "Hosting Type", value: "Shared Hosting" },
      { label: "Operating System", value: "Linux" },
      { label: "Storage Space", value: "50 GB SSD" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Billing Cycle", value: "Monthly" },
      { label: "Email Accounts", value: "20 Mailboxes" }
    ]
  },
  {
    name: "Business Email Hosting",
    description:
      "Secure email hosting with anti-spam filtering, shared calendars, and branded domain mailboxes.",
    category: "Web Hosting Services",
    subcategory: "Email Hosting",
    type: "service",
    price: 249,
    stock: 0,
    badges: ["Email"],
    imageUrl: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=1200&q=80",
    specifications: [
      { label: "Hosting Type", value: "Shared Hosting" },
      { label: "Operating System", value: "Linux" },
      { label: "Storage Space", value: "50 GB" },
      { label: "Bandwidth", value: "100 GB" },
      { label: "Billing Cycle", value: "Monthly" },
      { label: "Email Accounts", value: "50 Mailboxes" }
    ]
  },
  {
    name: "Managed VPS Server",
    description:
      "High-performance Linux VPS for demanding applications with root access and managed backups.",
    category: "Web Hosting Services",
    subcategory: "Server Services",
    type: "service",
    price: 1299,
    stock: 0,
    badges: ["VPS"],
    imageUrl: "/images/managed-vps-server.webp",
    specifications: [
      { label: "Hosting Type", value: "VPS Hosting" },
      { label: "Operating System", value: "Linux" },
      { label: "Storage Space", value: "80 GB SSD" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Billing Cycle", value: "Monthly" },
      { label: "SSL Included", value: "Free SSL Certificate" }
    ]
  },
  {
    name: "SSL Shield & Malware Protection",
    description:
      "Website protection suite with SSL deployment, malware scanning, and firewall hardening services.",
    category: "Web Hosting Services",
    subcategory: "Security Services",
    type: "service",
    price: 349,
    stock: 0,
    badges: ["Secure"],
    imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
    specifications: [
      { label: "Hosting Type", value: "Cloud Hosting" },
      { label: "Operating System", value: "Linux" },
      { label: "Storage Space", value: "100 GB" },
      { label: "Bandwidth", value: "500 GB" },
      { label: "Billing Cycle", value: "Monthly" },
      { label: "SSL Included", value: "Managed SSL Included" }
    ]
  },
  {
    name: "Cloud Plus Hosting",
    description:
      "Scalable cloud hosting for business-critical systems with autoscaling, backups, and 24/7 support.",
    category: "Web Hosting Services",
    subcategory: "Cloud Services",
    type: "service",
    price: 2499,
    stock: 0,
    badges: ["Cloud"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    specifications: [
      { label: "Hosting Type", value: "Cloud Hosting" },
      { label: "Operating System", value: "Windows" },
      { label: "Storage Space", value: "160 GB SSD" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Billing Cycle", value: "Monthly" },
      { label: "Server Location", value: "South Africa & EU" }
    ]
  },
  {
    name: "Developer Deployment Hosting",
    description:
      "Deployment-ready hosting with Git pipelines, staging environments, and container support.",
    category: "Web Hosting Services",
    subcategory: "Developer Services",
    type: "service",
    price: 899,
    stock: 0,
    badges: ["Developer"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    specifications: [
      { label: "Hosting Type", value: "VPS Hosting" },
      { label: "Operating System", value: "Linux" },
      { label: "Storage Space", value: "100 GB SSD" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Billing Cycle", value: "Monthly" },
      { label: "Email Accounts", value: "10 Mailboxes" }
    ]
  },
  {
    name: "Online Store Hosting Pro",
    description:
      "Optimized ecommerce hosting for WooCommerce and Magento with security, speed, and backups.",
    category: "Web Hosting Services",
    subcategory: "Ecommerce Services",
    type: "service",
    price: 1599,
    stock: 0,
    badges: ["Ecommerce"],
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    specifications: [
      { label: "Hosting Type", value: "Cloud Hosting" },
      { label: "Operating System", value: "Linux" },
      { label: "Storage Space", value: "100 GB SSD" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Billing Cycle", value: "Monthly" },
      { label: "SSL Included", value: "Free SSL Certificate" }
    ]
  }
];

function getCategory(categoryName) {
  return CATEGORY_TREE.find((entry) => entry.name === categoryName);
}

function getCategoryNames() {
  return CATEGORY_TREE.map((entry) => entry.name);
}

function getSubcategories(categoryName) {
  return getCategory(categoryName)?.subcategories || [];
}

function normalizeCategory(category) {
  const trimmed = String(category || "").trim();
  return CATEGORY_ALIASES[trimmed] || trimmed;
}

function normalizeSubcategory(category, subcategory) {
  const normalizedCategory = normalizeCategory(category);
  const trimmed = String(subcategory || "").trim();
  const mapped = SUBCATEGORY_ALIASES[normalizedCategory]?.[trimmed] || trimmed;
  const allowed = getSubcategories(normalizedCategory);
  return allowed.includes(mapped) ? mapped : allowed[0] || mapped || "General";
}

function normalizeProductTaxonomy(product) {
  let category = normalizeCategory(product.category);
  let subcategory = String(product.subcategory || "").trim();

  if (category === "ICT Products" && subcategory === "Monitors") {
    category = "Computers";
  }

  subcategory = normalizeSubcategory(category, subcategory || product.category);
  const defaultType = getCategory(category)?.defaultType || "physical";
  const type = product.type === "service" || defaultType === "service" ? "service" : "physical";

  return { category, subcategory, type };
}

function isValidCategory(category) {
  return getCategoryNames().includes(category);
}

function isValidSubcategory(category, subcategory) {
  return getSubcategories(category).includes(subcategory);
}

function buildDemoProducts(timestamp, idFactory) {
  return DEMO_PRODUCTS.map((product, index) => {
    const type = product.type || getCategory(product.category)?.defaultType || "physical";
    return {
      id: idFactory(),
      type,
      rating: Number((4.3 + (index % 6) * 0.1).toFixed(1)),
      reviewsCount: 36 + index * 9,
      popularity: 90 - (index % 9) * 4,
      discountPercent: index % 4 === 0 ? 8 : 0,
      isFeatured: index < 8,
      gallery: [product.imageUrl],
      specifications: [
        { label: "Category", value: product.category },
        { label: "Subcategory", value: product.subcategory }
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
      ...product,
      stock: type === "service" ? 0 : Number(product.stock || 0)
    };
  });
}

module.exports = {
  CATALOG_VERSION,
  CATEGORY_TREE,
  buildDemoProducts,
  getCategory,
  getCategoryNames,
  getSubcategories,
  isValidCategory,
  isValidSubcategory,
  normalizeProductTaxonomy
};

