import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function StickyCartBar() {
  const { itemCount, subtotal, isOpen, openCart } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && !isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="md:hidden fixed bottom-5 left-4 right-4 z-[80]"
        >
          <button
            onClick={openCart}
            className="w-full btn-gold rounded-2xl px-5 py-4 flex items-center justify-between shadow-[0_15px_35px_rgba(229,169,34,0.4)] border border-gold/50"
          >
            <div className="flex items-center gap-3 font-poppins font-bold text-xs uppercase tracking-wider text-[#14110d]">
              <div className="w-7 h-7 rounded-full bg-[#14110d] text-gold flex items-center justify-center font-extrabold text-xs">
                {itemCount}
              </div>
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                View Cart & Order
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-anton text-lg text-[#14110d]">Rs. {subtotal}</span>
              <ArrowRight className="w-4 h-4 text-[#14110d]" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
