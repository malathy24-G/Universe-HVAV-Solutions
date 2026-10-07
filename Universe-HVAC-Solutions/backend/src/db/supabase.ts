import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is optional for local development. If SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are not set, the store modules in this folder
 * automatically fall back to local JSON files under backend/data/ so the
 * project runs without any external service configured. Once you create a
 * Supabase project and set the variables in backend/.env, the app switches
 * to Postgres automatically.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let serverClient: SupabaseClient | null = null;

/** Server-side Supabase client using the service role key. This backend
 *  process is the only thing that ever holds this key — it is never sent
 *  to the frontend. */
export function getSupabaseServerClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env.");
  }
  if (!serverClient) {
    serverClient = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      { auth: { persistSession: false } }
    );
  }
  return serverClient;
}
