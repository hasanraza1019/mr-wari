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
  const rawValue = String(value).trim();
  if (!rawValue || rawValue.startsWith("data:")) {
    return rawValue;
  }

  const absoluteUrlIndex = rawValue.search(/https?:\/\//i);
  if (absoluteUrlIndex >= 0) {
    return rawValue.slice(absoluteUrlIndex);
  }

  const localImageFallbacks = {
    "/products/chicken-biryani.jpg":
      "https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=800&q=80",
    "/products/chicken-pulao.jpg":
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80",
    "/products/zinger-burger.jpg":
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&w=800&q=80",
    "/products/chicken-zinger-burger.jpg":
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&w=800&q=80",
    "/products/fish-fillet.jpg":
      "https://images.unsplash.com/photo-1534940510219-ccf7d8f2b7c1?auto=format&fit=crop&w=800&q=80",
    "/products/lime-soda.jpg":
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
    "/products/fresh-lemonade.jpg":
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
    "/products/paneer-tikka.jpg":
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
    "/products/cheese-pizza.jpg":
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    "/products/mister-wari-grill-platter.jpg":
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "/products/bbq-platter.jpg":
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "/products/chicken-tikka.jpg":
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    "/products/gulab-jamun.jpg":
      "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=800&q=80",
    "/products/fresh-salad.jpg":
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  };
  const path = rawValue.startsWith("/") ? rawValue : `/${rawValue}`;
  const resolvedPath = localImageFallbacks[path] || path;
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${resolvedPath}`;
}
