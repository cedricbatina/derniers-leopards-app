<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

/**
 * Canonical + base URL
 */
const canonicalPath = computed(() => localePath('/explore/access'))
const baseUrl = computed(() => config.public?.SITE_URL || '')
const canonicalUrl = computed(() => (
  baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value
))

/**
 * SEO
 */
const seoTitle = computed(() => t('seo.explore.access.title'))
const seoDescription = computed(() => t('seo.explore.access.description'))
const ogImage = computed(() => (
  baseUrl.value ? new URL('/images/og-explore.png', baseUrl.value).toString() : '/images/og-explore.png'
))

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => ogImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => ogImage.value,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
}))

/**
 * JSON-LD
 */
const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: seoTitle.value,
  description: seoDescription.value,
  inLanguage: locale.value,
  url: baseUrl.value || canonicalUrl.value,
}))

useHead(() => ({
  script: [{ type: 'application/ld+json', children: JSON.stringify(jsonLd.value) }],
}))

/**
 * ROUTING (pro): 1 card = 1 lien, centralisé ici.
 * => facile à maintenir / changer sans toucher le template.
 */
const linkMap = {
  principles: {
    auth: '/register',
    roles: '/explore/workflow',
    audit: '/explore/timeline',
  },
  levels: {
    viewer: '/explore/editors',
    editor: '/explore/writing',
    owner: '/register',
  },
}

/**
 * Reveal on scroll
 */
let io
onMounted(() => {
  if (!import.meta.client) return

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  const els = Array.from(document.querySelectorAll('.js-reveal'))

  if (reduce) {
    els.forEach((el) => el.classList.add('is-revealed'))
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )

  els.forEach((el, idx) => {
    el.style.setProperty('--reveal-delay', `${Math.min(idx * 55, 320)}ms`)
    io.observe(el)
  })
})

onBeforeUnmount(() => {
  if (io) io.disconnect()
})
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <!-- HERO -->
    <div class="card card-hover card-accent accent-copper overflow-hidden js-reveal">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:shield-lock-outline" aria-hidden="true" />
            {{ t('explore.access.hero.badge') }}
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            {{ t('explore.access.hero.title') }}
          </h1>

          <p class="text-subtle max-w-2xl">
            {{ t('explore.access.hero.lead') }}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <NuxtLink :to="localePath('/register')" class="btn btn-primary focus-ring">
              <Icon name="mdi:account-plus" aria-hidden="true" />
              {{ t('explore.common.start') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:compass-outline" aria-hidden="true" />
              {{ t('explore.common.backExplore') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore/workflow')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
              {{ t('explore.access.hero.ctaWorkflow') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- PRINCIPLES (cards cliquables individuellement) -->
    <div class="grid gap-4 lg:grid-cols-3">
      <NuxtLink
        :to="localePath(linkMap.principles.auth)"
        class="card-link focus-ring js-reveal"
        aria-label="Accès — Authentification"
      >
        <div class="card card-hover card-accent accent-earth bg-surface2 h-full">
          <div class="card-body space-y-2">
            <div class="badge badge-accent w-fit">
              <Icon name="mdi:cookie-lock" aria-hidden="true" />
              {{ t('explore.access.cards.auth.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.access.cards.auth.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.access.cards.auth.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        :to="localePath(linkMap.principles.roles)"
        class="card-link focus-ring js-reveal"
        aria-label="Accès — Permissions"
      >
        <div class="card card-hover card-accent accent-river bg-surface2 h-full">
          <div class="card-body space-y-2">
            <div class="badge badge-accent w-fit">
              <Icon name="mdi:shield-account-outline" aria-hidden="true" />
              {{ t('explore.access.cards.roles.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.access.cards.roles.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.access.cards.roles.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        :to="localePath(linkMap.principles.audit)"
        class="card-link focus-ring js-reveal"
        aria-label="Accès — Traçabilité"
      >
        <div class="card card-hover card-accent accent-forest bg-surface2 h-full">
          <div class="card-body space-y-2">
            <div class="badge badge-accent w-fit">
              <Icon name="mdi:lock-check-outline" aria-hidden="true" />
              {{ t('explore.access.cards.audit.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.access.cards.audit.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.access.cards.audit.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- LEVELS -->
    <div class="card js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.access.levels.title') }}
            </div>
            <div class="text-sm text-muted">
              {{ t('explore.access.levels.subtitle') }}
            </div>
          </div>
          <div class="badge">
            <Icon name="mdi:account-key-outline" aria-hidden="true" />
            {{ t('explore.access.levels.badge') }}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3 mt-4">
          <NuxtLink
            :to="localePath(linkMap.levels.viewer)"
            class="card-link focus-ring js-reveal"
            aria-label="Niveau d’accès — Lecture"
          >
            <div class="card card-hover bg-surface2 card-accent accent-earth h-full">
              <div class="card-body space-y-2">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:eye-outline" aria-hidden="true" />
                  {{ t('explore.access.levels.viewer.badge') }}
                </div>
                <div class="font-extrabold title-gradient">
                  {{ t('explore.access.levels.viewer.title') }}
                </div>
                <p class="text-sm text-muted">
                  {{ t('explore.access.levels.viewer.desc') }}
                </p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="localePath(linkMap.levels.editor)"
            class="card-link focus-ring js-reveal"
            aria-label="Niveau d’accès — Édition"
          >
            <div class="card card-hover bg-surface2 card-accent accent-river h-full">
              <div class="card-body space-y-2">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:pencil-outline" aria-hidden="true" />
                  {{ t('explore.access.levels.editor.badge') }}
                </div>
                <div class="font-extrabold title-gradient">
                  {{ t('explore.access.levels.editor.title') }}
                </div>
                <p class="text-sm text-muted">
                  {{ t('explore.access.levels.editor.desc') }}
                </p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="localePath(linkMap.levels.owner)"
            class="card-link focus-ring js-reveal"
            aria-label="Niveau d’accès — Pilotage"
          >
            <div class="card card-hover bg-surface2 card-accent accent-copper h-full">
              <div class="card-body space-y-2">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:crown-outline" aria-hidden="true" />
                  {{ t('explore.access.levels.owner.badge') }}
                </div>
                <div class="font-extrabold title-gradient">
                  {{ t('explore.access.levels.owner.title') }}
                </div>
                <p class="text-sm text-muted">
                  {{ t('explore.access.levels.owner.desc') }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:flash-outline" aria-hidden="true" />
            {{ t('explore.access.bottom.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">
            {{ t('explore.access.bottom.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('explore.access.bottom.desc') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localePath('/register')" class="btn btn-primary focus-ring">
            {{ t('explore.common.start') }}
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/workflow')" class="btn btn-ghost focus-ring">
            <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
            {{ t('explore.access.bottom.ctaWorkflow') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.js-reveal {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 420ms ease, transform 420ms ease;
  transition-delay: var(--reveal-delay, 0ms);
}
.js-reveal.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* “card link” clean + accessible */
.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
</style>
