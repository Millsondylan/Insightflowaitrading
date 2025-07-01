import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Using the same hardcoded values as in @/integrations/supabase/client
const SUPABASE_URL = "https://ikreglaqlileqlmlgsao.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcmVnbGFxbGlsZXFsbWxnc2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDA4MTUsImV4cCI6MjA2NjA3NjgxNX0.j9-is9odQop9HCjIKa_UqyWFGWl8fSOmWObh0WZV3s0";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export default supabase; 