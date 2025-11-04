"use client";

import React, { type ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MobileSimulator } from "./video-simulator/mobile-simulator";
import { PlatformInfo } from "./video-simulator/platform-info";
import type { SocialPlatform } from "./video-simulator/types";

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

const platformOrder: SocialPlatform[] = [
  "instagram",
  "tiktok",
  "youtube",
  "snapchat",
  "twitter",
  "facebook",
  "linkedin",
];

const platformColors: Record<SocialPlatform, string> = {
  youtube: "#FF0000",
  instagram: "#E4405F",
  tiktok: "#000000",
  linkedin: "#0077B5",
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  snapchat: "#FFFC00",
};

const getPlatformIcon = (platform: SocialPlatform) => {
  const iconProps = {
    className: "h-10 w-10",
    viewBox: "0 0 24 24",
    fill: "currentColor",
  };

  const icons: Record<SocialPlatform, ReactNode> = {
    youtube: (
      <svg {...iconProps}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    instagram: (
      <svg {...iconProps}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    tiktok: (
      <svg {...iconProps}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    linkedin: (
      <svg {...iconProps}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
    facebook: (
      <svg {...iconProps}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    twitter: (
      <svg {...iconProps}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    snapchat: (
      <svg {...iconProps}>
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.219.082.336-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z" />
      </svg>
    ),
  };

  return icons[platform];
};

const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  snapchat: "Snapchat",
  twitter: "Twitter",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

export function VideoSimulatorSection() {
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");

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
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column - Mobile Simulator */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-5 flex justify-center lg:justify-start"
            >
              <MobileSimulator platform={platform} />
            </motion.div>

            {/* Right Column - Controls and Info */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-7 space-y-16"
            >
              {/* Platform Selector - Minimalist Icons */}
              <div>
                <h3 className="text-foreground text-lg font-bold mb-2 tracking-wide">
                  Select Your Platform
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Select a platform to preview your video
                </p>
                <motion.div
                  variants={fadeInUp}
                  className="flex items-center justify-center lg:justify-start gap-8 flex-wrap"
                >
                  {platformOrder.map((p) => (
                    <motion.button
                      key={p}
                      onClick={() => setPlatform(p)}
                      style={
                        platform === p
                          ? { color: platformColors[p] }
                          : { color: "var(--color-primary)" }
                      }
                      className={`transition-all duration-300 ${
                        platform === p
                          ? "opacity-100"
                          : "opacity-60 hover:opacity-80"
                      }`}
                      title={platformLabels[p]}
                    >
                      {getPlatformIcon(p)}
                    </motion.button>
                  ))}
                </motion.div>
              </div>

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
