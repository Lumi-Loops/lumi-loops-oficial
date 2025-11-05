import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
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
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <SignInForm className="w-full max-w-2xl" />
      </div>
    </div>
  );
}
