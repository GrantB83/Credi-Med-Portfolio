import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProcessSteps from "@/components/ProcessSteps";
import TrustMarkers from "@/components/TrustMarkers";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="CrediMed - Find the Perfect Medical Aid for You | South Africa"
        description="Compare all major South African medical aid schemes transparently. Get your personalized shortlist in minutes. POPIA compliant and commission-free comparison."
        keywords="medical aid, medical schemes, health insurance, South Africa, medical aid comparison, healthcare coverage"
        canonical="https://credimed.co.za"
      />
      <Navigation />
      <HeroSection />
      <ProcessSteps />
      <TrustMarkers />
      <Footer />
    </div>
  );
};

export default Index;