export const API_URL = import.meta.env.VITE_API_URL || "https://mr-wari-backend-production.up.railway.app";

export function resolveAssetUrl(value = "") {
  if (!value || /^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const localImageFallbacks = {
    "/products/zinger-burger.jpg": "/products/chicken-zinger-burger.jpg",
    "/products/fish-fillet.jpg": "/products/bbq-platter.jpg",
    "/products/lime-soda.jpg": "/products/fresh-lemonade.jpg",
    "/products/paneer-tikka.jpg": "/products/chicken-tikka.jpg",
    "/products/cheese-pizza.jpg": "/products/mister-wari-grill-platter.jpg",
  };
  const path = value.startsWith("/") ? value : `/${value}`;
  const resolvedPath = localImageFallbacks[path] || path;
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${resolvedPath}`;
}
