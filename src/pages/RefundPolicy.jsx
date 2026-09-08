import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import usePageTitle from "../hooks/usePageTitle";

export default function RefundPolicy() {
  usePageTitle("Refund Policy");
  return (
    <section className="px-7 pt-44 pb-28">
      <div className="max-w-[760px] mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Legal" title="Refund & Cancellation Policy" />
        </Reveal>
        <Reveal className="space-y-6 text-creamDim text-[15px] leading-relaxed">
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">
              Order cancellation
            </h3>
            <p>
              Order confirm hone ke 10 minute ke andar WhatsApp/phone par contact kar ke
              cancel kiya ja sakta hai. Ek baar khana banna shuru ho jaye to cancellation
              mumkin nahi.
            </p>
          </div>
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">
              Refund policy
            </h3>
            <p>
              Agar order galat pohcha, quality theek na ho, ya item missing ho, to order
              milne ke 30 minute ke andar humein batayein — hum replacement ya refund
              (cash/adjustment) offer karenge, branch manager ki tasdeeq ke baad.
            </p>
          </div>
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">
              Delivery delays
            </h3>
            <p>
              Traffic ya weather ki wajah se delivery mein derr ho sakti hai — hum poori
              koshish karte hain waqt par pohanchane ki. Agar order 90 minute se zyada
              derr ho jaye, to order free ya discount par diya ja sakta hai (branch
              discretion par).
            </p>
          </div>
          <p className="text-sm text-creamDim/70 pt-4 border-t border-line">
            Yeh ek sample policy hai — apne asal business practices ke mutabiq isay update
            kar lein.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
