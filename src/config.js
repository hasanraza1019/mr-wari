export const API_URL = import.meta.env.VITE_API_URL || "https://mr-wari-backend-production.up.railway.app";

export function getProductImage(name = "", category = "") {
  const text = `${name} ${category}`.toLowerCase();
  const matches = [
    [["biryani"], "/products/chicken-biryani.jpg"],
    [["pulao", "rice"], "/products/chicken-pulao.jpg"],
    [["tikka", "bbq"], "/products/chicken-tikka.jpg"],
    [["karahi"], "/products/chicken-karahi.jpg"],
    [["handi"], "/products/chicken-handi.jpg"],
    [["burger", "zinger"], "/products/chicken-zinger-burger.jpg"],
    [["pizza"], "/products/mister-wari-grill-platter.jpg"],
    [["fish", "seafood"], "/products/bbq-platter.jpg"],
    [["drink", "soda", "lemon", "juice", "lassi"], "/products/fresh-lemonade.jpg"],
    [["dessert", "sweet", "jamun", "kheer"], "/products/gulab-jamun.jpg"],
    [["salad"], "/products/fresh-salad.jpg"],
  ];

  const match = matches.find(([keywords]) =>
    keywords.some((keyword) => text.includes(keyword))
  );
  return match ? match[1] : "/products/mister-wari-grill-platter.jpg";
}

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
