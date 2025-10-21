"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Facebook,
  Instagram,
  Sparkles,
  Volume2,
  VolumeX,
  Youtube,
} from "lucide-react";

// TikTok Icon Component (Lucide doesn't have it)
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
}

interface PortfolioItem {
  videoSrc: string;
  title: string;
  subtitle: string;
  description: string;
  platforms: SocialPlatform[];
}

interface PortfolioVideoShowcaseProps {
  portfolioItems: PortfolioItem[];
  autoplay?: boolean;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return (
    minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
  );
}

export const PortfolioVideoShowcase = ({
  portfolioItems,
  autoplay = true,
}: PortfolioVideoShowcaseProps) => {
  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isMuted, setIsMuted] = useState(true);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const portfolioLength = useMemo(
    () => portfolioItems.length,
    [portfolioItems]
  );
  const activeItem = useMemo(
    () => portfolioItems[activeIndex],
    [activeIndex, portfolioItems]
  );

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (videoContainerRef.current) {
        setContainerWidth(videoContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Video playback control
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.muted = isMuted;
        if (index === activeIndex) {
          video.currentTime = 0;
          video.play().catch(() => {
            // Autoplay might be blocked, that's okay
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [activeIndex, isMuted]);

  // Handle video end - advance to next video automatically
  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo) return;

    const handleVideoEnd = () => {
      if (autoplay) {
        setActiveIndex((prev) => (prev + 1) % portfolioLength);
      }
    };

    activeVideo.addEventListener("ended", handleVideoEnd);
    return () => {
      activeVideo.removeEventListener("ended", handleVideoEnd);
    };
  }, [activeIndex, autoplay, portfolioLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, portfolioLength]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % portfolioLength);
  }, [portfolioLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + portfolioLength) % portfolioLength);
  }, [portfolioLength]);

  // Touch/Swipe handlers for mobile
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        handleNext();
      } else {
        // Swipe right - prev
        handlePrev();
      }
    }
  };

  // Compute transforms for each video (always show 3: left, center, right)
  function getVideoStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft =
      (activeIndex - 1 + portfolioLength) % portfolioLength === index;
    const isRight = (activeIndex + 1) % portfolioLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.6,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.6,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    // Hide all other videos
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  // Framer Motion variants
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section className="bg-background pt-12 pb-8 md:pt-16 md:pb-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
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
                Our Portfolio
              </span>
            </motion.div>

            <h2 className="gradient-text-primary mb-4 text-4xl font-bold md:text-5xl">
              Our Work in Action
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Real projects, real results. See how we transform ideas into
              scroll-stopping content.
            </p>
          </motion.div>

          {/* Separador sutil */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mb-12 flex items-center justify-center"
          >
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
          </motion.div>

          {/* Swipe Hint - Above video on mobile only */}
          <div className="swipe-hint-container md:hidden">
            <p className="swipe-hint-text">Swipe to see more</p>
            <div className="swipe-hint-arrows">
              <span>←</span>
              <span>→</span>
            </div>
          </div>

          <div className="portfolio-grid">
            {/* Videos Container */}
            <div
              className="video-container"
              ref={videoContainerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {portfolioItems.map((item, index) => (
                <div
                  key={item.videoSrc}
                  className="video-wrapper"
                  style={getVideoStyle(index)}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={item.videoSrc}
                    muted={isMuted}
                    playsInline
                    className="portfolio-video"
                    poster={`${item.videoSrc}#t=0.1`}
                  />

                  {/* Overlay gradient */}
                  <div className="video-overlay" />
                </div>
              ))}

              {/* Audio Control Button - Positioned absolutely over active video */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="audio-control-button"
                aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
                title={isMuted ? "Activar audio" : "Silenciar audio"}
                style={{
                  opacity: 1,
                  visibility: "visible",
                  display: "flex",
                }}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="portfolio-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="content-wrapper"
                >
                  {/* Title */}
                  <h3 className="text-foreground mb-2 text-xl font-bold tracking-tight md:text-2xl">
                    {activeItem.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-primary mb-3 text-sm font-semibold md:text-base">
                    {activeItem.subtitle}
                  </p>

                  {/* Description with word animation */}
                  <motion.p className="text-muted-foreground mb-4 text-sm leading-relaxed md:text-base">
                    {activeItem.description.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{
                          filter: "blur(10px)",
                          opacity: 0,
                          y: 5,
                        }}
                        animate={{
                          filter: "blur(0px)",
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.22,
                          ease: "easeInOut",
                          delay: 0.025 * i,
                        }}
                        style={{ display: "inline-block" }}
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                  </motion.p>

                  {/* Social Platforms */}
                  <div className="platforms-container">
                    <p className="text-muted-foreground mb-2 text-xs font-medium md:text-sm">
                      Optimized for:
                    </p>
                    <div className="platforms-icons">
                      {activeItem.platforms.map((platform, idx) => (
                        <motion.div
                          key={platform.name}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * idx, duration: 0.3 }}
                          className="platform-icon"
                          title={platform.name}
                        >
                          {platform.icon}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows - Hidden on mobile */}
              <div className="arrow-buttons hidden md:flex">
                <button
                  className="arrow-button"
                  onClick={handlePrev}
                  onMouseEnter={() => setHoverPrev(true)}
                  onMouseLeave={() => setHoverPrev(false)}
                  aria-label="Previous project"
                  style={{
                    backgroundColor: hoverPrev
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                  }}
                >
                  <ArrowLeft
                    className="h-5 w-5"
                    style={{
                      color: hoverPrev
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--foreground))",
                    }}
                  />
                </button>
                <button
                  className="arrow-button"
                  onClick={handleNext}
                  onMouseEnter={() => setHoverNext(true)}
                  onMouseLeave={() => setHoverNext(false)}
                  aria-label="Next project"
                  style={{
                    backgroundColor: hoverNext
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                  }}
                >
                  <ArrowRight
                    className="h-5 w-5"
                    style={{
                      color: hoverNext
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--foreground))",
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Progress Indicators - Below video on mobile */}
            <div className="progress-indicators-mobile md:hidden">
              {portfolioItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                  className="progress-dot"
                  aria-label={`Go to project ${index + 1}`}
                  style={{
                    backgroundColor:
                      index === activeIndex
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                    transform:
                      index === activeIndex ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Indicators - Desktop only */}
          <div className="progress-indicators-desktop hidden md:flex">
            {portfolioItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                }}
                className="progress-dot"
                aria-label={`Go to project ${index + 1}`}
                style={{
                  backgroundColor:
                    index === activeIndex
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                  transform: index === activeIndex ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .portfolio-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .video-container {
          position: relative;
          width: 100%;
          max-width: 280px;
          margin: 0 auto;
          aspect-ratio: 9 / 16;
          perspective: 1000px;
        }
        .video-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .portfolio-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
          pointer-events: none;
        }
        .audio-control-button {
          position: absolute !important;
          top: 1rem !important;
          right: 1rem !important;
          z-index: 9999 !important;
          width: 2.75rem !important;
          height: 2.75rem !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(0, 0, 0, 0.8) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: 2px solid rgba(255, 255, 255, 0.4) !important;
          color: white !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
          pointer-events: auto !important;
          transform: none !important;
        }
        .audio-control-button:hover {
          background: rgba(0, 0, 0, 0.95) !important;
          transform: scale(1.1) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6) !important;
          border-color: rgba(255, 255, 255, 0.6) !important;
        }
        .audio-control-button:active {
          transform: scale(1) !important;
        }
        .portfolio-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .content-wrapper {
          flex: 1;
        }
        .platforms-container {
          margin-top: 1rem;
        }
        .platforms-icons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .platform-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: hsl(var(--primary) / 0.1);
          color: hsl(var(--primary));
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .platform-icon:hover {
          background: hsl(var(--primary) / 0.2);
          transform: translateY(-4px);
        }
        .arrow-buttons {
          display: none;
          gap: 0.75rem;
          padding-top: 1rem;
        }
        .arrow-button {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid hsl(var(--border));
        }
        .arrow-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
        }
        .swipe-hint-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.75rem;
          opacity: 0.7;
        }
        .swipe-hint-text {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
          text-align: center;
        }
        .swipe-hint-arrows {
          display: flex;
          gap: 0.75rem;
          font-size: 1.25rem;
          color: hsl(var(--primary));
          animation: swipe-pulse 2s ease-in-out infinite;
        }
        @keyframes swipe-pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: translateX(0);
          }
          50% {
            opacity: 1;
            transform: translateX(3px);
          }
        }
        .progress-indicators-mobile {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-bottom: 0.5rem;
        }
        .progress-indicators-desktop {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }
        .progress-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .progress-dot:hover {
          transform: scale(1.3) !important;
        }
        @media (min-width: 768px) {
          .swipe-hint-container {
            display: none !important;
          }
          .portfolio-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
            align-items: center;
          }
          .video-container {
            max-width: 320px;
          }
          .arrow-buttons {
            padding-top: 0;
            display: flex !important;
          }
        }
        @media (min-width: 1024px) {
          .portfolio-grid {
            gap: 3rem;
          }
          .video-container {
            max-width: 360px;
          }
        }
        @media (min-width: 1280px) {
          .video-container {
            max-width: 400px;
          }
        }
      `}</style>
    </section>
  );
};

// Sample data with videos from public/videos
export const portfolioData: PortfolioItem[] = [
  {
    videoSrc: "/videos/video-01.mp4",
    title: "Product Launch Campaign",
    subtitle: "E-commerce Brand • Instagram Reels",
    description:
      "High-energy product showcase designed to stop the scroll and drive conversions. Optimized for Instagram's algorithm with trending audio and dynamic transitions.",
    platforms: [
      { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
      { name: "Facebook", icon: <Facebook className="h-5 w-5" /> },
    ],
  },
  {
    videoSrc: "/videos/video-02.mp4",
    title: "Brand Storytelling Series",
    subtitle: "Lifestyle Brand • TikTok & YouTube Shorts",
    description:
      "Authentic behind-the-scenes content that builds emotional connection with the audience. Crafted to maximize watch time and engagement across platforms.",
    platforms: [
      { name: "TikTok", icon: <TiktokIcon className="h-5 w-5" /> },
      { name: "YouTube", icon: <Youtube className="h-5 w-5" /> },
      { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
    ],
  },
  {
    videoSrc: "/videos/video-03.mp4",
    title: "Service Explainer Video",
    subtitle: "SaaS Company • Multi-Platform",
    description:
      "Clear, concise explanation of complex services with engaging visuals. Designed to educate and convert viewers into customers across all major platforms.",
    platforms: [
      { name: "YouTube", icon: <Youtube className="h-5 w-5" /> },
      { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
      { name: "Facebook", icon: <Facebook className="h-5 w-5" /> },
      { name: "TikTok", icon: <TiktokIcon className="h-5 w-5" /> },
    ],
  },
  {
    videoSrc: "/videos/video-4.mp4",
    title: "Testimonial Highlight",
    subtitle: "Health & Wellness • Instagram Stories",
    description:
      "Authentic customer testimonial transformed into engaging short-form content. Perfect for building trust and social proof with potential clients.",
    platforms: [
      { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
      { name: "Facebook", icon: <Facebook className="h-5 w-5" /> },
    ],
  },
  {
    videoSrc: "/videos/video-05.mp4",
    title: "Event Recap Highlights",
    subtitle: "Corporate Event • LinkedIn & YouTube",
    description:
      "Professional event coverage condensed into shareable moments. Captures the energy and key takeaways to extend event reach beyond attendees.",
    platforms: [
      { name: "YouTube", icon: <Youtube className="h-5 w-5" /> },
      { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
    ],
  },
  {
    videoSrc: "/videos/video-06.mp4",
    title: "Promotional Teaser",
    subtitle: "Fashion Brand • TikTok Viral",
    description:
      "Trend-focused teaser designed to create buzz and anticipation. Leverages viral editing techniques and music to maximize organic reach.",
    platforms: [
      { name: "TikTok", icon: <TiktokIcon className="h-5 w-5" /> },
      { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
      { name: "YouTube", icon: <Youtube className="h-5 w-5" /> },
    ],
  },
];

export default PortfolioVideoShowcase;
