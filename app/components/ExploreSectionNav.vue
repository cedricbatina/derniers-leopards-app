<script setup>
import { computed } from 'vue'
import { useI18n, useLocalePath } from '#imports'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const guideHomePath = computed(() => localePath('/explore'))

const groups = computed(() => [
  {
    id: 'start',
    label: t('explore.sectionNav.groups.start'),
    links: [
      { to: '/explore/about', icon: 'mdi:information-outline', label: t('explore.sectionNav.links.about') },
      { to: '/explore/workflow', icon: 'mdi:rocket-launch-outline', label: t('explore.sectionNav.links.workflow') },
      { to: '/explore/features', icon: 'mdi:sparkles-outline', label: t('explore.sectionNav.links.features') },
      { to: '/explore/pricing', icon: 'mdi:cash-multiple', label: t('explore.sectionNav.links.pricing') },
    ],
  },
  {
    id: 'roles',
    label: t('explore.sectionNav.groups.roles'),
    links: [
      { to: '/explore/writing', icon: 'mdi:pencil-outline', label: t('explore.sectionNav.links.writing') },
      { to: '/explore/editors', icon: 'mdi:clipboard-check-outline', label: t('explore.sectionNav.links.editors') },
      { to: '/explore/studio', icon: 'mdi:movie-outline', label: t('explore.sectionNav.links.studio') },
      { to: '/explore/creators', icon: 'mdi:palette-outline', label: t('explore.sectionNav.links.creators') },
    ],
  },
  {
    id: 'architecture',
    label: t('explore.sectionNav.groups.architecture'),
    links: [
      { to: '/explore/structuring', icon: 'mdi:layers-triple-outline', label: t('explore.sectionNav.links.structuring') },
      { to: '/explore/access', icon: 'mdi:shield-lock-outline', label: t('explore.sectionNav.links.access') },
    ],
  },
  {
    id: 'universe',
    label: t('explore.sectionNav.groups.universe'),
    links: [
      { to: '/explore/characters', icon: 'mdi:account-group-outline', label: t('nav.characters') },
      { to: '/explore/scenes', icon: 'mdi:movie-open-outline', label: t('nav.scenes') },
      { to: '/explore/timeline', icon: 'mdi:timeline', label: t('nav.timeline') },
      { to: '/explore/glossary', icon: 'mdi:book-open-page-variant-outline', label: t('nav.glossary') },
    ],
  },
])

function resolvedPath(to) {
  return localePath(to)
}

function isActive(to) {
  const p = resolvedPath(to)
  if (!p || !route.path) return false
  if (p === guideHomePath.value) {
    return route.path === p
  }
  return route.path === p || route.path.startsWith(`${p}/`)
}

function overviewActive() {
  const h = guideHomePath.value
  return route.path === h
}
</script>

<template>
  <aside
    class="explore-section-nav rounded-2xl border border-border bg-surface2 shadow-soft px-3 py-4 sm:px-4"
    :aria-label="t('explore.sectionNav.aria')"
  >
    <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-border/60">
      <div class="space-y-1 min-w-0">
        <p class="text-xs font-semibold uppercase tracking-wide text-muted">
          {{ t('explore.sectionNav.kicker') }}
        </p>
        <p class="text-sm text-subtle max-w-md">
          {{ t('explore.sectionNav.lead') }}
        </p>
      </div>
      <NuxtLink
        :to="guideHomePath"
        class="btn btn-sm shrink-0 focus-ring"
        :class="overviewActive() ? 'btn-primary shadow-soft' : 'btn-ghost border border-border'"
      >
        <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
        {{ t('explore.sectionNav.overviewCta') }}
      </NuxtLink>
    </div>

    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      <div
        v-for="g in groups"
        :key="g.id"
        class="rounded-xl border border-border/70 bg-surface px-3 py-2.5"
      >
        <p class="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
          {{ g.label }}
        </p>
        <div class="flex flex-wrap gap-1.5">
          <NuxtLink
            v-for="link in g.links"
            :key="link.to"
            :to="localePath(link.to)"
            class="explore-mini-pill focus-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition"
            :class="isActive(link.to)
              ? 'border-brand bg-brand/12 text-brand'
              : 'border-border hover:border-brand text-text'"
          >
            <Icon :name="link.icon" class="opacity-85" size="14" aria-hidden="true" />
            <span>{{ link.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="mt-3 pt-3 border-t border-border/60 flex flex-wrap gap-3 items-center justify-between text-xs text-muted">
      <p class="flex items-center gap-1.5 m-0">
        <Icon name="mdi:key-variant" aria-hidden="true" />
        {{ t('explore.sectionNav.footerHint') }}
      </p>
      <NuxtLink :to="localePath('/studio')" class="footer-link-strong focus-ring shrink-0">
        {{ t('explore.sectionNav.openStudio') }}
        <Icon name="mdi:chevron-right" aria-hidden="true" />
      </NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
.footer-link-strong {
  color: rgb(var(--brand));
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  text-decoration: none;
}
.footer-link-strong:hover {
  text-decoration: underline;
}
</style>
