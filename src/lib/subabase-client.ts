import { createClient } from "@supabase/supabase-js";

// Hent værdierne direkte fra din .env fil via Vites miljøvariabler
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Opret og eksporter klienten
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;