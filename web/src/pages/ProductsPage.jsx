import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import MessageDialog from "../components/MessageDialog";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories", countKey: "all" },
  { value: "Computers", label: "Computers", countKey: "Computers" },
  { value: "ICT Products", label: "ICT Products", countKey: "ICT Products" },
  { value: "Web Hosting Services", label: "Web Hosting", countKey: "Web Hosting Services" }
];

const ICT_FILTER_CATEGORY_OPTIONS = [
  { id: "all", label: "All ICT Products", subcategories: [] },
  { id: "Networking Equipment", label: "Networking Equipment", subcategories: ["Networking Equipment"] },
  { id: "Printers & Scanners", label: "Printers & Scanners", subcategories: ["Printers & Scanners"] },
  { id: "CCTV & Security", label: "CCTV & Security", subcategories: ["Security Products"] },
  { id: "Keyboards & Mice", label: "Keyboards & Mice", subcategories: ["Accessories"] },
  { id: "Projectors", label: "Projectors", subcategories: ["Audio & Video", "Office Equipment"] },
  { id: "Storage Devices", label: "Storage Devices", subcategories: ["Storage Devices"] }
];

const BRAND_OPTIONS = [
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Acer",
  "Samsung",
  "Cisco",
  "Canon",
  "Logitech",
  "Kingston",
  "Datamak",
  "Microsoft",
  "Hikvision",
  "APC",
  "Jabra"
];

const PROCESSOR_OPTIONS = [
  "Intel Core i3",
  "Intel Core i5",
  "Intel Core i7",
  "Intel Core i9",
  "AMD Ryzen 5",
  "AMD Ryzen 7"
];

const RAM_OPTIONS = ["4GB", "8GB", "16GB", "32GB", "64GB"];

const HOSTING_TYPE_OPTIONS = [
  "Shared Hosting",
  "VPS Hosting",
  "Cloud Hosting",
  "Dedicated Server",
  "Reseller Hosting"
];

const HOSTING_OS_OPTIONS = ["Linux", "Windows"];
const HOSTING_BILLING_OPTIONS = ["Monthly", "Quarterly", "Yearly"];

const STORAGE_UNLIMITED_GB = 1000;
const BANDWIDTH_UNMETERED_GB = 1000;

function hashValue(value) {
  const text = String(value || "");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getBrand(product) {
  const firstWord = String(product.name || "").split(/\s+/)[0].toLowerCase();
  const known = BRAND_OPTIONS.find((brand) => brand.toLowerCase() === firstWord);
  if (known) {
    return known;
  }
  if (firstWord === "thinkpad" || firstWord === "lenovo") {
    return "Lenovo";
  }
  if (firstWord === "prodesk" || firstWord === "ultrasharp") {
    return "Dell";
  }
  return "Datamak";
}

function pickByHash(options, seedText) {
  if (!options.length) {
    return "";
  }
  return options[hashValue(seedText) % options.length];
}

function getProcessor(product) {
  if (product.category !== "Computers") {
    return "";
  }
  const text = `${product.name} ${product.description}`.toLowerCase();
  const match = PROCESSOR_OPTIONS.find((option) => text.includes(option.toLowerCase()));
  if (match) {
    return match;
  }
  return pickByHash(PROCESSOR_OPTIONS, product.name);
}

function getRam(product) {
  if (product.category !== "Computers") {
    return "";
  }
  const text = `${product.name} ${product.description}`.toLowerCase();
  const match = RAM_OPTIONS.find((option) => text.includes(option.toLowerCase()));
  if (match) {
    return match;
  }
  return pickByHash(RAM_OPTIONS, `${product.name}-${product.id}`);
}

function getHostingType(product) {
  if (product.category !== "Web Hosting Services") {
    return "";
  }

  const text = `${product.name} ${product.description}`.toLowerCase();
  const subcategory = String(product.subcategory || "").toLowerCase();

  if (text.includes("shared") || subcategory.includes("hosting packages")) {
    return "Shared Hosting";
  }
  if (text.includes("vps") || subcategory.includes("server services")) {
    return "VPS Hosting";
  }
  if (text.includes("cloud") || subcategory.includes("cloud services")) {
    return "Cloud Hosting";
  }
  if (text.includes("dedicated")) {
    return "Dedicated Server";
  }
  if (text.includes("reseller") || subcategory.includes("domain services")) {
    return "Reseller Hosting";
  }
  if (subcategory.includes("website services") || subcategory.includes("email hosting")) {
    return "Shared Hosting";
  }
  if (subcategory.includes("security services")) {
    return "Cloud Hosting";
  }
  if (subcategory.includes("developer services")) {
    return "VPS Hosting";
  }
  return "Reseller Hosting";
}

function getHostingOperatingSystem(product) {
  if (product.category !== "Web Hosting Services") {
    return "";
  }

  const text = `${product.name} ${product.description}`.toLowerCase();
  if (text.includes("linux")) {
    return "Linux";
  }
  if (text.includes("windows")) {
    return "Windows";
  }
  return hashValue(product.name) % 3 === 0 ? "Windows" : "Linux";
}

function getHostingStorageSpace(product, hostingType) {
  if (product.category !== "Web Hosting Services") {
    return 0;
  }

  const text = `${product.name} ${product.description}`.toLowerCase();
  if (text.includes("unlimited")) {
    return STORAGE_UNLIMITED_GB;
  }

  const valuesByType = {
    "Shared Hosting": [10, 25, 50],
    "VPS Hosting": [50, 100, 150],
    "Cloud Hosting": [100, 200, STORAGE_UNLIMITED_GB],
    "Dedicated Server": [200, 400, STORAGE_UNLIMITED_GB],
    "Reseller Hosting": [50, 100, 200]
  };

  const options = valuesByType[hostingType] || [50, 100, 200];
  return pickByHash(options, `${product.id}-${product.name}`);
}

function getHostingBandwidth(product, hostingType) {
  if (product.category !== "Web Hosting Services") {
    return 0;
  }

  const text = `${product.name} ${product.description}`.toLowerCase();
  if (text.includes("unmetered")) {
    return BANDWIDTH_UNMETERED_GB;
  }

  const valuesByType = {
    "Shared Hosting": [100, 250, 500],
    "VPS Hosting": [500, 750, BANDWIDTH_UNMETERED_GB],
    "Cloud Hosting": [750, BANDWIDTH_UNMETERED_GB],
    "Dedicated Server": [BANDWIDTH_UNMETERED_GB],
    "Reseller Hosting": [250, 500, 750]
  };

  const options = valuesByType[hostingType] || [250, 500];
  return pickByHash(options, `${product.name}-${product.subcategory}`);
}

function getHostingBillingCycle(product) {
  if (product.category !== "Web Hosting Services") {
    return "";
  }

  const text = `${product.name} ${product.description}`.toLowerCase();
  if (text.includes("yearly") || text.includes("annual")) {
    return "Yearly";
  }
  if (text.includes("quarterly")) {
    return "Quarterly";
  }
  if (text.includes("monthly")) {
    return "Monthly";
  }
  return pickByHash(HOSTING_BILLING_OPTIONS, product.name);
}

function formatStorageLabel(value) {
  return value >= STORAGE_UNLIMITED_GB ? "Unlimited" : `${value}GB`;
}

function formatBandwidthLabel(value) {
  return value >= BANDWIDTH_UNMETERED_GB ? "Unmetered" : `${value}GB`;
}

function sortProducts(list) {
  const products = [...list];
  return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

function isSectionOpen(sectionState, key) {
  return sectionState[key] !== false;
}

function getSelectedIctSubcategories(ictCategoryValues) {
  return ICT_FILTER_CATEGORY_OPTIONS.filter(
    (option) => option.id !== "all" && ictCategoryValues.includes(option.id)
  ).flatMap((option) => option.subcategories);
}

function getSearchText(product) {
  return [
    product.name,
    product.description,
    product.category,
    product.subcategory,
    product.derivedBrand,
    product.derivedProcessor,
    product.derivedRam,
    product.derivedHostingType,
    product.derivedHostingOs,
    product.derivedHostingBilling
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function toTestId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductsPage() {
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart, getErrorMessage } = useCart();
  const { wishlistIds, toggleWishlist } = useShop();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [status, setStatus] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [error, setError] = useState("");
  const [quickView, setQuickView] = useState(null);

  const [categoryValue, setCategoryValue] = useState("Computers");
  const [ictCategoryValues, setIctCategoryValues] = useState([]);
  const [brandValues, setBrandValues] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [processorValues, setProcessorValues] = useState([]);
  const [ramValues, setRamValues] = useState([]);
  const [hostingTypeValues, setHostingTypeValues] = useState([]);
  const [hostingOsValues, setHostingOsValues] = useState([]);
  const [hostingBillingValues, setHostingBillingValues] = useState([]);

  const [priceBounds, setPriceBounds] = useState([0, 1000]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [hostingStorageBounds, setHostingStorageBounds] = useState([10, STORAGE_UNLIMITED_GB]);
  const [hostingStorageRange, setHostingStorageRange] = useState([10, STORAGE_UNLIMITED_GB]);
  const [hostingBandwidthBounds, setHostingBandwidthBounds] = useState([100, BANDWIDTH_UNMETERED_GB]);
  const [hostingBandwidthRange, setHostingBandwidthRange] = useState([100, BANDWIDTH_UNMETERED_GB]);

  const [expanded, setExpanded] = useState({
    brands: false,
    processors: false,
    ram: false
  });

  const [sectionState, setSectionState] = useState({
    categories: false,
    brands: false,
    price: false,
    processor: false,
    ram: false,
    hostingType: false,
    hostingOs: false,
    hostingStorage: false,
    hostingBandwidth: false,
    hostingBilling: false
  });

  const initializedRef = useRef(false);
  const hostingInitializedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    if (!query) {
      return;
    }

    setCategoryValue("");
    setSearchInput(query);
    setSearchTerm(query);
  }, [location.search]);

  const catalogProducts = useMemo(
    () =>
      products.map((product) => {
        const hostingType = getHostingType(product);
        return {
          ...product,
          derivedBrand: getBrand(product),
          derivedProcessor: getProcessor(product),
          derivedRam: getRam(product),
          derivedHostingType: hostingType,
          derivedHostingOs: getHostingOperatingSystem(product),
          derivedHostingStorage: getHostingStorageSpace(product, hostingType),
          derivedHostingBandwidth: getHostingBandwidth(product, hostingType),
          derivedHostingBilling: getHostingBillingCycle(product)
        };
      }),
    [products]
  );

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products", {
          params: { page: 1, pageSize: 200, sort: "newest" }
        });
        setProducts(data.products || []);
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(String(searchInput || "").trim().toLowerCase());
    }, 220);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!catalogProducts.length) {
      return;
    }

    const prices = catalogProducts.map((product) => Number(product.price || 0));
    const min = Math.floor(Math.min(...prices) / 10) * 10;
    const max = Math.max(min + 10, Math.ceil(Math.max(...prices) / 10) * 10);
    setPriceBounds([min, max]);

    if (!initializedRef.current) {
      setPriceRange([min, max]);
      initializedRef.current = true;
      return;
    }

    setPriceRange((current) => {
      const nextMin = Math.max(min, Math.min(current[0], max));
      const nextMax = Math.max(nextMin, Math.min(current[1], max));
      return [nextMin, nextMax];
    });
  }, [catalogProducts]);

  useEffect(() => {
    const hostingProducts = catalogProducts.filter(
      (product) => product.category === "Web Hosting Services"
    );

    if (!hostingProducts.length) {
      return;
    }

    const storageValues = hostingProducts.map((product) => Number(product.derivedHostingStorage || 0));
    const bandwidthValues = hostingProducts.map((product) =>
      Number(product.derivedHostingBandwidth || 0)
    );

    const storageMin = Math.max(10, Math.floor(Math.min(...storageValues) / 10) * 10);
    const storageMax = Math.max(
      storageMin + 10,
      Math.ceil(Math.max(...storageValues) / 10) * 10
    );
    const bandwidthMin = Math.max(10, Math.floor(Math.min(...bandwidthValues) / 10) * 10);
    const bandwidthMax = Math.max(
      bandwidthMin + 10,
      Math.ceil(Math.max(...bandwidthValues) / 10) * 10
    );

    setHostingStorageBounds([storageMin, storageMax]);
    setHostingBandwidthBounds([bandwidthMin, bandwidthMax]);

    if (!hostingInitializedRef.current) {
      setHostingStorageRange([storageMin, storageMax]);
      setHostingBandwidthRange([bandwidthMin, bandwidthMax]);
      hostingInitializedRef.current = true;
      return;
    }

    setHostingStorageRange((current) => {
      const nextMin = Math.max(storageMin, Math.min(current[0], storageMax));
      const nextMax = Math.max(nextMin, Math.min(current[1], storageMax));
      return [nextMin, nextMax];
    });
    setHostingBandwidthRange((current) => {
      const nextMin = Math.max(bandwidthMin, Math.min(current[0], bandwidthMax));
      const nextMax = Math.max(nextMin, Math.min(current[1], bandwidthMax));
      return [nextMin, nextMax];
    });
  }, [catalogProducts]);

  const applyFilters = (dataset, ignoreField = "") => {
    let filtered = [...dataset];

    if (ignoreField !== "search" && searchTerm) {
      filtered = filtered.filter((product) => getSearchText(product).includes(searchTerm));
    }

    if (ignoreField !== "category" && categoryValue) {
      filtered = filtered.filter((product) => product.category === categoryValue);
    }

    if (ignoreField !== "ictCategory" && categoryValue === "ICT Products" && ictCategoryValues.length) {
      const selectedSubcategories = getSelectedIctSubcategories(ictCategoryValues);
      if (selectedSubcategories.length) {
        filtered = filtered.filter((product) => selectedSubcategories.includes(product.subcategory));
      }
    }

    if (ignoreField !== "brand" && brandValues.length) {
      filtered = filtered.filter((product) => brandValues.includes(product.derivedBrand));
    }

    if (ignoreField !== "processor" && processorValues.length) {
      filtered = filtered.filter((product) => processorValues.includes(product.derivedProcessor));
    }

    if (ignoreField !== "ram" && ramValues.length) {
      filtered = filtered.filter((product) => ramValues.includes(product.derivedRam));
    }

    if (ignoreField !== "hostingType" && categoryValue === "Web Hosting Services" && hostingTypeValues.length) {
      filtered = filtered.filter((product) =>
        hostingTypeValues.includes(product.derivedHostingType)
      );
    }

    if (ignoreField !== "hostingOs" && categoryValue === "Web Hosting Services" && hostingOsValues.length) {
      filtered = filtered.filter((product) => hostingOsValues.includes(product.derivedHostingOs));
    }

    if (
      ignoreField !== "hostingStorage" &&
      categoryValue === "Web Hosting Services" &&
      hostingStorageBounds[1] > hostingStorageBounds[0]
    ) {
      filtered = filtered.filter((product) => {
        const storage = Number(product.derivedHostingStorage || 0);
        return storage >= hostingStorageRange[0] && storage <= hostingStorageRange[1];
      });
    }

    if (
      ignoreField !== "hostingBandwidth" &&
      categoryValue === "Web Hosting Services" &&
      hostingBandwidthBounds[1] > hostingBandwidthBounds[0]
    ) {
      filtered = filtered.filter((product) => {
        const bandwidth = Number(product.derivedHostingBandwidth || 0);
        return bandwidth >= hostingBandwidthRange[0] && bandwidth <= hostingBandwidthRange[1];
      });
    }

    if (
      ignoreField !== "hostingBilling" &&
      categoryValue === "Web Hosting Services" &&
      hostingBillingValues.length
    ) {
      filtered = filtered.filter((product) =>
        hostingBillingValues.includes(product.derivedHostingBilling)
      );
    }

    if (ignoreField !== "price" && priceBounds[1] > priceBounds[0]) {
      filtered = filtered.filter((product) => {
        const price = Number(product.price || 0);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    return filtered;
  };

  const filteredProducts = useMemo(
    () => sortProducts(applyFilters(catalogProducts)),
    [
      catalogProducts,
      categoryValue,
      searchTerm,
      ictCategoryValues,
      brandValues,
      processorValues,
      ramValues,
      hostingTypeValues,
      hostingOsValues,
      hostingStorageRange,
      hostingStorageBounds,
      hostingBandwidthRange,
      hostingBandwidthBounds,
      hostingBillingValues,
      priceRange,
      priceBounds
    ]
  );

  const categoryCounts = useMemo(() => {
    const base = applyFilters(catalogProducts, "category");
    return {
      all: base.length,
      Computers: base.filter((product) => product.category === "Computers").length,
      "ICT Products": base.filter((product) => product.category === "ICT Products").length,
      "Web Hosting Services": base.filter(
        (product) => product.category === "Web Hosting Services"
      ).length
    };
  }, [
    catalogProducts,
    searchTerm,
    ictCategoryValues,
    brandValues,
    processorValues,
    ramValues,
    hostingTypeValues,
    hostingOsValues,
    hostingStorageRange,
    hostingStorageBounds,
    hostingBandwidthRange,
    hostingBandwidthBounds,
    hostingBillingValues,
    priceRange,
    priceBounds
  ]);

  const brandCounts = useMemo(() => {
    const base = applyFilters(catalogProducts, "brand");
    const counts = {};
    BRAND_OPTIONS.forEach((brand) => {
      counts[brand] = 0;
    });
    base.forEach((product) => {
      if (counts[product.derivedBrand] !== undefined) {
        counts[product.derivedBrand] += 1;
      }
    });
    return counts;
  }, [
    catalogProducts,
    categoryValue,
    searchTerm,
    ictCategoryValues,
    processorValues,
    ramValues,
    hostingTypeValues,
    hostingOsValues,
    hostingStorageRange,
    hostingStorageBounds,
    hostingBandwidthRange,
    hostingBandwidthBounds,
    hostingBillingValues,
    priceRange,
    priceBounds
  ]);

  const processorCounts = useMemo(() => {
    const base = applyFilters(catalogProducts, "processor");
    const counts = {};
    PROCESSOR_OPTIONS.forEach((processor) => {
      counts[processor] = 0;
    });
    base.forEach((product) => {
      if (counts[product.derivedProcessor] !== undefined) {
        counts[product.derivedProcessor] += 1;
      }
    });
    return counts;
  }, [
    catalogProducts,
    categoryValue,
    searchTerm,
    ictCategoryValues,
    brandValues,
    ramValues,
    hostingTypeValues,
    hostingOsValues,
    hostingStorageRange,
    hostingStorageBounds,
    hostingBandwidthRange,
    hostingBandwidthBounds,
    hostingBillingValues,
    priceRange,
    priceBounds
  ]);

  const ramCounts = useMemo(() => {
    const base = applyFilters(catalogProducts, "ram");
    const counts = {};
    RAM_OPTIONS.forEach((ram) => {
      counts[ram] = 0;
    });
    base.forEach((product) => {
      if (counts[product.derivedRam] !== undefined) {
        counts[product.derivedRam] += 1;
      }
    });
    return counts;
  }, [
    catalogProducts,
    categoryValue,
    searchTerm,
    ictCategoryValues,
    brandValues,
    processorValues,
    hostingTypeValues,
    hostingOsValues,
    hostingStorageRange,
    hostingStorageBounds,
    hostingBandwidthRange,
    hostingBandwidthBounds,
    hostingBillingValues,
    priceRange,
    priceBounds
  ]);

  const ictCategoryCounts = useMemo(() => {
    if (categoryValue !== "ICT Products") {
      return {};
    }

    const base = applyFilters(catalogProducts, "ictCategory");
    const counts = {};
    ICT_FILTER_CATEGORY_OPTIONS.forEach((option) => {
      if (option.id === "all") {
        counts.all = base.length;
        return;
      }
      counts[option.id] = base.filter((product) =>
        option.subcategories.includes(product.subcategory)
      ).length;
    });
    return counts;
  }, [
    catalogProducts,
    categoryValue,
    searchTerm,
    brandValues,
    processorValues,
    ramValues,
    hostingTypeValues,
    hostingOsValues,
    hostingStorageRange,
    hostingStorageBounds,
    hostingBandwidthRange,
    hostingBandwidthBounds,
    hostingBillingValues,
    priceRange,
    priceBounds
  ]);

  const hostingTypeCounts = useMemo(() => {
    if (categoryValue !== "Web Hosting Services") {
      return {};
    }

    const base = applyFilters(catalogProducts, "hostingType");
    const counts = {};
    HOSTING_TYPE_OPTIONS.forEach((option) => {
      counts[option] = base.filter((product) => product.derivedHostingType === option).length;
    });
    return counts;
  }, [
    catalogProducts,
    categoryValue,
    searchTerm,
    hostingOsValues,
    hostingStorageRange,
    hostingStorageBounds,
    hostingBandwidthRange,
    hostingBandwidthBounds,
    hostingBillingValues,
    priceRange,
    priceBounds
  ]);

  const hostingOsCounts = useMemo(() => {
    if (categoryValue !== "Web Hosting Services") {
      return {};
    }

    const base = applyFilters(catalogProducts, "hostingOs");
    const counts = {};
    HOSTING_OS_OPTIONS.forEach((option) => {
      counts[option] = base.filter((product) => product.derivedHostingOs === option).length;
    });
    return counts;
  }, [
    catalogProducts,
    categoryValue,
    searchTerm,
    hostingTypeValues,
    hostingStorageRange,
    hostingStorageBounds,
    hostingBandwidthRange,
    hostingBandwidthBounds,
    hostingBillingValues,
    priceRange,
    priceBounds
  ]);

  const hostingBillingCounts = useMemo(() => {
    if (categoryValue !== "Web Hosting Services") {
      return {};
    }

    const base = applyFilters(catalogProducts, "hostingBilling");
    const counts = {};
    HOSTING_BILLING_OPTIONS.forEach((option) => {
      counts[option] = base.filter((product) => product.derivedHostingBilling === option).length;
    });
    return counts;
  }, [
    catalogProducts,
    categoryValue,
    searchTerm,
    hostingTypeValues,
    hostingOsValues,
    hostingStorageRange,
    hostingStorageBounds,
    hostingBandwidthRange,
    hostingBandwidthBounds,
    priceRange,
    priceBounds
  ]);

  const onClearAllFilters = () => {
    setCategoryValue("");
    setIctCategoryValues([]);
    setBrandValues([]);
    setBrandSearch("");
    setSearchInput("");
    setSearchTerm("");
    setProcessorValues([]);
    setRamValues([]);
    setHostingTypeValues([]);
    setHostingOsValues([]);
    setHostingBillingValues([]);
    setHostingStorageRange([hostingStorageBounds[0], hostingStorageBounds[1]]);
    setHostingBandwidthRange([hostingBandwidthBounds[0], hostingBandwidthBounds[1]]);
    setPriceRange([priceBounds[0], priceBounds[1]]);
  };

  const onMainCategorySelect = (value) => {
    setCategoryValue(value);
    setIctCategoryValues([]);
    setBrandValues([]);
    setBrandSearch("");
    setProcessorValues([]);
    setRamValues([]);
    setHostingTypeValues([]);
    setHostingOsValues([]);
    setHostingBillingValues([]);
    setHostingStorageRange([hostingStorageBounds[0], hostingStorageBounds[1]]);
    setHostingBandwidthRange([hostingBandwidthBounds[0], hostingBandwidthBounds[1]]);
    setPriceRange([priceBounds[0], priceBounds[1]]);
  };

  const onAddToCart = async (productId) => {
    if (!user) {
      setStatus("Please login or register to add products to cart.");
      return;
    }
    setStatus("");
    setBusyId(productId);
    try {
      await addToCart(productId, 1);
      setDialogMessage("Product added to cart.");
    } catch (addError) {
      setStatus(getErrorMessage(addError));
    } finally {
      setBusyId("");
    }
  };

  const onToggleWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      setStatus("Wishlist updated.");
    } catch (actionError) {
      setStatus(getErrorMessage(actionError));
    }
  };

  const filteredBrandOptions = useMemo(() => {
    const baseOptions = BRAND_OPTIONS.filter(
      (brand) => (brandCounts[brand] || 0) > 0 || brandValues.includes(brand)
    );
    const query = String(brandSearch || "").trim().toLowerCase();
    if (!query) {
      return baseOptions;
    }
    return baseOptions.filter((brand) => brand.toLowerCase().includes(query));
  }, [brandCounts, brandValues, brandSearch]);

  const searchSuggestions = useMemo(() => {
    const query = String(searchInput || "").trim().toLowerCase();
    if (!query) {
      return [];
    }

    const suggestions = [];
    const seen = new Set();
    const pushSuggestion = (value) => {
      const normalized = String(value || "").trim();
      const key = normalized.toLowerCase();
      if (!normalized || seen.has(key) || !key.includes(query)) {
        return;
      }
      seen.add(key);
      suggestions.push(normalized);
    };

    catalogProducts.forEach((product) => {
      pushSuggestion(product.name);
      pushSuggestion(product.derivedBrand);
      pushSuggestion(product.derivedProcessor);
      pushSuggestion(product.subcategory);
      pushSuggestion(product.derivedHostingType);
    });

    return suggestions.slice(0, 8);
  }, [catalogProducts, searchInput]);

  const brandOptionsVisible = expanded.brands
    ? filteredBrandOptions
    : filteredBrandOptions.slice(0, 6);
  const processorOptionsVisible = expanded.processors
    ? PROCESSOR_OPTIONS
    : PROCESSOR_OPTIONS.slice(0, 5);
  const ramOptionsVisible = expanded.ram ? RAM_OPTIONS : RAM_OPTIONS.slice(0, 5);
  const isComputerMode = categoryValue === "Computers";
  const isIctMode = categoryValue === "ICT Products";
  const isHostingMode = categoryValue === "Web Hosting Services";

  const priceDiff = Math.max(1, priceBounds[1] - priceBounds[0]);
  const priceMinPercent = ((priceRange[0] - priceBounds[0]) / priceDiff) * 100;
  const priceMaxPercent = ((priceRange[1] - priceBounds[0]) / priceDiff) * 100;

  const hostingStorageDiff = Math.max(1, hostingStorageBounds[1] - hostingStorageBounds[0]);
  const hostingStorageMinPercent =
    ((hostingStorageRange[0] - hostingStorageBounds[0]) / hostingStorageDiff) * 100;
  const hostingStorageMaxPercent =
    ((hostingStorageRange[1] - hostingStorageBounds[0]) / hostingStorageDiff) * 100;

  const hostingBandwidthDiff = Math.max(
    1,
    hostingBandwidthBounds[1] - hostingBandwidthBounds[0]
  );
  const hostingBandwidthMinPercent =
    ((hostingBandwidthRange[0] - hostingBandwidthBounds[0]) / hostingBandwidthDiff) * 100;
  const hostingBandwidthMaxPercent =
    ((hostingBandwidthRange[1] - hostingBandwidthBounds[0]) / hostingBandwidthDiff) * 100;

  const hostingStoragePresets = [
    {
      id: "10-50",
      label: "10GB - 50GB",
      range: [Math.max(hostingStorageBounds[0], 10), Math.min(50, hostingStorageBounds[1])]
    },
    {
      id: "50-100",
      label: "50GB - 100GB",
      range: [Math.max(hostingStorageBounds[0], 50), Math.min(100, hostingStorageBounds[1])]
    },
    {
      id: "100-unlimited",
      label: "100GB - Unlimited",
      range: [Math.max(hostingStorageBounds[0], 100), hostingStorageBounds[1]]
    }
  ].filter((preset) => preset.range[0] <= preset.range[1]);

  const hostingBandwidthPresets = [
    {
      id: "10",
      label: "10GB",
      range: [hostingBandwidthBounds[0], Math.min(100, hostingBandwidthBounds[1])]
    },
    {
      id: "100",
      label: "100GB",
      range: [Math.max(hostingBandwidthBounds[0], 100), Math.min(500, hostingBandwidthBounds[1])]
    },
    {
      id: "unmetered",
      label: "Unmetered",
      range: [Math.max(hostingBandwidthBounds[0], 500), hostingBandwidthBounds[1]]
    }
  ].filter((preset) => preset.range[0] <= preset.range[1]);

  const isSameRange = (left, right) => left[0] === right[0] && left[1] === right[1];
  const getSectionCaret = (key) => (
    <span
      className={`tech-section-caret ${isSectionOpen(sectionState, key) ? "is-open" : ""}`}
      aria-hidden="true"
    >
      v
    </span>
  );

  const activeFilterCount =
    Number(Boolean(categoryValue)) +
    Number(Boolean(searchTerm)) +
    ictCategoryValues.length +
    brandValues.length +
    processorValues.length +
    ramValues.length +
    hostingTypeValues.length +
    hostingOsValues.length +
    hostingBillingValues.length +
    Number(
      hostingStorageRange[0] !== hostingStorageBounds[0] ||
        hostingStorageRange[1] !== hostingStorageBounds[1]
    ) +
    Number(
      hostingBandwidthRange[0] !== hostingBandwidthBounds[0] ||
        hostingBandwidthRange[1] !== hostingBandwidthBounds[1]
    ) +
    Number(priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1]);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Catalog" }]}
        eyebrow="Datamak Marketplace"
        title="Product Catalog"
        subtitle="Find computers, ICT gear, networking devices, software licenses, and cloud hosting packages from one curated catalog."
        fallback="/"
      />

      <section className="catalog-filter-layout" data-testid="catalog-filter-layout">
        <aside className="tech-filter-sidebar" data-testid="filter-sidebar">
          <div className="tech-filter-header">
            <div className="tech-filter-title-wrap">
              <span className="tech-filter-icon" aria-hidden="true">
                ||
              </span>
              <strong>Filters</strong>
            </div>
            <button
              type="button"
              className="tech-clear-btn"
              onClick={onClearAllFilters}
              data-testid="filter-clear-all"
            >
              Clear All
            </button>
          </div>

          <div className="tech-filter-meta" data-testid="filter-active-count">
            <span>{activeFilterCount} active</span>
          </div>

          {isComputerMode && (
            <button
              type="button"
              className="tech-filter-mode-toggle"
              onClick={() => onMainCategorySelect("")}
              data-testid="filter-mode-computers"
            >
              <span className="tech-filter-mode-left">
                <span className="tech-filter-mode-mark" aria-hidden="true">
                  *
                </span>
                <strong>Computers Filters</strong>
              </span>
              <span aria-hidden="true">&gt;</span>
            </button>
          )}

          {isIctMode && (
            <button
              type="button"
              className="tech-filter-mode-toggle"
              onClick={() => onMainCategorySelect("")}
              data-testid="filter-mode-ict"
            >
              <span className="tech-filter-mode-left">
                <span className="tech-filter-mode-mark" aria-hidden="true">
                  *
                </span>
                <strong>ICT Products Filters</strong>
              </span>
              <span aria-hidden="true">&gt;</span>
            </button>
          )}

          {isHostingMode && (
            <button
              type="button"
              className="tech-filter-mode-toggle"
              onClick={() => onMainCategorySelect("")}
              data-testid="filter-mode-hosting"
            >
              <span className="tech-filter-mode-left">
                <span className="tech-filter-mode-mark" aria-hidden="true">
                  *
                </span>
                <strong>Web Hosting Filters</strong>
              </span>
              <span aria-hidden="true">&gt;</span>
            </button>
          )}

          {!isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-categories">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    categories: !isSectionOpen(current, "categories")
                  }))
                }
                data-testid="filter-toggle-categories"
              >
                <span>Categories</span>
                {getSectionCaret("categories")}
              </button>
              {isSectionOpen(sectionState, "categories") && (
                <div className="tech-filter-options" data-testid="filter-options-categories">
                  {isIctMode
                    ? ICT_FILTER_CATEGORY_OPTIONS.map((option) => {
                        const isAll = option.id === "all";
                        const checked = isAll
                          ? ictCategoryValues.length === 0
                          : ictCategoryValues.includes(option.id);
                        const countValue = isAll
                          ? ictCategoryCounts.all || 0
                          : ictCategoryCounts[option.id] || 0;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            className="tech-filter-option"
                            data-testid={`filter-ict-category-${toTestId(option.id)}`}
                            onClick={() => {
                              if (isAll) {
                                setIctCategoryValues([]);
                                return;
                              }
                              setIctCategoryValues((current) => toggleValue(current, option.id));
                            }}
                          >
                            <span className={`tech-option-box ${checked ? "is-checked" : ""}`} />
                            <span className="tech-option-label">{option.label}</span>
                            <span className="tech-option-count">{countValue}</span>
                          </button>
                        );
                      })
                    : CATEGORY_OPTIONS.map((option) => (
                        <button
                          key={option.value || "all"}
                          type="button"
                          className="tech-filter-option"
                          data-testid={`filter-category-${toTestId(option.countKey || option.label)}`}
                          onClick={() => onMainCategorySelect(option.value)}
                        >
                          <span
                            className={`tech-option-box ${categoryValue === option.value ? "is-checked" : ""}`}
                          />
                          <span className="tech-option-label">{option.label}</span>
                          <span className="tech-option-count">{categoryCounts[option.countKey] || 0}</span>
                        </button>
                      ))}
                </div>
              )}
            </section>
          )}

          {!isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-brands">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    brands: !isSectionOpen(current, "brands")
                  }))
                }
                data-testid="filter-toggle-brands"
              >
                <span>Brand</span>
                {getSectionCaret("brands")}
              </button>
              {isSectionOpen(sectionState, "brands") && (
                <div className="tech-filter-options" data-testid="filter-options-brands">
                  {isIctMode && (
                    <label className="tech-brand-search">
                      <span className="sr-only">Search brand</span>
                      <input
                        type="text"
                        placeholder="Search brand..."
                        value={brandSearch}
                        onChange={(event) => setBrandSearch(event.target.value)}
                        data-testid="filter-brand-search-input"
                      />
                    </label>
                  )}
                  {brandOptionsVisible.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      className="tech-filter-option"
                      data-testid={`filter-brand-${toTestId(brand)}`}
                      onClick={() => setBrandValues((current) => toggleValue(current, brand))}
                    >
                      <span className={`tech-option-box ${brandValues.includes(brand) ? "is-checked" : ""}`} />
                      <span className="tech-option-label">{brand}</span>
                      <span className="tech-option-count">{brandCounts[brand] || 0}</span>
                    </button>
                  ))}
                  {filteredBrandOptions.length > 6 && (
                    <button
                      type="button"
                      className="tech-show-more"
                      data-testid="filter-brand-show-more"
                      onClick={() =>
                        setExpanded((current) => ({ ...current, brands: !current.brands }))
                      }
                    >
                      {expanded.brands ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}
            </section>
          )}

          {!isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-price">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    price: !isSectionOpen(current, "price")
                  }))
                }
                data-testid="filter-toggle-price"
              >
                <span>Price Range</span>
                {getSectionCaret("price")}
              </button>
              {isSectionOpen(sectionState, "price") && (
                <div className="tech-price-body" data-testid="filter-options-price">
                  <div className="tech-price-values">
                    <span>M{priceRange[0]}</span>
                    <span>M{priceRange[1]}</span>
                  </div>
                  <div className="tech-price-slider-wrap">
                    <span className="tech-price-track" />
                    <span
                      className="tech-price-selected"
                      style={{
                        left: `${priceMinPercent}%`,
                        right: `${100 - priceMaxPercent}%`
                      }}
                    />
                    <input
                      className="tech-price-slider"
                      type="range"
                      min={priceBounds[0]}
                      max={priceBounds[1]}
                      value={priceRange[0]}
                      data-testid="filter-price-min-slider"
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setPriceRange((current) => [Math.min(next, current[1]), current[1]]);
                      }}
                    />
                    <input
                      className="tech-price-slider"
                      type="range"
                      min={priceBounds[0]}
                      max={priceBounds[1]}
                      value={priceRange[1]}
                      data-testid="filter-price-max-slider"
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setPriceRange((current) => [current[0], Math.max(next, current[0])]);
                      }}
                    />
                  </div>
                  <p className="tech-price-caption">
                    M{priceRange[0]} - M{priceRange[1]}
                  </p>
                </div>
              )}
            </section>
          )}

          {isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-hosting-type">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    hostingType: !isSectionOpen(current, "hostingType")
                  }))
                }
                data-testid="filter-toggle-hosting-type"
              >
                <span>Hosting Type</span>
                {getSectionCaret("hostingType")}
              </button>
              {isSectionOpen(sectionState, "hostingType") && (
                <div className="tech-filter-options" data-testid="filter-options-hosting-type">
                  {HOSTING_TYPE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="tech-filter-option"
                      data-testid={`filter-hosting-type-${toTestId(option)}`}
                      onClick={() =>
                        setHostingTypeValues((current) => toggleValue(current, option))
                      }
                    >
                      <span
                        className={`tech-option-box ${
                          hostingTypeValues.includes(option) ? "is-checked" : ""
                        }`}
                      />
                      <span className="tech-option-label">{option}</span>
                      <span className="tech-option-count">{hostingTypeCounts[option] || 0}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-hosting-os">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    hostingOs: !isSectionOpen(current, "hostingOs")
                  }))
                }
                data-testid="filter-toggle-hosting-os"
              >
                <span>Operating System</span>
                {getSectionCaret("hostingOs")}
              </button>
              {isSectionOpen(sectionState, "hostingOs") && (
                <div className="tech-filter-options" data-testid="filter-options-hosting-os">
                  {HOSTING_OS_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="tech-filter-option"
                      data-testid={`filter-hosting-os-${toTestId(option)}`}
                      onClick={() => setHostingOsValues((current) => toggleValue(current, option))}
                    >
                      <span
                        className={`tech-option-box ${
                          hostingOsValues.includes(option) ? "is-checked" : ""
                        }`}
                      />
                      <span className="tech-option-label">{option}</span>
                      <span className="tech-option-count">{hostingOsCounts[option] || 0}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-hosting-storage">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    hostingStorage: !isSectionOpen(current, "hostingStorage")
                  }))
                }
                data-testid="filter-toggle-hosting-storage"
              >
                <span>Storage Space</span>
                {getSectionCaret("hostingStorage")}
              </button>
              {isSectionOpen(sectionState, "hostingStorage") && (
                <div className="tech-price-body" data-testid="filter-options-hosting-storage">
                  <div className="tech-price-values">
                    <span>{formatStorageLabel(hostingStorageRange[0])}</span>
                    <span>{formatStorageLabel(hostingStorageRange[1])}</span>
                  </div>
                  <div className="tech-price-slider-wrap">
                    <span className="tech-price-track" />
                    <span
                      className="tech-price-selected"
                      style={{
                        left: `${hostingStorageMinPercent}%`,
                        right: `${100 - hostingStorageMaxPercent}%`
                      }}
                    />
                    <input
                      className="tech-price-slider"
                      type="range"
                      min={hostingStorageBounds[0]}
                      max={hostingStorageBounds[1]}
                      step={10}
                      value={hostingStorageRange[0]}
                      data-testid="filter-hosting-storage-min-slider"
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setHostingStorageRange((current) => [Math.min(next, current[1]), current[1]]);
                      }}
                    />
                    <input
                      className="tech-price-slider"
                      type="range"
                      min={hostingStorageBounds[0]}
                      max={hostingStorageBounds[1]}
                      step={10}
                      value={hostingStorageRange[1]}
                      data-testid="filter-hosting-storage-max-slider"
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setHostingStorageRange((current) => [current[0], Math.max(next, current[0])]);
                      }}
                    />
                  </div>
                  <div className="tech-range-chip-row">
                    {hostingStoragePresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className={`tech-range-chip ${
                          isSameRange(hostingStorageRange, preset.range) ? "is-active" : ""
                        }`}
                        data-testid={`filter-hosting-storage-preset-${toTestId(preset.id)}`}
                        onClick={() => setHostingStorageRange(preset.range)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <p className="tech-price-caption">
                    {formatStorageLabel(hostingStorageRange[0])} -{" "}
                    {formatStorageLabel(hostingStorageRange[1])}
                  </p>
                </div>
              )}
            </section>
          )}

          {isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-hosting-bandwidth">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    hostingBandwidth: !isSectionOpen(current, "hostingBandwidth")
                  }))
                }
                data-testid="filter-toggle-hosting-bandwidth"
              >
                <span>Bandwidth</span>
                {getSectionCaret("hostingBandwidth")}
              </button>
              {isSectionOpen(sectionState, "hostingBandwidth") && (
                <div className="tech-price-body" data-testid="filter-options-hosting-bandwidth">
                  <div className="tech-price-values">
                    <span>{formatBandwidthLabel(hostingBandwidthRange[0])}</span>
                    <span>{formatBandwidthLabel(hostingBandwidthRange[1])}</span>
                  </div>
                  <div className="tech-price-slider-wrap">
                    <span className="tech-price-track" />
                    <span
                      className="tech-price-selected"
                      style={{
                        left: `${hostingBandwidthMinPercent}%`,
                        right: `${100 - hostingBandwidthMaxPercent}%`
                      }}
                    />
                    <input
                      className="tech-price-slider"
                      type="range"
                      min={hostingBandwidthBounds[0]}
                      max={hostingBandwidthBounds[1]}
                      step={10}
                      value={hostingBandwidthRange[0]}
                      data-testid="filter-hosting-bandwidth-min-slider"
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setHostingBandwidthRange((current) => [
                          Math.min(next, current[1]),
                          current[1]
                        ]);
                      }}
                    />
                    <input
                      className="tech-price-slider"
                      type="range"
                      min={hostingBandwidthBounds[0]}
                      max={hostingBandwidthBounds[1]}
                      step={10}
                      value={hostingBandwidthRange[1]}
                      data-testid="filter-hosting-bandwidth-max-slider"
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setHostingBandwidthRange((current) => [
                          current[0],
                          Math.max(next, current[0])
                        ]);
                      }}
                    />
                  </div>
                  <div className="tech-range-chip-row">
                    {hostingBandwidthPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className={`tech-range-chip ${
                          isSameRange(hostingBandwidthRange, preset.range) ? "is-active" : ""
                        }`}
                        data-testid={`filter-hosting-bandwidth-preset-${toTestId(preset.id)}`}
                        onClick={() => setHostingBandwidthRange(preset.range)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <p className="tech-price-caption">
                    {formatBandwidthLabel(hostingBandwidthRange[0])} -{" "}
                    {formatBandwidthLabel(hostingBandwidthRange[1])}
                  </p>
                </div>
              )}
            </section>
          )}

          {isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-hosting-billing">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    hostingBilling: !isSectionOpen(current, "hostingBilling")
                  }))
                }
                data-testid="filter-toggle-hosting-billing"
              >
                <span>Billing Cycle</span>
                {getSectionCaret("hostingBilling")}
              </button>
              {isSectionOpen(sectionState, "hostingBilling") && (
                <div className="tech-filter-options" data-testid="filter-options-hosting-billing">
                  {HOSTING_BILLING_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="tech-filter-option"
                      data-testid={`filter-hosting-billing-${toTestId(option)}`}
                      onClick={() =>
                        setHostingBillingValues((current) => toggleValue(current, option))
                      }
                    >
                      <span
                        className={`tech-option-box ${
                          hostingBillingValues.includes(option) ? "is-checked" : ""
                        }`}
                      />
                      <span className="tech-option-label">{option}</span>
                      <span className="tech-option-count">{hostingBillingCounts[option] || 0}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {!isIctMode && !isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-processor">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    processor: !isSectionOpen(current, "processor")
                  }))
                }
                data-testid="filter-toggle-processor"
              >
                <span>Processor</span>
                {getSectionCaret("processor")}
              </button>
              {isSectionOpen(sectionState, "processor") && (
                <div className="tech-filter-options" data-testid="filter-options-processor">
                  {processorOptionsVisible.map((processor) => (
                    <button
                      key={processor}
                      type="button"
                      className="tech-filter-option"
                      data-testid={`filter-processor-${toTestId(processor)}`}
                      onClick={() =>
                        setProcessorValues((current) => toggleValue(current, processor))
                      }
                    >
                      <span
                        className={`tech-option-box ${
                          processorValues.includes(processor) ? "is-checked" : ""
                        }`}
                      />
                      <span className="tech-option-label">{processor}</span>
                      <span className="tech-option-count">{processorCounts[processor] || 0}</span>
                    </button>
                  ))}
                  {PROCESSOR_OPTIONS.length > 5 && (
                    <button
                      type="button"
                      className="tech-show-more"
                      data-testid="filter-processor-show-more"
                      onClick={() =>
                        setExpanded((current) => ({ ...current, processors: !current.processors }))
                      }
                    >
                      {expanded.processors ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}
            </section>
          )}

          {!isIctMode && !isHostingMode && (
            <section className="tech-filter-section" data-testid="filter-section-ram">
              <button
                type="button"
                className="tech-filter-section-header"
                onClick={() =>
                  setSectionState((current) => ({
                    ...current,
                    ram: !isSectionOpen(current, "ram")
                  }))
                }
                data-testid="filter-toggle-ram"
              >
                <span>RAM</span>
                {getSectionCaret("ram")}
              </button>
              {isSectionOpen(sectionState, "ram") && (
                <div className="tech-filter-options" data-testid="filter-options-ram">
                  {ramOptionsVisible.map((ram) => (
                    <button
                      key={ram}
                      type="button"
                      className="tech-filter-option"
                      data-testid={`filter-ram-${toTestId(ram)}`}
                      onClick={() => setRamValues((current) => toggleValue(current, ram))}
                    >
                      <span
                        className={`tech-option-box ${ramValues.includes(ram) ? "is-checked" : ""}`}
                      />
                      <span className="tech-option-label">{ram}</span>
                      <span className="tech-option-count">{ramCounts[ram] || 0}</span>
                    </button>
                  ))}
                  {RAM_OPTIONS.length > 5 && (
                    <button
                      type="button"
                      className="tech-show-more"
                      data-testid="filter-ram-show-more"
                      onClick={() =>
                        setExpanded((current) => ({ ...current, ram: !current.ram }))
                      }
                    >
                      {expanded.ram ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}
            </section>
          )}
        </aside>

        <div className="catalog-filter-results" data-testid="catalog-results">
          <section className="panel catalog-search-panel" data-testid="catalog-search-panel">
            <div className="catalog-search-row" data-testid="catalog-search-row">
              <label className="catalog-search-input-wrap" htmlFor="catalog-product-search">
                <span className="sr-only">Search products</span>
                <input
                  id="catalog-product-search"
                  type="search"
                  value={searchInput}
                  list="catalog-product-search-options"
                  placeholder="Search products, brands, processors, hosting plans..."
                  onChange={(event) => setSearchInput(event.target.value)}
                  data-testid="catalog-search-input"
                />
              </label>
              {searchInput && (
                <button
                  type="button"
                  className="catalog-search-clear-btn"
                  data-testid="catalog-search-clear-button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <p className="catalog-search-meta" data-testid="catalog-search-meta">
              {searchTerm
                ? `Search active: "${searchInput.trim()}"`
                : "Search by product name, brand, processor, RAM, or hosting features."}
            </p>
            <datalist id="catalog-product-search-options" data-testid="catalog-search-suggestions">
              {searchSuggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </section>

          {(status || error) && (
            <section className="panel">
              {status && <p className="hint notice">{status}</p>}
              {error && <p className="error notice">{error}</p>}
            </section>
          )}

          {loading ? (
            <section className="panel" data-testid="catalog-loading-state">
              Loading products...
            </section>
          ) : filteredProducts.length === 0 ? (
            <section className="panel empty-state" data-testid="catalog-empty-state">
              <h2>No products found</h2>
              <p className="muted">Adjust your search or filters, then try again.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClearAllFilters}
                data-testid="catalog-clear-filters-button"
              >
                Clear Filters
              </button>
            </section>
          ) : (
            <>
              <section className="panel catalog-count-panel" data-testid="catalog-count-panel">
                <p>
                  Showing <strong data-testid="catalog-results-count">{filteredProducts.length}</strong> products
                </p>
              </section>
              <section className="product-grid" data-testid="catalog-product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onQuickView={setQuickView}
                    onWishlist={onToggleWishlist}
                    busy={busyId === product.id}
                    wishlisted={wishlistIds.includes(product.id)}
                  />
                ))}
              </section>
            </>
          )}
        </div>
      </section>

      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        onAddToCart={onAddToCart}
        busy={busyId === quickView?.id}
      />
      <MessageDialog message={dialogMessage} onClose={() => setDialogMessage("")} />
    </>
  );
}
