"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Check if View Transitions API is supported
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Use View Transitions API for smooth animated transition
      if (
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function"
      ) {
        document.startViewTransition(() => {
          setTheme(newTheme);
        });
      }
    } else {
      // Fallback for browsers that don't support View Transitions
      setTheme(newTheme);
    }
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-black/40 active:scale-95 drop-shadow-lg"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 text-white rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 text-white rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
