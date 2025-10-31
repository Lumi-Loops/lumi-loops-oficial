"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Ban, Clapperboard, Sparkles, Play, Pause } from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const benefits = [
  {
    title: "Truly Custom",
    description:
      "Every video is crafted from scratch based on your specific brand, goals, and audience.",
  },
  {
    title: "AI + Human Creativity",
    description:
      "We combine cutting-edge AI tools with human creativity and strategic thinking.",
  },
  {
    title: "Zero Tech Hassle",
    description:
      "No software to learn, no editing skills needed. Just describe your vision and we handle everything.",
  },
  {
    title: "Platform-Ready",
    description:
      "Videos optimized for each social platform's specific requirements and algorithms.",
  },
  {
    title: "Fast Turnaround",
    description:
      "Get your professional video in 48 hours with one revision included.",
  },
  {
    title: "Strategic Approach",
    description:
      "We don't just create videos—we create content that converts and drives results.",
  },
];

const checkmarks = [
  "You're not hiring a tool — you're hiring a creative partner.",
  "You're not getting generic content — you're getting brand-tailored magic.",
  "You're not wasting time learning software — you're focusing on growing your business.",
];

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed && videoRef.current) {
          // Reproducir automáticamente cuando entra en viewport
          videoRef.current.play();
          setIsPlaying(true);
          setHasPlayed(true);
        } else if (!entry.isIntersecting && videoRef.current) {
          // Pausar cuando sale del viewport
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasPlayed]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      variants={fadeInRight}
      className="relative lg:order-last"
    >
      <div className="from-primary/10 to-accent/10 border-border/50 relative overflow-hidden rounded-2xl border bg-gradient-to-br shadow-2xl backdrop-blur-sm">
        <div className="bg-muted relative aspect-[9/16]">
          <video
            ref={videoRef}
            src="/videos/why-choose-us/why-choose-us.mp4"
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            aria-label="Video showcasing the creative process and professional quality that Lumi Loops provides"
          />
          {/* Subtle overlay for better text contrast if needed */}
          <div className="from-primary/20 absolute inset-0 bg-gradient-to-t to-transparent" />

          {/* Play/Pause Button */}
          <motion.button
            onClick={handlePlayPause}
            className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 border border-white/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white fill-white" />
            ) : (
              <Play className="h-5 w-5 text-white fill-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Floating Badge - Bottom Left */}
      <motion.div
        className="bg-background/95 border-border/50 absolute -bottom-6 -left-6 rounded-xl border p-4 shadow-lg backdrop-blur-sm"
        animate={{
          y: [10, -10, 10],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
          <div>
            <div className="text-foreground text-sm font-semibold">
              Human + AI
            </div>
            <div className="text-muted-foreground text-xs">
              Creative Partnership
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Badge - Top Right */}
      <motion.div
        className="bg-background/95 border-border/50 absolute -top-6 -right-6 rounded-xl border p-4 shadow-lg backdrop-blur-sm"
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚡</div>
          <span className="text-sm font-semibold">48h Delivery</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WhyChooseUs() {
  const bannerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });

  // Animaciones para el banner con efecto zoom parallax
  // Aparece: 0-0.4, Se mantiene: 0.4-0.6, Desaparece: 0.6-0.85
  const bannerScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 0.85],
    [0.7, 1.1, 1.1, 0.7]
  );
  const bannerOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.85],
    [0, 1, 1, 0]
  );
  const bannerY = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 0.85],
    ["30vh", "0vh", "0vh", "-50vh"]
  );
  const backdropOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.85],
    [0, 0.95, 0.95, 0]
  );

  return (
    <section
      id="why-choose-us"
      className="bg-background py-24"
      role="region"
      aria-labelledby="why-choose-us-title"
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
                Why Choose Us
              </span>
            </motion.div>

            <h2
              id="why-choose-us-title"
              className="gradient-text-primary mb-4 text-4xl font-bold md:text-5xl"
            >
              Why Choose Lumi Loops?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
              You&apos;re not just getting AI — you&apos;re getting a creative
              partner who understands your brand, your goals, and what makes
              your audience click &quot;share.&quot;
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <motion.div variants={fadeInLeft} className="space-y-8">
              {/* Benefits List */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    variants={fadeInUp}
                    className="flex items-start gap-4"
                  >
                    <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-foreground mb-2 text-lg font-semibold">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Testimonial */}
              <motion.div
                variants={fadeInUp}
                className="from-primary/5 to-accent/5 border-l-primary/30 rounded-lg border-l-4 bg-gradient-to-r p-6 shadow-sm"
              >
                <blockquote className="text-foreground mb-4 text-lg leading-relaxed italic">
                  &quot;Working with Lumi Loops transformed our social media
                  presence. They didn&apos;t just create videos—they created a
                  visual language that our audience instantly connected with.
                  Our engagement went up 300% in the first month.&quot;
                </blockquote>
                <cite className="text-muted-foreground flex items-center gap-3 text-sm font-medium not-italic">
                  <div className="from-primary/20 to-accent/20 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br">
                    <span className="text-primary font-semibold">SM</span>
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">
                      Sarah Martinez
                    </div>
                    <div>Marketing Director, TechFlow Solutions</div>
                  </div>
                </cite>
              </motion.div>

              {/* Triple Checkmarks */}
              <motion.div variants={fadeInUp} className="space-y-3">
                {checkmarks.map((text, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span
                      className="text-primary text-lg"
                      role="img"
                      aria-label="checkmark"
                    >
                      ✅
                    </span>
                    <p className="text-foreground leading-relaxed font-medium">
                      {text}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Video */}
            <VideoPlayer />
          </div>
        </motion.div>
      </div>

      {/* Zoom Parallax Banner Section */}
      <div ref={bannerRef} className="relative mt-20 h-[80vh]">
        {/* Fondo glassmorphism con fixed position */}
        <motion.div
          style={{ opacity: backdropOpacity }}
          className="pointer-events-none fixed inset-0 z-40"
        >
          <div className="bg-background/90 absolute inset-0 backdrop-blur-2xl" />
          <div className="from-primary/15 via-accent/10 to-background/60 absolute inset-0 bg-gradient-to-br" />
        </motion.div>

        {/* Banner con zoom y parallax desde abajo */}
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            style={{
              scale: bannerScale,
              opacity: bannerOpacity,
              y: bannerY,
            }}
            className="relative"
          >
            {/* Efecto de resplandor */}
            <motion.div
              animate={{
                scale: [0.9, 1.1, 0.9],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-primary/20 absolute inset-0 rounded-3xl blur-3xl"
            />

            {/* Contenido del banner - Sin fondo, solo texto */}
            <div className="relative mx-auto max-w-5xl px-6 md:px-12">
              <div className="relative space-y-4 text-center md:space-y-6">
                {/* Primera oración - Con sombra pronunciada */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center justify-center gap-4 md:gap-5"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Ban
                      className="text-primary h-10 w-10 md:h-14 md:w-14 lg:h-16 lg:w-16"
                      strokeWidth={2.5}
                      style={{
                        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
                      }}
                    />
                  </motion.div>
                  <h2
                    className="text-2xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
                    style={{
                      textShadow:
                        "0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
                    }}
                  >
                    No more robotic AI videos
                  </h2>
                </motion.div>

                {/* Separador minimalista */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="via-primary/60 mx-auto h-px w-24 bg-gradient-to-r from-transparent to-transparent md:w-32"
                />

                {/* Segunda oración - Con Whip In Up y sombra destacada */}
                <motion.div
                  initial={{ opacity: 0, y: 50, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3,
                    ease: [0.34, 1.56, 0.64, 1], // Whip effect
                  }}
                  className="flex items-center justify-center gap-4 md:gap-5"
                >
                  <motion.div
                    animate={{
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <Clapperboard
                      className="text-accent h-10 w-10 md:h-14 md:w-14 lg:h-16 lg:w-16"
                      strokeWidth={2.5}
                      style={{
                        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
                      }}
                    />
                  </motion.div>
                  <h3
                    className="text-2xl font-semibold text-white/95 italic md:text-4xl lg:text-5xl"
                    style={{
                      fontFamily: "'Georgia', 'Palatino', serif",
                      letterSpacing: "0.01em",
                    }}
                  >
                    <motion.span
                      animate={{
                        textShadow: [
                          "0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.3)",
                          "0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.5)",
                          "0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.3)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      Only human-crafted magic
                    </motion.span>
                  </h3>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
