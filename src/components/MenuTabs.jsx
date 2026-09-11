import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  UtensilsCrossed,
  Flame,
  Sparkles,
  Filter,
  Check,
  Soup,
  Sandwich,
  Coffee,
  IceCreamBowl,
  Salad,
} from "lucide-react";
import MenuItemCard from "./MenuItemCard";
import { allMenuItems } from "../data/content";
import { resolveAssetUrl } from "../config";

const API_URL = "https://mr-wari-backend-production.up.railway.app/api/products";

const categories = [
  { id: "all", label: "Sab Kuch", icon: UtensilsCrossed },
  { id: "rice", label: "Biryani & Pulao", icon: Soup },
  { id: "biryani", label: "Biryani Special", icon: Flame },
  { id: "chaat", label: "Chatpata Street", icon: Salad },
  { id: "fast", label: "Fast Food & Burgers", icon: Sandwich },
  { id: "drinks", label: "Drinks & Lassi", icon: Coffee },
  { id: "desserts", label: "Desserts & Meetha", icon: IceCreamBowl },
];

function formatCategory(category = "") {
  return category
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .trim();
}

export default function MenuTabs({ showSearch = true, defaultCategory = "all" }) {
  const [products, setProducts] = useState([]);
  const [activeId, setActiveId] = useState(defaultCategory);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceSort, setPriceSort] = useState("default"); // default, low-to-high, high-to-low

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok && data.products && data.products.length > 0) {
          const formattedProducts = data.products
            .filter((p) => p.is_available)
            .map((product) => ({
              id: product.id,
              name: product.name,
              tag: product.description || product.name,
              description: product.description || "",
              price: Number(product.price),
              category: formatCategory(product.category),
              image: resolveAssetUrl(product.image_url || ""),
              rating: 4.8,
              reviewCount: 120,
              isPopular: true,
              isNew: false,
              spice: 2,
            }));
          setProducts(formattedProducts);
        } else {
          // Graceful fallback to rich local content
          setProducts(allMenuItems);
        }
      } catch (err) {
        console.warn("Backend API unavailable, using offline menu items:", err.message);
        // Fallback to local data so UI never breaks
        setProducts(allMenuItems);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredItems = useMemo(() => {
    let source = products;

    if (activeId !== "all") {
      source = products.filter(
        (item) =>
          item.categoryId === activeId ||
          item.category === activeId ||
          item.category?.includes(activeId) ||
          item.name.toLowerCase().includes(activeId)
      );
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      source = source.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.tag && item.tag.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
      );
    }

    if (priceSort === "low-to-high") {
      source = [...source].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (priceSort === "high-to-low") {
      source = [...source].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return source;
  }, [products, activeId, query, priceSort]);

  return (
    <div className="space-y-8">
      {/* SEARCH AND FILTER BAR */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes... (e.g. Biryani, Gol Gappay, Mango Lassi, Zinger)"
              className="w-full bg-bgPanel2 border border-line rounded-full pl-11 pr-10 py-3.5 text-sm text-cream placeholder:text-creamDim/60 focus:outline-none focus:border-gold transition-all shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-creamDim hover:text-gold"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price Sorting Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="bg-bgPanel2 border border-line rounded-full px-4 py-3 text-xs font-poppins font-semibold text-cream focus:outline-none focus:border-gold transition-colors"
            >
              <option value="default">Sort by: Default</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      {/* CATEGORY PILLS SLIDER */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none select-none">
        {categories.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveId(cat.id)}
              className={`relative px-5 py-3 rounded-full font-poppins text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? "text-[#14110d] font-bold shadow-gold"
                  : "text-creamDim bg-bgPanel2 border border-line hover:text-cream hover:border-gold/40"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-full btn-gold"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center">
                {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
              </span>
              <span className="relative z-10">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* ITEMS COUNT & STATUS */}
      <div className="flex items-center justify-between text-xs text-creamDim font-poppins">
        <span className="flex items-center gap-1.5">
          <UtensilsCrossed className="w-3.5 h-3.5 text-gold" />
          <span>Showing <strong className="text-gold">{filteredItems.length}</strong> items</span>
        </span>
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-gold hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* LOADING SKELETONS */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-80 rounded-3xl bg-bgPanel2 border border-line overflow-hidden p-4 space-y-4 skeleton-shimmer"
            >
              <div className="h-44 rounded-2xl bg-white/5" />
              <div className="h-5 w-3/4 rounded bg-white/5" />
              <div className="h-4 w-1/2 rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-line/60 p-8">
          <Search className="w-12 h-12 text-gold mx-auto mb-3" />
          <h3 className="font-anton text-2xl text-cream">Koi Item Nahi Mila</h3>
          <p className="text-creamDim text-sm mt-2 max-w-sm mx-auto">
            Aap ka search query "{query}" kisi dish se match nahi hua. Dusra keyword search karein.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setActiveId("all");
            }}
            className="mt-6 btn-gold px-6 py-2.5 rounded-full font-poppins text-xs font-bold uppercase tracking-wider"
          >
            Show All Menu
          </button>
        </div>
      ) : (
        /* PRODUCTS GRID WITH STAGGER ANIMATION */
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
