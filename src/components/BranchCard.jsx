import { motion } from "framer-motion";
import { MapPin, Clock, PhoneCall, Navigation, Store } from "lucide-react";
import { phoneHref, whatsappNumber } from "../data/content";

export default function BranchCard({ branch }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Mister Wari ${branch.name} ${branch.address}`
  )}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="relative bg-bgPanel2/95 border border-line rounded-3xl p-6 sm:p-7 overflow-hidden flex flex-col justify-between hover:border-gold/60 transition-all duration-300 hover:shadow-2xl group"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ajrakRed via-gold to-ajrakRed" />

      <div>
        {/* Branch Icon & Open Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
            <Store className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-poppins font-bold uppercase tracking-wider border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Open Now
          </span>
        </div>

        {/* Branch Name */}
        <h3 className="font-anton text-2xl text-cream group-hover:text-gold transition-colors mb-2">
          {branch.name}
        </h3>

        {/* Address */}
        <p className="text-creamDim text-xs sm:text-[13px] leading-relaxed flex items-start gap-2 mb-2">
          <MapPin className="w-4 h-4 text-ajrakRed flex-shrink-0 mt-0.5" />
          <span>{branch.address}</span>
        </p>

        {/* Timing */}
        <p className="text-creamDim text-xs leading-relaxed flex items-center gap-2 mb-4">
          <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span>{branch.timing}</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-line/60 flex items-center gap-2">
        <a
          href={`tel:${phoneHref}`}
          className="flex-1 btn-gold py-2.5 rounded-xl font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#14110d]" />
          <span>Call Branch</span>
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-bg border border-line hover:border-gold text-creamDim hover:text-gold transition-colors"
          title="Get Directions"
        >
          <Navigation className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

