import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">
          Authentication Error
        </h1>
        <p className="text-muted-foreground mb-6">
          There was an error during the authentication process. Please try
          again.
        </p>
        <Link href="/auth/signin" className="text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
