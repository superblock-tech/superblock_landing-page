import CuttingEdge from "../components/CuttingEdge";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Join from "../components/Join";
import Products from "../components/Products";
import Section3 from "../components/Section3";
import Unloacking from "../components/Unloacking";
import WhySuperblock from "../components/WhySuperblock";

export default function HomePage() {
  return (
    <div
        className="bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('assets/images/bg.png')" }}
      >
        <Hero />
        <CuttingEdge />
        <Section3 />
        <Products />
        <Unloacking />
        <WhySuperblock />
        <Faq />
        <Join />
        <Footer />
    </div>
  );
}