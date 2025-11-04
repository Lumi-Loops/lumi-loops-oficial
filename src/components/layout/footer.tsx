"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Youtube,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/lumiloops",
    icon: Instagram,
    color: "hover:text-pink-500",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/lumiloops",
    icon: Linkedin,
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/lumiloops",
    icon: Twitter,
    color: "hover:text-sky-500",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@lumiloops",
    icon: Youtube,
    color: "hover:text-red-600",
  },
];

const companyLinks = [
  { name: "Home", href: "#inicio" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Why Choose Us", href: "#why-choose-us" },
  { name: "Pricing", href: "#pricing" },
];

const resourcesLinks = [
  { name: "Benefits", href: "#beneficios" },
  { name: "Testimonials", href: "#testimonios" },
  { name: "Contact", href: "#contacto" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookies", href: "/cookies" },
];

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-border/50 mt-24 border-t">
      <div className="container mx-auto px-4 py-16 md:px-8 md:pb-0 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16">
          {/* Company Info */}
          <motion.div
            className="space-y-6 text-center md:text-left lg:pr-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <div className="relative mx-auto h-8 w-40 md:mx-0 md:h-10 md:w-48">
                <Image
                  src="/logo/lumiloops-logo-name.png"
                  alt="Lumi Loops"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed md:text-base md:leading-relaxed">
                Premium video creation service for entrepreneurs. Powered by
                human creativity and AI efficiency.
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold md:text-base">Follow Us</h4>
              <div className="flex justify-center space-x-3 md:justify-start md:space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground transition-colors duration-200 ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            className="space-y-6 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold md:text-base">Company</h4>
            <nav className="space-y-3 md:space-y-4">
              {companyLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-foreground block w-full text-sm transition-colors duration-200 md:text-left md:text-base"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            className="space-y-6 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold md:text-base">Resources</h4>
            <nav className="space-y-3 md:space-y-4">
              {resourcesLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-foreground block w-full text-sm transition-colors duration-200 md:text-left md:text-base"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold md:text-base">Contact</h4>
            <div className="space-y-3 md:space-y-4">
              <div className="text-muted-foreground flex items-center justify-center space-x-3 text-sm md:justify-start md:text-base">
                <Mail className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
                <a
                  href="mailto:lumiloops.dev@gmail.com"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  lumiloops.dev@gmail.com
                </a>
              </div>
              <div className="text-muted-foreground flex items-center justify-center space-x-3 text-sm md:justify-start md:text-base">
                <MapPin className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
                <span>Virginia, United States</span>
              </div>
            </div>
          </motion.div>
        </div>

        <Separator className="my-8 md:my-6" />

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 md:pt-2 md:pb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-muted-foreground text-sm md:text-base">
              © 2024 Lumi Loops. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm md:gap-6 md:text-base">
            {legalLinks.map((link, index) => (
              <span key={link.name} className="flex items-center">
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.name}
                </Link>
                {index < legalLinks.length - 1 && (
                  <span className="text-muted-foreground mx-2">•</span>
                )}
              </span>
            ))}
          </nav>
        </motion.div>
      </div>
    </footer>
  );
}
