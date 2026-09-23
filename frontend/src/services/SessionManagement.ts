import supabase from "./supabase-client";

export default async function logout(): Promise<void> {
    await supabase.auth.signOut();
}