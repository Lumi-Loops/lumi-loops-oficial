"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ImageData {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  orientation?: "vertical" | "horizontal";
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: ImageData[];
  /** Show logo in center image */
  showLogo?: boolean;
}

// Diferentes fuentes para cada imagen
const fontClasses = [
  "font-sans", // DM Sans
  "font-serif", // Lora
  "font-mono", // IBM Plex Mono
  "font-sans font-bold",
  "font-serif italic",
  "font-mono font-semibold",
  "font-sans tracking-wide",
];

export function ZoomParallax({ images, showLogo = true }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // Animación para el logo
  const logoOpacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);
  const logoScale = useTransform(scrollYProgress, [0.7, 0.85, 1], [0.5, 1, 1]);
  const logoRotate = useTransform(scrollYProgress, [0.7, 0.85, 1], [-10, 0, 0]);

  // Animación para el fondo glassmorphism
  const backdropOpacity = useTransform(
    scrollYProgress,
    [0.7, 0.85, 1],
    [0, 0.95, 0.95]
  );

  // Animación para desaparecer el texto de la primera card (efecto brisa)
  const firstCardTextOpacity = useTransform(
    scrollYProgress,
    [0.6, 0.7],
    [1, 0]
  );
  const firstCardTextBlur = useTransform(scrollYProgress, [0.6, 0.7], [0, 10]);
  const firstCardTextX = useTransform(scrollYProgress, [0.6, 0.7], [0, 50]);
  const firstCardTextY = useTransform(scrollYProgress, [0.6, 0.7], [0, -20]);

  // Determinar alineación del texto según orientación e índice
  const getTextAlignment = (
    orientation: "vertical" | "horizontal" = "horizontal",
    index: number
  ) => {
    // Index 2 (Fast Rendering) - Esquina inferior izquierda
    if (index === 2) {
      return "justify-end items-start p-4";
    }
    // Index 4 (Flujo Automatizado) - Esquina superior derecha
    if (index === 4) {
      return "items-start justify-end p-4";
    }
    if (orientation === "vertical") {
      return "justify-start items-start p-4";
    }
    return "justify-end items-end p-4";
  };

  return (
    <div ref={container} className="bg-background relative h-[300vh]">
      <div className="bg-background sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt, title, description, orientation }, index) => {
          const scale = scales[index % scales.length];
          const fontClass = fontClasses[index % fontClasses.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 0 ? "[&>div]:!h-[45vh] [&>div]:!w-[85vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[25vw]" : ""} ${index === 1 ? "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[35vh] [&>div]:!w-[70vw] md:[&>div]:!h-[30vh] md:[&>div]:!w-[35vw]" : ""} ${index === 2 ? "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[50vh] [&>div]:!w-[50vw] md:[&>div]:!h-[45vh] md:[&>div]:!w-[20vw]" : ""} ${index === 3 ? "[&>div]:!left-[27.5vw] [&>div]:!h-[40vh] [&>div]:!w-[60vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[25vw]" : ""} ${index === 4 ? "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[38vh] [&>div]:!w-[55vw] md:[&>div]:!top-[27.5vh] md:[&>div]:!left-[5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[22vw]" : ""} ${index === 5 ? "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[38vh] [&>div]:!w-[65vw] md:[&>div]:!top-[27.5vh] md:[&>div]:!-left-[22.5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[22vw]" : ""} ${index === 6 ? "[&>div]:!top-[27.5vh] [&>div]:!left-[32.5vw] [&>div]:!h-[38vh] [&>div]:!w-[55vw] md:[&>div]:!top-[27.5vh] md:[&>div]:!left-[32.5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[22vw]" : ""} `}
            >
              <div className="border-border/50 relative h-[25vh] w-[25vw] overflow-hidden rounded-2xl border shadow-2xl">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={alt || `Parallax image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Overlay con gradiente */}
                <div className="from-background/90 via-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />

                {/* Texto sobre la imagen */}
                {(title || description) && (
                  <motion.div
                    className={`absolute inset-0 flex flex-col ${getTextAlignment(orientation, index)}`}
                    style={
                      index === 0
                        ? {
                            opacity: firstCardTextOpacity,
                            filter: `blur(${firstCardTextBlur}px)`,
                            x: firstCardTextX,
                            y: firstCardTextY,
                          }
                        : {}
                    }
                  >
                    {title && (
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${fontClass} text-primary text-xs font-bold drop-shadow-lg sm:text-sm md:text-lg lg:text-xl`}
                      >
                        {title}
                      </motion.h3>
                    )}
                    {description && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`${fontClass} text-foreground/90 mt-0.5 max-w-[90%] text-[0.65rem] leading-tight drop-shadow-md sm:text-xs md:text-sm lg:text-base`}
                      >
                        {description}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Logo animado en el centro con fondo glassmorphism */}
        {showLogo && (
          <>
            {/* Fondo glassmorphism */}
            <motion.div
              style={{
                opacity: backdropOpacity,
              }}
              className="pointer-events-none absolute inset-0 z-40"
            >
              <div className="bg-background/80 absolute inset-0 backdrop-blur-xl" />
              <div className="from-primary/10 via-accent/5 to-background/50 absolute inset-0 bg-gradient-to-br" />
            </motion.div>

            {/* Logo container */}
            <motion.div
              style={{
                opacity: logoOpacity,
                scale: logoScale,
                rotateZ: logoRotate,
              }}
              className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
            >
              <div className="relative h-[75vh] max-h-[800px] w-[75vw] max-w-[800px]">
                {/* Efecto de resplandor pulsante */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [0.9, 1.3, 0.9],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-primary/30 absolute inset-0 rounded-full blur-[100px]"
                />

                {/* Anillo decorativo */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="border-primary/20 absolute inset-0 rounded-full border-2"
                />

                {/* Logo */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative flex h-full w-full items-center justify-center p-8"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src="/logo/lumiloops-logo-name.png"
                      alt="Lumi Loops Logo"
                      fill
                      className="object-contain brightness-110 drop-shadow-2xl filter"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
