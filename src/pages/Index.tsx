import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedMarketCard from "@/components/FeaturedMarketCard";
import ValueProposition from "@/components/ValueProposition";
import HowItWorks from "@/components/HowItWorks";
import TopMarkets from "@/components/TopMarkets";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen dark">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedMarketCard />
        <ValueProposition />
        <HowItWorks />
        <TopMarkets />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
