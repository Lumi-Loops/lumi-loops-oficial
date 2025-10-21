"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";

export function ContactSection() {
  return (
    <section
      id="contacto"
      className="from-background via-background to-accent/5 relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br py-20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-primary/10 border-primary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Sparkles className="text-primary h-4 w-4" />
              <span className="text-primary text-sm font-medium">
                Let&apos;s Get Started
              </span>
            </motion.div>

            <h2 className="gradient-text-primary mb-4 text-4xl font-bold md:text-5xl">
              Ready to Transform Your Content?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Fill out the form below and we&apos;ll create a customized
              proposal for your video content needs
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="bg-card border-border rounded-2xl border p-8 shadow-xl md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <LeadForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
