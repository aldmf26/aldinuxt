<template>
  <NuxtLink
    v-if="project.slug"
    :to="`/projects/${project.slug}`"
    class="project-card group relative overflow-hidden flex flex-col transition-all duration-700"
    :class="[
      isWide ? 'md:flex-row' : ''
    ]"
    data-cursor-hover
  >
    <!-- VISUAL AREA (REBUILT FOR SAFARI) -->
    <div 
      class="proj-visual-wrap"
      :style="{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',  /* 16:9 = 56.25% — works on ALL browsers */
        overflow: 'hidden',
        backgroundColor: 'var(--bg-surface)',
        flex: isWide ? '1.5' : 'none'
      }"
    >
      <!-- INNER: absolute fill -->
      <div
        class="proj-visual-inner"
        :style="{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }"
      >
        <!-- Top color bar -->
        <div :style="{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '3px',
          background: project.color || 'var(--accent)',
        }" />

        <!-- Diagonal lines pattern — use variable for theme compatibility -->
        <div :style="{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            var(--pattern-color) 0px,
            var(--pattern-color) 1px,
            transparent 1px,
            transparent 24px
          )`,
        }" />

        <!-- Ghost number — bottom right -->
        <span :style="{
          position: 'absolute',
          right: '8px',
          bottom: '-8px',
          fontFamily: '\'JetBrains Mono\', monospace',
          fontSize: '96px',
          fontWeight: '900',
          lineHeight: '1',
          color: 'var(--text-primary)',
          opacity: '0.06',
          userSelect: 'none',
          pointerEvents: 'none',
        }">{{ project.number }}</span>

        <!-- Center content -->
        <div :style="{
          position: 'relative',
          zIndex: '1',
          textAlign: 'center',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }">
          <!-- Project type label -->
          <p :style="{
            fontFamily: '\'JetBrains Mono\', monospace',
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: project.color || 'var(--accent)',
            margin: 0,
          }">{{ project.type }}</p>

          <!-- Tech pills -->
          <div :style="{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            justifyContent: 'center',
          }">
            <span
              v-for="tech in project.stack.slice(0, 3)"
              :key="tech"
              :style="{
                fontFamily: '\'JetBrains Mono\', monospace',
                fontSize: '9px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '100px',
                border: `1px solid ${project.color || 'var(--accent)'}`,
                color: project.color || 'var(--accent)',
                background: 'transparent',
                whiteSpace: 'nowrap',
              }"
            >{{ tech }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TEXT AREA (REBUILT FOR SAFARI) -->
    <div :style="{
      padding: '16px',
      background: 'var(--bg-surface)',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }">
      <!-- Project number -->
      <p :style="{
        fontFamily: '\'JetBrains Mono\', monospace',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: '0 0 6px 0',
      }">{{ project.number }}</p>

      <!-- Project name -->
      <h3 :style="{
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 8px 0',
        lineHeight: '1.2',
      }">{{ project.name }}</h3>

      <!-- Description -->
      <p :style="{
        fontSize: '13px',
        color: 'var(--text-muted)',
        margin: '0 0 12px 0',
        lineHeight: '1.5',
      }">{{ project.shortDesc }}</p>

      <!-- Tech pills row -->
      <div :style="{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
      }">
        <span
          v-for="tech in project.stack"
          :key="tech"
          :style="{
            fontSize: '10px',
            fontFamily: '\'JetBrains Mono\', monospace',
            padding: '3px 8px',
            borderRadius: '4px',
            background: 'var(--pill-bg)',
            color: 'var(--text-muted)',
            border: '1px solid var(--pill-border)',
          }"
        >{{ tech }}</span>
      </div>
    </div>

    <!-- Arrow Indicator (Top Right - hidden on mobile) -->
    <div class="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 hidden md:block">
       <svg class="w-5 h-5" :style="{ color: project.color || 'var(--accent)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
       </svg>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true },
})

const isWide = computed(() => {
  return props.index === 0 || props.index === 4
})
</script>

<style scoped>
.project-card {
  text-decoration: none;
}

.project-card:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

/* Hover animation for ghost number */
.project-card:hover .proj-visual-inner span {
  opacity: 0.12 !important;
  transition: opacity 0.3s ease;
}

@media (min-width: 1024px) {
  .project-card.md\:flex-row {
    min-height: 400px;
  }
}
</style>
