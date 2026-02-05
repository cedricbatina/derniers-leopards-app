<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const canonicalPath = computed(() => localePath('/explore/characters'))
const baseUrl = config.public?.SITE_URL || ''
const canonicalUrl = computed(() => (baseUrl ? new URL(canonicalPath.value, baseUrl).toString() : canonicalPath.value))

useSeoMeta({
  title: () => t('seo.explore.charactersPage.title'),
  description: () => t('seo.explore.charactersPage.description'),
  ogTitle: () => t('seo.explore.charactersPage.title'),
  ogDescription: () => t('seo.explore.charactersPage.description'),
  ogType: 'website',
  ogUrl: canonicalUrl,
})

useHead({ link: [{ rel: 'canonical', href: canonicalUrl.value }] })

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: t('seo.explore.charactersPage.title'),
  description: t('seo.explore.charactersPage.description'),
  inLanguage: locale.value,
  url: baseUrl || canonicalUrl.value,
}))

useHead({ script: [{ type: 'application/ld+json', children: JSON.stringify(jsonLd.value) }] })

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
    <div class="card card-hover card-accent accent-earth overflow-hidden js-reveal">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:account-group-outline" aria-hidden="true" />
            {{ t('explore.charactersPage.hero.badge') }}
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            {{ t('explore.charactersPage.hero.title') }}
          </h1>

          <p class="text-subtle max-w-2xl">
            {{ t('explore.charactersPage.hero.lead') }}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <NuxtLink :to="localePath('/characters')" class="btn btn-primary focus-ring">
              <Icon name="mdi:account-details-outline" aria-hidden="true" />
              {{ t('explore.charactersPage.hero.ctaOpen') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:compass-outline" aria-hidden="true" />
              {{ t('explore.common.backExplore') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore/scenes')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:arrow-right" aria-hidden="true" />
              {{ t('explore.charactersPage.hero.ctaNext') }}
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
            <Icon name="mdi:id-card" aria-hidden="true" />
            {{ t('explore.charactersPage.pillars.sheet.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.charactersPage.pillars.sheet.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.charactersPage.pillars.sheet.desc') }}</p>
        </div>
      </div>

      <div class="card card-hover card-accent accent-forest js-reveal">
        <div class="card-body space-y-2">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:vector-link" aria-hidden="true" />
            {{ t('explore.charactersPage.pillars.relations.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.charactersPage.pillars.relations.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.charactersPage.pillars.relations.desc') }}</p>
        </div>
      </div>

      <div class="card card-hover card-accent accent-copper js-reveal">
        <div class="card-body space-y-2">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:eye-outline" aria-hidden="true" />
            {{ t('explore.charactersPage.pillars.pov.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.charactersPage.pillars.pov.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.charactersPage.pillars.pov.desc') }}</p>
        </div>
      </div>
    </div>

    <!-- PRACTICAL -->
    <div class="card js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-extrabold text-lg title-gradient">{{ t('explore.charactersPage.outputs.title') }}</div>
            <div class="text-sm text-muted">{{ t('explore.charactersPage.outputs.subtitle') }}</div>
          </div>
          <div class="badge">
            <Icon name="mdi:checkbox-multiple-marked-outline" aria-hidden="true" />
            {{ t('explore.charactersPage.outputs.badge') }}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3 mt-4">
          <div class="card card-hover bg-surface2 card-accent accent-earth js-reveal">
            <div class="card-body space-y-2">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:check-decagram-outline" aria-hidden="true" />
                {{ t('explore.charactersPage.outputs.one.badge') }}
              </div>
              <div class="font-extrabold title-gradient">{{ t('explore.charactersPage.outputs.one.title') }}</div>
              <p class="text-sm text-muted">{{ t('explore.charactersPage.outputs.one.desc') }}</p>
            </div>
          </div>

          <div class="card card-hover bg-surface2 card-accent accent-river js-reveal">
            <div class="card-body space-y-2">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:link-variant" aria-hidden="true" />
                {{ t('explore.charactersPage.outputs.two.badge') }}
              </div>
              <div class="font-extrabold title-gradient">{{ t('explore.charactersPage.outputs.two.title') }}</div>
              <p class="text-sm text-muted">{{ t('explore.charactersPage.outputs.two.desc') }}</p>
            </div>
          </div>

          <div class="card card-hover bg-surface2 card-accent accent-copper js-reveal">
            <div class="card-body space-y-2">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:format-list-bulleted" aria-hidden="true" />
                {{ t('explore.charactersPage.outputs.three.badge') }}
              </div>
              <div class="font-extrabold title-gradient">{{ t('explore.charactersPage.outputs.three.title') }}</div>
              <p class="text-sm text-muted">{{ t('explore.charactersPage.outputs.three.desc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NEXT -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:movie-open" aria-hidden="true" />
            {{ t('explore.charactersPage.bottom.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.charactersPage.bottom.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.charactersPage.bottom.desc') }}</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localePath('/explore/scenes')" class="btn btn-primary focus-ring">
            <Icon name="mdi:arrow-right" aria-hidden="true" />
            {{ t('explore.charactersPage.bottom.ctaNext') }}
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
.js-reveal { opacity: 0; transform: translateY(10px); transition: opacity 420ms ease, transform 420ms ease; transition-delay: var(--reveal-delay, 0ms); }
.js-reveal.is-revealed { opacity: 1; transform: translateY(0); }
</style>
