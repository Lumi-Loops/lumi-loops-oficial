"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";

export function ContactSection() {
  return (
    <section
      id="contacto"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden py-20"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/videos/background-video/contact.mp4" type="video/mp4" />
        </video>
        {/* Light overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Gradient fade overlays - top and bottom (extended) */}
        <div className="pointer-events-none absolute top-0 left-0 h-48 w-full bg-gradient-to-b from-background via-background/80 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-full bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/20 px-5 py-2.5 shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white">
                Let&apos;s Get Started
              </span>
            </motion.div>

            <h2
              className="gradient-text-primary mb-6 text-4xl font-bold md:text-5xl"
              style={{
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
              }}
            >
              Ready to Transform Your Content?
            </h2>
            <p
              className="mx-auto max-w-2xl text-lg leading-relaxed text-white/90"
              style={{
                textShadow: "0 1px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              Fill out the form and we&apos;ll create a customized proposal for
              your video content needs
            </p>
          </motion.div>

          {/* Form Container with Glassmorphism */}
          <motion.div
            className="mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl md:p-16">
              {/* Form Header */}
              <div className="mb-10 text-center">
                <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                  Get Your Custom Proposal
                </h3>
                <div className="mx-auto flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-white/30" />
                  <span className="text-sm font-medium text-white/70">
                    Fill in your details
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/30 to-white/30" />
                </div>
              </div>

              <LeadForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
