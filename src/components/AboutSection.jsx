import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Award, ShieldCheck, HeartHandshake, Flame, MapPin } from "lucide-react";

const tabs = [
  {
    id: "story",
    label: "Hamari Kahani",
    title: "Ghar Ke Kitchen Se Shuru Hui Baat",
    description:
      "Mister Wari ki kahani Hyderabad ki purani galiyon se shuru hui — ek chhoti si reda se jahan taaza pakwaan seedhe degh se nikaal kar shauqeen logon tak pohanchaye jate the. Aaj hum pure Hyderabad mein 4+ branches ke saath asli zaiqa pesh karte hain.",
    stat: "Since 2018",
    statLabel: "Continuous Legacy",
    badge: "Authentic Heritage",
  },
  {
    id: "spices",
    label: "Asli Masale & Ghee",
    title: "100% Khals Masale Aur Desi Ghee",
    description:
      "Hum kisi artificial essence ya canned ingredients ka istemal nahi karte. Hamare tamam khano mein shuddh desi ghee, khas deghi biryani masala, aur taaza pise hue garam masale istemal hote hain jo har luqme ko yaadgar banate hain.",
    stat: "100% Pure",
    statLabel: "Desi Ghee & Fresh Meat",
    badge: "Premium Ingredients",
  },
  {
    id: "kitchen",
    label: "Apna Dum Pukht Kitchen",
    title: "Koylon Par Ghanton Pakai Gayi Degh",
    description:
      "Hamari biryani aur pulao ki asli jaan hai slow dum pukht tarika. Degh ko aatay se seal karke dheemi aanch par pakaya jata hai taake har chawal ka daana gosht ke arq aur khushbu mein rach bas jaye.",
    stat: "4 Hours",
    statLabel: "Slow Dum Pukht Process",
    badge: "Master Chefs",
  },
];

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-center">
      {/* LEFT CONTENT */}
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-poppins font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hamari Pehchan</span>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex flex-wrap gap-2 pt-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-poppins text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gold text-[#14110d] font-bold shadow-gold"
                  : "bg-bgPanel2 border border-line text-creamDim hover:text-cream hover:border-gold/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT ANIMATION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-2"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-ajrakRed/20 text-red-300 border border-ajrakRed/40 text-[11px] font-poppins font-bold uppercase tracking-wider">
              {currentTab.badge}
            </span>

            <h2 className="text-[clamp(28px,4vw,44px)] font-anton text-cream leading-tight">
              {currentTab.title}
            </h2>

            <p className="text-creamDim text-base sm:text-[17px] leading-relaxed font-inter">
              {currentTab.description}
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 max-w-sm">
              <div className="p-4 rounded-2xl bg-bgPanel2 border border-line">
                <p className="font-anton text-2xl sm:text-3xl text-gold-gradient">
                  {currentTab.stat}
                </p>
                <p className="text-xs text-creamDim uppercase font-poppins mt-1">
                  {currentTab.statLabel}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-bgPanel2 border border-line flex flex-col justify-center">
                <p className="font-anton text-2xl sm:text-3xl text-cream">4+ Branches</p>
                <p className="text-xs text-creamDim uppercase font-poppins mt-1">
                  All Across Hyderabad
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT VISUAL */}
      <div className="lg:col-span-5 relative">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-gold/30 shadow-2xl p-2 bg-gradient-to-b from-gold/30 via-bgPanel2 to-ajrakRed/30">
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1569057173081-bf8c8cd7bd30?auto=format&fit=crop&w=900&q=80"
              alt="Mister Wari Chef Cooking"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-gold/40 text-center">
              <p className="font-anton text-xl sm:text-2xl text-cream tracking-wide">
                MISTER WARI — HYDERABAD
              </p>
              <p className="text-xs text-amber-200 font-poppins font-semibold uppercase tracking-wider mt-0.5">
                Har Baranch Par Asli Zaiqa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
