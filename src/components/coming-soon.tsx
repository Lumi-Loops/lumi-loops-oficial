"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Users,
  Calendar,
  Video,
  PlayCircle,
  Wand2,
} from "lucide-react";

export function ComingSoon() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="/videos/background-video/83097-581045348_small.mp4"
            type="video/mp4"
          />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6"
        >
          <div className="container mx-auto flex justify-between items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center"
            >
              <Image
                src="/logo/lumiloops-logo-name.png"
                alt="Lumi Loops Logo"
                width={180}
                height={60}
                priority
                className="drop-shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <Badge
                variant="secondary"
                className="bg-black/40 backdrop-blur-md text-white border-white/20 drop-shadow-lg"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Coming 2025
              </Badge>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="container mx-auto max-w-4xl text-center">
            {/* Hero Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <Sparkles className="h-16 w-16 text-primary animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                    <Video className="h-8 w-8 text-yellow-400 animate-bounce" />
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
              >
                Professional Videos
                <span className="text-primary dark:text-green-400 block drop-shadow-lg">
                  Made Simple
                </span>
                Coming Soon
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
              >
                AI-assisted video creation platform. Professional, fast, and
                affordable videos without the complexity.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                {[
                  {
                    icon: PlayCircle,
                    text: "AI-Assisted Creation",
                    delay: 0.1,
                  },
                  { icon: Zap, text: "Fast & Professional", delay: 0.2 },
                  { icon: Users, text: "For Creators & Brands", delay: 0.3 },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.text}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 + item.delay }}
                    >
                      <Badge
                        variant="outline"
                        className="bg-black/30 backdrop-blur-md text-white border-white/30 px-4 py-2 drop-shadow-md"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.text}
                      </Badge>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Wand2,
                  title: "AI-Powered Creation",
                  description:
                    "Get professional video content quickly with our intelligent AI assistance",
                  delay: 0.1,
                },
                {
                  icon: Video,
                  title: "Custom Editing",
                  description:
                    "Professional editing and customization services to fit your brand perfectly",
                  delay: 0.2,
                },
                {
                  icon: Users,
                  title: "For Everyone",
                  description:
                    "Perfect for influencers, businesses, and marketing agencies seeking impactful content",
                  delay: 0.3,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.8 + item.delay }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="bg-black/30 backdrop-blur-md border-white/20 drop-shadow-xl h-full">
                      <CardHeader className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: 2.0 + item.delay,
                          }}
                          className="w-12 h-12 bg-primary/30 rounded-lg flex items-center justify-center mx-auto mb-4"
                        >
                          <Icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <CardTitle className="text-white">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/90 text-sm">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          className="p-6 text-center"
        >
          <p className="text-white/80 text-sm drop-shadow-md">
            © 2025 Lumi Loops. Professional video creation made simple for
            creators and brands worldwide.
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
