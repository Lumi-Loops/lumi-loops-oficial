"use client";

import { motion } from "framer-motion";
import {
  Clock,
  DollarSign,
  Heart,
  Palette,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

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
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  },
};

const benefits = [
  {
    icon: Zap,
    title: "Zero Learning Curve — Just Describe, We Deliver",
    description:
      "No more tutorials. No more confusing dashboards. Just describe your idea in plain English — we turn it into a video that converts.",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/10",
    iconColor: "text-yellow-600",
  },
  {
    icon: Heart,
    title: "Human-Curated, Not AI-Generated Garbage",
    description:
      "We use AI as a tool — not as the editor. Every frame is reviewed, tweaked, and polished by a human who understands marketing and emotion.",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    iconColor: "text-pink-600",
  },
  {
    icon: Palette,
    title: "Brand-Aligned & Emotionally Engaging",
    description:
      "Your brand voice, colors, vibe — baked into every video. We don't just edit; we make your audience *feel* something.",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    icon: Smartphone,
    title: "Platform-Perfect Formatting",
    description:
      "TikTok? Reels? Shorts? We format, resize, subtitle, and optimize for each platform — so your video looks native everywhere.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: DollarSign,
    title: "Save Time + Money",
    description:
      "Stop paying for 'credits' you don't use or tools that overpromise. One flat price. No hidden fees. Just results.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    icon: Clock,
    title: "Fast, Reliable & Stress-Free",
    description:
      "Get your video in 48h — and if something's off, we fix it. Human-to-human. No chatbots. Just peace of mind.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-600",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="beneficios"
      className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/5 py-24"
      role="region"
      aria-labelledby="benefits-title"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size:[24px_24px]" />

      <div className="relative container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-7xl"
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
                Key Benefits
              </span>
            </motion.div>

            <h2
              id="benefits-title"
              className="gradient-text-primary mb-4 text-4xl font-bold md:text-5xl"
            >
              Why Clients Love Working With Us
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
              Because we take the headache out of video creation — and replace
              it with scroll-stopping, brand-aligned videos that actually
              convert.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={stagger}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3 },
                  }}
                  className="group relative"
                >
                  <div className="bg-card border-border/50 hover:border-primary/30 hover:shadow-primary/10 relative h-full overflow-hidden rounded-2xl border p-8 shadow-lg transition-all duration-500 hover:shadow-2xl">
                    {/* linear overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${benefit.color} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                    />

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div
                        className={`${benefit.bgColor} inline-flex rounded-2xl p-4 transition-all duration-500 group-hover:scale-110`}
                      >
                        <Icon
                          className={`h-8 w-8 ${benefit.iconColor}`}
                          strokeWidth={2}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-foreground mb-4 text-xl leading-tight font-bold">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>

                    {/* Decorative corner element */}
                    <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-linear-to-br from-primary/10 to-accent/10 blur-2xl transition-all duration-500 group-hover:scale-150" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Closing Statement */}
          <motion.div variants={fadeInUp} className="mt-20 text-center">
            <div className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-accent/10 to-primary/10 p-8 shadow-xl backdrop-blur-sm md:p-12">
              <p className="text-foreground mb-4 text-2xl leading-tight font-bold md:text-3xl">
                Other tools give you templates.
              </p>
              <p className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">
                We give you your brand&apos;s voice, amplified.
              </p>

              {/* Decorative line */}
              <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-linear-to-r from-primary to-accent" />

              {/* Subtext */}
              <p className="text-muted-foreground mt-6 text-base md:text-lg">
                Stop wrestling with AI. Start getting videos that work.
              </p>
            </div>
          </motion.div>

          {/* Optional: Social Proof Counter */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {[
              { number: "500+", label: "Videos Created" },
              { number: "48h", label: "Average Delivery" },
              { number: "98%", label: "Client Satisfaction" },
            ].map((stat, idx) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx, duration: 0.5 }}
                  className="text-primary mb-2 text-4xl font-black md:text-5xl"
                >
                  {stat.number}
                </motion.div>
                <div className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
