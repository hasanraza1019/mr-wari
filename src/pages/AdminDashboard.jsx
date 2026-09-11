import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  CalendarDays,
  Star,
  Boxes,
  Users,
  BarChart3,
  MessageSquareText,
  Settings,
  BellRing,
  ShieldCheck,
} from "lucide-react";
import { socket } from "../lib/socket";
import { getProductImage } from "../config";

const SIDEBAR_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "orders", label: "Orders", icon: Package },
  { key: "reservations", label: "Reservations", icon: CalendarDays },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "customers", label: "Customers", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "chat", label: "Chat", icon: MessageSquareText },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const clearExpiredSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("adminActiveTab") || "dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderToasts, setOrderToasts] = useState([]);

  function changeTab(key) {
    setActiveTab(key);
    localStorage.setItem("adminActiveTab", key);
  }

  function playNotificationSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;

      [880, 1175].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.15 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.3);
      });
    } catch (err) {
      console.error("Sound error:", err);
    }
  }

  // ==========================================
  // PRODUCTS STATE
  // ==========================================

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    is_available: true,
  });

  // ==========================================
  // ORDERS STATE
  // ==========================================

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  async function loadProducts() {
    try {
      setProductsLoading(true);
      setProductsError("");

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Products load nahi ho sake.");
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error("Load products error:", err);
      setProductsError(err.message || "Products load nahi ho sake.");
    } finally {
      setProductsLoading(false);
    }
  }

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  async function loadOrders() {
    try {
      setOrdersLoading(true);
      setOrdersError("");

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/orders");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Orders load nahi ho sake.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Load orders error:", err);
      setOrdersError(err.message || "Orders load nahi ho sake.");
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // ==========================================
  // REAL-TIME NEW ORDER NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    socket.emit("admin:join");

    function handleNewOrder(order) {
      setOrders((current) => [order, ...current]);
      playNotificationSound();

      const toastId = Date.now() + Math.random();
      setOrderToasts((current) => [...current, { id: toastId, order }]);

      setTimeout(() => {
        setOrderToasts((current) => current.filter((t) => t.id !== toastId));
      }, 7000);
    }

    socket.on("order:new", handleNewOrder);

    return () => {
      socket.off("order:new", handleNewOrder);
    };
  }, []);

  // ==========================================
  // PRODUCT FORM HANDLERS
  // ==========================================

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((current) => {
      const next = {
        ...current,
        [name]: type === "checkbox" ? checked : value,
      };

      if ((name === "name" || name === "category") && !current.image_url.trim()) {
        next.image_url = getProductImage(
          name === "name" ? value : current.name,
          name === "category" ? value : current.category
        );
      }

      return next;
    });
  }

  function resetForm() {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      is_available: true,
    });

    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Food name likhein.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      alert("Valid price likhein.");
      return;
    }

    if (!form.category.trim()) {
      alert("Category likhein.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `https://mr-wari-backend-production.up.railway.app/api/products/${editingId}`
        : "https://mr-wari-backend-production.up.railway.app/api/products";

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category.trim(),
          image_url: form.image_url.trim() || getProductImage(form.name, form.category),
          is_available: form.is_available,
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend se valid JSON response nahi mila. Server check karein.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Product save nahi hua.");
      }

      if (editingId) {
        setProducts((current) =>
          current.map((product) => (product.id === editingId ? data.product : product))
        );
        alert("✅ Food successfully update ho gaya.");
      } else {
        setProducts((current) => [data.product, ...current]);
        alert("✅ New food successfully add ho gaya.");
      }

      resetForm();
    } catch (err) {
      console.error("Save product error:", err);
      alert(err.message || "Product save nahi hua.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image_url: product.image_url || "",
      is_available: product.is_available,
    });

    changeTab("menu");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const confirmed = window.confirm(`Kya aap "${product.name}" delete karna chahte hain?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`https://mr-wari-backend-production.up.railway.app/api/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend se valid JSON response nahi mila.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Product delete nahi hua.");
      }

      setProducts((current) => current.filter((item) => item.id !== id));

      if (editingId === id) {
        resetForm();
      }

      alert("🗑️ Food delete ho gaya.");
    } catch (err) {
      console.error("Delete product error:", err);
      alert(err.message || "Product delete nahi hua.");
    }
  }

  async function toggleAvailability(product) {
    try {
      const response = await fetch(`https://mr-wari-backend-production.up.railway.app/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ is_available: !product.is_available }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend se valid JSON response nahi mila.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Availability update nahi hui.");
      }

      setProducts((current) =>
        current.map((item) => (item.id === product.id ? data.product : item))
      );
    } catch (err) {
      console.error("Availability error:", err);
      alert(err.message || "Availability update nahi hui.");
    }
  }

  // ==========================================
  // ORDER STATUS UPDATE
  // ==========================================

  async function updateStatus(id, status) {
    try {
      const response = await fetch(`https://mr-wari-backend-production.up.railway.app/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update nahi hua.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, status: data.order.status } : order
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  // ==========================================
  // STATS
  // ==========================================

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const preparing = orders.filter((o) => o.status === "preparing").length;
    const completed = orders.filter((o) => o.status === "completed").length;

    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((total, o) => total + Number(o.total_amount || 0), 0);

    return {
      totalOrders: orders.length,
      pending,
      preparing,
      completed,
      revenue,
      totalProducts: products.length,
      availableProducts: products.filter((p) => p.is_available).length,
    };
  }, [orders, products]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-bg text-cream flex font-poppins">

      {/* ============ NEW ORDER TOASTS ============ */}
      <div className="fixed top-5 right-5 z-[60] space-y-3 w-[90vw] max-w-sm">
        {orderToasts.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              changeTab("orders");
              setOrderToasts((current) => current.filter((x) => x.id !== t.id));
            }}
            className="w-full text-left bg-bgPanel border border-gold rounded-xl p-4 shadow-2xl animate-pulse-once"
          >
            <p className="text-gold font-bold text-sm flex items-center gap-2"><BellRing className="w-4 h-4" />Naya Order Aaya!</p>
            <p className="text-cream text-sm mt-1">
              {t.order.customer_name} — Table {t.order.table_number}
            </p>
            <p className="text-gold font-bold mt-1">
              Rs. {Number(t.order.total_amount).toFixed(0)}
            </p>
          </button>
        ))}
      </div>

      {/* ============ MOBILE OVERLAY ============ */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* ============ SIDEBAR ============ */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-bgPanel border-r border-line z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-line">
          <p className="font-anton text-xl tracking-wide text-cream">
            MISTERWARI
          </p>
          <p className="text-gold text-[11px] uppercase tracking-widest font-semibold mt-1">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                changeTab(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide border-l-4 transition-colors ${
                activeTab === item.key
                  ? "border-gold bg-bgPanel2 text-gold"
                  : "border-transparent text-creamDim hover:text-gold hover:bg-bgPanel2/60"
              }`}
            >
              <span className="text-base flex items-center justify-center">
                <item.icon className="w-4 h-4" />
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.soon && (
                <span className="text-[9px] normal-case tracking-normal font-medium text-creamDim border border-line rounded px-1.5 py-0.5">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gold text-[#1A1108] font-bold flex items-center justify-center">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-creamDim truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-2 text-left px-2 py-2 text-sm text-creamDim hover:text-gold transition-colors"
          >
            ← Back to Website
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-1 border border-ajrakRed text-cream px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-ajrakRed transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 md:ml-64">

        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-line px-5 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-2xl text-cream"
              aria-label="Open sidebar"
            >
              ☰
            </button>

            <h1 className="text-lg md:text-2xl font-bold capitalize">
              {SIDEBAR_ITEMS.find((i) => i.key === activeTab)?.label}
            </h1>
          </div>

          <p className="hidden sm:block text-sm text-creamDim">
            Hi, <span className="text-gold font-semibold">{user?.name}</span>
          </p>
        </header>

        <div className="px-5 md:px-8 py-8">

          {/* ============ DASHBOARD TAB ============ */}
          {activeTab === "dashboard" && (
            <DashboardOverview
              stats={stats}
              recentOrders={recentOrders}
              ordersLoading={ordersLoading}
              onGoToMenu={() => changeTab("menu")}
              onGoToOrders={() => changeTab("orders")}
            />
          )}

          {/* ============ MENU TAB ============ */}
          {activeTab === "menu" && (
            <MenuSection
              products={products}
              loading={productsLoading}
              error={productsError}
              onRetry={loadProducts}
              form={form}
              editingId={editingId}
              saving={saving}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancelEdit={resetForm}
              onEdit={startEdit}
              onDelete={deleteProduct}
              onToggle={toggleAvailability}
            />
          )}

          {/* ============ ORDERS TAB ============ */}
          {activeTab === "orders" && (
            <OrdersSection
              orders={orders}
              loading={ordersLoading}
              error={ordersError}
              onRetry={loadOrders}
              onUpdateStatus={updateStatus}
            />
          )}

          {/* ============ CHAT TAB ============ */}
          {activeTab === "chat" && <ChatSection />}

          {/* ============ RESERVATIONS TAB ============ */}
          {activeTab === "reservations" && <ReservationsSection token={token} />}

          {/* ============ REVIEWS TAB ============ */}
          {activeTab === "reviews" && <ReviewsSection token={token} />}

          {/* ============ INVENTORY TAB ============ */}
          {activeTab === "inventory" && <InventorySection token={token} />}

          {/* ============ CUSTOMERS TAB ============ */}
          {activeTab === "customers" && <CustomersSection />}

          {/* ============ ANALYTICS TAB ============ */}
          {activeTab === "analytics" && (
            <AnalyticsSection orders={orders} products={products} />
          )}

          {/* ============ SETTINGS TAB ============ */}
          {activeTab === "settings" && <SettingsSection />}

        </div>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD OVERVIEW
// ==========================================

function DashboardOverview({ stats, recentOrders, ordersLoading, onGoToMenu, onGoToOrders }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Pending" value={stats.pending} color="text-gold" />
        <StatCard label="Preparing" value={stats.preparing} color="text-blue-300" />
        <StatCard label="Completed" value={stats.completed} color="text-green-400" />
        <StatCard label="Revenue" value={`Rs. ${stats.revenue.toFixed(0)}`} color="text-gold" />
        <StatCard label="Menu Items" value={`${stats.availableProducts}/${stats.totalProducts}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <button
          onClick={onGoToMenu}
          className="bg-bgPanel border border-line rounded-xl p-6 text-left hover:border-gold transition-colors"
        >
          <UtensilsCrossed className="w-6 h-6 text-gold" />
          <p className="font-bold mt-2">Manage Menu</p>
          <p className="text-creamDim text-sm mt-1">Food add, edit, hide ya delete karein.</p>
        </button>

        <button
          onClick={onGoToOrders}
          className="bg-bgPanel border border-line rounded-xl p-6 text-left hover:border-gold transition-colors"
        >
          <Package className="w-6 h-6 text-gold" />
          <p className="font-bold mt-2">Manage Orders</p>
          <p className="text-creamDim text-sm mt-1">Order status update karein.</p>
        </button>
      </div>

      <div className="bg-bgPanel border border-line rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <button onClick={onGoToOrders} className="text-gold text-sm hover:underline">
            See All →
          </button>
        </div>

        {ordersLoading ? (
          <p className="text-creamDim text-sm">Loading...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-creamDim text-sm">Abhi koi order nahi hai.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-[#18100A] rounded-lg px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-sm">
                    Order #{order.id} — {order.customer_name}
                  </p>
                  <p className="text-xs text-creamDim mt-0.5">
                    Table {order.table_number || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs uppercase px-2.5 py-1 rounded border ${
                      order.status === "pending"
                        ? "border-gold text-gold"
                        : order.status === "preparing"
                        ? "border-blue-400 text-blue-300"
                        : order.status === "completed"
                        ? "border-green-400 text-green-300"
                        : "border-red-400 text-red-300"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="text-gold font-bold text-sm whitespace-nowrap">
                    Rs. {Number(order.total_amount).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-cream" }) {
  return (
    <div className="bg-bgPanel border border-line rounded-xl p-5">
      <p className="text-creamDim text-xs uppercase">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

// ==========================================
// MENU SECTION
// ==========================================

function MenuSection({
  products,
  loading,
  error,
  onRetry,
  form,
  editingId,
  saving,
  onChange,
  onSubmit,
  onCancelEdit,
  onEdit,
  onDelete,
  onToggle,
}) {
  if (loading) {
    return <p className="text-creamDim">Menu load ho raha hai...</p>;
  }

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-300 rounded-lg p-4">
          {error}
          <button onClick={onRetry} className="block mt-3 bg-gold text-black px-4 py-2 rounded">
            Retry
          </button>
        </div>
      )}

      <div className="bg-bgPanel border border-line rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{editingId ? "✏️ Edit Food" : "➕ Add New Food"}</h2>

          {editingId && (
            <button onClick={onCancelEdit} className="text-sm text-creamDim hover:text-gold">
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-creamDim mb-2">Food Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Chicken Tikka"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Price</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={onChange}
              placeholder="550"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              placeholder="BBQ"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Image URL</label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={onChange}
              placeholder="/products/chicken-tikka.jpg"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-creamDim mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows="3"
              placeholder="Food ki description..."
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={onChange}
              className="w-5 h-5"
            />
            <span className="text-sm">Food website par available hai</span>
          </label>

          <div className="md:text-right">
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto bg-gold text-[#1A1108] px-7 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Food" : "Add Food"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">Current Menu</h2>
        <span className="text-creamDim text-sm">{products.length} Items</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-creamDim">Abhi koi product nahi hai.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product) => (
            <div key={product.id} className="bg-bgPanel border border-line rounded-xl overflow-hidden">
              <div className="h-48 bg-[#18100A]">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-gold font-bold mt-1">Rs. {Number(product.price).toFixed(0)}</p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded border h-fit ${
                      product.is_available
                        ? "border-green-400 text-green-300"
                        : "border-red-400 text-red-300"
                    }`}
                  >
                    {product.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <p className="text-xs text-creamDim mt-2 uppercase">{product.category}</p>

                {product.description && (
                  <p className="text-sm text-creamDim mt-3">{product.description}</p>
                )}

                <div className="grid grid-cols-3 gap-2 mt-5">
                  <button
                    onClick={() => onEdit(product)}
                    className="border border-gold text-gold py-2 rounded-lg text-sm hover:bg-gold hover:text-[#1A1108]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onToggle(product)}
                    className="border border-line text-cream py-2 rounded-lg text-sm hover:border-gold"
                  >
                    {product.is_available ? "Hide" : "Show"}
                  </button>

                  <button
                    onClick={() => onDelete(product.id)}
                    className="border border-red-500/50 text-red-300 py-2 rounded-lg text-sm hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ORDERS SECTION
// ==========================================

function OrdersSection({ orders, loading, error, onRetry, onUpdateStatus }) {
  if (loading) {
    return <p className="text-creamDim">Orders load ho rahe hain...</p>;
  }

  if (error) {
    return (
      <div className="bg-bgPanel border border-red-500/30 rounded-xl p-8 text-center">
        <p className="text-red-300">{error}</p>
        <button onClick={onRetry} className="mt-5 bg-gold text-[#1A1108] px-5 py-2 rounded font-semibold">
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="text-center py-20 text-creamDim">Abhi koi order nahi hai.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
      {orders.map((order) => (
        <div key={order.id} className="bg-bgPanel border border-line rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-start gap-3 mb-5">
            <div>
              <p className="text-gold font-bold">Order #{order.id}</p>
              <h2 className="text-lg font-semibold mt-1">{order.customer_name}</h2>
              <p className="text-gold text-sm font-semibold mt-1">
                🍽️ Table {order.table_number || "Not Assigned"}
              </p>
              {order.created_at && (
                <p className="text-xs text-creamDim mt-1">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              )}
            </div>

            <span
              className={`text-xs uppercase px-2.5 py-1 rounded border ${
                order.status === "pending"
                  ? "border-gold text-gold"
                  : order.status === "preparing"
                  ? "border-blue-400 text-blue-300"
                  : order.status === "completed"
                  ? "border-green-400 text-green-300"
                  : "border-red-400 text-red-300"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="border-t border-line pt-4">
            <p className="text-xs uppercase tracking-wide text-creamDim mb-3">Ordered Items</p>

            <div className="space-y-3">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    key={`${order.id}-${item.menuItemId}-${index}`}
                    className="flex justify-between gap-3 bg-[#18100A] rounded-lg px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-cream font-semibold text-sm">{item.name}</p>
                      <p className="text-creamDim text-xs mt-1">
                        Rs. {Number(item.unitPrice).toFixed(0)} × {item.quantity}
                      </p>
                    </div>

                    <p className="text-gold font-semibold text-sm whitespace-nowrap">
                      Rs. {Number(item.subtotal).toFixed(0)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-creamDim text-sm">Items available nahi hain.</p>
              )}
            </div>
          </div>

          <div className="border-t border-line mt-4 pt-4 flex justify-between items-center">
            <span className="text-creamDim text-sm">Total Amount</span>
            <span className="text-2xl text-gold font-bold">
              Rs. {Number(order.total_amount).toFixed(0)}
            </span>
          </div>

          {order.notes && (
            <div className="mt-4 bg-[#18100A] border border-line rounded-lg p-3">
              <p className="text-xs text-creamDim uppercase mb-1">Customer Note</p>
              <p className="text-sm text-cream">{order.notes}</p>
            </div>
          )}

          <div className="mt-5">
            <label className="text-xs text-creamDim block mb-2">Update Order Status</label>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              className="w-full bg-[#18100A] border border-line rounded-lg px-3 py-2.5 text-cream outline-none focus:border-gold"
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// CHAT SECTION (ADMIN)
// ==========================================

function ChatSection() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);
  const activeConvIdRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    activeConvIdRef.current = activeConvId;
  }, [activeConvId]);

  async function loadConversations() {
    try {
      setLoading(true);

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Load conversations error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversations();
    socket.emit("admin:join");

    function handleConvUpdated(conv) {
      setConversations((current) => {
        const exists = current.find((c) => c.id === conv.id);

        if (exists) {
          return current.map((c) => (c.id === conv.id ? { ...c, ...conv } : c));
        }

        return [{ ...conv, unread_count: 0 }, ...current];
      });
    }

    function handleNewMessage(message) {
      setConversations((current) => {
        const updated = current.map((c) =>
          c.id === message.conversation_id
            ? {
                ...c,
                last_message: message.message,
                last_message_at: message.created_at,
                unread_count:
                  message.sender_role === "customer" &&
                  activeConvIdRef.current !== message.conversation_id
                    ? Number(c.unread_count || 0) + 1
                    : c.unread_count,
              }
            : c
        );

        return [...updated].sort(
          (a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)
        );
      });

      if (message.conversation_id === activeConvIdRef.current) {
        setMessages((current) => [...current, message]);
      }
    }

    function handleAdminMessages({ conversationId, messages }) {
      setMessages(messages);

      setConversations((current) =>
        current.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c))
      );
    }

    socket.on("admin:conversation-updated", handleConvUpdated);
    socket.on("chat:new-message", handleNewMessage);
    socket.on("admin:conversation-messages", handleAdminMessages);

    return () => {
      socket.off("admin:conversation-updated", handleConvUpdated);
      socket.off("chat:new-message", handleNewMessage);
      socket.off("admin:conversation-messages", handleAdminMessages);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function openConversation(conv) {
    setActiveConvId(conv.id);
    socket.emit("admin:open-conversation", { conversationId: conv.id });
  }

  function sendReply(e) {
    e.preventDefault();
    if (!text.trim() || !activeConvId) return;

    socket.emit("admin:message", { conversationId: activeConvId, text: text.trim() });
    setText("");
  }

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="grid md:grid-cols-3 gap-5 h-[70vh]">

      <div className="bg-bgPanel border border-line rounded-xl overflow-y-auto">
        <div className="px-4 py-3 border-b border-line">
          <p className="font-bold">Conversations</p>
        </div>

        {loading ? (
          <p className="text-creamDim text-sm p-4">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="text-creamDim text-sm p-4">Abhi koi chat nahi hai.</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv)}
              className={`w-full text-left px-4 py-3 border-b border-line hover:bg-bgPanel2 transition-colors ${
                activeConvId === conv.id ? "bg-bgPanel2" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm truncate">{conv.guest_name}</p>

                {Number(conv.unread_count) > 0 && (
                  <span className="bg-gold text-[#1A1108] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </div>

              <p className="text-creamDim text-xs mt-1 truncate">
                {conv.last_message || "Naya chat"}
              </p>
            </button>
          ))
        )}
      </div>

      <div className="md:col-span-2 bg-bgPanel border border-line rounded-xl flex flex-col">
        {!activeConvId ? (
          <div className="flex-1 flex items-center justify-center text-creamDim text-sm">
            Ek conversation select karein
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-line">
              <p className="font-bold">{activeConv?.guest_name}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                    m.sender_role === "admin"
                      ? "ml-auto bg-gold text-[#1A1108]"
                      : "mr-auto bg-[#18100A] text-cream border border-line"
                  }`}
                >
                  {m.message}
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            <form onSubmit={sendReply} className="border-t border-line p-3 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Reply likhein..."
                className="flex-1 bg-[#18100A] border border-line rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-gold"
              />

              <button
                type="submit"
                className="bg-gold text-[#1A1108] px-4 rounded-lg font-bold text-sm"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ==========================================
// RESERVATIONS SECTION (ADMIN)
// ==========================================

function ReservationsSection({ token }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadReservations() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reservations load nahi ho sakin.");
      }

      setReservations(data.reservations || []);
    } catch (err) {
      console.error("Load reservations error:", err);
      setError(err.message || "Reservations load nahi ho sakin.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `https://mr-wari-backend-production.up.railway.app/api/reservations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update nahi hua.");
      }

      setReservations((current) =>
        current.map((r) => (r.id === id ? { ...r, status: data.reservation.status } : r))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  const filtered =
    filter === "all"
      ? reservations
      : reservations.filter((r) => r.status === filter);

  const pendingCount = reservations.filter((r) => r.status === "pending").length;

  if (loading) {
    return <p className="text-creamDim">Reservations load ho rahi hain...</p>;
  }

  if (error) {
    return (
      <div className="bg-bgPanel border border-red-500/30 rounded-xl p-8 text-center">
        <p className="text-red-300">{error}</p>
        <button
          onClick={loadReservations}
          className="mt-5 bg-gold text-[#1A1108] px-5 py-2 rounded font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={reservations.length} />
        <StatCard label="Pending" value={pendingCount} color="text-gold" />
        <StatCard
          label="Confirmed"
          value={reservations.filter((r) => r.status === "confirmed").length}
          color="text-green-400"
        />
        <StatCard
          label="Cancelled"
          value={reservations.filter((r) => r.status === "cancelled").length}
          color="text-red-400"
        />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs uppercase px-3 py-2 rounded-lg border capitalize ${
              filter === f
                ? "border-gold text-gold bg-bgPanel2"
                : "border-line text-creamDim hover:border-gold"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-creamDim">Koi reservation nahi mili.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <div key={r.id} className="bg-bgPanel border border-line rounded-xl p-5">
              <div className="flex justify-between items-start gap-3 mb-4">
                <div>
                  <p className="font-bold text-lg">{r.guest_name}</p>
                  <p className="text-gold text-sm font-semibold mt-1">
                    🪑 Table {r.table_number} ({r.seats} seats)
                  </p>
                </div>

                <span
                  className={`text-xs uppercase px-2.5 py-1 rounded border ${
                    r.status === "pending"
                      ? "border-gold text-gold"
                      : r.status === "confirmed"
                      ? "border-green-400 text-green-300"
                      : r.status === "completed"
                      ? "border-blue-400 text-blue-300"
                      : "border-red-400 text-red-300"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="text-sm space-y-1.5 text-creamDim">
                <p>📅 {new Date(r.start_time).toLocaleString()}</p>
                <p>📞 {r.guest_phone}</p>
                {r.guest_email && <p>✉️ {r.guest_email}</p>}
              </div>

              <div className="mt-5">
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="w-full bg-[#18100A] border border-line rounded-lg px-3 py-2.5 text-cream outline-none focus:border-gold"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// REVIEWS SECTION (ADMIN)
// ==========================================

function ReviewsSection({ token }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/reviews/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reviews load nahi ho sake.");
      }

      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Load reviews error:", err);
      setError(err.message || "Reviews load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function toggleApproval(review) {
    try {
      const response = await fetch(
        `https://mr-wari-backend-production.up.railway.app/api/reviews/${review.id}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_approved: !review.is_approved }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update nahi hua.");
      }

      setReviews((current) =>
        current.map((r) => (r.id === review.id ? data.review : r))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function removeReview(id) {
    const confirmed = window.confirm("Ye review delete karna hai?");
    if (!confirmed) return;

    try {
      const response = await fetch(`https://mr-wari-backend-production.up.railway.app/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete nahi hua.");
      }

      setReviews((current) => current.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  const filtered =
    filter === "all"
      ? reviews
      : filter === "pending"
      ? reviews.filter((r) => !r.is_approved)
      : reviews.filter((r) => r.is_approved);

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  if (loading) return <p className="text-creamDim">Reviews load ho rahe hain...</p>;

  if (error) {
    return (
      <div className="bg-bgPanel border border-red-500/30 rounded-xl p-8 text-center">
        <p className="text-red-300">{error}</p>
        <button onClick={loadReviews} className="mt-5 bg-gold text-[#1A1108] px-5 py-2 rounded font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total" value={reviews.length} />
        <StatCard label="Pending" value={pendingCount} color="text-gold" />
        <StatCard
          label="Approved"
          value={reviews.filter((r) => r.is_approved).length}
          color="text-green-400"
        />
      </div>

      <div className="flex gap-2 mb-5">
        {["all", "pending", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs uppercase px-3 py-2 rounded-lg border capitalize ${
              filter === f
                ? "border-gold text-gold bg-bgPanel2"
                : "border-line text-creamDim hover:border-gold"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-creamDim">Koi review nahi mila.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="bg-bgPanel border border-line rounded-xl p-5">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-bold">{r.customer_name}</p>
                  <div className="flex text-gold text-sm mt-1">
                    {"★★★★★".slice(0, r.rating)}
                    <span className="text-line">{"★★★★★".slice(r.rating)}</span>
                  </div>
                </div>

                <span
                  className={`text-xs uppercase px-2.5 py-1 rounded border ${
                    r.is_approved
                      ? "border-green-400 text-green-300"
                      : "border-gold text-gold"
                  }`}
                >
                  {r.is_approved ? "Approved" : "Pending"}
                </span>
              </div>

              <p className="text-creamDim text-sm">{r.comment}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleApproval(r)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
                    r.is_approved
                      ? "border-line text-creamDim hover:border-gold"
                      : "border-green-400 text-green-300 hover:bg-green-400/10"
                  }`}
                >
                  {r.is_approved ? "Hide from Website" : "Approve"}
                </button>

                <button
                  onClick={() => removeReview(r.id)}
                  className="border border-red-500/50 text-red-300 px-4 py-2 rounded-lg text-xs hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// INVENTORY SECTION (ADMIN)
// ==========================================

function InventorySection({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "",
    low_stock_level: "",
  });

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Inventory load nahi ho saka.");
      }

      setItems(data.items || []);
    } catch (err) {
      console.error("Load inventory error:", err);
      setError(err.message || "Inventory load nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm({ name: "", quantity: "", unit: "", low_stock_level: "" });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Item ka naam likhein.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `https://mr-wari-backend-production.up.railway.app/api/inventory/${editingId}`
        : "https://mr-wari-backend-production.up.railway.app/api/inventory";

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          quantity: Number(form.quantity) || 0,
          unit: form.unit.trim(),
          low_stock_level: Number(form.low_stock_level) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Item save nahi hua.");
      }

      if (editingId) {
        setItems((current) =>
          current.map((item) => (item.id === editingId ? data.item : item))
        );
      } else {
        setItems((current) =>
          [...current, data.item].sort((a, b) => a.name.localeCompare(b.name))
        );
      }

      resetForm();
    } catch (err) {
      console.error("Save item error:", err);
      alert(err.message || "Item save nahi hua.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit || "",
      low_stock_level: item.low_stock_level,
    });
  }

  async function deleteItemFn(id) {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const confirmed = window.confirm(`Kya "${item.name}" delete karna hai?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`https://mr-wari-backend-production.up.railway.app/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Item delete nahi hua.");
      }

      setItems((current) => current.filter((i) => i.id !== id));

      if (editingId === id) resetForm();
    } catch (err) {
      alert(err.message || "Item delete nahi hua.");
    }
  }

  async function quickAdjust(item, delta) {
    const newQty = Math.max(0, Number(item.quantity) + delta);

    try {
      const response = await fetch(`https://mr-wari-backend-production.up.railway.app/api/inventory/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Quantity update nahi hui.");
      }

      setItems((current) => current.map((i) => (i.id === item.id ? data.item : i)));
    } catch (err) {
      alert(err.message || "Quantity update nahi hui.");
    }
  }

  const lowStockCount = items.filter(
    (i) => Number(i.quantity) <= Number(i.low_stock_level)
  ).length;

  if (loading) {
    return <p className="text-creamDim">Inventory load ho raha hai...</p>;
  }

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-300 rounded-lg p-4">
          {error}
          <button onClick={loadItems} className="block mt-3 bg-gold text-black px-4 py-2 rounded">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Items" value={items.length} />
        <StatCard
          label="Low Stock Alerts"
          value={lowStockCount}
          color={lowStockCount > 0 ? "text-red-400" : "text-green-400"}
        />
      </div>

      {/* ADD / EDIT FORM */}
      <div className="bg-bgPanel border border-line rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {editingId ? "✏️ Edit Item" : "➕ Add Stock Item"}
          </h2>

          {editingId && (
            <button onClick={resetForm} className="text-sm text-creamDim hover:text-gold">
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm text-creamDim mb-2">Item Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Chicken (kg)"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Quantity</label>
            <input
              name="quantity"
              type="number"
              step="0.01"
              value={form.quantity}
              onChange={handleChange}
              placeholder="50"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Unit</label>
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="kg / liters / pcs"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Low Stock Alert Level</label>
            <input
              name="low_stock_level"
              type="number"
              step="0.01"
              value={form.low_stock_level}
              onChange={handleChange}
              placeholder="10"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div className="md:col-span-3 flex items-end">
            <p className="text-xs text-creamDim">
              Jab quantity is level se kam ho jayegi, item red mein highlight hoga.
            </p>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gold text-[#1A1108] px-6 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* ITEMS LIST */}
      {items.length === 0 ? (
        <div className="text-center py-20 text-creamDim">Abhi koi stock item nahi hai.</div>
      ) : (
        <div className="bg-bgPanel border border-line rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-6 gap-3 px-5 py-3 border-b border-line text-xs uppercase text-creamDim">
            <span className="col-span-2">Item</span>
            <span>Quantity</span>
            <span>Alert Level</span>
            <span>Quick Adjust</span>
            <span className="text-right">Actions</span>
          </div>

          {items.map((item) => {
            const isLow = Number(item.quantity) <= Number(item.low_stock_level);

            return (
              <div
                key={item.id}
                className={`grid md:grid-cols-6 gap-2 md:gap-3 items-center px-5 py-4 border-b border-line last:border-b-0 text-sm ${
                  isLow ? "bg-red-500/5" : ""
                }`}
              >
                <div className="md:col-span-2 flex items-center gap-2">
                  <span className="font-semibold">{item.name}</span>
                  {isLow && (
                    <span className="text-[10px] uppercase border border-red-400 text-red-300 px-1.5 py-0.5 rounded">
                      Low
                    </span>
                  )}
                </div>

                <span className={isLow ? "text-red-300 font-semibold" : ""}>
                  {Number(item.quantity)} {item.unit}
                </span>

                <span className="text-creamDim">
                  {Number(item.low_stock_level)} {item.unit}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => quickAdjust(item, -1)}
                    className="w-8 h-8 border border-line rounded hover:border-gold"
                  >
                    −
                  </button>
                  <button
                    onClick={() => quickAdjust(item, 1)}
                    className="w-8 h-8 border border-line rounded hover:border-gold"
                  >
                    +
                  </button>
                </div>

                <div className="flex md:justify-end gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="border border-gold text-gold px-3 py-1.5 rounded text-xs hover:bg-gold hover:text-[#1A1108]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItemFn(item.id)}
                    className="border border-red-500/50 text-red-300 px-3 py-1.5 rounded text-xs hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// CUSTOMERS SECTION (ADMIN)
// ==========================================

function CustomersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Customers load nahi ho sake.");
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error("Load users error:", err);
      setError(err.message || "Customers load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const customerCount = users.filter((u) => u.role === "customer").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  if (loading) {
    return <p className="text-creamDim">Customers load ho rahe hain...</p>;
  }

  if (error) {
    return (
      <div className="bg-bgPanel border border-red-500/30 rounded-xl p-8 text-center">
        <p className="text-red-300">{error}</p>
        <button
          onClick={loadUsers}
          className="mt-5 bg-gold text-[#1A1108] px-5 py-2 rounded font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Users" value={users.length} />
        <StatCard label="Customers" value={customerCount} color="text-green-400" />
        <StatCard label="Admins" value={adminCount} color="text-gold" />
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 text-creamDim">Abhi koi customer nahi hai.</div>
      ) : (
        <div className="bg-bgPanel border border-line rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-5 gap-3 px-5 py-3 border-b border-line text-xs uppercase text-creamDim">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Orders</span>
            <span>Joined</span>
          </div>

          {users.map((user) => (
            <div
              key={user.id}
              className="grid md:grid-cols-5 gap-1 md:gap-3 px-5 py-4 border-b border-line last:border-b-0 text-sm"
            >
              <span className="font-semibold">{user.name}</span>
              <span className="text-creamDim break-all">{user.email}</span>
              <span>
                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    user.role === "admin"
                      ? "border-gold text-gold"
                      : "border-line text-creamDim"
                  }`}
                >
                  {user.role}
                </span>
              </span>
              <span className="text-creamDim">{user.order_count} orders</span>
              <span className="text-creamDim text-xs">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ANALYTICS SECTION (ADMIN)
// ==========================================

function AnalyticsSection({ orders, products }) {
  // ---- Revenue over last 7 days ----

  const last7Days = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }

    return days.map((day) => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayRevenue = orders
        .filter((o) => {
          const created = new Date(o.created_at);
          return (
            created >= day &&
            created < nextDay &&
            o.status !== "cancelled"
          );
        })
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      return {
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
        revenue: dayRevenue,
      };
    });
  }, [orders]);

  const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1);

  // ---- Orders by status ----

  const statusBreakdown = useMemo(() => {
    const counts = { pending: 0, preparing: 0, completed: 0, cancelled: 0 };

    orders.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status] += 1;
    });

    return counts;
  }, [orders]);

  const maxStatus = Math.max(...Object.values(statusBreakdown), 1);

  // ---- Top selling items ----

  const topItems = useMemo(() => {
    const tally = {};

    orders.forEach((order) => {
      if (!Array.isArray(order.items)) return;

      order.items.forEach((item) => {
        tally[item.name] = (tally[item.name] || 0) + Number(item.quantity || 0);
      });
    });

    return Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [orders]);

  const maxItemQty = Math.max(...topItems.map(([, qty]) => qty), 1);

  // ---- Overall stats ----

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`Rs. ${totalRevenue.toFixed(0)}`} color="text-gold" />
        <StatCard label="Total Orders" value={orders.length} />
        <StatCard label="Avg Order Value" value={`Rs. ${avgOrderValue.toFixed(0)}`} />
        <StatCard label="Menu Items" value={products.length} />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">

        {/* REVENUE CHART */}
        <div className="bg-bgPanel border border-line rounded-xl p-6">
          <h2 className="font-bold mb-6">Revenue — Last 7 Days</h2>

          <div className="flex items-end justify-between gap-2 h-40">
            {last7Days.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-32">
                  <div
                    className="w-full max-w-8 bg-gold rounded-t transition-all"
                    style={{
                      height: `${(day.revenue / maxRevenue) * 100}%`,
                      minHeight: day.revenue > 0 ? "4px" : "0px",
                    }}
                    title={`Rs. ${day.revenue.toFixed(0)}`}
                  />
                </div>
                <span className="text-xs text-creamDim">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER STATUS */}
        <div className="bg-bgPanel border border-line rounded-xl p-6">
          <h2 className="font-bold mb-6">Orders by Status</h2>

          <div className="space-y-4">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="capitalize text-creamDim">{status}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="w-full h-2.5 bg-[#18100A] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      status === "pending"
                        ? "bg-gold"
                        : status === "preparing"
                        ? "bg-blue-400"
                        : status === "completed"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${(count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP SELLING ITEMS */}
      <div className="bg-bgPanel border border-line rounded-xl p-6">
        <h2 className="font-bold mb-6">Top Selling Items</h2>

        {topItems.length === 0 ? (
          <p className="text-creamDim text-sm">Abhi data available nahi hai.</p>
        ) : (
          <div className="space-y-4">
            {topItems.map(([name, qty]) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{name}</span>
                  <span className="text-gold font-semibold">{qty} sold</span>
                </div>
                <div className="w-full h-2.5 bg-[#18100A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${(qty / maxItemQty) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// COMING SOON
// ==========================================

function ComingSoon({ label, icon }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 bg-bgPanel border border-line rounded-xl">
      <p className="text-5xl mb-4">{icon}</p>
      <h2 className="text-2xl font-bold">{label}</h2>
      <p className="text-creamDim mt-2 max-w-sm">
        Ye section abhi bana raha hai. Jald hi {label?.toLowerCase()} yahan se manage kar sakenge.
      </p>
    </div>
  );
}

// ==========================================
// SETTINGS SECTION (ADMIN)
// ==========================================

function SettingsSection() {
  const token = localStorage.getItem("accessToken");

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/settings");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Settings load nahi ho sake.");
      }

      setSettings(data.settings);
    } catch (err) {
      console.error("Load settings error:", err);
      setError(err.message || "Settings load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleSettingsChange(e) {
    const { name, value } = e.target;
    setSettings((current) => ({ ...current, [name]: value }));
  }

  async function saveSettings(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_name: settings.restaurant_name,
          address: settings.address,
          phone: settings.phone,
          email: settings.email,
          opening_time: settings.opening_time,
          closing_time: settings.closing_time,
          facebook_url: settings.facebook_url,
          instagram_url: settings.instagram_url,
          whatsapp_number: settings.whatsapp_number,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Settings save nahi hui.");
      }

      setSettings(data.settings);
      alert("✅ Settings save ho gayi.");
    } catch (err) {
      console.error("Save settings error:", err);
      alert(err.message || "Settings save nahi hui.");
    } finally {
      setSaving(false);
    }
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  }

  async function submitPasswordChange(e) {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Naya password aur confirm password match nahi karte.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/settings/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password change nahi hua.");
      }

      alert("✅ Password successfully change ho gaya.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Change password error:", err);
      alert(err.message || "Password change nahi hua.");
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return <p className="text-creamDim">Settings load ho rahi hain...</p>;
  }

  if (error) {
    return (
      <div className="bg-bgPanel border border-red-500/30 rounded-xl p-8 text-center">
        <p className="text-red-300">{error}</p>
        <button
          onClick={loadSettings}
          className="mt-5 bg-gold text-[#1A1108] px-5 py-2 rounded font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">

      {/* RESTAURANT INFO */}
      <div className="bg-bgPanel border border-line rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">🏠 Restaurant Information</h2>

        <form onSubmit={saveSettings} className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm text-creamDim mb-2">Restaurant Name</label>
            <input
              name="restaurant_name"
              value={settings.restaurant_name || ""}
              onChange={handleSettingsChange}
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-creamDim mb-2">Address</label>
            <input
              name="address"
              value={settings.address || ""}
              onChange={handleSettingsChange}
              placeholder="Hyderabad, Sindh"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Phone Number</label>
            <input
              name="phone"
              value={settings.phone || ""}
              onChange={handleSettingsChange}
              placeholder="0300-0000000"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Contact Email</label>
            <input
              name="email"
              value={settings.email || ""}
              onChange={handleSettingsChange}
              placeholder="info@misterwari.com"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Opening Time</label>
            <input
              name="opening_time"
              value={settings.opening_time || ""}
              onChange={handleSettingsChange}
              placeholder="11:00 AM"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Closing Time</label>
            <input
              name="closing_time"
              value={settings.closing_time || ""}
              onChange={handleSettingsChange}
              placeholder="12:00 AM"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">WhatsApp Number</label>
            <input
              name="whatsapp_number"
              value={settings.whatsapp_number || ""}
              onChange={handleSettingsChange}
              placeholder="923000000000"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Facebook URL</label>
            <input
              name="facebook_url"
              value={settings.facebook_url || ""}
              onChange={handleSettingsChange}
              placeholder="https://facebook.com/misterwari"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Instagram URL</label>
            <input
              name="instagram_url"
              value={settings.instagram_url || ""}
              onChange={handleSettingsChange}
              placeholder="https://instagram.com/misterwari"
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={saving}
              className="bg-gold text-[#1A1108] px-7 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-bgPanel border border-line rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">🔒 Change Password</h2>

        <form onSubmit={submitPasswordChange} className="space-y-5">
          <div>
            <label className="block text-sm text-creamDim mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-creamDim mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full bg-[#18100A] border border-line rounded-lg px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={changingPassword}
              className="bg-ajrakRed text-cream px-7 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
            >
              {changingPassword ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
