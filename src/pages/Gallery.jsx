import SectionHeading from "../components/SectionHeading";
import GalleryGrid from "../components/GalleryGrid";
import Reveal from "../components/Reveal";
import { galleryImages } from "../data/content";
import usePageTitle from "../hooks/usePageTitle";

export default function Gallery() {
  usePageTitle("Gallery");
  return (
    <section className="px-7 pt-44 pb-28">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Gallery"
            title="Mister Wari Ki Duniya"
            description="Kitchen se le kar deg tak, dine-in se le kar reda tak — Mister Wari ke mahol ki ek jhalak. Asal branch tasveerein jald yahan add ho jayengi."
          />
        </Reveal>
        <Reveal>
          <GalleryGrid images={galleryImages} />
        </Reveal>
      </div>
    </section>
  );
}
