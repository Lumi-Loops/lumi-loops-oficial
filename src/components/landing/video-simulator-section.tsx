"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Sparkles, Youtube } from "lucide-react";
import { MobileSimulator } from "./video-simulator/mobile-simulator";
import { PlatformInfo } from "./video-simulator/platform-info";
import type { SocialPlatform } from "./video-simulator/types";
import { TiktokIcon } from "./video-simulator/icons/tiktok-icon";

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

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function VideoSimulatorSection() {
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");

  const platforms: Array<{
    name: SocialPlatform;
    icon: React.ReactNode;
    label: string;
  }> = [
    {
      name: "instagram",
      icon: <Instagram className="w-6 h-6" />,
      label: "Instagram",
    },
    {
      name: "tiktok",
      icon: <TiktokIcon className="w-6 h-6" />,
      label: "TikTok",
    },
    {
      name: "youtube",
      icon: <Youtube className="w-6 h-6" />,
      label: "YouTube",
    },
    {
      name: "snapchat",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.065.033c6.259 0 6.386 6.218 6.386 6.218 0 2.096.881 3.325 2.237 3.325 1.356 0 2.236-1.229 2.236-3.325 0-6.342-5.045-9.251-10.859-9.251C5.045-2.44 0 .658 0 6.576c0 2.096.88 3.325 2.236 3.325 1.356 0 2.237-1.229 2.237-3.325 0 0 .127-6.218 6.386-6.218zm8.534 10.777h.005c.92 0 1.667.779 1.667 1.738 0 .958-.746 1.737-1.667 1.737-.92 0-1.667-.779-1.667-1.737 0-.959.746-1.738 1.667-1.738zM1.733 21.286c-.92 0-1.667-.779-1.667-1.737 0-.958.746-1.737 1.667-1.737.92 0 1.667.779 1.667 1.737 0 .958-.746 1.737-1.667 1.737z" />
        </svg>
      ),
      label: "Snapchat",
    },
    {
      name: "twitter",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.1-6.694-5.867 6.694h-3.306l7.73-8.835L2.564 2.25h6.794l4.6 6.088 5.313-6.088zM17.002 18.807h1.791L5.97 3.556H4.05l12.952 15.251z" />
        </svg>
      ),
      label: "Twitter",
    },
    {
      name: "facebook",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      label: "Facebook",
    },
    {
      name: "linkedin",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
      ),
      label: "LinkedIn",
    },
  ];

  return (
    <section
      id="video-simulator"
      className="relative min-h-screen bg-background py-24 overflow-hidden"
      role="region"
      aria-labelledby="video-simulator-title"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-7xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="mb-20 text-center">
            <motion.div
              className="bg-primary/10 border-primary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Sparkles className="text-primary h-4 w-4" />
              <span className="text-primary text-sm font-medium">
                Interactive Simulator
              </span>
            </motion.div>

            <h2
              id="video-simulator-title"
              className="gradient-text-primary mb-4 text-4xl font-bold md:text-5xl"
            >
              See Your Video on Every Platform
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
              Visualize how your vertical videos render across different social
              media platforms. Experience the UI, format, and interaction
              patterns unique to each platform.
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left Column - Mobile Simulator */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-5 flex justify-center lg:justify-start"
            >
              <MobileSimulator platform={platform} />
            </motion.div>

            {/* Right Column - Controls and Info */}
            <motion.div variants={fadeInUp} className="lg:col-span-7 space-y-8">
              {/* Platform Selector */}
              <motion.div
                variants={fadeInUp}
                className="bg-card/40 border border-border/50 backdrop-blur-sm rounded-2xl p-8"
              >
                <h3 className="text-foreground text-lg font-bold mb-6">
                  Select Platform
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                  {platforms.map((p) => (
                    <motion.button
                      key={p.name}
                      onClick={() => setPlatform(p.name)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                        platform === p.name
                          ? "bg-primary/20 border-2 border-primary text-primary shadow-lg shadow-primary/20"
                          : "bg-secondary/30 border-2 border-transparent text-muted-foreground hover:bg-secondary/50 hover:border-primary/30"
                      }`}
                    >
                      {p.icon}
                      <span className="text-xs font-semibold text-center">
                        {p.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Platform Info */}
              <motion.div variants={fadeInUp}>
                <PlatformInfo platform={platform} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="mt-20 text-center">
            <p className="text-muted-foreground text-lg mb-6">
              Ready to create your platform-optimized videos?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-primary/30"
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
