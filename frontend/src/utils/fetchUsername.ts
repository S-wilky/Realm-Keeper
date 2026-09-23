import supabase from "../services/supabase-client";

type ProfileUsername = {
    username: string;
};

export default async function fetchUsername(
    userId: string
): Promise<string | undefined> {
    const { data, error } = await supabase
        .from("profile")
        .select("username")
        .eq("profile_id", userId)
        .maybeSingle<ProfileUsername>();

    if (error) {
        console.log(
            "Dashboard fetch username error:",
            error
        );
    }

    return data?.username;
}