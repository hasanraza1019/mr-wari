import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ShieldCheck, UtensilsCrossed } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/account");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      handleLoginSuccess(data.user, data.accessToken);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-cream flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* LOGO */}
        <div className="text-center mb-8 space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-anton text-4xl tracking-wide text-cream"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold to-ajrakRed flex items-center justify-center shadow-gold">
              <UtensilsCrossed className="w-5 h-5 text-[#14110d]" />
            </div>
            <span>
              MISTER<span className="text-gold-gradient">WARI</span>
            </span>
          </Link>

          <p className="text-creamDim font-poppins text-xs uppercase tracking-widest pt-1">
            Sign In to your Account
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="p-8 rounded-3xl bg-bgPanel2/95 border border-line shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <h1 className="font-anton text-2xl text-cream tracking-wide">
              LOGIN
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] text-gold font-poppins font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secured Auth
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl border border-red-500/40 bg-red-500/10 text-xs text-red-300 font-poppins">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-2xl border border-line bg-bg pl-11 pr-4 py-3.5 text-xs text-cream outline-none font-poppins focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-2xl border border-line bg-bg pl-11 pr-4 py-3.5 text-xs text-cream outline-none font-poppins focus:border-gold"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold mt-2"
            >
              <LogIn className="w-4 h-4 text-[#14110d]" />
              <span>{loading ? "Logging in..." : "Login Now"}</span>
            </motion.button>
          </form>

          {/* SIGN UP LINK */}
          <div className="pt-1 text-center">
            <p className="text-xs text-creamDim font-poppins">
              New customer?{" "}
              <Link to="/register" className="text-gold font-bold hover:underline ml-1">
                Create Account
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-xs text-creamDim hover:text-gold font-poppins transition-colors"
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}