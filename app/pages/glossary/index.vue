<template>
  <section class="space-y-6 sm:space-y-8">
    <header class="space-y-2">
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight title-gradient">{{ t('pages.glossary.title') }}</h1>
      <p class="text-muted max-w-2xl">{{ t('pages.glossary.subtitle') }}</p>
    </header>

    <div class="card card-hover card-accent accent-copper overflow-hidden">
      <div class="card-body space-y-4">
        <p class="text-subtle max-w-3xl">{{ t('pages.glossary.public.lead') }}</p>

        <ul class="list-disc ps-5 space-y-1.5 text-sm text-muted max-w-3xl">
          <li>{{ t('pages.glossary.public.b1') }}</li>
          <li>{{ t('pages.glossary.public.b2') }}</li>
          <li>{{ t('pages.glossary.public.b3') }}</li>
        </ul>

        <div class="flex flex-wrap gap-2 pt-1">
          <NuxtLink :to="localePath('/explore/glossary')" class="btn btn-primary focus-ring">
            <Icon name="mdi:compass-outline" aria-hidden="true" />
            {{ t('pages.glossary.public.ctaGuide') }}
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/structuring')" class="btn btn-ghost focus-ring">
            <Icon name="mdi:sitemap-outline" aria-hidden="true" />
            {{ t('pages.glossary.public.ctaStructuring') }}
          </NuxtLink>

          <NuxtLink :to="localePath('/studio')" class="btn btn-ghost focus-ring">
            <Icon name="mdi:draw-pen" aria-hidden="true" />
            {{ t('pages.glossary.public.ctaStudio') }}
          </NuxtLink>

          <NuxtLink :to="localePath('/studio/projects')" class="btn btn-ghost focus-ring">
            <Icon name="mdi:folder-outline" aria-hidden="true" />
            {{ t('pages.glossary.public.ctaProjects') }}
          </NuxtLink>
        </div>

        <p class="text-xs text-muted max-w-2xl">{{ t('pages.glossary.public.studioHint') }}</p>

        <div class="flex flex-wrap gap-2 pt-2 border-t border-border">
          <NuxtLink :to="localePath('/')" class="btn btn-ghost focus-ring">
            <Icon name="mdi:arrow-left" aria-hidden="true" />
            {{ t('common.backHome') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n, useLocalePath, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const canonicalPath = computed(() => localePath('/glossary'))
const baseUrl = computed(() => config.public?.SITE_URL || '')
const canonicalUrl = computed(() => (
  baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value
))
const seoTitle = computed(() => t('pages.glossary.meta.title', { name: t('app.name') }))
const seoDescription = computed(() => t('pages.glossary.meta.description'))
const ogImage = computed(() => (
  baseUrl.value ? new URL('/images/logo-sonekeno.png', baseUrl.value).toString() : '/images/logo-sonekeno.png'
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
</script>
