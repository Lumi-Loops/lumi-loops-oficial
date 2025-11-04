"use client";

import { motion } from "framer-motion";
import { addOns } from "./pricing-data";
import { ChevronDown, Edit, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";

const iconMap = {
  Edit,
  Zap,
  RefreshCw,
};

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function AddOnsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-5xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <h2 className="gradient-text-primary mb-4 text-3xl font-bold md:text-4xl">
              Add-ons & Optional Services
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Enhance your package with flexible add-ons tailored to your needs.
            </p>
          </motion.div>

          {/* Add-ons Grid */}
          <div className="space-y-4">
            {addOns.map((addon, index) => {
              const IconComponent =
                iconMap[addon.icon as keyof typeof iconMap] || Edit;
              const isExpanded = expandedIndex === index;

              return (
                <motion.div
                  key={addon.name}
                  variants={itemVariants}
                  className="group"
                >
                  <div
                    onClick={() => toggleExpanded(index)}
                    className="bg-card border-border/50 hover:border-primary/30 cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 items-start gap-4">
                        {/* Icon */}
                        <div className="bg-primary/10 rounded-lg p-3 text-primary">
                          <IconComponent className="h-6 w-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                            <h3 className="text-foreground text-lg font-bold">
                              {addon.name}
                            </h3>
                            <span className="text-primary text-xl font-bold">
                              {addon.price}
                              {addon.price !== "Custom Quote" && " per round"}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {addon.description}
                          </p>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="text-muted-foreground h-5 w-5" />
                      </motion.div>
                    </div>

                    {/* Expanded Details */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: isExpanded ? "auto" : 0,
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-border/30 border-t pt-4 mt-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {addon.details}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Note */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              All add-ons are optional and can be combined with any package.
              Contact us to customize your order.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
