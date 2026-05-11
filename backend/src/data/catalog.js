const CATALOG_VERSION = 4;

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

function specs(entries) {
  return Object.entries(entries).map(([label, value]) => ({ label, value: String(value) }));
}


function laptopProduct({
  brand,
  model,
  processor,
  ram,
  storage,
  graphics,
  display,
  bestFor,
  price,
  stock,
  images,
  badges = []
}) {
  return {
    name: `${brand} ${model}`,
    description: `${model} with ${processor}, ${ram} RAM, ${storage}, ${graphics}, and ${display}. Best for ${bestFor.toLowerCase()}.`,
    category: "Computers",
    subcategory: "Laptops",
    price,
    stock,
    badges: [brand, ...badges],
    imageUrl: images[0],
    gallery: images,
    specifications: specs({
      Brand: brand,
      Model: model,
      Processor: processor,
      RAM: ram,
      Storage: storage,
      Graphics: graphics,
      Display: display,
      "Best For": bestFor
    })
  };
}

function catalogProduct({
  name,
  description,
  category,
  subcategory,
  price,
  stock = 0,
  type,
  images,
  badges = [],
  details = {}
}) {
  return {
    name,
    description,
    category,
    subcategory,
    type,
    price,
    stock,
    badges,
    imageUrl: images[0],
    gallery: images,
    specifications: specs({
      Category: category,
      Subcategory: subcategory,
      ...details
    })
  };
}

const DEMO_PRODUCTS = [
  laptopProduct({
    brand: "Dell",
    model: "Latitude 3410",
    processor: "Intel Core i5 10th Gen",
    ram: "8GB",
    storage: "256GB SSD",
    graphics: "Intel UHD",
    display: "14-inch FHD",
    bestFor: "Office work, students",
    price: 629,
    stock: 18,
    badges: ["Office", "Student"],
    images: [
      "/images/products/dell-latitude-3410-01.svg",
      "/images/products/dell-latitude-3410-02.jpg"
    ]
  }),
  laptopProduct({
    brand: "HP",
    model: "ProBook 450 G8",
    processor: "Intel Core i5 11th Gen",
    ram: "8GB",
    storage: "512GB SSD",
    graphics: "Intel Iris Xe",
    display: "15.6-inch FHD",
    bestFor: "Business and multitasking",
    price: 849,
    stock: 16,
    badges: ["Business"],
    images: [
      "/images/products/hp-probook-450-g8-01.jpg",
      "/images/products/hp-probook-450-g8-02.jpg"
    ]
  }),
  laptopProduct({
    brand: "Lenovo",
    model: "ThinkPad T14",
    processor: "AMD Ryzen 5 Pro",
    ram: "16GB",
    storage: "512GB SSD",
    graphics: "Radeon Graphics",
    display: "14-inch FHD",
    bestFor: "Programming and enterprise",
    price: 1099,
    stock: 14,
    badges: ["Enterprise", "Developer"],
    images: [
      "/images/products/lenovo-thinkpad-t14-01.png",
      "/images/products/lenovo-thinkpad-t14-02.jpg"
    ]
  }),
  laptopProduct({
    brand: "Apple",
    model: "MacBook Air M2",
    processor: "Apple M2 chip",
    ram: "8GB",
    storage: "256GB SSD",
    graphics: "Integrated GPU",
    display: "13.6-inch Liquid Retina",
    bestFor: "Creative work and coding",
    price: 999,
    stock: 12,
    badges: ["Creator", "Coding"],
    images: [
      "/images/products/apple-macbook-air-m2-01.png",
      "/images/products/apple-macbook-air-m2-02.png"
    ]
  }),
  laptopProduct({
    brand: "Acer",
    model: "Aspire 5",
    processor: "Intel Core i7",
    ram: "16GB",
    storage: "512GB SSD",
    graphics: "NVIDIA MX550",
    display: "15.6-inch FHD",
    bestFor: "General productivity",
    price: 799,
    stock: 15,
    badges: ["Productivity"],
    images: [
      "/images/products/acer-aspire-5-01.svg",
      "/images/products/acer-aspire-5-02.jpg"
    ]
  }),
  laptopProduct({
    brand: "ASUS",
    model: "VivoBook 15",
    processor: "AMD Ryzen 7",
    ram: "16GB",
    storage: "1TB SSD",
    graphics: "Radeon Graphics",
    display: "15.6-inch OLED",
    bestFor: "Multimedia and students",
    price: 749,
    stock: 20,
    badges: ["OLED", "Student"],
    images: [
      "/images/products/asus-vivobook-15-01.png",
      "/images/products/asus-vivobook-15-02.png"
    ]
  }),
  laptopProduct({
    brand: "MSI",
    model: "GF63 Thin",
    processor: "Intel Core i7",
    ram: "16GB",
    storage: "512GB SSD",
    graphics: "NVIDIA RTX 3050",
    display: "15.6-inch 144Hz",
    bestFor: "Gaming and development",
    price: 899,
    stock: 10,
    badges: ["Gaming", "Developer"],
    images: [
      "/images/products/msi-gf63-thin-01.jpg",
      "/images/products/msi-gf63-thin-02.png"
    ]
  }),
  laptopProduct({
    brand: "Samsung",
    model: "Galaxy Book3",
    processor: "Intel Core i5",
    ram: "8GB",
    storage: "512GB SSD",
    graphics: "Intel Iris Xe",
    display: "15.6-inch AMOLED",
    bestFor: "Portable business laptop",
    price: 949,
    stock: 13,
    badges: ["Portable", "AMOLED"],
    images: [
      "/images/products/samsung-galaxy-book3-01.jpg",
      "/images/products/samsung-galaxy-book3-02.jpg"
    ]
  }),
  laptopProduct({
    brand: "Huawei",
    model: "MateBook D15",
    processor: "AMD Ryzen 5",
    ram: "8GB",
    storage: "256GB SSD",
    graphics: "Radeon Vega",
    display: "15.6-inch FHD",
    bestFor: "Students and office",
    price: 599,
    stock: 17,
    badges: ["Student", "Office"],
    images: [
      "/images/products/huawei-matebook-d15-01.jpg",
      "/images/products/huawei-matebook-d15-02.jpg"
    ]
  }),
  laptopProduct({
    brand: "Toshiba",
    model: "Dynabook Tecra",
    processor: "Intel Core i5",
    ram: "8GB",
    storage: "256GB SSD",
    graphics: "Intel UHD",
    display: "14-inch FHD",
    bestFor: "Corporate use",
    price: 799,
    stock: 11,
    badges: ["Corporate"],
    images: [
      "/images/products/toshiba-dynabook-tecra-01.jpg",
      "/images/products/toshiba-dynabook-tecra-02.jpg"
    ]
  }),
  laptopProduct({
    brand: "Razer",
    model: "Blade 15",
    processor: "Intel Core i9",
    ram: "32GB",
    storage: "1TB SSD",
    graphics: "NVIDIA RTX 4070",
    display: "15.6-inch QHD",
    bestFor: "High-end gaming",
    price: 2499,
    stock: 7,
    badges: ["Premium", "Gaming"],
    images: [
      "/images/products/razer-blade-15-01.jpg",
      "/images/products/razer-blade-15-02.jpg"
    ]
  }),
  laptopProduct({
    brand: "Microsoft",
    model: "Surface Laptop 5",
    processor: "Intel Core i7",
    ram: "16GB",
    storage: "512GB SSD",
    graphics: "Intel Iris Xe",
    display: "13.5-inch Touchscreen",
    bestFor: "Professional and business",
    price: 1299,
    stock: 10,
    badges: ["Touchscreen", "Business"],
    images: [
      "/images/products/microsoft-surface-laptop-5-01.jpg",
      "/images/products/microsoft-surface-laptop-5-02.jpg"
    ]
  }),
  catalogProduct({
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    description: "Premium 14-inch business ultrabook with enterprise security.",
    category: "Computers",
    subcategory: "Laptops",
    price: 2099,
    stock: 14,
    badges: ["Best Seller", "Business"],
    images: [
      "/images/products/lenovo-thinkpad-x1-carbon-gen-12-01.jpg",
      "/images/products/lenovo-thinkpad-x1-carbon-gen-12-02.jpg"
    ],
    details: {
      Processor: "Intel Core Ultra 7",
      RAM: "32GB LPDDR5x",
      Storage: "1TB NVMe SSD",
      Display: "14-inch 2.8K OLED",
      "Best For": "Executive business travel"
    }
  }),
  catalogProduct({
    name: "Kingston 32GB DDR5 Memory Kit",
    description: "High-speed DDR5 RAM upgrade for modern workstations and gaming PCs.",
    category: "Computers",
    subcategory: "Components",
    price: 149,
    stock: 32,
    badges: ["Upgrade"],
    images: [
      "/images/products/kingston-32gb-ddr5-memory-kit-01.jpg",
      "/images/products/kingston-32gb-ddr5-memory-kit-02.jpg"
    ],
    details: {
      Brand: "Kingston",
      Capacity: "32GB",
      Type: "DDR5",
      "Best For": "Workstation and gaming upgrades"
    }
  }),
  catalogProduct({
    name: "Dell UltraSharp 27-inch 4K",
    description: "Professional UHD monitor for design, engineering, and productivity teams.",
    category: "Computers",
    subcategory: "Monitors",
    price: 549,
    stock: 20,
    badges: ["Studio"],
    images: [
      "/images/products/dell-ultrasharp-27-inch-4k-01.jpg",
      "/images/products/dell-ultrasharp-27-inch-4k-02.svg"
    ],
    details: {
      Brand: "Dell",
      Resolution: "3840 x 2160",
      Panel: "IPS",
      "Best For": "Design and productivity"
    }
  }),
  catalogProduct({
    name: "Datamak Office Computer Bundle",
    description: "Complete office setup with desktop, monitor, keyboard, mouse, and surge guard.",
    category: "Computers",
    subcategory: "Computer Bundles",
    price: 1199,
    stock: 10,
    badges: ["Bundle"],
    images: [
      "/images/products/datamak-office-computer-bundle-01.jpg",
      "/images/products/datamak-office-computer-bundle-02.jpg"
    ],
    details: {
      Includes: "Desktop, monitor, keyboard, mouse, surge guard",
      "Best For": "Small office rollout"
    }
  }),
  catalogProduct({
    name: "Logitech MK270 Wireless Keyboard and Mouse Combo",
    description: "Full-size wireless keyboard with compact mouse for everyday office productivity.",
    category: "ICT Products",
    subcategory: "Accessories",
    price: 39,
    stock: 48,
    badges: ["Popular", "Wireless"],
    images: [
      "/images/products/logitech-mk270-wireless-keyboard-and-mouse-combo-01.jpg",
      "/images/products/logitech-mk270-wireless-keyboard-and-mouse-combo-02.jpg"
    ],
    details: {
      Brand: "Logitech",
      Connection: "2.4GHz wireless USB receiver",
      Includes: "Full-size keyboard and compact mouse",
      "Best For": "Office desks and students"
    }
  }),
  catalogProduct({
    name: "Samsung T7 Shield 2TB Portable SSD",
    description: "Rugged USB 3.2 Gen 2 portable SSD with fast NVMe transfer speeds.",
    category: "ICT Products",
    subcategory: "Storage Devices",
    price: 189,
    stock: 24,
    badges: ["Fast Storage", "Rugged"],
    images: [
      "/images/products/samsung-t7-shield-2tb-portable-ssd-01.jpg",
      "/images/products/samsung-t7-shield-2tb-portable-ssd-02.jpg"
    ],
    details: {
      Brand: "Samsung",
      Capacity: "2TB",
      Interface: "USB 3.2 Gen 2",
      Speed: "Up to 1050MB/s read, 1000MB/s write",
      Durability: "IP65 water and dust resistant"
    }
  }),
  catalogProduct({
    name: "Canon PIXMA G6040 MegaTank Printer Scanner",
    description: "All-in-one refillable ink tank printer with scan, copy, Wi-Fi, Ethernet, and duplex printing.",
    category: "ICT Products",
    subcategory: "Printers & Scanners",
    price: 329,
    stock: 16,
    badges: ["Office", "MegaTank"],
    images: [
      "/images/products/canon-pixma-g6040-megatank-printer-scanner-01.jpg",
      "/images/products/canon-pixma-g6040-megatank-printer-scanner-02.jpg"
    ],
    details: {
      Brand: "Canon",
      Functions: "Print, copy, scan",
      Connectivity: "USB, Ethernet, Wi-Fi",
      "Paper Capacity": "Up to 350 sheets",
      "Best For": "Home office and small business"
    }
  }),
  catalogProduct({
    name: "TP-Link Archer AX55 Wi-Fi 6 Router",
    description: "AX3000 dual-band Wi-Fi 6 router with gigabit ports, USB sharing, and HomeShield security.",
    category: "ICT Products",
    subcategory: "Networking Equipment",
    price: 119,
    stock: 22,
    badges: ["Wi-Fi 6", "Router"],
    images: [
      "/images/products/tp-link-archer-ax55-wi-fi-6-router-01.jpg",
      "/images/products/tp-link-archer-ax55-wi-fi-6-router-02.jpg"
    ],
    details: {
      Brand: "TP-Link",
      Speed: "AX3000",
      Bands: "2.4GHz and 5GHz",
      Ports: "Gigabit WAN, 4x Gigabit LAN, USB 3.0",
      "Best For": "Small office Wi-Fi"
    }
  }),
  catalogProduct({
    name: "Cisco Catalyst 1300 24-Port Managed Switch",
    description: "Managed Gigabit switch for secure, reliable small and midsize office networks.",
    category: "ICT Products",
    subcategory: "Networking Equipment",
    price: 799,
    stock: 11,
    badges: ["Enterprise", "Managed"],
    images: [
      "/images/products/cisco-catalyst-1300-24-port-managed-switch-01.jpg",
      "/images/products/cisco-catalyst-1300-24-port-managed-switch-02.jpg"
    ],
    details: {
      Brand: "Cisco",
      Ports: "24 Gigabit Ethernet ports",
      Management: "Layer 2 managed switching",
      "Best For": "SMB network core"
    }
  }),
  catalogProduct({
    name: "APC Back-UPS 1200VA",
    description: "Battery backup and surge protection for workstations and network gear.",
    category: "ICT Products",
    subcategory: "Power & Protection",
    price: 229,
    stock: 21,
    badges: ["Protection", "UPS"],
    images: [
      "/images/products/apc-back-ups-1200va-01.jpg",
      "/images/products/apc-back-ups-1200va-02.jpg"
    ],
    details: {
      Brand: "APC",
      Capacity: "1200VA",
      Protection: "Battery backup and surge protection",
      "Best For": "PCs, routers, and small servers"
    }
  }),
  catalogProduct({
    name: "Jabra Speak 510 Conference Speaker",
    description: "Portable USB and Bluetooth speakerphone for meetings and hybrid work.",
    category: "ICT Products",
    subcategory: "Audio & Video",
    price: 149,
    stock: 30,
    badges: ["Meetings", "Bluetooth"],
    images: [
      "/images/products/jabra-speak-510-conference-speaker-01.jpg",
      "/images/products/jabra-speak-510-conference-speaker-02.jpg"
    ],
    details: {
      Brand: "Jabra",
      Connection: "USB and Bluetooth",
      Microphone: "Omnidirectional",
      "Best For": "Huddle rooms and remote meetings"
    }
  }),
  catalogProduct({
    name: "Samsung Galaxy Tab S9 FE",
    description: "Smart tablet for field teams, presentations, study, and business workflows.",
    category: "ICT Products",
    subcategory: "Smart Devices",
    price: 499,
    stock: 17,
    badges: ["Mobile", "Tablet"],
    images: [
      "/images/products/samsung-galaxy-tab-s9-fe-01.jpg",
      "/images/products/samsung-galaxy-tab-s9-fe-02.jpg"
    ],
    details: {
      Brand: "Samsung",
      Display: "10.9-inch tablet display",
      Storage: "128GB class",
      "Best For": "Field work, notes, and presentations"
    }
  }),
  catalogProduct({
    name: "Microsoft 365 Business Standard",
    description: "Cloud productivity suite with desktop Office apps, Teams, business email, and 1TB OneDrive storage.",
    category: "ICT Products",
    subcategory: "Office Equipment",
    type: "service",
    price: 16,
    badges: ["Subscription", "Productivity"],
    images: [
      "/images/products/microsoft-365-business-standard-01.jpg",
      "/images/products/microsoft-365-business-standard-02.jpg"
    ],
    details: {
      Brand: "Microsoft",
      Users: "Up to 300 employees",
      Includes: "Word, Excel, PowerPoint, Outlook, Teams, OneDrive",
      Storage: "1TB OneDrive per user",
      "Best For": "Small business productivity"
    }
  }),
  catalogProduct({
    name: "Hikvision 4-Camera Security Kit",
    description: "Security camera bundle with recorder, night vision cameras, and remote monitoring.",
    category: "ICT Products",
    subcategory: "Security Products",
    price: 699,
    stock: 9,
    badges: ["Security", "CCTV"],
    images: [
      "/images/products/hikvision-4-camera-security-kit-01.jpg",
      "/images/products/hikvision-4-camera-security-kit-02.jpg"
    ],
    details: {
      Brand: "Hikvision",
      Includes: "4 cameras, recorder, cabling",
      Features: "Night vision and remote monitoring",
      "Best For": "Shop and office surveillance"
    }
  }),
  catalogProduct({
    name: "Logitech C920 HD Pro Webcam",
    description: "Full HD webcam for video calls, online classes, and livestream meetings.",
    category: "ICT Products",
    subcategory: "Audio & Video",
    price: 89,
    stock: 26,
    badges: ["Webcam", "Full HD"],
    images: [
      "/images/products/logitech-c920-hd-pro-webcam-01.jpg",
      "/images/products/logitech-c920-hd-pro-webcam-02.jpg"
    ],
    details: {
      Brand: "Logitech",
      Resolution: "1080p Full HD",
      Microphones: "Dual stereo microphones",
      "Best For": "Video calls and streaming"
    }
  }),
  catalogProduct({
    name: "Ubiquiti UniFi U6+ Access Point",
    description: "Compact Wi-Fi 6 access point for managed business wireless networks.",
    category: "ICT Products",
    subcategory: "Networking Equipment",
    price: 129,
    stock: 19,
    badges: ["Wi-Fi 6", "Access Point"],
    images: [
      "/images/products/ubiquiti-unifi-u6-access-point-01.jpg",
      "/images/products/ubiquiti-unifi-u6-access-point-02.jpg"
    ],
    details: {
      Brand: "Ubiquiti",
      Wireless: "Wi-Fi 6",
      Management: "UniFi Network Controller",
      "Best For": "Office wireless expansion"
    }
  }),
  catalogProduct({
    name: "Shared Hosting Starter",
    description: "Entry hosting plan with SSL, cPanel, one-click WordPress, and daily backups.",
    category: "Web Hosting Services",
    subcategory: "Hosting Packages",
    type: "service",
    price: 12,
    badges: ["Starter", "SSL"],
    images: [
      "/images/products/shared-hosting-starter-01.jpg",
      "/images/products/shared-hosting-starter-02.jpg"
    ],
    details: {
      Websites: "1 website",
      Storage: "10GB SSD",
      Bandwidth: "50GB monthly transfer",
      Includes: "SSL, cPanel, WordPress installer, daily backups"
    }
  }),
  catalogProduct({
    name: "Business Hosting Plus",
    description: "Higher-capacity shared hosting for growing business websites and email-enabled domains.",
    category: "Web Hosting Services",
    subcategory: "Hosting Packages",
    type: "service",
    price: 24,
    badges: ["Business", "Popular"],
    images: [
      "/images/products/business-hosting-plus-01.jpg",
      "/images/products/business-hosting-plus-02.jpg"
    ],
    details: {
      Websites: "5 websites",
      Storage: "50GB SSD",
      Bandwidth: "Unmetered fair-use traffic",
      Includes: "SSL, cPanel, staging, daily backups"
    }
  }),
  catalogProduct({
    name: "Domain Registration .co.ls",
    description: "Local domain registration and DNS setup for Lesotho businesses.",
    category: "Web Hosting Services",
    subcategory: "Domain Services",
    type: "service",
    price: 18,
    badges: ["Domain"],
    images: [
      "/images/products/domain-registration-co-ls-01.jpg",
      "/images/products/domain-registration-co-ls-02.jpg"
    ],
    details: {
      Extension: ".co.ls",
      Includes: "Registration, DNS setup, renewal reminders",
      "Best For": "Local business identity"
    }
  }),
  catalogProduct({
    name: "Business Website Build",
    description: "Professional brochure website setup with responsive pages, contact forms, and launch support.",
    category: "Web Hosting Services",
    subcategory: "Website Services",
    type: "service",
    price: 399,
    badges: ["Website"],
    images: [
      "/images/products/business-website-build-01.jpg",
      "/images/products/business-website-build-02.jpg"
    ],
    details: {
      Pages: "Up to 5 pages",
      Includes: "Responsive design, contact form, SEO basics",
      Timeline: "7 to 10 business days"
    }
  }),
  catalogProduct({
    name: "Managed WordPress Hosting",
    description: "WordPress hosting with updates, caching, malware scanning, and managed backups.",
    category: "Web Hosting Services",
    subcategory: "Website Services",
    type: "service",
    price: 29,
    badges: ["WordPress", "Managed"],
    images: [
      "/images/products/managed-wordpress-hosting-01.jpg",
      "/images/products/managed-wordpress-hosting-02.jpg"
    ],
    details: {
      Platform: "WordPress",
      Includes: "Updates, caching, backups, malware scans",
      "Best For": "Blogs and company sites"
    }
  }),
  catalogProduct({
    name: "Business Email Hosting",
    description: "Secure branded email hosting with spam filtering, webmail, and mobile setup support.",
    category: "Web Hosting Services",
    subcategory: "Email Hosting",
    type: "service",
    price: 8,
    badges: ["Email"],
    images: [
      "/images/products/business-email-hosting-01.jpg",
      "/images/products/business-email-hosting-02.jpg"
    ],
    details: {
      Mailboxes: "Per mailbox",
      Storage: "10GB mailbox storage",
      Includes: "Spam filtering, webmail, DNS records",
      "Best For": "Branded business email"
    }
  }),
  catalogProduct({
    name: "Managed VPS Server",
    description: "Managed virtual server with monitoring, backups, root access, and performance tuning.",
    category: "Web Hosting Services",
    subcategory: "Server Services",
    type: "service",
    price: 49,
    badges: ["VPS", "Managed"],
    images: [
      "/images/products/managed-vps-server-01.jpg",
      "/images/products/managed-vps-server-02.jpg"
    ],
    details: {
      CPU: "2 vCPU",
      RAM: "4GB",
      Storage: "80GB SSD",
      Includes: "Monitoring, backups, root access"
    }
  }),
  catalogProduct({
    name: "SSL and Malware Protection",
    description: "SSL certificate installation, malware scanning, firewall hardening, and security reporting.",
    category: "Web Hosting Services",
    subcategory: "Security Services",
    type: "service",
    price: 29,
    badges: ["Secure", "SSL"],
    images: [
      "/images/products/ssl-and-malware-protection-01.jpg",
      "/images/products/ssl-and-malware-protection-02.jpg"
    ],
    details: {
      Includes: "SSL install, malware scan, basic firewall hardening",
      Reporting: "Monthly security summary",
      "Best For": "Business websites"
    }
  }),
  catalogProduct({
    name: "Business Cloud Hosting",
    description: "High-availability cloud hosting with CDN acceleration, autoscaling options, and premium support.",
    category: "Web Hosting Services",
    subcategory: "Cloud Services",
    type: "service",
    price: 89,
    badges: ["Cloud", "Premium"],
    images: [
      "/images/products/business-cloud-hosting-01.jpg",
      "/images/products/business-cloud-hosting-02.jpg"
    ],
    details: {
      Uptime: "High-availability cloud stack",
      Includes: "CDN, premium support, scaling consultation",
      "Best For": "Growing traffic"
    }
  }),
  catalogProduct({
    name: "Git Deployment Support",
    description: "Developer hosting workflow with Git deployment, staging, environment variables, and release help.",
    category: "Web Hosting Services",
    subcategory: "Developer Services",
    type: "service",
    price: 35,
    badges: ["Developer", "Git"],
    images: [
      "/images/products/git-deployment-support-01.jpg",
      "/images/products/git-deployment-support-02.jpg"
    ],
    details: {
      Workflow: "Git-based deployment",
      Includes: "Staging environment and release support",
      "Best For": "Developers and agencies"
    }
  }),
  catalogProduct({
    name: "Online Store Hosting",
    description: "Optimized ecommerce hosting with SSL, backups, product image support, and payment-ready setup.",
    category: "Web Hosting Services",
    subcategory: "Ecommerce Services",
    type: "service",
    price: 59,
    badges: ["Ecommerce", "SSL"],
    images: [
      "/images/products/online-store-hosting-01.jpg",
      "/images/products/online-store-hosting-02.jpg"
    ],
    details: {
      Platform: "WooCommerce or custom store",
      Includes: "SSL, backups, payment gateway readiness",
      "Best For": "Small online stores"
    }
  })
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
