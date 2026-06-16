import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate that the URL is a real HTTP/HTTPS URL before trying to create the client
const isValidUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const isConfigured = isValidUrl(supabaseUrl) && supabaseKey && supabaseKey.length > 10;

if (!isConfigured) {
  console.warn(
    "[Supabase] Not configured or invalid URL — database persistence is disabled. " +
    "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local to enable it."
  );
}

// Server-side client using the service role key (bypasses RLS)
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null;
