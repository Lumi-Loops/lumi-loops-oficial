import { SignUpForm } from "@/components/auth/SignUpForm";
import { redirect } from "next/navigation";
import { createClient as createServerSupabase } from "@/utils/supabase/server";

export default async function SignUpPage() {
  // Si el usuario ya tiene sesión activa, redirigir al dashboard
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUpForm className="w-full max-w-2xl" />
    </div>
  );
}
