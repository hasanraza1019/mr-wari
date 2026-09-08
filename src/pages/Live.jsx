import { useState } from "react";
import { motion } from "framer-motion";
import { Radio, Users, Flame, Sparkles, MessageCircle, Volume2, ShieldCheck } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { liveStreamConfig, whatsappNumber } from "../data/content";
import usePageTitle from "../hooks/usePageTitle";

export default function Live() {
  const { isLive, youtubeVideoId, title, description, scheduleNote } = liveStreamConfig;
  usePageTitle("Live Kitchen Stream");

  const [viewerCount] = useState(148);

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ajrakRed/15 text-red-300 text-xs font-poppins font-bold uppercase tracking-widest border border-ajrakRed/30">
          <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
          <span>Mister Wari Kitchen Cam</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,52px)] font-anton text-cream tracking-tight leading-tight">
          Hamari Kitchen — <span className="text-gold-gradient">Live Stream</span>
        </h1>
        <p className="text-creamDim text-sm sm:text-base max-w-lg mx-auto font-inter">
          100% transparency — dekhein taaza degh kaise tayyar hoti hai aur safai ka kaisa khayal rakha jata hai.
        </p>
      </div>

      {/* VIDEO PLAYER FRAME */}
      <div className="relative rounded-3xl overflow-hidden border border-gold/40 shadow-2xl bg-bgPanel2 aspect-video group">
        {isLive && youtubeVideoId ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1`}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* FLOATING STATUS BADGES */}
            <div className="absolute top-4 left-4 flex items-center gap-3">
              <span className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-red-500/40">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-cream">
                  LIVE STREAM
                </span>
              </span>

              <span className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-poppins text-creamDim">
                <Users className="w-3.5 h-3.5 text-gold" />
                <span>{viewerCount} Watching</span>
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 space-y-4 bg-gradient-to-b from-bgPanel2 to-[#0b0907]">
            <div className="w-20 h-20 rounded-full bg-gold/10 text-gold flex items-center justify-center text-3xl border border-gold/30 animate-pulse">
              📹
            </div>
            <h3 className="font-anton text-3xl text-cream tracking-wide">
              Kitchen Stream Offline
            </h3>
            <p className="text-creamDim text-xs sm:text-sm max-w-md font-inter leading-relaxed">
              {scheduleNote ||
                "Hamara kitchen stream rozana dopahar 12:00 PM se 3:00 PM aur raat 8:00 PM se 11:00 PM live hota hai jab garam deghain tayyar hoti hain."}
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=Mister%20Wari%20Live%20Stream%20Alert`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-8 py-3.5 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-gold"
            >
              <MessageCircle className="w-4 h-4 text-[#14110d]" />
              <span>Get WhatsApp Live Alerts</span>
            </a>
          </div>
        )}
      </div>

      {/* HIGHLIGHT CARDS */}
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-bgPanel2 border border-line flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="font-anton text-base text-cream">100% Hygenic Kitchen</p>
            <p className="text-xs text-creamDim">Daily sanitized equipment</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-bgPanel2 border border-line flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="font-anton text-base text-cream">Fresh Dum Pukht</p>
            <p className="text-xs text-creamDim">Slow-cooked coal flames</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-bgPanel2 border border-line flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="font-anton text-base text-cream">Zero Adulteration</p>
            <p className="text-xs text-creamDim">Pure Desi Ghee & Fresh Meat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
