import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with theme toggle */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.svg"
              alt="Lumi Loops Logo"
              width={120}
              height={40}
              priority
              className="text-primary"
            />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Welcome to Lumi Loops</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the power of modern web development with Next.js,
              ShadCN UI, and seamless theme switching.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Dark Mode Support</CardTitle>
                <CardDescription>
                  Switch between light, dark, and system themes with ease.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built with next-themes for seamless theme switching without
                  any flash.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ShadCN UI Components</CardTitle>
                <CardDescription>
                  Beautiful, accessible components built with Radix UI and
                  Tailwind CSS.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fully customizable components that work perfectly in both
                  themes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modern Typography</CardTitle>
                <CardDescription>
                  Custom font selection with Pontano Sans, IBM Plex Mono, and
                  Lora.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Carefully chosen typography for the best reading experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 Lumi Loops. Built with Next.js, ShadCN UI, and
              Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
