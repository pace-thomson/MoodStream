
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pbkfyvhbwzirjootonzr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBia2Z5dmhid3ppcmpvb3RvbnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTEzODcsImV4cCI6MjA2NzQ4NzM4N30.gfXjrnyutFE25Fx0xZxsEewYEWpgW0320wuLrgEkGOc' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)