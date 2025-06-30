import { supabase } from '../client/src/integrations/supabase/client';

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return false;
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testSupabaseConnection();
}