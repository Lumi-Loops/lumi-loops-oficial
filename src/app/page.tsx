// import { ComingSoon } from "@/components/coming-soon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="relative">
      {/* Navbar */}
      <Navbar />

      {/* Coming Soon Component - Temporarily disabled */}
      {/* <ComingSoon /> */}

      {/* Main Content */}
      <main className="min-h-screen pt-16">
        {/* Sections will be added here */}
        <div className="container mx-auto px-4 py-20">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Lumi Loops
                </span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                Sections will be added here progressively
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
