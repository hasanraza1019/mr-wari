import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  UtensilsCrossed,
  CheckCircle,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  MessageCircle,
  MapPin,
} from "lucide-react";
import confetti from "canvas-confetti";
import { branches, whatsappNumber } from "../data/content";

export default function BookTable() {
  const [step, setStep] = useState(1);

  const [reservation, setReservation] = useState({
    branch: branches[0]?.name || "Latifabad Branch",
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    guests: 4,
    occasion: "Family Dinner",
    name: "",
    phone: "",
    specialRequest: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const occasions = [
    "Family Dinner",
    "Birthday Party",
    "Casual Dining",
    "Business Meeting",
    "Dawat / Get-Together",
  ];

  const times = [
    "13:00",
    "14:00",
    "15:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  const handleNextStep = (e) => {
    e?.preventDefault();
    if (step === 1) {
      if (!reservation.date || !reservation.time) {
        alert("Please date and time select karein.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!reservation.name.trim() || !reservation.phone.trim()) {
        alert("Please apna naam aur phone number likhein.");
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const bookingCode = `MW-RES-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#e5a922", "#a12330", "#ffffff"],
        });
      } catch (e) {}

      try {
        await fetch("http://localhost:5000/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guest_name: reservation.name,
            guest_phone: reservation.phone,
            reservation_date: reservation.date,
            reservation_time: reservation.time,
            party_size: reservation.guests,
            notes: `${reservation.occasion} | Branch: ${reservation.branch} | Special: ${reservation.specialRequest}`,
          }),
        });
      } catch (e) {
        console.warn("Backend reservation record skipped:", e);
      }

      setConfirmedBooking({
        ...reservation,
        code: bookingCode,
      });
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsAppConfirmation = () => {
    if (!confirmedBooking) return;
    const msg = encodeURIComponent(
      `TABLE RESERVATION REQUEST — MISTER WARI\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Booking ID: ${confirmedBooking.code}\n` +
        `Guest Name: ${confirmedBooking.name}\n` +
        `Phone: ${confirmedBooking.phone}\n` +
        `Branch: ${confirmedBooking.branch}\n` +
        `Date: ${confirmedBooking.date}\n` +
        `Time: ${confirmedBooking.time}\n` +
        `Guests: ${confirmedBooking.guests} Persons\n` +
        `Occasion: ${confirmedBooking.occasion}\n` +
        (confirmedBooking.specialRequest ? `Note: ${confirmedBooking.specialRequest}\n` : "") +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Please confirm our table reservation. Shukriya!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-poppins font-bold uppercase tracking-widest border border-gold/30">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>VIP Hospitality</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,52px)] font-anton text-cream tracking-tight leading-tight">
          Table <span className="text-gold-gradient">Reserve Karein</span>
        </h1>
        <p className="text-creamDim text-sm sm:text-base max-w-md mx-auto font-inter">
          Apne khandan aur doston ke saath sukoon se dining ka lutf uthayein. Table advance book karein.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-10">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-poppins font-bold uppercase transition-all ${
            step >= 1 ? "bg-gold text-[#14110d] shadow-gold" : "bg-bgPanel2 border border-line text-creamDim"
          }`}
        >
          <span>1</span>
          <span>Date & Guests</span>
        </div>

        <div className="w-8 h-0.5 bg-line" />

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-poppins font-bold uppercase transition-all ${
            step >= 2 ? "bg-gold text-[#14110d] shadow-gold" : "bg-bgPanel2 border border-line text-creamDim"
          }`}
        >
          <span>2</span>
          <span>Guest Details</span>
        </div>

        <div className="w-8 h-0.5 bg-line" />

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-poppins font-bold uppercase transition-all ${
            step === 3 ? "bg-emerald-500 text-white shadow-md" : "bg-bgPanel2 border border-line text-creamDim"
          }`}
        >
          <span>3</span>
          <span>Confirmed</span>
        </div>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl bg-bgPanel2/95 border border-line shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleNextStep}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                  Select Branch
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {branches.map((b) => (
                    <button
                      type="button"
                      key={b.name}
                      onClick={() => setReservation({ ...reservation, branch: b.name })}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        reservation.branch === b.name
                          ? "bg-gold/15 border-gold text-cream font-bold"
                          : "bg-bg border-line text-creamDim hover:border-gold/40"
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-poppins text-xs text-cream">{b.name}</p>
                        <p className="text-[11px] text-creamDim">{b.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                  Number of Guests
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[1, 2, 4, 6, 8, 10, 12].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setReservation({ ...reservation, guests: num })}
                      className={`w-12 h-12 rounded-2xl font-anton text-lg flex items-center justify-center border transition-all ${
                        reservation.guests === num
                          ? "bg-gold text-[#14110d] border-gold shadow-gold font-bold scale-105"
                          : "bg-bg border-line text-cream hover:border-gold/40"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <input
                      type="date"
                      value={reservation.date}
                      onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                      className="w-full bg-bg border border-line rounded-xl pl-10 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <select
                      value={reservation.time}
                      onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                      className="w-full bg-bg border border-line rounded-xl pl-10 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-gold"
                    >
                      {times.map((t) => (
                        <option key={t} value={t}>
                          {t} ({Number(t.split(":")[0]) >= 12 ? "PM" : "AM"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                  Special Occasion
                </label>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((occ) => (
                    <button
                      type="button"
                      key={occ}
                      onClick={() => setReservation({ ...reservation, occasion: occ })}
                      className={`px-4 py-2 rounded-xl text-xs font-poppins font-semibold border transition-all ${
                        reservation.occasion === occ
                          ? "bg-gold text-[#14110d] border-gold font-bold"
                          : "bg-bg border-line text-creamDim hover:text-cream"
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-gold py-4 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold mt-6"
              >
                <span>Agle Step Par Jayein</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleNextStep}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                  Aapka Naam (Host Name)*
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                  <input
                    type="text"
                    value={reservation.name}
                    onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                    placeholder="e.g. Asad Raza"
                    className="w-full bg-bg border border-line rounded-xl pl-10 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                  Phone / WhatsApp Number*
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                  <input
                    type="tel"
                    value={reservation.phone}
                    onChange={(e) => setReservation({ ...reservation, phone: e.target.value })}
                    placeholder="0300-1234567"
                    className="w-full bg-bg border border-line rounded-xl pl-10 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-creamDim mb-2">
                  Special Instructions / Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reservation.specialRequest}
                  onChange={(e) => setReservation({ ...reservation, specialRequest: e.target.value })}
                  placeholder="e.g. Corner table chahiye, birthday decoration, baby high chair..."
                  className="w-full bg-bg border border-line rounded-xl p-4 text-xs text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-bg border border-gold/30 space-y-1 text-xs font-poppins">
                <p className="text-gold font-bold uppercase">Booking Summary</p>
                <p className="text-cream flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gold" /> {reservation.branch} | <Users className="w-3.5 h-3.5 text-gold" /> {reservation.guests} Guests
                </p>
                <p className="text-creamDim flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gold" /> {reservation.date} at <Clock className="w-3.5 h-3.5 text-gold" /> {reservation.time} ({reservation.occasion})
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 rounded-full bg-bg border border-line text-creamDim hover:text-cream text-xs font-poppins uppercase font-semibold"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-gold py-3.5 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{submitting ? "Booking Ho Rahi Hai..." : "Confirm Reservation"}</span>
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && confirmedBooking && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl border border-emerald-500/40">
                ✓
              </div>

              <div>
                <h3 className="font-anton text-3xl text-cream tracking-wide">
                  Table Book Ho Gayi!
                </h3>
                <p className="text-xs text-creamDim font-poppins mt-1">
                  Booking Reference: <strong className="text-gold">{confirmedBooking.code}</strong>
                </p>
              </div>

              <div className="max-w-md mx-auto p-5 rounded-2xl bg-bg border border-line text-left space-y-2 text-xs font-poppins">
                <div className="flex justify-between border-b border-line/60 pb-2">
                  <span className="text-creamDim">Guest Name:</span>
                  <span className="text-cream font-bold">{confirmedBooking.name}</span>
                </div>
                <div className="flex justify-between border-b border-line/60 pb-2">
                  <span className="text-creamDim">Branch:</span>
                  <span className="text-gold font-bold">{confirmedBooking.branch}</span>
                </div>
                <div className="flex justify-between border-b border-line/60 pb-2">
                  <span className="text-creamDim">Date & Time:</span>
                  <span className="text-cream">{confirmedBooking.date} @ {confirmedBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-creamDim">Guests / Occasion:</span>
                  <span className="text-cream">{confirmedBooking.guests} Persons ({confirmedBooking.occasion})</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={openWhatsAppConfirmation}
                  className="btn-gold px-8 py-3.5 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold"
                >
                  <MessageCircle className="w-4 h-4 text-[#14110d]" />
                  <span>Send Confirmation on WhatsApp</span>
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 rounded-full bg-bg border border-line text-creamDim hover:text-cream text-xs font-poppins uppercase font-semibold"
                >
                  Book Another Table
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}