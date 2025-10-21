"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <div className="mb-12 text-center">
            <h1 className="gradient-text-primary mb-4 text-4xl font-bold md:text-5xl">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-lg md:p-12">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              If you have any questions about this document, please{" "}
              <Link
                href="/#contacto"
                className="text-primary hover:underline font-medium"
              >
                contact us
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
