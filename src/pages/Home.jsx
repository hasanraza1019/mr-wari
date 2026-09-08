import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles, Store, MessageCircle, Heart, Star } from "lucide-react";
import Hero from "../components/Hero";
import SpecialDeals from "../components/SpecialDeals";
import SectionHeading from "../components/SectionHeading";
import MenuItemCard from "../components/MenuItemCard";
import BranchCard from "../components/BranchCard";
import AboutSection from "../components/AboutSection";
import GalleryGrid from "../components/GalleryGrid";
import Testimonials from "../components/Testimonials";
import FaqAccordion from "../components/FaqAccordion";
import Reveal from "../components/Reveal";
import { branches, galleryImages, whatsappNumber, allMenuItems } from "../data/content";
import usePageTitle from "../hooks/usePageTitle";

function formatCategory(category = "") {
  return category.toLowerCase().replace(/[_\s]+/g, "-").trim();
}

export default function Home() {
  usePageTitle();

  const [popularItems, setPopularItems] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    async function loadPopular() {
      try {
        setLoadingPopular(true);

        const response = await fetch("https://mr-wari-backend-production.up.railway.app/api/products");
        const data = await response.json();

        if (response.ok && data.products && data.products.length > 0) {
          const formatted = data.products
            .filter((p) => p.is_available)
            .slice(0, 6)
            .map((product) => ({
              id: product.id,
              name: product.name,
              tag: product.description || product.name,
              description: product.description || "",
              price: Number(product.price),
              category: formatCategory(product.category),
              image: product.image_url || "",
              rating: 4.8,
              reviews: 140,
              isPopular: true,
            }));
          setPopularItems(formatted);
        } else {
          // Fallback to bestselling items from local data
          setPopularItems(allMenuItems.filter((i) => i.isPopular || i.price >= 300).slice(0, 6));
        }
      } catch (err) {
        console.warn("Using offline popular items:", err);
        setPopularItems(allMenuItems.filter((i) => i.isPopular || i.price >= 300).slice(0, 6));
      } finally {
        setLoadingPopular(false);
      }
    }

    loadPopular();
  }, []);

  return (
    <>
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. SPECIAL DEALS & COMBOS */}
      <SpecialDeals />

      {/* 3. POPULAR MENU ITEMS */}
      <section id="menu" className="px-4 sm:px-6 lg:px-8 py-24 bg-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="Bestsellers"
              title="Sab Se Mashoor Items"
              description="Biryani se le kar chatpate street snacks aur thandi drinks tak — Mister Wari ke customer favourites."
            />

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-gold font-poppins font-bold text-xs uppercase tracking-wider hover:translate-x-1 transition-transform self-start md:self-auto"
            >
              <span>Pura Menu Dekhein</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingPopular ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-3xl bg-bgPanel2 border border-line p-4 space-y-4 skeleton-shimmer"
                />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {popularItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/menu"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-full font-poppins text-xs uppercase tracking-wider font-bold shadow-gold"
            >
              <Flame className="w-4 h-4 text-[#14110d]" />
              <span>Explore 30+ Menu Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. HAMARI KAHANI / ABOUT SECTION */}
      <section id="about" className="bg-bgPanel px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AboutSection />
        </div>
      </section>

      {/* 5. BRANCHES IN HYDERABAD */}
      <section id="branches" className="px-4 sm:px-6 lg:px-8 py-24 bg-bg relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Our Locations"
            title="Hyderabad Mein 4+ Branches"
            description="Dine-in ho ya tez tareen reda delivery — Mister Wari aap ke har qadam par tayyar hai."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12">
            {branches.map((branch) => (
              <BranchCard key={branch.name} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. PHOTO GALLERY */}
      <section id="gallery" className="bg-bgPanel px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="Visual Feast"
              title="Ek Jhalak — Mister Wari Ki Duniya"
              description="Deghon ki taazgi, lazeez pakwaan aur hamare zaiqe ki ek jhalak."
            />

            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-gold font-poppins font-bold text-xs uppercase tracking-wider hover:translate-x-1 transition-transform self-start md:self-auto"
            >
              <span>Poori Gallery Dekhein</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <GalleryGrid images={galleryImages} />
        </div>
      </section>

      {/* 7. TESTIMONIALS & REVIEWS */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-bg relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Customer Love"
            title="Zaiqa Jo Yaad Reh Jaye"
            description="Hyderabad ke hazaron khaney ke shauqeen hamari biryani aur pakwaan ke bare mein kya kehte hain."
          />

          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="bg-bgPanel px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <SectionHeading
              eyebrow="Questions & Answers"
              title="Aksar Puche Jane Wale Sawal"
              description="Delivery, online order, timing aur booking se mutalliq aam sawalat ke jawab."
            />
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* 9. FINAL ROYAL CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-[#0b0907] via-bgPanel2 to-ajrakRed/30 relative overflow-hidden border-t border-line">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 text-gold text-xs font-poppins font-bold uppercase tracking-widest border border-gold/30">
            <Flame className="w-4 h-4 animate-bounce" />
            <span>Garam Garam Khana Aap Ke Ghar</span>
          </div>

          <h2 className="text-[clamp(36px,6vw,64px)] font-anton text-cream tracking-tight leading-tight">
            Bhook Lagi Hai? <span className="text-gold-gradient">Abhi Order Karein!</span>
          </h2>

          <p className="text-creamDim text-sm sm:text-base max-w-lg mx-auto font-inter leading-relaxed">
            Sirf ek click mein WhatsApp par apna order confirm karein aur taaza deghi biryani 30 minutes mein apne darwaze par mangwayein.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-9 py-4 rounded-full font-poppins text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-gold"
            >
              <MessageCircle className="w-4 h-4 text-[#14110d]" />
              <span>WhatsApp Par Order Karein</span>
            </a>

            <Link
              to="/menu"
              className="px-8 py-4 rounded-full bg-bgPanel2 border border-gold/40 text-gold hover:bg-gold hover:text-[#14110d] font-poppins text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>Explore Full Menu</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
