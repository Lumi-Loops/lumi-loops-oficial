/**
 * Validate and retrieve Supabase environment variables
 * Throws error if any required env vars are missing
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return { url, anonKey };
}

/**
 * Get service key for server-side operations that bypass RLS
 * Only use this on the server side for privileged operations
 */
export function getSupabaseServiceKey() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service key");
  }

  return { url, serviceKey };
}
