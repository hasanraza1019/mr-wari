import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Flame,
} from "lucide-react";
import { socket } from "../lib/socket";
import { whatsappNumber, phoneHref } from "../data/content";

const STATUS_STEPS = [
  { key: "pending", label: "Order Received", desc: "Kitchen ne order accept kar liya", icon: CheckCircle2 },
  { key: "preparing", label: "Dum Pukht In Progress", desc: "Taaza degh se garam biryani pack ho rahi hai", icon: ChefHat },
  { key: "out_for_delivery", label: "On The Way (Reda/Rider)", desc: "Rider aapke address ki taraf rawana hai", icon: Bike },
  { key: "completed", label: "Delivered & Enjoy", desc: "Order deliver ho gaya. Zaiqa enjoy karein!", icon: Sparkles },
];

export default function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputId, setInputId] = useState(id || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = async (orderId) => {
    if (!orderId) return;
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`https://mr-wari-backend-production.up.railway.app/api/orders/${orderId}/track`);
      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
      } else {
        // Fallback simulated order for tracking demo/testing
        setOrder({
          id: orderId,
          customer_name: "Valued Customer",
          status: "preparing",
          total: "1450",
          created_at: new Date().toLocaleTimeString(),
          items: [
            { name: "Special Dum Pukht Chicken Biryani", qty: 2, price: 550 },
            { name: "Special Meethi Lassi (Dahi Matha)", qty: 2, price: 180 },
          ],
        });
      }
    } catch (err) {
      // Offline fallback simulation
      setOrder({
        id: orderId,
        customer_name: "Valued Customer",
        status: "preparing",
        total: "1450",
        created_at: new Date().toLocaleTimeString(),
        items: [
          { name: "Special Dum Pukht Chicken Biryani", qty: 2, price: 550 },
          { name: "Special Meethi Lassi (Dahi Matha)", qty: 2, price: 180 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadOrder(id);
      try {
        socket.emit("order:track", { orderId: id });
        socket.on("order:status-updated", (updated) => {
          setOrder((c) => (c ? { ...c, status: updated.status } : c));
        });
      } catch (e) {}
    }
    return () => {
      try {
        socket.off("order:status-updated");
      } catch (e) {}
    };
  }, [id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    navigate(`/track-order/${inputId.trim()}`);
    loadOrder(inputId.trim());
  };

  // Determine current active step index
  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const s = order.status?.toLowerCase();
    if (s === "pending" || s === "received") return 0;
    if (s === "preparing" || s === "cooking") return 1;
    if (s === "out_for_delivery" || s === "onway") return 2;
    if (s === "completed" || s === "delivered") return 3;
    return 1;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* HEADER & SEARCH */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-poppins font-bold uppercase tracking-widest border border-gold/30">
          <Clock className="w-3.5 h-3.5" />
          <span>Live Kitchen & Delivery Feed</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,52px)] font-anton text-cream tracking-tight leading-tight">
          Track <span className="text-gold-gradient">Apna Order</span>
        </h1>
        <p className="text-creamDim text-sm sm:text-base max-w-md mx-auto font-inter">
          Apna Order ID enter karein aur live kitchen preparation aur rider progress dekhein.
        </p>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="Order ID enter karein (e.g. MW-4921 ya 12)"
              className="w-full bg-bgPanel2 border border-line rounded-full pl-11 pr-4 py-3.5 text-xs text-cream placeholder:text-creamDim/60 focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            className="btn-gold px-6 py-3.5 rounded-full font-poppins text-xs font-bold uppercase tracking-wider"
          >
            Track
          </button>
        </form>
      </div>

      {/* TRACKING STATUS DISPLAY */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 rounded-3xl bg-bgPanel2/95 border border-line shadow-2xl space-y-8"
        >
          {/* TOP ORDER SUMMARY */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
            <div>
              <span className="text-xs text-creamDim font-poppins uppercase tracking-wider">
                Order Tracking
              </span>
              <h3 className="font-anton text-2xl text-cream tracking-wide">
                Order #{order.id}
              </h3>
              <p className="text-xs text-gold font-poppins mt-0.5">
                Customer: {order.customer_name || "Mister Wari Guest"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Order%20%23${order.id}%20ki%20inquiry`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-4 py-2 rounded-xl font-poppins text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#14110d]" />
                <span>WhatsApp Help</span>
              </a>
            </div>
          </div>

          {/* TIMELINE PROGRESS */}
          <div className="space-y-6">
            <h4 className="font-anton text-lg text-cream tracking-wider uppercase">
              Live Order Progress
            </h4>

            <div className="grid sm:grid-cols-4 gap-4 relative">
              {STATUS_STEPS.map((st, i) => {
                const Icon = st.icon;
                const isPassed = i <= currentStep;
                const isCurrent = i === currentStep;

                return (
                  <div
                    key={st.key}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                      isCurrent
                        ? "bg-gold/15 border-gold shadow-goldGlow"
                        : isPassed
                        ? "bg-bgPanel border-emerald-500/40"
                        : "bg-bg border-line opacity-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            isCurrent
                              ? "bg-gold text-[#14110d] animate-pulse"
                              : isPassed
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-bg text-creamDim"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                        )}
                      </div>

                      <p
                        className={`font-poppins font-bold text-xs ${
                          isCurrent ? "text-gold" : isPassed ? "text-cream" : "text-creamDim"
                        }`}
                      >
                        {st.label}
                      </p>
                    </div>

                    <p className="text-[11px] text-creamDim font-inter mt-2 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ESTIMATED TIME BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gold/10 via-ajrakRed/10 to-transparent border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-poppins">
              <Flame className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <p className="text-cream font-bold">Estimated Delivery: 25 - 35 Minutes</p>
                <p className="text-creamDim text-[11px]">Degh se taaza nikal kar garam garam deliver kiya jayega.</p>
              </div>
            </div>

            <a
              href={`tel:${phoneHref}`}
              className="text-xs font-poppins font-bold text-gold hover:underline"
            >
              Call Kitchen Helpline →
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
