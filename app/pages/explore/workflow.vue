<script setup>
import { useI18n, useLocalePath, useSeoMeta } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('seo.explore.workflow.title'),
  description: () => t('seo.explore.workflow.description'),
})
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <!-- HERO -->
    <div class="card card-hover card-accent accent-forest overflow-hidden">
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

    <!-- STEPS -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- STEP 1 -->
      <div id="step-1" class="card card-hover bg-surface2 card-accent accent-earth">
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
            <NuxtLink :to="localePath('/studio/projects')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
              {{ t('explore.workflow.steps.one.cta') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- STEP 2 -->
      <div id="step-2" class="card card-hover bg-surface2 card-accent accent-river">
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
            <NuxtLink :to="localePath('/explore/structuring')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:layers-triple" aria-hidden="true" />
              {{ t('explore.common.structuring') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/explore/timeline')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:timeline" aria-hidden="true" />
              {{ t('explore.common.timeline') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- STEP 3 -->
      <div id="step-3" class="card card-hover bg-surface2 card-accent accent-copper">
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
            <NuxtLink :to="localePath('/explore/access')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:shield-lock-outline" aria-hidden="true" />
              {{ t('explore.common.accessRoles') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/explore/studios')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:movie-open" aria-hidden="true" />
              {{ t('explore.common.studios') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM CTA -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden">
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
</style>
