"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { pricingPlans } from "./pricing-data";

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
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  },
};

export function PricingSection() {
  const handleCTAClick = () => {
    // Scroll to contact section
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

  return (
    <section
      id="pricing"
      className="bg-background py-24"
      role="region"
      aria-labelledby="pricing-title"
    >
      <div className="container mx-auto px-4">
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
                Pricing Plans
              </span>
            </motion.div>

            <h2
              id="pricing-title"
              className="gradient-text-primary mb-4 text-4xl font-bold md:text-5xl"
            >
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Choose the perfect plan for your AI video needs. From starter
              batches to complete video strategies — all with transparent
              pricing and no hidden fees.
            </p>
          </motion.div>

          {/* Pricing Cards Grid */}
          <motion.div
            variants={stagger}
            className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="relative h-full"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase shadow-lg">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`bg-card relative flex h-full flex-col overflow-hidden rounded-2xl border-2 p-8 shadow-lg transition-all duration-300 ${
                    plan.highlight
                      ? "border-primary shadow-primary/20 hover:shadow-primary/30 hover:shadow-2xl"
                      : "border-border/50 hover:border-primary/30 hover:shadow-xl"
                  } `}
                >
                  {/* Gradient overlay for popular card */}
                  {plan.highlight && (
                    <div className="from-primary/5 to-accent/5 absolute inset-0 bg-gradient-to-br opacity-50" />
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex flex-1 flex-col">
                    {/* Plan Name */}
                    <h3 className="text-foreground mb-2 text-2xl font-bold">
                      {plan.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 text-sm">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground text-5xl font-black tracking-tight">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-muted-foreground text-lg font-medium">
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="mb-8 flex-1 space-y-4">
                      {plan.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * idx, duration: 0.3 }}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.highlight ? "bg-primary/20" : "bg-primary/10"} `}
                          >
                            <Check
                              className={`h-3.5 w-3.5 ${plan.highlight ? "text-primary" : "text-primary/80"}`}
                              strokeWidth={3}
                            />
                          </div>
                          <span className="text-foreground text-sm leading-tight">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={handleCTAClick}
                      className={`w-full rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 ${
                        plan.highlight
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30 hover:shadow-primary/40 shadow-lg hover:scale-105 hover:shadow-xl"
                          : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-105"
                      } `}
                      aria-label={`${plan.cta} - ${plan.name} plan`}
                    >
                      {plan.cta}
                    </button>
                  </div>

                  {/* Decorative element for popular card */}
                  {plan.highlight && (
                    <div className="from-primary/20 absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br to-transparent blur-2xl" />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Note */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              All plans include commercial usage rights, subtitles, and
              premium-quality AI video delivery.{" "}
              <button
                onClick={handleCTAClick}
                className="text-primary hover:text-primary/80 font-semibold underline decoration-2 underline-offset-4 transition-colors"
              >
                Need a custom plan?
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
