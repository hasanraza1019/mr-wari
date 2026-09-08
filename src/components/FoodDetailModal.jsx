import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Star, ShoppingBag, Plus, Minus, Check, Sparkles, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function FoodDetailModal({ item, onClose }) {
  const { addItem, cart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [instruction, setInstruction] = useState("");
  const [added, setAdded] = useState(false);

  if (!item) return null;

  const handleAddToCart = () => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        notes: instruction,
      },
      qty
    );

    setAdded(true);
    showToast(`${qty}x ${item.name} cart mein shamil ho gaya!`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const spiceLevel = item.spice || (item.category === "biryani" ? 2 : 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-bgPanel border border-gold/40 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-cream hover:text-gold flex items-center justify-center border border-white/10 hover:border-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Image */}
          <div className="relative h-60 sm:h-72 w-full bg-bg overflow-hidden flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UtensilsCrossed className="w-14 h-14 text-gold/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bgPanel via-transparent to-black/30" />

            {/* Badges on image */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-gold text-[#14110d] font-poppins font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {item.tag || "Mister Wari Special"}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-amber-200 border border-white/10 text-xs font-poppins font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current text-gold" />
                {item.rating || 4.8}
              </span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-anton text-3xl text-cream tracking-wide">
                  {item.name}
                </h3>
                <p className="text-xs uppercase tracking-widest font-poppins text-gold font-semibold mt-1">
                  Category: {item.category || "Special"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-creamDim uppercase font-poppins">Price</p>
                <p className="font-anton text-2xl sm:text-3xl text-gold-gradient">
                  Rs. {Number(item.price)}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-creamDim text-sm leading-relaxed">
              {item.description ||
                "Taaza masalon aur desi ghee mein tayyar kiya gaya, authentic Hyderabad ka zaiqa."}
            </p>

            {/* Attributes / Spice & Quality */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-bgPanel2 border border-line flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-creamDim uppercase font-poppins">Spice Level</p>
                  <p className="text-xs font-bold text-cream font-poppins">
                    {spiceLevel === 0 ? "Mild (Sada)" : spiceLevel === 1 ? "Medium Spiced" : "Extra Spicy"}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-bgPanel2 border border-line flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-creamDim uppercase font-poppins">Quality</p>
                  <p className="text-xs font-bold text-cream font-poppins">100% Fresh & Taaza</p>
                </div>
              </div>
            </div>

            {/* Special Instructions Note */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-poppins text-creamDim mb-2">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. Kam mirch, extra raita, etc."
                className="w-full bg-bg border border-line rounded-xl px-4 py-2.5 text-sm text-cream placeholder:text-creamDim/50 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-5 border-t border-line bg-bgPanel2/60 flex items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-bg rounded-full px-3 py-1.5 border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full text-gold hover:bg-gold/20 flex items-center justify-center font-bold text-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-poppins font-bold text-sm text-cream min-w-[20px] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-7 h-7 rounded-full text-gold hover:bg-gold/20 flex items-center justify-center font-bold text-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                added ? "bg-green-600 text-white" : "btn-gold shadow-gold"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add — Rs. {Number(item.price) * qty}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}