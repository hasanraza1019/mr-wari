import SectionHeading from "../components/SectionHeading";
import MenuTabs from "../components/MenuTabs";
import Reveal from "../components/Reveal";
import usePageTitle from "../hooks/usePageTitle";

export default function Menu() {
  usePageTitle("Menu");
  return (
    <section className="px-7 pt-44 pb-28">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Full Menu"
            title="Mister Wari Menu"
            description="Biryani, pulao, chatpata street food, fast food, thandi drinks aur desserts — sab kuch ek hi jaga. Search karein ya category chunein, item pasand aaye to seedha 'Add to Cart' dabayein."
          />
        </Reveal>
        <Reveal>
          <MenuTabs />
        </Reveal>
      </div>
    </section>
  );
}

