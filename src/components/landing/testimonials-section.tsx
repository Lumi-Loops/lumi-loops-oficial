"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { TestimonialsColumn } from "@/components/testimonials-columns-1";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

// Testimonials data - Column 1
const testimonialsColumn1 = [
  {
    text: "Lumi Loops transformed our social media presence. The videos they created weren't just beautiful—they actually converted. Our engagement went up 300% in the first month!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    name: "Sarah Martinez",
    role: "Marketing Director, TechFlow",
  },
  {
    text: "Finally, a service that gets it. No more wasting hours on tutorials or fighting with AI tools. I just describe what I need, and they deliver scroll-stopping content every time.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    name: "Michael Chen",
    role: "Founder, GrowthLab",
  },
  {
    text: "The difference between Lumi Loops and other AI tools? They actually understand marketing. Every video feels authentic, on-brand, and designed to convert—not just look pretty.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    name: "Jessica Thompson",
    role: "Social Media Manager, Bloom Co",
  },
  {
    text: "I was skeptical about outsourcing video creation, but Lumi Loops proved me wrong. Fast turnaround, real revisions, and videos that actually perform. Worth every penny.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    name: "David Rodriguez",
    role: "E-commerce Owner",
  },
];

// Testimonials data - Column 2
const testimonialsColumn2 = [
  {
    text: "Best investment we made this year. Our TikTok went from 0 to 50K followers in 3 months thanks to their content strategy and perfectly optimized videos.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    name: "Emily Watson",
    role: "Content Creator",
  },
  {
    text: "What I love most? They don't just deliver videos—they deliver results. Every piece is crafted with our brand voice and optimized for the platform. No more guesswork.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    name: "James Park",
    role: "CEO, FitLife",
  },
  {
    text: "Tried 5 different AI tools before finding Lumi Loops. The difference is night and day. Human touch + AI efficiency = videos that actually feel like us.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    name: "Amanda Foster",
    role: "Brand Manager, Luxe Beauty",
  },
  {
    text: "48-hour turnaround is no joke. They delivered exactly what we needed, when we needed it. Plus, the revision process was smooth and collaborative. Highly recommend!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    name: "Robert Kim",
    role: "Marketing Lead, StartupHub",
  },
];

// Testimonials data - Column 3
const testimonialsColumn3 = [
  {
    text: "Stop wasting money on subscriptions you don't use. Lumi Loops is straightforward: one price, amazing results, no hidden fees. Finally, transparency in video creation!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    name: "Lisa Anderson",
    role: "Freelance Consultant",
  },
  {
    text: "The videos they create don't just look good—they convert. Our click-through rate doubled, and our cost per acquisition dropped by 40%. That's real ROI.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    name: "Carlos Mendez",
    role: "Performance Marketer",
  },
  {
    text: "I needed videos for Instagram, TikTok, and YouTube Shorts. They formatted everything perfectly for each platform. No cropping issues, no text cutoffs—just professional content.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina",
    name: "Nina Patel",
    role: "Influencer & Coach",
  },
  {
    text: "Working with Lumi Loops feels like having an in-house video team—without the overhead. They're responsive, creative, and genuinely care about our success.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    name: "Tom Harrison",
    role: "VP Marketing, CloudTech",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonios"
      className="bg-background overflow-hidden py-24"
      role="region"
      aria-labelledby="testimonials-title"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="mb-16 text-center">
            <div className="mb-4 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <h2
              id="testimonials-title"
              className="mb-6 text-4xl font-bold tracking-tight md:text-5xl"
            >
              Loved by Creators & Brands
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
              Don&apos;t just take our word for it. Here&apos;s what real
              clients say about working with Lumi Loops.
            </p>
          </motion.div>

          {/* Testimonials Columns */}
          <div className="relative">
            {/* Gradient overlays for fade effect */}
            <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-32 w-full bg-gradient-to-b to-transparent" />
            <div className="from-background pointer-events-none absolute bottom-0 left-0 z-10 h-32 w-full bg-gradient-to-t to-transparent" />

            <div className="grid max-h-[600px] grid-cols-1 gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] md:grid-cols-2 lg:grid-cols-3">
              <TestimonialsColumn
                testimonials={testimonialsColumn1}
                duration={15}
              />
              <TestimonialsColumn
                testimonials={testimonialsColumn2}
                duration={19}
                className="hidden md:block"
              />
              <TestimonialsColumn
                testimonials={testimonialsColumn3}
                duration={17}
                className="hidden lg:block"
              />
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <p className="text-muted-foreground text-lg">
              Ready to join hundreds of satisfied clients?{" "}
              <button
                onClick={() => {
                  const element = document.querySelector("#contacto");
                  if (element) {
                    const navbarHeight = 64;
                    const elementPosition =
                      (element as HTMLElement).offsetTop - navbarHeight;
                    window.scrollTo({
                      top: Math.max(0, elementPosition),
                      behavior: "smooth",
                    });
                  }
                }}
                className="text-primary hover:text-primary/80 font-semibold underline decoration-2 underline-offset-4 transition-colors"
              >
                Let&apos;s create your first video
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
