import { readMultipartFormData, createError, defineEventHandler } from 'h3'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  if (!parts) {
    throw createError({ statusCode: 400, message: 'Invalid form data' })
  }

  let password = ''
  let judul = ''
  let bpm = 120
  let type = 'Trap Beat'
  let ytLink = ''
  let audioFile: any = null

  for (const part of parts) {
    if (!part.name) continue
    if (part.name === 'password') {
      password = part.data.toString('utf-8').trim()
    } else if (part.name === 'judul') {
      judul = part.data.toString('utf-8').trim()
    } else if (part.name === 'bpm') {
      bpm = parseInt(part.data.toString('utf-8').trim(), 10) || 120
    } else if (part.name === 'type') {
      type = part.data.toString('utf-8').trim()
    } else if (part.name === 'ytLink') {
      ytLink = part.data.toString('utf-8').trim()
    } else if (part.name === 'audio') {
      audioFile = part
    }
  }

  const envPassword = process.env.UPLOAD_PASSWORD || 'aldi123'
  if (password !== envPassword) {
    throw createError({ statusCode: 403, message: 'Nope. Wrong password.' })
  }

  if (!judul || !audioFile || !audioFile.filename) {
    throw createError({ statusCode: 400, message: 'Title and audio file are required.' })
  }

  const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a']
  const fileExt = path.extname(audioFile.filename).toLowerCase()
  if (!allowedExtensions.includes(fileExt)) {
    throw createError({ statusCode: 400, message: 'Audio files only (.mp3, .wav, .ogg, .m4a).' })
  }

  const supabase = getSupabase()
  const bucket = getBucket()

  const cleanFilename = `${Date.now()}_${audioFile.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const audioPath = `audio/${cleanFilename}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(audioPath, audioFile.data, {
      contentType: audioFile.type || 'audio/mpeg',
      upsert: false
    })

  if (uploadError) {
    throw createError({ statusCode: 500, message: 'Audio upload flopped: ' + uploadError.message })
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(audioPath)

  // Read existing metadata
  let beats: any[] = []
  const { data: jsonData, error: jsonError } = await supabase.storage
    .from(bucket)
    .download('beats.json')

  if (!jsonError && jsonData) {
    try {
      const text = await jsonData.text()
      beats = JSON.parse(text)
    } catch (e) {
      beats = []
    }
  }

  const newBeat = {
    judul,
    bpm,
    type,
    src: publicUrlData.publicUrl,
    platform: 'local',
    ytLink: ytLink || undefined,
    uploadedAt: new Date().toISOString()
  }

  beats.unshift(newBeat)

  const { error: uploadJsonError } = await supabase.storage
    .from(bucket)
    .upload('beats.json', new Blob([JSON.stringify(beats, null, 2)], { type: 'application/json' }), {
      contentType: 'application/json',
      upsert: true
    })

  if (uploadJsonError) {
    throw createError({ statusCode: 500, message: 'Could not save metadata: ' + uploadJsonError.message })
  }

  return {
    success: true,
    message: 'Beat uploaded successfully!',
    track: newBeat
  }
})
