<template>
  <NuxtLink
    v-if="project.slug"
    :to="localePath(`/projects/${project.slug}`)"
    class="project-card group relative overflow-hidden flex flex-col transition-all duration-700"
    :class="[
      isWide ? 'md:flex-row' : ''
    ]"
    data-cursor-hover
  >
    <!-- VISUAL AREA (REBUILT FOR SAFARI + LIGHT THEME) -->
    <div
      class="proj-visual-wrap"
      :style="{
        position: 'relative',
        width: '100%',
        paddingTop: isWide ? '0' : '45%', /* Taller for normal cards, 0 for wide to use flex */
        minHeight: isWide ? '450px' : 'auto',
        overflow: 'hidden',
        background: 'var(--bg-surface)',
        borderBottom: isWide ? 'none' : '1px solid var(--border)',
        borderRight: isWide ? '1px solid var(--border)' : 'none',
        flex: isWide ? '1.4' : 'none'
      }"
    >
      <div :style="{
        position: isWide ? 'relative' : 'absolute',
        inset: 0,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }">
        <!-- Color bar top -->
        <div :style="{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '4px',
          background: project.color,
          zIndex: 10
        }" />

        <!-- Subtle texture -->
        <div :style="{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(128,128,128,0.02) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }" />

        <!-- Ghost number -->
        <span class="ghost-number-text" :style="{
          position: 'absolute',
          right: '20px', bottom: '-10px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(80px, 10vw, 140px)',
          fontWeight: '900',
          lineHeight: '1',
          color: project.color,
          opacity: '0.03',
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
          transition: 'all 0.5s ease'
        }">{{ project.number }}</span>

        <!-- Center: type label + tech pills -->
        <div :style="{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          width: '100%'
        }">
          <p :style="{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(11px, 1.2vw, 13px)',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: project.color,
            margin: '0 0 20px 0',
            opacity: 0.9,
            fontWeight: '600'
          }">{{ project.type }}</p>

          <div :style="{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
          }">
            <span
              v-for="tech in project.stack.slice(0, 4)"
              :key="tech"
              :style="{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(10px, 1vw, 11px)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '6px 16px',
                borderRadius: '100px',
                border: `1.5px solid ${hexToRgba(project.color, 0.4)}`,
                color: project.color,
                background: hexToRgba(project.color, 0.05),
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }"
              class="tech-pill-visual"
            >{{ tech }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TEXT AREA -->
    <div :style="{
      padding: '40px 40px 50px',
      background: 'var(--bg-surface)',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minWidth: isWide ? '400px' : 'auto'
    }">
      <!-- Project number -->
      <p :style="{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: '0 0 12px 0',
        opacity: 0.6
      }">{{ project.number }}</p>

      <!-- Project name -->
      <h3 :style="{
        fontSize: 'clamp(28px, 4vw, 42px)',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 16px 0',
        lineHeight: '1.1',
        letterSpacing: '-0.03em',
      }">{{ project.name }}</h3>

      <!-- Description -->
      <p :style="{
        fontSize: 'clamp(16px, 1.5vw, 18px)',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        margin: '0 0 32px 0',
        lineHeight: '1.7',
        maxWidth: '500px'
      }">{{ localizedShortDesc }}</p>

      <!-- Tech pills row (Bottom) -->
      <div :style="{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      }">
        <span
          v-for="tech in project.stack"
          :key="tech"
          :style="{
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            padding: '5px 12px',
            borderRadius: '6px',
            background: 'var(--bg-elevated)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            transition: 'all 0.3s ease'
          }"
          class="tech-pill-bottom"
        >{{ tech }}</span>
      </div>
    </div>

    <!-- Arrow Indicator -->
    <div class="absolute top-10 right-10 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 hidden md:block">
       <svg class="w-8 h-8" :style="{ color: project.color || 'var(--accent)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
       </svg>
    </div>
  </NuxtLink>
</template>

<script setup>
import { hexToRgba } from '~/utils/color'

const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true },
})

const localePath = useLocalePath()
const { t, te } = useI18n()
const localizedShortDesc = computed(() => {
  const key = `projects.${props.project.slug}.short`
  return te(key) ? t(key) : props.project.shortDesc
})

const isWide = computed(() => {
  return props.index === 0 || props.index === 4
})
</script>

<style scoped>
.project-card {
  text-decoration: none;
  border: 1px solid var(--border);
  background: var(--bg-surface);
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-accent);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

/* Hover effects for internal elements */
.project-card:hover .ghost-number-text {
  opacity: 0.12 !important;
  transform: translateY(-10px);
}

.project-card:hover .tech-pill-visual {
  border-color: var(--accent) !important;
  background: rgba(var(--accent-rgb), 0.1) !important;
}

.project-card:hover .tech-pill-bottom {
  border-color: var(--border-accent);
  color: var(--text-primary);
}

@media (max-width: 1023px) {
  .proj-visual-wrap {
    padding-top: 45% !important;
    flex: none !important;
  }
}
</style>
