import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Utensils,
  ShoppingBag as BagIcon,
  MapPin,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { whatsappNumber, branches } from "../data/content";

const FREE_DELIVERY_THRESHOLD = 1500;

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    increaseItem,
    decreaseItem,
    removeItem,
    subtotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  // Order mode: "delivery" | "takeaway" | "dinein"
  const [orderType, setOrderType] = useState("delivery");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.name || "Latifabad Branch");
  const [tableId, setTableId] = useState("");
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load tables if available
  useEffect(() => {
    if (!isOpen || orderType !== "dinein") return;

    async function loadTables() {
      try {
        const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/tables");
        if (response.ok) {
          const data = await response.json();
          setTables(data.tables || []);
        } else {
          // Fallback mock tables for dine-in
          setTables([
            { id: 1, table_number: "T-1", seats: 4 },
            { id: 2, table_number: "T-2", seats: 2 },
            { id: 3, table_number: "T-3", seats: 6 },
            { id: 4, table_number: "T-4 (Family)", seats: 8 },
          ]);
        }
      } catch (err) {
        setTables([
          { id: 1, table_number: "T-1", seats: 4 },
          { id: 2, table_number: "T-2", seats: 2 },
          { id: 3, table_number: "T-3", seats: 6 },
          { id: 4, table_number: "T-4 (Family)", seats: 8 },
        ]);
      }
    }

    loadTables();
  }, [isOpen, orderType]);

  const deliveryFee = orderType === "delivery" ? (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 120) : 0;
  const grandTotal = subtotal + deliveryFee;
  const freeDeliveryDiff = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      alert("Please apna naam likhein.");
      return;
    }

    if (orderType === "delivery" && !deliveryAddress.trim()) {
      alert("Please apna delivery address likhein.");
      return;
    }

    if (orderType === "dinein" && !tableId) {
      alert("Please table number select karein.");
      return;
    }

    try {
      setLoading(true);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#e5a922", "#a12330", "#ffffff"],
        });
      } catch (e) {}

      // Optional Backend order record creation
      let createdOrderId = `MW-${Date.now().toString().slice(-4)}`;
      try {
        const items = cart.map((line) => ({
          menuItemId: Number(line.id) || 1,
          quantity: Number(line.qty),
        }));

        const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: customerName.trim(),
            tableId: orderType === "dinein" ? Number(tableId) || 1 : null,
            items,
            notes: `Order Type: ${orderType.toUpperCase()} | Phone: ${customerPhone} | Address: ${deliveryAddress}`,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.order?.id) createdOrderId = data.order.id;
        }
      } catch (err) {
        console.warn("Backend order creation skipped, using WhatsApp direct:", err);
      }

      // Build WhatsApp message
      const itemsList = cart
        .map(
          (line) =>
            `• *${line.name}* x${line.qty} — Rs. ${line.qty * Number(line.price)}`
        )
        .join("\n");

      let detailsText = "";
      if (orderType === "delivery") {
        detailsText = `Order Type: Home Delivery (Reda)\nAddress: ${deliveryAddress}\nPhone: ${customerPhone || "N/A"}`;
      } else if (orderType === "takeaway") {
        detailsText = `Order Type: Self Takeaway\nBranch: ${selectedBranch}\nPhone: ${customerPhone || "N/A"}`;
      } else {
        detailsText = `Order Type: Dine-In\nTable: Table ${tableId}`;
      }

      const textMessage = encodeURIComponent(
        `NEW ORDER — MISTER WARI\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `Customer: ${customerName.trim()}\n` +
          `Order ID: #${createdOrderId}\n` +
          `${detailsText}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `ITEMS:\n` +
          `${itemsList}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `Subtotal: Rs. ${subtotal}\n` +
          (deliveryFee > 0 ? `Delivery: Rs. ${deliveryFee}\n` : `Delivery: FREE\n`) +
          `GRAND TOTAL: Rs. ${grandTotal}\n\n` +
          `Please confirm my order. Thank you!`
      );

      // Open WhatsApp
      window.open(
        `https://wa.me/${whatsappNumber}?text=${textMessage}`,
        "_blank",
        "noopener,noreferrer"
      );

      clearCart();
      closeCart();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Order WhatsApp par open ho raha hai...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
          />

          {/* DRAWER PANEL */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[460px] bg-bgPanel z-[95] border-l border-line shadow-2xl flex flex-col"
          >
            {/* DRAWER HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-line bg-bgPanel2/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-anton text-xl text-cream tracking-wide">
                    AAP KA ORDER
                  </h2>
                  <p className="text-[11px] text-creamDim font-poppins">
                    {cart.reduce((s, i) => s + i.qty, 0)} Items in Cart
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-bg border border-line text-creamDim hover:text-gold flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FREE DELIVERY PROGRESS BAR */}
            {cart.length > 0 && orderType === "delivery" && (
              <div className="px-6 py-3 bg-gold/10 border-b border-gold/20">
                <div className="flex justify-between items-center text-xs font-poppins mb-1.5">
                  <span className="text-gold font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    {freeDeliveryDiff === 0
                      ? "You have earned FREE Delivery!"
                      : `Add Rs. ${freeDeliveryDiff} more for FREE Delivery`}
                  </span>
                  <span className="text-creamDim font-bold">{Math.round(freeDeliveryProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeDeliveryProgress}%` }}
                    className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* CART ITEMS LIST */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16">
                  <div className="w-20 h-20 rounded-full bg-gold/10 text-gold flex items-center justify-center text-3xl">
                    🍲
                  </div>
                  <h3 className="font-anton text-2xl text-cream">Cart Khali Hai</h3>
                  <p className="text-creamDim text-xs max-w-xs leading-relaxed">
                    Hamara laziz menu dekhein aur apne pasandeeda items cart mein shamil karein.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate("/menu");
                    }}
                    className="mt-4 btn-gold px-6 py-3 rounded-full font-poppins text-xs uppercase tracking-wider font-bold"
                  >
                    Menu Dekhein
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((line) => (
                    <motion.div
                      layout
                      key={line.id}
                      className="p-3.5 rounded-2xl bg-bgPanel2 border border-line flex gap-3.5 items-center group hover:border-gold/40 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl bg-bg overflow-hidden flex-shrink-0 border border-line">
                        {line.image ? (
                          <img
                            src={line.image}
                            alt={line.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🍽️
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-poppins font-semibold text-sm text-cream truncate">
                            {line.name}
                          </p>
                          <button
                            onClick={() => removeItem(line.id)}
                            className="text-creamDim hover:text-red-400 p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-gold font-anton text-sm mt-0.5">
                          Rs. {Number(line.price) * line.qty}
                        </p>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2 bg-bg rounded-full px-2 py-0.5 border border-line">
                            <button
                              onClick={() => decreaseItem(line.id)}
                              className="w-5 h-5 text-gold hover:text-cream font-bold flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-poppins font-bold text-xs text-cream min-w-[14px] text-center">
                              {line.qty}
                            </span>
                            <button
                              onClick={() => increaseItem(line.id)}
                              className="w-5 h-5 text-gold hover:text-cream font-bold flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[11px] text-creamDim">
                            @ Rs. {Number(line.price)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* CHECKOUT SECTION */}
            {cart.length > 0 && (
              <div className="border-t border-line p-5 bg-bgPanel2/90 space-y-4">
                {/* ORDER TYPE SELECTOR */}
                <div>
                  <label className="block text-[11px] font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                    Select Order Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType("delivery")}
                      className={`py-2 px-2 rounded-xl font-poppins text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                        orderType === "delivery"
                          ? "bg-gold text-[#14110d] border-gold font-bold shadow-sm"
                          : "bg-bg border-line text-creamDim hover:text-cream"
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType("takeaway")}
                      className={`py-2 px-2 rounded-xl font-poppins text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                        orderType === "takeaway"
                          ? "bg-gold text-[#14110d] border-gold font-bold shadow-sm"
                          : "bg-bg border-line text-creamDim hover:text-cream"
                      }`}
                    >
                      <BagIcon className="w-4 h-4" />
                      <span>Takeaway</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType("dinein")}
                      className={`py-2 px-2 rounded-xl font-poppins text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                        orderType === "dinein"
                          ? "bg-gold text-[#14110d] border-gold font-bold shadow-sm"
                          : "bg-bg border-line text-creamDim hover:text-cream"
                      }`}
                    >
                      <Utensils className="w-4 h-4" />
                      <span>Dine-In</span>
                    </button>
                  </div>
                </div>

                {/* FORM INPUTS ACCORDING TO TYPE */}
                <div className="space-y-2.5">
                  {/* Customer Name */}
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Aapka Naam (Customer Name)*"
                      className="w-full bg-bg border border-line rounded-xl pl-10 pr-4 py-2.5 text-xs text-cream placeholder:text-creamDim/60 focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone Number (0300-0000000)*"
                      className="w-full bg-bg border border-line rounded-xl pl-10 pr-4 py-2.5 text-xs text-cream placeholder:text-creamDim/60 focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Delivery Address */}
                  {orderType === "delivery" && (
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gold" />
                      <textarea
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Complete Delivery Address in Hyderabad (Gali, Mohalla, Area)*"
                        className="w-full bg-bg border border-line rounded-xl pl-10 pr-4 py-2.5 text-xs text-cream placeholder:text-creamDim/60 focus:outline-none focus:border-gold"
                      />
                    </div>
                  )}

                  {/* Takeaway Branch Picker */}
                  {orderType === "takeaway" && (
                    <div>
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full bg-bg border border-line rounded-xl px-4 py-2.5 text-xs text-cream focus:outline-none focus:border-gold"
                      >
                        {branches.map((b) => (
                          <option key={b.name} value={b.name}>
                            Pickup Branch: {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Dine-in Table Picker */}
                  {orderType === "dinein" && (
                    <div>
                      <select
                        value={tableId}
                        onChange={(e) => setTableId(e.target.value)}
                        className="w-full bg-bg border border-line rounded-xl px-4 py-2.5 text-xs text-cream focus:outline-none focus:border-gold"
                      >
                        <option value="">-- Select Table Number --</option>
                        {tables.map((t) => (
                          <option key={t.id} value={t.table_number}>
                            Table {t.table_number} ({t.seats} seats)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* BILL BREAKDOWN */}
                <div className="pt-2 border-t border-line space-y-1.5 text-xs font-poppins">
                  <div className="flex justify-between text-creamDim">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>

                  {orderType === "delivery" && (
                    <div className="flex justify-between text-creamDim">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-bold text-cream pt-1 border-t border-line/60">
                    <span>Total Amount</span>
                    <span className="font-anton text-lg text-gold">Rs. {grandTotal}</span>
                  </div>
                </div>

                {/* CHECKOUT BUTTON */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full btn-gold py-3.5 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Order on WhatsApp (Rs. {grandTotal})</span>
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
