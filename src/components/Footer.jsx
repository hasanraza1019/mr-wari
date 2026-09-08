import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Clock, Heart, Sparkles, Send, UtensilsCrossed } from "lucide-react";
import useSettings from "../hooks/useSettings";
import { whatsappNumber, phoneDisplay } from "../data/content";

export default function Footer() {
  const settings = useSettings();

  return (
    <footer className="bg-[#0b0907] border-t border-line relative overflow-hidden">
      {/* Signature Ajrak Strip */}
      <div className="ajrak-strip" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* COLUMN 1: BRAND LOGO & MOTTO (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-anton text-3xl tracking-wider text-cream"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-ajrakRed flex items-center justify-center shadow-gold">
                <UtensilsCrossed className="w-4 h-4 text-[#14110d]" />
              </div>
              <span>
                MISTER<span className="text-gold-gradient">WARI</span>
              </span>
            </Link>

            <p className="text-creamDim text-xs sm:text-sm leading-relaxed font-inter max-w-sm">
              Hyderabad ka mashoor aur qadeemi zaiqa — deghi dum pukht biryani, desi ghee pulao aur chatpate street pakwaan. Rozana taaza tayyar kiya jata hai.
            </p>

            <div className="pt-2 space-y-2 text-xs font-poppins text-creamDim">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-ajrakRed flex-shrink-0" />
                <span>Latifabad, Qasimabad, City & Hussainabad, Hyderabad</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`tel:+923000000000`} className="hover:text-gold transition-colors">
                  {settings?.phone || phoneDisplay}
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-anton text-lg tracking-wider text-cream uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-poppins text-creamDim">
              <li>
                <Link to="/menu" className="hover:text-gold transition-colors flex items-center gap-1">
                  <span>Full Menu</span>
                </Link>
              </li>
              <li>
                <Link to="/book-table" className="hover:text-gold transition-colors">
                  Book Table
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-gold transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-gold transition-colors">
                  Kitchen Live Stream
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">
                  Contact & Branches
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: TIMINGS & POLICY (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-anton text-lg tracking-wider text-cream uppercase">
              Timings & Info
            </h4>
            <div className="p-4 rounded-2xl bg-bgPanel border border-line space-y-2 text-xs font-poppins">
              <div className="flex items-center gap-2 text-gold font-semibold">
                <Clock className="w-4 h-4" />
                <span>Opening Hours</span>
              </div>
              <p className="text-cream">Daily: 12:00 PM – 1:00 AM</p>
              <p className="text-creamDim text-[11px]">Dine-In, Takeaway & Reda Delivery</p>
            </div>

            <ul className="space-y-2 text-xs font-poppins text-creamDim pt-1">
              <li>
                <Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-gold">Refund Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gold">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: WHATSAPP VIP CLUB (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-anton text-lg tracking-wider text-cream uppercase">
              WhatsApp VIP Order
            </h4>
            <p className="text-xs text-creamDim leading-relaxed font-inter">
              Direct WhatsApp helpline par order karein ya VIP discount updates hasil karein.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full py-3 rounded-2xl font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold"
            >
              <MessageCircle className="w-4 h-4 text-[#14110d]" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 pt-6 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-poppins text-creamDim">
          <p>© {new Date().getFullYear()} Mister Wari, Hyderabad, Sindh. Sab huqooq mahfooz hain.</p>
          <p className="flex items-center gap-1.5 text-gold">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-current text-ajrakRed" />
            <span>in Hyderabad, Sindh</span>
          </p>
        </div>
      </div>
    </footer>
  );
}