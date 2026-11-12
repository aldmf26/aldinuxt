<template>
  <div class="shell">
    <a class="skip-link" href="#main">{{ $t('nav.skip') }}</a>
    <AppLoader />
    <PageCurtain />
    <Nav />
    <main id="main" tabindex="-1">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell { min-height: 100svh; overflow-x: clip; background: var(--bg-primary); color: var(--text-primary); }
main:focus { outline: none; }
</style>
