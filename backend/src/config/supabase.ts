import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Missing Supabase configuration (SUPABASE_URL / SUPABASE_ANON_KEY). Supabase client will not be available.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function connectSupabase() {
  try {
    // Test connection by querying
    const { data, error } = await supabase.from('users').select('count()');
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    throw error;
  }
}
