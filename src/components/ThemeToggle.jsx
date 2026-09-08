import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <motion.button
      whileTap={{ scale: 0.88, rotate: 20 }}
      whileHover={{ scale: 1.08 }}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-bgPanel2 border border-line text-cream hover:text-gold hover:border-gold/60 transition-colors shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-gold" />
      ) : (
        <Moon className="w-4 h-4 text-amber-500" />
      )}
    </motion.button>
  );
}