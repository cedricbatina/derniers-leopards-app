<template>
  <section class="space-y-6 sm:space-y-10">
    <!-- Hero landing -->
    <div class="card overflow-hidden">
      <div class="card-body">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-3">
            <p class="badge">
              <Icon name="mdi:creation" aria-hidden="true" />
              {{ t('landing.hero.kicker') }}
            </p>

            <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {{ t('landing.hero.title') }}
            </h1>

            <p class="text-muted max-w-2xl">
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
                :to="localePath('/workspace')"
                class="btn btn-primary focus-ring"
              >
                <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
                {{ t('landing.hero.ctaAuthed') }}
              </NuxtLink>
            </div>
          </div>

          <!-- Audience tiles -->
          <div class="grid grid-cols-2 gap-3 w-full sm:w-96">
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
        </div>
      </div>
    </div>

    <!-- Value props -->
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
            <Icon name="mdi:shield-lock-outline" aria-hidden="true" />
            {{ t('landing.value.three.badge') }}
          </div>
          <div class="font-extrabold text-lg">{{ t('landing.value.three.title') }}</div>
          <p class="text-sm text-muted">{{ t('landing.value.three.desc') }}</p>
        </div>
      </div>
    </div>

    <!-- How it works -->
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

          <NuxtLink v-else :to="localePath('/workspace')" class="btn btn-primary focus-ring">
            <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
            {{ t('landing.bottomCta.authed') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n, useLocalePath } from '#imports'
import { useAuthStore } from '~/stores/auth.store'

const { t } = useI18n()
const localePath = useLocalePath()

const auth = useAuthStore()
const isAuthed = computed(() => !!auth.user?.id)
</script>
