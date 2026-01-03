
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://aeshmpqwttyqkyyrplxw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlc2htcHF3dHR5cWt5eXJwbHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MzMzNDQsImV4cCI6MjA4MzAwOTM0NH0.Hk9jpZGr71ZWExlXrZ_jqLr18dlQlfPCf3AeBeNafU4';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
