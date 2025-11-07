import { redirect } from "next/navigation";

// Preserve query parameters using App Router's searchParams (Promise-based in Next.js 15)
export default async function SignupRedirect({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const qs = new URLSearchParams();
  const resolved = searchParams ? await searchParams : undefined;
  if (resolved) {
    for (const [key, value] of Object.entries(resolved)) {
      if (typeof value === "string" && value.length > 0) {
        qs.set(key, value);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          if (typeof v === "string" && v.length > 0) qs.append(key, v);
        }
      }
    }
  }

  const target = qs.toString()
    ? `/auth/signup?${qs.toString()}`
    : "/auth/signup";
  redirect(target);
}
