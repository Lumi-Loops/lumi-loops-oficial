import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignUpForm className="w-full max-w-2xl" />
    </div>
  );
}
