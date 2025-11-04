"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollNavbar } from "@/hooks/use-scroll-navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SignOutButton } from "@/components/auth/SignOutButton";

// Scroll progress hook for premium navbar indicator
function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollProgress;
}

const navigationItems = [
  { href: "#inicio", label: "Home" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#beneficios", label: "Benefits" },
];

export function Navbar() {
  const { isScrolled } = useScrollNavbar();
  const scrollProgress = useScrollProgress();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  const scrollToSection = (href: string) => {
    console.warn("🚀 Attempting to scroll to:", href);

    // Close mobile menu immediately
    setIsMobileMenuOpen(false);

    // Try multiple times with increasing delays to ensure DOM is ready
    const attemptScroll = (attempt = 0) => {
      const element = document.querySelector(href);
      console.warn(`📍 Attempt ${attempt + 1} - Element found:`, element);

      if (element) {
        // Calculate offset for fixed navbar (64px = navbar height)
        const navbarHeight = 64;
        const elementPosition =
          (element as HTMLElement).offsetTop - navbarHeight;

        console.warn("📏 Scrolling to position:", elementPosition);

        window.scrollTo({
          top: Math.max(0, elementPosition), // Prevent negative scroll
          behavior: "smooth",
        });
      } else if (attempt < 3) {
        // Retry up to 3 times with increasing delay
        setTimeout(() => attemptScroll(attempt + 1), 200 * (attempt + 1));
      } else {
        console.error("❌ Element not found after 3 attempts for:", href);
        // Fallback: scroll to top if element not found
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Start first attempt with small delay
    setTimeout(() => attemptScroll(), 100);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 border-border/80 border-b shadow-lg backdrop-blur-xl"
          : "bg-background/60 border-b border-transparent backdrop-blur-sm",
        "transition-all duration-300 ease-out"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-32">
                <Image
                  src="/logo/lumiloops-logo-name.png"
                  alt="Lumi Loops"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navigationItems.map((item) => (
              <motion.button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-4 md:flex">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard/profile">
                      <Button variant="outline">{user.email}</Button>
                    </Link>
                    <SignOutButton />
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 bg-linear-to-r">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
            {loading && <Button disabled>Loading...</Button>}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Simplified */}
        {isMobileMenuOpen && (
          <div className="border-border/50 space-y-2 border-t py-4 md:hidden">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  console.warn(
                    `Mobile menu clicked: ${item.label} -> ${item.href}`
                  );
                  scrollToSection(item.href);
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 block w-full rounded-lg px-4 py-2 text-left transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <div className="space-y-2 border-t border-border/50 px-4 pt-4">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link href="/dashboard/profile" className="block">
                        <Button variant="outline" className="w-full">
                          {user.email}
                        </Button>
                      </Link>
                      <div className="w-full">
                        <SignOutButton />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" className="block">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup" className="block">
                        <Button className="from-primary to-primary/80 w-full bg-linear-to-r">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="from-primary to-accent absolute bottom-0 left-0 h-0.5 w-full origin-left bg-linear-to-r"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />
    </nav>
  );
}
