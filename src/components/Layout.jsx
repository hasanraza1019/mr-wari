import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import StickyCartBar from "./StickyCartBar";
import ChatWidget from "./ChatWidget";
import MarqueeTicker from "./MarqueeTicker";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-cream selection:bg-gold selection:text-[#14110d]">
      <Navbar />
      <div className="pt-[72px]">
        <MarqueeTicker />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <StickyCartBar />
      <ChatWidget />
    </div>
  );
}
