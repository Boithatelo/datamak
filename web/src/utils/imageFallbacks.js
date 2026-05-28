const CATEGORY_FALLBACKS = {
  Computers: "/images/tech-e-comm.jpg",
  "ICT Products": "/images/ict.jpg",
  "Web Hosting Services": "/images/tech-e-comm.jpg"
};

function withBasePath(src) {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  const base = import.meta.env.BASE_URL || "/";
  if (base === "/" || !src.startsWith("/")) {
    return src;
  }

  return `${base.replace(/\/$/, "")}${src}`;
}

export function getProductImageFallback(category) {
  return withBasePath(CATEGORY_FALLBACKS[category] || "/images/tech-e-comm.jpg");
}

export function getImageSource(src, category) {
  return withBasePath(src) || getProductImageFallback(category);
}

export function applyImageFallback(event, category) {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === "true") {
    return;
  }

  image.dataset.fallbackApplied = "true";
  image.src = getProductImageFallback(category);
}
