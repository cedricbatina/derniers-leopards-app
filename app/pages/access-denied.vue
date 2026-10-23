<script setup>
definePageMeta({ name: 'access-denied' })

import { computed } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()
const { t } = useI18n()

const reason = computed(() => String(route.query.reason || 'forbidden'))

const title = computed(() =>
  reason.value === 'forbidden'
    ? t('accessDenied.forbidden.title')
    : t('accessDenied.generic.title')
)

const description = computed(() =>
  reason.value === 'forbidden'
    ? t('accessDenied.forbidden.description')
    : t('accessDenied.generic.description')
)

useSeoMeta({
  title: () => `${title.value} · Sonekeno`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <section class="mx-auto max-w-lg space-y-6 py-12 px-4">
    <div class="card border border-border">
      <div class="card-body space-y-4">
        <div class="flex items-start gap-3">
          <Icon
            name="mdi:lock-alert-outline"
            class="size-10 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
          <div class="space-y-2">
            <h1 class="text-xl font-extrabold tracking-tight">
              {{ title }}
            </h1>
            <p class="text-sm text-muted leading-relaxed">
              {{ description }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap pt-2">
          <NuxtLink :to="localePath('/')" class="btn btn-ghost justify-center focus-ring">
            {{ t('accessDenied.home') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/studio/projects')" class="btn btn-primary justify-center focus-ring">
            {{ t('accessDenied.openStudio') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/login')" class="btn btn-ghost justify-center focus-ring">
            {{ t('nav.login') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <p class="text-xs text-muted text-center">
      {{ t('accessDenied.note') }}
    </p>
  </section>
</template>
