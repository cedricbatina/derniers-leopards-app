<script setup>
import { computed } from 'vue'
import { useI18n, useLocalePath } from '#imports'
import { useAuthStore } from '~/stores/auth.store'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const auth = useAuthStore()
const isAuthed = computed(() => !!auth.user?.id)

// ✅ SEO (i18n)
const siteName = 'Sonekeno'
const canonicalPath = computed(() => localePath('/'))
const baseUrl = useRuntimeConfig().public?.SITE_URL || '' // mets ça dans nuxt.config runtimeConfig.public
const canonicalUrl = computed(() => (baseUrl ? new URL(canonicalPath.value, baseUrl).toString() : canonicalPath.value))

const title = computed(() => t('seo.home.title', { app: siteName }))
const description = computed(() => t('seo.home.description', { app: siteName }))
const ogImage = computed(() => (baseUrl ? new URL('/images/og-home.png', baseUrl).toString() : '/images/og-home.png'))

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
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
  ],
})

// ✅ JSON-LD (Schema.org)
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
  script: [
    { type: 'application/ld+json', children: JSON.stringify(jsonLd.value) },
  ],
})
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <!-- HERO -->
    <div class="card overflow-hidden">
      <div class="card-body">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-4 max-w-2xl">
            <p class="badge">
              <Icon name="mdi:creation" aria-hidden="true" />
              {{ t('landing.hero.kicker') }}
            </p>

            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {{ t('landing.hero.title') }}
            </h1>

            <p class="text-base sm:text-lg text-muted">
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

            <!-- Trust line -->
            <div class="pt-3 text-xs text-muted">
              {{ t('landing.hero.trustLine') }}
            </div>
          </div>

          <!-- Audience + quick highlights -->
          <div class="w-full lg:w-md">
            <div class="grid grid-cols-2 gap-3">
              <div class="card bg-surface2">
                <div class="card-body">
                  <div class="text-xs text-muted">{{ t('landing.tiles.authors.label') }}</div>
                  <div class="text-lg font-extrabold">{{ t('landing.tiles.authors.title') }}</div>
                  <div class="text-xs text-muted mt-1">{{ t('landing.tiles.authors.desc') }}</div>
                </div>
              </div>

              <div class="card bg-surface2">
                <div class="card-body">
                  <div class="text-xs text-muted">{{ t('landing.tiles.editors.label') }}</div>
                  <div class="text-lg font-extrabold">{{ t('landing.tiles.editors.title') }}</div>
                  <div class="text-xs text-muted mt-1">{{ t('landing.tiles.editors.desc') }}</div>
                </div>
              </div>

              <div class="card bg-surface2">
                <div class="card-body">
                  <div class="text-xs text-muted">{{ t('landing.tiles.studios.label') }}</div>
                  <div class="text-lg font-extrabold">{{ t('landing.tiles.studios.title') }}</div>
                  <div class="text-xs text-muted mt-1">{{ t('landing.tiles.studios.desc') }}</div>
                </div>
              </div>

              <div class="card bg-surface2">
                <div class="card-body">
                  <div class="text-xs text-muted">{{ t('landing.tiles.creators.label') }}</div>
                  <div class="text-lg font-extrabold">{{ t('landing.tiles.creators.title') }}</div>
                  <div class="text-xs text-muted mt-1">{{ t('landing.tiles.creators.desc') }}</div>
                </div>
              </div>
            </div>

            <div class="mt-3 card bg-surface2">
              <div class="card-body flex items-center justify-between gap-3">
                <div>
                  <div class="text-xs text-muted">{{ t('landing.micro.kicker') }}</div>
                  <div class="font-extrabold">{{ t('landing.micro.title') }}</div>
                  <div class="text-xs text-muted mt-1">{{ t('landing.micro.desc') }}</div>
                </div>
                <Icon name="mdi:shield-lock-outline" class="text-2xl" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VALUE PROPS -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card">
        <div class="card-body space-y-2">
          <div class="badge">
            <Icon name="mdi:layers-triple" aria-hidden="true" />
            {{ t('landing.value.one.badge') }}
          </div>
          <div class="font-extrabold text-lg">{{ t('landing.value.one.title') }}</div>
          <p class="text-sm text-muted">{{ t('landing.value.one.desc') }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body space-y-2">
          <div class="badge">
            <Icon name="mdi:timeline" aria-hidden="true" />
            {{ t('landing.value.two.badge') }}
          </div>
          <div class="font-extrabold text-lg">{{ t('landing.value.two.title') }}</div>
          <p class="text-sm text-muted">{{ t('landing.value.two.desc') }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body space-y-2">
          <div class="badge">
            <Icon name="mdi:book-open-page-variant" aria-hidden="true" />
            {{ t('landing.value.three.badge') }}
          </div>
          <div class="font-extrabold text-lg">{{ t('landing.value.three.title') }}</div>
          <p class="text-sm text-muted">{{ t('landing.value.three.desc') }}</p>
        </div>
      </div>
    </div>

    <!-- HOW IT WORKS -->
    <div class="card">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-extrabold text-lg">{{ t('landing.how.title') }}</div>
            <div class="text-sm text-muted">{{ t('landing.how.subtitle') }}</div>
          </div>
          <div class="badge">
            <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
            {{ t('landing.how.badge') }}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3 mt-4">
          <div class="card bg-surface2">
            <div class="card-body">
              <div class="text-xs text-muted">{{ t('landing.how.steps.one.kicker') }}</div>
              <div class="font-extrabold">{{ t('landing.how.steps.one.title') }}</div>
              <div class="text-sm text-muted mt-1">{{ t('landing.how.steps.one.desc') }}</div>
            </div>
          </div>

          <div class="card bg-surface2">
            <div class="card-body">
              <div class="text-xs text-muted">{{ t('landing.how.steps.two.kicker') }}</div>
              <div class="font-extrabold">{{ t('landing.how.steps.two.title') }}</div>
              <div class="text-sm text-muted mt-1">{{ t('landing.how.steps.two.desc') }}</div>
            </div>
          </div>

          <div class="card bg-surface2">
            <div class="card-body">
              <div class="text-xs text-muted">{{ t('landing.how.steps.three.kicker') }}</div>
              <div class="font-extrabold">{{ t('landing.how.steps.three.title') }}</div>
              <div class="text-sm text-muted mt-1">{{ t('landing.how.steps.three.desc') }}</div>
            </div>
          </div>
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

    <!-- FAQ (SEO rich results-friendly) -->
    <div class="card">
      <div class="card-body">
        <div class="font-extrabold text-lg">{{ t('landing.faq.title') }}</div>
        <div class="mt-4 grid gap-3">
          <details class="card bg-surface2">
            <summary class="card-body cursor-pointer font-bold">
              {{ t('landing.faq.q1.q') }}
            </summary>
            <div class="px-4 pb-4 text-sm text-muted">
              {{ t('landing.faq.q1.a') }}
            </div>
          </details>

          <details class="card bg-surface2">
            <summary class="card-body cursor-pointer font-bold">
              {{ t('landing.faq.q2.q') }}
            </summary>
            <div class="px-4 pb-4 text-sm text-muted">
              {{ t('landing.faq.q2.a') }}
            </div>
          </details>

          <details class="card bg-surface2">
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
