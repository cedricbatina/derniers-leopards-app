<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

/**
 * Canonical + base URL
 */
const canonicalPath = computed(() => localePath('/explore/timeline'))
const baseUrl = computed(() => config.public?.SITE_URL || '')
const canonicalUrl = computed(() => (
  baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value
))

/**
 * SEO
 */
const seoTitle = computed(() => t('seo.explore.timeline.title'))
const seoDescription = computed(() => t('seo.explore.timeline.description'))
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
 * (aucun #anchor)
 */
const linkMap = {
  pillars: {
    events: '/explore/scenes',
    arcs: '/explore/characters',
    versions: '/explore/access',
  },
  practice: {
    one: '/explore/structuring',
    two: '/explore/characters',
    three: '/explore/access',
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
    <div class="card card-hover card-accent accent-river overflow-hidden js-reveal">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:timeline" aria-hidden="true" />
            {{ t('explore.timelinePage.hero.badge') }}
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            {{ t('explore.timelinePage.hero.title') }}
          </h1>

          <p class="text-subtle max-w-2xl">
            {{ t('explore.timelinePage.hero.lead') }}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <NuxtLink :to="localePath('/explore/workflow')" class="btn btn-primary focus-ring">
              <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
              {{ t('explore.timelinePage.hero.ctaWorkflow') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:compass-outline" aria-hidden="true" />
              {{ t('explore.common.backExplore') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/register')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:account-plus" aria-hidden="true" />
              {{ t('explore.common.start') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- PILLARS (cards cliquables individuellement) -->
    <div class="grid gap-4 lg:grid-cols-3">
      <NuxtLink
        :to="localePath(linkMap.pillars.events)"
        class="card-link focus-ring js-reveal"
        aria-label="Chronologie — Événements"
      >
        <div class="card card-hover card-accent accent-earth bg-surface2 h-full">
          <div class="card-body space-y-2">
            <div class="badge badge-accent w-fit">
              <Icon name="mdi:calendar-clock-outline" aria-hidden="true" />
              {{ t('explore.timelinePage.pillars.events.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.timelinePage.pillars.events.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.timelinePage.pillars.events.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        :to="localePath(linkMap.pillars.arcs)"
        class="card-link focus-ring js-reveal"
        aria-label="Chronologie — Arcs & périodes"
      >
        <div class="card card-hover card-accent accent-forest bg-surface2 h-full">
          <div class="card-body space-y-2">
            <div class="badge badge-accent w-fit">
              <Icon name="mdi:map-marker-path" aria-hidden="true" />
              {{ t('explore.timelinePage.pillars.arcs.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.timelinePage.pillars.arcs.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.timelinePage.pillars.arcs.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        :to="localePath(linkMap.pillars.versions)"
        class="card-link focus-ring js-reveal"
        aria-label="Chronologie — Versions"
      >
        <div class="card card-hover card-accent accent-copper bg-surface2 h-full">
          <div class="card-body space-y-2">
            <div class="badge badge-accent w-fit">
              <Icon name="mdi:source-branch" aria-hidden="true" />
              {{ t('explore.timelinePage.pillars.versions.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.timelinePage.pillars.versions.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.timelinePage.pillars.versions.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- PRACTICAL -->
    <div class="card js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.timelinePage.practice.title') }}
            </div>
            <div class="text-sm text-muted">
              {{ t('explore.timelinePage.practice.subtitle') }}
            </div>
          </div>
          <div class="badge">
            <Icon name="mdi:toolbox-outline" aria-hidden="true" />
            {{ t('explore.timelinePage.practice.badge') }}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3 mt-4">
          <NuxtLink
            :to="localePath(linkMap.practice.one)"
            class="card-link focus-ring js-reveal"
            aria-label="Concrètement — Vision"
          >
            <div class="card card-hover bg-surface2 card-accent accent-earth h-full">
              <div class="card-body space-y-2">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:flag-outline" aria-hidden="true" />
                  {{ t('explore.timelinePage.practice.one.badge') }}
                </div>
                <div class="font-extrabold title-gradient">
                  {{ t('explore.timelinePage.practice.one.title') }}
                </div>
                <p class="text-sm text-muted">
                  {{ t('explore.timelinePage.practice.one.desc') }}
                </p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="localePath(linkMap.practice.two)"
            class="card-link focus-ring js-reveal"
            aria-label="Concrètement — Liens"
          >
            <div class="card card-hover bg-surface2 card-accent accent-river h-full">
              <div class="card-body space-y-2">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:link-variant" aria-hidden="true" />
                  {{ t('explore.timelinePage.practice.two.badge') }}
                </div>
                <div class="font-extrabold title-gradient">
                  {{ t('explore.timelinePage.practice.two.title') }}
                </div>
                <p class="text-sm text-muted">
                  {{ t('explore.timelinePage.practice.two.desc') }}
                </p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="localePath(linkMap.practice.three)"
            class="card-link focus-ring js-reveal"
            aria-label="Concrètement — Pilotage"
          >
            <div class="card card-hover bg-surface2 card-accent accent-copper h-full">
              <div class="card-body space-y-2">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:check-circle-outline" aria-hidden="true" />
                  {{ t('explore.timelinePage.practice.three.badge') }}
                </div>
                <div class="font-extrabold title-gradient">
                  {{ t('explore.timelinePage.practice.three.title') }}
                </div>
                <p class="text-sm text-muted">
                  {{ t('explore.timelinePage.practice.three.desc') }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- CTA NEXT -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:shield-lock-outline" aria-hidden="true" />
            {{ t('explore.timelinePage.bottom.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">
            {{ t('explore.timelinePage.bottom.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('explore.timelinePage.bottom.desc') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localePath('/explore/access')" class="btn btn-primary focus-ring">
            <Icon name="mdi:arrow-right" aria-hidden="true" />
            {{ t('explore.timelinePage.bottom.ctaAccess') }}
          </NuxtLink>

          <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
            {{ t('explore.common.backExplore') }}
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
