<script setup>
import { computed } from 'vue'
import { useI18n, useLocalePath } from '#imports'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const links = computed(() => [
  { to: '/studio', icon: 'mdi:view-dashboard-outline', label: t('studio.workspaceNav.dashboard') },
  { to: '/studio/projects', icon: 'mdi:folder-multiple-outline', label: t('studio.workspaceNav.projects') },
  { to: '/studio/todos', icon: 'mdi:checkbox-marked-outline', label: t('domain.todo.plural') },
  { to: '/explore', icon: 'mdi:compass-outline', label: t('studio.workspaceNav.guide') },
])

function resolved(to) {
  return localePath(to)
}

function isActive(to) {
  const p = resolved(to)
  if (!route.path || !p) return false
  if (to === '/studio') {
    return route.path === p || route.path === `${p}/` // tableau de bord uniquement
  }
  if (to === '/explore') {
    return route.path === p || route.path === `${p}/`
  }
  return route.path === p || route.path.startsWith(`${p}/`)
}
</script>

<template>
  <nav
    class="studio-workspace-nav mb-6 rounded-2xl border border-border bg-surface2 px-3 py-3 sm:px-4"
    :aria-label="t('studio.workspaceNav.aria')"
  >
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div>
        <p class="text-[11px] font-bold uppercase tracking-wider text-muted m-0">
          {{ t('studio.workspaceNav.kicker') }}
        </p>
        <p class="text-sm text-subtle m-0 max-w-xl">
          {{ t('studio.workspaceNav.lead') }}
        </p>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <NuxtLink
        v-for="item in links"
        :key="item.to"
        :to="localePath(item.to)"
        class="pill focus-ring whitespace-nowrap"
        :class="{ 'pill-active': isActive(item.to) }"
      >
        <Icon :name="item.icon" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
