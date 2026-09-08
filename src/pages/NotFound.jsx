import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page Not Found");
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-7 pt-40">
      <span className="font-poppins font-semibold tracking-[3px] uppercase text-[12.5px] text-gold">
        404
      </span>
      <h1 className="mt-3 text-[clamp(34px,6vw,64px)]">Yeh Page Nahi Mila</h1>
      <p className="text-creamDim mt-4 max-w-[420px]">
        Jo page aap dhoond rahe hain wo maujood nahi hai. Wapas home page par jaayein.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 bg-gold text-[#1A1108] px-7 py-4 rounded font-poppins font-semibold text-[14px] uppercase tracking-wide mt-8 transition-all hover:-translate-y-0.5"
      >
        Home Par Jaayein
      </Link>
    </section>
  );
}

