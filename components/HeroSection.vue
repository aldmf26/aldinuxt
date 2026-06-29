<template>
  <section
    id="hero"
    class="relative flex min-h-screen items-center overflow-hidden bg-[var(--bg-primary)] px-5 pt-28 sm:px-8 lg:px-12"
    style="min-height: 100dvh"
  >
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35"></div>


    <div class="relative z-10 mx-auto flex w-full max-w-[1800px] flex-col gap-10 pb-12">
      <div class="grid items-end gap-8 lg:grid-cols-[1.08fr_.92fr]">
        <div class="space-y-7">
          <div class="hero-kicker font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-primary)]/45">
            Banjarmasin&nbsp;&nbsp;/&nbsp;&nbsp;Code &amp;&nbsp;Beats&nbsp;&nbsp;/&nbsp;&nbsp;Est.&nbsp;2020
          </div>

          <h1 class="sr-only">Aldi Fahrizaldi — Full-Stack Developer & Beat Producer</h1>

          <p class="font-display text-[clamp(54px,9vw,150px)] font-black leading-[0.88] tracking-[-0.07em] text-[var(--text-primary)]" aria-hidden="true">
            <span class="hero-word block">I build</span>
            <span class="hero-word block text-[var(--accent)]">websites</span>
            <span class="hero-word block text-[var(--text-primary)]/90">and produce</span>
            <span class="hero-word block font-display italic text-[var(--accent-dim)]">beats.</span>
          </p>
        </div>

        <div class="hero-copy space-y-7 lg:pb-4">
          <p class="max-w-xl text-lg leading-relaxed text-[var(--text-primary)]/80 sm:text-xl">
            Websites that actually work. Beats people actually press play on. Two crafts, same weirdo.
          </p>

          <div class="flex flex-wrap gap-4">
            <a
              href="#works"
              class="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--bg-primary)] shadow-lg shadow-[var(--accent)]/20 transition hover:-translate-y-0.5 hover:brightness-110"
              data-cursor-hover
            >
              View Projects
              <span aria-hidden="true">-></span>
            </a>
            <a
              href="#music"
              class="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-primary)]/80 transition hover:-translate-y-0.5 hover:bg-[var(--bg-elevated)]"
              data-cursor-hover
            >
              Listen Beats
            </a>
          </div>


        </div>
      </div>

      <div class="relative">
        <PianoVisual />
      </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style scoped>
.hero-word,
.hero-copy,
.hero-kicker {
  animation: heroRise 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-word:nth-child(1) { animation-delay: 0.12s; }
.hero-word:nth-child(2) { animation-delay: 0.22s; }
.hero-word:nth-child(3) { animation-delay: 0.32s; }
.hero-word:nth-child(4) { animation-delay: 0.42s; }
.hero-copy { animation-delay: 0.55s; }
.hero-kicker { animation-delay: 0.05s; }

@keyframes heroRise {
  from {
    opacity: 0;
    transform: translateY(28px);
    filter: blur(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-word,
  .hero-copy,
  .hero-kicker {
    animation: none;
  }
}
</style>
