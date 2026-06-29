<template>
  <main class="min-h-screen bg-[var(--bg-primary)] text-text-primary transition-colors duration-500 py-32 px-6 md:px-16 flex flex-col items-center justify-center relative overflow-hidden">
    <!-- Background "UPLOAD" text -->
    <div
      class="absolute top-16 left-1/2 -translate-x-1/2 font-display italic text-text-primary opacity-[0.02] select-none pointer-events-none z-0 whitespace-nowrap"
      style="font-size: clamp(100px, 15vw, 250px)"
    >
      UPLOAD
    </div>

    <!-- Back Navigation -->
    <div class="fixed top-8 left-6 md:left-16 z-50">
      <NuxtLink 
        to="/" 
        class="group flex items-center gap-3 px-6 py-3 bg-[var(--bg-surface)] border border-white/5 rounded-full font-mono text-[10px] text-text-muted hover:text-lime hover:border-lime/30 transition-all duration-300"
      >
        <svg class="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        BACK TO UNIVERSE
      </NuxtLink>
    </div>

    <div class="w-full max-w-md relative z-10 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] p-8 md:p-10 shadow-2xl shadow-black/50">
      <div class="mb-8">
        <span class="font-mono text-xs text-lime tracking-[0.3em] uppercase block mb-2">Sound Lab Admin</span>
        <h2 class="font-display italic text-3xl md:text-4xl text-text-primary leading-none">
          Upload Beat
        </h2>
        <p class="text-text-muted font-body text-xs mt-2 leading-relaxed">
          Upload your preview beat (max 30s) directly to the portfolio catalog.
        </p>
      </div>

      <!-- Error and Success Notifications -->
      <div v-if="successMsg" class="mb-6 p-4 bg-lime/10 border border-lime/30 rounded-xl text-lime text-xs font-mono">
        {{ successMsg }}
      </div>
      <div v-if="errorMsg" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
        {{ errorMsg }}
      </div>

      <!-- PIN / Password Authentication Phase -->
      <form v-if="!isAuthenticated" @submit.prevent="verifyPIN" class="space-y-6">
        <div>
          <label class="block font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
            Admin Password / PIN
          </label>
          <input 
            type="password" 
            v-model="pin" 
            placeholder="Enter password..." 
            class="w-full bg-black/40 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-text-primary font-mono focus:outline-none focus:border-lime/50 transition-colors"
            required
          />
        </div>
        <button 
          type="submit"
          class="w-full py-4 bg-lime text-dark font-mono font-bold text-xs uppercase tracking-widest rounded-full hover:bg-lime/90 transition-all duration-300 shadow-lg shadow-lime/10"
        >
          AUTHENTICATE
        </button>
      </form>

      <!-- Upload Form Phase -->
      <form v-else @submit.prevent="handleUpload" class="space-y-6">
        <div>
          <label class="block font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
            Track Title
          </label>
          <input 
            type="text" 
            v-model="judul" 
            placeholder="e.g. Hanoman" 
            class="w-full bg-black/40 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-lime/50 transition-colors"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
              BPM
            </label>
            <input 
              type="number" 
              v-model="bpm" 
              placeholder="e.g. 140" 
              class="w-full bg-black/40 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-text-primary font-mono focus:outline-none focus:border-lime/50 transition-colors"
              required
            />
          </div>
          <div>
            <label class="block font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
              Genre / Type
            </label>
            <select 
              v-model="type" 
              class="w-full bg-black/40 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-lime/50 transition-colors"
              required
            >
              <option value="Trap Beat">Trap Beat</option>
              <option value="Free FLP">Free FLP</option>
              <option value="EDM">EDM</option>
              <option value="SoundCloud">SoundCloud</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
            YouTube / Streaming Link (Optional)
          </label>
          <input 
            type="url" 
            v-model="ytLink" 
            placeholder="e.g. https://youtube.com/watch?v=..." 
            class="w-full bg-black/40 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-lime/50 transition-colors"
          />
        </div>

        <div>
          <label class="block font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
            Audio File (Max 30s)
          </label>
          <div class="relative">
            <input 
              ref="fileInput"
              type="file" 
              accept="audio/*" 
              @change="handleFileChange" 
              class="hidden" 
              id="audio-upload-input"
              required
            />
            <label 
              for="audio-upload-input" 
              class="flex flex-col items-center justify-center border border-dashed border-[var(--border)] rounded-xl p-6 cursor-pointer hover:border-lime/40 transition-colors bg-black/10"
            >
              <span class="text-xs text-text-muted text-center" v-if="!audioFile">
                Click to select audio file (.mp3, .wav, .ogg)
              </span>
              <span class="text-xs text-lime font-mono text-center" v-else>
                {{ audioFile.name }} ({{ formatSize(audioFile.size) }})
              </span>
            </label>
          </div>
          <p v-if="durationError" class="text-red-400 font-mono text-[10px] mt-2">
            {{ durationError }}
          </p>
        </div>

        <button 
          type="submit"
          :disabled="isUploading || !!durationError"
          class="w-full py-4 bg-lime text-dark font-mono font-bold text-xs uppercase tracking-widest rounded-full hover:bg-lime/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-lime/10"
        >
          {{ isUploading ? 'UPLOADING...' : 'UPLOAD BEAT' }}
        </button>
      </form>
    </div>
  </main>
</template>

<script setup>
const pin = ref('')
const isAuthenticated = ref(false)
const judul = ref('')
const bpm = ref(130)
const type = ref('Trap Beat')
const ytLink = ref('')
const audioFile = ref(null)
const fileInput = ref(null)

const isUploading = ref(false)
const durationError = ref('')
const successMsg = ref('')
const errorMsg = ref('')

const verifyPIN = async () => {
  errorMsg.value = ''
  // Test authentication by sending a dummy request with password
  try {
    const formData = new FormData()
    formData.append('password', pin.value)
    formData.append('judul', 'test') // validation bypass placeholder

    const response = await $fetch('/api/upload-music', {
      method: 'POST',
      body: formData
    })
    isAuthenticated.value = true
  } catch (err) {
    if (err.statusCode === 400) {
      // Correct password! Since it bypassed the 403 password check.
      isAuthenticated.value = true
    } else {
      errorMsg.value = err.data?.message || err.statusMessage || 'Wrong password, mate.'
    }
  }
}

const handleFileChange = (e) => {
  durationError.value = ''
  errorMsg.value = ''
  successMsg.value = ''
  
  const file = e.target.files[0]
  if (!file) return

  // Check duration
  const audio = new Audio()
  audio.src = URL.createObjectURL(file)
  
  audio.onloadedmetadata = () => {
    URL.revokeObjectURL(audio.src)
    const duration = audio.duration
    if (duration > 31) { // 31 seconds tolerance
      durationError.value = `Whoa, that's over 30 seconds (${Math.round(duration)}s). Trim it down.`
      audioFile.value = null
      if (fileInput.value) fileInput.value.value = ''
    } else {
      audioFile.value = file
    }
  }

  audio.onerror = () => {
    durationError.value = 'Can\'t read this file. Might be corrupted.'
    audioFile.value = null
    if (fileInput.value) fileInput.value.value = ''
  }
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleUpload = async () => {
  if (!audioFile.value) {
    errorMsg.value = 'Pick an audio file first.'
    return
  }

  isUploading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  const formData = new FormData()
  formData.append('password', pin.value)
  formData.append('judul', judul.value)
  formData.append('bpm', bpm.value)
  formData.append('type', type.value)
  formData.append('ytLink', ytLink.value)
  formData.append('audio', audioFile.value)

  try {
    const res = await $fetch('/api/upload-music', {
      method: 'POST',
      body: formData
    })
    successMsg.value = 'Beat uploaded. Let it rip.'
    // Reset form
    judul.value = ''
    bpm.value = 130
    ytLink.value = ''
    audioFile.value = null
    if (fileInput.value) fileInput.value.value = ''
  } catch (err) {
    errorMsg.value = err.data?.message || err.statusMessage || 'Upload failed. Try again or blame the wifi.'
  } finally {
    isUploading.value = false
  }
}

useHead({
  title: 'Upload Sound Lab — Aldi Fahrizaldi',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
