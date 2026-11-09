import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. Make sure your .env file is configured.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Helper to upload an image file to the public 'media' bucket in Supabase Storage
 */
export async function uploadMediaFile(file: File, folder: 'blogs' | 'gallery' | 'classes' | 'site'): Promise<{ publicUrl: string; storagePath: string }> {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 30);
  const fileName = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('media').getPublicUrl(fileName);
  return {
    publicUrl: data.publicUrl,
    storagePath: fileName,
  };
}
