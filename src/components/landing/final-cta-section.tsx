"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Star } from "lucide-react";

export function FinalCTASection() {
  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      const offset = 64;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background/50 via-background to-muted/20 py-20 md:py-24">
      {/* Top gradient overlay for smooth transition */}
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-background to-transparent" />

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent/5 absolute right-1/4 bottom-1/2 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Main Content */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="gradient-text-primary mb-6 text-3xl font-bold md:text-4xl">
              Join Hundreds of Satisfied Creators
            </h2>
            <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg">
              Don&apos;t let your content get lost in the noise. Start creating
              videos that actually convert.
            </p>

            {/* Stats Grid */}
            <div className="mb-12 grid gap-8 md:grid-cols-3">
              {/* Stat 1 */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Star className="text-primary h-8 w-8 fill-current" />
                </div>
                <div className="mb-2 text-4xl font-black">500+</div>
                <div className="text-muted-foreground text-sm">
                  Videos Delivered
                </div>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Clock className="text-primary h-8 w-8" />
                </div>
                <div className="mb-2 text-4xl font-black">48h</div>
                <div className="text-muted-foreground text-sm">
                  Average Delivery
                </div>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <CheckCircle className="text-primary h-8 w-8" />
                </div>
                <div className="mb-2 text-4xl font-black">98%</div>
                <div className="text-muted-foreground text-sm">
                  Client Satisfaction
                </div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button
                onClick={handleScrollToContact}
                className="bg-primary text-primary-foreground hover:bg-primary/90 group inline-flex items-center gap-2 rounded-lg px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-muted-foreground mt-4 text-sm">
                No credit card required • Free consultation
              </p>
            </motion.div>
          </motion.div>

          {/* Decorative separator */}
          <motion.div
            className="mt-16 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-border to-border" />
            <div className="flex gap-1">
              <div className="bg-primary/30 h-1.5 w-1.5 animate-pulse rounded-full" />
              <div
                className="bg-primary/30 h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="bg-primary/30 h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent via-border to-border" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
