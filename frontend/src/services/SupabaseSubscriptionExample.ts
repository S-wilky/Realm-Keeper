import supabase from "./supabase-client";

function setupRealtimeMessages(): () => Promise<"ok" | "timed out" | "error"> {
    const channel = supabase
        .channel("room-1")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
            },
            (_payload) => {
                // updateMessageFeed(payload.new)
            }
        )
        .subscribe();

    return () => supabase.removeChannel(channel);
}

export default setupRealtimeMessages;