<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

/**
 * SEO
 */
const canonicalPath = computed(() => localePath('/explore/structuring'))
const baseUrl = config.public?.SITE_URL || ''
const canonicalUrl = computed(() => (
  baseUrl ? new URL(canonicalPath.value, baseUrl).toString() : canonicalPath.value
))

useSeoMeta({
  title: () => t('seo.explore.structuring.title'),
  description: () => t('seo.explore.structuring.description'),
  ogTitle: () => t('seo.explore.structuring.title'),
  ogDescription: () => t('seo.explore.structuring.description'),
  ogType: 'website',
  ogUrl: canonicalUrl,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
})

/**
 * JSON-LD
 */
const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: t('seo.explore.structuring.title'),
  description: t('seo.explore.structuring.description'),
  inLanguage: locale.value,
  url: baseUrl || canonicalUrl.value,
}))

useHead({
  script: [{ type: 'application/ld+json', children: JSON.stringify(jsonLd.value) }],
})

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
    <div class="card card-hover card-accent accent-earth overflow-hidden js-reveal">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:layers-triple" aria-hidden="true" />
            {{ t('explore.structuring.hero.badge') }}
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            {{ t('explore.structuring.hero.title') }}
          </h1>

          <p class="text-subtle max-w-2xl">
            {{ t('explore.structuring.hero.lead') }}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <NuxtLink :to="localePath('/explore/workflow')" class="btn btn-primary focus-ring">
              <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
              {{ t('explore.structuring.hero.ctaWorkflow') }}
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

    <!-- PILLARS -->
    <div class="grid gap-4 lg:grid-cols-3">
      <div class="card card-hover card-accent accent-river js-reveal">
        <div class="card-body space-y-2">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:book-open-page-variant-outline" aria-hidden="true" />
            {{ t('explore.structuring.pillars.project.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.structuring.pillars.project.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.structuring.pillars.project.desc') }}</p>
        </div>
      </div>

      <div class="card card-hover card-accent accent-forest js-reveal">
        <div class="card-body space-y-2">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:shape-outline" aria-hidden="true" />
            {{ t('explore.structuring.pillars.entities.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.structuring.pillars.entities.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.structuring.pillars.entities.desc') }}</p>
        </div>
      </div>

      <div class="card card-hover card-accent accent-copper js-reveal">
        <div class="card-body space-y-2">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:vector-link" aria-hidden="true" />
            {{ t('explore.structuring.pillars.links.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.structuring.pillars.links.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.structuring.pillars.links.desc') }}</p>
        </div>
      </div>
    </div>

    <!-- WHAT YOU GET -->
    <div class="card card-hover card-accent accent-earth js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.structuring.outputs.title') }}
            </div>
            <div class="text-sm text-muted">
              {{ t('explore.structuring.outputs.subtitle') }}
            </div>
          </div>
          <div class="badge">
            <Icon name="mdi:checkbox-multiple-marked-outline" aria-hidden="true" />
            {{ t('explore.structuring.outputs.badge') }}
          </div>
        </div>

      <div class="grid gap-3 sm:grid-cols-3 mt-4">
  <!-- 1) Cohérence -->
  <div class="card card-hover bg-surface2 card-accent accent-earth js-reveal">
    <div class="card-body space-y-2">
      <div class="flex items-start justify-between gap-3">
        <div class="badge badge-accent w-fit">
          <Icon name="mdi:check-decagram-outline" aria-hidden="true" />
          {{ t('explore.structuring.outputs.one.kicker') }}
        </div>
        <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
      </div>

      <div class="font-extrabold title-gradient">
        {{ t('explore.structuring.outputs.one.title') }}
      </div>
      <p class="text-sm text-muted">
        {{ t('explore.structuring.outputs.one.desc') }}
      </p>
    </div>
  </div>

  <!-- 2) Réutilisation -->
  <div class="card card-hover bg-surface2 card-accent accent-river js-reveal">
    <div class="card-body space-y-2">
      <div class="flex items-start justify-between gap-3">
        <div class="badge badge-accent w-fit">
          <Icon name="mdi:cached" aria-hidden="true" />
          {{ t('explore.structuring.outputs.two.kicker') }}
        </div>
        <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
      </div>

      <div class="font-extrabold title-gradient">
        {{ t('explore.structuring.outputs.two.title') }}
      </div>
      <p class="text-sm text-muted">
        {{ t('explore.structuring.outputs.two.desc') }}
      </p>
    </div>
  </div>

  <!-- 3) Transmission -->
  <div class="card card-hover bg-surface2 card-accent accent-copper js-reveal">
    <div class="card-body space-y-2">
      <div class="flex items-start justify-between gap-3">
        <div class="badge badge-accent w-fit">
          <Icon name="mdi:account-group-outline" aria-hidden="true" />
          {{ t('explore.structuring.outputs.three.kicker') }}
        </div>
        <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
      </div>

      <div class="font-extrabold title-gradient">
        {{ t('explore.structuring.outputs.three.title') }}
      </div>
      <p class="text-sm text-muted">
        {{ t('explore.structuring.outputs.three.desc') }}
      </p>
    </div>
  </div>
</div>

      </div>
    </div>

    <!-- CTA NEXT -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:timeline" aria-hidden="true" />
            {{ t('explore.structuring.bottom.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">
            {{ t('explore.structuring.bottom.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('explore.structuring.bottom.desc') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localePath('/explore/timeline')" class="btn btn-primary focus-ring">
            <Icon name="mdi:arrow-right" aria-hidden="true" />
            {{ t('explore.structuring.bottom.ctaTimeline') }}
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
</style>
