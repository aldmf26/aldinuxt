import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const bucket = process.env.SUPABASE_BUCKET || 'beats'

export function getSupabase() {
  return createClient(supabaseUrl, supabaseKey)
}

export function getBucket() {
  return bucket
}
