// Supabase Client with robust fallbacks
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_URL = "https://nvyjihhayzqhntihqgae.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52eWppaGhheXpxaG50aWhxZ2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MjY0MTMsImV4cCI6MjA4MTMwMjQxM30.vpojvkf6pIjaKk38D434xFvulveVTEu-NlgU4ddjkcA";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});