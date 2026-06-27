import Navbar from "@/components/Navbar";
import HeroChaosToPlatform from "@/components/HeroChaosToPlatform";
import ProblemSection from "@/components/ProblemSection";
import TransformationSection from "@/components/TransformationSection";
import PlatformModules from "@/components/PlatformModules";
import HowItWorks from "@/components/HowItWorks";
import TargetMarkets from "@/components/TargetMarkets";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

/* Landing page de Inteligência Operacional.
   A ordem das seções da narrativa é definida aqui. */
export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroChaosToPlatform />
      <ProblemSection />
      <TransformationSection />
      <PlatformModules />
      <HowItWorks />
      <TargetMarkets />
      <FinalCTA />
      <Footer />
    </main>
  );
}
