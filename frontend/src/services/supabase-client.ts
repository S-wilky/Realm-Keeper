import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISH_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: {
        schema: "realms",
    },
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

export default supabase;