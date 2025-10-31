// import { ComingSoon } from "@/components/coming-soon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ContactSection } from "@/components/landing/contact-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { SocialPlatformsCarousel } from "@/components/landing/social-platforms-carousel";
import {
  portfolioData,
  PortfolioVideoShowcase,
} from "@/components/landing/portfolio-video-showcase";
import { VideoSimulatorSection } from "@/components/landing/video-simulator-section";
import { ZoomParallax } from "@/components/zoom-parallax";

// Datos para el componente ZoomParallax
const parallaxVideos = [
  {
    src: "/videos/parallax/intelligent-editing.mp4",
    alt: "Video editing",
    title: "Intelligent Editing",
    description: "Intelligent AI that optimizes every frame automatically",
    orientation: "horizontal" as const,
  },
  {
    src: "/videos/parallax/ai-processing.mp4",
    alt: "AI Processing",
    title: "AI Processing",
    description: "Advanced algorithms for professional results",
    orientation: "vertical" as const,
  },
  {
    src: "/videos/parallax/fast-renderint.mp4",
    alt: "Fast rendering",
    title: "Fast Rendering",
    description: "Videos ready in minutes, not hours",
    orientation: "vertical" as const,
  },
  {
    src: "/videos/parallax/creative-content.mp4",
    alt: "Creative content",
    title: "Creative Content",
    description: "Transform ideas into impactful videos",
    orientation: "horizontal" as const,
  },
  {
    src: "/videos/parallax/automated-workflow.mp4",
    alt: "Automated workflow",
    title: "Automated Workflow",
    description: "From concept to publication without complications",
    orientation: "vertical" as const,
  },
  {
    src: "/videos/parallax/social-media-ready.mp4",
    alt: "Social media ready",
    title: "Social Media Ready",
    description: "Optimized for all platforms",
    orientation: "horizontal" as const,
  },
  {
    src: "/videos/parallax/profesional-quality.mp4",
    alt: "Professional quality",
    title: "Professional Quality",
    description: "Results of professional level guaranteed",
    orientation: "horizontal" as const,
  },
];

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

        {/* Zoom Parallax Section - Visual Journey */}
        <ZoomParallax
          videos={parallaxVideos}
          showLogo={true}
          title="Platform-Optimized Video Formats"
          description="Professionally crafted videos tailored for every platform with maximum resolution quality and optimized performance. Deliver exceptional visual experiences across all digital channels."
        />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Portfolio Showcase Section */}
        <PortfolioVideoShowcase
          portfolioItems={portfolioData}
          autoplay={true}
        />

        {/* Social Platforms Carousel */}
        <SocialPlatformsCarousel />

        {/* Video Simulator Section */}
        <VideoSimulatorSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Contact Section */}
        <ContactSection />

        {/* Final CTA Section */}
        <FinalCTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
