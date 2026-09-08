import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import usePageTitle from "../hooks/usePageTitle";

export default function PrivacyPolicy() {
  usePageTitle("Privacy Policy");
  return (
    <section className="px-7 pt-44 pb-28">
      <div className="max-w-[760px] mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Legal" title="Privacy Policy" />
        </Reveal>
        <Reveal className="space-y-6 text-creamDim text-[15px] leading-relaxed">
          <p>
            Yeh Privacy Policy batati hai ke Mister Wari website par aapki maloomat kaise
            istemal hoti hai. Website istemal karte waqt aap in shartaon se raazi hote hain.
          </p>
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">
              Hum kya maloomat jama karte hain
            </h3>
            <p>
              Contact form ya cart checkout ke doran diya gaya naam, phone number aur
              order/message — yeh sirf order process karne aur aap se rabta karne ke liye
              istemal hota hai. Cart ka data sirf aapke apne browser mein (localStorage)
              save hota hai — yeh humare kisi server par nahi jata.
            </p>
          </div>
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">
              WhatsApp ke zariye order
            </h3>
            <p>
              Jab aap "Checkout on WhatsApp" ya contact form dabate hain, aap ki maloomat
              WhatsApp ke zariye seedha humare restaurant number par jati hai — is par
              WhatsApp/Meta ki apni privacy policy lagu hoti hai.
            </p>
          </div>
          <div>
            <h3 className="text-cream font-poppins font-semibold text-base mb-2">
              Third-party services
            </h3>
            <p>
              Yeh website Google Maps (location dikhane ke liye) aur stock photo services
              use karti hai — inki apni privacy policies hain.
            </p>
          </div>
          <p className="text-sm text-creamDim/70 pt-4 border-t border-line">
            Yeh ek sample policy hai — apne asal business practices ke mutabiq isay update
            kar lein, ya kisi legal advisor se review karwa lein.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
