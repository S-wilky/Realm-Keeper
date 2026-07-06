import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment variables."
    );
}

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