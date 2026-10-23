<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const canonicalPath = computed(() => localePath('/explore/glossary'))
const baseUrl = computed(() => config.public?.SITE_URL || '')
const canonicalUrl = computed(() => (
  baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value
))

const seoTitle = computed(() => t('seo.explore.glossary.title'))
const seoDescription = computed(() => t('seo.explore.glossary.description'))

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

/** Liens depuis le guide glossaire vers les entrées publiques utiles */
const linkMap = {
  pillars: {
    terms: '/glossary',
    canon: '/explore/structuring',
    variants: '/explore/workflow',
  },
  outputs: {
    one: '/glossary',
    two: '/explore/scenes',
    three: '/explore/characters',
  },
}

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
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
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
    <div class="card card-hover card-accent accent-copper overflow-hidden js-reveal">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:book-alphabet" aria-hidden="true" />
            {{ t('explore.glossaryPage.hero.badge') }}
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            {{ t('explore.glossaryPage.hero.title') }}
          </h1>

          <p class="text-subtle max-w-2xl">
            {{ t('explore.glossaryPage.hero.lead') }}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <NuxtLink :to="localePath('/glossary')" class="btn btn-primary focus-ring">
              <Icon name="mdi:book-open-page-variant-outline" aria-hidden="true" />
              {{ t('explore.glossaryPage.hero.ctaOpen') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:compass-outline" aria-hidden="true" />
              {{ t('explore.common.backExplore') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/explore/structuring')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:arrow-right" aria-hidden="true" />
              {{ t('explore.glossaryPage.hero.ctaNext') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <NuxtLink :to="localePath(linkMap.pillars.terms)" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-earth bg-surface2">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:format-list-bulleted-type" aria-hidden="true" />
                {{ t('explore.glossaryPage.pillars.terms.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold text-lg title-gradient">{{ t('explore.glossaryPage.pillars.terms.title') }}</div>
            <p class="text-sm text-muted">{{ t('explore.glossaryPage.pillars.terms.desc') }}</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath(linkMap.pillars.canon)" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-river bg-surface2">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:shield-star-outline" aria-hidden="true" />
                {{ t('explore.glossaryPage.pillars.canon.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold text-lg title-gradient">{{ t('explore.glossaryPage.pillars.canon.title') }}</div>
            <p class="text-sm text-muted">{{ t('explore.glossaryPage.pillars.canon.desc') }}</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath(linkMap.pillars.variants)" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-copper bg-surface2">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:translate" aria-hidden="true" />
                {{ t('explore.glossaryPage.pillars.variants.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold text-lg title-gradient">{{ t('explore.glossaryPage.pillars.variants.title') }}</div>
            <p class="text-sm text-muted">{{ t('explore.glossaryPage.pillars.variants.desc') }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div class="card js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-extrabold text-lg title-gradient">{{ t('explore.glossaryPage.outputs.title') }}</div>
            <div class="text-sm text-muted">{{ t('explore.glossaryPage.outputs.subtitle') }}</div>
          </div>
          <div class="badge">
            <Icon name="mdi:checkbox-multiple-marked-outline" aria-hidden="true" />
            {{ t('explore.glossaryPage.outputs.badge') }}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3 mt-4">
          <NuxtLink :to="localePath(linkMap.outputs.one)" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-earth">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:text-box-outline" aria-hidden="true" />
                    {{ t('explore.glossaryPage.outputs.one.badge') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="font-extrabold title-gradient">{{ t('explore.glossaryPage.outputs.one.title') }}</div>
                <p class="text-sm text-muted">{{ t('explore.glossaryPage.outputs.one.desc') }}</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath(linkMap.outputs.two)" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-river">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:movie-open-outline" aria-hidden="true" />
                    {{ t('explore.glossaryPage.outputs.two.badge') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="font-extrabold title-gradient">{{ t('explore.glossaryPage.outputs.two.title') }}</div>
                <p class="text-sm text-muted">{{ t('explore.glossaryPage.outputs.two.desc') }}</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath(linkMap.outputs.three)" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-copper">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:account-group-outline" aria-hidden="true" />
                    {{ t('explore.glossaryPage.outputs.three.badge') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="font-extrabold title-gradient">{{ t('explore.glossaryPage.outputs.three.title') }}</div>
                <p class="text-sm text-muted">{{ t('explore.glossaryPage.outputs.three.desc') }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:graph-outline" aria-hidden="true" />
            {{ t('explore.glossaryPage.bottom.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">{{ t('explore.glossaryPage.bottom.title') }}</div>
          <p class="text-sm text-muted">{{ t('explore.glossaryPage.bottom.desc') }}</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localePath('/explore/structuring')" class="btn btn-primary focus-ring">
            <Icon name="mdi:arrow-right" aria-hidden="true" />
            {{ t('explore.glossaryPage.bottom.ctaNext') }}
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

.card-link { display: block; text-decoration: none; color: inherit; }
</style>
