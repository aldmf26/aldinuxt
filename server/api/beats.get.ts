import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const supabase = getSupabase()
  const bucket = getBucket()

  const { data, error } = await supabase.storage
    .from(bucket)
    .download('beats.json')

  if (error || !data) {
    return []
  }

  try {
    const text = await data.text()
    return JSON.parse(text)
  } catch (e) {
    return []
  }
})
