import supabase from "../services/supabase-client";

export default async function fetchUsername(userId) {
    const { data, error } = await supabase
        .from("profile")
        .select("username")
        .eq("profile_id", userId)
        .maybeSingle();

    if (error) console.log("Dashboard fetch username error:", error);
    if (data?.username) return data.username;
};