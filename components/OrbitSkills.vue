<template>
  <div class="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-bg transition-colors duration-500">
    <!-- Decorative Background Grid (Subtle) -->
    <div class="absolute inset-0 opacity-[0.015]" style="background-image: radial-gradient(var(--text-primary) 1px, transparent 1px); background-size: 40px 40px;"></div>

    <!-- Center Point (The Artist) -->
    <div class="relative z-20 flex flex-col items-center">
      <div 
        v-motion
        :initial="{ scale: 0.8, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { type: 'spring', damping: 15 } }"
        class="w-28 h-28 md:w-32 md:h-32 rounded-full bg-warna1 flex items-center justify-center text-bg text-5xl font-black shadow-2xl border-4 border-bg relative"
      >
        A
        <!-- Pulse Effect -->
        <div class="absolute inset-0 rounded-full bg-warna1 opacity-20 animate-ping -z-10"></div>
      </div>
      <div class="mt-6">
        <span class="text-2xl font-black text-primary acorn tracking-tighter uppercase">ALDI</span>
      </div>
    </div>

    <!-- Orbit Tracks (Visual only) -->
    <div class="absolute border-2 border-dashed border-primary/5 rounded-full w-[300px] h-[300px] -z-10 opacity-30 transition-colors duration-500"></div>
    <div class="absolute border-2 border-dashed border-primary/5 rounded-full w-[460px] h-[460px] -z-10 opacity-30 transition-colors duration-500"></div>

    <!-- Skill Items -->
    <div 
      v-for="(skill, index) in allSkills" 
      :key="skill.name"
      class="absolute z-10 flex items-center justify-center orbit-container"
      :style="getOrbitStyle(index)"
    >
      <div 
        class="flex items-center gap-3 px-5 py-2.5 bg-bg rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-primary/5 hover:scale-125 transition-all duration-300 cursor-default group whitespace-nowrap"
      >
        <div :class="['w-2.5 h-2.5 rounded-full', skill.type === 'web' ? 'bg-warna1' : 'bg-warnaHijau']"></div>
        <span class="text-sm font-black text-primary tracking-tight">{{ skill.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const webSkills = [
  { name: 'Nuxt JS', type: 'web' },
  { name: 'Vue JS', type: 'web' },
  { name: 'Tailwind', type: 'web' },
  { name: 'Laravel', type: 'web' }
]

const musicSkills = [
  { name: 'FL Studio', type: 'music' },
  { name: 'Mixing', type: 'music' },
  { name: 'Producer', type: 'music' },
  { name: 'Sound Design', type: 'music' }
]

const allSkills = [...webSkills, ...musicSkills]

const getOrbitStyle = (index) => {
  const isWeb = index < webSkills.length
  const radius = isWeb ? 150 : 230
  const duration = isWeb ? 35 : 50
  
  // Calculate delay to spread items evenly from the start
  const delay = -(index * (duration / allSkills.length))
  
  return {
    '--radius': `${radius}px`,
    '--duration': `${duration}s`,
    '--delay': `${delay}s`,
  }
}
</script>

<style scoped>
.orbit-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbit-animation var(--duration) linear infinite var(--delay);
}

@keyframes orbit-animation {
  from {
    transform: translate(-50%, -50%) rotate(0deg) translateX(var(--radius)) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg) translateX(var(--radius)) rotate(-360deg);
  }
}

.acorn {
  font-family: 'Fredoka', sans-serif;
}
</style>
