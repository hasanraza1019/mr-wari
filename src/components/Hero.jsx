import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, MapPin, Sparkles, ArrowRight, Star, Clock, ShieldCheck } from "lucide-react";
import { heroStats } from "../data/content";
import AnimatedStat from "./AnimatedStat";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 overflow-hidden">
      {/* BACKGROUND VIDEO & GRADIENT MESH */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?auto=format&fit=crop&w=1800&q=80"
          className="w-full h-full object-cover opacity-35 scale-105"
        >
          <source
            src="https://videos.pexels.com/video-files/34242290/14511315_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Rich atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0907] via-[#0b0907]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907] via-transparent to-[#0b0907]/60" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-ajrakRed/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: HERO CONTENT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 space-y-6"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-poppins font-semibold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-gold" style={{ animationDuration: "6s" }} />
            <span>Hyderabad's No. 1 Asli Zaiqa</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(44px,7.5vw,96px)] tracking-tight leading-[0.95] text-cream"
          >
            ASLI <span className="text-gold-gradient">ZAIQA,</span>
            <br />
            <span className="text-outline">HAR</span>{" "}
            <span className="relative inline-block">
              BRANCH PAR
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-ajrakRed to-transparent rounded-full" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl text-base sm:text-lg text-creamDim leading-relaxed font-inter"
          >
            Mister Wari — Hyderabad ka wo naam jo har gali mein mashoor hai. Deghon ki dum pukht biryani,
            chatpata street food aur 100% taaza desi ghee pakwaan — ek click mein order karein.
          </motion.p>

          {/* CTA Button Group */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/menu"
              className="btn-gold px-8 py-4 rounded-full font-poppins text-sm uppercase tracking-wider flex items-center gap-2 group shadow-gold"
            >
              <Flame className="w-4 h-4 text-[#14110d] group-hover:scale-125 transition-transform" />
              <span>Dekhein Pura Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#deals"
              className="px-7 py-4 rounded-full bg-bgPanel2/80 hover:bg-gold/15 text-cream hover:text-gold border border-line hover:border-gold/50 font-poppins text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Special Deals</span>
            </a>

            <a
              href="#branches"
              className="px-6 py-4 rounded-full text-creamDim hover:text-cream text-xs font-poppins font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-ajrakRed" />
              <span>4+ Branches</span>
            </a>
          </motion.div>

          {/* STATS CARDS */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-3 sm:gap-6 pt-8 border-t border-line/60 max-w-lg"
          >
            {heroStats.map((stat, i) => (
              <div
                key={stat.label}
                className="p-3 sm:p-4 rounded-2xl bg-bgPanel/60 border border-line/40 backdrop-blur-sm transition-transform hover:-translate-y-1"
              >
                <div className="font-anton text-2xl sm:text-3xl text-gold">
                  <AnimatedStat value={stat.value} />
                </div>
                <div className="text-[11px] sm:text-xs text-creamDim tracking-wider uppercase font-poppins mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: FLOATING VISUAL SHOWCASE */}
        <div className="lg:col-span-4 relative hidden lg:flex flex-col items-center justify-center">
          {/* Main Floating Image Showcase */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            className="relative w-80 h-80 rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-gold/40 via-ajrakRed/30 to-gold/20 shadow-2xl border border-gold/30"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden relative group">
              <img
                src="https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=800&q=80"
                alt="Mister Wari Special Biryani"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <span className="px-2.5 py-1 rounded-full bg-gold text-[#14110d] font-poppins font-extrabold text-[10px] uppercase w-fit mb-1">
                  Chef's Special
                </span>
                <p className="font-anton text-xl text-cream">Deghi Chicken Biryani</p>
                <p className="text-xs text-amber-200">Rs. 350 — Dum Pukht Style</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Badge 1: 30-min Delivery */}
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
            className="absolute -top-4 -left-6 glass-panel px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gold/40"
          >
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-cream font-poppins">30-Min Fast Delivery</p>
              <p className="text-[10px] text-creamDim">Hot & Taaza at your door</p>
            </div>
          </motion.div>

          {/* Floating Badge 2: 4.8 Rating */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, delay: 1 }}
            className="absolute -bottom-6 -right-4 glass-panel px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gold/40"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-yellow-500 text-[#14110d] flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-xs font-bold text-cream font-poppins">4.8 / 5.0 Rating</p>
              <p className="text-[10px] text-creamDim">900+ Verified reviews</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

