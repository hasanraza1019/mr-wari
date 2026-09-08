import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Clock, Send, Sparkles, Navigation } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import ContactForm from "../components/ContactForm";
import BranchCard from "../components/BranchCard";
import Reveal from "../components/Reveal";
import { branches, phoneDisplay, phoneHref, whatsappNumber } from "../data/content";
import usePageTitle from "../hooks/usePageTitle";
import useSettings from "../hooks/useSettings";

export default function Contact() {
  usePageTitle("Contact Us");

  const settings = useSettings();

  const displayPhone = settings?.phone || phoneDisplay;
  const displayPhoneHref = settings?.phone || phoneHref;
  const displayWhatsapp = settings?.whatsapp_number || whatsappNumber;
  const displayAddress = settings?.address || "Latifabad, Hyderabad, Sindh";
  const displayTiming =
    settings?.opening_time && settings?.closing_time
      ? `Roz, ${settings.opening_time} – ${settings.closing_time}`
      : "Rozana, 12:00 PM – 1:00 AM";

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* 1. TOP HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-poppins font-bold uppercase tracking-widest border border-gold/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>24/7 Hospitality Helpline</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,52px)] font-anton text-cream tracking-tight leading-tight">
          Ham Se <span className="text-gold-gradient">Rabta Karein</span>
        </h1>
        <p className="text-creamDim text-sm sm:text-base max-w-md mx-auto font-inter">
          Direct WhatsApp helpline par order karein, table reserve karein ya branch se rabta karein.
        </p>
      </div>

      {/* 2. FORM & QUICK CONTACT CARDS */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* LEFT: INTERACTIVE FORM */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-bgPanel2/95 border border-line shadow-2xl space-y-6">
          <div className="border-b border-line pb-4">
            <h2 className="font-anton text-2xl text-cream tracking-wide">
              Direct Message / Order
            </h2>
            <p className="text-xs text-creamDim font-poppins mt-1">
              Form bharein aur 1 click mein WhatsApp par reply hasil karein.
            </p>
          </div>

          <ContactForm />
        </div>

        {/* RIGHT: CONTACT DIRECTORY & MAP */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${displayWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-3xl bg-bgPanel2 border border-line hover:border-gold/60 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-anton text-lg text-cream group-hover:text-gold transition-colors">
                  WhatsApp Order
                </p>
                <p className="text-xs text-creamDim font-poppins mt-0.5">{displayPhone}</p>
              </div>
            </a>

            {/* Phone Call Card */}
            <a
              href={`tel:${displayPhoneHref}`}
              className="p-5 rounded-3xl bg-bgPanel2 border border-line hover:border-gold/60 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-anton text-lg text-cream group-hover:text-gold transition-colors">
                  Direct Call Helpline
                </p>
                <p className="text-xs text-creamDim font-poppins mt-0.5">Quick order taking</p>
              </div>
            </a>

            {/* Head Office Card */}
            <div className="p-5 rounded-3xl bg-bgPanel2 border border-line flex flex-col justify-between">
              <div className="w-10 h-10 rounded-2xl bg-ajrakRed/15 text-red-400 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-anton text-lg text-cream">Central Kitchen</p>
                <p className="text-xs text-creamDim font-poppins mt-0.5">{displayAddress}</p>
              </div>
            </div>

            {/* Timings Card */}
            <div className="p-5 rounded-3xl bg-bgPanel2 border border-line flex flex-col justify-between">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-anton text-lg text-cream">Timings</p>
                <p className="text-xs text-creamDim font-poppins mt-0.5">{displayTiming}</p>
              </div>
            </div>
          </div>

          {/* GOOGLE MAPS EMBED */}
          <div className="rounded-3xl overflow-hidden border border-line shadow-xl min-h-[260px] bg-bgPanel2">
            <iframe
              src="https://www.google.com/maps?q=Latifabad,Hyderabad,Sindh,Pakistan&output=embed"
              loading="lazy"
              title="Mister Wari Location Map"
              className="w-full h-full min-h-[260px] border-0"
              style={{ filter: "grayscale(0.2) invert(0.9) contrast(0.9)" }}
            />
          </div>
        </div>
      </div>

      {/* 3. BRANCHES DIRECTORY */}
      <div className="space-y-8 pt-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="Branches"
            title="Hyderabad Mein Tamam Branches"
            description="Apne qareebi branch par visit karein ya direct call karein."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((branch) => (
            <BranchCard key={branch.name} branch={branch} />
          ))}
        </div>
      </div>
    </div>
  );
}