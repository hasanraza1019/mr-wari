import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, Clock, ShoppingBag, Check, Star } from "lucide-react";
import { specialDeals } from "../data/content";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import SectionHeading from "./SectionHeading";

export default function SpecialDeals() {
  const { addItem, cart } = useCart();
  const { showToast } = useToast();
  const [addedIds, setAddedIds] = useState({});

  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddDeal = (deal) => {
    addItem(
      {
        id: deal.id,
        name: deal.name,
        price: Number(deal.price),
        image: deal.image,
      },
      1
    );

    setAddedIds((prev) => ({ ...prev, [deal.id]: true }));
    showToast(`${deal.name} cart mein add ho gaya!`);

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [deal.id]: false }));
    }, 2000);
  };

  return (
    <section id="deals" className="relative px-4 sm:px-6 lg:px-8 py-20 bg-bgPanel overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-ajrakRed/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* SECTION HEADER & TIMER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionHeading
              eyebrow="Limited Time Offers"
              title="Special Deals & Family Combos"
              description="Sab se zyada pasand kiye jane wale combos — bari bachat aur zabardast zaiqa."
            />
          </div>

          {/* Animated Countdown Timer */}
          <div className="glass-panel px-5 py-3 rounded-2xl border border-gold/40 flex items-center gap-3 self-start md:self-auto shadow-gold">
            <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center animate-pulse">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-poppins text-creamDim">
                Deal Khatam Hone Mein
              </p>
              <div className="font-anton text-lg text-gold tracking-widest">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* DEALS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {specialDeals.map((deal, index) => {
            const isAdded = addedIds[deal.id];
            const inCartLine = cart.find((l) => l.id === deal.id);

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative bg-bgPanel2/90 border border-line rounded-3xl overflow-hidden flex flex-col hover:border-gold/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
              >
                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-ajrakRed text-white text-[11px] font-poppins font-bold uppercase tracking-wider shadow-md">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{deal.badge}</span>
                </div>

                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-gold text-[#14110d] text-[11px] font-poppins font-black uppercase tracking-wider shadow-md">
                  {deal.discount}
                </div>

                {/* Deal Image */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-bg">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bgPanel2 via-transparent to-transparent opacity-90" />
                </div>

                {/* Deal Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-poppins font-semibold uppercase text-gold">
                      {deal.tag}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{deal.rating}</span>
                      <span className="text-creamDim">({deal.reviews})</span>
                    </div>
                  </div>

                  <h3 className="font-anton text-2xl text-cream tracking-wide group-hover:text-gold transition-colors">
                    {deal.name}
                  </h3>

                  <p className="text-creamDim text-xs sm:text-[13px] leading-relaxed mt-2.5 flex-1">
                    {deal.description}
                  </p>

                  {/* Price & Action */}
                  <div className="mt-6 pt-4 border-t border-line flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-xs line-through text-creamDim">
                        Rs. {deal.originalPrice}
                      </span>
                      <span className="font-anton text-2xl text-gold-gradient">
                        Rs. {deal.price}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddDeal(deal)}
                      className={`px-5 py-3 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                        isAdded
                          ? "bg-green-600 text-white"
                          : "btn-gold"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>{inCartLine ? `In Cart (${inCartLine.qty})` : "Add Deal"}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
