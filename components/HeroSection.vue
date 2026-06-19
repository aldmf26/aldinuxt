<template>
  <section
    id="hero"
    class="relative flex min-h-screen items-center overflow-hidden bg-[#050608] px-5 pt-28 sm:px-8 lg:px-12"
    style="min-height: 100dvh"
  >
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30"></div>


    <div class="relative z-10 mx-auto flex w-full max-w-[1800px] flex-col gap-10 pb-12">
      <div class="grid items-end gap-8 lg:grid-cols-[1.08fr_.92fr]">
        <div class="space-y-7">
          <div class="hero-kicker inline-flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
            <span class="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(251,146,60,.8)]"></span>
            Web Developer - Music Producer - Beat Maker
          </div>

          <h1 class="font-display text-[clamp(54px,9vw,150px)] font-black leading-[0.88] tracking-[-0.07em] text-white">
            <span class="hero-word block">I build</span>
            <span class="hero-word block text-cyan-200">websites</span>
            <span class="hero-word block text-white/85">and produce</span>
            <span class="hero-word block font-display italic text-orange-300">beats.</span>
          </h1>
        </div>

        <div class="hero-copy space-y-7 lg:pb-4">
          <p class="max-w-xl text-lg leading-relaxed text-white/74 sm:text-xl">
            I craft fast, expressive web experiences and produce beats with FL Studio, blending clean code with rhythm, texture, and mood.
          </p>

          <div class="flex flex-wrap gap-4">
            <a
              href="#works"
              class="inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
              data-cursor-hover
            >
              View Projects
              <span aria-hidden="true">-></span>
            </a>
            <a
              href="#music"
              class="inline-flex items-center gap-3 rounded-full border border-cyan-200/20 bg-white/[0.03] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-200/10"
              data-cursor-hover
            >
              Listen Beats
            </a>
          </div>

          <div class="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
            <span class="h-px w-12 bg-orange-400/50"></span>
            Banjarmasin, Indonesia
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
