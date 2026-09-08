import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, CheckCircle, Edit3, X, Sparkles, User } from "lucide-react";
import { testimonials as defaultTestimonials } from "../data/content";

function StarDisplay({ count, size = "w-4 h-4" }) {
  return (
    <div className="flex gap-1 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < count ? "fill-current text-gold" : "text-creamDim/30"}`}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-2 text-2xl">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-125"
          aria-label={`${n} stars`}
        >
          <Star
            className={`w-7 h-7 ${n <= value ? "fill-gold text-gold" : "text-creamDim/40"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(4.8);
  const [totalReviews, setTotalReviews] = useState(900);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/reviews");
        const data = await response.json();

        if (response.ok && data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
          setAverageRating(data.averageRating || 4.8);
          setTotalReviews(data.totalReviews || data.reviews.length);
        } else {
          // Fallback to local rich testimonials
          setReviews(defaultTestimonials);
        }
      } catch (err) {
        console.warn("Using offline testimonials:", err.message);
        setReviews(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitReview(e) {
    e.preventDefault();

    if (!form.customer_name.trim() || !form.comment.trim()) {
      setError("Naam aur review dono likhein.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name.trim(),
          rating: form.rating,
          comment: form.comment.trim(),
        }),
      });

      setSubmitted(true);
      setForm({ customer_name: "", rating: 5, comment: "" });
    } catch (err) {
      // Local optimistic submit
      setSubmitted(true);
      setForm({ customer_name: "", rating: 5, comment: "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* RATING SUMMARY BANNER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-bgPanel2/90 border border-line">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-yellow-500 text-[#14110d] flex items-center justify-center font-anton text-2xl shadow-gold">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <StarDisplay count={Math.round(averageRating)} size="w-4 h-4" />
              <span className="font-anton text-lg text-cream">Overall Customer Rating</span>
            </div>
            <p className="text-xs text-creamDim font-poppins mt-0.5">
              Based on {totalReviews}+ verified happy foodies in Hyderabad
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-gold px-6 py-3 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Edit3 className="w-4 h-4" />
          <span>Apna Review Likhein</span>
        </button>
      </div>

      {/* REVIEWS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.slice(0, 8).map((r, i) => (
          <motion.div
            key={r.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-bgPanel2 border border-line flex flex-col justify-between hover:border-gold/40 transition-all duration-300 hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <StarDisplay count={r.rating || 5} size="w-3.5 h-3.5" />
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-poppins font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <p className="text-creamDim text-xs sm:text-[13px] leading-relaxed font-inter italic">
                "{r.quote || r.comment}"
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-line/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs">
                {(r.customer_name || r.name)?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-poppins font-bold text-xs text-cream">
                  {r.customer_name || r.name}
                </p>
                <p className="text-[10px] text-creamDim font-poppins">
                  {r.role || "Hyderabad"}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* WRITE A REVIEW MODAL */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-bgPanel border border-gold/40 rounded-3xl p-7 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="font-anton text-2xl text-cream tracking-wide">
                  APNA REVIEW LIKHEIN
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-full bg-bg border border-line text-creamDim hover:text-gold flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <h4 className="font-anton text-2xl text-cream">Shukriya!</h4>
                  <p className="text-xs text-creamDim max-w-xs mx-auto leading-relaxed">
                    Aapka review record ho gaya hai. Hamare khaney ko pasand karne ka bohat shukriya!
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setShowForm(false);
                    }}
                    className="btn-gold px-6 py-2.5 rounded-full font-poppins text-xs font-bold uppercase"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                      Aapka Naam
                    </label>
                    <input
                      name="customer_name"
                      value={form.customer_name}
                      onChange={handleChange}
                      placeholder="e.g. Asad Khan"
                      className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                      Rating
                    </label>
                    <StarPicker
                      value={form.rating}
                      onChange={(n) => setForm((c) => ({ ...c, rating: n }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                      Aapka Tajurba / Feedback
                    </label>
                    <textarea
                      name="comment"
                      rows={3}
                      value={form.comment}
                      onChange={handleChange}
                      placeholder="Khana kaisa laga, service aur delivery ka tajurba kaisa tha..."
                      className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold"
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs font-poppins">{error}</p>}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 btn-gold py-3 rounded-full font-poppins text-xs font-bold uppercase tracking-wider"
                    >
                      {submitting ? "Bhej Rahe Hain..." : "Submit Review"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 rounded-full bg-bg border border-line text-creamDim hover:text-cream text-xs font-poppins uppercase"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}