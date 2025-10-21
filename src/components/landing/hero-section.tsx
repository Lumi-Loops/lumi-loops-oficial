"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Play } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Animation variants for smooth entrance
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export function HeroSection() {
  const scrollToContact = () => {
    const element = document.querySelector("#contacto");
    if (element) {
      const navbarHeight = 64;
      const elementPosition = (element as HTMLElement).offsetTop - navbarHeight;
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: "smooth",
      });
    }
  };

  const scrollToExamples = () => {
    const element = document.querySelector("#testimonios");
    if (element) {
      const navbarHeight = 64;
      const elementPosition = (element as HTMLElement).offsetTop - navbarHeight;
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source
            src="/videos/background-video/134863-760489732_small.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      </div>

      {/* Background Elements - Gradient blobs on top of video */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Animated gradient blobs */}
        <motion.div
          className="bg-primary/10 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="bg-accent/10 absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Trust Badge */}
            <motion.div
              variants={fadeInUp}
              className="flex justify-center lg:justify-start"
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium"
              >
                <CheckCircle className="text-primary mr-2 h-4 w-4" />
                Trusted by top brands worldwide
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={fadeInLeft} className="space-y-4">
              <h1 className="text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                <span className="block">Unlock Your</span>
                <span className="gradient-text-main block">
                  Business Potential
                </span>
                <span className="block">with Exclusive,</span>
                <span className="text-primary block">
                  Personalized Video Solutions
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={fadeInLeft}>
              <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed md:text-2xl">
                Tailored short videos and images crafted to attract quality
                leads and elevate your brand.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group bg-gradient-to-r px-8 py-6 text-lg"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={scrollToExamples}
                  className="group border-2 px-8 py-6 text-lg"
                >
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  See Examples
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Content */}
          <motion.div
            className="relative"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            {/* Video Background Container */}
            <div className="from-primary/10 to-accent/10 border-border/50 relative overflow-hidden rounded-2xl border bg-gradient-to-br shadow-2xl backdrop-blur-sm">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                {/* Placeholder for video - using Unsplash image as fallback */}
                <div className="relative h-full w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Professional video production workspace"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Video overlay */}
                  <div className="from-primary/20 absolute inset-0 bg-gradient-to-t to-transparent" />

                  {/* Play button overlay for video preview */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="bg-background/90 cursor-pointer rounded-full p-6 shadow-lg backdrop-blur-sm">
                      <Play className="text-primary h-8 w-8" />
                    </div>
                  </motion.div>
                </div>
              </AspectRatio>
            </div>

            {/* Floating elements */}
            <motion.div
              className="bg-background/95 border-border/50 absolute -top-6 -right-6 rounded-xl border p-4 shadow-lg backdrop-blur-sm"
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm font-medium">Live Production</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-background/95 border-border/50 absolute -bottom-6 -left-6 rounded-xl border p-4 shadow-lg backdrop-blur-sm"
              animate={{
                y: [10, -10, 10],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="text-sm font-semibold">Quality Focus</div>
                  <div className="text-muted-foreground text-xs">
                    Premium Results
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="border-muted-foreground/50 flex h-10 w-6 justify-center rounded-full border-2">
          <div className="bg-muted-foreground/50 mt-2 h-3 w-1 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
