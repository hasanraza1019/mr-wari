import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, User, MessageSquare, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { whatsappNumber } from "../data/content";

const initialForm = { name: "", phone: "", message: "", branch: "Latifabad" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate(values) {
    const next = {};
    if (!values.name.trim()) next.name = "Naam likhna zaroori hai.";
    if (!values.phone.trim()) {
      next.phone = "Phone number zaroori hai.";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(values.phone.trim())) {
      next.phone = "Sahi phone number darj karein.";
    }
    if (!values.message.trim()) next.message = "Order ya sawal likhein.";
    return next;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.7 },
        colors: ["#e5a922", "#a12330", "#ffffff"],
      });
    } catch (e) {}

    const text = encodeURIComponent(
      `INQUIRY / ORDER — MISTER WARI WEBSITE\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Name: ${form.name}\n` +
        `Phone: ${form.phone}\n` +
        `Branch: ${form.branch}\n` +
        `Message: ${form.message}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Please respond soon. Shukriya!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener");

    setSubmitted(true);
    setForm(initialForm);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block font-poppins text-xs font-bold uppercase tracking-wider text-creamDim mb-2">
          Aap Ka Naam *
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Asad Raza"
            className={`w-full bg-bg border rounded-2xl pl-11 pr-4 py-3.5 text-xs text-cream placeholder:text-creamDim/50 focus:outline-none focus:border-gold transition-colors ${
              errors.name ? "border-ajrakRed" : "border-line"
            }`}
          />
        </div>
        {errors.name && <p className="text-red-400 text-xs mt-1.5 font-poppins">{errors.name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-poppins text-xs font-bold uppercase tracking-wider text-creamDim mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0300-1234567"
            className={`w-full bg-bg border rounded-2xl pl-11 pr-4 py-3.5 text-xs text-cream placeholder:text-creamDim/50 focus:outline-none focus:border-gold transition-colors ${
              errors.phone ? "border-ajrakRed" : "border-line"
            }`}
          />
        </div>
        {errors.phone && <p className="text-red-400 text-xs mt-1.5 font-poppins">{errors.phone}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-poppins text-xs font-bold uppercase tracking-wider text-creamDim mb-2">
          Aap Ka Paigham / Special Request *
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gold" />
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Kya order karna chahte hain ya koi sawal puchna hai..."
            className={`w-full bg-bg border rounded-2xl pl-11 pr-4 py-3.5 text-xs text-cream placeholder:text-creamDim/50 focus:outline-none focus:border-gold transition-colors ${
              errors.message ? "border-ajrakRed" : "border-line"
            }`}
          />
        </div>
        {errors.message && <p className="text-red-400 text-xs mt-1.5 font-poppins">{errors.message}</p>}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="btn-gold w-full py-4 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold"
      >
        <Send className="w-4 h-4 text-[#14110d]" />
        <span>WhatsApp Helpline Par Bhejein</span>
      </motion.button>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-poppins"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Shukriya! Aap ka paigham WhatsApp par open ho gaya hai. Send kar ke rabta confirm karein.</span>
        </motion.div>
      )}
    </form>
  );
}

