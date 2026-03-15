import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PredictionDemo from "@/components/PredictionDemo";
import TechStack from "@/components/TechStack";
import Advantages from "@/components/Advantages";
import Applications from "@/components/Applications";
import TeamSection from "@/components/TeamSection";
import FooterSection from "@/components/FooterSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <PredictionDemo />
        <TechStack />
        <Advantages />
        <Applications />
        <TeamSection />
      </main>
      <FooterSection />
    </div>
  );
}
