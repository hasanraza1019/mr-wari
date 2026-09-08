import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ArrowRight,
  Package,
  MapPin,
  Tag,
  Gift,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Flame,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const DEMO_ORDERS = [
  {
    id: "MW-8821",
    date: "Today, 02:45 PM",
    items: [
      { name: "Special Dum Pukht Chicken Biryani", qty: 2, price: 550 },
      { name: "Raita & Fresh Mint Chutney", qty: 2, price: 60 },
    ],
    total: 1220,
    status: "Preparing",
    type: "Delivery",
    address: "House 14-B, Latifabad Unit 7, Hyderabad",
  },
  {
    id: "MW-7934",
    date: "Yesterday, 08:15 PM",
    items: [
      { name: "Mutton Dawat Deg Pulao", qty: 1, price: 850 },
      { name: "Kheer Thali", qty: 1, price: 180 },
    ],
    total: 1030,
    status: "Delivered",
    type: "Takeaway",
    address: "Qasimabad Branch Pickup",
  },
];

const SAVED_ADDRESSES = [
  {
    id: 1,
    title: "Home",
    address: "House 14-B, Street 5, Latifabad Unit 7, Hyderabad",
    isDefault: true,
  },
  {
    id: 2,
    title: "Office / Workplace",
    address: "Office #302, Royal Plaza, Qasimabad Main Road, Hyderabad",
    isDefault: false,
  },
];

const COUPONS = [
  { code: "WARI2026", discount: "10% OFF", desc: "Applicable on orders above Rs. 1,000" },
  { code: "FREESHIP", discount: "FREE DELIVERY", desc: "Valid on all Hyderabad deliveries above Rs. 1,500" },
];

export default function Account() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // orders | addresses | rewards

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    fetch("https://mr-wari-backend-production.up.railway.app/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch((err) => {
        console.warn("Using offline user cache:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-cream flex items-center justify-center">
        <p className="text-gold font-poppins animate-pulse">Loading profile...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg text-cream px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* HEADER / PROFILE BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-bgPanel2/95 border border-line shadow-2xl relative overflow-hidden">
          {/* Subtle Ajrak background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-ajrakRed/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gold to-yellow-500 text-[#14110d] font-anton text-2xl sm:text-3xl flex items-center justify-center shadow-gold">
                {user.name?.charAt(0)?.toUpperCase() || "M"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-anton text-2xl sm:text-3xl text-cream tracking-wide">
                    {user.name}
                  </h1>
                  {user.role === "admin" ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-poppins font-bold uppercase tracking-wider border border-gold/40 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      Master Admin
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-poppins font-bold uppercase tracking-wider border border-yellow-500/40 flex items-center gap-1.5">
                      <Star className="w-3 h-3" />
                      VIP Member
                    </span>
                  )}
                </div>

                <p className="text-xs text-creamDim font-poppins mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gold" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="hidden sm:flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gold" />
                      {user.phone}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Logout and Action */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {user.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  className="btn-gold flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold"
                >
                  <ShieldAlert className="w-4 h-4 text-[#14110d]" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-bg border border-red-500/40 hover:bg-red-500 hover:text-white text-red-300 font-poppins text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* LOYALTY SUMMARY BAR */}
          {user.role !== "admin" && (
            <div className="mt-6 pt-6 border-t border-line grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-bg border border-line">
                <p className="text-[10px] uppercase tracking-wider text-creamDim font-poppins">
                  Loyalty Points
                </p>
                <p className="text-lg font-anton text-gold mt-0.5">
                  {user.points || 450} <span className="text-xs font-poppins text-creamDim">Pts (Rs. {user.points || 450})</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-bg border border-line">
                <p className="text-[10px] uppercase tracking-wider text-creamDim font-poppins">
                  Club Tier
                </p>
                <p className="text-sm font-bold text-cream font-poppins mt-0.5">
                  Royal Gold Foodie
                </p>
              </div>

              <div className="hidden sm:block p-3.5 rounded-2xl bg-bg border border-line">
                <p className="text-[10px] uppercase tracking-wider text-creamDim font-poppins">
                  Total Orders Placed
                </p>
                <p className="text-lg font-anton text-cream mt-0.5">8 Orders</p>
              </div>
            </div>
          )}
        </div>

        {/* ADMIN SWITCH BANNER (IF ADMIN) */}
        {user.role === "admin" && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-ajrakRed/20 via-gold/15 to-bgPanel2 border border-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-gold text-[#14110d] flex items-center justify-center font-bold">
                👑
              </div>
              <div>
                <p className="font-anton text-lg text-cream tracking-wide">
                  Master Restaurant Control Center
                </p>
                <p className="text-xs text-creamDim font-poppins">
                  You have full admin access to live orders, menu items, table seating, inventory, analytics & settings.
                </p>
              </div>
            </div>

            <Link
              to="/admin-dashboard"
              className="btn-gold px-6 py-3 rounded-full font-poppins text-xs font-bold uppercase tracking-wider shadow-gold flex items-center gap-2 whitespace-nowrap"
            >
              <span>Go to Admin Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* CUSTOMER TABS */}
        <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-poppins font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-gold text-[#14110d] shadow-gold"
                : "bg-bgPanel2 text-creamDim hover:text-cream border border-line"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-poppins font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "addresses"
                ? "bg-gold text-[#14110d] shadow-gold"
                : "bg-bgPanel2 text-creamDim hover:text-cream border border-line"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab("rewards")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-poppins font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "rewards"
                ? "bg-gold text-[#14110d] shadow-gold"
                : "bg-bgPanel2 text-creamDim hover:text-cream border border-line"
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>VIP Rewards & Coupons</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div>
          {/* TAB 1: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-anton text-xl text-cream tracking-wide">
                  RECENT FOOD ORDERS
                </h3>
                <Link
                  to="/menu"
                  className="text-xs text-gold font-poppins font-semibold hover:underline flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Order More Food</span>
                </Link>
              </div>

              <div className="space-y-4">
                {DEMO_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-3xl bg-bgPanel2/90 border border-line hover:border-gold/30 transition-all space-y-4 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-line">
                      <div className="flex items-center gap-3">
                        <span className="font-anton text-lg text-gold tracking-wide">
                          #{order.id}
                        </span>
                        <span className="text-xs text-creamDim font-poppins">
                          • {order.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider flex items-center gap-1 ${
                            order.status === "Preparing"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 animate-pulse"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          }`}
                        >
                          {order.status === "Preparing" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {order.status}
                        </span>

                        <span className="px-2.5 py-1 rounded-full bg-bg border border-line text-[10px] font-poppins font-semibold text-creamDim uppercase">
                          {order.type}
                        </span>
                      </div>
                    </div>

                    {/* ITEMS LIST */}
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-poppins text-creamDim">
                          <span>
                            {item.qty}x <strong className="text-cream">{item.name}</strong>
                          </span>
                          <span className="text-gold font-semibold">
                            Rs. {item.price * item.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] text-creamDim font-poppins uppercase">
                          Delivery Destination
                        </p>
                        <p className="text-xs text-cream font-poppins">{order.address}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[10px] text-creamDim font-poppins uppercase">
                            Grand Total
                          </p>
                          <p className="text-base font-anton text-gold">Rs. {order.total}</p>
                        </div>

                        <Link
                          to="/track-order"
                          className="btn-gold px-4 py-2 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider shadow-gold flex items-center gap-1"
                        >
                          <span>Track</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-4">
              <h3 className="font-anton text-xl text-cream tracking-wide">
                SAVED DELIVERY LOCATIONS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAVED_ADDRESSES.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-3xl bg-bgPanel2/90 border border-line hover:border-gold/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold" />
                        <h4 className="font-poppins font-bold text-cream text-sm">
                          {addr.title}
                        </h4>
                      </div>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-poppins font-bold uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-creamDim font-inter leading-relaxed">
                      {addr.address}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REWARDS & COUPONS */}
          {activeTab === "rewards" && (
            <div className="space-y-4">
              <h3 className="font-anton text-xl text-cream tracking-wide">
                AVAILABLE PROMO COUPONS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COUPONS.map((cpn) => (
                  <div
                    key={cpn.code}
                    className="p-5 rounded-3xl bg-gradient-to-br from-bgPanel2 via-gold/5 to-bgPanel2 border border-gold/30 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-gold text-[#14110d] font-anton text-sm tracking-wider shadow-sm">
                        {cpn.code}
                      </span>
                      <span className="text-xs font-anton text-gold tracking-wide">
                        {cpn.discount}
                      </span>
                    </div>

                    <p className="text-xs text-creamDim font-poppins">{cpn.desc}</p>

                    <div className="pt-2">
                      <Link
                        to="/menu"
                        className="text-xs text-gold hover:underline font-poppins font-bold flex items-center gap-1"
                      >
                        <span>Apply Coupon & Order</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


