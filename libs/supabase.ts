import { createClient } from "@supabase/supabase-js";

// Publishable (anon) key: safe in the client bundle, access is governed by RLS on the table.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set");

export const supabase = createClient(url, key, { auth: { persistSession: false } });
