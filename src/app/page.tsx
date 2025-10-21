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
import { SocialPlatformsCarousel } from "@/components/landing/social-platforms-carousel";
import {
  PortfolioVideoShowcase,
  portfolioData,
} from "@/components/landing/portfolio-video-showcase";
import { ZoomParallax } from "@/components/zoom-parallax";

// Datos para el componente ZoomParallax
const parallaxImages = [
  {
    src: "https://i.pinimg.com/1200x/a5/a2/b1/a5a2b1c1711119018a3fb2335181c2ae.jpg",
    alt: "Video editing",
    title: "Intelligent Editing",
    description: "Intelligent AI that optimizes every frame automatically",
    orientation: "horizontal" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=700&q=80",
    alt: "AI Processing",
    title: "AI Processing",
    description: "Advanced algorithms for professional results",
    orientation: "vertical" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80",
    alt: "Fast rendering",
    title: "Fast Rendering",
    description: "Videos ready in minutes, not hours",
    orientation: "vertical" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=700&q=80",
    alt: "Creative content",
    title: "Creative Content",
    description: "Transform ideas into impactful videos",
    orientation: "horizontal" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80",
    alt: "Automated workflow",
    title: "Automated Workflow",
    description: "From concept to publication without complications",
    orientation: "vertical" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&q=80",
    alt: "Social media ready",
    title: "Social Media Ready",
    description: "Optimized for all platforms",
    orientation: "horizontal" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&q=80",
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
        <ZoomParallax images={parallaxImages} showLogo={true} />

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

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
