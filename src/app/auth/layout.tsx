import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gray-900 relative">
      {/* Forest Emerald Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, 
              rgba(34, 197, 94, 0.18) 0%, 
              rgba(34, 197, 94, 0.1) 25%, 
              rgba(34, 197, 94, 0.04) 35%, 
              transparent 50%
            )
          `,
          backgroundSize: "100% 100%",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
