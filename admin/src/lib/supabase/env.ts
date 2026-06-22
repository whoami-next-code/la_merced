export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  const isPlaceholder =
    !url ||
    !anonKey ||
    url.includes('your-project') ||
    anonKey.includes('your-anon-key') ||
    anonKey === 'your-anon-key';

  if (isPlaceholder) {
    throw new Error(
      'Supabase no está configurado. Edita admin/.env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY de tu proyecto en supabase.com',
    );
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  try {
    getSupabaseEnv();
    return true;
  } catch {
    return false;
  }
}
