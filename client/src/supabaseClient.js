import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mbnpglrqhejogabizrgt.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ibnBnbHJxaGVqb2dhYml6cmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMDI0NTUsImV4cCI6MjA2OTU3ODQ1NX0.cdJCkQT9Bqbk4hFH6xeBqnVEVXPyC47N1ZAp_uc10lM"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);