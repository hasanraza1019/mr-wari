import { Flame, Sparkles, Clock, Truck, Award, Star } from "lucide-react";

const announcements = [
  { icon: Flame, text: "Aaj Ka Special: Deghi Mutton & Chicken Biryani", highlight: true },
  { icon: Truck, text: "Tez Tareen Home Delivery (Reda) in Hyderabad", highlight: false },
  { icon: Star, text: "4.8★ Rated by 900+ Biryani Lovers", highlight: true },
  { icon: Award, text: "100% Taaza Desi Ghee Dum Pukht Pakwaan", highlight: false },
  { icon: Sparkles, text: "WhatsApp Par 1-Click Fast Online Order", highlight: true },
  { icon: Clock, text: "Open Daily: 12:00 PM – 1:00 AM (Autobahn & Latifabad)", highlight: false },
];

export default function MarqueeTicker() {
  const track = [...announcements, ...announcements];

  return (
    <div className="relative bg-gradient-to-r from-ajrakRed via-[#701620] to-ajrakRed overflow-hidden py-2.5 select-none border-y border-gold/20 shadow-md">
      <div className="flex gap-8 whitespace-nowrap animate-marquee w-max hover:[animation-play-state:paused]">
        {track.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 font-poppins text-xs uppercase tracking-wider font-semibold ${
                item.highlight ? "text-amber-200" : "text-cream"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${item.highlight ? "text-gold animate-pulse" : "text-creamDim"}`} />
              <span>{item.text}</span>
              <span className="text-gold/40 ml-4 font-normal">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
