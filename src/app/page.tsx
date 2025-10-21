// import { ComingSoon } from "@/components/coming-soon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <div className="relative">
      {/* Navbar */}
      <Navbar />

      {/* Coming Soon Component - Temporarily disabled */}
      {/* <ComingSoon /> */}

      {/* Main Content */}
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* How It Works Section */}
        <HowItWorks />

        {/* More sections will be added here */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
