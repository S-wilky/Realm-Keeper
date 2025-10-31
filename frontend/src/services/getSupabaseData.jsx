import supabase from './supabase-client'

// Optimized client-side query with relational filtering
const fetchUserPosts = async (userId) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      content,
      created_at,
      user:user_id (name, avatar_url)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}

export default fetchUserPosts