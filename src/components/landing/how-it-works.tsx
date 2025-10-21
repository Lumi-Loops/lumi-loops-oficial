"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";

import BentoGrid1 from "../mvpblocks/bento-grid-1";

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

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardStagger = {
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -100,
    scale: 0.8,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: index * 0.3,
      duration: 0.8,
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      mass: 0.8,
    },
  }),
};

const cardHover = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.4,
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const arrowVariants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    x: -20,
  },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      delay: index * 0.3 + 0.5,
      duration: 0.6,
      type: "spring" as const,
      stiffness: 200,
      damping: 12,
    },
  }),
};

const steps = [
  {
    number: "1",
    emoji: "📝",
    title: "Describe Your Idea",
    description:
      "Fill out a simple form or hop on a quick 15-min call. No tech skills needed.",
  },
  {
    number: "2",
    emoji: "✨",
    title: "We Create Magic",
    description:
      "We blend AI tools + human creativity to craft your perfect video — tailored to your brand and goals.",
  },
  {
    number: "3",
    emoji: "🚀",
    title: "Get It in 48h",
    description:
      "Receive platform-ready video. One revision included. Zero stress.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-background py-24"
      role="region"
      aria-labelledby="how-it-works-title"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-7xl text-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="mb-16 text-center">
            <motion.div
              className="bg-primary/10 border-primary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Sparkles className="text-primary h-4 w-4" />
              <span className="text-primary text-sm font-medium">
                Simple Process
              </span>
            </motion.div>

            <h2
              id="how-it-works-title"
              className="gradient-text-primary mb-4 text-4xl font-bold md:text-5xl"
            >
              How It Works
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Get scroll-stopping videos — without touching a single editing
              tool. Here&apos;s how simple it is.
            </p>
          </motion.div>

          {/* Steps Grid */}
          <motion.div
            className="relative grid gap-12 md:grid-cols-3 md:items-stretch md:gap-16"
            variants={cardStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step, index) => (
              <div key={step.number} className="relative h-full">
                <motion.div
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover="hover"
                  className="group relative h-full"
                >
                  <motion.div
                    variants={cardHover}
                    className="bg-card border-border/50 hover:border-primary/30 group-hover:shadow-primary/10 relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border p-8 pr-20 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:shadow-2xl md:min-h-[320px]"
                  >
                    {/* Patrón de fondo decorativo */}
                    <div className="absolute top-0 -right-1/2 z-0 size-full bg-[linear-gradient(to_right,#3d16165e_1px,transparent_1px),linear-gradient(to_bottom,#3d16165e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

                    {/* Número grande de fondo (estilo bento-grid) */}
                    <div className="text-primary/8 group-hover:text-primary/15 pointer-events-none absolute right-3 bottom-3 text-[100px] leading-none font-black transition-all duration-700 select-none">
                      {step.number}
                    </div>

                    {/* Contenido principal */}
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      {/* Sección superior */}
                      <div className="flex-shrink-0">
                        {/* Emoji Icon */}
                        <div className="mb-6">
                          <div className="bg-primary/10 text-primary shadow-primary/10 group-hover:bg-primary/20 group-hover:shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-full shadow transition-all duration-500">
                            <span
                              className="text-3xl"
                              role="img"
                              aria-label={step.title}
                            >
                              {step.emoji}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          <h3 className="text-foreground text-xl font-bold tracking-tight">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Barra decorativa inferior */}
                    <div className="from-primary to-primary/30 absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
                  </motion.div>
                </motion.div>

                {/* Flecha direccional */}
                {index < steps.length - 1 && (
                  <motion.div
                    custom={index}
                    variants={arrowVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="absolute z-20"
                  >
                    {/* Flecha hacia la derecha en desktop/tablet */}
                    <div className="absolute top-1/2 -right-8 hidden -translate-y-1/2 transform md:block lg:-right-12">
                      <div className="bg-primary/20 text-primary border-primary/30 animate-pulse rounded-full border p-3 shadow-lg backdrop-blur-sm">
                        <ArrowRight className="h-6 w-6" />
                      </div>
                    </div>

                    {/* Flecha hacia abajo en mobile */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform md:hidden">
                      <div className="bg-primary/20 text-primary border-primary/30 animate-pulse rounded-full border p-3 shadow-lg backdrop-blur-sm">
                        <ArrowDown className="h-6 w-6" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Separador con subtítulo para Bento Grid */}
          <motion.div variants={fadeInUp} className="mt-24 mb-12">
            {/* Línea decorativa superior */}
            <div className="relative mb-8 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="border-primary/20 w-full border-t"></div>
              </div>
              <div className="bg-background relative px-6">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/40 h-2 w-2 animate-pulse rounded-full"></div>
                  <div className="bg-primary/30 h-1.5 w-1.5 rounded-full"></div>
                  <div className="bg-primary/20 h-1 w-1 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Subtítulo */}
            <div className="space-y-3 text-center">
              <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
                What Makes Us Different
              </h3>
              <p className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg">
                The perfect blend of AI efficiency and human creativity
              </p>
            </div>
          </motion.div>

          <BentoGrid1 />

          {/* Bottom CTA Text */}
          <motion.div variants={fadeInUp} className="mt-16">
            <p className="text-muted-foreground text-lg">
              Ready to get started?{" "}
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
