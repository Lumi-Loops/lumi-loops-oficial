import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="text-muted-foreground mb-6">
          A verification email has been sent to your email address. Please click
          the link in the email to verify your account.
        </p>
        <Link href="/auth/signin" className="text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
