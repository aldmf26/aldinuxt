import { readMultipartFormData, createError, defineEventHandler } from 'h3'
import fs from 'node:fs'
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

  // Validate password
  const envPassword = process.env.UPLOAD_PASSWORD || 'aldi123'
  if (password !== envPassword) {
    throw createError({ statusCode: 403, message: 'Password/PIN salah!' })
  }

  if (!judul || !audioFile || !audioFile.filename) {
    throw createError({ statusCode: 400, message: 'Judul dan File Audio wajib diisi!' })
  }

  // Verify file type (audio files)
  const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a']
  const fileExt = path.extname(audioFile.filename).toLowerCase()
  if (!allowedExtensions.includes(fileExt)) {
    throw createError({ statusCode: 400, message: 'Hanya file audio (.mp3, .wav, .ogg, .m4a) yang diperbolehkan!' })
  }

  // Ensure directories exist
  const uploadsDir = path.resolve(process.cwd(), 'public/uploads')
  const dataDir = path.resolve(process.cwd(), 'public/data')
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // Create unique filename
  const cleanFilename = `${Date.now()}_${audioFile.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath = path.join(uploadsDir, cleanFilename)

  // Write file
  fs.writeFileSync(filePath, audioFile.data)

  // Write metadata
  const metadataPath = path.join(dataDir, 'uploaded_beats.json')
  let beats: any[] = []
  if (fs.existsSync(metadataPath)) {
    try {
      beats = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
    } catch (e) {
      beats = []
    }
  }

  const newBeat = {
    judul,
    bpm,
    type,
    src: `/uploads/${cleanFilename}`,
    platform: 'local',
    ytLink: ytLink || undefined,
    uploadedAt: new Date().toISOString()
  }

  beats.unshift(newBeat) // Add to start of list
  fs.writeFileSync(metadataPath, JSON.stringify(beats, null, 2), 'utf-8')

  return {
    success: true,
    message: 'Musik berhasil diunggah!',
    track: newBeat
  }
})
