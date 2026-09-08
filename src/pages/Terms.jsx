import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import usePageTitle from "../hooks/usePageTitle";

export default function Terms() {
  usePageTitle("Terms & Conditions");
  return (
    <section className="px-7 pt-44 pb-28">
      <div className="max-w-[760px] mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Legal" title="Terms & Conditions" />
        </Reveal>
        <Reveal className="space-y-6 text-creamDim text-[15px] leading-relaxed">
          <p>
            Is website ko istemal karke aap in shartaon se raazi hote hain. Mister Wari
            waqt waqt par menu, prices aur branch timings badalne ka haq rakhta hai bina
            pehle se ittila diye.
          </p>
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">Prices</h3>
            <p>
              Website par dikhaye gaye prices approximate hain aur branch/taxes ke
              mutabiq mukhtalif ho sakte hain. Final price order confirm hone par batayi
              jayegi.
            </p>
          </div>
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">
              Content istemal
            </h3>
            <p>
              Is website ka content (text, design, photos) Mister Wari ki milkiyat hai.
              Bina ijazat copy ya dobara istemal na karein.
            </p>
          </div>
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">
              Rabta
            </h3>
            <p>
              Kisi bhi sawal ke liye humein WhatsApp ya phone par contact karein — details
              Contact page par mojood hain.
            </p>
          </div>
          <p className="text-sm text-creamDim/70 pt-4 border-t border-line">
            Yeh ek sample terms page hai — apne asal business practices ke mutabiq isay
            update kar lein, ya kisi legal advisor se review karwa lein.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

