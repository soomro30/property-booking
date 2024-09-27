import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqnpsktrwahymfgunqgq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbnBza3Ryd2FoeW1mZ3VucWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2OTIzMDgsImV4cCI6MjA0MDI2ODMwOH0.k5WRMI_UM6uWA3ojJWVqlKi8rzvRX8naJjq_mQY-BnE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })