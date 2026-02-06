<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

/**
 * Canonical
 */
const canonicalPath = computed(() => localePath('/explore/scenes'))
const baseUrl = computed(() => config.public?.SITE_URL || '')
const canonicalUrl = computed(() => (
  baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value
))

/**
 * SEO
 */
const seoTitle = computed(() => t('seo.explore.scenesPage.title'))
const seoDescription = computed(() => t('seo.explore.scenesPage.description'))

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
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
 * “Vraies pages” pour rendre les cards utiles
 * Ajuste si tes routes sont différentes.
 */
const linkMap = {
  pillars: {
    structure: '/scenes',      // module scènes
    casting: '/characters',    // module personnages
    versions: '/explore/timeline', // guide timeline (versions / révisions)
  },
  outputs: {
    one: '/scenes',
    two: '/characters',
    three: '/explore/workflow',
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

onBeforeUnmount(() => { if (io) io.disconnect() })
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <!-- HERO -->
    <div class="card card-hover card-accent accent-forest overflow-hidden js-reveal">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:movie-open" aria-hidden="true" />
            {{ t('explore.scenesPage.hero.badge') }}
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            {{ t('explore.scenesPage.hero.title') }}
          </h1>

          <p class="text-subtle max-w-2xl">
            {{ t('explore.scenesPage.hero.lead') }}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <NuxtLink :to="localePath('/scenes')" class="btn btn-primary focus-ring">
              <Icon name="mdi:script-text-outline" aria-hidden="true" />
              {{ t('explore.scenesPage.hero.ctaOpen') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:compass-outline" aria-hidden="true" />
              {{ t('explore.common.backExplore') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore/timeline')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:arrow-right" aria-hidden="true" />
              {{ t('explore.scenesPage.hero.ctaNext') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- PILLARS (cards cliquables) -->
    <div class="grid gap-4 lg:grid-cols-3">
      <NuxtLink :to="localePath(linkMap.pillars.structure)" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-river bg-surface2">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:clipboard-text-outline" aria-hidden="true" />
                {{ t('explore.scenesPage.pillars.structure.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.scenesPage.pillars.structure.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.scenesPage.pillars.structure.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath(linkMap.pillars.casting)" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-earth bg-surface2">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:account-multiple-outline" aria-hidden="true" />
                {{ t('explore.scenesPage.pillars.casting.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.scenesPage.pillars.casting.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.scenesPage.pillars.casting.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath(linkMap.pillars.versions)" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-copper bg-surface2">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:source-branch" aria-hidden="true" />
                {{ t('explore.scenesPage.pillars.versions.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold text-lg title-gradient">
              {{ t('explore.scenesPage.pillars.versions.title') }}
            </div>
            <p class="text-sm text-muted">
              {{ t('explore.scenesPage.pillars.versions.desc') }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- OUTPUTS (cards cliquables) -->
    <div class="card js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-extrabold text-lg title-gradient">{{ t('explore.scenesPage.outputs.title') }}</div>
            <div class="text-sm text-muted">{{ t('explore.scenesPage.outputs.subtitle') }}</div>
          </div>
          <div class="badge">
            <Icon name="mdi:checkbox-multiple-marked-outline" aria-hidden="true" />
            {{ t('explore.scenesPage.outputs.badge') }}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3 mt-4">
          <NuxtLink :to="localePath(linkMap.outputs.one)" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-earth">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:eye-outline" aria-hidden="true" />
                    {{ t('explore.scenesPage.outputs.one.badge') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="font-extrabold title-gradient">{{ t('explore.scenesPage.outputs.one.title') }}</div>
                <p class="text-sm text-muted">{{ t('explore.scenesPage.outputs.one.desc') }}</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath(linkMap.outputs.two)" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-river">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:link-variant" aria-hidden="true" />
                    {{ t('explore.scenesPage.outputs.two.badge') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="font-extrabold title-gradient">{{ t('explore.scenesPage.outputs.two.title') }}</div>
                <p class="text-sm text-muted">{{ t('explore.scenesPage.outputs.two.desc') }}</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath(linkMap.outputs.three)" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-copper">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:export-variant" aria-hidden="true" />
                    {{ t('explore.scenesPage.outputs.three.badge') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="font-extrabold title-gradient">{{ t('explore.scenesPage.outputs.three.title') }}</div>
                <p class="text-sm text-muted">{{ t('explore.scenesPage.outputs.three.desc') }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- NEXT -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:timeline" aria-hidden="true" />
            {{ t('explore.scenesPage.bottom.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.scenesPage.bottom.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.scenesPage.bottom.desc') }}</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localePath('/explore/timeline')" class="btn btn-primary focus-ring">
            <Icon name="mdi:arrow-right" aria-hidden="true" />
            {{ t('explore.scenesPage.bottom.ctaNext') }}
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
.js-reveal.is-revealed { opacity: 1; transform: translateY(0); }

/* rendre les cards NuxtLink clean */
.card-link { display: block; text-decoration: none; color: inherit; }
</style>
