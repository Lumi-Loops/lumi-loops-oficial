"use client";

import Image from "next/image";
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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/logo/lumiloops-logo-name.png"
                alt="Lumi Loops Logo"
                width={180}
                height={60}
                priority
                className="drop-shadow-lg"
              />
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className="bg-black/40 backdrop-blur-md text-white border-white/20 drop-shadow-lg"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Coming 2025
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="container mx-auto max-w-4xl text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Sparkles className="h-16 w-16 text-primary animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                    <Video className="h-8 w-8 text-yellow-400 animate-bounce" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                Professional Videos
                <span className="text-primary dark:text-green-400 block drop-shadow-lg">
                  Made Simple
                </span>
                Coming Soon
              </h1>

              <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                AI-assisted video creation platform. Professional, fast, and
                affordable videos without the complexity.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge
                  variant="outline"
                  className="bg-black/30 backdrop-blur-md text-white border-white/30 px-4 py-2 drop-shadow-md"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  AI-Assisted Creation
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-black/30 backdrop-blur-md text-white border-white/30 px-4 py-2 drop-shadow-md"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Fast & Professional
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-black/30 backdrop-blur-md text-white border-white/30 px-4 py-2 drop-shadow-md"
                >
                  <Users className="mr-2 h-4 w-4" />
                  For Creators & Brands
                </Badge>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-black/30 backdrop-blur-md border-white/20 drop-shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-white">
                    AI-Powered Creation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 text-sm">
                    Get professional video content quickly with our intelligent
                    AI assistance
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border-white/20 drop-shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-white">Custom Editing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 text-sm">
                    Professional editing and customization services to fit your
                    brand perfectly
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border-white/20 drop-shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-white">For Everyone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 text-sm">
                    Perfect for influencers, businesses, and marketing agencies
                    seeking impactful content
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-white/80 text-sm drop-shadow-md">
            © 2025 Lumi Loops. Professional video creation made simple for
            creators and brands worldwide.
          </p>
        </footer>
      </div>
    </div>
  );
}
