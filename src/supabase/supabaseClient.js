import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://eofeqoizwmyhuaqmuezr.supabase.co';
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZmVxb2l6d215aHVhcW11ZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNjI1NjcsImV4cCI6MjA3MTgzODU2N30.yw9CbnVzhgr_TlVaAE8Ef705GItX-ZRK-c38a_OG9hg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
