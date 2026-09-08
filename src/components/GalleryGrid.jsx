import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Sparkles } from "lucide-react";

export default function GalleryGrid({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const spanClass = (span) => {
    if (span === "big") return "md:col-span-2 md:row-span-2 col-span-2";
    if (span === "wide") return "md:col-span-2 col-span-1";
    return "";
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4">
        {images.map((img, i) => (
          <motion.figure
            key={img.caption || i}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage(img)}
            className={`relative overflow-hidden rounded-3xl border border-line group cursor-pointer shadow-lg bg-bg ${spanClass(
              img.span
            )}`}
          >
            <img
              src={img.src}
              alt={img.caption}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/20">
              <Maximize2 className="w-4 h-4 text-gold" />
            </div>

            <figcaption className="absolute left-0 right-0 bottom-0 p-4 font-poppins font-bold text-xs sm:text-sm uppercase tracking-wider text-cream flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                {img.caption}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden border border-gold/40 shadow-2xl z-10 bg-bg"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 text-cream hover:text-gold flex items-center justify-center border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="w-full h-full max-h-[75vh] object-contain"
              />

              <div className="p-4 bg-bgPanel2 border-t border-line text-center">
                <p className="font-anton text-xl text-cream tracking-wide">
                  {selectedImage.caption}
                </p>
                <p className="text-xs text-gold font-poppins mt-0.5 uppercase tracking-wider">
                  Mister Wari Hyderabad
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

