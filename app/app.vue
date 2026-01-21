<!-- app.vue -->
<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from '#imports'

const config = useRuntimeConfig()
const route = useRoute()

const appName = computed(() => config.public.APP_NAME || 'Les derniers léopards')
const siteUrl = computed(() => (config.public.APP_URL || 'http://localhost:3010').replace(/\/$/, ''))

/**
 * Canonical URL SSR-safe (sans query/hash)
 */
const canonicalUrl = computed(() => {
  const path = route.path || '/'
  return `${siteUrl.value}${path}`
})

/**
 * Theme: light/dark
 * - source of truth: localStorage('theme') = 'light'|'dark'|'system'
 * - fallback: system (prefers-color-scheme)
 */
function applyTheme(theme) {
  const root = document.documentElement
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

  root.classList.toggle('dark', !!isDark)
  root.dataset.theme = theme || 'system'
}

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'system'
  applyTheme(saved)

  // si "system", on réagit aux changements OS
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
  const handler = () => {
    const t = localStorage.getItem('theme') || 'system'
    if (t === 'system') applyTheme('system')
  }
  mq?.addEventListener?.('change', handler)
})

/**
 * SEO global (SSR)
 * - titleTemplate
 * - canonical
 * - OG/Twitter
 * - JSON-LD minimal
 */
useHead(() => ({
  htmlAttrs: {
    lang: 'fr',
  },
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} · ${appName.value}` : appName.value),
  link: [
    { rel: 'canonical', href: canonicalUrl.value },

    // favicons (à mettre dans /public)
    { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
    { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'theme-color', content: '#ffffff' },

    // Open Graph
    { property: 'og:site_name', content: appName.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:title', content: appName.value },
    { property: 'og:description', content: 'Bible & app de production du roman Les derniers léopards.' },
    { property: 'og:image', content: `${siteUrl.value}/og-cover.png` },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: appName.value },
    { name: 'twitter:description', content: 'Bible & app de production du roman Les derniers léopards.' },
    { name: 'twitter:image', content: `${siteUrl.value}/og-cover.png` },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: appName.value,
        url: siteUrl.value,
        inLanguage: 'fr',
      }),
    },
  ],
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
