<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

/**
 * Canonical + base URL
 */
const canonicalPath = computed(() => localePath('/explore/workflow'))
const baseUrl = computed(() => config.public?.SITE_URL || '')
const canonicalUrl = computed(() => (
  baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value
))

/**
 * SEO
 */
const seoTitle = computed(() => t('seo.explore.workflow.title'))
const seoDescription = computed(() => t('seo.explore.workflow.description'))
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
 * Step cards destinations (vraies pages)
 * Ajuste si tes routes sont différentes.
 */
const stepLinks = {
  one: '/studio/projects',
  two: '/explore/structuring',
  three: '/explore/access',
}

/**
 * Reveal on scroll (opt-in via .js-reveal)
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
            <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
            {{ t('explore.workflow.badge') }}
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            {{ t('explore.workflow.title') }}
          </h1>

          <p class="text-subtle max-w-2xl">
            {{ t('explore.workflow.lead') }}
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

            <NuxtLink :to="localePath('/')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:home-outline" aria-hidden="true" />
              {{ t('explore.common.home') }}
            </NuxtLink>
          </div>

          <!-- Quick nav -->
          <div class="flex flex-wrap gap-2 pt-2">
            <a class="pill" href="#step-1">
              <Icon name="mdi:numeric-1-circle-outline" aria-hidden="true" />
              {{ t('explore.workflow.quickNav.step1') }}
            </a>
            <a class="pill" href="#step-2">
              <Icon name="mdi:numeric-2-circle-outline" aria-hidden="true" />
              {{ t('explore.workflow.quickNav.step2') }}
            </a>
            <a class="pill" href="#step-3">
              <Icon name="mdi:numeric-3-circle-outline" aria-hidden="true" />
              {{ t('explore.workflow.quickNav.step3') }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- STEPS (cards cliquables) -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- STEP 1 -->
      <div id="step-1" class="js-reveal">
        <NuxtLink :to="localePath(stepLinks.one)" class="card-link">
          <div class="card card-hover bg-surface2 card-accent accent-earth">
            <div class="card-body space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:folder-outline" aria-hidden="true" />
                  {{ t('explore.workflow.steps.one.badge') }}
                </div>
                <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
              </div>

              <div>
                <div class="text-xs text-muted">{{ t('explore.workflow.steps.one.kicker') }}</div>
                <div class="font-extrabold text-lg title-gradient">
                  {{ t('explore.workflow.steps.one.title') }}
                </div>
              </div>

              <p class="text-sm text-muted">
                {{ t('explore.workflow.steps.one.desc') }}
              </p>

              <div class="divider" />

              <div class="space-y-1">
                <div class="text-xs text-muted">{{ t('explore.workflow.steps.one.sectionTitle') }}</div>
                <ul class="text-sm text-muted list-disc pl-5 space-y-1">
                  <li>{{ t('explore.workflow.steps.one.bullets.0') }}</li>
                  <li>{{ t('explore.workflow.steps.one.bullets.1') }}</li>
                  <li>{{ t('explore.workflow.steps.one.bullets.2') }}</li>
                </ul>
              </div>

              <div class="pt-2">
                <span class="btn btn-ghost focus-ring">
                  <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
                  {{ t('explore.workflow.steps.one.cta') }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- STEP 2 -->
      <div id="step-2" class="js-reveal">
        <NuxtLink :to="localePath(stepLinks.two)" class="card-link">
          <div class="card card-hover bg-surface2 card-accent accent-river">
            <div class="card-body space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:layers-triple" aria-hidden="true" />
                  {{ t('explore.workflow.steps.two.badge') }}
                </div>
                <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
              </div>

              <div>
                <div class="text-xs text-muted">{{ t('explore.workflow.steps.two.kicker') }}</div>
                <div class="font-extrabold text-lg title-gradient">
                  {{ t('explore.workflow.steps.two.title') }}
                </div>
              </div>

              <p class="text-sm text-muted">
                {{ t('explore.workflow.steps.two.desc') }}
              </p>

              <div class="divider" />

              <div class="space-y-1">
                <div class="text-xs text-muted">{{ t('explore.workflow.steps.two.sectionTitle') }}</div>
                <ul class="text-sm text-muted list-disc pl-5 space-y-1">
                  <li>{{ t('explore.workflow.steps.two.bullets.0') }}</li>
                  <li>{{ t('explore.workflow.steps.two.bullets.1') }}</li>
                  <li>{{ t('explore.workflow.steps.two.bullets.2') }}</li>
                </ul>
              </div>

              <div class="pt-2 flex flex-wrap gap-2">
                <span class="btn btn-ghost focus-ring">
                  <Icon name="mdi:layers-triple" aria-hidden="true" />
                  {{ t('explore.common.structuring') }}
                </span>
                <span class="btn btn-ghost focus-ring">
                  <Icon name="mdi:timeline" aria-hidden="true" />
                  {{ t('explore.common.timeline') }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- STEP 3 -->
      <div id="step-3" class="js-reveal">
        <NuxtLink :to="localePath(stepLinks.three)" class="card-link">
          <div class="card card-hover bg-surface2 card-accent accent-copper">
            <div class="card-body space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div class="badge badge-accent w-fit">
                  <Icon name="mdi:export-variant" aria-hidden="true" />
                  {{ t('explore.workflow.steps.three.badge') }}
                </div>
                <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
              </div>

              <div>
                <div class="text-xs text-muted">{{ t('explore.workflow.steps.three.kicker') }}</div>
                <div class="font-extrabold text-lg title-gradient">
                  {{ t('explore.workflow.steps.three.title') }}
                </div>
              </div>

              <p class="text-sm text-muted">
                {{ t('explore.workflow.steps.three.desc') }}
              </p>

              <div class="divider" />

              <div class="space-y-1">
                <div class="text-xs text-muted">{{ t('explore.workflow.steps.three.sectionTitle') }}</div>
                <ul class="text-sm text-muted list-disc pl-5 space-y-1">
                  <li>{{ t('explore.workflow.steps.three.bullets.0') }}</li>
                  <li>{{ t('explore.workflow.steps.three.bullets.1') }}</li>
                  <li>{{ t('explore.workflow.steps.three.bullets.2') }}</li>
                </ul>
              </div>

              <div class="pt-2 flex flex-wrap gap-2">
                <span class="btn btn-ghost focus-ring">
                  <Icon name="mdi:shield-lock-outline" aria-hidden="true" />
                  {{ t('explore.common.accessRoles') }}
                </span>
                <span class="btn btn-ghost focus-ring">
                  <Icon name="mdi:movie-open" aria-hidden="true" />
                  {{ t('explore.common.studios') }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- BOTTOM CTA -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <div class="badge badge-accent w-fit">
            <Icon name="mdi:flash-outline" aria-hidden="true" />
            {{ t('explore.workflow.bottom.badge') }}
          </div>
          <div class="font-extrabold text-lg title-gradient">
            {{ t('explore.workflow.bottom.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('explore.workflow.bottom.desc') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localePath('/register')" class="btn btn-primary focus-ring">
            {{ t('explore.common.start') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
            {{ t('explore.common.backGuide') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#step-1, #step-2, #step-3 { scroll-margin-top: 110px; }

.js-reveal {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 420ms ease, transform 420ms ease;
  transition-delay: var(--reveal-delay, 0ms);
}
.js-reveal.is-revealed { opacity: 1; transform: translateY(0); }

.card-link { display: block; text-decoration: none; color: inherit; }
</style>
