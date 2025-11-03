"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle, Gift, Shield, TrendingUp, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

interface BentoGridItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
}

// Mapa de tamaños a clases de col-span
const GRID_SIZE_MAP = {
  large: "col-span-4",
  medium: "col-span-3",
  small: "col-span-2",
} as const;

const BentoGridItem = ({
  title,
  description,
  icon,
  className,
}: BentoGridItemProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={variants}
      className={cn(
        "group border-primary/10 bg-background hover:border-primary/30 relative flex h-full cursor-pointer flex-col justify-start overflow-hidden rounded-xl border px-8 pt-8 pb-10 shadow-md transition-all duration-500 md:min-h-[320px] lg:min-h-[380px]",
        className
      )}
    >
      <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,#3d16165e_1px,transparent_1px),linear-gradient(to_bottom,#3d16165e_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size:[24px_24px]"></div>

      <div className="text-primary absolute right-2 bottom-4 scale-[7] transition-all duration-700 group-hover:scale-[7.5]">
        {icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-start">
        <div>
          <div className="bg-primary/15 text-primary shadow-primary/15 group-hover:bg-primary/25 group-hover:shadow-primary/25 mb-6 flex h-14 w-14 items-center justify-center rounded-full shadow transition-all duration-500">
            {icon}
          </div>
          <h3 className="mb-4 text-2xl font-bold tracking-tight text-left lg:text-3xl">
            {title}
          </h3>
          <p className="text-muted-foreground text-base leading-relaxed text-left lg:text-lg">
            {description}
          </p>
        </div>
      </div>
      <div className="from-primary to-primary/30 absolute bottom-0 left-0 h-1 w-full bg-linear-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
    </motion.div>
  );
};

const items = [
  {
    title: "AI + Human Tools",
    description:
      "Google Flow • Banana • CapCut • Premiere Pro • Custom Scripts",
    icon: <Bot className="size-6" />,
    size: "large" as const,
  },
  {
    title: "No Robots Allowed",
    description:
      "Every video is reviewed, tweaked, and perfected by a human marketer — not an algorithm.",
    icon: <Shield className="size-6" />,
    size: "small" as const,
  },
  {
    title: "What You Get",
    description:
      "Scroll-stopping Shorts • Platform-ready formats • Subtitles included • Brand-aligned style",
    icon: <Gift className="size-6" />,
    size: "medium" as const,
  },
  {
    title: "100% Satisfaction",
    description: "No hidden fees • No contracts • No risk • No pressure",
    icon: <CheckCircle className="size-6" />,
    size: "medium" as const,
  },
  {
    title: "Fast & Reliable",
    description:
      "48h standard delivery • 24h rush option • Calendar sync • Real-time updates",
    icon: <Zap className="size-6" />,
    size: "small" as const,
  },
  {
    title: "Built for Growth",
    description:
      "Scalable • Customizable • Flexible • Easy to use • Easy to scale",
    icon: <TrendingUp className="size-6" />,
    size: "large" as const,
  },
];

export default function BentoGrid1() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div className="w-full px-4 py-12">
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            icon={item.icon}
            size={item.size}
            className={cn(GRID_SIZE_MAP[item.size || "small"], "h-full")}
          />
        ))}
      </motion.div>
    </div>
  );
}
