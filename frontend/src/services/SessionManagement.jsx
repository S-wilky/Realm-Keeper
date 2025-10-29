import supabase from './supabase-client';

export default async function logout() {
  await supabase.auth.signOut();
}

