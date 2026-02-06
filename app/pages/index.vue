<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'
import { useAuthStore } from '~/stores/auth.store'

const { t, locale, te } = useI18n()

const localePath = useLocalePath()
const config = useRuntimeConfig()

const auth = useAuthStore()
const isAuthed = computed(() => !!auth.user?.id)

/**
 * SEO (i18n)
 */
const siteName = 'Sonekeno'
const canonicalPath = computed(() => localePath('/'))
const baseUrl = config.public?.SITE_URL || ''
const canonicalUrl = computed(() => (
  baseUrl ? new URL(canonicalPath.value, baseUrl).toString() : canonicalPath.value
))
const learnMore = computed(() =>
  te('landing.common.learnMore') ? t('landing.common.learnMore') : 'En savoir plus'
)

const title = computed(() => t('seo.home.title', { app: siteName }))
const description = computed(() => t('seo.home.description', { app: siteName }))
const ogImage = computed(() => (
  baseUrl ? new URL('/images/og-home.png', baseUrl).toString() : '/images/og-home.png'
))

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
})

/**
 * JSON-LD (Schema.org)
 */
const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: baseUrl || canonicalUrl.value,
  inLanguage: locale.value,
  description: description.value,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl || ''}${localePath('/explore')}?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}))

useHead({
  script: [{ type: 'application/ld+json', children: JSON.stringify(jsonLd.value) }],
})

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

onBeforeUnmount(() => {
  if (io) io.disconnect()
})
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <!-- HERO (pas cliquable: contient déjà des liens) -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-4 max-w-2xl">
            <p class="badge badge-accent">
              <Icon name="mdi:creation" aria-hidden="true" />
              {{ t('landing.hero.kicker') }}
            </p>

            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
              {{ t('landing.hero.title') }}
            </h1>

            <p class="text-base sm:text-lg text-subtle">
              {{ t('landing.hero.subtitle') }}
            </p>

            <div class="flex flex-wrap gap-2 pt-2">
              <NuxtLink
                v-if="!isAuthed"
                :to="localePath('/register')"
                class="btn btn-primary focus-ring"
              >
                <Icon name="mdi:account-plus" aria-hidden="true" />
                {{ t('landing.hero.ctaPrimary') }}
              </NuxtLink>

              <NuxtLink
                v-if="!isAuthed"
                :to="localePath('/login')"
                class="btn btn-ghost focus-ring"
              >
                <Icon name="mdi:login" aria-hidden="true" />
                {{ t('landing.hero.ctaSecondary') }}
              </NuxtLink>

              <NuxtLink
                v-else
                :to="localePath('/studio/projects')"
                class="btn btn-primary focus-ring"
              >
                <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
                {{ t('landing.hero.ctaAuthed') }}
              </NuxtLink>

              <NuxtLink
                :to="localePath('/explore')"
                class="btn btn-ghost focus-ring"
              >
                <Icon name="mdi:compass-outline" aria-hidden="true" />
                {{ t('landing.hero.ctaExplore') }}
              </NuxtLink>
            </div>

            <div class="pt-3 text-xs text-muted">
              {{ t('landing.hero.trustLine') }}
            </div>
          </div>

          <!-- Audience + quick highlights (cards cliquables) -->
          <div class="w-full lg:w-md">
            <div class="grid grid-cols-2 gap-3">
              <!-- Écriture -->
              <NuxtLink
                :to="localePath('/explore/writing')"
                class="card-link js-reveal"
                :aria-label="t('landing.tiles.authors.title')"
              >
                <div class="card card-hover bg-surface2 accent-earth">
                  <div class="card-body">
                    <div class="text-xs text-muted">{{ t('landing.tiles.authors.label') }}</div>
                    <div class="text-lg font-extrabold title-gradient">{{ t('landing.tiles.authors.title') }}</div>
                    <div class="text-xs text-muted mt-1">{{ t('landing.tiles.authors.desc') }}</div>
                    <div class="mt-2 text-xs text-muted">→ {{ learnMore }}</div>
                  </div>
                </div>
              </NuxtLink>

              <!-- Éditeurs -->
              <NuxtLink
                :to="localePath('/explore/editors')"
                class="card-link js-reveal"
                :aria-label="t('landing.tiles.editors.title')"
              >
                <div class="card card-hover bg-surface2 accent-forest">
                  <div class="card-body">
                    <div class="text-xs text-muted">{{ t('landing.tiles.editors.label') }}</div>
                    <div class="text-lg font-extrabold title-gradient">{{ t('landing.tiles.editors.title') }}</div>
                    <div class="text-xs text-muted mt-1">{{ t('landing.tiles.editors.desc') }}</div>
                    <div class="mt-2 text-xs text-muted">→ {{ learnMore }}</div>
                  </div>
                </div>
              </NuxtLink>

              <!-- Studios -->
              <NuxtLink
                :to="localePath('/explore/studios')"
                class="card-link js-reveal"
                :aria-label="t('landing.tiles.studios.title')"
              >
                <div class="card card-hover bg-surface2 accent-river">
                  <div class="card-body">
                    <div class="text-xs text-muted">{{ t('landing.tiles.studios.label') }}</div>
                    <div class="text-lg font-extrabold title-gradient">{{ t('landing.tiles.studios.title') }}</div>
                    <div class="text-xs text-muted mt-1">{{ t('landing.tiles.studios.desc') }}</div>
                    <div class="mt-2 text-xs text-muted">→ {{ learnMore }}</div>
                  </div>
                </div>
              </NuxtLink>

              <!-- Créateurs -->
              <NuxtLink
                :to="localePath('/explore/creators')"
                class="card-link js-reveal"
                :aria-label="t('landing.tiles.creators.title')"
              >
                <div class="card card-hover bg-surface2 accent-copper">
                  <div class="card-body">
                    <div class="text-xs text-muted">{{ t('landing.tiles.creators.label') }}</div>
                    <div class="text-lg font-extrabold title-gradient">{{ t('landing.tiles.creators.title') }}</div>
                    <div class="text-xs text-muted mt-1">{{ t('landing.tiles.creators.desc') }}</div>
                    <div class="mt-2 text-xs text-muted">→ {{ learnMore }}</div>
                  </div>
                </div>
              </NuxtLink>
            </div>

            <!-- Micro (sécurité / accès) -->
            <NuxtLink
              :to="localePath('/explore/access')"
              class="card-link js-reveal"
              :aria-label="t('landing.micro.title')"
            >
              <div class="mt-3 card card-hover bg-surface2 card-accent accent-leopard">
                <div class="card-body flex items-center justify-between gap-3">
                  <div>
                    <div class="text-xs text-muted">{{ t('landing.micro.kicker') }}</div>
                    <div class="font-extrabold title-gradient">{{ t('landing.micro.title') }}</div>
                    <div class="text-xs text-muted mt-1">{{ t('landing.micro.desc') }}</div>
                    <div class="mt-2 text-xs text-muted">→ {{ learnMore }}</div>
                  </div>
                  <Icon name="mdi:shield-lock-outline" class="text-2xl" aria-hidden="true" />
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- VALUE PROPS (cliquables) -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Structuration -->
      <NuxtLink
        :to="localePath('/explore/structuring')"
        class="card-link js-reveal"
        :aria-label="t('landing.value.one.title')"
      >
        <div class="card card-hover card-accent accent-earth">
          <div class="card-body space-y-2">
            <div class="badge badge-accent">
              <Icon name="mdi:layers-triple" aria-hidden="true" />
              {{ t('landing.value.one.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">{{ t('landing.value.one.title') }}</div>
            <p class="text-sm text-muted">{{ t('landing.value.one.desc') }}</p>
            <div class="text-xs text-muted">→ {{ learnMore }}</div>
          </div>
        </div>
      </NuxtLink>

      <!-- Chronologie -->
      <NuxtLink
        :to="localePath('/explore/timeline')"
        class="card-link js-reveal"
        :aria-label="t('landing.value.two.title')"
      >
        <div class="card card-hover card-accent accent-river">
          <div class="card-body space-y-2">
            <div class="badge badge-accent">
              <Icon name="mdi:timeline" aria-hidden="true" />
              {{ t('landing.value.two.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">{{ t('landing.value.two.title') }}</div>
            <p class="text-sm text-muted">{{ t('landing.value.two.desc') }}</p>
            <div class="text-xs text-muted">→ {{ learnMore }}</div>
          </div>
        </div>
      </NuxtLink>

      <!-- Accès -->
      <NuxtLink
        :to="localePath('/explore/access')"
        class="card-link js-reveal"
        :aria-label="t('landing.value.three.title')"
      >
        <div class="card card-hover card-accent accent-copper">
          <div class="card-body space-y-2">
            <div class="badge badge-accent">
              <Icon name="mdi:book-open-page-variant" aria-hidden="true" />
              {{ t('landing.value.three.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">{{ t('landing.value.three.title') }}</div>
            <p class="text-sm text-muted">{{ t('landing.value.three.desc') }}</p>
            <div class="text-xs text-muted">→ {{ learnMore }}</div>
          </div>
        </div>
      </NuxtLink>
    </div>
<!-- MODULES -->
<div class="card js-reveal">
  <div class="card-body">
    <div class="flex items-center justify-between gap-3">
      <div class="space-y-1">
        <div class="font-extrabold title-gradient">{{ t('explore.index.modules.title') }}</div>
        <div class="text-sm text-muted">{{ t('explore.index.modules.subtitle') }}</div>
      </div>
      <div class="badge">
        <Icon name="mdi:apps" aria-hidden="true" />
        {{ t('explore.index.modules.badge') }}
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
      <!-- Characters -->
      <NuxtLink :to="localePath('/explore/characters')" class="card-link js-reveal">
        <div class="card card-hover bg-surface2 card-accent accent-earth h-full">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:account-group-outline" aria-hidden="true" />
                {{ t('explore.index.modules.cards.characters.title') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="text-sm text-muted">
              {{ t('explore.index.modules.cards.characters.desc') }}
            </div>
          </div>
        </div>
      </NuxtLink>

      <!-- Scenes -->
      <NuxtLink :to="localePath('/explore/scenes')" class="card-link js-reveal">
        <div class="card card-hover bg-surface2 card-accent accent-forest h-full">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:movie-open" aria-hidden="true" />
                {{ t('explore.index.modules.cards.scenes.title') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="text-sm text-muted">
              {{ t('explore.index.modules.cards.scenes.desc') }}
            </div>
          </div>
        </div>
      </NuxtLink>

      <!-- Timeline -->
      <NuxtLink :to="localePath('/explore/timeline')" class="card-link js-reveal">
        <div class="card card-hover bg-surface2 card-accent accent-river h-full">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:timeline" aria-hidden="true" />
                {{ t('explore.index.modules.cards.timeline.title') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="text-sm text-muted">
              {{ t('explore.index.modules.cards.timeline.desc') }}
            </div>
          </div>
        </div>
      </NuxtLink>

      <!-- Glossary -->
      <NuxtLink :to="localePath('/explore/glossary')" class="card-link js-reveal">
        <div class="card card-hover bg-surface2 card-accent accent-copper h-full">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:book-open-page-variant-outline" aria-hidden="true" />
                {{ t('explore.index.modules.cards.glossary.title') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="text-sm text-muted">
              {{ t('explore.index.modules.cards.glossary.desc') }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</div>

    <!-- HOW IT WORKS -->
    <div class="card card-hover card-accent accent-forest js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-extrabold text-lg title-gradient title-underline">{{ t('landing.how.title') }}</div>
            <div class="text-sm text-muted">{{ t('landing.how.subtitle') }}</div>
          </div>
          <div class="badge badge-accent">
            <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
            {{ t('landing.how.badge') }}
          </div>
        </div>

        <!-- Steps (cliquables vers /explore/workflow#step-x) -->
        <div class="grid gap-3 sm:grid-cols-3 mt-4">
          <NuxtLink
            :to="localePath('/explore/workflow') + '#step-1'"
            class="card-link js-reveal"
            :aria-label="t('landing.how.steps.one.title')"
          >
            <div class="card card-hover bg-surface2 accent-earth">
              <div class="card-body">
                <div class="text-xs text-muted">{{ t('landing.how.steps.one.kicker') }}</div>
                <div class="font-extrabold title-gradient">{{ t('landing.how.steps.one.title') }}</div>
                <div class="text-sm text-muted mt-1">{{ t('landing.how.steps.one.desc') }}</div>
                <div class="mt-2 text-xs text-muted">→ {{ learnMore }}</div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="localePath('/explore/workflow') + '#step-2'"
            class="card-link js-reveal"
            :aria-label="t('landing.how.steps.two.title')"
          >
            <div class="card card-hover bg-surface2 accent-river">
              <div class="card-body">
                <div class="text-xs text-muted">{{ t('landing.how.steps.two.kicker') }}</div>
                <div class="font-extrabold title-gradient">{{ t('landing.how.steps.two.title') }}</div>
                <div class="text-sm text-muted mt-1">{{ t('landing.how.steps.two.desc') }}</div>
                <div class="mt-2 text-xs text-muted">→ {{ learnMore }}</div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="localePath('/explore/workflow') + '#step-3'"
            class="card-link js-reveal"
            :aria-label="t('landing.how.steps.three.title')"
          >
            <div class="card card-hover bg-surface2 accent-copper">
              <div class="card-body">
                <div class="text-xs text-muted">{{ t('landing.how.steps.three.kicker') }}</div>
                <div class="font-extrabold title-gradient">{{ t('landing.how.steps.three.title') }}</div>
                <div class="text-sm text-muted mt-1">{{ t('landing.how.steps.three.desc') }}</div>
                <div class="mt-2 text-xs text-muted">→ {{ learnMore }}</div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="flex flex-wrap gap-2 mt-5">
          <NuxtLink v-if="!isAuthed" :to="localePath('/register')" class="btn btn-primary focus-ring">
            <Icon name="mdi:account-plus" aria-hidden="true" />
            {{ t('landing.bottomCta.primary') }}
          </NuxtLink>

          <NuxtLink v-if="!isAuthed" :to="localePath('/login')" class="btn btn-ghost focus-ring">
            <Icon name="mdi:login" aria-hidden="true" />
            {{ t('landing.bottomCta.secondary') }}
          </NuxtLink>

          <NuxtLink v-else :to="localePath('/studio/projects')" class="btn btn-primary focus-ring">
            <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
            {{ t('landing.bottomCta.authed') }}
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/features')" class="btn btn-ghost focus-ring">
            <Icon name="mdi:star-outline" aria-hidden="true" />
            {{ t('landing.bottomCta.features') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- FAQ (pas cliquable) -->
    <div class="card card-hover card-accent accent-river js-reveal">
      <div class="card-body">
        <div class="font-extrabold text-lg title-gradient title-underline">{{ t('landing.faq.title') }}</div>
        <div class="mt-4 grid gap-3">
          <details class="card card-hover bg-surface2 js-reveal">
            <summary class="card-body cursor-pointer font-bold">
              {{ t('landing.faq.q1.q') }}
            </summary>
            <div class="px-4 pb-4 text-sm text-muted">
              {{ t('landing.faq.q1.a') }}
            </div>
          </details>

          <details class="card card-hover bg-surface2 js-reveal">
            <summary class="card-body cursor-pointer font-bold">
              {{ t('landing.faq.q2.q') }}
            </summary>
            <div class="px-4 pb-4 text-sm text-muted">
              {{ t('landing.faq.q2.a') }}
            </div>
          </details>

          <details class="card card-hover bg-surface2 js-reveal">
            <summary class="card-body cursor-pointer font-bold">
              {{ t('landing.faq.q3.q') }}
            </summary>
            <div class="px-4 pb-4 text-sm text-muted">
              {{ t('landing.faq.q3.a') }}
            </div>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>
