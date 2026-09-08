import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Flame,
  User,
  PhoneCall,
  Sparkles,
  ChevronRight,
  LogOut,
  ShieldAlert,
  Radio,
  Crown,
  UtensilsCrossed,
} from "lucide-react";
import { navLinks, liveStreamConfig, whatsappNumber } from "../data/content";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const { itemCount, openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check logged-in user
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-xl border-b border-line shadow-[0_10px_30px_rgba(0,0,0,0.4)] py-3"
          : "bg-bg/70 backdrop-blur-md border-b border-line/60 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-2 font-anton text-2xl md:text-3xl tracking-wider text-cream transition-transform duration-300 hover:scale-[1.02]"
          onClick={() => setOpen(false)}
        >
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-gold to-ajrakRed flex items-center justify-center shadow-gold transition-transform group-hover:rotate-6">
            <UtensilsCrossed className="w-4 h-4 md:w-5 md:h-5 text-[#14110d]" />
          </div>
          <span>
            MISTER<span className="text-gold-gradient">WARI</span>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `relative px-3.5 py-2 text-[13px] font-poppins font-semibold uppercase tracking-wider transition-all duration-200 rounded-full flex items-center gap-1.5 ${
                  isActive
                    ? "text-gold bg-gold/10 shadow-[0_0_15px_rgba(229,169,34,0.15)]"
                    : "text-creamDim hover:text-cream hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>
                  {link.to === "/live" && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full border border-gold/40"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart Trigger */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={openCart}
            aria-label="Open cart"
            className="relative p-2.5 rounded-full bg-bgPanel2/80 hover:bg-gold/20 text-cream hover:text-gold border border-line transition-colors flex items-center justify-center group"
          >
            <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gold to-yellow-400 text-[#14110d] font-poppins font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-gold animate-bounce"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Desktop User & Admin Account Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Admin Portal Quick Button (Shown ONLY to Admin users) */}
            {user?.role === "admin" && (
              <Link
                to="/admin-dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-ajrakRed/20 to-gold/20 border border-gold/40 text-gold hover:bg-gold hover:text-[#14110d] transition-all text-xs font-poppins font-bold uppercase tracking-wider shadow-sm animate-pulse"
                title="Restaurant Admin Dashboard"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-bgPanel2 border border-line hover:border-gold/50 transition-all text-xs font-poppins text-cream"
                >
                  <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-[10px]">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="font-semibold text-gold truncate max-w-[90px]">
                    {user.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-bgPanel2 border border-line text-creamDim hover:text-red-400 hover:border-red-400/40 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-poppins font-semibold uppercase tracking-wider text-cream hover:text-gold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-full border border-gold/60 text-gold hover:bg-gold hover:text-[#14110d] text-xs font-poppins font-semibold uppercase tracking-wider transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Book Table Button (Desktop) */}
          <Link
            to="/book-table"
            className="hidden lg:flex items-center gap-2 btn-gold px-5 py-2.5 rounded-full font-poppins font-bold text-xs uppercase tracking-wider shadow-gold"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#14110d]" />
            <span>Book Table</span>
          </Link>

          {/* Order Now Primary CTA (Desktop) */}
          <Link
            to="/menu"
            className="hidden md:inline-flex items-center gap-1.5 btn-gold px-5 py-2.5 rounded-full text-xs font-poppins uppercase tracking-wider"
          >
            <Flame className="w-3.5 h-3.5 text-[#14110d]" />
            <span>Order Now</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg bg-bgPanel2 border border-line text-cream text-xl"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="w-6 h-6 text-gold" /> : <MenuIcon className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-bg/98 backdrop-blur-2xl border-b border-line overflow-hidden"
          >
            <div className="px-5 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 pb-2">
                <Link
                  to="/menu"
                  onClick={() => setOpen(false)}
                  className="btn-gold py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-poppins tracking-wider"
                >
                  <Flame className="w-4 h-4" />
                  Order Food
                </Link>
                <Link
                  to="/book-table"
                  onClick={() => setOpen(false)}
                  className="bg-bgPanel2 border border-gold/50 text-gold py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-poppins font-semibold tracking-wider"
                >
                  Book Table
                </Link>
              </div>

              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={() => setOpen(false)}
                      end={link.to === "/"}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl font-poppins text-sm uppercase tracking-wider font-semibold transition-all ${
                          isActive
                            ? "bg-gold/15 text-gold border border-gold/30"
                            : "text-creamDim hover:text-cream hover:bg-white/5"
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        {link.label}
                        {link.to === "/live" && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] uppercase font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            Live
                          </span>
                        )}
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </NavLink>
                  </li>
                ))}
                <li>
                  <Link
                    to="/track-order"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl font-poppins text-sm uppercase tracking-wider font-semibold text-creamDim hover:text-cream hover:bg-white/5"
                  >
                    <span>Track Order</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                </li>
              </ul>

              {/* Mobile User Section */}
              <div className="pt-3 border-t border-line">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-bgPanel2 border border-line">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-cream">{user.name}</p>
                          <p className="text-xs text-creamDim">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setOpen(false)}
                        className="text-xs text-gold font-poppins font-semibold underline"
                      >
                        Account
                      </Link>
                    </div>

                    {user.role === "admin" && (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-poppins font-bold uppercase tracking-wider animate-pulse"
                      >
                        <Crown className="w-4 h-4 text-gold" />
                        <span>Master Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-poppins font-semibold uppercase tracking-wider"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="py-3 rounded-xl bg-bgPanel2 border border-line text-center text-xs font-poppins font-semibold uppercase tracking-wider text-cream hover:border-gold"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setOpen(false)}
                        className="py-3 rounded-xl border border-gold text-gold text-center text-xs font-poppins font-semibold uppercase tracking-wider hover:bg-gold hover:text-[#14110d]"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
