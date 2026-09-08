import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import BookTable from "./pages/BookTable";
import TrackOrder from "./pages/TrackOrder";
import Live from "./pages/Live";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Terms from "./pages/Terms";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  // Continuously save scroll position for this page
  useEffect(() => {
    function saveScroll() {
      sessionStorage.setItem(`scroll:${pathname}`, String(window.scrollY));
    }

    window.addEventListener("scroll", saveScroll, { passive: true });
    window.addEventListener("beforeunload", saveScroll);

    return () => {
      saveScroll();
      window.removeEventListener("scroll", saveScroll);
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const navEntries = performance.getEntriesByType("navigation");
      const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

      if (isReload) {
        const saved = sessionStorage.getItem(`scroll:${pathname}`);
        if (saved !== null) {
          requestAnimationFrame(() => {
            window.scrollTo(0, Number(saved));
          });
        }
      }
      return;
    }

    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <ScrollManager />
        <Routes>
          {/* =========================
              LOGIN / REGISTER
          ========================== */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          {/* =========================
              ADMIN DASHBOARD
          ========================== */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Old admin links redirect to the new dashboard */}
          <Route
            path="/admin-menu"
            element={<Navigate to="/admin-dashboard" replace />}
          />
          <Route
            path="/admin-orders"
            element={<Navigate to="/admin-dashboard" replace />}
          />
          {/* =========================
              PROTECTED ACCOUNT
          ========================== */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          {/* =========================
              MAIN WEBSITE
          ========================== */}
          <Route element={<Layout />}>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/menu"
              element={<Menu />}
            />
            <Route
              path="/book-table"
              element={<BookTable />}
            />
            <Route
              path="/track-order"
              element={<TrackOrder />}
            />
            <Route
              path="/track-order/:id"
              element={<TrackOrder />}
            />
            <Route
              path="/live"
              element={<Live />}
            />
            <Route
              path="/gallery"
              element={<Gallery />}
            />
            <Route
              path="/contact"
              element={<Contact />}
            />
            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />
            <Route
              path="/refund-policy"
              element={<RefundPolicy />}
            />
            <Route
              path="/terms"
              element={<Terms />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Route>
        </Routes>
      </ToastProvider>
    </CartProvider>
  );
}
export default App;
