
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "mister-wari-cart";
const TABLE_KEY = "mister-wari-table";

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadInitialTable() {
  try {
    const raw = localStorage.getItem(TABLE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, qty = 1 } = action.payload;

      const existing = state.find(
        (line) => line.id === item.id
      );

      if (existing) {
        return state.map((line) =>
          line.id === item.id
            ? { ...line, qty: line.qty + qty }
            : line
        );
      }

      return [...state, { ...item, qty }];
    }

    case "INCREASE":
      return state.map((line) =>
        line.id === action.payload.id
          ? { ...line, qty: line.qty + 1 }
          : line
      );

    case "DECREASE":
      return state
        .map((line) =>
          line.id === action.payload.id
            ? { ...line, qty: line.qty - 1 }
            : line
        )
        .filter((line) => line.qty > 0);

    case "REMOVE":
      return state.filter(
        (line) => line.id !== action.payload.id
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    undefined,
    loadInitialCart
  );

  const [isOpen, setIsOpen] = useState(false);

  // ==========================================
  // TABLE STATE
  // ==========================================

  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(
    loadInitialTable
  );

  const [tablesLoading, setTablesLoading] = useState(false);

  const [tablesError, setTablesError] = useState("");

  // ==========================================
  // SAVE CART
  // ==========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch {
      // Cart still works if localStorage unavailable
    }
  }, [cart]);

  // ==========================================
  // SAVE SELECTED TABLE
  // ==========================================

  useEffect(() => {
    try {
      if (selectedTable) {
        localStorage.setItem(
          TABLE_KEY,
          JSON.stringify(selectedTable)
        );
      } else {
        localStorage.removeItem(TABLE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [selectedTable]);

  // ==========================================
  // LOAD RESTAURANT TABLES
  // ==========================================

  useEffect(() => {
    async function loadTables() {
      try {
        setTablesLoading(true);
        setTablesError("");

        const response = await fetch(
          "http://localhost:5000/api/tables"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Tables load nahi ho sake."
          );
        }

        setTables(data.tables || []);
      } catch (error) {
        console.error("Tables error:", error);

        setTablesError(
          error.message ||
            "Tables load nahi ho sake."
        );
      } finally {
        setTablesLoading(false);
      }
    }

    loadTables();
  }, []);

  // ==========================================
  // CART FUNCTIONS
  // ==========================================

  const addItem = (item, qty = 1) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { item, qty },
    });

    setIsOpen(true);
  };

  const increaseItem = (id) =>
    dispatch({
      type: "INCREASE",
      payload: { id },
    });

  const decreaseItem = (id) =>
    dispatch({
      type: "DECREASE",
      payload: { id },
    });

  const removeItem = (id) =>
    dispatch({
      type: "REMOVE",
      payload: { id },
    });

  const clearCart = () =>
    dispatch({
      type: "CLEAR",
    });

  // ==========================================
  // CART TOTALS
  // ==========================================

  const itemCount = cart.reduce(
    (sum, line) => sum + line.qty,
    0
  );

  const subtotal = cart.reduce(
    (sum, line) =>
      sum + line.qty * Number(line.price),
    0
  );

  // ==========================================
  // TABLE FUNCTIONS
  // ==========================================

  const selectTable = (table) => {
    setSelectedTable(table);
  };

  const clearTable = () => {
    setSelectedTable(null);
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    cart,

    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,

    itemCount,
    subtotal,

    isOpen,

    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),

    // Tables
    tables,
    tablesLoading,
    tablesError,
    selectedTable,
    selectTable,
    clearTable,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return ctx;
}

