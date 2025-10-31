import supabase from "./supabase-client";

// Client-side real-time subscription example
const setupRealtimeMessages = () => {
  const channel = supabase
    .channel('room-1')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
    //   (payload) => updateMessageFeed(payload.new)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

export default setupRealtimeMessages;