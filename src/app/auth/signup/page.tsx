import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>
        <SignUpForm />
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
