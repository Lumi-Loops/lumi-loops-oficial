import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <SignInForm />
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
