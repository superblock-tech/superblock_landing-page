import CuttingEdge from "../components/CuttingEdge";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Join from "../components/Join";
import Products from "../components/Products";
import Section3 from "../components/Section3";
import Unlocking from "../components/Unlocking";
import WhySuperblock from "../components/WhySuperblock";
import KeyFeatures from "../components/KeyFeatures";
import Tokenomics from "../components/Tokenomics";

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
        <Unlocking />
        <WhySuperblock />
        <Tokenomics/>
        <KeyFeatures/>
        <Faq />
        <Join />
        <Footer />
    </div>
  );
}
