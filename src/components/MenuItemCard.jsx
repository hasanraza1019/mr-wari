import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, Eye, Flame, Star, UtensilsCrossed } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import RatingStars from "./RatingStars";
import FoodDetailModal from "./FoodDetailModal";

export default function MenuItemCard({ item }) {
  const { cart, addItem, increaseItem, decreaseItem } = useCart();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  const line = cart.find((l) => l.id === item.id);
  const qtyInCart = line ? line.qty : 0;

  const handleAdd = (e) => {
    e?.stopPropagation();
    addItem(
      {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.image || "",
      },
      1
    );

    showToast(`${item.name} cart mein shamil ho gaya`);
  };

  const isBiryani = item.category?.includes("rice") || item.category?.includes("biryani") || item.name?.toLowerCase().includes("biryani");
  const isSpecial = item.isPopular || item.price > 400;

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        onClick={() => setShowModal(true)}
        className="group relative bg-bgPanel2/95 border border-line rounded-3xl overflow-hidden flex flex-col hover:border-gold/60 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] cursor-pointer"
      >
        {/* BADGES ON IMAGE */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {isSpecial && (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-gold to-yellow-400 text-[#14110d] font-poppins font-black text-[10px] uppercase tracking-wider shadow-md">
              Bestseller
            </span>
          )}
          {isBiryani && (
            <span className="px-2.5 py-1 rounded-full bg-ajrakRed/90 text-white font-poppins font-bold text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Dum Pukht
            </span>
          )}
        </div>

        {/* Quick View Button on Image Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-cream hover:text-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-md border border-white/10"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <div className="relative h-48 sm:h-52 bg-bg overflow-hidden flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-gold/40 group-hover:scale-110 transition-transform" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bgPanel2/90 via-transparent to-transparent opacity-80" />
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-1">
          {/* Tag / Category */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gold font-poppins font-semibold uppercase tracking-wider truncate">
              {item.tag || item.category || "Mister Wari"}
            </span>
            <div className="flex items-center gap-1 text-amber-300 font-semibold text-xs">
              <Star className="w-3.5 h-3.5 fill-current text-gold" />
              <span>{item.rating || 4.8}</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-anton text-xl text-cream tracking-wide group-hover:text-gold transition-colors leading-tight">
            {item.name}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-creamDim text-xs mt-2 line-clamp-2 leading-relaxed flex-1">
              {item.description}
            </p>
          )}

          {/* Bottom Row */}
          <div className="mt-4 pt-4 border-t border-line/70 flex items-center justify-between gap-3">
            {/* Price */}
            <div>
              <span className="text-[10px] text-creamDim uppercase font-poppins block leading-none">Price</span>
              <span className="font-anton text-xl text-gold-gradient">
                Rs. {Number(item.price).toFixed(0)}
              </span>
            </div>

            {/* Cart Controls */}
            {qtyInCart === 0 ? (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleAdd}
                className="btn-gold px-4 py-2.5 rounded-full font-poppins font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#14110d]" />
                <span>Add</span>
              </motion.button>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2.5 bg-bg rounded-full px-2.5 py-1 border border-gold/40 shadow-inner"
              >
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => decreaseItem(item.id)}
                  aria-label="Decrease quantity"
                  className="w-6 h-6 rounded-full bg-bgPanel2 text-gold hover:bg-gold hover:text-[#14110d] flex items-center justify-center font-bold text-sm transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </motion.button>

                <span className="font-poppins font-bold text-xs text-cream min-w-[16px] text-center">
                  {qtyInCart}
                </span>

                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => increaseItem(item.id)}
                  aria-label="Increase quantity"
                  className="w-6 h-6 rounded-full bg-bgPanel2 text-gold hover:bg-gold hover:text-[#14110d] flex items-center justify-center font-bold text-sm transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* QUICK VIEW POPUP MODAL */}
      {showModal && (
        <FoodDetailModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}