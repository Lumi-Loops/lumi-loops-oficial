import { ComingSoon } from "@/components/coming-soon";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="relative">
      {/* Theme Toggle Overlay */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Coming Soon Component */}
      <ComingSoon />
    </div>
  );
}
